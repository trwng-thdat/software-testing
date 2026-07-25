# Đặc tả Yêu cầu Hệ thống (System Requirements Specification)

# Lumiere Cinema — Phiên bản dành cho Kiểm thử Phần mềm

> **Phạm vi tài liệu**: Mô tả các yêu cầu nghiệp vụ và hành vi hệ thống Lumiere Cinema dựa trên source code hiện tại trong `src/` và tài liệu dự án trong `docs/`.
> Sinh viên có thể dùng tài liệu này làm cơ sở thiết kế test case, kiểm thử thủ công/tự động, và đối chiếu việc triển khai thực tế.

---

## 1. Tổng quan Hệ thống

Lumiere Cinema là website đặt vé xem phim và mua snack cho khách hàng trẻ, đồng thời cung cấp các công cụ quản trị vận hành rạp cho nhân viên.

| Thành phần | Công nghệ | URL mặc định |
| ---------- | --------- | ------------ |
| Backend API | Node.js + Express + MongoDB/Mongoose + Redis | `http://localhost:5000` |
| Frontend Web | React 19 + Vite + Tailwind CSS | `http://localhost:5173` |
| Dịch vụ phụ trợ | Nodemailer, Redis cache, Gemini API cho chatbot/RAG | Theo `.env` |

**Biến môi trường chính:**

- Backend: `PORT`, `MONGO_URI` hoặc `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `EMAIL_USER`, `EMAIL_PASS`, `GEMINI_API_KEY`, tùy chọn `REDIS_URL`.
- Frontend: `VITE_API_BASE_URL`; nếu không cấu hình, frontend dùng `http://localhost:5000`.

**Tài khoản mặc định:** repository không khai báo tài khoản seed mặc định trong README hoặc `.env.example`; dữ liệu tài khoản phụ thuộc CSDL đang dùng.

---

## 2. Vai trò và Kiểm soát truy cập

### FR-01: Vai trò người dùng

- Hệ thống hỗ trợ các role: `customer`, `cashier`, `checkincounter`, `branchmanager`, `administrator`.
- Một user có thể có nhiều role trong mảng `roles`.
- User chỉ có `customer` hoặc chỉ có `administrator` không bắt buộc gán `branch`.
- User có role vận hành chi nhánh như `cashier`, `checkincounter`, `branchmanager` cần gắn với chi nhánh khi nghiệp vụ yêu cầu.

### FR-02: Xác thực API

- Các API bảo vệ phải nhận JWT qua header `Authorization: Bearer <token>`.
- Token chứa `id` của user và hết hạn sau `1d`.
- Middleware `protect` từ chối request không có token hoặc token không hợp lệ.
- Middleware `restrictTo(...)` chỉ cho phép request tiếp tục nếu user có ít nhất một role được yêu cầu.

### FR-03: Điều hướng theo role trên Frontend

- Customer không được truy cập các route staff; nếu truy cập phải bị chuyển về trang chủ.
- Staff đã đăng nhập không truy cập flow public/customer; nếu truy cập phải bị chuyển về `/staff`.
- Các route staff được phân quyền:
  - `cashier`: bán vé, bán snack.
  - `checkincounter`: check-in vé.
  - `branchmanager`: quản lý lịch chiếu, phòng chiếu, snack, xem báo cáo chi nhánh.
  - `administrator`: quản lý phim, khuyến mãi, chi nhánh, tài khoản, báo cáo toàn hệ thống.

---

## 3. Tài khoản và Bảo mật đăng nhập

### FR-04: Đăng ký tài khoản khách hàng

- Người dùng phải cung cấp: **Họ tên**, **Email**, **Số điện thoại**, **Mật khẩu**, **Xác nhận mật khẩu**.
- `birthday` và `gender` là thông tin bổ sung; `gender` hợp lệ gồm `male`, `female`, `other`.
- Email và số điện thoại phải là duy nhất trong hệ thống.
- Mật khẩu mạnh: tối thiểu 8 ký tự, có chữ hoa, chữ thường, chữ số và ký tự đặc biệt.
- Xác nhận mật khẩu phải khớp mật khẩu.
- Sau khi đăng ký, hệ thống sinh `activationToken` 32 bytes dạng hex, thời hạn 1 giờ, gửi link kích hoạt qua email.
- Tài khoản khách mới có `activateStatus = false` cho tới khi kích hoạt thành công.

