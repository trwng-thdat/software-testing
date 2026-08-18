# HW06 — Kiểm thử API (API Testing, AI-First)

> **CÁCH DÙNG TEMPLATE NÀY**
> • Mọi chỗ cần điền được đánh dấu bằng `«…»` — tìm bằng Ctrl+F ký tự `«`.
> • Dòng bắt đầu bằng `> ✍️` là **hướng dẫn**, hãy **xóa** sau khi điền xong.
> • Bảng có ô để trống → thêm/bớt hàng tùy số lượng thực tế.
> • Xóa toàn bộ khối hướng dẫn này trước khi nộp.

| Trường thông tin                            | Giá trị                                               |
| ------------------------------------------- | ----------------------------------------------------- |
| MSSV                                        | «MSSV»                                                |
| Họ và tên                                   | «HỌ VÀ TÊN»                                           |
| Lớp / Nhóm                                  | «Kiểm thử phần mềm - 23KTPMx» / Nhóm «xx»             |
| Ngày nộp                                    | «YYYY-MM-DD»                                          |
| SUT                                         | EShop — https://github.com/ttbhanh/eshop-sut          |
| Môi trường triển khai SUT                   | «http://localhost:3000» (hostname khớp Newman run)    |
| GitHub repo công khai (collection + script) | «URL»                                                 |
| GitHub repo chứa Bug Issues                 | «URL»                                                 |
| Công cụ thực thi                            | Postman «x.y» + Newman «x.y» «/ Karate / RestAssured» |
| Công cụ AI đã dùng                          | «Claude Opus 5 / ChatGPT / …»                         |
| CI/CD pipeline                              | «GitHub Actions — URL workflow»                       |
| Video demo Agent Skill (tùy chọn)           | «YouTube unlisted URL»                                |
| Điểm tự đánh giá                            | **«000»** / 100                                       |

> **Khai báo sử dụng AI.** «Chọn 1 trong 2:»
> — _Nếu KHÔNG dùng AI:_ "I do not use any AI help in this exercise."
> — _Nếu CÓ dùng AI:_ "I use AI tools for the following tasks:" «liệt kê: sinh test case cho 3 API, đối chiếu đặc tả với mã nguồn SUT, sinh script Postman, phân tích kết quả Newman, soạn thảo báo cáo…». Toàn bộ nhật ký tương tác được ghi trong AI Audit Report (Phụ lục A). Mọi kết quả do AI tạo ra bên dưới đều đã được tôi rà soát, chỉnh sửa; tôi chịu hoàn toàn trách nhiệm về các sản phẩm cuối cùng.

---

## Tóm tắt kết quả

> ✍️ Điền sau khi chạy Newman xong. Đây là bảng TA đọc đầu tiên.

|                           | API 1 — `PUT /users/me` | API 2 — `PUT /orders/:id/cancel` | API 3 — `POST /admin/coupons` | **Tổng** |
| ------------------------- | :-----------: | :-----------: | :-----------: | :------: |
| Pool / FR                 |  A / **FR-04**  |  B / **FR-10**  |  C / **FR-17**  |    —     |
| Test case AI sinh         |      42       |      43       |      44       |   129    |
| — VALID                   |  «pending — chưa kiểm toán (Bước 2)»  |  «pending»  |  «pending»  |  «pending»  |
| — INVALID (đã sửa)        |  «pending»  |  «pending»  |  «pending»  |  «pending»  |
| — INCOMPLETE (đã bổ sung) |  «pending»  |  «pending»  |  «pending»  |  «pending»  |
| Test case tôi tự bổ sung  |  «pending — chưa thực hiện Bước 3»  |  «pending»  |  «pending»  |  «pending»  |
| **Tổng test đã thực thi** |      «»       |      «»       |      «»       |    «»    |
| — PASS                    |      «»       |      «»       |      «»       |    «»    |
| — FAIL                    |      «»       |      «»       |      «»       |    «»    |
| Bug SUT phát hiện         |      «»       |      «»       |      «»       |    «»    |

| Kết luận chính            |                                                    |
| ------------------------- | -------------------------------------------------- |
| **Bug nghiêm trọng nhất** | «mô tả 1 dòng + link GitHub Issue»                 |
| **Lỗi của AI đáng chú ý** | «AI bỏ sót nhóm nào — bảo mật? chuyển trạng thái?» |
| **Vùng bảo mật yếu nhất** | «SEC-0x — mô tả»                                   |
| **Kết quả CI/CD**         | «run xanh: URL · run đỏ: URL»                      |

---

## Mục lục

