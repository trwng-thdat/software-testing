#!/usr/bin/env python3
"""Kiem tra file .jmx: ca cu phap XML lan ngu nghia JMeter.

Cach dung:
    python validate_jmx.py <file.jmx> [--csv-rows N] [--think-time SEC]

Kiem tra cu phap:
  - XML hop le
  - Moi phan tu deu co <hashTree> di lien sau (JMeter am tham bo phan tu neu sai)

Kiem tra ngu nghia (bon loi trong references/jmeter-pitfalls.md):
  1. recycle=false + loops=-1  -> thread chet som khi het du lieu CSV
  2. Timer dat ngang hang sampler -> think time bi nhan len
  3. Gia tri mac dinh cua extractor la so hop le -> che giau loi
  4. Kich ban nhieu giai doan -> phai cong don nhu cau CSV

Exit code: 0 = khong loi nghiem trong, 1 = co loi can sua.
"""
import sys
import xml.etree.ElementTree as ET

ERRORS = []
WARNINGS = []
INFO = []


def check_hashtree(node, path="root"):
    """Moi phan tu phai co dung mot hashTree di lien sau no."""
    kids = list(node)
    i = 0
    while i < len(kids):
        el = kids[i]
        if el.tag == "hashTree":
            i += 1
            continue
        if i + 1 >= len(kids) or kids[i + 1].tag != "hashTree":
            name = el.get("testname", el.tag)
            ERRORS.append("Cau truc: '%s' (%s) khong co hashTree di lien sau - JMeter se bo qua phan tu nay" % (name, path))
            i += 1
        else:
            check_hashtree(kids[i + 1], el.get("testname", el.tag))
            i += 2


def check_csv_exhaustion(root, csv_rows, think_time):
    """Loi 1 + 4: het du lieu CSV lam thread chet som."""
    # LoopController nam trong elementProp cua ThreadGroup, khong phai element truc tiep,
    # nen phai tim theo thuoc tinh testclass thay vi theo tag.
    infinite = False
    for el in root.iter():
        if el.get("testclass") == "LoopController" or el.tag == "LoopController":
            loops = el.find("intProp[@name='LoopController.loops']")
            if loops is not None and loops.text == "-1":
                infinite = True
            cf = el.find("boolProp[@name='LoopController.continue_forever']")
            if cf is not None and cf.text == "true":
                infinite = True

    risky = []
    for csv in root.iter("CSVDataSet"):
        fn = csv.find("stringProp[@name='filename']")
        rec = csv.find("boolProp[@name='recycle']")
        stop = csv.find("boolProp[@name='stopThread']")
        if rec is not None and rec.text == "false":
            risky.append((fn.text if fn is not None else "?",
                          stop.text if stop is not None else "?"))

    if infinite and risky:
        for fn, stop in risky:
            if stop == "true":
                ERRORS.append(
                    "Loi 1: '%s' dat recycle=false + stopThread=true trong khi loops=-1 (lap vo han). "
                    "File CSV se can sau N vong lap tinh tren TOAN BO thread, roi moi thread bi giet. "
                    "Sua: dat recycle=true + stopThread=false, HOAC dat loops la so huu han." % fn)
            else:
                WARNINGS.append("Loi 1: '%s' dat recycle=false voi loops=-1; thread se dung khi het du lieu." % fn)

    # uoc tinh nhu cau neu nguoi dung cung cap so lieu
    if csv_rows and think_time:
        total_vu = 0
        max_dur = 0
        for tg in root.iter("ThreadGroup"):
            t = tg.find("stringProp[@name='ThreadGroup.num_threads']")
            d = tg.find("stringProp[@name='ThreadGroup.duration']")
            dl = tg.find("stringProp[@name='ThreadGroup.delay']")
            try:
                total_vu += int(t.text)
            except (ValueError, AttributeError):
                pass  # bien ${...}, khong tinh duoc
            try:
                end = int(d.text) + int(dl.text if dl is not None else 0)
                max_dur = max(max_dur, end)
            except (ValueError, AttributeError):
                pass
        if total_vu and max_dur:
            iters = total_vu * (max_dur / think_time)
            INFO.append("Uoc tinh tong vong lap: ~%.0f (=%d VU x %.0f vong/VU)" % (iters, total_vu, max_dur / think_time))
            if iters > csv_rows:
                WARNINGS.append(
                    "Loi 4: uoc tinh can ~%.0f vong lap nhung CSV chi co %d dong. "
                    "Chi an toan neu recycle=true." % (iters, csv_rows))


def check_timer_scope(root):
    """Loi 2: timer ngang hang voi sampler -> ap dung cho MOI sampler trong scope."""
    for ht in root.iter("hashTree"):
        kids = list(ht)
        timers = sum(1 for k in kids if k.tag.endswith("Timer"))
        samplers = sum(1 for k in kids if k.tag == "HTTPSamplerProxy")
        if timers > 1 and samplers > 1:
            ERRORS.append(
                "Loi 2: tim thay %d timer dat NGANG HANG voi %d sampler trong cung mot scope. "
                "JMeter ap dung MOI timer cho MOI sampler, nen think time bi nhan len ~%dx. "
                "Sua: long timer vao ben trong hashTree cua sampler tuong ung."
                % (timers, samplers, timers))