### FR-05: Kích hoạt tài khoản

- Link kích hoạt gọi `POST /api/auth/activate/:token`.
- Token không tồn tại hoặc hết hạn phải trả lỗi chung, không để lộ email.
- Nếu token hết hạn, hệ thống cố gắng xóa tài khoản chưa kích hoạt; nếu không xóa được thì xóa thông tin nhạy cảm và khóa tài khoản.
- Nếu tài khoản đã kích hoạt, hệ thống trả thông báo đã kích hoạt.
- Sau khi kích hoạt thành công, `activateStatus` chuyển thành `true`.

### FR-06: Đăng nhập khách hàng và nhân viên

- Khách hàng đăng nhập qua `/api/auth/login`; chỉ user có role `customer` được đăng nhập qua luồng này.
- Nhân viên đăng nhập qua `/api/auth/staff/login`; chỉ user có ít nhất một staff role (`cashier`, `checkincounter`, `branchmanager`, `administrator`) được đăng nhập.
- Email hoặc mật khẩu sai phải trả thông báo chung "Email or password is incorrect."
- Customer bị khóa (`isLocked = true`) không được đăng nhập.
- Customer chưa kích hoạt không được đăng nhập; nếu activation token đã hết hạn thì xử lý như FR-05.
- Đăng nhập thành công trả về token và thông tin user tối thiểu; staff có kèm thông tin chi nhánh nếu được gán.

### FR-07: Quên mật khẩu và đặt lại mật khẩu

- Customer dùng `/api/auth/forgot-password`; staff dùng `/api/auth/staff/forgot-password`.
- Cả hai luồng trả thông báo chung dù email không tồn tại hoặc không đúng nhóm role, nhằm tránh dò tài khoản.
- Reset token là chuỗi hex 32 bytes, có thời hạn 1 giờ.
- Đặt lại mật khẩu qua `/api/auth/reset-password` phải có `token`, `newPassword`, `retypeNewPassword`.
- Mật khẩu mới phải mạnh như FR-04 và xác nhận mật khẩu phải khớp.
- Sau khi đặt lại thành công, `passwordResetToken` và `passwordResetExpires` phải bị xóa.

### FR-08: Đổi mật khẩu

- Người dùng đã đăng nhập có thể đổi mật khẩu qua `/api/auth/change-password`.
- Phải nhập đúng mật khẩu hiện tại.
- Mật khẩu mới phải mạnh và xác nhận mật khẩu mới phải khớp.
- Mật khẩu luôn được hash bằng bcrypt trước khi lưu.

---

## 4. Hồ sơ khách hàng và Tương tác phim

### FR-09: Quản lý hồ sơ cá nhân

- Customer đã đăng nhập có thể xem hồ sơ qua `GET /api/users/me`.
- Customer chỉ được cập nhật các trường: `name`, `phone`, `birthday`, `gender`.
- Không được cập nhật `email`, `roles`, `branch`, `isLocked`, `loyaltyRank` qua API hồ sơ cá nhân.
- Số điện thoại mới phải không trùng với user khác.
- API không trả `hashedPassword`, role, wishlist, watch history và các token reset/kích hoạt trong response hồ sơ.

### FR-10: Wishlist

- Customer đã đăng nhập có thể thêm phim vào wishlist qua `POST /api/users/wishlist/:movieId`.
- `movieId` phải là ObjectId hợp lệ và phim phải tồn tại.
- Không được thêm trùng một phim đã có trong wishlist.
- Customer có thể xóa phim khỏi wishlist và xem toàn bộ wishlist.
- Wishlist trả kèm thông tin chi nhánh có lịch chiếu tương lai của từng phim khi có dữ liệu.

### FR-11: Lịch sử xem và vé của khách hàng

- Vé phim tạo bởi customer đã đăng nhập được thêm vào `watchHistory`.
- Customer có thể xem watch history qua `GET /api/users/watch-history`.
- Customer có thể xem vé của chính mình qua `GET /api/users/tickets`.
- Danh sách vé customer mặc định giới hạn vé được tạo trong 30 ngày gần nhất, có phân trang và có thể lọc theo trạng thái `Confirmed`, `CheckedIn`, `Cancelled`.

