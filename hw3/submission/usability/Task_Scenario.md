# Usability Task Scenario — Luồng Đăng ký → Đăng nhập (EShop)

- **MSSV:** 23127344
- **SUT:** EShop — `frontend-web` tại `http://localhost:5173`
- **Luồng:** FR-01 (Đăng ký tài khoản) → FR-02 (Đăng nhập & khóa tài khoản)
- **Timebox đề xuất:** 8 phút/người

## Mục tiêu (Objectives)

1. Người dùng mới có tự đăng ký thành công **mà không cần trợ giúp** không, đặc biệt khi gặp yêu cầu mật khẩu mạnh (điều kiện thực tế của form khác với thông báo lỗi hiển thị — xem `Register.jsx:15`)?
2. Người dùng có nhận ra và tự phục hồi được khi đăng ký thất bại (lỗi mật khẩu, email trùng) hay bị "kẹt" không hiểu vì sao?
3. Sau khi đăng ký, người dùng có tự tìm được đường sang đăng nhập và đăng nhập thành công ngay lần đầu không?
4. Người dùng cảm thấy tự tin/tin tưởng ra sao ở từng bước — đặc biệt khi thấy mật khẩu hiển thị rõ dạng chữ thường ở màn Login?

## Task Scenario (đọc cho người tham gia)

> "Bạn vừa nghe bạn bè giới thiệu một trang mua sắm trực tuyến tên là **EShop**. Hãy tạo cho mình một tài khoản mới trên trang này bằng thông tin cá nhân bất kỳ (không cần dùng email thật), sau đó đăng nhập vào tài khoản vừa tạo để bắt đầu mua sắm."

Đây là mục tiêu (goal), **không phải hướng dẫn từng bước**. Không nói cho người tham gia biết yêu cầu mật khẩu cụ thể hay vị trí nút bấm.

## Ghi chú cho điều phối viên (KHÔNG đọc cho người tham gia)

- Chuẩn bị sẵn 1 email chưa từng đăng ký trong hệ thống cho mỗi người (gợi ý: `participantP0X@test.local`) để tránh nhiễu do trùng email ở lần thử đầu.
- Nếu người tham gia tự chọn trùng email đã tồn tại (VD `test@eshop.com`), đây cũng là quan sát hợp lệ — hệ thống không có ràng buộc `UNIQUE` cho email, ghi nhận lại phản ứng của người dùng khi không thấy lỗi báo trùng.
- Không gợi ý về quy tắc mật khẩu; chỉ quan sát người dùng tự đọc dòng chú thích "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt." và phản ứng ra sao khi bị từ chối dù nhập đúng theo chú thích đó.

## Điều kiện

- **Bắt đầu:** trình duyệt đã mở sẵn trang chủ EShop (`http://localhost:5173`), chưa đăng nhập, chưa mở trang Đăng ký.
- **Thành công (SUCCESS):** người tham gia (1) đăng ký được tài khoản mới thành công, (2) tự điều hướng sang trang đăng nhập (tự nhấn hoặc bị tự động chuyển), (3) đăng nhập thành công bằng tài khoản vừa tạo.
- **Thất bại (FAIL):** bỏ cuộc, hết timebox, bị kẹt không phục hồi (VD: lặp lại y hệt 1 mật khẩu sai nhiều lần không tự đổi cách), hoặc không đạt đủ 3 điều kiện thành công.
- **Edge — mật khẩu bị từ chối nhiều lần:** nếu người tham gia thử nhiều mật khẩu khác nhau và vẫn bị từ chối, ghi lại đúng các mật khẩu đã thử và thời điểm bỏ cuộc/persist.
- **Edge — không có xác nhận mật khẩu:** quan sát xem người dùng có tự nhận ra thiếu trường "Xác nhận mật khẩu" (khác biệt so với đa số web quen thuộc) hay không, và phản ứng của họ.

## Các điểm dễ gây confuse theo từng giai đoạn (dành cho điều phối viên)

