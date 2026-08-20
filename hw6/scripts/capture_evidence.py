# -*- coding: utf-8 -*-
"""
HW06 - Chup anh bang chung TU DONG bang Selenium.

Chi chup duoc nhung gi la TRANG WEB. Cac thu la app desktop (Postman) hoac
terminal thi Selenium khong voi tay tới duoc - danh sach viec phai chup tay
nam o hw6/evidence/README.md.

Chay: python hw6/scripts/capture_evidence.py
Xuat: hw6/evidence/*.png
"""
import os
import time
import glob
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HW6 = os.path.join(ROOT, 'hw6')
REPORTS = os.path.join(HW6, 'reports')
OUT = os.path.join(HW6, 'evidence')
os.makedirs(OUT, exist_ok=True)


def driver():
    o = Options()
    o.add_argument('--headless=new')
    o.add_argument('--window-size=1600,1200')
    o.add_argument('--force-device-scale-factor=1')
    o.add_argument('--hide-scrollbars')
    return webdriver.Chrome(options=o)


def full_page_png(d, url, out, wait=2.0, max_height=20000):
    """Chup toan trang: gian cua so bang chieu cao that cua tai lieu."""
    d.get(url)
    time.sleep(wait)
    h = d.execute_script('return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);')
    h = min(int(h) + 120, max_height)
    d.set_window_size(1600, h)
    time.sleep(0.6)
    d.save_screenshot(out)
    print('  {:<44} {:>6} KB  (cao {} px)'.format(os.path.basename(out), os.path.getsize(out) // 1024, h))


def viewport_png(d, url, out, wait=2.0, size=(1600, 1100)):
    """Chup dung mot khung nhin - dung cho anh can doc duoc chu."""
    d.get(url)
    time.sleep(wait)
    d.set_window_size(*size)
    time.sleep(0.4)
    d.save_screenshot(out)
    print('  {:<44} {:>6} KB'.format(os.path.basename(out), os.path.getsize(out) // 1024))


def file_url(p):
    return 'file:///' + p.replace('\\', '/')


# ---------------------------------------------------------------- bao cao Newman
REPORT_SHOTS = [
    ('api1.html', 'newman_api1', 'API 1 - 46 TC, 224 assertion, 0 fail'),
    ('api2.html', 'newman_api2', 'API 2 - 46 TC, 239 assertion, 0 fail'),
    ('api3.html', 'newman_api3', 'API 3 - 85 TC, 557 assertion, 0 fail'),
    ('spec_bugs.html', 'newman_spec_bugs', 'SPEC - 22 assertion FAIL (co chu dich)'),
    ('data_api1_phone.html', 'newman_data_api1', 'Data-driven phone - 6 iteration'),
    ('data_api2_state.html', 'newman_data_api2', 'Data-driven chuyen trang thai - 6 iteration'),
    ('data_api3_coupon.html', 'newman_data_api3', 'Data-driven coupon - 6 iteration'),
]


def open_tab(d, pill):
    """Mo mot tab cua bao cao htmlextra: pills-summary / pills-requests / pills-failed."""
    d.execute_script("""
        var pill = arguments[0];
        var a = document.querySelector('a[href="#' + pill + '"]');
        if (a) { a.click(); }
        document.querySelectorAll('.tab-pane').forEach(function (p) {
            p.classList.remove('active');
            p.classList.remove('show');
        });
        var t = document.getElementById(pill);
        if (t) { t.classList.add('active'); t.classList.add('show'); }
    """, pill)
    time.sleep(0.8)


def expand_all(d):
    """Bam 2 nut Expand Folders / Expand Requests cua htmlextra de bung het noi dung.

    Can bung moi thay duoc URL day du (http://localhost:3000/...) cua tung request -
    day chinh la bang chung hostname ma de bai §11 doi.
    """
    d.execute_script("""
        var btns = Array.prototype.slice.call(document.querySelectorAll('button, a'));
        ['Expand Folders', 'Expand Requests'].forEach(function (label) {
            btns.filter(function (b) { return (b.textContent || '').trim() === label; })
                .forEach(function (b) { b.click(); });
        });
        document.querySelectorAll('.collapse').forEach(function (c) { c.classList.add('show'); });
    """)
    time.sleep(1.2)


def shoot_tab(d, path, pill, out, wait=2.0, expand=True, cap=14000):
    """Mo trang, chuyen tab, bung het accordion, roi chup toan trang."""
    d.get(file_url(path))
    time.sleep(wait)
    open_tab(d, pill)
    if expand:
        expand_all(d)
    h = d.execute_script('return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);')
    h = min(int(h) + 120, cap)
    d.set_window_size(1600, h)
    time.sleep(1.0)
    d.save_screenshot(out)
    print('  {:<44} {:>6} KB  (cao {} px)'.format(os.path.basename(out), os.path.getsize(out) // 1024, h))


def shoot_tab_viewport(d, path, pill, out, scroll_to_text, wait=2.0):
    """Chup dung mot khung nhin, canh vao phan tu chua doan chu chi dinh.

    Dung cho anh can DOC DUOC chu (URL day du cua request) chu khong phai anh toan trang
    bi thu nho.
    """
    d.get(file_url(path))
    time.sleep(wait)
    open_tab(d, pill)
    expand_all(d)
    d.set_window_size(1600, 1100)
    time.sleep(0.5)
    # Chi tim TRONG tab dang mo, va uu tien o bang (td/th) co dung noi dung can tim.
    # Neu tim ca trang thi se dinh vao phan mo ta collection o dau trang - da gap that.
    d.execute_script("""
        var needle = arguments[0];
        var pane = document.getElementById(arguments[1]) || document;
        var cells = Array.prototype.slice.call(pane.querySelectorAll('td, th, code, a'));
        var el = cells.filter(function (e) { return (e.textContent || '').trim() === needle; })[0];
        if (!el) {
            el = cells.filter(function (e) { return (e.textContent || '').indexOf(needle) >= 0; })[0];
        }
        if (el) { el.scrollIntoView({ block: 'center' }); window.scrollBy(0, -260); }
        return el ? el.tagName + ':' + (el.textContent || '').trim().slice(0, 40) : 'KHONG TIM THAY';
    """, scroll_to_text, pill)
    time.sleep(0.6)
    d.save_screenshot(out)
    print('  {:<44} {:>6} KB  (canh vao "{}")'.format(os.path.basename(out), os.path.getsize(out) // 1024, scroll_to_text))


def shoot_reports(d):
    print('\n[1] Bao cao HTML cua Newman (htmlextra)')
    for fname, out, _desc in REPORT_SHOTS:
        p = os.path.join(REPORTS, fname)
        if not os.path.exists(p):
            print('  ! thieu', fname)
            continue
        # anh 1: tab Summary - so assertion, so fail, ten environment
        viewport_png(d, file_url(p), os.path.join(OUT, out + '_summary.png'))
        # anh 2: tab Total Requests, doc duoc chu - thay hostname http://localhost:3000
        shoot_tab_viewport(d, p, 'pills-requests', os.path.join(OUT, out + '_hostname.png'), 'localhost:3000')
        # anh 3: canh vao bang REQUEST HEADERS de thay header X-Student-Id di kem request
        shoot_tab_viewport(d, p, 'pills-requests', os.path.join(OUT, out + '_xstudentid_header.png'), 'X-Student-Id')
        # anh 4: tab Failed Tests - chi co y nghia voi folder SPEC
        if 'spec' in out:
            shoot_tab(d, p, 'pills-failed', os.path.join(OUT, out + '_failed.png'))


# ---------------------------------------------------------------- log console
def build_console_page():
    """Dung mot trang HTML tu log console cua Newman de chup duoc bang Selenium.

    LUU Y TRUNG THUC: day KHONG thay the duoc anh chup terminal that ma de bai
    §11 doi. No chi de doc log cho de va de dinh kem; anh terminal va anh
    Postman Console van phai tu chup.
    """
    log = os.path.join(REPORTS, 'newman_console_full.log')
    if not os.path.exists(log):
        return None
    with open(log, encoding='utf-8', errors='replace') as f:
        lines = f.read().split('\n')

    # lay cac doan co [X-Student-Id] kem ngu canh
    keep, seen = [], 0
    for i, ln in enumerate(lines):
        if 'X-Student-Id' in ln and seen < 40:
            keep.extend(lines[max(0, i - 2):i + 3])
            keep.append('')
            seen += 1
    body = '\n'.join(keep)
    # bo ma mau ANSI
    import re
    body = re.sub(r'\x1b\[[0-9;]*m', '', body)
    body = body.replace('&', '&amp;').replace('<', '&lt;')

    html = os.path.join(OUT, '_console_extract.html')
    with open(html, 'w', encoding='utf-8') as f:
        f.write('''<!doctype html><meta charset="utf-8">
<style>
 body{background:#0c0c0c;color:#ccc;font:13px/1.5 Consolas,monospace;margin:0;padding:18px}
 h1{color:#4ec9b0;font-size:15px;margin:0 0 4px}
 .n{color:#888;font-size:12px;margin:0 0 14px}
 pre{margin:0;white-space:pre-wrap}
 mark{background:#264f78;color:#fff;padding:0 2px}
</style>
<h1>HW06 - trich log console Newman: header X-Student-Id</h1>
<p class="n">Nguon: hw6/reports/newman_console_full.log (3974 dong, 470 dong [X-Student-Id]).
Trich 40 dong dau kem ngu canh. Day la file log, KHONG thay the anh chup terminal that.</p>
<pre>''' + body + '</pre>')
    return html


def shoot_console(d):
    print('\n[2] Trich log console X-Student-Id (tu file log, khong phai anh terminal)')
    p = build_console_page()
    if not p:
        print('  ! thieu newman_console_full.log')
        return
    full_page_png(d, file_url(p), os.path.join(OUT, 'console_xstudentid_extract.png'), wait=1.0)


# ---------------------------------------------------------------- SUT dang chay
def shoot_sut(d):
    print('\n[3] SUT dang chay (chung minh hostname localhost)')
    try:
        viewport_png(d, 'http://localhost:3000/api/products', os.path.join(OUT, 'sut_localhost_products.png'), wait=1.5, size=(1400, 800))
    except Exception as e:
        print('  ! khong chup duoc:', e)


def main():
    d = driver()
    try:
        shoot_reports(d)
        shoot_console(d)
        shoot_sut(d)
    finally:
        d.quit()
    pngs = sorted(glob.glob(os.path.join(OUT, '*.png')))
    print('\nTong: {} anh trong hw6/evidence/'.format(len(pngs)))


if __name__ == '__main__':
    main()
