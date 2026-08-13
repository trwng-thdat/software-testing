# Agent Skills — HW05

## `jmeter-testplan-eshop`

Skill sinh test plan JMeter (`.jmx`) cho SUT EShop theo ba loại kịch bản Load / Stress / Spike.

### Cách dùng

Trong Claude Code, gọi skill bằng cách mô tả việc cần làm — skill tự kích hoạt khi nhận ra ngữ cảnh:

```
tạo test plan load cho EShop
làm spike test cho nhóm endpoint giỏ hàng
sinh jmx cho luồng admin
```

Skill sẽ **hỏi loại kịch bản** (nếu chưa nêu rõ), **hỏi luồng nghiệp vụ**, và **hỏi cấu hình phần cứng** trước khi sinh file.

### Cấu trúc

```
jmeter-testplan-eshop/
├── SKILL.md                      quy trình 7 bước + khi nào phải dừng lại hỏi
├── references/
│   ├── api_spec.md               đặc tả API EShop — nguồn chân lý cho tên endpoint
│   ├── jmeter-pitfalls.md        4 lỗi ngữ nghĩa JMeter đã gặp thật + cách tránh
│   ├── scenario-profiles.md      tham số mặc định Load / Stress / Spike
│   └── workflows.md              luồng E2E dựng sẵn, phân nhóm endpoint
├── templates/
│   └── base-workflow.md          khung XML đã sửa sẵn 4 lỗi
└── scripts/
    └── validate_jmx.py           kiểm tra cú pháp + ngữ nghĩa file đã sinh
```

### Điểm khác biệt so với việc hỏi AI trực tiếp

Skill này mã hóa **bốn lỗi ngữ nghĩa JMeter có thật** đã phát hiện trong quá trình làm HW05 — cả bốn đều lọt qua kiểm tra XML thông thường:

| Lỗi | Hậu quả nếu không biết |
|---|---|
| `recycle=false` + `loops=-1` | Bài test chết ở ~giây 30 thay vì chạy đủ thời lượng, không báo lỗi |
| Timer đặt ngang hàng sampler | Think time bị nhân lên, throughput sai lệch ~5 lần |
| Giá trị mặc định extractor là số | Request gửi dữ liệu sai nhưng assertion vẫn pass |
| Tính CSV theo VU đỉnh | Kịch bản nhiều giai đoạn thiếu dữ liệu giữa chừng |

Template trong skill đã sửa sẵn cả bốn, và `validate_jmx.py` phát hiện lại chúng nếu xuất hiện.

### Kiểm chứng script

Script đã được thử trên ba test plan hiện có của HW05 và phát hiện đúng ba loại lỗi:

```bash
python skills/jmeter-testplan-eshop/scripts/validate_jmx.py \
    plans/23127344_Load_20260812.jmx --csv-rows 120 --think-time 13.25
```

### Giới hạn

Script **chỉ kiểm tra file**, không thay thế được việc chạy thử. Nó không xác nhận được:

- File có mở được bằng JMeter thật không
- JSON Path có khớp response thật của SUT không
- Tham số tải có phù hợp phần cứng không

Ba điều trên bắt buộc phải chạy thử 1 VU trên SUT thật mới biết.
