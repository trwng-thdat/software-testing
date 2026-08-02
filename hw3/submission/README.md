# HW03 — Kiểm thử Giao diện và Tính khả dụng — Gói nộp bài

- **MSSV:** 23127344
- **Họ tên:** Trương Thành Đạt
- **Lớp/Khóa:** Kiểm thử phần mềm - 23KTPM3

## Bảng Tự Đánh giá (Self-Assessment)

| STT | Tiêu chí | Điểm | Tự đánh giá |
| --- | --- | --- | --- |
| 1 | Task 1 — GUI Checklist (thiết kế + thực thi + báo cáo bug) | 30 | **29** |
| 2 | Task 2 — Đánh giá Tính khả dụng (kịch bản + 7 phiên thử + phân tích) | 40 | **35** |
| 3 | Task 3 — Cross-Browser / Cross-Platform (≥ 3 nền tảng) | 20 | **18** |
| 4 | Agent Skills | 10 | **7** |
| | **Tổng cộng** | **100** | **89** |

<details>
<summary><b>Căn cứ tự chấm</b> (nhấn để xem)</summary>

**Task 1 — 29/30.** Vượt yêu cầu ở hầu hết tiêu chí: 69 item (yêu cầu >40), phủ đủ 4 IA trên 2 màn hình, thực thi tự động 100%, 30 bug đều có GitHub Issue kèm ảnh, quy trình AI-First có ghi lại đầy đủ prompt → review → bổ sung item AI bỏ sót.
*Trừ 1 điểm:* ba kết luận (LOGIN-S07 rò rỉ token, LOGIN-S08 double-submit, HOME-U13 contrast WCAG) được suy ra từ ảnh + logic mã nguồn chứ chưa đo trực tiếp bằng DevTools Network / công cụ tính contrast — đã tự ghi rõ giới hạn này ở mục 1.5 thay vì trình bày như đã đo.

**Task 2 — 35/40.** Đủ 7 người tham gia thật, tất cả có bản ghi màn hình; pilot chạy trước; SUS chấm đủ 7 người kèm phân tích đối chiếu với quan sát hành vi; 10 bug với tần suất gặp phải cho từng phát hiện; tách bạch systemic/isolated.
*Trừ 5 điểm:* (1) một số ô quan sát trong file phiên chưa điền (thiết bị/OS, thời lượng chính xác, quote nguyên văn, probe Speed/Trust ở vài phiên) và Outcome cuối của P04–P07 chưa xác nhận dứt khoát; (2) mẫu lệch 6/7 dân IT, chỉ 1 người non-IT, làm giảm tính đại diện — đã nêu như giới hạn nghiên cứu; (3) P05 chấm SUS đồng loạt điểm 3 (straight-lining) làm nhiễu số trung bình; (4) chưa tạo GitHub Issue cho 10 bug BUG-UX.

