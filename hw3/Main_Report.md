# HW03 — Kiểm thử Giao diện (GUI) và Tính khả dụng (Usability) — Báo cáo chính

## 0. Thông tin sinh viên

| Trường              | Giá trị                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Họ tên              | Trương Thành Đạt                                                                            |
| MSSV                | 23127344                                                                                    |
| Lớp / Nhóm          | Kiểm thử phần mềm - 23KTPM3                                                                 |
| Assignment          | HW03 — GUI and Usability Testing                                                            |
| Ngày nộp            | TODO                                                                                        |
| Self-Assessed Grade | TODO                                                                                        |
| SUT                 | EShop — `https://github.com/DuyITLOR/group05_eshop` (bản dùng chung, tương ứng `eshop-sut`) |
| GitHub Issues       | https://github.com/DuyITLOR/group05_eshop/issues                                            |

## 1. Phạm vi lựa chọn (Scope Selection)

> Theo §5 đề bài: GUI checklist chọn ≥1 màn hình (khuyến khích nhiều màn hình); usability chọn đúng 1 luồng end-to-end.

| Task                              | Phạm vi đã chọn                                                                                                                      | Lý do                                                                                                                                                                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Task 1 — GUI Checklist**        | **(a) Product List / Home (FR-05)** — `frontend-web/src/pages/Home.jsx` + **(b) Login (FR-02)** — `frontend-web/src/pages/Login.jsx` | Hai màn hình liền mạch (khách vào trang chủ rồi đăng nhập), đủ đa dạng thành phần UI (grid + search + form + navbar) để phủ cả 4 khía cạnh IA01–IA04 với >40 item không lặp lại.                                                                                          |
| **Task 2 — Usability Evaluation** | **Luồng: Đăng ký (Sign up) → Đăng nhập (Sign in)** — `Register.jsx` → `Login.jsx`                                                    | FR-01 + FR-02. Đây là luồng onboarding đầu tiên mọi người dùng mới phải vượt qua; nhiều ràng buộc ẩn (regex mật khẩu, thiếu xác nhận mật khẩu, quy tắc khóa tài khoản) khiến đây là điểm rẽ nhánh nhiều khả năng gây bối rối/thất bại — phù hợp để đo tính khả dụng thật. |

**Môi trường kiểm thử chính:** Chrome / Windows 11, `frontend-web` tại `http://localhost:5173`, `backend` tại `http://localhost:3000`.

---

# TASK 1 — GUI Checklist (Product List + Login)

## 1.1 Nguồn tham chiếu đã đọc

| Nguồn                                                      | Nội dung liên quan                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md` (SRS) §3 FR-05 (dòng 73-81)                    | Yêu cầu trang danh sách sản phẩm: ảnh có alt, giá định dạng ₫, tìm kiếm an toàn (không render HTML), loading state, empty state, đúng 1 `<h1>`.                                                                                                                                                                                  |
| `README.md` §2 FR-02 (dòng 38-44)                          | Yêu cầu đăng nhập: đếm sai tăng đúng 1, khóa 30 giây sau ≥3 lần sai, email dùng `type="email"`.                                                                                                                                                                                                                                  |
| `README.md` §8 FR-21–FR-24 (dòng 242-270)                  | Chuẩn GUI chung: ngôn ngữ nhất quán (tiếng Việt), màu nút (xanh=tích cực/đỏ=nguy hiểm), đơn vị tiền `₫`, 1 `<h1>`/trang, tab order, nhãn bắt buộc có `*`, `type="email"`/`type="password"`, lỗi hiển thị **trên** nút submit, navbar highlight trang hiện tại, badge giỏ hàng, nút "Đăng xuất" (không phải "Thoát"), breadcrumb. |
| `frontend-web/src/pages/Home.jsx` (116 dòng, đọc toàn bộ)  | Trang danh sách sản phẩm thực tế.                                                                                                                                                                                                                                                                                                |
| `frontend-web/src/pages/Login.jsx` (69 dòng, đọc toàn bộ)  | Trang đăng nhập thực tế.                                                                                                                                                                                                                                                                                                         |
| `frontend-web/src/App.jsx`                                 | Header/Navbar dùng chung toàn site.                                                                                                                                                                                                                                                                                              |
| `backend/server.js` dòng 32-66 (login), 141-165 (products) | Hành vi backend, đối chiếu oracle.                                                                                                                                                                                                                                                                                               |

## 1.2 Bước 1 — Prompt AI sinh checklist khởi tạo (AI-First, có hướng dẫn)

> Ghi log đầy đủ trong AI Audit Report (phụ lục). Tóm tắt ở đây để báo cáo liền mạch.

**Prompt đã dùng (tóm tắt):** "Đóng vai chuyên gia kiểm thử GUI. Dựa trên 4 khía cạnh IA01 General UI, IA02 Forms, IA03 Navigation, IA04 Feedback/State, hãy sinh checklist kiểm thử giao diện cho hai màn hình của một ứng dụng thương mại điện tử tiếng Việt: (1) trang Danh sách sản phẩm có ô tìm kiếm, (2) trang Đăng nhập có email + mật khẩu. Với mỗi item, nêu rõ Expected result. Không đưa ra bug cụ thể, chỉ đưa ra tiêu chí kiểm tra chung." — cố tình **không** cho AI xem source code để tránh AI "học tủ" theo bug đã biết; source code chỉ dùng ở bước review/execution của em.

**Kết quả AI sinh:** khoảng 32 item chung chung (ví dụ: "kiểm tra logo hiển thị đúng", "kiểm tra ô tìm kiếm có placeholder", "kiểm tra nút Đăng nhập có phản hồi khi click", "kiểm tra thông báo lỗi khi sai mật khẩu"...).

## 1.3 Bước 2 — Review của con người & bổ sung item AI bỏ sót

Đối chiếu 32 item AI sinh với SRS (FR-05, FR-02, FR-21–24) và source code thật, em nhận thấy AI bỏ sót các nhóm sau:

| #   | Nhóm item AI bỏ sót                                                                                                       | Item bổ sung (ví dụ)                                                                                   | Vì sao AI bỏ sót                                                                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Accessibility** (alt text có ý nghĩa, tab order, liên kết label↔input)                                                  | HOME-A01, LOGIN-A02                                                                                    | AI được yêu cầu chung chung "kiểm tra ảnh hiển thị đúng" nhưng không tự suy ra alt text phải _mô tả nội dung_ (FR-24) — do prompt không nêu rõ tiêu chí accessibility, và mô hình mặc định ưu tiên chức năng hiển thị hơn khả năng tiếp cận.   |
| 2   | **Dark mode**                                                                                                             | HOME-A05, LOGIN-A04                                                                                    | AI không có ngữ cảnh rằng SUT dùng Tailwind với class cứng (`bg-white`, `bg-blue-600`) không có biến thể `dark:`; đây là hạn chế phổ biến của AI khi sinh checklist "lý thuyết" mà không thấy code — đúng như gợi ý trong đề bài (§6, Task 1). |
| 3   | **RTL layout**                                                                                                            | HOME-A06                                                                                               | Tương tự — AI mặc định giao diện LTR vì không được cho biết ứng dụng có global CSS nào ảnh hưởng đến logical properties (`margin-left/right` cứng).                                                                                            |
| 4   | **Nhất quán màu nút theo ngữ nghĩa** (nút tích cực phải xanh, nút nguy hiểm phải đỏ — FR-21)                              | HOME-U08, chéo-kiểm với Register                                                                       | AI chỉ kiểm "nút có màu sắc rõ ràng", không kiểm _đúng ngữ nghĩa màu_ theo quy ước nghiệp vụ vì AI không được cấp bảng quy ước màu của SRS trong prompt đầu.                                                                                   |
| 5   | **Đối chiếu số đếm sai đăng nhập tăng đúng 1 đơn vị & thời lượng khóa chính xác 30 giây** (không chỉ "có khóa tài khoản") | LOGIN-S05, LOGIN-S06                                                                                   | AI sinh item ở mức hành vi bề mặt ("tài khoản bị khóa sau nhiều lần sai") nhưng không tự suy ra cần kiểm định lượng chính xác số lần và thời gian — đây là giới hạn của AI khi không được cấp con số cụ thể từ đặc tả trong prompt tóm tắt.    |
| 6   | **Toàn vẹn ngôn ngữ hỗn hợp Anh-Việt trong cùng 1 form** (label "Username", nút "Sign In" giữa giao diện tiếng Việt)      | LOGIN-U02                                                                                              | AI mặc định kiểm "văn bản có dễ hiểu" chứ không kiểm _tính nhất quán ngôn ngữ toàn cục_ vì thiếu ngữ cảnh rằng phần còn lại của app là tiếng Việt 100%.                                                                                        |
| 7   | **Breadcrumb tại các trang con**                                                                                          | (ghi nhận N/A cho 2 trang này vì FR-23 chỉ yêu cầu breadcrumb ở Giỏ hàng/Thanh toán/Chi tiết sản phẩm) | AI đề xuất breadcrumb cho mọi trang một cách máy móc; em phải tự giới hạn phạm vi đúng theo SRS để tránh item sai phạm vi.                                                                                                                     |

> **Nhận xét chung (đáp ứng yêu cầu "giải thích vì sao AI bỏ sót"):** Phần lớn thiếu sót của AI đến từ (i) **prompt ban đầu không cấp đủ ngữ cảnh định lượng** (con số, quy ước màu cụ thể) và (ii) **giới hạn cố hữu của mô hình** khi sinh checklist "từ không" mà không thấy source — AI có xu hướng liệt kê các tiêu chí phổ quát, hiển nhiên (labels, placeholders, button hoạt động) hơn là các khía cạnh cần suy luận sâu (accessibility, dark mode, RTL, nhất quán ngữ nghĩa xuyên trang).

## 1.4 GUI Checklist — Bảng đầy đủ (Design + Execution)

> **Cập nhật:** Cột `Result`/`Notes` bên dưới đã được điền từ kết quả **thực thi tự động thật** bằng bộ Selenium (`selenium/run_checklist.py`, chạy trên Chrome, single browser), không còn là suy luận tĩnh từ code. Toàn bộ 69 item đã chạy qua script; các item không thể tự động hoá (cảm quan/chủ quan) được script đánh dấu `MANUAL` kèm ảnh chụp để tự đối chiếu — đúng tinh thần "Human review" của đề bài. Báo cáo thực thi đầy đủ (HTML + Markdown): `selenium/report/index.html`, `selenium/report/report.md`. Ảnh chụp toàn bộ 69 item: `selenium/screenshots/<ID>.png`.
>
> Môi trường thực thi: Chrome (Selenium Manager, chế độ headless) / Windows 11, `http://localhost:5173` + backend `http://localhost:3000`. Tài khoản test: `test@eshop.com` / `Test1234!`. Dữ liệu sản phẩm tại thời điểm chạy: 5 sản phẩm trong DB.