### FR-12: Đánh giá phim

- Customer đã đăng nhập có thể đánh giá phim qua `POST /api/users/rate`.
- Rating phải có `movieId` và `rating`.
- Sao đánh giá hợp lệ từ 1 đến 5.
- Mỗi customer chỉ có một rating cho một phim; gửi lại rating cho cùng phim sẽ cập nhật rating cũ.
- Hệ thống cập nhật điểm trung bình và số lượng rating của phim sau khi rating được lưu.

### FR-13: Lunar Points và hạng thành viên

- Customer có `loyaltyRank.rank` gồm `SILVER`, `GOLD`, `PLATINUM`.
- Khi mua hàng thành công, điểm được cộng theo tổng tiền cuối cùng: mỗi 10.000 VND quy đổi thành điểm.
- Hệ số điểm:
  - `SILVER`: 1 điểm / 10.000 VND.
  - `GOLD`: 3 điểm / 10.000 VND.
  - `PLATINUM`: 5 điểm / 10.000 VND.
- Hạng tự cập nhật theo tổng điểm: từ 500 điểm lên `GOLD`, từ 1500 điểm lên `PLATINUM`.

---

## 5. Duyệt phim, Tìm kiếm và Chatbot

### FR-14: Danh sách phim đang chiếu và sắp chiếu

- Trang chủ và trang phim hiển thị hai nhóm phim: Now Showing và Upcoming.
- Phim chỉ hiển thị public nếu `isHidden = false`.
- Now Showing: `releaseDate <= thời điểm hiện tại`.
- Upcoming: `releaseDate > thời điểm hiện tại`.
- Có thể lọc theo `branchId`; khi lọc theo chi nhánh, chỉ trả phim có lịch chiếu tương lai ở chi nhánh đó.
- Mỗi phim public cần có tối thiểu: tên, mô tả, poster, thể loại, thời lượng, ngày phát hành, nhãn độ tuổi, trạng thái, lịch chiếu gần nhất nếu có.

### FR-15: Chi tiết phim và lịch chiếu

- Chi tiết phim public qua `GET /api/movies/:movieId`.
- Phim không tồn tại hoặc `isHidden = true` phải trả 404.
- Trang chi tiết hiển thị poster, trailer, tên, mô tả, thể loại, thời lượng, đạo diễn, diễn viên, ngôn ngữ, độ tuổi, rating và các chi nhánh/lịch chiếu.
- Lịch chiếu public qua `GET /api/movies/:movieId/showscreen`; mặc định chỉ lấy suất từ thời điểm hiện tại trở đi.
- Có thể lọc lịch chiếu theo ngày bằng query `date`.

### FR-16: Tìm kiếm phim

- API tìm kiếm yêu cầu query `q`; nếu thiếu phải trả lỗi và mảng kết quả rỗng.
- Tìm kiếm theo title, description, director, cast, genre, không phân biệt hoa thường.
- Hỗ trợ phân trang với `page` và `limit`; `limit` tối đa 50.
- Gợi ý tìm kiếm yêu cầu keyword tối thiểu 2 ký tự và `limit` tối đa 10.
- Kết quả tìm kiếm không được trả phim ẩn.
- Kết quả nên ưu tiên điểm rating cao, ngày phát hành mới và tên phim.

### FR-17: Chatbot hỗ trợ phim

- Chatbot nhận câu hỏi qua `POST /api/chatbot/query`.
- Chatbot tập trung vào câu hỏi liên quan phim, lịch chiếu, gợi ý phim và đặt vé.
- Response có thể bao gồm danh sách phim/lịch chiếu và link điều hướng sang chi tiết phim hoặc mua vé.
- Context tương tác có thể cập nhật qua `/api/chatbot/update-context`.
- Nếu không có dữ liệu phù hợp, chatbot phải trả phản hồi lịch sự thay vì tạo thông tin không có trong hệ thống.

---

## 6. Đặt vé phim và Giữ ghế

### FR-18: Chọn chi nhánh, suất chiếu và sơ đồ ghế

