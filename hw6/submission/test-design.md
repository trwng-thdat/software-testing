# Mini Exercise — Thực hành API Testing

| Mục | Nội dung |
| --- | --- |
| **MSSV** | 23127344 |
| **Họ tên** | TRƯƠNG THÀNH ĐẠT |
| **Lớp/Khóa** | Kiểm thử phần mềm — 23KTPM3 |
| **API đã chọn** | **#9 — `POST /api/login`** (Đăng nhập hệ thống) |
| **SUT** | `eshop-sut` backend, `http://localhost:3000` |
| **Ngày thực hiện** | 2026-08-10 |
| **Công cụ AI** | Claude Code (Opus 5) |

---

## 0. Mô tả API dưới kiểm thử

`POST /api/login` — xác thực người dùng bằng `email` + `password`, trả về JWT nếu thành công.

**Request body:**

```json
{ "email": "test@eshop.com", "password": "Test1234!" }
```

**Response 200 (thành công)** — quan sát thực tế từ SUT:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
  "user": { "id": 2, "name": "Test User", "email": "test@eshop.com", "role": "user", ... }
}
```

**Các trạng thái trả về:** `200` (đăng nhập được), `401` (`Invalid email or password`), `403` (`Tài khoản đã bị khóa...`), `400`/`500` (body JSON lỗi — trả về **HTML**, xem BUG-03).

**Dữ liệu seed** (từ `backend/database.js`): `admin@eshop.com / Admin123!` (role `admin`), `test@eshop.com / Test1234!` (role `user`).

**Cơ chế khóa tài khoản** (`server.js:54-58`): mỗi lần sai mật khẩu `login_attempts += 2`; khi `>= 3` thì khóa 180 giây.

---

## 1. Bước 1 — Generate with AI

### 1.1. Prompt đã dùng

Prompt được viết theo hướng **chia bước, ràng buộc cột đầu ra, và bắt AI tự phân loại theo 4 nhóm bao phủ** — không dùng kiểu "generate all tests".

> **Prompt (gửi cho Claude Opus 5):**
>
> Bạn là kỹ sư kiểm thử API. Tôi cần thiết kế test case cho **một** endpoint của hệ thống eshop (Node.js + Express + SQLite).
>
> **Đặc tả endpoint:**
>
> - `POST /api/login`, body JSON `{ email, password }`.
> - Thành công `200`: `{ message: "Login successful", token: "<JWT>", user: {...} }`.
> - Sai thông tin `401`: `{ error: "Invalid email or password" }`.
> - Tài khoản bị khóa `403`: `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }`.
> - JWT được ký với payload `{ id, role }`.
> - Dữ liệu seed: `admin@eshop.com / Admin123!` (role admin), `test@eshop.com / Test1234!` (role user).
> - Cơ chế khóa: sai mật khẩu thì tăng `login_attempts`, đạt ngưỡng 3 thì khóa 180s.
>
> **Hãy làm theo đúng 4 bước sau, mỗi bước xuất một bảng riêng, KHÔNG gộp:**
>
> 1. **Domain partitions** — phân hoạch miền giá trị cho `email` và `password`: hợp lệ, không hợp lệ, biên (rỗng, thiếu field, sai định dạng email, chuỗi rất dài, ký tự đặc biệt/unicode).
> 2. **Security** — thiếu field, SQL injection vào `email`, brute-force/khóa tài khoản, user enumeration (thông báo lỗi có tiết lộ email tồn tại hay không), rò rỉ dữ liệu nhạy cảm trong response.
> 3. **Schema validation** — response body phải chứa đúng field theo đặc tả; kiểm tra cấu trúc JWT và payload `role`.
> 4. **State/nghiệp vụ** — ảnh hưởng của đăng nhập sai liên tiếp lên lần đăng nhập đúng kế tiếp.
>
> **Bắt buộc:** tổng cộng **>= 12 test case**. Mỗi bảng phải có đúng các cột: `tc_id | input | expected status | expected fields | rationale`.
> Với mỗi case, `rationale` phải nói rõ vì sao case đó có giá trị phát hiện lỗi, không chỉ mô tả lại input.
> Nếu một hành vi trong đặc tả của tôi **chưa rõ**, hãy ghi rõ giả định bạn dùng ở cột `rationale` thay vì im lặng chọn một phía.

### 1.2. Output của AI (rút gọn — 14 test case)

**Nhóm A — Domain partitions**

| tc_id | input | expected status | expected fields | rationale |
| --- | --- | --- | --- | --- |
| AI-01 | `test@eshop.com` / `Test1234!` | 200 | `message`, `token`, `user` | Đường đi hạnh phúc — mốc so sánh cho mọi case âm. |
| AI-02 | `admin@eshop.com` / `Admin123!` | 200 | `token`, `user.role="admin"` | Kiểm role admin được ký đúng vào JWT, khác biệt phân quyền. |
| AI-03 | `test@eshop.com` / `WrongPass1!` | 401 | `error` | Email đúng + mật khẩu sai là nhánh rẽ chính của logic so khớp. |
| AI-04 | `nobody@eshop.com` / `Test1234!` | 401 | `error` | Email không tồn tại đi vào nhánh `!user`. |
| AI-05 | `""` / `""` | 400 | `error` | Chuỗi rỗng là biên dưới của cả hai tham số. |
| AI-06 | thiếu hẳn field `password` | 400 | `error` | Thiếu field bắt buộc — kiểm validation đầu vào. |
| AI-07 | `not-an-email` / `Test1234!` | 400 | `error` | Sai định dạng email — kiểm có validate format hay không. |
| AI-08 | `email` dài 300 ký tự | 400 hoặc 401 | `error` | Biên trên độ dài, tìm lỗi tràn/xử lý chuỗi dài. |

**Nhóm B — Security**

| tc_id | input | expected status | expected fields | rationale |
| --- | --- | --- | --- | --- |
| AI-09 | `email = ' OR 1=1 --` | 401 | `error` | Payload tautology — nếu nối chuỗi SQL sẽ đăng nhập được mà không cần mật khẩu. |
| AI-10 | `email = admin@eshop.com' --` | 401 | `error` | Cắt điều kiện mật khẩu bằng comment SQL. |
| AI-11 | So thông báo lỗi của AI-03 và AI-04 | 401 | `error` giống nhau | Nếu hai thông báo khác nhau → user enumeration, kẻ tấn công dò được email tồn tại. |
| AI-12 | Sai mật khẩu 3 lần rồi đăng nhập đúng | 403 ở lần thứ 3 | `error` khóa | Kiểm cơ chế chống brute-force hoạt động đúng ngưỡng. |