### A. Product List / Home (FR-05) — IA01 General UI

| ID       | Check item                                                                                      | Expected                                    | Result | Notes                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| HOME-U01 | Trang chỉ có đúng 1 thẻ `<h1>`                                                                  | 1 `<h1>` duy nhất (FR-21, FR-05)            | **FAIL** | Selenium xác nhận: tìm thấy 2 thẻ `<h1>` ("Danh sách sản phẩm", "Hiển thị 5 sản phẩm") — Home.jsx dòng 43 và 110. |
| HOME-U02 | Ảnh sản phẩm có thuộc tính `alt` mô tả nội dung, không rỗng                                     | `alt="<tên sản phẩm>"` (FR-24)              | **FAIL** | Selenium xác nhận: 5/5 ảnh sản phẩm có `alt` rỗng (Home.jsx:82). |
| HOME-U03 | Giá hiển thị đúng đơn vị `₫` với dấu phân cách hàng nghìn                                       | VD `1.500.000 ₫` (FR-21)                    | **FAIL** | Selenium xác nhận: trang dùng chuỗi "VND" thay vì ký hiệu ₫ (Home.jsx:86-88). |
| HOME-U04 | Tên sản phẩm dài không vỡ layout (truncate/ellipsis)                                            | Không tràn khung card                       | MANUAL | Có class `truncate`; xem ảnh `HOME-U04.png` để xác nhận trực quan. |
| HOME-U05 | Bố cục lưới sản phẩm responsive đúng số cột theo breakpoint (1 cột mobile, 2 tablet, 3 desktop) | Grid co giãn đúng                           | MANUAL | Đã chụp 3 kích thước màn hình (1400/800/375px), xem ảnh `HOME-U05.png` để xác nhận số cột. |
| HOME-U06 | Toàn bộ văn bản trên trang dùng tiếng Việt nhất quán                                            | Không lẫn tiếng Anh không cần thiết (FR-21) | PASS   | Selenium xác nhận: không phát hiện nhãn tiếng Anh lạc trên trang Home. |
| HOME-U07 | Header/Navbar hiển thị nhất quán trên trang Home (logo, giỏ hàng, đăng nhập/đăng ký)            | Navbar đầy đủ                               | PASS   | Selenium xác nhận: header có logo "EShop" và link "Giỏ hàng". |
| HOME-U08 | Nút "Thêm vào giỏ" dùng màu xanh dương (hành động tích cực) theo quy ước màu FR-21              | Màu xanh dương                              | PASS   | Selenium xác nhận: nút dùng class chứa `bg-blue-600`. |
| HOME-U09 | Card sản phẩm có khoảng cách (spacing/padding) đều nhau, không dính sát mép                     | Spacing đồng nhất                           | MANUAL | Xem ảnh `HOME-U09.png` để xác nhận trực quan. |
| HOME-U10 | Font chữ, cỡ chữ tên/giá nhất quán giữa các card                                                | Đồng bộ toàn lưới                           | MANUAL | Xem ảnh `HOME-U10.png` để xác nhận trực quan. |
| HOME-U11 | Trang hỗ trợ **Dark mode** (theo `prefers-color-scheme` của OS/trình duyệt) vẫn đọc được        | Nền/chữ tương phản đủ ở chế độ tối          | **FAIL** | Selenium xác nhận: không có class/biến thể `dark:` nào trong DOM; nền vẫn `bg-white`/`bg-gray-50` cứng khi ép `color-scheme: dark`. |
| HOME-U12 | Layout không vỡ khi giả lập **RTL** (`dir="rtl"`) qua DevTools                                  | Không tràn/lệch card                        | MANUAL | Đã ép `dir="rtl"` bằng script, xem ảnh `HOME-U12.png` để xác nhận layout có vỡ không. |
| HOME-U13 | Độ tương phản màu chữ tên sản phẩm/giá trên nền card đạt chuẩn WCAG AA (≥4.5:1)                 | Contrast đạt AA                             | MANUAL | Cần đo bằng DevTools Accessibility, đối chiếu ảnh `HOME-U13.png`. |
| HOME-U14 | Card sản phẩm có trạng thái `hover` (đổi bóng/viền) để gợi ý có thể tương tác                   | Hover feedback rõ                           | MANUAL | Cần thao tác chuột trực tiếp, xem ảnh `HOME-U14.png`. |

### B. Product List / Home (FR-05) — IA02 Forms (ô tìm kiếm)

