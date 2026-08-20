# -*- coding: utf-8 -*-
"""HW06 - Chup anh 16 GitHub Issue (Buoc 5). Repo cong khai, khong can dang nhap."""
import os, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

REPO = 'DuyITLOR/group05_eshop'
ISSUES = {
 378:'BUG-01', 379:'BUG-02', 380:'BUG-03', 381:'BUG-04', 382:'BUG-05',
 383:'BUG-06', 384:'BUG-07', 385:'BUG-08', 386:'BUG-09', 387:'BUG-11',
 388:'BUG-12', 389:'BUG-13', 377:'BUG-14', 390:'BUG-15', 391:'BUG-16', 392:'BUG-17',
}
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'hw6', 'evidence', 'issues')
os.makedirs(OUT, exist_ok=True)

o = Options()
for a in ('--headless=new','--window-size=1500,1300','--force-device-scale-factor=1','--hide-scrollbars','--lang=en-US'):
    o.add_argument(a)
d = webdriver.Chrome(options=o)
try:
    for num, bug in ISSUES.items():
        d.get('https://github.com/%s/issues/%d' % (REPO, num))
        time.sleep(3.5)
        d.execute_script("document.querySelectorAll('.js-notice,.Popover,.js-header-signup-prompt,dialog[open]').forEach(e=>e.remove());")
        time.sleep(0.3)
        h = d.execute_script('return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);')
        d.set_window_size(1500, min(int(h)+100, 4200))
        time.sleep(0.8)
        out = os.path.join(OUT, 'github_issue_%s_%d.png' % (bug, num))
        d.save_screenshot(out)
        print('  #%d %s -> %d KB' % (num, bug, os.path.getsize(out)//1024))
finally:
    d.quit()
print('Xong: %d anh trong hw6/evidence/issues/' % len(ISSUES))
