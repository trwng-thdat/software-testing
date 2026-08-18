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

**Mục tiêu ≥ 35 test case.** Số thực tế AI sinh: **42**.

| Nhóm kỹ thuật          | Số TC | Ghi chú |
| ---------------------- | :---: | ------- |
| Phân vùng miền giá trị |  14   | `name`/`shipping_address`/`phone`/`role` (thiếu/rỗng/sai kiểu), body combo |
| Giá trị biên           |   8   | Độ dài `phone` (9/10/11/12 số), ký tự đầu `phone`, header 2-khoảng-trắng, `role` số `0` vs chuỗi `"0"` |
| Chuyển trạng thái      |   0   | **P7 kết luận: không áp dụng** — endpoint này không có máy trạng thái ý nghĩa (không phải thiếu sót) |
| Bảo mật (SEC-01…07)    |  10   | Auth bypass (401/403/token giả mạo), leo thang quyền `role` (SEC-06), SQLi/XSS payload |
| Kiểm tra schema        |   6   | Response 2xx/401/403, schema `GET /api/users/me`, kiểm tra không lộ trường bị ghi đè |
| Quy tắc nghiệp vụ khác |   3   | Bất đối xứng ép kiểu `max_uses_per_user`, `is_active` không thể set qua API, chuỗi tạo→xoá→verify |
| **Tổng**               |  42   | ≥ 35 theo yêu cầu đề bài |

**Tiền điều kiện chung cho mọi TC của API 1.** SUT chạy tại `http://localhost:3000`, DB vừa seed lại (`node database.js` → `node server.js`) nên `test@eshop.com` / `Test1234!` là user `id=2`, `role="user"`. `{{token}}` = token lấy từ `POST /api/login` của user này, dùng lại cho mọi TC trừ khi TC ghi khác. Mọi TC ghi dữ liệu đều verify lại bằng `GET /api/users/me`.

**Bảng test case đầy đủ — 42 TC** _(ID `TC-API1-001`…`TC-API1-042`; đây là danh sách chuẩn — khi xuất sang `testcases/API1.xlsx` phải giữ nguyên ID để bảo toàn truy vết)_

