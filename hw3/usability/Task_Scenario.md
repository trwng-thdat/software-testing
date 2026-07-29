# Usability Task Scenario — Luồng Đăng ký → Đăng nhập (EShop)

- **MSSV:** 23127344
- **SUT:** EShop — `frontend-web` tại `http://localhost:5173`
- **Luồng:** FR-01 (Đăng ký tài khoản) → FR-02 (Đăng nhập & khóa tài khoản)
- **Timebox đề xuất:** 8 phút/người

## Mục tiêu (Objectives)

1. Người dùng mới có tự đăng ký thành công **mà không cần trợ giúp** không, đặc biệt khi gặp yêu cầu mật khẩu mạnh (điều kiện thực tế của form khác với thông báo lỗi hiển thị — xem `Register.jsx:15`)?
2. Người dùng có nhận ra và tự phục hồi được khi đăng ký thất bại (lỗi mật khẩu, email trùng) hay bị "kẹt" không hiểu vì sao?
3. Sau khi đăng ký, người dùng có tự tìm được đường sang đăng nhập và đăng nhập thành công ngay lần đầu không?
4. Người dùng cảm thấy tự tin/tin tưởng ra sao ở từng bước — đặc biệt khi thấy mật khẩu hiển thị rõ dạng chữ thường ở màn Login?

## Task Scenario (đọc cho người tham gia)

> "Bạn vừa nghe bạn bè giới thiệu một trang mua sắm trực tuyến tên là **EShop**. Hãy tạo cho mình một tài khoản mới trên trang này bằng thông tin cá nhân bất kỳ (không cần dùng email thật), sau đó đăng nhập vào tài khoản vừa tạo để bắt đầu mua sắm."

Đây là mục tiêu (goal), **không phải hướng dẫn từng bước**. Không nói cho người tham gia biết yêu cầu mật khẩu cụ thể hay vị trí nút bấm.

## Ghi chú cho điều phối viên (KHÔNG đọc cho người tham gia)

- Chuẩn bị sẵn 1 email chưa từng đăng ký trong hệ thống cho mỗi người (gợi ý: `participantP0X@test.local`) để tránh nhiễu do trùng email ở lần thử đầu.
- Nếu người tham gia tự chọn trùng email đã tồn tại (VD `test@eshop.com`), đây cũng là quan sát hợp lệ — hệ thống không có ràng buộc `UNIQUE` cho email, ghi nhận lại phản ứng của người dùng khi không thấy lỗi báo trùng.
- Không gợi ý về quy tắc mật khẩu; chỉ quan sát người dùng tự đọc dòng chú thích "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt." và phản ứng ra sao khi bị từ chối dù nhập đúng theo chú thích đó.

## Điều kiện

- **Bắt đầu:** trình duyệt đã mở sẵn trang chủ EShop (`http://localhost:5173`), chưa đăng nhập, chưa mở trang Đăng ký.
- **Thành công (SUCCESS):** người tham gia (1) đăng ký được tài khoản mới thành công, (2) tự điều hướng sang trang đăng nhập (tự nhấn hoặc bị tự động chuyển), (3) đăng nhập thành công bằng tài khoản vừa tạo.
- **Thất bại (FAIL):** bỏ cuộc, hết timebox, bị kẹt không phục hồi (VD: lặp lại y hệt 1 mật khẩu sai nhiều lần không tự đổi cách), hoặc không đạt đủ 3 điều kiện thành công.
- **Edge — mật khẩu bị từ chối nhiều lần:** nếu người tham gia thử nhiều mật khẩu khác nhau và vẫn bị từ chối, ghi lại đúng các mật khẩu đã thử và thời điểm bỏ cuộc/persist.
- **Edge — không có xác nhận mật khẩu:** quan sát xem người dùng có tự nhận ra thiếu trường "Xác nhận mật khẩu" (khác biệt so với đa số web quen thuộc) hay không, và phản ứng của họ.

## Chỉ số thu thập mỗi phiên

- Outcome: `SUCCESS_UNASSISTED`, `SUCCESS_ASSISTED`, `FAIL`, `ABANDONED`.
- Thời lượng hoàn thành (giây).
- Số lần submit form Đăng ký bị lỗi trước khi thành công.
- Số lần hesitation ≥ 5 giây.
- Số lần moderator can thiệp.
- Đăng ký thành công ở lần thử thứ mấy.
- Có tự hiểu đúng yêu cầu mật khẩu trước khi thử không (Y/N).
- Đăng nhập thành công ngay sau đăng ký (Y/N).

## Checklist trước phiên

- [ ] Có đồng thuận tham gia/ghi hình nếu áp dụng.
- [ ] Dùng mã P01–P07, không ghi dữ liệu cá nhân không cần thiết.
- [ ] Chuẩn bị sẵn email test riêng cho từng người, xác nhận email đó chưa tồn tại trong hệ thống.
- [ ] Kiểm tra `frontend-web` (`:5173`) và `backend` (`:3000`) đang chạy.
- [ ] Chuẩn hóa start state (trang chủ, chưa đăng nhập).
- [ ] Không tập trước flow cho người tham gia; nói rõ "test hệ thống, không test bạn".
- [ ] Đã chạy pilot session 1 người, ghi nhận điều chỉnh (nếu có) trước khi chạy 7 phiên chính thức.
