# HW04 — Automation Testing — Báo cáo chính

> **Template nộp bài.** Mọi ô `[...]`, `TBD`, và dòng ghi chú dạng `> 💡` là chỗ cần điền/xóa trước khi nộp.
> Nguyên tắc bắt buộc của đề bài: **không được bịa** số liệu thực thi, ảnh chụp, báo cáo HTML hay timestamp. Chỉ điền những gì thật sự đã chạy.

## 0. Thông tin sinh viên

| Trường              | Giá trị                                                                             |
| ------------------- | ----------------------------------------------------------------------------------- |
| Họ tên              | [Họ tên]                                                                            |
| MSSV                | [MSSV]                                                                              |
| Lớp / Nhóm          | [Lớp]                                                                               |
| Assignment          | HW04 — Automation Testing (HW04-AI)                                                 |
| Ngày nộp            | [dd/mm/2026]                                                                        |
| Self-Assessed Grade | **[000–100]** / 100 (chi tiết từng tiêu chí: [`README.md`](README.md))              |
| SUT                 | EShop — `https://github.com/ttbhanh/eshop-sut` (bản dùng chung, tương ứng `eshop-sut`) |
| GitHub repo (public) | [link repo chứa scripts + data + HTML reports]                                     |
| GitHub Issues       | [link trang Issues]                                                                 |
| 📹 Video demo (Task 2) | [YouTube unlisted link — ≥5 phút, thuyết minh tiếng Việt]                        |
| 📹 Video demo Agent Skill | [YouTube link]                                                                 |

**Công cụ đã dùng:** [AI tool: Claude / ChatGPT / Copilot / ...] · **Selenium 4+** (TypeScript + Mocha + Chai) · **mochawesome** (HTML reporter).

> 💡 Đề bài cho phép Playwright (khuyến khích) **hoặc** Selenium 4+; và Allure **hoặc** Playwright HTML reporter. Template này viết theo hướng **Selenium + mochawesome** (khớp Agent Skill `selenium-automation` ở §Task 3). Nếu đổi công cụ, sửa lại toàn bộ các mục liên quan.

---

## 1. Phạm vi lựa chọn (Feature Selection)

> Theo §5 đề bài: tự động hóa **đúng 3 feature web** đã chọn ở HW02 — mỗi Pool A/B/C một feature. **Pool D (mobile) không dùng** ở bài này vì HW04 chỉ tự động hóa web frontend.

| Feature   | Pool | FR ID | Tên feature                 | Màn hình / route                              | Số TC tự động hóa |
| --------- | ---- | ----- | --------------------------- | --------------------------------------------- | ----------------- |
| Feature A | A    | FR-04 | Personal profile management | `frontend-web` `/profile`                     | [n ≥ 12]          |
| Feature B | B    | FR-08 | Checkout                    | `frontend-web` `/checkout`                    | [n ≥ 12]          |
| Feature C | C    | FR-18 | Order management (admin)    | `frontend-admin` (tab **Đơn hàng**, port 5174) | [n ≥ 12]          |

**Nguồn lựa chọn:** kế thừa từ HW02 ([`../hw2/README.md`](../hw2/README.md)) — không trùng với thành viên khác trong nhóm.

> 💡 Nếu **chưa làm HW02**: xóa dòng trên, tự khai báo 3 feature Pool A–C ngay tại đây và **nêu rõ lý do HW02 không có** (yêu cầu §5).

**Môi trường thực thi:**

| Thành phần    | Giá trị                                            |
| ------------- | -------------------------------------------------- |
| OS            | [Windows 11 / macOS / Linux]                       |
| Backend API   | `http://localhost:3000`                            |
| Customer web  | `http://localhost:5173`                            |
| Admin web     | `http://localhost:5174`                            |
| Trình duyệt   | Chrome [ver] · Edge [ver] · Firefox [ver]          |
| Node.js       | [ver]                                              |
| Selenium      | [ver]                                              |
| Tài khoản test | user `[email]` · admin `admin@eshop.com`          |

> 💡 Selenium không chạy được WebKit (đó là engine của Playwright). Đề bài chấp nhận bộ **Chrome / Edge / Firefox** — nêu rõ điều này thay vì thay thầm.

