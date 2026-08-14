# Hướng dẫn quay video và chụp ảnh evidence — HW05

> Làm tuần tự từ Phần 0. Mỗi phần ghi rõ **làm ở đâu**, **gõ lệnh gì**, **lưu file vào đâu**.
>
> **Root folder** trong tài liệu này = `c:\HCMUS\Software Testing\software-testing`

---

## Bối cảnh: vì sao phải chạy lại test

Bốn kịch bản **đã chạy xong** và kết quả đã commit:

| Kịch bản  | `.jtl` đã có      | Thời lượng       |
| --------- | ----------------- | ---------------- |
| Load      | ✅ 11 011 sample  | 597 s (~10 phút) |
| Stress    | ✅ 13 329 sample  | 598 s (~10 phút) |
| Spike     | ✅ 2 620 sample   | 417 s (~7 phút)  |
| Endurance | ✅ 567 174 sample | 899 s (15 phút)  |

Nhưng đề bài (dòng 133, 137) yêu cầu **ảnh chụp và video có JMeter + Task Manager trong cùng khung hình**. Muốn có thứ đó thì phải **chạy lại và quay màn hình trong lúc chạy**.

**Nguyên tắc quan trọng:** khi chạy lại để quay, hãy ghi ra file **tên khác** (`_demo`), đừng ghi đè kết quả đã commit. Lý do: kết quả đã có là số liệu đã được phân tích và trích dẫn trong báo cáo §3.7/§3.9. Nếu ghi đè, số trong báo cáo sẽ không khớp file — đó chính là kiểu sai lệch mà mục 11 của đề bài (chống gian lận) soi rất kỹ.

> Bạn **không cần chạy lại đủ thời lượng**. Quay 2–3 phút mỗi kịch bản rồi bấm `Ctrl+C` là đủ cho mục đích video. File `_demo` chỉ để quay, không dùng làm số liệu.

---

## Phần 0 — Chuẩn bị (làm một lần, ~10 phút)

### 0.1 Kiểm tra SUT đang chạy

Mở PowerShell, gõ:

