# HW06 — Bằng chứng ảnh chụp

MSSV 23127344. Thư mục này có **53 ảnh** (gồm 16 ảnh GitHub Issue trong `issues/`): 33 ảnh do Selenium chụp tự động và 4 ảnh chụp tay từ app Postman (app desktop nên Selenium không với tới được).

Sinh lại toàn bộ phần tự động:

```bash
python hw6/scripts/capture_evidence.py     # cần SUT đang chạy cho ảnh sut_localhost_*
```

---

## A. Đã tự động chụp — 33 ảnh, không cần làm gì thêm

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

## B. Đã chụp tay — 4 ảnh, xong

| Ảnh | Chứng minh điều gì | Dùng ở § |
| --- | --- | --- |
| `postman_console_xstudentid.png` | **Ảnh đề bài đòi đích danh (§11).** 5 dòng `[X-Student-Id] 23127344 -> …` từ pre-request script, kèm dòng URL đã phân giải `POST http://localhost:3000/api/login` ngay dưới. Thấy cả cây 9 folder, environment, và `[SETUP] tokenAdmin da luu, admin id=1` | §2, §11 |
| `postman_workspace.png` | Workspace `HW06 — EShop API Testing (23127344)`: 9 folder, 202 request, mô tả collection render sẵn | §7.1 |
| `postman_mock_server.png` | Mock `HW06 EShop mock (23127344)`, **Public**, gắn vào chính collection HW06, URL `https://52831da1-….mock.pstmn.io` | §7.6 |
| `postman_mock_response.png` | `SETUP-01` chạy qua mock → `200`, environment `EShop_HW06_mock` | §7.6 |

Hai chi tiết trong ảnh console được **giữ lại có chủ ý**, không phải lỗi chụp:

- **Dòng đỏ đầu console** `Error: Thieu bien moi truong studentId…` là của lần bấm Send **trước khi** chọn environment. Nó cho thấy câu `throw` bảo vệ trong pre-request script hoạt động.
- **Cảnh báo vàng** `Using "CryptoJS" is deprecated` — sandbox Postman khuyến nghị dùng `crypto`. `CryptoJS` vẫn chạy (7 token giả mạo ký thành công), nên không đổi giữa lúc bộ test đã xanh và đã qua CI.

### GitHub Issues (Bước 5) — **ĐÃ XONG**, 16 ảnh trong `issues/`

16 issue #377–#392 trên repo nhóm DuyITLOR/group05_eshop, mỗi issue tag `[HW06]`. Ảnh chụp tự động (repo công khai):

```bash
python hw6/scripts/capture_issues.py
```

File `issues/github_issue_BUG-xx_NNN.png` — mỗi ảnh thấy tiêu đề `[HW06]`, tác giả, đủ nhãn và toàn bộ nội dung (mô tả, curl tái hiện, truy vết FR/SEC, link CI).

## C. Không cần chụp

| Thứ | Vì sao |
| --- | --- |
| Monitor của Postman | Monitor chạy trên cloud, **không gọi được `localhost`** — giới hạn kỹ thuật, đã ghi rõ ở §7 mục 31. Vai trò chạy định kỳ do GitHub Actions `schedule` đảm nhiệm (§8) |
| Từng test case trong 196 TC | Báo cáo HTML đã có đủ; ảnh `newman_*_summary.png` là mức tổng hợp phù hợp để chấm |
