# EShop GUI Checklist — Selenium Automation (HW03 Task 1)

Tự động hoá **69 item checklist** GUI của `Main_Report.md` (Task 1 — Product List/Home + Login),
chạy trên **1 trình duyệt duy nhất (Chrome)**, tự chụp ảnh màn hình cho từng item, và in kết quả
PASS / FAIL / MANUAL / ERROR ra console + file JSON/CSV.

> Script chỉ tự động hoá được các item **có thể kiểm tra qua DOM/HTTP** (thẻ `<h1>`, `alt`, `type`, class
> màu, điều hướng, trạng thái loading/empty/error...). Các item mang tính **cảm quan/chủ quan** (spacing
> đều, typography đẹp, contrast đo bằng mắt...) được đánh dấu `MANUAL` — script vẫn chụp ảnh màn hình
> tương ứng để bạn tự đánh giá, đúng tinh thần "Human review" của đề bài.

## 1. Cài đặt

Yêu cầu: Python ≥ 3.9, Google Chrome đã cài trên máy (script dùng Selenium Manager có sẵn trong
Selenium ≥ 4.6 để tự tải `chromedriver` phù hợp — không cần cài driver thủ công).

```bash
cd selenium
python -m venv .venv          # tuỳ chọn nhưng khuyến khích
.venv\Scripts\activate         # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 2. Chạy trước khi test

Đảm bảo SUT đang chạy:

```
backend   -> http://localhost:3000
frontend-web -> http://localhost:5173
```

(Xem `hw4/docs/eshop-sut` hoặc `group05_eshop` để biết cách khởi động `npm run dev` / `node server.js`.)

## 3. Cách chạy

Chạy toàn bộ 69 item (2 màn hình × 4 IA):

```bash
python run_checklist.py
```

Chạy chỉ 1 khía cạnh giao diện (IA) cụ thể, trên cả 2 màn hình:

```bash
python run_checklist.py --ia IA01
python run_checklist.py --ia IA02
python run_checklist.py --ia IA03
python run_checklist.py --ia IA04
```

Chạy chỉ 1 màn hình (screen) cụ thể, tất cả IA:

```bash
python run_checklist.py --screen home
python run_checklist.py --screen login
```

Kết hợp cả hai (VD: chỉ IA04 của màn Login):

```bash
python run_checklist.py --screen login --ia IA04
```

Chạy 1 item cụ thể theo ID (debug nhanh 1 dòng):

```bash
python run_checklist.py --id LOGIN-F02
```

Các cờ khác:

| Cờ                  | Mặc định                | Ý nghĩa                                                                                                                                |
| ------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `--base-url`        | `http://localhost:5173` | Gốc URL của `frontend-web`                                                                                                             |
| `--headless`        | tắt                     | Chạy Chrome ẩn (không mở cửa sổ)                                                                                                       |
| `--include-lockout` | tắt                     | Bật thêm test khoá tài khoản (LOGIN-S03/S04/S05/S06) — **tốn ~3-4 phút thật** vì phải chờ hết thời gian khoá để verify mở khoá tự động |
| `--out`             | `results`               | Thư mục xuất `results.json` / `results.csv`                                                                                            |
| `--screenshots`     | `screenshots`           | Thư mục lưu ảnh chụp                                                                                                                   |

## 4. Đầu ra

- `screenshots/<ID>.png` — ảnh chụp toàn trang tại thời điểm kiểm tra item đó (chụp cho **mọi** item,
  kể cả PASS, để đối chiếu khi viết báo cáo — đề bài chỉ bắt buộc đính screenshot cho item FAIL, ảnh còn
  lại có thể bỏ qua khi nộp).
- `results/results.json`, `results/results.csv` — bảng kết quả full (ID, Screen, IA, Expected, Result,
  Notes, Screenshot path) — dùng để dán ngược vào cột `Result`/`Notes` của `Main_Report.md` và
  `hw3/checklist/GUI_Checklist.csv`.
- Console log tiến trình theo từng item khi chạy.

## 5. Sinh báo cáo (HTML + Markdown)

Sau khi chạy `run_checklist.py`, sinh báo cáo tổng hợp từ `results/results.json`:

```bash
python generate_report.py
```

Xuất ra:

- `report/report.md` — báo cáo Markdown, phân nhóm theo trạng thái PASS/FAIL/MANUAL/N/A,
  link trực tiếp tới từng ảnh chụp (copy `screenshots/*.png` vào `report/screenshots/` để link hoạt động,
  hoặc mở `index.html` từ trong thư mục `selenium/` nơi `screenshots/` đã có sẵn).
- `report/report.md` — bản Markdown tương đương, chia theo từng nhóm màn hình × IA, dùng để copy thẳng
  vào báo cáo chính.

## 6. Đối chiếu với báo cáo

ID trong script khớp 1-1 với ID trong `Main_Report.md` (VD: `HOME-U01`, `LOGIN-F02`, ...). Sau khi
chạy xong, mở `report/report.md` (hoặc `results/results.csv`), copy cột `Result` + `Notes` dán vào bảng
tương ứng trong báo cáo, rồi đính screenshot cho các dòng FAIL.

## 7. Giới hạn đã biết

- Các item **N/A theo phạm vi** (VD `HOME-N06` — breadcrumb không áp dụng cho Home) được script trả
  thẳng `N/A`, không thao tác trình duyệt.
- Test khoá tài khoản (`--include-lockout`) sẽ tạo 1 tài khoản test tạm qua `/register` (email
  ngẫu nhiên) rồi cố tình đăng nhập sai liên tiếp — không chạm tới tài khoản `test@eshop.com`/`admin@eshop.com` có sẵn.
- Script test XSS (`HOME-F04`, `HOME-S03`) bằng payload **vô hại**, chỉ set `document.title` để phát
  hiện script có thực thi hay không, không có hành vi tấn công thật.
