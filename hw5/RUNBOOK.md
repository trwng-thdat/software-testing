# RUNBOOK — Các bước còn lại của Task 1 (HW05)

> Tài liệu thao tác. Làm tuần tự từ bước 0. Mỗi bước có **cách kiểm tra đã xong**
> trước khi sang bước sau — bỏ qua phần kiểm tra là nguồn gốc của mọi lần chạy hỏng.
>
> Ký hiệu: `PS>` chạy trong PowerShell, `SH>` chạy trong Git Bash.

---

## Bước 0 — Chuẩn bị môi trường (làm một lần)

### 0.1 Cài dependency cho backend

`group05_eshop/backend/node_modules` hiện có thư mục nhưng **rỗng hoàn toàn** — mọi
module (`express`, `sqlite3`, …) đều là thư mục trống, nên `node server.js` sẽ báo
`Cannot find module 'express'`.

```powershell
cd "c:\HCMUS\Software Testing\software-testing\group05_eshop\backend"
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
```

**Kiểm tra đã xong:**
```powershell
node -e "require('express'); require('sqlite3'); console.log('OK')"
```
Phải in ra `OK`. Nếu vẫn lỗi, xóa cả `package-lock.json` rồi `npm install` lại.

### 0.2 Cài JMeter — ✅ ĐÃ XONG

JMeter 5.6.3 đã được cài tại `C:\apache-jmeter-5.6.3`, Java 21 đã có sẵn.

| Hạng mục | Giá trị |
| --- | --- |
| Phiên bản | Apache JMeter 5.6.3 |
| Đường dẫn | `C:\apache-jmeter-5.6.3\bin\jmeter.bat` |
| Nguồn tải | `https://dlcdn.apache.org/jmeter/binaries/apache-jmeter-5.6.3.zip` |
| SHA-512 | `387fadca903ee0aa...0163076` — **đã đối chiếu khớp** với checksum chính thức của Apache |
| Java | 21.0.10 LTS |

Để gõ ngắn gọn trong phiên PowerShell hiện tại:

```powershell
$env:PATH += ";C:\apache-jmeter-5.6.3\bin"
```

**Cả ba file `.jmx` đã được xác nhận mở được bằng JMeter thật** (chạy thử với
`-Jvusers=1 -Jduration=1`, SUT chưa bật nên 0 sample là đúng):

| File | Kết quả nạp | Ghi chú |
| --- | --- | --- |
| `23127344_Load_20260812.jmx` | ✅ `Starting standalone test` | Không lỗi, không exception |
| `23127344_Spike_20260813.jmx` | ✅ `Starting standalone test` | Không lỗi, không exception |
| `23127344_Stress_20260812.jmx` | ✅ `Created the tree successfully` | Không thể chạy nhanh vì bậc 5 có `delay=480s` cứng trong file; chỉ xác nhận khâu nạp |

> Đây là điều mà mọi lần kiểm tra trước đó **không** chứng minh được:
> `validate_jmx.py` chỉ đọc XML, không thể biết JMeter có chấp nhận file hay không.
> Nay đã xác nhận bằng chính JMeter 5.6.3.

### 0.3 Khởi động SUT

Mở **một cửa sổ PowerShell riêng** và để nguyên đó suốt quá trình test:

```powershell
cd "c:\HCMUS\Software Testing\software-testing\group05_eshop\backend"
node server.js
```

**Kiểm tra đã xong** (cửa sổ khác):
```powershell
curl.exe -s -X POST http://localhost:3000/api/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"perf001@test.com\",\"password\":\"Password123!\"}'
```

Phải trả JSON có `"token"`. Nếu trả `Invalid email or password` → chạy lại seed:

```powershell
cd "c:\HCMUS\Software Testing\software-testing"
python hw5\data\seed_perf_users.py
```