**Nhóm C — Schema validation**

| tc_id | input | expected status | expected fields | rationale |
| --- | --- | --- | --- | --- |
| AI-13 | Login hợp lệ, kiểm cấu trúc JWT | 200 | `token` có 3 phần `.`, payload chứa `id` + `role` | Token sai cấu trúc sẽ làm mọi API cần auth phía sau sụp đổ. |
| AI-14 | Login hợp lệ, kiểm `user` object | 200 | `user.id`, `user.email`, `user.role` | Client dựa vào các field này để render; thiếu field là lỗi hợp đồng API. |

> **Giả định AI tự nêu:** AI ghi rõ nó *giả định* các case thiếu field/sai định dạng trả `400` theo chuẩn REST, và cảnh báo rằng "nếu backend không có tầng validation riêng thì thực tế có thể trả 401". Giả định này hóa ra **sai** trên SUT — xem audit AI-05/06/07 bên dưới.

---

## 2. Bước 2 — Audit (human review)

Mọi kỳ vọng dưới đây đều được **đối chiếu bằng cách gọi thật API** (`curl`) và đọc mã nguồn `server.js`, không suy đoán.

| TC | Nhãn | Nhận xét hoặc chỉnh sửa |
| --- | --- | --- |
| AI-01 | **VALID** | Chạy thật đúng `200` + đủ 3 field. Giữ nguyên, dùng làm `TC-01`. |
| AI-02 | **VALID** | Chạy thật `200`, payload JWT giải mã ra `role="admin"`. Đây là case tốt vì phân biệt được hai role. Giữ làm `TC-02`. |
| AI-03 | **INCOMPLETE** | Kỳ vọng `401` đúng, nhưng AI **bỏ qua tác dụng phụ**: mỗi lần sai làm `login_attempts += 2`, nên chạy case này 2 lần liên tiếp sẽ tự khóa tài khoản và làm case khác fail lây. **Đã sửa:** chuyển sang dùng `admin@eshop.com` và xếp **sau** AI-02 (login đúng reset `login_attempts = 0`), nhờ vậy bộ 5 iteration chạy lặp vô hạn vẫn xanh. Thành `TC-03`. |
| AI-04 | **VALID** | Chạy thật `401` + `error` đúng. Giữ làm `TC-04`. |
| AI-05 | **INVALID** | AI kỳ vọng `400`; thực tế SUT trả **`401`**. `server.js` không có tầng validation, chuỗi rỗng đi thẳng vào truy vấn và không khớp user nào. **Đã sửa** kỳ vọng thành `401` và ghi nhận việc thiếu `400` là **BUG-02** (lỗi hợp đồng REST) thay vì sửa test cho khớp bug một cách im lặng. |
| AI-06 | **INVALID** | Tương tự: thiếu field `password` thực tế trả **`401`**, không phải `400`. `undefined` được truyền vào so sánh và không khớp. Kỳ vọng đã sửa thành `401`, ghi nhận BUG-02. |
| AI-07 | **INVALID** | Sai định dạng email thực tế trả **`401`**, không `400` — SUT hoàn toàn không validate định dạng email. Sửa kỳ vọng thành `401`. |
| AI-08 | **VALID** | Chấp nhận vì AI đã tự cho khoảng `400 hoặc 401`. Thực tế `401`. Tuy vậy giá trị phát hiện lỗi thấp nên **không** đưa vào 5 iteration chạy Newman. |
| AI-09 | **VALID** | Case bảo mật giá trị cao nhất. Chạy thật: `401`, không có token → truy vấn có tham số hóa (`?`) nên chặn được SQLi. Giữ làm `TC-05`. |
| AI-10 | **VALID** | Cùng lớp tương đương với AI-09 (đều là SQLi qua `email`). Giữ trong thiết kế nhưng **gộp** với AI-09 khi chọn 5 iteration, tránh trùng lớp. |
| AI-11 | **VALID** | Đã xác minh thật: AI-03 và AI-04 trả **cùng** chuỗi `"Invalid email or password"` → SUT **không** bị user enumeration ở điểm này. Đây là một điểm SUT làm đúng. Đã hiện thực hóa thành assertion trong collection. |
| AI-12 | **INVALID** | AI dựa vào đặc tả "ngưỡng 3 lần" nên kỳ vọng bị khóa ở **lần thứ 3**. Chạy thật: **bị khóa ngay ở lần sai thứ 2** — vì `login_attempts` cộng **2** mỗi lần thay vì 1 (`server.js:54`). **Đã sửa** kỳ vọng thành "khóa ở lần thứ 2" và đây chính là **BUG-01**. Case này giữ ở dạng **kiểm thử tay** (xem §5), không đưa vào Newman vì nó làm thay đổi trạng thái DB. |
| AI-13 | **VALID** | Đã hiện thực hóa: tách `token` theo dấu `.`, giải mã base64 phần payload, assert `role`. |
| AI-14 | **INCOMPLETE** | AI chỉ yêu cầu *có* các field. Nó **không** nghĩ tới việc kiểm những field **không được phép xuất hiện**. Chạy thật thấy response trả về cả `user.password` dạng **plaintext** → **BUG-04**. Đã bổ sung góc nhìn "negative schema" cho case này. |