- Người dùng có thể xem danh sách chi nhánh đang hoạt động qua `GET /api/branches/available`.
- Chi nhánh trả kèm số phim đang chiếu có lịch chiếu tương lai.
- Lịch chiếu theo chi nhánh trả các suất chiếu của phim/phòng tương ứng.
- Sơ đồ ghế của một suất chiếu lấy qua `GET /api/tickets/screen/:scheduleId`.
- Ghế có các trạng thái: `available`, `occupied`, `holding`, `expired_hold`, `hidden`.
- Ghế đã bán nằm trong `Schedule.OccupiedSeat`; ghế đang giữ nằm trong `SeatHold` chưa hết hạn.

### FR-19: Giữ ghế tạm thời

- Người dùng đăng nhập hoặc khách vãng lai có `sessionId` đều có thể giữ ghế qua `POST /api/tickets/movie/hold`.
- Request phải có `scheduleId`, `seatNumbers` là mảng khác rỗng và `userId` hoặc `sessionId`.
- Số ghế giữ trong một request tối đa 20.
- Mã ghế phải theo định dạng chữ cái hàng + số ghế, ví dụ `A1`, `B12`.
- Hệ thống phải kiểm tra ghế tồn tại trong kích thước phòng chiếu.
- Không được giữ ghế đã bán hoặc ghế đang được người/session khác giữ.
- Thời gian giữ mặc định là 10 phút, tối đa 30 phút; MongoDB TTL tự xóa hold hết hạn.
- Có thể release hoặc extend hold qua `PATCH /api/tickets/movie/hold/`; extend tối đa thêm 15 phút mỗi lần.
- Có thể release nhiều hold cùng lúc qua `DELETE /api/tickets/movie/hold/bulk`.

### FR-20: Tạo vé phim

- Vé được tạo qua `POST /api/tickets/create`.
- Request phải có ít nhất một trong hai loại: `movieTicket` hoặc `snackTicket`.
- Với vé phim, `movieTicket` phải có `schedule`, `seats`, `total`, `adultTickets`, `discountedTickets`.
- Hệ thống phải kiểm tra suất chiếu tồn tại, phim không bị ẩn, ghế chưa được đặt bởi vé `Confirmed` hoặc `CheckedIn`.
- Khi vé phim tạo thành công:
  - Sinh `ticketCode` tự động, 10 ký tự in hoa.
  - Trạng thái mặc định là `Confirmed`.
  - Ghế được thêm vào `Schedule.OccupiedSeat`.
  - Hold tương ứng của user/session được xóa.
  - Nếu có email khách hàng, hệ thống gửi email vé phim.
- Vé phim có thể thuộc customer đăng nhập hoặc khách vãng lai có `noLoginCustomerInfo`.

### FR-21: Trạng thái vé phim

Vé phim có 3 trạng thái:

```
Confirmed ──[admin cập nhật/check-in logic vận hành]──► CheckedIn
Confirmed ──[admin hủy]───────────────────────────────► Cancelled
CheckedIn ──[admin hủy nếu được phép nghiệp vụ]────────► Cancelled
```

- Schema chỉ cho phép `Confirmed`, `CheckedIn`, `Cancelled`.
- Khi vé bị hủy, các ghế của vé phải được gỡ khỏi `Schedule.OccupiedSeat` để có thể bán lại.
- API cập nhật vé chỉ cho phép đổi `status`, `seller`, `noLoginCustomerInfo`.
- Nếu cập nhật `seller`, seller phải là user có role `cashier`.

---

## 7. Mua snack và Khuyến mãi

### FR-22: Danh sách snack theo chi nhánh

- Người dùng có thể xem snack theo chi nhánh qua `/api/branches/:branchId/snacks` hoặc `/api/tickets/:branchId/snacks`.
- Snack có các trường chính: `shortname`, `name`, `description`, `imageURL`, `price`, `discountedPrice`, `stock`, `reserved`, `isHidden`.
- API snack public cho mua hàng chỉ trả snack không ẩn và còn tồn kho khả dụng (`stock - reserved > 0`).
- `discountedPrice` không được lớn hơn `price`.

### FR-23: Tạo hóa đơn snack

