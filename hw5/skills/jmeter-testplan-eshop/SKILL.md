---
name: jmeter-testplan-eshop
description: Sinh test plan JMeter (.jmx) cho SUT EShop theo ba loại kịch bản Load / Stress / Spike. Dùng khi người dùng muốn tạo, sửa, hoặc rà soát test plan hiệu năng cho EShop — ví dụ "tạo test plan load", "làm spike test cho endpoint giỏ hàng", "sinh jmx cho nhóm admin". Skill hỏi loại kịch bản trước khi làm, đối chiếu mọi endpoint với api_spec.md, và tránh sẵn bốn lỗi ngữ nghĩa JMeter đã biết.
---

# Sinh test plan JMeter cho EShop

Skill này sinh file `.jmx` chạy được cho SUT EShop, theo đúng yêu cầu của HW05.

## Nguyên tắc bắt buộc

**Không bao giờ đoán tên endpoint.** Mọi endpoint phải tra trong `references/api_spec.md` và ghi kèm số mục tham chiếu (ví dụ `POST /api/login` §1.2). Nếu người dùng yêu cầu một endpoint không có trong đặc tả, dừng lại và hỏi — đừng suy ra tên route từ tên chức năng.

**Hỏi khi thiếu thông tin, đừng tự quyết.** Skill này cố ý hỏi nhiều. Mỗi lần đoán thay vì hỏi là một lần tạo ra lỗi âm thầm mà người dùng chỉ phát hiện sau khi đã chạy test và thu được số liệu vô nghĩa.

**Không tự nhận file là "đã kiểm chứng".** Kiểm tra XML hợp lệ chỉ chứng minh cú pháp đúng, không chứng minh test chạy đúng. Luôn nói rõ điều gì đã kiểm và điều gì chưa.

## Quy trình

### Bước 1 — Hỏi loại kịch bản

Luôn hỏi trước, kể cả khi người dùng đã nói "tạo test plan". Dùng AskUserQuestion:

- **Load** — quan sát hành vi ở trạng thái ổn định, tải giữ đều
- **Stress** — tăng tải theo bậc để tìm điểm gãy (knee)
- **Spike** — tải tăng đột ngột rồi rút, đo khả năng phục hồi

Nếu người dùng đã nêu rõ loại ngay trong câu lệnh (ví dụ "tạo **spike** test"), bỏ qua câu hỏi này.

### Bước 2 — Xác định luồng nghiệp vụ

Hỏi người dùng muốn kiểm thử luồng nào, hoặc xác nhận luồng mặc định. Luồng phải phủ **cả ba nhóm endpoint** mà HW05 yêu cầu:

| Nhóm | Nghĩa | Ví dụ trong EShop |
|---|---|---|
| Auth-heavy | Xác thực, tốn CPU do hash + ký JWT | `POST /api/login` §1.2 |
| Read-heavy | Đọc dữ liệu | `GET /api/users/me` §2.1, `GET /api/products` §3.1 |
| Transactional | Ghi xuống CSDL | `PUT /api/users/me` §2.2, `POST /api/checkout` §4.3 |

Đọc `references/workflows.md` để biết các luồng đã dựng sẵn và luồng nào đã bị thành viên khác trong nhóm nhận.

**Phải hỏi lại nếu:** luồng người dùng chọn thiếu một trong ba nhóm, hoặc trùng với luồng đã có người nhận.

### Bước 3 — Chốt tham số kịch bản

Đọc `references/scenario-profiles.md` để lấy tham số mặc định cho từng loại. Trình bày tham số dự kiến cho người dùng và **hỏi xác nhận trước khi sinh file**, vì tham số phụ thuộc phần cứng mà skill không biết.

Câu hỏi bắt buộc: *"Load generator chạy cùng máy với SUT hay máy riêng?"* Nếu cùng máy, cảnh báo rằng JMeter cạnh tranh CPU với SUT nên số VU đỉnh phải giảm xuống, và con số RPS đo được bị giới hạn bởi chính máy sinh tải.

### Bước 4 — Kiểm tra dữ liệu CSV

Tính **tổng số vòng lặp** mà kịch bản sẽ chạy, không phải số VU đỉnh. Xem `references/jmeter-pitfalls.md` mục 1 để biết cách tính. Nếu file CSV hiện có không đủ, sinh thêm dòng hoặc chuyển sang `recycle=true` — và giải thích lý do cho người dùng.

### Bước 5 — Sinh file

Đặt tên đúng quy ước: `{MSSV}_{Load|Stress|Spike}_{YYYYMMDD}.jmx`

Dùng `templates/base-workflow.md` làm khung. Bắt buộc:

- Mỗi test plan dùng **một loại listener khác nhau** — Load dùng `SummaryReport`, Stress dùng `StatVisualizer`, Spike dùng `ViewResultsFullVisualizer`. HW05 yêu cầu ba view không lặp lại.
- Mọi tham số quan trọng phải override được qua `${__P(tên,mặc_định)}`
- Bọc các bước sau bước đăng nhập trong If Controller kiểm tra token
- Assertion phải kiểm tra **nội dung body**, không chỉ status code

### Bước 6 — Tự kiểm tra rồi báo cáo trung thực

Chạy `scripts/validate_jmx.py` để kiểm tra cấu trúc. Sau đó **nói rõ với người dùng**:

- Đã kiểm: XML hợp lệ, hashTree ghép đôi đúng, số phần tử, tổng nhu cầu CSV
- **Chưa kiểm:** file chưa mở bằng JMeter thật, JSON Path chưa đối chiếu response thật, tham số chưa đo trên phần cứng thật

Không dùng từ "đã xong" hay "sẵn sàng chạy" khi ba điều trên chưa được xác nhận.

### Bước 7 — Nhắc ghi AI Audit Report

HW05 bắt buộc ghi lại mọi lượt dùng AI. Nhắc người dùng thêm một dòng vào audit report gồm: prompt nguyên văn, mô tả output, nhãn VALID/INVALID/INCOMPLETE, lập luận dẫn chiếu ISTQB, và phần người dùng đã sửa.

## Khi nào phải dừng lại và hỏi

Dừng và hỏi người dùng, đừng tự quyết, khi gặp:

- Endpoint không có trong `api_spec.md`
- Đặc tả mô tả mơ hồ về response (ví dụ §1.2 chỉ ghi "trả về JWT `token` và thông tin `user`" mà không nêu cấu trúc JSON) → hỏi người dùng đã đăng nhập thử chưa và cấu trúc thật ra sao
- Không rõ endpoint có ghi xuống CSDL hay không → ảnh hưởng việc phân loại transactional hay read-heavy
- Số VU đỉnh vượt quá 100 mà chưa biết cấu hình máy
- Người dùng muốn dùng cùng một tài khoản cho nhiều VU → liên quan cơ chế khóa 3 lần của FR-02

## Tài liệu tham chiếu

| File | Nội dung |
|---|---|
| `references/api_spec.md` | Đặc tả API đầy đủ của EShop — **nguồn chân lý duy nhất** cho tên endpoint |
| `references/jmeter-pitfalls.md` | Bốn lỗi ngữ nghĩa JMeter đã gặp thật, kèm cách tránh |
| `references/scenario-profiles.md` | Tham số mặc định cho Load / Stress / Spike |
| `references/workflows.md` | Các luồng E2E dựng sẵn, phân nhóm endpoint |
| `templates/base-workflow.md` | Khung XML cho thân thread group |
| `scripts/validate_jmx.py` | Script kiểm tra cấu trúc file đã sinh |
