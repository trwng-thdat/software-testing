#!/usr/bin/env python3
"""Trich so lieu tu .jtl thanh dong bang Markdown de dan vao §3.7 cua bao cao.

Cach dung:
    python summarize_jtl.py <ten_kich_ban> <file.jtl>
    python summarize_jtl.py --all          # quet ca thu muc results/

Moi so lieu deu tinh TRUC TIEP tu .jtl tho, khong chep lai tu HTML report,
dung yeu cau cua de bai muc 11 (chong gian lan bang AI).
"""
import csv
import glob
import os
import sys
from datetime import datetime

# Console Windows mac dinh cp1252, khong in duoc tieng Viet -> ep UTF-8.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def pct(vals, p):
    if not vals:
        return 0
    k = (len(vals) - 1) * p / 100.0
    f = int(k)
    c = min(f + 1, len(vals) - 1)
    if f == c:
        return vals[f]
    return vals[f] + (vals[c] - vals[f]) * (k - f)


def summarize(path):
    rows = []
    with open(path, newline="", encoding="utf-8", errors="replace") as f:
        for r in csv.DictReader(f):
            rows.append(r)
    if not rows:
        return None

    def ints(key):
        """Bo qua dong hong: file .jtl dang duoc JMeter ghi co the cut giua chung."""
        out = []
        for r in rows:
            v = r.get(key)
            if isinstance(v, str) and v.isdigit():
                out.append(int(v))
        return out

    el = sorted(ints("elapsed"))
    ts = ints("timeStamp")
    nerr = sum(1 for r in rows if (r.get("success") or "").lower() != "true")
    dur = (max(ts) - min(ts)) / 1000.0 if len(ts) > 1 else 0
    at = ints("allThreads")
    if not el or not ts:
        return None

    return {
        "start": datetime.fromtimestamp(min(ts) / 1000).strftime("%H:%M:%S"),
        "dur": dur,
        "n": len(rows),
        "errpct": 100.0 * nerr / len(rows),
        "avg": sum(el) / len(el) if el else 0,
        "p90": pct(el, 90),
        "p95": pct(el, 95),
        "p99": pct(el, 99),
        "tps": len(rows) / dur if dur else 0,
        "vumax": max(at) if at else 0,
    }


def row_md(name, s, jtl, rep):
    return (
        "| %s | %s | %.0f s | %d | %.2f | %.0f | %.0f | %.0f | %.0f | %.1f | `%s` | `%s` |"
        % (name, s["start"], s["dur"], s["n"], s["errpct"], s["avg"],
           s["p90"], s["p95"], s["p99"], s["tps"], jtl, rep)
    )


def main():
    if "--all" in sys.argv:
        base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
        print("| Kịch bản | Bắt đầu | Thời lượng | Số sample | Tỉ lệ lỗi % | "
              "TB (ms) | p90 | p95 | p99 | Throughput (req/s) | File log thô | Báo cáo HTML |")
        print("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
        for name, pat, rep in [
            ("Load", "*Load*.jtl", "reports/load/index.html"),
            ("Stress", "*Stress*.jtl", "reports/stress/index.html"),
            ("Spike", "*Spike*.jtl", "reports/spike/index.html"),
            ("Endurance", "*Endurance*.jtl", "reports/endurance/index.html"),
        ]:
            hits = glob.glob(os.path.join(base, "results", pat))
            if not hits:
                continue
            s = summarize(hits[0])
            if s:
                print(row_md(name, s, "results/" + os.path.basename(hits[0]), rep))
        print()
        for name, pat in [("Load", "*Load*.jtl"), ("Stress", "*Stress*.jtl"),
                          ("Spike", "*Spike*.jtl"), ("Endurance", "*Endurance*.jtl")]:
            hits = glob.glob(os.path.join(base, "results", pat))
            if hits:
                s = summarize(hits[0])
                if s:
                    print("%-10s VU thuc te dat toi da: %d" % (name, s["vumax"]))
        return 0

    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    s = summarize(sys.argv[2])
    if not s:
        print("File rong")
        return 1
    print(row_md(sys.argv[1], s, sys.argv[2], "-"))
    print("VU thuc te dat toi da: %d" % s["vumax"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
