# EShop GUI Checklist — Execution Report (HW03 Task 1)

Tổng số item: **69**

| Kết quả | Số lượng |
| --- | --- |
| FAIL | 32 |
| PASS | 36 |
| N/A | 1 |

## HOME — IA01

| ID | Expected | Result | Notes |
| --- | --- | --- | --- |
| HOME-U01 | 1 thẻ <h1> duy nhất (FR-21, FR-05) | FAIL | Tìm thấy 2 thẻ <h1>: ['Danh sách sản phẩm', 'Hiển thị 5 sản phẩm'] |
| HOME-U02 | alt='<tên sản phẩm>' (FR-24) | FAIL | 5/5 ảnh có alt rỗng. |
| HOME-U03 | Giá dùng ký hiệu ₫ (FR-21) | FAIL | Trang dùng chuỗi 'VND' thay vì ký hiệu ₫. |
| HOME-U04 | Tên dài không vỡ layout | PASS | Human review (HOME-U04.png): ten san pham hien gon trong khung card, khong tran/vo layout voi du lieu hien co. |
| HOME-U05 | Grid responsive đúng breakpoint | PASS | Human review (HOME-U05.png, chup o 1400/800/375px): grid co gian dung so cot theo breakpoint Tailwind (grid-cols-1 sm:grid-cols-2 md:grid-cols-3). |
| HOME-U06 | Ngôn ngữ tiếng Việt nhất quán (FR-21) | PASS | Không phát hiện nhãn tiếng Anh lạc trên trang Home. |
| HOME-U07 | Navbar đầy đủ trên Home | PASS | Header có logo EShop và link Giỏ hàng. |
| HOME-U08 | Nút Thêm vào giỏ màu xanh dương (FR-21) | PASS | Nút dùng class chứa 'blue': flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm |
| HOME-U09 | Spacing card đồng nhất | PASS | Human review (HOME-U09.png): cac card co gap/padding deu nhau, khong dinh mep. |
| HOME-U10 | Typography đồng bộ | PASS | Human review (HOME-U10.png): ten/gia dung cung co chu va trong luong font o moi card. |
| HOME-U11 | Dark mode đủ tương phản | FAIL | Không tìm thấy class/biến thể dark: trong DOM; ép color-scheme=dark bằng script để chụp ảnh minh hoạ nền vẫn trắng cứng (bg-white/bg-gray-50). |
| HOME-U12 | RTL layout không vỡ | FAIL | Human review (HOME-U12.png): trinh duyet tu mirror layout (navbar dao thu tu, tieu de va o tim kiem doi cho hai ben) vi component khong dung logical properties / khong xu ly dir chu dong. -> BUG-GUI-23 |
| HOME-U13 | Contrast đạt WCAG AA | FAIL | Human review (HOME-U13.png): mau gia text-red-500/600 tren nen trang chi dat ~3.0-4.0:1, duoi nguong WCAG AA 4.5:1. -> BUG-GUI-24 |
| HOME-U14 | Hover feedback trên card | PASS | Human review (HOME-U14.png): nut va link co trang thai hover ro rang (doi mau nen/underline). |

## HOME — IA02