---

# TASK 1 — AI-generated automation scripts

> Trọng số: 25 + 25 + 25 = **75/100** (mỗi feature 25 điểm).

## 1.1 Nguồn tham chiếu đã đọc

> 💡 Liệt kê tài liệu đã đọc **trước khi** sinh script — đây là căn cứ để assert theo đặc tả chứ không theo hành vi lỗi hiện tại của SUT.

| Nguồn                                     | Nội dung liên quan                                         |
| ----------------------------------------- | ---------------------------------------------------------- |
| `eshop-sut/README.md` (SRS) §[..] FR-04   | [Quy tắc nghiệp vụ hồ sơ cá nhân: định dạng SĐT, ...]      |
| `eshop-sut/README.md` (SRS) §[..] FR-08   | [Quy tắc checkout: tính tổng, coupon, ...]                 |
| `eshop-sut/README.md` (SRS) §[..] FR-18   | [Quy tắc quản lý đơn hàng admin + FR-10 state machine]     |
| `eshop-sut/api_specification.md`          | [Endpoint dùng cho seed dữ liệu và assertion đối chiếu API] |
| `eshop-sut/setup_guide.md`                | Cổng dịch vụ, tài khoản admin mặc định                     |
| `frontend-web/src/pages/Profile.jsx`      | DOM thật của màn hình hồ sơ                                |
| `frontend-web/src/pages/Checkout.jsx`     | DOM thật của màn hình thanh toán                           |
| `frontend-admin/src/App.jsx`              | DOM thật của admin (SPA dạng tab, không có router)         |
| Test case HW02                            | [Bảng TC gốc — mỗi TC ID thành 1 `it()`]                   |

## 1.2 Chiến lược AI-First — sinh script theo từng bước