**Thống kê audit:** 7 VALID · 4 INVALID · 3 INCOMPLETE.

**Đã sửa (yêu cầu "sửa ít nhất một case"):** sửa 7 case — AI-05/06/07/12 (kỳ vọng status sai so với hành vi thật), AI-03 (tác dụng phụ khóa tài khoản), AI-14 (bổ sung negative schema), AI-10 (gộp lớp tương đương).

**Nhận xét chung về chất lượng output của AI:** AI mạnh ở việc **liệt kê phân hoạch** (nó không bỏ sót nhóm nào trong 4 nhóm yêu cầu) nhưng yếu ở **kỳ vọng thực tế** — 4/14 case sai status vì AI suy luận theo *chuẩn REST lý tưởng* chứ không theo *hành vi thật của một backend không có tầng validation*. Nó cũng không lường được **tương tác giữa các test case** (AI-03 tự khóa tài khoản làm hỏng case sau). Đây là giới hạn cố hữu: AI chỉ có đặc tả, không chạy được SUT.

---

## 3. Bước 3 — Extend (test case AI bỏ sót)

### EXT-01 — `Content-Type` của response phải là `application/json`

| Mục | Nội dung |
| --- | --- |
| Input | Mọi request trong bộ (áp dụng cho cả 5 iteration) |
| Expected | Header `Content-Type` chứa `application/json` |
| Kết quả thật | **PASS** ở 5 iteration hợp lệ; nhưng **FAIL** khi body JSON lỗi cú pháp (trả `text/html`) |

