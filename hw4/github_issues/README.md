# Ảnh chụp GitHub Issues — hướng dẫn

> Đề bài §16 yêu cầu gói nộp phải có: *"Bug report, **with screenshots of the bugs on the GitHub Issues page**"*.
>
> Đây là **bằng chứng em đã thật sự tạo issue trên GitHub** — khác hoàn toàn với ảnh trong [`../selenium/bug-snapshots/`](../selenium/bug-snapshots/) (ảnh chụp trình duyệt lúc test FAIL, do `utils/bugReporter.ts` sinh tự động).
>
> | Loại ảnh | Chụp cái gì | Ở đâu |
> | -------- | ----------- | ----- |
> | `bug-snapshots/*.png` | Màn hình SUT lúc test fail | Đã có sẵn (13 ảnh, tự động) |
> | `github_issues/*.png` | **Trang GitHub Issues** | **Cần chụp thủ công** |

## Trạng thái hiện tại (đã kiểm bằng `gh`)

| Mục | Kết quả |
| --- | ------- |
| Số issue đã tạo | **13 / 13** ✅ (#260 → #272) |
| Ảnh đính kèm trong mỗi issue | ✅ cả 13 issue đều có 1 ảnh |
| Tác giả | `trwng-thdat` ✅ |
| Repo | `DuyITLOR/group05_eshop` (repo của SUT) |
| Nhãn (label) | ❌ chưa gán — *không bắt buộc, nhưng gán thì chuyên nghiệp hơn* |

## Cần chụp những ảnh nào

### 1. `01-issues-list.png` — **quan trọng nhất, bắt buộc**

Ảnh chụp **danh sách Issues** thấy được cả 13 issue trong một khung hình.

- Mở: https://github.com/DuyITLOR/group05_eshop/issues
- Gõ vào ô tìm kiếm để lọc đúng 13 issue của em:
  ```
  is:issue author:trwng-thdat
  ```
- Thu nhỏ trang (`Ctrl` + `-`) đến khi thấy đủ cả 13 dòng.
- Chụp **toàn màn hình**, phải thấy rõ: thanh địa chỉ chứa tên repo, tiêu đề `[BUG-xx]…`, và số issue `#260`–`#272`.

### 2. `02-issue-260-critical.png` — mở 1 issue chi tiết

Chụp **một issue mở ra đầy đủ**, chọn BUG-04 (#260) vì đây là lỗi Critical.

- Mở: https://github.com/DuyITLOR/group05_eshop/issues/260
- Cuộn sao cho thấy được: tiêu đề, phần mô tả, **và ảnh đính kèm bên dưới**.
- Mục đích: chứng minh issue có nội dung thật + có ảnh, không phải issue rỗng.

### 3. (Khuyến nghị) `03-issue-262-security.png`

Chụp thêm #262 (BUG-11 — lỗ hổng phân quyền, Critical, defect nặng nhất của bài).

> 💡 **Tối thiểu 2 ảnh là đủ** (danh sách + 1 chi tiết). Chụp thêm 1 ảnh thứ ba thì hồ sơ đầy đủ hơn.

## Danh sách 13 issue để đối chiếu

| Issue | Bug | Mức độ | Link |
| ----- | --- | ------ | ---- |
| #260 | BUG-04 | Critical | https://github.com/DuyITLOR/group05_eshop/issues/260 |
| #261 | BUG-07 | Critical | https://github.com/DuyITLOR/group05_eshop/issues/261 |
| #262 | BUG-11 | Critical | https://github.com/DuyITLOR/group05_eshop/issues/262 |
| #263 | BUG-01 | High | https://github.com/DuyITLOR/group05_eshop/issues/263 |
| #264 | BUG-02 | High | https://github.com/DuyITLOR/group05_eshop/issues/264 |
| #265 | BUG-06 | High | https://github.com/DuyITLOR/group05_eshop/issues/265 |
| #266 | BUG-09 | High | https://github.com/DuyITLOR/group05_eshop/issues/266 |
| #267 | BUG-10 | High | https://github.com/DuyITLOR/group05_eshop/issues/267 |
| #268 | BUG-12 | High | https://github.com/DuyITLOR/group05_eshop/issues/268 |
| #269 | BUG-03 | Medium | https://github.com/DuyITLOR/group05_eshop/issues/269 |
| #270 | BUG-05 | Medium | https://github.com/DuyITLOR/group05_eshop/issues/270 |
| #271 | BUG-08 | Medium | https://github.com/DuyITLOR/group05_eshop/issues/271 |
| #272 | BUG-13 | Medium | https://github.com/DuyITLOR/group05_eshop/issues/272 |

## Lưu ý khi chụp

- **Đừng cắt mất thanh địa chỉ** — URL chứa tên repo là bằng chứng issue nằm đúng chỗ.
- **Đừng che tên tài khoản** `trwng-thdat` — đó là bằng chứng tác giả, đúng tinh thần §11 chống gian lận.
- Chụp ở chế độ sáng (light mode) cho dễ đọc khi in ra PDF.
- Đặt tên file có số thứ tự (`01-`, `02-`) để giữ đúng trật tự trong gói nộp.
