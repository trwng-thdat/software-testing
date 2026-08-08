# Ảnh chụp GitHub Issues

> Đề bài §16 yêu cầu gói nộp phải có: *"Bug report, **with screenshots of the bugs on the GitHub Issues page**"*.
>
> Đây là bằng chứng **13 bug đã được báo cáo thật trên GitHub** — khác với ảnh trong [`../selenium/bug-snapshots/`](../selenium/bug-snapshots/) (ảnh chụp trình duyệt lúc test FAIL, sinh tự động bởi `utils/bugReporter.ts`).

## Ảnh trong thư mục này

| File | Nội dung |
| ---- | -------- |
| [`01-issues-list-hw04.png`](01-issues-list-hw04.png) | Trang **Issues** của repo SUT `DuyITLOR/group05_eshop`, lọc theo `is:issue state:open author:trwng-thdat`. Thấy rõ thanh địa chỉ, tên tài khoản tác giả, và các issue `[BUG-xx][Mức độ][FR-xx]` — từ #272 xuống #266. |

**Ảnh chứng minh được gì:**

- ✅ Issue **tồn tại thật** trên GitHub, trong repo của SUT.
- ✅ Tác giả là **`trwng-thdat`** — hiện ở cả ô lọc lẫn dòng `#272 · trwng-thdat opened…` của từng issue (bằng chứng tác giả theo §11).
- ✅ Tiêu đề theo đúng quy ước `[BUG-xx][Mức độ][FR-xx]`, khớp bảng §1.9 [`Main_Report.md`](../Main_Report.md).
- ✅ URL đầy đủ trên thanh địa chỉ, không bị cắt.

> ℹ️ **Hai điểm cần đọc đúng ảnh, tránh hiểu nhầm:**
>
> 1. Ảnh hiển thị **7 issue** (#272 → #266) vì phần còn lại nằm ngoài vùng cuộn. Đủ 13 issue `#260`–`#272` liệt kê ở bảng dưới, mỗi dòng đều là link mở trực tiếp để đối chiếu.
> 2. Bộ đếm **"Open 78"** là tổng số issue đang mở **do tài khoản `trwng-thdat` tạo trên toàn repo** (gồm cả các bài tập khác), **không phải** số issue của HW04. Riêng HW04 là **đúng 13 issue**, số hiệu liên tiếp #260–#272.

## 13 issue của HW04

Repo SUT: https://github.com/DuyITLOR/group05_eshop/issues

| Issue | Bug | TC ID | Feature | Mức độ | Tiêu đề |
| ----- | --- | ----- | ------- | ------ | ------- |
| [#260](https://github.com/DuyITLOR/group05_eshop/issues/260) | BUG-04 | TC-PROFILE-12 | FR-04 | **Critical** | Leo thang đặc quyền qua `PUT /api/users/me` |
| [#261](https://github.com/DuyITLOR/group05_eshop/issues/261) | BUG-07 | TC-CHECKOUT-07 | FR-08 | **Critical** | Khách tự sửa được tổng tiền đơn hàng |
| [#262](https://github.com/DuyITLOR/group05_eshop/issues/262) | BUG-11 | TC-ADMIN-12 | FR-18 | **Critical** | Mọi API `/api/admin/*` không kiểm `role` |
| [#263](https://github.com/DuyITLOR/group05_eshop/issues/263) | BUG-01 | TC-PROFILE-04 | FR-04 | High | SĐT hợp lệ 10 chữ số bị từ chối |
| [#264](https://github.com/DuyITLOR/group05_eshop/issues/264) | BUG-02 | TC-PROFILE-05 | FR-04 | High | SĐT hợp lệ 11 chữ số bị từ chối |
| [#265](https://github.com/DuyITLOR/group05_eshop/issues/265) | BUG-06 | TC-CHECKOUT-04 | FR-08 | High | Công thức giảm giá percent bị đảo dấu |
| [#266](https://github.com/DuyITLOR/group05_eshop/issues/266) | BUG-09 | TC-CHECKOUT-16 | FR-08 | High | Giỏ rỗng vẫn tạo được đơn hàng |
| [#267](https://github.com/DuyITLOR/group05_eshop/issues/267) | BUG-10 | TC-ADMIN-07 | FR-18 | High | Cho phép `canceled → delivered` |
| [#268](https://github.com/DuyITLOR/group05_eshop/issues/268) | BUG-12 | TC-ADMIN-14 | FR-18 | High | XSS lưu trữ ở địa chỉ giao hàng |
| [#269](https://github.com/DuyITLOR/group05_eshop/issues/269) | BUG-03 | TC-PROFILE-08 | FR-04 | Medium | SĐT không bắt đầu bằng `0` lại được chấp nhận |
| [#270](https://github.com/DuyITLOR/group05_eshop/issues/270) | BUG-05 | TC-CHECKOUT-03 | FR-08 | Medium | Giỏ hàng không được xóa sau thanh toán |
| [#271](https://github.com/DuyITLOR/group05_eshop/issues/271) | BUG-08 | TC-CHECKOUT-13 | FR-08 | Medium | Lỗi biên ngưỡng coupon (`>` thay vì `>=`) |
| [#272](https://github.com/DuyITLOR/group05_eshop/issues/272) | BUG-13 | TC-ADMIN-16 | FR-18 | Medium | UI hiện nút chuyển tiếp ở trạng thái kết thúc |

**Trạng thái đã kiểm bằng `gh` (GitHub CLI):**

| Mục | Kết quả |
| --- | ------- |
| Số issue | **13 / 13** ✅ (#260 → #272, số hiệu liên tiếp) |
| Ảnh đính kèm trong mỗi issue | ✅ cả 13 issue đều có ảnh chụp bug |
| Trạng thái | OPEN (chưa được sửa — đúng, vì SUT cố ý cài lỗi) |
| Tác giả | `trwng-thdat` ✅ |

## Vì sao issue nằm ở repo khác với repo bài làm

| Repo | Vai trò |
| ---- | ------- |
| [`trwng-thdat/software-testing`](https://github.com/trwng-thdat/software-testing) | **Bài làm** — script Selenium, dữ liệu, 9 báo cáo HTML, Agent Skill |
| [`DuyITLOR/group05_eshop`](https://github.com/DuyITLOR/group05_eshop) | **SUT (EShop)** — nơi tạo 13 issue |

Bug được báo trên repo **chứa mã lỗi**, không phải repo của người kiểm thử — đúng thực tế ngành: issue phải nằm ở nơi lập trình viên sửa được.

## Nội dung mỗi issue

Mỗi issue gồm đầy đủ: mô tả · môi trường (3 trình duyệt) · các bước tái hiện · kết quả mong đợi **trích SRS** · kết quả thực tế · **nguyên nhân gốc kèm `file:dòng`** · mức độ ảnh hưởng · **ảnh chụp đính kèm**.

Nội dung gốc soạn sẵn ở [`../bug_report.md`](../bug_report.md).
