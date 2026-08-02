# Hướng dẫn chụp 6 ảnh Safari/iPhone cho Task 3 (P3)

> **Cần chụp: 6 ảnh** — thay thế 6 file cũ trong `hw3/submission/cross-platform/screenshots/` (bộ cũ được sinh ở lần chạy Chrome mobile emulation, overlay còn ghi "Android Chrome / Pixel 7").
> **Giữ nguyên tên file** — bảng §3.6 trong `Main_Report.md` và `CrossPlatform_Matrix.csv` đang trỏ tới đúng các tên này.

---

## 0. Chuẩn bị (làm một lần)

### 0.1 Khởi động SUT + Cloudflare Tunnel

```bash
# Terminal 1 — backend
cd hw3/docs/eshop-sut/backend && npm start          # cổng 3000

# Terminal 2 — frontend
cd hw3/docs/eshop-sut/frontend-web && npm run dev    # cổng 5173

# Terminal 3 — expose frontend
cloudflared tunnel --url http://localhost:5173

# Terminal 4 — expose backend
cloudflared tunnel --url http://localhost:3000
```

⚠️ **Quan trọng:** frontend gọi API qua backend, nên nếu frontend đang hardcode `localhost:3000` thì iPhone sẽ không gọi được API. Kiểm tra file `.env` hoặc config của frontend, trỏ API sang **URL tunnel của backend** trước khi chạy.

### 0.2 Mở trên iPhone

Mở Safari, vào URL tunnel của frontend (`https://<random>.trycloudflare.com`).

### 0.3 ⚠️ Overlay MSSV — bắt buộc theo §6 và §11

Mỗi ảnh **phải thấy rõ**: `23127344@hcmus.edu.vn` · tên trình duyệt/thiết bị · URL SUT.

Safari trên iPhone đã tự hiển thị **URL trên thanh địa chỉ** — nên chỉ cần thêm MSSV. Ba cách, chọn một:

| Cách | Làm thế nào | Ghi chú |
| --- | --- | --- |
| **A. Web Inspector** (chuẩn nhất) | Cắm iPhone vào Mac → Safari trên Mac → menu Develop → chọn iPhone → chạy đoạn JS bên dưới trong Console | Cần máy Mac |
| **B. Bookmarklet** | Tạo bookmark trên Safari iPhone với địa chỉ là đoạn `javascript:...` bên dưới, rồi bấm vào bookmark khi đang ở trang cần chụp | Không cần Mac |
| **C. Chèn chữ sau khi chụp** | Chụp màn hình bình thường, dùng app chỉnh ảnh viết MSSV lên trên | Nhanh nhất, nhưng trông kém chuyên nghiệp hơn |

**Đoạn JS cho cách A và B:**

```js
javascript:(()=>{const d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#111;font:bold 16px/1.5 monospace;padding:8px;pointer-events:none;border-bottom:3px solid #0f0';d.innerHTML='<div style="color:#0f0;font-size:22px">23127344@hcmus.edu.vn</div><div style="color:#ff0">P3 · Safari / iPhone (WebKit)</div><div style="color:#6cf;word-break:break-all;font-size:13px">'+location.href+'</div>';document.body.prepend(d);})()
```

### 0.4 Đăng nhập sẵn

Cần cho Cart / Checkout / Profile. Tài khoản test: xem `hw3/docs/eshop-sut/README.md`.

---

## 1. BẢNG TỔNG HỢP — 6 ảnh

| # | Tên file | Màn hình | Bug | Cần thấy gì trong ảnh |
| --- | --- | --- | --- | --- |
| 1 | `P3-CB-01.png` | ProductDetail | BUG-CP-01 | Trang chi tiết sản phẩm ở viewport mobile |
| 2 | `P3-CB-05.png` | ProductDetail | BUG-CP-04 | Ô "Số lượng" nhập được số âm |
| 3 | `P3-CB-06.png` | Cart | BUG-CP-02 | **Định dạng giá tiền** (quan trọng nhất) |
| 4 | `P3-CB-08.png` | Checkout | BUG-CP-03 | Ô tổng tiền |
| 5 | `P3-CB-13.png` | Profile | BUG-CP-05 | **Hộp thoại `alert()` đang hiện** |
| 6 | `P3-CB-18.png` | Cart | BUG-CP-06 | Nút "Xóa" nhỏ trong giỏ hàng |

---

## 2. CHI TIẾT TỪNG ẢNH

### 📸 Ảnh 1 — `P3-CB-01.png` (ProductDetail)

**Đường dẫn:** `<tunnel-url>/product/1`

**Thao tác:**
1. Mở trang chi tiết sản phẩm
2. Bật overlay MSSV
3. Chụp toàn màn hình

**Cần thấy:** trang sản phẩm hiển thị đầy đủ, nút "Thêm vào giỏ hàng".

> 💡 **Lưu ý về bug này:** báo cáo hiện ghi `margin-right = -100px` được áp dụng ở viewport mobile. Đây là giá trị đo bằng DevTools ở lần chạy trước, **không nhìn thấy bằng mắt thường** — nút vẫn nằm trong khung. Ảnh này chỉ đóng vai trò chứng minh trang chạy được trên Safari, không chứng minh giá trị margin.
>
> Nếu bạn có Mac và dùng Web Inspector (cách A ở mục 0.3), có thể chạy thêm lệnh này rồi chụp kết quả để có bằng chứng mạnh hơn:
> ```js
> getComputedStyle(document.querySelector('.bug-mobile-hidden')).marginRight
> ```

---

### 📸 Ảnh 2 — `P3-CB-05.png` (ProductDetail)