| ID     | Tiêu đề | Kỹ thuật | Truy vết (Coverage / FR / SEC) | Input / Precondition riêng | Expected (status + body) | Nguồn |
| ------ | ------- | -------- | ------------------- | ------------ | ------------------------ | ----- |
| TC-API1-001 | Cập nhật hồ sơ hợp lệ (happy path) | EP | COV-001,047 · FR-04 §2.2 | `{"name":"Nguyen Van A","shipping_address":"123 Le Loi","phone":"0912345678"}` | 200 · `{"message":"Profile updated"}` | AI |
| TC-API1-002 | Thiếu trường `name` | EP | COV-013 · FR-04 | Body không có key `name` | 200 · `{"message":"Profile updated"}` (không có validate) | AI |
| TC-API1-003 | `name` là chuỗi rỗng | EP | COV-014 · (không đặc tả) | `name:""` | 200 · `{"message":"Profile updated"}` | AI |
| TC-API1-004 | `name` sai kiểu (number) | EP | COV-016 · (không đặc tả) | `name:12345` | ⚠️ 200 **hoặc** 500 — chưa xác nhận, cần probe | AI |
| TC-API1-005 | Thiếu trường `shipping_address` | EP | COV-022 · FR-04 | Body không có key `shipping_address` | 200 · `{"message":"Profile updated"}` | AI |
| TC-API1-006 | `shipping_address` sai kiểu (object) | EP | COV-025 · (không đặc tả) | `shipping_address:{"street":"123 Le Loi"}` | ⚠️ 200 **hoặc** 500 — chưa xác nhận, cần probe | AI |
| TC-API1-007 | Gửi key camelCase `shippingAddress` — bị bỏ qua | EP | COV-028 · (BUG-D3 nhóm đã ghi nhận) | `shippingAddress:"789 Nguyen Hue"` | 200, `GET` cho thấy `shipping_address` **không** đổi | AI |
| TC-API1-008 | Thiếu trường `phone` | EP | COV-037 · FR-04 | Body không có key `phone` | 200 · `{"message":"Profile updated"}` | AI |
| TC-API1-009 | `phone` chứa ký tự không phải số | EP | COV-034 · FR-04 (không thực thi) | `phone:"0912-345-678"` | 200 (kỳ vọng đặc tả: từ chối) | AI |
| TC-API1-010 | `phone` gửi dưới dạng JSON number | EP | COV-038 · FR-04 | `phone:912345678` (number) | 200 — kiểu số không thể giữ số `0` đầu | AI |
| TC-API1-011 | `phone` khớp regex client web nhưng trái FR-04 | EP | COV-039 · xung đột 2 oracle | `phone:"912345678"` (9 số, không có `0` đầu) | 200 — chứng minh cả 2 luật đều không được backend thực thi | AI |
| TC-API1-012 | Không gửi `role` (baseline đối chiếu) | EP | COV-041 · SEC-06 | 3 trường hợp lệ, không có `role` | 200, `GET` cho thấy `role` vẫn `"user"` | AI |
| TC-API1-013 | Trường lạ không được nhận diện bị bỏ qua | EP | COV-051 · §2.2 | `{...,"foo":"bar"}` | 200, `foo` không có tác dụng | AI |
| TC-API1-014 | `name`/`địa chỉ` hợp lệ + `phone` sai định dạng | EP | COV-052 · FR-04 | `phone:"abc"`, 2 trường kia hợp lệ | 200 — luật phone không được thực thi kể cả trong ngữ cảnh hỗn hợp | AI |
| TC-API1-015 | `phone` 9 chữ số (biên min−1) | BVA | COV-032 · FR-04 | `phone:"091234567"` | 200 (kỳ vọng đặc tả: từ chối) | AI |
| TC-API1-016 | `phone` 10 chữ số (biên min) | BVA | COV-029 · FR-04 | `phone:"0912345678"` | 200 · hợp lệ theo cả đặc tả lẫn mã nguồn | AI |
| TC-API1-017 | `phone` 11 chữ số (biên max) | BVA | COV-030 · FR-04 | `phone:"09123456789"` | 200 · hợp lệ theo cả đặc tả lẫn mã nguồn | AI |
| TC-API1-018 | `phone` 12 chữ số (biên max+1) | BVA | COV-033 · FR-04 | `phone:"091234567890"` | 200 (kỳ vọng đặc tả: từ chối) | AI |
| TC-API1-019 | `phone` đúng độ dài nhưng không bắt đầu bằng `0` | BVA | COV-031,040 · FR-04 | `phone:"1912345678"` | 200 (kỳ vọng đặc tả: từ chối) | AI |
| TC-API1-020 | Header `Authorization` có 2 dấu cách liên tiếp | BVA | COV-011 · (chỉ có ở mã nguồn) | `Authorization: Bearer  {{token}}` | **403** `{"error":"Forbidden"}` — **không phải 401** | AI |
| TC-API1-021 | `role` là số `0` (falsy) — không ghi | BVA | COV-042,046 · SEC-06 | `role:0` | 200, `GET` cho thấy `role` vẫn `"user"` | AI |
| TC-API1-022 | `role` là chuỗi `"0"` (truthy) — **bị ghi** | BVA + Security | COV-046 · SEC-06 | `role:"0"` | 200, `GET` cho thấy `role` = `"0"` | AI |
| TC-API1-023 | Không gửi header `Authorization` | Security | COV-003 · SEC-02 | (bỏ header) | 401 · `{"error":"Unauthorized"}` | AI |
| TC-API1-024 | Header không có dấu cách phân tách | Security | COV-005 · SEC-02 | `Authorization: SomeGarbageWithNoSpace` | 401 · `{"error":"Unauthorized"}` | AI |
| TC-API1-025 | JWT sai cú pháp | Security | COV-007 · SEC-02 | `Authorization: Bearer not-a-valid-jwt` | 403 · `{"error":"Forbidden"}` | AI |
| TC-API1-026 | JWT ký bằng secret khác | Security | COV-008 · SEC-02 | Token ký bằng khoá sai | 403 · `{"error":"Forbidden"}` | AI |
| TC-API1-027 | Token giả mạo có `exp` quá khứ | Security | COV-009 · SEC-02 | Token tự ký bằng `SECRET_KEY` lộ, `exp` ở quá khứ | 403 · `{"error":"Forbidden"}` | AI |
| TC-API1-028 | Token hợp lệ nhưng `id` không tồn tại | Security | COV-010 · (không đặc tả) | Token tự ký `{id:999999}` | 200 dù 0 dòng bị cập nhật (`this.changes` không kiểm) | AI |
| TC-API1-029 | **[CRITICAL]** Leo thang quyền qua `role:"admin"` | Security | COV-043,061 · **SEC-06**, FR-04 | `{...,"role":"admin"}` | 200, `GET` cho thấy `role="admin"` — **vi phạm SEC-06** | AI |
| TC-API1-030 | `role` ngoài enum (`"superadmin"`) | Security | COV-045 · SEC-06 | `role:"superadmin"` | 200, lưu nguyên văn — không có enum check | AI |
| TC-API1-031 | Payload SQL injection trong `name` | Security | COV-019,060 · SEC-05 | `name:"Robert'); DROP TABLE users;--"` | 200 · lưu như chuỗi literal, bảng `users` còn nguyên | AI |
| TC-API1-032 | Payload script/XSS trong `name` | Security | COV-018,059 · SEC-04 | `name:"<script>alert(1)</script>"` | 200 · `GET` trả về nguyên văn (chỉ kiểm lưu/phản hồi, không kiểm render) | AI |
| TC-API1-033 | Schema response thành công | Schema | COV-063 | Body hợp lệ | 200 · đúng 1 key `message`, không dư trường | AI |
| TC-API1-034 | Schema lỗi 401 | Schema | COV-064 | (bỏ header) | 401 · đúng 1 key `error` = `"Unauthorized"` | AI |
| TC-API1-035 | Schema lỗi 403 | Schema | COV-065 | Token sai cú pháp | 403 · đúng 1 key `error` = `"Forbidden"` | AI |
| TC-API1-036 | Schema xác minh của `GET /api/users/me` | Schema | COV-067 · (endpoint hỗ trợ) | — (GET) | 200 · đủ 10 trường theo `database.js:50-61` | AI |
| TC-API1-037 | Response `PUT` không echo trường nào đã ghi | Schema | COV-068 | `name:"Distinctive Test Name XYZ"` | 200 · body **không** chứa giá trị vừa gửi | AI |
| TC-API1-038 | `GET /api/users/me` lộ `password` plaintext | Schema + Security | COV-056 · SEC-01 (liên đới) | — (GET) | 200 · body chứa `"password":"Test1234!"` | AI |
| TC-API1-039 | Ngữ nghĩa ghi-đè-toàn-bộ: bỏ trường sẽ xoá giá trị cũ | Quy tắc nghiệp vụ | COV-069 · FR-04 (suy từ mã nguồn) | B1 đặt `shipping_address` giá trị riêng; B2 gửi PUT không kèm trường này | 200, `GET` cho thấy giá trị cũ **đã mất** | AI |
| TC-API1-040 | Scheme header không chuẩn vẫn được chấp nhận | Quy tắc nghiệp vụ | COV-006 · §2 (đặc tả ghi `Bearer`) | `Authorization: Basic {{token}}` | 200 — scheme không được kiểm | AI |
| TC-API1-041 | Header `Authorization` rỗng → 403 (không phải 401) | Quy tắc nghiệp vụ | COV-004 · (chỉ có ở mã nguồn) | `Authorization: ` (rỗng) | 403 · `{"error":"Forbidden"}` — vì `"" == null` là false | AI |
| TC-API1-042 | Token mang claim `role` cũ sau khi leo thang | Quy tắc nghiệp vụ + Security | COV-070 · SEC-06 | Chạy sau TC-029, dùng lại đúng token cũ | `GET` cho `role="admin"` nhưng payload JWT vẫn `role="user"` | AI |

> **6 TC cần rà soát thủ công trước khi chốt expected:** `TC-API1-004`, `-006` (hành vi bind kiểu sai của sqlite3 chưa xác nhận), `-020`, `-041` (suy luận nhánh code, cần xác nhận thực tế), `-027`, `-028`, `-042` (cần tự ký JWT bằng pre-request script).

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

| Thuộc tính   | Giá trị                                   |
| ------------ | ----------------------------------------- |
| Endpoint     | `PUT /api/orders/:id/cancel`               |
| Pool / FR    | B / FR-10 — Máy trạng thái đơn hàng / Hủy đơn |
| Auth         | Bearer JWT (user) — `authenticateToken`, `server.js:100-110` |
| Request body | Không có (endpoint bỏ qua `req.body` hoàn toàn — `server.js:321-342`) |
| Tham số path | `:id` — không được validate định dạng/kiểu trong mã nguồn |
| Response 2xx | `200` — `{"message":"Order canceled successfully"}` (không đặc tả trong `api_specification.md §4.6`; suy từ `server.js:337`) — **không trả `id` hay `status` mới**, phải verify bằng `GET /api/orders/my-orders` |
| Mã lỗi       | `401` `{"error":"Unauthorized"}` · `403` `{"error":"Forbidden"}` · `404` `{"error":"Order not found"}` (gộp 2 nguyên nhân: đơn không tồn tại VÀ đơn của người khác) · `400` `{"error":"Cannot cancel this order."}` (gộp `delivered` và `canceled`) — **không có 500** trên endpoint này |
| Yêu cầu SEC  | SEC-02 (JWT hợp lệ — có) · SEC-05 (parameterized query trên `:id` — đạt) · **Không có SEC ID nào đặt tên trực tiếp cho lỗ hổng phân quyền theo trạng thái `shipping`** — xem P7/P8 |