> Yêu cầu §6 Task 1: **không** dùng một prompt chung chung kiểu "viết hết script cho feature này". Phải dẫn dắt AI theo từng bước như kỹ thuật đã học.
> Log đầy đủ (verbatim prompt + output) nằm ở [`[AI-02] - AI Audit Report`](<[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md>). Dưới đây tóm tắt các bước để báo cáo liền mạch.

| Bước | Mục tiêu của bước                                                | Prompt (tóm tắt)                                                | Output AI (tóm tắt)                     | Ghi chú review nhanh   |
| ---- | ---------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------- | ---------------------- |
| B1   | Thiết lập khung dự án (config, driver factory, data loader)      | [prompt]                                                        | [output]                                | [đã sửa gì]            |
| B2   | Chuyển bảng TC HW02 → file dữ liệu JSON (chưa viết code test)    | [prompt]                                                        | [output]                                | [đã sửa gì]            |
| B3   | Sinh spec cho từng nhóm TC positive                              | [prompt]                                                        | [output]                                | [đã sửa gì]            |
| B4   | Sinh spec cho nhóm TC negative                                   | [prompt]                                                        | [output]                                | [đã sửa gì]            |
| B5   | Bổ sung nhóm TC edge / boundary                                  | [prompt]                                                        | [output]                                | [đã sửa gì]            |
| B6   | Thêm assertion đối chiếu API (persistence)                       | [prompt]                                                        | [output]                                | [đã sửa gì]            |
| B7   | Cấu hình đa trình duyệt + metadata báo cáo `Run by:`             | [prompt]                                                        | [output]                                | [đã sửa gì]            |
| B8   | Sửa lỗi sau lần chạy thật đầu tiên                               | [prompt]                                                        | [output]                                | [đã sửa gì]            |

> 💡 Thêm/bớt dòng theo thực tế. Mỗi dòng ở đây phải khớp một artifact trong AI Audit Report.

## 1.3 Cấu trúc dự án automation

```text
selenium/
  .env.example            # STUDENT_ID, WEB_URL, ADMIN_URL, BROWSERS, ...
  .mocharc.json
  package.json
  data/
    fr04-profile.data.json      # [n] test case
    fr08-checkout.data.json     # [n] test case
    fr18-admin-orders.data.json # [n] test case
  tests/
    fr04-profile.spec.ts
    fr08-checkout.spec.ts
    fr18-admin-orders.spec.ts
  utils/
    config.ts  driver.ts  dataLoader.ts  alerts.ts  reportMetadata.ts  bugReporter.ts  api.ts
  reports/
    fr04-profile/{chrome,edge,firefox}.html
    fr08-checkout/{chrome,edge,firefox}.html
    fr18-admin-orders/{chrome,edge,firefox}.html
  bug-snapshots/
    BUGS.md  <TC-ID>.png
```

**Cách chạy lại (reproducible):**

```bash
cd selenium
npm install
cp .env.example .env          # điền STUDENT_ID, STUDENT_NAME, URL, tài khoản
npm run typecheck
npm run test:all-browsers     # chạy 3 feature × 3 browser = 9 lượt
```

## 1.4 Data-driven — dữ liệu tách rời khỏi script

> Yêu cầu §6: dữ liệu test **phải** nằm ở file `.csv`/`.json` riêng. Mảng/đối tượng hardcode trong script **không được chấp nhận**.

| Feature | File dữ liệu                       | Định dạng | Số case | Positive | Negative | Edge |
| ------- | ---------------------------------- | --------- | ------- | -------- | -------- | ---- |
| FR-04   | `data/fr04-profile.data.json`      | JSON      | [n]     | [n]      | [n]      | [n]  |
| FR-08   | `data/fr08-checkout.data.json`     | JSON      | [n]     | [n]      | [n]      | [n]  |
| FR-18   | `data/fr18-admin-orders.data.json` | JSON      | [n]     | [n]      | [n]      | [n]  |
| **Tổng** |                                   |           | **[≥36]** | **[n]** | **[n]** | **[n]** |

**Ví dụ một case trong file dữ liệu:**

```json
{
  "tcId": "TC-PROFILE-01",
  "title": "[Tiêu đề TC]",
  "type": "positive",
  "input":    { "...": "..." },
  "expected": { "...": "..." }
}
```

Spec **duyệt** mảng này (`for (const c of cases) it(...)`), không viết cứng từng `it()` với dữ liệu literal.

## 1.5 Assertion patterns

> Yêu cầu §6: mỗi feature dùng **≥ 3 assertion pattern khác biệt**. "Khác biệt" nghĩa là khác loại bằng chứng, không phải 3 lần `assert.equal`.

| # | Pattern                              | Mô tả                                                        | Dùng ở FR-04 | FR-08 | FR-18 | Ví dụ TC |
| - | ------------------------------------ | ------------------------------------------------------------ | ------------ | ----- | ----- | -------- |
| 1 | UI state / text                      | Kiểm thông báo, giá trị field, sự hiện diện của phần tử       | [✓]          | [✓]   | [✓]   | [TC-ID]  |
| 2 | Persistence / API cross-check        | Sau thao tác UI, gọi API xác nhận dữ liệu **thật sự** đã đổi  | [✓]          | [✓]   | [✓]   | [TC-ID]  |
| 3 | Negative / rejection                 | Input sai phải bị từ chối: có lỗi, không điều hướng, không tạo bản ghi | [✓]  | [✓]   | [✓]   | [TC-ID]  |
| 4 | Structural / data integrity          | Tổng tiền = Σ line items − giảm giá; trạng thái đơn đúng state machine | [ ]  | [✓]   | [✓]   | [TC-ID]  |
| 5 | Security behaviour                   | Token non-admin bị chặn 401/403; payload XSS render dạng text | [ ]          | [ ]   | [✓]   | [TC-ID]  |

## 1.6 Kết quả thực thi đa trình duyệt

> Yêu cầu §6: mỗi feature chạy trên **cả 3 trình duyệt** → **≥ 9 lượt chạy**. Mỗi lượt sinh 1 báo cáo HTML hiển thị rõ `Run by: {MSSV}` + ISO timestamp.

### Bảng tổng hợp 9 lượt chạy

| # | Feature | Browser | Tổng TC | Pass | Fail | Skip | Thời lượng | ISO timestamp | Báo cáo HTML |
| - | ------- | ------- | ------- | ---- | ---- | ---- | ---------- | ------------- | ------------ |
| 1 | FR-04   | Chrome  | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`reports/fr04-profile/chrome.html`](selenium/reports/fr04-profile/chrome.html)   |
| 2 | FR-04   | Edge    | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`.../edge.html`](selenium/reports/fr04-profile/edge.html)                        |
| 3 | FR-04   | Firefox | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`.../firefox.html`](selenium/reports/fr04-profile/firefox.html)                  |
| 4 | FR-08   | Chrome  | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`reports/fr08-checkout/chrome.html`](selenium/reports/fr08-checkout/chrome.html) |
| 5 | FR-08   | Edge    | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`.../edge.html`](selenium/reports/fr08-checkout/edge.html)                       |
| 6 | FR-08   | Firefox | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`.../firefox.html`](selenium/reports/fr08-checkout/firefox.html)                 |
| 7 | FR-18   | Chrome  | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`reports/fr18-admin-orders/chrome.html`](selenium/reports/fr18-admin-orders/chrome.html) |
| 8 | FR-18   | Edge    | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`.../edge.html`](selenium/reports/fr18-admin-orders/edge.html)                   |
| 9 | FR-18   | Firefox | [n]     | [n]  | [n]  | [n]  | [s]        | [ISO]         | [`.../firefox.html`](selenium/reports/fr18-admin-orders/firefox.html)             |
|   | **Tổng** |        | **[n]** | **[n]** | **[n]** | **[n]** |       |               | **9 báo cáo**                                                                     |