> **Cách dùng bảng này:** đây là danh mục các lỗi **đã xác minh trong source code**, dùng để (a) biết trước nên quan sát kỹ ở đâu, (b) chuẩn bị câu probe đúng chỗ, (c) phân biệt "người dùng gặp khó" với "hệ thống có lỗi".
> **TUYỆT ĐỐI KHÔNG đọc bảng này cho người tham gia** và không gợi ý trước. Chỉ ghi nhận xem họ có tự vượt qua được hay không.
> Cột *Dấu hiệu quan sát* là thứ cần đánh dấu vào timeline trong `sessions/P0X.md`.

### Giai đoạn 1 — Tìm đường vào trang Đăng ký

| # | Điểm gây confuse | Nguồn (đã xác minh) | Dấu hiệu quan sát |
| --- | --- | --- | --- |
| C1.1 | Không có link "Đăng ký" trên thanh điều hướng — người dùng phải vào `/login` trước rồi mới thấy link "Đăng ký ngay", hoặc tự gõ URL | `Navbar.jsx` không chứa link register/login nào | Người dùng lướt qua lướt lại header, hover nhiều lần, hỏi "đăng ký ở đâu?" |

### Giai đoạn 2 — Điền form Đăng ký

| # | Điểm gây confuse | Nguồn (đã xác minh) | Dấu hiệu quan sát |
| --- | --- | --- | --- |
| **C2.1** ⚠️ **BLOCKER** | **Mật khẩu đúng theo hướng dẫn vẫn bị từ chối.** Chú thích ghi "có… ký tự đặc biệt", nhưng regex thật **cấm** ký tự đặc biệt và **bắt buộc có khoảng trắng**. `Password123!` → **FAIL**; `Password 123` → **PASS** | `Register.jsx:15` — `flawedStrongPasswordRegex` = `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/`, khớp `[A-Za-z\d\s]` nên loại mọi ký tự đặc biệt | Thử ≥2 mật khẩu liên tiếp đều bị từ chối; đọc lại chú thích nhiều lần; **đếm số lần thử và ghi lại nguyên văn từng mật khẩu đã gõ** |
| C2.2 | Thông báo lỗi **mâu thuẫn với chính nó** — chữ "KÝ TỰ ĐẶC BIỆT" viết hoa nhấn mạnh đúng thứ đang bị cấm, đẩy người dùng đi sai hướng | `Register.jsx:18` | Người dùng thêm `!@#` vào mật khẩu → càng sai; nói "nó bảo cần ký tự đặc biệt mà?" |
| C2.3 | Lỗi không chỉ rõ **trường nào** sai — chỉ có 1 khung đỏ chung ở đầu form, không highlight ô mật khẩu | `Register.jsx:33` — `{error && <div>}` đặt ngoài các field | Người dùng sửa nhầm ô Email hoặc Họ Tên thay vì ô Mật khẩu |
| C2.4 | **Thiếu ô "Xác nhận mật khẩu"** (FR-01 yêu cầu) — gõ sai không có gì phát hiện, chỉ vỡ lở ở bước đăng nhập | `Register.jsx` chỉ có 3 state: `name`, `email`, `password` | Người dùng tìm ô thứ 4, cuộn lên xuống; hoặc đăng nhập fail ở GĐ4 dù tin là gõ đúng |
| C2.5 | Ô Email dùng `type="text"` chứ không phải `type="email"` — gõ `abc` (không có `@`) vẫn submit được, không có validation trình duyệt | `Register.jsx:47` | Người dùng nhập email sai định dạng mà không hề bị cảnh báo |
| C2.6 | **Email trùng không bị chặn** — bảng `users` không có ràng buộc `UNIQUE`, đăng ký lại cùng email vẫn báo thành công | `database.js:53` — `email TEXT` không có `UNIQUE`; `server.js:22` `INSERT` thẳng | Nếu người dùng tự chọn email đã tồn tại: không thấy lỗi, nhưng đăng nhập sau đó có thể vào nhầm tài khoản cũ |
| C2.7 | Nút "Đăng Ký" **màu đỏ** (`bg-red-500`) — đỏ theo quy ước là hành động nguy hiểm/xóa, gây do dự khi bấm | `Register.jsx:69` | Rê chuột lên nút rồi ngần ngừ, hỏi lại "bấm cái đỏ này đúng không?" |