| ID | Expected | Result | Notes |
| --- | --- | --- | --- |
| HOME-F01 | Placeholder rõ ràng | PASS | Placeholder: 'Tìm kiếm...' |
| HOME-F02 | Submit rỗng không crash | PASS | Submit tìm kiếm rỗng không gây crash / trang vẫn render. |
| HOME-F03 | Enter kích hoạt tìm kiếm | PASS | Enter kích hoạt tìm kiếm (thấy dòng 'Kết quả tìm kiếm cho'). |
| HOME-F04 | Không render HTML từ search (FR-05, SEC-04) | FAIL | XSS xác nhận: payload HTML trong ô tìm kiếm được render thành thẻ thật (dangerouslySetInnerHTML không escape) thay vì hiển thị dạng text thuần. |
| HOME-F05 | Giữ giá trị ô tìm kiếm sau submit | PASS | Giá trị ô tìm kiếm được giữ lại sau submit. |
| HOME-F06 | Hitbox nút Tìm đủ lớn | PASS | Kích thước nút Tìm: {'height': 42, 'width': 58} |
| HOME-F07 | Keyboard-only tới ô tìm kiếm | PASS | Human review (HOME-F07.png): o tim kiem va nut Tim deu thao tac duoc bang ban phim (Tab + Enter). |
| HOME-F08 | Khoảng trắng thừa xử lý nhất quán | FAIL | Human review (HOME-F08.png): tim kiem khong trim khoang trang dau/cuoi -> ket qua khac voi tu khoa da trim; he qua cua string concat khong xu ly o server.js:144. -> BUG-GUI-25 |
| HOME-F09 | Không phân biệt hoa/thường | PASS | Human review (HOME-F09.png): SQLite LIKE mac dinh case-insensitive voi ASCII nen tim kiem khong phan biet hoa/thuong. |

## HOME — IA03

| ID | Expected | Result | Notes |
| --- | --- | --- | --- |
| HOME-N01 | Xem chi tiết điều hướng đúng /product/:id | PASS | Điều hướng thành công tới http://localhost:5173/product/1 |
| HOME-N02 | Click logo về đúng trang chủ | PASS | Click logo giữ nguyên/điều hướng đúng về trang chủ. |
| HOME-N03 | Navbar highlight trang hiện tại (FR-23) | FAIL | Không tìm thấy cơ chế active-state (class active/aria-current) riêng biệt trên navbar; toàn bộ link chỉ có hover:underline, không phân biệt trang hiện tại. |
| HOME-N04 | Badge số lượng giỏ hàng (FR-23) | FAIL | Link 'Giỏ hàng' không có badge số lượng đi kèm. |
| HOME-N05 | Tab order hợp lý (FR-21) | FAIL | Human review (HOME-N05.png): tab order khong theo thu tu thi giac tren-xuong/trai-phai; link "Xem chi tiet" nhan focus truoc o tim kiem. -> BUG-GUI-26 |
| HOME-N06 | Không breadcrumb thừa trên Home (FR-23) | N/A | Breadcrumb không bắt buộc cho Home theo FR-23 (chỉ áp dụng Cart/Checkout/Product Detail). |
| HOME-N07 | Truy cập trực tiếp '/' load đúng | PASS | Truy cập trực tiếp '/' render nội dung trang chủ đầy đủ. |
| HOME-N08 | 2 vùng bấm trên card không chồng lấn | PASS | Hai vùng bấm tách biệt, không chồng lấn. |
| HOME-N09 | Hành vi rõ ràng khi chưa đăng nhập | FAIL | Human review (HOME-N09.png): click "Them vao gio" khi chua dang nhap khong co phan hoi nao (khong toast, khong redirect, khong gio khach) - im lang that bai. -> BUG-GUI-27 |

## HOME — IA04

| ID | Expected | Result | Notes |
| --- | --- | --- | --- |
| HOME-S01 | Loading state khi tải sản phẩm (FR-05) | FAIL | Không phát hiện trạng thái loading (spinner/'Đang tải...') khi vào trang. |
| HOME-S02 | Empty state khi không có kết quả (FR-05/24) | FAIL | Không có empty state rõ ràng khi tìm kiếm không ra kết quả (trang chỉ trống trơn). |
| HOME-S03 | Lỗi API không lộ chi tiết kỹ thuật | FAIL | Human review (HOME-S03.png): payload ' OR '1'='1 tra ve TOAN BO 5 san pham thay vi 0 ket qua -> xac nhan SQL Injection that su o server.js:144. -> BUG-GUI-07 (nang len Critical) |
| HOME-S04 | Phản hồi trực quan khi Thêm vào giỏ (FR-24) | FAIL | Không phát hiện phản hồi trực quan (toast/badge) sau khi Thêm vào giỏ trên Home. |
| HOME-S05 | 'Hiển thị N sản phẩm' cập nhật đúng | PASS | Human review (HOME-S05.png): truoc "Hien thi 5 san pham", sau khi tim "a" -> "Hien thi 4 san pham" va dung 4 card - so dem khop ket qua that. |
| HOME-S06 | Dòng 'Kết quả tìm kiếm cho' hiện/ẩn đúng | PASS | Dòng 'Kết quả tìm kiếm cho' chỉ hiện sau khi có từ khóa. |
| HOME-S07 | Reload không để lại lỗi console | PASS | Reload trang không phát sinh lỗi console SEVERE. |

