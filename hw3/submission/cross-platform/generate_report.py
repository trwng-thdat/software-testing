#!/usr/bin/env python3
"""Build the Task 3 deliverables (CSV matrix + Markdown report) from results.json."""

import csv
import json
import os
import sys
from collections import defaultdict

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
RESULTS = os.path.join(HERE, "results.json")
CSV_OUT = os.path.join(HERE, "CrossPlatform_Matrix.csv")

with open(RESULTS, encoding="utf-8") as f:
    data = json.load(f)

rows = data["results"]
plats = list(data["platforms"])
pnames = {k: v["name"] for k, v in data["platforms"].items()}

by_case = defaultdict(dict)
meta = {}
for r in rows:
    by_case[r["case_id"]][r["platform"]] = r
    meta[r["case_id"]] = (r["screen"], r["category"], r["check"])

case_ids = sorted(by_case)

# ---------------------------------------------------------------- CSV matrix
with open(CSV_OUT, "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f)
    w.writerow(
        ["Case ID", "Screen", "Category", "Check"]
        + [f"{p} ({pnames[p]})" for p in plats]
        + ["Verdict", "Divergent?", "Notes", "Screenshots"]
    )
    for cid in case_ids:
        sc, cat, chk = meta[cid]
        sts = [by_case[cid].get(p, {}).get("status", "-") for p in plats]
        real = {s for s in sts if s in ("PASS", "FAIL")}
        divergent = "YES" if len(real) > 1 else "no"
        verdict = "FAIL" if "FAIL" in sts else ("PASS" if "PASS" in sts else "N/A")
        notes = " || ".join(
            f"{p}: {by_case[cid][p]['note']}" for p in plats if p in by_case[cid]
        )
        shots = " ".join(
            by_case[cid][p]["screenshot"]
            for p in plats
            if by_case[cid].get(p, {}).get("screenshot")
        )
        w.writerow([cid, sc, cat, chk] + sts + [verdict, divergent, notes, shots])

# ------------------------------------------------------------------ Summary
print(f"CSV  → {CSV_OUT}")
tot = len(case_ids)
div = sum(
    1
    for c in case_ids
    if len({by_case[c][p]["status"] for p in by_case[c]
            if by_case[c][p]["status"] in ("PASS", "FAIL")}) > 1
)
print(f"cases={tot}  executions={len(rows)}  divergent={div}")
for p in plats:
    rs = [r for r in rows if r["platform"] == p]
    print(
        f"  {p}: PASS={sum(1 for r in rs if r['status']=='PASS')} "
        f"FAIL={sum(1 for r in rs if r['status']=='FAIL')} "
        f"N/A={sum(1 for r in rs if r['status']=='N/A')}"
    )
