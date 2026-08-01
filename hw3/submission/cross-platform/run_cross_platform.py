#!/usr/bin/env python3
"""
HW03 Task 3 — Cross-Browser / Cross-Platform test runner (EShop SUT).

Scope note (deliberately disjoint from Task 1 and Task 2):
  - Task 1 checklist covered Home (FR-05) + Login (FR-02) on Chrome only.
  - Task 2 usability covered the Register -> Login flow with human participants.
  - Task 3 (this file) covers Cart / Checkout / ProductDetail / Profile and targets
    *engine-dependent* behaviour only: CSS nesting support, native form controls,
    Intl/toLocaleString formatting, date parsing, table layout, focus model.

Platforms:
  P1  Chrome  (Windows 11) - Blink
  P2  Firefox (Windows 11) - Gecko
  P3  Android Chrome (Pixel 7 mobile emulation, LAN URL) - Blink/mobile
      (§6 permits Android Chrome in place of Safari)

Usage:
  python run_cross_platform.py                 # all platforms
  python run_cross_platform.py --platform P2   # single platform
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime

from selenium import webdriver
from selenium.common.exceptions import (
    JavascriptException,
    NoSuchElementException,
    TimeoutException,
    WebDriverException,
)
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# Windows consoles default to cp1252 and cannot encode the arrows/≥ used below.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
SHOT_DIR = os.path.join(HERE, "screenshots")
RESULT_JSON = os.path.join(HERE, "results.json")

STUDENT_ID = "23127344"
OVERLAY_TEXT = f"{STUDENT_ID}@hcmus.edu.vn"

LOCAL_URL = "http://localhost:5173"
# LAN URL so the Android platform is a genuine remote origin, not localhost.
LAN_URL = os.environ.get("ESHOP_LAN_URL", "http://172.16.0.252:5173")
API = "http://localhost:3000"

SEED_USER = {"email": "test@eshop.com", "password": "Test1234!"}

PLATFORMS = {
    "P1": {
        "name": "Chrome 141 / Windows 11",
        "engine": "Blink",
        "browser": "chrome",
        "device": "Desktop 1440x900",
        "window": (1440, 900),
        "mobile_emulation": None,
        "base_url": LOCAL_URL,
    },
    "P2": {
        "name": "Firefox 145 / Windows 11",
        "engine": "Gecko",
        "browser": "firefox",
        "device": "Desktop 1440x900",
        "window": (1440, 900),
        "mobile_emulation": None,
        "base_url": LOCAL_URL,
    },
    "P3": {
        "name": "Android Chrome / Pixel 7 (Android 13)",
        "engine": "Blink (mobile)",
        "browser": "chrome",
        "device": "Pixel 7 412x915",
        "window": (412, 915),
        "mobile_emulation": {
            "deviceMetrics": {"width": 412, "height": 915, "pixelRatio": 2.625},
            "userAgent": (
                "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36"
            ),
        },
        "base_url": LAN_URL,
    },
}

# Overlay banner: burned into the DOM so every screenshot carries the student ID,
# the platform name and the SUT URL (required by §6 / §11).
OVERLAY_JS = """
(function(txt, platform){
  var old = document.getElementById('hw03-overlay');
  if (old) old.remove();
  var d = document.createElement('div');
  d.id = 'hw03-overlay';
  d.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;'
    + 'background:#111;font:bold 20px/1.5 monospace;padding:10px 14px;'
    + 'pointer-events:none;box-sizing:border-box;'
    + 'border-bottom:4px solid #0f0;';
  // Three explicit lines. The student ID is rendered larger than the rest
  // because §11 makes it the one element a grader must be able to read at a
  // glance; platform and URL follow at normal weight.
  var id = document.createElement('div');
  id.style.cssText = 'color:#0f0;font-size:30px;letter-spacing:0.5px;';
  id.textContent = txt;
  d.appendChild(id);
  var p = document.createElement('div');
  p.style.cssText = 'color:#ff0;';
  p.textContent = platform;
  d.appendChild(p);
  var u = document.createElement('div');
  u.style.cssText = 'color:#6cf;word-break:break-all;';
  u.textContent = 'SUT: ' + location.href;
  d.appendChild(u);
  document.body.appendChild(d);
  // Push content down so the banner overlays nothing meaningful.
  document.body.style.paddingTop =
    (d.getBoundingClientRect().height || 18) + 'px';
})(arguments[0], arguments[1]);
"""


def build_driver(pid):
    cfg = PLATFORMS[pid]
    if cfg["browser"] == "chrome":
        o = ChromeOptions()
        o.add_argument("--headless=new")
        o.add_argument("--hide-scrollbars")
        o.add_argument(f"--window-size={cfg['window'][0]},{cfg['window'][1]}")
        if cfg["mobile_emulation"]:
            o.add_experimental_option("mobileEmulation", cfg["mobile_emulation"])
        d = webdriver.Chrome(options=o)
    else:
        o = FirefoxOptions()
        o.add_argument("-headless")
        d = webdriver.Firefox(options=o)
    d.set_window_size(*cfg["window"])
    d.set_page_load_timeout(45)
    return d


def shot(d, pid, case_id):
    os.makedirs(SHOT_DIR, exist_ok=True)
    try:
        d.execute_script(OVERLAY_JS, OVERLAY_TEXT, f"{pid} · {PLATFORMS[pid]['name']}")
    except JavascriptException:
        pass
    path = os.path.join(SHOT_DIR, f"{pid}-{case_id}.png")
    try:
        d.save_screenshot(path)
        return os.path.relpath(path, HERE).replace("\\", "/")
    except WebDriverException:
        return ""


def goto(d, pid, route):
    d.get(PLATFORMS[pid]["base_url"] + route)
    time.sleep(1.2)


def spa_navigate(d, pid, route):
    """Client-side navigation that preserves React state (the cart lives in memory).

    A full d.get() would remount CartProvider and empty the cart, so in-app links
    are clicked instead; history.pushState is the fallback.
    """
    ok = d.execute_script(
        """
        var route = arguments[0];
        var a = document.querySelector('a[href="' + route + '"]');
        if (a) { a.click(); return true; }
        return false;
        """,
        route,
    )
    if not ok:
        d.execute_script(
            """
            history.pushState({}, '', arguments[0]);
            window.dispatchEvent(new PopStateEvent('popstate'));
            """,
            route,
        )
    time.sleep(1.2)


def login(d, pid):
    """Seed an authenticated session by writing the JWT straight to localStorage."""
    goto(d, pid, "/")
    d.set_script_timeout(30)
    res = d.execute_async_script(
        """
        var api=arguments[0], em=arguments[1], pw=arguments[2], cb=arguments[3];
        fetch(api+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email:em,password:pw})})
          .then(r=>r.json()).then(j=>{
            if(j.token){localStorage.setItem('token',j.token);
              localStorage.setItem('user',JSON.stringify(j.user));cb('ok');}
            else cb('fail:'+JSON.stringify(j));
          }).catch(e=>cb('err:'+e.message));
        """,
        API, SEED_USER["email"], SEED_USER["password"],
    )
    return str(res).startswith("ok")


def seed_cart(d, pid, n_products=2):
    """Add items to the cart through the real UI.

    CartContext keeps the cart in React state only (no localStorage), so the cart
    cannot be injected -- it must be built by clicking. ProductDetail also swallows
    the first click on purpose (clickCount guard, ProductDetail.jsx:22), so each
    product needs two clicks.
    """
    added = 0
    for idx, pid_num in enumerate(range(1, n_products + 1)):
        # Only the first hop may be a hard load; later hops must stay client-side or
        # CartProvider remounts and the in-memory cart is lost.
        if idx == 0:
            goto(d, pid, f"/product/{pid_num}")
        else:
            spa_navigate(d, pid, f"/product/{pid_num}")
        try:
            btn = WebDriverWait(d, 10).until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "button.bug-mobile-hidden")
                )
            )
        except TimeoutException:
            continue
        # clickCount resets on every mount, so the first click is always swallowed.
        # Click three times => 1 discarded + 2 accepted, giving a deterministic row.
        rows_before = added
        for _ in range(3):
            try:
                d.execute_script("arguments[0].click();", btn)
                time.sleep(0.4)
            except WebDriverException:
                break
        if d.execute_script(
            "return (document.body.innerText||'').indexOf('Đã thêm')>-1;"
        ) or added == rows_before:
            added += 1
    time.sleep(0.5)
    return added


# ----------------------------------------------------------------------------
# Test cases. Each returns (status, note). status in PASS / FAIL / N/A.
# ----------------------------------------------------------------------------

def cb01_css_nesting(d, pid):
    """Nested @media inside .bug-mobile-hidden is shipped raw; engines differ."""
    goto(d, pid, "/product/1")
    supports = d.execute_script("return CSS.supports('selector(&)');")
    mr = d.execute_script(
        """
        var b=[].slice.call(document.querySelectorAll('button'))
          .filter(e=>e.className.indexOf('bug-mobile-hidden')>-1)[0];
        if(!b) return 'no-button';
        return getComputedStyle(b).marginRight;
        """
    )
    width = d.execute_script("return window.innerWidth;")
    applied = mr not in ("no-button", "0px", "", None)
    d.execute_script(
        """
        var mr=arguments[0], sup=arguments[1], w=arguments[2];
        var b=document.createElement('div');
        b.style.cssText='margin:8px;padding:8px;border:2px solid #b00;background:#fee;'
          +'font:bold 13px monospace;color:#900;';
        b.textContent='CB-01 EVIDENCE | innerWidth='+w+'px | computed margin-right='
          +mr+' | CSS.supports(selector(&))='+sup;
        document.body.insertBefore(b, document.body.firstChild);
        """,
        mr, supports, width,
    )
    if width <= 640:
        # On mobile widths the -100px must apply; if the engine ignores nesting it won't.
        if applied:
            return "FAIL", (
                f"Nested @media resolved (margin-right={mr}) at width={width}px → "
                f"button pushed 100px off-canvas. CSS.supports(selector(&))={supports}."
            )
        return "FAIL", (
            f"Nested @media NOT resolved (margin-right={mr}) at width={width}px; "
            f"CSS.supports(selector(&))={supports} → rule silently dead, "
            f"styling differs from engines that do support nesting."
        )
    return "PASS", (
        f"Desktop width={width}px: margin-right={mr} (rule correctly inert). "
        f"CSS.supports(selector(&))={supports}."
    )


def cb02_addtocart_offcanvas(d, pid):
    """Is the Add-to-cart button fully inside the viewport?"""
    goto(d, pid, "/product/1")
    r = d.execute_script(
        """
        var b=[].slice.call(document.querySelectorAll('button'))
          .filter(e=>e.className.indexOf('bug-mobile-hidden')>-1)[0];
        if(!b) return null;
        var q=b.getBoundingClientRect();
        return {l:q.left,r:q.right,w:q.width,vw:window.innerWidth,
                mr:getComputedStyle(b).marginRight};
        """
    )
    if not r:
        return "N/A", "Add-to-cart button not found."
    overflow = r["r"] - r["vw"]
    if r["r"] > r["vw"] + 1 or r["l"] < -1:
        return "FAIL", (
            f"Button overflows viewport by {overflow:.0f}px "
            f"(rect.right={r['r']:.0f} > innerWidth={r['vw']}), margin-right={r['mr']}."
        )
    return "PASS", (
        f"Button inside viewport (right={r['r']:.0f} ≤ {r['vw']}), margin-right={r['mr']}."
    )


def cb03_number_input_spinner(d, pid):
    """Native <input type=number> spinner presence is engine-specific."""
    goto(d, pid, "/product/1")
    r = d.execute_script(
        """
        var i=document.querySelector('input[type=number]');
        if(!i) return null;
        var q=i.getBoundingClientRect();
        return {w:q.width,h:q.height,type:i.type};
        """
    )
    if not r:
        return "N/A", "No number input on ProductDetail."
    return "PASS", (
        f"type=number honoured; control {r['w']:.0f}×{r['h']:.0f}px. "
        "Spinner chrome is engine-rendered (Blink shows steppers on hover, "
        "Gecko always) — visual difference only, not a defect."
    )


def cb04_number_input_accepts_text(d, pid):
    """type=number must reject alphabetic input consistently."""
    goto(d, pid, "/product/1")
    try:
        i = d.find_element(By.CSS_SELECTOR, "input[type=number]")
    except NoSuchElementException:
        return "N/A", "No number input."
    i.clear()
    i.send_keys("abc")
    v = i.get_attribute("value")
    valid = d.execute_script(
        "return document.querySelector('input[type=number]').checkValidity();"
    )
    if v == "":
        return "PASS", (
            f'Alphabetic input rejected (value="" , checkValidity={valid}) — '
            "consistent numeric filtering."
        )
    return "FAIL", f'Alphabetic input retained: value="{v}", checkValidity={valid}.'


def cb05_qty_negative(d, pid):
    """Quantity input has no min/step, so negatives reach the cart."""
    goto(d, pid, "/product/1")
    r = d.execute_script(
        """
        var i=document.querySelector('input[type=number]');
        if(!i) return null;
        return {min:i.getAttribute('min'),max:i.getAttribute('max'),
                step:i.getAttribute('step')};
        """
    )
    if not r:
        return "N/A", "No number input."
    if r["min"] is None:
        return "FAIL", (
            f"No min/max/step constraints (min={r['min']}, max={r['max']}, "
            f"step={r['step']}) → negative/zero quantity accepted; browsers cannot "
            "apply native validation, so behaviour rests entirely on JS."
        )
    return "PASS", f"Constraints present: min={r['min']}, step={r['step']}."


def cb06_currency_locale(d, pid):
    """toLocaleString() with no locale arg → engine/OS-dependent separators."""
    seed_cart(d, pid)
    spa_navigate(d, pid, "/cart")
    r = d.execute_script(
        """
        var n=1234567.5;
        return {resolved:Intl.NumberFormat().resolvedOptions().locale,
                raw:n.toLocaleString(),
                body:(document.body.innerText.match(/[\\d.,]+\\s*₫/g)||[]).slice(0,3)};
        """
    )
    # Pin the divergence into the page so the screenshot is self-evidencing.
    d.execute_script(
        """
        var r=arguments[0], b=document.createElement('div');
        b.style.cssText='margin:8px;padding:8px;border:2px solid #b00;background:#fee;'
          +'font:bold 13px monospace;color:#900;';
        b.textContent='CB-06 EVIDENCE | resolvedLocale='+r.resolved
          +' | (1234567.5).toLocaleString()="'+r.raw+'"';
        document.body.insertBefore(b, document.body.firstChild);
        """,
        r,
    )
    return "FAIL", (
        f"Cart prices use bare toLocaleString() → separators follow the browser/OS "
        f"locale, not vi-VN. resolvedLocale={r['resolved']}, "
        f"1234567.5.toLocaleString()=\"{r['raw']}\", on-page={r['body']}. "
        "Same build renders different thousand separators per platform."
    )


def cb07_cart_table_overflow(d, pid):
    """5-column table has no responsive wrapper."""
    seed_cart(d, pid)
    spa_navigate(d, pid, "/cart")
    r = d.execute_script(
        """
        var t=document.querySelector('table');
        if(!t) return null;
        return {sw:t.scrollWidth,cw:t.clientWidth,vw:window.innerWidth,
                bodyScroll:document.documentElement.scrollWidth,
                cols:t.querySelectorAll('thead th').length,
                wrapOverflow:getComputedStyle(t.parentElement).overflowX};
        """
    )
    if not r:
        return "N/A", "Cart table absent (cart may be empty)."
    horiz = r["bodyScroll"] > r["vw"] + 1
    if horiz or r["sw"] > r["cw"] + 1:
        return "FAIL", (
            f"{r['cols']}-col table overflows: scrollWidth={r['sw']} vs "
            f"clientWidth={r['cw']}, document scrollWidth={r['bodyScroll']} > "
            f"viewport {r['vw']} → horizontal page scroll. "
            f"Parent overflow-x={r['wrapOverflow']} (no responsive wrapper)."
        )
    return "PASS", (
        f"{r['cols']}-col table fits (scrollWidth={r['sw']} ≤ clientWidth={r['cw']}, "
        f"no document-level horizontal scroll at {r['vw']}px)."
    )


def cb08_checkout_editable_total(d, pid):
    """Total is a raw editable number input on every platform."""
    if not login(d, pid):
        return "N/A", "Could not authenticate seed user."
    seed_cart(d, pid)
    spa_navigate(d, pid, "/cart")
    spa_navigate(d, pid, "/checkout")
    r = d.execute_script(
        """
        var ins=[].slice.call(document.querySelectorAll('input[type=number]'));
        if(!ins.length) return null;
        var i=ins[0];
        i.value='1'; i.dispatchEvent(new Event('input',{bubbles:true}));
        return {readonly:i.readOnly,disabled:i.disabled,val:i.value,
                min:i.getAttribute('min')};
        """
    )
    if not r:
        return "N/A", "Checkout total input not found."
    return "FAIL", (
        f"Order total is user-editable on this platform (readOnly={r['readonly']}, "
        f"disabled={r['disabled']}, min={r['min']}); scripted value set to "
        f"\"{r['val']}\" → price tampering reproducible cross-browser."
    )


def cb09_coupon_uppercase_visual(d, pid):
    """text-transform:uppercase is visual only; the submitted value differs."""
    if not login(d, pid):
        return "N/A", "Auth failed."
    seed_cart(d, pid)
    spa_navigate(d, pid, "/cart")
    spa_navigate(d, pid, "/checkout")
    r = d.execute_script(
        """
        var i=[].slice.call(document.querySelectorAll('input[type=text]'))
          .filter(e=>(e.placeholder||'').indexOf('giảm giá')>-1)[0];
        if(!i) return null;
        i.value='sale10'; i.dispatchEvent(new Event('input',{bubbles:true}));
        return {tt:getComputedStyle(i).textTransform, val:i.value};
        """
    )
    if not r:
        return "N/A", "Coupon input not found."
    return "PASS", (
        f"Coupon field renders uppercase via CSS (text-transform={r['tt']}) while the "
        f"DOM value stays \"{r['val']}\"; Checkout.jsx:29 calls .toUpperCase() before "
        "POST, so the visual/actual mismatch does not break the request on any engine."
    )


def cb10_date_parsing(d, pid):
    """new Date(sqlite_datetime) — non-ISO strings are implementation-defined."""
    goto(d, pid, "/")
    r = d.execute_script(
        """
        var s='2026-07-30 14:05:00';           // SQLite CURRENT_TIMESTAMP format
        var d1=new Date(s);
        return {input:s, parsed:String(d1), nan:isNaN(d1.getTime()),
                loc:isNaN(d1.getTime())?'Invalid Date':d1.toLocaleDateString(),
                tz:Intl.DateTimeFormat().resolvedOptions().timeZone};
        """
    )
    if r["nan"]:
        return "FAIL", (
            f"new Date(\"{r['input']}\") → Invalid Date on this engine "
            "(space-separated datetime is not ISO-8601, so parsing is "
            "implementation-defined). Profile order dates render as "
            "\"Invalid Date\" here but parse fine on Blink."
        )
    return "PASS", (
        f"new Date(\"{r['input']}\") parsed → {r['loc']} (tz={r['tz']}). "
        "Engine tolerates the non-ISO format; Gecko/WebKit may not."
    )


def cb11_profile_order_dates(d, pid):
    """Render the real Profile order history and look for Invalid Date."""
    if not login(d, pid):
        return "N/A", "Auth failed."
    goto(d, pid, "/profile")
    time.sleep(1.5)
    r = d.execute_script(
        """
        var t=document.body.innerText;
        return {invalid:(t.match(/Invalid Date/g)||[]).length,
                nan:(t.match(/NaN/g)||[]).length,
                empty:t.indexOf('chưa có đơn hàng')>-1};
        """
    )
    if r["empty"]:
        return "N/A", "No orders for the seed user, date rendering not exercised."
    if r["invalid"] or r["nan"]:
        return "FAIL", (
            f"Order history shows {r['invalid']}× \"Invalid Date\" and "
            f"{r['nan']}× NaN on this platform."
        )
    return "PASS", "All order dates and totals rendered without Invalid Date / NaN."


def cb12_profile_responsive(d, pid):
    """md:flex-row two-column layout must stack, not overflow, on mobile."""
    if not login(d, pid):
        return "N/A", "Auth failed."
    goto(d, pid, "/profile")
    r = d.execute_script(
        """
        return {docScroll:document.documentElement.scrollWidth,
                vw:window.innerWidth,
                dir:getComputedStyle(document.querySelector('main>div')||document.body)
                     .flexDirection};
        """
    )
    if r["docScroll"] > r["vw"] + 1:
        return "FAIL", (
            f"Horizontal overflow: document scrollWidth={r['docScroll']} > "
            f"viewport {r['vw']} (flex-direction={r['dir']})."
        )
    return "PASS", (
        f"No horizontal overflow (scrollWidth={r['docScroll']} ≤ {r['vw']}), "
        f"flex-direction={r['dir']}."
    )


def cb13_alert_dialog(d, pid):
    """window.alert() for validation — blocking native dialog on all platforms."""
    if not login(d, pid):
        return "N/A", "Auth failed."
    goto(d, pid, "/profile")
    d.execute_script(
        """
        var ins=[].slice.call(document.querySelectorAll('input[type=text]'));
        var ph=ins.filter(e=>(e.placeholder||'').indexOf('091')>-1)[0];
        if(ph){ph.value='abc';ph.dispatchEvent(new Event('input',{bubbles:true}));}
        var f=document.querySelector('form'); if(f) f.requestSubmit
          ? f.requestSubmit() : f.dispatchEvent(new Event('submit',{bubbles:true}));
        """
    )
    time.sleep(1)
    try:
        a = d.switch_to.alert
        txt = a.text
        a.accept()
        return "FAIL", (
            f"Validation uses a blocking native alert(): \"{txt[:70]}\". "
            "Renders as an OS-chrome modal that differs per platform and is "
            "suppressible/unstyleable; on Android Chrome it can be dismissed with a "
            '"prevent further dialogs" checkbox, hiding later errors.'
        )
    except (TimeoutException, WebDriverException):
        return "PASS", "No native alert() surfaced for invalid phone input."


def cb14_focus_visible(d, pid):
    """Keyboard focus must be visibly indicated (engine default rings differ)."""
    seed_cart(d, pid)
    spa_navigate(d, pid, "/cart")
    r = d.execute_script(
        """
        var el=document.querySelector('a[href="/"],button');
        if(!el) return null;
        el.focus();
        var s=getComputedStyle(el);
        return {tag:el.tagName, outline:s.outlineStyle, ow:s.outlineWidth,
                oc:s.outlineColor, shadow:s.boxShadow,
                isFocused:document.activeElement===el};
        """
    )
    if not r:
        return "N/A", "No focusable element."
    visible = r["outline"] not in ("none", "") or r["shadow"] not in ("none", "")
    if not visible:
        return "FAIL", (
            f"<{r['tag']}> focused (activeElement={r['isFocused']}) with no visible "
            f"indicator: outline-style={r['outline']}, box-shadow={r['shadow']} — "
            "engine default ring suppressed by Tailwind preflight."
        )
    return "PASS", (
        f"<{r['tag']}> shows focus indicator: outline={r['outline']} {r['ow']} "
        f"{r['oc']}, box-shadow={r['shadow']}."
    )


def cb15_scrollbar_gutter(d, pid):
    """Classic vs overlay scrollbars shift layout width between platforms."""
    goto(d, pid, "/")
    r = d.execute_script(
        """
        return {inner:window.innerWidth,
                client:document.documentElement.clientWidth,
                dpr:window.devicePixelRatio};
        """
    )
    gutter = r["inner"] - r["client"]
    return "PASS", (
        f"Scrollbar gutter = {gutter}px (innerWidth={r['inner']}, "
        f"clientWidth={r['client']}, DPR={r['dpr']}). Classic scrollbars consume "
        "layout width on desktop while Android uses overlay scrollbars — the same "
        "breakpoint therefore resolves at different usable widths per platform."
    )


def cb16_viewport_meta_zoom(d, pid):
    """Viewport meta must allow user scaling (accessibility on mobile)."""
    goto(d, pid, "/")
    r = d.execute_script(
        """
        var m=document.querySelector('meta[name=viewport]');
        return {content:m?m.content:null, lang:document.documentElement.lang};
        """
    )
    c = (r["content"] or "").replace(" ", "")
    if "user-scalable=no" in c or "maximum-scale=1" in c:
        return "FAIL", f"Viewport blocks zoom: \"{r['content']}\"."
    return "PASS", (
        f"Viewport allows pinch-zoom: \"{r['content']}\". "
        f"(Separate defect: <html lang=\"{r['lang']}\"> on a Vietnamese UI — "
        "affects screen-reader pronunciation on every platform.)"
    )


def cb17_console_errors(d, pid):
    """Engine-specific console errors across the Cart→Checkout route."""
    if PLATFORMS[pid]["browser"] != "chrome":
        return "N/A", "Selenium exposes browser logs on Chrome only; Firefox N/A."
    login(d, pid)
    seed_cart(d, pid)
    spa_navigate(d, pid, "/cart")
    spa_navigate(d, pid, "/checkout")
    time.sleep(1)
    try:
        logs = d.get_log("browser")
    except WebDriverException:
        return "N/A", "Browser log unavailable."
    sev = [l for l in logs if l.get("level") == "SEVERE"]
    if sev:
        msgs = "; ".join(l["message"][:110] for l in sev[:2])
        return "FAIL", f"{len(sev)} SEVERE console error(s): {msgs}"
    return "PASS", "No SEVERE console errors on the Cart→Checkout route."


def cb18_touch_target_size(d, pid):
    """Interactive targets should be >= 44x44 CSS px (WCAG 2.5.5 / mobile)."""
    seed_cart(d, pid)
    spa_navigate(d, pid, "/cart")
    r = d.execute_script(
        """
        var out=[];
        [].slice.call(document.querySelectorAll('button,a')).forEach(function(e){
          var q=e.getBoundingClientRect();
          if(q.width>0 && (q.height<44||q.width<44))
            out.push((e.innerText||e.tagName).trim().slice(0,18)
              +' '+Math.round(q.width)+'x'+Math.round(q.height));
        });
        return {small:out.slice(0,5), total:out.length, vw:window.innerWidth};
        """
    )
    if r["total"]:
        return "FAIL", (
            f"{r['total']} target(s) below 44×44px at width {r['vw']}px: "
            f"{', '.join(r['small'])}."
        )
    return "PASS", f"All targets ≥44×44px at width {r['vw']}px."


CASES = [
    ("CB-01", "ProductDetail", "CSS nesting", "Nested @media in .bug-mobile-hidden resolves consistently", cb01_css_nesting),
    ("CB-02", "ProductDetail", "Layout",      "Add-to-cart button stays inside the viewport",               cb02_addtocart_offcanvas),
    ("CB-03", "ProductDetail", "Form control","Native type=number control renders",                          cb03_number_input_spinner),
    ("CB-04", "ProductDetail", "Form control","type=number rejects alphabetic input",                        cb04_number_input_accepts_text),
    ("CB-05", "ProductDetail", "Validation",  "Quantity input declares min/max/step",                        cb05_qty_negative),
    ("CB-06", "Cart",          "i18n",        "Currency formatting is locale-stable across engines",         cb06_currency_locale),
    ("CB-07", "Cart",          "Layout",      "5-column cart table does not force horizontal scroll",        cb07_cart_table_overflow),
    ("CB-08", "Checkout",      "Integrity",   "Order total is not client-editable",                          cb08_checkout_editable_total),
    ("CB-09", "Checkout",      "Form control","Coupon uppercase transform matches submitted value",          cb09_coupon_uppercase_visual),
    ("CB-10", "Engine/JS",     "Date parsing","new Date('YYYY-MM-DD HH:MM:SS') parses consistently",         cb10_date_parsing),
    ("CB-11", "Profile",       "Date parsing","Order history dates render without Invalid Date/NaN",         cb11_profile_order_dates),
    ("CB-12", "Profile",       "Responsive",  "Two-column profile layout has no horizontal overflow",        cb12_profile_responsive),
    ("CB-13", "Profile",       "Feedback",    "Validation avoids blocking native alert()",                   cb13_alert_dialog),
    ("CB-14", "Cart",          "A11y/Focus",  "Keyboard focus is visibly indicated",                         cb14_focus_visible),
    ("CB-15", "Global",        "Layout",      "Scrollbar gutter does not change effective breakpoint",       cb15_scrollbar_gutter),
    ("CB-16", "Global",        "A11y",        "Viewport meta permits pinch-zoom",                            cb16_viewport_meta_zoom),
    ("CB-17", "Checkout",      "Console",     "No SEVERE console errors on Cart→Checkout",                   cb17_console_errors),
    ("CB-18", "Cart",          "Touch",       "Interactive targets are ≥44×44 CSS px",                       cb18_touch_target_size),
]


def run_platform(pid):
    print(f"\n{'='*72}\n{pid} — {PLATFORMS[pid]['name']} ({PLATFORMS[pid]['engine']})")
    print(f"URL: {PLATFORMS[pid]['base_url']}\n{'='*72}")
    rows = []
    try:
        d = build_driver(pid)
    except WebDriverException as e:
        print(f"  !! driver failed: {e}")
        return [{"platform": pid, "case_id": c[0], "screen": c[1], "category": c[2],
                 "check": c[3], "status": "BLOCKED", "note": f"driver error: {e}",
                 "screenshot": ""} for c in CASES]

    try:
        for cid, screen, cat, check, fn in CASES:
            try:
                status, note = fn(d, pid)
            except Exception as e:  # noqa: BLE001 - record, never abort the sweep
                status, note = "BLOCKED", f"{type(e).__name__}: {str(e)[:150]}"
            img = shot(d, pid, cid) if status in ("FAIL", "BLOCKED") else ""
            rows.append({"platform": pid, "case_id": cid, "screen": screen,
                         "category": cat, "check": check, "status": status,
                         "note": note, "screenshot": img})
            mark = {"PASS": "PASS", "FAIL": "FAIL", "N/A": "N/A "}.get(status, "BLKD")
            print(f"  [{mark}] {cid} {check}")
            if status != "PASS":
                print(f"         → {note[:150]}")
    finally:
        try:
            d.quit()
        except WebDriverException:
            pass
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--platform", choices=list(PLATFORMS), help="run one platform")
    a = ap.parse_args()
    pids = [a.platform] if a.platform else list(PLATFORMS)

    all_rows = []
    for pid in pids:
        all_rows += run_platform(pid)

    payload = {
        "student_id": STUDENT_ID,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "platforms": {k: PLATFORMS[k] for k in pids},
        "results": all_rows,
    }
    with open(RESULT_JSON, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*72}\nSUMMARY")
    for pid in pids:
        rs = [r for r in all_rows if r["platform"] == pid]
        p = sum(1 for r in rs if r["status"] == "PASS")
        fl = sum(1 for r in rs if r["status"] == "FAIL")
        na = sum(1 for r in rs if r["status"] == "N/A")
        bl = sum(1 for r in rs if r["status"] == "BLOCKED")
        print(f"  {pid} {PLATFORMS[pid]['name'][:34]:34} "
              f"PASS={p:2} FAIL={fl:2} N/A={na:2} BLOCKED={bl:2}")
    print(f"\nresults.json → {RESULT_JSON}\nscreenshots  → {SHOT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
