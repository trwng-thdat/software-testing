# Danh Sách Các Lỗi Sai Sự Thật (Hallucination) Được Tìm Thấy

Dưới đây là kết quả đối chiếu chi tiết cho từng defect trong báo cáo `defects-report.md` nhằm phát hiện ít nhất một chi tiết sai lệch thực tế (hallucination/inaccuracy) so với thông tin xác thực từ các nguồn tin gốc:

---

### **Defect #1 – Vụ kiện chatbot tại tòa án New York**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo mô tả sản phẩm bị lỗi là *"Chatbot của một công ty giao hàng thương mại điện tử"* và nguyên đơn kiện do *"chatbot trên website công ty cung cấp thông tin sai lệch về giao hàng và hoàn tiền"*.
*   **Sự thật:** Đây thực chất là vụ kiện chấn thương cá nhân nổi tiếng ***Mata v. Avianca*** chống lại hãng hàng không Avianca. Sản phẩm gây lỗi ở đây là **ChatGPT** được chính các luật sư của nguyên đơn sử dụng để viết hồ sơ pháp lý, dẫn đến việc ChatGPT tự bịa đặt ra 6 tiền lệ pháp lý không có thật. Vụ việc hoàn toàn không liên quan gì đến chatbot của một công ty giao hàng thương mại điện tử.

### **Defect #2 – Air Canada chatbot bồi thường khách hàng**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi *"Thời gian: Tháng 2/2024"* làm thời điểm xảy ra lỗi của chatbot.
*   **Sự thật:** Lỗi của chatbot (cung cấp thông tin sai về chính sách hoàn tiền vé tang lễ) xảy ra vào **tháng 11/2022** khi hành khách Jake Moffatt nhắn tin trao đổi với chatbot. Tháng 2/2024 chỉ là thời điểm Tòa án Phân giải Dân sự (CRT) đưa ra phán quyết cuối cùng bắt Air Canada bồi thường.

### **Defect #3 – Bing Chat bị prompt injection làm lộ bí mật**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo viết: *"Kẻ tấn công sử dụng kỹ thuật prompt injection..."* (Attacker).
*   **Sự thật:** Người phát hiện ra lỗ hổng này thực chất là **Kevin Liu**, một sinh viên và nhà nghiên cứu bảo mật của Đại học Stanford thực hiện nghiên cứu học thuật một cách thiện chí, không phải là một cuộc tấn công mạng phá hoại hay do "kẻ tấn công" thực hiện.

### **Defect #4 – Gemini image generation sai lịch sử**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi Gemini tạo hình ảnh *"lính Đức Quốc xã là người da màu"*.
*   **Sự thật:** Prompt thực tế mà người dùng nhập không chứa chữ "Đức Quốc xã" (Nazi). Người dùng nhập prompt yêu cầu tạo hình *"lính Đức năm 1943"* ("German soldier in 1943"), và AI đã tự vẽ ra người lính Đức thời kỳ đó (mặc quân phục thời phát xít) là người da màu và da vàng do cơ chế đa dạng hóa sắc tộc (diversity safeguards) hoạt động quá đà.

### **Defect #5 – DPD chatbot chửi thề khách hàng**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi chatbot bị thuyết phục để *"viết một bài đánh giá bằng ngôn ngữ thô tục"*.
*   **Sự thật:** Khách hàng Ashley Beauchamp đã yêu cầu chatbot viết một **bài thơ** (poem) chỉ trích dịch vụ của DPD, và sau đó yêu cầu nó chửi thề (chatbot phản hồi bằng từ *"F*** yeah"* trong một câu thoại khác). Chatbot không hề viết "bài đánh giá" (review) nào bằng ngôn ngữ thô tục.

### **Defect #6 – CrowdStrike outage toàn cầu tháng 7/2024**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi *"Lãnh đạo CrowdStrike đã ra điều trần và xin lỗi Quốc hội Mỹ về sự cố này"* vào thời gian xảy ra lỗi là tháng 7/2024.
*   **Sự thật:** Sự cố xảy ra vào ngày 19/7/2024, nhưng buổi điều trần của CrowdStrike trước Ủy ban An ninh Nội địa Hạ viện Mỹ thực tế diễn ra vào ngày **24 tháng 9 năm 2024** (do Phó Chủ tịch Adam Meyers đại diện điều trần), chứ không phải ngay trong tháng 7/2024.

