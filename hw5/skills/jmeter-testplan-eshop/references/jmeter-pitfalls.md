# Bốn lỗi ngữ nghĩa JMeter đã gặp thật

Cả bốn lỗi dưới đây **đều lọt qua kiểm tra XML**. File hợp lệ về cú pháp, mở được, chạy được, xuất `.jtl` bình thường — nhưng đo sai. Đây là lý do phải kiểm tra ngữ nghĩa riêng, không chỉ kiểm cú pháp.

---

## Lỗi 1 — Hết dữ liệu CSV làm thread chết sớm

### Triệu chứng
Bài test dừng ở khoảng giây 30 thay vì chạy đủ thời lượng. File `.jtl` vẫn được tạo, không có thông báo lỗi.

### Nguyên nhân
JMeter đọc CSV Data Set theo **mỗi vòng lặp**, không phải mỗi thread. Khi kết hợp:

```
LoopController.loops = -1        (lặp vô hạn theo scheduler)
CSVDataSet recycle   = false     (không dùng lại dòng đã đọc)
CSVDataSet stopThread= true      (hết dòng thì giết thread)
```

thì file cạn sau đúng `số_dòng` vòng lặp **tính trên toàn bộ thread**, rồi mọi thread bị giết.

### Cách tính đúng

```
thời_lượng_1_vòng_lặp ≈ tổng think time + tổng response time
số_vòng_lặp_mỗi_VU    = thời_lượng_test / thời_lượng_1_vòng_lặp
tổng_vòng_lặp         = số_VU × số_vòng_lặp_mỗi_VU
```

Ví dụ thật: Load 50 VU × 600 giây, mỗi vòng lặp ~13 giây → cần **~2.264 dòng**, trong khi file chỉ có 120.

### Cách sửa

**Phương án A (khuyến nghị):** `recycle=true`, `stopThread=false`. Tài khoản được dùng lại. An toàn với FR-02 **nếu** lockout chỉ đếm lần đăng nhập thất bại — phải xác minh trong mã nguồn SUT trước.

**Phương án B:** giữ `recycle=false`, đặt `loops` là số hữu hạn, và tạo CSV có ít nhất `số_VU × số_loops` dòng.

### Lưu ý riêng cho Spike
Kịch bản nhiều giai đoạn cần **cộng dồn** nhu cầu qua các giai đoạn, vì mỗi giai đoạn dùng thread mới. Spike 10 + 100 + 10 VU cần 120 dòng chứ không phải 100.

---

## Lỗi 2 — Timer đặt sai scope làm think time nhân lên

### Triệu chứng
Throughput thấp hơn thiết kế nhiều lần. Khoảng cách giữa các sample lớn bất thường.

### Nguyên nhân
Trong JMeter, **timer áp dụng cho mọi sampler trong cùng scope**, và fire trước mỗi sampler — không phải chỉ sampler đứng liền trước nó.

Đặt 5 timer ngang hàng với 5 sampler:

```
Sampler 01
Timer A (1.5-2.5s)     ← áp dụng cho CẢ 5 sampler
Sampler 02
Timer B (2-4s)         ← áp dụng cho CẢ 5 sampler
...
```

Kết quả: mỗi bước chờ tổng của cả 5 timer ≈ 13,25 giây thay vì 1,5–4 giây. Throughput sai lệch ~5 lần.

### Cách sửa

Lồng timer **vào bên trong** hashTree của sampler tương ứng:

```xml
<HTTPSamplerProxy testname="01 POST /api/login">...</HTTPSamplerProxy>
<hashTree>
  <ResponseAssertion .../>
  <hashTree/>
  <UniformRandomTimer testname="Think time"/>   <!-- nằm TRONG hashTree của sampler -->
  <hashTree/>
</hashTree>
```

Hoặc dùng **một** timer duy nhất ở cấp thread group nếu chấp nhận think time đồng đều.

---

## Lỗi 3 — Giá trị mặc định của extractor che giấu lỗi

### Triệu chứng
Request gửi đi với dữ liệu sai nhưng vẫn trả HTTP 200, assertion vẫn pass.

### Nguyên nhân
Đặt giá trị mặc định là số hợp lệ:

```xml
<stringProp name="JSONPostProcessor.defaultValues">0</stringProp>
```

Khi không tìm thấy `$.user.id`, biến nhận giá trị `0` — vẫn là user_id hợp lệ về kiểu, nên request `{"user_id": 0}` vẫn được gửi và server có thể xử lý bình thường.

### Cách sửa
Đặt giá trị mặc định là chuỗi **rõ ràng sai**, để request thất bại dứt khoát và hiện lên trong báo cáo:

```xml
<stringProp name="JSONPostProcessor.defaultValues">USERID_NOT_FOUND</stringProp>
```

Nguyên tắc: giá trị mặc định phải **gây lỗi quan sát được**, không được trông vô hại.

---

## Lỗi 4 — Tính số dòng CSV theo VU đỉnh thay vì tổng nhu cầu

Xem lỗi 1. Điểm cần nhấn: với kịch bản nhiều thread group nối tiếp (Stress theo bậc, Spike ba giai đoạn), phải cộng dồn nhu cầu của **tất cả** các giai đoạn, vì thread của giai đoạn sau là thread mới hoàn toàn.

---

## Danh sách kiểm tra trước khi giao file

- [ ] Tổng vòng lặp ước tính ≤ số dòng CSV, HOẶC `recycle=true`
- [ ] Timer nằm trong hashTree của sampler, không ngang hàng
- [ ] Mọi giá trị mặc định của extractor đều gây lỗi quan sát được
- [ ] Với kịch bản nhiều giai đoạn: đã cộng dồn nhu cầu CSV
- [ ] Ba test plan dùng ba listener khác nhau
- [ ] Đã nói rõ với người dùng điều gì **chưa** kiểm chứng
