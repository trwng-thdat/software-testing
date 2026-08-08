# HW04 — Bug Report tổng hợp

| Trường | Giá trị |
| ------ | ------- |
| Sinh viên | TRƯƠNG THÀNH ĐẠT — MSSV **23127344** |
| Lớp | Kiểm thử phần mềm — 23KTPM3 |
| SUT | EShop — backend `:3000` · web `:5173` · admin `:5174` |
| Phạm vi | FR-04 (Pool A) · FR-08 (Pool B) · FR-18 (Pool C) — 47 test case |
| Thực thi | 141 lượt (47 TC × 3 trình duyệt) · Chrome 151 · Edge 151 · Firefox 153 |
| Kết quả | **102 PASS · 39 FAIL** (13 TC × 3 browser) |
| Tổng số bug | **13** — Critical 3 · High 5 · Medium 5 |
| GitHub Issues | [#260–#272](https://github.com/DuyITLOR/group05_eshop/issues) trên repo SUT |
| Ngày lập | 08/08/2026 |

> **Chi tiết từng bug** (các bước tái hiện, expected trích SRS, actual, phân tích) xem GitHub Issue tương ứng ở cột cuối, hoặc §1.9 [`Main_Report.md`](Main_Report.md).
>
> Toàn bộ bug phát hiện qua **chạy thật**, không phải đọc source đoán ra. Ảnh chụp sinh tự động bởi `utils/bugReporter.ts` tại đúng thời điểm test FAIL. **Cả 13 bug tái hiện giống hệt trên cả 3 trình duyệt** — loại trừ lỗi do timing hay do riêng một engine.

---

## Bảng tổng hợp 13 bug

| Bug ID | TC ID | Feature | Mức độ | Mô tả ngắn | Nguyên nhân gốc | Ảnh chụp | Issue |
| ------ | ----- | ------- | ------ | ---------- | --------------- | -------- | ----- |
| BUG-04 | TC-PROFILE-12 | FR-04 | **Critical** | Leo thang đặc quyền — user tự đặt `role: "admin"` qua `PUT /api/users/me` | `server.js:119-125` | [`TC-PROFILE-12.png`](selenium/bug-snapshots/TC-PROFILE-12.png) | [#260](https://github.com/DuyITLOR/group05_eshop/issues/260) |
| BUG-07 | TC-CHECKOUT-07 | FR-08 | **Critical** | Khách tự sửa được tổng tiền, server lưu nguyên — trả 1₫ cho đơn 6 triệu | `Checkout.jsx:93-102` \+ `server.js:297-307` | [`TC-CHECKOUT-07.png`](selenium/bug-snapshots/TC-CHECKOUT-07.png) | [#261](https://github.com/DuyITLOR/group05_eshop/issues/261) |
| BUG-11 | TC-ADMIN-12 | FR-18 | **Critical** | Mọi API `/api/admin/*` không kiểm `role` — token user thường trả HTTP 200 | `server.js:100-110` | [`TC-ADMIN-12.png`](selenium/bug-snapshots/TC-ADMIN-12.png) | [#262](https://github.com/DuyITLOR/group05_eshop/issues/262) |
| BUG-01 | TC-PROFILE-04 | FR-04 | High | SĐT hợp lệ 10 chữ số bắt đầu bằng `0` bị từ chối | `Profile.jsx:43` | [`TC-PROFILE-04.png`](selenium/bug-snapshots/TC-PROFILE-04.png) | [#263](https://github.com/DuyITLOR/group05_eshop/issues/263) |
| BUG-02 | TC-PROFILE-05 | FR-04 | High | SĐT hợp lệ 11 chữ số bắt đầu bằng `0` bị từ chối | `Profile.jsx:43` | [`TC-PROFILE-05.png`](selenium/bug-snapshots/TC-PROFILE-05.png) | [#264](https://github.com/DuyITLOR/group05_eshop/issues/264) |
| BUG-06 | TC-CHECKOUT-04 | FR-08 | High | Công thức percent đảo dấu → giảm giá **âm**, khách trả gấp 10 lần | `server.js` `/api/apply-coupon` | [`TC-CHECKOUT-04.png`](selenium/bug-snapshots/TC-CHECKOUT-04.png) | [#265](https://github.com/DuyITLOR/group05_eshop/issues/265) |
| BUG-09 | TC-CHECKOUT-16 | FR-08 | High | Giỏ rỗng vẫn tạo được đơn hàng | `server.js:297-307` | [`TC-CHECKOUT-16.png`](selenium/bug-snapshots/TC-CHECKOUT-16.png) | [#266](https://github.com/DuyITLOR/group05_eshop/issues/266) |
| BUG-10 | TC-ADMIN-07 | FR-18 | High | Cho phép `canceled → delivered`, vi phạm trạng thái kết thúc | `server.js:549-550` | [`TC-ADMIN-07.png`](selenium/bug-snapshots/TC-ADMIN-07.png) | [#267](https://github.com/DuyITLOR/group05_eshop/issues/267) |
| BUG-12 | TC-ADMIN-14 | FR-18 | High | XSS lưu trữ — địa chỉ giao hàng render thành HTML thật | `App.jsx:799-804` | [`TC-ADMIN-14.png`](selenium/bug-snapshots/TC-ADMIN-14.png) | [#268](https://github.com/DuyITLOR/group05_eshop/issues/268) |
| BUG-03 | TC-PROFILE-08 | FR-04 | Medium | SĐT **không** bắt đầu bằng `0` lại được chấp nhận | `Profile.jsx:43` | [`TC-PROFILE-08.png`](selenium/bug-snapshots/TC-PROFILE-08.png) | [#269](https://github.com/DuyITLOR/group05_eshop/issues/269) |
| BUG-05 | TC-CHECKOUT-03 | FR-08 | Medium | Giỏ hàng không được xóa sau khi thanh toán thành công | `Checkout.jsx:8` (`clearCart` không gọi) | [`TC-CHECKOUT-03.png`](selenium/bug-snapshots/TC-CHECKOUT-03.png) | [#270](https://github.com/DuyITLOR/group05_eshop/issues/270) |
| BUG-08 | TC-CHECKOUT-13 | FR-08 | Medium | Lỗi biên ngưỡng coupon — dùng `>` thay vì `>=` | `server.js` `/api/apply-coupon` | [`TC-CHECKOUT-13.png`](selenium/bug-snapshots/TC-CHECKOUT-13.png) | [#271](https://github.com/DuyITLOR/group05_eshop/issues/271) |
| BUG-13 | TC-ADMIN-16 | FR-18 | Medium | UI hiện nút "Đánh dấu Đã giao" cho đơn đã hủy | `App.jsx:862-869` | [`TC-ADMIN-16.png`](selenium/bug-snapshots/TC-ADMIN-16.png) | [#272](https://github.com/DuyITLOR/group05_eshop/issues/272) |

### Phân bố

| Feature | Critical | High | Medium | Tổng bug | TC fail / tổng TC |
| ------- | -------- | ---- | ------ | -------- | ----------------- |
| FR-04 Personal profile | 1 | 2 | 1 | **4** | 4 / 15 |
| FR-08 Checkout | 1 | 2 | 2 | **5** | 5 / 16 |
| FR-18 Admin orders | 1 | 2 | 1 | **4** | 4 / 16 |
| **Tổng** | **3** | **5** | **5** | **13** | **13 / 47** |

---

## Nhóm bug theo nguyên nhân gốc chung

8/13 bug thực chất chỉ do **4 dòng code sai** — sửa gốc thì hết cả nhóm:

| Nhóm | Bug | Nguyên nhân chung |
| ---- | --- | ----------------- |
| Regex SĐT | BUG-01 · BUG-02 · BUG-03 | `Profile.jsx:43` dùng `/^[1-9][0-9]{8,9}$/` — làm **ngược** đặc tả: chặn SĐT đúng SRS, cho lọt SĐT sai SRS |
| Server tin client | BUG-07 · BUG-09 | `server.js:297-307` không đọc `items`, không tính lại tổng, không kiểm giỏ rỗng |
| `canceled → delivered` | BUG-10 · BUG-13 | `server.js:549-550` nhánh ngoại lệ \+ `App.jsx:862-869` render đúng cái nút để khai thác nó |
| Thiếu kiểm quyền | BUG-04 · BUG-11 | Không kiểm `role` — một ở body request, một ở middleware dùng chung |

Tách thành bug riêng vì **biểu hiện, mức độ và cách kiểm khác nhau**: BUG-07 gây thiệt hại tài chính, BUG-09 sinh đơn rác — cùng gốc nhưng hậu quả và cách tái hiện hoàn toàn khác.

---

## Chuỗi khai thác — 3 bug ghép thành đường chiếm quyền hoàn chỉnh

```
BUG-12 (XSS)  →  BUG-11 (API admin không kiểm quyền)  →  BUG-04 (leo thang role)
   │                      │                                    │
   │ Chỉ cần ĐẶT MỘT ĐƠN   │ Không cần chiếm tài khoản admin —   │ Hoặc tự nâng
   │ với địa chỉ chứa      │ token user thường đã gọi được MỌI   │ role thành
   │ script                │ API /api/admin/* (HTTP 200)        │ admin trực tiếp
   ▼                      ▼                                    ▼
     Script chạy TRONG PHIÊN CỦA ADMIN khi admin mở tab "Đơn hàng"
```

Mỗi bug đứng riêng đã nghiêm trọng; ghép lại thì rào chắn duy nhất còn sót — kiểm `role` **phía client** ở `App.jsx:65-68` — hoàn toàn vô nghĩa vì bị bỏ qua khi gọi thẳng API.

---

## Nguyên tắc xử lý — vì sao 39 lượt test vẫn để FAIL

13 test case tương ứng 13 bug được **giữ nguyên trạng thái FAIL**, không nới assertion cho test xanh.

| Nguyên tắc | Áp dụng |
| ---------- | ------- |
| **Assert theo đặc tả, không theo hành vi code** | Mọi `expected` đều trích SRS. Lấy code làm oracle thì 13 defect này bị hợp thức hóa thành "đúng", test xanh một cách vô nghĩa |
| **Test FAIL là bằng chứng** | ISTQB FL §1.2: 39 lượt FAIL là **failure** biểu hiện của 13 **defect** thật |
| **Phân loại trước khi sửa** | 9 lượt FAIL khác được xác định là **lỗi script** (selector, parser, trạng thái fixture) → sửa script; 13 TC còn lại là defect SUT → giữ nguyên |
| **Xác minh chéo trước khi kết luận** | Mỗi FAIL đối chiếu bằng kênh độc lập (`curl` lên API, đọc source) trước khi ghi bug — tránh báo cáo defect **không tồn tại** |

> ⚠️ **Một lần suýt báo bug giả:** TC-CHECKOUT-05/06 từng FAIL do parser đọc số tiền coupon theo vị trí, trong khi SUT trả **đúng**. Gọi `curl` lên `/api/apply-coupon` cho thấy `{"discount_amount":50000,"final_amount":3950000}` chính xác → xác định là **lỗi script**, đã sửa, **không** ghi vào bug report. Chi tiết §1.7 dòng 13 [`Main_Report.md`](Main_Report.md).

---

## Bằng chứng và tài liệu liên quan

| Tài liệu | Nội dung |
| -------- | -------- |
| [#260–#272](https://github.com/DuyITLOR/group05_eshop/issues) | **13 GitHub Issue** trên repo SUT — chi tiết đầy đủ từng bug, mỗi issue kèm ảnh |
| §1.9 [`Main_Report.md`](Main_Report.md) | Bảng bug trong báo cáo chính \+ phân tích nguyên nhân gốc |
| §1.7 [`Main_Report.md`](Main_Report.md) | 19 lỗi của **AI** khi sinh script — phân biệt rõ với 13 bug của **SUT** |
| [`selenium/bug-snapshots/`](selenium/bug-snapshots/) | 13 ảnh chụp `.png` sinh tự động tại thời điểm test FAIL |
| [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md) | Log gốc sinh tự động mỗi lượt chạy, gồm cả 3 browser (39 mục) |
| [`selenium/reports/`](selenium/reports/) | 9 báo cáo HTML mochawesome, có banner `Run by: 23127344` \+ ISO timestamp |
| [`github_issues/`](github_issues/) | Ảnh chụp trang GitHub Issues làm bằng chứng đã báo cáo |

**Hai repo:**

| Repo | Vai trò |
| ---- | ------- |
| [`trwng-thdat/software-testing`](https://github.com/trwng-thdat/software-testing) | Bài làm — script, dữ liệu, báo cáo HTML, ảnh chụp |
| [`DuyITLOR/group05_eshop`](https://github.com/DuyITLOR/group05_eshop) | SUT (EShop) — nơi tạo 13 issue, vì defect thuộc mã nguồn SUT |

Bug được báo trên repo **chứa mã lỗi**, không phải repo của người kiểm thử — đúng thực tế ngành: issue phải nằm ở nơi lập trình viên sửa được.
