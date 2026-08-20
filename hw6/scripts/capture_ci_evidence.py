# -*- coding: utf-8 -*-
"""
HW06 - Chup anh hai lan chay CI/CD tren GitHub Actions bang Selenium.

Repo cong khai nen khong can dang nhap. Chup:
  1. Trang danh sach Actions - thay CA HAI lan chay canh nhau, mot xanh mot do
  2. Trang tung lan chay - thay commit, ket qua tung job
  3. Step Summary - bang so lieu (run xanh) va bang assertion that bai (run do)
  4. Trang log cua job spec-gate - thay tung dong AssertionError

Chay: python hw6/scripts/capture_ci_evidence.py
Xuat: hw6/evidence/ci_*.png
"""
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

REPO = 'trwng-thdat/software-testing'
BRANCH = 'hw6/api-testing'
WORKFLOW = 'hw6-api-tests.yml'

# Hai lan chay mau ma de bai §6 doi hoi
RUN_PASS = {'id': '32347245797', 'sha': '5d43840', 'label': 'pass', 'job': '96358457283'}
RUN_FAIL = {'id': '32347386625', 'sha': '06524ea', 'label': 'fail', 'job': '96359055611'}

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'hw6', 'evidence')
os.makedirs(OUT, exist_ok=True)


def driver():
    o = Options()
    o.add_argument('--headless=new')
    o.add_argument('--window-size=1600,1200')
    o.add_argument('--force-device-scale-factor=1')
    o.add_argument('--hide-scrollbars')
    o.add_argument('--lang=en-US')
    return webdriver.Chrome(options=o)


def dismiss_banners(d):
    """Go banner cookie / dang nhap cua GitHub de anh khong bi che."""
    d.execute_script("""
        var sels = ['.js-cookie-consent-banner', '.js-notice', 'dialog[open]',
                    '.Popover', '.js-header-signup-prompt', '.signup-prompt-bg'];
        sels.forEach(function (s) {
            document.querySelectorAll(s).forEach(function (e) { e.remove(); });
        });
    """)
    time.sleep(0.3)