def check_extractor_defaults(root):
    """Loi 3: gia tri mac dinh la so hop le se che giau loi."""
    for jp in root.iter("JSONPostProcessor"):
        name = jp.find("stringProp[@name='JSONPostProcessor.referenceNames']")
        dv = jp.find("stringProp[@name='JSONPostProcessor.defaultValues']")
        if dv is None or dv.text is None:
            WARNINGS.append("Extractor '%s' khong co gia tri mac dinh." % (name.text if name is not None else "?"))
            continue
        val = dv.text.strip()
        if val.isdigit() or val == "":
            ERRORS.append(
                "Loi 3: extractor '%s' co gia tri mac dinh '%s' - day la gia tri HOP LE ve kieu, "
                "nen khi extract that bai request van duoc gui di voi du lieu sai va assertion van pass. "
                "Sua: dung chuoi ro rang sai nhu '%s_NOT_FOUND'."
                % (name.text if name is not None else "?", val,
                   (name.text or "VALUE").upper()))


def check_listeners(root):
    """HW05 yeu cau ba test plan dung ba listener khac nhau."""
    gs = [rc.get("guiclass") for rc in root.iter("ResultCollector")]
    if gs:
        INFO.append("Listener: %s" % ", ".join(gs))
    if len(gs) > 1 and len(set(gs)) == 1:
        WARNINGS.append("Co %d listener nhung cung mot loai." % len(gs))


def check_assertions(root):
    """Moi sampler nen co it nhat 2 assertion: status code + noi dung body."""
    n_sampler = len(list(root.iter("HTTPSamplerProxy")))
    n_resp = len(list(root.iter("ResponseAssertion")))
    n_json = len(list(root.iter("JSONPathAssertion")))
    INFO.append("Sampler: %d | ResponseAssertion: %d | JSONPathAssertion: %d" % (n_sampler, n_resp, n_json))
    if n_sampler and n_resp < n_sampler:
        WARNINGS.append("Chi co %d ResponseAssertion cho %d sampler - co sampler chua kiem tra status code." % (n_resp, n_sampler))
    if n_json == 0 and n_sampler:
        WARNINGS.append("Khong co JSONPathAssertion nao - chi kiem status code la khong du, "
                        "server co the tra 200 kem khung loi.")


def check_thread_counts(root):
    """threadCounts=true la cach duy nhat xac nhan so VU that su dat duoc."""
    for rc in root.iter("ResultCollector"):
        tc = rc.find(".//threadCounts")
        if tc is None or tc.text != "true":
            WARNINGS.append("Listener '%s' khong bat threadCounts - se khong xac nhan duoc so VU that su dat duoc trong .jtl."
                            % rc.get("testname", "?"))


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    path = sys.argv[1]
    csv_rows = None
    think_time = None
    for i, a in enumerate(sys.argv):
        if a == "--csv-rows" and i + 1 < len(sys.argv):
            csv_rows = int(sys.argv[i + 1])
        if a == "--think-time" and i + 1 < len(sys.argv):
            think_time = float(sys.argv[i + 1])

    try:
        tree = ET.parse(path)
    except ET.ParseError as e:
        print("XML KHONG HOP LE: %s" % e)
        return 1

    root = tree.getroot()
    print("=" * 68)
    print("KIEM TRA: %s" % path)
    print("=" * 68)

    check_hashtree(root)
    check_csv_exhaustion(root, csv_rows, think_time)
    check_timer_scope(root)
    check_extractor_defaults(root)
    check_listeners(root)
    check_assertions(root)
    check_thread_counts(root)

    def dedupe(msgs):
        """Kich ban nhieu thread group lap lai cung mot loi N lan - gop lai cho de doc."""
        seen = {}
        for m in msgs:
            seen[m] = seen.get(m, 0) + 1
        return [(m, n) for m, n in seen.items()]

    if INFO:
        print("\n--- THONG TIN ---")
        for m in INFO:
            print("  %s" % m)

    uniq_err = dedupe(ERRORS)
    uniq_warn = dedupe(WARNINGS)

    if uniq_err:
        print("\n--- LOI NGHIEM TRONG (%d loai, %d lan) ---" % (len(uniq_err), len(ERRORS)))
        for m, n in uniq_err:
            suffix = "  (lap lai %d lan)" % n if n > 1 else ""
            print("  [X] %s%s" % (m, suffix))

    if uniq_warn:
        print("\n--- CANH BAO (%d loai, %d lan) ---" % (len(uniq_warn), len(WARNINGS)))
        for m, n in uniq_warn:
            suffix = "  (lap lai %d lan)" % n if n > 1 else ""
            print("  [!] %s%s" % (m, suffix))

    print("\n" + "=" * 68)
    if ERRORS:
        print("KET QUA: CO %d LOAI LOI CAN SUA" % len(uniq_err))
    elif WARNINGS:
        print("KET QUA: khong co loi nghiem trong, %d canh bao can xem lai" % len(WARNINGS))
    else:
        print("KET QUA: cau truc va ngu nghia deu dat")

    print("""
LUU Y: script nay CHI kiem tra file. No KHONG the xac nhan:
  - File mo duoc bang JMeter that
  - JSON Path co khop response that cua SUT
  - Tham so tai co phu hop phan cung
Phai chay thu 1 VU tren SUT that de xac nhan ba dieu tren.""")
    print("=" * 68)

    return 1 if ERRORS else 0


if __name__ == "__main__":
    sys.exit(main())
