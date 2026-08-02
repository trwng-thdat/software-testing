# Ảnh minh chứng bug — Task 2 Usability

- **MSSV:** 23127344
- **Nguồn:** 9 bug `BUG-UX-01…10` (trừ 05) — bảng đầy đủ tại [`Main_Report.md`](../../Main_Report.md) §2.5

> Thư mục này gom **ảnh minh chứng cho 9 bug của Task 2** để đính vào GitHub Issues [#220–#228](https://github.com/DuyITLOR/group05_eshop/issues).
>
> Ảnh gốc nằm ở [`../../screenshot/`](../../screenshot/) (thư mục chung của Task 1). Ở đây là **bản sao có chọn lọc**, chỉ giữ những ảnh thật sự dùng cho Task 2 — để người chấm không phải dò trong 50 ảnh của Task 1.

## Bảng ánh xạ ảnh → bug → issue

| Ảnh | Bug | Issue | Nội dung ảnh |
| --- | --- | --- | --- |
| [`UX-01-password-rejected.png`](UX-01-password-rejected.png) | BUG-UX-01 | [#220](https://github.com/DuyITLOR/group05_eshop/issues/220) | Mật khẩu đúng theo mô tả trên form vẫn bị từ chối |
| [`UX-03-error-message.png`](UX-03-error-message.png) | BUG-UX-03 | [#221](https://github.com/DuyITLOR/group05_eshop/issues/221) | Thông báo lỗi lặp lại chính mô tả sai |
| [`UX-06-password-toggle.png`](UX-06-password-toggle.png) | BUG-UX-06 | [#222](https://github.com/DuyITLOR/group05_eshop/issues/222) | Nút hiện/ẩn mật khẩu chỉ hoạt động một chiều |
| [`UX-10-username-vs-email.png`](UX-10-username-vs-email.png) | BUG-UX-10 | [#223](https://github.com/DuyITLOR/group05_eshop/issues/223) | Nhãn "Username" nhưng xác thực bằng email |
| [`UX-02-no-confirm-password.png`](UX-02-no-confirm-password.png) | BUG-UX-02 | [#224](https://github.com/DuyITLOR/group05_eshop/issues/224) | Form Đăng ký chỉ có 1 ô mật khẩu, thiếu ô xác nhận |
| [`LOGIN-F02.png`](LOGIN-F02.png) | BUG-UX-04 | [#225](https://github.com/DuyITLOR/group05_eshop/issues/225) | Mật khẩu hiển thị rõ khi nhập (`type="text"`) |
| [`LOGIN-U01.png`](LOGIN-U01.png) | BUG-UX-07 **và** BUG-UX-08 | [#226](https://github.com/DuyITLOR/group05_eshop/issues/226) · [#227](https://github.com/DuyITLOR/group05_eshop/issues/227) | Trang Login hiển thị tiêu đề "Đăng Ký" **và** nhãn "Username"/"Sign In" tiếng Anh — cả hai lỗi nằm trên cùng một màn hình |
| [`LOGIN-F08.png`](LOGIN-F08.png) | BUG-UX-09 | [#228](https://github.com/DuyITLOR/group05_eshop/issues/228) | Email sai cú pháp vẫn được gửi đi, không báo lỗi |

## Phân loại theo nguồn gốc ảnh

**5 ảnh chụp riêng cho Task 2** (tiền tố `UX-`) — ghi lại thao tác của người dùng thật trong các phiên usability:

- `UX-01`, `UX-02`, `UX-03` — các bước trong form Đăng ký
- **`UX-06`** và **`UX-10`** — hai bug **chỉ phát hiện được qua người dùng thật**, bộ checklist 69 item của Task 1 không bắt được. `UX-06` cần thao tác bấm hai lần liên tiếp mới lộ ra; `UX-10` chỉ lộ khi đi trọn luồng đăng ký → đăng nhập.

**3 ảnh dùng lại từ Task 1** (tiền tố `LOGIN-`) — do Selenium chụp, ghi lại trạng thái kỹ thuật. Các bug tương ứng được phát hiện ở cả hai task: checklist bắt được *thuộc tính sai*, còn người dùng thật xác nhận *ảnh hưởng thực tế*.

> **Ghi chú về `LOGIN-U01.png`:** ảnh này phục vụ **hai** bug cùng lúc (BUG-UX-07 và BUG-UX-08) vì cả hai lỗi đều hiển thị trên cùng màn hình Đăng nhập. Trong `screenshot/` của Task 1, file `LOGIN-U02.png` là **bản sao y hệt** (cùng mã MD5) của `LOGIN-U01.png` — nên ở đây chỉ giữ một bản để tránh trùng lặp.
