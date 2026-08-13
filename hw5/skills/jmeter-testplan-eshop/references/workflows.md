# Luồng nghiệp vụ E2E cho EShop

HW05 yêu cầu **một luồng duy nhất** phủ cả ba nhóm endpoint, và cả ba test plan (Load/Stress/Spike) đều chạy cùng luồng đó — chỉ khác hồ sơ tải và listener.

## Phân nhóm endpoint theo api_spec.md

| Nhóm | Endpoint có thể dùng | Mục spec |
|---|---|---|
| **Auth-heavy** | `POST /api/login` | §1.2 |
| | `POST /api/register` | §1.1 |
| | `POST /api/forgot-password` | §1.3 |
| **Read-heavy** | `GET /api/users/me` | §2.1 |
| | `GET /api/products` (có `?search=`) | §3.1 |
| | `GET /api/products/:id` | §3.2 |
| | `GET /api/categories` | §3.4 |
| | `GET /api/cart` | §4.1 |
| | `GET /api/orders/my-orders` | §4.4 |
| | `GET /api/orders/:id` | §4.5 |
| | `GET /api/admin/users` | §6.1 |
| | `GET /api/admin/orders` | §6.2 |
| **Transactional** | `PUT /api/users/me` | §2.2 |
| | `POST /api/cart` | §4.2 |
| | `POST /api/checkout` | §4.3 |
| | `PUT /api/orders/:id/cancel` | §4.6 |
| | `POST /api/apply-coupon` | §5.1 ⚠️ |
| | `POST /api/categories` | §3.4 |
| | `POST /api/admin/import-products` | §6.3 |
| | `PUT /api/admin/orders/:id/status` | §6.2 |

⚠️ **`POST /api/apply-coupon` chưa rõ có ghi CSDL không.** §5.1 mô tả nó *tính toán* `discount_amount` / `final_amount` — có thể thuần tính toán. Nhưng §6.4 định nghĩa `max_uses_per_user`, hàm ý số lần dùng được lưu ở đâu đó. **Phải hỏi người dùng đã kiểm chứng chưa** trước khi xếp endpoint này vào nhóm transactional.

## Luồng đã dựng sẵn

### Luồng A — Hồ sơ cá nhân + lịch sử đơn hàng

```
1. POST /api/login            §1.2  [auth-heavy]     → trích $.token, $.user.id
2. GET  /api/users/me         §2.1  [read-heavy]     → assert $.email khớp CSV
3. GET  /api/orders/my-orders §4.4  [read-heavy]     → trích $[0].id (tùy chọn)
4. PUT  /api/users/me         §2.2  [transactional]  → body từ profiles.csv
5. POST /api/apply-coupon     §5.1  [transactional]  → assert có $.final_amount
```

### Luồng B — Mua sắm (thường bị trùng, hỏi trước khi dùng)

```
1. POST /api/login            §1.2  [auth-heavy]
2. GET  /api/products?search= §3.1  [read-heavy]     → trích product id
3. GET  /api/products/:id     §3.2  [read-heavy]
4. POST /api/cart             §4.2  [transactional]
5. POST /api/checkout         §4.3  [transactional]
```

### Luồng C — Quản trị

```
1. POST /api/login            §1.2  [auth-heavy]     (tài khoản admin)
2. GET  /api/admin/orders     §6.2  [read-heavy]
3. GET  /api/admin/users      §6.1  [read-heavy]
4. POST /api/admin/import-products §6.3 [transactional]
5. PUT  /api/admin/orders/:id/status §6.2 [transactional]
```

## Correlation chuẩn

| Biến | Trích từ | JSON Path | Dùng ở | Giá trị mặc định |
|---|---|---|---|---|
| `authToken` | bước 1 | `$.token` | header `Authorization: Bearer` | `TOKEN_NOT_FOUND` |
| `userId` | bước 1 | `$.user.id` | body request | `USERID_NOT_FOUND` |
| `orderId` | bước lấy đơn hàng | `$[0].id` | bước hủy đơn | `ORDERID_NOT_FOUND` |
| `productId` | bước tìm sản phẩm | `$[0].id` | bước xem chi tiết, thêm giỏ | `PRODUCTID_NOT_FOUND` |

⚠️ **`$.token` và `$.user.id` chưa được kiểm chứng.** §1.2 chỉ ghi "trả về chuỗi JWT `token` và thông tin `user`" mà không nêu cấu trúc JSON chính xác. **Luôn hỏi người dùng đã đăng nhập thử bằng curl chưa.** Nếu cấu trúc thật khác (ví dụ `$.data.token`), extractor sẽ trả về giá trị mặc định, If Controller chặn toàn bộ các bước sau, và bài test chỉ đo mỗi endpoint login mà không báo lỗi gì.

## Assertion theo bước

Mọi bước phải có **ít nhất hai** assertion: status code **và** nội dung body. Chỉ kiểm status code là không đủ vì server có thể trả 200 kèm khung lỗi.

| Bước | Assertion tối thiểu |
|---|---|
| Đăng nhập | HTTP 200 + `$.token` tồn tại, không rỗng |
| Đọc dữ liệu cá nhân | HTTP 200 + một trường khớp giá trị từ CSV (phát hiện lẫn token khi tải cao) |
| Đọc danh sách | HTTP 200 + body là mảng JSON hợp lệ (**không** yêu cầu khác rỗng — tài khoản mới seed có thể chưa có dữ liệu) |
| Ghi dữ liệu | HTTP 200 + server trả lại đúng giá trị vừa ghi (bằng chứng lệnh UPDATE đã commit) |
| Tính toán | HTTP 200 + có trường kết quả mà spec quy định |

**Không dùng Duration Assertion** trừ khi người dùng yêu cầu rõ: nó tính response chậm-nhưng-đúng thành lỗi, làm lẫn lộn độ trễ với thất bại. Phân tích độ trễ qua percentile trong `.jtl` thay vì assert.

## Ràng buộc FR-02 — khóa tài khoản

SUT khóa tài khoản sau 3 lần đăng nhập **thất bại**. Ảnh hưởng tới thiết kế CSV:

- Nếu mật khẩu trong CSV luôn đúng → không kích hoạt lockout → dùng chung tài khoản an toàn → `recycle=true` được
- Nếu có chủ đích test sai mật khẩu → phải mỗi VU một tài khoản và có bước reset

⚠️ Điều kiện chưa xác minh: **lockout có reset bộ đếm khi đăng nhập thành công không?** Nếu không reset mà cộng dồn thì `recycle=true` vẫn gây khóa sau nhiều vòng lặp. Phải hỏi người dùng đọc mã nguồn SUT xác nhận.

## Quy tắc không trùng lặp

HW05 cấm hai thành viên cùng nhóm test **cùng một luồng**. `POST /api/login` được dùng chung là chấp nhận được vì mọi luồng auth-heavy đều cần token — điều phải khác nhau là các bước read-heavy và transactional.

Khi người dùng chọn luồng, hỏi: *"Các bạn cùng nhóm đang test luồng nào?"*
