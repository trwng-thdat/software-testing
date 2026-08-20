# HW06 — Bằng chứng ảnh chụp

MSSV 23127344. Thư mục này chứa ảnh chụp. Chia làm hai loại: **tự động** (Selenium chụp được, đã có) và **phải chụp tay** (app desktop / terminal / trang web cần đăng nhập).

Sinh lại toàn bộ phần tự động:

```bash
python hw6/scripts/capture_evidence.py     # cần SUT đang chạy cho ảnh sut_localhost_*
```

---

## A. Đã tự động chụp — 24 ảnh, không cần làm gì thêm

| Ảnh | Chứng minh điều gì | Dùng ở § |
| --- | --- | --- |
| `newman_api1_summary.png`<br>`newman_api2_summary.png`<br>`newman_api3_summary.png` | Tiêu đề có MSSV, tổng assertion (224 / 239 / 557), **0 failed**, tên environment `EShop_HW06_local`, ngày giờ chạy | §4.4, §5.4, §6.4 |
| `newman_api{1,2,3}_hostname.png` | **`Request URL: http://localhost:3000/...`** — yêu cầu chống gian lận §11 về hostname | §11 |
| `newman_api{1,2,3}_xstudentid_header.png` | Bảng REQUEST HEADERS có dòng **`X-Student-Id  23127344`** đi kèm request, cùng khung với URL localhost | §2, §11 |
| `newman_spec_bugs_summary.png` | Folder SPEC: 73 assertion, **22 failed** | §6.11, §10 |
| `newman_spec_bugs_failed.png` | Danh sách **từng assertion fail** kèm thông báo `expected … to deeply equal …` — bằng chứng chi tiết cho 17 lỗi | §10 |
| `newman_data_api{1,2,3}_summary.png` | 3 lần chạy theo dữ liệu, mỗi lần 6 iteration từ CSV | §7 mục 22 |
| `newman_data_api{1,2,3}_hostname.png`<br>`newman_data_api{1,2,3}_xstudentid_header.png` | Hostname và header cho cả các lần chạy data-driven | §11 |
| `console_xstudentid_extract.png` | Trích 40 đoạn log console của Newman có dòng `[X-Student-Id] 23127344 -> METHOD url` | §2 |
| `sut_localhost_products.png` | SUT thật đang phục vụ ở `http://localhost:3000` | §2 |

> `console_xstudentid_extract.png` được render từ file log, **không** thay thế được ảnh chụp terminal thật hay Postman Console. Xem mục B1 và B2.

---

## B. Phải chụp tay — 8 ảnh

Selenium chỉ điều khiển được trình duyệt. Postman là app desktop, terminal không phải trang web, còn GitHub thì cần đăng nhập.

### B1. Postman Console cho thấy `X-Student-Id` — **BẮT BUỘC** (đề §11)

Đây là ảnh đề bài đòi đích danh: *"được chứng minh bằng ảnh chụp màn hình console từ pre-request script của bạn"*.

1. Mở app Postman → tạo workspace `HW06 — EShop API Testing (23127344)` → **Import** 3 file `.json` trong `hw6/postman/`.
2. Chọn environment `EShop_HW06_local` (góc trên phải).
3. Mở **Console**: `Ctrl + Alt + C` (hoặc View → Show Postman Console).
4. Chạy request `00 - Setup / SETUP-01`, rồi chạy `API1 / TC-API1-029` (test leo thang quyền).
5. Trong Console sẽ thấy dòng `[X-Student-Id] 23127344 -> PUT http://localhost:3000/api/users/me`.
6. Chụp **cả cửa sổ Postman** để thấy đồng thời: tên workspace, request đang chạy, và dòng log.

Lưu thành → `postman_console_xstudentid.png`

### B2. Newman CLI trong terminal, thấy hostname — **BẮT BUỘC** (đề §11)

Chạy đúng lệnh này để output ngắn, vừa một màn hình:

```bash
node hw6/scripts/reset_db.js
newman run hw6/postman/EShop_HW06_API.postman_collection.json \
  -e hw6/postman/EShop_HW06.postman_environment.json \
  -g hw6/postman/EShop_HW06.postman_globals.json \
  --folder "00 - Setup (dang nhap, tao user B, tu ky token gia mao)" \
  -r cli
```

Chụp terminal sao cho thấy được: dòng `POST http://localhost:3000/api/login [200 OK, …]`, các dòng `[X-Student-Id] 23127344 -> …`, và bảng tổng kết cuối. Chụp bằng `Win + Shift + S` (Snipping Tool).

Lưu thành → `newman_cli_terminal.png`

### B3. Workspace trong Postman

Sau khi import ở bước B1: chụp sidebar thấy 9 folder của collection + tên workspace + environment đang chọn.

Lưu thành → `postman_workspace.png`

### B4. Mock server

1. Chuột phải collection → **Mock collection** → tên `HW06 EShop mock (23127344)`.
2. Chụp trang cấu hình mock (thấy URL `https://<id>.mock.pstmn.io`).
3. Đổi `baseUrl` sang URL đó, gửi lại `TC-API1-001`, chụp response lấy từ saved example.

Lưu thành → `postman_mock_server.png`, `postman_mock_response.png`

Chi tiết các bước: [`../postman/README.md`](../postman/README.md) §2.

### B5. GitHub Issues cho từng lỗi (Bước 5 — chưa làm)

Mỗi issue một ảnh. Sẽ làm ở Bước 5; nếu muốn tôi tạo issue tự động bằng `gh` CLI thì nói, vì đó là hành động công khai lên repo nên tôi không tự làm.

Lưu thành → `github_issue_BUG-XX.png`

### B6. Hai lần chạy CI/CD, một xanh một đỏ (§8 — chưa làm)

Chụp trang GitHub Actions của mỗi lần chạy, thấy commit hash và kết quả.

Lưu thành → `ci_run_pass.png`, `ci_run_fail.png`

---

## C. Không cần chụp

| Thứ | Vì sao |
| --- | --- |
| Monitor của Postman | Monitor chạy trên cloud, **không gọi được `localhost`** — giới hạn kỹ thuật, đã ghi rõ ở §7 mục 31. Vai trò chạy định kỳ do GitHub Actions `schedule` đảm nhiệm (§8) |
| Từng test case trong 196 TC | Báo cáo HTML đã có đủ; ảnh `newman_*_summary.png` là mức tổng hợp phù hợp để chấm |
