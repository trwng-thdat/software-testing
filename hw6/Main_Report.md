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

|                           | API 1 — `PUT /users/me` | API 2 — `PUT /orders/:id/cancel` | API 3 — `POST /admin/coupons` |  **Tổng**   |
| ------------------------- | :---------------------: | :------------------------------: | :---------------------------: | :---------: |
| Pool / FR                 |      A / **FR-04**      |          B / **FR-10**           |         C / **FR-17**         |      —      |
| Test case AI sinh         |           42            |                43                |              82               |     167     |
| — VALID                   |       31 (73.8%)        |            33 (76.7%)            |          65 (79.3%)           | 129 (77.2%) |
| — INVALID (đã sửa)        |        2 (4.8%)         |             2 (4.7%)             |           5 (6.1%)            |  9 (5.4%)   |
| — INCOMPLETE (đã bổ sung) |        9 (21.4%)        |            8 (18.6%)             |          12 (14.6%)           | 29 (17.4%)  |
| Test case tôi tự bổ sung  |            5            |                5                 |               5               |     15      |
| **Tổng test đã thực thi** |           «»            |                «»                |              «»               |     «»      |
| — PASS                    |           «»            |                «»                |              «»               |     «»      |
| — FAIL                    |           «»            |                «»                |              «»               |     «»      |
| Bug SUT phát hiện         |           «»            |                «»                |              «»               |     «»      |

| Kết luận chính            |                                                    |
| ------------------------- | -------------------------------------------------- |
| **Bug nghiêm trọng nhất** | «mô tả 1 dòng + link GitHub Issue»                 |
| **Lỗi của AI đáng chú ý** | «AI bỏ sót nhóm nào — bảo mật? chuyển trạng thái?» |
| **Vùng bảo mật yếu nhất** | «SEC-0x — mô tả»                                   |
| **Kết quả CI/CD**         | «run xanh: URL · run đỏ: URL»                      |

---

## Mục lục

