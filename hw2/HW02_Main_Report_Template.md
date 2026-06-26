# HW02 — Domain Testing on EShop — Báo cáo chính

## 0. Thông tin sinh viên

| Trường              | Giá trị                     |
| ------------------- | --------------------------- |
| Họ tên              | Trương Thành Đạt            |
| MSSV                | 23217344                    |
| Lớp / Nhóm          | Kiểm thử phần mềm - 23KTPM3 |
| Assignment          | HW02 — Domain Testing       |
| Ngày nộp            | 29/06/2026                  |
| Self-Assessed Grade | 100                         |
| GitHub repo (nhóm)  | `<link>`                    |
| GitHub Issues       | `<link>`                    |

---

## 1. Feature đã chọn

<!-- Mỗi sinh viên chọn 4 feature: 1 từ mỗi pool A/B/C/D, không trùng thành viên khác. -->

| Ký hiệu   | Pool       | FR ID | Tên feature                 | Module (cho mã TC) |
| --------- | ---------- | ----- | --------------------------- | ------------------ |
| Feature A | A          | FR-04 | Personal profile management | `PROFILE`          |
| Feature B | B          | FR-08 | Checkout                    | `CHECKOUT`         |
| Feature C | C          | FR-18 | Order management (admin)    | `ADMIN_ORDER`      |
| Feature D | D (Mobile) | D3    | Mobile – Registration       | `MOB_REG`          |

> **Quy ước mã test case (thống nhất toàn bài):** `TC-<MODULE>-<NNN>`.
> Domain Testing dùng số `001…099`; BVA dùng số `101…199` (để không trùng).
> Ví dụ: `TC-PROFILE-001` (Domain), `TC-PROFILE-101` (BVA).

---

<!-- ============ KHỐI LẶP CHO MỖI FEATURE ============ -->

# Feature A — FR-04: Personal profile management

## A.0 Mô tả & nguồn tham chiếu

- **Chức năng:** Cập nhật hồ sơ cá nhân của người dùng đang đăng nhập (họ tên, địa chỉ giao hàng, số điện thoại). Yêu cầu xác thực bằng JWT.
- **Endpoint / màn hình liên quan:**
  - `GET /api/users/me` — lấy hồ sơ hiện tại.
  - `PUT /api/users/me` — cập nhật hồ sơ. Body: `{ name, shipping_address, phone }`.
  - Màn hình: trang "Hồ sơ cá nhân" trên frontend-web; tab Profile trên frontend-mobile.