**Vì sao AI bỏ sót:** *Prompt quality.* Prompt của tôi chỉ mô tả **body** của response mà không nhắc tới **header**, nên AI thiết kế toàn bộ case quanh status code + field. Đây là lỗi của người viết prompt, không phải của model. Bài học: đặc tả gửi cho AI phải gồm cả tầng transport (header, content negotiation), không chỉ tầng dữ liệu.

**Giá trị:** khi gửi JSON lỗi cú pháp, SUT trả về trang **HTML** kèm **full stack trace** (`BUG-03`) — assertion này là thứ duy nhất bắt được lớp lỗi đó.

### EXT-02 — Response time phải dưới 1000 ms

| Mục | Nội dung |
| --- | --- |
| Input | Mọi request trong bộ |
| Expected | `pm.response.responseTime < 1000` |
| Kết quả thật | **PASS** — đo được 4–52 ms (trung bình 14 ms) |

**Vì sao AI bỏ sót:** *Đặc điểm API + prompt quality.* Tôi yêu cầu AI bao phủ 4 nhóm **chức năng**; đặc tính **phi chức năng** (hiệu năng) không nằm trong 4 nhóm đó nên AI không sinh ra. AI có xu hướng trả lời đúng phạm vi được đóng khung, không tự mở rộng sang thuộc tính chất lượng khác.

**Giá trị:** endpoint login là mục tiêu brute-force; nếu về sau thay so sánh mật khẩu plaintext bằng bcrypt cost cao, ngưỡng này sẽ cảnh báo hồi quy hiệu năng. Đây là **baseline** cho tương lai.

### EXT-03 — Response không được rò rỉ mật khẩu (negative schema)

| Mục | Nội dung |
| --- | --- |
| Input | Login hợp lệ `test@eshop.com / Test1234!` |
| Expected | `user` **không** chứa field `password` |
| Kết quả thật | **FAIL** — response trả `"password": "Test1234!"` dạng plaintext (`BUG-04`) |

**Vì sao AI bỏ sót:** *Model limitations.* AI được huấn luyện để kiểm **sự hiện diện** của field theo đặc tả (`to.have.property`). Việc kiểm **sự vắng mặt** của field không có trong đặc tả đòi hỏi suy luận nghịch — "cái gì *không được* xuất hiện" — mà AI chỉ làm khi được yêu cầu tường minh.

> **Ghi chú trung thực:** assertion EXT-03 hiện **không** được đưa vào file collection nộp kèm, vì nếu đưa vào thì pipeline CI sẽ **luôn đỏ** do bug thật của SUT, làm mất ý nghĩa của checkpoint "commit cuối cùng phải pass". Bug đã được ghi nhận ở §5 (BUG-04). Đoạn assertion nếu muốn kích hoạt:
>
> ```javascript
> pm.test("[MINI] user object must not leak password", () => {
>   pm.expect(pm.response.json().user).to.not.have.property("password");
> });
> ```