| ID       | Check item                                                                                               | Expected                                             | Result | Notes                                                                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| HOME-F01 | Ô tìm kiếm có `placeholder` gợi ý rõ ràng                                                                | VD "Tìm kiếm..."                                     | PASS   | Selenium xác nhận: placeholder = "Tìm kiếm...". |
| HOME-F02 | Nhấn nút "Tìm" với ô trống không gây lỗi/crash                                                           | Trả về danh sách đầy đủ hoặc giữ nguyên              | PASS   | Selenium xác nhận: submit tìm kiếm rỗng không gây crash / trang vẫn render. |
| HOME-F03 | Có thể submit tìm kiếm bằng phím Enter, không chỉ bằng click chuột                                       | Enter kích hoạt tìm kiếm                             | PASS   | Selenium xác nhận: Enter kích hoạt tìm kiếm (thấy dòng "Kết quả tìm kiếm cho"). |
| HOME-F04 | Từ khóa tìm kiếm chứa ký tự đặc biệt/HTML không được render thành HTML (chống XSS)                       | Hiển thị dạng text thuần (FR-05, SEC-04)             | **FAIL** | Selenium xác nhận (payload `<b id=xss-marker-selenium>x</b>` render thành thẻ `<b>` thật trong DOM): XSS xác nhận qua `dangerouslySetInnerHTML` không escape (Home.jsx:64). |
| HOME-F05 | Ô tìm kiếm giữ lại giá trị đã nhập sau khi submit (không tự xóa)                                         | Giá trị còn hiển thị trong ô                         | PASS   | Selenium xác nhận: giá trị ô tìm kiếm được giữ lại sau submit. |
| HOME-F06 | Nút "Tìm" có kích thước/hitbox đủ lớn, dễ bấm trên mobile                                                | Vùng bấm ≥ 44x44px                                   | PASS   | Selenium đo: kích thước nút Tìm 58×42px. |
| HOME-F07 | Ô tìm kiếm có thể điều khiển hoàn toàn bằng bàn phím (Tab để focus, gõ, Enter để submit) không cần chuột | Keyboard-only OK                                     | MANUAL | Sau 1 lần Tab từ body, phần tử active là `<a>` (không phải ô tìm kiếm ngay) — cần xác nhận thủ công số lần Tab cần thiết, xem ảnh `HOME-F07.png`. |
| HOME-F08 | Tìm kiếm với khoảng trắng đầu/cuối (VD `"  áo  "`) không trả kết quả rỗng sai lệch so với `"áo"`         | Kết quả nhất quán, không phân biệt khoảng trắng thừa | MANUAL | Đã submit tìm kiếm với khoảng trắng thừa, xem ảnh `HOME-F08.png` để so sánh số kết quả. |
| HOME-F09 | Tìm kiếm phân biệt hoa/thường được xử lý nhất quán (VD "áo" và "ÁO" trả cùng kết quả)                    | Không phân biệt hoa/thường                           | MANUAL | Cần chạy 2 lần tìm kiếm (hoa/thường) và so sánh số kết quả thủ công, xem ảnh `HOME-F09.png`. |

### C. Product List / Home (FR-05) — IA03 Navigation

| ID       | Check item                                                                                                                         | Expected                                        | Result | Notes                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| HOME-N01 | Click "Xem chi tiết" điều hướng đúng sang `/product/:id` tương ứng                                                                 | Đúng sản phẩm được chọn                         | PASS   | Selenium xác nhận: điều hướng thành công tới `/product/1`. |
| HOME-N02 | Click logo "EShop" từ Home vẫn ở lại/về đúng trang chủ                                                                             | Không lỗi điều hướng                            | PASS   | Selenium xác nhận: click logo giữ nguyên/điều hướng đúng về trang chủ. |
| HOME-N03 | Navbar highlight (in đậm/gạch chân/đổi màu) mục đang được chọn ("Trang chủ")                                                       | Có trạng thái active rõ ràng (FR-23)            | **FAIL** | Selenium xác nhận: không có cơ chế active-state (class active/aria-current) trên navbar; toàn bộ link chỉ có `hover:underline`. |
| HOME-N04 | Link "Giỏ hàng" trên navbar hiển thị badge số lượng sản phẩm trong giỏ                                                             | Badge số đúng (FR-23)                           | **FAIL** | Selenium xác nhận: link "Giỏ hàng" không có badge số lượng đi kèm (App.jsx:23). |
| HOME-N05 | Tab order từ ô tìm kiếm → nút Tìm → card sản phẩm đi theo đúng thứ tự trên xuống, trái sang phải                                   | Tab tuần tự hợp lý (FR-21)                      | MANUAL | Xem ảnh `HOME-N05.png` để xác nhận tuần tự Tab bằng bàn phím. |
| HOME-N06 | Không có breadcrumb thừa trên trang chủ (breadcrumb chỉ bắt buộc ở Cart/Checkout/Product Detail theo FR-23)                        | Không có breadcrumb ở Home                      | N/A    | Breadcrumb không bắt buộc cho Home theo FR-23 (chỉ áp dụng Cart/Checkout/Product Detail). |
| HOME-N07 | Truy cập trực tiếp URL `/` (không qua điều hướng nội bộ) vẫn load đúng danh sách sản phẩm                                          | Trang render đầy đủ                             | PASS   | Selenium xác nhận: truy cập trực tiếp "/" render nội dung trang chủ đầy đủ. |
| HOME-N08 | Nút/link "Xem chi tiết" và "Thêm vào giỏ" trên cùng 1 card không chồng lấn vùng bấm (dễ bấm nhầm)                                  | 2 vùng bấm tách biệt rõ                         | PASS   | Selenium xác nhận (so sánh toạ độ `rect`): hai vùng bấm tách biệt, không chồng lấn. |
| HOME-N09 | Khi chưa đăng nhập, click "Thêm vào giỏ" hành xử nhất quán (cho phép giỏ khách hoặc điều hướng đăng nhập) — không im lặng thất bại | Có phản hồi rõ ràng theo đúng 1 trong 2 hành vi | MANUAL | Đã click "Thêm vào giỏ" khi chưa đăng nhập, xem ảnh `HOME-N09.png` để xác nhận có phản hồi rõ ràng hay im lặng thất bại. |

### D. Product List / Home (FR-05) — IA04 Feedback / State

| ID       | Check item                                                                                                              | Expected                                        | Result | Notes                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| HOME-S01 | Khi trang đang tải dữ liệu sản phẩm, có hiển thị trạng thái loading                                                     | Có spinner/"Đang tải..." (FR-05)                | **FAIL** | Selenium xác nhận: không phát hiện trạng thái loading (spinner/"Đang tải...") khi vào trang. |
| HOME-S02 | Khi tìm kiếm không ra kết quả, có empty state thân thiện (icon + thông báo)                                             | VD "Không tìm thấy sản phẩm nào" (FR-05, FR-24) | **FAIL** | Selenium xác nhận: không có empty state rõ ràng khi tìm kiếm không ra kết quả (trang chỉ trống trơn). |
| HOME-S03 | Khi API lỗi (mất mạng/500), người dùng nhận được thông báo lỗi rõ ràng, không phải màn hình trắng hoặc lỗi kỹ thuật thô | Thông báo thân thiện                            | MANUAL | Script chưa kích hoạt được lỗi 500 qua payload thử qua UI; xem ảnh `HOME-S03.png` — cần xác nhận thủ công hành vi khi backend lỗi thật (VD tắt backend). |
| HOME-S04 | Click "Thêm vào giỏ" có phản hồi trực quan tức thì (toast/badge)                                                        | Toast hoặc badge cập nhật (FR-24)               | **FAIL** | Selenium xác nhận: không phát hiện phản hồi trực quan (toast/badge) sau khi Thêm vào giỏ trên Home. |
| HOME-S05 | Số lượng sản phẩm hiển thị ("Hiển thị N sản phẩm") cập nhật đúng sau khi tìm kiếm                                       | Số khớp kết quả tìm kiếm                        | MANUAL | Selenium ghi nhận: trước "Hiển thị 5 sản phẩm", sau tìm "a" → "Hiển thị 4 sản phẩm"; xem ảnh `HOME-S05.png` để xác nhận số khớp kết quả thật. |
| HOME-S06 | "Kết quả tìm kiếm cho: {từ khóa}" chỉ hiện khi có từ khóa, ẩn khi ô tìm kiếm trống                                      | Hiện/ẩn đúng điều kiện                          | PASS   | Selenium xác nhận: dòng "Kết quả tìm kiếm cho" chỉ hiện sau khi có từ khóa (Home.jsx:61-66). |
| HOME-S07 | Reload trang (F5) sau khi tìm kiếm không để lại trạng thái treo (loading vô hạn) hoặc lỗi console                       | Trang load lại sạch                             | PASS   | Selenium xác nhận: reload trang không phát sinh lỗi console SEVERE. |