```powershell
cd "c:\HCMUS\Software Testing\software-testing"
curl.exe -s -o NUL -w "SUT: HTTP %{http_code}`n" http://localhost:3000/api/products
```

Phải in `SUT: HTTP 200`. Nếu không, mở PowerShell riêng và chạy:

```powershell
cd "C:\HCMUS\Software Testing\group05_eshop\backend"
node server.js
```

> ⚠️ Chú ý đường dẫn: backend chạy từ `C:\HCMUS\Software Testing\group05_eshop\`
> (**không** có `software-testing` ở giữa). Máy bạn có hai bản sao thư mục này.

### 0.2 Seed lại tài khoản

Backend xóa sạch CSDL mỗi lần khởi động lại (`database.js:117`), nên **luôn seed lại** sau khi bật SUT:

```powershell
cd "c:\HCMUS\Software Testing\software-testing"
python hw5\data\seed_perf_users.py --db "C:\HCMUS\Software Testing\group05_eshop\backend\database.sqlite"
python hw5\scripts\verify_flow.py
```

`verify_flow.py` phải in `KET QUA: ca 13 assertion deu PASS`. Nếu không → dừng lại, đừng quay.

### 0.3 Bố trí màn hình (quan trọng nhất)

Đây là thứ quyết định video có được chấm điểm hay không. Đề bài yêu cầu **cùng một khung hình**.

```
┌────────────────────────────┬────────────────────────────┐
│                            │  Task Manager              │
│   PowerShell               │  tab Details               │
│   (JMeter đang chạy,       │                            │
│    dòng summary = chạy)    │  Lọc: node.exe             │
│                            │  Cột: CPU, Memory          │
│                            │                            │
└────────────────────────────┴────────────────────────────┘
```

**Cách làm:**

1. Mở PowerShell → bấm `Win + ←` (chiếm nửa trái màn hình)
2. Mở Task Manager (`Ctrl + Shift + Esc`) → bấm `Win + →` (nửa phải)
3. Trong Task Manager: chọn tab **Details** (KHÔNG phải Performance — đề bài
   yêu cầu thấy _tiến trình backend_, không phải biểu đồ CPU tổng)
4. Chuột phải vào thanh tiêu đề cột → **Select columns** → tick **CPU** và
   **Memory (active private working set)**
5. Bấm vào cột **CPU** để sắp xếp giảm dần → `node.exe` sẽ nổi lên đầu khi chạy test

### 0.4 Phần mềm quay màn hình

Windows có sẵn: bấm `Win + Alt + R` để bắt đầu/dừng quay (Xbox Game Bar).
File lưu ở `C:\Users\truon\Videos\Captures\`.

Nếu muốn công cụ tốt hơn: OBS Studio (miễn phí) cho chất lượng và điều khiển tốt hơn.

> **Bắt buộc bật micro** — đề bài yêu cầu thuyết minh tiếng Việt do chính bạn nói.
> Trong Game Bar: `Win + G` → biểu tượng micro phải sáng.

---

## Phần 1 — Ảnh chụp phần cứng (2 phút, làm trước cho xong)

Làm ở **root folder**, PowerShell:

```powershell
dxdiag
```

Cửa sổ DirectX Diagnostic Tool mở ra. Ở tab **System**, chụp màn hình bằng
`Win + Shift + S` → chọn vùng cửa sổ → ảnh vào clipboard → dán vào Paint → lưu:

```
hw5\evidence\hardware\dxdiag.png
```

> File `dxdiag.txt` đã có sẵn rồi, chỉ thiếu ảnh này.

---

## Phần 2 — Quay video và chụp ảnh cho từng kịch bản

### Cần làm gì cho kịch bản nào

| Kịch bản | Ảnh chụp | Quay video | Thời lượng quay gợi ý |
| --- | :-: | :-: | --- |
| **Load** | ✅ **bắt buộc** (1 ảnh) | Nên có | ~90 giây |
| **Stress** | ✅ **bắt buộc** (2 ảnh) | Nên có | ~90 giây |
| **Spike** | ✅ **bắt buộc** (3 ảnh) | Nên có | ~2 phút (quay trọn 7 phút cũng được) |
| **Endurance** | Tùy chọn | Tùy chọn | ~60 giây |
| *Mở HTML report* | — | Nên có | ~60 giây |

**Tổng thời lượng ước tính: 6–7 phút** → vừa đủ ngưỡng tối thiểu của đề bài.

> **Vì sao ảnh bắt buộc cho ba kịch bản chính mà không bắt buộc cho endurance:**
> đề bài dòng 133 ghi *"Chạy **cả ba kịch bản** và với mỗi lần chạy, chụp ảnh màn hình..."*.
> Endurance nằm ở dòng 135 — một gạch đầu dòng riêng, chỉ yêu cầu *"báo cáo kèm số liệu
> cụ thể"*, không nhắc tới ảnh hay video.
>
> **Vì sao vẫn nên quay đủ ba kịch bản chính:** §15 chấm Load / Stress / Spike thành
> **ba mục 20 điểm riêng biệt**. Nếu video chỉ có một kịch bản, người chấm khó xác nhận
> hai kịch bản kia đã thật sự chạy trên máy bạn.

### Kịch bản chung cho mỗi lần quay

Với **mỗi** kịch bản, làm đúng 5 bước sau:

1. Bố trí màn hình như 0.3
2. Bắt đầu quay (`Win + Alt + R`)
3. Nói phần thuyết minh (xem kịch bản nói bên dưới)
4. Gõ lệnh chạy → để chạy 2–3 phút
5. **Trong lúc đang chạy**, bấm `Win + Shift + S` chụp ảnh → lưu vào thư mục tương ứng
6. Bấm `Ctrl + C` dừng JMeter → dừng quay

### 2.1 Load

**Chuẩn bị một lần** — thêm JMeter vào PATH của phiên PowerShell này, rồi vào thư mục `plans`:

```powershell
$env:PATH += ";C:\apache-jmeter-5.6.3\bin"
cd "c:\HCMUS\Software Testing\software-testing\hw5\plans"
```

**Lệnh chạy:**

```powershell
jmeter -n -t 23127344_Load_20260812.jmx -l ..\results\demo_load.jtl
```

**Ảnh cần chụp:** 1 ảnh → `hw5\evidence\load\tool+monitor.png`

**Thuyết minh gợi ý (~90 giây):**

> "Đây là kịch bản Load test. Test plan này chạy luồng end-to-end 6 bước:
> đăng nhập, xem hồ sơ, xem lịch sử đơn hàng, cập nhật hồ sơ, đọc lại để xác
> minh dữ liệu đã ghi, và áp mã giảm giá. Cấu hình 50 virtual user, ramp-up
> 60 giây, chạy 10 phút.
>
> Bên trái là JMeter đang chạy, dòng summary cập nhật liên tục cho thấy số
> sample, throughput và tỉ lệ lỗi. Bên phải là Task Manager, dòng node.exe
> chính là tiến trình backend của SUT — hiện đang dùng khoảng X phần trăm CPU
> và Y megabyte bộ nhớ.
>
> Kết quả đầy đủ của lần chạy chính thức: 11 nghìn sample, 0 phần trăm lỗi,
> p95 là 3 mili-giây, và đạt đủ 50 virtual user."

### 2.2 Stress

```powershell
jmeter -n -t 23127344_Stress_20260812.jmx -l ..\results\demo_stress.jtl
```

**Ảnh cần chụp:** 2 ảnh (để thấy CPU tăng theo tải)

- Phút đầu (~20 VU) → `hw5\evidence\stress\tool+monitor_bac1.png`
- Sau 2 phút (~40 VU) → `hw5\evidence\stress\tool+monitor_bac2.png`

**Thuyết minh gợi ý (~90 giây):**

> "Kịch bản Stress dùng 5 thread group với delay lệch nhau, tăng dần từ 20
> lên 100 virtual user, mỗi bậc cách nhau 120 giây. Cách này chạy được trên
> JMeter bản gốc, không cần cài plugin Custom Thread Groups.
>
> Điều đáng chú ý ở kết quả chính thức: p95 giữ nguyên 2 đến 3 mili-giây từ
> 20 tới 100 virtual user — tăng tải gấp 5 lần mà thời gian phản hồi không
> đổi. Nghĩa là không tìm được điểm gãy trong dải này.
>
> Khi phân tích nguyên nhân, tôi đọc mã nguồn và phát hiện SUT lưu mật khẩu
> dạng plaintext, so sánh trực tiếp bằng dấu bằng ba, không hề hash. Nên bước
> đăng nhập vốn được kỳ vọng là nặng CPU thì thực tế chỉ mất 2,2 mili-giây."

### 2.3 Spike

```powershell
jmeter -n -t 23127344_Spike_20260813.jmx -l ..\results\demo_spike.jtl
```

**Ảnh cần chụp:** 3 ảnh theo mốc thời gian

- Giây ~60 (nền trước, 10 VU) → `hw5\evidence\spike\tool+monitor_gd1.png`
- Giây ~150 (đang spike, 60 VU) → `hw5\evidence\spike\tool+monitor_gd2.png`
- Giây ~250 (phục hồi, 10 VU) → `hw5\evidence\spike\tool+monitor_gd3.png`

> Kịch bản này chỉ 7 phút và có 3 giai đoạn rõ rệt → **dễ quay trọn vẹn nhất**.
> Nên quay đủ cả 7 phút cho kịch bản này.

**Thuyết minh gợi ý (~2 phút):**

> "Spike test có ba giai đoạn. Giai đoạn một: 10 virtual user trong 120 giây
> để lấy p95 tham chiếu. Giai đoạn hai: nhảy vọt lên 60 virtual user chỉ trong
> 5 giây ramp — tăng gấp 6 lần gần như tức thời. Giai đoạn ba: rút về 10
> virtual user và chạy 240 giây, dài gấp đôi giai đoạn một, để đo khả năng
> phục hồi.
>
> Giai đoạn ba là phần không được bỏ. Spike test không chỉ hỏi hệ thống có
> sập không, mà còn hỏi sau khi tải rút đi thì nó có trở về bình thường không
> và mất bao lâu.
>
> Kết quả: tỉ lệ p95 giai đoạn ba chia p95 giai đoạn một bằng đúng 1,00 —
> phục hồi hoàn toàn. Ngoài ra tôi kiểm cột allThreads trong file jtl và xác
> nhận JMeter thật sự khởi tạo đủ 60 thread trong 5 giây, nên rủi ro ramp quá
> nhanh đã được loại trừ bằng số liệu chứ không phải phỏng đoán."

### 2.4 Endurance — KHÔNG bắt buộc, nhưng nên có

**Đề bài không yêu cầu ảnh hay video cho endurance.** Ba yêu cầu nằm ở ba gạch đầu dòng riêng biệt:

| Dòng | Yêu cầu | Áp dụng cho |
| :-: | --- | --- |
| 133 | Ảnh chụp công cụ + resource monitor | *"Chạy **cả ba kịch bản**..."* → Load, Stress, Spike |
| 135 | Endurance / soak 10–15 phút | Chỉ yêu cầu *"báo cáo kèm số liệu cụ thể"* — **không** nhắc ảnh hay video |
| 137 | Video ≥ 6 phút | Không nêu kịch bản cụ thể, chỉ ràng buộc thời lượng + cùng khung hình |

**Vì sao vẫn nên quay ~60 giây cho endurance:** đây là chỗ có số liệu ấn tượng nhất (630 req/s, 567 174 sample, biểu đồ RAM đi ngang), và quan trọng hơn — nó **giải thích được vì sao ba kịch bản kia đều cho p95 = 3 ms**. Nếu chỉ quay ba kịch bản chính, người xem sẽ thấy ba lần "0% lỗi, 3 ms" mà không hiểu tại sao SUT nhàn đến vậy.

```powershell
jmeter -n -t 23127344_Endurance_20260814.jmx -Jvusers=50 -Jrampup=60 -Jduration=900 -l ..\results\demo_endurance.jtl
```

**Ảnh cần chụp:** 1 ảnh (tùy chọn) → `hw5\evidence\endurance\tool+monitor.png`

**Thuyết minh gợi ý (~60 giây):**

> "Ba kịch bản trên đều cho p95 bằng 3 mili-giây và 0 phần trăm lỗi, kể cả
> Stress ở 100 virtual user. Nguyên nhân là think time 11 giây rưỡi chi phối
> hoàn toàn — mỗi virtual user dành gần hết thời gian để chờ, nên 100 user
> chỉ tạo ra 22 request mỗi giây.
>
> Nên bài endurance này hạ think time xuống 50 đến 100 mili-giây, giữ nguyên
> 50 virtual user. Tải tăng khoảng 34 lần. Kết quả: 630 request mỗi giây, duy
> trì ổn định suốt 15 phút, p95 vẫn 3 mili-giây, 0 lỗi trên 567 nghìn sample.
> Bộ nhớ backend đi ngang ở mức 103 megabyte — không rò rỉ."

---

## Phần 3 — Kết video (~60 giây)

Mở HTML report và chỉ vào biểu đồ:

```powershell
start ..\reports\load\index.html
```

**Thuyết minh gợi ý:**

> "Đây là HTML report do JMeter sinh ra. Biểu đồ Response Times Over Time cho
> thấy đường cong phẳng suốt bài test. Bảng Statistics có đầy đủ p90, p95, p99
> và tỉ lệ lỗi.
>
> Toàn bộ số liệu trong báo cáo của tôi được tính trực tiếp từ file jtl thô
> bằng script `check_jtl.py` và `summarize_jtl.py`, không chép lại từ report
> này — để đảm bảo có thể truy nguyên."

---

## Phần 4 — Dọn dẹp và upload

### 4.1 Xóa file demo (KHÔNG commit)

```powershell
cd "c:\HCMUS\Software Testing\software-testing"
Remove-Item hw5\results\demo_*.jtl -ErrorAction SilentlyContinue
```

### 4.2 Upload video

1. Ghép các clip nếu quay rời (Clipchamp có sẵn trên Windows 11)
2. **Kiểm tra tổng thời lượng ≥ 6 phút**
3. Upload YouTube → đặt chế độ **Unlisted** (không phải Private — trợ giảng
   phải mở được link)
4. Copy link

### 4.3 Điền link vào báo cáo

Mở `hw5\Main_Report.md`, điền link vào **2 chỗ**:

| Dòng    | Nội dung cần thay `_<URL>_`                                                             |
| ------- | --------------------------------------------------------------------------------------- |
| **15**  | `\| Video demo (YouTube unlisted, ≥ 6 phút) \| _<URL>_ \|` — bảng thông tin đầu báo cáo |
| **835** | `\| Video demo YouTube unlisted (≥ 6 phút) \| _<URL>_ \| ☐ \|` — checklist §9           |

Tìm nhanh bằng lệnh:

```powershell
Select-String -Path hw5\Main_Report.md -Pattern "Video demo" | Select-Object LineNumber, Line
```

> Đây là video **khác** với video Agent Skill ở §6 (link `https://youtu.be/MJwC7o_ab_g`
> đã điền). Đừng nhầm hai cái.

