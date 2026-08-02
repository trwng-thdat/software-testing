#!/usr/bin/env python3
"""
Dán overlay định danh lên ảnh chụp Task 3 (HW03).

Đề bài §6 và §11 yêu cầu mỗi ảnh cross-platform phải hiển thị rõ MSSV, tên
nền tảng và URL của SUT. Ảnh chụp tay từ iPhone không có sẵn overlay đó, nên
script này dán vào sau.

Overlay được vẽ thành một dải mới ở PHÍA TRÊN ảnh gốc thay vì đè lên nội dung
— giữ nguyên toàn bộ phần chụp màn hình, tránh che mất bằng chứng.

Cách dùng:
    python add_overlay.py                  # xử lý mọi ảnh P3-*.jpg trong screenshots/
    python add_overlay.py P3-CB-06.jpg     # chỉ xử lý ảnh chỉ định

Ảnh gốc được sao lưu sang screenshots/_original/ trước khi ghi đè.
"""

import os
import sys
import glob
import shutil

from PIL import Image, ImageDraw, ImageFont

# --- Thông tin định danh (§6, §11) ------------------------------------------
STUDENT_ID = "23127344@hcmus.edu.vn"
PLATFORM = "P3 · Safari / iPhone (WebKit)"
SUT_URL = "https://note-life.trycloudflare.com"  # Cloudflare Tunnel; trùng với thanh địa chỉ Safari trong ảnh

# --- Bối cảnh riêng từng case, in thêm dòng thứ tư -------------------------
CASE_NOTE = {
    "CB-01": "CB-01 · ProductDetail · CSS nesting (@media lồng)",
    "CB-05": "CB-05 · ProductDetail · Ô số lượng thiếu min/max/step",
    "CB-06": "CB-06 · Cart · Định dạng tiền tệ theo locale",
    "CB-08": "CB-08 · Checkout · Tổng tiền sửa được phía client",
    "CB-13": "CB-13 · Profile · alert() chặn luồng",
    "CB-18": "CB-18 · Cart · Vùng bấm dưới 44×44px",
}

HERE = os.path.dirname(os.path.abspath(__file__))
SHOT_DIR = os.path.join(HERE, "screenshots")
BACKUP_DIR = os.path.join(SHOT_DIR, "_original")

BG = (17, 17, 17)
GREEN = (0, 255, 0)
YELLOW = (255, 255, 0)
BLUE = (108, 204, 255)
GREY = (170, 170, 170)


def load_font(size, bold=False):
    """Tìm một font monospace có sẵn trên máy; lùi về font mặc định nếu không có."""
    candidates = [
        "consolab.ttf" if bold else "consola.ttf",
        "cour.ttf",
        "DejaVuSansMono-Bold.ttf" if bold else "DejaVuSansMono.ttf",
        "arialbd.ttf" if bold else "arial.ttf",
    ]
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def add_overlay(path):
    img = Image.open(path).convert("RGB")
    w, h = img.size

    # Cỡ chữ tỉ lệ theo chiều rộng ảnh để overlay đọc được ở mọi độ phân giải.
    s_id = max(28, w // 26)      # MSSV — to nhất, đây là thứ §11 bắt buộc đọc được
    s_txt = max(20, w // 40)
    s_url = max(16, w // 52)

    f_id = load_font(s_id, bold=True)
    f_txt = load_font(s_txt, bold=True)
    f_url = load_font(s_url)

    pad = max(12, w // 64)
    gap = max(6, w // 150)
    band = pad * 2 + s_id + s_txt + s_url * 2 + gap * 3

    case = next((c for c in CASE_NOTE if c in os.path.basename(path)), None)
    note = CASE_NOTE.get(case, "")

    out = Image.new("RGB", (w, h + band), BG)
    out.paste(img, (0, band))

    d = ImageDraw.Draw(out)
    y = pad
    d.text((pad, y), STUDENT_ID, font=f_id, fill=GREEN);   y += s_id + gap
    d.text((pad, y), PLATFORM,   font=f_txt, fill=YELLOW); y += s_txt + gap
    d.text((pad, y), "SUT: " + SUT_URL, font=f_url, fill=BLUE); y += s_url + gap
    if note:
        d.text((pad, y), note, font=f_url, fill=GREY)

    # Vạch phân cách giữa overlay và ảnh gốc.
    d.rectangle([0, band - 4, w, band - 1], fill=GREEN)

    out.save(path, quality=92)
    return w, h, band


def main():
    if not os.path.isdir(SHOT_DIR):
        sys.exit(f"Khong tim thay thu muc: {SHOT_DIR}")

    args = sys.argv[1:]
    if args:
        files = [os.path.join(SHOT_DIR, a) for a in args]
    else:
        files = sorted(glob.glob(os.path.join(SHOT_DIR, "P3-*.jpg")))

    if not files:
        sys.exit("Khong co anh P3-*.jpg nao de xu ly.")

    if SUT_URL.startswith("https://<"):
        print("!! CANH BAO: SUT_URL van la placeholder.")
        print("   Sua bien SUT_URL o dau file thanh URL tunnel that roi chay lai.\n")

    os.makedirs(BACKUP_DIR, exist_ok=True)
    for f in files:
        if not os.path.exists(f):
            print(f"  bo qua (khong ton tai): {os.path.basename(f)}")
            continue
        backup = os.path.join(BACKUP_DIR, os.path.basename(f))
        if not os.path.exists(backup):
            shutil.copy2(f, backup)
        w, h, band = add_overlay(f)
        print(f"  {os.path.basename(f):16} {w}x{h} -> {w}x{h + band}  (+{band}px overlay)")

    print(f"\nXong {len(files)} anh. Ban goc luu tai: screenshots/_original/")


if __name__ == "__main__":
    main()
