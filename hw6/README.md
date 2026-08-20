# HW06 — Kiểm thử API (API Testing, AI-First)

**MSSV:** 23127344 · **Họ tên:** Trương Thành Đạt · **Lớp:** 23KTPM3 — K23
**SUT:** EShop (`group05_eshop`) tại `http://localhost:3000` · commit `bdb7bd8`
**Repository:** https://github.com/trwng-thdat/software-testing — nhánh `hw6/api-testing`
**Công cụ:** Postman + Newman 6.2.2 (reporter `htmlextra` 1.23.1) · Node.js v22.22.1 · Claude Opus 5 (Claude Code) · Selenium 4.46 (chụp bằng chứng)

---

## 1. Báo cáo tổng hợp kiểm thử

### Ba API đã chọn

| # | API | Pool / FR | Vì sao chọn |
| --- | --- | --- | --- |
| 1 | `PUT /api/users/me` | A / FR-04 | Có trường `role` không được đặc tả nhưng mã nguồn vẫn ghi — bề mặt SEC-06 |
| 2 | `PUT /api/orders/:id/cancel` | B / FR-10 | Máy trạng thái 5 trạng thái, kiểm được chuyển trạng thái đúng nghĩa |
| 3 | `POST /api/admin/coupons` | C / FR-17 | Endpoint admin có 6 trường ràng buộc — bề mặt SEC-03 và ép kiểu SQLite |

### Số lượng test case

| | API 1 | API 2 | API 3 | **Tổng** |
| --- | :-: | :-: | :-: | :-: |
| AI sinh | 42 | 43 | 82 | **167** |
| — VALID | 31 | 33 | 65 | 129 (77,2%) |
| — INVALID (đã sửa) | 2 | 2 | 5 | 9 (5,4%) |
| — INCOMPLETE (đã bổ sung) | 9 | 8 | 12 | 29 (17,4%) |
| Tôi tự bổ sung | 5 | 5 | 5 | **15** |
| **Đã thực thi** | **46** | **46** | **85** | **177** |

Chênh lệch giữa 182 (167+15) và 177 là do kiểm toán: `TC-API1-034` gộp vào `TC-API1-023`; `TC-API2-022`, `TC-API2-043`, `TC-API3-040`, `TC-API3-042`, `TC-API3-043` bị loại vì không phải request thực thi được; `TC-API3-081` tách thành `-081a`/`-081b`. Lý do từng trường hợp ở §4.2, §5.2, §6.2 của báo cáo chính.

### Kết quả thực thi — 7 lần chạy Newman trên `localhost:3000`

| Lần chạy | Test case | Iteration | HTTP call | Assertion | PASS | FAIL |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| API 1 — `PUT /api/users/me` | 46 | 1 | 102 | 224 | 224 | 0 |
| API 2 — `PUT /api/orders/:id/cancel` | 46 | 1 | 138 | 239 | 239 | 0 |
| API 3 — `POST /api/admin/coupons` | 85 | 1 | 249 | 557 | 557 | 0 |
| `DATA1` — chạy theo dữ liệu, `phone` | 1 | 6 | 12 | 24 | 24 | 0 |
| `DATA2` — chạy theo dữ liệu, chuyển trạng thái | 1 | 6 | 27 | 24 | 24 | 0 |
| `DATA3` — chạy theo dữ liệu, `coupon` | 1 | 6 | 12 | 18 | 18 | 0 |
| `SPEC` — assertion theo đặc tả (**cố ý fail**) | 16 | 1 | 46 | 73 | 51 | **22** |
| **Tổng** | **196** | | **586** | **1 159** | **1 137** | **22** |

22 assertion fail **không phải sự cố**: chúng nằm trong folder `SPEC`, nơi assertion mã hoá **điều đặc tả yêu cầu** thay vì hành vi thực tế. Mỗi assertion fail là bằng chứng máy chạy được cho một vi phạm FR/SEC. Ba folder API xanh tuyệt đối (1 137/1 137) và là cổng chặn hồi quy.

### Số lỗi phát hiện: 16 — đã báo lên GitHub Issues #377–#392

