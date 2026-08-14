# AI Critique — HW05 Kiểm thử Hiệu năng

**MSSV:** 23127344 · **Công cụ AI:** Claude Opus 5 (Claude Code) · **Ngày:** 14/08/2026

---

AI sai theo một mô thức nhất quán qua 15 lượt tương tác: nó tạo ra **cấu trúc trông đúng nhưng chưa được neo vào hành vi thật** của hệ thống. Ba dạng lỗi lặp lại.

Thứ nhất là **bịa dữ kiện khi thiếu thông tin**. AI đề xuất endpoint `/api/profile` không tồn tại, và đưa mã giảm giá `TET2025` vốn chỉ là ví dụ trong tài liệu vào file dữ liệu thật — không phân biệt được *mô tả schema* với *dữ liệu đã seed*.

Thứ hai là **hiểu sai ngữ nghĩa runtime**. Bốn lỗi JMeter — CSV đọc theo vòng lặp chứ không theo thread, timer áp dụng cho toàn scope, giá trị mặc định `0` che giấu lỗi — đều lọt qua kiểm tra XML. File hợp lệ, test chạy được, xuất `.jtl` bình thường, nhưng đo sai.

Thứ ba là **nhầm thước đo với thứ được đo**. Ở Task 2, AI kết luận "chịu được 100 VU nên mở rộng tốt", trong khi think time chiếm 99,89% thời gian khiến 100 VU chỉ tạo 22 req/s.

Vì sao AI không tự phát hiện? Vì mỗi công cụ chỉ thấy loại lỗi nằm trong **phạm vi dữ liệu nó được nhìn**. Script `validate_jmx.py` do chính AI viết chạy sạch cả ba file, nhưng không thể biết 120 tài khoản trong CSV không tồn tại trong CSDL — thông tin đó không nằm trong file nó đọc.

Nguyên tắc tôi rút ra: **AI mạnh khi kiểm chứng, yếu khi phán đoán thiếu thông tin.** Năm trong sáu artifact đạt VALID là lượt rà soát; bảy artifact cần sửa đều là lượt sinh mới. Đáng chú ý hơn, hai lỗi phát sinh ngay trong lúc sửa lỗi khác — nên mỗi bản sửa cũng cần một vòng kiểm chứng riêng.