### **Defect #7 – Cloudflare outage ngày 18/11/2025**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi hệ thống proxy bị panic và in ra log: `"fl2_worker_thread panicked: called Result::unwrap() on an Err value"`.
*   **Sự thật:** Theo post-mortem chính thức của Cloudflare, đoạn code Rust bị panic nằm trong module proxy chính (FL/FL2) khi thực hiện `unwrap()` trên giá trị `Err` do vượt giới hạn bộ nhớ. Tuy nhiên, Cloudflare không công bố chi tiết log thread cụ thể có tên `"fl2_worker_thread panicked"` – đây là chi tiết do AI tự suy diễn/bịa đặt thêm dựa trên cơ chế hoạt động của Rust.

### **Defect #8 – Atlassian xóa 883 site khách hàng tháng 4/2022**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi *"Không mất quá 5 phút dữ liệu (RPO đạt)"* cho tất cả khách hàng bị ảnh hưởng.
*   **Sự thật:** RPO (Recovery Point Objective) chỉ đạt đối với phần lớn khách hàng. Tuy nhiên, có **57 khách hàng** bị mất một phần dữ liệu Confluence và Insight do các bản sao lưu không nhất quán và Atlassian phải khôi phục thủ công từ dữ liệu cũ hơn.

### **Defect #9 – Toyota Nhật Bản đóng cửa 2 ngày vì hết đĩa cứng**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi hệ thống quản lý sản xuất bị tê liệt khiến *"toàn bộ 14 nhà máy tại Nhật Bản ngừng hoạt động 2 ngày"*.
*   **Sự thật:** Sự cố bảo trì diễn ra vào ngày 27/8/2023, dẫn đến việc dừng hoạt động vào sáng ngày 29/8/2023. Hệ thống được khôi phục vào ngày 29/8 sau khi chuyển dữ liệu sang ổ đĩa lớn hơn và các nhà máy hoạt động trở lại vào ngày **30/8/2023**. Tổng thời gian gián đoạn thực tế chỉ khoảng **1 ngày** (chưa đầy 36 giờ), không phải kéo dài 2 ngày đầy đủ như báo cáo ghi.

### **Defect #10 – Optus outage Úc do nâng cấp phần mềm**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi *"một người đàn ông bị đau tim không thể gọi cấp cứu"*.
*   **Sự thật:** Trong vụ việc này, người không thể gọi được cấp cứu Triple Zero thực tế là **một người phụ nữ** cố gắng gọi cấp cứu cho người chồng đang bị đau tim của mình (và người chồng sau đó đã tử vong).

### **Defect #11 – T-Mobile bị đánh cắp dữ liệu 37 triệu khách hàng**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi thời gian xảy ra lỗi là *"2023"*.
*   **Sự thật:** Mặc dù vụ việc được T-Mobile phát hiện và công bố vào ngày 5/1/2023, nhưng kẻ tấn công thực tế đã bắt đầu khai thác lỗ hổng API và thu thập dữ liệu từ ngày **25/11/2022** (tức là lỗi đã tồn tại và bị khai thác từ năm 2022).

### **Defect #12 – Twitter lộ 6.7 triệu email do lỗi bảo mật**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi *"6.7 triệu email duy nhất bị lộ (active accounts)"* và *"1.4 triệu email từ tài khoản bị đình chỉ"*.
*   **Sự thật:** Đây là sự không nhất quán về mặt toán học do AI tổng hợp sai. Thực tế, con số **6.7 triệu** là **tổng số** email bị rò rỉ (bao gồm cả tài khoản hoạt động và tài khoản bị đình chỉ), trong đó cơ sở dữ liệu ban đầu chứa khoảng 5.4 triệu tài khoản đang hoạt động và cơ sở dữ liệu bổ sung sau đó chứa 1.4 triệu tài khoản bị đình chỉ. Báo cáo ghi riêng số tài khoản active là 6.7 triệu là sai.

### **Defect #13 – LastPass bị xâm nhập nhiều lần**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi nguyên nhân gốc rễ là *"MFA bị vượt qua (kẻ tấn công impersonate developer sau khi họ đã xác thực)"*.
*   **Sự thật:** Kẻ tấn công không giả mạo developer sau khi MFA đã được xác thực (MFA session hijacking). Trong vụ tấn công thứ hai (Secondary Breach), kẻ tấn công đã hack máy tính cá nhân tại nhà của một kỹ sư DevOps cao cấp (qua lỗ hổng phần mềm Plex) và cài đặt keylogger để đánh cắp master password cùng mã MFA trực tiếp khi kỹ sư này đăng nhập.

