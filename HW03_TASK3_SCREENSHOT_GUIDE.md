# Task 3 — Hướng dẫn chụp ảnh bug thủ công (không dùng script)

> Thay thế bộ ảnh do `run_cross_platform.py` sinh ra bằng ảnh chụp tay trên nền tảng thật.
> **Tổng cộng: 14 ảnh bắt buộc** (+ 2 ảnh tuỳ chọn).
> Lưu tất cả vào: `hw3/submission/cross-platform/screenshots/`

---

## 0. Chuẩn bị chung — làm một lần trước khi chụp

### 0.1 Khởi động SUT

```bash
cd hw3/docs/eshop-sut/backend && npm start          # cổng 3000
cd hw3/docs/eshop-sut/frontend-web && npm run dev    # cổng 5173
```

### 0.2 Xác định URL cho từng nền tảng

| Nền tảng                              | URL dùng khi chụp                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| P1 — Chrome trên Windows              | `http://localhost:5173`                                                                   |
| P2 — Firefox trên Windows             | `http://localhost:5173`                                                                   |
| P3 — Android Chrome (điện thoại thật) | `http://<IP-LAN-máy-bạn>:5173` — lấy IP bằng `ipconfig`, ví dụ `http://172.16.0.252:5173` |

> ⚠️ **P3 phải dùng IP LAN**, không dùng `localhost` — điện thoại truy cập máy tính qua mạng. Máy tính và điện thoại phải **cùng WiFi**. Nếu không kết nối được, tắt tạm Windows Firewall cho cổng 5173.

### 0.3 ⚠️ BẮT BUỘC — Overlay trên mọi ảnh (§6 và §11)

Mỗi ảnh **phải thấy rõ**:

1. **`23127344@hcmus.edu.vn`** — email MSSV của bạn
2. **Tên trình duyệt / OS / thiết bị**
3. **URL của SUT**

**Cách làm đơn giản nhất:** mở **DevTools Console** (F12) và chạy lệnh dưới đây trước khi chụp — nó dán một thanh overlay lên đầu trang:

```js
(() => {
  const PLATFORM = "P1 · Chrome 141 / Windows 11"; // ← ĐỔI theo nền tảng đang chụp
  const d = document.createElement("div");
  d.style.cssText =
    "position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#000;color:#0f0;font:bold 14px monospace;padding:6px 10px;line-height:1.5";
  d.innerHTML = `23127344@hcmus.edu.vn | ${PLATFORM}<br>SUT: ${location.href}`;
  document.body.prepend(d);
})();
```

Đổi biến `PLATFORM` theo từng nền tảng:

- P1 → `"P1 · Chrome 141 / Windows 11"`
- P2 → `"P2 · Firefox 145 / Windows 11"`
- P3 → `"P3 · Android Chrome / <tên máy thật của bạn>"`

> **Với P3 (điện thoại):** không mở được DevTools trực tiếp. Hai cách:
>
> - **Cách A (khuyến nghị):** dùng **Chrome Remote Debugging** — cắm USB, bật USB Debugging, mở `chrome://inspect` trên máy tính, chạy lệnh trên qua console từ xa.
> - **Cách B:** chụp màn hình điện thoại bình thường (đã thấy sẵn URL trên thanh địa chỉ), rồi **chèn chữ MSSV + tên máy** bằng app chỉnh ảnh trước khi lưu.

### 0.4 Đăng nhập sẵn (cần cho Cart / Checkout / Profile)

Tài khoản test: `test@eshop.com` — mật khẩu xem trong `hw3/docs/eshop-sut/README.md`.

---

## 1. BẢNG TỔNG HỢP — 14 ảnh cần chụp

