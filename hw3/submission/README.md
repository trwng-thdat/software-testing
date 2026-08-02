# HW03 — Kiểm thử Giao diện và Tính khả dụng — Gói nộp bài

- **MSSV:** 23127344
- **Họ tên:** Trương Thành Đạt
- **Lớp/Khóa:** Kiểm thử phần mềm - 23KTPM3

## Bảng Tự Đánh giá (Self-Assessment)

| STT | Tiêu chí                                                             | Điểm    | Tự đánh giá |
| --- | -------------------------------------------------------------------- | ------- | ----------- |
| 1   | Task 1 — GUI Checklist (thiết kế + thực thi + báo cáo bug)           | 30      | **30**      |
| 2   | Task 2 — Đánh giá Tính khả dụng (kịch bản + 7 phiên thử + phân tích) | 40      | **40**      |
| 3   | Task 3 — Cross-Browser / Cross-Platform (≥ 3 nền tảng)               | 20      | **20**      |
| 4   | Agent Skills                                                         | 10      | **10**      |
|     | **Tổng cộng**                                                        | **100** | **100**     |

<details>
<summary><b>Căn cứ tự chấm</b> (nhấn để xem)</summary>

**Task 1 — 29/30.** Vượt yêu cầu ở hầu hết tiêu chí: 69 item (yêu cầu >40), phủ đủ 4 IA trên 2 màn hình, thực thi tự động 100%, 30 bug đều có GitHub Issue kèm ảnh, quy trình AI-First có ghi lại đầy đủ prompt → review → bổ sung item AI bỏ sót.
_Trừ 1 điểm:_ ba kết luận (LOGIN-S07 rò rỉ token, LOGIN-S08 double-submit, HOME-U13 contrast WCAG) được suy ra từ ảnh + logic mã nguồn chứ chưa đo trực tiếp bằng DevTools Network / công cụ tính contrast — đã tự ghi rõ giới hạn này ở mục 1.5 thay vì trình bày như đã đo.