- Snack ticket tạo qua `POST /api/tickets/create` với `snackTicket`.
- `snackTicket.snackList` phải là mảng item `{ shortname, quantity }` và quantity phải lớn hơn 0.
- Hệ thống kiểm tra snack tồn tại trong chi nhánh, không bị ẩn và tồn kho đủ.
- Khi tạo snack ticket thành công:
  - Sinh `snackTicketCode` dạng `SNACK-XXXXXXXX`.
  - Lưu `priceAtPurchase` cho từng item.
  - Giảm `stock` theo số lượng đã mua.
  - Trạng thái mặc định là `Confirmed`.
  - Nếu có email khách hàng, hệ thống gửi email hóa đơn snack.

### FR-24: Khuyến mãi

- Khuyến mãi có mã `promotionCode` duy nhất, tự uppercase và trim.
- Các trường chính: `name`, `discountRate`, `maximumDiscount`, `bannerImage`, `appliedProduct`, `appliedLoyaltyRank`, `remainingUse`, `minimumSpend`, `startDate`, `endDate`, `isActive`.
- `appliedProduct` chỉ nhận `Movie`, `Snack`, `All`.
- `appliedLoyaltyRank` chỉ nhận `SILVER`, `GOLD`, `PLATINUM` hoặc rỗng/null.
- `discountRate` phải nằm trong khoảng 0 đến 100.
- `endDate` phải sau `startDate` nếu cả hai được cấu hình.
- Promotion chỉ áp dụng nếu:
  - Mã tồn tại và `isActive = true`.
  - Nằm trong thời gian hiệu lực.
  - Còn `remainingUse` nếu trường này khác `null`.
  - Tổng tiền loại sản phẩm tương ứng đạt `minimumSpend`.
  - Loại sản phẩm khớp `Movie`, `Snack` hoặc `All`.
  - Hạng thành viên của customer đủ điều kiện nếu promotion yêu cầu rank.
- Công thức giảm giá: `discount = total * discountRate / 100`, giới hạn bởi `maximumDiscount` nếu có.
- Khi promotion được áp dụng trong tạo vé, `remainingUse` giảm 1 nếu không phải `null`.

---

## 8. Check-in vé và QR

### FR-25: Check-in vé

- Nhân viên `checkincounter` có thể tra cứu vé phim bằng ticket code qua `/api/tickets/movie/admin/:ticketCode`.
- Hệ thống hỗ trợ tra cứu cả vé phim và vé snack trong controller check code, nhưng route check-in phim hiện cấp quyền cho `checkincounter`.
- Khi tra cứu thành công, hệ thống cập nhật `lastScanAt` hiện tại trong CSDL.
- Response trả về `lastScanAt` trước lần quét hiện tại để UI có thể cảnh báo vé đã từng được scan.
- Thông tin trả về gồm chi nhánh, phim, suất chiếu, phòng, ghế hoặc danh sách snack tùy loại vé.

### FR-26: QR code

- API `/api/qr` tạo QR code từ query `code`.
- QR code dùng để biểu diễn ticket code/snack ticket code phục vụ check-in hoặc xác minh vé.

---

## 9. Quản trị phim, chi nhánh, phòng chiếu và lịch chiếu

### FR-27: Quản lý phim

- `administrator` có thể xem toàn bộ phim, gồm cả phim ẩn/archived.
- Thêm phim yêu cầu title duy nhất và các trường bắt buộc theo schema: `title`, `posterURL`, `description`, `releaseDate`, `duration`, `genre`, `ageRating`.
- `ageRating` hợp lệ: `P`, `K`, `T13`, `T16`, `T18`, `C`.
- Phim mới mặc định ẩn nếu không truyền `isHidden`.
- Cập nhật phim hỗ trợ PUT/PATCH theo `movieId`.
- Xóa phim là hard delete, nhưng bị chặn nếu phim còn lịch chiếu.
- Sau thêm/sửa/xóa phim, cache danh sách phim, chi tiết phim và search cache phải được xóa.
- Frontend có hỗ trợ import danh sách phim từ template Excel; dữ liệu batch phải được validate trước khi gửi thêm từng phim.

### FR-28: Quản lý chi nhánh

- `administrator` có thể tạo, sửa, xóa và bật/tắt chi nhánh.
- Chi nhánh bắt buộc có `name`, `address`, `city`.
- `name` chi nhánh phải duy nhất.
- `location` nếu có phải là GeoJSON `Point` với `coordinates = [longitude, latitude]`.
- Longitude hợp lệ từ -180 đến 180; latitude hợp lệ từ -90 đến 90.
- Chi nhánh có `isActive = true` mới xuất hiện trong danh sách public.