### Giai đoạn 3 — Chuyển sang trang Đăng nhập

| # | Điểm gây confuse | Nguồn (đã xác minh) | Dấu hiệu quan sát |
| --- | --- | --- | --- |
| C3.1 | Đăng ký thành công **không có thông báo nào** — bị đẩy thẳng sang `/login` không giải thích | `Register.jsx:24` — `navigate('/login')` ngay sau `await`, không có toast/success message | Người dùng khựng lại, hỏi "đăng ký được chưa?", "sao lại quay về đây?" |
| **C3.2** ⚠️ | **Trang Đăng nhập có tiêu đề "Đăng Ký"** — người dùng tin rằng chuyển trang thất bại và đang bị bắt đăng ký lại | `Login.jsx:25` — `<h2>Đăng Ký</h2>` (đúng ra phải là "Đăng Nhập") | Bấm nút back, đăng ký lại lần 2, hoặc nói "nó bắt tôi đăng ký lại à?" |

### Giai đoạn 4 — Đăng nhập

| # | Điểm gây confuse | Nguồn (đã xác minh) | Dấu hiệu quan sát |
| --- | --- | --- | --- |
| C4.1 | Label ghi **"Username"** nhưng thật ra phải nhập **email** — và toàn bộ phần còn lại của app là tiếng Việt | `Login.jsx:28` label "Username"; `Login.jsx:32` `value={email}` gửi vào field `email` | Người dùng gõ tên (`Đạt`) thay vì email → đăng nhập fail lần 1 |
| **C4.2** ⚠️ | **Mật khẩu hiển thị rõ, không che** — dùng `type="text"` thay vì `type="password"` | `Login.jsx:42` | Người dùng che màn hình, liếc quanh, nhận xét về bảo mật → **hỏi kỹ ở probe Trust** |
| C4.3 | Nút bấm ghi **"Sign In"** (tiếng Anh) trong form tiếng Việt, lẫn lộn ngôn ngữ | `Login.jsx:57` | Ngập ngừng trước khi bấm; người ít tiếng Anh phải dừng lại đọc |
| C4.4 | Lỗi đăng nhập **quá chung chung** — mọi nguyên nhân (sai mật khẩu / email không tồn tại / tài khoản bị khóa) đều hiện đúng một câu "Đăng nhập thất bại. Vui lòng kiểm tra lại." | `Login.jsx:18` — `catch` nuốt toàn bộ `err.response.data.error` của backend | Người dùng không biết sai ở đâu, thử lại y hệt → đẩy nhanh tới C4.6 |
| C4.5 | Thông báo lỗi nằm **dưới đáy form**, khác vị trí với trang Đăng ký (ở trên đầu) | `Login.jsx:66` — `{error &&}` đặt sau `</form>` | Bấm xong nhìn lên trên tìm lỗi, tưởng không có phản hồi gì |
| **C4.6** ⚠️ **BLOCKER** | **Bị khóa tài khoản chỉ sau 2 lần sai** (không phải 3) vì bộ đếm cộng **+2** mỗi lần sai. Khóa **180 giây**, và do C4.4 người dùng **không hề biết mình đang bị khóa** | `server.js:54` — `user.login_attempts + 2`; `server.js:57` — `Date.now() + 180000` | Sau 2 lần sai, mọi lần thử tiếp đều fail dù gõ đúng → ghi rõ **thời điểm bị khóa** và phản ứng (bỏ cuộc / chờ / thử email khác) |
| C4.7 | `tabIndex={1}` trên nút Sign In phá vỡ thứ tự Tab — Tab từ ô Username nhảy thẳng xuống nút, bỏ qua ô Mật khẩu | `Login.jsx:58` | Người dùng quen dùng bàn phím bị submit form khi chưa nhập mật khẩu |
| C4.8 | Link "Quên mật khẩu?" dùng `<a href>` thay vì `<Link>` → **reload toàn trang** (mất state), chậm hơn hẳn các link khác | `Login.jsx:53` — `<a href="/forgot-password">` trong khi các link khác dùng `<Link to>` | Trang chớp trắng, người dùng tưởng bị lỗi |