### 5.1 Bước 1 — Sinh test case bằng AI

**Mục tiêu ≥ 35 test case.** Số thực tế AI sinh: **43**.

| Nhóm kỹ thuật          | Số TC | Ghi chú |
| ---------------------- | :---: | ------- |
| Phân vùng miền giá trị |   8   | `:id` (không tồn tại, không phải số, âm, thập phân, ký tự lạ), body bị bỏ qua |
| Giá trị biên           |   8   | `:id` biên cấu trúc (0/1/2), token giả mạo với `id` biên (0/1/2), header 2-khoảng-trắng |
| **Chuyển trạng thái**  | **9** | **Toàn bộ mô hình 5 trạng thái từ P7** — xem ma trận bên dưới |
| Bảo mật (SEC-01…07)    |  11   | Auth bypass, IDOR (đơn của người khác), admin không sở hữu vẫn bị chặn, SQLi trên `:id`, token giả mạo |
| Kiểm tra schema        |   8   | Response 2xx/401/403/404/400, xác nhận không có 500, xác nhận trạng thái không xuất hiện trong response `PUT` |
| **Tổng**               |  43   | ≥ 35 theo yêu cầu đề bài |

**Tiền điều kiện chung cho mọi TC của API 2.** DB vừa seed lại (**không có đơn hàng nào được seed** — mọi đơn phải tạo bằng `POST /api/checkout`, luôn bắt đầu ở `pending`). **User A** = `test@eshop.com`/`Test1234!` (`id=2`) → `{{tokenA}}`. **User B** = tài khoản thứ hai đăng ký mới → `{{tokenB}}` (cần cho TC kiểm tra ownership). **Admin** = `admin@eshop.com`/`Admin123!` (`id=1`) → `{{tokenAdmin}}`, **chỉ dùng để dựng trạng thái** qua `PUT /api/admin/orders/:id/status`, không phải chủ thể kiểm thử trừ khi TC ghi rõ. Verify trạng thái sau mỗi lần hủy bằng `GET /api/orders/my-orders`.

**Bảng test case đầy đủ — 43 TC** _(ID `TC-API2-001`…`TC-API2-043`)_