- **Nguồn đã đọc để xác định input/ràng buộc:**
  - [api_specification.md §2.2](../../group05_eshop/api_specification.md) — body cập nhật hồ sơ.
  - [backend/server.js:118-135](../../group05_eshop/backend/server.js#L118-L135) — handler `PUT /api/users/me`: **không có validation phía server**; ngoài 3 trường công khai còn nhận thêm trường `role` → cập nhật quyền nếu được truyền.
  - [backend/database.js:50-61](../../group05_eshop/backend/database.js#L50-L61) — schema bảng `users` (các cột TEXT, không ràng buộc độ dài/format).
  - [frontend-mobile/App.js:287](../../group05_eshop/frontend-mobile/App.js#L287) — ràng buộc phía client cho `phone`: regex `^[1-9][0-9]{8,9}$` (9–10 chữ số, không bắt đầu bằng 0).
- **Môi trường test:** `<browser/OS | build commit>` — điền sau khi chạy SUT local.

> ⚠️ **Cảnh báo bảo mật (đã thấy trong code):** `PUT /api/users/me` chấp nhận trường `role` từ body và ghi thẳng vào DB → **lỗ hổng leo thang đặc quyền (privilege escalation / authorization bypass)**. Đây là điểm cần thiết kế test case bảo mật riêng (xem A.1.2 lớp EC-role).

## A.1 Domain Testing (Equivalence Class Partitioning)

> Kỹ thuật: ISTQB FL §4.2.1 — Equivalence Partitioning. Mỗi lớp 1 đại diện; phủ cả valid lẫn invalid; single-fault assumption.

### A.1.1 Các bước áp dụng (step-by-step)

1. **Liệt kê biến đầu vào:** `name` (họ tên), `phone` (số điện thoại), `shipping_address` (địa chỉ giao hàng), `role` (trường bảo mật ẩn — API nhận nhưng không được phép người dùng thường gửi), và JWT `token` (biến xác thực).

2. **Xác định miền & ràng buộc từng biến (từ code thực tế):**
   - `name`: chuỗi text; trường HTML có `required`; **server (server.js:118-135) không validate** → gửi rỗng/whitespace qua API trực tiếp vẫn được chấp nhận.
   - `phone`: client (cả `frontend-web/src/pages/Profile.jsx:43` lẫn `frontend-mobile/App.js:287`) validate regex `^[1-9][0-9]{8,9}$` (9–10 chữ số, **không bắt đầu bằng 0**); **server không kiểm tra** → bypass qua Postman/curl bỏ qua validation. Lưu ý: số điện thoại VN thực tế bắt đầu bằng 0 (vd: `0912345678`) nhưng regex này từ chối → **nghi vấn design bug**.
   - `shipping_address`: text tự do; không có ràng buộc phía client hay server.
   - `role`: KHÔNG được phép người dùng thường gán; server tại `server.js:124` chỉ kiểm tra `if (role) { ... }` → **privilege escalation bug** (BUG đã xác nhận trong code).
   - JWT `token`: phải hợp lệ; `authenticateToken` middleware tại `server.js:100-110` kiểm tra.

3. **Phát hiện thêm khi đọc code (ảnh hưởng đến oracle):**
   - `frontend-web/src/App.jsx:27`: `dangerouslySetInnerHTML={{ __html: \`Chào, ${user.name}\` }}` → **Stored XSS** nếu `name` chứa HTML/script tag.
   - `frontend-mobile/App.js:302`: mobile gửi `{ name, phone, shippingAddress }` (camelCase) nhưng server đọc `shipping_address` (snake_case) → **địa chỉ không bao giờ được lưu qua mobile app** (silent bug).

4. **Phân vùng tương đương (valid/invalid):** xem bảng A.1.2 — 17 lớp tương đương.

5. **Chọn đại diện mỗi lớp:** mỗi lớp 1 giá trị điển hình, **không phải giá trị biên** (biên xử lý ở A.2 BVA).

6. **Thiết kế test case (single-fault assumption):** mỗi invalid class → 1 TC riêng; các biến còn lại giữ giá trị valid; test qua **Postman (direct API)** để bypass client validation và kiểm tra server-side behavior thực sự.

### A.1.2 Bảng phân tích Equivalence Classes

| Biến               | Lớp (EC)    | Loại             | Mô tả lớp                                                   | Giá trị đại diện                  |
| ------------------ | ----------- | ---------------- | ----------------------------------------------------------- | --------------------------------- |
| `name`             | EC-NAME-1   | Valid            | Chuỗi không rỗng, có ít nhất 1 ký tự non-whitespace        | `Nguyen Van A`                    |
| `name`             | EC-NAME-2   | Invalid          | Chuỗi rỗng `""`                                            | `""`                              |
| `name`             | EC-NAME-3   | Invalid          | Chuỗi chỉ gồm khoảng trắng                                  | `"   "`                           |
| `name`             | EC-NAME-4   | Invalid/Security | XSS payload — kỳ vọng sanitize; thực tế là Stored XSS      | `<script>alert('XSS')</script>`   |
| `phone`            | EC-PHONE-1  | Valid            | 9–10 chữ số, ký tự đầu từ 1–9 (đúng regex client)          | `912345678`                       |
| `phone`            | EC-PHONE-2  | Invalid          | Chứa ký tự không phải số                                    | `09abc12345`                      |
| `phone`            | EC-PHONE-3  | Invalid          | Bắt đầu bằng 0 (vi phạm regex client; nhưng đây là số VN thật) | `0912345678`                  |
| `phone`            | EC-PHONE-4  | Invalid          | Quá ngắn — < 9 chữ số (dùng giá trị điển hình, không phải biên) | `91234` (5 số)               |
| `phone`            | EC-PHONE-5  | Invalid          | Quá dài — > 10 chữ số (dùng giá trị điển hình, không phải biên) | `91234567890123` (14 số)     |
| `phone`            | EC-PHONE-6  | Invalid          | Rỗng `""` — phone không được cung cấp                       | `""`                              |
| `shipping_address` | EC-ADDR-1   | Valid            | Địa chỉ không rỗng, text tự do                              | `123 Le Loi, Q1, TP.HCM`         |
| `shipping_address` | EC-ADDR-2   | Invalid          | Rỗng `""`                                                  | `""`                              |
| `shipping_address` | EC-ADDR-3   | Invalid/Security | XSS payload — Stored XSS khi địa chỉ được render            | `<img src=x onerror=alert(1)>`    |
| `role`             | EC-ROLE-1   | Invalid/Security | User thường gửi `role=admin` để leo thang quyền             | `admin`                           |
| JWT `token`        | EC-AUTH-1   | Valid            | Token hợp lệ từ `POST /api/login`                           | JWT trả về sau khi login thành công |
| JWT `token`        | EC-AUTH-2   | Invalid          | Thiếu Authorization header                                  | *(không gửi header)*              |
| JWT `token`        | EC-AUTH-3   | Invalid          | Token sai định dạng / giả mạo                               | `Bearer invalid_token_xyz`        |

> *Ghi chú EC-PHONE-3:* regex client `^[1-9][0-9]{8,9}$` từ chối `0912345678` — đây là số VN hợp lệ → **design bug trong regex** (cần ghi vào Bugs section). Mục tiêu của TC-PROFILE-006 là xác nhận server có chấp nhận số này không khi bypass client.

### A.1.3 Test cases — Domain Testing

<!-- Technique: Domain Testing (Equivalence Partitioning). Mỗi invalid class 1 TC riêng. Test via Postman (direct API) trừ khi ghi rõ "qua Web". Status điền sau khi chạy SUT. -->

| TC ID          | Phủ EC                                      | Preconditions                              | Test data (Body JSON)                                                                                              | Các bước (tóm tắt)                                                                             | Expected result                                                                                          | Status  |
| -------------- | ------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------- |
| TC-PROFILE-001 | EC-NAME-1, EC-PHONE-1, EC-ADDR-1, EC-AUTH-1 | Đã đăng nhập (user: `test@eshop.com`)      | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"123 Le Loi, Q1, TP.HCM"}`                          | POST /api/login lấy token → PUT /api/users/me với toàn bộ trường hợp lệ → GET /api/users/me  | 200 `{"message":"Profile updated"}`; GET /me trả về đúng name, phone, address mới                       | Not Run |
| TC-PROFILE-002 | EC-NAME-2                                   | Đã đăng nhập (user thường)                 | `{"name":"","phone":"912345678","shipping_address":"123 Le Loi, Q1, TP.HCM"}`                                      | PUT /api/users/me qua Postman (bypass HTML required)                                           | **Kỳ vọng:** 400, báo lỗi tên bắt buộc. **Thực tế (dự đoán bug):** 200, lưu tên rỗng vào DB             | Not Run |
| TC-PROFILE-003 | EC-NAME-3                                   | Đã đăng nhập (user thường)                 | `{"name":"   ","phone":"912345678","shipping_address":"123 Le Loi, Q1, TP.HCM"}`                                   | PUT /api/users/me qua Postman với tên chỉ có khoảng trắng                                      | **Kỳ vọng:** 400, báo lỗi tên không hợp lệ. **Thực tế (dự đoán bug):** 200, lưu `"   "` làm tên        | Not Run |
| TC-PROFILE-004 | EC-NAME-4                                   | Đã đăng nhập (user thường)                 | `{"name":"<script>alert('XSS')</script>","phone":"912345678","shipping_address":"123 Le Loi, Q1, TP.HCM"}`         | PUT /api/users/me → GET /api/users/me → Đăng nhập lại → quan sát navbar Web render `Chào, ...` | **Kỳ vọng:** Server từ chối hoặc sanitize; không execute script. **Thực tế (dự đoán BUG):** Script lưu raw; khi Web render `dangerouslySetInnerHTML` → XSS thực thi | Not Run |
| TC-PROFILE-005 | EC-PHONE-2                                  | Đã đăng nhập (user thường)                 | `{"name":"Nguyen Van A","phone":"09abc12345","shipping_address":"123 Le Loi, Q1, TP.HCM"}`                         | PUT /api/users/me qua Postman (bypass regex client)                                            | **Kỳ vọng:** 400, báo định dạng phone không hợp lệ. **Thực tế (dự đoán bug):** 200, server lưu `09abc12345` vào DB | Not Run |
| TC-PROFILE-006 | EC-PHONE-3                                  | Đã đăng nhập (user thường)                 | `{"name":"Nguyen Van A","phone":"0912345678","shipping_address":"123 Le Loi, Q1, TP.HCM"}`                         | Bước 1: Test qua Web → kỳ vọng alert regex. Bước 2: Test qua Postman → kiểm tra server        | Web: alert "Số điện thoại không hợp lệ". Postman: **Kỳ vọng** 400; **Thực tế (bug đôi):** Server 200 + regex client sai (số VN 0-đầu thật ra là hợp lệ) | Not Run |
| TC-PROFILE-007 | EC-PHONE-4                                  | Đã đăng nhập (user thường)                 | `{"name":"Nguyen Van A","phone":"91234","shipping_address":"123 Le Loi, Q1, TP.HCM"}`                              | PUT /api/users/me qua Postman với phone 5 chữ số                                               | **Kỳ vọng:** 400, phone quá ngắn. **Thực tế (dự đoán bug):** 200, server lưu `91234`                    | Not Run |
| TC-PROFILE-008 | EC-PHONE-5                                  | Đã đăng nhập (user thường)                 | `{"name":"Nguyen Van A","phone":"91234567890123","shipping_address":"123 Le Loi, Q1, TP.HCM"}`                     | PUT /api/users/me qua Postman với phone 14 chữ số                                              | **Kỳ vọng:** 400, phone quá dài. **Thực tế (dự đoán bug):** 200, server lưu số 14 chữ số                | Not Run |
| TC-PROFILE-009 | EC-PHONE-6                                  | Đã đăng nhập (user thường)                 | `{"name":"Nguyen Van A","phone":"","shipping_address":"123 Le Loi, Q1, TP.HCM"}`                                   | PUT /api/users/me qua Postman với phone rỗng                                                   | **Kỳ vọng (nếu phone optional):** 200, lưu phone rỗng. **Kỳ vọng (nếu required):** 400. Thực tế: cần xác minh spec | Not Run |
| TC-PROFILE-010 | EC-ADDR-2                                   | Đã đăng nhập (user thường)                 | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":""}`                                                 | PUT /api/users/me qua Postman với địa chỉ rỗng                                                 | **Kỳ vọng:** 400, địa chỉ bắt buộc. **Thực tế (dự đoán bug):** 200, server lưu địa chỉ rỗng            | Not Run |
| TC-PROFILE-011 | EC-ADDR-3                                   | Đã đăng nhập (user thường)                 | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"<img src=x onerror=alert(1)>"}`                     | PUT /api/users/me → GET /api/users/me → Kiểm tra trang hiển thị địa chỉ trên Web              | **Kỳ vọng:** Server từ chối hoặc sanitize XSS. **Thực tế (dự đoán bug):** Server lưu raw → Stored XSS khi địa chỉ được render | Not Run |
| TC-PROFILE-012 | EC-ROLE-1                                   | Đã đăng nhập (user thường, role=user)      | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"123 Le Loi","role":"admin"}`                        | PUT /api/users/me → GET /api/users/me → kiểm tra trường `role` trong response                 | **Kỳ vọng:** Server bỏ qua trường `role`; GET /me vẫn trả về `role: "user"`. **Thực tế (BUG ĐÃ XÁC NHẬN trong code):** `role` bị đổi thành `admin` → privilege escalation | Not Run |
| TC-PROFILE-013 | EC-AUTH-2                                   | Chưa đăng nhập / không có token            | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"123 Le Loi"}` (không có Authorization header)      | PUT /api/users/me **không có** header `Authorization`                                          | 401 `{"error":"Unauthorized"}`                                                                           | Not Run |
| TC-PROFILE-014 | EC-AUTH-3                                   | Có token giả mạo                           | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"123 Le Loi"}` + `Authorization: Bearer invalid_token_xyz` | PUT /api/users/me với token sai định dạng                                                | 403 `{"error":"Forbidden"}`                                                                              | Not Run |