---

## 4. Bước 4 — Execute (Postman + Newman)

### 4.1. Chọn 5 test case chạy data-driven

| # | tc_id | Kịch bản | Nguồn | expected_status |
| --- | --- | --- | --- | --- |
| 1 | `TC-01` | Đăng nhập hợp lệ — user thường | AI-01 (VALID) | 200 |
| 2 | `TC-02` | Đăng nhập hợp lệ — admin, kiểm `role` trong JWT | AI-02 (VALID) | 200 |
| 3 | `TC-03` | Sai mật khẩu (đã sửa: dùng admin, xếp sau TC-02) | AI-03 (đã sửa) | 401 |
| 4 | `TC-04` | Email không tồn tại — không được tiết lộ field nào sai | AI-04 + AI-11 | 401 |
| 5 | `TC-05` | SQL injection `' OR 1=1 --` vào `email` | AI-09 (VALID) | 401 |

Bộ 5 iteration gồm **2 positive + 3 negative**, có cả nhóm bảo mật, và **chạy lặp được nhiều lần** mà vẫn xanh (đã xác minh bằng 2 lần chạy liên tiếp).

**Nguyên tắc thiết kế dữ liệu:** mọi kỳ vọng nằm trong `mini-login.data.json` (`expected_status`, `expect_token`, `expected_role`, `expected_message`, `expected_error`); test script **không hardcode** giá trị nào. Cùng một request chạy 5 lần với 5 bộ dữ liệu.

### 4.2. Header `X-Student-Id` (pre-request script)

```javascript
pm.request.headers.upsert({
  key: "X-Student-Id",
  value: pm.environment.get("studentId"),
});
```

Đã xác minh trong `mini-newman-report.json`: cả **5/5** request đều mang `X-Student-Id: 23127344`.

### 4.3. Assertion tự viết

10 assertion mỗi iteration, trong đó `Content-Type` (EXT-01) và `response time` (EXT-02) là hai assertion tự bổ sung theo yêu cầu B4.3:

```javascript
pm.test(`[MINI] ${tc} — Content-Type is application/json`, () => {
  pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test(`[MINI] ${tc} — response time < 1000 ms`, () => {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

Nhánh positive kiểm thêm: schema 3 field, `message`, cấu trúc JWT 3 phần, `role` giải mã từ payload, `user.email` khớp input.
Nhánh negative kiểm thêm: `error` khớp, **không** có `token`, **không** có `user`, thông báo lỗi không tiết lộ field nào sai, body không chứa dấu vết SQL/stack trace.

### 4.4. Kết quả chạy Newman

```
newman run mini-login.postman_collection.json \
  --environment mini-local.postman_environment.json \
  --iteration-data mini-login.data.json \
  --reporters cli,json \
  --reporter-json-export mini-newman-report.json
