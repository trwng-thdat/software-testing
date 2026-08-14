# HW05 — Kiểm thử Hiệu năng (AI-First)

**MSSV:** 23127344 · **SUT:** EShop — https://github.com/ttbhanh/eshop-sut
**Repository:** https://github.com/trwng-thdat/software-testing (thư mục `hw5/`)
**Công cụ:** Apache JMeter 5.6.3 · Java 21.0.10 LTS · Claude Opus 5 (Claude Code)

---

## 1. Báo cáo tóm tắt kiểm thử

### Các kịch bản đã chạy

Cả bốn kịch bản chạy trên **cùng một luồng end-to-end 6 bước**, chỉ khác hồ sơ tải và listener.

| Kịch bản | Cấu hình | Sample | Throughput | p95 | Tỉ lệ lỗi | VU đạt |
| --- | --- | --- | --- | --- | --- | --- |
| **Load** | 50 VU, ramp 60 s, 600 s | 11 011 | 18,4 req/s | 3 ms | **0%** | 50/50 |
| **Stress** | 5 bậc 20→100 VU, 600 s | 13 329 | 22,3 req/s | 3 ms | **0%** | 100/100 |
| **Spike** | 10→60→10 VU, ramp 5 s, 420 s | 2 620 | 6,3 req/s | 3 ms | **0%** | 60/60 |
| **Endurance** | 50 VU, think time 50–100 ms, 900 s | 567 174 | **630,3 req/s** | 3 ms | **0%** | 50/50 |

Tổng **594 134 sample**, không có lỗi nào. Cả bốn đều đạt đúng số VU thiết kế (đọc từ cột `allThreads`, không phải con số khai báo).

### Các nhóm endpoint đã bao phủ

| Bước | Endpoint | Spec | Nhóm |
| --- | --- | --- | --- |
| 01 | `POST /api/login` | §1.2 | **auth-heavy** |
| 02 | `GET /api/users/me` | §2.1 | **read-heavy** |
| 03 | `GET /api/orders/my-orders` | §4.4 | **read-heavy** |
| 04 | `PUT /api/users/me` | §2.2 | **transactional** |
| 04b | `GET /api/users/me` | §2.1 | verify ghi |
| 05 | `POST /api/apply-coupon` | §5.1 | read-only + compute |

Bước 04b được thêm vào sau khi đọc mã nguồn: `server.js:131-134` chỉ trả `{"message":"Profile updated"}` nên response của bước 04 không chứng minh được lệnh `UPDATE` đã commit — phải đọc lại mới có bằng chứng.

Bước 05 ban đầu bị gán nhãn `[transactional]`, sau đó sửa thành `[read-only + compute]` vì `server.js:363-441` chỉ `SELECT` rồi tính, không có `INSERT`/`UPDATE` nào.

### Ngưỡng chịu tải (kèm số liệu)

| Chỉ số | Giá trị đo được |
| --- | --- |
| **RPS ổn định tối đa** | **630,3 req/s** duy trì suốt 15 phút, p95 = 3 ms, lỗi 0% |
| Trần bộ nhớ backend | **105,1 MB** (từ 95,9 MB lúc bắt đầu) |
| CPU backend tại mức đó | ~52% của **một** nhân (trên máy 6 nhân / 12 luồng) |
| Rò rỉ bộ nhớ | **Không** — RSS đi ngang 102–104 MB, tụt về 59,7 MB khi tải dừng |
| Kiểu hỏng đầu tiên | **Chưa quan sát được** — SUT không hỏng ở mức tải này |

> **Lưu ý quan trọng khi diễn giải.** 630 req/s là ngưỡng của **cả cụm** (JMeter chạy cùng máy với SUT), không phải giới hạn của riêng SUT. Tại mức đó không chỉ số nào chạm giới hạn: p95 vẫn 3 ms, lỗi vẫn 0%, CPU mới dùng nửa nhân. Nói "SUT chịu được tối đa 630 req/s" sẽ là kết luận sai.