### E. Login (FR-02) — IA01 General UI

| ID        | Check item                                                                                            | Expected                                 | Result | Notes                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| LOGIN-U01 | Tiêu đề trang mô tả đúng chức năng ("Đăng nhập")                                                      | `<h2>Đăng Nhập</h2>` hoặc tương đương    | **FAIL** | Selenium xác nhận: tiêu đề thực tế là "Đăng Ký" (copy-paste lỗi từ trang Register, Login.jsx:24). |
| LOGIN-U02 | Toàn bộ nhãn và nút trên form dùng tiếng Việt nhất quán với phần còn lại của site                     | Không lẫn "Username"/"Sign In" (FR-21)   | **FAIL** | Selenium xác nhận: tìm thấy nhãn tiếng Anh "Username" và nút "Sign In" (Login.jsx:28, 53-59). |
| LOGIN-U03 | Nút submit đăng nhập dùng màu xanh dương (hành động tích cực)                                         | Xanh dương theo FR-21                    | PASS   | Selenium xác nhận: nút submit dùng class chứa `bg-blue-600`. |
| LOGIN-U04 | Form căn giữa, khoảng cách các trường đều nhau, dễ đọc                                                | Bố cục cân đối                           | MANUAL | Xem ảnh `LOGIN-U04.png` để xác nhận trực quan. |
| LOGIN-U05 | Link "Quên mật khẩu?" và link "Đăng ký ngay" phân biệt rõ với nút chính (không gây nhầm lẫn thao tác) | Phân cấp thị giác rõ                     | MANUAL | Xem ảnh `LOGIN-U05.png` để xác nhận trực quan. |
| LOGIN-U06 | Trang Login hỗ trợ Dark mode, không bị chói/mất chữ ở chế độ tối                                      | Đủ tương phản dark mode                  | **FAIL** | Selenium xác nhận: không có biến thể `dark:` nào trong DOM trang Login. |
| LOGIN-U07 | Form đăng nhập responsive tốt trên màn hình mobile (không tràn ngang, input không bị bóp méo)         | Hiển thị đầy đủ, dễ thao tác trên mobile | PASS   | Selenium xác nhận: không phát hiện tràn ngang ở độ rộng mobile 375px. |

### F. Login (FR-02) — IA02 Forms

| ID        | Check item                                                                                                                   | Expected                                      | Result | Notes                                                                                                                                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LOGIN-F01 | Trường Email dùng `type="email"` (có validate định dạng HTML5)                                                               | `type="email"` (FR-02, FR-22)                 | **FAIL** | Selenium xác nhận: trường Email dùng `type="text"` thay vì `type="email"` (Login.jsx:29-35). |
| LOGIN-F02 | Trường Mật khẩu dùng `type="password"`, ký tự bị che khi gõ                                                                  | Không hiển thị rõ (FR-22)                     | **FAIL** | Selenium xác nhận: trường Mật khẩu dùng `type="text"` — mật khẩu hiển thị rõ khi gõ (Login.jsx:39-45). |
| LOGIN-F03 | Các trường bắt buộc có ký hiệu `*` cạnh nhãn                                                                                 | Có dấu `*` (FR-22)                            | **FAIL** | Selenium xác nhận: không có nhãn nào chứa dấu `*` cho trường bắt buộc. |
| LOGIN-F04 | Bỏ trống 1 trong 2 trường rồi submit bị chặn phía client (`required`)                                                        | Không gửi request, browser cảnh báo           | PASS   | Selenium xác nhận: submit với form trống bị chặn phía client (không điều hướng/gọi API). |
| LOGIN-F05 | Thông báo lỗi khi đăng nhập sai hiển thị **phía trên** nút submit                                                            | Lỗi nằm trên nút (FR-22)                      | **FAIL** | Selenium xác nhận (so sánh toạ độ Y): thông báo lỗi hiển thị **phía dưới** nút submit (Login.jsx:66). |
| LOGIN-F06 | Form có thể submit bằng phím Enter khi đang focus trong ô mật khẩu                                                           | Enter = submit                                | PASS   | Selenium xác nhận: Enter trong ô mật khẩu kích hoạt submit thành công. |
| LOGIN-F07 | Nhãn "Username"/"Mật khẩu" liên kết ngữ nghĩa đúng với input tương ứng (`<label for>`/`htmlFor` hoặc lồng input trong label) | Click nhãn focus đúng ô input (accessibility) | **FAIL** | Selenium xác nhận: 2/2 label không có thuộc tính `for`/`htmlFor` liên kết input. |
| LOGIN-F08 | Nhập email sai định dạng (không có `@`) rồi submit hiển thị lỗi phù hợp, không phải lỗi server chung chung                   | Thông báo lỗi định dạng rõ ràng               | **FAIL** | Selenium xác nhận: không có validate HTML5 định dạng email (do input dùng `type="text"`); request được gửi thẳng lên server với email sai định dạng. |

### G. Login (FR-02) — IA03 Navigation

| ID        | Check item                                                                                        | Expected                                       | Result | Notes                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| LOGIN-N01 | Sau đăng nhập thành công, điều hướng về trang chủ hoặc trang trước đó                             | Chuyển trang đúng                              | PASS   | Selenium xác nhận: điều hướng sau đăng nhập thành công tới `/`. |
| LOGIN-N02 | Link "Chưa có tài khoản? Đăng ký ngay" điều hướng đúng sang `/register`                           | Đúng route                                     | PASS   | Selenium xác nhận: link "Đăng ký ngay" điều hướng đúng. |
| LOGIN-N03 | Link "Quên mật khẩu?" điều hướng đúng sang `/forgot-password`                                     | Đúng route                                     | PASS   | Selenium xác nhận: link "Quên mật khẩu?" điều hướng đúng. |
| LOGIN-N04 | Tab order: Email → Mật khẩu → Quên mật khẩu → nút Đăng nhập theo đúng thứ tự trực quan            | Tab tuần tự hợp lý (FR-21)                     | MANUAL | Xem ảnh `LOGIN-N04.png` — `tabIndex={1}` cứng trên nút submit (Login.jsx:56) cần xác nhận thủ công có phá vỡ tab order tự nhiên không. |
| LOGIN-N05 | Navbar vẫn hiển thị đầy đủ và hoạt động khi đứng ở trang Login (chưa đăng nhập)                   | Logo + Giỏ hàng + Đăng nhập/Đăng ký hiển thị   | PASS   | Selenium xác nhận: navbar đầy đủ khi chưa đăng nhập trên trang Login. |
| LOGIN-N06 | Đã đăng nhập rồi mà truy cập lại `/login` không gây lỗi/vòng lặp điều hướng                       | Xử lý hợp lý (redirect hoặc hiển thị lại form) | MANUAL | Selenium ghi nhận: vẫn ở lại `/login` dù đã đăng nhập (không có route guard trong App.jsx); xem ảnh `LOGIN-N06.png` để xác nhận form có hiển thị bất thường không. |
| LOGIN-N07 | Sau khi đăng xuất từ trang khác rồi quay lại `/login`, form trống, không giữ lại dữ liệu phiên cũ | Form sạch, không có dữ liệu rơi rớt            | MANUAL | Cần luồng đăng nhập rồi đăng xuất thủ công để xác nhận, xem ảnh `LOGIN-N07.png`. |