### Giai đoạn 5 — Sau khi đăng nhập thành công

| # | Điểm gây confuse | Nguồn (đã xác minh) | Dấu hiệu quan sát |
| --- | --- | --- | --- |
| C5.1 | Không có thông báo "Đăng nhập thành công" — bị đẩy về trang chủ, người dùng phải **tự tìm bằng chứng** là đã vào được | `Login.jsx:16` — `navigate('/')` không kèm feedback | Cuộn lên tìm tên mình ở header, hỏi "vào được chưa?" → **quan sát kỹ, đây là câu probe "Có lúc nào bạn không chắc thao tác đã thành công chưa?"** |

### Ghi chú quan trọng cho điều phối viên

- **Không cứu người tham gia quá sớm.** C2.1 và C4.6 là 2 blocker thật; giá trị dữ liệu nằm ở chỗ **họ mất bao lâu và làm gì** trước khi bỏ cuộc. Chỉ can thiệp khi hết timebox 8 phút hoặc họ chủ động xin dừng — và ghi lại là 1 lần `moderator intervention`.
- **C2.1 gần như chắc chắn xảy ra** nếu người tham gia đọc chú thích và làm theo. Chuẩn bị sẵn tinh thần phiên sẽ dài hơn dự kiến.
- **C4.6 có thể bị kích hoạt bởi C2.4** (gõ sai mật khẩu lúc đăng ký mà không biết) — khi đó người dùng bị khóa **dù không hề gõ sai gì ở màn Login**. Đây là chuỗi lỗi đáng giá nhất của bài, ghi thật chi tiết nếu gặp.
- Nếu người tham gia **không** gặp một mục nào đó, vẫn ghi lại — "không gặp" cũng là dữ liệu (VD: họ đoán ra quy luật mật khẩu nhanh thế nào).

## Chỉ số thu thập mỗi phiên

- Outcome: `SUCCESS_UNASSISTED`, `SUCCESS_ASSISTED`, `FAIL`, `ABANDONED`.
- Thời lượng hoàn thành (giây).
- Số lần submit form Đăng ký bị lỗi trước khi thành công.
- Số lần hesitation ≥ 5 giây.
- Số lần moderator can thiệp.
- Đăng ký thành công ở lần thử thứ mấy.
- Có tự hiểu đúng yêu cầu mật khẩu trước khi thử không (Y/N).
- Đăng nhập thành công ngay sau đăng ký (Y/N).

## Checklist trước phiên

- [ ] Có đồng thuận tham gia/ghi hình nếu áp dụng.
- [ ] Dùng mã P01–P07, không ghi dữ liệu cá nhân không cần thiết.
- [ ] Chuẩn bị sẵn email test riêng cho từng người, xác nhận email đó chưa tồn tại trong hệ thống.
- [ ] Kiểm tra `frontend-web` (`:5173`) và `backend` (`:3000`) đang chạy.
- [ ] Chuẩn hóa start state (trang chủ, chưa đăng nhập).
- [ ] Không tập trước flow cho người tham gia; nói rõ "test hệ thống, không test bạn".
- [ ] Đã chạy pilot session 1 người, ghi nhận điều chỉnh (nếu có) trước khi chạy 7 phiên chính thức.
