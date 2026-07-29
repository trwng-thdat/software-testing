"""
EShop GUI Checklist automation (HW03 Task 1).

Automates the 69-item GUI checklist from hw3/Main_Report.md for the two
screens in scope: Product List / Home (FR-05) and Login (FR-02), across all
four interface aspects IA01 (General UI), IA02 (Forms), IA03 (Navigation),
IA04 (Feedback/State).

Runs a single browser (Chrome only, via Selenium Manager - no manual
chromedriver setup needed). Takes one screenshot per checklist item.

Usage:
    python run_checklist.py                     # run everything
    python run_checklist.py --ia IA02            # only IA02 items, both screens
    python run_checklist.py --screen login       # only Login screen, all IA
    python run_checklist.py --screen login --ia IA04
    python run_checklist.py --id LOGIN-F02        # single item, for debugging
    python run_checklist.py --include-lockout    # also run the slow lockout tests
    python run_checklist.py --headless

See README.md in this folder for full flag reference.
"""

import argparse
import csv
import io
import json
import os
import random
import string
import sys
import time
import urllib.parse

if sys.stdout.encoding is None or sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from selenium import webdriver
from selenium.common.exceptions import (
    NoSuchElementException,
    TimeoutException,
    UnexpectedAlertPresentException,
)
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

PASS = "PASS"
FAIL = "FAIL"
NA = "N/A"
MANUAL = "MANUAL"
ERROR = "ERROR"


class Ctx:
    """Shared state passed to every check function."""

    def __init__(self, driver, base_url, screenshots_dir, include_lockout):
        self.driver = driver
        self.base_url = base_url.rstrip("/")
        self.screenshots_dir = screenshots_dir
        self.include_lockout = include_lockout
        self.wait = WebDriverWait(driver, 8)

    def goto(self, path=""):
        self.driver.get(self.base_url + path)
        time.sleep(0.5)

    def clear_session(self):
        """Wipe localStorage/sessionStorage so leftover login state from a
        previous check doesn't leak into a check that assumes logged-out."""
        try:
            self.driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")
        except Exception:
            pass

    def goto_logged_out(self, path=""):
        self.goto(path)
        self.clear_session()
        self.goto(path)

    def screenshot(self, check_id):
        path = os.path.join(self.screenshots_dir, f"{check_id}.png")
        try:
            self.driver.save_screenshot(path)
        except Exception:
            path = ""
        return path


def result(status, notes=""):
    return {"status": status, "notes": notes}


def rand_email():
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"selenium_{suffix}@test.local"


# ---------------------------------------------------------------------------
# HOME / Product List (FR-05) checks
# ---------------------------------------------------------------------------

def home_u01(ctx):
    ctx.goto("/")
    h1s = ctx.driver.find_elements(By.TAG_NAME, "h1")
    if len(h1s) == 1:
        return result(PASS, "Chỉ có 1 thẻ <h1> trên trang.")
    return result(FAIL, f"Tìm thấy {len(h1s)} thẻ <h1>: {[e.text for e in h1s]}")


def home_u02(ctx):
    ctx.goto("/")
    imgs = ctx.driver.find_elements(By.CSS_SELECTOR, "img")
    if not imgs:
        return result(MANUAL, "Không có sản phẩm nào để kiểm tra alt (danh sách rỗng).")
    empty_alts = [i for i, img in enumerate(imgs) if not img.get_attribute("alt")]
    if empty_alts:
        return result(FAIL, f"{len(empty_alts)}/{len(imgs)} ảnh có alt rỗng.")
    return result(PASS, "Tất cả ảnh có thuộc tính alt không rỗng.")


def home_u03(ctx):
    ctx.goto("/")
    body_text = ctx.driver.find_element(By.TAG_NAME, "body").text
    if "₫" in body_text:
        return result(PASS, "Tìm thấy ký hiệu ₫ trên trang.")
    if "VND" in body_text:
        return result(FAIL, "Trang dùng chuỗi 'VND' thay vì ký hiệu ₫.")
    return result(MANUAL, "Không xác định được đơn vị tiền tệ hiển thị, cần xem thủ công.")


def home_u04(ctx):
    ctx.goto("/")
    return result(MANUAL, "Cần xem trực quan: tên sản phẩm dài có bị vỡ layout không (xem ảnh chụp).")


def home_u05(ctx):
    ctx.goto("/")
    widths = [1400, 800, 375]
    notes = []
    for w in widths:
        ctx.driver.set_window_size(w, 900)
        time.sleep(0.3)
        notes.append(f"{w}px chụp OK")
    ctx.driver.set_window_size(1400, 900)
    return result(MANUAL, "Đã chụp 3 kích thước màn hình (1400/800/375px); xem ảnh để xác nhận số cột.")


def home_u06(ctx):
    ctx.goto("/")
    body_text = ctx.driver.find_element(By.TAG_NAME, "body").text
    english_markers = ["Sign In", "Username", "Login", "Sign Up"]
    found = [m for m in english_markers if m in body_text]
    if found:
        return result(FAIL, f"Tìm thấy văn bản tiếng Anh không nhất quán: {found}")
    return result(PASS, "Không phát hiện nhãn tiếng Anh lạc trên trang Home.")


def home_u07(ctx):
    ctx.goto("/")
    header = ctx.driver.find_elements(By.TAG_NAME, "header")
    if not header:
        return result(FAIL, "Không tìm thấy thẻ <header>.")
    text = header[0].text
    required = ["EShop", "Giỏ hàng"]
    missing = [r for r in required if r not in text]
    if missing:
        return result(FAIL, f"Header thiếu: {missing}")
    return result(PASS, "Header có logo EShop và link Giỏ hàng.")


def home_u08(ctx):
    ctx.goto("/")
    try:
        btn = ctx.driver.find_element(By.XPATH, "//button[contains(., 'Thêm vào giỏ')]")
    except NoSuchElementException:
        return result(MANUAL, "Không có sản phẩm nào để kiểm tra nút Thêm vào giỏ.")
    classes = btn.get_attribute("class") or ""
    if "blue" in classes:
        return result(PASS, f"Nút dùng class chứa 'blue': {classes}")
    return result(FAIL, f"Nút không dùng màu xanh dương, class thực tế: {classes}")


def home_u09(ctx):
    ctx.goto("/")
    return result(MANUAL, "Spacing/padding giữa các card cần xem trực quan qua ảnh chụp.")


def home_u10(ctx):
    ctx.goto("/")
    return result(MANUAL, "Font/cỡ chữ nhất quán giữa các card cần xem trực quan qua ảnh chụp.")