### A.1.4 Truy vết coverage (EC ↔ TC)

| Lớp (EC)    | Phủ bởi TC     | Ghi chú                                                          |
| ----------- | -------------- | ---------------------------------------------------------------- |
| EC-NAME-1   | TC-PROFILE-001 |                                                                  |
| EC-NAME-2   | TC-PROFILE-002 |                                                                  |
| EC-NAME-3   | TC-PROFILE-003 |                                                                  |
| EC-NAME-4   | TC-PROFILE-004 | Security test — Stored XSS qua dangerouslySetInnerHTML           |
| EC-PHONE-1  | TC-PROFILE-001 |                                                                  |
| EC-PHONE-2  | TC-PROFILE-005 |                                                                  |
| EC-PHONE-3  | TC-PROFILE-006 | Cả Web (client regex) lẫn Postman (server bypass)                |
| EC-PHONE-4  | TC-PROFILE-007 | Giá trị đại diện điển hình (5 số); biên 8 số xử lý ở A.2 BVA    |
| EC-PHONE-5  | TC-PROFILE-008 | Giá trị đại diện điển hình (14 số); biên 11 số xử lý ở A.2 BVA  |
| EC-PHONE-6  | TC-PROFILE-009 |                                                                  |
| EC-ADDR-1   | TC-PROFILE-001 |                                                                  |
| EC-ADDR-2   | TC-PROFILE-010 |                                                                  |
| EC-ADDR-3   | TC-PROFILE-011 | Security test — Stored XSS qua address field                     |
| EC-ROLE-1   | TC-PROFILE-012 | Bug đã xác nhận trong code (server.js:124)                       |
| EC-AUTH-1   | TC-PROFILE-001 | Token hợp lệ là precondition của mọi TC valid                    |
| EC-AUTH-2   | TC-PROFILE-013 |                                                                  |
| EC-AUTH-3   | TC-PROFILE-014 |                                                                  |

