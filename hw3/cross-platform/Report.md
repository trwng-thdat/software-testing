# TASK 3 — Cross-Browser / Cross-Platform Testing Report

- **MSSV:** 23127344
- **SUT:** EShop `frontend-web` (React 19 + Vite 8 + Tailwind 3)
- **Ngày thực thi:** 2026-07-30
- **Bộ test:** `run_cross_platform.py` (Selenium 4.46, Python 3.14) — 18 test case × 3 nền tảng = **54 lượt thực thi**
- **Kết quả file:** [`results.json`](results.json) · [`CrossPlatform_Matrix.csv`](CrossPlatform_Matrix.csv) · [`screenshots/`](screenshots/)

---

## 1. Phạm vi & lý do chọn test case (khác biệt với Task 1 và Task 2)

Đề bài §6 Task 3 **không quy định số lượng test case tối thiểu** — chỉ yêu cầu tối thiểu **3 nền tảng**. Vì vậy bộ test này được thiết kế riêng theo nguyên tắc: *chỉ kiểm thử những gì thực sự phụ thuộc vào browser engine.*

| Task | Màn hình / luồng | Trọng tâm |
| --- | --- | --- |
| Task 1 (GUI checklist, 69 item) | Home (FR-05) + Login (FR-02) | 4 interface aspect IA-01…IA-04, **chỉ chạy trên Chrome** |
| Task 2 (Usability, 7 phiên) | Đăng ký → Đăng nhập | Hành vi người dùng thật |
| **Task 3 (báo cáo này)** | **Cart, Checkout, ProductDetail, Profile** | **Khác biệt giữa engine:** CSS nesting, native form control, `Intl`/`toLocaleString`, parse ngày, table layout, focus model, touch target |

Ba màn hình chính của Task 3 (**Cart / Checkout / Profile**) **không xuất hiện** trong Task 1, và luồng Task 3 (Product → Cart → Checkout) **không trùng** luồng Đăng ký→Đăng nhập của Task 2. Các case cố tình **loại bỏ** những kiểm tra không phụ thuộc nền tảng (logic nghiệp vụ, validate phía server, phân quyền) vì chạy lại chúng trên 3 browser không tạo thêm thông tin.

---

## 2. Ba nền tảng đã test

| ID | Nền tảng | Engine | Thiết bị / Viewport | URL SUT |
| --- | --- | --- | --- | --- |
| **P1** | Chrome 141 / Windows 11 | Blink | Desktop 1440×900 | `http://localhost:5173` |
| **P2** | Firefox 145 / Windows 11 | **Gecko** | Desktop 1440×900 | `http://localhost:5173` |
| **P3** | **Android Chrome** / Pixel 7 (Android 13) | Blink mobile | 412×915, DPR 2.625 | `http://172.16.0.252:5173` |

**Ghi chú về lựa chọn nền tảng:**

- §6 cho phép **Android Chrome thay thế Safari** — P3 dùng quyền này.
- Đã thử cài **WebKit** (engine của Safari) qua Playwright nhưng máy Windows này **thiếu DLL hệ thống** (`javascriptcore.dll`, `webkit2.dll`, `icuuc77.dll`…) nên WebKit không khởi chạy được. Đây là lý do kỹ thuật thật, đã ghi nhận minh bạch thay vì bỏ qua.
- P3 dùng **URL LAN thật** (`172.16.0.252:5173`) chứ không phải `localhost`, vì thiết bị Android truy cập máy chủ qua mạng — đúng như tình huống thực tế. URL này hiển thị rõ trên mọi ảnh chụp.
- Mỗi ảnh chụp có **overlay `23127344@hcmus.edu.vn`** + tên nền tảng + URL đầy đủ (theo §6 và §11).

---

## 3. Kết quả tổng hợp

| Nền tảng | PASS | FAIL | N/A | Tổng |
| --- | --- | --- | --- | --- |
| P1 — Chrome / Windows | 13 | 5 | 0 | 18 |
| P2 — Firefox / Windows | 12 | 5 | 1 | 18 |
| P3 — Android Chrome / Pixel 7 | 12 | **6** | 0 | 18 |
| **Tổng lượt thực thi** | **37** | **16** | **1** | **54** |

- **Số case phân kỳ giữa các nền tảng (divergent):** 1 (CB-01) — đây là bug cross-platform *thuần túy*.
- **Số case FAIL trên cả 3 nền tảng (systemic):** 5 (CB-05, CB-06, CB-08, CB-13, CB-18).
- **Không có case nào BLOCKED.**

