**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm thử phần mềm (Tăng cường AI · 2026)**

**AI POLICY · TEMPLATES — 2026 v1.0**

# **Biểu mẫu Công bố Sử dụng AI**

*Đính kèm vào các bài tập có sử dụng AI dưới bất kỳ hình thức nào được phép.*

*Được dịch và chuyển đổi từ tài liệu của Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0. Bản chuyển đổi này được chuẩn bị dành riêng cho khóa học CS423 / CSC13003 Kiểm thử phần mềm tại FIT@HCMUS.*

## **1. Thông tin khóa học & Sinh viên**

| Trường thông tin | Giá trị |
| :--- | :--- |
| **Môn học:** | CS423 / CSC13003 – Kiểm thử phần mềm |
| **Mã bài tập:** | HW#01 |
| **Tên bài tập:** | QA/QC Jobs · 20 Defects · Test a Physical Product |
| **Mức độ sử dụng AI (1–5):** | Category 3 (Tăng cường AI - AI-Augmented) |
| **Ngày ký:** | 07/06/2026 |
| **Họ và tên sinh viên:** | Trương Thành Đạt |
| **Mã số sinh viên:** | 23127344 |

## **2. Các câu hỏi công bố**

### **1. Công cụ AI đã sử dụng:**

*Liệt kê mọi công cụ AI đã sử dụng cho bài tập này (VD: ChatGPT, GitHub Copilot, Cursor, Gemini).*

Gemini 3.5 Flash (thông qua trợ lý Antigravity), Opencode (Deepseek model), Claude Code (Antigravity)

### **2. (Các) giai đoạn của bài tập có sử dụng AI:**

*Đánh dấu chọn tất cả các giai đoạn áp dụng: [ ] brainstorming (lên ý tưởng)  [ ] outlining (phác thảo dàn ý)  [ ] drafting (viết bản thảo)  [ ] feedback (nhận phản hồi)  [ ] revision (chỉnh sửa)  [ ] coding (lập trình)  [ ] data analysis (phân tích dữ liệu)  [ ] visual design (thiết kế trực quan)  [ ] khác (nêu rõ).*

[x] brainstorming (lên ý tưởng)  [x] outlining (phác thảo dàn ý)  [x] drafting (viết bản thảo)  [ ] feedback (nhận phản hồi)  [ ] revision (chỉnh sửa)  [x] coding (lập trình)  [x] data analysis (phân tích dữ liệu)  [ ] visual design (thiết kế trực quan)  [ ] khác (nêu rõ).

### **3. Các câu lệnh prompt hoặc nhiệm vụ chính đã giao cho AI:**

*Dán nguyên văn 2–3 câu lệnh prompt có ảnh hưởng lớn nhất. Đối với toàn bộ nhật ký hội thoại, hãy đính kèm Phụ lục A (Appendix_A_Prompt_Log.md).*

**Prompt 1 (Sinh sơ đồ tư duy - Yêu cầu 1):**
```text
Generate a mindmap representing the QA and QC roles and activities according to the ISTQB Foundation Level syllabus. Include some common structural mistakes or misconceptions that an AI might make regarding the distinction between QA and QC, the placement of debugging, and tester roles, so that we can review and correct them. Format the output in Mermaid syntax.
```

**Prompt 2 (Sinh danh sách 20 lỗi phần mềm - Yêu cầu 2):**
```text
Tìm 20 lỗi phần mềm (defect) được công bố công khai từ năm 2022 đến 2026. Trong đó có ít nhất 5 lỗi liên quan đến các vấn đề AI/LLM như ảo tưởng (hallucination), prompt injection, thiên kiến (bias), đầu ra không an toàn hoặc tự động hóa không đáng tin cậy. Định dạng kết quả thành bảng gồm các cột: Tên lỗi, Năm, Liên quan đến AI, Đường dẫn nguồn, Mô tả lỗi, Mức độ nghiêm trọng, Hậu quả, Giải pháp, và Lỗi ảo tưởng hoặc thiên kiến của AI.
```

**Prompt 3 (Sinh ca kiểm thử bếp điện - Yêu cầu 3):**
```text
Tôi muốn đổi thiết bị ở Yêu cầu 3 thành bếp điện. Hãy tạo cho tôi 15 ca kiểm thử cơ bản tập trung vào bật/tắt, điều chỉnh mức nhiệt độ, an toàn và hiển thị trạng thái của thiết bị dưới dạng bảng Markdown.
```

### **4. Các phần cụ thể trong bài làm mà AI đã đóng góp:**

*Hãy nêu cụ thể. Ví dụ: 'AI đã tạo ra TC01–TC15 ở Mục 3.2; tôi đã viết lại TC04 và TC11; AI không đóng góp vào các Mục 1, 2, 4 hoặc phần Phê bình AI.'*