---

## Phần 5 — GitHub Issue cho bug đã tìm được

Bạn đã có sẵn **1 bug thật** phát hiện từ đọc mã nguồn (§3.11).

**Nội dung issue:**

```
Tiêu đề: [BUG] POST /api/apply-coupon tính sai giảm giá theo phần trăm

Mô tả:
Endpoint tính discount_amount bằng công thức sai, khiến mã giảm giá loại
"percent" làm TĂNG số tiền thay vì giảm.

Bước tái hiện:
curl -X POST http://localhost:3000/api/apply-coupon \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","total_amount":500000,"user_id":3}'

Kết quả mong đợi: final_amount = 450000  (giảm 10% của 500000)
Kết quả thực tế : final_amount = 5000000 (gấp 10 lần)

Nguyên nhân (server.js:399-401):
  discount_amount = Math.floor(total_amount * (1 - coupon.discount_value))
  → 500000 * (1 - 10) = -4500000
  → final_amount = 500000 - (-4500000) = 5000000

Công thức đúng:
  discount_amount = Math.floor(total_amount * coupon.discount_value / 100)

Phạm vi ảnh hưởng: chỉ mã loại "percent". Mã loại "fixed" (BIGBUY, VIP100)
tính đúng.
```

Sau khi tạo issue:

