# HW04 — Bug Report tổng hợp

| Trường | Giá trị |
| ------ | ------- |
| Sinh viên | TRƯƠNG THÀNH ĐẠT — MSSV **23127344** |
| Lớp | Kiểm thử phần mềm — 23KTPM3 |
| SUT | EShop — backend `:3000` · web `:5173` · admin `:5174` |
| Phạm vi | FR-04 (Pool A) · FR-08 (Pool B) · FR-18 (Pool C) — 47 test case |
| Thực thi | 141 lượt (47 TC × 3 trình duyệt) · Chrome 151 · Edge 151 · Firefox 153 |
| Kết quả | **102 PASS · 39 FAIL** (13 TC × 3 browser) |
| Tổng số bug | **13** — Critical 3 · High 5 · Medium 5 |
| GitHub Issues | [#260–#272](https://github.com/DuyITLOR/group05_eshop/issues) trên repo SUT |
| Ngày lập | 08/08/2026 |

> **Nguồn số liệu:** toàn bộ bug dưới đây phát hiện qua **chạy thật**, không phải đọc source đoán ra. Ảnh chụp sinh tự động bởi `utils/bugReporter.ts` tại đúng thời điểm test FAIL; log gốc ở [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md); báo cáo HTML ở [`selenium/reports/`](selenium/reports/).
>
> **Cả 13 bug tái hiện giống hệt trên cả 3 trình duyệt** — không có bug nào chỉ xảy ra trên một engine, loại trừ khả năng lỗi do timing hay do riêng một browser.

---

## 1. Bảng tổng hợp

| Bug ID | TC ID | Feature | Mức độ | Mô tả ngắn | Ảnh chụp | GitHub Issue |
| ------ | ----- | ------- | ------ | ---------- | -------- | ------------ |
| BUG-04 | TC-PROFILE-12 | FR-04 | **Critical** | Leo thang đặc quyền qua `PUT /api/users/me` | [`TC-PROFILE-12.png`](selenium/bug-snapshots/TC-PROFILE-12.png) | [#260](https://github.com/DuyITLOR/group05_eshop/issues/260) |
| BUG-07 | TC-CHECKOUT-07 | FR-08 | **Critical** | Khách tự sửa được tổng tiền, server lưu nguyên | [`TC-CHECKOUT-07.png`](selenium/bug-snapshots/TC-CHECKOUT-07.png) | [#261](https://github.com/DuyITLOR/group05_eshop/issues/261) |
| BUG-11 | TC-ADMIN-12 | FR-18 | **Critical** | Mọi API `/api/admin/*` không kiểm `role` | [`TC-ADMIN-12.png`](selenium/bug-snapshots/TC-ADMIN-12.png) | [#262](https://github.com/DuyITLOR/group05_eshop/issues/262) |
| BUG-01 | TC-PROFILE-04 | FR-04 | High | SĐT hợp lệ 10 chữ số bị từ chối | [`TC-PROFILE-04.png`](selenium/bug-snapshots/TC-PROFILE-04.png) | [#263](https://github.com/DuyITLOR/group05_eshop/issues/263) |
| BUG-02 | TC-PROFILE-05 | FR-04 | High | SĐT hợp lệ 11 chữ số bị từ chối | [`TC-PROFILE-05.png`](selenium/bug-snapshots/TC-PROFILE-05.png) | [#264](https://github.com/DuyITLOR/group05_eshop/issues/264) |
| BUG-06 | TC-CHECKOUT-04 | FR-08 | High | Công thức giảm giá percent đảo dấu → giảm giá âm | [`TC-CHECKOUT-04.png`](selenium/bug-snapshots/TC-CHECKOUT-04.png) | [#265](https://github.com/DuyITLOR/group05_eshop/issues/265) |
| BUG-09 | TC-CHECKOUT-16 | FR-08 | High | Giỏ rỗng vẫn tạo được đơn hàng | [`TC-CHECKOUT-16.png`](selenium/bug-snapshots/TC-CHECKOUT-16.png) | [#266](https://github.com/DuyITLOR/group05_eshop/issues/266) |
| BUG-10 | TC-ADMIN-07 | FR-18 | High | Cho phép `canceled → delivered` | [`TC-ADMIN-07.png`](selenium/bug-snapshots/TC-ADMIN-07.png) | [#267](https://github.com/DuyITLOR/group05_eshop/issues/267) |
| BUG-12 | TC-ADMIN-14 | FR-18 | High | XSS lưu trữ ở địa chỉ giao hàng | [`TC-ADMIN-14.png`](selenium/bug-snapshots/TC-ADMIN-14.png) | [#268](https://github.com/DuyITLOR/group05_eshop/issues/268) |
| BUG-03 | TC-PROFILE-08 | FR-04 | Medium | SĐT không bắt đầu bằng `0` lại được chấp nhận | [`TC-PROFILE-08.png`](selenium/bug-snapshots/TC-PROFILE-08.png) | [#269](https://github.com/DuyITLOR/group05_eshop/issues/269) |
| BUG-05 | TC-CHECKOUT-03 | FR-08 | Medium | Giỏ hàng không được xóa sau thanh toán | [`TC-CHECKOUT-03.png`](selenium/bug-snapshots/TC-CHECKOUT-03.png) | [#270](https://github.com/DuyITLOR/group05_eshop/issues/270) |
| BUG-08 | TC-CHECKOUT-13 | FR-08 | Medium | Lỗi biên ngưỡng coupon (`>` thay vì `>=`) | [`TC-CHECKOUT-13.png`](selenium/bug-snapshots/TC-CHECKOUT-13.png) | [#271](https://github.com/DuyITLOR/group05_eshop/issues/271) |
| BUG-13 | TC-ADMIN-16 | FR-18 | Medium | UI hiện nút chuyển tiếp ở trạng thái kết thúc | [`TC-ADMIN-16.png`](selenium/bug-snapshots/TC-ADMIN-16.png) | [#272](https://github.com/DuyITLOR/group05_eshop/issues/272) |

**Phân bố theo feature và mức độ:**

| Feature | Critical | High | Medium | Tổng | Tỉ lệ TC fail |
| ------- | -------- | ---- | ------ | ---- | ------------- |
| FR-04 Personal profile | 1 | 2 | 1 | **4** | 4/15 |
| FR-08 Checkout | 1 | 2 | 2 | **5** | 5/16 |
| FR-18 Admin orders | 1 | 1 | 1 | **3** | 3/16 |
| — thêm BUG-13 (FR-18, UI) | — | — | 1 | **1** | (4/16 tổng FR-18) |
| **Tổng** | **3** | **5** | **5** | **13** | **13/47** |

---

## 2. Chuỗi khai thác — 3 bug ghép thành đường chiếm quyền hoàn chỉnh

Đây là phát hiện đáng chú ý nhất của bài: ba defect riêng lẻ ở **hai feature khác nhau**, khi ghép lại tạo thành một đường tấn công trọn vẹn.

```
BUG-12 (XSS)  →  BUG-11 (API admin không kiểm quyền)  →  BUG-04 (leo thang role)
   │                      │                                    │
   │ Kẻ tấn công chỉ cần  │ Không cần chiếm tài khoản admin —   │ Hoặc tự nâng
   │ ĐẶT MỘT ĐƠN HÀNG với │ token user thường đã gọi được MỌI   │ role thành
   │ địa chỉ chứa script   │ API /api/admin/* (HTTP 200)        │ admin trực tiếp
   ▼                      ▼                                    ▼
Script chạy TRONG PHIÊN CỦA ADMIN khi admin mở tab "Đơn hàng"
```

| Bước | Bug | Vì sao nguy hiểm khi ghép |
| ---- | --- | ------------------------- |
| 1 | **BUG-12** | Địa chỉ giao hàng do **người mua tự nhập**, không escape, render bằng `dangerouslySetInnerHTML` → chèn được script vào trang quản trị mà **không cần đăng nhập admin** |
| 2 | **BUG-11** | Ngay cả khi không dùng XSS, token user thường **đã đủ** để đọc toàn bộ đơn hàng, xóa user, xóa coupon, đổi trạng thái đơn |
| 3 | **BUG-04** | Nếu muốn quyền vĩnh viễn: một request `PUT /api/users/me` kèm `role: "admin"` là xong |

> Mỗi bug đứng riêng đã nghiêm trọng; ghép lại thì rào chắn duy nhất còn sót (kiểm `role` phía client ở `App.jsx:65-68`) hoàn toàn vô nghĩa vì bị bỏ qua khi gọi thẳng API.

---

## 3. Chi tiết từng bug

### 🔴 BUG-04 — Leo thang đặc quyền qua `PUT /api/users/me`

| | |
| --- | --- |
| **TC ID** | TC-PROFILE-12 · Feature FR-04 · **Critical** |
| **Ảnh** | [`selenium/bug-snapshots/TC-PROFILE-12.png`](selenium/bug-snapshots/TC-PROFILE-12.png) |
| **Issue** | [#260](https://github.com/DuyITLOR/group05_eshop/issues/260) |
| **Browser** | Tái hiện cả 3 (lỗi tầng API, độc lập trình duyệt) |

**Các bước tái hiện**

1. Đăng nhập bằng tài khoản user thường, lấy JWT.
2. Gọi `PUT /api/users/me` với body `{"name":"x","phone":"912345678","shipping_address":"y","role":"admin"}`.
3. Gọi `GET /api/users/me` đọc lại bản ghi.

**Expected (SRS §2 FR-04)** — người dùng **không thể** tự thay đổi `role`; request phải bị từ chối hoặc trường `role` bị bỏ qua.

**Actual** — HTTP 200, `role` đổi `user` → `admin`, **tồn tại vĩnh viễn trong DB**.

**Nguyên nhân gốc** — `backend/server.js:119-125` destructure `role` từ `req.body` rồi ghép thẳng vào câu `UPDATE`, không kiểm quyền người gọi.

---

### 🔴 BUG-07 — Khách tự sửa được tổng tiền đơn hàng

| | |
| --- | --- |
| **TC ID** | TC-CHECKOUT-07 · Feature FR-08 · **Critical** |
| **Ảnh** | [`selenium/bug-snapshots/TC-CHECKOUT-07.png`](selenium/bug-snapshots/TC-CHECKOUT-07.png) |
| **Issue** | [#261](https://github.com/DuyITLOR/group05_eshop/issues/261) |
| **Browser** | Tái hiện cả 3 (3/3) |

**Các bước tái hiện**

1. Đăng nhập, thêm "Tai nghe AirPods Pro 2" (6.000.000₫) vào giỏ.
2. Vào `/checkout` — ô "Tổng tiền thanh toán (VND)" **sửa được**.
3. Sửa thành `1`, bấm "Xác Nhận Thanh Toán".
4. Gọi `GET /api/orders/my-orders`.

**Expected (SRS §4 FR-08)** — tổng tiền **không cho sửa trực tiếp**; backend **tự tính lại** từ giỏ hàng → đơn phải lưu `total_amount = 6000000`.

**Actual** — thanh toán thành công, đơn được tạo với **`total_amount = 1`**.

**Nguyên nhân gốc** — lỗi ở **hai tầng**, sửa một tầng chưa đủ:

- `frontend-web/src/pages/Checkout.jsx:93-102` — render tổng tiền bằng `<input type="number">` có `onChange` sửa `editableTotal`, rồi gửi chính giá trị đó.
- `backend/server.js:297-307` — nhận `total_amount` từ body và `INSERT` thẳng, **không đọc `items` để tính lại**.

---

### 🔴 BUG-11 — Middleware `authenticateToken` không kiểm `role`

| | |
| --- | --- |
| **TC ID** | TC-ADMIN-12 · Feature FR-18 · **Critical** |
| **Ảnh** | [`selenium/bug-snapshots/TC-ADMIN-12.png`](selenium/bug-snapshots/TC-ADMIN-12.png) |
| **Issue** | [#262](https://github.com/DuyITLOR/group05_eshop/issues/262) |
| **Browser** | Tái hiện cả 3 (lỗi tầng API) |

**Các bước tái hiện**

1. Đăng nhập bằng tài khoản user thường (`role = "user"`), lấy JWT.
2. Gọi `GET /api/admin/orders` với header `Authorization: Bearer <token user thường>`.

**Expected (SRS §6 FR-12)** — mọi API `/api/admin/*` yêu cầu JWT hợp lệ **và** `role = 'admin'` → phải trả **HTTP 401 hoặc 403**.

**Actual** — **HTTP 200** kèm **toàn bộ đơn hàng của mọi người dùng** (id, tên người mua, tổng tiền, địa chỉ giao hàng).

**Nguyên nhân gốc** — `backend/server.js:100-110`: `authenticateToken` gọi `jwt.verify` rồi gán `req.user = user` và `next()`, **không đọc `user.role`**. Toàn bộ **6 endpoint** dùng chung middleware này:

`POST /api/admin/import-products` · `POST|DELETE /api/admin/coupons` · `GET|DELETE /api/admin/users` · `GET /api/admin/orders` · `PUT /api/admin/orders/:id/status`

Frontend admin **có** kiểm `role !== "admin"` tại `frontend-admin/src/App.jsx:65-68`, nhưng đó chỉ là kiểm **phía client** — vô nghĩa trước request gọi thẳng API.

> ⚠️ Đây là defect **nghiêm trọng nhất** của cả bài và **không dự đoán được từ đọc source theo route** — nó nằm ở middleware dùng chung. Chỉ khi chạy thật TC-ADMIN-12 và nhận HTTP 200 thay vì 401 thì lỗ hổng mới lộ ra.

---

### 🟠 BUG-01 — SĐT hợp lệ 10 chữ số bị từ chối

| | |
| --- | --- |
| **TC ID** | TC-PROFILE-04 · Feature FR-04 · High |
| **Ảnh** | [`selenium/bug-snapshots/TC-PROFILE-04.png`](selenium/bug-snapshots/TC-PROFILE-04.png) |
| **Issue** | [#263](https://github.com/DuyITLOR/group05_eshop/issues/263) |
| **Browser** | Tái hiện cả 3 (3/3) |

**Các bước tái hiện** — đăng nhập → `/profile` → nhập SĐT `0123456789` → bấm "Cập nhật".

**Expected (SRS §2 FR-04)** — SĐT hợp lệ bắt đầu bằng `0`, dài 10–11 chữ số → `0123456789` đúng **biên dưới**, phải được chấp nhận.

**Actual** — alert `"Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."`, không lưu.

**Nguyên nhân gốc** — `frontend-web/src/pages/Profile.jsx:43` dùng regex `/^[1-9][0-9]{8,9}$/`: yêu cầu chữ số đầu **1–9** và độ dài **9–10**, trong khi SRS yêu cầu chữ số đầu **`0`** và độ dài **10–11**. Hai luật **loại trừ nhau ngay ở chữ số đầu tiên**. Cùng gốc với BUG-02, BUG-03.

**Ảnh hưởng** — người dùng Việt Nam **không thể** lưu số điện thoại thật của mình.

---

### 🟠 BUG-02 — SĐT hợp lệ 11 chữ số bị từ chối

| | |
| --- | --- |
| **TC ID** | TC-PROFILE-05 · Feature FR-04 · High |
| **Ảnh** | [`selenium/bug-snapshots/TC-PROFILE-05.png`](selenium/bug-snapshots/TC-PROFILE-05.png) |
| **Issue** | [#264](https://github.com/DuyITLOR/group05_eshop/issues/264) |
| **Browser** | Tái hiện cả 3 (3/3) |

**Các bước tái hiện** — đăng nhập → `/profile` → nhập SĐT `01234567890` → bấm "Cập nhật".

**Expected (SRS §2 FR-04)** — 11 chữ số là **biên trên hợp lệ**, phải được chấp nhận.

**Actual** — alert `"Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."`, không lưu.

**Nguyên nhân gốc** — cùng regex `/^[1-9][0-9]{8,9}$/` (`Profile.jsx:43`), chỉ cho tối đa **10** chữ số.

---

### 🟠 BUG-06 — Công thức giảm giá percent bị đảo dấu

| | |
| --- | --- |
| **TC ID** | TC-CHECKOUT-04 · Feature FR-08 · High |
| **Ảnh** | [`selenium/bug-snapshots/TC-CHECKOUT-04.png`](selenium/bug-snapshots/TC-CHECKOUT-04.png) |
| **Issue** | [#265](https://github.com/DuyITLOR/group05_eshop/issues/265) |
| **Browser** | Tái hiện cả 3 (lỗi tầng API) |

**Các bước tái hiện** — thêm "Bàn phím cơ Keychron Q1" (4.000.000₫) vào giỏ → `/checkout` → nhập mã `SAVE10` → "Áp dụng".

**Expected (SRS §4 FR-09)** — `SAVE10` giảm **10%** → `discount_amount = 400.000₫`, `final_amount = 3.600.000₫`.

**Actual** — `discount_amount = **-36.000.000₫**` · `final_amount = **40.000.000₫**` — khách phải trả **gấp 10 lần** giá gốc.

Xác minh trực tiếp qua API:

```bash
curl -X POST http://localhost:3000/api/apply-coupon \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","total_amount":4000000}'
# → {"discount_amount":-36000000,"final_amount":40000000}
```

**Nguyên nhân gốc** — `backend/server.js` (`POST /api/apply-coupon`) tính:

```js
discount_amount = Math.floor(total_amount * (1 - coupon.discount_value))
```

`discount_value` seed là **10** (nghĩa là 10%), nên biểu thức thành `total × (1 − 10) = −9 × total`. Công thức đúng phải là `total × discount_value / 100`. Lỗi xuất hiện ở **cả hai** nhánh (có và không có `user_id`).

---

### 🟠 BUG-09 — Giỏ hàng rỗng vẫn tạo được đơn hàng

| | |
| --- | --- |
| **TC ID** | TC-CHECKOUT-16 · Feature FR-08 · High |
| **Ảnh** | [`selenium/bug-snapshots/TC-CHECKOUT-16.png`](selenium/bug-snapshots/TC-CHECKOUT-16.png) |
| **Issue** | [#266](https://github.com/DuyITLOR/group05_eshop/issues/266) |
| **Browser** | Tái hiện cả 3 (3/3) |

**Các bước tái hiện** — đăng nhập, **không** thêm sản phẩm → vào thẳng `/checkout` → "Xác Nhận Thanh Toán" → `GET /api/orders/my-orders`.

**Expected (SRS §4 FR-08)** — **không được tạo đơn khi giỏ rỗng**; phải báo lỗi, không sinh bản ghi.

**Actual** — hiện "Thanh toán thành công!" và **sinh thêm 1 bản ghi** trong bảng `orders`.

**Nguyên nhân gốc** — `backend/server.js:297-307` chỉ đọc `total_amount` và `shipping_address`, **bỏ qua hoàn toàn mảng `items`**, không kiểm giỏ rỗng trước khi `INSERT`. Cùng gốc với BUG-07 (server tin tuyệt đối vào client).

---

### 🟠 BUG-10 — Cho phép chuyển `canceled → delivered`

| | |
| --- | --- |
| **TC ID** | TC-ADMIN-07 · Feature FR-18 · High |
| **Ảnh** | [`selenium/bug-snapshots/TC-ADMIN-07.png`](selenium/bug-snapshots/TC-ADMIN-07.png) |
| **Issue** | [#267](https://github.com/DuyITLOR/group05_eshop/issues/267) |
| **Browser** | Tái hiện cả 3 (lỗi tầng API) |

**Các bước tái hiện** — tạo đơn → chuyển sang `canceled` → gọi `PUT /api/admin/orders/:id/status` với `{"status":"delivered"}` → đọc lại `GET /api/orders/:id`.

**Expected (SRS §5 FR-10)** — `canceled` là **trạng thái kết thúc**, không được chuyển tiếp → phải bị từ chối (HTTP 400).

**Actual** — **HTTP 200** `{"message":"Order status updated"}`, `status` đổi thành `delivered`. Một đơn đã hủy trở thành đã giao.

**Nguyên nhân gốc** — `backend/server.js:549-550` có nhánh ngoại lệ:

```js
if (currentStatus === "canceled" && status === "delivered") isValidTransition = true;
```

> Lưu ý: `delivered` được xử lý **đúng** là trạng thái kết thúc (TC-ADMIN-08 **PASS**) — chỉ riêng `canceled` bị thủng, cho thấy đây là nhánh cài cắm có chủ đích chứ không phải state machine sai toàn diện.

---

### 🟠 BUG-12 — XSS lưu trữ ở địa chỉ giao hàng

| | |
| --- | --- |
| **TC ID** | TC-ADMIN-14 · Feature FR-18 · High |
| **Ảnh** | [`selenium/bug-snapshots/TC-ADMIN-14.png`](selenium/bug-snapshots/TC-ADMIN-14.png) |
| **Issue** | [#268](https://github.com/DuyITLOR/group05_eshop/issues/268) |
| **Browser** | Tái hiện cả 3 (3/3) |

**Các bước tái hiện** — tạo đơn với `shipping_address` = `<b>xss</b>` → đăng nhập admin → mở tab **Đơn hàng** → quan sát cột "Địa chỉ".

**Expected (SRS §6 FR-18)** — địa chỉ phải hiển thị **an toàn dưới dạng text thuần**; người xem phải thấy đúng chuỗi `<b>xss</b>`.

**Actual** — payload bị **render thành thẻ HTML thật**: chữ "xss" hiển thị **in đậm**, đọc lại nội dung ô chỉ còn `xss`.

**Nguyên nhân gốc** — `frontend-admin/src/App.jsx:799-804`:

```jsx
<td dangerouslySetInnerHTML={{ __html: o.shipping_address || "Chưa cập nhật" }} />
```

Địa chỉ do **người mua tự nhập** và không được escape ở bất kỳ tầng nào.

**Ảnh hưởng** — thay `<b>` bằng `<script>` hoặc `<img onerror=...>` là script chạy **trong phiên của admin**. Xem [Chuỗi khai thác §2](#2-chuỗi-khai-thác--3-bug-ghép-thành-đường-chiếm-quyền-hoàn-chỉnh).

---

### 🟡 BUG-03 — SĐT không bắt đầu bằng `0` lại được chấp nhận

| | |
| --- | --- |
| **TC ID** | TC-PROFILE-08 · Feature FR-04 · Medium |
| **Ảnh** | [`selenium/bug-snapshots/TC-PROFILE-08.png`](selenium/bug-snapshots/TC-PROFILE-08.png) |
| **Issue** | [#269](https://github.com/DuyITLOR/group05_eshop/issues/269) |
| **Browser** | Tái hiện cả 3 (3/3) |

**Các bước tái hiện** — đăng nhập → `/profile` → nhập SĐT `912345678` → "Cập nhật".

**Expected (SRS §2 FR-04)** — SĐT hợp lệ **phải bắt đầu bằng `0`** → giá trị này phải bị **từ chối**.

**Actual** — `"Cập nhật thành công!"`, giá trị sai đặc tả được lưu vào DB.

**Nguyên nhân gốc** — regex `/^[1-9][0-9]{8,9}$/` (`Profile.jsx:43`) **yêu cầu** chữ số đầu là 1–9, tức làm **ngược** đặc tả. Cùng gốc BUG-01/02: SĐT đúng SRS bị chặn, SĐT sai SRS lại lọt.

---

### 🟡 BUG-05 — Giỏ hàng không được xóa sau thanh toán

| | |
| --- | --- |
| **TC ID** | TC-CHECKOUT-03 · Feature FR-08 · Medium |
| **Ảnh** | [`selenium/bug-snapshots/TC-CHECKOUT-03.png`](selenium/bug-snapshots/TC-CHECKOUT-03.png) |
| **Issue** | [#270](https://github.com/DuyITLOR/group05_eshop/issues/270) |
| **Browser** | Tái hiện cả 3 (3/3) |

**Các bước tái hiện** — thêm 1 sản phẩm vào giỏ → `/checkout` → "Xác Nhận Thanh Toán" → thấy "Thanh toán thành công!" → quay lại `/cart`.

**Expected (SRS §4 FR-08)** — **xóa giỏ hàng sau khi thanh toán**; `/cart` phải hiện "Giỏ hàng của bạn đang trống".

**Actual** — giỏ hàng **vẫn còn nguyên** sản phẩm vừa mua.

**Nguyên nhân gốc** — `frontend-web/src/pages/Checkout.jsx:8` có `const { cart, cartTotal, clearCart } = useCart();` nhưng `handleCheckout` (dòng 40–66) **không bao giờ gọi `clearCart()`** — biến được import rồi bỏ quên.

**Ảnh hưởng** — khách dễ **mua trùng** đơn do tưởng chưa thanh toán.

---

### 🟡 BUG-08 — Lỗi biên ngưỡng coupon (`>` thay vì `>=`)

| | |
| --- | --- |
| **TC ID** | TC-CHECKOUT-13 · Feature FR-08 · Medium |
| **Ảnh** | [`selenium/bug-snapshots/TC-CHECKOUT-13.png`](selenium/bug-snapshots/TC-CHECKOUT-13.png) |
| **Issue** | [#271](https://github.com/DuyITLOR/group05_eshop/issues/271) |
| **Browser** | Tái hiện cả 3 (lỗi tầng API) |

**Các bước tái hiện** — gọi `POST /api/apply-coupon` với `{"code":"SAVE10","total_amount":300000}`. Mã `SAVE10` có `min_order_amount = 300000` — đơn **đúng bằng** ngưỡng.

**Expected (SRS §4 FR-09 điều kiện C3)** — `total_amount >= min_order_amount` → đơn đúng 300.000₫ phải được **chấp nhận** (giảm 30.000₫, còn 270.000₫).

**Actual** — HTTP 400 `{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}`.

**Nguyên nhân gốc** — `backend/server.js` kiểm `if (total_amount > coupon.min_order_amount)` — dùng `>` nên **loại trừ đúng điểm biên** mà C3 quy định là hợp lệ. Phải là `>=`.

> Đối chiếu: TC-CHECKOUT-14 (đơn 299.999₫) bị từ chối là **đúng** và **PASS**, xác nhận lỗi nằm chính xác ở điểm biên — đây là giá trị của kỹ thuật **Boundary Value Analysis** (ISTQB FL §4.3).

---

### 🟡 BUG-13 — UI hiện nút "Đánh dấu Đã giao" cho đơn đã hủy

| | |
| --- | --- |
| **TC ID** | TC-ADMIN-16 · Feature FR-18 · Medium |
| **Ảnh** | [`selenium/bug-snapshots/TC-ADMIN-16.png`](selenium/bug-snapshots/TC-ADMIN-16.png) |
| **Issue** | [#272](https://github.com/DuyITLOR/group05_eshop/issues/272) |
| **Browser** | Tái hiện cả 3 (3/3) |

**Các bước tái hiện** — tạo đơn → chuyển sang `canceled` → đăng nhập admin → tab **Đơn hàng** → quan sát cột "Hành động".

**Expected (SRS §5 FR-10)** — `delivered` và `canceled` là **trạng thái kết thúc** → **không** được hiện nút chuyển trạng thái nào.

**Actual** — đơn `canceled` hiện nút **"Đánh dấu Đã giao"**. (Đơn `delivered` xử lý **đúng** — không có nút nào.)

**Nguyên nhân gốc** — `frontend-admin/src/App.jsx:862-869`:

```jsx
{o.status === "canceled" && (
  <button onClick={() => updateOrderStatus(o.id, "delivered")}>Đánh dấu Đã giao</button>
)}
```

Đây là **mặt UI** của BUG-10: backend cho phép chuyển đổi sai, frontend render đúng cái nút để khai thác nó.

---

## 4. Nhóm bug theo nguyên nhân gốc chung

Nhiều bug tuy biểu hiện khác nhau nhưng **cùng một dòng code sai** — sửa gốc thì hết cả nhóm:

| Nhóm | Bug | Nguyên nhân chung |
| ---- | --- | ----------------- |
| Regex SĐT | BUG-01 · BUG-02 · BUG-03 | `Profile.jsx:43` regex `/^[1-9][0-9]{8,9}$/` làm **ngược** đặc tả — chặn SĐT đúng, cho lọt SĐT sai |
| Server tin client | BUG-07 · BUG-09 | `server.js:297-307` không đọc `items`, không tính lại tổng, không kiểm giỏ rỗng |
| `canceled → delivered` | BUG-10 · BUG-13 | `server.js:549-550` nhánh ngoại lệ \+ `App.jsx:862-869` render nút khai thác nó |
| Thiếu kiểm quyền | BUG-04 · BUG-11 | Không kiểm `role`: một ở body request, một ở middleware |

> Tách thành bug riêng vì **biểu hiện, mức độ và cách kiểm khác nhau** — ví dụ BUG-07 (thiệt hại tài chính) và BUG-09 (đơn rác) cùng gốc nhưng hậu quả và cách tái hiện hoàn toàn khác.

---

## 5. Nguyên tắc xử lý — vì sao 39 lượt test vẫn để FAIL

Toàn bộ **13 test case tương ứng 13 bug này được giữ nguyên trạng thái FAIL**, không sửa assertion cho test xanh.

| Nguyên tắc | Áp dụng |
| ---------- | ------- |
| **Assert theo đặc tả, không theo hành vi code** | Mọi `expected` trong file dữ liệu đều trích SRS. Nếu lấy code làm oracle thì 13 defect này bị hợp thức hóa thành "đúng" và test xanh một cách vô nghĩa |
| **Test FAIL là bằng chứng, không phải lỗi cần che** | ISTQB FL §1.2 phân biệt error – defect – failure: 39 lượt FAIL chính là **failure** biểu hiện của 13 **defect** thật |
| **Phân loại trước khi sửa** | 9 lượt FAIL khác đã được xác định là **lỗi script** (selector, parser, trạng thái fixture) → sửa script; 13 TC còn lại là defect SUT → giữ nguyên |
| **Xác minh chéo trước khi kết luận** | Mỗi FAIL đều đối chiếu bằng kênh độc lập (gọi `curl` lên API, đọc source) trước khi ghi vào bug report — tránh báo cáo **bug không tồn tại** |

> ⚠️ **Một lần suýt báo bug giả:** TC-CHECKOUT-05/06 từng FAIL do parser đọc số tiền coupon theo vị trí, trong khi SUT trả **đúng**. Gọi `curl` trực tiếp lên `/api/apply-coupon` cho thấy `{"discount_amount":50000,"final_amount":3950000}` hoàn toàn chính xác → xác định là **lỗi script**, đã sửa, **không** ghi vào bug report. Chi tiết §1.7 dòng 13 [`Main_Report.md`](Main_Report.md).

---

## 6. Bằng chứng và tài liệu liên quan

| Tài liệu | Nội dung |
| -------- | -------- |
| [`selenium/bug-snapshots/`](selenium/bug-snapshots/) | **13 ảnh chụp** `.png` — sinh tự động tại đúng thời điểm test FAIL |
| [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md) | Log gốc sinh tự động mỗi lượt chạy, gồm cả 3 browser (39 mục) |
| [`selenium/reports/`](selenium/reports/) | **9 báo cáo HTML** mochawesome, có banner `Run by: 23127344` \+ ISO timestamp |
| [`github_issues/`](github_issues/) | Ảnh chụp trang GitHub Issues làm bằng chứng đã báo cáo |
| [#260–#272](https://github.com/DuyITLOR/group05_eshop/issues) | 13 GitHub Issue trên repo SUT, mỗi issue kèm ảnh |
| §1.9 [`Main_Report.md`](Main_Report.md) | Bảng bug trong báo cáo chính \+ phân tích nguyên nhân gốc |
| §1.7 [`Main_Report.md`](Main_Report.md) | 19 lỗi của AI khi sinh script — phân biệt rõ với 13 bug của SUT |

**Repo:**

| Repo | Vai trò |
| ---- | ------- |
| [`trwng-thdat/software-testing`](https://github.com/trwng-thdat/software-testing) | Bài làm — script, dữ liệu, báo cáo HTML, ảnh chụp |
| [`DuyITLOR/group05_eshop`](https://github.com/DuyITLOR/group05_eshop) | SUT (EShop) — nơi tạo 13 issue, vì defect thuộc mã nguồn SUT |

> Bug được báo trên repo **chứa mã lỗi**, không phải repo của người kiểm thử — đúng thực tế ngành: issue phải nằm ở nơi lập trình viên sửa được.
