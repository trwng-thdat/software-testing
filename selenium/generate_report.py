"""
Generate a Mocha-style HTML/Markdown test report from results/results.json
(the output of run_checklist.py), and print a copy-paste-ready Markdown table
matching the layout used in hw3/Main_Report.md.

Usage:
    python generate_report.py
    python generate_report.py --results results/results.json --out report
"""

import argparse
import html
import json
import os
from collections import OrderedDict

STATUS_ORDER = ["FAIL", "ERROR", "PASS", "MANUAL", "N/A"]
STATUS_COLOR = {
    "PASS": "#2e7d32",
    "FAIL": "#c62828",
    "MANUAL": "#f9a825",
    "N/A": "#757575",
    "ERROR": "#6a1b9a",
}


def load_results(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def group_by_screen_ia(rows):
    grouped = OrderedDict()
    for row in rows:
        key = (row["screen"], row["ia"])
        grouped.setdefault(key, []).append(row)
    return grouped


def render_html(rows, out_path):
    total = len(rows)
    counts = {}
    for row in rows:
        counts[row["result"]] = counts.get(row["result"], 0) + 1

    grouped = group_by_screen_ia(rows)

    def esc(s):
        return html.escape(str(s), quote=True)

    parts = []
    parts.append("<!doctype html><html lang='vi'><head><meta charset='utf-8'>")
    parts.append("<title>EShop GUI Checklist Report - HW03 Task 1</title>")
    parts.append(
        "<style>"
        "body{font-family:-apple-system,Segoe UI,Arial,sans-serif;margin:0;padding:24px;"
        "background:#0b0d12;color:#e6e6e6;}"
        "h1{font-size:22px;} h2{font-size:17px;margin-top:32px;border-bottom:1px solid #333;padding-bottom:6px;}"
        ".summary{display:flex;gap:16px;margin:16px 0 28px;flex-wrap:wrap;}"
        ".stat{padding:10px 16px;border-radius:8px;background:#161a22;min-width:90px;text-align:center;}"
        ".stat b{display:block;font-size:22px;}"
        "table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:13px;}"
        "th,td{border:1px solid #2a2f3a;padding:6px 8px;text-align:left;vertical-align:top;}"
        "th{background:#161a22;position:sticky;top:0;}"
        "tr:nth-child(even){background:#11141b;}"
        ".badge{display:inline-block;padding:2px 8px;border-radius:10px;color:#0b0d12;font-weight:600;font-size:12px;}"
        ".notes{max-width:520px;}"
        "a{color:#7cb7ff;}"
        "</style></head><body>"
    )
    parts.append("<h1>EShop GUI Checklist Report — HW03 Task 1 (Product List/Home + Login)</h1>")
    parts.append("<div class='summary'>")
    parts.append(f"<div class='stat'><b>{total}</b>Total</div>")
    for status in STATUS_ORDER:
        if status in counts:
            parts.append(
                f"<div class='stat' style='border-left:4px solid {STATUS_COLOR[status]}'>"
                f"<b>{counts[status]}</b>{status}</div>"
            )
    parts.append("</div>")

    for (screen, ia), items in grouped.items():
        parts.append(f"<h2>{esc(screen.upper())} — {esc(ia)}</h2>")
        parts.append(
            "<table><tr><th>ID</th><th>Expected</th><th>Result</th>"
            "<th class='notes'>Notes</th><th>Screenshot</th></tr>"
        )
        for row in items:
            color = STATUS_COLOR.get(row["result"], "#555")
            shot = row.get("screenshot") or ""
            shot_name = os.path.basename(shot) if shot else ""
            shot_cell = (
                f"<a href='screenshots/{esc(shot_name)}' target='_blank'>{esc(shot_name)}</a>"
                if shot_name
                else "-"
            )
            parts.append(
                "<tr>"
                f"<td><code>{esc(row['id'])}</code></td>"
                f"<td>{esc(row['expected'])}</td>"
                f"<td><span class='badge' style='background:{color}'>{esc(row['result'])}</span></td>"
                f"<td class='notes'>{esc(row['notes'])}</td>"
                f"<td>{shot_cell}</td>"
                "</tr>"
            )
        parts.append("</table>")

    parts.append("</body></html>")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("".join(parts))


def render_markdown_summary(rows, out_path):
    total = len(rows)
    counts = {}
    for row in rows:
        counts[row["result"]] = counts.get(row["result"], 0) + 1
    grouped = group_by_screen_ia(rows)

    lines = []
    lines.append("# EShop GUI Checklist — Execution Report (HW03 Task 1)\n")
    lines.append(f"Tổng số item: **{total}**\n")
    lines.append("| Kết quả | Số lượng |")
    lines.append("| --- | --- |")
    for status in STATUS_ORDER:
        if status in counts:
            lines.append(f"| {status} | {counts[status]} |")
    lines.append("")

    for (screen, ia), items in grouped.items():
        lines.append(f"## {screen.upper()} — {ia}\n")
        lines.append("| ID | Expected | Result | Notes |")
        lines.append("| --- | --- | --- | --- |")
        for row in items:
            notes = row["notes"].replace("|", "\\|").replace("\n", " ")
            expected = row["expected"].replace("|", "\\|")
            lines.append(f"| {row['id']} | {expected} | {row['result']} | {notes} |")
        lines.append("")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main():
    parser = argparse.ArgumentParser(description="Generate HTML/Markdown report from run_checklist.py results")
    parser.add_argument("--results", default="results/results.json")
    parser.add_argument("--out", default="report")
    args = parser.parse_args()

    here = os.path.dirname(os.path.abspath(__file__))
    results_path = os.path.join(here, args.results)
    out_dir = os.path.join(here, args.out)

    rows = load_results(results_path)

    html_path = os.path.join(out_dir, "index.html")
    md_path = os.path.join(out_dir, "report.md")
    render_html(rows, html_path)
    render_markdown_summary(rows, md_path)

    print(f"HTML report: {html_path}")
    print(f"Markdown report: {md_path}")


if __name__ == "__main__":
    main()