**Bằng chứng metadata:** mỗi file HTML chứa banner hiển thị trực tiếp khi mở bằng trình duyệt:

```text
Run by: [MSSV]
Student: [Họ tên]
Feature: [feature]
Browser: [chrome|edge|firefox]
Timestamp: [ISO 8601]
```

> 💡 Ảnh chụp banner của ít nhất 1 báo cáo: `![](screenshot/report-runby.png)`

### Khác biệt giữa các trình duyệt

| TC ID   | Chrome | Edge | Firefox | Nhận xét                                                   |
| ------- | ------ | ---- | ------- | ---------------------------------------------------------- |
| [TC-ID] | [P/F]  | [P/F] | [P/F]  | [Lỗi chỉ xảy ra trên 1 engine = phát hiện riêng, cần ghi nhận] |

> 💡 Nếu cả 9 lượt cho kết quả giống hệt nhau, ghi rõ "không có khác biệt giữa các trình duyệt" — đó cũng là một kết luận hợp lệ.

## 1.7 Human review — AI sai/thiếu ở đâu và vì sao

> Yêu cầu §6: phải chỉ ra AI **sai gì / bỏ sót gì** (selector mong manh, assertion yếu hoặc thiếu, thiếu edge case, wait dễ flaky) và **giải thích vì sao** (chất lượng prompt / giới hạn mô hình / đặc thù feature). Đây là phần chấm điểm nặng, không phải thủ tục.

| #  | AI sinh ra gì                                          | Sai/thiếu ở chỗ nào                                     | Cách em sửa                                | Nguyên nhân gốc                  |
| -- | ------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------ | -------------------------------- |
| 1  | [VD: selector `[data-testid="profile-name"]`]          | [SUT không hề có `data-testid` nào]                       | [Đổi sang `input[placeholder="..."]`]      | [Giới hạn mô hình — suy từ template chung] |
| 2  | [VD: `driver.sleep(3000)` trước khi đọc bảng]          | [Wait cứng → flaky, chậm]                                 | [`driver.wait(until.elementLocated(...))`] | [Chất lượng prompt — chưa cấm sleep] |
| 3  | [VD: không xử lý `alert()` của Profile/Admin]          | [`UnexpectedAlertOpenError`, đổ vỡ dây chuyền cả file]    | [Bọc `actAndReadAlert()` + dismiss `afterEach`] | [Đặc thù feature — AI không biết SUT dùng alert] |
| 4  | [VD: assert theo hành vi lỗi hiện tại của SUT]         | [Bug thật bị "hợp thức hóa" thành expected → mất phát hiện] | [Sửa expected theo SRS, giữ test FAIL]     | [Chất lượng prompt — cấp code thay vì đặc tả] |
| 5  | [VD: dữ liệu test hardcode trong spec]                 | [Vi phạm yêu cầu data-driven]                             | [Tách ra `data/*.data.json`]               | [Chất lượng prompt]              |
| 6  | [VD: điều hướng admin bằng URL `/admin/orders`]        | [Admin là SPA dạng tab, route đó không tồn tại]           | [Click tab + chờ bảng render]              | [Đặc thù feature]                |
| 7  | [VD: thiếu hẳn nhóm boundary/edge]                     | [Chỉ sinh happy path]                                     | [Bổ sung [n] case biên]                    | [Giới hạn mô hình]               |
| 8  | [VD: không re-locate element sau khi React re-render]  | [`StaleElementReferenceError`]                            | [Tìm lại element sau mỗi thay đổi state]   | [Giới hạn mô hình]               |