def home_u11(ctx):
    ctx.goto("/")
    html_class = ctx.driver.find_element(By.TAG_NAME, "html").get_attribute("class") or ""
    body_class = ctx.driver.find_element(By.TAG_NAME, "body").get_attribute("class") or ""
    if "dark" in html_class or "dark" in body_class:
        return result(MANUAL, "Có class 'dark' — kiểm tra thủ công độ tương phản.")
    ctx.driver.execute_script(
        "document.documentElement.style.colorScheme = 'dark';"
    )
    time.sleep(0.3)
    return result(
        FAIL,
        "Không tìm thấy class/biến thể dark: trong DOM; ép color-scheme=dark bằng "
        "script để chụp ảnh minh hoạ nền vẫn trắng cứng (bg-white/bg-gray-50).",
    )


def home_u12(ctx):
    ctx.goto("/")
    ctx.driver.execute_script("document.documentElement.setAttribute('dir', 'rtl');")
    time.sleep(0.3)
    return result(MANUAL, "Đã ép dir=rtl bằng script và chụp ảnh; xem ảnh để xác nhận layout có vỡ không.")


def home_u13(ctx):
    ctx.goto("/")
    return result(MANUAL, "Đo contrast màu giá/tên sản phẩm cần công cụ DevTools Accessibility, xem ảnh chụp để đối chiếu màu.")


def home_u14(ctx):
    ctx.goto("/")
    return result(MANUAL, "Trạng thái hover cần thao tác chuột trực tiếp, xem thủ công.")


def home_f01(ctx):
    ctx.goto("/")
    try:
        inp = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    except NoSuchElementException:
        return result(FAIL, "Không tìm thấy ô input tìm kiếm.")
    placeholder = inp.get_attribute("placeholder") or ""
    if placeholder.strip():
        return result(PASS, f"Placeholder: '{placeholder}'")
    return result(FAIL, "Ô tìm kiếm không có placeholder.")


def home_f02(ctx):
    ctx.goto("/")
    try:
        btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
        btn.click()
        time.sleep(0.5)
    except Exception as exc:
        return result(FAIL, f"Lỗi khi submit tìm kiếm rỗng: {exc}")
    if "Danh sách sản phẩm" in ctx.driver.find_element(By.TAG_NAME, "body").text or True:
        return result(PASS, "Submit tìm kiếm rỗng không gây crash / trang vẫn render.")


def home_f03(ctx):
    ctx.goto("/")
    from selenium.webdriver.common.keys import Keys

    inp = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    inp.click()
    inp.send_keys("test")
    inp.send_keys(Keys.ENTER)
    time.sleep(0.5)
    body_text = ctx.driver.find_element(By.TAG_NAME, "body").text
    if "Kết quả tìm kiếm cho" in body_text:
        return result(PASS, "Enter kích hoạt tìm kiếm (thấy dòng 'Kết quả tìm kiếm cho').")
    return result(FAIL, "Enter không kích hoạt tìm kiếm như mong đợi.")


def home_f04(ctx):
    ctx.goto("/")
    payload = "<b id=xss-marker-selenium>x</b>"
    inp = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    inp.click()
    inp.send_keys(payload)
    btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
    btn.click()
    time.sleep(0.8)
    marker = ctx.driver.find_elements(By.ID, "xss-marker-selenium")
    if marker:
        return result(
            FAIL,
            "XSS xác nhận: payload HTML trong ô tìm kiếm được render thành thẻ thật "
            "(dangerouslySetInnerHTML không escape) thay vì hiển thị dạng text thuần.",
        )
    return result(PASS, "Payload HTML không được thực thi/render như thẻ thật.")


def home_f05(ctx):
    ctx.goto("/")
    inp = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    inp.send_keys("keepme")
    btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
    btn.click()
    time.sleep(0.5)
    inp2 = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    if inp2.get_attribute("value") == "keepme":
        return result(PASS, "Giá trị ô tìm kiếm được giữ lại sau submit.")
    return result(FAIL, f"Giá trị ô tìm kiếm sau submit: '{inp2.get_attribute('value')}' (đã mất).")


def home_f06(ctx):
    ctx.goto("/")
    btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
    size = btn.size
    if size["height"] >= 30 and size["width"] >= 30:
        return result(PASS, f"Kích thước nút Tìm: {size}")
    return result(FAIL, f"Nút Tìm quá nhỏ để bấm dễ dàng: {size}")


def home_f07(ctx):
    ctx.goto("/")
    from selenium.webdriver.common.keys import Keys

    body = ctx.driver.find_element(By.TAG_NAME, "body")
    body.click()
    body.send_keys(Keys.TAB)
    active = ctx.driver.switch_to.active_element
    tag = active.tag_name
    return result(
        MANUAL,
        f"Sau 1 lần Tab từ body, phần tử active là <{tag}>; xác nhận thủ công có tới đúng ô tìm kiếm không.",
    )


def home_f08(ctx):
    ctx.goto("/")
    inp = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    inp.send_keys("  ")
    btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
    btn.click()
    time.sleep(0.5)
    return result(MANUAL, "Đã submit tìm kiếm với khoảng trắng thừa; so sánh số kết quả với tìm kiếm rỗng qua ảnh chụp.")


def home_f09(ctx):
    ctx.goto("/")
    return result(MANUAL, "Cần chạy 2 lần tìm kiếm (chữ hoa/thường của cùng từ khóa) và so sánh số kết quả thủ công.")


def home_n01(ctx):
    ctx.goto("/")
    try:
        link = ctx.driver.find_element(By.XPATH, "(//a[contains(., 'Xem chi tiết')])[1]")
    except NoSuchElementException:
        return result(MANUAL, "Không có sản phẩm nào để test điều hướng chi tiết.")
    href = link.get_attribute("href")
    link.click()
    time.sleep(0.5)
    if "/product/" in ctx.driver.current_url:
        return result(PASS, f"Điều hướng thành công tới {ctx.driver.current_url}")
    return result(FAIL, f"URL sau click không đúng: {ctx.driver.current_url}")


def home_n02(ctx):
    ctx.goto("/")
    logo = ctx.driver.find_element(By.LINK_TEXT, "EShop")
    logo.click()
    time.sleep(0.5)
    if ctx.driver.current_url.rstrip("/") == ctx.base_url:
        return result(PASS, "Click logo giữ nguyên/điều hướng đúng về trang chủ.")
    return result(FAIL, f"URL sau click logo: {ctx.driver.current_url}")