| #   | Tên file       | Bug       | Nền tảng      | Màn hình      | Vì sao cần                                          |
| --- | -------------- | --------- | ------------- | ------------- | --------------------------------------------------- |
| 1   | `P1-CB-01.png` | BUG-CP-01 | P1 Chrome     | ProductDetail | Đối chứng: desktop **bình thường**                  |
| 2   | `P2-CB-01.png` | BUG-CP-01 | P2 Firefox    | ProductDetail | Đối chứng: engine khác cũng bình thường             |
| 3   | `P3-CB-01.png` | BUG-CP-01 | **P3 Mobile** | ProductDetail | **Lỗi chỉ ở đây**                                   |
| 4   | `P1-CB-06.png` | BUG-CP-02 | P1 Chrome     | Cart          | Định dạng `30,000,000 ₫`                            |
| 5   | `P2-CB-06.png` | BUG-CP-02 | P2 Firefox    | Cart          | Định dạng **khác**: `30.000.000 ₫`                  |
| 6   | `P3-CB-06.png` | BUG-CP-02 | P3 Mobile     | Cart          | Xác nhận mobile theo Chrome                         |
| 7   | `P1-CB-08.png` | BUG-CP-03 | P1 Chrome     | Checkout      | Sửa được tổng tiền                                  |
| 8   | `P1-CB-05.png` | BUG-CP-04 | P1 Chrome     | ProductDetail | Ô số lượng nhận số âm                               |
| 9   | `P1-CB-13.png` | BUG-CP-05 | P1 Chrome     | Profile       | `alert()` desktop                                   |
| 10  | `P3-CB-13.png` | BUG-CP-05 | **P3 Mobile** | Profile       | **Checkbox "ngăn hộp thoại"** — rủi ro riêng mobile |
| 11  | `P1-CB-18.png` | BUG-CP-06 | P1 Chrome     | Cart          | 9 vùng bấm nhỏ (desktop)                            |
| 12  | `P3-CB-18.png` | BUG-CP-06 | P3 Mobile     | Cart          | 7 vùng bấm nhỏ (mobile)                             |
| 13  | `P2-CB-08.png` | BUG-CP-03 | P2 Firefox    | Checkout      | _(tuỳ chọn)_ xác nhận systemic                      |
| 14  | `P3-CB-08.png` | BUG-CP-03 | P3 Mobile     | Checkout      | _(tuỳ chọn)_ xác nhận systemic                      |

**Nguyên tắc chọn số ảnh:**

- Bug **divergent** (chỉ lỗi 1 nền tảng) → chụp **cả 3** để có đối chứng. Nói "chỉ lỗi trên mobile" mà không có ảnh desktop chạy đúng thì không chứng minh được gì.
- Bug **systemic** (lỗi giống nhau cả 3) → **1 ảnh là đủ**, 3 ảnh giống hệt nhau không thêm thông tin.
- Bug **biểu hiện khác nhau** → chụp các nền tảng có khác biệt.

---

## 2. CHI TIẾT TỪNG BUG

### BUG-CP-01 — `@media` lồng không được biên dịch

**Ảnh cần:** `P1-CB-01.png` · `P2-CB-01.png` · `P3-CB-01.png` (cả 3 — đây là bug divergent)

**Màn hình:** `http://localhost:5173/product/1`

**Cách chụp:**

1. Mở trang chi tiết sản phẩm
2. Chạy lệnh overlay (mục 0.3)
3. Mở DevTools → tab **Elements** → tìm phần tử có class `bug-mobile-hidden`
4. Xem tab **Computed** → tìm dòng `margin-right`
5. Chụp sao cho thấy **cả trang web lẫn giá trị `margin-right` trong DevTools**

**Giá trị kỳ vọng trên từng nền tảng:**

| Ảnh            | Viewport          | `margin-right` phải thấy             |
| -------------- | ----------------- | ------------------------------------ |
| `P1-CB-01.png` | Desktop (~1422px) | **`0px`** ← rule không áp dụng, đúng |
| `P2-CB-01.png` | Desktop (~1440px) | **`0px`** ← đúng                     |
| `P3-CB-01.png` | Mobile (412px)    | **`-100px`** ← **SAI, đây là bug**   |

> 💡 **Điểm mấu chốt:** giá trị `margin-right` phải **đọc được trong ảnh**. Đây là bằng chứng duy nhất của bug này — nút bấm nhìn bằng mắt thường **không thấy khác biệt** (xem ghi chú cuối file).

---

### BUG-CP-02 — Định dạng tiền tệ đổi theo locale

**Ảnh cần:** `P1-CB-06.png` · `P2-CB-06.png` · `P3-CB-06.png` (cả 3 — biểu hiện khác nhau)

**Màn hình:** `http://localhost:5173/cart` (đăng nhập + thêm sẵn 2-3 sản phẩm)

**Cách chụp:**

1. Thêm iPhone 15 Pro Max và 1 sản phẩm khác vào giỏ
2. Mở trang giỏ hàng, chạy overlay
3. Chụp sao cho **thấy rõ các con số giá tiền**

**Khác biệt cần thấy được:**

| Ảnh            | Trình duyệt   | Giá phải hiện                     |
| -------------- | ------------- | --------------------------------- |
| `P1-CB-06.png` | Chrome        | **`30,000,000 ₫`** ← dấu phẩy     |
| `P2-CB-06.png` | Firefox       | **`30.000.000 ₫`** ← **dấu chấm** |
| `P3-CB-06.png` | Mobile Chrome | `30,000,000 ₫`                    |