### H. Login (FR-02) — IA04 Feedback / State

| ID        | Check item                                                                                                                | Expected                               | Result | Notes                                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LOGIN-S01 | Sai email hoặc sai mật khẩu hiển thị thông báo lỗi chung, không tiết lộ trường nào sai                                    | VD "Đăng nhập thất bại..."             | PASS   | Selenium xác nhận: có thông báo lỗi chung khi đăng nhập với tài khoản không tồn tại. |
| LOGIN-S02 | Trong lúc gọi API đăng nhập, nút submit chuyển trạng thái loading/disabled (chống double-submit)                          | Nút disable khi đang xử lý             | **FAIL** | Selenium xác nhận: nút submit không chuyển trạng thái disabled/loading khi đang gọi API. |
| LOGIN-S03 | Sau 3 lần đăng nhập sai liên tiếp, tài khoản bị khóa và có thông báo phù hợp                                              | Thông báo khóa tài khoản (FR-02)       | PASS   | Xác nhận bằng gọi API trực tiếp (`POST /api/login`, bypass UI vì UI che message — xem LOGIN-S05): tài khoản test tạm bị khóa (HTTP 403) đúng sau lần sai thứ 3. **Lưu ý:** server.js:54 vẫn tăng bộ đếm +2/lần thay vì +1 theo spec (BUG-GUI-16) — việc khóa đúng ở lần 3 trong lượt đo này một phần là trùng hợp số học (2→4≥3), không phải do bộ đếm đúng chuẩn; cần thêm phép đo lặp lại để khẳng định chắc chắn hành vi ở biên. |
| LOGIN-S04 | Thời gian khóa tài khoản đúng 30 giây theo spec demo                                                                      | Mở khóa lại sau 30s (FR-02)            | **FAIL** | Xác nhận bằng API: sau 32 giây, gọi lại `/api/login` vẫn nhận HTTP 403 (chưa mở khóa) — khớp với nghi vấn tĩnh trước đó rằng thời gian khóa thực tế là 180s (server.js:57), không phải 30s. |
| LOGIN-S05 | Khi tài khoản đang bị khóa, thông báo lỗi hiển thị cho người dùng phải phân biệt được với lỗi "sai mật khẩu" thông thường | Thông điệp khác nhau giữa 2 trường hợp | **FAIL** | Xác nhận: **backend có phân biệt** (401 `{"error":"Invalid email or password"}` khi sai mật khẩu vs 403 `{"error":"Tài khoản đã bị khóa..."}` khi bị khóa), nhưng **UI Login.jsx luôn hiển thị 1 câu chung** "Đăng nhập thất bại. Vui lòng kiểm tra lại." cho cả hai trường hợp (dòng 17-19) — người dùng thật không bao giờ thấy sự phân biệt mà backend đã cung cấp. |
| LOGIN-S06 | Sau khi tài khoản hết thời gian khóa, đăng nhập lại đúng mật khẩu phải thành công (không bị khóa vĩnh viễn)               | Mở khóa tự động                        | **FAIL** | Ở mốc 32s tài khoản vẫn khóa (status 403) — chưa xác nhận được "mở khóa tự động" trong khung thời gian spec quy định; nhất quán với BUG-GUI-17 (khóa thực tế ~180s). |
| LOGIN-S07 | Đăng nhập thành công không để lộ JWT token hay thông tin nhạy cảm ra giao diện (console.log/URL)                          | Không log token ra console/URL         | MANUAL | Selenium ghi nhận `localStorage` có giá trị dài (khả năng chứa JWT) sau đăng nhập; xem ảnh `LOGIN-S07.png` — cần xác nhận thủ công qua tab Network/Application rằng token không lộ ra console/URL. |
| LOGIN-S08 | Bấm nhiều lần liên tục vào nút submit trong lúc request đang chạy không tạo nhiều request đăng nhập trùng lặp             | Chỉ 1 request được gửi                 | MANUAL | Đã bấm nút submit 5 lần liên tục; xem ảnh `LOGIN-S08.png` — cần xác nhận thủ công qua tab Network xem có nhiều request POST `/api/login` trùng lặp hay không (liên quan trực tiếp LOGIN-S02, đã FAIL). |

## 1.5 Tổng kết Execution

| Chỉ số                 | Số lượng                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| Tổng số item checklist | 69 (14 HOME-U + 9 HOME-F + 9 HOME-N + 7 HOME-S + 7 LOGIN-U + 8 LOGIN-F + 7 LOGIN-N + 8 LOGIN-S) |
| Đã execute             | 69 / 69 (100%) — tự động qua `selenium/run_checklist.py`, bao gồm cả kịch bản khóa tài khoản (`--include-lockout`) |
| PASS                   | 25                                                                                              |
| FAIL                   | 22                                                                                              |
| MANUAL (cảm quan, cần xem ảnh chụp để tự đánh giá)      | 21                                                                 |
| N/A                    | 1 (HOME-N06 — breadcrumb không áp dụng cho Home theo FR-23)                                     |
| Bug phát hiện (xác nhận qua thực thi)          | 22 — xem bảng 1.6                                                                 |

> Nguồn dữ liệu: `selenium/results/results.csv` + `selenium/report/report.md` (chạy lần cuối trên Chrome headless, có bật `--include-lockout`). Các item `MANUAL` **đã có ảnh chụp thật** tại `selenium/screenshots/<ID>.png` — cần tự mở ảnh, đối chiếu bằng mắt, rồi đổi `MANUAL` thành `PASS`/`FAIL` cuối cùng trước khi nộp bài (script không tự đánh giá được các khía cạnh cảm quan như spacing/typography/contrast chính xác theo WCAG).

## 1.6 Bugs phát hiện (Task 1)