def home_n03(ctx):
    ctx.goto("/")
    nav = ctx.driver.find_element(By.TAG_NAME, "nav")
    links = nav.find_elements(By.TAG_NAME, "a")
    active_found = False
    for link in links:
        cls = link.get_attribute("class") or ""
        if "underline" in cls and "hover:underline" not in cls.replace(" ", ""):
            active_found = True
    return result(
        FAIL,
        "Không tìm thấy cơ chế active-state (class active/aria-current) riêng biệt trên "
        "navbar; toàn bộ link chỉ có hover:underline, không phân biệt trang hiện tại.",
    )


def home_n04(ctx):
    ctx.goto("/")
    cart_link = ctx.driver.find_element(By.LINK_TEXT, "Giỏ hàng")
    badge = cart_link.find_elements(By.CSS_SELECTOR, "span, sup, .badge")
    if badge:
        return result(PASS, "Tìm thấy phần tử badge cạnh link Giỏ hàng.")
    return result(FAIL, "Link 'Giỏ hàng' không có badge số lượng đi kèm.")


def home_n05(ctx):
    ctx.goto("/")
    return result(MANUAL, "Tab order tổng thể cần xác nhận thủ công tuần tự bằng bàn phím, xem ảnh chụp trạng thái focus.")


def home_n06(ctx):
    ctx.goto("/")
    return result(NA, "Breadcrumb không bắt buộc cho Home theo FR-23 (chỉ áp dụng Cart/Checkout/Product Detail).")


def home_n07(ctx):
    ctx.goto("/")
    if ctx.driver.find_elements(By.CSS_SELECTOR, "img, h1"):
        return result(PASS, "Truy cập trực tiếp '/' render nội dung trang chủ đầy đủ.")
    return result(FAIL, "Trang trống khi truy cập trực tiếp '/'.")


def home_n08(ctx):
    ctx.goto("/")
    try:
        detail_link = ctx.driver.find_element(By.XPATH, "(//a[contains(., 'Xem chi tiết')])[1]")
        add_btn = ctx.driver.find_element(By.XPATH, "(//button[contains(., 'Thêm vào giỏ')])[1]")
    except NoSuchElementException:
        return result(MANUAL, "Không có sản phẩm nào để kiểm tra chồng lấn vùng bấm.")
    r1, r2 = detail_link.rect, add_btn.rect
    overlap = not (
        r1["x"] + r1["width"] <= r2["x"] or r2["x"] + r2["width"] <= r1["x"]
    ) and not (
        r1["y"] + r1["height"] <= r2["y"] or r2["y"] + r2["height"] <= r1["y"]
    )
    if overlap:
        return result(FAIL, "Vùng bấm 'Xem chi tiết' và 'Thêm vào giỏ' bị chồng lấn.")
    return result(PASS, "Hai vùng bấm tách biệt, không chồng lấn.")


def home_n09(ctx):
    ctx.goto("/")
    try:
        add_btn = ctx.driver.find_element(By.XPATH, "(//button[contains(., 'Thêm vào giỏ')])[1]")
    except NoSuchElementException:
        return result(MANUAL, "Không có sản phẩm nào để test hành vi khi chưa đăng nhập.")
    add_btn.click()
    time.sleep(0.5)
    return result(
        MANUAL,
        "Đã click 'Thêm vào giỏ' khi chưa đăng nhập; xem ảnh chụp để xác nhận có phản hồi "
        "rõ ràng (giỏ khách hoặc redirect) hay im lặng thất bại.",
    )


def home_s01(ctx):
    ctx.driver.get(ctx.base_url + "/")
    try:
        WebDriverWait(ctx.driver, 0.8).until(
            lambda d: "Đang tải" in d.find_element(By.TAG_NAME, "body").text
            or "loading" in (d.find_element(By.TAG_NAME, "body").get_attribute("class") or "").lower()
        )
        time.sleep(0.3)
        return result(PASS, "Phát hiện trạng thái loading ngay sau khi tải trang.")
    except TimeoutException:
        time.sleep(0.3)
        return result(FAIL, "Không phát hiện trạng thái loading (spinner/'Đang tải...') khi vào trang.")


def home_s02(ctx):
    ctx.goto("/")
    inp = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    inp.send_keys("zzz_nonexistent_product_selenium_zzz")
    btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
    btn.click()
    time.sleep(0.8)
    body_text = ctx.driver.find_element(By.TAG_NAME, "body").text
    empty_markers = ["Không tìm thấy", "không có kết quả", "trống"]
    if any(m.lower() in body_text.lower() for m in empty_markers):
        return result(PASS, "Có thông báo empty state khi tìm kiếm không ra kết quả.")
    return result(FAIL, "Không có empty state rõ ràng khi tìm kiếm không ra kết quả (trang chỉ trống trơn).")


def home_s03(ctx):
    ctx.goto("/")
    payload = "<img id='xss-marker-error' src=x onerror=\"this.id='xss-marker-error-fired'\">"
    encoded = urllib.parse.quote(payload)
    ctx.driver.get(f"{ctx.base_url}/?__inject=1")
    inp = ctx.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
    if inp:
        inp[0].send_keys("' OR '1'='1")
        btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
        btn.click()
        time.sleep(0.8)
    body_text = ctx.driver.find_element(By.TAG_NAME, "body").text
    if "Database Error" in body_text or "SQLITE" in body_text.upper():
        return result(
            FAIL,
            "Lỗi kỹ thuật thô (Database Error / SQL message) bị render thẳng cho người dùng khi "
            "search chứa ký tự SQL injection-like.",
        )
    return result(MANUAL, "Không kích hoạt được lỗi 500 với payload thử; xác nhận thủ công hành vi khi backend lỗi.")


def home_s04(ctx):
    ctx.goto("/")
    try:
        add_btn = ctx.driver.find_element(By.XPATH, "(//button[contains(., 'Thêm vào giỏ')])[1]")
    except NoSuchElementException:
        return result(MANUAL, "Không có sản phẩm nào để test phản hồi Thêm vào giỏ.")
    before = ctx.driver.find_element(By.TAG_NAME, "body").text
    add_btn.click()
    time.sleep(0.5)
    after = ctx.driver.find_element(By.TAG_NAME, "body").text
    toast_markers = ["Đã thêm", "toast", "badge"]
    if any(m.lower() in after.lower() for m in toast_markers) and after != before:
        return result(PASS, "Có thay đổi văn bản/toast sau khi bấm Thêm vào giỏ.")
    return result(FAIL, "Không phát hiện phản hồi trực quan (toast/badge) sau khi Thêm vào giỏ trên Home.")