### Ma trận đầy đủ

| Case | Màn hình | Nhóm | Nội dung kiểm tra | P1 | P2 | P3 | Phân kỳ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CB-01 | ProductDetail | CSS nesting | `@media` lồng trong `.bug-mobile-hidden` áp dụng nhất quán | PASS | PASS | **FAIL** | **YES** |
| CB-02 | ProductDetail | Layout | Nút "Thêm vào giỏ" nằm trong viewport | PASS | PASS | PASS | no |
| CB-03 | ProductDetail | Form control | `type=number` render đúng | PASS | PASS | PASS | no |
| CB-04 | ProductDetail | Form control | `type=number` từ chối chữ cái | PASS | PASS | PASS | no |
| CB-05 | ProductDetail | Validation | Ô số lượng khai báo `min`/`max`/`step` | **FAIL** | **FAIL** | **FAIL** | no |
| CB-06 | Cart | i18n | Định dạng tiền tệ ổn định giữa các engine | **FAIL** | **FAIL** | **FAIL** | no |
| CB-07 | Cart | Layout | Bảng 5 cột không gây scroll ngang | PASS | PASS | PASS | no |
| CB-08 | Checkout | Integrity | Tổng tiền không cho client sửa | **FAIL** | **FAIL** | **FAIL** | no |
| CB-09 | Checkout | Form control | `uppercase` hiển thị khớp giá trị gửi đi | PASS | PASS | PASS | no |
| CB-10 | Engine/JS | Date parsing | `new Date('YYYY-MM-DD HH:MM:SS')` parse nhất quán | PASS | PASS | PASS | no |
| CB-11 | Profile | Date parsing | Ngày đơn hàng không ra `Invalid Date`/`NaN` | PASS | PASS | PASS | no |
| CB-12 | Profile | Responsive | Layout 2 cột không tràn ngang | PASS | PASS | PASS | no |
| CB-13 | Profile | Feedback | Validate không dùng `alert()` chặn luồng | **FAIL** | **FAIL** | **FAIL** | no |
| CB-14 | Cart | A11y/Focus | Focus bàn phím hiển thị rõ | PASS | PASS | PASS | no |
| CB-15 | Global | Layout | Scrollbar gutter không đổi breakpoint hiệu dụng | PASS | PASS | PASS | no |
| CB-16 | Global | A11y | Viewport meta cho phép pinch-zoom | PASS | PASS | PASS | no |
| CB-17 | Checkout | Console | Không có lỗi console SEVERE ở Cart→Checkout | PASS | N/A | PASS | no |
| CB-18 | Cart | Touch | Vùng bấm ≥ 44×44 CSS px | **FAIL** | **FAIL** | **FAIL** | no |

> CB-17 là `N/A` trên Firefox vì Selenium chỉ cung cấp `get_log('browser')` cho Chrome — hạn chế của công cụ, không phải kết quả test.

---

## 4. Bug phát hiện

Bug được chia làm 2 nhóm theo đúng tinh thần "tách bug cô lập khỏi vấn đề hệ thống".

### 4.1 Bug phân kỳ nền tảng (cross-platform thuần túy)

#### BUG-CP-01 — `@media` lồng trong CSS thường không được biên dịch, đẩy nút "Thêm vào giỏ hàng" ra ngoài màn hình trên mobile