def shot(d, url, out, wait=4.0, full=False, cap=16000, scroll_to=None):
    d.get(url)
    time.sleep(wait)
    dismiss_banners(d)
    if scroll_to:
        found = d.execute_script("""
            var needle = arguments[0];
            var el = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,td,th,summary,a,span,code'))
                .filter(function (e) { return (e.textContent || '').indexOf(needle) >= 0; })[0];
            if (el) { el.scrollIntoView({ block: 'center' }); window.scrollBy(0, -200); return true; }
            return false;
        """, scroll_to)
        if not found:
            print('    (khong tim thay "{}" tren trang)'.format(scroll_to))
        time.sleep(1.0)
    if full:
        h = d.execute_script('return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);')
        d.set_window_size(1600, min(int(h) + 120, cap))
        time.sleep(1.0)
    d.save_screenshot(out)
    print('  {:<36} {:>6} KB'.format(os.path.basename(out), os.path.getsize(out) // 1024))


def render_log_page(log_path, title, note, out_html, keep_pattern=None, max_lines=90):
    """Render log CI thanh mot trang HTML de Selenium chup duoc.

    Vi sao can: trang log cua GitHub Actions doi DANG NHAP moi xem duoc (nut
    "Sign in to view logs"), nen Selenium chay an danh khong doc duoc noi dung log.
    Log duoi day lay bang `gh run view --job <id> --log` roi render lai - noi dung y het.
    """
    import re
    if not os.path.exists(log_path):
        print('    (thieu {})'.format(log_path))
        return None
    with open(log_path, encoding='utf-8', errors='replace') as f:
        lines = f.read().split('\n')
    if keep_pattern:
        rx = re.compile(keep_pattern)
        lines = [l for l in lines if rx.search(l)]
    lines = lines[:max_lines]
    clean = []
    for l in lines:
        body = l.split('\t')[-1]
        body = re.sub(r'^﻿?\d{4}-\d{2}-\d{2}T[\d:.]+Z\s?', '', body)
        body = re.sub(r'\x1b\[[0-9;]*m', '', body)
        clean.append(body.replace('&', '&amp;').replace('<', '&lt;'))
    with open(out_html, 'w', encoding='utf-8') as f:
        f.write('<!doctype html><meta charset="utf-8">'
                '<style>body{background:#0d1117;color:#c9d1d9;font:13px/1.5 Consolas,monospace;margin:0;padding:18px}'
                'h1{color:#58a6ff;font-size:15px;margin:0 0 4px}p{color:#8b949e;font-size:12px;margin:0 0 14px}'
                'pre{margin:0;white-space:pre-wrap}</style>'
                '<h1>' + title + '</h1><p>' + note + '</p><pre>' + '\n'.join(clean) + '</pre>')
    return out_html


def main():
    d = driver()
    try:
        base = 'https://github.com/' + REPO

        print('\n[1] Danh sach Actions - thay ca hai lan chay canh nhau')
        shot(d, '{}/actions/workflows/{}'.format(base, WORKFLOW),
             os.path.join(OUT, 'ci_runs_list.png'), wait=5.0)

        print('\n[2] Trang tung lan chay')
        for run in (RUN_PASS, RUN_FAIL):
            shot(d, '{}/actions/runs/{}'.format(base, run['id']),
                 os.path.join(OUT, 'ci_run_{}.png'.format(run['label'])), wait=5.0)

        print('\n[3] Step Summary cua tung lan chay (bang so lieu / bang assertion fail)')
        for run in (RUN_PASS, RUN_FAIL):
            shot(d, '{}/actions/runs/{}'.format(base, run['id']),
                 os.path.join(OUT, 'ci_summary_{}.png'.format(run['label'])),
                 wait=5.0, full=True, cap=9000, scroll_to='HW06')

        print('\n[4] Log job spec-gate cua lan chay do - tung dong AssertionError')
        shot(d, '{}/actions/runs/{}/job/{}'.format(base, RUN_FAIL['id'], RUN_FAIL['job']),
             os.path.join(OUT, 'ci_spec_gate_log.png'), wait=6.0)

        print('\n[5] Log CI render lai (log tren GitHub doi dang nhap moi xem duoc)')
        pg = render_log_page(
            os.path.join(ROOT, 'hw6', 'reports', 'ci_spec_gate.log'),
            'CI - job spec-gate, lan chay DO (' + RUN_FAIL['sha'] + '): assertion theo dac ta that bai',
            'Log lay bang: gh run view --job ' + RUN_FAIL['job'] + ' --log  |  '
            'Trang Actions doi dang nhap moi xem log, nen day la ban render lai, noi dung y het.',
            os.path.join(OUT, '_ci_spec_log.html'),
            keep_pattern=r'AssertionError|assertions |expected |spec-strict|SPEC-BUG')
        if pg:
            shot(d, 'file:///' + pg.replace('\\', '/'), os.path.join(OUT, 'ci_spec_log_render.png'),
                 wait=1.0, full=True, cap=12000)

        pg2 = render_log_page(
            os.path.join(ROOT, 'hw6', 'reports', 'ci_regression.log'),
            'CI - job regression, lan chay XANH (' + RUN_PASS['sha'] + '): 6 lan chay Newman deu dat',
            'Log lay bang: gh run view --job ' + RUN_PASS['job'] + ' --log  |  loc cac dong thong ke va reset_db.',
            os.path.join(OUT, '_ci_reg_log.html'),
            keep_pattern=r'assertions |requests |reset_db|ket thuc')
        if pg2:
            shot(d, 'file:///' + pg2.replace('\\', '/'), os.path.join(OUT, 'ci_regression_log_render.png'),
                 wait=1.0, full=True, cap=12000)

        print('\n[6] Diff mot dong tao ra khac biet giua hai lan chay')
        shot(d, '{}/commit/{}'.format(base, RUN_FAIL['sha']),
             os.path.join(OUT, 'ci_commit_diff.png'), wait=5.0, full=True, cap=6000)
    finally:
        d.quit()


if __name__ == '__main__':
    main()