## A.2 Boundary Value Analysis

> Kỹ thuật: ISTQB FL §4.2.2 — Boundary Value Analysis. Chiến lược: **3-value**. Chỉ áp dụng cho biến có thứ tự.

### A.2.1 Các bước áp dụng (step-by-step)

1. **Biến áp dụng được BVA:** `độ dài phone` (số chữ số) — biến có thứ tự. (Biến không có thứ tự, không làm BVA: `name`, `shipping_address` nội dung tự do, `role`.)
2. **Xác định biên đóng/mở:** theo regex `^[1-9][0-9]{8,9}$` → độ dài hợp lệ là **[9, 10]** (cả hai biên đóng).
3. **Chiến lược đã chọn & lý do:** 3-value (min-1, min, min+1 và max-1, max, max+1) để bắt cả lỗi off-by-one ở hai đầu.
4. **Lập bảng giá trị biên:** xem A.2.2.
5. **Thiết kế test case (one variable at a time):** chỉ thay đổi độ dài phone; các trường khác giữ hợp lệ.

### A.2.2 Bảng giá trị biên

| Biến           | Biên (đóng/mở) | Điểm  | Giá trị (độ dài → ví dụ) | Kỳ vọng |
| -------------- | -------------- | ----- | ------------------------ | ------- |
| `độ dài phone` | dưới (≥9)      | min-1 | 8 số → `91234567`        | Invalid |
| `độ dài phone` | dưới (≥9)      | min   | 9 số → `912345678`       | Valid   |
| `độ dài phone` | dưới (≥9)      | min+1 | 10 số → `9123456789`     | Valid   |
| `độ dài phone` | trên (≤10)     | max-1 | 9 số → `912345678`       | Valid   |
| `độ dài phone` | trên (≤10)     | max   | 10 số → `9123456789`     | Valid   |
| `độ dài phone` | trên (≤10)     | max+1 | 11 số → `91234567890`    | Invalid |

### A.2.3 Test cases — BVA

<!-- Technique: Boundary Value Analysis (3-value). Mã bắt đầu từ 101. Test data dùng ký tự đầu khác 0 để chỉ kiểm độ dài. -->

| TC ID          | Điểm biên | Preconditions | Test data (phone) | Các bước (tóm tắt)        | Expected result                          | Status  |
| -------------- | --------- | ------------- | ----------------- | ------------------------- | ---------------------------------------- | ------- |
| TC-PROFILE-101 | min-1 (8) | Đã đăng nhập  | `91234567`        | PUT /me với phone 8 số    | Bị từ chối (dưới biên dưới)              | Not Run |
| TC-PROFILE-102 | min (9)   | Đã đăng nhập  | `912345678`       | PUT /me với phone 9 số    | Cập nhật thành công                      | Not Run |
| TC-PROFILE-103 | min+1 (10)| Đã đăng nhập  | `9123456789`      | PUT /me với phone 10 số   | Cập nhật thành công                      | Not Run |
| TC-PROFILE-104 | max+1 (11)| Đã đăng nhập  | `91234567890`     | PUT /me với phone 11 số   | Bị từ chối (trên biên trên)              | Not Run |

### A.2.4 Truy vết coverage (Biên ↔ TC)

| Điểm biên  | Phủ bởi TC     |
| ---------- | -------------- |
| min-1 (8)  | TC-PROFILE-101 |
| min (9)    | TC-PROFILE-102 |
| min+1 (10) | TC-PROFILE-103 |
| max (10)   | TC-PROFILE-103 |
| max+1 (11) | TC-PROFILE-104 |

## A.3 AI Gap Analysis

<!-- Điền sau khi chạy skill + review: AI bỏ sót test case/bug nào? VÌ SAO sót? -->

| #   | Test case / bug AI bỏ sót | Bạn bổ sung gì | Nguyên nhân AI sót              |
| --- | ------------------------- | -------------- | ------------------------------- |
| 1   | `<...>`                   | `<...>`        | `<prompt/AI limit/độ phức tạp>` |

## A.4 Bugs phát hiện (Feature A)

<!-- Ứng viên bug đã xác nhận trong code (không cần execute để thấy). Điền GitHub Issue + Screenshot sau khi execute. -->

