#!/usr/bin/env python3
"""Kiem tra nhanh file .jtl sau moi lan chay JMeter.

Cach dung:
    python check_jtl.py <file.jtl>            # tom tat theo nhan + percentile
    python check_jtl.py <file.jtl> --spike    # them phan tich 3 giai doan spike
    python check_jtl.py <file.jtl> --errors   # liet ke chi tiet cac sample loi

Muc dich: bat cac loi AM THAM truoc khi dem so lieu di phan tich.
Ba tinh huong nguy hiem nhat ma script nay phat hien:

  1. Ti le loi cao bat thuong o buoc login  -> tai khoan chua seed (loi #8 §3.6)
     hoac tai khoan bi khoa (FR-02).
  2. Thieu nhan  -> If Controller da chan cac buoc sau vi khong trich duoc token.
     File .jtl van "binh thuong" nhung bai test chi do moi endpoint login.
  3. allThreads khong dat muc thiet ke -> JMeter khong kip khoi tao thread,
     con so do duoc phan anh gioi han cua may sinh tai chu khong phai cua SUT.
"""
import csv
import sys
from collections import defaultdict


def pct(sorted_vals, p):
    if not sorted_vals:
        return 0
    k = (len(sorted_vals) - 1) * p / 100.0
    f = int(k)
    c = min(f + 1, len(sorted_vals) - 1)
    if f == c:
        return sorted_vals[f]
    return sorted_vals[f] + (sorted_vals[c] - sorted_vals[f]) * (k - f)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    path = sys.argv[1]
    show_spike = "--spike" in sys.argv
    show_errors = "--errors" in sys.argv

    rows = []
    try:
        with open(path, newline="", encoding="utf-8", errors="replace") as f:
            for r in csv.DictReader(f):
                rows.append(r)
    except FileNotFoundError:
        print("Khong tim thay file: %s" % path)
        return 1

    if not rows:
        print("File rong hoac khong co sample nao: %s" % path)
        print("=> Bai test da khong gui duoc request nao. Kiem tra SUT co dang chay khong.")
        return 1

    # --- tong quan ---------------------------------------------------------
    by_label = defaultdict(list)
    errors = []
    for r in rows:
        ok = r.get("success", "").lower() == "true"
        try:
            el = int(r.get("elapsed", 0))
        except ValueError:
            el = 0
        by_label[r.get("label", "?")].append((el, ok))
        if not ok:
            errors.append(r)

    total = len(rows)
    nerr = len(errors)
    ts = [int(r["timeStamp"]) for r in rows if r.get("timeStamp", "").isdigit()]
    dur = (max(ts) - min(ts)) / 1000.0 if len(ts) > 1 else 0

    print("=" * 78)
    print("KIEM TRA: %s" % path)
    print("=" * 78)
    print("Tong sample : %d" % total)
    print("Thoi luong  : %.0f giay" % dur)
    print("Throughput  : %.1f req/s" % (total / dur if dur else 0))
    print("Loi         : %d (%.2f%%)" % (nerr, 100.0 * nerr / total))
    print()

    # --- theo nhan ---------------------------------------------------------
    print("%-42s %6s %7s %8s %8s %8s" % ("NHAN", "n", "loi%", "p50", "p95", "p99"))
    print("-" * 78)
    for label in sorted(by_label):
        vals = by_label[label]
        el = sorted(v[0] for v in vals)
        e = sum(1 for v in vals if not v[1])
        print(
            "%-42s %6d %6.1f%% %8.0f %8.0f %8.0f"
            % (label[:42], len(vals), 100.0 * e / len(vals),
               pct(el, 50), pct(el, 95), pct(el, 99))
        )
    print()

    # --- canh bao ----------------------------------------------------------
    warn = []

    login = [l for l in by_label if "login" in l.lower()]
    if login:
        lv = by_label[login[0]]
        le = sum(1 for v in lv if not v[1])
        if le / len(lv) > 0.5:
            warn.append(
                "Hon 50% request login THAT BAI. Nguyen nhan thuong gap:\n"
                "     - Tai khoan perf* chua duoc seed vao CSDL\n"
                "       -> chay: python hw5/data/seed_perf_users.py\n"
                "     - Tai khoan dang bi khoa (HTTP 403, FR-02)\n"
                "       -> chay: python hw5/data/seed_perf_users.py --reset"
            )

    if len(by_label) < 6:
        warn.append(
            "Chi thay %d nhan, mong doi 6 (01 login, 02 users/me, 03 my-orders,\n"
            "     04 PUT users/me, 04b GET verify, 05 apply-coupon).\n"
            "     => If Controller da chan cac buoc sau vi khong trich duoc token.\n"
            "     Bai test chi do moi endpoint login ma KHONG bao loi gi."
            % len(by_label)
        )

    if nerr and nerr / total > 0.05:
        warn.append("Ti le loi %.1f%% vuot 5%% - kiem tra --errors truoc khi dung so lieu."
                    % (100.0 * nerr / total))

    if warn:
        print("--- CANH BAO ---")
        for w in warn:
            print("  [!] %s" % w)
        print()

    # --- allThreads --------------------------------------------------------
    if "allThreads" in rows[0]:
        at = [int(r["allThreads"]) for r in rows if r.get("allThreads", "").isdigit()]
        if at:
            print("VU dong thoi: toi da %d" % max(at))
            if show_spike and ts:
                t0 = min(ts)
                print()
                print("--- PHAN TICH 3 GIAI DOAN SPIKE ---")
                phases = [
                    ("GD1 Nen truoc", 0, 120),
                    ("GD2 Spike", 120, 180),
                    ("GD3 Nen sau", 180, 420),
                ]
                base_p95 = None
                for name, a, b in phases:
                    sel = [
                        r for r in rows
                        if r.get("timeStamp", "").isdigit()
                        and a <= (int(r["timeStamp"]) - t0) / 1000.0 < b
                    ]
                    if not sel:
                        print("  %-14s (khong co sample)" % name)
                        continue
                    el = sorted(int(r["elapsed"]) for r in sel)
                    vu = max(
                        (int(r["allThreads"]) for r in sel
                         if r.get("allThreads", "").isdigit()),
                        default=0,
                    )
                    e = sum(1 for r in sel if r.get("success", "").lower() != "true")
                    p95v = pct(el, 95)
                    if name.startswith("GD1"):
                        base_p95 = p95v
                    print(
                        "  %-14s n=%-6d VU_max=%-4d loi=%5.1f%%  p95=%6.0f ms"
                        % (name, len(sel), vu, 100.0 * e / len(sel), p95v)
                    )
                if base_p95:
                    sel3 = [
                        r for r in rows
                        if r.get("timeStamp", "").isdigit()
                        and 180 <= (int(r["timeStamp"]) - t0) / 1000.0 < 420
                    ]
                    if sel3:
                        p3 = pct(sorted(int(r["elapsed"]) for r in sel3), 95)
                        ratio = p3 / base_p95 if base_p95 else 0
                        print()
                        print("  KET LUAN PHUC HOI: p95(GD3)/p95(GD1) = %.2f" % ratio)
                        if ratio < 1.205:  # bien 1.20 + dung sai lam tron
                            print("  => He thong DA PHUC HOI ve muc nen ban dau.")
                        elif ratio < 2.0:
                            print("  => Phuc hoi MOT PHAN. p95 con cao hon nen ban dau")
                            print("     %.0f%%. Xem xu huong theo thoi gian de biet con"
                                  % ((ratio - 1) * 100))
                            print("     dang giam hay da di ngang.")
                        else:
                            print("  => CHUA phuc hoi hoan toan. Nghi ngo: connection pool")
                            print("     chua giai phong, hang doi ton dong, hoac ro ri bo nho.")
            print()

    # --- chi tiet loi ------------------------------------------------------
    if show_errors and errors:
        print("--- CHI TIET LOI (toi da 20) ---")
        seen = defaultdict(int)
        for r in errors:
            key = (r.get("label", "?"), r.get("responseCode", "?"),
                   (r.get("failureMessage") or "")[:70])
            seen[key] += 1
        for (lb, code, msg), n in sorted(seen.items(), key=lambda x: -x[1])[:20]:
            print("  [%4s] x%-5d %s" % (code, n, lb))
            if msg:
                print("         %s" % msg)
        print()

    print("=" * 78)
    if nerr / total > 0.05 or len(by_label) < 6:
        print("KET QUA: CAN XEM LAI truoc khi dung so lieu nay")
        return 1
    print("KET QUA: so lieu dung duoc")
    return 0


if __name__ == "__main__":
    sys.exit(main())