> **Nhận xét tổng hợp:** [2–4 câu: phần lớn thiếu sót đến từ đâu, rút ra quy tắc gì khi prompt lần sau.]

## 1.8 Test case không tự động hóa được

> Yêu cầu §6: phải liệt kê và giải thích.

| TC ID   | Feature | Nội dung           | Lý do không tự động hóa được                                | Cách kiểm thay thế |
| ------- | ------- | ------------------ | ------------------------------------------------------------- | ------------------ |
| [TC-ID] | [FR-..] | [Mô tả]            | [VD: cần nhận email thật ở bước reset mật khẩu 2 bước]        | [Manual]           |
| [TC-ID] | [FR-..] | [Mô tả]            | [VD: phụ thuộc cổng thanh toán ngoài / CAPTCHA]               | [Manual]           |

> 💡 Nếu tự động hóa được 100%, ghi rõ "Không có TC nào phải bỏ" thay vì xóa mục này.

## 1.9 Bug report

> Yêu cầu §6: chỗ nào assertion fail mà lộ ra defect thật → ghi bug **cả trong báo cáo Markdown lẫn trên GitHub Issues**, mỗi issue **kèm ảnh chụp**.

### Phân loại kết quả FAIL

| Loại                                    | Số lượng | Xử lý                                              |
| --------------------------------------- | -------- | -------------------------------------------------- |
| Lỗi script (selector/wait/expected sai)  | [n]      | Đã sửa script, chạy lại → PASS                     |
| **Defect thật của SUT**                 | [n]      | **Giữ nguyên test FAIL** làm bằng chứng, log bug   |

> 💡 Tuyệt đối không nới lỏng assertion để test xanh — làm vậy là xóa mất bằng chứng mà đề bài đang chấm.

### Danh sách bug