|   §    | Nội dung                                                                            | Điểm chính       |
| :----: | ----------------------------------------------------------------------------------- | ---------------- |
| **1**  | [Phạm vi và Lựa chọn API](#1-phạm-vi-và-lựa-chọn-api)                               | 3 API / 3 Pool   |
| **2**  | [Môi trường Kiểm thử](#2-môi-trường-kiểm-thử)                                       | «»               |
| **3**  | [Phương pháp làm việc với AI](#3-phương-pháp-làm-việc-với-ai)                       | P3–P11 (9 bước)  |
| **4**  | API 1 — `PUT /api/users/me` (§4)                                                                  | 42 TC AI · «pending» bug |
| **5**  | API 2 — `PUT /api/orders/:id/cancel` (§5)                                                                  | 43 TC AI · «pending» bug |
| **6**  | API 3 — `POST /api/admin/coupons` (§6)                                                                  | 44 TC AI · «pending» bug |
| **7**  | [Tính năng Postman đã sử dụng](#7-tính-năng-postman-đã-sử-dụng)                     | «n» tính năng    |
| **8**  | [Tích hợp CI/CD](#8-tích-hợp-cicd)                                                  | 2 run mẫu        |
| **9**  | [Agent Skill — Bộ sinh test API](#9-agent-skill--bộ-sinh-test-api-do-ai-điều-khiển) | Sơ đồ tự vẽ      |
| **10** | [Tổng hợp lỗi đã báo cáo](#10-tổng-hợp-lỗi-đã-báo-cáo)                              | «n» issue        |
| **11** | [Phê bình AI](#11-phê-bình-ai-200300-từ)                                            | «n» từ           |
| **12** | [Nhật ký Git Commit](#12-nhật-ký-git-commit)                                        |                  |
| **13** | [Danh sách sản phẩm nộp](#13-danh-sách-sản-phẩm-nộp)                                |                  |
| **14** | [Tự đánh giá](#14-tự-đánh-giá)                                                      | «000»/100        |
| **15** | [Tài liệu tham khảo](#15-tài-liệu-tham-khảo)                                        |                  |
| **A**  | [Phụ lục A — AI Audit Report](#phụ-lục-a--ai-audit-report)                          |                  |
| **B**  | [Phụ lục B — Chỉ mục bằng chứng](#phụ-lục-b--chỉ-mục-bằng-chứng)                    |                  |

---

## 1. Phạm vi và Lựa chọn API

> ✍️ Đọc `api_specification.md` trong repo SUT. Chọn đúng 3 API thuộc 3 Pool khác nhau (A, B, C). Không trùng với thành viên khác trong nhóm.

| #   | Pool | FR        | Tính năng                          | Endpoint chính           | Method | Endpoint phụ trợ                             | Auth               |
| --- | ---- | --------- | ---------------------------------- | ------------------------ | ------ | -------------------------------------------- | ------------------ |
| 1   | A    | **FR-04** | Quản lý thông tin cá nhân          | `/api/users/me`          | `PUT`  | `GET /api/users/me` — verify sau khi ghi     | Bearer JWT (user)  |
| 2   | B    | **FR-10** | Máy trạng thái đơn hàng — hủy đơn  | `/api/orders/:id/cancel` | `PUT`  | —                                            | Bearer JWT (user)  |
| 3   | C    | **FR-17** | Quản lý mã giảm giá — tạo coupon   | `/api/admin/coupons`     | `POST` | `DELETE /api/admin/coupons/:id` — dọn dữ liệu | Bearer JWT (admin) |

**Lý do chọn.** Ba API phủ ba nhóm kỹ thuật khác nhau mà đề §6 yêu cầu, không chồng lấn:

- **`PUT /api/users/me` (FR-04)** — giàu **phân vùng miền giá trị và giá trị biên** («liệt kê field: họ tên, số điện thoại, địa chỉ… cùng ràng buộc độ dài / định dạng»), đồng thời là bề mặt **IDOR / mass-assignment** điển hình: ghi đè hồ sơ người khác, tự nâng `role`. Có `GET /api/users/me` đi kèm nên mọi lần ghi đều kiểm chứng được bằng một read-back thay vì chỉ tin vào mã trạng thái trả về.
- **`PUT /api/orders/:id/cancel` (FR-10)** — điểm vào trực tiếp của **máy trạng thái đơn hàng**: hủy chỉ hợp lệ ở một số trạng thái, mọi trạng thái còn lại phải bị từ chối — đúng nhóm **chuyển trạng thái** đề §6 bắt buộc phủ (bảng ở §5). Kèm theo là IDOR cấp đơn hàng: hủy đơn của tài khoản khác.
- **`POST /api/admin/coupons` (FR-17)** — endpoint **admin**, cho phép kiểm **kiểm soát truy cập / leo thang quyền** (user thường, token hết hạn, token sửa chữ ký, không token) trên một thao tác **ghi**, cộng với ràng buộc nghiệp vụ giàu biên («giá trị giảm, ngày hiệu lực, mã trùng…») và rủi ro **schema drift**. `DELETE /api/admin/coupons/:id` dùng ở bước teardown để mỗi lần chạy Newman đều lặp lại được.

> ✍️ Hai endpoint phụ trợ (`GET /api/users/me`, `DELETE /api/admin/coupons/:id`) chỉ đóng vai **verify / teardown**, không tính là API thứ tư. Nêu rõ điều này nếu TA hỏi khi vấn đáp.

---

## 2. Môi trường Kiểm thử

| Hạng mục           | Giá trị                                        |
| ------------------ | ---------------------------------------------- |
| Hệ điều hành       | «Windows 11 / …»                               |
| Runtime SUT        | «Node.js vXX.X»                                |
| SUT chạy tại       | «http://localhost:3000»                        |
| Commit SUT đã test | «hash + ngày»                                  |
| Postman            | «version»                                      |
| Newman             | «version» + reporter «htmlextra»               |
| Dữ liệu khởi tạo   | «script seed / database.js — mô tả cách reset» |

**Quy trình reset dữ liệu giữa các lần chạy.**

```bash
«# lệnh dựng lại DB / seed dữ liệu trước mỗi lần chạy Newman»
```

**Header bắt buộc `X-Student-Id`.** Cấu hình ở cấp Collection (pre-request script) để mọi request đều mang header.

```javascript
// Collection → Pre-request Script
pm.request.headers.upsert({
  key: "X-Student-Id",
  value: pm.environment.get("studentId"),
});
console.log("X-Student-Id =", pm.environment.get("studentId"));
```

> ✍️ **BẮT BUỘC (chống gian lận §11 của đề):** chèn ảnh chụp Postman Console cho thấy dòng log `X-Student-Id = «MSSV»`.

![Console X-Student-Id](«evidence/xstudentid_console.png»)

---

## 3. Phương pháp làm việc với AI

> ✍️ Đề cấm dùng một prompt chung chung. Bảng này để chứng minh đã dẫn dắt AI qua **từng bước** của kỹ thuật kiểm thử.

| Bước | Mục tiêu kỹ thuật                        | Prompt (tóm tắt) | Đầu ra AI | Tôi đã chỉnh gì |
| ---- | ---------------------------------------- | ---------------- | --------- | --------------- |
| P3   | Phân tích hợp đồng API (đối chiếu `api_specification.md`) | Trích method/endpoint/header/body/status/response cho từng API; tách rõ "đã đặc tả" vs "suy ra từ mã nguồn" | Bảng hợp đồng API 1–3 (dùng ở §4.0/§5.0/§6.0) | «xem AI Audit Report» |
| P4   | Phân tích mã nguồn SUT (`server.js`, `database.js`) | Trace từng handler dòng-theo-dòng, đối chiếu P3 | Sai lệch spec-vs-code (vd: `role` bị ghi đè, `phone` không được validate) | «» |
| P5   | Phân vùng miền giá trị (EP) từng tham số | Liệt kê lớp hợp lệ/không hợp lệ mỗi field, tách "theo đặc tả" vs "theo mã nguồn" | Bảng EP đầy đủ cho 3 API | «» |
| P6   | Phân tích giá trị biên (BVA)             | Áp dụng biên min−1/min/min+1/max−1/max/max+1 cho ràng buộc trong P5 | Bảng biên (`phone`, `discount_value`, `max_uses_per_user`…) | «» |
| P7   | Chuyển trạng thái (FR-10)                | Xây mô hình trạng thái đơn hàng từ đặc tả + mã nguồn, không giả định trạng thái vô căn cứ | Bảng chuyển trạng thái hợp lệ/không hợp lệ (dùng ở §5) | «» |
| P8   | Bảo mật SEC-01 … SEC-07                  | Ánh xạ từng SEC-0x vào 3 API, chỉ giữ yêu cầu thực sự áp dụng | Ma trận bảo mật theo API (dùng ở §6.9) | «» |
| P9   | Kiểm tra schema response                 | Trích schema response 2xx/lỗi từ mã nguồn (không có trong đặc tả) | Bảng schema theo status code | «» |
| P10  | Ma trận phủ kiểm thử (Coverage Matrix)   | Tổng hợp P5–P9 thành Coverage ID, xác định số TC tối thiểu | Ma trận Coverage ID + kế hoạch phân bổ TC theo kỹ thuật | «» |
| P11  | Sinh test case bằng AI                   | Sinh ≥35 TC/API, mỗi TC truy vết Coverage ID (P10) | 129 TC cho 3 API (42+43+44) — chi tiết ở §4.1/§5.1/§6.1 | «» |

**Toàn văn prompt & output:** Phụ lục A (AI Audit Report).

---

## 4. API 1 — `PUT /api/users/me` (FR-04)

> ✍️ **Sao chép nguyên khối §4 này cho API 2 (§5) và API 3 (§6).** Cấu trúc 5 bước bám đúng §6 của đề: sinh → kiểm toán → mở rộng → thực thi → lỗi.

### 4.0 Đặc tả tóm tắt

| Thuộc tính   | Giá trị                                   |
| ------------ | ----------------------------------------- |
| Endpoint     | `PUT /api/users/me` (verify bằng `GET /api/users/me`) |
| Pool / FR    | A / FR-04 — Quản lý thông tin cá nhân     |
| Auth         | Bearer JWT (user) — `authenticateToken`, `server.js:100-110` |
| Request body | `name` (string), `shipping_address` (string), `phone` (string) — theo `api_specification.md §2.2`. Trường `role` **không được đặc tả** nhưng mã nguồn vẫn đọc/ghi nếu truthy (`server.js:119,124-127`) — vi phạm SEC-06 |
| Response 2xx | `200` — `{"message":"Profile updated"}` (không đặc tả trong `api_specification.md`; suy từ `server.js:133`) |
| Mã lỗi       | `401` `{"error":"Unauthorized"}` · `403` `{"error":"Forbidden"}` · `500` `{"error":"<sqlite message>"}` — **không có 400/404** (không có validation/existence check) |
| Yêu cầu SEC  | SEC-02 (JWT hợp lệ — có, nhưng secret hardcode `server.js:9`, token không hết hạn) · **SEC-06 (vi phạm — `role` bị client ghi đè)** · SEC-05 (parameterized query — đạt) · SEC-01 (không áp dụng trực tiếp cho PUT, nhưng `GET /api/users/me` lộ `password`/`reset_token` dạng plaintext) |

**Bảng tham số & phân vùng miền giá trị** _(rút gọn từ P5/P6; chi tiết đầy đủ nằm ở `testcases/API1.xlsx`)_

| Tham số | Kiểu | Ràng buộc | Phân vùng hợp lệ | Phân vùng không hợp lệ | Giá trị biên |
| ------- | ---- | --------- | ---------------- | ---------------------- | ------------ |
| `name` | string | Không đặc tả (không bắt buộc/độ dài) | Chuỗi bất kỳ | rỗng/null/sai kiểu (đều được chấp nhận — không validate) | Không áp dụng |
| `shipping_address` | string | Không đặc tả | Chuỗi bất kỳ | rỗng/null/sai kiểu (đều được chấp nhận) | Không áp dụng |
| `phone` | string | FR-04: bắt đầu `0`, 10–11 chữ số (**không được thực thi trong mã nguồn**) | `0912345678` (10 số), `09123456789` (11 số) | Sai định dạng — **vẫn được chấp nhận** | 9/10/11/12 chữ số; ký tự đầu `0` vs khác `0` |
| `role` | string (không đặc tả) | SEC-06: cấm client thay đổi | (không nên gửi trường này) | `"admin"`, `"user"`, `"superadmin"` — **đều bị ghi vào DB** | số `0` (bị bỏ qua) vs chuỗi `"0"` (**vẫn bị ghi**) |

### 4.1 Bước 1 — Sinh test case bằng AI

**Mục tiêu ≥ 35 test case.** Số thực tế AI sinh: **«nn»**.

| Nhóm kỹ thuật          | Số TC | Ghi chú |
| ---------------------- | :---: | ------- |
| Phân vùng miền giá trị |  14   | `name`/`shipping_address`/`phone`/`role` (thiếu/rỗng/sai kiểu), body combo |
| Giá trị biên           |   8   | Độ dài `phone` (9/10/11/12 số), ký tự đầu `phone`, header 2-khoảng-trắng, `role` số `0` vs chuỗi `"0"` |
| Chuyển trạng thái      |   0   | **P7 kết luận: không áp dụng** — endpoint này không có máy trạng thái ý nghĩa (không phải thiếu sót) |
| Bảo mật (SEC-01…07)    |  10   | Auth bypass (401/403/token giả mạo), leo thang quyền `role` (SEC-06), SQLi/XSS payload |
| Kiểm tra schema        |   6   | Response 2xx/401/403, schema `GET /api/users/me`, kiểm tra không lộ trường bị ghi đè |
| Quy tắc nghiệp vụ khác |   3   | Bất đối xứng ép kiểu `max_uses_per_user`, `is_active` không thể set qua API, chuỗi tạo→xoá→verify |
| **Tổng**               |  42   | ≥ 35 theo yêu cầu đề bài |

> ✍️ Bảng test case đầy đủ đặt trong file Excel (`«testcases/API1.xlsx»`). Trong báo cáo chỉ trích bảng tổng hợp + vài TC tiêu biểu.

| ID     | Tiêu đề | Kỹ thuật | Truy vết (FR / SEC) | Precondition | Input | Expected (status + body) | Nguồn |
| ------ | ------- | -------- | ------------------- | ------------ | ----- | ------------------------ | ----- |
| A1-001 | «»      | «EP»     | «FR-0x §y»          | «»           | «»    | «»                       | AI    |

### 4.2 Bước 2 — Kiểm toán (rà soát của con người)

| Nhãn       | Số TC | Tỉ lệ |
| ---------- | :---: | :---: |
| VALID      |  «»   |  «»%  |
| INVALID    |  «»   |  «»%  |
| INCOMPLETE |  «»   |  «»%  |

**Chi tiết các test case KHÔNG đạt**

> ✍️ Mỗi dòng phải có lập luận cụ thể — đối chiếu đặc tả hoặc mã nguồn SUT (ghi `file:line`). Đây là phần chấm nặng nhất.

| ID     | Nhãn       | AI viết gì               | Vì sao sai / thiếu (dẫn chứng)              | Tôi sửa thành           |
| ------ | ---------- | ------------------------ | ------------------------------------------- | ----------------------- |
| A1-0xx | INVALID    | «expected 200»           | «đặc tả §x.y quy định 422; `server.js:120`» | «expected 422»          |
| A1-0xx | INCOMPLETE | «chỉ kiểm status code»   | «không kiểm schema / field bắt buộc»        | «thêm assertion schema» |
| A1-0xx | INVALID    | «endpoint không tồn tại» | «AI bịa endpoint — không có trong spec»     | «loại bỏ / thay bằng …» |

**Nhận xét kiểm toán.** «2–5 câu: AI mắc lỗi theo mẫu nào, tập trung ở nhóm kỹ thuật nào?»

### 4.3 Bước 3 — Mở rộng (≥ 5 test case tự nghĩ)

| ID     | Tiêu đề | Kỹ thuật / SEC | Input | Expected | **Vì sao AI bỏ sót**                                                      |
| ------ | ------- | -------------- | ----- | -------- | ------------------------------------------------------------------------- |
| A1-E01 | «»      | «SEC-04 IDOR»  | «»    | «»       | «hạn chế mô hình: không suy ra được quan hệ ownership giữa hai tài khoản» |
| A1-E02 | «»      | «state»        | «»    | «»       | «chất lượng prompt: chưa nêu …»                                           |
| A1-E03 | «»      | «»             | «»    | «»       | «đặc điểm riêng của API: …»                                               |
| A1-E04 | «»      | «»             | «»    | «»       | «»                                                                        |
| A1-E05 | «»      | «»             | «»    | «»       | «»                                                                        |

| Nguyên nhân bỏ sót     | Số TC | Diễn giải |
| ---------------------- | :---: | --------- |
| Chất lượng prompt      |  «»   | «»        |
| Hạn chế của mô hình    |  «»   | «»        |
| Đặc điểm riêng của API |  «»   | «»        |

### 4.4 Bước 4 — Thực thi (Postman + Newman)

| Hạng mục                | Giá trị                  |
| ----------------------- | ------------------------ |
| Folder trong collection | «API1 — …»               |
| Số request              | «»                       |
| Số assertion            | «»                       |
| Data file (nếu có)      | «data/api1.csv — n dòng» |

```bash
newman run «collection.json» \
  -e «env.postman_environment.json» \
  --folder "«API1 — …»" \
  -d «data/api1.csv» \
  -r cli,htmlextra --reporter-htmlextra-export «reports/api1.html»
```

|            | Executed | Passed | Failed |
| ---------- | :------: | :----: | :----: |
| Requests   |    «»    |   «»   |   «»   |
| Assertions |    «»    |   «»   |   «»   |

> ✍️ Ảnh chụp Newman CLI phải thấy rõ hostname (`localhost` / `127.0.0.1`) — yêu cầu chống gian lận.

![Newman API1](«evidence/newman_api1.png»)
Báo cáo HTML: [`«reports/api1.html»`](«reports/api1.html»)

**Các assertion FAIL và diễn giải**

| ID     | Assertion fail | Actual | Expected | Là bug SUT hay lỗi test?   |
| ------ | -------------- | ------ | -------- | -------------------------- |
| A1-0xx | «»             | «»     | «»       | «BUG-01 / lỗi test đã sửa» |

### 4.5 Bước 5 — Lỗi phát hiện được

| ID     | Tiêu đề | Mức độ | TC phát hiện | AI có sinh TC này không? | GitHub Issue |
| ------ | ------- | ------ | ------------ | ------------------------ | ------------ |
| BUG-01 | «»      | «High» | «A1-0xx»     | «Không — tôi tự bổ sung» | «URL»        |

<details>
<summary><b>BUG-01 — «tiêu đề»</b></summary>

- **Endpoint:** `«»`
- **Các bước tái hiện:** «1… 2… 3…»
- **Kết quả mong đợi:** «»
- **Kết quả thực tế:** «»
- **Mức độ / Độ ưu tiên:** «High / P1»
- **Bằng chứng:** ![BUG-01](«evidence/bug01.png»)
- **Issue:** «URL»

</details>

---

## 5. API 2 — `PUT /api/orders/:id/cancel` (FR-10)

### 5.0 Đặc tả tóm tắt

### 5.1 Bước 1 — Sinh test case bằng AI

### 5.2 Bước 2 — Kiểm toán

### 5.3 Bước 3 — Mở rộng (≥ 5 TC)

### 5.4 Bước 4 — Thực thi

### 5.5 Bước 5 — Lỗi phát hiện được

---

## 6. API 3 — `POST /api/admin/coupons` (FR-17)

### 6.0 Đặc tả tóm tắt

### 6.1 Bước 1 — Sinh test case bằng AI

### 6.2 Bước 2 — Kiểm toán

### 6.3 Bước 3 — Mở rộng (≥ 5 TC)

### 6.4 Bước 4 — Thực thi

### 6.5 Bước 5 — Lỗi phát hiện được

### 6.10 Kiểm toán đặc tả OpenAPI do AI sinh (tùy chọn)

> ✍️ Đề §14 cho phép nộp bản chuyển đặc tả sang OpenAPI, nhưng **nếu do AI sinh thì bắt buộc kiểm toán**. Bỏ mục này nếu không nộp OpenAPI.

| Endpoint | Sai lệch so với `api_specification.md` | Nhãn | Tôi sửa thành |
| -------- | -------------------------------------- | ---- | ------------- |
| «»       | «»                                     | «»   | «»            |

File: [`«openapi.yaml»`](«openapi.yaml»)

### 6.9 Bảng phủ yêu cầu bảo mật SEC-01 → SEC-07

> ✍️ Bảng tổng hợp cho cả 3 API — chứng minh không bỏ sót yêu cầu bảo mật nào.

| Mã     | Yêu cầu (theo `api_specification.md`) | TC của API 1 | API 2 | API 3 | Kết quả |
| ------ | ------------------------------------- | ------------ | ----- | ----- | ------- |
| SEC-01 | «» | «» | «» | «» | «» |
| SEC-02 | «» | «» | «» | «» | «» |
| SEC-03 | «» | «» | «» | «» | «» |
| SEC-04 | «» | «» | «» | «» | «» |
| SEC-05 | «» | «» | «» | «» | «» |
| SEC-06 | «» | «» | «» | «» | «» |
| SEC-07 | «» | «» | «» | «» | «» |

---

## 7. Tính năng Postman đã sử dụng

> ✍️ Đề yêu cầu dùng càng nhiều càng tốt **và liệt kê ra**. Đánh dấu ✅ cái đã dùng; dòng không dùng thì xóa hoặc ghi lý do.

| #   | Tính năng                                                       | Đã dùng | Dùng để làm gì / Bằng chứng      |
| --- | --------------------------------------------------------------- | :-----: | -------------------------------- |
| 1   | Workspace                                                       |  «✅»   | «tên workspace + ảnh»            |
| 2   | Collection + Folder theo API                                    |  «✅»   | «»                               |
| 3   | Environment / Global variables                                  |  «✅»   | `baseUrl`, `studentId`, `token`… |
| 4   | Collection variables                                            |   «»    | «»                               |
| 5   | Pre-request script                                              |  «✅»   | chèn header `X-Student-Id`       |
| 6   | Test script (`pm.test`, chai)                                   |  «✅»   | «»                               |
| 7   | JSON schema validation (`pm.response.to.have.jsonSchema` / ajv) |  «✅»   | «»                               |
| 8   | Collection Runner + Data file (CSV/JSON)                        |  «✅»   | «data/\*.csv — n dòng»           |
| 9   | Authorization helper (Bearer)                                   |   «»    | «»                               |
| 10  | Newman + reporter htmlextra                                     |  «✅»   | «reports/\*.html»                |
| 11  | Mock server                                                     |   «»    | «»                               |
| 12  | Monitor                                                         |   «»    | «»                               |
| 13  | Postman Flows / Visualizer                                      |   «»    | «»                               |
| 14  | `postman.setNextRequest` (điều khiển luồng)                     |   «»    | dùng cho chuỗi chuyển trạng thái |

![Postman workspace](«evidence/postman_workspace.png»)

---

## 8. Tích hợp CI/CD

### 8.1 Cấu hình pipeline

| Hạng mục      | Giá trị                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| Nền tảng      | «GitHub Actions»                                                                 |
| File workflow | «.github/workflows/api-tests.yml»                                                |
| Trigger       | «push / pull_request»                                                            |
| Runner        | «ubuntu-latest»                                                                  |
| Các bước      | «checkout → setup-node → khởi động SUT → seed DB → newman run → upload artifact» |

```yaml
«dán nội dung .github/workflows/api-tests.yml tại đây»
```

**Giải thích cấu hình.** «3–6 câu: cách khởi động SUT trong CI, chờ healthcheck, truyền biến môi trường và secret, lưu báo cáo HTML dưới dạng artifact.»

### 8.2 Hai lần chạy mẫu

| Lần chạy       | Commit | Kết quả      | Link run | Ảnh                         |
| -------------- | ------ | ------------ | -------- | --------------------------- |
| ✅ Tất cả PASS | «hash» | «n/n passed» | «URL»    | ![](«evidence/ci_pass.png») |
| ❌ Có FAIL     | «hash» | «1 failed»   | «URL»    | ![](«evidence/ci_fail.png») |

**Mô tả lần chạy đỏ.** «Test case nào fail, vì sao (bug thật hay cố ý sửa assertion), pipeline đã chặn ra sao.»

---

## 9. Agent Skill — Bộ sinh test API do AI điều khiển

### 9.1 Mục tiêu và phạm vi

«Đầu vào là gì (api_specification.md / OpenAPI), đầu ra là gì (bảng test case + collection Postman), giới hạn nào.»

### 9.2 Sơ đồ thiết kế (TỰ VẼ — không do AI sinh)

> ✍️ **Ràng buộc chống gian lận:** sơ đồ phải do bạn tự thiết kế. Dùng công cụ vẽ bất kỳ (draw.io, Excalidraw, Mermaid viết tay, vẽ tay chụp ảnh). Nêu rõ công cụ đã dùng.

![Sơ đồ bộ sinh test](«diagrams/generator.png»)
_Công cụ vẽ: «…». Người thiết kế: «Họ tên» — các quyết định thiết kế nêu ở §9.4._

### 9.3 Mã giả (pseudocode)

```text
INPUT : api_spec, sut_base_url, student_id
OUTPUT: test_cases[], postman_collection.json

1.  spec ← PARSE(api_spec)                    // endpoint, params, schema, auth, SEC rules
2.  FOR EACH endpoint e IN spec.endpoints:
3.      params       ← EXTRACT_PARAMS(e)
4.      partitions   ← «…»                    // EP: phân vùng hợp lệ / không hợp lệ
5.      boundaries   ← «…»                    // BVA
6.      states       ← «…»                    // nếu e thuộc máy trạng thái
7.      sec_cases    ← «…»                    // SEC-01…07
8.      schema_cases ← «…»
9.      raw          ← LLM_GENERATE(«prompt riêng cho từng kỹ thuật, KHÔNG gộp 1 prompt»)
10.     validated    ← SELF_CHECK(raw, spec)  // loại TC bịa endpoint / sai mã lỗi
11.     test_cases  += validated
12. collection ← RENDER_POSTMAN(test_cases, header={X-Student-Id: student_id})
13. RETURN test_cases, collection
```

Mã nguồn: [`«skills/api-test-generator/»`](«skills/api-test-generator/»)

### 9.4 Các quyết định thiết kế của tôi

| Quyết định                                   | Phương án đã chọn | Vì sao | Đánh đổi |
| -------------------------------------------- | ----------------- | ------ | -------- |
| «Chia prompt theo kỹ thuật thay vì 1 prompt» | «»                | «»     | «»       |
| «Có bước self-check đối chiếu spec»          | «»                | «»     | «»       |
| «»                                           | «»                | «»     | «»       |

### 9.5 Giới hạn (điều bộ sinh này KHÔNG làm được)

- «»
- «»
- «»

### 9.6 Video demo (tùy chọn)

«URL» — nội dung: «sinh test cho API … từ đặc tả, xuất collection, chạy Newman».

---

## 10. Tổng hợp lỗi đã báo cáo

| ID     | API | Tiêu đề | Mức độ | Trạng thái | GitHub Issue | Ảnh |
| ------ | --- | ------- | ------ | ---------- | ------------ | --- |
| BUG-01 | «1» | «»      | «»     | «Open»     | «URL»        | «»  |
| BUG-02 | «»  | «»      | «»     | «»         | «»           | «»  |

> ✍️ Mỗi issue **bắt buộc** có ảnh chụp màn hình trang GitHub Issues.

| Nguồn test case | Số bug tìm được |
| --------------- | :-------------: |
| AI sinh         |       «»        |
| Tôi tự bổ sung  |       «»        |

---

## 11. Phê bình AI (200–300 từ)

> ✍️ **Bắt buộc 200–300 từ.** Trả lời đủ 3 câu hỏi: (1) AI sai / thiên lệch / chưa đầy đủ ở đâu? (2) Vì sao nó không phát hiện được? (3) Rút ra nguyên tắc gì khi hợp tác với AI? Dẫn chứng bằng ID test case và số liệu cụ thể ở §4–§6, tránh viết chung chung.

«Đoạn văn 200–300 từ.»

_Số từ: «nnn»._

---

## 12. Nhật ký Git Commit

> ✍️ Đề yêu cầu **mỗi bước quy trình một commit** (sinh / kiểm toán / mở rộng / thực thi — cho từng API), và xuất ra file văn bản.

```bash
git log --pretty=format:"%h %ad %s" --date=short > git_commit_log.txt
```

| Commit | Ngày | Bước quy trình                           |
| ------ | ---- | ---------------------------------------- |
| «hash» | «»   | «feat(hw6): sinh test case AI cho API 1» |
| «hash» | «»   | «docs(hw6): kiểm toán test case API 1»   |
| «hash» | «»   | «feat(hw6): bổ sung 5 TC cho API 1»      |
| «hash» | «»   | «test(hw6): chạy Newman cho API 1»       |

File đầy đủ: [`git_commit_log.txt`](./git_commit_log.txt)

---

## 13. Danh sách sản phẩm nộp

> ✍️ Tên file zip: `«MSSV»_HW06_AI_API_«000».zip`. Thiếu bất kỳ mục bắt buộc nào → 0 điểm.

| ✔   | Sản phẩm                                                | Đường dẫn               |
| --- | ------------------------------------------------------- | ----------------------- |
| ☐   | Báo cáo chính (Markdown + PDF)                          | «Main_Report.md / .pdf» |
| ☐   | Link GitHub repo công khai                              | «URL»                   |
| ☐   | Postman collection (.json)                              | «»                      |
| ☐   | Báo cáo Newman (HTML)                                   | «»                      |
| ☐   | Danh sách tính năng Postman đã dùng                     | §7                      |
| ☐   | Báo cáo CI/CD + 2 run mẫu (ảnh + link)                  | §8                      |
| ☐   | Test case & bảng tổng hợp dạng Excel                    | «»                      |
| ☐   | Sơ đồ + pseudocode bộ sinh test (PNG/Mermaid + .md/.py) | «»                      |
| ☐   | (Tùy chọn) OpenAPI .yaml/.json đã kiểm toán             | «»                      |
| ☐   | Báo cáo lỗi + ảnh GitHub Issues                         | «»                      |
| ☐   | Phê bình AI + AI Audit Report (Markdown + PDF)          | «»                      |
| ☐   | Git commit log (.txt)                                   | «»                      |
| ☐   | README.md (bảng tự đánh giá + tổng hợp kết quả)         | «»                      |

---

## 14. Tự đánh giá

| STT | Tiêu chí                                                             | Điểm tối đa | Tự chấm | Căn cứ |
| :-: | -------------------------------------------------------------------- | :---------: | :-----: | ------ |
|  1  | API 1 — trọn quy trình (sinh + kiểm toán + mở rộng + thực thi + lỗi) |     30      |   «»    | §4     |
|  2  | API 2 — trọn quy trình (cùng tiêu chí)                               |     30      |   «»    | §5     |
|  3  | API 3 — trọn quy trình (cùng tiêu chí)                               |     30      |   «»    | §6     |
|  4  | Agent Skills (bộ sinh test do AI điều khiển)                         |     10      |   «»    | §9     |
|     | **Tổng**                                                             |   **100**   | **«»**  |        |

---

## 15. Tài liệu tham khảo

1. ISTQB Foundation Level Syllabus «phiên bản».
2. EShop SUT — `api_specification.md`, https://github.com/ttbhanh/eshop-sut
3. Hardman, P. (2025). _A Post-AI Learning Taxonomy._
4. Fuster Rabella, M. (2025). _OECD Education Working Paper No. 338._
5. Anthropic (2025). _Building Reliable AI Test Agents._
6. «Postman / Newman docs, DeepEval, Promptfoo…»

---

## Phụ lục A — AI Audit Report

Xem file riêng: `[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md`

Mỗi lần tương tác phải ghi đủ: **tên công cụ AI · ngày giờ · prompt của tôi · đầu ra của AI**.

| #   | Công cụ | Ngày giờ | Mục đích | Prompt (rút gọn) | Kết quả dùng ở § |
| --- | ------- | -------- | -------- | ---------------- | ---------------- |
| 1   | «»      | «»       | «»       | «»               | «§4.1»           |
| 2   | «»      | «»       | «»       | «»               | «»               |

---

## Phụ lục B — Chỉ mục bằng chứng

| Mã    | Nội dung                           | Đường dẫn | Tham chiếu |
| ----- | ---------------------------------- | --------- | ---------- |
| EV-01 | Console log `X-Student-Id`         | «»        | §2         |
| EV-02 | Newman CLI — API 1 (thấy hostname) | «»        | §4.4       |
| EV-03 | Newman HTML — API 1                | «»        | §4.4       |
| EV-04 | Newman CLI/HTML — API 2            | «»        | §5.4       |
| EV-05 | Newman CLI/HTML — API 3            | «»        | §6.4       |
| EV-06 | CI run xanh                        | «»        | §8.2       |
| EV-07 | CI run đỏ                          | «»        | §8.2       |
| EV-08 | GitHub Issues — BUG-01…            | «»        | §10        |
| EV-09 | Sơ đồ bộ sinh test (tự vẽ)         | «»        | §9.2       |
| EV-10 | Postman workspace / collection     | «»        | §7         |