| Nhóm | Số lỗi | Nặng nhất |
| --- | :-: | --- |
| SEC-03 — endpoint admin không kiểm `role` | 3 | User thường **tạo và xoá được coupon**, kể cả coupon seed `SAVE10` (#382, #387, #388) |
| FR-10 — máy trạng thái đơn hàng | 4 | User hủy được đơn đang `shipping`; admin đưa đơn `canceled` về `delivered` |
| FR-17 — ràng buộc trường coupon | 3 | `discount_value` âm được chấp nhận → `apply-coupon` cho `final_amount = 550 000` trên đơn `500 000` |
| SEC-01 / SEC-02 — xác thực, lộ dữ liệu | 4 | Secret hardcode → tự ký được 7 token mạo danh; `GET /api/orders/:id` không cần token |
| SEC-06 — leo thang quyền qua `role` | 1 | `PUT /api/users/me` với `role:"admin"` ghi thẳng vào DB |
| FR-04 — kiểm tra định dạng | 1 | `phone` không được validate ở backend |
| Xử lý lỗi | 2 | Trùng `code` trả `500` kèm nguyên văn thông báo SQLite |

**4/7 yêu cầu bảo mật bị vi phạm** (SEC-01, SEC-02, SEC-03, SEC-06). SEC-05 (parameterized query) **đạt**.

Toàn bộ 16 lỗi đã báo lên GitHub Issues repo nhóm, dải **[#377–#392](https://github.com/DuyITLOR/group05_eshop/issues)**, mỗi issue tag `[HW06]` + bước tái hiện `curl` + dẫn chiếu FR/SEC.

### CI/CD

| Lần chạy | Commit | Kết quả | Link |
| --- | --- | --- | --- |
| ✅ Tất cả PASS | `5d43840` | `success` | [run 32347245797](https://github.com/trwng-thdat/software-testing/actions/runs/32347245797) |
| ❌ Có test FAIL | `06524ea` | `failure` (22 assertion) | [run 32347386625](https://github.com/trwng-thdat/software-testing/actions/runs/32347386625) |

Số liệu trên CI (Ubuntu) **trùng khớp tuyệt đối** với máy local (Windows 11) trên cả 7 lần chạy.

---

## 2. Sản phẩm nộp

| Sản phẩm | Đường dẫn |
| --- | --- |
| Báo cáo chính | [`Main_Report.md`](./Main_Report.md) |
| Postman collection | [`postman/EShop_HW06_API.postman_collection.json`](./postman/EShop_HW06_API.postman_collection.json) — 9 folder, 202 request, 664 `pm.test`, 12 saved example |
| Environment + globals | [`postman/EShop_HW06.postman_environment.json`](./postman/EShop_HW06.postman_environment.json) · [`postman/EShop_HW06.postman_globals.json`](./postman/EShop_HW06.postman_globals.json) |
| Data file (CSV) | [`postman/data/`](./postman/data/) — một file cho mỗi API |
| **Bộ sinh collection** | [`postman/src/`](./postman/src/) — sửa ở đây rồi `node postman/src/build.js` |
| Báo cáo Newman (HTML) | [`reports/`](./reports/) — 7 báo cáo + `summary.md` + log console 3 974 dòng |
| Ảnh bằng chứng | [`evidence/`](./evidence/) — 53 ảnh (gồm 16 ảnh GitHub Issue ở `evidence/issues/`), xem [`evidence/README.md`](./evidence/README.md) |
| Workflow CI/CD | [`../.github/workflows/hw6-api-tests.yml`](../.github/workflows/hw6-api-tests.yml) |
| Script | [`scripts/`](./scripts/) — probe, reset DB, chạy Newman, tổng hợp, chụp ảnh |
| Agent Skill | [`skills/SKILL.md`](./skills/SKILL.md) · video: https://youtu.be/Nz8hUbziTyI |
| Phê bình AI | [`AI_Critique.md`](./AI_Critique.md) — 296 từ |
| AI Audit Report | [`[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md`](./%5BAI-02%5D%20-%20FIT@HCMUS%20-%20AI%20Audit%20Report_En.docx.md) — 44 prompt verbatim |
| Git commit log | [`git_commit_log.txt`](./git_commit_log.txt) |

### Chạy lại toàn bộ

```bash
cd group05_eshop/backend && node database.js && node server.js   # dựng SUT
bash hw6/scripts/run_newman.sh all          # 7 lần chạy, sinh toàn bộ báo cáo
node hw6/scripts/summarize_newman.js        # trích số liệu ra summary.md
python hw6/scripts/capture_evidence.py      # chụp 24 ảnh báo cáo Newman
python hw6/scripts/capture_ci_evidence.py   # chụp 9 ảnh CI/CD
python hw6/scripts/capture_issues.py        # chụp 16 ảnh GitHub Issue
```

---

## 3. Bảng tự đánh giá

| STT | Tiêu chí | Điểm tối đa | Tự chấm | Căn cứ |
| :-: | --- | :-: | :-: | --- |
| 1 | API 1 — trọn quy trình (sinh + kiểm toán + mở rộng + thực thi + lỗi) | 30 | *(chưa chấm)* | §4 |
| 2 | API 2 — trọn quy trình | 30 | *(chưa chấm)* | §5 |
| 3 | API 3 — trọn quy trình | 30 | *(chưa chấm)* | §6 |
| 4 | Agent Skills (bộ sinh test do AI điều khiển) | 10 | *(chưa chấm)* | §9 |
| | **Tổng** | **100** | | |

> Chưa chấm vì còn thiếu sơ đồ tự vẽ §9.2 và mã giả §9.3. Điền sau khi hoàn tất. (Bước 5 đã xong: 16 issue #377–#392 + ảnh.)

---

## 4. Phần còn thiếu

| Việc | Ghi chú |
| --- | --- |
| §9.2 — sơ đồ bộ sinh test **tự vẽ** | Đề §11 quy định sơ đồ không được do AI sinh |
| §9.3 — mã giả hoàn chỉnh | Bản hiện tại còn 5 bước để trống |
| Excel test case + bảng tổng hợp | |
| Bản PDF của báo cáo chính, phê bình AI, AI Audit Report | |