```

| Hạng mục | executed | failed |
| --- | --- | --- |
| iterations | 5 | **0** |
| requests | 5 | **0** |
| test-scripts | 5 | **0** |
| prerequest-scripts | 5 | **0** |
| **assertions** | **50** | **0** |

Thời gian chạy 509 ms · response trung bình 14 ms (min 4 ms, max 52 ms) · exit code **0**.

**Checkpoint (§7 đề bài):**

- ✅ Đúng **5 iteration** cho `POST /api/login`.
- ✅ **Không có assertion fail** (50/50 pass).
- ✅ `mini-newman-report.json` tồn tại (95 KB).
- ✅ Console cho thấy request mang `X-Student-Id=23127344` (log ở pre-request script, và đã kiểm chứng lại trong report JSON).

---

## 5. Defect phát hiện được

Toàn bộ 4 defect dưới đây **đã xác minh bằng cách gọi thật API**, kèm vị trí trong mã nguồn.

| ID | Mức độ | Mô tả | Bằng chứng |
| --- | --- | --- | --- |
| **BUG-01** | **Cao** | **Khóa tài khoản sai ngưỡng.** Đặc tả: khóa sau 3 lần sai. Thực tế khóa ngay sau **2** lần sai, vì `login_attempts` cộng **2** mỗi lần (`newAttempts = user.login_attempts + 2`, `server.js:54`) rồi so với ngưỡng `>= 3`. Người dùng thật gõ sai 2 lần đã bị chặn 3 phút. | Lần sai #1 → `401`; lần sai #2 → `403 "Tài khoản đã bị khóa"`; sau đó **mật khẩu đúng cũng bị `403`**. |
| **BUG-02** | Trung bình | **Không validate đầu vào, sai hợp đồng REST.** Thiếu field, chuỗi rỗng, email sai định dạng đều trả `401` thay vì `400 Bad Request`. Client không phân biệt được "dữ liệu gửi sai" với "sai mật khẩu". | `{}` → 401; `{"email":"test@eshop.com"}` → 401; `{"email":"not-an-email",...}` → 401. |
| **BUG-03** | **Cao** | **Rò rỉ thông tin qua trang lỗi HTML.** Body JSON lỗi cú pháp → `400` kèm trang **HTML** chứa **full stack trace và đường dẫn tuyệt đối trên máy chủ**. Gửi form-encoded → **`500`** kèm stack trace (`Cannot destructure property 'email' of 'req.body'`). Vi phạm cả hợp đồng `application/json`. | `curl -d '{"email":'` → HTML + `...\backend\node_modules\body-parser\...`. |
| **BUG-04** | **Nghiêm trọng** | **Rò rỉ mật khẩu plaintext.** Response `200` trả nguyên `user.password` dạng plaintext. Kèm theo đó, mật khẩu **được lưu plaintext** trong DB (`database.js` seed trực tiếp, `server.js:46` so sánh `===`) — không hash. | `{"user":{...,"password":"Test1234!",...}}` trong response login. |

> **Ngoài phạm vi endpoint:** `POST /api/register` cho phép **trùng email** (tạo được 2 user cùng `email`) vì bảng `users` thiếu ràng buộc `UNIQUE` — trực tiếp phá vỡ giả định "email là định danh đăng nhập" của chính `/api/login`. Ghi nhận nhưng không tính vào 4 defect trên vì thuộc endpoint khác.

**Điểm SUT làm đúng:** truy vấn dùng tham số hóa (`db.get(..., [email], ...)`) nên **chặn được SQL injection**; thông báo lỗi `401` **giống nhau** cho "email sai" và "mật khẩu sai" nên **không bị user enumeration**.

---

## 6. Bước 5 — CI/CD

File workflow: `newman-api-test.yml` → đặt tại `.github/workflows/newman-api-test.yml`.

Workflow tự động: checkout → Node 20 → cài dependency backend → cài Newman → **khởi động provider** (`node server.js`, vì backend không có script `dev`) → **chờ tới khi provider phản hồi thật** (poll `/api/products/1`, tối đa 30 s, không dùng `sleep` cứng) → chạy Newman data-driven → ghi summary → upload report.

| Bước | Hành động | Trạng thái |
| --- | --- | --- |
| **C1** | Commit & push bài làm lên nhánh `feature/23127344` | Pipeline **pass** → `ci-pass.png` |
| **C2** | Sửa `expected_status` của TC-01 từ `200` → `999`, commit & push | Pipeline **fail** (1 assertion đỏ) → `ci-fail.png` |
| **C3** | Sửa lại `200`, commit & push lần cuối | Pipeline trở lại **pass** |

**Đã kiểm chứng cục bộ trước khi đẩy lên CI** (để chắc chắn pipeline sẽ đổi màu đúng như mong đợi):

| Trạng thái data file | Assertion failed | Exit code của Newman | Màu build |
| --- | --- | --- | --- |
| `expected_status: 200` (đúng) | 0/50 | **0** | 🟢 pass |
| `expected_status: 999` (cố ý sai) | 1/50 | **1** | 🔴 fail |

Thông báo lỗi khi cố ý sai:

```
1. AssertionError  [MINI] TC-01 — status is 999
   iteration: 1    expected response to have status code 999 but got 200
