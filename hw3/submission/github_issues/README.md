# Ảnh chụp GitHub Issues — Bằng chứng báo cáo bug

- **MSSV:** 23127344
- **Repo:** [`DuyITLOR/group05_eshop`](https://github.com/DuyITLOR/group05_eshop/issues)
- **Tài khoản tạo issue:** `trwng-thdat`

> Thư mục này đáp ứng §14: *"Bug report, with screenshots of the bugs on the GitHub Issues page."*
>
> Phân biệt với thư mục [`../screenshot/`](../screenshot/): thư mục đó chứa **ảnh chụp bug trên SUT** cho các item FAIL của checklist (§6 Task 1). Thư mục này chứa **ảnh chụp chính trang GitHub Issues**, chứng minh các bug đã được báo cáo thật lên hệ thống theo dõi lỗi.

## Danh sách ảnh

| Ảnh | Nội dung | Bao phủ |
| --- | --- | --- |
| [`issues_list_overview.png`](issues_list_overview.png) | Trang danh sách issue, filter `is:issue state:open author:@me` | Thấy rõ #149–#154 (Task 1), tác giả `trwng-thdat`, repo `DuyITLOR/group05_eshop` |

## Đối chiếu với báo cáo

| Task | Bug | GitHub Issue | Trạng thái |
| --- | --- | --- | --- |
| Task 1 — GUI Checklist | BUG-GUI-01…30 | [#125–#154](https://github.com/DuyITLOR/group05_eshop/issues) | ✅ Đã tạo — xem `Main_Report.md` §1.6 |
| Task 2 — Usability | BUG-UX-01…10 (9 bug) | [#220–#228](https://github.com/DuyITLOR/group05_eshop/issues) | ✅ Đã tạo — xem `Main_Report.md` §2.5 |
| Task 3 — Cross-Platform | BUG-CP-01…06 | [#213–#218](https://github.com/DuyITLOR/group05_eshop/issues) | ✅ Đã tạo — xem `Main_Report.md` §3.6 |

### Ánh xạ chi tiết — Task 2 (BUG-UX)

> Issue được tạo theo thứ tự ưu tiên (bug nặng trước), nên số issue **không** tăng theo thứ tự bug ID.

| Bug | GitHub Issue | Severity | Tần suất |
| --- | --- | --- | --- |
| BUG-UX-01 — Mật khẩu đúng mô tả vẫn bị từ chối | [#220](https://github.com/DuyITLOR/group05_eshop/issues/220) | **Critical** | 7/7 |
| BUG-UX-03 — Thông báo lỗi lặp lại mô tả sai | [#221](https://github.com/DuyITLOR/group05_eshop/issues/221) | **Critical** | 7/7 |
| BUG-UX-06 — Toggle hiện/ẩn mật khẩu hỏng | [#222](https://github.com/DuyITLOR/group05_eshop/issues/222) | High | 2/7 |
| BUG-UX-10 — Nhãn "Username" vs xác thực bằng email | [#223](https://github.com/DuyITLOR/group05_eshop/issues/223) | High | 2/7 |
| BUG-UX-02 — Thiếu trường Xác nhận mật khẩu | [#224](https://github.com/DuyITLOR/group05_eshop/issues/224) | High | 1/7 |
| BUG-UX-04 — Mật khẩu không che ở trang Đăng nhập | [#225](https://github.com/DuyITLOR/group05_eshop/issues/225) | High | 4/7 |
| BUG-UX-07 — Trang Login hiển thị tiêu đề "Đăng Ký" | [#226](https://github.com/DuyITLOR/group05_eshop/issues/226) | Medium | 4/7 |
| BUG-UX-08 — Ngôn ngữ lẫn lộn Việt/Anh | [#227](https://github.com/DuyITLOR/group05_eshop/issues/227) | Low | 1/7 |
| BUG-UX-09 — Không kiểm tra cú pháp email | [#228](https://github.com/DuyITLOR/group05_eshop/issues/228) | Medium | 1/7 |

**BUG-UX-06** và **BUG-UX-10** là hai bug **chỉ phát hiện được qua người dùng thật** — bộ checklist 69 item của Task 1 không bắt được.

### Ánh xạ chi tiết — Task 3 (BUG-CP)

| Bug | GitHub Issue | Severity | Case |
| --- | --- | --- | --- |
| BUG-CP-01 — `@media` lồng không được biên dịch | [#213](https://github.com/DuyITLOR/group05_eshop/issues/213) | High | CB-01 |
| BUG-CP-02 — Định dạng tiền tệ đổi theo locale | [#214](https://github.com/DuyITLOR/group05_eshop/issues/214) | High | CB-06 |
| BUG-CP-03 — Sửa được tổng tiền đơn hàng | [#215](https://github.com/DuyITLOR/group05_eshop/issues/215) | **Critical** | CB-08 |
| BUG-CP-04 — Ô số lượng thiếu min/max/step | [#216](https://github.com/DuyITLOR/group05_eshop/issues/216) | Medium | CB-05 |
| BUG-CP-05 — `alert()` chặn luồng, mobile tắt được | [#217](https://github.com/DuyITLOR/group05_eshop/issues/217) | Medium | CB-13 |
| BUG-CP-06 — Vùng bấm dưới 44×44px | [#218](https://github.com/DuyITLOR/group05_eshop/issues/218) | Medium | CB-18 |

## Việc còn lại

- [ ] Chụp bổ sung **2–3 ảnh issue chi tiết** cho các bug Critical/High, thấy rõ **ảnh bug đã được đính kèm trong body issue** — §6 Task 1 yêu cầu *"Remember to attach bug screenshots to each GitHub issue"*, mà ảnh danh sách hiện tại chưa chứng minh được điều này.
  - Gợi ý chọn: [#128](https://github.com/DuyITLOR/group05_eshop/issues/128) (XSS, Critical) · [#131](https://github.com/DuyITLOR/group05_eshop/issues/131) (SQL Injection, Critical) · [#136](https://github.com/DuyITLOR/group05_eshop/issues/136) (mật khẩu không che, High)
- [ ] Chụp lại ảnh trang Issues sau khi đã có đủ **45 issue** của cả 3 task (#125–#154, #213–#218, #220–#228)

## Ghi chú về ảnh hiện tại

Ảnh chụp ở chế độ lọc `author:@me` nên hiển thị **50 issue open** — bao gồm cả issue thuộc các bài tập khác ngoài HW03. Riêng HW03 Task 1 là **30 issue (#125–#154)**, đối chiếu đầy đủ trong bảng bug tại `Main_Report.md` §1.6.