| ID     | Tiêu đề | Kỹ thuật | Truy vết (Coverage / FR / SEC) | Input / Precondition riêng | Expected (status + body) | Nguồn |
| ------ | ------- | -------- | ------------------- | ------------ | ------------------------ | ----- |
| TC-API2-001 | Hủy đơn `pending` (chuyển tiếp hợp lệ) | ST + EP | COV-001,029 · FR-10 | Đơn của user A, `status=pending` | 200 · `{"message":"Order canceled successfully"}`, `GET` → `status="canceled"` | AI |
| TC-API2-002 | `:id` hợp lệ nhưng đơn không tồn tại | EP | COV-013 | `:id=999999` | 404 · `{"error":"Order not found"}` | AI |
| TC-API2-003 | `:id` không phải số | EP | COV-006 | `:id="abc"` | ⚠️ chưa xác nhận — nhiều khả năng 404, cần probe | AI |
| TC-API2-004 | `:id` là segment rỗng | EP | COV-007 | `/api/orders//cancel` | ⚠️ chưa xác nhận — có thể không khớp route, cần probe | AI |
| TC-API2-005 | `:id` âm | EP | COV-008 | `:id=-1` | 404 — `AUTOINCREMENT` không bao giờ sinh id âm | AI |
| TC-API2-006 | `:id` dạng thập phân | EP | COV-010 | `:id=1.5` | ⚠️ chưa xác nhận, cần probe | AI |
| TC-API2-007 | `:id` có ký tự thừa | EP | COV-011 | `:id="1abc"` | ⚠️ chưa xác nhận, cần probe | AI |
| TC-API2-008 | Body request không có tác dụng | EP | COV-036 · §4.6 | Body `{"status":"delivered"}` | 200, `status` = `"canceled"` (**không** `delivered`) — đích ghi cứng | AI |
| TC-API2-009 | `:id = 0` (biên cấu trúc min−1) | BVA | COV-002 | `:id=0` | 404 · `AUTOINCREMENT` không cấp id 0 | AI |
| TC-API2-010 | `:id = 1` (biên cấu trúc min) | BVA | COV-003 | Đơn id 1 tồn tại & thuộc user A (DB mới reset) | 200 · `{"message":"Order canceled successfully"}` | AI |
| TC-API2-011 | `:id = 2` (biên min+1) | BVA | COV-004 | Đơn id 2 tồn tại & thuộc user A | 200 · `{"message":"Order canceled successfully"}` | AI |
| TC-API2-012 | `:id` cực lớn (tràn số) | BVA | COV-005 | `:id=99999999999999999999` | ⚠️ chưa xác nhận, cần probe | AI |
| TC-API2-013 | Token giả mạo `id=0` — không sở hữu đơn nào | BVA + Security | COV-028 | Token tự ký `{id:0}` | 404 · `{"error":"Order not found"}` | AI |
| TC-API2-014 | Token giả mạo `id=1` (trùng admin thật) | BVA + Security | COV-028 | Token tự ký `{id:1}`, đơn thuộc admin | 200 — giả mạo không phân biệt được với token thật | AI |
| TC-API2-015 | Token giả mạo `id=2` (trùng user A thật) | BVA + Security | COV-028 · SEC-02 | Token tự ký `{id:2}`, đơn thuộc user A | 200 — chiếm trọn quyền sở hữu của id bị mạo danh | AI |
| TC-API2-016 | Header `Authorization` có 2 dấu cách | BVA | COV-023 | `Authorization: Bearer  {{tokenA}}` | 403 · `{"error":"Forbidden"}` — **không phải 401** | AI |
| TC-API2-017 | Hủy đơn `confirmed` (chuyển tiếp hợp lệ) | ST | COV-030 · FR-10 | Đơn đã `pending→confirmed` qua admin | 200 · `{"message":"Order canceled successfully"}` | AI |
| TC-API2-018 | **[CRITICAL]** Hủy đơn `shipping` bằng token user | ST + Security | COV-031 · **FR-10 (User bị cấm)** | Đơn đã `pending→confirmed→shipping` qua admin | 200 theo mã nguồn — **mâu thuẫn trực tiếp với FR-10** | AI |
| TC-API2-019 | Hủy đơn `delivered` (trạng thái kết thúc) | ST | COV-032 · FR-10 | Đơn đã đi hết chuỗi tới `delivered` | 400 · `{"error":"Cannot cancel this order."}` | AI |
| TC-API2-020 | Hủy đơn đã `canceled` (trạng thái kết thúc) | ST | COV-033 · FR-10 | Đơn đã `canceled` từ trước | 400 · `{"error":"Cannot cancel this order."}` | AI |
| TC-API2-021 | Hủy lặp: gọi 2 lần liên tiếp cùng đơn | ST | COV-037 · FR-10 | Đơn `pending` mới, gọi PUT cancel 2 lần | Lần 1: 200 · Lần 2: 400 — trạng thái bất biến, response thì không | AI |
| TC-API2-022 | `status` ngoài 5 giá trị hợp lệ | ST | COV-034 | ⚠️ Phải sửa DB trực tiếp — **không** tới được qua API | 200 — deny-list chỉ chặn `delivered`/`canceled` | AI |
| TC-API2-023 | Route admin **từ chối** `shipping→canceled` | ST | COV-054 · FR-10 (đối chứng) | Đơn `shipping`, token admin, body `{"status":"canceled"}` | 400 · `Invalid state transition from shipping to canceled` | AI |
| TC-API2-024 | Route admin **cho phép** `canceled→delivered` | ST | COV-055 · FR-10 (mâu thuẫn) | Đơn `canceled`, token admin, body `{"status":"delivered"}` | 200 — thoát khỏi trạng thái FR-10 gọi là kết thúc | AI |
| TC-API2-025 | Không gửi header `Authorization` | Security | COV-015 · SEC-02 | (bỏ header) | 401 · `{"error":"Unauthorized"}` | AI |
| TC-API2-026 | Header `Authorization` rỗng | Security | COV-016 | `Authorization: ` (rỗng) | 403 · `{"error":"Forbidden"}` — không phải 401 | AI |
| TC-API2-027 | Header không có dấu cách phân tách | Security | COV-017 · SEC-02 | `Authorization: GarbageNoSpace` | 401 · `{"error":"Unauthorized"}` | AI |
| TC-API2-028 | Scheme không chuẩn vẫn được chấp nhận | Security | COV-018 · §4 (đặc tả ghi `Bearer`) | `Authorization: Basic {{tokenA}}` | 200 — scheme không được kiểm | AI |
| TC-API2-029 | JWT sai cú pháp | Security | COV-019 · SEC-02 | `Bearer not-a-jwt` | 403 · `{"error":"Forbidden"}` | AI |
| TC-API2-030 | JWT ký bằng secret khác | Security | COV-020 · SEC-02 | Token ký sai khoá | 403 · `{"error":"Forbidden"}` | AI |
| TC-API2-031 | Token giả mạo có `exp` quá khứ | Security | COV-021 · SEC-02 | Token tự ký, `exp` quá khứ | 403 · `{"error":"Forbidden"}` | AI |
| TC-API2-032 | Token hợp lệ với `id` người dùng không tồn tại | Security + EP | COV-022 | Token tự ký `{id:999999}` | 404 — bộ lọc `user_id` không bao giờ khớp | AI |
| TC-API2-033 | **IDOR:** user A hủy đơn của user B | Security | COV-025 · FR-11 (mở rộng) | Token user A, `:id` = đơn của user B | 404 · `{"error":"Order not found"}` — không phân biệt với "không tồn tại" | AI |
| TC-API2-034 | Admin không sở hữu đơn vẫn bị chặn | Security | COV-026 · FR-10 | Token admin, `:id` = đơn của user A | 404 — bộ lọc ownership áp dụng cho cả admin | AI |
| TC-API2-035 | Payload SQL injection trong `:id` | Security | COV-012 · SEC-05 | `:id="1 OR 1=1"` | 404 — xử lý như chuỗi literal, không thực thi SQL | AI |
| TC-API2-036 | Schema response thành công | Schema | COV-045 | Đơn `pending` của user A | 200 · đúng 1 key `message`, **không** có `id`/`status` | AI |
| TC-API2-037 | Schema lỗi 401 | Schema | COV-046 | (bỏ header) | 401 · đúng 1 key `error` = `"Unauthorized"` | AI |
| TC-API2-038 | Schema lỗi 403 | Schema | COV-047 | Token sai cú pháp | 403 · đúng 1 key `error` = `"Forbidden"` | AI |
| TC-API2-039 | Schema 404 giống hệt nhau cho 2 nguyên nhân | Schema | COV-048 | Gọi 2 lần: `:id` không tồn tại **và** `:id` của user B | Cả 2 → 404, body **giống hệt từng byte** (chống dò đơn) | AI |
| TC-API2-040 | Schema 400 giống hệt nhau cho 2 nguyên nhân | Schema | COV-049 | Gọi 2 lần: đơn `delivered` **và** đơn `canceled` | Cả 2 → 400, body **giống hệt từng byte** | AI |
| TC-API2-041 | Response `PUT` không chứa trạng thái — phải verify bằng `GET` | Schema | COV-051,052 | PUT cancel rồi `GET /api/orders/my-orders` | PUT: không có `status`; GET: phần tử có `status="canceled"` | AI |
| TC-API2-042 | `GET /api/orders/:id` đọc được **không cần token** | Schema + Security | COV-053 · SEC-02 (vi phạm ở endpoint kề) | GET `/api/orders/{id}` **không** gửi header | 200 · trả full đơn hàng — lỗ hổng của endpoint hỗ trợ | AI |
| TC-API2-043 | Xác nhận **không** tồn tại đường 500 nào | Schema | COV-050 | Tổng hợp toàn bộ TC-001…042 | Không có TC nào trả 500 (cả 2 callback SQLite đều bỏ qua `err`) | AI |

> **11 TC cần rà soát thủ công:** `TC-API2-003`, `-004`, `-006`, `-007`, `-012` (hành vi `:id` bất thường chưa xác nhận) · `-016`, `-026` (suy luận nhánh code) · `-013`, `-014`, `-015`, `-031`, `-032` (cần tự ký JWT) · `-022` (phải sửa DB trực tiếp, **không** tới được qua API — đánh dấu tuỳ chọn) · `-023`, `-024` (nhắm route admin, ngoài phạm vi 3 API chính — đối chứng, tuỳ chọn).

**Ma trận chuyển trạng thái (theo P7 — chỉ giữ trạng thái/chuyển tiếp có bằng chứng từ đặc tả hoặc mã nguồn; không giả định trạng thái không tồn tại)**