### FR-29: Quản lý phòng chiếu

- `branchmanager` có thể quản lý phòng chiếu của chi nhánh.
- Phòng chiếu bắt buộc có `screenName`, `branch`, `size.rows`, `size.columns`, `screenType`.
- `screenType` hợp lệ: `2D`, `3D`, `IMAX`, `4DX`.
- Cặp `screenName` + `branch` phải duy nhất.
- Phòng chiếu có `isActive` để bật/tắt sử dụng.
- Ghế của phòng có thể tạo lẻ hoặc bulk; ghế có thể bị ẩn để không bán.

### FR-30: Quản lý lịch chiếu

- `branchmanager` có thể tạo/sửa/xóa lịch chiếu cho chi nhánh được gán.
- Khi tạo lịch chiếu phải có `movieId`, `screenId`, `startTime`.
- `startTime` phải là thời gian hợp lệ trong tương lai.
- Phim phải tồn tại và không bị ẩn.
- Phòng chiếu phải tồn tại, đang active và thuộc đúng chi nhánh.
- `endTime` được tính tự động bằng `startTime + movie.duration`.
- Không được tạo lịch chồng lấn trong cùng một phòng chiếu.
- Không được sửa lịch đã bắt đầu hoặc lịch đã bán vé `Confirmed`/`CheckedIn`.
- Sau khi tạo/sửa/xóa lịch, cache liên quan đến lịch, phim và chi nhánh phải được xóa.

### FR-31: Quản lý snack theo chi nhánh

- `branchmanager` có thể tạo/sửa/xóa snack trong chi nhánh.
- Snack bắt buộc có `shortname`, `name`, `imageURL`, `price`, `branch`.
- `shortname` tự uppercase và phải duy nhất theo schema.
- `price` không âm; `discountedPrice` không được lớn hơn `price`.
- `stock` mặc định 0; `reserved` không được lớn hơn `stock`.
- Xóa snack thành công sẽ xóa record; nếu không xóa được, hệ thống thử chuyển `isHidden = true`.

---

## 10. Quản trị tài khoản, khuyến mãi và báo cáo

### FR-32: Quản lý tài khoản

- `administrator` có thể tạo, xem danh sách, xem chi tiết, sửa thông tin, đổi role, khóa/mở khóa và xóa user.
- Tạo user bắt buộc có `name`, `email`, `phone`, `password`.
- Email hoặc phone không được trùng.
- Role gửi lên phải thuộc danh sách role hợp lệ.
- User do administrator tạo được kích hoạt sẵn (`activateStatus = true`).
- API danh sách/chi tiết không trả các token reset/kích hoạt và các trường lịch sử không cần thiết.
- Cập nhật role chỉ cho phép trường `roles`.
- Cập nhật trạng thái chỉ cho phép trường `isLocked` và giá trị phải là boolean.
- Xóa user bị chặn nếu user đã có vé phim, vé snack hoặc rating.

### FR-33: Quản lý khuyến mãi

- `administrator` có thể tạo, sửa, xóa và xem chi tiết khuyến mãi.
- `administrator` và `cashier` có thể xem toàn bộ danh sách khuyến mãi.
- Public có thể xem banner khuyến mãi và danh sách promotion phù hợp với trạng thái đăng nhập/hạng thành viên.
- Sau khi tạo/sửa/xóa promotion, cache danh sách promotion public và banner phải được xóa.

### FR-34: Báo cáo doanh thu

- `administrator` có thể xem danh sách chi nhánh phục vụ lọc báo cáo.
- `branchmanager` chỉ lấy được chi nhánh được gán cho mình.
- Báo cáo doanh thu yêu cầu `startDate` và `endDate`; ngày không hợp lệ phải trả lỗi.
- `administrator` có thể truyền `branchId` để lọc; `branchmanager` luôn bị giới hạn theo chi nhánh của chính mình.
- Báo cáo trả:
  - Tổng doanh thu vé phim.
  - Tổng số vé.
  - Số phim khác nhau.
  - Doanh thu theo ngày.
  - Doanh thu theo nhân viên bán.
  - Doanh thu theo phim.