**Đường dẫn:** `<tunnel-url>/product/1`

**Thao tác:**
1. Nhập **`-5`** vào ô "Số lượng"
2. Bật overlay, chụp

**Cần thấy:** ô số lượng đang hiển thị **`-5`** — chứng minh hệ thống chấp nhận số âm vì thiếu `min`/`max`/`step`.

---

### 📸 Ảnh 3 — `P3-CB-06.png` (Cart) ⭐ **quan trọng nhất**

**Đường dẫn:** `<tunnel-url>/cart` (đăng nhập + thêm 2–3 sản phẩm vào giỏ trước)

**Thao tác:**
1. Thêm iPhone 15 Pro Max và 1 sản phẩm khác vào giỏ
2. Mở trang giỏ hàng
3. Bật overlay, chụp sao cho **thấy rõ các con số giá tiền**

**Cần thấy:** định dạng giá — ví dụ `30,000,000 ₫` hoặc `30.000.000 ₫`.

> ⭐ **Đây là ảnh giá trị nhất của Task 3.** Bug BUG-CP-02 nói định dạng tiền đổi theo locale của trình duyệt. Safari trên iOS lấy locale từ **cài đặt vùng của iPhone**, có thể khác cả Chrome lẫn Firefox trên Windows.
>
> **Hãy ghi lại định dạng bạn thấy** rồi báo cho tôi — nếu Safari cho ra định dạng **thứ ba** khác hai cái kia, đó là bằng chứng cross-engine mạnh hơn hẳn những gì báo cáo đang có, và tôi sẽ cập nhật lại bảng so sánh.

---

### 📸 Ảnh 4 — `P3-CB-08.png` (Checkout)

**Đường dẫn:** `<tunnel-url>/checkout`

**Thao tác:**
1. Có sản phẩm trong giỏ → vào trang thanh toán
2. Chạm vào ô **tổng tiền** — nếu sửa được thì sửa thành `1`
3. Bật overlay, chụp

**Cần thấy:** ô tổng tiền, lý tưởng là đang hiển thị giá trị đã bị sửa (`1`) để chứng minh không có `readonly`.

---

### 📸 Ảnh 5 — `P3-CB-13.png` (Profile) ⭐

**Đường dẫn:** `<tunnel-url>/profile`

**Thao tác:**
1. Vào trang hồ sơ
2. Nhập số điện thoại **sai** (VD `abc` hoặc `123`)
3. Bấm Lưu → hộp thoại `alert()` hiện ra
4. **Chụp ngay lúc hộp thoại đang hiển thị**

**Cần thấy:** hộp thoại alert của **Safari/iOS** với dòng chữ *"Số điện thoại không hợp lệ..."*.

> ⭐ **Giá trị riêng của ảnh này:** hộp thoại `alert()` do **hệ điều hành vẽ**, nên giao diện trên iOS **khác hẳn** Windows. Đặt cạnh ảnh `P1-CB-13.png` (Chrome/Windows) là thấy ngay sự khác biệt — minh hoạ trực quan cho luận điểm "alert() không style được, hiển thị khác nhau tuỳ nền tảng".
>
> Nếu bấm Lưu lần thứ hai mà Safari hiện tuỳ chọn **chặn hộp thoại**, chụp luôn khoảnh khắc đó — đó là bằng chứng cho phần rủi ro riêng của mobile trong BUG-CP-05.

---

### 📸 Ảnh 6 — `P3-CB-18.png` (Cart)

**Đường dẫn:** `<tunnel-url>/cart`

**Thao tác:**
1. Mở giỏ hàng có sản phẩm
2. Bật overlay, chụp sao cho **thấy rõ nút "Xóa"**

**Cần thấy:** nút "Xóa" trong giỏ hàng (kích thước thật 27×24px — nhỏ hơn ngưỡng 44×44px của WCAG).

> 💡 Chụp thêm một ảnh có **ngón tay đặt cạnh nút "Xóa"** để thấy trực quan vùng bấm quá nhỏ so với đầu ngón tay. Nếu chụp được, lưu thành `P3-CB-18-finger.png` và báo tôi để thêm vào báo cáo.

---

## 3. Sau khi chụp xong

1. **Đổi tên đúng** 6 file như bảng trên
2. **Copy đè** vào `hw3/submission/cross-platform/screenshots/` (ghi đè 6 file cũ)
3. **Kiểm tra lại từng ảnh:** có thấy `23127344@hcmus.edu.vn` không? Có thấy URL `*.trycloudflare.com` không? Có nhận ra là Safari/iPhone không?
4. **Báo tôi** để cập nhật báo cáo:
   - Bỏ ghi chú "ảnh P3 đang chờ cập nhật" ở §3.8
   - Cập nhật định dạng tiền tệ Safari (ảnh 3) nếu khác Chrome/Firefox
   - Commit theo §12

---

## 4. Nếu không chụp đủ 6 ảnh

Ưu tiên theo thứ tự này — 3 ảnh đầu là đủ để bảo vệ luận điểm chính:

1. **`P3-CB-06.png`** (Cart, định dạng tiền) — bằng chứng cross-engine trực tiếp nhất
2. **`P3-CB-13.png`** (Profile, alert) — khác biệt OS nhìn thấy rõ nhất
3. **`P3-CB-18.png`** (Cart, nút Xóa) — vấn đề touch target chỉ có ý nghĩa trên thiết bị cảm ứng thật

Ba ảnh còn lại (CB-01, CB-05, CB-08) là bug **systemic** — biểu hiện giống nhau trên cả 3 nền tảng, nên ảnh P1 hiện có đã đủ chứng minh.