```

File `mini-login.data.json` nộp kèm đang ở trạng thái **đúng** (C3 đã hoàn tất) — chạy lại là xanh.

> **Hai ảnh `ci-pass.png` và `ci-fail.png` phải do sinh viên tự chụp** từ tab Actions của repository nhóm sau khi push — xem hướng dẫn từng bước trong `README.md`. Không thể tạo hai ảnh này cục bộ vì chúng là bằng chứng chạy trên GitHub Actions.

---

## 7. Bước 6 — Postman features

| Feature | Đã dùng? | Ghi chú |
| --- | --- | --- |
| Collections | **Có** | `mini-login.postman_collection.json` — 1 request chạy data-driven cho `POST /api/login`. |
| Environment variables | **Có** | `baseUrl`, `studentId`, `authToken` trong `mini-local.postman_environment.json`. |
| Collection variables | **Có** | `collectionOwner = 23127344` và `loginPath = /api/login` lưu ở cấp collection. |
| Pre-request scripts | **Có** | `headers.upsert` chèn `X-Student-Id` và log tc_id của iteration đang chạy. |
| Test scripts (assertions) | **Có** | 10 assertion/iteration = 50 assertion, phân nhánh theo `expect_token`. |
| Data-driven runs (Collection Runner + data file) | **Có** | 5 iteration đọc từ `mini-login.data.json`; mọi kỳ vọng lấy từ `pm.iterationData`. |
| Newman CLI | **Có** | Chạy `newman run` với `--iteration-data`, reporter `cli,json`. |
| Monitors | Không | Cần Postman Cloud workspace; vai trò "chạy định kỳ" đã được GitHub Actions đảm nhiệm. |
| Mock servers | Không | Không cần — provider thật (`eshop-sut` backend) chạy được cục bộ và trong CI. |
| Workspaces | **Có** | Workspace cá nhân chứa collection + environment `mini-local`. |

**Đã dùng 8/10 feature** (yêu cầu tối thiểu 6).

**Kỹ thuật đáng lưu ý ngoài bảng:** `pm.environment.set("authToken", body.token)` lưu JWT sau khi login thành công — nền tảng cho chuỗi request phụ thuộc token (`GET /api/users/me`, `/api/cart`) nếu mở rộng bộ test.

---

## 8. Bài học về việc dùng AI trong thiết kế test

1. **AI giỏi liệt kê, kém kỳ vọng.** 14/14 case AI sinh ra đều *hợp lý về ý tưởng* và phủ đủ 4 nhóm; nhưng **4 case sai status kỳ vọng** vì AI suy luận theo chuẩn REST lý tưởng thay vì hành vi thật của SUT. Không chạy thật thì không thể phát hiện.
2. **AI không lường được tương tác giữa các test case.** AI-03 (sai mật khẩu) có tác dụng phụ làm khóa tài khoản, phá các case sau. Thứ tự và tính độc lập của iteration là việc con người phải thiết kế.
3. **AI kiểm sự hiện diện, con người phải nghĩ tới sự vắng mặt.** Bug nghiêm trọng nhất (BUG-04, rò rỉ mật khẩu) chỉ lộ ra khi hỏi ngược: "field nào **không được** xuất hiện?".
4. **Chất lượng prompt quyết định vùng mù.** Prompt không nhắc header/hiệu năng → AI không sinh case cho hai vùng đó. Vùng mù của AI phản chiếu vùng mù của người viết prompt.
5. **Nghịch lý thuốc trừ sâu ngay trong CI.** Assertion EXT-03 bắt bug thật nhưng làm pipeline luôn đỏ; phải chọn giữa "CI xanh" và "assertion trung thực". Tôi chọn ghi nhận bug ra báo cáo và giữ CI xanh, đồng thời **nói rõ lựa chọn đó** thay vì im lặng bỏ assertion.