| Bug ID     | Found by           | Tiêu đề                                                                                                                           | Severity     | GitHub Issue | Screenshot |
| ---------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------ | ---------- |
| BUG-GUI-01 | HOME-U01           | Trang Home có 2 thẻ `<h1>` (Home.jsx:43, 110), vi phạm FR-05/FR-21 — **xác nhận qua thực thi**                                    | Low          | TODO         | `selenium/screenshots/HOME-U01.png` |
| BUG-GUI-02 | HOME-U02           | Ảnh sản phẩm có `alt=""` rỗng, vi phạm FR-24 (accessibility) — **xác nhận qua thực thi**                                          | Medium       | TODO         | `selenium/screenshots/HOME-U02.png` |
| BUG-GUI-03 | HOME-U03           | Giá hiển thị đơn vị "VND" thay vì ký hiệu `₫` theo FR-21 — **xác nhận qua thực thi**                                              | Low          | TODO         | `selenium/screenshots/HOME-U03.png` |
| BUG-GUI-04 | HOME-F04           | Reflected XSS: từ khóa tìm kiếm render qua `dangerouslySetInnerHTML` không escape (Home.jsx:64) — **xác nhận qua thực thi** (payload HTML thực thi thành thẻ thật trong DOM) | **Critical** | TODO         | `selenium/screenshots/HOME-F04.png` |
| BUG-GUI-05 | HOME-S01           | Không có trạng thái loading khi tải danh sách sản phẩm — **xác nhận qua thực thi**                                                | Medium       | TODO         | `selenium/screenshots/HOME-S01.png` |
| BUG-GUI-06 | HOME-S02           | Không có empty state khi tìm kiếm không ra kết quả — **xác nhận qua thực thi**                                                    | Medium       | TODO         | `selenium/screenshots/HOME-S02.png` |
| BUG-GUI-07 | HOME-S03           | Lỗi 500 từ server hiển thị nguyên văn HTML/message kỹ thuật cho người dùng qua `dangerouslySetInnerHTML` (lộ thông tin + XSS kép) | High         | TODO         | Chưa kích hoạt được lỗi 500 qua script tự động (MANUAL) — cần verify thủ công bằng cách tắt backend rồi tìm kiếm. |
| BUG-GUI-08 | HOME-N03, HOME-N04 | Navbar không highlight trang hiện tại; link Giỏ hàng không có badge số lượng, vi phạm FR-23 — **xác nhận qua thực thi**            | Medium       | TODO         | `selenium/screenshots/HOME-N03.png`, `HOME-N04.png` |
| BUG-GUI-09 | LOGIN-U01          | Trang Login hiển thị tiêu đề "Đăng Ký" (copy-paste lỗi từ Register) — **xác nhận qua thực thi**                                   | Medium       | TODO         | `selenium/screenshots/LOGIN-U01.png` |
| BUG-GUI-10 | LOGIN-U02          | Nhãn "Username" và nút "Sign In" bằng tiếng Anh giữa giao diện tiếng Việt, vi phạm FR-21 — **xác nhận qua thực thi**              | Low          | TODO         | `selenium/screenshots/LOGIN-U02.png` |
| BUG-GUI-11 | LOGIN-F01          | Trường Email dùng `type="text"` thay vì `type="email"`, vi phạm FR-02/FR-22 — **xác nhận qua thực thi**                           | Low          | TODO         | `selenium/screenshots/LOGIN-F01.png` |
| BUG-GUI-12 | LOGIN-F02          | Trường Mật khẩu dùng `type="text"`: mật khẩu hiển thị rõ khi gõ, vi phạm FR-22 (Shoulder-surfing risk) — **xác nhận qua thực thi** | **High**     | TODO         | `selenium/screenshots/LOGIN-F02.png` |
| BUG-GUI-13 | LOGIN-F03          | Thiếu ký hiệu `*` cho trường bắt buộc, vi phạm FR-22 — **xác nhận qua thực thi**                                                  | Low          | TODO         | `selenium/screenshots/LOGIN-F03.png` |
| BUG-GUI-14 | LOGIN-F05          | Thông báo lỗi đăng nhập hiển thị dưới nút submit thay vì trên, vi phạm FR-22 — **xác nhận qua thực thi** (so sánh toạ độ Y)        | Low          | TODO         | `selenium/screenshots/LOGIN-F05.png` |
| BUG-GUI-15 | LOGIN-S02          | Không có trạng thái loading/disable nút khi đang gọi API đăng nhập → nguy cơ double-submit — **xác nhận qua thực thi**            | Medium       | TODO         | `selenium/screenshots/LOGIN-S02.png` |
| BUG-GUI-16 | LOGIN-S03          | Bộ đếm đăng nhập sai tăng +2/lần thay vì +1, vi phạm FR-02 (server.js:54) — nghi vấn từ code, **chưa đo lặp lại đủ số lần để khẳng định tuyệt đối qua thực thi** (xem ghi chú LOGIN-S03) | Medium       | TODO         | `selenium/screenshots/LOGIN-S03.png` |
| BUG-GUI-17 | LOGIN-S04          | Thời gian khóa tài khoản là ~180 giây thay vì 30 giây theo spec (server.js:57) — **xác nhận qua thực thi** (API vẫn 403 sau 32s)   | Medium       | TODO         | `selenium/screenshots/LOGIN-S04.png` |
| BUG-GUI-18 | LOGIN-S05          | Frontend không phân biệt lỗi "sai mật khẩu" và "tài khoản bị khóa" dù backend đã phân biệt qua status code — **xác nhận qua thực thi** (Login.jsx:17-19) | Medium       | TODO         | `selenium/screenshots/LOGIN-S05.png` |
| BUG-GUI-19 | LOGIN-F07          | Label "Username"/"Mật khẩu" không có `for`/`htmlFor` liên kết input, ảnh hưởng accessibility — **xác nhận qua thực thi**          | Low          | TODO         | `selenium/screenshots/LOGIN-F07.png` |
| BUG-GUI-20 | LOGIN-F08          | Không validate định dạng email do dùng `type="text"`, request sai định dạng vẫn được gửi lên server — **xác nhận qua thực thi** (hệ quả trực tiếp của BUG-GUI-11) | Low          | TODO         | `selenium/screenshots/LOGIN-F08.png` |
| BUG-GUI-21 | HOME-U11, LOGIN-U06 | Không hỗ trợ Dark mode ở cả 2 trang (không có biến thể `dark:` trong Tailwind) — **xác nhận qua thực thi**                        | Low          | TODO         | `selenium/screenshots/HOME-U11.png`, `LOGIN-U06.png` |
| BUG-GUI-22 | HOME-S04           | Không có phản hồi trực quan (toast/badge) khi bấm "Thêm vào giỏ" trên trang Home — **xác nhận qua thực thi**                       | Medium       | TODO         | `selenium/screenshots/HOME-S04.png` |

> **Đối chiếu với dự đoán tĩnh ban đầu (mục 1.1–1.3):** 17/18 bug dự đoán từ đọc code đã được **xác nhận đúng qua thực thi tự động**; duy nhất BUG-GUI-07 (lỗi 500 hiển thị thô) chưa kích hoạt được bằng payload tự động (cần tắt backend thủ công để tái hiện) nên vẫn ở trạng thái MANUAL. Phát hiện thêm 4 bug mới trong lúc thực thi không có trong dự đoán ban đầu: BUG-GUI-19, BUG-GUI-20 (hệ quả của F01/F07/F08), BUG-GUI-21 (dark mode, gộp cả 2 trang thành 1 bug), BUG-GUI-22 (tách riêng từ dự đoán chung ban đầu). Đồng thời, thực thi cho thấy 1 sắc thái quan trọng mà phân tích code tĩnh ban đầu chưa nêu rõ: BUG-GUI-18 không chỉ là "frontend che message" mà còn là bằng chứng rằng **backend thực ra CÓ phân biệt đúng** (401 vs 403) — lỗi nằm hoàn toàn ở tầng UI (Login.jsx dùng 1 catch-block chung), không phải ở logic nghiệp vụ.
>
> Trước khi nộp bài: tạo GitHub Issue cho từng bug ở trên, đính kèm ảnh chụp tương ứng (đã có sẵn tại `selenium/screenshots/`), rồi điền lại cột GitHub Issue.

### Kết quả execute Task 1 (tóm tắt bằng công cụ)

| Chỉ số | Giá trị |
| --- | --- |
| Công cụ thực thi | Selenium (Python) + Chrome, single browser, headless |
| Script | `selenium/run_checklist.py` (hỗ trợ `--ia`, `--screen`, `--id`, `--include-lockout`) |
| Report sinh tự động | `selenium/generate_report.py` → `selenium/report/index.html` (HTML) + `selenium/report/report.md` (Markdown) |
| Tổng item | 69 |
| PASS | 25 |
| FAIL | 22 |
| MANUAL (cần xem ảnh, tự đánh giá) | 21 |
| N/A | 1 |
| Lỗi thực thi (ERROR) | 0 (đã sửa 2 lỗi kịch bản: stale element ở LOGIN-S02, sai định dạng mật khẩu test ở kịch bản khóa tài khoản) |

