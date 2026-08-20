# Phê bình AI — HW06 Kiểm thử API

**MSSV:** 23127344 · **Họ tên:** Trương Thành Đạt · **Công cụ AI:** Claude Opus 5 (Claude Code) · **Ngày:** 20/08/2026

---

Qua bài này AI sai theo một mô thức nhất quán: nó sinh ra thứ **trông đúng nhưng chưa được neo vào hành vi thật** của hệ thống, và cái sai chỉ lộ khi tôi buộc chạy thật.

Rõ nhất là **tin vào công cụ trung gian thay vì nguồn thật**. Khi tạo 12 saved example cho mock server, AI đọc báo cáo JSON của Newman và lấy execution đầu tiên của mỗi test case. Kết quả: 4/12 example bị sai — example của một request `PUT` lại mang body của lệnh `GET` xác minh, vì Newman ghi mọi `pm.sendRequest` vào cùng một item. Tôi chỉ phát hiện khi mở đúng ô `TC-API1-001`. Cách sửa là bỏ nguồn Newman, gọi thẳng SUT trong `record_examples.js`.

Dạng thứ hai là **hiểu sai ngữ nghĩa runtime**. AI viết các assertion đọc lại DB thành nhiều `pm.test` riêng, tưởng chúng chạy tuần tự; thực ra Postman không chờ `pm.test` bất đồng bộ, nên `A2-E03` đọc trạng thái trước khi lệnh trước kịp ghi.

Dạng thứ ba là **lỗi số học và phán đoán phạm vi**: AI đếm "17 lỗi" trong khi chỉ có 16 (bỏ sót BUG-10 khi đánh số), và ban đầu định bỏ qua các lỗi đã có issue của người khác — hiểu sai rằng mỗi HW là độc lập.

Vì sao AI không tự thấy? Vì mỗi bước nó chỉ nhìn được dữ liệu trong tầm: script validate của chính nó chạy sạch, JSON của Newman "hợp lệ", nên không có tín hiệu nào báo sai.

Nguyên tắc tôi rút ra: **AI mạnh khi kiểm chứng đối chiếu nguồn thật, yếu khi suy diễn qua một lớp trung gian.** Mọi con số trong bài này tôi đều bắt AI truy về response thật của SUT hoặc báo cáo Newman đã chạy.

_Số từ: 296._