> 💡 Đây là ảnh **thuyết phục nhất** của Task 3: cùng một trang, cùng một máy, nhưng hai trình duyệt hiển thị số tiền khác nhau. Nên chụp thật rõ phần giá.
>
> **Nếu Firefox của bạn cũng hiện dấu phẩy:** vào `about:config` → tìm `intl.regional_prefs.use_os_locale` → đặt `true`, hoặc đổi ngôn ngữ Firefox sang Tiếng Việt trong Settings, rồi tải lại trang.

---

### BUG-CP-03 — Sửa được tổng tiền đơn hàng

**Ảnh cần:** `P1-CB-08.png` (bắt buộc) · `P2-CB-08.png`, `P3-CB-08.png` (tuỳ chọn)

**Màn hình:** `http://localhost:5173/checkout`

**Cách chụp:**

1. Có sẵn sản phẩm trong giỏ → vào trang Checkout
2. Chạy overlay
3. Mở DevTools → **Elements** → tìm ô tổng tiền
4. Kiểm tra thuộc tính: **không có** `readonly`, **không có** `disabled`
5. Sửa trực tiếp giá trị ô tổng tiền thành `1`
6. Chụp sao cho thấy **ô tổng tiền = 1** và **thẻ HTML trong DevTools không có readonly/disabled**

> 💡 Ảnh thuyết phục nhất là thấy đồng thời: tổng tiền hiển thị `1` trên giao diện + đoạn HTML `<input value="1">` không có thuộc tính khoá.

---

### BUG-CP-04 — Ô số lượng thiếu min/max/step

**Ảnh cần:** `P1-CB-05.png` (1 ảnh — systemic, cả 3 nền tảng giống hệt)

**Màn hình:** `http://localhost:5173/product/1`

**Cách chụp:**

1. Mở trang chi tiết sản phẩm, chạy overlay
2. Nhập **`-5`** vào ô "Số lượng"
3. Mở DevTools → Elements → chọn ô số lượng
4. Chụp sao cho thấy: **ô nhập hiện `-5`** + **thẻ `<input type="number">` không có `min`, `max`, `step`**

> 💡 Có thể bấm thêm "Thêm vào giỏ hàng" để cho thấy hệ thống chấp nhận số âm — chụp luôn kết quả.

---

### BUG-CP-05 — `alert()` chặn luồng, mobile tắt được vĩnh viễn

**Ảnh cần:** `P1-CB-13.png` (desktop) · `P3-CB-13.png` (**mobile — quan trọng hơn**)

**Màn hình:** `http://localhost:5173/profile`

**Cách chụp `P1-CB-13.png` (Chrome desktop):**

1. Vào trang Profile, chạy overlay
2. Nhập số điện thoại **sai** (VD: `abc` hoặc `123`)
3. Bấm Lưu → hộp thoại `alert()` hiện ra
4. Chụp **lúc hộp thoại đang hiển thị**, thấy rõ dòng chữ _"Số điện thoại không hợp lệ..."_

**Cách chụp `P3-CB-13.png` (Android — ảnh giá trị nhất):**

1. Làm tương tự trên điện thoại
2. Bấm Lưu lần **thứ hai** → Android Chrome sẽ hiện thêm **checkbox "Ngăn trang này tạo thêm hộp thoại"**
3. **Chụp đúng khoảnh khắc thấy checkbox đó**

> 💡 Checkbox này là toàn bộ luận điểm của bug: người dùng tick vào → mọi thông báo lỗi sau đó **biến mất im lặng**. Không có ảnh này thì bug chỉ còn là "alert xấu", mất tính cross-platform.

---

### BUG-CP-06 — Vùng bấm dưới 44×44px

**Ảnh cần:** `P1-CB-18.png` (desktop) · `P3-CB-18.png` (mobile)

**Màn hình:** `http://localhost:5173/cart`

**Cách chụp:**

1. Có sản phẩm trong giỏ, chạy overlay
2. Mở DevTools → **Elements** → di chuột lên nút **"Xóa"**
3. DevTools hiện tooltip kích thước → phải thấy **`27 × 24`**
4. Chụp sao cho thấy **nút "Xóa" + tooltip kích thước**

**Số vùng bấm dưới chuẩn (đã đo được):**

| Ảnh            | Viewport | Số vùng dưới 44×44px |
| -------------- | -------- | -------------------- |
| `P1-CB-18.png` | 1422px   | **9** vùng           |
| `P3-CB-18.png` | 412px    | **7** vùng           |

Các phần tử vi phạm: `EShop` 70×32 · `Giỏ hàng` 64×24 · `Chào, Test User` 108×24 · `Thoát` 64×32 · **`Xóa` 27×24** (nhỏ nhất)

> 💡 Với ảnh mobile, chụp thêm cảnh **ngón tay che gần hết nút "Xóa"** cũng là bằng chứng trực quan tốt.

