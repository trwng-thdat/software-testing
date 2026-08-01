# Bug Reports — EShop (HW03 Task 1)

> Sinh tự động từ [`Main_Report.md`](Main_Report.md) §1.6 để copy thẳng vào GitHub Issues.
> Mỗi bug có sẵn **Title** (dòng đầu) và **Description** (phần Markdown bên dưới, copy nguyên khối vào ô mô tả issue).
> Ảnh đính kèm nằm tại [`hw3/screenshot/`](screenshot/).

---

## BUG-GUI-01

**GitHub Issue:** [#125](https://github.com/DuyITLOR/group05_eshop/issues/125)

**Title:** [HW03][BUG][screen: home] Trang Home có 2 thẻ `<h1>` (vi phạm FR-05/FR-21)

**Description:**

```
**Mô tả:** Trang Home ("/") render 2 thẻ <h1> cùng lúc thay vì đúng 1 thẻ như quy định semantic HTML.

**Vị trí:** Home.jsx dòng 43 và 110.

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Inspect DOM, đếm số thẻ <h1>

**Expected:** Chỉ có đúng 1 thẻ <h1> trên trang (FR-21).
**Actual:** Có 2 thẻ <h1>: "Danh sách sản phẩm" và "Hiển thị 5 sản phẩm".

**Severity:** Low
**Checklist ID:** HOME-U01
**Screenshot:** screenshot/HOME-U01.png
```

---

## BUG-GUI-02

**GitHub Issue:** [#126](https://github.com/DuyITLOR/group05_eshop/issues/126)

**Title:** [HW03][BUG][screen: home] Ảnh sản phẩm thiếu thuộc tính `alt` mô tả (accessibility, vi phạm FR-24)

**Description:**

```
**Mô tả:** Toàn bộ ảnh sản phẩm trên trang Home có alt="" rỗng, ảnh hưởng tới accessibility (screen reader không đọc được nội dung ảnh).

**Vị trí:** Home.jsx dòng 82.

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Inspect thuộc tính alt của từng ảnh sản phẩm trong danh sách

**Expected:** alt="<tên sản phẩm>" (FR-24).
**Actual:** 5/5 ảnh sản phẩm có alt rỗng.

**Severity:** Medium
**Checklist ID:** HOME-U02
**Screenshot:** screenshot/HOME-U02.png
```

---

## BUG-GUI-03

**GitHub Issue:** [#127](https://github.com/DuyITLOR/group05_eshop/issues/127)

**Title:** [HW03][BUG][screen: home] Giá sản phẩm hiển thị đơn vị "VND" thay vì ký hiệu `₫` (vi phạm FR-21)

**Description:**

```
**Mô tả:** Giá sản phẩm trên trang Home hiển thị chuỗi "VND" thay vì ký hiệu tiền tệ chuẩn ₫ với dấu phân cách hàng nghìn.

**Vị trí:** Home.jsx dòng 86-88.

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Quan sát định dạng giá hiển thị trên card sản phẩm

**Expected:** VD "1.500.000 ₫" (FR-21).
**Actual:** Hiển thị dạng "1500000 VND" (không đúng ký hiệu, không phân cách hàng nghìn).

**Severity:** Low
**Checklist ID:** HOME-U03
**Screenshot:** screenshot/HOME-U03.png
```

---

## BUG-GUI-04

**GitHub Issue:** [#128](https://github.com/DuyITLOR/group05_eshop/issues/128)

**Title:** [HW03][BUG][screen: home] [Critical] Reflected XSS trong ô tìm kiếm Home qua `dangerouslySetInnerHTML`

**Description:**

```
**Mô tả:** Từ khóa tìm kiếm trên trang Home được render trực tiếp bằng dangerouslySetInnerHTML mà không escape, cho phép chèn và thực thi HTML/JS tùy ý (Reflected XSS).

**Vị trí:** Home.jsx dòng 64.

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Nhập payload <b id=xss-marker-selenium>x</b> vào ô tìm kiếm và submit
3. Inspect DOM tại vùng hiển thị "Kết quả tìm kiếm cho: ..."

**Expected:** Từ khóa được hiển thị dạng text thuần, không render thành thẻ HTML thật (FR-05, SEC-04).
**Actual:** Payload render thành thẻ <b> thật trong DOM — xác nhận thực thi qua Selenium.

**Impact:** Kẻ tấn công có thể chèn script tùy ý (đánh cắp session/cookie, phishing UI) chỉ qua URL tìm kiếm được chia sẻ.

**Severity:** Critical
**Checklist ID:** HOME-F04
**Screenshot:** screenshot/HOME-F04.png
```

---

## BUG-GUI-05

**GitHub Issue:** [#129](https://github.com/DuyITLOR/group05_eshop/issues/129)

**Title:** [HW03][BUG][screen: home] Không có trạng thái loading khi tải danh sách sản phẩm

**Description:**

```
**Mô tả:** Khi trang Home đang gọi API lấy danh sách sản phẩm, không có bất kỳ chỉ báo loading nào (spinner/"Đang tải...").

**Steps to reproduce:**
1. Mở trang chủ "/" (có thể throttle network để quan sát rõ khoảng chờ)
2. Quan sát UI trong lúc chờ dữ liệu sản phẩm trả về

**Expected:** Có spinner hoặc text "Đang tải..." trong lúc chờ (FR-05).
**Actual:** Không phát hiện trạng thái loading nào — trang trống cho tới khi dữ liệu về.

**Severity:** Medium
**Checklist ID:** HOME-S01
**Screenshot:** screenshot/HOME-S01.png
```

---

## BUG-GUI-06

**GitHub Issue:** [#130](https://github.com/DuyITLOR/group05_eshop/issues/130)

**Title:** [HW03][BUG][screen: home] Không có empty state khi tìm kiếm không ra kết quả

**Description:**

```
**Mô tả:** Khi tìm kiếm một từ khóa không khớp sản phẩm nào, trang không hiển thị thông báo thân thiện mà chỉ để trống.

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Nhập từ khóa chắc chắn không có sản phẩm khớp (VD "zzzxyz123") và submit

**Expected:** Hiển thị empty state kèm icon/thông báo, VD "Không tìm thấy sản phẩm nào" (FR-05, FR-24).
**Actual:** Không có empty state — khu vực danh sách chỉ trống trơn, người dùng không rõ là lỗi hay đúng là 0 kết quả.

**Severity:** Medium
**Checklist ID:** HOME-S02
**Screenshot:** screenshot/HOME-S02.png
```

---

## BUG-GUI-07

**GitHub Issue:** [#131](https://github.com/DuyITLOR/group05_eshop/issues/131)

**Title:** [HW03][BUG][screen: home] [Critical] SQL Injection trong API tìm kiếm sản phẩm (`server.js:144`)

**Description:**

```
**Mô tả:** Endpoint tìm kiếm sản phẩm nối chuỗi trực tiếp từ khóa người dùng vào câu lệnh SQL LIKE mà không parameterize, cho phép SQL Injection.

**Vị trí:** server.js dòng 144.

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Nhập payload ' OR '1'='1 vào ô tìm kiếm và submit
3. Quan sát số lượng / nội dung sản phẩm trả về

**Expected:** Payload được xử lý như chuỗi tìm kiếm thông thường, trả về 0 kết quả (không có sản phẩm nào chứa chuỗi đó) (SEC-05).
**Actual:** API trả về TOÀN BỘ sản phẩm trong database — xác nhận câu lệnh SQL bị thao túng thành công qua string concatenation không parameterize.

**Impact:** Có thể mở rộng khai thác để đọc/thay đổi dữ liệu ngoài phạm vi bảng sản phẩm (data breach, data tampering) tùy theo quyền của DB user.

**Note:** Kịch bản lỗi 500 hiển thị thô (giả thuyết ban đầu) chưa tái hiện được qua payload tự động; cần thử thêm các payload khác (VD UNION SELECT, ký tự đặc biệt gây lỗi cú pháp) để đánh giá đầy đủ mức khai thác.

**Severity:** Critical
**Checklist ID:** HOME-S03
**Screenshot:** screenshot/HOME-S03.png
```

---

## BUG-GUI-08

**GitHub Issue:** [#132](https://github.com/DuyITLOR/group05_eshop/issues/132)

**Title:** [HW03][BUG][screen: home] Navbar không highlight trang hiện tại; link Giỏ hàng thiếu badge số lượng (vi phạm FR-23)

**Description:**

```
**Mô tả:** Navbar không có cơ chế active-state cho mục đang chọn, và link "Giỏ hàng" không hiển thị badge số lượng sản phẩm trong giỏ.

**Vị trí:** App.jsx dòng 23.

**Steps to reproduce:**
1. Mở trang chủ "/", quan sát mục "Trang chủ" trên navbar (không có class active/aria-current)
2. Thêm sản phẩm vào giỏ, quan sát link "Giỏ hàng" (không có badge số đếm)

**Expected:** Mục đang chọn có trạng thái active rõ ràng; badge số lượng đúng trên link Giỏ hàng (FR-23).
**Actual:** Không có active-state (chỉ có hover:underline); không có badge số lượng nào trên link Giỏ hàng.

**Severity:** Medium
**Checklist ID:** HOME-N03, HOME-N04
**Screenshot:** screenshot/HOME-N03.png, screenshot/HOME-N04.png
```

---

## BUG-GUI-09

**GitHub Issue:** [#133](https://github.com/DuyITLOR/group05_eshop/issues/133)

**Title:** [HW03][BUG][screen: login] Trang Login hiển thị tiêu đề sai "Đăng Ký" thay vì "Đăng Nhập"

**Description:**

```
**Mô tả:** Tiêu đề trang Login bị copy-paste lỗi từ trang Register, hiển thị "Đăng Ký" thay vì "Đăng Nhập".

**Vị trí:** Login.jsx dòng 24.

**Steps to reproduce:**
1. Điều hướng tới "/login"
2. Quan sát tiêu đề <h2> của form

**Expected:** <h2>Đăng Nhập</h2> hoặc tương đương.
**Actual:** Tiêu đề thực tế là "Đăng Ký".

**Severity:** Medium
**Checklist ID:** LOGIN-U01
**Screenshot:** screenshot/LOGIN-U01.png
```

---

## BUG-GUI-10

**GitHub Issue:** [#134](https://github.com/DuyITLOR/group05_eshop/issues/134)

**Title:** [HW03][BUG][screen: login] Nhãn "Username" và nút "Sign In" bằng tiếng Anh giữa giao diện tiếng Việt (vi phạm FR-21)

**Description:**

```
**Mô tả:** Form Login lẫn tiếng Anh ("Username", "Sign In") trong khi toàn bộ phần còn lại của site dùng tiếng Việt.

**Vị trí:** Login.jsx dòng 28, 53-59.

**Steps to reproduce:**
1. Điều hướng tới "/login"
2. Quan sát nhãn trường email và nút submit

**Expected:** Toàn bộ nhãn/nút dùng tiếng Việt nhất quán (FR-21).
**Actual:** Nhãn "Username" và nút "Sign In" bằng tiếng Anh.

**Severity:** Low
**Checklist ID:** LOGIN-U02
**Screenshot:** screenshot/LOGIN-U02.png
```

---

## BUG-GUI-11

**GitHub Issue:** [#135](https://github.com/DuyITLOR/group05_eshop/issues/135)

**Title:** [HW03][BUG][screen: login] Trường Email dùng `type="text"` thay vì `type="email"` (vi phạm FR-02/FR-22)

**Description:**

```
**Mô tả:** Trường Email trên form Login dùng type="text" nên không có validate định dạng HTML5 email.

**Vị trí:** Login.jsx dòng 29-35.

**Steps to reproduce:**
1. Điều hướng tới "/login"
2. Inspect thuộc tính type của input Email

**Expected:** type="email" (FR-02, FR-22).
**Actual:** type="text".

**Severity:** Low
**Checklist ID:** LOGIN-F01
**Screenshot:** screenshot/LOGIN-F01.png
```

---

## BUG-GUI-12

**GitHub Issue:** [#136](https://github.com/DuyITLOR/group05_eshop/issues/136)

**Title:** [HW03][BUG][screen: login] [High] Trường Mật khẩu dùng `type="text"` — mật khẩu hiển thị rõ khi gõ (shoulder-surfing risk)

**Description:**

```
**Mô tả:** Trường Mật khẩu trên form Login dùng type="text" khiến ký tự mật khẩu hiển thị rõ ràng thay vì bị che (••••), vi phạm FR-22 và tạo rủi ro bảo mật shoulder-surfing.

**Vị trí:** Login.jsx dòng 39-45.

**Steps to reproduce:**
1. Điều hướng tới "/login"
2. Gõ bất kỳ chuỗi nào vào trường mật khẩu
3. Quan sát ký tự hiển thị

**Expected:** Ký tự bị che khi gõ (FR-22).
**Actual:** Mật khẩu hiển thị rõ dạng plaintext khi gõ.

**Severity:** High
**Checklist ID:** LOGIN-F02
**Screenshot:** screenshot/LOGIN-F02.png
```

---

## BUG-GUI-13

**GitHub Issue:** [#137](https://github.com/DuyITLOR/group05_eshop/issues/137)

**Title:** [HW03][BUG][screen: login] Thiếu ký hiệu `*` cho các trường bắt buộc trên form Login (vi phạm FR-22)

**Description:**

```
**Mô tả:** Các trường bắt buộc (Email, Mật khẩu) trên form Login không có ký hiệu * cạnh nhãn để báo hiệu bắt buộc nhập.

**Steps to reproduce:**
1. Điều hướng tới "/login"
2. Quan sát nhãn của từng trường input

**Expected:** Có dấu * cạnh nhãn trường bắt buộc (FR-22).
**Actual:** Không có nhãn nào chứa dấu *.

**Severity:** Low
**Checklist ID:** LOGIN-F03
**Screenshot:** screenshot/LOGIN-F03.png
```

---

## BUG-GUI-14

**GitHub Issue:** [#138](https://github.com/DuyITLOR/group05_eshop/issues/138)

**Title:** [HW03][BUG][screen: login] Thông báo lỗi đăng nhập hiển thị dưới nút submit thay vì trên (vi phạm FR-22)

**Description:**

```
**Mô tả:** Khi đăng nhập sai, thông báo lỗi hiển thị bên dưới nút submit thay vì phía trên như spec yêu cầu.

**Vị trí:** Login.jsx dòng 66.

**Steps to reproduce:**
1. Điều hướng tới "/login"
2. Đăng nhập với thông tin sai
3. So sánh vị trí (tọa độ Y) của thông báo lỗi so với nút submit

**Expected:** Thông báo lỗi nằm phía trên nút submit (FR-22).
**Actual:** Thông báo lỗi nằm phía dưới nút submit.

**Severity:** Low
**Checklist ID:** LOGIN-F05
**Screenshot:** screenshot/LOGIN-F05.png
```

---

## BUG-GUI-15

**GitHub Issue:** [#139](https://github.com/DuyITLOR/group05_eshop/issues/139)

**Title:** [HW03][BUG][screen: login] Nút submit đăng nhập không chuyển trạng thái loading/disabled khi đang gọi API

**Description:**

```
**Mô tả:** Trong lúc gọi API đăng nhập, nút submit vẫn ở trạng thái bình thường (không disable, không hiển thị loading), tạo nguy cơ double-submit.

**Steps to reproduce:**
1. Điều hướng tới "/login", nhập thông tin đăng nhập hợp lệ
2. Click submit và ngay lập tức quan sát trạng thái nút trong lúc chờ response

**Expected:** Nút disable/hiển thị loading khi đang xử lý.
**Actual:** Nút vẫn có thể click lại trong lúc request đang chờ — không có trạng thái loading/disabled.

**Severity:** Medium
**Checklist ID:** LOGIN-S02
**Screenshot:** screenshot/LOGIN-S02.png
```

---

## BUG-GUI-16

**GitHub Issue:** [#140](https://github.com/DuyITLOR/group05_eshop/issues/140)

**Title:** [HW03][BUG][screen: login] Bộ đếm đăng nhập sai tăng +2/lần thay vì +1 (vi phạm FR-02)

**Description:**

```
**Mô tả:** Mỗi lần đăng nhập sai, bộ đếm số lần thất bại trên server tăng thêm 2 đơn vị thay vì 1, khiến tài khoản bị khóa sớm hơn dự kiến.

**Vị trí:** server.js dòng 54 (nghi vấn từ đọc code).

**Steps to reproduce:**
1. Đăng nhập sai liên tiếp với cùng 1 tài khoản test
2. Theo dõi số lần thất bại cần thiết để tài khoản bị khóa (kỳ vọng 3 lần theo FR-02)

**Expected:** Bộ đếm tăng đúng +1 mỗi lần sai; khóa sau đúng 3 lần (FR-02).
**Actual:** Nghi vấn tăng +2/lần dựa trên đọc code — cần đo lặp lại nhiều lần để khẳng định tuyệt đối qua thực thi (chưa đủ dữ liệu thực nghiệm để xác nhận 100%).

**Severity:** Medium
**Checklist ID:** LOGIN-S03
**Screenshot:** screenshot/LOGIN-S03.png
```

---

## BUG-GUI-17

**GitHub Issue:** [#141](https://github.com/DuyITLOR/group05_eshop/issues/141)

**Title:** [HW03][BUG][screen: login] Thời gian khóa tài khoản thực tế ~180 giây thay vì 30 giây theo spec (vi phạm FR-02)

**Description:**

```
**Mô tả:** Sau khi tài khoản bị khóa do đăng nhập sai quá số lần cho phép, thời gian khóa thực tế dài hơn nhiều so với spec quy định (30 giây).

**Vị trí:** server.js dòng 57.

**Steps to reproduce:**
1. Làm tài khoản test bị khóa (đăng nhập sai đủ số lần)
2. Chờ 32 giây, gọi lại POST /api/login với mật khẩu đúng
3. Quan sát HTTP status code trả về

**Expected:** Sau đúng 30 giây, tài khoản tự mở khóa, đăng nhập lại thành công (FR-02).
**Actual:** Sau 32 giây vẫn nhận HTTP 403 (chưa mở khóa) — thời gian khóa thực tế ước tính ~180 giây theo code.

**Severity:** Medium
**Checklist ID:** LOGIN-S04
**Screenshot:** screenshot/LOGIN-S04.png
```

---

## BUG-GUI-18

**GitHub Issue:** [#142](https://github.com/DuyITLOR/group05_eshop/issues/142)

**Title:** [HW03][BUG][screen: login] Frontend không phân biệt lỗi "sai mật khẩu" và "tài khoản bị khóa" dù backend đã phân biệt đúng

**Description:**

```
**Mô tả:** Backend trả về status code khác nhau cho "sai mật khẩu" (401) và "tài khoản bị khóa" (403), nhưng frontend gộp chung 1 catch-block nên hiển thị cùng 1 thông báo lỗi cho cả 2 trường hợp.

**Vị trí:** Login.jsx dòng 17-19.

**Steps to reproduce:**
1. Đăng nhập sai mật khẩu 1 lần (chưa khóa) — quan sát thông báo lỗi
2. Đăng nhập sai đủ số lần để bị khóa — quan sát thông báo lỗi lần tiếp theo

**Expected:** Thông báo phân biệt rõ giữa "sai mật khẩu" và "tài khoản đang bị khóa".
**Actual:** Cả 2 trường hợp hiển thị cùng 1 thông báo lỗi chung, dù backend đã trả đúng 401 vs 403 — lỗi hoàn toàn ở tầng UI, không phải logic nghiệp vụ.

**Severity:** Medium
**Checklist ID:** LOGIN-S05
**Screenshot:** screenshot/LOGIN-S05.png
```

---

## BUG-GUI-19

**GitHub Issue:** [#143](https://github.com/DuyITLOR/group05_eshop/issues/143)

**Title:** [HW03][BUG][screen: login] Label "Username"/"Mật khẩu" không liên kết `for`/`htmlFor` với input (accessibility)

**Description:**

```
**Mô tả:** Cả 2 label trên form Login không có thuộc tính for/htmlFor liên kết tới input tương ứng, ảnh hưởng accessibility (click label không focus input, screen reader không liên kết đúng).

**Steps to reproduce:**
1. Điều hướng tới "/login"
2. Inspect 2 thẻ <label>, kiểm tra thuộc tính for/htmlFor
3. Thử click trực tiếp vào text label và quan sát input có được focus không

**Expected:** Click label focus đúng ô input tương ứng (accessibility).
**Actual:** 2/2 label không có for/htmlFor liên kết input.

**Severity:** Low
**Checklist ID:** LOGIN-F07
**Screenshot:** screenshot/LOGIN-F07.png
```

---

## BUG-GUI-20

**GitHub Issue:** [#144](https://github.com/DuyITLOR/group05_eshop/issues/144)

**Title:** [HW03][BUG][screen: login] Không validate định dạng email phía client, request sai định dạng vẫn gửi lên server

**Description:**

```
**Mô tả:** Do trường Email dùng type="text" (BUG-GUI-11), form không validate định dạng email HTML5, cho phép gửi email sai định dạng (thiếu @) thẳng lên server.

**Steps to reproduce:**
1. Điều hướng tới "/login"
2. Nhập email không có ký tự @ (VD "abc") và mật khẩu bất kỳ
3. Submit form

**Expected:** Thông báo lỗi định dạng email rõ ràng, không gửi lên server.
**Actual:** Không có validate HTML5; request được gửi thẳng lên server với email sai định dạng.

**Severity:** Low
**Checklist ID:** LOGIN-F08
**Screenshot:** screenshot/LOGIN-F08.png
```

---

## BUG-GUI-21

**GitHub Issue:** [#145](https://github.com/DuyITLOR/group05_eshop/issues/145)

**Title:** [HW03][BUG][screen: home+login] Không hỗ trợ Dark mode ở cả trang Home và Login

**Description:**

```
**Mô tả:** Cả 2 trang Home và Login không có bất kỳ biến thể dark: nào trong Tailwind, khi ép color-scheme: dark thì nền/chữ vẫn giữ nguyên màu sáng cứng.

**Steps to reproduce:**
1. Bật dark mode ở OS/trình duyệt (hoặc ép color-scheme: dark qua DevTools)
2. Mở lần lượt trang Home và Login, quan sát màu nền/chữ

**Expected:** Nền/chữ tương phản đủ, đọc được ở chế độ tối.
**Actual:** Không có class/biến thể dark: nào trong DOM; nền vẫn bg-white/bg-gray-50 cứng.

**Severity:** Low
**Checklist ID:** HOME-U11, LOGIN-U06
**Screenshot:** screenshot/HOME-U11.png, screenshot/LOGIN-U06.png
```

---

## BUG-GUI-22

**GitHub Issue:** [#146](https://github.com/DuyITLOR/group05_eshop/issues/146)

**Title:** [HW03][BUG][screen: home] Không có phản hồi trực quan (toast/badge) khi bấm "Thêm vào giỏ" trên Home

**Description:**

```
**Mô tả:** Sau khi click "Thêm vào giỏ" trên trang Home, không có toast thông báo hay badge số lượng cập nhật để xác nhận hành động đã thành công.

**Steps to reproduce:**
1. Đăng nhập, mở trang chủ "/"
2. Click "Thêm vào giỏ" trên 1 sản phẩm bất kỳ
3. Quan sát UI ngay sau click

**Expected:** Có toast hoặc badge cập nhật xác nhận hành động (FR-24).
**Actual:** Không phát hiện phản hồi trực quan nào sau khi thêm vào giỏ.

**Severity:** Medium
**Checklist ID:** HOME-S04
**Screenshot:** screenshot/HOME-S04.png
```

---

## BUG-GUI-23

**GitHub Issue:** [#147](https://github.com/DuyITLOR/group05_eshop/issues/147)

**Title:** [HW03][BUG][screen: home] RTL layout không được xử lý chủ động, bố cục bị mirror gây rối mắt

**Description:**

```
**Mô tả:** Khi ép dir="rtl" (mô phỏng ngôn ngữ RTL) qua DevTools, trình duyệt tự động mirror toàn bộ bố cục trang Home (navbar đảo thứ tự, tiêu đề và ô tìm kiếm đổi vị trí hai bên) vì component không dùng logical properties hay xử lý dir chủ động.

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Trong DevTools, set thuộc tính dir="rtl" trên thẻ <html> hoặc <body>
3. Quan sát bố cục navbar và khu vực tìm kiếm

**Expected:** Nếu ứng dụng không hỗ trợ RTL chính thức, layout nên giữ nguyên hướng LTR nhất quán (không tự mirror gây trải nghiệm không kiểm soát); nếu có hỗ trợ RTL thì phải mirror đúng và nhất quán toàn trang.
**Actual:** Trình duyệt tự mirror layout một cách không chủ đích — navbar đảo thứ tự (Đăng ký, Đăng nhập, Giỏ hàng), tiêu đề "Danh sách sản phẩm" và ô tìm kiếm đổi chỗ hai bên.

**Severity:** Low
**Checklist ID:** HOME-U12
**Screenshot:** screenshot/HOME-U12.png
```

---

## BUG-GUI-24

**GitHub Issue:** [#148](https://github.com/DuyITLOR/group05_eshop/issues/148)

**Title:** [HW03][BUG][screen: home] Màu giá sản phẩm không đạt tỉ lệ tương phản WCAG AA

**Description:**

```
**Mô tả:** Giá sản phẩm dùng class text-red-500/text-red-600 trên nền trắng, ước tính tỉ lệ tương phản ~3.0-4.0:1, thấp hơn ngưỡng WCAG AA yêu cầu (4.5:1). Cùng vấn đề đã ghi nhận ở trang ProductDetail (PD-A03).

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Đo tỉ lệ tương phản màu giá (text-red-500/600) so với nền trắng bằng công cụ kiểm tra contrast (VD DevTools Accessibility pane, hoặc WebAIM Contrast Checker)

**Expected:** Tỉ lệ tương phản ≥ 4.5:1 theo WCAG AA.
**Actual:** Tỉ lệ tương phản ước tính ~3.0-4.0:1, không đạt chuẩn.

**Severity:** Low
**Checklist ID:** HOME-U13
**Screenshot:** screenshot/HOME-U13.png
```

---

## BUG-GUI-25

**GitHub Issue:** [#149](https://github.com/DuyITLOR/group05_eshop/issues/149)

**Title:** [HW03][BUG][screen: home] Tìm kiếm không trim khoảng trắng đầu/cuối, cho kết quả khác với từ khóa đã trim

**Description:**

```
**Mô tả:** server.js dòng 144 không gọi trim() trên chuỗi tìm kiếm trước khi nối vào câu lệnh LIKE, khiến tìm kiếm với khoảng trắng thừa cho kết quả khác so với từ khóa đã được trim — hệ quả trực tiếp của lỗ hổng string concatenation đã ghi ở BUG-GUI-07.

**Steps to reproduce:**
1. Mở trang chủ "/"
2. Tìm kiếm 1 từ khóa có khoảng trắng ở đầu/cuối (VD "  áo  ")
3. So sánh kết quả với tìm kiếm từ khóa đã trim ("áo")

**Expected:** Kết quả tìm kiếm giống nhau bất kể có khoảng trắng thừa đầu/cuối hay không.
**Actual:** Kết quả khác nhau do chuỗi có khoảng trắng chưa được trim trước khi nối vào LIKE.

**Severity:** Low
**Checklist ID:** HOME-F08
**Screenshot:** screenshot/HOME-F08.png
```

---

## BUG-GUI-26

**GitHub Issue:** [#150](https://github.com/DuyITLOR/group05_eshop/issues/150)

**Title:** [HW03][BUG][screen: home] Tab order không theo thứ tự thị giác trên-xuống/trái-phải (vi phạm FR-21)

**Description:**

```
**Mô tả:** Khi dùng phím Tab để di chuyển focus trên trang Home, link "Xem chi tiết" của card sản phẩm nhận focus trước ô tìm kiếm, không khớp với thứ tự thị giác từ trên xuống/trái sang phải.

**Steps to reproduce:**
1. Mở trang chủ "/", click vào đầu trang để bắt đầu
2. Nhấn Tab liên tục và ghi lại thứ tự các phần tử nhận focus
3. Đối chiếu với thứ tự thị giác trên màn hình

**Expected:** Tab order khớp với thứ tự thị giác trên xuống/trái sang phải (FR-21).
**Actual:** Link "Xem chi tiết" của card sản phẩm nhận focus trước ô tìm kiếm — không khớp thứ tự thị giác.

**Severity:** Low
**Checklist ID:** HOME-N05
**Screenshot:** screenshot/HOME-N05.png
```

---

## BUG-GUI-27

**GitHub Issue:** [#151](https://github.com/DuyITLOR/group05_eshop/issues/151)

**Title:** [HW03][BUG][screen: home] Click "Thêm vào giỏ" khi chưa đăng nhập không có phản hồi nào (im lặng thất bại)

**Description:**

```
**Mô tả:** Khi người dùng chưa đăng nhập click "Thêm vào giỏ" trên trang Home, không có bất kỳ phản hồi nào xảy ra — không toast báo lỗi, không redirect tới trang đăng nhập, không thêm vào giỏ khách (guest cart).

**Steps to reproduce:**
1. Đảm bảo chưa đăng nhập (đăng xuất nếu cần)
2. Mở trang chủ "/"
3. Click "Thêm vào giỏ" trên 1 sản phẩm bất kỳ
4. Quan sát phản hồi UI

**Expected:** Có phản hồi rõ ràng, VD thông báo yêu cầu đăng nhập hoặc redirect tới /login.
**Actual:** Không có phản hồi nào — hành động thất bại trong im lặng, người dùng không biết vì sao sản phẩm không được thêm vào giỏ.

**Severity:** Medium
**Checklist ID:** HOME-N09
**Screenshot:** screenshot/HOME-N09.png
```

---

## BUG-GUI-28

**GitHub Issue:** [#152](https://github.com/DuyITLOR/group05_eshop/issues/152)

**Title:** [HW03][BUG][screen: login] `tabIndex={1}` gán cứng trên nút submit Login phá vỡ tab order tự nhiên

**Description:**

```
**Mô tả:** Nút submit trên form Login được gán cứng tabIndex={1} trong khi các input phía trên không khai báo tabIndex (mặc định 0), khiến nút submit có thể nhận Tab-focus trước các input, phá vỡ tab order tuần tự tự nhiên.

**Vị trí:** Login.jsx dòng 56.

**Steps to reproduce:**
1. Điều hướng tới "/login", click vào đầu trang
2. Nhấn Tab liên tục và ghi lại thứ tự các phần tử nhận focus

**Expected:** Tab order tuần tự tự nhiên theo DOM order: Email → Mật khẩu → ... → Submit.
**Actual:** tabIndex={1} khiến nút submit chen vào thứ tự focus trước các input phía trên.

**Severity:** Low
**Checklist ID:** LOGIN-N04
**Screenshot:** screenshot/LOGIN-N04.png
```

---

## BUG-GUI-29

**GitHub Issue:** [#153](https://github.com/DuyITLOR/group05_eshop/issues/153)

**Title:** [HW03][BUG][screen: login] Route `/login` thiếu guard: trạng thái mâu thuẫn khi đã đăng nhập truy cập lại

**Description:**

```
**Mô tả:** Khi người dùng đã đăng nhập truy cập lại route "/login", navbar hiển thị đã đăng nhập ("Chào, Test User" + nút "Thoát") trong khi thân trang vẫn hiển thị form đăng nhập trống — route không có guard chống truy cập khi đã đăng nhập.

**Steps to reproduce:**
1. Đăng nhập thành công
2. Điều hướng trực tiếp (gõ URL hoặc back button) tới "/login"
3. Quan sát đồng thời navbar và thân trang

**Expected:** Nếu đã đăng nhập, truy cập "/login" nên redirect về trang chủ hoặc trang trước đó, không hiển thị lại form đăng nhập.
**Actual:** Navbar hiển thị đã đăng nhập trong khi thân trang vẫn hiển thị form đăng nhập trống — trạng thái mâu thuẫn gây bối rối cho người dùng.

**Severity:** Medium
**Checklist ID:** LOGIN-N06
**Screenshot:** screenshot/LOGIN-N06.png
```

---

## BUG-GUI-30

**GitHub Issue:** [#154](https://github.com/DuyITLOR/group05_eshop/issues/154)

**Title:** [HW03][BUG][screen: login] Double-submit đăng nhập do nút submit không disable khi đang gọi API

**Description:**

```
**Mô tả:** Vì nút submit không chuyển trạng thái disable/loading khi đang gọi API đăng nhập (BUG-GUI-15), mỗi lần click thêm trong lúc request đầu chưa hoàn tất có thể kích hoạt thêm 1 request POST /api/login trùng lặp.

**Steps to reproduce:**
1. Điều hướng tới "/login", nhập thông tin đăng nhập hợp lệ
2. Click nhanh liên tiếp nhiều lần vào nút submit trước khi response đầu tiên trả về
3. Quan sát Network tab, đếm số request POST /api/login được gửi

**Expected:** Chỉ 1 request POST /api/login được gửi dù click nhiều lần.
**Actual:** Nhiều request POST /api/login trùng lặp được gửi tương ứng với số lần click trong lúc chờ.

**Severity:** Low
**Checklist ID:** LOGIN-S08
**Screenshot:** screenshot/LOGIN-S08.png
```

---

## Tổng hợp nhanh

| Severity | Số lượng | Bug ID                                                             |
| -------- | -------- | ------------------------------------------------------------------ |
| Critical | 2        | BUG-GUI-04, BUG-GUI-07                                             |
| High     | 1        | BUG-GUI-12                                                         |
| Medium   | 12       | BUG-GUI-02, 05, 06, 08, 09, 15, 16, 17, 18, 22, 27, 29             |
| Low      | 15       | BUG-GUI-01, 03, 10, 11, 13, 14, 19, 20, 21, 23, 24, 25, 26, 28, 30 |
| **Tổng** | **30**   | BUG-GUI-01 → BUG-GUI-30                                            |