---

## 11. Yêu cầu Giao diện

### FR-35: Giao diện khách hàng

- Trang khách hàng phải hỗ trợ các flow chính: trang chủ, danh sách phim, chi tiết phim, đặt vé, mua snack, đăng nhập/đăng ký, quên mật khẩu, hồ sơ, wishlist, watch history, Lunar Points.
- Trang mua vé cần điều hướng theo bước: chọn rạp/suất, chọn ghế, chọn snack, nhập thông tin, thanh toán/áp mã, hiển thị vé.
- Khi chọn ghế phải thể hiện rõ trạng thái ghế trống, đã bán, đang giữ và không khả dụng.
- Sau khi tạo vé thành công phải hiển thị thông tin vé và QR/ticket code.
- Các lỗi nghiệp vụ như ghế đã bị giữ, promotion không hợp lệ, thiếu thông tin khách phải hiển thị rõ cho người dùng.

### FR-36: Giao diện nhân viên

- Staff area phải có login riêng tại `/staff/login`.
- Sidebar/menu staff phải chỉ dẫn tới các màn hình phù hợp role.
- Các màn hình quản trị dạng bảng phải hỗ trợ xem danh sách, tìm kiếm/lọc, thêm mới, sửa inline hoặc modal, xác nhận xóa/hủy khi thao tác nguy hiểm.
- Các thao tác upload template Excel phải có loading, kết quả thành công/thất bại và danh sách lỗi dòng nếu validation thất bại.

### FR-37: Phản hồi trạng thái

- Khi đang tải dữ liệu phải có loading state.
- Khi danh sách rỗng phải có empty state phù hợp.
- Các thao tác thành công/thất bại phải có phản hồi trực quan.
- Các form phải validate phía client trước khi gọi API nếu rule đã biết ở frontend.
- UI phải không hiển thị mật khẩu dạng plain text trừ khi người dùng chủ động bật xem mật khẩu.

---

## 12. Yêu cầu Bảo mật và Dữ liệu

| ID | Yêu cầu |
| -- | ------ |
| SEC-01 | Mật khẩu không được lưu plaintext; phải hash bằng bcrypt. |
| SEC-02 | API bảo vệ phải yêu cầu JWT hợp lệ qua `Authorization: Bearer <token>`. |
| SEC-03 | API phân quyền phải kiểm tra role, không chỉ kiểm tra token tồn tại. |
| SEC-04 | API profile customer không được cho sửa `roles`, `branch`, `isLocked`, token reset/kích hoạt. |
| SEC-05 | Response hồ sơ và danh sách user không được trả `hashedPassword`. |
| SEC-06 | Reset password/forgot password không được tiết lộ email có tồn tại hay không. |
| SEC-07 | Token kích hoạt và reset password phải có thời hạn 1 giờ. |
| SEC-08 | Đặt vé và cập nhật stock/ghế phải chạy trong transaction để giảm rủi ro race condition. |
| SEC-09 | Ghế chỉ được giữ bởi một user/session tại một thời điểm nhờ unique index `{ schedule, seatNumber }`. |
| SEC-10 | Dữ liệu nhập từ user khi hiển thị trên UI phải được render an toàn theo cơ chế escape mặc định của React. |

---

## 13. Ghi chú Kiểm thử

- Source chính đã đọc: `src/back-end/app.js`, `routes/`, `controllers/`, `models/`, `src/front-end/src/routes/routeConfig.js`, `src/front-end/src/config/api.config.js`, các hook quản lý frontend, và tài liệu PDF trong `docs/`.
- Một số API/hook có dấu hiệu chưa đồng bộ hoàn toàn giữa tài liệu, frontend và backend; khi viết test case nên phân biệt **yêu cầu nghiệp vụ trong tài liệu này** với **hành vi triển khai thực tế** để ghi nhận bug đúng bản chất.
- Các dữ liệu phụ thuộc thời gian như Now Showing/Upcoming, activation/reset token, seat hold TTL và báo cáo doanh thu cần dùng ngày giờ tuyệt đối trong test case để tránh kết quả không ổn định.

---

_Tài liệu này phục vụ cho mục đích học tập và thực hành Kiểm thử Phần mềm. Phiên bản: 1.0 — Cập nhật: 2026-07-19._
