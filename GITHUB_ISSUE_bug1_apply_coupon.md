# Nội dung để tạo GitHub Issue — Bug #1

> File này dùng để **copy-paste lên GitHub Issues**.
> Repo: https://github.com/trwng-thdat/software-testing/issues/new
>
> Bản gốc đầy đủ: `hw5/evidence/issues/ISSUE_bug1_apply_coupon.md`

---

## TITLE (dán vào ô tiêu đề)

```
[BUG] POST /api/apply-coupon tính sai giảm giá loại percent — áp mã làm số tiền phải trả TĂNG gấp 10 lần
```

---

## ẢNH CẦN KÈM (kéo-thả vào ô mô tả)

Kéo-thả **3 ảnh** này vào ô mô tả trên GitHub. GitHub sẽ tự upload và sinh URL dạng
`https://github.com/user-attachments/assets/...`, rồi bạn thay vào đúng vị trí đánh dấu
`<<< THẢ ẢNH ... >>>` trong phần mô tả bên dưới.

| Thứ tự | File | Vai trò |
| :-: | --- | --- |
| 1 | `hw5/evidence/issues/bug1_01_truoc_khi_ap_ma.png` | Màn hình Checkout **trước** khi áp mã — đơn 500.000 ₫ |
| 2 | `hw5/evidence/issues/bug1_02_sau_khi_ap_ma_TOAN_MAN_HINH.png` | Toàn màn hình **sau** khi áp mã — thấy rõ 5.000.000 ₫ |
| 3 | `hw5/evidence/issues/bug1_03_khoi_ket_qua_coupon.png` | Phóng to khối kết quả — thấy "Tiết kiệm: -4.500.000 ₫" |

> ⚠️ **Đừng dùng đường dẫn tương đối** kiểu `![](bug1_01.png)` — GitHub Issues không
> resolve được, ảnh sẽ hiện thành icon vỡ. Bắt buộc kéo-thả để GitHub tự host.

---

## DESCRIPTION (dán vào ô mô tả)

Toàn bộ phần dưới đây, từ dòng `## Mức độ` tới hết.

---

## Mức độ

**Cao (Critical)** — ảnh hưởng trực tiếp tới số tiền khách hàng phải trả. Khách áp mã giảm giá 10% nhưng bị tính tiền cao gấp 10 lần giá trị đơn hàng.

## Môi trường

| Hạng mục | Giá trị |
| --- | --- |
| Backend | `http://localhost:3000` (Node.js + Express + SQLite) |
| Frontend web | `http://localhost:5173` |
| Tài khoản | `test@eshop.com` |
| Mã giảm giá | `SAVE10` (`type=percent`, `discount_value=10`, `min_order=300000`) |
| Phát hiện trong | HW05 — Kiểm thử Hiệu năng |

## Các bước tái hiện

### Qua giao diện web

1. Đăng nhập bằng `test@eshop.com` / `Test1234!`
2. Mở một sản phẩm bất kỳ → bấm **Thêm vào giỏ hàng**
3. Vào **Giỏ hàng** → **Tiến hành thanh toán**
4. Ở ô **Tổng tiền thanh toán (VND)**, nhập `500000`
5. Ở ô **Mã Giảm Giá**, nhập `SAVE10` → bấm **Áp dụng**

### Hoặc gọi thẳng API

```bash
curl -X POST http://localhost:3000/api/apply-coupon \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","total_amount":500000,"user_id":2}'
```

## Kết quả mong đợi

Giảm 10% của 500.000 ₫ = 50.000 ₫, số tiền còn lại **450.000 ₫**:

```json
{ "discount_amount": 50000, "final_amount": 450000 }
```

## Kết quả thực tế

Giảm giá ra **số âm**, số tiền phải trả **tăng gấp 10 lần**:

```json
{
  "success": true,
  "coupon_id": 1,
  "discount_amount": -4500000,
  "final_amount": 5000000,
  "message": "Áp dụng thành công! Giảm 10%"
}
```

Trên giao diện, màn hình Checkout hiển thị đồng thời ba thông tin **mâu thuẫn nhau**:

- ✅ "Áp dụng thành công! Giảm 10%"
- "Tiết kiệm: **-4.500.000 ₫**" — tiết kiệm mang dấu âm
- "Tổng thanh toán: **5.000.000 ₫**" — trong khi đơn gốc chỉ 500.000 ₫

## Ảnh chụp màn hình

**Trước khi áp mã** — đơn hàng 500.000 ₫:

<<< THẢ ẢNH 1: bug1_01_truoc_khi_ap_ma.png >>>

**Sau khi áp mã `SAVE10`** — tổng thanh toán nhảy lên 5.000.000 ₫:

<<< THẢ ẢNH 2: bug1_02_sau_khi_ap_ma_TOAN_MAN_HINH.png >>>

**Phóng to khối kết quả** — "Tiết kiệm" mang giá trị âm:

<<< THẢ ẢNH 3: bug1_03_khoi_ket_qua_coupon.png >>>

## Nguyên nhân gốc

`backend/server.js:397-403`

```js
let discount_amount = 0;
if (coupon.type === "percent") {
  discount_amount = Math.floor(
    total_amount * (1 - coupon.discount_value),   // <-- SAI
  );
} else {
  discount_amount = coupon.discount_value;
}
```

Với `discount_value = 10` (nghĩa là **10 phần trăm**), biểu thức `(1 - 10)` cho `-9`, nên:

```
discount_amount = 500000 * (-9) = -4.500.000
final_amount    = 500000 - (-4.500.000) = 5.000.000
```

Công thức bị nhầm giữa hai quy ước: `(1 - x)` chỉ đúng khi `x` là **tỉ lệ thập phân** (`0.1`), còn ở đây `discount_value` được lưu theo **đơn vị phần trăm** (`10`).

## Đề xuất sửa

```js
if (coupon.type === "percent") {
  discount_amount = Math.floor(total_amount * coupon.discount_value / 100);
}
```

Kiểm chứng sau khi sửa:

| Đầu vào | `discount_amount` | `final_amount` |
| --- | --- | --- |
| `SAVE10`, 500.000 ₫ | 50.000 ₫ | 450.000 ₫ |
| `SAVE10`, 1.000.000 ₫ | 100.000 ₫ | 900.000 ₫ |

## Phạm vi ảnh hưởng

- Chỉ ảnh hưởng mã loại `percent`: `SAVE10`, `EXPIRED`.
- Mã loại `fixed` (`BIGBUY`, `VIP100`) tính **đúng**, vì nhánh `else` chỉ gán thẳng `discount_value`.

## Ghi chú thêm — vì sao kiểm thử hiệu năng không phát hiện được

Trong toàn bộ **594.134 sample** của HW05 (Load / Stress / Spike / Endurance), endpoint này **luôn trả HTTP 200 và luôn PASS mọi assertion**, vì assertion chỉ kiểm tra *có tồn tại* trường `final_amount` chứ không kiểm tra *giá trị* của nó.

Đây là minh chứng cho việc một pipeline hiệu năng "xanh" hoàn toàn không bảo đảm tính đúng đắn về mặt chức năng.

---

# Sau khi tạo issue xong

1. **Chụp màn hình trang issue** → lưu vào `hw5/evidence/issues/bug1_04_github_issue.png`
2. **Copy URL issue** (dạng `https://github.com/trwng-thdat/software-testing/issues/N`)
3. Điền URL vào:
   - `hw5/Main_Report.md` §3.11, cột **GitHub Issue** (đang là `_<URL>_`)
   - `hw5/README.md` mục **5. Trạng thái hoàn thành**
