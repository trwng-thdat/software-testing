# Bài tập: Usability Testing cho Lumiere Cinema

## 1. Hệ thống kiểm thử

Lumiere Cinema là website đặt vé xem phim và quản lý rạp chiếu phim.

| Thành phần | URL mặc định |
| ---------- | ------------ |
| Frontend đã deploy | `https://lumierecinema-testing-demo-ui.vercel.app/` |

## 2. Tài khoản kiểm thử cho đăng ký thất bại

Dùng cho flow U-05.

```text
Email: cust<num>@cust.vn
Trong đó <num> từ 1 đến 10
Mật khẩu: Abc123!!
```

Ví dụ: `cust1@cust.vn`, `cust2@cust.vn`, ..., `cust10@cust.vn`.

Các email này được xem là đã tồn tại, dùng để test việc đăng ký bằng email trùng.

---

## 3. Chọn luồng kiểm thử

Mỗi sinh viên chọn **1 luồng** trong bảng sau. Khi báo cáo phải ghi đúng mã luồng và các FR tương ứng.

| Mã | Luồng kiểm thử | FR được test |
| -- | -------------- | ------------ |
| U-01 | Tìm phim đang chiếu và đặt vé: chọn phim, rạp, suất chiếu, ghế, xem thông tin vé. | FR-14, FR-15, FR-18, FR-19, FR-20, FR-35, FR-37 |
| U-02 | Đặt vé kèm snack và nhập mã khuyến mãi. | FR-18, FR-19, FR-20, FR-22, FR-23, FR-24, FR-35, FR-37 |
| U-03 | Tìm kiếm phim, xem chi tiết, thêm/xóa wishlist. | FR-10, FR-14, FR-15, FR-16, FR-35, FR-37 |
| U-04 | Dùng chatbot hỏi gợi ý phim/lịch chiếu rồi đi đến chi tiết phim hoặc đặt vé. | FR-14, FR-15, FR-17, FR-35, FR-37 |
| U-05 | Đăng ký, xử lý đăng ký thất bại bằng email trùng, đăng nhập, cập nhật hồ sơ, đổi/quên mật khẩu. | FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-35, FR-37 |
| U-06 | Sau đăng nhập, xem vé cá nhân, lịch sử xem, wishlist, rating, Lunar Points. | FR-09, FR-10, FR-11, FR-12, FR-13, FR-35, FR-37 |

---

## 4. Cách làm

Mỗi sinh viên thực hiện usability test với **3 người tham gia thật**.

### Bước 1: Chuẩn bị

Sinh viên cần chuẩn bị:

- Mã luồng đã chọn và FR được test.
- Một task scenario ngắn, mô tả mục tiêu của người dùng, không hướng dẫn từng click.
- 3 người tham gia thật.
- Form ghi chú quan sát.
- Một thang đo nhanh: SUS rút gọn, UEQ-S hoặc 3 câu hỏi đánh giá sau phiên.

Ví dụ task scenario cho U-01:

```text
Bạn muốn xem một phim đang chiếu tại Lumiere Cinema vào cuối tuần này. Hãy tìm một phim phù hợp, chọn rạp, chọn suất chiếu, chọn ghế cho 2 người và hoàn tất đến khi thấy thông tin vé.
```

### Bước 2: Chạy test

Với mỗi người tham gia:

1. Nói rõ: "Mình đang test hệ thống, không test bạn."
2. Đưa task scenario.
3. Yêu cầu người tham gia vừa làm vừa nói suy nghĩ.
4. Không hướng dẫn trừ khi người tham gia bị kẹt hoàn toàn.
5. Ghi lại:
   - Có hoàn thành task không.
   - Mất bao lâu.
   - Bị kẹt ở đâu.
   - Click sai/chọn nhầm/chưa hiểu chỗ nào.
   - Quote đáng chú ý.
6. Cho người tham gia trả lời thang đo/câu hỏi sau phiên.

### Bước 3: Phân tích

Tổng hợp vấn đề theo nhóm, ví dụ:

- Không hiểu bước tiếp theo.
- Không hiểu trạng thái ghế/vé/khuyến mãi.
- Thông báo lỗi chưa rõ.
- Không tin rằng thao tác đã thành công.
- Cần người hướng dẫn mới làm tiếp được.

Mỗi finding cần có:

- Mã luồng.
- FR liên quan.
- Bằng chứng từ người tham gia.
- Severity.
- Đề xuất cải thiện.

Severity dùng thang đơn giản:

| Mức | Ý nghĩa |
| --- | ------- |
| S1 | Không hoàn thành được task. |
| S2 | Hoàn thành nhưng cần trợ giúp hoặc nhầm nghiêm trọng. |
| S3 | Hoàn thành nhưng bị chậm/do dự nhiều. |
| S4 | Vướng nhỏ, không ảnh hưởng nhiều. |

---

## 5. Kiểm tra nhanh bằng BrowserStack

Sau khi hoàn tất usability test, sinh viên dùng **BrowserStack** để kiểm tra nhanh flow đã chọn trên **2 trình duyệt khác nhau**.

Yêu cầu tối thiểu:

- Dùng website deploy: `https://lumierecinema-testing-demo-ui.vercel.app/`.
- Dùng BrowserStack Live để mở website.
- Chạy lại flow đã chọn trên Chrome và một trình duyệt khác, ví dụ Firefox, Safari hoặc Edge.
- Ghi nhận nếu flow bị lỗi, vỡ layout hoặc không thao tác được trên trình duyệt thứ hai.
- Chụp ít nhất 2 screenshot BrowserStack có thể hiện trình duyệt/thiết bị đang dùng.
- Nếu không phát hiện vấn đề, ghi ngắn gọn: "Không phát hiện lỗi cross-browser trên BrowserStack trong flow đã chọn."

---

## 6. Quy định nộp bài

Sinh viên nộp bài trên Moodle theo đúng thời hạn trong link nộp bài.

Nội dung bắt buộc trong bài nộp:

- Bug report, kèm screenshot minh chứng cho các bug phát hiện được.
- Usability-session evidence, bao gồm task scenario, ghi chú quan sát, phản hồi sau phiên, finding đã xếp severity và bằng chứng từ participant.
- Cross-browser / cross-platform screenshots, thể hiện website Lumiere Cinema cùng trình duyệt, hệ điều hành hoặc thiết bị đã dùng để kiểm tra.