### **Defect #14 – GitLab critical: Account Takeover qua password reset**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi bug tồn tại trong phiên bản *"16.1.0 tháng 5/2023"*.
*   **Sự thật:** GitLab phiên bản 16.1.0 thực tế được phát hành vào **ngày 22 tháng 6 năm 2023** (GitLab luôn phát hành phiên bản mới vào ngày 22 hàng tháng, phiên bản 16.0.0 mới được phát hành vào tháng 5/2023).

### **Defect #15 – Okta code repositories bị truy cập trái phép**
*   **Chi tiết sai lệch trong báo cáo:** Mục *"Nguyên nhân gốc rễ"* ghi: *"GitHub phát hiện suspicious access và báo Okta"*.
*   **Sự thật:** Đây là **phương pháp phát hiện** (detection method) chứ không phải nguyên nhân gốc rễ (root cause). Nguyên nhân gốc rễ thực tế là do thông tin xác thực (credentials/tokens) của nhân viên Okta trên GitHub đã bị lộ hoặc bị kẻ tấn công chiếm đoạt từ trước đó.

### **Defect #16 – Norfolk Southern outage do lỗi phần mềm vendor**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi *"Phục hồi hoàn toàn mất nhiều tuần"*.
*   **Sự thật:** Sự cố xảy ra vào ngày 28/8/2023 và hệ thống cốt lõi đã được Norfolk Southern khôi phục trong vòng chưa đầy 24 giờ. Các chuyến tàu đã bắt đầu hoạt động trở lại từ ngày 29/8/2023, việc giải quyết tồn đọng hàng hóa chỉ mất vài ngày chứ không phải hệ thống mất *"nhiều tuần"* để khôi phục hoàn toàn.

### **Defect #17 – Cl0p ransomware khai thác MOVEit vulnerability**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi lỗ hổng zero-day trong MOVEit Transfer là *"lỗ hổng SQL injection cho phép truy cập dữ liệu trái phép"*.
*   **Sự thật:** Mặc dù kỹ thuật khai thác ban đầu là SQL injection, nhưng tác động thực tế của lỗ hổng CVE-2023-34362 nghiêm trọng hơn nhiều: nó cho phép **thực thi mã từ xa trái phép (Remote Code Execution - RCE)** thông qua việc tải lên web shell LEMURLOOT, từ đó chiếm toàn bộ quyền kiểm soát máy chủ MOVEit Transfer chứ không chỉ đơn thuần là truy cập dữ liệu.

### **Defect #18 – Microsoft Teams và Azure outage tháng 1/2024**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi sự cố Microsoft Teams vào ngày 26/1/2024 *"kéo dài ~7 giờ"*.
*   **Sự thật:** Theo phân tích kỹ thuật của ThousandEyes và thông tin từ Microsoft, sự cố gián đoạn kết nối của Teams bắt đầu từ khoảng 11:00 AM UTC ngày 26/1 và chỉ thực sự được khắc phục tối ưu hoàn toàn vào khoảng 8:00 PM UTC cùng ngày. Thời gian gián đoạn kéo dài khoảng **9 giờ**, không phải 7 giờ.

### **Defect #19 – Alaska Airlines IT outage tháng 7/2025**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi nguyên nhân gốc rễ là do *"Hệ thống 'multi-redundant' vẫn không đủ vì cả hai hệ thống dự phòng đều bị ảnh hưởng"* và *"Thiếu đa dạng hóa hardware vendor"*.
*   **Sự thật:** Theo tuyên bố từ Alaska Airlines, sự cố là do sự sụp đổ của một **thiết bị phần cứng đa dự phòng (a single piece of multi-redundant hardware)** từ bên thứ ba tại trung tâm dữ liệu. Đây là lỗi thiết kế của bản thân phần cứng đó (được quảng cáo là có sẵn cơ chế dự phòng bên trong nhưng vẫn hỏng hoàn toàn) chứ không phải do hãng thiếu đa dạng hóa nhà cung cấp phần cứng.

### **Defect #20 – Microsoft 365 outage tháng 10/2024**
*   **Chi tiết sai lệch trong báo cáo:** Báo cáo ghi sản phẩm bị lỗi là *"Microsoft 365 (Outlook, Teams, Office suite)"* do lỗi *"Memory management issue"* trên hệ thống đám mây.
*   **Sự thật:** Đây là sự cố xảy ra cụ thể đối với **ứng dụng Outlook Client trên máy tính (Outlook Desktop App)** của người dùng do lỗi quản lý bộ nhớ cục bộ khiến ứng dụng bị crash hoặc ngốn RAM, không phải là sự cố sập dịch vụ đám mây (cloud outage) của toàn bộ bộ công cụ Microsoft 365 hay Teams.