| Bug ID   | Found by TC    | Tiêu đề                                                                                          | Severity | GitHub Issue | Screenshot |
| -------- | -------------- | ------------------------------------------------------------------------------------------------ | -------- | ------------ | ---------- |
| BUG-A-01 | TC-PROFILE-012 | Privilege escalation: user thường tự gán `role=admin` qua `PUT /api/users/me` (server.js:124)   | Critical | `<#issue>`   | `<ảnh>`    |
| BUG-A-02 | TC-PROFILE-004 | Stored XSS: `name` chứa HTML/script lưu raw vào DB; navbar Web render qua `dangerouslySetInnerHTML` (App.jsx:27) → script thực thi | High | `<#issue>` | `<ảnh>` |
| BUG-A-03 | TC-PROFILE-002, TC-PROFILE-003, TC-PROFILE-005, TC-PROFILE-007, TC-PROFILE-008, TC-PROFILE-010 | Thiếu validation server-side: `name`, `phone`, `shipping_address` không được validate tại server — bypass qua Postman bỏ qua toàn bộ ràng buộc client | High | `<#issue>` | `<ảnh>` |
| BUG-A-04 | TC-PROFILE-011 | Stored XSS: `shipping_address` chứa XSS payload lưu raw; potential render ở các trang hiển thị địa chỉ | Medium | `<#issue>` | `<ảnh>` |
| BUG-A-05 | TC-PROFILE-006 | Design bug trong regex phone: `^[1-9][0-9]{8,9}$` từ chối số VN hợp lệ bắt đầu bằng 0 (vd `0912345678`) — số VN thật đều bắt đầu bằng 0 | Medium | `<#issue>` | `<ảnh>` |
| BUG-A-06 | *(Mobile test)* | Mobile field name mismatch: `frontend-mobile/App.js:302` gửi `shippingAddress` (camelCase) nhưng server đọc `shipping_address` → address không bao giờ lưu được qua mobile app | Medium | `<#issue>` | `<ảnh>` |

### Kết quả execute Feature A (tóm tắt)

| Chỉ số             | Số lượng |
| ------------------ | -------- |
| Test case thiết kế | 18 (14 Domain + 4 BVA) |
| Đã execute         | `<...>`  |
| Pass               | `<...>`  |
| Fail               | `<...>`  |
| Chưa execute       | `<...>`  |
| Bug tìm được       | `<...>`  |

---

# Feature B — FR-08: Checkout

## B.0 Mô tả & nguồn tham chiếu

