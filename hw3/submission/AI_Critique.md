# AI Critique — HW03 GUI & Usability Testing

- **MSSV:** 23127344
- **Họ tên:** Trương Thành Đạt
- **Lớp:** Kiểm thử phần mềm — 23KTPM3
- **Công cụ AI đã dùng:** Claude Code (Sonnet 5 và Opus 5)

---

Điểm sai rõ nhất của AI trong bài này là **khẳng định vượt quá bằng chứng nó có**. Khi thực thi Task 3, script do AI viết kết luận lỗi CSS nesting khiến nút "Thêm vào giỏ hàng" *"bị đẩy 100px ra ngoài màn hình"*. Nhưng mở đúng tấm ảnh mà chính nó chụp thì nút vẫn nằm gọn trong khung, và case CB-02 trong cùng bộ dữ liệu lại ghi PASS với ghi chú *"Button inside viewport (right=225 ≤ 412)"*. AI đo đúng `margin-right = -100px`, rồi **suy diễn** hậu quả thay vì kiểm chứng. Nó không tự bắt được vì chưa bao giờ *nhìn* ảnh — chỉ đọc số rồi viết ra kết luận nghe hợp lý.

Lỗi thứ hai cùng bản chất: khi rà tiến độ, AI thấy số ô `TODO` giảm từ 50 xuống 35 và kết luận em đã điền thêm dữ liệu quan sát. Thực tế con số giảm vì chính AI viết lại file làm mất bớt dòng mẫu. Nó đã chọn một **đại lượng thay thế** (đếm TODO) thay vì kiểm tra đúng thứ cần biết, và đại lượng ấy bị nhiễu bởi hành động của chính nó.

Điều khiến em chú ý là AI hoạt động rất khác nhau tuỳ loại việc. Khi có **oracle độc lập** — đề bài đối chiếu cây thư mục, `results.json` đối chiếu báo cáo — nó chính xác và còn tự phát hiện được lỗi em không thấy, như hai file `README.md` và `bug_reports.md` bị xoá ngoài ý muốn lúc di chuyển thư mục. Khi phải **tự sinh nội dung mới**, nó luôn cần người kiểm lại: bộ checklist đầu tiên chỉ có 32 item giáo khoa, thiếu hẳn accessibility, dark mode và RTL cho tới khi em yêu cầu đọc source thật.

Nguyên tắc em rút ra: **AI đo được thì tin, AI suy ra thì phải kiểm.** Nó mạnh ở đối chiếu hai nguồn có sẵn, yếu ở khoảng cách giữa dữ liệu và kết luận. Vì thế ở Task 2 em chủ động không cho AI điền điểm SUS, thời lượng phiên hay lời trích nguyên văn — không chỉ vì §11 cấm, mà vì đó chính là loại việc nó sẽ tạo ra thứ nghe rất thuyết phục nhưng không ai kiểm chứng được.

*(≈300 từ)*