*   **Yêu cầu 1:** AI tạo ra cấu trúc Mermaid ban đầu của sơ đồ tư duy QA/QC và tóm tắt thông tin của 10 tin tuyển dụng.
*   **Yêu cầu 2:** AI tạo danh sách 20 lỗi phần mềm ban đầu có chứa các chi tiết ảo tưởng, sau đó tôi đã tự tìm kiếm thông tin đúng sự thật để sửa đổi và lập danh sách ảo tưởng.
*   **Yêu cầu 3:** AI phác thảo danh sách ban đầu và các bước thực hiện chức năng của 15 ca kiểm thử vật lý cho nồi chiên không dầu (sau đó đổi sang bếp điện Sanaky VH-6100HG). AI không trực tiếp tạo ra các ca kiểm thử cho bếp điện.
*   **Rà soát bài nộp (Artifact #9):** Claude Code (thông qua trợ lý Antigravity) được sử dụng để phân tích, đối chiếu toàn bộ bài nộp với các yêu cầu của đề bài và tạo checklist khuyến nghị điều chỉnh.
*   **Phần AI không đóng góp:** AI KHÔNG đóng góp vào việc phát hiện, phân tích hoặc giải thích 3 ca kiểm thử biên vật lý (TC-09, TC-11, TC-15). AI không viết phần Phê bình AI hoặc các đánh giá thực tế (Verdict) và kết quả thực tế trong Yêu cầu 3.

### **5. Cách tôi đã xem xét, chỉnh sửa hoặc xác minh kết quả đầu ra của AI:**

*Mô tả phương pháp xác minh của bạn (chạy thử nghiệm, kiểm tra đặc tả, hỏi trợ giảng, tra cứu tài liệu RFC, đối chiếu với giáo trình ISTQB, v.v.).*

*   **Xác minh Sơ đồ tư duy QA/QC:** Tôi đối chiếu sơ đồ tư duy do AI tạo ra với **Giáo trình ISTQB Foundation Level (FL) v4.0** (cụ thể là Mục 1.1.2 về Debugging, Mục 1.2.2 về QA vs QC, và Mục 5.1.1 về Vai trò kiểm thử). Tôi đã phát hiện và sửa lại 3 lỗi cấu trúc lớn mà AI tạo ra.
*   **Xác minh Tin tuyển dụng:** Tôi kiểm tra thủ công thông tin chi tiết của từng tin tuyển dụng trong số 10 tin (tiêu đề, công ty, ngày đăng, lương, yêu cầu) đối chiếu với các đường dẫn nền tảng gốc và ảnh chụp màn hình.
*   **Xác minh 20 Lỗi phần mềm:** Tôi đối chiếu thông tin của từng lỗi phần mềm với các báo cáo kỹ thuật, trang tin chính thức của các hãng (như Cloudflare, Atlassian, Toyota, CrowdStrike) và các trang tin tức lớn (như The Guardian, ABC News, Ars Technica) để tìm ra các chi tiết sai sự thật do AI tự tạo ra.
*   **Xác minh Ca kiểm thử vật lý:** Khi yêu cầu AI sinh các ca kiểm thử, do AI không biết các đặc thù kỹ thuật thực tế của thiết bị cụ thể (ví dụ: nhầm lẫn nguyên lý hoạt động của bếp từ và bếp hồng ngoại, đưa ra các khái niệm mức nhiệt độ/công suất chung chung không đúng thực tế của model VH-6100HG), nó sẽ đưa ra các ca kiểm thử rất mơ hồ, chung chung và không đi đúng vào trọng tâm của thiết bị thực tế. Do đó, bắt buộc phải có sự điều chỉnh, hiệu chuẩn các thông số (như công suất hiển thị thực tế từ 300W-2000W, khả năng tương thích chất liệu nồi thay vì cảm ứng từ) và xác minh lại thủ công từ con người. Đồng thời, tôi đã tự phát hiện và bổ sung 3 trường hợp biên vật lý quan trọng bị AI bỏ sót (nước tràn loạn phím cảm ứng, bếp vẫn hoạt động gia nhiệt khi không có nồi, và nút nguồn không tắt được), sau đó trực tiếp thực thi và ghi hình video để xác thực các lỗi thực tế.

### **6. Trích dẫn nguồn (nếu có yêu cầu từ hướng dẫn môn học):**

*Môn học Kiểm thử phần mềm sử dụng định dạng IEEE. Ví dụ: Anthropic. (2026). AI Tool (e.g., ChatGPT, Claude, Gemini) [Large language model]. https://claude.ai*

Google. (2026). Gemini 3.5 Flash [Mô hình ngôn ngữ lớn]. https://gemini.google.com  
DeepSeek. (2026). Opencode [Mô hình ngôn ngữ lớn]. https://deepseek.com  
Anthropic. (2026). Claude Code (Antigravity) [Mô hình ngôn ngữ lớn]. https://anthropic.com

## **3. Cam kết trung thực**

*By signing below, I confirm that the disclosure above is accurate and complete. I understand that undisclosed or false disclosure of AI use is treated as academic misconduct and may result in a 0 grade for the assignment and disciplinary referral.*

*Bằng việc ký tên dưới đây, tôi xác nhận rằng thông tin công bố ở trên là chính xác và đầy đủ. Tôi hiểu rằng việc không công khai hoặc khai báo sai lệch về việc sử dụng AI sẽ bị coi là vi phạm học thuật và có thể dẫn đến điểm 0 cho bài tập cũng như bị chuyển lên hội đồng kỷ luật.*

## **Chữ ký**

| Trường thông tin | Giá trị |
| :--- | :--- |
| **Họ và tên sinh viên (chữ in):** | Trương Thành Đạt |
| **Mã số sinh viên:** | 23127344 |
| **Lớp / Khóa:** | Kiểm thử phần mềm - 23KTPM3 |
| **Môn học:** | CS423 / CSC13003 – Kiểm thử phần mềm |
| **Giảng viên:** | Dr. Lam Quang Vu / Dr. Tran Duy Hoang / MSc. Tran Thi Bich Hanh / MSc. Truong Phuoc Loc / MSc. Ho Tuan Thanh |
| **Ngày ký:** | 07/06/2026 |
| **Chữ ký:** | Trương Thành Đạt |

## **Tài liệu tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Education. CC BY-NC-SA 4.0.  
* Tài liệu Giáo trình ISTQB Foundation Level (phiên bản mới nhất).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