- **Chức năng:** Đặt hàng từ giỏ hàng — tạo đơn hàng mới với tổng tiền và địa chỉ giao hàng. Yêu cầu xác thực.
- **Endpoint / màn hình liên quan:** `POST /api/checkout` — body `{ total_amount, shipping_address }`. Liên quan: `POST /api/apply-coupon` (áp mã giảm giá trước khi checkout).
- **Nguồn đã đọc:**
  - [api_specification.md §4.3](../../group05_eshop/api_specification.md) — body checkout.
  - [backend/server.js:297-309](../../group05_eshop/backend/server.js#L297-L309) — handler checkout: **không validate** `total_amount`/`shipping_address`; luôn tạo đơn ở trạng thái `pending`.
  - [backend/server.js:363-441](../../group05_eshop/backend/server.js#L363-L441) — `apply-coupon`: kiểm tra `total_amount > coupon.min_order_amount` (**off-by-one**: lẽ ra `>=`); tính `discount` công thức nghi ngờ sai với `percent`.
- **Môi trường test:** `<điền sau>`.

> ⚠️ **Điểm nghi vấn trong code (ứng viên bug):**
> 1. `apply-coupon` dùng `>` thay vì `>=` ở `min_order_amount` → đơn đúng bằng mức tối thiểu bị từ chối (off-by-one).
> 2. Công thức `percent`: `discount = floor(total * (1 - discount_value))` với `discount_value` là số nguyên (vd 10) → sai hoàn toàn về mặt toán học.

## B.1 Domain Testing — các bước & EC

### B.1.1 Các bước áp dụng

1. **Biến:** `total_amount` (số tiền, INTEGER), `shipping_address` (text); (mở rộng khi test kèm coupon: `code`).
2. **Miền & ràng buộc:** `total_amount` nghiệp vụ phải > 0; `shipping_address` không rỗng.
3. **Phân vùng:** bảng B.1.2.
4. **Đại diện + 5. test case single-fault:** như Feature A.

### B.1.2 Bảng phân tích Equivalence Classes

| Biến               | Lớp (EC)    | Loại    | Mô tả lớp                          | Giá trị đại diện |
| ------------------ | ----------- | ------- | ---------------------------------- | ---------------- |
| `total_amount`     | EC-TOTAL-1  | Valid   | Số nguyên dương                    | `200000`         |
| `total_amount`     | EC-TOTAL-2  | Invalid | Bằng 0                             | `0`              |
| `total_amount`     | EC-TOTAL-3  | Invalid | Âm                                 | `-50000`         |
| `total_amount`     | EC-TOTAL-4  | Invalid | Không phải số / thiếu              | `"abc"` / (bỏ trống) |
| `shipping_address` | EC-SADDR-1  | Valid   | Địa chỉ không rỗng                 | `123 Le Loi`     |
| `shipping_address` | EC-SADDR-2  | Invalid | Rỗng / thiếu                       | `""`             |

### B.1.3 Test cases — Domain Testing

> ⏳ **Thiết kế chi tiết qua skill `domain-testing` rồi điền vào đây** (mã `TC-CHECKOUT-001…`). Sau đó execute để điền Status.

| TC ID           | Phủ EC | Test data | Expected result | Status  |
| --------------- | ------ | --------- | --------------- | ------- |
| TC-CHECKOUT-001 | EC-TOTAL-1, EC-SADDR-1 | `200000` / `123 Le Loi` | 200, tạo đơn `pending` | Not Run |
| `<bổ sung>`     |        |           |                 | Not Run |

## B.2 Boundary Value Analysis

### B.2.1 Biến áp dụng & biên

- **Biến có thứ tự:** `total_amount`. Biên nghiệp vụ giàu giá trị nhất là **ngưỡng `min_order_amount` của coupon** (vd `SAVE10` = 300000) vì có nghi ngờ off-by-one.
- Chiến lược 3-value quanh `min_order_amount = 300000`.

### B.2.2 Bảng giá trị biên (quanh min_order_amount = 300000, mã SAVE10)

| Biến           | Điểm  | Giá trị  | Kỳ vọng đúng (theo spec)            |
| -------------- | ----- | -------- | ----------------------------------- |
| `total_amount` | min-1 | `299999` | Không đủ điều kiện → từ chối mã      |
| `total_amount` | min   | `300000` | **Đủ điều kiện → chấp nhận** (code dùng `>` nên sẽ từ chối → BUG) |
| `total_amount` | min+1 | `300001` | Đủ điều kiện → chấp nhận             |

### B.2.3 Test cases — BVA

> ⏳ Điền qua skill `boundary-value-analysis` (mã `TC-CHECKOUT-101…`).

| TC ID           | Điểm biên | Test data | Expected result | Status  |
| --------------- | --------- | --------- | --------------- | ------- |
| TC-CHECKOUT-101 | min (300000) | total=300000, code=SAVE10 | Chấp nhận mã (dò bug off-by-one) | Not Run |

## B.3 AI Gap Analysis · B.4 Bugs

> Điền tương tự A.3 / A.4 sau khi execute.

---

# Feature C — FR-18: Order management (admin)

## C.0 Mô tả & nguồn tham chiếu

- **Chức năng:** Admin xem danh sách đơn hàng toàn hệ thống và cập nhật trạng thái đơn theo máy trạng thái.
- **Endpoint:** `GET /api/admin/orders`; `PUT /api/admin/orders/:id/status` — body `{ status }`. Trạng thái hợp lệ: `pending, confirmed, shipping, delivered, canceled`.
- **Nguồn đã đọc:**
  - [api_specification.md §6.2](../../group05_eshop/api_specification.md).
  - [backend/server.js:525-568](../../group05_eshop/backend/server.js#L525-L568) — logic chuyển trạng thái.
- **Máy trạng thái hợp lệ (đọc từ code):** `pending → {confirmed, canceled}`, `confirmed → {shipping, canceled}`, `shipping → {delivered}`.
- **Môi trường test:** `<điền sau>`.

> ⚠️ **Điểm nghi vấn (ứng viên bug):**
> 1. [server.js:550-551](../../group05_eshop/backend/server.js#L550-L551) cho phép `canceled → delivered` — chuyển trạng thái **vô lý** (đơn đã hủy lại thành đã giao).
> 2. Route chỉ `authenticateToken`, **không kiểm tra `role === admin`** → user thường cũng đổi được trạng thái đơn (authorization bug).

## C.1 Domain Testing — các bước & EC

### C.1.1 Các bước áp dụng

1. **Biến:** `current_status` (trạng thái hiện tại của đơn), `target_status` (trạng thái muốn chuyển), `order_id`.
2. **Miền:** mỗi biến trạng thái ∈ {pending, confirmed, shipping, delivered, canceled}; `order_id` là số nguyên tồn tại.
3. **Phân vùng theo ma trận chuyển trạng thái hợp lệ/không hợp lệ** (bản chất domain testing trên state machine).

### C.1.2 Bảng phân tích Equivalence Classes (ma trận transition)

| Lớp (EC)        | Loại    | Mô tả (from → to)                     | Đại diện                       |
| --------------- | ------- | ------------------------------------- | ------------------------------ |
| EC-TRANS-1      | Valid   | Chuyển hợp lệ                         | `pending → confirmed`          |
| EC-TRANS-2      | Valid   | Chuyển hợp lệ                         | `confirmed → shipping`         |
| EC-TRANS-3      | Valid   | Chuyển hợp lệ                         | `shipping → delivered`         |
| EC-TRANS-4      | Invalid | Chuyển bị cấm (đúng kỳ vọng)          | `delivered → shipping`         |
| EC-TRANS-5      | Invalid | Chuyển vô lý (nghi BUG cho phép)      | `canceled → delivered`         |
| EC-TARGET-1     | Invalid | Trạng thái đích không thuộc tập hợp lệ | `target = "done"`             |
| EC-ID-1         | Invalid | `order_id` không tồn tại              | `99999`                        |
| EC-AUTH-1       | Invalid | Gọi bằng token user thường (nghi BUG) | role=user                      |

### C.1.3 Test cases — Domain Testing

> ⏳ Điền qua skill `domain-testing` (mã `TC-ADMIN_ORDER-001…`).

| TC ID             | Phủ EC | Preconditions | Test data | Expected result | Status  |
| ----------------- | ------ | ------------- | --------- | --------------- | ------- |
| TC-ADMIN_ORDER-001| EC-TRANS-1 | Đơn ở `pending`, login admin | status=`confirmed` | 200, đơn thành `confirmed` | Not Run |
| `<bổ sung>`       |        |               |           |                 | Not Run |

## C.2 Boundary Value Analysis

### C.2.1 Biến áp dụng

- Trạng thái là biến **không có thứ tự** → BVA cổ điển không áp dụng cho `status`.
- Biến có thứ tự khả dụng: `order_id` (số nguyên). Biên: id nhỏ nhất hợp lệ (1), id=0, id âm, id không tồn tại.

### C.2.2 Bảng giá trị biên (`order_id`)

| Biến       | Điểm  | Giá trị | Kỳ vọng                     |
| ---------- | ----- | ------- | --------------------------- |
| `order_id` | min-1 | `0`     | Invalid / không tìm thấy    |
| `order_id` | min   | `1`     | Valid (nếu đơn tồn tại)     |
| `order_id` | max+1 | `<maxId+1>` | Invalid / không tìm thấy |

### C.2.3 Test cases — BVA

> ⏳ Điền qua skill (mã `TC-ADMIN_ORDER-101…`).

## C.3 AI Gap Analysis · C.4 Bugs

> Điền tương tự sau khi execute.

---

# Feature D (Mobile) — D3: Mobile – Registration

## D.0 Mô tả & nguồn tham chiếu

- **Chức năng:** Đăng ký tài khoản mới trên app mobile (React Native/Expo). Gửi `{ name, email, password }` tới `POST /api/register`.
- **Endpoint / màn hình:** màn hình "Register" trong [frontend-mobile/App.js](../../group05_eshop/frontend-mobile/App.js); API `POST /api/register`.
- **Nguồn đã đọc:**
  - [frontend-mobile/App.js:209-239](../../group05_eshop/frontend-mobile/App.js#L209-L239) — `handleRegister`: chỉ validate **password** bằng regex `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$` (≥8 ký tự, đủ chữ thường/hoa/số/ký tự đặc biệt). `name`, `email` **không validate** phía client.
  - [backend/server.js:20-30](../../group05_eshop/backend/server.js#L20-L30) — `POST /api/register`: **không validate gì**, insert thẳng vào DB.
  - [backend/database.js:50-61](../../group05_eshop/backend/database.js#L50-L61) — cột `email` **không UNIQUE** → cho phép trùng email (nghi BUG).
- **Môi trường test (BẮT BUỘC ghi cho Feature D):** thiết bị/emulator (vd Android emulator Pixel 6, API 34) · OS version · bản build Expo · commit SUT.

> ⚠️ **Điểm nghi vấn (ứng viên bug):** email không UNIQUE ở DB và không kiểm tra trùng ở `/api/register` → đăng ký nhiều tài khoản cùng email. Mật khẩu lưu **plaintext**.

## D.1 Domain Testing — các bước & EC

### D.1.1 Các bước áp dụng

1. **Biến:** `name`, `email`, `password`.
2. **Miền & ràng buộc:** `password` theo regex mạnh ở trên; `email` đúng định dạng email + chưa tồn tại; `name` không rỗng.
3. **Phân vùng:** bảng D.1.2.

### D.1.2 Bảng phân tích Equivalence Classes

| Biến       | Lớp (EC)     | Loại    | Mô tả lớp                                            | Giá trị đại diện      |
| ---------- | ------------ | ------- | ---------------------------------------------------- | --------------------- |
| `name`     | EC-MNAME-1   | Valid   | Không rỗng                                           | `Nguyen Van A`        |
| `name`     | EC-MNAME-2   | Invalid | Rỗng                                                 | `""`                  |
| `email`    | EC-MEMAIL-1  | Valid   | Đúng định dạng & chưa tồn tại                        | `new@domain.com`      |
| `email`    | EC-MEMAIL-2  | Invalid | Sai định dạng                                        | `abc@`                |
| `email`    | EC-MEMAIL-3  | Invalid | Đã tồn tại (kỳ vọng từ chối; nghi BUG cho qua)       | `test@eshop.com`      |
| `password` | EC-MPWD-1    | Valid   | ≥8 ký tự, đủ 4 loại                                  | `Abcd123!`            |
| `password` | EC-MPWD-2    | Invalid | Thiếu chữ hoa                                        | `abcd123!`            |
| `password` | EC-MPWD-3    | Invalid | Thiếu số                                             | `Abcdefg!`            |
| `password` | EC-MPWD-4    | Invalid | Thiếu ký tự đặc biệt                                 | `Abcd1234`            |
| `password` | EC-MPWD-5    | Invalid | <8 ký tự                                             | `Ab1!`                |

### D.1.3 Test cases — Domain Testing

> ⏳ Điền qua skill `domain-testing` (mã `TC-MOB_REG-001…`).

| TC ID         | Phủ EC | Test data | Expected result | Status  |
| ------------- | ------ | --------- | --------------- | ------- |
| TC-MOB_REG-001| EC-MNAME-1, EC-MEMAIL-1, EC-MPWD-1 | `Nguyen Van A` / `new@domain.com` / `Abcd123!` | Đăng ký thành công, về màn login | Not Run |
| `<bổ sung>`   |        |           |                 | Not Run |

## D.2 Boundary Value Analysis

### D.2.1 Biến áp dụng & biên

- **Biến có thứ tự:** `độ dài password`. Biên đóng dưới: **8** (regex `.{8,}`). Không có biên trên rõ ràng → chỉ test quanh biên dưới.
- Giữ đủ 4 loại ký tự (hoa/thường/số/đặc biệt) để tránh defect masking — chỉ kiểm độ dài.

### D.2.2 Bảng giá trị biên

| Biến             | Điểm  | Giá trị (độ dài → ví dụ) | Kỳ vọng |
| ---------------- | ----- | ------------------------ | ------- |
| `độ dài password`| min-1 | 7 → `Aa1@bcd`            | Invalid |
| `độ dài password`| min   | 8 → `Aa1@bcde`           | Valid   |
| `độ dài password`| min+1 | 9 → `Aa1@bcdef`          | Valid   |

### D.2.3 Test cases — BVA

> ⏳ Điền qua skill `boundary-value-analysis` (mã `TC-MOB_REG-101…`). (Đối chiếu với file đã có [BVA-FR01.md](../../group05_eshop/tests/test-design/BVA-FR01.md) — cùng kỹ thuật, khác feature.)

| TC ID          | Điểm biên | Test data (password) | Expected result | Status  |
| -------------- | --------- | -------------------- | --------------- | ------- |
| TC-MOB_REG-101 | min-1 (7) | `Aa1@bcd`            | Báo "mật khẩu quá yếu", không gửi API | Not Run |
| TC-MOB_REG-102 | min (8)   | `Aa1@bcde`           | Đăng ký thành công | Not Run |
| TC-MOB_REG-103 | min+1 (9) | `Aa1@bcdef`          | Đăng ký thành công | Not Run |

## D.3 AI Gap Analysis · D.4 Bugs

> Điền tương tự sau khi execute. Ứng viên bug: email trùng được chấp nhận; password lưu plaintext.

---

# 2. Test Summary Report (tổng toàn bài)

<!-- Cũng đưa vào README.md theo yêu cầu nộp. Điền số sau khi execute. -->

| Chỉ số             | A    | B    | C    | D    | Tổng |
| ------------------ | ---- | ---- | ---- | ---- | ---- |
| Số feature         | 1    | 1    | 1    | 1    | 4    |
| Test case thiết kế | 18   | `<>` | `<>` | `<>` | `<>` |
| Đã execute         | `<>` | `<>` | `<>` | `<>` | `<>` |
| Pass               | `<>` | `<>` | `<>` | `<>` | `<>` |
| Fail               | `<>` | `<>` | `<>` | `<>` | `<>` |
| Chưa execute       | `<>` | `<>` | `<>` | `<>` | `<>` |
| Bug                | `<>` | `<>` | `<>` | `<>` | `<>` |

**Demo videos (YouTube):**

- Agent Skill demo: `<link>`

---

# 3. Bug Report tổng hợp

| Bug ID | Feature | Found by TC | Tiêu đề | Severity | Status | GitHub Issue |
| ------ | ------- | ----------- | ------- | -------- | ------ | ------------ |
|        |         |             |         |          |        |              |

> Mỗi bug phải có issue trên GitHub kèm screenshot; trong issue ghi rõ **Found by Test Case** và **Requirement liên quan**.

---

# 4. AI Critique (200–300 từ) — BẮT BUỘC

<!-- Trả lời: AI sai/thiên lệch/thiếu sót ở đâu? Vì sao không phát hiện? Nguyên tắc rút ra khi cộng tác với AI? -->

`<viết 200–300 từ tại đây>`

---

# 5. Git Commit Log

- File log đính kèm: `<git-commit-log.txt>`
- Lệnh tạo: `git log --pretty=format:"%h %ad %s" --date=short > git-commit-log.txt`

---

# 6. Self-Assessment Table

| No. | Tiêu chí                              | Điểm tối đa | Tự đánh giá |
| --- | ------------------------------------- | ----------- | ----------- |
| 1   | Feature A (Domain + Boundary)         | 25          | `<>`        |
| 2   | Feature B (Domain + Boundary)         | 25          | `<>`        |
| 3   | Feature C (Domain + Boundary)         | 25          | `<>`        |
| 4   | Feature D (Mobile, Domain + Boundary) | 15          | `<>`        |
| 5   | Agent Skills                          | 10          | `<>`        |
|     | **Tổng**                              | **100**     | `<>`        |

---

# Phụ lục A — AI Audit Report

<!--
  Phần này theo template [AI-02] FIT@HCMUS (skill gen-audit-log).
  GỢI Ý: sau khi làm xong cả phiên hãy chạy /gen-audit-log để tự sinh audit.md
  với verbatim prompt + verbatim output, rồi dán/đính kèm vào đây.
-->

## A.1 Student Information

| Field                   | Value                                 |
| :---------------------- | :------------------------------------ |
| Student name (printed): | Trương Thành Đạt                      |
| Student ID:             | 23217344                              |
| Class / Cohort:         | Kiểm thử phần mềm - 23KTPM3           |
| Assignment ID:          | HW02                                  |
| Assignment date:        | `<dd/mm/2026>`                        |
| AI tool(s) used:        | Claude Code (claude-opus-4-8)         |
| AI tool(s) used:        | [ ] Yes [ ] No                        |

## A.2 Audit Table — one row per artifact

<!-- (1)(2) phải verbatim. (3)(4)(5) bạn tự điền sau khi review. -->

| (1) Prompt + Tool                                                           | (2) AI Output          | (3) Verdict                  | (4) Reasoning (ISTQB) | (5) Student Fix |
| :-------------------------------------------------------------------------- | :--------------------- | :--------------------------- | :-------------------- | :-------------- |
| **Tool:** `<...>` **Time:** `<hh:mm dd/mm/2026>` **Prompt:** `"<verbatim>"` | `<verbatim AI output>` | `<VALID/INVALID/INCOMPLETE>` | `<cite slide/ISTQB>`  | `<sửa của bạn>` |

## A.3 Summary of AI Accuracy

| Metric                               | Count | Percentage |
| :----------------------------------- | :---- | :--------- |
| Total AI-generated artifacts audited | `<>`  | 100%       |
| VALID (correct, accepted as-is)      | `<>`  | `<>`%      |
| INVALID (wrong; rejected)            | `<>`  | `<>`%      |
| INCOMPLETE (acceptable after edits)  | `<>`  | `<>`%      |

## A.4 Conclusion — When should AI be used (or not)?

`<viết 80–150 từ>`

## A.5 Mandatory Disclosure (paste verbatim)

> _"[Test cases / script / report] was initially generated by `<AI tool>`; I reviewed and modified `<section X>`, added `<edge cases Y, Z>`; `<section W>` was written entirely by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category."_

## A.6 Signature

| Field                   | Value                               |
| :---------------------- | :---------------------------------- |
| Student name (printed): | Trương Thành Đạt                    |
| Student ID:             | 23217344                            |
| Course:                 | CS423 / CSC13003 – Software Testing |
| Instructor:             | `<điền>`                            |
| Date:                   | `<dd/mm/2026>`                      |
| Signature:              |                                     |