| Thuộc tính | Nội dung |
| --- | --- |
| **Severity** | **Critical** — chặn hoàn toàn hành động thêm giỏ hàng trên mobile |
| **Case** | CB-01, CB-02 |
| **Nền tảng lỗi** | **P3 (Android Chrome 412px)** — P1/P2 desktop không lỗi |
| **Nguồn** | [`src/index.css`](../docs/eshop-sut/frontend-web/src/index.css) dòng 11-15; [`ProductDetail.jsx:66`](../docs/eshop-sut/frontend-web/src/pages/ProductDetail.jsx#L66) |
| **Ảnh** | [`screenshots/P3-CB-01.png`](screenshots/P3-CB-01.png) |

**Mô tả kỹ thuật.** `index.css` khai báo `@media` **lồng bên trong** class thường:

```css
.bug-mobile-hidden {
  @media (max-width: 640px) {
    margin-right: -100px;
  }
}
```

Dự án dùng **Tailwind 3 + PostCSS không bật `postcss-nesting`**. Kiểm chứng bằng cách biên dịch trực tiếp:

```
$ npx tailwindcss -i src/index.css -o out.css
.bug-mobile-hidden {
  @media (max-width: 640px) {   ← @media lồng còn nguyên, KHÔNG được biên dịch
    margin-right: -100px;
  }
}
```

Nghĩa là CSS nesting được **đẩy thẳng xuống browser**, và kết quả phụ thuộc hoàn toàn vào việc engine có hỗ trợ native CSS nesting hay không:

| Nền tảng | `CSS.supports('selector(&)')` | `margin-right` thực tế | Hệ quả |
| --- | --- | --- | --- |
| P1 Chrome desktop 1440px | `true` | `0px` | Không lỗi (ngoài breakpoint) |
| P2 Firefox desktop 1440px | `true` | `0px` | Không lỗi (ngoài breakpoint) |
| **P3 Android Chrome 412px** | `true` | **`-100px`** | **Nút bị đẩy 100px ra ngoài** |

**Tác động.** Ở viewport ≤ 640px, quy tắc được áp dụng và đẩy nút "Thêm vào giỏ hàng" lệch 100px sang phải. Trên các engine **không** hỗ trợ native nesting (Safari < 16.5, Firefox < 117, mọi browser cũ), quy tắc bị bỏ qua âm thầm → **cùng một bản build cho ra hai giao diện khác nhau**. Đây chính là loại lỗi mà chỉ cross-browser testing phát hiện được.

**Khuyến nghị.** Bật `postcss-nesting` trong `postcss.config.js`, hoặc viết `@media` ở top level, hoặc dùng biến thể Tailwind `max-sm:mr-[-100px]`.

---

### 4.2 Bug hệ thống (tái hiện trên cả 3 nền tảng)

#### BUG-CP-02 — Định dạng tiền tệ thay đổi theo locale của browser/OS

| Thuộc tính | Nội dung |
| --- | --- |
| **Severity** | **High** — sai lệch hiển thị số tiền, ảnh hưởng độ tin cậy |
| **Case** | CB-06 |
| **Nền tảng** | Cả 3 (biểu hiện **khác nhau** trên từng nền tảng) |
| **Nguồn** | [`Cart.jsx:46,48,63`](../docs/eshop-sut/frontend-web/src/pages/Cart.jsx#L46) · [`Checkout.jsx:86,138`](../docs/eshop-sut/frontend-web/src/pages/Checkout.jsx#L86) · [`ProductDetail.jsx:50`](../docs/eshop-sut/frontend-web/src/pages/ProductDetail.jsx#L50) |
| **Ảnh** | [`P1-CB-06.png`](screenshots/P1-CB-06.png) · [`P2-CB-06.png`](screenshots/P2-CB-06.png) · [`P3-CB-06.png`](screenshots/P3-CB-06.png) |

Toàn bộ giá tiền gọi `Number(x).toLocaleString()` **không truyền locale**, nên dấu phân cách do browser/OS quyết định:

| Nền tảng | `resolvedLocale` | `(1234567.5).toLocaleString()` | Giá hiển thị trên Cart |
| --- | --- | --- | --- |
| P1 Chrome | `en-US` | `1,234,567.5` | `30,000,000 ₫` |
| **P2 Firefox** | **`vi`** | **`1.234.567,5`** | **`30.000.000 ₫`** |
| P3 Android Chrome | `en-US` | `1,234,567.5` | `30,000,000 ₫` |

So sánh trực tiếp [`P1-CB-06.png`](screenshots/P1-CB-06.png) và [`P2-CB-06.png`](screenshots/P2-CB-06.png): **cùng dữ liệu, cùng bản build, hai định dạng số khác nhau**. Với giao diện tiếng Việt, đúng chuẩn phải là dấu `.` (Firefox tình cờ đúng, Chrome sai).

**Khuyến nghị.** Dùng `new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'})`.

---

#### BUG-CP-03 — Tổng tiền đơn hàng cho phép người dùng sửa trực tiếp

| Thuộc tính | Nội dung |
| --- | --- |
| **Severity** | **Critical** (bảo mật / toàn vẹn dữ liệu) |
| **Case** | CB-08 |
| **Nền tảng** | Cả 3 |
| **Nguồn** | [`Checkout.jsx:93-102`](../docs/eshop-sut/frontend-web/src/pages/Checkout.jsx#L93-L102) |
| **Ảnh** | [`P1-CB-08.png`](screenshots/P1-CB-08.png) · [`P2-CB-08.png`](screenshots/P2-CB-08.png) · [`P3-CB-08.png`](screenshots/P3-CB-08.png) |

Trang Checkout render tổng tiền bằng `<input type="number">` **không `readOnly`, không `disabled`, không `min`**, và giá trị này được gửi thẳng làm `total_amount` trong `POST /api/checkout` ([`Checkout.jsx:43-47`](../docs/eshop-sut/frontend-web/src/pages/Checkout.jsx#L43-L47)). Đã xác minh trên cả 3 nền tảng: đặt giá trị `1` thành công → có thể thanh toán đơn 86.000.000 ₫ với giá 1 ₫. Không phụ thuộc engine, tái hiện 100%.

---

#### BUG-CP-04 — Ô số lượng thiếu ràng buộc `min`/`max`/`step`

| Thuộc tính | Nội dung |
| --- | --- |
| **Severity** | Medium |
| **Case** | CB-05 |
| **Nền tảng** | Cả 3 |
| **Nguồn** | [`ProductDetail.jsx:56-61`](../docs/eshop-sut/frontend-web/src/pages/ProductDetail.jsx#L56-L61) |
| **Ảnh** | [`P1-CB-05.png`](screenshots/P1-CB-05.png) · [`P2-CB-05.png`](screenshots/P2-CB-05.png) · [`P3-CB-05.png`](screenshots/P3-CB-05.png) |

`<input type="number">` không khai báo `min`, `max`, `step` → browser **không thể** áp dụng validate native, chấp nhận số âm/0. Đáng lưu ý: CB-04 cho thấy cả 3 engine **đều** lọc đúng chữ cái (`value=""`), tức phần native hoạt động tốt — lỗi nằm ở việc code không khai báo ràng buộc.

---

#### BUG-CP-05 — Validate dùng `alert()` chặn luồng thay vì thông báo inline

| Thuộc tính | Nội dung |
| --- | --- |
| **Severity** | Medium (UX / khả dụng trên mobile) |
| **Case** | CB-13 |
| **Nền tảng** | Cả 3 |
| **Nguồn** | [`Profile.jsx:43-45`](../docs/eshop-sut/frontend-web/src/pages/Profile.jsx#L43-L45), và `alert()` còn dùng ở dòng 60, 63, 75, 78 |
| **Ảnh** | [`P1-CB-13.png`](screenshots/P1-CB-13.png) · [`P2-CB-13.png`](screenshots/P2-CB-13.png) · [`P3-CB-13.png`](screenshots/P3-CB-13.png) |

Nhập SĐT sai → `alert("Số điện thoại không hợp lệ...")`. Hộp thoại native này **không thể style**, hiển thị khác nhau theo OS, và trên **Android Chrome có checkbox "Ngăn trang này tạo thêm hộp thoại"** — nếu người dùng tick, mọi thông báo lỗi sau đó **biến mất hoàn toàn**. Đây là rủi ro riêng của nền tảng mobile.

---

#### BUG-CP-06 — Nhiều vùng bấm nhỏ hơn 44×44 CSS px

| Thuộc tính | Nội dung |
| --- | --- |
| **Severity** | Medium (WCAG 2.5.5 Target Size) |
| **Case** | CB-18 |
| **Nền tảng** | Cả 3 (nghiêm trọng nhất trên P3) |
| **Nguồn** | [`Cart.jsx:50-55`](../docs/eshop-sut/frontend-web/src/pages/Cart.jsx#L50-L55) · [`App.jsx:22-23`](../docs/eshop-sut/frontend-web/src/App.jsx#L22-L23) |
| **Ảnh** | [`P1-CB-18.png`](screenshots/P1-CB-18.png) · [`P2-CB-18.png`](screenshots/P2-CB-18.png) · [`P3-CB-18.png`](screenshots/P3-CB-18.png) |

Đo thực tế: **7 vùng bấm** dưới chuẩn trên P3 (412px) và **9** trên desktop. Nghiêm trọng nhất là nút **"Xóa" chỉ 27×24px** trong bảng giỏ hàng — trên màn hình cảm ứng rất dễ bấm nhầm sang dòng khác, và đây là hành động **phá hủy dữ liệu** (xóa sản phẩm) **không có xác nhận**.

---

## 5. Ưu tiên theo mức độ nghiêm trọng

| # | Bug | Severity | Nền tảng | Loại |
| --- | --- | --- | --- | --- |
| 1 | BUG-CP-03 — Tổng tiền sửa được | **Critical** | Cả 3 | Systemic |
| 2 | BUG-CP-01 — `@media` lồng đẩy nút ra ngoài | **Critical** | **Chỉ P3** | **Divergent** |
| 3 | BUG-CP-02 — Định dạng tiền theo locale | High | Cả 3 (biểu hiện khác nhau) | Systemic |
| 4 | BUG-CP-06 — Vùng bấm < 44px | Medium | Cả 3 | Systemic |
| 5 | BUG-CP-05 — `alert()` chặn luồng | Medium | Cả 3 | Systemic |
| 6 | BUG-CP-04 — Thiếu `min`/`max`/`step` | Medium | Cả 3 | Systemic |

---

## 6. Điểm ghi nhận tích cực (đồng nhất trên cả 3 nền tảng)

Không phải mọi kết quả đều là lỗi — 37/54 lượt PASS. Đáng chú ý:

- **CB-10 / CB-11 — Parse ngày:** `created_at` từ SQLite có dạng `"2026-07-30 14:05:23"` (**không phải ISO-8601**, dùng space thay vì `T`), nên theo spec ECMAScript việc parse là *implementation-defined*. Đã lo ngại Gecko sẽ trả `Invalid Date`, nhưng **cả 3 engine đều parse thành công** và Profile hiển thị ngày đúng, không có `Invalid Date`/`NaN`. Đây là điểm may mắn, không phải thiết kế đúng — vẫn nên chuẩn hóa sang ISO-8601.
- **CB-07 — Bảng 5 cột:** không gây scroll ngang ngay cả ở 412px, vì bảng tự co và text tự wrap.
- **CB-14 — Focus indicator:** cả 3 engine đều hiển thị focus ring rõ.
- **CB-09 — `text-transform:uppercase`:** giá trị DOM giữ nguyên chữ thường nhưng `Checkout.jsx:29` đã gọi `.toUpperCase()` trước khi gửi → không phát sinh lỗi.
- **CB-15 — Scrollbar gutter:** đo được **0px trên cả 3 nền tảng** (`innerWidth == clientWidth`), nên breakpoint hiệu dụng không bị lệch. Cần nêu rõ giới hạn của phép đo: bộ test chạy **headless** với `--hide-scrollbars`, nên trên Chrome/Firefox desktop **có giao diện thật** (scrollbar cổ điển chiếm ~15-17px) con số này có thể khác 0. Kết luận PASS chỉ đúng trong điều kiện headless đã đo; nếu cần khẳng định cho desktop thật thì phải đo lại ở chế độ headed.

---

## 7. Cách tái hiện

```bash
# 1. Khởi chạy SUT
cd docs/eshop-sut/backend   && npm install && node database.js && node server.js
cd docs/eshop-sut/frontend-web && npm install && npm run dev -- --host

# 2. Chạy toàn bộ 3 nền tảng
cd cross-platform
python run_cross_platform.py

# 3. Chạy 1 nền tảng
python run_cross_platform.py --platform P3

# 4. Sinh ma trận CSV
python generate_report.py
```

Biến môi trường `ESHOP_LAN_URL` để đổi URL LAN cho P3 (mặc định `http://172.16.0.252:5173`).

**Lưu ý kỹ thuật khi đọc code test:** `CartContext` giữ giỏ hàng **chỉ trong React state** (không dùng `localStorage`), nên giỏ hàng không thể inject — phải click thật qua UI. Ngoài ra `ProductDetail.jsx:22` cố tình **bỏ qua click đầu tiên** (`clickCount` guard), nên hàm `seed_cart()` phải click 3 lần/sản phẩm và điều hướng bằng SPA (`spa_navigate`) thay vì `driver.get()` — vì reload trang sẽ remount `CartProvider` và làm mất giỏ hàng.

---

## 8. Việc còn lại (cần sinh viên tự làm)

- [ ] **Chụp ảnh bug thủ công** để đính vào GitHub Issues (theo yêu cầu của bạn — ảnh tự chụp).
- [ ] Tạo GitHub Issues cho **BUG-CP-01 … BUG-CP-06**, đính ảnh tương ứng.
- [ ] (Tùy chọn) Bổ sung Expo Go trên điện thoại thật làm nền tảng thứ 4, hoặc chạy lại P3 trên **thiết bị Android thật** thay cho device emulation để tăng độ thuyết phục.