| Từ \ Hành động | Admin: confirm | Admin: ship | Admin: deliver | **Hủy (User, `PUT .../cancel`)** |
| -------------- | --------------- | ----------- | --------------- | --------------------------------- |
| `pending`      | ✔ → `confirmed` (route admin, dùng để tạo tiền đề test) | ✘ (không có luật admin nào cho phép, `server.js:537-551`) | ✘ | **✔ → `canceled`** (200, TC-API2-001) |
| `confirmed`    | ✘ (tự-chuyển, không áp dụng) | ✔ → `shipping` (route admin) | ✘ (bỏ qua `confirmed`, không có luật) | **✔ → `canceled`** (200, TC-API2-017) |
| `shipping`     | ✘ | ✘ (tự-chuyển) | ✔ → `delivered` (route admin) | **✔ → `canceled` theo mã nguồn — nhưng FR-10 cấm User** (200 thực tế / mong đợi 400 hoặc 403 theo đặc tả) — **TC-API2-018, phát hiện chính** |
| `delivered`    | ✘ | ✘ | ✘ (tự-chuyển, trạng thái kết thúc) | ✘ → 400 `{"error":"Cannot cancel this order."}` (TC-API2-019) |
| `canceled`     | ✘ | ✘ | ✔ → `delivered` (route admin — **mâu thuẫn với FR-10 tuyên bố `canceled` là trạng thái kết thúc**, xem P7) | ✘ (lặp lại) → 400 (TC-API2-020) |

### 5.2 Bước 2 — Kiểm toán (rà soát của con người)

| Nhãn       | Số TC | Tỉ lệ |
| ---------- | :---: | :---: |
| VALID      |  «»   |  «»%  |
| INVALID    |  «»   |  «»%  |
| INCOMPLETE |  «»   |  «»%  |

**Chi tiết các test case KHÔNG đạt**

> ✍️ Mỗi dòng phải có lập luận cụ thể — đối chiếu đặc tả hoặc mã nguồn SUT (ghi `file:line`).
> **Điểm khởi đầu đã biết:** 11 TC đã được đánh dấu "cần rà soát thủ công" ở §5.1 — đây là ứng viên INCOMPLETE rõ ràng nhất, vì expected result còn ở dạng tạm (`⚠️ chưa xác nhận`).

| ID     | Nhãn       | AI viết gì               | Vì sao sai / thiếu (dẫn chứng)              | Tôi sửa thành           |
| ------ | ---------- | ------------------------ | ------------------------------------------- | ----------------------- |
| TC-API2-003 | «INCOMPLETE» | «expected chưa xác định» | «AI không suy được hành vi type-affinity của SQLite từ mã nguồn» | «chốt sau khi probe» |
| TC-API2-022 | «»         | «»                       | «cần sửa DB trực tiếp — không tới được qua API» | «»                   |
| TC-API2-0xx | «»         | «»                       | «»                                          | «»                      |

**Nhận xét kiểm toán.** «2–5 câu: AI mắc lỗi theo mẫu nào, tập trung ở nhóm kỹ thuật nào?»

### 5.3 Bước 3 — Mở rộng (≥ 5 test case tự nghĩ)

