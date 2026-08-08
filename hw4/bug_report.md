# HW04 — Bug Report

> Tài liệu này chứa **nội dung gốc của 13 bug** đã phát hiện qua chạy thật, mỗi bug gồm tiêu đề, mô tả đầy đủ (bước tái hiện · kết quả mong đợi trích SRS · kết quả thực tế · nguyên nhân gốc kèm `file:dòng` · mức độ ảnh hưởng) và ảnh chụp kèm theo.
>
> **Cả 13 bug đã được tạo thành GitHub Issue [#260–#272](https://github.com/DuyITLOR/group05_eshop/issues)** trên repo SUT, mỗi issue có ảnh đính kèm — đáp ứng yêu cầu §6 (bug phải có ở **cả** Markdown **lẫn** GitHub Issues). Link từng issue đã được dán vào §1.9 [`Main_Report.md`](Main_Report.md) và [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md); ảnh chụp trang Issues ở [`github_issues/`](github_issues/).

## Tổng quan 13 bug

| # | Bug ID | TC ID | Feature | Mức độ | Ảnh chụp | Tiêu đề ngắn | Issue |
|---|--------|-------|---------|--------|--------------|--------------|-------|
| 1 | BUG-04 | TC-PROFILE-12 | FR-04 | **Critical** | `selenium/bug-snapshots/TC-PROFILE-12.png` | Leo thang đặc quyền qua `PUT /api/users/me` | [#260](https://github.com/DuyITLOR/group05_eshop/issues/260) |
| 2 | BUG-07 | TC-CHECKOUT-07 | FR-08 | **Critical** | `selenium/bug-snapshots/TC-CHECKOUT-07.png` | Khách tự sửa được tổng tiền đơn hàng | [#261](https://github.com/DuyITLOR/group05_eshop/issues/261) |
| 3 | BUG-11 | TC-ADMIN-12 | FR-18 | **Critical** | `selenium/bug-snapshots/TC-ADMIN-12.png` | Mọi API `/api/admin/*` không kiểm `role` | [#262](https://github.com/DuyITLOR/group05_eshop/issues/262) |
| 4 | BUG-01 | TC-PROFILE-04 | FR-04 | High | `selenium/bug-snapshots/TC-PROFILE-04.png` | SĐT hợp lệ 10 chữ số bị từ chối | [#263](https://github.com/DuyITLOR/group05_eshop/issues/263) |
| 5 | BUG-02 | TC-PROFILE-05 | FR-04 | High | `selenium/bug-snapshots/TC-PROFILE-05.png` | SĐT hợp lệ 11 chữ số bị từ chối | [#264](https://github.com/DuyITLOR/group05_eshop/issues/264) |
| 6 | BUG-06 | TC-CHECKOUT-04 | FR-08 | High | `selenium/bug-snapshots/TC-CHECKOUT-04.png` | Công thức giảm giá percent bị đảo dấu | [#265](https://github.com/DuyITLOR/group05_eshop/issues/265) |
| 7 | BUG-09 | TC-CHECKOUT-16 | FR-08 | High | `selenium/bug-snapshots/TC-CHECKOUT-16.png` | Giỏ rỗng vẫn tạo được đơn hàng | [#266](https://github.com/DuyITLOR/group05_eshop/issues/266) |
| 8 | BUG-10 | TC-ADMIN-07 | FR-18 | High | `selenium/bug-snapshots/TC-ADMIN-07.png` | Cho phép `canceled → delivered` | [#267](https://github.com/DuyITLOR/group05_eshop/issues/267) |
| 9 | BUG-12 | TC-ADMIN-14 | FR-18 | High | `selenium/bug-snapshots/TC-ADMIN-14.png` | XSS lưu trữ ở địa chỉ giao hàng | [#268](https://github.com/DuyITLOR/group05_eshop/issues/268) |
| 10 | BUG-03 | TC-PROFILE-08 | FR-04 | Medium | `selenium/bug-snapshots/TC-PROFILE-08.png` | SĐT không bắt đầu bằng `0` lại được chấp nhận | [#269](https://github.com/DuyITLOR/group05_eshop/issues/269) |
| 11 | BUG-05 | TC-CHECKOUT-03 | FR-08 | Medium | `selenium/bug-snapshots/TC-CHECKOUT-03.png` | Giỏ hàng không được xóa sau thanh toán | [#270](https://github.com/DuyITLOR/group05_eshop/issues/270) |
| 12 | BUG-08 | TC-CHECKOUT-13 | FR-08 | Medium | `selenium/bug-snapshots/TC-CHECKOUT-13.png` | Lỗi biên ngưỡng coupon (`>` thay vì `>=`) | [#271](https://github.com/DuyITLOR/group05_eshop/issues/271) |
| 13 | BUG-13 | TC-ADMIN-16 | FR-18 | Medium | `selenium/bug-snapshots/TC-ADMIN-16.png` | UI hiện nút chuyển tiếp ở trạng thái kết thúc | [#272](https://github.com/DuyITLOR/group05_eshop/issues/272) |

> Cả 13 bug đều **tái hiện giống hệt trên Chrome, Edge và Firefox** — không có bug nào chỉ xảy ra trên một engine.

---

# 🔴 CRITICAL

## BUG-04 — Issue **[#260](https://github.com/DuyITLOR/group05_eshop/issues/260)**

**Title:**

```
[BUG-04][Critical][FR-04] Leo thang đặc quyền: user tự đặt role="admin" qua PUT /api/users/me
```

**Description:**

```markdown
## Mô tả

Endpoint `PUT /api/users/me` nhận cả trường `role` từ request body và ghi thẳng vào DB mà không kiểm quyền. Một user thường có thể tự nâng mình thành `admin` chỉ bằng một request.

## Môi trường

- Backend `http://localhost:3000` · Node v22.22.1
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-PROFILE-12` — `selenium/tests/fr04-profile.spec.ts`

## Các bước tái hiện

1. Đăng nhập bằng tài khoản user thường, lấy JWT.
2. Gọi `PUT /api/users/me` với body `{"name":"x","phone":"912345678","shipping_address":"y","role":"admin"}`.
3. Gọi `GET /api/users/me` đọc lại bản ghi.

## Kết quả mong đợi (theo SRS)

SRS §2 FR-04: người dùng **không thể** tự thay đổi thuộc tính `role`. Request phải bị từ chối hoặc trường `role` bị bỏ qua; `role` vẫn là `user`.

## Kết quả thực tế

HTTP 200. `role` đổi từ `user` → `admin` và **tồn tại vĩnh viễn trong DB**. Tài khoản này sau đó truy cập được toàn bộ khu vực admin.

## Nguyên nhân gốc

`backend/server.js:119-125` — destructure `role` từ `req.body` rồi ghép thẳng vào câu `UPDATE`, không hề kiểm quyền người gọi.

## Mức độ / Ảnh hưởng

**Critical.** Bất kỳ user nào cũng tự chiếm được quyền admin. Kết hợp với BUG-11 và BUG-12 tạo thành chuỗi chiếm quyền hoàn chỉnh.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-PROFILE-12.png`

---

## BUG-07 — Issue **[#261](https://github.com/DuyITLOR/group05_eshop/issues/261)**

**Title:**

```
[BUG-07][Critical][FR-08] Khách tự sửa được tổng tiền, server lưu thẳng giá trị client gửi
```

**Description:**

```markdown
## Mô tả

Ô tổng tiền ở màn hình thanh toán là `<input type="number">` cho phép người dùng sửa trực tiếp, và `POST /api/checkout` lưu thẳng `total_amount` do client gửi lên mà **không tính lại** từ giỏ hàng. Khách có thể trả **1₫** cho đơn 6.000.000₫.

## Môi trường

- Web `http://localhost:5173` · Backend `http://localhost:3000`
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-CHECKOUT-07` — `selenium/tests/fr08-checkout.spec.ts`

## Các bước tái hiện

1. Đăng nhập, thêm "Tai nghe AirPods Pro 2" (6.000.000₫) vào giỏ.
2. Vào `/checkout` — quan sát ô "Tổng tiền thanh toán (VND)" **sửa được**.
3. Sửa giá trị thành `1`, bấm "Xác Nhận Thanh Toán".
4. Gọi `GET /api/orders/my-orders` kiểm tra đơn vừa tạo.

## Kết quả mong đợi (theo SRS)

SRS §4 FR-08: tổng tiền **không cho sửa trực tiếp**; backend **tự tính lại** từ giỏ hàng. Đơn phải được lưu với `total_amount = 6000000`.

## Kết quả thực tế

Thanh toán thành công. Đơn được tạo với `total_amount = 1`.

## Nguyên nhân gốc

Lỗi ở **hai tầng**, sửa một tầng chưa đủ:

- `frontend-web/src/pages/Checkout.jsx:93-102` — render tổng tiền bằng `<input type="number">` có `onChange` sửa `editableTotal`, rồi gửi chính giá trị đó đi.
- `backend/server.js:297-307` — nhận `total_amount` từ body và `INSERT` thẳng, **không đọc `items` để tính lại**.

## Mức độ / Ảnh hưởng

**Critical.** Thiệt hại tài chính trực tiếp, khai thác được chỉ bằng thao tác trên trình duyệt, không cần công cụ gì thêm.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-CHECKOUT-07.png`

---

## BUG-11 — Issue **[#262](https://github.com/DuyITLOR/group05_eshop/issues/262)**

**Title:**

```
[BUG-11][Critical][FR-18] Middleware authenticateToken không kiểm role — mọi API /api/admin/* mở cho user thường
```

**Description:**

```markdown
## Mô tả

Middleware `authenticateToken` chỉ verify chữ ký JWT mà **không hề kiểm `role`**. Toàn bộ **6 endpoint** `/api/admin/*` đều chỉ dùng đúng middleware này, nên một token user thường truy cập được tất cả.

## Môi trường

- Backend `http://localhost:3000`
- Tầng API — độc lập trình duyệt (tái hiện trên **cả 3**)
- Test case: `TC-ADMIN-12` — `selenium/tests/fr18-admin-orders.spec.ts`

## Các bước tái hiện

1. Đăng nhập bằng tài khoản user thường (`role = "user"`), lấy JWT.
2. Gọi `GET /api/admin/orders` với header `Authorization: Bearer <token user thường>`.

## Kết quả mong đợi (theo SRS)

SRS §6 FR-12: mọi API `/api/admin/*` yêu cầu JWT hợp lệ **và** `role = 'admin'`. Phải trả **HTTP 401 hoặc 403**.

## Kết quả thực tế

**HTTP 200** kèm **toàn bộ đơn hàng của mọi người dùng** (id, tên người mua, tổng tiền, địa chỉ giao hàng).

## Nguyên nhân gốc

`backend/server.js:100-110` — `authenticateToken` gọi `jwt.verify` rồi gán `req.user = user` và `next()`, **không đọc `user.role`**.

Các endpoint bị ảnh hưởng: `POST /api/admin/import-products`, `POST|DELETE /api/admin/coupons`, `GET|DELETE /api/admin/users`, `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status`.

Frontend admin **có** kiểm `role !== "admin"` tại `frontend-admin/src/App.jsx:65-68`, nhưng đó chỉ là kiểm **phía client** — hoàn toàn vô nghĩa trước một request gọi thẳng API.

## Mức độ / Ảnh hưởng

**Critical.** Rò rỉ dữ liệu toàn hệ thống (thông tin cá nhân, địa chỉ của mọi khách hàng) và cho phép user thường **xóa user, xóa coupon, đổi trạng thái đơn**. Đây là defect nghiêm trọng nhất phát hiện được trong bài.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-ADMIN-12.png`

---

# 🟠 HIGH

## BUG-01 — Issue **[#263](https://github.com/DuyITLOR/group05_eshop/issues/263)**

**Title:**

```
[BUG-01][High][FR-04] SĐT hợp lệ 10 chữ số bắt đầu bằng 0 bị từ chối
```

**Description:**

```markdown
## Mô tả

Số điện thoại `0123456789` — đúng đặc tả (bắt đầu bằng `0`, 10 chữ số) — bị hệ thống từ chối.

## Môi trường

- Web `http://localhost:5173` → `/profile`
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-PROFILE-04` — `selenium/tests/fr04-profile.spec.ts`

## Các bước tái hiện

1. Đăng nhập, vào `/profile`.
2. Nhập SĐT `0123456789`, bấm "Cập nhật".

## Kết quả mong đợi (theo SRS)

SRS §2 FR-04: SĐT hợp lệ **bắt đầu bằng `0`, dài 10–11 chữ số**. `0123456789` đúng biên dưới → phải được **chấp nhận** và lưu.

## Kết quả thực tế

Alert `"Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."`, dữ liệu không được lưu.

## Nguyên nhân gốc

`frontend-web/src/pages/Profile.jsx:43` dùng regex `/^[1-9][0-9]{8,9}$/` — yêu cầu chữ số đầu là **1–9** và độ dài **9–10**, trong khi SRS yêu cầu chữ số đầu là **`0`** và độ dài **10–11**. Hai luật **loại trừ nhau ngay ở chữ số đầu tiên**.

Cùng gốc với BUG-02 và BUG-03.

## Mức độ / Ảnh hưởng

**High.** Người dùng Việt Nam **không thể** lưu số điện thoại thật của mình — mọi SĐT đúng chuẩn VN đều bị chặn.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-PROFILE-04.png`

---

## BUG-02 — Issue **[#264](https://github.com/DuyITLOR/group05_eshop/issues/264)**

**Title:**

```
[BUG-02][High][FR-04] SĐT hợp lệ 11 chữ số bắt đầu bằng 0 bị từ chối
```

**Description:**

```markdown
## Mô tả

Số điện thoại `01234567890` — đúng đặc tả (bắt đầu bằng `0`, 11 chữ số, biên trên) — bị từ chối.

## Môi trường

- Web `http://localhost:5173` → `/profile`
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-PROFILE-05` — `selenium/tests/fr04-profile.spec.ts`

## Các bước tái hiện

1. Đăng nhập, vào `/profile`.
2. Nhập SĐT `01234567890`, bấm "Cập nhật".

## Kết quả mong đợi (theo SRS)

SRS §2 FR-04: 11 chữ số là **biên trên hợp lệ** → phải được chấp nhận và lưu.

## Kết quả thực tế

Alert `"Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."`, dữ liệu không được lưu.

## Nguyên nhân gốc

`frontend-web/src/pages/Profile.jsx:43` — regex `/^[1-9][0-9]{8,9}$/` chỉ cho tối đa **10** chữ số và cấm chữ số đầu là `0`. Cùng gốc với BUG-01 và BUG-03.

## Mức độ / Ảnh hưởng

**High.** Chặn toàn bộ nhóm SĐT 11 chữ số hợp lệ.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-PROFILE-05.png`

---

## BUG-06 — Issue **[#265](https://github.com/DuyITLOR/group05_eshop/issues/265)**

**Title:**

```
[BUG-06][High][FR-08] Công thức giảm giá percent bị đảo dấu — khách bị tính gấp 10 lần
```

**Description:**

```markdown
## Mô tả

Công thức tính giảm giá cho coupon loại `percent` bị sai, cho ra **số tiền giảm âm**, khiến khách phải trả **nhiều hơn** giá gốc.

## Môi trường

- Backend `http://localhost:3000` · Web `http://localhost:5173`
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-CHECKOUT-04` — `selenium/tests/fr08-checkout.spec.ts`

## Các bước tái hiện

1. Thêm "Bàn phím cơ Keychron Q1" (4.000.000₫) vào giỏ, vào `/checkout`.
2. Nhập mã `SAVE10` (giảm 10%, ngưỡng 300.000₫), bấm "Áp dụng".

## Kết quả mong đợi (theo SRS)

SRS §4 FR-09: `SAVE10` giảm **10%** → `discount_amount = 400.000₫`, `final_amount = 3.600.000₫`.

## Kết quả thực tế

`discount_amount = -36.000.000₫` · `final_amount = 40.000.000₫` — khách phải trả **gấp 10 lần** giá gốc.

Xác minh trực tiếp qua API:
POST /api/apply-coupon {"code":"SAVE10","total_amount":4000000}
→ {"discount_amount":-36000000,"final_amount":40000000}

## Nguyên nhân gốc

`backend/server.js` (`POST /api/apply-coupon`) tính:
discount_amount = Math.floor(total_amount \* (1 - coupon.discount_value))

`discount_value` được seed là **10** (nghĩa là 10%), nên biểu thức thành `total × (1 − 10) = −9 × total`. Công thức đúng phải là `total × discount_value / 100`. Lỗi xuất hiện ở **cả hai** nhánh (có và không có `user_id`).

## Mức độ / Ảnh hưởng

**High.** Mọi coupon loại `percent` đều tính sai. Khách bị tính tiền cao gấp nhiều lần — thiệt hại tài chính và mất uy tín nghiêm trọng.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-CHECKOUT-04.png`

---

## BUG-09 — Issue **[#266](https://github.com/DuyITLOR/group05_eshop/issues/266)**

**Title:**

```
[BUG-09][High][FR-08] Giỏ hàng rỗng vẫn tạo được đơn hàng
```

**Description:**

```markdown
## Mô tả

`POST /api/checkout` **bỏ qua hoàn toàn** mảng `items` và không kiểm giỏ rỗng, nên vẫn tạo đơn hàng dù không có sản phẩm nào.

## Môi trường

- Web `http://localhost:5173` · Backend `http://localhost:3000`
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-CHECKOUT-16` — `selenium/tests/fr08-checkout.spec.ts`

## Các bước tái hiện

1. Đăng nhập, **không** thêm sản phẩm nào vào giỏ.
2. Vào thẳng `/checkout` — danh sách sản phẩm trống.
3. Bấm "Xác Nhận Thanh Toán".
4. Gọi `GET /api/orders/my-orders`.

## Kết quả mong đợi (theo SRS)

SRS §4 FR-08: **không được tạo đơn khi giỏ rỗng** — phải có thông báo lỗi và không sinh bản ghi nào.

## Kết quả thực tế

Hiện "Thanh toán thành công!" và **sinh thêm 1 bản ghi** trong bảng `orders`.

## Nguyên nhân gốc

`backend/server.js:297-307` — chỉ đọc `total_amount` và `shipping_address` từ body, **không hề dùng `items`** và không kiểm giỏ rỗng trước khi `INSERT`. Cùng gốc với BUG-07 (server tin tuyệt đối vào client).

## Mức độ / Ảnh hưởng

**High.** Sinh đơn rác trong hệ thống, làm sai thống kê doanh thu và có thể bị lạm dụng để spam.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-CHECKOUT-16.png`

---

## BUG-10 — Issue **[#267](https://github.com/DuyITLOR/group05_eshop/issues/267)**

**Title:**

```
[BUG-10][High][FR-18] Cho phép chuyển canceled → delivered, vi phạm trạng thái kết thúc
```

**Description:**

```markdown
## Mô tả

Đơn hàng đã hủy (`canceled`) vẫn chuyển được sang `delivered`, dù đây là trạng thái **kết thúc** theo đặc tả.

## Môi trường

- Backend `http://localhost:3000` · Admin `http://localhost:5174`
- Tầng API — độc lập trình duyệt (tái hiện trên **cả 3**)
- Test case: `TC-ADMIN-07` — `selenium/tests/fr18-admin-orders.spec.ts`

## Các bước tái hiện

1. Tạo một đơn hàng, chuyển trạng thái sang `canceled`.
2. Gọi `PUT /api/admin/orders/:id/status` với body `{"status":"delivered"}`.
3. Đọc lại đơn bằng `GET /api/orders/:id`.

## Kết quả mong đợi (theo SRS)

SRS §5 FR-10: `canceled` là **trạng thái kết thúc**, không được chuyển tiếp sang bất kỳ trạng thái nào. Request phải bị từ chối (HTTP 400).

## Kết quả thực tế

**HTTP 200** `{"message":"Order status updated"}` — `status` đổi thành `delivered`. Một đơn đã hủy trở thành đã giao.

## Nguyên nhân gốc

`backend/server.js:549-550` có nhánh ngoại lệ:
if (currentStatus === "canceled" && status === "delivered") isValidTransition = true;

Lưu ý: `delivered` được xử lý **đúng** là trạng thái kết thúc (TC-ADMIN-08 PASS) — chỉ riêng `canceled` bị thủng.

Liên quan BUG-13 (UI hiện đúng cái nút để khai thác nhánh này).

## Mức độ / Ảnh hưởng

**High.** Phá vỡ tính toàn vẹn của vòng đời đơn hàng; đơn đã hủy vẫn được tính vào doanh thu `delivered`.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-ADMIN-07.png`

---

## BUG-12 — Issue **[#268](https://github.com/DuyITLOR/group05_eshop/issues/268)**

**Title:**

```
[BUG-12][High][FR-18] XSS lưu trữ: địa chỉ giao hàng được render thành HTML trong trang admin
```

**Description:**

```markdown
## Mô tả

Cột "Địa chỉ" trong bảng quản lý đơn hàng của admin render giá trị bằng `dangerouslySetInnerHTML`. Địa chỉ do **người mua tự nhập** và không được escape ở bất kỳ tầng nào → **stored XSS**.

## Môi trường

- Admin `http://localhost:5174` (tab **Đơn hàng**)
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-ADMIN-14` — `selenium/tests/fr18-admin-orders.spec.ts`

## Các bước tái hiện

1. Tạo đơn hàng với `shipping_address` = `<b>xss</b>`.
2. Đăng nhập trang admin, mở tab **Đơn hàng**.
3. Quan sát cột "Địa chỉ" của đơn vừa tạo.

## Kết quả mong đợi (theo SRS)

SRS §6 FR-18: địa chỉ giao hàng phải hiển thị **an toàn dưới dạng text thuần** — người xem phải thấy đúng chuỗi `<b>xss</b>`.

## Kết quả thực tế

Payload bị **render thành thẻ HTML thật**: chữ "xss" hiển thị **in đậm**, đọc lại nội dung ô chỉ còn `xss`. Thẻ `<b>` đã được trình duyệt thực thi.

## Nguyên nhân gốc

`frontend-admin/src/App.jsx:799-804`:
<td dangerouslySetInnerHTML={{ __html: o.shipping_address || "Chưa cập nhật" }} />

## Mức độ / Ảnh hưởng

**High.** Thay `<b>` bằng `<script>` hoặc `<img onerror=...>` là script chạy **trong phiên của admin**. Kết hợp BUG-11 (API admin không kiểm quyền) tạo thành đường chiếm quyền hoàn chỉnh: kẻ tấn công chỉ cần **đặt một đơn hàng** là đưa được mã độc vào trang quản trị.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-ADMIN-14.png`

---

# 🟡 MEDIUM

## BUG-03 — Issue **[#269](https://github.com/DuyITLOR/group05_eshop/issues/269)**

**Title:**

```
[BUG-03][Medium][FR-04] SĐT không bắt đầu bằng 0 lại được chấp nhận
```

**Description:**

```markdown
## Mô tả

Số điện thoại `912345678` — **sai** đặc tả (không bắt đầu bằng `0`, chỉ 9 chữ số) — lại được hệ thống chấp nhận và lưu.

## Môi trường

- Web `http://localhost:5173` → `/profile`
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-PROFILE-08` — `selenium/tests/fr04-profile.spec.ts`

## Các bước tái hiện

1. Đăng nhập, vào `/profile`.
2. Nhập SĐT `912345678`, bấm "Cập nhật".

## Kết quả mong đợi (theo SRS)

SRS §2 FR-04: SĐT hợp lệ **phải bắt đầu bằng số `0`** → giá trị này phải bị **từ chối**.

## Kết quả thực tế

`"Cập nhật thành công!"` — giá trị sai đặc tả được lưu vào DB.

## Nguyên nhân gốc

`frontend-web/src/pages/Profile.jsx:43` — regex `/^[1-9][0-9]{8,9}$/` **yêu cầu** chữ số đầu là 1–9, tức là làm **ngược** đặc tả. Cùng gốc với BUG-01 và BUG-02: SĐT đúng SRS bị chặn, SĐT sai SRS lại lọt.

## Mức độ / Ảnh hưởng

**Medium.** Dữ liệu SĐT sai định dạng lọt vào DB, ảnh hưởng khâu liên hệ giao hàng.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-PROFILE-08.png`

---

## BUG-05 — Issue **[#270](https://github.com/DuyITLOR/group05_eshop/issues/270)**

**Title:**

```
[BUG-05][Medium][FR-08] Giỏ hàng không được xóa sau khi thanh toán thành công
```

**Description:**

```markdown
## Mô tả

Sau khi thanh toán thành công, giỏ hàng vẫn còn nguyên sản phẩm vừa mua.

## Môi trường

- Web `http://localhost:5173`
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-CHECKOUT-03` — `selenium/tests/fr08-checkout.spec.ts`

## Các bước tái hiện

1. Đăng nhập, thêm 1 sản phẩm vào giỏ.
2. Vào `/checkout`, bấm "Xác Nhận Thanh Toán", thấy "Thanh toán thành công!".
3. Quay lại `/cart`.

## Kết quả mong đợi (theo SRS)

SRS §4 FR-08: **xóa giỏ hàng sau khi thanh toán**. `/cart` phải hiện "Giỏ hàng của bạn đang trống".

## Kết quả thực tế

Giỏ hàng **vẫn còn nguyên** sản phẩm vừa mua.

## Nguyên nhân gốc

`frontend-web/src/pages/Checkout.jsx:8` có `const { cart, cartTotal, clearCart } = useCart();` nhưng hàm `handleCheckout` (dòng 40–66) **không bao giờ gọi `clearCart()`** — biến được import rồi bỏ quên.

## Mức độ / Ảnh hưởng

**Medium.** Khách dễ **mua trùng** đơn do tưởng chưa thanh toán; trải nghiệm sai lệch.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-CHECKOUT-03.png`

---

## BUG-08 — Issue **[#271](https://github.com/DuyITLOR/group05_eshop/issues/271)**

**Title:**

```
[BUG-08][Medium][FR-08] Lỗi biên: đơn đúng bằng ngưỡng tối thiểu bị từ chối áp coupon
```

**Description:**

```markdown
## Mô tả

Điều kiện ngưỡng tối thiểu của coupon dùng toán tử `>` thay vì `>=`, nên đơn hàng có giá trị **đúng bằng** ngưỡng bị từ chối.

## Môi trường

- Backend `http://localhost:3000`
- Tầng API — độc lập trình duyệt (tái hiện trên **cả 3**)
- Test case: `TC-CHECKOUT-13` — `selenium/tests/fr08-checkout.spec.ts`

## Các bước tái hiện

1. Gọi `POST /api/apply-coupon` với `{"code":"SAVE10","total_amount":300000}`.
2. `SAVE10` có `min_order_amount = 300000` — tức đơn **đúng bằng** ngưỡng.

## Kết quả mong đợi (theo SRS)

SRS §4 FR-09 điều kiện C3: `total_amount >= min_order_amount`. Đơn đúng 300.000₫ phải được **chấp nhận** (giảm 30.000₫, còn 270.000₫).

## Kết quả thực tế

HTTP 400 — `{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}`.

Đối chiếu: TC-CHECKOUT-14 (đơn 299.999₫) bị từ chối là **đúng**, xác nhận lỗi nằm chính xác ở điểm biên.

## Nguyên nhân gốc

`backend/server.js` (`POST /api/apply-coupon`) kiểm:
if (total_amount > coupon.min_order_amount)

Dùng `>` nên **loại trừ đúng điểm biên** mà FR-09 C3 quy định là hợp lệ. Phải là `>=`.

## Mức độ / Ảnh hưởng

**Medium.** Khách đủ điều kiện nhưng không dùng được mã giảm giá — lỗi off-by-one kinh điển, ảnh hưởng đúng nhóm khách mua sát ngưỡng.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-CHECKOUT-13.png`

---

## BUG-13 — Issue **[#272](https://github.com/DuyITLOR/group05_eshop/issues/272)**

**Title:**

```
[BUG-13][Medium][FR-18] UI hiện nút "Đánh dấu Đã giao" cho đơn đã hủy
```

**Description:**

```markdown
## Mô tả

Trong bảng quản lý đơn hàng, đơn ở trạng thái `canceled` vẫn hiển thị nút **"Đánh dấu Đã giao"** — mời admin thực hiện một chuyển đổi mà đặc tả cấm.

## Môi trường

- Admin `http://localhost:5174` (tab **Đơn hàng**)
- Trình duyệt: Chrome 151 · Edge 151 · Firefox 153 (tái hiện trên **cả 3**)
- Test case: `TC-ADMIN-16` — `selenium/tests/fr18-admin-orders.spec.ts`

## Các bước tái hiện

1. Tạo đơn hàng và chuyển sang trạng thái `canceled`.
2. Đăng nhập trang admin, mở tab **Đơn hàng**.
3. Quan sát cột "Hành động" của đơn đó.

## Kết quả mong đợi (theo SRS)

SRS §5 FR-10: `delivered` và `canceled` là **trạng thái kết thúc** → **không** được hiện bất kỳ nút chuyển trạng thái nào.

## Kết quả thực tế

Đơn `canceled` hiện nút **"Đánh dấu Đã giao"**. (Đơn `delivered` xử lý **đúng** — không có nút nào.)

## Nguyên nhân gốc

`frontend-admin/src/App.jsx:862-869` — khối `{o.status === "canceled" && (<button onClick={() => updateOrderStatus(o.id, "delivered")}>Đánh dấu Đã giao</button>)}`.

Đây là **mặt UI** của BUG-10: backend cho phép chuyển đổi sai, còn frontend render đúng cái nút để khai thác nó.

## Mức độ / Ảnh hưởng

**Medium.** Dẫn dắt admin thực hiện thao tác sai chỉ bằng một cú nhấp, làm hỏng dữ liệu đơn hàng.
```

**📎 Ảnh chụp:** `selenium/bug-snapshots/TC-ADMIN-16.png`

---

## Nơi bug được ghi nhận

| Tài liệu | Nội dung |
| -------- | -------- |
| GitHub Issues [#260–#272](https://github.com/DuyITLOR/group05_eshop/issues) | 13 issue trên repo SUT, mỗi issue kèm ảnh chụp |
| [`github_issues/`](github_issues/) | Ảnh chụp trang Issues làm bằng chứng đã báo cáo |
| §1.9 [`Main_Report.md`](Main_Report.md) | Bảng 13 bug kèm link issue, nguyên nhân gốc |
| [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md) | Log sinh tự động mỗi lượt chạy; link issue lấy từ bảng `FILED` trong `utils/bugReporter.ts` nên không mất khi chạy lại |

> Bug được báo trên repo của **SUT** (`DuyITLOR/group05_eshop`), không phải repo bài làm ([`trwng-thdat/software-testing`](https://github.com/trwng-thdat/software-testing)) — vì defect thuộc mã nguồn EShop, phải nằm ở nơi lập trình viên sửa được.

> ⚠️ Ảnh chụp trong `selenium/bug-snapshots/` là **screenshot toàn trang trình duyệt tại đúng thời điểm test fail**, sinh tự động bởi `utils/bugReporter.ts`. Với các bug ở **tầng API** (BUG-08, BUG-10, BUG-11), ảnh chỉ thể hiện trạng thái trình duyệt chứ không thể hiện request/response — bằng chứng thật nằm ở phần "Kết quả thực tế" trích từ log chạy và ở báo cáo HTML tương ứng trong `selenium/reports/`.
