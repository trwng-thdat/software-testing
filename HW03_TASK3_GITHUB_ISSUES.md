# Task 3 — Nội dung 6 GitHub Issue (copy thẳng lên GitHub)

> **Repo:** `DuyITLOR/group05_eshop` (cùng repo với Task 1, issues #125–#154)
> **Cách dùng:** mỗi mục dưới đây là 1 issue. Copy phần **Title** vào ô tiêu đề, copy nguyên khối trong ô code vào phần mô tả, rồi **kéo thả ảnh** được liệt kê ở đầu mỗi mục vào cuối phần mô tả.
> ✅ **ĐÃ TẠO XONG** — 6 issue đã lên GitHub: **#213–#218**. Số issue đã được ghi vào `Main_Report.md` §3.6 và `github_issues/README.md`.
>
> | Bug | Issue | Bug | Issue |
> | --- | --- | --- | --- |
> | BUG-CP-01 | [#213](https://github.com/DuyITLOR/group05_eshop/issues/213) | BUG-CP-04 | [#216](https://github.com/DuyITLOR/group05_eshop/issues/216) |
> | BUG-CP-02 | [#214](https://github.com/DuyITLOR/group05_eshop/issues/214) | BUG-CP-05 | [#217](https://github.com/DuyITLOR/group05_eshop/issues/217) |
> | BUG-CP-03 | [#215](https://github.com/DuyITLOR/group05_eshop/issues/215) | BUG-CP-06 | [#218](https://github.com/DuyITLOR/group05_eshop/issues/218) |
>
> File này giữ lại làm tham chiếu nội dung issue.

## Bảng tra nhanh — ảnh nào cho issue nào

| Bug       | Severity | Ảnh cần đính kèm                                    | Đường dẫn                                                                                  |
| --------- | -------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| BUG-CP-01 | High ⬇️  | `P3-CB-01.png` (+ nên bổ sung P1, P2 — xem ghi chú) | [`hw3/submission/cross-platform/screenshots/`](hw3/submission/cross-platform/screenshots/) |
| BUG-CP-02 | High     | `P1-CB-06.png`, `P2-CB-06.png`, `P3-CB-06.png`      | 〃                                                                                         |
| BUG-CP-03 | Critical | `P1-CB-08.png` (hoặc cả 3)                          | 〃                                                                                         |
| BUG-CP-04 | Medium   | `P1-CB-05.png`                                      | 〃                                                                                         |
| BUG-CP-05 | Medium   | `P3-CB-13.png` (rủi ro riêng mobile)                | 〃                                                                                         |
| BUG-CP-06 | Medium   | `P1-CB-18.png`, `P3-CB-18.png`                      | 〃                                                                                         |

> ⚠️ **BUG-CP-01 — đọc trước khi tạo issue.** Ảnh `P3-CB-01.png` **không** cho thấy nút bị đẩy ra ngoài màn hình: nút "Thêm vào giỏ hàng" vẫn nằm gọn trong khung. Chính `results.json` cũng ghi CB-02 (P3) = **PASS** với ghi chú _"Button inside viewport (right=225 ≤ 412), margin-right=-100px"_.
>
> Vì vậy nội dung issue bên dưới đã được viết lại theo **đúng bằng chứng đo được** (margin âm được áp dụng, khác biệt giữa các engine) thay vì theo câu kết luận quá tay trong script ("pushed 100px off-canvas"), và **hạ severity Critical → High**. Nêu trung thực giới hạn bằng chứng an toàn hơn nhiều so với khẳng định quá tay rồi bị bắt lỗi lúc oral defense.
>
> Nhớ sửa lại mô tả tương ứng trong `Main_Report.md` §3.6 và §3.4 cho khớp.

---

## BUG-CP-01

**Ảnh đính kèm:** `P3-CB-01.png` (khuyến nghị bổ sung `P1-CB-01.png`, `P2-CB-01.png` làm đối chứng desktop)

**Title:**

```
[HW03][BUG][cross-platform] @media lồng trong CSS thường không được biên dịch — margin-right âm chỉ áp dụng trên viewport mobile
```

**Description:**

````markdown
**Mô tả:** `index.css` khai báo `@media` **lồng bên trong** một class CSS thường. Dự án dùng Tailwind 3 + PostCSS **không bật `postcss-nesting`**, nên khối `@media` lồng này không được biên dịch đúng và giá trị `margin-right: -100px` được áp dụng ngoài ý muốn ở viewport hẹp.

**Nguồn:** `frontend-web/src/index.css:11-15` + `frontend-web/src/pages/ProductDetail.jsx:66`

```css
.bug-mobile-hidden {
  @media (max-width: 640px) {
    margin-right: -100px;
  }
}
```
````

**Kết quả đo được (18 case × 3 nền tảng, Selenium 4.46):**

| Nền tảng                                       | Viewport | `margin-right` đo được  | Verdict  |
| ---------------------------------------------- | -------- | ----------------------- | -------- |
| P1 — Chrome 141 / Windows 11 (Blink)           | 1422px   | `0px` (rule inert đúng) | PASS     |
| P2 — Firefox 145 / Windows 11 (**Gecko**)      | 1440px   | `0px` (rule inert đúng) | PASS     |
| P3 — Chrome mobile emulation (Pixel 7 profile) | 412px    | **`-100px`**            | **FAIL** |

`CSS.supports(selector(&)) = true` trên cả 3 nền tảng — trình duyệt hiểu cú pháp nesting, vấn đề nằm ở **bước biên dịch PostCSS**, không phải ở trình duyệt.

**Kiểm chứng bằng biên dịch trực tiếp:**

```
$ npx tailwindcss -i src/index.css -o out.css
.bug-mobile-hidden {
  @media (max-width: 640px) {   ← @media lồng CÒN NGUYÊN, không được biên dịch
    margin-right: -100px;
```

**Phạm vi ảnh hưởng thực tế (đã kiểm chứng, nêu rõ giới hạn):** ở viewport 412px, margin âm **được áp dụng** nhưng **chưa đủ đẩy nút ra khỏi màn hình** — case CB-02 xác nhận nút vẫn nằm trong viewport (`right=225 ≤ 412`). Đây là **lỗi tiềm ẩn**: giá trị `-100px` đang có hiệu lực ngoài ý muốn và có thể gây tràn ở viewport hẹp hơn hoặc khi bố cục thay đổi.

**Cách tái hiện:**

1. Mở `http://localhost:5173/product/1`
2. Thu cửa sổ xuống dưới 640px (hoặc dùng Chrome DevTools device mode, profile Pixel 7 — 412×915)
3. Inspect phần tử có class `bug-mobile-hidden` → xem `computed margin-right`
4. Kỳ vọng: `0px` · Thực tế: `-100px`

**Đề xuất sửa:** bật `postcss-nesting` trong `postcss.config.js`, hoặc viết `@media` ở cấp cao nhất thay vì lồng trong class.

**Mức độ:** High — lỗi cấu hình build ảnh hưởng toàn bộ CSS nesting của dự án, không riêng class này.

**Phát hiện qua:** Task 3 Cross-Platform, case CB-01

```

---

## BUG-CP-02

**Ảnh đính kèm:** `P1-CB-06.png`, `P2-CB-06.png`, `P3-CB-06.png` (bắt buộc cả 3 — đây là bug biểu hiện khác nhau giữa các engine)

**Title:**

```

[HW03][BUG][cross-platform] Định dạng tiền tệ đổi theo locale của browser/OS — Chrome hiện "30,000,000 ₫", Firefox hiện "30.000.000 ₫"

````

**Description:**

```markdown
**Mô tả:** Giá tiền được format bằng `toLocaleString()` **không truyền tham số locale**, nên dấu phân cách nghìn/thập phân phụ thuộc hoàn toàn vào cài đặt locale của trình duyệt/hệ điều hành thay vì cố định `vi-VN`. Cùng một bản build, cùng một dữ liệu, nhưng hiển thị khác nhau giữa các máy người dùng.

**Nguồn:** `frontend-web/src/pages/Cart.jsx:46,48,63` · `Checkout.jsx:86,138` · `ProductDetail.jsx:50`

**Kết quả đo được:**

| Nền tảng | `resolvedLocale` | `(1234567.5).toLocaleString()` | Hiển thị trên trang |
| --- | --- | --- | --- |
| P1 — Chrome 141 / Windows 11 | `en-US` | `1,234,567.5` | `30,000,000 ₫` |
| P2 — Firefox 145 / Windows 11 | **`vi`** | `1.234.567,5` | **`30.000.000 ₫`** |
| P3 — Chrome mobile emulation (Pixel 7) | `en-US` | `1,234,567.5` | `30,000,000 ₫` |

Đây là **khác biệt engine thật**: cùng một máy Windows, Firefox tự resolve về `vi` còn Chrome về `en-US`.

**Vì sao nghiêm trọng:** với tiền tệ Việt Nam, dấu `.` và `,` bị đảo vai trò giữa hai định dạng. Người dùng đọc `30,000,000` theo thói quen Việt Nam có thể hiểu nhầm thành 30 nghìn. Đây là rủi ro hiểu nhầm số tiền, không chỉ là khác biệt thẩm mỹ.

**Cách tái hiện:**
1. Mở `http://localhost:5173/cart` trên Chrome → ghi lại định dạng giá
2. Mở đúng URL đó trên Firefox → so sánh
3. Kỳ vọng: hai trình duyệt hiển thị giống nhau · Thực tế: khác nhau ở dấu phân cách

**Đề xuất sửa:** dùng `toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })` — truyền locale tường minh, không phụ thuộc môi trường người dùng.

**Mức độ:** High

**Phát hiện qua:** Task 3 Cross-Platform, case CB-06
````

---

## BUG-CP-03

**Ảnh đính kèm:** `P1-CB-08.png` (systemic — 1 ảnh là đủ; đính cả `P2`, `P3` nếu muốn đầy đủ)

**Title:**

```
[HW03][BUG][security][checkout] Tổng tiền đơn hàng cho phép người dùng sửa trực tiếp rồi gửi lên server (price tampering)
```

**Description:**

```markdown
**Mô tả:** Ô tổng tiền ở trang Checkout **không** đặt `readOnly`/`disabled` và không có ràng buộc `min`. Người dùng có thể sửa trực tiếp giá trị trong DOM rồi submit — server nhận và xử lý giá trị đã bị sửa.

**Nguồn:** `frontend-web/src/pages/Checkout.jsx:93-102`

**Kết quả đo được (tái hiện trên cả 3 nền tảng):**

| Nền tảng                               | `readOnly` | `disabled` | `min`  | Kết quả                               |
| -------------------------------------- | ---------- | ---------- | ------ | ------------------------------------- |
| P1 — Chrome 141 / Windows 11           | `False`    | `False`    | `None` | **FAIL** — set value = `1` thành công |
| P2 — Firefox 145 / Windows 11          | `False`    | `False`    | `None` | **FAIL** — set value = `1` thành công |
| P3 — Chrome mobile emulation (Pixel 7) | `False`    | `False`    | `None` | **FAIL** — set value = `1` thành công |

**Systemic** — lỗi nằm ở tầng ứng dụng, không phụ thuộc engine, tái hiện y hệt trên cả 3 nền tảng.

**Cách tái hiện:**

1. Thêm sản phẩm bất kỳ vào giỏ, vào `http://localhost:5173/checkout`
2. Mở DevTools, sửa value của ô tổng tiền thành `1`
3. Submit đơn hàng
4. Kỳ vọng: server từ chối hoặc tính lại tổng tiền từ giỏ · Thực tế: giá trị đã sửa được chấp nhận

**Đề xuất sửa:** (1) đặt `readOnly` cho ô tổng tiền ở phía client; (2) **quan trọng hơn** — server phải **tính lại tổng tiền từ giỏ hàng**, không bao giờ tin giá trị client gửi lên. Validate phía client chỉ là tiện ích UX, không phải cơ chế bảo mật.

**Mức độ:** Critical — cho phép thao túng giá đơn hàng.

**Phát hiện qua:** Task 3 Cross-Platform, case CB-08
```

---

## BUG-CP-04

**Ảnh đính kèm:** `P1-CB-05.png` (systemic — 1 ảnh là đủ)

**Title:**

```
[HW03][BUG][product-detail] Ô số lượng thiếu min/max/step — trình duyệt không thể áp dụng validate native, chấp nhận số âm và 0
```

**Description:**

```markdown
**Mô tả:** Ô nhập số lượng dùng `type="number"` nhưng **không khai báo** `min`, `max`, `step`. Trình duyệt do đó không có cơ sở để áp dụng validate native, và toàn bộ ràng buộc phụ thuộc vào JS phía client.

**Nguồn:** `frontend-web/src/pages/ProductDetail.jsx:56-61`

**Kết quả đo được (cả 3 nền tảng đều FAIL, giá trị đo giống hệt nhau):**

| Nền tảng                               | `min`  | `max`  | `step` | Verdict |
| -------------------------------------- | ------ | ------ | ------ | ------- |
| P1 — Chrome 141 / Windows 11           | `None` | `None` | `None` | FAIL    |
| P2 — Firefox 145 / Windows 11          | `None` | `None` | `None` | FAIL    |
| P3 — Chrome mobile emulation (Pixel 7) | `None` | `None` | `None` | FAIL    |

Số lượng âm và 0 đều được chấp nhận.

**Vì sao là vấn đề cross-platform:** khi không có ràng buộc HTML, hành vi phụ thuộc hoàn toàn vào JS — mà cách mỗi engine xử lý input `type="number"` (spinner, nhập trực tiếp, paste) lại khác nhau. Khai báo `min`/`max`/`step` cho phép trình duyệt tự chặn ở tầng native, nhất quán trên mọi nền tảng.

**Cách tái hiện:**

1. Mở `http://localhost:5173/product/1`
2. Nhập `-5` hoặc `0` vào ô "Số lượng"
3. Bấm "Thêm vào giỏ hàng"
4. Kỳ vọng: trình duyệt chặn hoặc báo lỗi · Thực tế: giá trị được chấp nhận

**Đề xuất sửa:** thêm `min="1" step="1"` và `max` theo tồn kho; giữ song song validate phía server.

**Mức độ:** Medium

**Phát hiện qua:** Task 3 Cross-Platform, case CB-05
```

---

## BUG-CP-05

**Ảnh đính kèm:** `P3-CB-13.png` (nên đính vì rủi ro nặng nhất nằm ở mobile; có thể kèm `P1-CB-13.png`)

**Title:**

```
[HW03][BUG][profile] Validate dùng alert() chặn luồng — trên Android Chrome người dùng có thể tắt vĩnh viễn mọi thông báo lỗi
```

**Description:**

```markdown
**Mô tả:** Form Profile dùng `alert()` native để báo lỗi validate. Hộp thoại này do OS vẽ nên **hiển thị khác nhau trên từng nền tảng**, không style được, và chặn toàn bộ luồng thao tác.

**Nguồn:** `frontend-web/src/pages/Profile.jsx:43-45`

Thông báo đo được: `"Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."`

**Kết quả:** FAIL trên cả 3 nền tảng, nhưng **hậu quả nặng nhất ở mobile**:

| Nền tảng                               | Biểu hiện                                                  |
| -------------------------------------- | ---------------------------------------------------------- |
| P1 — Chrome 141 / Windows 11           | Modal OS-chrome, chặn luồng, không style được              |
| P2 — Firefox 145 / Windows 11          | Modal OS-chrome, giao diện khác Chrome                     |
| P3 — Chrome mobile emulation (Pixel 7) | Modal kèm checkbox **"Ngăn trang này tạo thêm hộp thoại"** |

**Rủi ro riêng của Android Chrome:** nếu người dùng tick vào checkbox đó (rất dễ xảy ra khi bị lỗi lặp lại nhiều lần), **mọi `alert()` sau đó bị chặn im lặng** trong phiên làm việc. Kể từ đó form validate thất bại mà **không hiển thị bất kỳ thông báo nào** — người dùng không hiểu vì sao không lưu được thông tin.

**Cách tái hiện:**

1. Mở `http://localhost:5173/profile` trên Android Chrome (hoặc Chrome DevTools device mode)
2. Nhập số điện thoại sai định dạng → submit → alert hiện ra
3. Tick "Ngăn trang này tạo thêm hộp thoại", đóng alert
4. Submit lại với dữ liệu sai
5. Kỳ vọng: vẫn báo lỗi · Thực tế: không có phản hồi nào

**Đề xuất sửa:** thay `alert()` bằng thông báo lỗi inline ngay dưới trường nhập (kèm `aria-live` cho screen reader). Vừa nhất quán giữa các nền tảng, vừa không bị người dùng vô hiệu hoá, vừa tốt hơn cho accessibility.

**Mức độ:** Medium

**Phát hiện qua:** Task 3 Cross-Platform, case CB-13
```

---

## BUG-CP-06

**Ảnh đính kèm:** `P1-CB-18.png`, `P3-CB-18.png` (nên có cả 2 để thấy khác biệt desktop/mobile)

**Title:**

```
[HW03][BUG][a11y] 7–9 vùng bấm dưới 44×44px; nút "Xóa" chỉ 27×24px và xóa sản phẩm không cần xác nhận
```

**Description:**

```markdown
**Mô tả:** Nhiều vùng bấm nhỏ hơn ngưỡng khuyến nghị **44×44px** (WCAG 2.1 SC 2.5.5 Target Size). Nghiêm trọng nhất là nút "Xóa" trong giỏ hàng: chỉ **27×24px** và **xoá sản phẩm ngay lập tức, không có bước xác nhận**.

**Nguồn:** `frontend-web/src/pages/Cart.jsx:50-55` · `frontend-web/src/App.jsx:22-23`

**Kết quả đo được:**

| Nền tảng                               | Viewport | Số vùng bấm dưới chuẩn |
| -------------------------------------- | -------- | ---------------------- |
| P1 — Chrome 141 / Windows 11           | 1422px   | **9**                  |
| P2 — Firefox 145 / Windows 11          | 1440px   | **9**                  |
| P3 — Chrome mobile emulation (Pixel 7) | 412px    | **7**                  |

Kích thước cụ thể (giống nhau trên cả 3 nền tảng):

| Phần tử           | Kích thước | Đạt 44×44?      |
| ----------------- | ---------- | --------------- |
| `EShop` (logo)    | 70×32      | ❌              |
| `Giỏ hàng`        | 64×24      | ❌              |
| `Chào, Test User` | 108×24     | ❌              |
| `Thoát`           | 64×32      | ❌              |
| **`Xóa`**         | **27×24**  | ❌ **nhỏ nhất** |

**Vì sao đây là vấn đề cross-platform:** trên thiết bị cảm ứng, vùng bấm nhỏ khiến người dùng bấm nhầm nút bên cạnh. Kết hợp với việc "Xóa" **không có xác nhận**, một cú chạm nhầm làm mất sản phẩm khỏi giỏ mà không hoàn tác được. Rủi ro này cao hơn hẳn trên mobile so với desktop dùng chuột.

**Cách tái hiện:**

1. Thêm vài sản phẩm vào giỏ, mở `http://localhost:5173/cart`
2. Đo kích thước nút "Xóa" bằng DevTools → 27×24px
3. Thử ở chế độ mobile (412px): bấm bằng ngón tay
4. Kỳ vọng: vùng bấm ≥ 44×44px và có xác nhận trước khi xoá · Thực tế: 27×24px, xoá ngay

**Đề xuất sửa:** (1) tăng vùng bấm tối thiểu 44×44px (dùng padding, không nhất thiết phóng to icon); (2) thêm bước xác nhận hoặc chức năng hoàn tác cho thao tác xoá.

**Mức độ:** Medium

**Phát hiện qua:** Task 3 Cross-Platform, case CB-18
```

---

## Việc cần làm sau khi tạo xong 6 issue

- [ ] Ghi số issue thật vào cột `GitHub Issue` — `Main_Report.md` §3.6 (6 ô `TODO`)
- [ ] Ghi số issue vào `cross-platform/Report.md` và `CrossPlatform_Matrix.csv`
- [ ] **Chụp ảnh trang GitHub Issues** → `submission/github_issues/` (§14 bắt buộc): 1 ảnh danh sách tổng + vài ảnh issue chi tiết thấy rõ ảnh đính kèm
- [ ] Sửa mô tả BUG-CP-01 trong `Main_Report.md` §3.4/§3.6 cho khớp bằng chứng (xem cảnh báo đầu file), hạ Critical → High
- [ ] Cân nhắc chụp bổ sung `P1-CB-01.png`, `P2-CB-01.png` làm đối chứng desktop cho bug divergent
- [ ] Commit lại theo §12 (mỗi bước 1 commit)