|   §    | Nội dung                                                                            | Điểm chính                              |
| :----: | ----------------------------------------------------------------------------------- | --------------------------------------- |
| **1**  | [Phạm vi và Lựa chọn API](#1-phạm-vi-và-lựa-chọn-api)                               | 3 API / 3 Pool                          |
| **2**  | [Môi trường Kiểm thử](#2-môi-trường-kiểm-thử)                                       | «»                                      |
| **3**  | [Phương pháp làm việc với AI](#3-phương-pháp-làm-việc-với-ai)                       | P3–P11 (9 bước)                         |
| **4**  | API 1 — `PUT /api/users/me` (§4)                                                    | 42 TC AI + 5 tự bổ sung · «pending» bug |
| **5**  | API 2 — `PUT /api/orders/:id/cancel` (§5)                                           | 43 TC AI + 5 tự bổ sung · «pending» bug |
| **6**  | API 3 — `POST /api/admin/coupons` (§6)                                              | 82 TC AI + 5 tự bổ sung · «pending» bug |
| **7**  | [Tính năng Postman đã sử dụng](#7-tính-năng-postman-đã-sử-dụng)                     | «n» tính năng                           |
| **8**  | [Tích hợp CI/CD](#8-tích-hợp-cicd)                                                  | 2 run mẫu                               |
| **9**  | [Agent Skill — Bộ sinh test API](#9-agent-skill--bộ-sinh-test-api-do-ai-điều-khiển) | Sơ đồ tự vẽ                             |
| **10** | [Tổng hợp lỗi đã báo cáo](#10-tổng-hợp-lỗi-đã-báo-cáo)                              | «n» issue                               |
| **11** | [Phê bình AI](#11-phê-bình-ai-200300-từ)                                            | «n» từ                                  |
| **12** | [Nhật ký Git Commit](#12-nhật-ký-git-commit)                                        |                                         |
| **13** | [Danh sách sản phẩm nộp](#13-danh-sách-sản-phẩm-nộp)                                |                                         |
| **14** | [Tự đánh giá](#14-tự-đánh-giá)                                                      | «000»/100                               |
| **15** | [Tài liệu tham khảo](#15-tài-liệu-tham-khảo)                                        |                                         |
| **A**  | [Phụ lục A — AI Audit Report](#phụ-lục-a--ai-audit-report)                          |                                         |
| **B**  | [Phụ lục B — Chỉ mục bằng chứng](#phụ-lục-b--chỉ-mục-bằng-chứng)                    |                                         |

---

## 1. Phạm vi và Lựa chọn API

> ✍️ Đọc `api_specification.md` trong repo SUT. Chọn đúng 3 API thuộc 3 Pool khác nhau (A, B, C). Không trùng với thành viên khác trong nhóm.

| #   | Pool | FR        | Tính năng                         | Endpoint chính           | Method | Endpoint phụ trợ                              | Auth               |
| --- | ---- | --------- | --------------------------------- | ------------------------ | ------ | --------------------------------------------- | ------------------ |
| 1   | A    | **FR-04** | Quản lý thông tin cá nhân         | `/api/users/me`          | `PUT`  | `GET /api/users/me` — verify sau khi ghi      | Bearer JWT (user)  |
| 2   | B    | **FR-10** | Máy trạng thái đơn hàng — hủy đơn | `/api/orders/:id/cancel` | `PUT`  | —                                             | Bearer JWT (user)  |
| 3   | C    | **FR-17** | Quản lý mã giảm giá — tạo coupon  | `/api/admin/coupons`     | `POST` | `DELETE /api/admin/coupons/:id` — dọn dữ liệu | Bearer JWT (admin) |

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

| Bước | Mục tiêu kỹ thuật                                         | Prompt (tóm tắt)                                                                                            | Đầu ra AI                                                                 | Tôi đã chỉnh gì       |
| ---- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------- |
| P3   | Phân tích hợp đồng API (đối chiếu `api_specification.md`) | Trích method/endpoint/header/body/status/response cho từng API; tách rõ "đã đặc tả" vs "suy ra từ mã nguồn" | Bảng hợp đồng API 1–3 (dùng ở §4.0/§5.0/§6.0)                             | «xem AI Audit Report» |
| P4   | Phân tích mã nguồn SUT (`server.js`, `database.js`)       | Trace từng handler dòng-theo-dòng, đối chiếu P3                                                             | Sai lệch spec-vs-code (vd: `role` bị ghi đè, `phone` không được validate) | «»                    |
| P5   | Phân vùng miền giá trị (EP) từng tham số                  | Liệt kê lớp hợp lệ/không hợp lệ mỗi field, tách "theo đặc tả" vs "theo mã nguồn"                            | Bảng EP đầy đủ cho 3 API                                                  | «»                    |
| P6   | Phân tích giá trị biên (BVA)                              | Áp dụng biên min−1/min/min+1/max−1/max/max+1 cho ràng buộc trong P5                                         | Bảng biên (`phone`, `discount_value`, `max_uses_per_user`…)               | «»                    |
| P7   | Chuyển trạng thái (FR-10)                                 | Xây mô hình trạng thái đơn hàng từ đặc tả + mã nguồn, không giả định trạng thái vô căn cứ                   | Bảng chuyển trạng thái hợp lệ/không hợp lệ (dùng ở §5)                    | «»                    |
| P8   | Bảo mật SEC-01 … SEC-07                                   | Ánh xạ từng SEC-0x vào 3 API, chỉ giữ yêu cầu thực sự áp dụng                                               | Ma trận bảo mật theo API (dùng ở §6.9)                                    | «»                    |
| P9   | Kiểm tra schema response                                  | Trích schema response 2xx/lỗi từ mã nguồn (không có trong đặc tả)                                           | Bảng schema theo status code                                              | «»                    |
| P10  | Ma trận phủ kiểm thử (Coverage Matrix)                    | Tổng hợp P5–P9 thành Coverage ID, xác định số TC tối thiểu                                                  | Ma trận Coverage ID + kế hoạch phân bổ TC theo kỹ thuật                   | «»                    |
| P11  | Sinh test case bằng AI                                    | Sinh ≥35 TC/API, mỗi TC truy vết Coverage ID (P10)                                                          | 167 TC cho 3 API (42+43+82) — chi tiết ở §4.1/§5.1/§6.1                   | «»                    |

**Toàn văn prompt & output:** Phụ lục A (AI Audit Report).

---

## 4. API 1 — `PUT /api/users/me` (FR-04)

> ✍️ **Sao chép nguyên khối §4 này cho API 2 (§5) và API 3 (§6).** Cấu trúc 5 bước bám đúng §6 của đề: sinh → kiểm toán → mở rộng → thực thi → lỗi.

### 4.0 Đặc tả tóm tắt

| Thuộc tính   | Giá trị                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint     | `PUT /api/users/me` (verify bằng `GET /api/users/me`)                                                                                                                                                                                                                                                                                                            |
| Pool / FR    | A / FR-04 — Quản lý thông tin cá nhân                                                                                                                                                                                                                                                                                                                            |
| Auth         | Bearer JWT (user) — `authenticateToken`, `server.js:100-110`                                                                                                                                                                                                                                                                                                     |
| Request body | `name` (string), `shipping_address` (string), `phone` (string) — theo `api_specification.md §2.2`. Trường `role` **không được đặc tả** nhưng mã nguồn vẫn đọc/ghi nếu truthy (`server.js:119,124-127`) — vi phạm SEC-06                                                                                                                                          |
| Response 2xx | `200` — `{"message":"Profile updated"}` (không đặc tả trong `api_specification.md`; suy từ `server.js:133`)                                                                                                                                                                                                                                                      |
| Mã lỗi       | **Từ handler (JSON):** `401` `{"error":"Unauthorized"}` · `403` `{"error":"Forbidden"}` · `500` `{"error":"<sqlite message>"}` — không có 400/404 vì không có validation/existence check.<br>**Từ middleware `bodyParser` (HTML, không phải JSON):** `400` khi JSON sai cú pháp · `500` khi thiếu body — phát hiện khi probe ở Bước 2, xem §4.2 và TC A1-E01/E02 |
| Yêu cầu SEC  | SEC-02 (JWT hợp lệ — có, nhưng secret hardcode `server.js:9`, token không hết hạn) · **SEC-06 (vi phạm — `role` bị client ghi đè)** · SEC-05 (parameterized query — đạt) · SEC-01 (không áp dụng trực tiếp cho PUT, nhưng `GET /api/users/me` lộ `password`/`reset_token` dạng plaintext)                                                                        |

**Bảng tham số & phân vùng miền giá trị** _(rút gọn từ P5/P6; chi tiết đầy đủ nằm ở `testcases/API1.xlsx`)_

| Tham số            | Kiểu                  | Ràng buộc                                                                 | Phân vùng hợp lệ                            | Phân vùng không hợp lệ                                      | Giá trị biên                                       |
| ------------------ | --------------------- | ------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| `name`             | string                | Không đặc tả (không bắt buộc/độ dài)                                      | Chuỗi bất kỳ                                | rỗng/null/sai kiểu (đều được chấp nhận — không validate)    | Không áp dụng                                      |
| `shipping_address` | string                | Không đặc tả                                                              | Chuỗi bất kỳ                                | rỗng/null/sai kiểu (đều được chấp nhận)                     | Không áp dụng                                      |
| `phone`            | string                | FR-04: bắt đầu `0`, 10–11 chữ số (**không được thực thi trong mã nguồn**) | `0912345678` (10 số), `09123456789` (11 số) | Sai định dạng — **vẫn được chấp nhận**                      | 9/10/11/12 chữ số; ký tự đầu `0` vs khác `0`       |
| `role`             | string (không đặc tả) | SEC-06: cấm client thay đổi                                               | (không nên gửi trường này)                  | `"admin"`, `"user"`, `"superadmin"` — **đều bị ghi vào DB** | số `0` (bị bỏ qua) vs chuỗi `"0"` (**vẫn bị ghi**) |

### 4.1 Bước 1 — Sinh test case bằng AI

**Mục tiêu ≥ 35 test case.** Số thực tế AI sinh: **42**.

| Nhóm kỹ thuật          | Số TC | Ghi chú                                                                                                               |
| ---------------------- | :---: | --------------------------------------------------------------------------------------------------------------------- |
| Phân vùng miền giá trị |  14   | `name`/`shipping_address`/`phone`/`role` (thiếu/rỗng/sai kiểu), body combo                                            |
| Giá trị biên           |   8   | Độ dài `phone` (9/10/11/12 số), ký tự đầu `phone`, header 2-khoảng-trắng, `role` số `0` vs chuỗi `"0"`                |
| Chuyển trạng thái      |   0   | **P7 kết luận: không áp dụng** — endpoint này không có máy trạng thái ý nghĩa (không phải thiếu sót)                  |
| Bảo mật (SEC-01…07)    |  10   | Auth bypass (401/403/token giả mạo), leo thang quyền `role` (SEC-06), SQLi/XSS payload                                |
| Kiểm tra schema        |   6   | Response 2xx/401/403, schema `GET /api/users/me`, kiểm tra không lộ trường bị ghi đè                                  |
| Quy tắc nghiệp vụ khác |   4   | Ngữ nghĩa ghi-đè-toàn-bộ (full-replace), scheme header không chuẩn, header rỗng, phân kỳ token/DB sau leo thang quyền |
| **Tổng**               |  42   | ≥ 35 theo yêu cầu đề bài                                                                                              |

**Tiền điều kiện chung cho mọi TC của API 1.** SUT chạy tại `http://localhost:3000`, DB vừa seed lại (`node database.js` → `node server.js`) nên `test@eshop.com` / `Test1234!` là user `id=2`, `role="user"`. `{{token}}` = token lấy từ `POST /api/login` của user này, dùng lại cho mọi TC trừ khi TC ghi khác. Mọi TC ghi dữ liệu đều verify lại bằng `GET /api/users/me`.

**Bảng test case đầy đủ — 42 TC** _(ID `TC-API1-001`…`TC-API1-042`; đây là danh sách chuẩn — khi xuất sang `testcases/API1.xlsx` phải giữ nguyên ID để bảo toàn truy vết)_

| ID              | Tiêu đề                                               | Kỹ thuật                     | Truy vết (Coverage / FR / SEC)      | Input / Precondition riêng                                                     | Expected (status + body)                                                                            | Nguồn           |
| --------------- | ----------------------------------------------------- | ---------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------- |
| TC-API1-001     | Cập nhật hồ sơ hợp lệ (happy path)                    | EP                           | COV-001,047 · FR-04 §2.2            | `{"name":"Nguyen Van A","shipping_address":"123 Le Loi","phone":"0912345678"}` | 200 · `{"message":"Profile updated"}`                                                               | AI              |
| TC-API1-002     | Thiếu trường `name`                                   | EP                           | COV-013 · FR-04                     | Body không có key `name`                                                       | 200 · `{"message":"Profile updated"}` (không có validate)                                           | AI              |
| TC-API1-003     | `name` là chuỗi rỗng                                  | EP                           | COV-014 · (không đặc tả)            | `name:""`                                                                      | 200 · `{"message":"Profile updated"}`                                                               | AI              |
| TC-API1-004     | `name` sai kiểu (number)                              | EP                           | COV-016 · (không đặc tả)            | `name:12345`                                                                   | `200` · `{"message":"Profile updated"}`; `GET` trả `name="12345"` (**chuỗi** — TEXT affinity ép số) | AI · **đã sửa** |
| TC-API1-005     | Thiếu trường `shipping_address`                       | EP                           | COV-022 · FR-04                     | Body không có key `shipping_address`                                           | 200 · `{"message":"Profile updated"}`                                                               | AI              |
| TC-API1-006     | `shipping_address` sai kiểu (object)                  | EP                           | COV-025 · (không đặc tả)            | `shipping_address:{"street":"123 Le Loi"}`                                     | `200`; `GET` trả `shipping_address="[object Object]"` — **hỏng dữ liệu thầm lặng**                  | AI · **đã sửa** |
| TC-API1-007     | Gửi key camelCase `shippingAddress` — bị bỏ qua       | EP                           | COV-028 · (BUG-D3 nhóm đã ghi nhận) | `shippingAddress:"789 Nguyen Hue"`                                             | 200, `GET` cho thấy `shipping_address` **không** đổi                                                | AI              |
| TC-API1-008     | Thiếu trường `phone`                                  | EP                           | COV-037 · FR-04                     | Body không có key `phone`                                                      | 200 · `{"message":"Profile updated"}`                                                               | AI              |
| TC-API1-009     | `phone` chứa ký tự không phải số                      | EP                           | COV-034 · FR-04 (không thực thi)    | `phone:"0912-345-678"`                                                         | 200 (kỳ vọng đặc tả: từ chối)                                                                       | AI              |
| TC-API1-010     | `phone` gửi dưới dạng JSON number                     | EP                           | COV-038 · FR-04                     | `phone:912345678` (number)                                                     | 200 — kiểu số không thể giữ số `0` đầu                                                              | AI              |
| TC-API1-011     | `phone` khớp regex client web nhưng trái FR-04        | EP                           | COV-039 · xung đột 2 oracle         | `phone:"912345678"` (9 số, không có `0` đầu)                                   | 200 — chứng minh cả 2 luật đều không được backend thực thi                                          | AI              |
| TC-API1-012     | Không gửi `role` (baseline đối chiếu)                 | EP                           | COV-041 · SEC-06                    | 3 trường hợp lệ, không có `role`                                               | 200, `GET` cho thấy `role` vẫn `"user"`                                                             | AI              |
| TC-API1-013     | Trường lạ không được nhận diện bị bỏ qua              | EP                           | COV-051 · §2.2                      | `{...,"foo":"bar"}`                                                            | 200, `foo` không có tác dụng                                                                        | AI              |
| TC-API1-014     | `name`/`địa chỉ` hợp lệ + `phone` sai định dạng       | EP                           | COV-052 · FR-04                     | `phone:"abc"`, 2 trường kia hợp lệ                                             | 200 — luật phone không được thực thi kể cả trong ngữ cảnh hỗn hợp                                   | AI              |
| TC-API1-015     | `phone` 9 chữ số (biên min−1)                         | BVA                          | COV-032 · FR-04                     | `phone:"091234567"`                                                            | 200 (kỳ vọng đặc tả: từ chối)                                                                       | AI              |
| TC-API1-016     | `phone` 10 chữ số (biên min)                          | BVA                          | COV-029 · FR-04                     | `phone:"0912345678"`                                                           | 200 · hợp lệ theo cả đặc tả lẫn mã nguồn                                                            | AI              |
| TC-API1-017     | `phone` 11 chữ số (biên max)                          | BVA                          | COV-030 · FR-04                     | `phone:"09123456789"`                                                          | 200 · hợp lệ theo cả đặc tả lẫn mã nguồn                                                            | AI              |
| TC-API1-018     | `phone` 12 chữ số (biên max+1)                        | BVA                          | COV-033 · FR-04                     | `phone:"091234567890"`                                                         | 200 (kỳ vọng đặc tả: từ chối)                                                                       | AI              |
| TC-API1-019     | `phone` đúng độ dài nhưng không bắt đầu bằng `0`      | BVA                          | COV-031,040 · FR-04                 | `phone:"1912345678"`                                                           | 200 (kỳ vọng đặc tả: từ chối)                                                                       | AI              |
| TC-API1-020     | Header `Authorization` có 2 dấu cách liên tiếp        | BVA                          | COV-011 · (chỉ có ở mã nguồn)       | `Authorization: Bearer  {{token}}`                                             | **403** `{"error":"Forbidden"}` — **không phải 401**                                                | AI              |
| TC-API1-021     | `role` là số `0` (falsy) — không ghi                  | BVA                          | COV-042,046 · SEC-06                | `role:0`                                                                       | 200, `GET` cho thấy `role` vẫn `"user"`                                                             | AI              |
| TC-API1-022     | `role` là chuỗi `"0"` (truthy) — **bị ghi**           | BVA + Security               | COV-046 · SEC-06                    | `role:"0"`                                                                     | 200, `GET` cho thấy `role` = `"0"`                                                                  | AI              |
| TC-API1-023     | Không gửi header `Authorization`                      | Security                     | COV-003 · SEC-02                    | (bỏ header)                                                                    | 401 · `{"error":"Unauthorized"}`                                                                    | AI              |
| TC-API1-024     | Header không có dấu cách phân tách                    | Security                     | COV-005 · SEC-02                    | `Authorization: SomeGarbageWithNoSpace`                                        | 401 · `{"error":"Unauthorized"}`                                                                    | AI              |
| TC-API1-025     | JWT sai cú pháp                                       | Security                     | COV-007 · SEC-02                    | `Authorization: Bearer not-a-valid-jwt`                                        | 403 · `{"error":"Forbidden"}`                                                                       | AI              |
| TC-API1-026     | JWT ký bằng secret khác                               | Security                     | COV-008 · SEC-02                    | Token ký bằng khoá sai                                                         | 403 · `{"error":"Forbidden"}`                                                                       | AI              |
| TC-API1-027     | Token giả mạo có `exp` quá khứ                        | Security                     | COV-009 · SEC-02                    | Token tự ký bằng `SECRET_KEY` lộ, `exp` ở quá khứ                              | 403 · `{"error":"Forbidden"}`                                                                       | AI              |
| TC-API1-028     | Token hợp lệ nhưng `id` không tồn tại                 | Security                     | COV-010 · (không đặc tả)            | Token tự ký `{id:999999}`                                                      | 200 dù 0 dòng bị cập nhật (`this.changes` không kiểm)                                               | AI              |
| TC-API1-029     | **[CRITICAL]** Leo thang quyền qua `role:"admin"`     | Security                     | COV-043,061 · **SEC-06**, FR-04     | `{...,"role":"admin"}`                                                         | 200, `GET` cho thấy `role="admin"` — **vi phạm SEC-06**                                             | AI              |
| TC-API1-030     | `role` ngoài enum (`"superadmin"`)                    | Security                     | COV-045 · SEC-06                    | `role:"superadmin"`                                                            | 200, lưu nguyên văn — không có enum check                                                           | AI              |
| TC-API1-031     | Payload SQL injection trong `name`                    | Security                     | COV-019,060 · SEC-05                | `name:"Robert'); DROP TABLE users;--"`                                         | 200 · lưu như chuỗi literal, bảng `users` còn nguyên                                                | AI              |
| TC-API1-032     | Payload script/XSS trong `name`                       | Security                     | COV-018,059 · SEC-04                | `name:"<script>alert(1)</script>"`                                             | 200 · `GET` trả về nguyên văn (chỉ kiểm lưu/phản hồi, không kiểm render)                            | AI              |
| TC-API1-033     | Schema response thành công                            | Schema                       | COV-063                             | Body hợp lệ                                                                    | 200 · đúng 1 key `message`, không dư trường                                                         | AI              |
| ~~TC-API1-034~~ | Schema lỗi 401 — **đã gộp vào TC-API1-023**           | Schema                       | COV-064                             | —                                                                              | (2 assertion của TC-023: status + schema)                                                           | AI · **đã gộp** |
| TC-API1-035     | Schema lỗi 403                                        | Schema                       | COV-065                             | Token sai cú pháp                                                              | 403 · đúng 1 key `error` = `"Forbidden"`                                                            | AI              |
| TC-API1-036     | Schema xác minh của `GET /api/users/me`               | Schema                       | COV-067 · (endpoint hỗ trợ)         | — (GET)                                                                        | 200 · đủ 10 trường theo `database.js:50-61`                                                         | AI              |
| TC-API1-037     | Response `PUT` không echo trường nào đã ghi           | Schema                       | COV-068                             | `name:"Distinctive Test Name XYZ"`                                             | 200 · body **không** chứa giá trị vừa gửi                                                           | AI              |
| TC-API1-038     | `GET /api/users/me` lộ `password` plaintext           | Schema + Security            | COV-056 · SEC-01 (liên đới)         | — (GET)                                                                        | 200 · body chứa `"password":"Test1234!"`                                                            | AI              |
| TC-API1-039     | Ngữ nghĩa ghi-đè-toàn-bộ: bỏ trường sẽ xoá giá trị cũ | Quy tắc nghiệp vụ            | COV-069 · FR-04 (suy từ mã nguồn)   | B1 đặt `shipping_address` giá trị riêng; B2 gửi PUT không kèm trường này       | 200, `GET` cho thấy giá trị cũ **đã mất**                                                           | AI              |
| TC-API1-040     | Scheme header không chuẩn vẫn được chấp nhận          | Quy tắc nghiệp vụ            | COV-006 · §2 (đặc tả ghi `Bearer`)  | `Authorization: Basic {{token}}`                                               | 200 — scheme không được kiểm                                                                        | AI              |
| TC-API1-041     | Header `Authorization` rỗng → 403 (không phải 401)    | Quy tắc nghiệp vụ            | COV-004 · (chỉ có ở mã nguồn)       | `Authorization: ` (rỗng)                                                       | 403 · `{"error":"Forbidden"}` — vì `"" == null` là false                                            | AI              |
| TC-API1-042     | Token mang claim `role` cũ sau khi leo thang          | Quy tắc nghiệp vụ + Security | COV-070 · SEC-06                    | Chạy sau TC-029, dùng lại đúng token cũ                                        | `GET` cho `role="admin"` nhưng payload JWT vẫn `role="user"`                                        | AI              |

> **Trạng thái sau Bước 2 (kiểm toán).** `TC-API1-004`, `-006` **đã chốt expected bằng probe thật** (xem §4.2). `-020`, `-041` đã xác nhận đúng khi chạy (403, không phải 401). `-034` đã gộp vào `-023`. Còn lại `-027`, `-028`, `-042` cần pre-request script tự ký JWT — sẽ chốt ở Bước 4.

### 4.2 Bước 2 — Kiểm toán (rà soát của con người)

**Cách tôi kiểm toán.** Tôi không gán nhãn bằng cách đọc lướt. Với 42 TC của API 1, tôi làm ba việc: (1) đối chiếu từng `Expected` với `backend/server.js` ở đúng dòng xử lý; (2) **dựng SUT lên chạy thật** để chốt các TC mà AI để expected ở dạng "chưa xác nhận" — vì một test case không có kết quả mong đợi quyết định được thì không thể pass/fail, tức là chưa dùng được; (3) đối chiếu chéo với `README.md` (FR-04, SEC-06) xem nhãn kỹ thuật AI gán có đúng không.

Môi trường probe: `node database.js` → `node server.js` trên `localhost:3000`, DB seed sạch, tài khoản `test@eshop.com` (id=2).

| Nhãn       | Số TC  | Tỉ lệ |
| ---------- | :----: | :---: |
| VALID      |   31   | 73.8% |
| INVALID    |   2    | 4.8%  |
| INCOMPLETE |   9    | 21.4% |
| **Tổng**   | **42** | 100%  |

**Chi tiết các test case KHÔNG đạt**

| ID          | Nhãn        | AI viết gì                             | Vì sao sai / thiếu (dẫn chứng)                                                                                                                                                                                                                                                                                                   | Tôi sửa thành                                                                                                             |
| ----------- | ----------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| TC-API1-004 | **INVALID** | Expected: `200 **hoặc** 500`           | Một TC có hai kết quả mong đợi loại trừ nhau thì không thể đánh giá pass/fail — vi phạm nguyên tắc cơ bản của test case. AI viết vậy vì không suy được hành vi bind kiểu của `sqlite3` chỉ từ `server.js:122`. **Tôi chạy thật:** `name:12345` → `200`, và `GET` trả về `name:"12345"` — SQLite TEXT affinity ép số thành chuỗi. | Expected: `200` · `{"message":"Profile updated"}`; thêm assertion `GET` trả `name === "12345"` (kiểu string)              |
| TC-API1-006 | **INVALID** | Expected: `200 **hoặc** 500`           | Cùng lỗi trên. **Tôi chạy thật:** `shipping_address:{"street":"x"}` → `200`, lưu thành chuỗi **`"[object Object]"`**. Đây là hỏng dữ liệu thầm lặng, đáng giá hơn hẳn cái expected mơ hồ ban đầu.                                                                                                                                | Expected: `200`; assertion `GET` trả `shipping_address === "[object Object]"` — ghi nhận là lỗi mất dữ liệu               |
| TC-API1-002 | INCOMPLETE  | Chỉ kiểm `200` khi bỏ trường `name`    | Không assert điều quan trọng nhất: `server.js:121-122` ghi `name` **vô điều kiện**, nên bỏ trường sẽ **ghi đè** giá trị cũ chứ không giữ nguyên. TC như AI viết vẫn pass kể cả khi SUT hành xử đúng lẫn sai.                                                                                                                     | Thêm bước `GET` trước/sau, assert `name` đã bị thay đổi                                                                   |
| TC-API1-005 | INCOMPLETE  | Tương tự với `shipping_address`        | Cùng lý do                                                                                                                                                                                                                                                                                                                       | Thêm assertion so sánh trước/sau                                                                                          |
| TC-API1-008 | INCOMPLETE  | Tương tự với `phone`                   | Cùng lý do                                                                                                                                                                                                                                                                                                                       | Thêm assertion so sánh trước/sau                                                                                          |
| TC-API1-027 | INCOMPLETE  | Token giả mạo `exp` quá khứ → 403      | Thiếu tiền điều kiện _cách tạo token_. `server.js:51` ký token **không** có `expiresIn`, nên trạng thái "token hết hạn" **không tồn tại** trong luồng đăng nhập bình thường — bắt buộc phải tự ký bằng `SECRET_KEY` ở `server.js:9`. AI không ghi rõ điều này.                                                                   | Thêm pre-request script tạo token có `exp` quá khứ; ghi rõ đây là trạng thái chỉ tới được bằng giả mạo                    |
| TC-API1-028 | INCOMPLETE  | Token `id=999999` → 200                | Thiếu bước chứng minh **0 dòng bị ghi**. Đúng ra phải chỉ ra `server.js:131-134` không kiểm `this.changes`, nên 200 ở đây không đồng nghĩa với "đã cập nhật".                                                                                                                                                                    | Thêm assertion: `GET` bằng token user thật cho thấy hồ sơ **không** đổi                                                   |
| TC-API1-034 | INCOMPLETE  | Schema 401 — request y hệt TC-API1-023 | Cùng một request, cùng expected, chỉ khác nhãn kỹ thuật. Trong Postman đây là **một** request với hai assertion, không phải hai TC.                                                                                                                                                                                              | Gộp vào TC-API1-023, giữ 2 assertion (status + schema)                                                                    |
| TC-API1-038 | INCOMPLETE  | Assert `password === "Test1234!"`      | Hard-code mật khẩu seed. Nếu chạy sau bất kỳ TC nào của FR-03 (reset password) thì giá trị đổi, TC fail sai.                                                                                                                                                                                                                     | Đổi thành assert **trường `password` tồn tại trong response** — đó mới là điều SEC-01 quan tâm, không phải giá trị cụ thể |
| TC-API1-039 | INCOMPLETE  | Mô tả 2 bước trong 1 dòng              | Không tách rõ setup và assert; Newman cần 2 request riêng                                                                                                                                                                                                                                                                        | Tách thành 2 request nối bằng `postman.setNextRequest`                                                                    |
| TC-API1-042 | INCOMPLETE  | So claim `role` trong token với DB     | Không phải assertion HTTP thuần — phải giải mã payload JWT                                                                                                                                                                                                                                                                       | Ghi rõ dùng test script `atob(token.split('.')[1])` để đọc claim                                                          |

**Tôi cũng sửa một lỗi trong chính §4.0 do kiểm toán phát hiện.** §4.0 ban đầu tôi ghi _"không có 400/404"_. Khi probe tôi thấy **JSON sai cú pháp trả `400`** và **không gửi body trả `500`**, cả hai đều là **trang HTML** của Express chứ không phải `{"error":...}`. Nguyên nhân: hai nhánh này phát sinh ở `bodyParser.json()` (`server.js:12`) **trước khi** vào handler, nên đọc handler không thể thấy. Đã sửa §4.0 và bổ sung thành 2 TC ở Bước 3.

**Nhận xét kiểm toán.** Sai sót của AI đi theo hai khuôn rõ rệt. Thứ nhất — và nguy hiểm nhất — là **né tránh kết luận**: khi không suy được hành vi từ mã nguồn tĩnh, AI viết expected kiểu "200 hoặc 500" thay vì nói thẳng "cần chạy thử". Hai TC như vậy trông đầy đủ nhưng thực chất không kiểm được gì. Thứ hai là **assert nông**: nhiều TC (002, 005, 008, 028) chỉ kiểm status code mà bỏ qua đúng thứ cần kiểm là _dữ liệu sau khi ghi_ — mà với endpoint này, `PUT` không echo lại gì nên status code gần như vô nghĩa nếu không có `GET` đi kèm. Đáng chú ý là các nhóm AI làm **tốt**: toàn bộ 8 TC biên `phone` và 4 TC ranh giới truthy `role` đều đúng khi tôi probe lại — AI mạnh ở chỗ suy diễn có luật rõ ràng, yếu ở chỗ phải quyết định khi thiếu thông tin.

### 4.3 Bước 3 — Mở rộng (≥ 5 test case tự nghĩ)

| ID         | Tiêu đề                                                                   | Kỹ thuật / SEC  | Input                                                                                           | Expected                                                                          | **Vì sao AI bỏ sót**                                                                                                                                                                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A1-E01** | JSON sai cú pháp trả `400` **dạng HTML**, không phải JSON                 | Schema          | `PUT` với body `{"name":"A",` (cụt), `Content-Type: application/json`                           | `400` · body là trang HTML `<!DOCTYPE html>`, **không** có key `error`            | **Hạn chế của mô hình.** AI trace từ `app.put` (`server.js:118`) xuống, nên chỉ thấy các nhánh _bên trong_ handler và kết luận "không có 400". Nó không xét `bodyParser.json()` ở `server.js:12` — middleware chạy **trước** handler và tự sinh 400. Đây là điểm mù của lối đọc code từ điểm vào cục bộ.                                                               |
| **A1-E02** | Không gửi body trả `500` **dạng HTML**                                    | Schema          | `PUT` không body, không `Content-Type`                                                          | `500` · trang HTML, **không** có key `error`                                      | **Hạn chế của mô hình.** Cùng gốc với E01. AI có nêu nghi vấn "destructure `req.body` không có guard" ở P4 nhưng **không dám chốt**, nên không sinh TC. Tôi chạy thật thì `req.body` là `undefined` → `TypeError` ở `server.js:119` → Express trả 500 HTML. Hệ quả nghiêm trọng: client parse JSON sẽ crash.                                                           |
| **A1-E03** | Mạo danh **id có thật** của người khác để sửa hồ sơ họ                    | SEC-02 / IDOR   | Token tự ký `{id:1,role:"user"}` (id 1 = admin thật), body đổi `name`                           | `200`, hồ sơ **admin** bị sửa bởi người không phải admin                          | **Đặc điểm riêng của API.** AI kết luận đúng rằng endpoint "không có kênh IDOR" vì `WHERE id = req.user.id` lấy từ token. Nhưng nó coi token là **bất khả xâm phạm**, trong khi `SECRET_KEY` nằm ngay trong repo (`server.js:9`). AI có sinh TC-028 (id **không tồn tại**) mà không sinh TC mạo danh id **có thật** — đúng ra mới là kịch bản gây hại.                 |
| **A1-E04** | Chuỗi leo thang **đầy đủ**: nâng quyền → đăng nhập lại → dùng quyền admin | SEC-06 → SEC-03 | (1) `PUT` `role:"admin"` · (2) `POST /api/login` lấy token mới · (3) gọi `GET /api/admin/users` | Bước 3 trả `200` — leo thang **có hiệu lực thật**, không chỉ đổi giá trị trong DB | **Chất lượng prompt.** Tôi yêu cầu AI phân tích _từng API riêng lẻ_, nên nó dừng ở "role đổi được" (TC-029) và ghi nhận token cũ còn stale (TC-042) — rồi kết luận hệ quả "chỉ tiềm ẩn". Nó không tự bắc cầu sang bước đăng nhập lại vì tôi chưa bao giờ yêu cầu nối chuỗi liên-API.                                                                                   |
| **A1-E05** | Kiểm chứng **động** rằng `email` thật sự không sửa được                   | FR-04           | `PUT` body kèm `"email":"hacker@evil.com"`                                                      | `200`, `GET` cho thấy `email` **vẫn là** `test@eshop.com`                         | **Hạn chế của mô hình.** AI kết luận `email` an toàn "by construction" vì không nằm trong danh sách destructure ở `server.js:119` — một suy luận **tĩnh** rồi coi như xong. Nhưng FR-04 nêu ràng buộc này rõ ràng, mà ràng buộc đã nêu thì phải có TC chứng minh, không được suy luận thay. Đây là loại giả định "chắc chắn đúng nên khỏi test" mà con người phải bắt. |

| Nguyên nhân bỏ sót     | Số TC | Diễn giải                                                                                                                             |
| ---------------------- | :---: | ------------------------------------------------------------------------------------------------------------------------------------- |
| Chất lượng prompt      |   1   | A1-E04 — tôi ra lệnh phân tích từng API tách biệt nên AI không nối chuỗi hệ quả liên-API. Lỗi của tôi, không phải của AI.             |
| Hạn chế của mô hình    |   3   | A1-E01, A1-E02 (đọc code từ handler ra ngoài nên mù middleware), A1-E05 (dừng ở suy luận tĩnh, không chuyển thành TC)                 |
| Đặc điểm riêng của API |   1   | A1-E03 — bảo mật của endpoint này dựa **hoàn toàn** vào tính toàn vẹn của token; khi secret bị lộ thì kết luận "không có IDOR" sụp đổ |

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

| Thuộc tính   | Giá trị                                                                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint     | `PUT /api/orders/:id/cancel`                                                                                                                                                                                                                                                             |
| Pool / FR    | B / FR-10 — Máy trạng thái đơn hàng / Hủy đơn                                                                                                                                                                                                                                            |
| Auth         | Bearer JWT (user) — `authenticateToken`, `server.js:100-110`                                                                                                                                                                                                                             |
| Request body | Không có (endpoint bỏ qua `req.body` hoàn toàn — `server.js:321-342`)                                                                                                                                                                                                                    |
| Tham số path | `:id` — không được validate định dạng/kiểu trong mã nguồn                                                                                                                                                                                                                                |
| Response 2xx | `200` — `{"message":"Order canceled successfully"}` (không đặc tả trong `api_specification.md §4.6`; suy từ `server.js:337`) — **không trả `id` hay `status` mới**, phải verify bằng `GET /api/orders/my-orders`                                                                         |
| Mã lỗi       | `401` `{"error":"Unauthorized"}` · `403` `{"error":"Forbidden"}` · `404` `{"error":"Order not found"}` (gộp 2 nguyên nhân: đơn không tồn tại VÀ đơn của người khác) · `400` `{"error":"Cannot cancel this order."}` (gộp `delivered` và `canceled`) — **không có 500** trên endpoint này |
| Yêu cầu SEC  | SEC-02 (JWT hợp lệ — có) · SEC-05 (parameterized query trên `:id` — đạt) · **Không có SEC ID nào đặt tên trực tiếp cho lỗ hổng phân quyền theo trạng thái `shipping`** — xem P7/P8                                                                                                       |

### 5.1 Bước 1 — Sinh test case bằng AI

**Mục tiêu ≥ 35 test case.** Số thực tế AI sinh: **43**.

| Nhóm kỹ thuật          | Số TC | Ghi chú                                                                                                       |
| ---------------------- | :---: | ------------------------------------------------------------------------------------------------------------- |
| Phân vùng miền giá trị |   7   | `:id` (không tồn tại, không phải số, âm, thập phân, ký tự lạ), body bị bỏ qua — `TC-API2-002`…`008`           |
| Giá trị biên           |   8   | `:id` biên cấu trúc (0/1/2), token giả mạo với `id` biên (0/1/2), header 2-khoảng-trắng                       |
| **Chuyển trạng thái**  | **9** | **Toàn bộ mô hình 5 trạng thái từ P7** — xem ma trận bên dưới                                                 |
| Bảo mật (SEC-01…07)    |  11   | Auth bypass, IDOR (đơn của người khác), admin không sở hữu vẫn bị chặn, SQLi trên `:id`, token giả mạo        |
| Kiểm tra schema        |   8   | Response 2xx/401/403/404/400, xác nhận không có 500, xác nhận trạng thái không xuất hiện trong response `PUT` |
| **Tổng**               |  43   | ≥ 35 theo yêu cầu đề bài                                                                                      |

**Tiền điều kiện chung cho mọi TC của API 2.** DB vừa seed lại (**không có đơn hàng nào được seed** — mọi đơn phải tạo bằng `POST /api/checkout`, luôn bắt đầu ở `pending`). **User A** = `test@eshop.com`/`Test1234!` (`id=2`) → `{{tokenA}}`. **User B** = tài khoản thứ hai đăng ký mới → `{{tokenB}}` (cần cho TC kiểm tra ownership). **Admin** = `admin@eshop.com`/`Admin123!` (`id=1`) → `{{tokenAdmin}}`, **chỉ dùng để dựng trạng thái** qua `PUT /api/admin/orders/:id/status`, không phải chủ thể kiểm thử trừ khi TC ghi rõ. Verify trạng thái sau mỗi lần hủy bằng `GET /api/orders/my-orders`.

**Bảng test case đầy đủ — 43 TC** _(ID `TC-API2-001`…`TC-API2-043`)_

| ID          | Tiêu đề                                                       | Kỹ thuật          | Truy vết (Coverage / FR / SEC)           | Input / Precondition riêng                                 | Expected (status + body)                                                             | Nguồn                        |
| ----------- | ------------------------------------------------------------- | ----------------- | ---------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------- |
| TC-API2-001 | Hủy đơn `pending` (chuyển tiếp hợp lệ)                        | ST + EP           | COV-001,029 · FR-10                      | Đơn của user A, `status=pending`                           | 200 · `{"message":"Order canceled successfully"}`, `GET` → `status="canceled"`       | AI                           |
| TC-API2-002 | `:id` hợp lệ nhưng đơn không tồn tại                          | EP                | COV-013                                  | `:id=999999`                                               | 404 · `{"error":"Order not found"}`                                                  | AI                           |
| TC-API2-003 | `:id` không phải số                                           | EP                | COV-006                                  | `:id="abc"`                                                | `404` · `{"error":"Order not found"}`                                                | AI · **đã sửa**              |
| TC-API2-004 | `:id` là segment rỗng                                         | EP                | COV-007                                  | `/api/orders//cancel`                                      | `404` · body là **HTML** của Express (404 tầng routing), **không** phải JSON của SUT | AI · **đã sửa**              |
| TC-API2-005 | `:id` âm                                                      | EP                | COV-008                                  | `:id=-1`                                                   | 404 — `AUTOINCREMENT` không bao giờ sinh id âm                                       | AI                           |
| TC-API2-006 | `:id` dạng thập phân                                          | EP                | COV-010                                  | `:id=1.5`                                                  | `404` · `{"error":"Order not found"}`                                                | AI · **đã sửa**              |
| TC-API2-007 | `:id` có ký tự thừa                                           | EP                | COV-011                                  | `:id="1abc"`                                               | `404`; đơn id=1 **không** bị hủy — SQLite không ép `"1abc"` thành `1`                | AI · **đã sửa**              |
| TC-API2-008 | Body request không có tác dụng                                | EP                | COV-036 · §4.6                           | Body `{"status":"delivered"}`                              | 200, `status` = `"canceled"` (**không** `delivered`) — đích ghi cứng                 | AI                           |
| TC-API2-009 | `:id = 0` (biên cấu trúc min−1)                               | BVA               | COV-002                                  | `:id=0`                                                    | 404 · `AUTOINCREMENT` không cấp id 0                                                 | AI                           |
| TC-API2-010 | `:id = 1` (biên cấu trúc min)                                 | BVA               | COV-003                                  | Đơn id 1 tồn tại & thuộc user A (DB mới reset)             | 200 · `{"message":"Order canceled successfully"}`                                    | AI                           |
| TC-API2-011 | `:id = 2` (biên min+1)                                        | BVA               | COV-004                                  | Đơn id 2 tồn tại & thuộc user A                            | 200 · `{"message":"Order canceled successfully"}`                                    | AI                           |
| TC-API2-012 | `:id` cực lớn (tràn số)                                       | BVA               | COV-005                                  | `:id=99999999999999999999`                                 | `404` · không lỗi tràn số                                                            | AI · **đã sửa**              |
| TC-API2-013 | Token giả mạo `id=0` — không sở hữu đơn nào                   | BVA + Security    | COV-028                                  | Token tự ký `{id:0}`                                       | 404 · `{"error":"Order not found"}`                                                  | AI                           |
| TC-API2-014 | Token giả mạo `id=1` (trùng admin thật)                       | BVA + Security    | COV-028                                  | Token tự ký `{id:1}`, đơn thuộc admin                      | 200 — giả mạo không phân biệt được với token thật                                    | AI                           |
| TC-API2-015 | Token giả mạo `id=2` (trùng user A thật)                      | BVA + Security    | COV-028 · SEC-02                         | Token tự ký `{id:2}`, đơn thuộc user A                     | 200 — chiếm trọn quyền sở hữu của id bị mạo danh                                     | AI                           |
| TC-API2-016 | Header `Authorization` có 2 dấu cách                          | BVA               | COV-023                                  | `Authorization: Bearer  {{tokenA}}`                        | 403 · `{"error":"Forbidden"}` — **không phải 401**                                   | AI                           |
| TC-API2-017 | Hủy đơn `confirmed` (chuyển tiếp hợp lệ)                      | ST                | COV-030 · FR-10                          | Đơn đã `pending→confirmed` qua admin                       | 200 · `{"message":"Order canceled successfully"}`                                    | AI                           |
| TC-API2-018 | **[CRITICAL]** Hủy đơn `shipping` bằng token user             | ST + Security     | COV-031 · **FR-10 (User bị cấm)**        | Đơn đã `pending→confirmed→shipping` qua admin              | 200 theo mã nguồn — **mâu thuẫn trực tiếp với FR-10**                                | AI                           |
| TC-API2-019 | Hủy đơn `delivered` (trạng thái kết thúc)                     | ST                | COV-032 · FR-10                          | Đơn đã đi hết chuỗi tới `delivered`                        | 400 · `{"error":"Cannot cancel this order."}`                                        | AI                           |
| TC-API2-020 | Hủy đơn đã `canceled` (trạng thái kết thúc)                   | ST                | COV-033 · FR-10                          | Đơn đã `canceled` từ trước                                 | 400 · `{"error":"Cannot cancel this order."}`                                        | AI                           |
| TC-API2-021 | Hủy lặp: gọi 2 lần liên tiếp cùng đơn                         | ST                | COV-037 · FR-10                          | Đơn `pending` mới, gọi PUT cancel 2 lần                    | Lần 1: 200 · Lần 2: 400 — trạng thái bất biến, response thì không                    | AI                           |
| TC-API2-022 | `status` ngoài 5 giá trị hợp lệ                               | ST                | COV-034                                  | ⚠️ Phải sửa DB trực tiếp — **không** tới được qua API      | 200 — deny-list chỉ chặn `delivered`/`canceled`                                      | AI · **ngoài bộ chạy**       |
| TC-API2-023 | Route admin **từ chối** `shipping→canceled`                   | ST                | COV-054 · FR-10 (đối chứng)              | Đơn `shipping`, token admin, body `{"status":"canceled"}`  | 400 · `Invalid state transition from shipping to canceled`                           | AI                           |
| TC-API2-024 | Route admin **cho phép** `canceled→delivered`                 | ST                | COV-055 · FR-10 (mâu thuẫn)              | Đơn `canceled`, token admin, body `{"status":"delivered"}` | 200 — thoát khỏi trạng thái FR-10 gọi là kết thúc                                    | AI                           |
| TC-API2-025 | Không gửi header `Authorization`                              | Security          | COV-015 · SEC-02                         | (bỏ header)                                                | 401 · `{"error":"Unauthorized"}`                                                     | AI                           |
| TC-API2-026 | Header `Authorization` rỗng                                   | Security          | COV-016                                  | `Authorization: ` (rỗng)                                   | 403 · `{"error":"Forbidden"}` — không phải 401                                       | AI                           |
| TC-API2-027 | Header không có dấu cách phân tách                            | Security          | COV-017 · SEC-02                         | `Authorization: GarbageNoSpace`                            | 401 · `{"error":"Unauthorized"}`                                                     | AI                           |
| TC-API2-028 | Scheme không chuẩn vẫn được chấp nhận                         | Security          | COV-018 · §4 (đặc tả ghi `Bearer`)       | `Authorization: Basic {{tokenA}}`                          | 200 — scheme không được kiểm                                                         | AI                           |
| TC-API2-029 | JWT sai cú pháp                                               | Security          | COV-019 · SEC-02                         | `Bearer not-a-jwt`                                         | 403 · `{"error":"Forbidden"}`                                                        | AI                           |
| TC-API2-030 | JWT ký bằng secret khác                                       | Security          | COV-020 · SEC-02                         | Token ký sai khoá                                          | 403 · `{"error":"Forbidden"}`                                                        | AI                           |
| TC-API2-031 | Token giả mạo có `exp` quá khứ                                | Security          | COV-021 · SEC-02                         | Token tự ký, `exp` quá khứ                                 | 403 · `{"error":"Forbidden"}`                                                        | AI                           |
| TC-API2-032 | Token hợp lệ với `id` người dùng không tồn tại                | Security + EP     | COV-022                                  | Token tự ký `{id:999999}`                                  | 404 — bộ lọc `user_id` không bao giờ khớp                                            | AI                           |
| TC-API2-033 | **IDOR:** user A hủy đơn của user B                           | Security          | COV-025 · FR-11 (mở rộng)                | Token user A, `:id` = đơn của user B                       | 404 · `{"error":"Order not found"}` — không phân biệt với "không tồn tại"            | AI                           |
| TC-API2-034 | Admin không sở hữu đơn vẫn bị chặn                            | Security          | COV-026 · FR-10                          | Token admin, `:id` = đơn của user A                        | 404 — bộ lọc ownership áp dụng cho cả admin                                          | AI                           |
| TC-API2-035 | Payload SQL injection trong `:id`                             | Security          | COV-012 · SEC-05                         | `:id="1 OR 1=1"`                                           | 404 — xử lý như chuỗi literal, không thực thi SQL                                    | AI                           |
| TC-API2-036 | Schema response thành công                                    | Schema            | COV-045                                  | Đơn `pending` của user A                                   | 200 · đúng 1 key `message`, **không** có `id`/`status`                               | AI                           |
| TC-API2-037 | Schema lỗi 401                                                | Schema            | COV-046                                  | (bỏ header)                                                | 401 · đúng 1 key `error` = `"Unauthorized"`                                          | AI                           |
| TC-API2-038 | Schema lỗi 403                                                | Schema            | COV-047                                  | Token sai cú pháp                                          | 403 · đúng 1 key `error` = `"Forbidden"`                                             | AI                           |
| TC-API2-039 | Schema 404 giống hệt nhau cho 2 nguyên nhân                   | Schema            | COV-048                                  | Gọi 2 lần: `:id` không tồn tại **và** `:id` của user B     | Cả 2 → 404, body **giống hệt từng byte** (chống dò đơn)                              | AI                           |
| TC-API2-040 | Schema 400 giống hệt nhau cho 2 nguyên nhân                   | Schema            | COV-049                                  | Gọi 2 lần: đơn `delivered` **và** đơn `canceled`           | Cả 2 → 400, body **giống hệt từng byte**                                             | AI                           |
| TC-API2-041 | Response `PUT` không chứa trạng thái — phải verify bằng `GET` | Schema            | COV-051,052                              | PUT cancel rồi `GET /api/orders/my-orders`                 | PUT: không có `status`; GET: phần tử có `status="canceled"`                          | AI                           |
| TC-API2-042 | `GET /api/orders/:id` đọc được **không cần token**            | Schema + Security | COV-053 · SEC-02 (vi phạm ở endpoint kề) | GET `/api/orders/{id}` **không** gửi header                | 200 · trả full đơn hàng — lỗ hổng của endpoint hỗ trợ                                | AI                           |
| TC-API2-043 | Xác nhận **không** tồn tại đường 500 nào                      | Schema            | COV-050                                  | Tổng hợp toàn bộ TC-001…042                                | Không có TC nào trả 500 (cả 2 callback SQLite đều bỏ qua `err`)                      | AI · **assertion hậu-suite** |

> **Trạng thái sau Bước 2 (kiểm toán).** `-003`, `-004`, `-006`, `-007`, `-012` **đã chốt expected bằng probe thật** — cả 5 đều trả `404` (riêng `-004` là 404 tầng routing, body HTML). `-016`, `-026` đã xác nhận `403`. `-022` **đưa ra khỏi bộ chạy** (không tới được qua API), `-043` chuyển thành assertion hậu-suite. Còn `-013`, `-014`, `-015`, `-031`, `-032` cần tự ký JWT; `-023`, `-024` nhắm route admin nên để tuỳ chọn — cả nhóm chốt ở Bước 4.

**Ma trận chuyển trạng thái (theo P7 — chỉ giữ trạng thái/chuyển tiếp có bằng chứng từ đặc tả hoặc mã nguồn; không giả định trạng thái không tồn tại)**

| Từ \ Hành động | Admin: confirm                                          | Admin: ship                                               | Admin: deliver                                                                                             | **Hủy (User, `PUT .../cancel`)**                                                                                                             |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `pending`      | ✔ → `confirmed` (route admin, dùng để tạo tiền đề test) | ✘ (không có luật admin nào cho phép, `server.js:537-551`) | ✘                                                                                                          | **✔ → `canceled`** (200, TC-API2-001)                                                                                                        |
| `confirmed`    | ✘ (tự-chuyển, không áp dụng)                            | ✔ → `shipping` (route admin)                              | ✘ (bỏ qua `confirmed`, không có luật)                                                                      | **✔ → `canceled`** (200, TC-API2-017)                                                                                                        |
| `shipping`     | ✘                                                       | ✘ (tự-chuyển)                                             | ✔ → `delivered` (route admin)                                                                              | **✔ → `canceled` theo mã nguồn — nhưng FR-10 cấm User** (200 thực tế / mong đợi 400 hoặc 403 theo đặc tả) — **TC-API2-018, phát hiện chính** |
| `delivered`    | ✘                                                       | ✘                                                         | ✘ (tự-chuyển, trạng thái kết thúc)                                                                         | ✘ → 400 `{"error":"Cannot cancel this order."}` (TC-API2-019)                                                                                |
| `canceled`     | ✘                                                       | ✘                                                         | ✔ → `delivered` (route admin — **mâu thuẫn với FR-10 tuyên bố `canceled` là trạng thái kết thúc**, xem P7) | ✘ (lặp lại) → 400 (TC-API2-020)                                                                                                              |

### 5.2 Bước 2 — Kiểm toán (rà soát của con người)

**Cách tôi kiểm toán.** Tôi dựng SUT chạy thật, tạo đơn qua `POST /api/checkout`, dùng token admin đẩy trạng thái qua `PUT /api/admin/orders/:id/status` để tới đủ 5 trạng thái, rồi probe từng nhánh. Trọng tâm là 11 TC mà AI để expected dạng "chưa xác nhận".

| Nhãn       | Số TC  | Tỉ lệ |
| ---------- | :----: | :---: |
| VALID      |   33   | 76.7% |
| INVALID    |   2    | 4.7%  |
| INCOMPLETE |   8    | 18.6% |
| **Tổng**   | **43** | 100%  |

**Chi tiết các test case KHÔNG đạt**

| ID          | Nhãn        | AI viết gì                              | Vì sao sai / thiếu (dẫn chứng)                                                                                                                                                                                                                                                                                                                                                | Tôi sửa thành                                                                                                   |
| ----------- | ----------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| TC-API2-022 | **INVALID** | `status` ngoài 5 giá trị → 200          | TC ghi tiền điều kiện _"phải sửa DB trực tiếp"_ — tức là **không thực thi được** bằng Postman/Newman. Một TC API mà điều kiện tiên quyết nằm ngoài API thì không thuộc bộ test API. Đúng là `database.js:78` không có `CHECK`, nhưng cả hai route ghi `status` (`server.js:335` và `537-551`) đều chỉ ghi 5 literal, nên trạng thái lạ **không tới được qua bất kỳ API nào**. | Loại khỏi bộ test API; giữ lại như một **ghi chú rủi ro schema** trong phần phân tích                           |
| TC-API2-043 | **INVALID** | "Xác nhận không tồn tại đường 500"      | Không phải một request. Đây là mệnh đề tổng hợp trên toàn suite, không có input, không có endpoint để gọi.                                                                                                                                                                                                                                                                    | Chuyển thành **assertion hậu-suite** trong Newman (kiểm không response nào có status 500), bỏ khỏi danh sách TC |
| TC-API2-003 | INCOMPLETE  | `:id="abc"` → "chưa xác nhận"           | Expected không quyết định được thì TC vô dụng. **Tôi chạy thật:** → `404` · `{"error":"Order not found"}`. Lý do: `server.js:324` bind chuỗi vào cột `INTEGER`, SQLite so sánh không khớp → `!order` → 404.                                                                                                                                                                   | Expected: `404` · `{"error":"Order not found"}`                                                                 |
| TC-API2-004 | INCOMPLETE  | `/api/orders//cancel` → "chưa xác nhận" | **Tôi chạy thật:** Express **không khớp route** (segment rỗng) → trả 404 mặc định của framework, **không phải** JSON `{"error":...}` của SUT. Khác biệt này quan trọng: cùng mã 404 nhưng khác schema.                                                                                                                                                                        | Expected: `404` · body **không** phải JSON của SUT; ghi rõ đây là 404 tầng routing                              |
| TC-API2-006 | INCOMPLETE  | `:id=1.5` → "chưa xác nhận"             | **Tôi chạy thật:** → `404`                                                                                                                                                                                                                                                                                                                                                    | Expected: `404` · `{"error":"Order not found"}`                                                                 |
| TC-API2-007 | INCOMPLETE  | `:id="1abc"` → "chưa xác nhận"          | **Tôi chạy thật:** → `404`. Đáng chú ý: SQLite **không** ép `"1abc"` thành `1`, nên đơn id=1 an toàn.                                                                                                                                                                                                                                                                         | Expected: `404` · thêm assertion: đơn id=1 **không** bị hủy                                                     |
| TC-API2-012 | INCOMPLETE  | `:id` tràn số → "chưa xác nhận"         | **Tôi chạy thật:** → `404`, không lỗi tràn                                                                                                                                                                                                                                                                                                                                    | Expected: `404` · `{"error":"Order not found"}`                                                                 |
| TC-API2-010 | INCOMPLETE  | `:id=1` → 200                           | Tiền điều kiện _"đơn id 1 tồn tại và thuộc user A"_ mong manh: id phụ thuộc thứ tự chạy của cả suite. Chạy lại lần 2 là hỏng.                                                                                                                                                                                                                                                 | Đổi thành: tạo đơn ngay trong TC, lấy `orderId` từ response, dùng biến Postman thay vì hard-code                |
| TC-API2-011 | INCOMPLETE  | `:id=2` → 200                           | Cùng lý do                                                                                                                                                                                                                                                                                                                                                                    | Cùng cách sửa                                                                                                   |
| TC-API2-041 | INCOMPLETE  | Gộp `PUT` + `GET` trong một dòng        | Newman cần 2 request tách biệt                                                                                                                                                                                                                                                                                                                                                | Tách thành 2 request nối bằng `postman.setNextRequest`                                                          |

**Nhận xét kiểm toán.** Điều tôi đánh giá cao: **toàn bộ 9 TC chuyển trạng thái đều đúng** khi probe — kể cả TC-API2-018, cái quan trọng nhất. Tôi chạy chuỗi `pending → confirmed → shipping` rồi hủy bằng token **user thường** và nhận `200` với `status` thành `canceled`, đúng như AI dự đoán và **trái FR-10**. Máy trạng thái là chỗ AI làm chắc nhất, vì FR-10 có sơ đồ rõ ràng để đối chiếu. Ngược lại, toàn bộ 5 TC về định dạng `:id` đều để trống expected — AI không dám kết luận về type affinity của SQLite dù thông tin đủ để suy đoán, và khi tôi chạy thì **cả 5 đều cho cùng một kết quả 404**, tức là AI đã bỏ trống một nhóm mà thực tế rất dễ chốt. Hai TC bị loại (022, 043) đều cùng một lỗi thiết kế: **nhầm "điều cần khẳng định" với "test case"** — một cái cần sửa DB tay, một cái là mệnh đề tổng hợp toàn suite.

### 5.3 Bước 3 — Mở rộng (≥ 5 test case tự nghĩ)

> ✍️ Đề §6.3 yêu cầu ≥ 5 TC **tự nghĩ** mà AI bỏ sót, đặc biệt quanh bảo mật và chuyển trạng thái.
> **Gợi ý đã có sẵn từ phân tích:** khoảng trống **đồng thời (concurrency)** — AI hẹn ở P5, bỏ ở P7, không lên lịch ở P10, không sinh ở P11 (xem AI Audit Report, Artifact #7/#12). Đây là ứng viên số 1 cho `A2-E01`.

| ID         | Tiêu đề                                                                                         | Kỹ thuật / SEC                       | Input                                                                                                                                                      | Expected                                                                                                              | **Vì sao AI bỏ sót**                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A2-E01** | Hủy đơn **đồng thời** với admin chuyển trạng thái (race condition)                              | Chuyển trạng thái / tính nhất quán   | Bắn song song: `PUT /api/orders/{id}/cancel` (token user) và `PUT /api/admin/orders/{id}/status` `{"status":"delivered"}` trên **cùng** một đơn `shipping` | Trạng thái cuối phải nhất quán, không được có kết quả mà **cả hai** request đều báo thành công nhưng chỉ một tác dụng | **Hạn chế của mô hình.** Đây là lỗ hổng AI **tự hẹn rồi tự đánh rơi**: nêu ở P5, hứa để dành cho P7, không giao ở P7, không lên lịch ở P10, không sinh ở P11 — bốn lần liên tiếp. Chỉ lộ ra khi tôi bắt nó tự rà lại. Gốc rễ: `server.js:322` (đọc) và `server.js:333` (ghi) là hai câu lệnh rời, không transaction, không khóa.                                                                                                                                           |
| **A2-E02** | Vượt chặn ownership bằng token mạo danh chủ đơn                                                 | SEC-02 / IDOR                        | User B tự ký token `{id:2}` (id của user A) rồi hủy đơn của A                                                                                              | `200` — hủy được đơn người khác                                                                                       | **Đặc điểm riêng của API.** AI kết luận đúng "không có IDOR" vì `WHERE id=? AND user_id=?` lấy `user_id` từ token (`server.js:323-324`). Nhưng kết luận đó chỉ đúng **nếu token không giả mạo được**. Với `SECRET_KEY` lộ ở `server.js:9`, hàng rào ownership sụp hoàn toàn. AI có sinh TC-015 (mạo danh id=2) nhưng đóng khung là "chứng minh forgery hoạt động", **không** đóng khung là "vượt kiểm soát ownership" — nên không ai đọc báo cáo mà thấy được đây là IDOR. |
| **A2-E03** | Chuỗi 2 lỗ hổng: user hủy đơn `shipping` → admin hồi sinh thành `delivered` → đơn vào doanh thu | Chuyển trạng thái + FR-13            | (1) user hủy đơn `shipping` (2) admin set `delivered` trên đơn `canceled` (3) đọc `GET /api/admin/orders`                                                  | Đơn **đã bị hủy** lại mang trạng thái `delivered`, tức được tính vào tổng doanh thu theo FR-13                        | **Chất lượng prompt.** Tôi yêu cầu AI phân tích chuyển trạng thái **theo từng ô** của ma trận. Nó tìm ra cả hai lỗ hổng riêng lẻ (TC-018 và TC-024) nhưng không nối chúng, vì tôi chưa bao giờ yêu cầu tìm **chuỗi khai thác**. Hệ quả tài chính chỉ hiện ra khi ghép hai ô lại.                                                                                                                                                                                           |
| **A2-E04** | Hủy đơn **mồ côi** sau khi admin xóa chủ đơn                                                    | Chuyển trạng thái / toàn vẹn dữ liệu | (1) admin `DELETE /api/admin/users/{id}` xóa user A (2) user A dùng token cũ (vẫn hợp lệ) hủy đơn của mình                                                 | Token vẫn verify được (`server.js:51` không có `exp`) nhưng hàng user đã mất — quan sát xem đơn còn hủy được không    | **Hạn chế của mô hình.** AI có nhận diện lớp "đơn mồ côi" (COV-027) nhưng **tự loại** với lý do "phải sửa DB trực tiếp". Kết luận đó sai: `DELETE /api/admin/users/:id` (`server.js:504`) xóa user mà **không** đụng bảng `orders` — vì không có khóa ngoại (`database.js:76`). Trạng thái mồ côi tới được **hoàn toàn bằng API**. AI đánh giá sai tính khả thi rồi bỏ luôn.                                                                                               |
| **A2-E05** | Thông báo lỗi 400 **không "phù hợp"** như FR-10 đòi hỏi                                         | Chuyển trạng thái / schema           | Hủy đơn `delivered` và hủy đơn `canceled`, so 2 response                                                                                                   | Cả hai trả **y hệt** `{"error":"Cannot cancel this order."}` — không cho biết đơn đã giao hay đã hủy                  | **Chất lượng prompt.** AI có sinh TC-040 kiểm hai response giống nhau từng byte, nhưng đóng khung là _đặc điểm schema_ trung tính. Thực ra FR-10 viết rõ _"phải trả về lỗi với **thông báo phù hợp**"_ — một thông báo chung chung cho hai nguyên nhân khác nhau là **chưa đạt yêu cầu**. Tôi đã đưa FR-10 cho AI nhưng không yêu cầu nó đánh giá **chất lượng** thông báo, nên nó chỉ mô tả mà không phán xét.                                                            |

| Nguyên nhân bỏ sót     | Số TC | Diễn giải                                                                                                                                                       |
| ---------------------- | :---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chất lượng prompt      |   2   | A2-E03, A2-E05 — tôi yêu cầu phân tích **từng ô** ma trận và **mô tả** schema, nên AI không đi tìm chuỗi khai thác cũng không đánh giá chất lượng thông báo lỗi |
| Hạn chế của mô hình    |   2   | A2-E01 (tự hứa rồi đánh rơi qua 4 phase), A2-E04 (đánh giá sai tính khả thi rồi tự loại một lớp test hợp lệ)                                                    |
| Đặc điểm riêng của API |   1   | A2-E02 — ownership của endpoint này dựa **hoàn toàn** vào token; secret lộ thì kết luận "không có IDOR" mất hiệu lực                                            |

### 5.4 Bước 4 — Thực thi (Postman + Newman)

| Hạng mục                | Giá trị                  |
| ----------------------- | ------------------------ |
| Folder trong collection | «API2 — Order Cancel»    |
| Số request              | «»                       |
| Số assertion            | «»                       |
| Data file (nếu có)      | «data/api2.csv — n dòng» |

```bash
newman run «collection.json» \
  -e «env.postman_environment.json» \
  --folder "«API2 — Order Cancel»" \
  -d «data/api2.csv» \
  -r cli,htmlextra --reporter-htmlextra-export «reports/api2.html»
```

|            | Executed | Passed | Failed |
| ---------- | :------: | :----: | :----: |
| Requests   |    «»    |   «»   |   «»   |
| Assertions |    «»    |   «»   |   «»   |

> ✍️ Ảnh chụp Newman CLI phải thấy rõ hostname (`localhost` / `127.0.0.1`).
> **Lưu ý riêng API 2:** phần lớn TC cần **dựng trạng thái trước** bằng `POST /api/checkout` + `PUT /api/admin/orders/:id/status`. Nên dùng `postman.setNextRequest` để chạy đúng thứ tự chuỗi trạng thái.

![Newman API2](«evidence/newman_api2.png»)
Báo cáo HTML: [`«reports/api2.html»`](«reports/api2.html»)

**Các assertion FAIL và diễn giải**

| ID          | Assertion fail                | Actual | Expected             | Là bug SUT hay lỗi test?                      |
| ----------- | ----------------------------- | ------ | -------------------- | --------------------------------------------- |
| TC-API2-018 | «status 200, kỳ vọng từ chối» | «200»  | «400/403 theo FR-10» | «BUG-0x — hủy đơn `shipping` bằng token user» |
| TC-API2-0xx | «»                            | «»     | «»                   | «»                                            |

### 5.5 Bước 5 — Lỗi phát hiện được

| ID     | Tiêu đề                                                                         | Mức độ   | TC phát hiện  | AI có sinh TC này không? | GitHub Issue |
| ------ | ------------------------------------------------------------------------------- | -------- | ------------- | ------------------------ | ------------ |
| BUG-0x | «User tự hủy được đơn đang `shipping` — trái FR-10»                             | «High»   | «TC-API2-018» | «Có — AI sinh»           | «URL»        |
| BUG-0x | «Route admin cho phép `canceled → delivered`, trái quy tắc trạng thái kết thúc» | «Medium» | «TC-API2-024» | «Có — AI sinh»           | «URL»        |

<details>
<summary><b>BUG-0x — «tiêu đề»</b></summary>

- **Endpoint:** `«»`
- **Các bước tái hiện:** «1… 2… 3…»
- **Kết quả mong đợi:** «»
- **Kết quả thực tế:** «»
- **Mức độ / Độ ưu tiên:** «»
- **Bằng chứng:** ![BUG](«evidence/bug0x.png»)
- **Issue:** «URL»

</details>

---

## 6. API 3 — `POST /api/admin/coupons` (FR-17)

### 6.0 Đặc tả tóm tắt

| Thuộc tính   | Giá trị                                                                                                                                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Endpoint     | `POST /api/admin/coupons` (dọn dữ liệu bằng `DELETE /api/admin/coupons/:id`)                                                                                                                                                                             |
| Pool / FR    | C / FR-17 — Quản lý mã giảm giá                                                                                                                                                                                                                          |
| Auth         | Bearer JWT (**đặc tả yêu cầu admin**) — nhưng mã nguồn chỉ gọi `authenticateToken`, **không kiểm tra `role`** (`server.js:457,483`)                                                                                                                      |
| Request body | `code` (string, unique), `type` (string, đặc tả: `percent`/`fixed`), `discount_value` (int, đặc tả `>0`), `min_order_amount` (int, đặc tả `>=0`), `expired_at` (string ngày), `max_uses_per_user` (int, đặc tả `>=1`) — theo `api_specification.md §6.4` |
| Response 2xx | `200` — `{"message":"Coupon created","id":<int>}` (không đặc tả; suy từ `server.js:478`) — **là API duy nhất trong 3 API trả về `id` động**                                                                                                              |
| Mã lỗi       | `401` `{"error":"Unauthorized"}` · `403` `{"error":"Forbidden"}` · `500` `{"error":"<sqlite message>"}` (kể cả trùng `code`) — **không có 400/409** dù nhiều ràng buộc đặc tả bị vi phạm                                                                 |
| Yêu cầu SEC  | **SEC-03 (VI PHẠM — endpoint chính là đối tượng của SEC-03: không kiểm tra `role='admin'` trong Token)** · SEC-02 (JWT hợp lệ — có) · SEC-05 (parameterized query — đạt) · SEC-04 (không thể kiểm chứng đầy đủ ở tầng API)                               |

### 6.1 Bước 1 — Sinh test case bằng AI

**Mục tiêu ≥ 35 test case.** Số thực tế AI sinh: **82**.

| Nhóm kỹ thuật           | Số TC  | Ghi chú                                                                                                                                                                                                                 |
| ----------------------- | :----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phân vùng miền giá trị  |   40   | 6 trường × (hợp lệ / thiếu / rỗng / **null** / sai kiểu / sai định dạng) + trùng `code` + khác hoa-thường + body rỗng/thiếu/sai cú pháp + `:id` của `DELETE`                                                            |
| Giá trị biên            |   14   | `discount_value` (0/1/âm), `min_order_amount` (−1/0), `max_uses_per_user` (0 số / `"0"` chuỗi / 1 / −5 / cực lớn), **biên chéo `percent`+100/101**, header 2-khoảng-trắng                                               |
| Chuyển trạng thái       |   3    | Vòng đời tồn tại của coupon (P7): tạo → xoá → tạo lại cùng `code`; xoá lặp                                                                                                                                              |
| **Bảo mật (SEC-01…07)** | **15** | **User thường tạo/xoá coupon, đọc `GET /api/coupons` không lọc — SEC-03 vi phạm**; đủ 6 nhánh auth (thiếu/rỗng/không-dấu-cách/sai-scheme/sai-secret/`exp` giả mạo); SQLi trên `code` và `:id`; chuỗi lạm dụng nghiệp vụ |
| Kiểm tra schema         |   6    | Response 2xx (kèm `id`), 401/403/500, xác nhận không có 400/409/404                                                                                                                                                     |
| Quy tắc nghiệp vụ khác  |   4    | Bất đối xứng ép kiểu `max_uses_per_user`, `is_active` không thể set qua API, chuỗi tạo→xoá→verify, `type` ngoài enum bị diễn giải thành `fixed`                                                                         |
| **Tổng**                |   82   | ≥ 35 theo yêu cầu đề bài                                                                                                                                                                                                |

> **Ghi chú sửa đổi.** Bản sinh đầu tiên chỉ có 44 TC và **bỏ sót 4 nhóm mà chính prompt P11 đã yêu cầu**: (1) `null fields` — 0 TC; (2) `type:"fixed"` — giá trị enum hợp lệ **thứ hai** chưa hề được phủ, một lỗi EP cơ bản; (3) `cross-field conditions/boundaries` — 0 TC; (4) chỉ 3/6 nhánh auth (API 1 có 8, API 2 có 6). Đã bổ sung 38 TC (`TC-API3-045`…`-082`) để đóng cả 4 nhóm.

**Tiền điều kiện chung cho mọi TC của API 3.** DB vừa seed lại → 4 coupon mẫu tồn tại: `SAVE10`(id 1), `BIGBUY`(id 2), `VIP100`(id 3), `EXPIRED`(id 4); coupon mới tạo bắt đầu từ **id 5**. `{{tokenAdmin}}` = `admin@eshop.com`/`Admin123!`; `{{tokenUser}}` = `test@eshop.com`/`Test1234!`. **Quy tắc dọn dữ liệu mặc định:** mọi TC tạo coupon thành công đều phải `DELETE /api/admin/coupons/{{id}}` ở bước teardown (dùng `{{tokenAdmin}}`), trừ TC mà mục đích chính là kiểm chính cơ chế xoá/trùng mã. Body chuẩn 6 trường dùng lại xuyên suốt: `{"code":…,"type":"percent","discount_value":10,"min_order_amount":0,"expired_at":"2099-12-31","max_uses_per_user":1}`.

**Bảng test case đầy đủ — 82 TC** _(ID `TC-API3-001`…`TC-API3-082`)_

| ID             | Tiêu đề                                                                               | Kỹ thuật          | Truy vết (Coverage / FR / SEC)                   | Input / Precondition riêng                                                                       | Expected (status + body)                                                                                                                            | Nguồn                        |
| -------------- | ------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| TC-API3-001    | Tạo coupon hợp lệ (happy path)                                                        | EP                | COV-055,001,011,018,027,034,042 · FR-17          | `code:"TESTNEW01"`, 6 trường hợp lệ, token admin                                                 | 200 · `{"message":"Coupon created","id":<int>}`                                                                                                     | AI                           |
| TC-API3-002    | Thiếu `code`                                                                          | EP                | COV-002 · FR-17 (bắt buộc, không thực thi)       | Body bỏ key `code`                                                                               | 200 — không có presence check                                                                                                                       | AI                           |
| TC-API3-003    | `code` rỗng                                                                           | EP                | COV-003                                          | `code:""`                                                                                        | 200 — không có non-empty check                                                                                                                      | AI                           |
| TC-API3-004    | Trùng `code` với coupon đã seed                                                       | EP + BR           | COV-005,061 · FR-17 (**unique — được thực thi**) | `code:"SAVE10"`                                                                                  | 500 · `{"error":"<sqlite UNIQUE text>"}` — không tạo dòng mới                                                                                       | AI                           |
| TC-API3-005    | Thiếu `type`                                                                          | EP                | COV-013 · FR-17                                  | Body bỏ key `type`                                                                               | 200; `GET` cho thấy `type` **không** rơi về `'percent'` (DEFAULT bất hoạt)                                                                          | AI                           |
| TC-API3-006    | `type` ngoài enum                                                                     | EP                | COV-016 · FR-17 (enum không thực thi)            | `type:"installment"`                                                                             | 200, lưu nguyên văn — không có `CHECK`                                                                                                              | AI                           |
| TC-API3-007    | Thiếu `discount_value`                                                                | EP                | COV-020 · FR-17                                  | Body bỏ key `discount_value`                                                                     | 200 — không có presence check                                                                                                                       | AI                           |
| TC-API3-008    | `discount_value` sai kiểu (string)                                                    | EP                | COV-025                                          | `discount_value:"10"`                                                                            | `200` · tạo được coupon                                                                                                                             | AI · **đã sửa**              |
| TC-API3-009    | Thiếu `min_order_amount`                                                              | EP                | COV-029 · FR-17                                  | Body bỏ key `min_order_amount`                                                                   | 200 — `DEFAULT 0` cũng bất hoạt                                                                                                                     | AI                           |
| TC-API3-010    | Thiếu `expired_at`                                                                    | EP                | COV-036 · FR-17                                  | Body bỏ key `expired_at`                                                                         | 200 — không có presence check                                                                                                                       | AI                           |
| TC-API3-011    | `expired_at` là ngày quá khứ                                                          | EP + BR           | COV-035,060                                      | `expired_at:"2020-01-01"`                                                                        | 200 — giống hệt coupon `EXPIRED` được seed sẵn                                                                                                      | AI                           |
| TC-API3-012    | `expired_at` sai định dạng                                                            | EP                | COV-039                                          | `expired_at:"not-a-date"`                                                                        | 200 — không validate định dạng ngày lúc tạo                                                                                                         | AI                           |
| TC-API3-013    | Thiếu `max_uses_per_user` → ép thành 1                                                | EP                | COV-043 · FR-17                                  | Body bỏ key `max_uses_per_user`                                                                  | 200; `GET` cho thấy lưu đúng `1` (`\|\| 1`)                                                                                                         | AI                           |
| TC-API3-014    | Gửi kèm `is_active` — bị bỏ qua                                                       | EP                | COV-059,096                                      | `{...,"is_active":0}`                                                                            | 200; `GET` cho thấy `is_active` = `1`, **không** phải `0`                                                                                           | AI                           |
| TC-API3-015    | `discount_value = 0` (biên min−1 của `>0`)                                            | BVA               | COV-022 · FR-17                                  | `discount_value:0`                                                                               | 200 (kỳ vọng đặc tả: từ chối)                                                                                                                       | AI                           |
| TC-API3-016    | `discount_value = 1` (biên min)                                                       | BVA               | COV-018 · FR-17                                  | `discount_value:1`                                                                               | 200 · hợp lệ theo cả 2 nguồn                                                                                                                        | AI                           |
| TC-API3-017    | `min_order_amount = -1` (biên min−1)                                                  | BVA               | COV-031 · FR-17 (`>=0`)                          | `min_order_amount:-1`                                                                            | 200 (kỳ vọng đặc tả: từ chối)                                                                                                                       | AI                           |
| TC-API3-018    | `min_order_amount = 0` (biên min, **bao gồm**)                                        | BVA               | COV-027 · FR-17                                  | `min_order_amount:0`                                                                             | 200 · hợp lệ — lưu ý biên này _bao gồm_, khác `discount_value`                                                                                      | AI                           |
| TC-API3-019    | `max_uses_per_user = 0` (số) → **bị ép thành 1**                                      | BVA               | COV-044 · FR-17 (`>=1`)                          | `max_uses_per_user:0`                                                                            | 200; `GET` cho thấy **`1`, không phải `0`**                                                                                                         | AI                           |
| TC-API3-020    | `max_uses_per_user = "0"` (chuỗi) → vượt `\|\| 1` nhưng **bị SQLite ép thành số `0`** | BVA               | COV-048 · FR-17                                  | `max_uses_per_user:"0"`                                                                          | `200`; `GET` trả **số `0`** (không phải chuỗi `"0"`) — SQLite INTEGER affinity ép tiếp. **Giá trị `0` mà `\|\| 1` sinh ra để chặn vẫn vào được DB** | AI · **đã sửa**              |
| TC-API3-021    | `max_uses_per_user = 1` (biên min)                                                    | BVA               | COV-042 · FR-17                                  | `max_uses_per_user:1`                                                                            | 200 · hợp lệ, không bị biến đổi                                                                                                                     | AI                           |
| TC-API3-022    | `max_uses_per_user = -5` → **KHÔNG bị ép**                                            | BVA               | COV-045 · FR-17                                  | `max_uses_per_user:-5`                                                                           | 200; lưu đúng `-5` — số âm là truthy nên `\|\|` không can thiệp                                                                                     | AI                           |
| TC-API3-023    | `discount_value` cực lớn                                                              | BVA               | COV-026                                          | `discount_value:999999999`                                                                       | 200 — không có chặn trên nào                                                                                                                        | AI                           |
| TC-API3-024    | Header `Authorization` có 2 dấu cách                                                  | BVA               | (biên P6 — middleware dùng chung)                | `Authorization: Bearer  {{tokenAdmin}}`                                                          | 403 · `{"error":"Forbidden"}`                                                                                                                       | AI                           |
| TC-API3-025    | Tạo lại coupon với `code` đã bị xoá                                                   | ST                | COV-062 · P7 (vòng đời tồn tại)                  | B1 tạo `RECREATE01` → B2 xoá → B3 tạo lại cùng `code`                                            | 200 với **id mới** — `AUTOINCREMENT` không tái dùng id cũ                                                                                           | AI                           |
| TC-API3-026    | Trùng `code` khi coupon vẫn còn tồn tại                                               | ST                | COV-005,061                                      | `DUPTEST01` đang tồn tại, tạo lại với các trường khác nhau                                       | 500 — chỉ `code` quyết định việc từ chối                                                                                                            | AI                           |
| TC-API3-027    | Xoá coupon đã bị xoá (idempotent âm thầm)                                             | ST                | COV-098                                          | Tạo → xoá → gọi `DELETE` lần 2 cùng id                                                           | 200 · `{"message":"Coupon deleted"}` — **giống hệt** lần xoá thật                                                                                   | AI                           |
| TC-API3-028    | Không gửi header `Authorization`                                                      | Security          | COV-064 · SEC-02                                 | (bỏ header)                                                                                      | 401 · `{"error":"Unauthorized"}`                                                                                                                    | AI                           |
| TC-API3-029    | **[CRITICAL]** User thường tạo được coupon                                            | Security          | COV-073 · **SEC-03**, FR-12, FR-17               | `{{tokenUser}}` (`role="user"`), 6 trường hợp lệ                                                 | 200 — **vi phạm trực tiếp SEC-03**                                                                                                                  | AI                           |
| TC-API3-030    | User thường **xoá** được coupon                                                       | Security          | COV-074 · SEC-03                                 | `{{tokenUser}}`, xoá coupon do admin tạo                                                         | 200 · `{"message":"Coupon deleted"}`                                                                                                                | AI                           |
| TC-API3-031    | User thường đọc được `GET /api/coupons` không lọc                                     | Security          | COV-075 · SEC-03 (§5.2 ghi "Dành cho Admin")     | `{{tokenUser}}`, GET `/api/coupons`                                                              | 200 · danh sách đầy đủ y hệt admin                                                                                                                  | AI                           |
| TC-API3-032    | Token giả mạo claim `role:"admin"`                                                    | Security          | COV-076 · SEC-02                                 | Token tự ký `{id:1,role:"admin"}`                                                                | 200 — nhưng theo TC-029, giả mạo thậm chí **không cần thiết**                                                                                       | AI                           |
| TC-API3-033    | Payload SQL injection trong `code`                                                    | Security          | COV-010 · SEC-05                                 | `code:"'; DROP TABLE coupons;--"`                                                                | 200 · lưu literal, bảng `coupons` còn nguyên                                                                                                        | AI                           |
| TC-API3-034    | Chuỗi lạm dụng: user thường tạo coupon giá trị cực lớn                                | Security + BR     | COV-084 · SEC-03 + FR-17                         | `{{tokenUser}}`, `discount_value:999999999`, `min_order_amount:0`, `max_uses_per_user:999999999` | 200 · lưu đúng mọi giá trị cực lớn                                                                                                                  | AI                           |
| TC-API3-035    | JWT sai cú pháp                                                                       | Security          | COV-068 · SEC-02                                 | `Bearer not-a-jwt`                                                                               | 403 · `{"error":"Forbidden"}`                                                                                                                       | AI                           |
| TC-API3-036    | Schema response `POST` thành công                                                     | Schema            | COV-085                                          | 6 trường hợp lệ, token admin                                                                     | 200 · đúng 2 key `message` + `id` (int dương)                                                                                                       | AI                           |
| TC-API3-037    | Schema response `DELETE` thành công                                                   | Schema            | COV-086                                          | Coupon tồn tại, token admin                                                                      | 200 · đúng 1 key `message` = `"Coupon deleted"`                                                                                                     | AI                           |
| TC-API3-038    | Schema lỗi 401                                                                        | Schema            | COV-087                                          | (bỏ header)                                                                                      | 401 · đúng 1 key `error` = `"Unauthorized"`                                                                                                         | AI                           |
| TC-API3-039    | Schema lỗi 500 khi trùng `code` — lộ text driver                                      | Schema            | COV-089                                          | `code:"SCHEMA03"` đã tồn tại                                                                     | 500 · `error` chứa nguyên văn thông báo UNIQUE của SQLite                                                                                           | AI                           |
| TC-API3-040    | Xác nhận **không** tồn tại đường 400/409                                              | Schema            | COV-090                                          | Tổng hợp TC-002,003,006,008,015,017,019,022,023                                                  | Không TC nào trả 400/409 **từ handler** (400 chỉ đến từ `bodyParser`, xem TC-068)                                                                   | AI · **assertion hậu-suite** |
| TC-API3-041    | `DELETE` id không tồn tại → 200, **không** 404                                        | Schema            | COV-091                                          | `DELETE /api/admin/coupons/999999`                                                               | 200 · body giống hệt lần xoá thật (`this.changes` không kiểm)                                                                                       | AI                           |
| TC-API3-042    | Bất đối xứng ép kiểu `max_uses_per_user`                                              | Quy tắc nghiệp vụ | COV-095 · FR-17                                  | Đối chiếu kết quả TC-019 / TC-020 / TC-022                                                       | Lưu lần lượt `1` / **`0`** / `-5` — 3 input "không hợp lệ" cho 3 hành vi khác nhau                                                                  | AI · **mục nhận xét**        |
| TC-API3-043    | `is_active` luôn = 1 với mọi coupon do suite tạo                                      | Quy tắc nghiệp vụ | COV-096                                          | GET `/api/coupons` cuối suite                                                                    | Không coupon nào của suite có `is_active = 0`                                                                                                       | AI · **assertion hậu-suite** |
| TC-API3-044    | Chuỗi dọn dữ liệu: tạo → xoá → verify                                                 | Schema + ST       | COV-092,097                                      | POST → DELETE bằng `id` trả về → GET `/api/coupons`                                              | GET **không** còn `code:"CLEANUPTEST01"` — xác thực cơ chế teardown của cả suite                                                                    | AI                           |
| TC-API3-045    | `type:"fixed"` — **giá trị enum hợp lệ thứ hai**                                      | EP                | COV-012 · FR-17                                  | `type:"fixed"`, `discount_value:50000`                                                           | 200 · enum có 2 giá trị hợp lệ, cả hai đều phải được phủ                                                                                            | AI                           |
| TC-API3-046    | `code` là `null`                                                                      | EP                | COV-004 · FR-17                                  | `code:null`                                                                                      | 200 — cột không có `NOT NULL`; SQLite coi mỗi NULL là khác nhau nên `UNIQUE` không chặn                                                             | AI                           |
| TC-API3-047    | `code` khác hoa/thường với mã đã tồn tại                                              | EP                | COV-008 · FR-17 (unique)                         | `code:"save10"` (đã có `SAVE10`)                                                                 | 200 — `UNIQUE` không có `COLLATE NOCASE` nên là 2 mã khác nhau                                                                                      | AI                           |
| TC-API3-048    | `type` là chuỗi rỗng                                                                  | EP                | COV-014 · FR-17                                  | `type:""`                                                                                        | 200 — không có enum check                                                                                                                           | AI                           |
| TC-API3-049    | `type` là `null`                                                                      | EP                | COV-015 · FR-17                                  | `type:null`                                                                                      | 200 — `DEFAULT 'percent'` bất hoạt vì cột luôn được bind                                                                                            | AI                           |
| TC-API3-050    | `discount_value` là `null`                                                            | EP                | COV-021 · FR-17                                  | `discount_value:null`                                                                            | 200 — không có `NOT NULL`                                                                                                                           | AI                           |
| TC-API3-051    | `discount_value` âm                                                                   | BVA               | COV-023 · FR-17 (`>0`)                           | `discount_value:-10`                                                                             | 200 (kỳ vọng đặc tả: từ chối)                                                                                                                       | AI                           |
| TC-API3-052    | `min_order_amount` là `null`                                                          | EP                | COV-030 · FR-17                                  | `min_order_amount:null`                                                                          | 200 — không có `NOT NULL`                                                                                                                           | AI                           |
| TC-API3-053    | `min_order_amount` dương (phân vùng hợp lệ)                                           | EP                | COV-028 · FR-17                                  | `min_order_amount:200000`                                                                        | 200 · phân vùng hợp lệ ngoài biên `0`                                                                                                               | AI                           |
| TC-API3-054    | `expired_at` là `null`                                                                | EP                | COV-037 · FR-17                                  | `expired_at:null`                                                                                | 200 — không có `NOT NULL`                                                                                                                           | AI                           |
| TC-API3-055    | `expired_at` là chuỗi rỗng                                                            | EP                | COV-038 · FR-17                                  | `expired_at:""`                                                                                  | 200 — lưu nguyên; `new Date("")` khi dùng sẽ ra Invalid Date                                                                                        | AI                           |
| TC-API3-056    | `max_uses_per_user` là `null` → ép thành 1                                            | EP                | COV-046 · FR-17                                  | `max_uses_per_user:null`                                                                         | 200; `GET` cho thấy lưu `1` (null là falsy)                                                                                                         | AI                           |
| TC-API3-057    | `max_uses_per_user` là chuỗi rỗng → ép thành 1                                        | EP                | COV-047 · FR-17                                  | `max_uses_per_user:""`                                                                           | 200; `GET` cho thấy lưu `1`                                                                                                                         | AI                           |
| TC-API3-058    | **Chéo trường:** `percent` + `discount_value = 100`                                   | BVA (chéo)        | COV-052 · (trần 100 % **không** được đặc tả)     | `type:"percent"`, `discount_value:100`                                                           | 200 — trần khái niệm, không có tài liệu nào quy định                                                                                                | AI                           |
| TC-API3-059    | **Chéo trường:** `percent` + `discount_value = 101`                                   | BVA (chéo)        | COV-053 · (không được đặc tả)                    | `type:"percent"`, `discount_value:101`                                                           | 200 — vượt trần khái niệm nhưng không bị chặn                                                                                                       | AI                           |
| TC-API3-060    | **Chéo trường:** `type` ngoài enum + `discount_value`                                 | Quy tắc nghiệp vụ | COV-054 · FR-17 + FR-09                          | `type:"installment"`, `discount_value:10`                                                        | 200; hệ quả: `apply-coupon` sẽ diễn giải như `fixed` (nhánh `else`)                                                                                 | AI                           |
| TC-API3-061    | Header `Authorization` rỗng                                                           | Security          | COV-065 · SEC-02                                 | `Authorization: ` (rỗng)                                                                         | 403 · `{"error":"Forbidden"}` — không phải 401                                                                                                      | AI                           |
| TC-API3-062    | Header không có dấu cách phân tách                                                    | Security          | COV-066 · SEC-02                                 | `Authorization: GarbageNoSpace`                                                                  | 401 · `{"error":"Unauthorized"}`                                                                                                                    | AI                           |
| TC-API3-063    | Scheme không chuẩn vẫn được chấp nhận                                                 | Security          | COV-067 · §6 (đặc tả ghi `Bearer`)               | `Authorization: Basic {{tokenAdmin}}`                                                            | 200 — scheme không được kiểm                                                                                                                        | AI                           |
| TC-API3-064    | JWT ký bằng secret khác                                                               | Security          | COV-069 · SEC-02                                 | Token ký sai khoá                                                                                | 403 · `{"error":"Forbidden"}`                                                                                                                       | AI                           |
| TC-API3-065    | Token giả mạo có `exp` quá khứ                                                        | Security          | COV-070 · SEC-02                                 | Token tự ký, `exp` quá khứ                                                                       | 403 · `{"error":"Forbidden"}`                                                                                                                       | AI                           |
| TC-API3-066    | Body JSON rỗng `{}`                                                                   | EP                | COV-056                                          | `{}`                                                                                             | `200` — **tạo được coupon rỗng**: `code/type/discount_value/min_order_amount/expired_at` đều `null`, chỉ `max_uses_per_user=1`                      | AI · **đã sửa**              |
| TC-API3-067    | Không gửi body / sai `Content-Type`                                                   | EP                | COV-057                                          | (không body, không `Content-Type`)                                                               | `500` · body là **HTML**, không phải `{"error":...}` — `TypeError` khi destructure `req.body`                                                       | AI · **đã sửa**              |
| TC-API3-068    | JSON sai cú pháp                                                                      | EP                | COV-058                                          | `{"code":"A",` (cụt)                                                                             | `400` · body là **HTML**, sinh bởi `bodyParser` trước khi vào handler                                                                               | AI · **đã sửa**              |
| TC-API3-069    | `DELETE` không gửi token                                                              | Security          | COV-064 (biến thể DELETE) · SEC-02               | `DELETE /api/admin/coupons/5`, bỏ header                                                         | 401 · `{"error":"Unauthorized"}`                                                                                                                    | AI                           |
| TC-API3-070    | `DELETE` với `:id` không phải số                                                      | EP                | COV-010 (biến thể DELETE)                        | `DELETE /api/admin/coupons/abc`                                                                  | `200` · `{"message":"Coupon deleted"}` dù không xoá gì — `this.changes` không kiểm                                                                  | AI · **đã sửa**              |
| TC-API3-071    | `DELETE` với payload SQL injection trong `:id`                                        | Security          | COV-010 · SEC-05                                 | `DELETE /api/admin/coupons/1 OR 1=1`                                                             | 200 (không xoá gì) — tham số hoá, không thực thi SQL                                                                                                | AI                           |
| TC-API3-072    | `code` rất dài                                                                        | EP                | COV-007 · (không có giới hạn độ dài)             | `code` 5.000 ký tự                                                                               | 200 — không có ràng buộc độ dài ở cả đặc tả lẫn schema                                                                                              | AI                           |
| TC-API3-073    | `code` chỉ chứa khoảng trắng                                                          | EP                | COV-009                                          | `code:"   "`                                                                                     | 200 — không có trim/format check                                                                                                                    | AI                           |
| TC-API3-074    | `code` sai kiểu (number)                                                              | EP                | COV-006                                          | `code:12345`                                                                                     | `200`; lưu thành **chuỗi** `"12345"` (TEXT affinity)                                                                                                | AI · **đã sửa**              |
| TC-API3-075    | `type` sai kiểu (number)                                                              | EP                | COV-017                                          | `type:1`                                                                                         | `200`; lưu thành **chuỗi** `"1"` — enum bị phá hoàn toàn                                                                                            | AI · **đã sửa**              |
| TC-API3-076    | `discount_value` là số thập phân                                                      | EP                | COV-024 · (cột `INTEGER`)                        | `discount_value:10.5`                                                                            | `200`; lưu **nguyên `10.5`** (REAL) — cột `INTEGER` không ép vì sẽ mất mát                                                                          | AI · **đã sửa**              |
| TC-API3-077    | `min_order_amount` sai kiểu (boolean)                                                 | EP                | COV-033                                          | `min_order_amount:true`                                                                          | `200`; lưu thành `1` — boolean bị ép sang integer                                                                                                   | AI · **đã sửa**              |
| TC-API3-078    | `expired_at` có kèm phần giờ                                                          | EP                | COV-041 · (không quy định định dạng)             | `expired_at:"2099-12-31T23:59:59Z"`                                                              | 200 — `DATETIME` chỉ là affinity, lưu nguyên chuỗi                                                                                                  | AI                           |
| TC-API3-079    | `expired_at` sai kiểu (timestamp số)                                                  | EP                | COV-040                                          | `expired_at:1735689600`                                                                          | `200`; lưu **nguyên số** `1735689600` — `DATETIME` chỉ là affinity                                                                                  | AI · **đã sửa**              |
| TC-API3-080    | `max_uses_per_user` là số thập phân                                                   | EP                | COV-049                                          | `max_uses_per_user:1.5`                                                                          | `200`; lưu **nguyên `1.5`** (REAL)                                                                                                                  | AI · **đã sửa**              |
| TC-API3-081a/b | `max_uses_per_user` là boolean (**tách 2 TC**)                                        | EP                | COV-050                                          | **Tách 2 TC:** `-081a` gửi `false` · `-081b` gửi `true`                                          | Cả hai `200`, đều lưu **`1`** — nhưng khác cơ chế: `false` bị `\|\| 1` bắt, `true` truthy rồi bị SQLite ép sang `1`                                 | AI · **đã sửa**              |
| TC-API3-082    | `max_uses_per_user` cực lớn                                                           | BVA               | COV-051 · (không có chặn trên)                   | `max_uses_per_user:999999999`                                                                    | 200 — không có giới hạn trên nào được đặc tả                                                                                                        | AI                           |

> **Vì sao API 3 có nhiều TC hơn API 1/2 (82 vs 42/43).** Đây là chủ ý, không phải mất cân đối: API 3 có **6 trường request** (API 1 có 4, API 2 có 0), **2 endpoint** (`POST` + `DELETE`), và **nhiều ràng buộc FR-17 được phát biểu rõ nhất** (`unique`, enum 2 giá trị, 3 biên số học). Phân bổ theo rủi ro/độ phức tạp đúng nguyên tắc ISTQB FL §5.1, không chia đều máy móc.

> **Trạng thái sau Bước 2 (kiểm toán).** **13 TC đã chốt expected bằng probe thật**: `-008`, `-066`, `-067`, `-068`, `-070`, `-074`, `-075`, `-076`, `-077`, `-079`, `-080`, và đặc biệt `-020`/`-081` — hai cái này expected ban đầu **sai**, đã sửa. `-047` xác nhận `200` (`UNIQUE` phân biệt hoa/thường). `-040`, `-042`, `-043` chuyển thành assertion hậu-suite / mục nhận xét. Còn `-024`, `-061`, `-032`, `-065` cần tự ký JWT hoặc header đặc biệt — chốt ở Bước 4.

### 6.2 Bước 2 — Kiểm toán (rà soát của con người)

**Cách tôi kiểm toán.** Với 82 TC, tôi ưu tiên probe hai nhóm rủi ro nhất: (1) toàn bộ 8 biến thể ép kiểu `max_uses_per_user` — vì đây là trường duy nhất có logic biến đổi trong handler; (2) ba TC bảo mật SEC-03. Kết quả probe cho ra **một expected sai hẳn** mà đọc code không thể phát hiện.

| Nhãn       | Số TC  | Tỉ lệ |
| ---------- | :----: | :---: |
| VALID      |   65   | 79.3% |
| INVALID    |   5    | 6.1%  |
| INCOMPLETE |   12   | 14.6% |
| **Tổng**   | **82** | 100%  |

**Chi tiết các test case KHÔNG đạt**

| ID                                             | Nhãn        | AI viết gì                                           | Vì sao sai / thiếu (dẫn chứng)                                                                                                                                                                                                                                                                                                                                                                                                   | Tôi sửa thành                                                                                               |
| ---------------------------------------------- | ----------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| TC-API3-020                                    | **INVALID** | `max_uses_per_user:"0"` → _"lưu đúng chuỗi `\"0\"`"_ | **Sai kết quả.** Lập luận của AI đúng một nửa: chuỗi `"0"` là truthy nên **lọt qua** `\|\| 1` ở `server.js:474` — đến đây đúng. Nhưng AI dừng ở tầng JavaScript, quên rằng cột là `INTEGER` (`database.js:37`). **Tôi chạy thật: lưu thành số `0`, không phải chuỗi `"0"`.** SQLite affinity ép `"0"` → `0`. Hệ quả nặng hơn AI tưởng: giá trị `0` — thứ mà `\|\| 1` sinh ra để chặn — **vẫn vào được DB**, chỉ bằng đường khác. | Expected: `200`, `GET` trả `max_uses_per_user === 0` (số). Ghi nhận là **lỗ hổng thật của cơ chế coercion** |
| TC-API3-081                                    | **INVALID** | `false → ép thành 1; true → truthy, giữ nguyên`      | Hai lỗi. (a) **Một TC chứa hai input với hai expected khác nhau** — không đánh giá pass/fail được. (b) _"giữ nguyên"_ sai: **tôi chạy thật, `true` lưu thành `1`**, vì SQLite ép boolean sang integer. Nên cả `true` lẫn `false` đều ra `1`, chỉ khác đường đi.                                                                                                                                                                  | Tách thành 2 TC; cả hai expected `max_uses_per_user === 1`, ghi rõ khác nhau ở cơ chế                       |
| TC-API3-040                                    | **INVALID** | "Xác nhận không tồn tại đường 400/409"               | Mệnh đề tổng hợp toàn suite, không phải request                                                                                                                                                                                                                                                                                                                                                                                  | Chuyển thành assertion hậu-suite trong Newman                                                               |
| TC-API3-042                                    | **INVALID** | "Bất đối xứng ép kiểu" — đối chiếu kết quả 3 TC      | Không có input, không có endpoint — là bước phân tích, không phải TC                                                                                                                                                                                                                                                                                                                                                             | Chuyển thành mục nhận xét trong báo cáo                                                                     |
| TC-API3-043                                    | **INVALID** | "`is_active` luôn = 1" — kiểm tổng hợp cuối suite    | Cùng lý do                                                                                                                                                                                                                                                                                                                                                                                                                       | Gộp thành assertion trong TC-API3-014                                                                       |
| TC-API3-008                                    | INCOMPLETE  | `discount_value:"10"` → "chưa xác nhận"              | **Tôi chạy thật:** `200`, tạo được coupon                                                                                                                                                                                                                                                                                                                                                                                        | Expected: `200` · `{"message":"Coupon created","id":<int>}`                                                 |
| TC-API3-066                                    | INCOMPLETE  | Body `{}` → "chưa xác nhận"                          | **Tôi chạy thật (trên API 1, cùng cơ chế):** `200`                                                                                                                                                                                                                                                                                                                                                                               | Expected: `200`; thêm assertion `GET` xem 6 trường lưu ra sao                                               |
| TC-API3-067                                    | INCOMPLETE  | Thiếu body → "chưa xác nhận"                         | **Tôi chạy thật:** `500` **dạng HTML**, không phải JSON — do `TypeError` khi destructure `req.body` (`server.js:458`)                                                                                                                                                                                                                                                                                                            | Expected: `500` · body là HTML, **không** có key `error`                                                    |
| TC-API3-068                                    | INCOMPLETE  | JSON sai cú pháp → "chưa xác nhận"                   | **Tôi chạy thật:** `400` **dạng HTML**, sinh bởi `bodyParser` trước handler                                                                                                                                                                                                                                                                                                                                                      | Expected: `400` · body là HTML                                                                              |
| TC-API3-070                                    | INCOMPLETE  | `DELETE` `:id` không phải số → "chưa xác nhận"       | **Tôi chạy thật (tương tự API 2):** `200` — vì `server.js:484-487` không kiểm `this.changes`, xoá 0 dòng vẫn báo thành công                                                                                                                                                                                                                                                                                                      | Expected: `200` · `{"message":"Coupon deleted"}` dù không xoá gì                                            |
| TC-API3-074 · -075 · -076 · -077 · -079 · -080 | INCOMPLETE  | 6 TC sai kiểu → "chưa xác nhận"                      | Cùng một gốc: AI không dám kết luận về binding kiểu. **Tôi chạy mẫu `discount_value:"10"` và `max_uses_per_user:1.5`** → đều `200`; riêng `1.5` lưu **nguyên `1.5`** (SQLite giữ REAL vì không ép được sang INTEGER không mất mát)                                                                                                                                                                                               | Expected: `200` cho cả 6; bổ sung assertion `GET` kiểm giá trị **thực sự lưu** cho từng trường              |
| TC-API3-039                                    | INCOMPLETE  | Trùng `code:"SCHEMA03"` → 500                        | Thiếu bước tạo `SCHEMA03` trước. Chạy trên DB sạch sẽ ra `200` chứ không phải `500`.                                                                                                                                                                                                                                                                                                                                             | Thêm request setup tạo `SCHEMA03` trước khi gọi lần 2                                                       |

**Nhận xét kiểm toán.** Đây là API mà kiểm toán có giá trị nhất, vì nó lộ ra **giới hạn của việc chỉ đọc code**. Với `max_uses_per_user`, AI lý luận rất chuẩn ở tầng JavaScript — nhận ra `"0"` truthy nên vượt được `|| 1`, một chi tiết tinh vi mà đọc lướt sẽ bỏ qua. Nhưng nó dừng đúng ở ranh giới ngôn ngữ và **không đi tiếp xuống tầng lưu trữ**, nên bỏ lỡ việc SQLite ép chuỗi `"0"` về số `0`. Kết quả là expected sai, và trớ trêu thay, sự thật còn nghiêm trọng hơn AI mô tả: cơ chế `|| 1` sinh ra để chặn số `0` nhưng vẫn bị số `0` lọt vào DB qua ngả kiểu chuỗi. Bài học tôi rút ra: khi một giá trị đi xuyên nhiều tầng (JS → driver → SQLite affinity → cột), AI có xu hướng chỉ suy luận ở tầng nó đang đọc. Về phía làm tốt: **cả 3 TC SEC-03 đều đúng** — tôi probe và xác nhận token `role:"user"` tạo, xoá, đọc coupon đều trả `200`.

### 6.3 Bước 3 — Mở rộng (≥ 5 test case tự nghĩ)

> ✍️ **Gợi ý đã có sẵn từ phân tích:** AI **không sinh** TC cho biên chéo `type:"percent"` + `discount_value > 100`, với lý do "không có tài liệu nào quy định trần 100 %". Lập luận đó đúng về mặt BVA, nhưng để trống hẳn một nhóm mà đề §6 yêu cầu → ứng viên số 1 cho `A3-E01`.

| ID         | Tiêu đề                                                                    | Kỹ thuật / SEC                      | Input                                                                                               | Expected                                                                                                               | **Vì sao AI bỏ sót**                                                                                                                                                                                                                                                                                                                    |
| ---------- | -------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A3-E01** | Số `0` **vẫn lọt vào DB** qua ngả chuỗi, vô hiệu hoá chính cơ chế `\|\| 1` | BVA + Quy tắc nghiệp vụ             | Tạo 2 coupon: một với `max_uses_per_user:0`, một với `"0"`; đọc lại cả hai                          | Coupon A lưu `1` (bị chặn), coupon B lưu **`0`** (lọt) — cùng một giá trị nghiệp vụ, hai kết quả trái ngược            | **Hạn chế của mô hình.** AI dừng suy luận ở tầng JavaScript (`"0"` truthy → vượt `\|\| 1`) và không đi tiếp xuống tầng SQLite affinity. Nó kết luận "lưu chuỗi `\"0\"`" trong khi thực tế lưu **số `0`**. Chỉ chạy thật mới lộ ra rằng lá chắn `\|\| 1` có một lỗ thủng đúng bằng giá trị nó định chặn.                                 |
| **A3-E02** | Coupon `max_uses_per_user = 0` khiến FR-09 C5 **chặn vĩnh viễn**           | Quy tắc nghiệp vụ (hệ quả liên-API) | (1) tạo coupon `"0"` theo A3-E01 (2) `POST /api/apply-coupon` với `user_id` bất kỳ                  | Bị từ chối ngay lần đầu, vì `server.js:391` so `usage_count(0) >= max(0)` là **true** — coupon không bao giờ dùng được | **Chất lượng prompt.** Tôi ra lệnh "không invoke `apply-coupon` vì ngoài phạm vi 3 API", nên AI dừng ở "lưu được giá trị xấu". Nhưng một coupon chết cứng là **lỗi nghiệp vụ thật**, chỉ hiện ra khi đi tiếp một bước. Giới hạn phạm vi là quyết định của tôi, và nó đã che mất hệ quả.                                                 |
| **A3-E03** | `code:null` tạo được **nhiều lần**, phá vỡ ràng buộc `unique` của FR-17    | EP + Quy tắc nghiệp vụ              | Gọi `POST` hai lần liên tiếp với `code:null`                                                        | **Cả hai đều `200`** với id khác nhau — `UNIQUE` không chặn vì SQL coi mỗi `NULL` là khác biệt                         | **Hạn chế của mô hình.** AI có sinh TC-046 (`code:null`) nhưng chỉ gọi **một lần**, nên chỉ kết luận "không có `NOT NULL`". Ràng buộc bị vi phạm ở đây là **tính duy nhất**, mà muốn lộ ra thì phải gọi hai lần. AI test _thuộc tính của cột_, không test _ràng buộc nghiệp vụ_.                                                        |
| **A3-E04** | User thường xoá **coupon seed của hệ thống**                               | SEC-03 (leo thang có hậu quả)       | Token `role:"user"` → `DELETE /api/admin/coupons/1` (mã `SAVE10`)                                   | `200` · `SAVE10` biến mất khỏi `GET /api/coupons` — người dùng thường phá được dữ liệu gốc                             | **Chất lượng prompt.** AI có TC-030 (user xoá coupon) nhưng chọn xoá **coupon do chính test tạo ra**, vì tôi đã nhấn mạnh "mọi TC phải dọn dữ liệu". Chỉ dẫn về vệ sinh dữ liệu vô tình khiến nó chọn mục tiêu vô hại, làm nhẹ đi mức nghiêm trọng thật của SEC-03.                                                                     |
| **A3-E05** | `discount_value` âm tạo coupon **làm tăng tiền phải trả**                  | BVA + hệ quả nghiệp vụ              | (1) tạo coupon `type:"fixed"`, `discount_value:-50000` (2) `apply-coupon` với `total_amount:500000` | `final_amount = 500000 − (−50000) = 550000` — "giảm giá" khiến khách trả **nhiều hơn**                                 | **Chất lượng prompt.** AI sinh TC-051 (giá trị âm) và dừng ở "200, lưu được", đúng phạm vi tôi giao. Nó không tính tiếp `final_amount = total − discount_amount` (`server.js:405`) để thấy dấu âm lật ngược ý nghĩa nghiệp vụ. Cùng khuôn với A3-E02: tôi cắt phạm vi ở ranh giới endpoint, nên hệ quả nằm bên kia ranh giới bị bỏ qua. |

| Nguyên nhân bỏ sót     | Số TC | Diễn giải                                                                                                                                                                                     |
| ---------------------- | :---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chất lượng prompt      |   3   | A3-E02, A3-E04, A3-E05 — tôi cắt phạm vi ở ranh giới 3 endpoint và nhấn mạnh dọn dữ liệu; cả hai chỉ dẫn đều đúng về mặt quản lý nhưng đã che mất hệ quả nghiệp vụ nằm ngay bên kia ranh giới |
| Hạn chế của mô hình    |   2   | A3-E01 (suy luận dừng ở tầng JS, không xuống tầng lưu trữ), A3-E03 (test thuộc tính cột thay vì ràng buộc nghiệp vụ, nên gọi 1 lần thay vì 2)                                                 |
| Đặc điểm riêng của API |   0   | —                                                                                                                                                                                             |

> **Ghi chú về nhóm biên chéo.** Ở §6.1 tôi đã bổ sung TC-API3-058/059/060 cho `percent` + `discount_value` 100/101 sau khi phát hiện AI để trống hẳn nhóm này. Vì các TC đó nay đã nằm trong bộ chính, tôi **không** tính lại ở đây; 5 TC trên đều là những cái AI bỏ sót mà đến giờ vẫn chưa có TC nào phủ.

### 6.4 Bước 4 — Thực thi (Postman + Newman)

| Hạng mục                | Giá trị                  |
| ----------------------- | ------------------------ |
| Folder trong collection | «API3 — Admin Coupons»   |
| Số request              | «»                       |
| Số assertion            | «»                       |
| Data file (nếu có)      | «data/api3.csv — n dòng» |

```bash
newman run «collection.json» \
  -e «env.postman_environment.json» \
  --folder "«API3 — Admin Coupons»" \
  -d «data/api3.csv» \
  -r cli,htmlextra --reporter-htmlextra-export «reports/api3.html»
```

|            | Executed | Passed | Failed |
| ---------- | :------: | :----: | :----: |
| Requests   |    «»    |   «»   |   «»   |
| Assertions |    «»    |   «»   |   «»   |

> ✍️ **Lưu ý riêng API 3:** `code` là `UNIQUE`, nên **không dọn dữ liệu = không chạy lại được**. Chạy `TC-API3-044` sớm trong suite để xác thực cơ chế teardown trước khi các TC khác phụ thuộc vào nó.

![Newman API3](«evidence/newman_api3.png»)
Báo cáo HTML: [`«reports/api3.html»`](«reports/api3.html»)

**Các assertion FAIL và diễn giải**

| ID          | Assertion fail            | Actual | Expected                | Là bug SUT hay lỗi test?               |
| ----------- | ------------------------- | ------ | ----------------------- | -------------------------------------- |
| TC-API3-029 | «status 200, kỳ vọng 403» | «200»  | «403 theo SEC-03/FR-12» | «BUG-0x — user thường tạo được coupon» |
| TC-API3-0xx | «»                        | «»     | «»                      | «»                                     |

### 6.5 Bước 5 — Lỗi phát hiện được

| ID     | Tiêu đề                                                | Mức độ     | TC phát hiện              | AI có sinh TC này không? | GitHub Issue |
| ------ | ------------------------------------------------------ | ---------- | ------------------------- | ------------------------ | ------------ |
| BUG-0x | «User thường tạo/xoá/đọc được coupon — vi phạm SEC-03» | «Critical» | «TC-API3-029, -030, -031» | «Có — AI sinh»           | «URL»        |
| BUG-0x | «Trùng `code` trả 500 kèm nguyên văn thông báo SQLite» | «Low»      | «TC-API3-039»             | «Có — AI sinh»           | «URL»        |

<details>
<summary><b>BUG-0x — «tiêu đề»</b></summary>

- **Endpoint:** `«»`
- **Các bước tái hiện:** «1… 2… 3…»
- **Kết quả mong đợi:** «»
- **Kết quả thực tế:** «»
- **Mức độ / Độ ưu tiên:** «»
- **Bằng chứng:** ![BUG](«evidence/bug0x.png»)
- **Issue:** «URL»

</details>

> ✍️ **Gợi ý riêng cho Pool C (admin):** bắt buộc có test leo thang quyền — user thường gọi endpoint admin (TC-API3-029/030/031 ✓), token bị sửa chữ ký (TC-API3-035 ✓), không gửi token (TC-API3-028 ✓), token hết hạn (TC-API3-032 — lưu ý: SUT **không** phát hành token có `exp`, nên chỉ tới được bằng token tự ký).

### 6.10 Kiểm toán đặc tả OpenAPI do AI sinh (tùy chọn)

> ✍️ Đề §14 cho phép nộp bản chuyển đặc tả sang OpenAPI, nhưng **nếu do AI sinh thì bắt buộc kiểm toán**. Bỏ mục này nếu không nộp OpenAPI.

| Endpoint | Sai lệch so với `api_specification.md` | Nhãn | Tôi sửa thành |
| -------- | -------------------------------------- | ---- | ------------- |
| «»       | «»                                     | «»   | «»            |

File: [`«openapi.yaml»`](«openapi.yaml»)

### 6.9 Bảng phủ yêu cầu bảo mật SEC-01 → SEC-07

> ⚠️ SEC-01…SEC-07 nằm trong `README.md §9` của SUT (mục "Tham khảo"), **không nằm trong `api_specification.md`** như đề bài giả định — đã kiểm tra trực tiếp trong repo SUT (P8). Cột "Kết quả" để **pending** vì Newman chưa chạy (Bước 4).

| Mã     | Yêu cầu (theo `README.md §9`)                  | TC của API 1                                       | API 2                                            | API 3                             | Kết quả   |
| ------ | ---------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ | --------------------------------- | --------- |
| SEC-01 | Mật khẩu không lưu plaintext                   | TC-API1-038 (endpoint hỗ trợ `GET`)                | Không áp dụng                                    | Không áp dụng                     | «pending» |
| SEC-02 | API bảo mật phải yêu cầu JWT hợp lệ            | TC-API1-023…027                                    | TC-API2-025…031                                  | TC-API3-028,032,035               | «pending» |
| SEC-03 | API Admin phải kiểm `role='admin'` trong Token | Không áp dụng trực tiếp (không phải admin API)     | Không áp dụng trực tiếp (không phải admin route) | **TC-API3-029,030,031 — vi phạm** | «pending» |
| SEC-04 | Escape dữ liệu user khi hiển thị UI            | TC-API1-032 (chỉ kiểm lưu/phản hồi, không kiểm UI) | Không áp dụng (endpoint không lưu chuỗi user)    | Chưa có TC riêng (xem P8: mơ hồ)  | «pending» |
| SEC-05 | Parameterized query, không nối chuỗi           | TC-API1-031                                        | TC-API2-035                                      | TC-API3-033                       | «pending» |
| SEC-06 | API cập nhật hồ sơ không cho đổi `role`        | **TC-API1-029 — vi phạm**                          | Không áp dụng                                    | Không áp dụng                     | «pending» |
| SEC-07 | OTP đủ entropy, có hạn, vô hiệu sau dùng       | Không áp dụng (endpoint không liên quan OTP)       | Không áp dụng                                    | Không áp dụng                     | «pending» |

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

| Hạng mục | Giá trị |
| --- | --- |
| URL | https://youtu.be/Nz8hUbziTyI |
| Nội dung | Demo Agent Skill `api-test-generator` — sinh test case cho một API của EShop từ đặc tả |
| Mã nguồn skill | [`skills/SKILL.md`](./skills/SKILL.md) |

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

**Nhánh làm việc:** `hw6/api-testing`

|  #  | Commit    | Ngày       | Bước quy trình                                                | Phạm vi       |
| :-: | --------- | ---------- | ------------------------------------------------------------- | ------------- |
|  1  | `89653b4` | 2026-08-19 | Chuẩn bị — nguồn yêu cầu                                      | đề bài        |
|  2  | `8ef2f2e` | 2026-08-19 | Chuẩn bị — khung báo cáo, chọn API (§1, §3)                   | cả 3 API      |
|  3  | `73db493` | 2026-08-19 | **Bước 1** — Sinh test bằng AI (42 TC)                        | API 1 (FR-04) |
|  4  | `5a4793e` | 2026-08-19 | **Bước 1** — Sinh test bằng AI (43 TC) + ma trận trạng thái   | API 2 (FR-10) |
|  5  | `476f8f5` | 2026-08-19 | **Bước 1** — Sinh test bằng AI (44 TC)                        | API 3 (FR-17) |
|  6  | `3bf0879` | 2026-08-19 | Phủ bảo mật SEC-01→SEC-07 (§6.9)                              | cả 3 API      |
|  7  | `c870578` | 2026-08-19 | Dựng khung Bước 2–5 cho §5 và §6                              | API 2, API 3  |
|  8  | `97210e6` | 2026-08-19 | Rà soát của con người — sửa lệch số học EP                    | API 2         |
|  9  | `032ebde` | 2026-08-19 | Rà soát của con người — đóng 4 nhóm coverage thiếu (44→82 TC) | API 3         |
| 10  | `d99d477` | 2026-08-19 | Báo cáo Kiểm toán AI (Phụ lục A)                              | cả 3 API      |
| 11  | `b3abc4d` | 2026-08-19 | Git commit log + đồng bộ §12                                  | cả 3 API      |
| 12  | `1877ccb` | 2026-08-19 | **Bước 2** — Kiểm toán 167 TC bằng probe SUT thật             | cả 3 API      |
| 13  | `2d25eb2` | 2026-08-19 | **Bước 3** — 15 TC tự bổ sung AI đã bỏ sót                    | cả 3 API      |
| 14  | `f8f4ed7` | 2026-08-19 | Git commit log — cập nhật sau Bước 2 và Bước 3                 | cả 3 API      |
| 15  | `65045d1` | 2026-08-19 | Rà soát của con người — áp dụng kết quả kiểm toán vào §4.1/§5.1/§6.1 | cả 3 API |
| 16  | `61009aa` | 2026-08-20 | Báo cáo Kiểm toán AI — log prompt #39/#40, khai báo phiên 20/08 | cả 3 API      |
| 17  | `4e3e738` | 2026-08-20 | Git commit log + đồng bộ §12 đến 20/08                    | cả 3 API      |
| 18  | `4d50d65` | 2026-08-20 | Git commit log — điền hash thật cho dòng 17                    | cả 3 API      |
| 19  | `7122df2` | 2026-08-20 | Agent Skill `api-test-generator` + link video demo §9.6        | cả 3 API      |

**Các bước sẽ có commit riêng khi thực hiện:** Bước 4 thực thi Newman (3 commit) · Bước 5 báo lỗi (1–3 commit) · Postman collection · CI/CD 2 lần chạy · Agent Skill.

> Không tạo commit cho công việc chưa thực sự làm — các bước chưa chạy không xuất hiện trong log.

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
