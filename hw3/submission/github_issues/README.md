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
| Task 2 — Usability | BUG-UX-01…10 | — | ⬜ **Chưa tạo** |
| Task 3 — Cross-Platform | BUG-CP-01…06 | — | ⬜ **Chưa tạo** — nội dung soạn sẵn tại `HW03_TASK3_GITHUB_ISSUES.md` (thư mục gốc repo) |

## Việc còn lại

- [ ] Chụp bổ sung **2–3 ảnh issue chi tiết** cho các bug Critical/High, thấy rõ **ảnh bug đã được đính kèm trong body issue** — §6 Task 1 yêu cầu *"Remember to attach bug screenshots to each GitHub issue"*, mà ảnh danh sách hiện tại chưa chứng minh được điều này.
  - Gợi ý chọn: [#128](https://github.com/DuyITLOR/group05_eshop/issues/128) (XSS, Critical) · [#131](https://github.com/DuyITLOR/group05_eshop/issues/131) (SQL Injection, Critical) · [#136](https://github.com/DuyITLOR/group05_eshop/issues/136) (mật khẩu không che, High)
- [ ] Tạo issue cho bug Task 2 và Task 3, rồi chụp bổ sung ảnh danh sách
- [ ] Chụp lại ảnh tổng sau khi có đủ issue của cả 3 task

## Ghi chú về ảnh hiện tại

Ảnh chụp ở chế độ lọc `author:@me` nên hiển thị **50 issue open** — bao gồm cả issue thuộc các bài tập khác ngoài HW03. Riêng HW03 Task 1 là **30 issue (#125–#154)**, đối chiếu đầy đủ trong bảng bug tại `Main_Report.md` §1.6.
