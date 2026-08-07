**Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)**

**CS423 / CSC13003 – Software Testing (AI-augmented · 2026\)**

**AI POLICY · TEMPLATES — 2026 v1.0**

# **AI Audit Report — 5-section Template per Artifact**

*Mandatory appendix for every AI-assisted homework (HW\#01–HW\#06, and Seminar).*

*Adapted from Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0. This adaptation is prepared for FIT@HCMUS – CS423 / CSC15003 Software Testing course.*

## **1\. Student Information**

| Field | Value |
| :---- | :---- |
| **Student name (printed):** | TRƯƠNG THÀNH ĐẠT |
| **Student ID:** | 23127344 |
| **Class / Cohort:** | Kiểm thử phần mềm \- 23KTPM3 |
| **Assignment ID (e.g., HW\#00, HW\#02):** | HW\#04 — Automation Testing |
| **Assignment date:** | 07/08/2026 |
| **AI tool(s) used:** | Claude Opus 5 (Claude Code, VSCode extension) |
| **AI tool(s) used:** | \[x\] Yes  \[ \] No |

## **2\. Instructions (read before filling)**

* Add one row per AI-generated artifact (test case, script, checklist, OpenAPI spec, JMeter plan, etc.).  
* Paste the verbatim prompt — DO NOT paraphrase.  
* Paste the verbatim AI output (or include a labelled screenshot in the report).  
* Tag the verdict: VALID / INVALID / INCOMPLETE.  
* Reasoning must cite a course slide, ISTQB section, or technical RFC.  
* Show the corrected artifact with the change highlighted.  
* Sample rows are in italic — replace them before submission.

## **3\. Audit Table — one row per artifact**

| (1) Prompt \+ Tool | (2) AI Output | (3) Verdict | (4) Reasoning (ISTQB) | (5) Student Fix |
| :---- | :---- | :---- | :---- | :---- |
| **Sample (italic) — replace before submission:** |  |  |  |  |
| **Tool: AI Tool (e.g., ChatGPT, Claude, Gemini)Time: 14:32 25/02/2026Prompt:"Generate test cases for parsePhoneNumberVN function…"** | TC01: parsePhoneNumberVN("0912345678")Expected: {prefix:84, number:912345678, valid:true}… | INCOMPLETE | AI ignored RFC 3966 international format. ISTQB FL §4.3 Boundary Value Analysis requires testing format edges. | Added TC: parsePhoneNumberVN("+84-91-234-5678")Expected: {prefix:84, number:912345678, valid:true} |
| **Artifact \#1 — Bộ template báo cáo nộp bài HW04****Tool: Claude Opus 5 (Claude Code)****Time: 07/08/2026****Prompt:** "Now base on the @hw4/2026.HW04.Automation Testing\_En.pdf create for me a main\_report.md in folder hw4. and all the information I will fill in later. it look like a template for submision. (remember to write in @hw4/\[AI-02\] \- FIT@HCMUS \- AI Audit Report\_En.docx.md \- this shoud not display in the promt col)" | AI đọc PDF đề bài rồi tạo 4 file trong `hw4/`: (1) `Main_Report.md` — khung báo cáo chính theo thứ tự Task 1 / Task 2 / Agent Skill, gồm bảng 9 lượt chạy trình duyệt, bảng phân tích AI sai/thiếu, bảng bug và checklist trước khi nộp; (2) `README.md` — bảng tự đánh giá \+ test summary theo §14; (3) `AI_Critique.md` — khung bài phê bình 200–300 từ; (4) `AI_Audit_Report.md` — **một file audit mới do AI tự tạo thêm**. AI cũng tự suy ra 3 feature FR-04 / FR-08 / FR-18 từ `hw2/README.md`. | INCOMPLETE | Prompt yêu cầu ghi log vào file template \[AI-02\] có sẵn, nhưng AI lại tạo file audit song song `AI_Audit_Report.md` và tự sửa cấu trúc template gốc (thêm ghi chú, đổi tiêu đề, thêm mục "Đối chiếu chéo"). Vi phạm §9 đề bài: phụ lục phải dùng đúng biểu mẫu của Khoa. ISTQB FL §5.1 (Test Management) cũng yêu cầu tài liệu kiểm thử tuân thủ template đã thống nhất, không tự phát sinh biểu mẫu riêng. | Xóa file `AI_Audit_Report.md` thừa; khôi phục `\[AI-02\]...docx.md` về đúng bản gốc trong `templates/`; chỉ điền vào các ô trống có sẵn, giữ nguyên 100% cấu trúc, tiêu đề và ký tự escape của template. Sửa 4 liên kết trong `Main_Report.md` và `README.md` trỏ về file \[AI-02\]. Sửa `skills/selenium-automation/SKILL.md:263` — dòng này hướng dẫn agent ghi ra `docs/AI_Audit_Report.md`, chính là nguyên nhân gốc khiến AI tạo file trùng. |
| **Artifact \#2** |  |  |  |  |
| **Artifact \#3** |  |  |  |  |
| **Artifact \#4** |  |  |  |  |
| **Artifact \#5** |  |  |  |  |
| **Artifact \#6** |  |  |  |  |
| **Artifact \#7** |  |  |  |  |
| **Artifact \#8** |  |  |  |  |
| **Artifact \#9** |  |  |  |  |
| **Artifact \#10** |  |  |  |  |

## **4\. Summary of AI Accuracy**

Aggregate the verdicts from Section 3 and complete the table below.

| Metric | Count | Percentage |
| :---- | :---- | :---- |
| **Total AI-generated artifacts audited** | 1 | 100% |
| **VALID (correct, accepted as-is)** | 0 | 0% |
| **INVALID (wrong; rejected)** | 0 | 0% |
| **INCOMPLETE (acceptable after edits)** | 1 | 100% |

## **5\. Conclusion — When should AI be used (or not)?**

Write 80–150 words describing patterns you observed. Where did AI shine? Where did AI fail? What is your recommendation for using AI in this kind of work in the future?

AI tỏ ra hiệu quả ở phần việc có cấu trúc lặp lại và suy ra được từ tài liệu: đọc đề bài PDF rồi dựng khung báo cáo đúng thứ tự các Task, đúng trọng số điểm, và tự đối chiếu `hw2/README.md` để lấy ra ba feature FR-04 / FR-08 / FR-18. Nhưng ở phần đòi hỏi tuân thủ ràng buộc hình thức, AI lại làm sai: dù prompt đã nêu rõ phải ghi vào biểu mẫu \[AI-02\] có sẵn, AI vẫn tạo thêm một file audit song song và tự sửa cấu trúc template gốc. Nguyên nhân là AI ưu tiên tạo ra thứ "trông hợp lý" theo thói quen hơn là bám sát ràng buộc được nêu trong prompt. Bài học rút ra: với tài liệu bắt buộc theo biểu mẫu của Khoa, phải yêu cầu AI **chỉ điền vào ô trống** và tự kiểm tra lại bằng `diff` với bản gốc; không mặc định rằng AI hiểu "ghi vào file X" đồng nghĩa với "không được tạo file Y".

## **6\. Mandatory Disclosure (paste verbatim)**

*"\[Test cases / script / dataset / report\] was initially generated by \[AI tool name\]; I reviewed and modified \[section X\], added \[edge cases Y, Z\]; \[section W\] was written entirely by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category."*

## **Signature**

| Student name (printed): | TRƯƠNG THÀNH ĐẠT |
| :---- | :---- |
| **Student ID:** | 23127344 |
| **Class / Cohort:** | Kiểm thử phần mềm \- 23KTPM3 |
| **Course:** | CS423 / CSC13003 – Software Testing |
| **Instructor:** | Dr. Lam Quang Vu / Dr. Tran Duy Hoang / MSc. Tran Thi Bich Hanh / MSc. Truong Phuoc Loc / MSc. Ho Tuan Thanh |
| **Date:** | 07/08/2026 |
| **Signature:** | Trương Thành Đạt |

## **References**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (latest version).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338\.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.