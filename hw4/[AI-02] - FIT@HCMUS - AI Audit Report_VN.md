**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM (HCMUS)**

**CS423 / CSC13003 – Kiểm thử Phần mềm (AI-augmented · 2026)**

**CHÍNH SÁCH AI · CÁC MẪU BÁO CÁO — 2026 v1.0**

# **Báo cáo Kiểm toán AI — Mẫu 5 phần cho mỗi Artifact**

_Phụ lục bắt buộc cho mọi bài tập về nhà có sự hỗ trợ của AI (HW\#01–HW\#06, và Seminar)._

_Được biên soạn từ Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0. Bản chuyển thể này được chuẩn bị cho FIT@HCMUS – Khóa học CS423 / CSC13003 Kiểm thử Phần mềm._

## **1. Thông tin Sinh viên**

| Trường | Giá trị |
| :--- | :--- |
| **Họ và tên (in hoa):**               | Trương Thành Đạt |
| **MSSV:**                           | 23127344 |
| **Lớp / Nhóm:**                       | Kiểm thử phần mềm - 23KTPM3 |
| **Mã bài tập (ví dụ: HW\#00, HW\#02):** | HW04 |
| **Ngày làm bài:**                      | 25/07/2026 |
| **Công cụ AI đã dùng:**                      | opencode, codex |
| **Có sử dụng AI không:**                      | [x] Có [ ] Không |

## **2. Hướng dẫn (đọc kỹ trước khi điền)**

- Thêm một dòng cho mỗi artifact (test case, script, checklist, tài liệu OpenAPI, kế hoạch JMeter, v.v.) được tạo bởi AI.
- Dán nguyên văn prompt — KHÔNG diễn giải lại.
- Dán nguyên văn kết quả trả về của AI (hoặc đính kèm ảnh chụp màn hình có dán nhãn trong báo cáo).
- Gắn nhãn phán quyết: HỢP LỆ (VALID) / KHÔNG HỢP LỆ (INVALID) / CHƯA HOÀN THIỆN (INCOMPLETE).
- Lý luận phải trích dẫn slide môn học, chương mục ISTQB, hoặc RFC kỹ thuật.
- Hiển thị artifact đã chỉnh sửa với các thay đổi được làm nổi bật.
- Các dòng mẫu được in nghiêng — hãy thay thế trước khi nộp.

## **3. Bảng Kiểm toán — một dòng cho mỗi artifact**

| (1) Prompt + Công cụ | (2) Kết quả AI | (3) Phán quyết | (4) Lý luận (ISTQB) | (5) Chỉnh sửa của SV |
| :--- | :--- | :--- | :--- | :--- |
| **Artifact #1**<br><br>**Công cụ:** Codex<br><br>**Giờ:** 11:59 25/07/2026<br><br>**Prompt:** "Base on the [2026.HW04.Automation Testing_En.pdf](software-testing/hw4/2026.HW04.Automation Testing_En.pdf) generate for me the template structure for report, you can reference [HW02_Main_Report_Template.md](software-testing/hw2/HW02_Main_Report_Template.md) . Just make the outline and content or extra data I will add. and feature I choose in each pool is <br>pool a: FR-05<br>pool b: FR-07<br>pool c: FR-14" | **Kết quả AI nguyên văn:**<br><br>"Done. I created the HW04 report outline here:<br><br>[HW04_Main_Report_Template.md](C:/HCMUS/Software%20Testing/software-testing/hw4/HW04_Main_Report_Template.md)<br><br>It is tailored to your selected features:<br><br>- Pool A: `FR-05` Product listing and search<br>- Pool B: `FR-07` Shopping cart<br>- Pool C: `FR-14` Category management (CRUD)<br><br>I kept it as a fill-in template with placeholders for scripts, data files, browser reports, AI review/fixes, bugs, demo video, AI critique, AI audit, git log, submission checklist, and self-assessment."<br><br>**Artifact được tạo:** `software-testing/hw4/HW04_Main_Report_Template.md` | HỢP LỆ | Kết quả bám đúng yêu cầu HW04: chỉ dùng 3 feature web từ Pool A-C, không dùng Pool D; mỗi feature có phần cho tối thiểu 12 test case tự động, data-driven bằng `.json` / `.csv`, chạy 3 browser, HTML report có `Run by: <StudentID>` và ISO timestamp, demo video, AI Audit Report, AI Critique, Git commit log, README/test summary và self-assessment. Các mục này khớp với HW04 §5, §6, §9-§15. | Em đã rà soát template và xác nhận 3 feature đã đúng với lựa chọn: FR-05, FR-07, FR-14. Artifact này chỉ là khung báo cáo để điền dữ liệu thật sau khi chạy automation, nên chưa có kết quả test, bug link, screenshot, HTML report hoặc video. |
| **Artifact #2** | | | | |
| **Artifact #3** | | | | |
| **Artifact #4** | | | | |
| **Artifact #5** | | | | |
| **Artifact #6** | | | | |
| **Artifact #7** | | | | |
| **Artifact #8** | | | | |
| **Artifact #9** | | | | |
| **Artifact #10** | | | | |

## **4. Tóm tắt Độ chính xác của AI**

Tổng hợp các phán quyết từ Phần 3 và hoàn thành bảng dưới đây.

| Chỉ số | Số lượng | Tỷ lệ |
| :--- | :--- | :--- |
| **Tổng số artifact tạo bởi AI đã kiểm toán** | 1 | 100% |
| **HỢP LỆ (đúng, chấp nhận như ban đầu)** | 1 | 100% |
| **KHÔNG HỢP LỆ (sai; bị từ chối)** | 0 | 0% |
| **CHƯA HOÀN THIỆN (chấp nhận sau khi chỉnh sửa)** | 0 | 0% |

## **5. Kết luận — Khi nào nên (hoặc không nên) dùng AI?**

Viết 80–150 từ mô tả các mẫu bạn đã quan sát được. AI tỏa sáng ở đâu? AI thất bại ở đâu? Lời khuyên của bạn về việc sử dụng AI trong công việc này trong tương lai là gì?

____________________________________________________________________________________

____________________________________________________________________________________

____________________________________________________________________________________

____________________________________________________________________________________

____________________________________________________________________________________

____________________________________________________________________________________

## **6. Tuyên bố Bắt buộc (dán nguyên văn)**

_" [Test cases / script / dataset / report] ban đầu được tạo bởi [tên công cụ AI]; tôi đã rà soát và sửa đổi [phần X], thêm [edge cases Y, Z]; [phần W] do tôi tự viết hoàn toàn. Báo cáo Kiểm toán AI chi tiết được đính kèm tại Phụ lục A. Tôi xác nhận không sử dụng AI để tạo bất kỳ artifact nào nằm trong danh mục cấm."_

## **Chữ ký**

| Tên sinh viên (in hoa): | Trương Thành Đạt |
| :--- | :--- |
| **MSSV:**         | 23127344 |
| **Lớp / Nhóm:**     | Kiểm thử phần mềm - 23KTPM3 |
| **Khóa học:** | CS423 / CSC13003 – Kiểm thử Phần mềm |
| **Giảng viên:** | |
| **Ngày:**               | 25/07/2026 |
| **Chữ ký:** | |

## **Tài liệu Tham khảo**

- Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (phiên bản mới nhất).
- Hardman, P. (2025). A Post-AI Learning Taxonomy.
- Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
- Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.
- Anthropic (2025). Building reliable AI test agents — engineering blog.
- DeepEval & Promptfoo documentation — các framework kiểm thử cho hệ thống LLM.