## LOGIN — IA01

| ID | Expected | Result | Notes |
| --- | --- | --- | --- |
| LOGIN-U01 | Tiêu đề 'Đăng Nhập' đúng chức năng | FAIL | Tiêu đề trang Login sai: 'Đăng Ký' (kỳ vọng 'Đăng Nhập'). |
| LOGIN-U02 | Ngôn ngữ tiếng Việt nhất quán (FR-21) | FAIL | Tìm thấy nhãn tiếng Anh giữa giao diện tiếng Việt: ['Username', 'Sign In'] |
| LOGIN-U03 | Nút submit màu xanh dương (FR-21) | PASS | Nút submit dùng class chứa 'blue': w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 |
| LOGIN-U04 | Form căn giữa, cân đối | PASS | Human review (LOGIN-U04.png): form can giua trong khung card trang, khoang cach giua cac truong (space-y-4) deu nhau, de doc. |
| LOGIN-U05 | Phân cấp thị giác link phụ vs nút chính | PASS | Human review (LOGIN-U05.png): 2 link phu dung mau xanh nhat/underline, co chu nho hon nut chinh (nen xanh dam, full-width) - phan cap thi giac ro rang. |
| LOGIN-U06 | Dark mode đủ tương phản | FAIL | Không có biến thể dark: trong DOM trang Login. |
| LOGIN-U07 | Responsive mobile không tràn ngang | PASS | Không phát hiện tràn ngang ở độ rộng mobile 375px. |

## LOGIN — IA02

| ID | Expected | Result | Notes |
| --- | --- | --- | --- |
| LOGIN-F01 | Email dùng type='email' (FR-02/22) | FAIL | Trường Email dùng type='text' thay vì 'email'. |
| LOGIN-F02 | Mật khẩu dùng type='password' (FR-22) | FAIL | Trường Mật khẩu dùng type='text': mật khẩu hiển thị rõ khi gõ. |
| LOGIN-F03 | Nhãn bắt buộc có dấu '*' (FR-22) | FAIL | Không có nhãn nào chứa dấu '*' cho trường bắt buộc. |
| LOGIN-F04 | Submit rỗng bị chặn phía client | PASS | Submit với form trống bị chặn phía client (không điều hướng/gọi API). |
| LOGIN-F05 | Lỗi hiển thị trên nút submit (FR-22) | FAIL | Thông báo lỗi hiển thị phía dưới nút submit (vi phạm FR-22). |
| LOGIN-F06 | Enter trong ô mật khẩu = submit | PASS | Enter trong ô mật khẩu kích hoạt submit thành công. |
| LOGIN-F07 | Label liên kết đúng input (accessibility) | FAIL | 2/2 label KHÔNG có 'for'/'htmlFor' liên kết input. |
| LOGIN-F08 | Validate định dạng email rõ ràng | FAIL | Không có validate HTML5 định dạng email (do input dùng type='text'); request có thể được gửi thẳng lên server với email sai định dạng. |

## LOGIN — IA03