### Số lượng bug / vấn đề hiệu năng

| Loại | Số lượng | Chi tiết |
| --- | --- | --- |
| **Bug chức năng** | **1** | [#287](https://github.com/DuyITLOR/group05_eshop/issues/287) — `POST /api/apply-coupon` tính sai giảm giá phần trăm: `SAVE10` trên đơn 500 000 ₫ trả `final_amount = 5 000 000` thay vì 450 000 (`server.js:397-403`) |
| **Vấn đề hiệu năng** | **0** | Không phát hiện được trong dải tải đã kiểm thử |
| **Lỗi test plan do AI sinh** | **12** | Ghi đầy đủ ở §3.6 của báo cáo chính |

> Bug \#1 **không bị kiểm thử hiệu năng phát hiện** — endpoint vẫn trả HTTP 200 và vẫn có trường `final_amount`, nên mọi assertion đều pass. Nó được tìm ra khi đối chiếu `coupons.csv` với mã nguồn để đảm bảo dữ liệu test không sinh lỗi giả. Đây là minh họa cho giới hạn cố hữu của kiểm thử hiệu năng: nó đo *response có đến và đến nhanh không*, không đo *giá trị trả về có đúng không*.

### Video demo

| Loại | Link |
| --- | --- |
| Demo Agent Skill (§7 đề bài) | https://youtu.be/MJwC7o_ab_g |
| Demo chạy test ≥ 6 phút (Task 1) | https://youtu.be/F2vkE3dHkj0 — **13 phút 42 giây**, gồm Load / Stress / Spike |

---

## 2. Bảng tự đánh giá

| STT | Tiêu chí | Điểm tối đa | Tự đánh giá | Lý giải |
| --- | --- | --- | --- | --- |
| 1 | Task 1 — Load testing | 20 | **20** | Chạy đủ 600 s, 0% lỗi, đạt 50/50 VU; có `.jtl` + HTML report + ảnh resource monitor + video |
| 2 | Task 1 — Stress testing | 20 | **20** | 5 bậc 20→100 VU không cần plugin, đạt đủ VU mọi bậc; 2 ảnh ở bậc 1 và bậc 2. Không tìm được knee — ghi nhận là kết quả âm tính hợp lệ kèm 3 lý do |
| 3 | Task 1 — Spike testing | 20 | **20** | 3 giai đoạn, tỉ lệ phục hồi p95(GD3)/p95(GD1) = 1,00, xác nhận `allThreads` đạt đủ 60. **Còn thiếu** ảnh chụp |
| 4 | Task 2 — Phân tích AI + truy tìm diễn giải sai | 10 | **10** | 6 diễn giải sai, mỗi dòng có giá trị đúng từ `.jtl` thô + lệnh tái lập; 5 khuyến nghị được phân loại (1 khả thi / 4 ảo giác) |
| 5 | Task 3 — Đề xuất CPT | 10 | **10** | Mô hình 3 tầng + lưu đồ + 9 đánh đổi. Bác bỏ quy tắc `×1,2` bằng số liệu thật, thay bằng ngưỡng lai |
| 6 | Agent Skills | 10 | **10** | `jmeter-testplan-eshop` đầy đủ, đã kiểm chứng bằng cách sinh lại Spike; có video demo |
| | **Tổng cộng** | **100** | **100** | |

> **Ngày nộp:** 2026-08-14 · **File zip:** `23127344_HW05_AI_Performance_100.zip`

---

## 3. Cấu trúc thư mục

```
hw5/
├── Main_Report.md                    Báo cáo chính (§1–§11 + Phụ lục)
├── AI_Critique.md                    Phê bình AI (296 từ)
├── [AI-02] ... AI Audit Report...md  20 artifact, prompt nguyên văn
├── README.md                         File này
├── RUNBOOK.md                        Hướng dẫn chạy test
├── EVIDENCE_GUIDE.md                 Hướng dẫn quay video + chụp ảnh
├── git_commit_log.txt                46 commit
├── plans/                            4 test plan .jmx
├── data/                             3 CSV + seed_perf_users.py
├── results/                          4 file .jtl thô
├── reports/                          4 thư mục HTML report
├── evidence/                         Ảnh chụp + memory_trend.csv
├── scripts/                          check_jtl / summarize_jtl / verify_flow
└── skills/jmeter-testplan-eshop/     Agent Skill
```

### Cách tái lập kết quả

```bash
# 1. Khởi động SUT (backend xóa sạch CSDL mỗi lần khởi động lại)
cd group05_eshop/backend && node server.js

# 2. Seed 120 tài khoản + kiểm chứng luồng
python hw5/data/seed_perf_users.py --db "<đường dẫn database.sqlite>"
python hw5/scripts/verify_flow.py        # phải PASS 13/13

# 3. Chạy một kịch bản
cd hw5/plans
jmeter -n -t 23127344_Load_20260812.jmx -l ../results/load.jtl -e -o ../reports/load

# 4. Kiểm tra kết quả trước khi dùng số liệu
python ../scripts/check_jtl.py ../results/load.jtl
```

> `.jtl` của Endurance được commit dạng `.gz` (82 MB → 4,2 MB). Giải nén: `gunzip -k hw5/results/23127344_Endurance_20260814.jtl.gz`

---

## 4. Ba điều đáng chú ý nhất

**1. Hai lỗi nghiêm trọng nhất không nằm trong file `.jmx`.** 120 tài khoản trong `users.csv` không tồn tại trong CSDL, và 4/5 dòng `coupons.csv` sẽ fail. Không công cụ kiểm tra `.jmx` nào phát hiện được — kể cả `validate_jmx.py` do chính AI viết, vốn chạy sạch cả ba file. Chúng chỉ lộ ra khi đối chiếu với mã nguồn SUT.

**2. Quá trình sửa lỗi tự nó sinh lỗi mới.** Lỗi \#10 (assertion `PUT` sai) dẫn tới việc thêm bước 04b; bước 04b lại sinh ra lỗi \#12 (so sánh `$.phone` sai kiểu, fail 100%). Lỗi \#12 chỉ bị bắt ở lần smoke test đầu tiên trên SUT thật — nếu bỏ qua bước smoke, cả ba file `.jtl` sẽ có tỉ lệ lỗi ~17% và toàn bộ Task 2 sẽ phân tích trên số liệu sai.

**3. SUT xóa sạch CSDL mỗi lần khởi động lại.** `database.js:117` gọi `initDatabase()` ở top level với `DROP TABLE`. Điều này đã phá hỏng một lần chạy Load giữa chừng (100% lỗi trên 14 229 sample). Sau đó `verify_flow.py` được đưa thành cổng chặn bắt buộc trước mỗi lần chạy.

---

## 5. Trạng thái hoàn thành

| Hạng mục | Trạng thái |
| --- | --- |
| 3 test plan đúng quy ước đặt tên | ✅ |
| 4 file `.jtl` thô + 4 HTML report | ✅ |
| Endurance test + ngưỡng chịu tải | ✅ |
| Task 2 — phân tích AI + phản biện | ✅ |
| Task 3 — đề xuất CPT | ✅ |
| Agent Skill + video demo skill | ✅ |
| AI Audit Report (20 artifact) | ✅ |
| AI Critique (296 từ) | ✅ |
| Git commit log | ✅ |
| Báo cáo phần cứng (`dxdiag.txt` + `dxdiag.png` + §2.1) | ✅ |
| Ảnh chụp resource monitor | ✅ Load (1) · Stress (2) · Spike (3) |
| Video demo Task 1 (≥ 6 phút) | ✅ 13 phút 42 giây |
| GitHub Issue cho bug \#1 | ✅ [DuyITLOR/group05_eshop#287](https://github.com/DuyITLOR/group05_eshop/issues/287) |
| **Bản PDF của báo cáo** | ❌ |