> ✍️ Đề §6.3 yêu cầu ≥ 5 TC **tự nghĩ** mà AI bỏ sót, đặc biệt quanh bảo mật và chuyển trạng thái.
> **Gợi ý đã có sẵn từ phân tích:** khoảng trống **đồng thời (concurrency)** — AI hẹn ở P5, bỏ ở P7, không lên lịch ở P10, không sinh ở P11 (xem AI Audit Report, Artifact #7/#12). Đây là ứng viên số 1 cho `A2-E01`.

| ID     | Tiêu đề | Kỹ thuật / SEC | Input | Expected | **Vì sao AI bỏ sót**                                                      |
| ------ | ------- | -------------- | ----- | -------- | ------------------------------------------------------------------------- |
| A2-E01 | «Hủy đơn đồng thời với chuyển trạng thái của admin» | «state / race» | «» | «» | «hạn chế mô hình: AI hẹn ở P5 rồi tự đánh rơi qua 3 phase — xem Audit #7» |
| A2-E02 | «»      | «state»        | «»    | «»       | «chất lượng prompt: chưa nêu …»                                           |
| A2-E03 | «»      | «SEC-0x»       | «»    | «»       | «đặc điểm riêng của API: …»                                               |
| A2-E04 | «»      | «»             | «»    | «»       | «»                                                                        |
| A2-E05 | «»      | «»             | «»    | «»       | «»                                                                        |

| Nguyên nhân bỏ sót     | Số TC | Diễn giải |
| ---------------------- | :---: | --------- |
| Chất lượng prompt      |  «»   | «»        |
| Hạn chế của mô hình    |  «»   | «»        |
| Đặc điểm riêng của API |  «»   | «»        |

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

| ID     | Assertion fail | Actual | Expected | Là bug SUT hay lỗi test?   |
| ------ | -------------- | ------ | -------- | -------------------------- |
| TC-API2-018 | «status 200, kỳ vọng từ chối» | «200» | «400/403 theo FR-10» | «BUG-0x — hủy đơn `shipping` bằng token user» |
| TC-API2-0xx | «»             | «»     | «»       | «»                         |

### 5.5 Bước 5 — Lỗi phát hiện được

| ID     | Tiêu đề | Mức độ | TC phát hiện | AI có sinh TC này không? | GitHub Issue |
| ------ | ------- | ------ | ------------ | ------------------------ | ------------ |
| BUG-0x | «User tự hủy được đơn đang `shipping` — trái FR-10» | «High» | «TC-API2-018» | «Có — AI sinh» | «URL» |
| BUG-0x | «Route admin cho phép `canceled → delivered`, trái quy tắc trạng thái kết thúc» | «Medium» | «TC-API2-024» | «Có — AI sinh» | «URL» |

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

| Thuộc tính   | Giá trị                                   |
| ------------ | ----------------------------------------- |
| Endpoint     | `POST /api/admin/coupons` (dọn dữ liệu bằng `DELETE /api/admin/coupons/:id`) |
| Pool / FR    | C / FR-17 — Quản lý mã giảm giá            |
| Auth         | Bearer JWT (**đặc tả yêu cầu admin**) — nhưng mã nguồn chỉ gọi `authenticateToken`, **không kiểm tra `role`** (`server.js:457,483`) |
| Request body | `code` (string, unique), `type` (string, đặc tả: `percent`/`fixed`), `discount_value` (int, đặc tả `>0`), `min_order_amount` (int, đặc tả `>=0`), `expired_at` (string ngày), `max_uses_per_user` (int, đặc tả `>=1`) — theo `api_specification.md §6.4` |
| Response 2xx | `200` — `{"message":"Coupon created","id":<int>}` (không đặc tả; suy từ `server.js:478`) — **là API duy nhất trong 3 API trả về `id` động** |
| Mã lỗi       | `401` `{"error":"Unauthorized"}` · `403` `{"error":"Forbidden"}` · `500` `{"error":"<sqlite message>"}` (kể cả trùng `code`) — **không có 400/409** dù nhiều ràng buộc đặc tả bị vi phạm |
| Yêu cầu SEC  | **SEC-03 (VI PHẠM — endpoint chính là đối tượng của SEC-03: không kiểm tra `role='admin'` trong Token)** · SEC-02 (JWT hợp lệ — có) · SEC-05 (parameterized query — đạt) · SEC-04 (không thể kiểm chứng đầy đủ ở tầng API) |

### 6.1 Bước 1 — Sinh test case bằng AI

**Mục tiêu ≥ 35 test case.** Số thực tế AI sinh: **44**.

| Nhóm kỹ thuật          | Số TC | Ghi chú |
| ---------------------- | :---: | ------- |
| Phân vùng miền giá trị |  14   | 6 trường (`code`,`type`,`discount_value`,`min_order_amount`,`expired_at`,`max_uses_per_user`) — thiếu/rỗng/sai kiểu/trùng `code` |
| Giá trị biên           |  10   | `discount_value` (0/1), `min_order_amount` (-1/0), `max_uses_per_user` (0 số/`"0"` chuỗi/1/-5), header 2-khoảng-trắng |
| Chuyển trạng thái      |   3   | Vòng đời tồn tại của coupon (P7): tạo → xoá → tạo lại cùng `code` |
| **Bảo mật (SEC-01…07)**| **8** | **User thường tạo/xoá coupon, đọc `GET /api/coupons` không lọc — SEC-03 vi phạm**, SQLi, chuỗi lạm dụng nghiệp vụ |
| Kiểm tra schema        |   6   | Response 2xx (kèm `id`), 401/403/500, xác nhận không có 400/409/404 |
| Quy tắc nghiệp vụ khác |   4   | Bất đối xứng ép kiểu `max_uses_per_user`, `is_active` không thể set qua API, chuỗi tạo→xoá→verify, `type` ngoài enum bị diễn giải thành `fixed` |
| **Tổng**               |  44   | ≥ 35 theo yêu cầu đề bài |

**Tiền điều kiện chung cho mọi TC của API 3.** DB vừa seed lại → 4 coupon mẫu tồn tại: `SAVE10`(id 1), `BIGBUY`(id 2), `VIP100`(id 3), `EXPIRED`(id 4); coupon mới tạo bắt đầu từ **id 5**. `{{tokenAdmin}}` = `admin@eshop.com`/`Admin123!`; `{{tokenUser}}` = `test@eshop.com`/`Test1234!`. **Quy tắc dọn dữ liệu mặc định:** mọi TC tạo coupon thành công đều phải `DELETE /api/admin/coupons/{{id}}` ở bước teardown (dùng `{{tokenAdmin}}`), trừ TC mà mục đích chính là kiểm chính cơ chế xoá/trùng mã. Body chuẩn 6 trường dùng lại xuyên suốt: `{"code":…,"type":"percent","discount_value":10,"min_order_amount":0,"expired_at":"2099-12-31","max_uses_per_user":1}`.

**Bảng test case đầy đủ — 44 TC** _(ID `TC-API3-001`…`TC-API3-044`)_

| ID     | Tiêu đề | Kỹ thuật | Truy vết (Coverage / FR / SEC) | Input / Precondition riêng | Expected (status + body) | Nguồn |
| ------ | ------- | -------- | ------------------- | ------------ | ------------------------ | ----- |
| TC-API3-001 | Tạo coupon hợp lệ (happy path) | EP | COV-055,001,011,018,027,034,042 · FR-17 | `code:"TESTNEW01"`, 6 trường hợp lệ, token admin | 200 · `{"message":"Coupon created","id":<int>}` | AI |
| TC-API3-002 | Thiếu `code` | EP | COV-002 · FR-17 (bắt buộc, không thực thi) | Body bỏ key `code` | 200 — không có presence check | AI |
| TC-API3-003 | `code` rỗng | EP | COV-003 | `code:""` | 200 — không có non-empty check | AI |
| TC-API3-004 | Trùng `code` với coupon đã seed | EP + BR | COV-005,061 · FR-17 (**unique — được thực thi**) | `code:"SAVE10"` | 500 · `{"error":"<sqlite UNIQUE text>"}` — không tạo dòng mới | AI |
| TC-API3-005 | Thiếu `type` | EP | COV-013 · FR-17 | Body bỏ key `type` | 200; `GET` cho thấy `type` **không** rơi về `'percent'` (DEFAULT bất hoạt) | AI |
| TC-API3-006 | `type` ngoài enum | EP | COV-016 · FR-17 (enum không thực thi) | `type:"installment"` | 200, lưu nguyên văn — không có `CHECK` | AI |
| TC-API3-007 | Thiếu `discount_value` | EP | COV-020 · FR-17 | Body bỏ key `discount_value` | 200 — không có presence check | AI |
| TC-API3-008 | `discount_value` sai kiểu (string) | EP | COV-025 | `discount_value:"10"` | ⚠️ 200 **hoặc** 500 — chưa xác nhận, cần probe | AI |
| TC-API3-009 | Thiếu `min_order_amount` | EP | COV-029 · FR-17 | Body bỏ key `min_order_amount` | 200 — `DEFAULT 0` cũng bất hoạt | AI |
| TC-API3-010 | Thiếu `expired_at` | EP | COV-036 · FR-17 | Body bỏ key `expired_at` | 200 — không có presence check | AI |
| TC-API3-011 | `expired_at` là ngày quá khứ | EP + BR | COV-035,060 | `expired_at:"2020-01-01"` | 200 — giống hệt coupon `EXPIRED` được seed sẵn | AI |
| TC-API3-012 | `expired_at` sai định dạng | EP | COV-039 | `expired_at:"not-a-date"` | 200 — không validate định dạng ngày lúc tạo | AI |
| TC-API3-013 | Thiếu `max_uses_per_user` → ép thành 1 | EP | COV-043 · FR-17 | Body bỏ key `max_uses_per_user` | 200; `GET` cho thấy lưu đúng `1` (`\|\| 1`) | AI |
| TC-API3-014 | Gửi kèm `is_active` — bị bỏ qua | EP | COV-059,096 | `{...,"is_active":0}` | 200; `GET` cho thấy `is_active` = `1`, **không** phải `0` | AI |
| TC-API3-015 | `discount_value = 0` (biên min−1 của `>0`) | BVA | COV-022 · FR-17 | `discount_value:0` | 200 (kỳ vọng đặc tả: từ chối) | AI |
| TC-API3-016 | `discount_value = 1` (biên min) | BVA | COV-018 · FR-17 | `discount_value:1` | 200 · hợp lệ theo cả 2 nguồn | AI |
| TC-API3-017 | `min_order_amount = -1` (biên min−1) | BVA | COV-031 · FR-17 (`>=0`) | `min_order_amount:-1` | 200 (kỳ vọng đặc tả: từ chối) | AI |
| TC-API3-018 | `min_order_amount = 0` (biên min, **bao gồm**) | BVA | COV-027 · FR-17 | `min_order_amount:0` | 200 · hợp lệ — lưu ý biên này *bao gồm*, khác `discount_value` | AI |
| TC-API3-019 | `max_uses_per_user = 0` (số) → **bị ép thành 1** | BVA | COV-044 · FR-17 (`>=1`) | `max_uses_per_user:0` | 200; `GET` cho thấy **`1`, không phải `0`** | AI |
| TC-API3-020 | `max_uses_per_user = "0"` (chuỗi) → **KHÔNG bị ép** | BVA | COV-048 · FR-17 | `max_uses_per_user:"0"` | 200; `GET` cho thấy lưu đúng chuỗi `"0"` — **đối lập TC-019** | AI |
| TC-API3-021 | `max_uses_per_user = 1` (biên min) | BVA | COV-042 · FR-17 | `max_uses_per_user:1` | 200 · hợp lệ, không bị biến đổi | AI |
| TC-API3-022 | `max_uses_per_user = -5` → **KHÔNG bị ép** | BVA | COV-045 · FR-17 | `max_uses_per_user:-5` | 200; lưu đúng `-5` — số âm là truthy nên `\|\|` không can thiệp | AI |
| TC-API3-023 | `discount_value` cực lớn | BVA | COV-026 | `discount_value:999999999` | 200 — không có chặn trên nào | AI |
| TC-API3-024 | Header `Authorization` có 2 dấu cách | BVA | (biên P6 — middleware dùng chung) | `Authorization: Bearer  {{tokenAdmin}}` | 403 · `{"error":"Forbidden"}` | AI |
| TC-API3-025 | Tạo lại coupon với `code` đã bị xoá | ST | COV-062 · P7 (vòng đời tồn tại) | B1 tạo `RECREATE01` → B2 xoá → B3 tạo lại cùng `code` | 200 với **id mới** — `AUTOINCREMENT` không tái dùng id cũ | AI |
| TC-API3-026 | Trùng `code` khi coupon vẫn còn tồn tại | ST | COV-005,061 | `DUPTEST01` đang tồn tại, tạo lại với các trường khác nhau | 500 — chỉ `code` quyết định việc từ chối | AI |
| TC-API3-027 | Xoá coupon đã bị xoá (idempotent âm thầm) | ST | COV-098 | Tạo → xoá → gọi `DELETE` lần 2 cùng id | 200 · `{"message":"Coupon deleted"}` — **giống hệt** lần xoá thật | AI |
| TC-API3-028 | Không gửi header `Authorization` | Security | COV-064 · SEC-02 | (bỏ header) | 401 · `{"error":"Unauthorized"}` | AI |
| TC-API3-029 | **[CRITICAL]** User thường tạo được coupon | Security | COV-073 · **SEC-03**, FR-12, FR-17 | `{{tokenUser}}` (`role="user"`), 6 trường hợp lệ | 200 — **vi phạm trực tiếp SEC-03** | AI |
| TC-API3-030 | User thường **xoá** được coupon | Security | COV-074 · SEC-03 | `{{tokenUser}}`, xoá coupon do admin tạo | 200 · `{"message":"Coupon deleted"}` | AI |
| TC-API3-031 | User thường đọc được `GET /api/coupons` không lọc | Security | COV-075 · SEC-03 (§5.2 ghi "Dành cho Admin") | `{{tokenUser}}`, GET `/api/coupons` | 200 · danh sách đầy đủ y hệt admin | AI |
| TC-API3-032 | Token giả mạo claim `role:"admin"` | Security | COV-076 · SEC-02 | Token tự ký `{id:1,role:"admin"}` | 200 — nhưng theo TC-029, giả mạo thậm chí **không cần thiết** | AI |
| TC-API3-033 | Payload SQL injection trong `code` | Security | COV-010 · SEC-05 | `code:"'; DROP TABLE coupons;--"` | 200 · lưu literal, bảng `coupons` còn nguyên | AI |
| TC-API3-034 | Chuỗi lạm dụng: user thường tạo coupon giá trị cực lớn | Security + BR | COV-084 · SEC-03 + FR-17 | `{{tokenUser}}`, `discount_value:999999999`, `min_order_amount:0`, `max_uses_per_user:999999999` | 200 · lưu đúng mọi giá trị cực lớn | AI |
| TC-API3-035 | JWT sai cú pháp | Security | COV-068 · SEC-02 | `Bearer not-a-jwt` | 403 · `{"error":"Forbidden"}` | AI |
| TC-API3-036 | Schema response `POST` thành công | Schema | COV-085 | 6 trường hợp lệ, token admin | 200 · đúng 2 key `message` + `id` (int dương) | AI |
| TC-API3-037 | Schema response `DELETE` thành công | Schema | COV-086 | Coupon tồn tại, token admin | 200 · đúng 1 key `message` = `"Coupon deleted"` | AI |
| TC-API3-038 | Schema lỗi 401 | Schema | COV-087 | (bỏ header) | 401 · đúng 1 key `error` = `"Unauthorized"` | AI |
| TC-API3-039 | Schema lỗi 500 khi trùng `code` — lộ text driver | Schema | COV-089 | `code:"SCHEMA03"` đã tồn tại | 500 · `error` chứa nguyên văn thông báo UNIQUE của SQLite | AI |
| TC-API3-040 | Xác nhận **không** tồn tại đường 400/409 | Schema | COV-090 | Tổng hợp TC-002,003,006,008,015,017,019,022,023 | Không TC nào trả 400/409 — không có validation tầng ứng dụng | AI |
| TC-API3-041 | `DELETE` id không tồn tại → 200, **không** 404 | Schema | COV-091 | `DELETE /api/admin/coupons/999999` | 200 · body giống hệt lần xoá thật (`this.changes` không kiểm) | AI |
| TC-API3-042 | Bất đối xứng ép kiểu `max_uses_per_user` | Quy tắc nghiệp vụ | COV-095 · FR-17 | Đối chiếu kết quả TC-019 / TC-020 / TC-022 | Lưu lần lượt `1` / `"0"` / `-5` — 3 input "không hợp lệ" cho 3 hành vi khác nhau | AI |
| TC-API3-043 | `is_active` luôn = 1 với mọi coupon do suite tạo | Quy tắc nghiệp vụ | COV-096 | GET `/api/coupons` cuối suite | Không coupon nào của suite có `is_active = 0` | AI |
| TC-API3-044 | Chuỗi dọn dữ liệu: tạo → xoá → verify | Schema + ST | COV-092,097 | POST → DELETE bằng `id` trả về → GET `/api/coupons` | GET **không** còn `code:"CLEANUPTEST01"` — xác thực cơ chế teardown của cả suite | AI |
> **5 TC cần rà soát thủ công:** `TC-API3-008` (bind kiểu sai chưa xác nhận) · `-020` (biên truthy `"0"` — phát hiện quan trọng nhất API này, nên xác nhận kỹ) · `-024` (suy luận nhánh code) · `-032` (cần tự ký JWT) · `-042` (là bước tổng hợp kết quả, không phải một request độc lập).

### 6.2 Bước 2 — Kiểm toán (rà soát của con người)

| Nhãn       | Số TC | Tỉ lệ |
| ---------- | :---: | :---: |
| VALID      |  «»   |  «»%  |
| INVALID    |  «»   |  «»%  |
| INCOMPLETE |  «»   |  «»%  |

**Chi tiết các test case KHÔNG đạt**

> ✍️ **Điểm khởi đầu đã biết:** 5 TC đã đánh dấu "cần rà soát thủ công" ở §6.1. Ngoài ra, nhóm cross-field (`type:"percent"` + `discount_value > 100`) **hoàn toàn không được AI sinh** — xem §6.3.

| ID     | Nhãn       | AI viết gì               | Vì sao sai / thiếu (dẫn chứng)              | Tôi sửa thành           |
| ------ | ---------- | ------------------------ | ------------------------------------------- | ----------------------- |
| TC-API3-008 | «INCOMPLETE» | «expected chưa xác định» | «AI không suy được hành vi bind kiểu của sqlite3» | «chốt sau khi probe» |
| TC-API3-042 | «INCOMPLETE» | «TC tổng hợp, không phải request» | «không thực thi được trực tiếp trong Postman» | «chuyển thành assertion hậu-suite» |
| TC-API3-0xx | «»         | «»                       | «»                                          | «»                      |

**Nhận xét kiểm toán.** «2–5 câu: AI mắc lỗi theo mẫu nào, tập trung ở nhóm kỹ thuật nào?»

### 6.3 Bước 3 — Mở rộng (≥ 5 test case tự nghĩ)

> ✍️ **Gợi ý đã có sẵn từ phân tích:** AI **không sinh** TC cho biên chéo `type:"percent"` + `discount_value > 100`, với lý do "không có tài liệu nào quy định trần 100 %". Lập luận đó đúng về mặt BVA, nhưng để trống hẳn một nhóm mà đề §6 yêu cầu → ứng viên số 1 cho `A3-E01`.

| ID     | Tiêu đề | Kỹ thuật / SEC | Input | Expected | **Vì sao AI bỏ sót**                                                      |
| ------ | ------- | -------------- | ----- | -------- | ------------------------------------------------------------------------- |
| A3-E01 | «Coupon `percent` với `discount_value = 101` (vượt trần khái niệm 100 %)» | «BVA chéo trường» | «`type:"percent"`, `discount_value:101`» | «» | «hạn chế mô hình: AI từ chối sinh vì không có trần nào được đặc tả — đúng luật BVA nhưng bỏ trống nhóm đề yêu cầu» |
| A3-E02 | «»      | «SEC-03»       | «»    | «»       | «chất lượng prompt: chưa nêu …»                                           |
| A3-E03 | «»      | «»             | «»    | «»       | «đặc điểm riêng của API: …»                                               |
| A3-E04 | «»      | «»             | «»    | «»       | «»                                                                        |
| A3-E05 | «»      | «»             | «»    | «»       | «»                                                                        |

| Nguyên nhân bỏ sót     | Số TC | Diễn giải |
| ---------------------- | :---: | --------- |
| Chất lượng prompt      |  «»   | «»        |
| Hạn chế của mô hình    |  «»   | «»        |
| Đặc điểm riêng của API |  «»   | «»        |

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

| ID     | Assertion fail | Actual | Expected | Là bug SUT hay lỗi test?   |
| ------ | -------------- | ------ | -------- | -------------------------- |
| TC-API3-029 | «status 200, kỳ vọng 403» | «200» | «403 theo SEC-03/FR-12» | «BUG-0x — user thường tạo được coupon» |
| TC-API3-0xx | «»             | «»     | «»       | «»                         |

### 6.5 Bước 5 — Lỗi phát hiện được

| ID     | Tiêu đề | Mức độ | TC phát hiện | AI có sinh TC này không? | GitHub Issue |
| ------ | ------- | ------ | ------------ | ------------------------ | ------------ |
| BUG-0x | «User thường tạo/xoá/đọc được coupon — vi phạm SEC-03» | «Critical» | «TC-API3-029, -030, -031» | «Có — AI sinh» | «URL» |
| BUG-0x | «Trùng `code` trả 500 kèm nguyên văn thông báo SQLite» | «Low» | «TC-API3-039» | «Có — AI sinh» | «URL» |

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

| Mã     | Yêu cầu (theo `README.md §9`) | TC của API 1 | API 2 | API 3 | Kết quả |
| ------ | ------------------------------------- | ------------ | ----- | ----- | ------- |
| SEC-01 | Mật khẩu không lưu plaintext          | TC-API1-038 (endpoint hỗ trợ `GET`) | Không áp dụng | Không áp dụng | «pending» |
| SEC-02 | API bảo mật phải yêu cầu JWT hợp lệ    | TC-API1-023…027 | TC-API2-025…031 | TC-API3-028,032,035 | «pending» |
| SEC-03 | API Admin phải kiểm `role='admin'` trong Token | Không áp dụng trực tiếp (không phải admin API) | Không áp dụng trực tiếp (không phải admin route) | **TC-API3-029,030,031 — vi phạm** | «pending» |
| SEC-04 | Escape dữ liệu user khi hiển thị UI    | TC-API1-032 (chỉ kiểm lưu/phản hồi, không kiểm UI) | Không áp dụng (endpoint không lưu chuỗi user) | Chưa có TC riêng (xem P8: mơ hồ) | «pending» |
| SEC-05 | Parameterized query, không nối chuỗi  | TC-API1-031 | TC-API2-035 | TC-API3-033 | «pending» |
| SEC-06 | API cập nhật hồ sơ không cho đổi `role` | **TC-API1-029 — vi phạm** | Không áp dụng | Không áp dụng | «pending» |
| SEC-07 | OTP đủ entropy, có hạn, vô hiệu sau dùng | Không áp dụng (endpoint không liên quan OTP) | Không áp dụng | Không áp dụng | «pending» |

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