1. Chụp màn hình → `hw5\evidence\issues\bug01_apply_coupon.png`
2. Copy URL issue → điền vào bảng §3.11 của `Main_Report.md`

---

## Checklist cuối cùng

Sau khi làm xong, kiểm tra bằng lệnh này ở **root folder**:

```powershell
cd "c:\HCMUS\Software Testing\software-testing"
Get-ChildItem hw5\evidence -Recurse -File | Select-Object FullName, Length
```

Phải thấy đủ:

**Bắt buộc:**

- [ ] `evidence\hardware\dxdiag.txt` ✅ (đã có)
- [ ] `evidence\hardware\dxdiag.png` ← Phần 1
- [ ] `evidence\load\tool+monitor.png` ← Phần 2.1
- [ ] `evidence\stress\tool+monitor_bac1.png` ← Phần 2.2
- [ ] `evidence\stress\tool+monitor_bac2.png` ← Phần 2.2
- [ ] `evidence\spike\tool+monitor_gd1.png` ← Phần 2.3
- [ ] `evidence\spike\tool+monitor_gd2.png` ← Phần 2.3
- [ ] `evidence\spike\tool+monitor_gd3.png` ← Phần 2.3
- [ ] `evidence\endurance\memory_trend.csv` ✅ (đã có)
- [ ] `evidence\issues\bug01_apply_coupon.png` ← Phần 5
- [ ] Link video điền vào 2 chỗ trong `Main_Report.md` ← Phần 4.3
- [ ] URL GitHub Issue điền vào §3.11 ← Phần 5

**Tùy chọn (không bắt buộc theo đề bài):**

- [ ] `evidence\endurance\tool+monitor.png` ← Phần 2.4

**Hai thư mục để trống là hợp lệ:**

- `evidence\lockout\` — cơ chế khóa tài khoản không kích hoạt lần nào vì mọi
  request đăng nhập đều dùng mật khẩu đúng (giải thích ở §3.8). Đề bài dòng 133
  chỉ yêu cầu tài liệu hóa quy trình reset **khi** lockout bị kích hoạt.
- `evidence\endurance\` — chỉ cần `memory_trend.csv` đã có; ảnh là tùy chọn.

Cuối cùng, commit:

```powershell
git add hw5\evidence hw5\Main_Report.md
git commit -m "docs(hw5): thêm ảnh chụp evidence và link video demo"
```
