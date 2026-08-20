# -*- coding: utf-8 -*-
"""
HW06 - Chuyen Markdown -> HTML -> PDF bang Chrome headless.
Chay: python hw6/scripts/md_to_pdf.py
Xuat: PDF ben canh moi file .md nguon.
"""
import os, subprocess, tempfile, time, base64, json, urllib.request
import markdown

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HW6 = os.path.join(ROOT, 'hw6')
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

FILES = [
    ('Main_Report.md', 'Main_Report.pdf'),
    ('AI_Critique.md', 'AI_Critique.pdf'),
    ('[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md',
     '[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.pdf'),
]

CSS = """
@page { size: A4; margin: 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', 'Arial', sans-serif; font-size: 10.5pt; line-height: 1.5;
       color: #1a1a1a; max-width: 100%; }
h1 { font-size: 20pt; color: #12385f; border-bottom: 2px solid #12385f; padding-bottom: 4px; }
h2 { font-size: 15pt; color: #12385f; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; }
h3 { font-size: 12.5pt; color: #1e3a5f; margin-top: 16px; }
h4 { font-size: 11pt; color: #334155; }
code { background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-family: 'Consolas','Courier New',monospace; font-size: 9pt; }
pre { background: #0f172a; color: #e2e8f0; padding: 10px 12px; border-radius: 6px; overflow-x: auto;
      font-family: 'Consolas','Courier New',monospace; font-size: 8.5pt; line-height: 1.4; white-space: pre-wrap; word-break: break-word; }
pre code { background: none; color: inherit; padding: 0; font-size: inherit; }
table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 8.8pt; }
th, td { border: 1px solid #cbd5e1; padding: 4px 7px; text-align: left; vertical-align: top; word-break: break-word; }
th { background: #12385f; color: #fff; }
tr:nth-child(even) td { background: #f6f9fc; }
blockquote { border-left: 4px solid #94a3b8; margin: 8px 0; padding: 4px 12px; background: #f8fafc; color: #334155; }
img { max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 4px; margin: 6px 0; }
a { color: #1d4ed8; word-break: break-all; }
hr { border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }
li { margin: 2px 0; }
"""

def build_html(md_text, base_dir):
    html_body = markdown.markdown(md_text, extensions=[
        'tables', 'fenced_code', 'toc', 'sane_lists', 'attr_list',
        'pymdownx.tilde',            # ~~strikethrough~~
        'pymdownx.betterem',
    ])
    # anh: doi src tuong doi -> file:// tuyet doi de Chrome nhung duoc
    base_url = 'file:///' + base_dir.replace('\\', '/') + '/'
    return ('<!doctype html><html lang="vi"><head><meta charset="utf-8">'
            '<base href="' + base_url + '">'
            '<style>' + CSS + '</style></head><body>' + html_body + '</body></html>')

def main():
    for src, out in FILES:
        sp = os.path.join(HW6, src)
        op = os.path.join(HW6, out)
        if not os.path.exists(sp):
            print('  ! thieu', src); continue
        md_text = open(sp, encoding='utf-8').read()
        html = build_html(md_text, HW6)
        tmp = os.path.join(HW6, '_tmp_' + str(abs(hash(src)) % 99999) + '.html')
        open(tmp, 'w', encoding='utf-8').write(html)
        try:
            subprocess.run([CHROME, '--headless', '--disable-gpu', '--no-pdf-header-footer',
                            '--print-to-pdf=' + op, '--no-margins',
                            'file:///' + tmp.replace('\\', '/')],
                           check=True, timeout=120, capture_output=True)
            kb = os.path.getsize(op) // 1024
            print('  %-52s -> %s (%d KB)' % (src[:52], out, kb))
        finally:
            if os.path.exists(tmp): os.remove(tmp)

if __name__ == '__main__':
    main()
