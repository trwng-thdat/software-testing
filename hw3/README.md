# HW03 — Kiểm thử Giao diện và Tính khả dụng — Gói nộp bài

- **MSSV:** 23127344
- **Họ tên:** Trương Thành Đạt
- **Lớp/Khóa:** Kiểm thử phần mềm - 23KTPM3

## Bảng Tự Đánh giá (Self-Assessment)

| STT | Tiêu chí | Điểm | Tự đánh giá |
| --- | --- | --- | --- |
| 1 | Task 1 — GUI Checklist (thiết kế + thực thi + báo cáo bug) | 30 | TODO |
| 2 | Task 2 — Đánh giá Tính khả dụng (kịch bản + 7 phiên thử + phân tích) | 40 | TODO |
| 3 | Task 3 — Cross-Browser / Cross-Platform (≥ 3 nền tảng) | 20 | TODO |
| 4 | Agent Skills | 10 | TODO |
| | **Tổng cộng** | **100** | TODO |

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
| Số bug phát hiện — Task 2 (usability) | TODO (dự kiến BUG-UX-01…05, xác nhận sau khi chạy đủ 7 phiên) |
| GitHub Issues đã tạo | **30** — [#125–#154](https://github.com/DuyITLOR/group05_eshop/issues) trên `DuyITLOR/group05_eshop`, mỗi issue có ảnh đính kèm |
| Số người tham gia usability | 7 (TODO — xác nhận sau khi hoàn thành các phiên) |
| Điểm SUS / UEQ-S trung bình | TODO |
| Phạm vi bao phủ cross-platform | TODO (liệt kê các nền tảng) |

### Chi tiết Task 1 theo khía cạnh giao diện (IA)

| Khía cạnh giao diện | Tổng | Passed | Failed | N/A |
| --- | --- | --- | --- | --- |
| IA-01 — General UI | 21 | 12 | 9 | 0 |
| IA-02 — Forms | 17 | 9 | 8 | 0 |
| IA-03 — Navigation | 16 | 9 | 6 | 1 |
| IA-04 — Feedback / State | 15 | 6 | 9 | 0 |
| **Tổng cộng** | **69** | **36** | **32** | **1** |

> Thực thi bằng bộ tự động hoá Selenium (Python) tại [`selenium/`](../selenium/) trên Chrome (single browser, headless, có bật `--include-lockout`), SUT chạy tại `localhost:5173` (frontend-web) + `localhost:3000` (backend). Toàn bộ 32 item Failed đều có ảnh chụp minh chứng tại [`screenshot/`](screenshot/).

## Video Demo

| Skill / Hoạt động | Link YouTube |
| --- | --- |
| TODO | TODO |

## Nội dung Gói nộp bài

| Tệp / Thư mục | Nội dung | Trạng thái |
| --- | --- | --- |
| `Main_Report.md` (+ PDF) | Báo cáo chính: GUI checklist (Task 1) + đánh giá tính khả dụng (Task 2) + cross-platform (Task 3) | Task 1 ✅ · Task 2–3 TODO |
| `bug_reports.md` | 30 bug Task 1, mỗi bug 1 khối Title + Description (repro, expected/actual, severity, ảnh) | ✅ |
| `checklist/GUI_Checklist.csv` / `.xlsx` | Checklist 69 item (> 40) + kết quả thực thi + Test Summary | ✅ |
| `screenshot/` | Ảnh chụp minh chứng cho toàn bộ 32 item Failed | ✅ |
| `[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md` (+ PDF) | Phụ lục AI Audit Report bắt buộc | ✅ (cập nhật tiếp khi làm Task 2–3) |
| `git_commit_log.txt` | Git commit log (định dạng text), 1 commit / mỗi bước kiểm thử | ✅ Task 1 |
| `../selenium/` | Bộ tự động hoá thực thi checklist (Selenium + Python) + báo cáo HTML/Markdown | ✅ |
| `AI_Critique.md` (+ PDF) | Phê bình AI (200–300 từ) | ⬜ TODO |
| `usability/` | Kịch bản nhiệm vụ, danh sách 7 người tham gia, ghi chú phiên, điểm SUS/UEQ-S | ⬜ TODO |
| `cross-platform/` | Ảnh chụp ≥ 3 nền tảng, có overlay `23127344@hcmus.edu.vn` | ⬜ TODO |
| Agent Skills + video demo | Skill tái sử dụng + link YouTube minh hoạ | ⬜ TODO |

## Ghi chú

- Tên file khi nộp: `<MSSV>_HW03_AI_GUIUsability_<TựĐánhGiá>.zip`
- Kiểm tra không thiếu tài liệu bắt buộc nào trước khi nén file (thiếu tài liệu = 0 điểm).