> ⚠️ **Đây là bước kiểm tra quan trọng nhất trong toàn bộ runbook.** Nếu bỏ qua và
> tài khoản chưa seed, cả ba bài test vẫn "chạy xong" và vẫn xuất `.jtl` bình thường,
> nhưng mọi request đều 401 và số liệu hoàn toàn vô nghĩa (lỗi \#8 §3.6).

---

## Bước 1 — Chạy thử 1 VU (BẮT BUỘC trước khi chạy tải thật)

Mục đích: xác nhận JSON Path khớp response thật, assertion không fail giả, luồng
chạy đủ 6 bước. Chạy 1 VU trong 30 giây, không phải để đo hiệu năng.

```powershell
cd "c:\HCMUS\Software Testing\software-testing\hw5\plans"
jmeter -n -t 23127344_Load_20260812.jmx `
  -Jvusers=1 -Jrampup=1 -Jduration=30 `
  -l ..\results\smoke.jtl
```

**Kiểm tra đã xong:**

```powershell
cd "c:\HCMUS\Software Testing\software-testing"
python hw5\scripts\check_jtl.py hw5\results\smoke.jtl
```

Tiêu chí đạt: **tỉ lệ lỗi 0%** và thấy đủ **6 nhãn** (`01 POST /api/login` …
`05 POST /api/apply-coupon`). Nếu có lỗi, xem cột `failureMessage` để biết
assertion nào fail rồi sửa trước khi đi tiếp — **đừng chạy tải thật khi smoke còn đỏ.**

---

## Bước 2 — Chạy 3 kịch bản chính

### Quy tắc chung cho cả ba lần chạy

> ⚠️ **SUT xóa sạch CSDL mỗi lần khởi động lại.** `database.js:117` gọi
> `initDatabase()` ở top level, hàm này `DROP TABLE` cả 6 bảng rồi seed lại
> 2 tài khoản mặc định. `server.js:4` require file đó, nên **mỗi lần backend
> restart là 120 tài khoản `perf*` biến mất**. Điều này đã thật sự xảy ra giữa
> một lần chạy Load và khiến bài test cho 100% lỗi trên 14 229 sample.

1. **Trước mỗi lần chạy:** seed lại rồi kiểm chứng luồng — 2 giây, bảo vệ 10 phút
   ```powershell
   python hw5\data\seed_perf_users.py --db "C:\HCMUS\Software Testing\group05_eshop\backend\database.sqlite"
   python hw5\scripts\verify_flow.py
   ```
   `verify_flow.py` phải in `KET QUA: ca 13 assertion deu PASS`. Nếu không,
   **đừng chạy tải** — sửa trước đã.
2. **Trong lúc chạy:** mở Task Manager → tab **Details** → chuột phải tiêu đề cột →
   *Select columns* → tick **CPU**, **Memory (active private working set)**.
   Tìm dòng `node.exe`. Chụp màn hình sao cho **thấy đồng thời** cửa sổ JMeter/terminal
   và Task Manager — đề bài yêu cầu cả hai trong **cùng một khung hình**.
3. **Sau mỗi lần chạy:** kiểm tra `.jtl` bằng `check_jtl.py` trước khi chạy tiếp.

### 2.1 Load (~10 phút)

```powershell
cd "c:\HCMUS\Software Testing\software-testing\hw5\plans"
jmeter -n -t 23127344_Load_20260812.jmx `
  -l ..\results\23127344_Load_20260812.jtl `
  -e -o ..\reports\load
```

Ảnh chụp lưu vào `evidence/load/`.

### 2.2 Stress (~10 phút)

```powershell
python ..\data\seed_perf_users.py --reset
jmeter -n -t 23127344_Stress_20260812.jmx `
  -l ..\results\23127344_Stress_20260812.jtl `
  -e -o ..\reports\stress
```

Ảnh chụp lưu vào `evidence/stress/`. Kịch bản này tăng dần 20→100 VU theo 5 bậc,
mỗi bậc cách nhau 120 giây — hãy chụp ít nhất 2 ảnh ở hai mức tải khác nhau.

### 2.3 Spike (~7 phút)

```powershell
python ..\data\seed_perf_users.py --reset
jmeter -n -t 23127344_Spike_20260813.jmx `
  -l ..\results\23127344_Spike_20260813.jtl `
  -e -o ..\reports\spike
```

Ảnh chụp lưu vào `evidence/spike/`. Mốc thời gian đáng chụp: giây ~60 (nền trước),
giây ~150 (đang spike), giây ~300 (đang phục hồi).

> **Kiểm tra riêng cho Spike:** sau khi chạy, xác nhận số VU thật sự đạt được.
> Ramp 5 giây cho 60 VU có thể vượt khả năng khởi tạo thread của chính JMeter.
> ```powershell
> python hw5\scripts\check_jtl.py hw5\results\23127344_Spike_20260813.jtl --spike
> ```
> Nếu `allThreads` tối đa không đạt ~60 trong khoảng giây 120–180 → chạy lại với
> `-Jspike_rampup=10`, và ghi việc này vào §3.4 của báo cáo.

---

## Bước 3 — Endurance / soak (10–15 phút)

Mục tiêu: tìm **RPS ổn định tối đa** và **trần bộ nhớ**. Dùng mức VU mà bài Load
cho thấy hệ thống còn ổn định (nếu Load 50 VU chạy tốt, dùng 50; nếu đã có dấu hiệu
quá tải, giảm xuống).

```powershell
python ..\data\seed_perf_users.py --reset
jmeter -n -t 23127344_Load_20260812.jmx `
  -Jvusers=50 -Jrampup=60 -Jduration=900 `
  -l ..\results\23127344_Endurance_20260813.jtl `
  -e -o ..\reports\endurance
```

**Trong lúc chạy — đây là phần quan trọng nhất của bước này:** ghi lại bộ nhớ của
`node.exe` mỗi 30 giây. Mở PowerShell thứ ba:

```powershell
cd "c:\HCMUS\Software Testing\software-testing\hw5"
1..30 | ForEach-Object {
  $p = Get-Process node -ErrorAction SilentlyContinue | Select-Object -First 1
  "{0},{1:N1}" -f (Get-Date -Format "HH:mm:ss"), ($p.WorkingSet64/1MB)
  Start-Sleep -Seconds 30
} | Tee-Object -FilePath evidence\endurance\memory_trend.csv
```

**Cách đọc kết quả:** cột bộ nhớ **tăng đơn điệu** suốt 15 phút → nghi rò rỉ bộ nhớ,
đáng báo cáo. **Đi ngang** sau giai đoạn khởi động → bình thường.

Điền số liệu vào bảng §3.9 của báo cáo.

---

## Bước 4 — Video demo (≥ 6 phút)

Đề bài (mục 6 Task 1) yêu cầu rất cụ thể, thiếu một trong bốn điều dưới là mất điểm:

| Yêu cầu | Cách đáp ứng |
| --- | --- |
| JMeter **và** resource monitor trong **cùng khung hình** | Chia đôi màn hình: trái = terminal chạy JMeter, phải = Task Manager |
| Tối thiểu 6 phút | Có thể cắt thành 3 clip (mỗi kịch bản một clip) rồi ghép |
| Thuyết minh **tiếng Việt do chính bạn nói** | Không dùng giọng đọc máy |
| Unlisted trên YouTube | Không để Private — trợ giảng phải mở được link |

Gợi ý nội dung để đủ 6 phút mà không lan man:
1. (30s) Giới thiệu SUT, luồng 6 bước, ba nhóm endpoint
2. (60s) Mở file `.jmx` trong JMeter GUI, chỉ vào Thread Group, CSV Data Set, assertion
3. (90s/kịch bản × 3) Chạy từng kịch bản, vừa chạy vừa chỉ vào Task Manager
4. (60s) Mở HTML report, chỉ vào biểu đồ p95 và tỉ lệ lỗi

Sau khi có link, điền vào **dòng 15** và **dòng 586** của `Main_Report.md`
(chỗ `Video demo (YouTube unlisted, ≥ 6 phút)`). Lưu ý đây là video **khác** với
video Agent Skill ở §6 đã có link.

---

## Bước 5 — Bằng chứng phần cứng

```powershell
dxdiag /t "c:\HCMUS\Software Testing\software-testing\hw5\evidence\hardware\dxdiag.txt"
```

Chụp thêm ảnh Task Manager tab **Performance** (thấy CPU model, số nhân, tổng RAM).
Điền bảng §2.1. Đề bài mục 11 nói **hostname phải khớp với các bài trước** — kiểm tra:

```powershell
hostname
```

---

## Bước 6 — Báo cáo lỗi lên GitHub Issues

Đã có sẵn **1 bug** phát hiện từ đọc mã nguồn (§3.11 lỗi \#1): `POST /api/apply-coupon`
tính sai giảm giá phần trăm — `SAVE10` trên đơn 500 000 ₫ trả `final_amount = 5 000 000`
thay vì 450 000. Tạo issue kèm:

- Bước tái hiện (lệnh `curl` cụ thể)
- Kết quả mong đợi vs thực tế
- Dẫn chiếu `server.js:399-401`
- Ảnh chụp response

Chụp màn hình issue lưu vào `evidence/issues/`, điền URL vào bảng §3.11.

---

## Checklist hoàn thành Task 1

- [ ] 0.1 `npm install` xong, `require('express')` chạy được
- [ ] 0.2 JMeter 5.6.3 chạy được
- [ ] 0.3 SUT chạy, login `perf001@test.com` trả token
- [ ] 1 Smoke 1 VU: 0% lỗi, đủ 6 nhãn
- [ ] 2.1 Load: `.jtl` + `reports/load/` + ảnh `evidence/load/`
- [ ] 2.2 Stress: `.jtl` + `reports/stress/` + ảnh `evidence/stress/`
- [ ] 2.3 Spike: `.jtl` + `reports/spike/` + ảnh `evidence/spike/` + kiểm `allThreads`
- [ ] 3 Endurance: `.jtl` + `memory_trend.csv` + điền §3.9
- [ ] 4 Video ≥6 phút, unlisted, điền link vào dòng 15 và 586
- [ ] 5 `dxdiag.txt` + ảnh Performance + điền §2.1
- [ ] 6 GitHub Issue cho bug giảm giá + ảnh + điền §3.11
- [ ] Điền các ô `_<...>_` còn lại ở §3.4, §3.7, §3.8, §3.9, §3.10