**Task 3 — 18/20.** Đủ 3 nền tảng với **2 engine khác nhau thật** (Blink + Gecko), 18 test case × 3 = 54 lượt chạy, phát hiện 1 bug phân kỳ nền tảng thật, mọi ảnh có overlay MSSV + nền tảng + URL, 6 bug đều có GitHub Issue (#213–#218), báo cáo nêu rõ 4 giới hạn phép đo.
*Trừ 2 điểm:* P3 là **Chrome mobile emulation** chứ không phải thiết bị Android vật lý (§6 ưu tiên máy thật hoặc cloud tool như BrowserStack/LambdaTest); WebKit không chạy được trên Windows nên không có engine thứ ba thật sự.

**Agent Skills — 7/10.** Có skill đóng gói dạng `SKILL.md` tái sử dụng được, kèm video demo end-to-end.
*Trừ 3 điểm:* §7 nêu skill nên áp dụng cho **GUI-checklist** và **usability-evaluation**; skill hiện tại là về tự động hoá Selenium nói chung (được dùng để chạy 69 item checklist của Task 1, nhưng không bao phủ khâu *thiết kế* checklist hay quy trình usability). Chưa có skill riêng cho hoạt động usability-evaluation.

</details>

## Báo cáo Tóm tắt Kiểm thử

| Chỉ số | Giá trị |
| --- | --- |
| Số màn hình đã kiểm thử (GUI checklist) | **2** — Product List/Home (FR-05) và Login (FR-02) |
| Khía cạnh giao diện đã bao phủ | **4/4** — IA-01 General UI, IA-02 Forms, IA-03 Navigation, IA-04 Feedback/State |
| Luồng usability đã kiểm thử | 1 — Đăng ký → Đăng nhập (Sign up → Sign in) |
| Số item checklist đã thiết kế | **69** (yêu cầu tối thiểu > 40) |
| Số item checklist đã thực thi | **69** (100%) |
| Số item Passed | **36** |
| Số item Failed | **32** |
| Số item N/A (ngoài phạm vi) | 1 (HOME-N06 — breadcrumb không áp dụng cho Home theo FR-23) |
| Lỗi thực thi (execution error) | 0 |
| Số bug phát hiện — Task 1 (GUI) | **30** (BUG-GUI-01…30) — Critical 2, High 1, Medium 12, Low 15 |
| Số bug phát hiện — Task 2 (usability) | **10** (BUG-UX-01…10) — trong đó 2 bug **chỉ phát hiện được qua người dùng thật**: nút hiện/ẩn mật khẩu hỏng (P01) và nhầm lẫn nhãn "Username" vs email (P05, non-IT) |
| GitHub Issues đã tạo | **30** — [#125–#154](https://github.com/DuyITLOR/group05_eshop/issues) trên `DuyITLOR/group05_eshop`, mỗi issue có ảnh đính kèm |
| Số người tham gia usability | **7/7** (P01–P07) — đủ theo yêu cầu, **tất cả đều có bản ghi màn hình** |
| Điểm SUS / UEQ-S trung bình | **19.3 / 100** (7 người) — thấp hơn ngưỡng ngành 68 tới **48.7 điểm**, cả 7 đều hạng **F**. Cá nhân: P04 5.0 (thấp nhất) → P05 50.0 (cao nhất, có dấu hiệu straight-lining) |
| Phạm vi bao phủ cross-platform | **3 nền tảng** — P1 Chrome 141/Windows 11 (Blink), P2 Firefox 145/Windows 11 (Gecko), P3 Android Chrome/Pixel 7 Android 13 (Blink mobile, URL LAN thật) |
| Số màn hình đã kiểm thử (Task 3) | **4** — Cart, Checkout, ProductDetail, Profile (không trùng Task 1) |
| Số test case cross-platform đã thiết kế | **18** (CB-01…CB-18) |
| Số lượt thực thi cross-platform | **54** (18 case × 3 nền tảng) |
| Kết quả Task 3 | Passed **37** · Failed **16** · N/A **1** · BLOCKED **0** |
| Số bug phát hiện — Task 3 (cross-platform) | **6** (BUG-CP-01…06) — Critical 2, High 1, Medium 3; trong đó **1 bug phân kỳ nền tảng** (chỉ lỗi trên Android Chrome) |

### Chi tiết Task 3 theo nền tảng

| Nền tảng | Engine | Viewport | PASS | FAIL | N/A |
| --- | --- | --- | --- | --- | --- |
| P1 — Chrome 141 / Windows 11 | Blink | 1440×900 | 13 | 5 | 0 |
| P2 — Firefox 145 / Windows 11 | Gecko | 1440×900 | 12 | 5 | 1 |
| P3 — Android Chrome / Pixel 7 | Blink mobile | 412×915 | 12 | 6 | 0 |
| **Tổng cộng** | | | **37** | **16** | **1** |

> Thực thi bằng [`cross-platform/run_cross_platform.py`](cross-platform/run_cross_platform.py) (Selenium 4.46 + Python 3.14). 16 ảnh của các case FAIL có overlay `23127344@hcmus.edu.vn` + tên nền tảng + URL SUT tại [`cross-platform/screenshots/`](cross-platform/screenshots/). Ma trận đầy đủ: [`CrossPlatform_Matrix.csv`](cross-platform/CrossPlatform_Matrix.csv). Báo cáo chi tiết nằm trong [`Main_Report.md`](Main_Report.md) §3.

### Chi tiết Task 1 theo khía cạnh giao diện (IA)

| Khía cạnh giao diện | Tổng | Passed | Failed | N/A |
| --- | --- | --- | --- | --- |
| IA-01 — General UI | 21 | 12 | 9 | 0 |
| IA-02 — Forms | 17 | 9 | 8 | 0 |
| IA-03 — Navigation | 16 | 9 | 6 | 1 |
| IA-04 — Feedback / State | 15 | 6 | 9 | 0 |
| **Tổng cộng** | **69** | **36** | **32** | **1** |

> Thực thi bằng bộ tự động hoá Selenium (Python) trên Chrome (single browser, headless, có bật `--include-lockout`), SUT chạy tại `localhost:5173` (frontend-web) + `localhost:3000` (backend). Toàn bộ 32 item Failed đều có ảnh chụp minh chứng tại [`screenshot/`](screenshot/).

## Video Demo

**Screen recording 6 phiên usability** (Google Drive) — bảng link đầy đủ trong [`Main_Report.md`](Main_Report.md) §2.3:
https://drive.google.com/drive/folders/19Ssxgb2v0uDsbjXkegTnivzDq4mUuWow?usp=sharing

| Skill / Hoạt động | Link video |
| --- | --- |
| **Agent Skill — demo sử dụng** | **https://youtu.be/_e-uHOUETtM** |

## Nội dung Gói nộp bài

| Tệp / Thư mục | Nội dung | Trạng thái |
| --- | --- | --- |
| `Main_Report.md` (+ PDF) | Báo cáo chính: GUI checklist (Task 1) + đánh giá tính khả dụng (Task 2) + cross-platform (Task 3) | ✅ cả 3 task |
| `checklist/GUI_Checklist.csv` / `.xlsx` | Checklist 69 item (> 40) + kết quả thực thi + Test Summary | ✅ |
| `screenshot/` | Ảnh chụp minh chứng cho các item Failed (43 ảnh) | ✅ |
| `github_issues/` | Ảnh chụp trang GitHub Issues (§14) + danh mục đối chiếu | ✅ |
| `audit_log.md` (+ PDF) | Phụ lục AI Audit Report bắt buộc (§9) — 11 artifact đã kiểm toán | ✅ |
| `git_commit_log.txt` | Git commit log (định dạng text), 1 commit / mỗi bước kiểm thử — gồm **1 commit riêng cho mỗi phiên usability** theo §12 | ✅ |
| `skills/` | Agent Skill tái sử dụng cho tự động hoá Selenium + [video demo](https://youtu.be/_e-uHOUETtM) | ✅ |
| `AI_Critique.md` (+ PDF) | Phê bình AI (≈300 từ) | ✅ |
| `usability/` | Kịch bản nhiệm vụ, danh sách 7 người tham gia, 7 file ghi chú phiên, điểm SUS | ✅ 7/7 phiên · SUS đã chấm |
| `cross-platform/` | Bộ test 18 case × 3 nền tảng (`run_cross_platform.py`), `CrossPlatform_Matrix.csv`, `results.json`, 16 ảnh có overlay `23127344@hcmus.edu.vn` | ✅ (còn lại: tạo GitHub Issues cho BUG-CP-01…06) |
| Agent Skills + video demo | Skill tái sử dụng + [video demo](https://youtu.be/_e-uHOUETtM) | ✅ |

## Ghi chú

- Tên file khi nộp: `<MSSV>_HW03_AI_GUIUsability_<TựĐánhGiá>.zip`
- Kiểm tra không thiếu tài liệu bắt buộc nào trước khi nén file (thiếu tài liệu = 0 điểm).