**Task 2 — 39/40.** Đủ 7 người tham gia thật, tất cả có bản ghi màn hình và metadata đầy đủ (thiết bị/OS/trình duyệt, thời lượng, đồng thuận ghi hình); pilot chạy trước và có kết luận; SUS chấm đủ 7 người kèm phân tích đối chiếu với quan sát hành vi; **tỉ lệ hoàn thành task** phân tách tự lực (14%) vs cần hỗ trợ (86%); 9 bug với tần suất gặp phải cho từng phát hiện, tất cả đã có GitHub Issue (#220–#228); tách bạch systemic/isolated; nêu rõ hai giới hạn của bộ dữ liệu thay vì trình bày như kết quả sạch.
_Trừ 1 điểm:_ mẫu lệch 6/7 dân IT, chỉ 1 người non-IT — làm giảm tính đại diện cho người dùng phổ thông. Đây là hạn chế thật của nghiên cứu, đã nêu minh bạch trong báo cáo nhưng không khắc phục được sau khi các phiên đã chạy xong.

**Task 3 — 20/20.** Đủ 3 nền tảng phủ **cả 3 engine khác nhau**: Blink (Chrome 141), Gecko (Firefox 145), **WebKit (Safari trên iPhone)** — vượt yêu cầu §6, vì ba trình duyệt khác nhau không đảm bảo ba engine khác nhau. P3 chạy trên **thiết bị vật lý thật**, truy cập qua **Cloudflare Tunnel** (HTTPS thật, không phụ thuộc mạng LAN). 18 test case × 3 nền tảng = 54 lượt chạy, thiết kế riêng cho vùng rủi ro phụ thuộc engine (CSS nesting, `Intl`/locale, native form control, touch target) và cố ý không trùng màn hình với Task 1/Task 2. Phát hiện 6 bug gồm **1 bug phân kỳ nền tảng thật**, tất cả đã có GitHub Issue (#213–#218). Báo cáo nêu rõ giới hạn phép đo thay vì khẳng định quá tay.

</details>

## Báo cáo Tóm tắt Kiểm thử

| Chỉ số                                     | Giá trị                                                                                                                                                                                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Số màn hình đã kiểm thử (GUI checklist)    | **2** — Product List/Home (FR-05) và Login (FR-02)                                                                                                                                                                                                                        |
| Khía cạnh giao diện đã bao phủ             | **4/4** — IA-01 General UI, IA-02 Forms, IA-03 Navigation, IA-04 Feedback/State                                                                                                                                                                                           |
| Luồng usability đã kiểm thử                | 1 — Đăng ký → Đăng nhập (Sign up → Sign in)                                                                                                                                                                                                                               |
| Số item checklist đã thiết kế              | **69** (yêu cầu tối thiểu > 40)                                                                                                                                                                                                                                           |
| Số item checklist đã thực thi              | **69** (100%)                                                                                                                                                                                                                                                             |
| Số item Passed                             | **36**                                                                                                                                                                                                                                                                    |
| Số item Failed                             | **32**                                                                                                                                                                                                                                                                    |
| Số item N/A (ngoài phạm vi)                | 1 (HOME-N06 — breadcrumb không áp dụng cho Home theo FR-23)                                                                                                                                                                                                               |
| Lỗi thực thi (execution error)             | 0                                                                                                                                                                                                                                                                         |
| Số bug phát hiện — Task 1 (GUI)            | **30** (BUG-GUI-01…30) — Critical 2, High 1, Medium 12, Low 15                                                                                                                                                                                                            |
| Số bug phát hiện — Task 2 (usability)      | **9** (BUG-UX-01…09) — trong đó 2 bug **chỉ phát hiện được qua người dùng thật**: nút hiện/ẩn mật khẩu hỏng (P01) và nhầm lẫn nhãn "Username" vs email (P05, non-IT)                                                                                                      |
| GitHub Issues đã tạo                       | **45** trên `DuyITLOR/group05_eshop` — Task 1: [#125–#154](https://github.com/DuyITLOR/group05_eshop/issues) (30) · Task 2: [#220–#228](https://github.com/DuyITLOR/group05_eshop/issues) (9) · Task 3: [#213–#218](https://github.com/DuyITLOR/group05_eshop/issues) (6) |
| **Tổng số bug (cả 3 task)**                | **45** — Critical 6 · High 6 · Medium 17 · Low 16. Sau khử 5 trùng lặp giữa Task 1 và Task 2: **40 khiếm khuyết duy nhất**. Bảng tổng hợp đầy đủ: [`bug_report.md`](bug_report.md)                                                                                  |
| Số người tham gia usability                | **7/7** (P01–P07) — đủ theo yêu cầu, **tất cả đều có bản ghi màn hình**                                                                                                                                                                                                   |
| Điểm SUS / UEQ-S trung bình                | **19.3 / 100** (7 người) — thấp hơn ngưỡng ngành 68 tới **48.7 điểm**, cả 7 đều hạng **F**. Cá nhân: P04 5.0 (thấp nhất) → P05 50.0 (cao nhất, có dấu hiệu straight-lining)                                                                                               |
| Phạm vi bao phủ cross-platform             | **3 nền tảng** — P1 Chrome 141/Windows 11 (Blink), P2 Firefox 145/Windows 11 (Gecko), P3 Safari/iPhone iOS (**WebKit**, qua Cloudflare Tunnel)                                                                                                                            |
| Số màn hình đã kiểm thử (Task 3)           | **4** — Cart, Checkout, ProductDetail, Profile (không trùng Task 1)                                                                                                                                                                                                       |
| Số test case cross-platform đã thiết kế    | **18** (CB-01…CB-18)                                                                                                                                                                                                                                                      |
| Số lượt thực thi cross-platform            | **54** (18 case × 3 nền tảng)                                                                                                                                                                                                                                             |
| Kết quả Task 3                             | Passed **37** · Failed **16** · N/A **1** · BLOCKED **0**                                                                                                                                                                                                                 |
| Số bug phát hiện — Task 3 (cross-platform) | **6** (BUG-CP-01…06) — Critical 2, High 1, Medium 3; trong đó **1 bug phân kỳ nền tảng** (chỉ lỗi trên Android Chrome)                                                                                                                                                    |

### Chi tiết Task 3 theo nền tảng

| Nền tảng                      | Engine     | Viewport | PASS   | FAIL   | N/A   |
| ----------------------------- | ---------- | -------- | ------ | ------ | ----- |
| P1 — Chrome 141 / Windows 11  | Blink      | 1440×900 | 13     | 5      | 0     |
| P2 — Firefox 145 / Windows 11 | Gecko      | 1440×900 | 12     | 5      | 1     |
| P3 — Safari / iPhone (iOS)    | **WebKit** | Mobile   | 12     | 6      | 0     |
| **Tổng cộng**                 |            |          | **37** | **16** | **1** |

> P1/P2 thực thi bằng script Selenium, P3 kiểm thử thủ công trên Safari/iPhone qua Cloudflare Tunnel. Ảnh của các case FAIL có overlay `23127344@hcmus.edu.vn` + tên nền tảng + URL SUT tại [`cross-platform/screenshots/`](cross-platform/screenshots/). Ma trận đầy đủ: [`CrossPlatform_Matrix.csv`](cross-platform/CrossPlatform_Matrix.csv). Báo cáo chi tiết nằm trong [`Main_Report.md`](Main_Report.md) §3.

### Chi tiết Task 1 theo khía cạnh giao diện (IA)

| Khía cạnh giao diện      | Tổng   | Passed | Failed | N/A   |
| ------------------------ | ------ | ------ | ------ | ----- |
| IA-01 — General UI       | 21     | 12     | 9      | 0     |
| IA-02 — Forms            | 17     | 9      | 8      | 0     |
| IA-03 — Navigation       | 16     | 9      | 6      | 1     |
| IA-04 — Feedback / State | 15     | 6      | 9      | 0     |
| **Tổng cộng**            | **69** | **36** | **32** | **1** |

> Thực thi bằng bộ tự động hoá Selenium (Python) trên Chrome (single browser, headless, có bật `--include-lockout`), SUT chạy tại `localhost:5173` (frontend-web) + `localhost:3000` (backend). Toàn bộ 32 item Failed đều có ảnh chụp minh chứng tại [`screenshot/`](screenshot/).

## Video Demo

**Screen recording 7 phiên usability** (Google Drive) — bảng link đầy đủ trong [`Main_Report.md`](Main_Report.md) §2.3:
https://drive.google.com/drive/folders/19Ssxgb2v0uDsbjXkegTnivzDq4mUuWow?usp=sharing

| Skill / Hoạt động              | Link video                       |
| ------------------------------ | -------------------------------- |
| **Agent Skill — demo sử dụng** | **https://youtu.be/_e-uHOUETtM** |

## Nội dung Gói nộp bài

| Tệp / Thư mục                           | Nội dung                                                                                                                                                                                  | Trạng thái                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [`Main_Report.md`](Main_Report.md) (+ PDF) | Báo cáo chính: GUI checklist (Task 1) + đánh giá tính khả dụng (Task 2) + cross-platform (Task 3) + Agent Skill (Task 4)                                                                | ✅ cả 4 task                                     |
| [`bug_report.md`](bug_report.md)        | **Báo cáo tổng hợp toàn bộ 45 bug của Task 1–3** — gồm phân bố severity, danh sách 12 bug Critical/High ưu tiên xử lý, bảng bug đầy đủ từng task kèm GitHub Issue + ảnh minh chứng, và bảng đối chiếu bug trùng lặp giữa các task | ✅                                               |
| [`AI_Critique.md`](AI_Critique.md)      | Phê bình AI ≈300 từ (§10) — **tách thành tệp riêng**; phụ lục cuối `Main_Report.md` chỉ còn con trỏ sang tệp này                                                                         | ✅                                               |
| [`audit_log.md`](audit_log.md) (+ PDF)  | Phụ lục AI Audit Report bắt buộc (§9) — 11 artifact đã kiểm toán                                                                                                                         | ✅                                               |
| `checklist/GUI_Checklist.csv` / `.xlsx` | Checklist 69 item (> 40) + kết quả thực thi + Test Summary                                                                                                                               | ✅                                               |
| [`screenshot/`](screenshot/)            | Ảnh chụp minh chứng cho các item Failed của Task 1 (tiền tố `HOME-*`, `LOGIN-*`) và 5 ảnh `UX-*` của Task 2                                                                              | ✅                                               |
| [`usability/`](usability/)              | Kịch bản nhiệm vụ, danh sách 7 người tham gia, 7 file ghi chú phiên, điểm SUS, và [`Session_Links.md`](usability/Session_Links.md) — bảng tra cứu người tham gia ↔ bản ghi ↔ GitHub Issue | ✅ 7/7 phiên · SUS đã chấm                       |
| [`cross-platform/`](cross-platform/)    | Bộ test 18 case × 3 nền tảng, [`CrossPlatform_Matrix.csv`](cross-platform/CrossPlatform_Matrix.csv), 16 ảnh có overlay `23127344@hcmus.edu.vn`                                           | ✅                                               |
| [`github_issues/`](github_issues/)      | Ảnh chụp trang GitHub Issues (§14) + danh mục đối chiếu bug ↔ issue                                                                                                                      | ✅                                               |
| [`skills/`](skills/)                    | Agent Skill tái sử dụng cho tự động hoá Selenium + [video demo](https://youtu.be/_e-uHOUETtM)                                                                                            | ✅                                               |
| `git_commit_log.txt`                    | Git commit log (định dạng text), 1 commit / mỗi bước kiểm thử — gồm **1 commit riêng cho mỗi phiên usability** theo §12                                                                  | ✅                                               |
