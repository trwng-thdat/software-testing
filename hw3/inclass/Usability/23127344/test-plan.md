# Kế hoạch usability test U-03

- Ngày: 2026-07-20
- Website: https://lumierecinema-testing-demo-ui.vercel.app/
- Flow: U-03 — Tìm kiếm phim, xem chi tiết, thêm/xóa wishlist
- FR: FR-10, FR-14, FR-15, FR-16, FR-35, FR-37
- Timebox: 8 phút/người
- Người điều phối: CHƯA THU THẬP
- Thiết bị/trình duyệt test chính: CHƯA THU THẬP
- Tài khoản test đã đăng nhập sẵn (cho wishlist): CHƯA THU THẬP

## Mục tiêu

Đánh giá liệu người dùng có thể tự **tìm được một phim cụ thể**, **đọc thông tin chi tiết để ra quyết định**, và **lưu/bỏ phim khỏi danh sách muốn xem (wishlist)** hay không — mà không cần hướng dẫn từng bước. Tập trung vào: hiệu quả của tìm kiếm và gợi ý tìm kiếm (FR-16), tính đầy đủ/dễ đọc của trang chi tiết (FR-15), và mức độ người dùng **hiểu và tin** rằng thao tác thêm/xóa wishlist đã thành công (FR-10, FR-37).

## Task scenario

> Một người bạn vừa nhắc bạn về một bộ phim đang được nói tới nhiều gần đây, nhưng bạn chưa nhớ rõ nội dung. Bạn muốn lên Lumiere Cinema để tìm phim đó, xem qua thông tin để quyết định có nên đi xem không. Trong lúc đó, hãy lưu lại 2 phim mà bạn thấy quan tâm để xem sau. Cuối cùng, bạn đổi ý về một trong số đó — hãy bỏ nó ra khỏi danh sách đã lưu.

> Ghi chú cho người điều phối (không đọc cho người tham gia): đưa cho họ **một từ khóa tên phim có thật trên hệ thống** để tìm (điền vào ô bên dưới). Không gọi tên tính năng "wishlist" / "Now Showing"; để họ tự tìm cách "lưu phim".

- Từ khóa phim dùng cho phần tìm kiếm: CHƯA THU THẬP
- 2 phim gợi ý để người tham gia lưu (nếu họ phân vân): CHƯA THU THẬP

## Điều kiện

- **Bắt đầu:** trình duyệt đã mở trang chủ; **đã đăng nhập sẵn** bằng tài khoản test (moderator đăng nhập trước phiên, vì thêm wishlist yêu cầu đăng nhập theo FR-10); wishlist đang trống; chưa mở menu, chưa gõ tìm kiếm.
- **Thành công (SUCCESS):** người tham gia (1) mở được trang chi tiết đúng phim vừa tìm, (2) đã lưu 2 phim vào danh sách muốn xem, và (3) đã xóa 1 phim khỏi danh sách đó — tự xác nhận được là danh sách còn đúng 1 phim.
- **Thất bại (FAIL):** bỏ cuộc, hết timebox, bị kẹt không phục hồi, hoặc không đạt được cả 3 điều kiện thành công.
- **Edge — không tìm thấy phim:** nếu từ khóa không ra kết quả, quan sát empty state (FR-37), rồi đổi sang từ khóa khác đã chuẩn bị và ghi deviation.
- **Edge — thêm trùng:** nếu người tham gia vô tình lưu lại một phim đã có trong danh sách, ghi lại hệ thống phản hồi thế nào (FR-10 cấm thêm trùng).

## Chỉ số thu thập mỗi phiên

- Outcome: `SUCCESS_UNASSISTED`, `SUCCESS_ASSISTED`, `FAIL`, `ABANDONED`.
- Thời lượng hoàn thành (giây).
- Số error (thao tác sai dẫn tới kết quả ngoài ý muốn).
- Số wrong turn (đi nhầm hướng rồi phải quay lại).
- Số lần hesitation >= 5 giây.
- Số lần moderator can thiệp.
- Kết quả cụ thể: tìm đúng phim (Y/N), số phim đã lưu, xóa được phim (Y/N), tự xác nhận danh sách cuối đúng (Y/N).

## Checklist trước phiên

- [ ] Có đồng thuận tham gia/ghi hình nếu áp dụng.
- [ ] Dùng mã P01–P03, không ghi dữ liệu cá nhân không cần thiết.
- [ ] Đăng nhập sẵn tài khoản test; xác nhận wishlist đang trống.
- [ ] Xác minh từ khóa phim đã chuẩn bị thực sự ra kết quả trên hệ thống.
- [ ] Kiểm tra website và đồng hồ bấm giờ.
- [ ] Chuẩn hóa start state (trang chủ, chưa tìm kiếm).
- [ ] Không tập trước flow cho người tham gia; nói rõ "test hệ thống, không test bạn".