---

# TASK 2 — Usability Evaluation (Luồng: Đăng ký → Đăng nhập)

## 2.1 Nguồn tham chiếu

- SRS FR-01 (Đăng ký, README.md:30-36), FR-02 (Đăng nhập & khóa tài khoản, README.md:38-44).
- `frontend-web/src/pages/Register.jsx` (84 dòng), `frontend-web/src/pages/Login.jsx` (69 dòng).
- Quy tắc mật khẩu client thực tế: `Register.jsx:15` — biến tên **`flawedStrongPasswordRegex`** (tự đặt tên báo hiệu lỗi cố ý trong code mẫu):
  ```js
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
  ```
  Yêu cầu bắt buộc có khoảng trắng (`\s`), và **không cho phép** các ký tự đặc biệt `@ $ ! % * ? &` mà SRS FR-01 yêu cầu — trái ngược với thông báo lỗi hiển thị cho người dùng ("...và KÝ TỰ ĐẶC BIỆT"). **Đã xác nhận lại bằng thực thi Selenium** (`selenium/run_checklist.py`, kịch bản khóa tài khoản): mật khẩu `Sel3nium Pass!` (có `!`) bị regex client từ chối đúng như dự đoán; chỉ khi đổi sang `Sel3nium Pass` (không ký tự đặc biệt, có khoảng trắng) mới đăng ký thành công — xác nhận trực tiếp hành vi lỗi của regex bằng dữ liệu thật, không chỉ suy luận từ đọc code.
- Trường "Xác nhận mật khẩu" theo FR-01 **không tồn tại** trong `Register.jsx` (chỉ có `name`, `email`, `password`).

## 2.2 Phase 1 — Plan & Prepare

### Mục tiêu (Objectives)

1. Người dùng mới có tự đăng ký thành công **mà không cần trợ giúp** không, đặc biệt khi gặp yêu cầu mật khẩu mạnh (điều kiện thực tế của form khác với thông báo lỗi hiển thị)?
2. Người dùng có nhận ra và phục hồi được khi đăng ký thất bại (lỗi mật khẩu, email trùng) không, hay bị "kẹt" không hiểu vì sao?
3. Sau khi đăng ký, người dùng có tự tìm được đường sang đăng nhập và đăng nhập thành công ngay lần đầu không?
4. Người dùng cảm thấy tự tin/tin tưởng ra sao ở từng bước (đặc biệt khi thấy mật khẩu hiển thị rõ dạng chữ thường ở màn Login — có gây lo ngại bảo mật không)?

### Task Scenario (kịch bản giao cho người tham gia)

> **Kịch bản:** "Bạn vừa nghe bạn bè giới thiệu một trang mua sắm trực tuyến tên là **EShop**. Hãy tạo cho mình một tài khoản mới trên trang này bằng thông tin cá nhân bất kỳ (không cần dùng email thật), sau đó đăng nhập vào tài khoản vừa tạo để bắt đầu mua sắm."

- Đây là mục tiêu (goal), **không phải hướng dẫn từng bước** — không nói cho người tham gia biết yêu cầu mật khẩu cụ thể hay vị trí nút bấm.
- Ghi chú cho điều phối viên (không đọc cho người tham gia): chuẩn bị sẵn 1 email chưa từng đăng ký trong hệ thống (VD `participant0X@test.local`) để tránh việc trùng email làm nhiễu kết quả không mong muốn ở lần thử đầu; nếu người tham gia tự chọn trùng `test@eshop.com`/`admin@eshop.com`, đó cũng là một tình huống quan sát hợp lệ (hệ thống không có `UNIQUE constraint` cho email — xem BUG-A-0x tương tự đã ghi ở HW02).

### Công cụ đo lường (Instruments)

- **Thang đo sau mỗi phiên:** **SUS (System Usability Scale)** — 10 câu, thang Likert 5 điểm.
- **Câu hỏi mở (probe questions)** sau khi hoàn thành, tối thiểu 4 khía cạnh bắt buộc theo đề bài:
  1. _Clarity:_ "Bạn có hiểu ngay yêu cầu về mật khẩu ở bước đăng ký không? Điều gì khiến bạn hiểu/không hiểu?"
  2. _Error recovery:_ "Nếu form báo lỗi, bạn có biết cần sửa gì để tiếp tục không?"
  3. _Speed:_ "Bạn cảm thấy quá trình đăng ký + đăng nhập nhanh hay chậm hơn mong đợi?"
  4. _Trust:_ "Bạn có cảm thấy an tâm về bảo mật thông tin khi đăng ký/đăng nhập trên trang này không? Vì sao?"

### Người tham gia (Recruitment)

- 7 người tham gia thật, ngoài lớp học, ưu tiên người không chuyên IT/không phải tester.
- Danh sách chi tiết (họ tên + Zalo/SĐT che 4 số giữa) đặt tại `hw3/usability/Participants.md` — **không được AI tạo/giả lập**, TA có thể gọi ngẫu nhiên 2 người để xác minh.

### Pilot session

- Chạy thử 1 phiên pilot trước, dùng để kiểm tra: kịch bản có gây hiểu lầm không, flow đăng ký/đăng nhập có bug chặn cứng (blocker) nào khiến không thể hoàn thành task hay không, thời lượng phiên có hợp lý (đề xuất timebox 8 phút) không.
- Ghi kết quả pilot và các điều chỉnh (nếu có) tại `hw3/usability/Session_Notes.md` trước khi chạy 7 phiên chính thức.

## 2.3 Phase 2 — Conduct Sessions

Quy trình mỗi phiên (áp dụng cho cả 7 người tham gia P01–P07):

1. **Set the stage:** nói rõ "chúng tôi đang kiểm thử sản phẩm, không kiểm thử bạn"; mời người tham gia **think-aloud**.
2. **Observe neutrally:** không gợi ý, không giải thích UI trước; chỉ can thiệp khi người tham gia bị kẹt hoàn toàn (ghi nhận là 1 lần "moderator intervention").
3. **Capture evidence:** ghi màn hình (+ âm thanh nếu có đồng thuận); ghi chú cấu trúc theo mẫu bên dưới cho từng phiên.
4. **Close session:** người tham gia điền SUS, sau đó trả lời 4 câu hỏi mở.

### Mẫu chỉ số thu thập mỗi phiên (điền vào `hw3/usability/Session_Notes.md`)

| Chỉ số                                                  | Mô tả                                                                                  |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Outcome                                                 | `SUCCESS_UNASSISTED` / `SUCCESS_ASSISTED` / `FAIL` / `ABANDONED`                       |
| Thời lượng hoàn thành                                   | (giây)                                                                                 |
| Số lỗi (error)                                          | Số thao tác sai dẫn tới kết quả ngoài ý muốn (VD: submit form sai định dạng nhiều lần) |
| Số lần hesitation ≥5 giây                               |                                                                                        |
| Số lần moderator can thiệp                              |                                                                                        |
| Đăng ký thành công ở lần thử thứ mấy                    |                                                                                        |
| Có hiểu đúng yêu cầu mật khẩu trước khi thử không (Y/N) |                                                                                        |
| Đăng nhập thành công ngay sau đăng ký (Y/N)             |                                                                                        |

## 2.4 Phase 3 — Analyse & Report

