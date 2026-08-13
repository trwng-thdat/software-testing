# Tham số mặc định cho ba loại kịch bản

Đây là **điểm khởi đầu**, không phải con số chuẩn. Mọi giá trị đều phụ thuộc phần cứng và phải hỏi người dùng xác nhận trước khi sinh file.

---

## Load — quan sát trạng thái ổn định

| Tham số | Mặc định | Lý do |
|---|---|---|
| VU đỉnh | 50 | Đủ tạo tải thật nhưng không bão hòa máy cá nhân |
| Ramp-up | 60 giây | ~1 VU/giây; ramp quá nhanh chỉ đo chi phí thiết lập kết nối |
| Thời lượng | 600 giây | Đủ dài để qua giai đoạn khởi động và đọc được trạng thái ổn định |
| Think time | Uniform 1,5–4 giây | Mô phỏng người dùng thật đọc trang |
| Listener | `SummaryReport` | Tải đều nên số tổng hợp là đủ |
| Số thread group | 1 | Tải giữ nguyên suốt bài test |

**Tiêu chí đạt cần hỏi người dùng:** ngưỡng p95 và tỉ lệ lỗi chấp nhận được là bao nhiêu.

---

## Stress — tìm điểm gãy (knee)

| Tham số | Mặc định | Lý do |
|---|---|---|
| Số bậc | 5 | Đủ điểm dữ liệu để vẽ đường cong và thấy điểm gãy |
| VU mỗi bậc | +20 | Cộng dồn 20 → 100 VU |
| Khoảng cách bậc | 120 giây | Đủ để hệ thống ổn định trước khi tăng tiếp; ngắn hơn thì không phân biệt được độ trễ do tải hay do chưa ổn định |
| Ramp mỗi bậc | 30 giây | |
| Tổng thời lượng | 600 giây | Mọi bậc cùng kết thúc |
| Listener | `StatVisualizer` (Aggregate Report) | Có sẵn cột p90/p95/p99 để xác định knee — Summary Report không có |

### Cách dựng bậc không cần plugin

JMeter bản chuẩn không có tăng tải theo bậc. Dùng **N thread group riêng với `delay` lệch nhau**, thời lượng thu dần để cùng kết thúc:

| Bậc | delay | duration | VU cộng dồn |
|---|---|---|---|
| 1 | 0 | 600 | 20 |
| 2 | 120 | 480 | 40 |
| 3 | 240 | 360 | 60 |
| 4 | 360 | 240 | 80 |
| 5 | 480 | 120 | 100 |

Cách này giúp file mở được trên bản JMeter gốc, không cần plugin Custom Thread Groups — quan trọng khi người chấm chạy trên máy khác.

---

## Spike — chịu tải đột ngột và phục hồi

| Giai đoạn | VU | delay | duration | Ramp | Vai trò |
|---|---|---|---|---|---|
| 1 — Nền trước | 10 | 0 | 120 | 20s | Lấy p95 tham chiếu |
| 2 — Spike | 100 | 120 | 60 | **5s** | Tăng gấp 10 lần gần như tức thời |
| 3 — Nền sau | 10 | 180 | 240 | 20s | **Đo phục hồi** |

**Listener:** `ViewResultsFullVisualizer` (View Results Tree) đặt `error_logging=true`.

### Hai điểm quan trọng

**Giai đoạn 3 là phần không được bỏ.** Spike test không chỉ hỏi "có sập không" mà còn "sau khi tải rút đi thì có trở về bình thường không, mất bao lâu". So sánh p95 giai đoạn 3 với giai đoạn 1 chính là thước đo đó. Nếu p95 vẫn cao đến hết bài test → hệ thống chưa hồi phục (connection pool chưa giải phóng, hàng đợi tồn đọng, bộ nhớ chưa thu hồi). Thiết kế giai đoạn 3 dài **gấp đôi** giai đoạn 1 để đủ dữ liệu.

**View Results Tree phải đặt `error_logging=true`.** Listener này lưu toàn bộ request/response vào bộ nhớ. Nếu ghi tất cả sample ở mức 100 VU thì JMeter ngốn RAM rất nhanh và chính load generator thành nút thắt — kết quả đo phản ánh giới hạn của JMeter chứ không phải của SUT.

### Rủi ro cần cảnh báo người dùng
Ramp 5 giây cho 100 VU **có thể vượt khả năng khởi tạo thread của chính JMeter**. Sau lần chạy đầu, kiểm tra cột `allThreads` trong `.jtl` xem có thật sự đạt 100 trong khoảng spike không. Nếu không, nới ramp lên 10 giây hoặc giảm VU.

---

## Endurance / Soak (bổ sung, HW05 yêu cầu riêng)

| Tham số | Mặc định |
|---|---|
| VU | Mức ổn định tìm được từ Load |
| Thời lượng | 10–15 phút |
| Mục tiêu | Tìm RPS ổn định tối đa và trần bộ nhớ |

Theo dõi RSS của tiến trình backend theo thời gian: tăng đơn điệu → nghi rò rỉ bộ nhớ; đi ngang → bình thường.

---

## Câu hỏi bắt buộc trước khi chốt tham số

1. Load generator chạy **cùng máy** với SUT hay máy riêng? (cùng máy → giảm VU đỉnh, và phải ghi chú khi diễn giải RPS)
2. Máy có bao nhiêu nhân CPU và RAM?
3. Ngưỡng p95 và tỉ lệ lỗi chấp nhận được?
4. Có giới hạn thời gian chạy không? (ảnh hưởng việc chọn thời lượng)