| Bug ID  | TC ID   | Feature | Mức độ | Mô tả ngắn | Expected (trích SRS) | Actual | Browser bị ảnh hưởng | Ảnh chụp | GitHub Issue |
| ------- | ------- | ------- | ------ | ---------- | -------------------- | ------ | -------------------- | -------- | ------------ |
| BUG-01  | [TC-ID] | [FR-..] | [High] | [...]      | [SRS §..: ...]       | [...]  | [All / chỉ Firefox]  | [`bug-snapshots/[TC-ID].png`](selenium/bug-snapshots/) | [#n](link) |
| BUG-02  |         |         |        |            |                      |        |                      |          |              |

Chi tiết đầy đủ: [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md).

> 💡 Nếu không phát hiện bug nào, ghi rõ "Không phát hiện defect nào trong phạm vi 3 feature" — nhưng lưu ý SUT này **được cố ý cài lỗi sẵn**, nên kết quả 0 bug thường có nghĩa assertion còn quá yếu.

---

# TASK 2 — Demo video

> Trọng số: **15/100**.

| Hạng mục                        | Giá trị                                                  |
| ------------------------------- | -------------------------------------------------------- |
| Link YouTube (unlisted)         | [link]                                                   |
| Thời lượng                      | [mm:ss] (yêu cầu **≥ 5 phút**)                           |
| Ngôn ngữ thuyết minh            | Tiếng Việt (giọng thật của sinh viên)                    |
| Feature được demo               | [FR-..]                                                  |
| Bằng chứng tác giả              | [face-cam] / [terminal chạy `whoami` và `hostname`]      |

**Nội dung đã trình bày trong video:**

| Mốc thời gian | Nội dung                                                        |
| ------------- | ---------------------------------------------------------------- |
| [00:00]       | Giới thiệu + bằng chứng tác giả (`whoami`, `hostname` / face-cam) |
| [00:00]       | Giới thiệu cấu trúc dự án, file dữ liệu tách rời                 |
| [00:00]       | Chạy script end-to-end trên trình duyệt 1                        |
| [00:00]       | Chạy đa trình duyệt (3 browser)                                  |
| [00:00]       | Mở báo cáo HTML, chỉ rõ dòng `Run by: [MSSV]` + timestamp        |
| [00:00]       | **Giải thích ≥ 1 lỗi em đã sửa trong script AI sinh** (bắt buộc) |
| [00:00]       | Kết luận                                                         |

**Lỗi AI đã được thuyết minh trong video:** [mô tả ngắn — nên trỏ về một dòng cụ thể ở bảng §1.7].

> 💡 §11 Anti-AI-Cheat: video **phải** có giọng thật và face-cam hoặc terminal `whoami`/`hostname`. Thiếu là mất điểm toàn phần mục này.

---

# TASK 3 — Agent Skill

> Trọng số: **10/100**. Đề bài §7: khuyến khích xây Agent Skill đóng gói quy trình automation (data-driven, đa trình duyệt) để tái sử dụng cho các feature sau; nộp kèm video demo end-to-end.

| Hạng mục            | Giá trị                                                             |
| ------------------- | ------------------------------------------------------------------- |
| Tên skill           | `selenium-automation`                                               |
| Vị trí              | [`skills/selenium-automation/`](skills/selenium-automation/)        |
| Video demo          | [YouTube link]                                                      |
| Feature dùng để demo | [FR-..]                                                            |

**Cấu trúc skill:**

| File                                | Vai trò                                                              |
| ----------------------------------- | -------------------------------------------------------------------- |
| `SKILL.md`                          | Ràng buộc HW04, quy trình 9 bước, verification gate                  |
| `references/project-scaffold.md`    | Code mẫu: config, driver factory, data loader, alert helper, report metadata, bug reporter |
| `references/review-checklist.md`    | Checklist review thủ công output của AI (10 nhóm)                    |
| `references/eshop-notes.md`         | Ghi chú selector/hành vi thật của EShop theo từng feature            |

**Skill tự động hóa những gì:** [liệt kê — VD: dựng khung dự án, ép ≥12 case/feature ngay ở tầng loader, chuẩn hóa tên file báo cáo theo browser, chèn banner `Run by:`, thu thập ảnh chụp bug.]

**Đã dùng lại được ở đâu:** [VD: áp dụng cho cả 3 feature; ước lượng thời gian tiết kiệm].

---

# 4. Tổng kết kiểm thử (Test Summary)

> Số liệu này lặp lại trong [`README.md`](README.md) theo yêu cầu §14.

| Chỉ số                          | Giá trị     |
| ------------------------------- | ----------- |
| Số feature tự động hóa          | 3           |
| Số test case tự động hóa        | [≥36]       |
| Số test case đã thực thi        | [n]         |
| Số test case PASS               | [n]         |
| Số test case FAIL               | [n]         |
| Số lượt chạy trình duyệt        | [≥9]        |
| Số báo cáo HTML                 | [9]         |
| Số bug phát hiện                | [n]         |
| Số GitHub Issue đã tạo          | [n]         |
| Số TC không tự động hóa được    | [n]         |
| Link video demo                 | [link]      |

---

# 5. Git commit log

> Yêu cầu §12: repo public, **≥ 8 commit trong ≥ 4 ngày khác nhau**. **Chỉ commit có thay đổi file test script** (`.spec.ts` / `.spec.js` hoặc tương đương) mới được tính; commit chỉ sửa README/PDF/tài liệu **không tính**.

| Chỉ số                             | Giá trị                    |
| ---------------------------------- | -------------------------- |
| Repo public                        | [link]                     |
| Tổng số commit                     | [n]                        |
| Số commit **có đụng file test**    | [n ≥ 8]                    |
| Số ngày khác nhau có commit test   | [n ≥ 4]                    |
| Khoảng thời gian                   | [dd/mm] – [dd/mm]          |
| File log                           | [`git_commit_log.txt`](git_commit_log.txt) |

Lệnh sinh log:

```bash
git log --pretty=format:"%h | %ad | %an | %s" --date=iso -- "*.spec.ts" > git_commit_log.txt
```

---

# 6. Tự đánh giá (Self-Assessment)

| No. | Tiêu chí                 | Điểm tối đa | Tự chấm | Căn cứ                                    |
| --- | ------------------------ | ----------- | ------- | ----------------------------------------- |
| 1   | Task 1 — Feature A (FR-04) | 25        | [n]     | [§1.4–1.9, 3 báo cáo HTML, n bug]         |
| 2   | Task 1 — Feature B (FR-08) | 25        | [n]     | [...]                                     |
| 3   | Task 1 — Feature C (FR-18) | 25        | [n]     | [...]                                     |
| 4   | Task 2 — Demo video        | 15        | [n]     | [link, thời lượng, bằng chứng tác giả]    |
| 5   | Agent Skill                | 10        | [n]     | [skill + video demo]                      |
|     | **Tổng**                   | **100**   | **[n]** |                                           |

---

# 7. Phụ lục

| Tài liệu                                                                        | Nội dung                                        |
| ------------------------------------------------------------------------------- | ----------------------------------------------- |
| [`[AI-02] - AI Audit Report`](<[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md>)  | **Phụ lục bắt buộc** — log toàn bộ tương tác AI |
| [`AI_Critique.md`](AI_Critique.md)                                              | **Bắt buộc** — 200–300 từ phê bình AI           |
| [`README.md`](README.md)                                                        | Bảng tự đánh giá + test summary                 |
| [`git_commit_log.txt`](git_commit_log.txt)                                      | Log commit                                      |
| [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md)              | Bug report chi tiết                             |
| [`skills/selenium-automation/`](skills/selenium-automation/)                     | Agent Skill                                     |

## 7.1 Checklist trước khi nộp

- [ ] 3 feature đúng Pool A / B / C, khớp HW02 (hoặc đã giải trình)
- [ ] ≥ 12 TC tự động hóa **mỗi** feature (≥ 36 tổng)
- [ ] Dữ liệu test nằm ở file `.json`/`.csv` riêng — không hardcode trong spec
- [ ] ≥ 3 assertion pattern khác biệt mỗi feature
- [ ] 9 file báo cáo HTML tồn tại **đồng thời**, không đè lên nhau
- [ ] Mọi báo cáo hiển thị `Run by: [MSSV]` + ISO timestamp khi mở bằng trình duyệt
- [ ] Bảng phân tích AI sai/thiếu (§1.7) đã điền, có nguyên nhân gốc
- [ ] Danh sách TC không tự động hóa được (§1.8) đã điền
- [ ] Bug đã log **cả** trong Markdown **và** GitHub Issues, mỗi issue có ảnh
- [ ] Video ≥ 5 phút, tiếng Việt, có `whoami`/`hostname` hoặc face-cam, có giải thích 1 lỗi đã sửa
- [ ] Agent Skill + video demo skill
- [ ] AI Audit Report + AI Critique (200–300 từ), cả `.md` và `.pdf`
- [ ] ≥ 8 commit đụng file test, trải ≥ 4 ngày
- [ ] `README.md` có bảng tự đánh giá + test summary
- [ ] Tên file zip: `[MSSV]_HW04_AI_Automation_[000-100].zip`

> ⚠️ §17: nộp trễ không được chấp nhận; **thiếu bất kỳ tài liệu bắt buộc nào → 0 điểm**; sao chép giữa sinh viên (kể cả prompt) → 0 điểm cho cả hai bên.