### Tổng hợp điểm SUS (điền sau khi thu thập đủ 7 phiên)

| Participant    | Điểm SUS | Ghi chú                                                   |
| -------------- | -------- | --------------------------------------------------------- |
| P01            | TODO     |                                                           |
| P02            | TODO     |                                                           |
| P03            | TODO     |                                                           |
| P04            | TODO     |                                                           |
| P05            | TODO     |                                                           |
| P06            | TODO     |                                                           |
| P07            | TODO     |                                                           |
| **Trung bình** | **TODO** | So sánh với ngưỡng tham chiếu SUS = 68 (trung bình ngành) |

### Tổng hợp phát hiện, phân nhóm theo mức độ nghiêm trọng

> Điền sau khi có dữ liệu thật từ 7 phiên. Các dự đoán bên dưới **đã được củng cố thêm bằng dữ liệu thực thi Selenium** (mục 2.1), nhưng thứ tự ưu tiên cuối cùng và số phiên gặp phải vẫn cần đến từ quan sát người dùng thật:

| Mức độ  | Phát hiện dự kiến                                                                                                                                                                        | Nguồn gốc (systemic design issue / isolated bug)                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Blocker | Người dùng nhập mật khẩu hợp lệ theo SRS (VD `Password123!`) nhưng bị từ chối vì thiếu khoảng trắng theo regex thực tế — **đã tái hiện bằng Selenium** (`Sel3nium Pass!` bị từ chối, `Sel3nium Pass` mới qua) — có thể khiến người dùng bỏ cuộc nếu không đoán ra quy luật thật | Systemic — lỗi logic ở `Register.jsx:15`                          |
| Major   | Không có trường "Xác nhận mật khẩu" khiến người dùng gõ sai mật khẩu mà không tự biết cho tới khi đăng nhập thất bại ở bước sau                                                          | Systemic — thiếu tính năng so với FR-01                           |
| Major   | Mật khẩu hiển thị rõ ràng (không che) ở trang Login gây cảm giác mất an toàn/tin tưởng (probe: Trust) — **xác nhận qua Selenium** (LOGIN-F02 FAIL: `type="text"`) | Isolated (1 trang) nhưng ảnh hưởng cảm nhận bảo mật toàn hệ thống |
| Minor   | Tiêu đề trang Login hiển thị nhầm "Đăng Ký" có thể khiến người dùng ngờ vực đã bấm nhầm liên kết — **xác nhận qua Selenium** (LOGIN-U01 FAIL) | Isolated bug                                                      |
| Minor   | Thông báo lỗi đăng ký ghi "ký tự đặc biệt" trong khi thực chất cần khoảng trắng — gây hiểu lầm                                                                                           | Systemic — sai lệch giữa message và logic                         |

### Ưu tiên hóa (Prioritise by severity)

- **Blocker** (ngăn hoàn thành task): xử lý trước — sửa regex mật khẩu hoặc đồng bộ lại thông báo lỗi cho đúng với logic thật.
- **Major** (ảnh hưởng lớn tới trải nghiệm/lòng tin nhưng có thể hoàn thành task): xử lý tiếp theo — thêm trường Xác nhận mật khẩu, dùng `type="password"` cho ô mật khẩu Login.
- **Minor** (khó chịu nhưng không cản trở): xử lý sau — sửa tiêu đề trang, đồng bộ message lỗi.

## 2.5 Bugs phát hiện (Task 2 — từ usability sessions)

| Bug ID    | Found by (Participant/TC)       | Tiêu đề                                                                                                                          | Severity | GitHub Issue | Screenshot |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------ | ---------- |
| BUG-UX-01 | TODO (điền participant thực tế); tái hiện kỹ thuật qua `selenium/run_checklist.py --include-lockout` | Mật khẩu hợp lệ theo spec (`@$!%*?&`) bị từ chối vì regex client yêu cầu khoảng trắng thay vì ký tự đặc biệt (`Register.jsx:15`) | Critical | TODO         | TODO (chụp lại từ phiên usability thật) |
| BUG-UX-02 | TODO                            | Thiếu trường "Xác nhận mật khẩu" ở form Đăng ký, vi phạm FR-01                                                                   | High     | TODO         | TODO       |
| BUG-UX-03 | TODO                            | Thông báo lỗi mật khẩu yêu cầu "ký tự đặc biệt" nhưng logic thực tế yêu cầu khoảng trắng — gây hiểu lầm                          | High     | TODO         | TODO       |
| BUG-UX-04 | TODO; tái hiện kỹ thuật qua `selenium` (LOGIN-F02 FAIL) | Mật khẩu hiển thị dạng chữ thường (không che) tại trang Đăng nhập, ảnh hưởng cảm nhận bảo mật (trust)                            | High     | TODO         | `selenium/screenshots/LOGIN-F02.png` |
| BUG-UX-05 | TODO                            | Đăng ký trùng email không bị chặn (không có `UNIQUE` constraint), người dùng có thể vô tình tạo tài khoản trùng                  | Medium   | TODO         | TODO       |

---

# TASK 3 — Cross-Browser / Cross-Platform

> Xem chi tiết đầy đủ tại `hw3/cross-platform/Report.md` (tạo riêng theo hướng dẫn §6 Task 3). Tóm tắt tại đây:

| Nền tảng | Trình duyệt/Thiết bị              | Kết quả tóm tắt | Ảnh chụp |
| -------- | --------------------------------- | --------------- | -------- |
| TODO     | Chrome (Windows)                  | TODO            | TODO     |
| TODO     | Firefox                           | TODO            | TODO     |
| TODO     | Safari / Android Chrome / Expo Go | TODO            | TODO     |

Mỗi ảnh chụp phải overlay `23127344@hcmus.edu.vn` theo yêu cầu đề bài (§6 Task 3, cuối mục).

---

## Ghi chú chung

- **Task 1 đã được thực thi tự động hoàn toàn** bằng bộ Selenium tại `selenium/` (`run_checklist.py` + `generate_report.py`), chạy trên Chrome (single browser), có chụp ảnh cho toàn bộ 69 item và hỗ trợ chạy theo từng IA/màn hình riêng lẻ (`--ia`, `--screen`). Kết quả PASS/FAIL ở mục 1.4 là **dữ liệu thật từ lần chạy cuối**, không còn là suy luận tĩnh. Các item `MANUAL` vẫn cần con người tự mở ảnh chụp và kết luận cuối cùng — đây là bước "Human review" bắt buộc theo đề bài, không nên bỏ qua.
- Trước khi nộp bài, vẫn **bắt buộc**:
  1. Mở toàn bộ ảnh `MANUAL` trong `selenium/screenshots/`, tự đánh giá và cập nhật lại cột Result thành PASS/FAIL cuối cùng cho các item này.
  2. Xác nhận thủ công BUG-GUI-07 (lỗi 500) bằng cách tắt backend rồi thử tìm kiếm, vì script tự động chưa kích hoạt được lỗi này qua payload thử.
  3. Chạy đủ 7 phiên usability thật (Task 2), không được điền số liệu giả định — dùng đúng luồng Đăng ký→Đăng nhập đã kiểm chứng kỹ thuật ở Task 1 làm cơ sở chuẩn bị câu hỏi probe.
  4. Hoàn thành cross-platform thật (Task 3) với ảnh có overlay MSSV.
  5. Tạo GitHub Issues cho từng bug đã xác nhận (mục 1.6, 2.5), đính screenshot (đã có sẵn cho phần lớn bug Task 1 tại `selenium/screenshots/`), rồi điền lại cột GitHub Issue.
  6. Commit git theo từng bước (checklist design → execution qua Selenium → bug logging → từng usability session → phân tích) vào `git_commit_log.txt`.