| ID | Expected | Result | Notes |
| --- | --- | --- | --- |
| LOGIN-N01 | Điều hướng đúng sau đăng nhập thành công | PASS | Điều hướng sau đăng nhập thành công tới http://localhost:5173/ |
| LOGIN-N02 | Link Đăng ký điều hướng đúng /register | PASS | Link 'Đăng ký ngay' điều hướng đúng. |
| LOGIN-N03 | Link Quên mật khẩu điều hướng đúng | PASS | Link 'Quên mật khẩu?' điều hướng đúng. |
| LOGIN-N04 | Tab order Email→Mật khẩu→...→Submit (FR-21) | FAIL | Human review (LOGIN-N04.png) + doi chieu code: tabIndex={1} gan cung tren nut submit (Login.jsx:56) khien nut co the nhan Tab-focus truoc cac input phia tren (mac dinh tabindex=0), pha vo tab order tu nhien. -> BUG-GUI-28 |
| LOGIN-N05 | Navbar đầy đủ khi chưa đăng nhập | PASS | Navbar đầy đủ khi chưa đăng nhập trên trang Login. |
| LOGIN-N06 | Không lỗi khi đã đăng nhập truy cập lại /login | FAIL | Human review (LOGIN-N06.png): navbar hien thi da dang nhap ("Chao, Test User" + nut Thoat) TRONG KHI than trang /login van hien form dang nhap trong - trang thai mau thuan, thieu route guard. -> BUG-GUI-29 |
| LOGIN-N07 | Form sạch sau đăng xuất rồi quay lại | PASS | Human review (LOGIN-N07.png): form hien thi trong, navbar ve dung trang thai chua dang nhap, khong con du lieu phien cu. |

## LOGIN — IA04

| ID | Expected | Result | Notes |
| --- | --- | --- | --- |
| LOGIN-S01 | Thông báo lỗi chung khi sai email/mật khẩu | PASS | Có thông báo lỗi chung khi đăng nhập sai. |
| LOGIN-S02 | Nút submit loading/disabled khi gọi API | FAIL | Nút submit không chuyển trạng thái disabled/loading khi đang gọi API. |
| LOGIN-S03 | Khoá tài khoản sau đúng 3 lần sai (FR-02) | PASS | API trả 403 (khoá) sau 3 lần sai liên tiếp (kỳ vọng đúng 3 theo FR-02). |
| LOGIN-S04 | Thời gian khoá đúng 30s (FR-02) | FAIL | Sau 32s, API trả status 403 (vẫn khoá/không đăng nhập được); kỳ vọng mở khoá và trả 200 sau đúng 30s theo spec. |
| LOGIN-S05 | Thông báo khoá phân biệt với sai mật khẩu | FAIL | Human review: oracle cua script kiem o tang backend (401 vs 403 -> co phan biet) nen bao PASS, nhung item nay kiem THONG BAO NGUOI DUNG THAY. UI Login.jsx:17-19 luon hien 1 cau chung "Dang nhap that bai. Vui long kiem tra lai." cho ca 2 truong hop -> nguoi dung khong bao gio thay su phan biet ma backend da cung cap. Ket luan cuoi: FAIL. -> BUG-GUI-18 |
| LOGIN-S06 | Tự mở khoá và đăng nhập lại thành công | FAIL | Chưa mở khoá ở mốc 32s (status 403); khớp với BUG-GUI-17 (thời gian khoá thực tế ~180s thay vì 30s). |
| LOGIN-S07 | Không lộ JWT token ra console/URL | PASS | Human review (LOGIN-S07.png) + doi chieu: JWT duoc luu trong localStorage (co che thong thuong cua app), khong bi log ra console hay lo tren URL. |
| LOGIN-S08 | Không double-submit khi bấm nhiều lần | FAIL | Human review (LOGIN-S08.png): vi nut submit khong disable khi dang goi API (LOGIN-S02 da FAIL), bam nhieu lan lien tuc co the kich hoat nhieu request POST /api/login trung lap. -> BUG-GUI-30 |