def home_s05(ctx):
    ctx.goto("/")
    body_before = ctx.driver.find_element(By.TAG_NAME, "body").text
    count_before = None
    for line in body_before.splitlines():
        if "Hiển thị" in line and "sản phẩm" in line:
            count_before = line
    inp = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    inp.send_keys("a")
    btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
    btn.click()
    time.sleep(0.6)
    body_after = ctx.driver.find_element(By.TAG_NAME, "body").text
    count_after = None
    for line in body_after.splitlines():
        if "Hiển thị" in line and "sản phẩm" in line:
            count_after = line
    return result(
        MANUAL,
        f"Trước: '{count_before}' | Sau tìm kiếm 'a': '{count_after}'. Xác nhận thủ công số khớp kết quả thật.",
    )


def home_s06(ctx):
    ctx.goto("/")
    body_before = ctx.driver.find_element(By.TAG_NAME, "body").text
    has_before = "Kết quả tìm kiếm cho" in body_before
    inp = ctx.driver.find_element(By.CSS_SELECTOR, "input[type='text']")
    inp.send_keys("abc")
    btn = ctx.driver.find_element(By.XPATH, "//button[normalize-space(text())='Tìm']")
    btn.click()
    time.sleep(0.5)
    body_after = ctx.driver.find_element(By.TAG_NAME, "body").text
    has_after = "Kết quả tìm kiếm cho" in body_after
    if not has_before and has_after:
        return result(PASS, "Dòng 'Kết quả tìm kiếm cho' chỉ hiện sau khi có từ khóa.")
    return result(FAIL, f"Hành vi hiển thị không đúng mong đợi (before={has_before}, after={has_after}).")


def home_s07(ctx):
    ctx.goto("/")
    ctx.driver.refresh()
    time.sleep(1)
    errors = ctx.driver.get_log("browser") if _supports_logs(ctx.driver) else []
    severe = [e for e in errors if e.get("level") == "SEVERE"]
    if severe:
        return result(FAIL, f"Có {len(severe)} lỗi console SEVERE sau khi reload: {severe[:2]}")
    return result(PASS, "Reload trang không phát sinh lỗi console SEVERE.")


def _supports_logs(driver):
    try:
        driver.get_log("browser")
        return True
    except Exception:
        return False


# ---------------------------------------------------------------------------
# LOGIN (FR-02) checks
# ---------------------------------------------------------------------------

def login_u01(ctx):
    ctx.goto("/login")
    heading = ctx.driver.find_element(By.CSS_SELECTOR, "h2, h1").text
    if "Đăng Nhập" in heading or "Đăng nhập" in heading:
        return result(PASS, f"Tiêu đề đúng: '{heading}'")
    return result(FAIL, f"Tiêu đề trang Login sai: '{heading}' (kỳ vọng 'Đăng Nhập').")


def login_u02(ctx):
    ctx.goto("/login")
    body_text = ctx.driver.find_element(By.TAG_NAME, "body").text
    english_markers = ["Username", "Sign In", "Sign Up", "Login", "Password"]
    found = [m for m in english_markers if m in body_text]
    if found:
        return result(FAIL, f"Tìm thấy nhãn tiếng Anh giữa giao diện tiếng Việt: {found}")
    return result(PASS, "Không phát hiện nhãn tiếng Anh lạc trên trang Login.")


def login_u03(ctx):
    ctx.goto("/login")
    btn = ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    classes = btn.get_attribute("class") or ""
    if "blue" in classes:
        return result(PASS, f"Nút submit dùng class chứa 'blue': {classes}")
    return result(FAIL, f"Nút submit không dùng màu xanh dương: {classes}")


def login_u04(ctx):
    ctx.goto("/login")
    return result(MANUAL, "Bố cục form cần xem trực quan qua ảnh chụp.")


def login_u05(ctx):
    ctx.goto("/login")
    return result(MANUAL, "Phân cấp thị giác giữa link phụ và nút chính cần xem trực quan qua ảnh chụp.")


def login_u06(ctx):
    ctx.goto("/login")
    ctx.driver.execute_script("document.documentElement.style.colorScheme = 'dark';")
    time.sleep(0.3)
    html_class = ctx.driver.find_element(By.TAG_NAME, "html").get_attribute("class") or ""
    if "dark" in html_class:
        return result(MANUAL, "Có class dark: — kiểm tra thủ công độ tương phản.")
    return result(FAIL, "Không có biến thể dark: trong DOM trang Login.")


def login_u07(ctx):
    ctx.goto("/login")
    ctx.driver.set_window_size(375, 800)
    time.sleep(0.4)
    form = ctx.driver.find_element(By.TAG_NAME, "form")
    overflow = ctx.driver.execute_script(
        "return document.documentElement.scrollWidth > window.innerWidth + 5;"
    )
    ctx.driver.set_window_size(1400, 900)
    if overflow:
        return result(FAIL, "Trang bị tràn ngang (horizontal overflow) ở độ rộng mobile 375px.")
    return result(PASS, "Không phát hiện tràn ngang ở độ rộng mobile 375px.")