---

## 3. QUY TẮC ĐẶT TÊN FILE

```
<Platform>-<CaseID>.png
```

| Thành phần | Giá trị hợp lệ                                                 |
| ---------- | -------------------------------------------------------------- |
| Platform   | `P1` (Chrome desktop) · `P2` (Firefox desktop) · `P3` (mobile) |
| CaseID     | `CB-01`, `CB-05`, `CB-06`, `CB-08`, `CB-13`, `CB-18`           |

**Ví dụ đúng:** `P1-CB-01.png` · `P3-CB-13.png`

⚠️ **Giữ đúng tên này** — bảng bug trong `Main_Report.md` §3.6, `cross-platform/Report.md` và `CrossPlatform_Matrix.csv` đều đang trỏ tới các tên file này. Đổi tên là **gãy toàn bộ link** trong báo cáo.

**Nơi lưu:** `hw3/submission/cross-platform/screenshots/`

---

## 4. CHECKLIST HOÀN THÀNH

**P1 — Chrome / Windows (6 ảnh):**

- [ ] `P1-CB-01.png` — ProductDetail, `margin-right: 0px`
- [ ] `P1-CB-05.png` — ProductDetail, ô số lượng `-5`, không min/max/step
- [ ] `P1-CB-06.png` — Cart, giá `30,000,000 ₫`
- [ ] `P1-CB-08.png` — Checkout, tổng tiền sửa thành `1`
- [ ] `P1-CB-13.png` — Profile, hộp thoại `alert()`
- [ ] `P1-CB-18.png` — Cart, nút "Xóa" 27×24px

**P2 — Firefox / Windows (2 ảnh):**

- [ ] `P2-CB-01.png` — ProductDetail, `margin-right: 0px`
- [ ] `P2-CB-06.png` — Cart, giá `30.000.000 ₫` ← **khác Chrome**

**P3 — Mobile (4 ảnh):**

- [ ] `P3-CB-01.png` — ProductDetail, `margin-right: -100px` ← **bug divergent**
- [ ] `P3-CB-06.png` — Cart, định dạng giá
- [ ] `P3-CB-13.png` — Profile, **checkbox "ngăn hộp thoại"**
- [ ] `P3-CB-18.png` — Cart, vùng bấm nhỏ

**Tuỳ chọn (2 ảnh):**

- [ ] `P2-CB-08.png` · `P3-CB-08.png` — Checkout, xác nhận systemic

**Sau khi chụp xong:**

- [ ] Kiểm tra **mọi ảnh** đều thấy rõ `23127344@hcmus.edu.vn` + tên nền tảng + URL
- [ ] Xoá ảnh cũ do script sinh (nếu thay thế hoàn toàn)
- [ ] Nếu P3 chụp trên **điện thoại thật**: sửa `Main_Report.md` §3.3 và §3.8 — hiện đang ghi _"device emulation, không phải máy vật lý"_. Chụp máy thật là **điểm cộng** theo §6, đừng để ghi chú cũ làm mất.
- [ ] Commit theo §12

---

## 5. ⚠️ LƯU Ý QUAN TRỌNG VỀ BUG-CP-01

Bộ ảnh cũ do script sinh ra ghi _"button pushed 100px off-canvas"_, nhưng khi mở ảnh `P3-CB-01.png` ra xem thì **nút "Thêm vào giỏ hàng" vẫn nằm gọn trong khung hình**. Chính `results.json` cũng ghi case CB-02 (P3) = **PASS** với ghi chú _"Button inside viewport (right=225 ≤ 412)"_.

**Nghĩa là:** `margin-right: -100px` **có** được áp dụng sai, nhưng **chưa đủ** để đẩy nút ra khỏi màn hình ở viewport 412px.

**Khi chụp lại thủ công, bạn có 2 lựa chọn:**

| Cách                                       | Làm gì                                            | Kết quả                                                                                                              |
| ------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **A. Chụp giá trị DevTools** (khuyến nghị) | Chụp `margin-right: -100px` trong tab Computed    | Bằng chứng chắc chắn, mô tả bug phải sửa thành "margin âm áp dụng sai, lỗi tiềm ẩn", hạ severity Critical → **High** |
| **B. Thu viewport hẹp hơn**                | Thử ở 360px hoặc 320px xem nút có tràn thật không | Nếu tràn thật → chụp được cảnh tràn, giữ nguyên Critical                                                             |

Nếu chọn **B** mà nút vẫn không tràn ở 320px, quay lại **A** và sửa mô tả.

> Trung thực về giới hạn bằng chứng được điểm cao hơn khẳng định quá tay rồi bị bắt lỗi lúc oral defense (§13 — 30% sinh viên bị gọi).