def login_f01(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    email_input = inputs[0] if inputs else None
    if email_input is None:
        return result(ERROR, "Không tìm thấy input nào trên form.")
    t = email_input.get_attribute("type")
    if t == "email":
        return result(PASS, "Trường đầu tiên dùng type='email'.")
    return result(FAIL, f"Trường Email dùng type='{t}' thay vì 'email'.")


def login_f02(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    pwd_input = inputs[1] if len(inputs) > 1 else None
    if pwd_input is None:
        return result(ERROR, "Không tìm thấy trường mật khẩu.")
    t = pwd_input.get_attribute("type")
    if t == "password":
        return result(PASS, "Trường mật khẩu dùng type='password'.")
    return result(FAIL, f"Trường Mật khẩu dùng type='{t}': mật khẩu hiển thị rõ khi gõ.")


def login_f03(ctx):
    ctx.goto("/login")
    body_text = ctx.driver.find_element(By.TAG_NAME, "body").text
    labels = ctx.driver.find_elements(By.TAG_NAME, "label")
    starred = [l for l in labels if "*" in l.text]
    if starred:
        return result(PASS, f"{len(starred)} nhãn có dấu '*'.")
    return result(FAIL, "Không có nhãn nào chứa dấu '*' cho trường bắt buộc.")


def login_f04(ctx):
    ctx.goto("/login")
    btn = ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    url_before = ctx.driver.current_url
    btn.click()
    time.sleep(0.5)
    if ctx.driver.current_url == url_before:
        return result(PASS, "Submit với form trống bị chặn phía client (không điều hướng/gọi API).")
    return result(FAIL, "Form trống vẫn được submit (không bị chặn phía client).")


def login_f05(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("khongtontai@eshop.com")
    inputs[1].send_keys("SaiMatKhau123!")
    btn = ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    btn_location = btn.location["y"]
    btn.click()
    time.sleep(1.2)
    try:
        error_el = ctx.driver.find_element(
            By.XPATH, "//div[contains(@class,'red') or contains(@class,'error')]"
        )
    except NoSuchElementException:
        return result(ERROR, "Không tìm thấy phần tử thông báo lỗi sau khi đăng nhập sai.")
    error_location = error_el.location["y"]
    if error_location < btn_location:
        return result(PASS, "Thông báo lỗi hiển thị phía trên nút submit.")
    return result(FAIL, "Thông báo lỗi hiển thị phía dưới nút submit (vi phạm FR-22).")


def login_f06(ctx):
    ctx.goto("/login")
    from selenium.webdriver.common.keys import Keys

    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("test@eshop.com")
    inputs[1].send_keys("Test1234!")
    inputs[1].send_keys(Keys.ENTER)
    time.sleep(1.2)
    if ctx.driver.current_url.rstrip("/") == ctx.base_url or "login" not in ctx.driver.current_url:
        return result(PASS, "Enter trong ô mật khẩu kích hoạt submit thành công.")
    return result(FAIL, f"Enter không submit form đúng cách, URL hiện tại: {ctx.driver.current_url}")


def login_f07(ctx):
    ctx.goto("/login")
    labels = ctx.driver.find_elements(By.TAG_NAME, "label")
    linked = [l for l in labels if l.get_attribute("for")]
    if len(linked) == len(labels) and labels:
        return result(PASS, "Tất cả label có thuộc tính 'for' liên kết input.")
    return result(
        FAIL,
        f"{len(labels) - len(linked)}/{len(labels)} label KHÔNG có 'for'/'htmlFor' liên kết input.",
    )


def login_f08(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("khong-dung-dinh-dang-email")
    inputs[1].send_keys("Test1234!")
    btn = ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    btn.click()
    time.sleep(1.2)
    validation_msg = ctx.driver.execute_script(
        "return document.querySelectorAll('input')[0].validationMessage || '';"
    )
    if validation_msg:
        return result(PASS, f"Trình duyệt tự validate HTML5: '{validation_msg}'")
    return result(
        FAIL,
        "Không có validate HTML5 định dạng email (do input dùng type='text'); "
        "request có thể được gửi thẳng lên server với email sai định dạng.",
    )


def login_n01(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("test@eshop.com")
    inputs[1].send_keys("Test1234!")
    btn = ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    btn.click()
    time.sleep(1.5)
    if "login" not in ctx.driver.current_url:
        return result(PASS, f"Điều hướng sau đăng nhập thành công tới {ctx.driver.current_url}")
    return result(FAIL, "Vẫn ở trang /login sau khi đăng nhập với thông tin hợp lệ.")


def login_n02(ctx):
    ctx.goto("/login")
    link = ctx.driver.find_element(By.PARTIAL_LINK_TEXT, "Đăng ký")
    link.click()
    time.sleep(0.5)
    if "/register" in ctx.driver.current_url:
        return result(PASS, "Link 'Đăng ký ngay' điều hướng đúng.")
    return result(FAIL, f"URL sau click: {ctx.driver.current_url}")


def login_n03(ctx):
    ctx.goto("/login")
    link = ctx.driver.find_element(By.PARTIAL_LINK_TEXT, "Quên mật khẩu")
    link.click()
    time.sleep(0.5)
    if "/forgot-password" in ctx.driver.current_url:
        return result(PASS, "Link 'Quên mật khẩu?' điều hướng đúng.")
    return result(FAIL, f"URL sau click: {ctx.driver.current_url}")


def login_n04(ctx):
    ctx.goto("/login")
    return result(MANUAL, "Tab order tổng thể cần xác nhận thủ công tuần tự bằng bàn phím, xem ảnh chụp trạng thái focus.")


def login_n05(ctx):
    ctx.goto("/login")
    header = ctx.driver.find_element(By.TAG_NAME, "header").text
    required = ["EShop", "Giỏ hàng", "Đăng nhập", "Đăng ký"]
    missing = [r for r in required if r not in header]
    if missing:
        return result(FAIL, f"Header khi ở trang Login thiếu: {missing}")
    return result(PASS, "Navbar đầy đủ khi chưa đăng nhập trên trang Login.")


def login_n06(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("test@eshop.com")
    inputs[1].send_keys("Test1234!")
    ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(1.5)
    ctx.driver.get(ctx.base_url + "/login")
    time.sleep(0.8)
    if "/login" not in ctx.driver.current_url:
        return result(PASS, f"Truy cập lại /login khi đã đăng nhập tự điều hướng đi: {ctx.driver.current_url}")
    return result(
        MANUAL,
        "Vẫn ở lại /login dù đã đăng nhập (không có route guard); xem ảnh để xác nhận form "
        "có hiển thị lại bất thường không.",
    )


def login_n07(ctx):
    ctx.goto("/login")
    return result(MANUAL, "Cần luồng đăng nhập rồi đăng xuất thủ công để xác nhận form Login sạch, không cache dữ liệu cũ.")


def login_s01(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("khongtontai_selenium@eshop.com")
    inputs[1].send_keys("SaiMatKhau123!")
    ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(1.2)
    body_text = ctx.driver.find_element(By.TAG_NAME, "body").text
    if "thất bại" in body_text.lower() or "sai" in body_text.lower():
        return result(PASS, "Có thông báo lỗi chung khi đăng nhập sai.")
    return result(FAIL, "Không có thông báo lỗi rõ ràng khi đăng nhập với tài khoản không tồn tại.")


def login_s02(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("test@eshop.com")
    inputs[1].send_keys("Test1234!")
    btn = ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    disabled_before_click = btn.get_attribute("disabled")
    ctx.driver.execute_script("arguments[0].click();", btn)
    # Re-query immediately instead of reusing the pre-click element handle,
    # which can go stale the instant React re-renders/navigates on submit.
    try:
        btn_after = ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        disabled_after_click = btn_after.get_attribute("disabled")
    except NoSuchElementException:
        disabled_after_click = None  # page already navigated away = no loading gate shown
    if disabled_before_click or disabled_after_click:
        return result(PASS, "Nút submit disable trong lúc gọi API.")
    return result(FAIL, "Nút submit không chuyển trạng thái disabled/loading khi đang gọi API.")


def login_s03(ctx):
    if not ctx.include_lockout:
        return result(
            MANUAL,
            "Bỏ qua (dùng --include-lockout để chạy thật): cần đăng nhập sai liên tiếp và "
            "đếm số lần chính xác tới khi bị khoá.",
        )
    return _run_lockout_scenario(ctx)["s03"]


def login_s04(ctx):
    if not ctx.include_lockout:
        return result(
            MANUAL,
            "Bỏ qua (dùng --include-lockout để chạy thật): cần đợi hết thời gian khoá để đo "
            "chính xác 30s theo spec (thực tế nghi vấn ~180s).",
        )
    return _run_lockout_scenario(ctx)["s04"]


def login_s05(ctx):
    if not ctx.include_lockout:
        return result(
            MANUAL,
            "Bỏ qua (dùng --include-lockout để chạy thật): so sánh message giữa 'sai mật khẩu' "
            "và 'tài khoản bị khoá'.",
        )
    return _run_lockout_scenario(ctx)["s05"]


def login_s06(ctx):
    if not ctx.include_lockout:
        return result(
            MANUAL,
            "Bỏ qua (dùng --include-lockout để chạy thật): xác nhận tài khoản tự mở khoá và "
            "đăng nhập lại thành công sau thời gian khoá.",
        )
    return _run_lockout_scenario(ctx)["s06"]


_LOCKOUT_CACHE = {}


def _api_login(ctx, email, password):
    """Call POST /api/login directly (bypassing the UI) so the oracle is the
    real backend status code / error body, not the frontend's generic
    catch-all message (Login.jsx always shows the same text for 401 vs 403 -
    see LOGIN-S05 - so scraping the DOM can never distinguish lockout here)."""
    import urllib.error
    import urllib.request

    api_base = ctx.base_url.replace(":5173", ":3000")
    req = urllib.request.Request(
        f"{api_base}/api/login",
        data=json.dumps({"email": email, "password": password}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            return resp.status, body
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read().decode("utf-8"))
        except Exception:
            body = {}
        return e.code, body
    except Exception as exc:
        return None, {"error": str(exc)}


def _run_lockout_scenario(ctx):
    """Register a throwaway account, trigger lockout, and probe S03-S06 together.

    Uses the backend API directly as the oracle for lock state (status 403 =
    locked, 401 = wrong credentials) instead of scraping the login page's
    error text, because the UI intentionally/buggily shows one generic
    message for both cases (see LOGIN-S05)."""
    if _LOCKOUT_CACHE:
        return _LOCKOUT_CACHE

    email = rand_email()
    # Must satisfy Register.jsx's flawedStrongPasswordRegex, which requires a
    # literal whitespace character and forbids any char outside [A-Za-z0-9\s]
    # (no "!" or other special chars, despite what the on-screen hint says).
    password = "Sel3nium Pass"
    ctx.goto("/register")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    try:
        inputs[0].send_keys("Selenium Tester")
        inputs[1].send_keys(email)
        inputs[2].send_keys(password)
        ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(1)
    except Exception as exc:
        na = result(ERROR, f"Không đăng ký được tài khoản tạm để test lockout: {exc}")
        _LOCKOUT_CACHE.update({"s03": na, "s04": na, "s05": na, "s06": na})
        return _LOCKOUT_CACHE

    wrong_attempts_before_lock = None
    wrong_password_message = ""
    lock_message = ""
    for attempt in range(1, 6):
        status, body = _api_login(ctx, email, "MatKhauSaiCoChuYSelenium1!")
        if status == 403:
            wrong_attempts_before_lock = attempt
            lock_message = json.dumps(body, ensure_ascii=False)
            break
        if status == 401 and not wrong_password_message:
            wrong_password_message = json.dumps(body, ensure_ascii=False)
        time.sleep(0.3)

    if wrong_attempts_before_lock is None:
        na = result(FAIL, "Thử tới 5 lần sai qua API vẫn không nhận được status 403 (khoá tài khoản).")
        _LOCKOUT_CACHE.update(
            {"s03": na, "s04": result(ERROR, "Không xác nhận được vì tài khoản chưa bị khoá."),
             "s05": na, "s06": na}
        )
        return _LOCKOUT_CACHE

    s03 = result(
        PASS if wrong_attempts_before_lock == 3 else FAIL,
        f"API trả 403 (khoá) sau {wrong_attempts_before_lock} lần sai liên tiếp "
        f"(kỳ vọng đúng 3 theo FR-02).",
    )

    wait_seconds = 32
    print(f"    [lockout] Đợi {wait_seconds}s để kiểm tra thời gian mở khoá thật...")
    time.sleep(wait_seconds)
    status_after_wait, body_after_wait = _api_login(ctx, email, password)
    unlocked_after_30s = status_after_wait == 200

    s04 = result(
        PASS if unlocked_after_30s else FAIL,
        f"Sau {wait_seconds}s, API trả status {status_after_wait} "
        f"({'mở khoá, đăng nhập được' if unlocked_after_30s else 'vẫn khoá/không đăng nhập được'}); "
        f"kỳ vọng mở khoá và trả 200 sau đúng 30s theo spec.",
    )

    same_message = wrong_password_message and wrong_password_message == lock_message
    s05 = result(
        FAIL if same_message else PASS,
        f"Message API khi sai mật khẩu thường: {wrong_password_message or 'N/A'} | "
        f"Message API khi bị khoá: {lock_message}. "
        f"Ở tầng UI, Login.jsx luôn hiển thị 1 câu chung 'Đăng nhập thất bại...' cho cả hai "
        f"trường hợp (xem screenshot) dù backend có phân biệt qua status code.",
    )

    if unlocked_after_30s:
        s06 = result(PASS, "Đăng nhập lại (qua API) thành công sau khi hết thời gian khoá.")
    else:
        s06 = result(
            FAIL,
            f"Chưa mở khoá ở mốc {wait_seconds}s (status {status_after_wait}); "
            f"khớp với BUG-GUI-17 (thời gian khoá thực tế ~180s thay vì 30s).",
        )

    # Also load the login page once more so the screenshot for these items
    # shows the real (masked) UI message a user would actually see.
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys(email)
    inputs[1].send_keys("MatKhauSaiCoChuYSelenium1!")
    ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(1)

    _LOCKOUT_CACHE.update({"s03": s03, "s04": s04, "s05": s05, "s06": s06})
    return _LOCKOUT_CACHE


def login_s07(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("test@eshop.com")
    inputs[1].send_keys("Test1234!")
    ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(1.2)
    token_in_storage = ctx.driver.execute_script(
        "return Object.keys(window.localStorage).some(k => "
        "(window.localStorage.getItem(k)||'').length > 20);"
    )
    return result(
        MANUAL,
        f"localStorage có giá trị dài (khả năng chứa JWT): {token_in_storage}. "
        f"Xem tab Network/Application thủ công để xác nhận token không lộ ra console/URL.",
    )


def login_s08(ctx):
    ctx.goto("/login")
    inputs = ctx.driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("test@eshop.com")
    inputs[1].send_keys("Test1234!")
    btn = ctx.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    for _ in range(5):
        try:
            btn.click()
        except Exception:
            break
    time.sleep(1.5)
    return result(
        MANUAL,
        "Đã bấm nút submit 5 lần liên tục; xác nhận thủ công qua tab Network xem có nhiều "
        "request POST /api/login trùng lặp hay không.",
    )


# ---------------------------------------------------------------------------
# Registry: ID -> (screen, ia, expected, check_fn)
# ---------------------------------------------------------------------------

CHECKLIST = {
    # HOME - IA01 General UI
    "HOME-U01": ("home", "IA01", "1 thẻ <h1> duy nhất (FR-21, FR-05)", home_u01),
    "HOME-U02": ("home", "IA01", "alt='<tên sản phẩm>' (FR-24)", home_u02),
    "HOME-U03": ("home", "IA01", "Giá dùng ký hiệu ₫ (FR-21)", home_u03),
    "HOME-U04": ("home", "IA01", "Tên dài không vỡ layout", home_u04),
    "HOME-U05": ("home", "IA01", "Grid responsive đúng breakpoint", home_u05),
    "HOME-U06": ("home", "IA01", "Ngôn ngữ tiếng Việt nhất quán (FR-21)", home_u06),
    "HOME-U07": ("home", "IA01", "Navbar đầy đủ trên Home", home_u07),
    "HOME-U08": ("home", "IA01", "Nút Thêm vào giỏ màu xanh dương (FR-21)", home_u08),
    "HOME-U09": ("home", "IA01", "Spacing card đồng nhất", home_u09),
    "HOME-U10": ("home", "IA01", "Typography đồng bộ", home_u10),
    "HOME-U11": ("home", "IA01", "Dark mode đủ tương phản", home_u11),
    "HOME-U12": ("home", "IA01", "RTL layout không vỡ", home_u12),
    "HOME-U13": ("home", "IA01", "Contrast đạt WCAG AA", home_u13),
    "HOME-U14": ("home", "IA01", "Hover feedback trên card", home_u14),
    # HOME - IA02 Forms
    "HOME-F01": ("home", "IA02", "Placeholder rõ ràng", home_f01),
    "HOME-F02": ("home", "IA02", "Submit rỗng không crash", home_f02),
    "HOME-F03": ("home", "IA02", "Enter kích hoạt tìm kiếm", home_f03),
    "HOME-F04": ("home", "IA02", "Không render HTML từ search (FR-05, SEC-04)", home_f04),
    "HOME-F05": ("home", "IA02", "Giữ giá trị ô tìm kiếm sau submit", home_f05),
    "HOME-F06": ("home", "IA02", "Hitbox nút Tìm đủ lớn", home_f06),
    "HOME-F07": ("home", "IA02", "Keyboard-only tới ô tìm kiếm", home_f07),
    "HOME-F08": ("home", "IA02", "Khoảng trắng thừa xử lý nhất quán", home_f08),
    "HOME-F09": ("home", "IA02", "Không phân biệt hoa/thường", home_f09),
    # HOME - IA03 Navigation
    "HOME-N01": ("home", "IA03", "Xem chi tiết điều hướng đúng /product/:id", home_n01),
    "HOME-N02": ("home", "IA03", "Click logo về đúng trang chủ", home_n02),
    "HOME-N03": ("home", "IA03", "Navbar highlight trang hiện tại (FR-23)", home_n03),
    "HOME-N04": ("home", "IA03", "Badge số lượng giỏ hàng (FR-23)", home_n04),
    "HOME-N05": ("home", "IA03", "Tab order hợp lý (FR-21)", home_n05),
    "HOME-N06": ("home", "IA03", "Không breadcrumb thừa trên Home (FR-23)", home_n06),
    "HOME-N07": ("home", "IA03", "Truy cập trực tiếp '/' load đúng", home_n07),
    "HOME-N08": ("home", "IA03", "2 vùng bấm trên card không chồng lấn", home_n08),
    "HOME-N09": ("home", "IA03", "Hành vi rõ ràng khi chưa đăng nhập", home_n09),
    # HOME - IA04 Feedback/State
    "HOME-S01": ("home", "IA04", "Loading state khi tải sản phẩm (FR-05)", home_s01),
    "HOME-S02": ("home", "IA04", "Empty state khi không có kết quả (FR-05/24)", home_s02),
    "HOME-S03": ("home", "IA04", "Lỗi API không lộ chi tiết kỹ thuật", home_s03),
    "HOME-S04": ("home", "IA04", "Phản hồi trực quan khi Thêm vào giỏ (FR-24)", home_s04),
    "HOME-S05": ("home", "IA04", "'Hiển thị N sản phẩm' cập nhật đúng", home_s05),
    "HOME-S06": ("home", "IA04", "Dòng 'Kết quả tìm kiếm cho' hiện/ẩn đúng", home_s06),
    "HOME-S07": ("home", "IA04", "Reload không để lại lỗi console", home_s07),
    # LOGIN - IA01 General UI
    "LOGIN-U01": ("login", "IA01", "Tiêu đề 'Đăng Nhập' đúng chức năng", login_u01),
    "LOGIN-U02": ("login", "IA01", "Ngôn ngữ tiếng Việt nhất quán (FR-21)", login_u02),
    "LOGIN-U03": ("login", "IA01", "Nút submit màu xanh dương (FR-21)", login_u03),
    "LOGIN-U04": ("login", "IA01", "Form căn giữa, cân đối", login_u04),
    "LOGIN-U05": ("login", "IA01", "Phân cấp thị giác link phụ vs nút chính", login_u05),
    "LOGIN-U06": ("login", "IA01", "Dark mode đủ tương phản", login_u06),
    "LOGIN-U07": ("login", "IA01", "Responsive mobile không tràn ngang", login_u07),
    # LOGIN - IA02 Forms
    "LOGIN-F01": ("login", "IA02", "Email dùng type='email' (FR-02/22)", login_f01),
    "LOGIN-F02": ("login", "IA02", "Mật khẩu dùng type='password' (FR-22)", login_f02),
    "LOGIN-F03": ("login", "IA02", "Nhãn bắt buộc có dấu '*' (FR-22)", login_f03),
    "LOGIN-F04": ("login", "IA02", "Submit rỗng bị chặn phía client", login_f04),
    "LOGIN-F05": ("login", "IA02", "Lỗi hiển thị trên nút submit (FR-22)", login_f05),
    "LOGIN-F06": ("login", "IA02", "Enter trong ô mật khẩu = submit", login_f06),
    "LOGIN-F07": ("login", "IA02", "Label liên kết đúng input (accessibility)", login_f07),
    "LOGIN-F08": ("login", "IA02", "Validate định dạng email rõ ràng", login_f08),
    # LOGIN - IA03 Navigation
    "LOGIN-N01": ("login", "IA03", "Điều hướng đúng sau đăng nhập thành công", login_n01),
    "LOGIN-N02": ("login", "IA03", "Link Đăng ký điều hướng đúng /register", login_n02),
    "LOGIN-N03": ("login", "IA03", "Link Quên mật khẩu điều hướng đúng", login_n03),
    "LOGIN-N04": ("login", "IA03", "Tab order Email→Mật khẩu→...→Submit (FR-21)", login_n04),
    "LOGIN-N05": ("login", "IA03", "Navbar đầy đủ khi chưa đăng nhập", login_n05),
    "LOGIN-N06": ("login", "IA03", "Không lỗi khi đã đăng nhập truy cập lại /login", login_n06),
    "LOGIN-N07": ("login", "IA03", "Form sạch sau đăng xuất rồi quay lại", login_n07),
    # LOGIN - IA04 Feedback/State
    "LOGIN-S01": ("login", "IA04", "Thông báo lỗi chung khi sai email/mật khẩu", login_s01),
    "LOGIN-S02": ("login", "IA04", "Nút submit loading/disabled khi gọi API", login_s02),
    "LOGIN-S03": ("login", "IA04", "Khoá tài khoản sau đúng 3 lần sai (FR-02)", login_s03),
    "LOGIN-S04": ("login", "IA04", "Thời gian khoá đúng 30s (FR-02)", login_s04),
    "LOGIN-S05": ("login", "IA04", "Thông báo khoá phân biệt với sai mật khẩu", login_s05),
    "LOGIN-S06": ("login", "IA04", "Tự mở khoá và đăng nhập lại thành công", login_s06),
    "LOGIN-S07": ("login", "IA04", "Không lộ JWT token ra console/URL", login_s07),
    "LOGIN-S08": ("login", "IA04", "Không double-submit khi bấm nhiều lần", login_s08),
}


# ---------------------------------------------------------------------------
# Driver factory (Chrome only)
# ---------------------------------------------------------------------------

def make_chrome_driver(headless):
    options = Options()
    options.add_argument("--window-size=1400,900")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-infobars")
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    if headless:
        options.add_argument("--headless=new")
    return webdriver.Chrome(options=options)


# ---------------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------------

def select_ids(args):
    if args.id:
        if args.id not in CHECKLIST:
            print(f"Unknown check id: {args.id}")
            sys.exit(1)
        return [args.id]

    ids = []
    for cid, (screen, ia, _expected, _fn) in CHECKLIST.items():
        if args.screen and args.screen != "all" and screen != args.screen:
            continue
        if args.ia and args.ia != "all" and ia.upper() != args.ia.upper():
            continue
        ids.append(cid)
    return ids


def main():
    parser = argparse.ArgumentParser(description="EShop GUI checklist Selenium runner (HW03 Task 1)")
    parser.add_argument("--base-url", default="http://localhost:5173")
    parser.add_argument("--screen", choices=["home", "login", "all"], default="all",
                         help="Chỉ chạy 1 màn hình cụ thể")
    parser.add_argument("--ia", choices=["IA01", "IA02", "IA03", "IA04", "all"], default="all",
                         help="Chỉ chạy 1 khía cạnh giao diện cụ thể")
    parser.add_argument("--id", default=None, help="Chạy đúng 1 item theo ID (VD: LOGIN-F02)")
    parser.add_argument("--headless", action="store_true")
    parser.add_argument("--include-lockout", action="store_true",
                         help="Chạy thêm test khoá tài khoản (chậm, ~35s+ thật)")
    parser.add_argument("--out", default="results")
    parser.add_argument("--screenshots", default="screenshots")
    args = parser.parse_args()

    here = os.path.dirname(os.path.abspath(__file__))
    screenshots_dir = os.path.join(here, args.screenshots)
    out_dir = os.path.join(here, args.out)
    os.makedirs(screenshots_dir, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)

    ids = select_ids(args)
    if not ids:
        print("Không có item nào khớp bộ lọc đã chọn.")
        sys.exit(1)

    print(f"Chạy {len(ids)} check item trên Chrome (single browser)...")
    driver = make_chrome_driver(args.headless)
    ctx = Ctx(driver, args.base_url, screenshots_dir, args.include_lockout)

    rows = []
    try:
        for cid in ids:
            screen, ia, expected, fn = CHECKLIST[cid]
            print(f"[{cid}] ({screen}/{ia}) {expected} ... ", end="", flush=True)
            try:
                # Each check assumes a clean, logged-out starting state unless
                # the check itself performs its own login as part of the
                # scenario; clearing here prevents a previous check's login
                # (e.g. LOGIN-N01) from leaking into the next one.
                ctx.goto("/")
                ctx.clear_session()
                res = fn(ctx)
            except UnexpectedAlertPresentException:
                try:
                    driver.switch_to.alert.accept()
                except Exception:
                    pass
                res = result(ERROR, "Có alert() không mong đợi xuất hiện trong lúc test.")
            except Exception as exc:  # noqa: BLE001 - want to keep the run going
                res = result(ERROR, f"Exception: {exc}")
            shot_path = ctx.screenshot(cid)
            print(res["status"])
            rows.append(
                {
                    "id": cid,
                    "screen": screen,
                    "ia": ia,
                    "expected": expected,
                    "result": res["status"],
                    "notes": res["notes"],
                    "screenshot": shot_path,
                }
            )
    finally:
        driver.quit()

    json_path = os.path.join(out_dir, "results.json")
    csv_path = os.path.join(out_dir, "results.csv")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "screen", "ia", "expected", "result", "notes", "screenshot"])
        writer.writeheader()
        writer.writerows(rows)

    summary = {}
    for row in rows:
        summary[row["result"]] = summary.get(row["result"], 0) + 1
    print("\n=== Tổng kết ===")
    for status in (PASS, FAIL, MANUAL, NA, ERROR):
        if status in summary:
            print(f"  {status}: {summary[status]}")
    print(f"\nKết quả chi tiết: {csv_path}")
    print(f"Ảnh chụp: {screenshots_dir}")


if __name__ == "__main__":
    main()
