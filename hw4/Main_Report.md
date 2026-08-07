# HW04 — Automation Testing — Báo cáo chính

> **Template nộp bài.** Mọi ô `[...]`, `TBD`, và dòng ghi chú dạng `> 💡` là chỗ cần điền/xóa trước khi nộp.
> Nguyên tắc bắt buộc của đề bài: **không được bịa** số liệu thực thi, ảnh chụp, báo cáo HTML hay timestamp. Chỉ điền những gì thật sự đã chạy.

## 0. Thông tin sinh viên

| Trường                    | Giá trị                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Họ tên                    | [Họ tên]                                                                               |
| MSSV                      | [MSSV]                                                                                 |
| Lớp / Nhóm                | [Lớp]                                                                                  |
| Assignment                | HW04 — Automation Testing (HW04-AI)                                                    |
| Ngày nộp                  | [dd/mm/2026]                                                                           |
| Self-Assessed Grade       | **[000–100]** / 100 (chi tiết từng tiêu chí: [`README.md`](README.md))                 |
| SUT                       | EShop — `https://github.com/ttbhanh/eshop-sut` (bản dùng chung, tương ứng `eshop-sut`) |
| GitHub repo (public)      | [link repo chứa scripts + data + HTML reports]                                         |
| GitHub Issues             | [link trang Issues]                                                                    |
| 📹 Video demo (Task 2)    | [YouTube unlisted link — ≥5 phút, thuyết minh tiếng Việt]                              |
| 📹 Video demo Agent Skill | [YouTube link]                                                                         |

**Công cụ đã dùng:** [AI tool: Claude / ChatGPT / Copilot / ...] · **Selenium 4+** (TypeScript + Mocha + Chai) · **mochawesome** (HTML reporter).

> 💡 Đề bài cho phép Playwright (khuyến khích) **hoặc** Selenium 4+; và Allure **hoặc** Playwright HTML reporter. Template này viết theo hướng **Selenium + mochawesome** (khớp Agent Skill `selenium-automation` ở §Task 3). Nếu đổi công cụ, sửa lại toàn bộ các mục liên quan.

---

## 1. Phạm vi lựa chọn (Feature Selection)

> Theo §5 đề bài: tự động hóa **đúng 3 feature web** đã chọn ở HW02 — mỗi Pool A/B/C một feature. **Pool D (mobile) không dùng** ở bài này vì HW04 chỉ tự động hóa web frontend.

| Feature   | Pool | FR ID | Tên feature                 | Màn hình / route                               | Số TC tự động hóa |
| --------- | ---- | ----- | --------------------------- | ---------------------------------------------- | ----------------- |
| Feature A | A    | FR-04 | Personal profile management | `frontend-web` `/profile`                      | 15 (§1.4.1)       |
| Feature B | B    | FR-08 | Checkout                    | `frontend-web` `/checkout`                     | 16 (§1.4.2)       |
| Feature C | C    | FR-18 | Order management (admin)    | `frontend-admin` (tab **Đơn hàng**, port 5174) | 16 (§1.4.3)       |

**Nguồn lựa chọn:** kế thừa từ HW02 ([`../hw2/README.md`](../hw2/README.md)) — không trùng với thành viên khác trong nhóm.

> 💡 Nếu **chưa làm HW02**: xóa dòng trên, tự khai báo 3 feature Pool A–C ngay tại đây và **nêu rõ lý do HW02 không có** (yêu cầu §5).

**Môi trường thực thi:**

| Thành phần     | Giá trị                                   |
| -------------- | ----------------------------------------- |
| OS             | [Windows 11 / macOS / Linux]              |
| Backend API    | `http://localhost:3000`                   |
| Customer web   | `http://localhost:5173`                   |
| Admin web      | `http://localhost:5174`                   |
| Trình duyệt    | Chrome [ver] · Edge [ver] · Firefox [ver] |
| Node.js        | [ver]                                     |
| Selenium       | [ver]                                     |
| Tài khoản test | user `[email]` · admin `admin@eshop.com`  |

> 💡 Selenium không chạy được WebKit (đó là engine của Playwright). Đề bài chấp nhận bộ **Chrome / Edge / Firefox** — nêu rõ điều này thay vì thay thầm.

---

# TASK 1 — AI-generated automation scripts

> Trọng số: 25 + 25 + 25 = **75/100** (mỗi feature 25 điểm).

## 1.1 Nguồn tham chiếu đã đọc

> 💡 Liệt kê tài liệu đã đọc **trước khi** sinh script — đây là căn cứ để assert theo đặc tả chứ không theo hành vi lỗi hiện tại của SUT.

| Nguồn                                                        | Nội dung liên quan                                                                                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `eshop-sut/README.md` (SRS) §2 FR-04, dòng 62–68             | SĐT hợp lệ: bắt đầu bằng `0`, dài 10–11 chữ số; email không đổi được; không tự đổi `role`                                                              |
| `eshop-sut/README.md` (SRS) §4 FR-08, dòng 102–108           | Chỉ user đã đăng nhập; tổng tiền **không cho sửa trực tiếp**; backend tự tính lại; xóa giỏ sau thanh toán                                              |
| `eshop-sut/README.md` (SRS) §4 FR-09, dòng 110–139           | 5 điều kiện coupon C1–C5, công thức percent/fixed, bảng 4 mã mẫu                                                                                       |
| `eshop-sut/README.md` (SRS) §5 FR-10, dòng 141–162           | State machine 5 trạng thái; `delivered`/`canceled` là trạng thái kết thúc                                                                              |
| `eshop-sut/README.md` (SRS) §6 FR-12, dòng 174–180           | Mọi API `/api/admin/*` yêu cầu JWT hợp lệ \+ `role = 'admin'`                                                                                          |
| `eshop-sut/README.md` (SRS) §6 FR-18, dòng 218–222           | Admin xem mọi đơn; chuyển trạng thái theo FR-10; địa chỉ hiển thị an toàn                                                                              |
| `eshop-sut/backend/server.js` dòng 112–135, 297–330, 525–555 | Hành vi backend thật của `PUT /api/users/me`, `POST /api/checkout`, `PUT /api/admin/orders/:id/status` — dùng làm đối chiếu, **không** dùng làm oracle |
| `eshop-sut/setup_guide.md`                                   | Cổng dịch vụ, tài khoản admin mặc định                                                                                                                 |
| `frontend-web/src/pages/Profile.jsx`                         | DOM thật của màn hình hồ sơ                                                                                                                            |
| `frontend-web/src/pages/Checkout.jsx`                        | DOM thật của màn hình thanh toán                                                                                                                       |
| `frontend-admin/src/App.jsx`                                 | DOM thật của admin (SPA dạng tab, không có router)                                                                                                     |
| Test case HW02                                               | [Bảng TC gốc — mỗi TC ID thành 1 `it()`]                                                                                                               |

## 1.2 Chiến lược AI-First — sinh script theo từng bước

> Yêu cầu §6 Task 1: **không** dùng một prompt chung chung kiểu "viết hết script cho feature này". Phải dẫn dắt AI theo từng bước như kỹ thuật đã học.
> Log đầy đủ (verbatim prompt + output) nằm ở [`[AI-02] - AI Audit Report`](<[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md>). Dưới đây tóm tắt các bước để báo cáo liền mạch.

| Bước | Mục tiêu của bước                                             | Prompt (tóm tắt) | Output AI (tóm tắt) | Ghi chú review nhanh |
| ---- | ------------------------------------------------------------- | ---------------- | ------------------- | -------------------- |
| B1   | Thiết lập khung dự án (config, driver factory, data loader)   | [prompt]         | [output]            | [đã sửa gì]          |
| B2   | Chuyển bảng TC HW02 → file dữ liệu JSON (chưa viết code test) | [prompt]         | [output]            | [đã sửa gì]          |
| B3   | Sinh spec cho từng nhóm TC positive                           | [prompt]         | [output]            | [đã sửa gì]          |
| B4   | Sinh spec cho nhóm TC negative                                | [prompt]         | [output]            | [đã sửa gì]          |
| B5   | Bổ sung nhóm TC edge / boundary                               | [prompt]         | [output]            | [đã sửa gì]          |
| B6   | Thêm assertion đối chiếu API (persistence)                    | [prompt]         | [output]            | [đã sửa gì]          |
| B7   | Cấu hình đa trình duyệt + metadata báo cáo `Run by:`          | [prompt]         | [output]            | [đã sửa gì]          |
| B8   | Sửa lỗi sau lần chạy thật đầu tiên                            | [prompt]         | [output]            | [đã sửa gì]          |

> 💡 Thêm/bớt dòng theo thực tế. Mỗi dòng ở đây phải khớp một artifact trong AI Audit Report.

## 1.3 Cấu trúc dự án automation

```text
selenium/
  .env.example            # STUDENT_ID, WEB_URL, ADMIN_URL, BROWSERS, ...
  .mocharc.json
  package.json
  data/
    fr04-profile.data.json      # [n] test case
    fr08-checkout.data.json     # [n] test case
    fr18-admin-orders.data.json # [n] test case
  tests/
    fr04-profile.spec.ts
    fr08-checkout.spec.ts
    fr18-admin-orders.spec.ts
  utils/
    config.ts  driver.ts  dataLoader.ts  alerts.ts  reportMetadata.ts  bugReporter.ts  api.ts
  reports/
    fr04-profile/{chrome,edge,firefox}.html
    fr08-checkout/{chrome,edge,firefox}.html
    fr18-admin-orders/{chrome,edge,firefox}.html
  bug-snapshots/
    BUGS.md  <TC-ID>.png
```

**Cách chạy lại (reproducible):**

```bash
cd selenium
npm install
cp .env.example .env          # điền STUDENT_ID, STUDENT_NAME, URL, tài khoản
npm run typecheck
npm run test:all-browsers     # chạy 3 feature × 3 browser = 9 lượt
```

## 1.4 Data-driven — dữ liệu tách rời khỏi script

> Yêu cầu §6: dữ liệu test **phải** nằm ở file `.csv`/`.json` riêng. Mảng/đối tượng hardcode trong script **không được chấp nhận**.

| Feature  | File dữ liệu                       | Định dạng | Số case | Positive | Negative | Edge   |
| -------- | ---------------------------------- | --------- | ------- | -------- | -------- | ------ |
| FR-04    | `data/fr04-profile.data.json`      | JSON      | 15      | 5        | 7        | 3      |
| FR-08    | `data/fr08-checkout.data.json`     | JSON      | 16      | 6        | 6        | 4      |
| FR-18    | `data/fr18-admin-orders.data.json` | JSON      | 16      | 6        | 7        | 3      |
| **Tổng** |                                    |           | **47**  | **17**   | **20**   | **10** |

> Chi tiết từng test case: §1.4.1 (FR-04), §1.4.2 (FR-08), §1.4.3 (FR-18).

**Ví dụ một case trong file dữ liệu:**

```json
{
  "tcId": "TC-PROFILE-01",
  "title": "[Tiêu đề TC]",
  "type": "positive",
  "input": { "...": "..." },
  "expected": { "...": "..." }
}
```

Spec **duyệt** mảng này (`for (const c of cases) it(...)`), không viết cứng từng `it()` với dữ liệu literal.

### 1.4.1 Bộ test case — Feature A · Pool A · FR-04 Quản lý hồ sơ cá nhân

> Đặc tả tham chiếu: SRS §2 FR-04 (dòng 62–68). Màn hình `frontend-web/src/pages/Profile.jsx`, API `PUT /api/users/me`.
> Quy tắc oracle: **SĐT hợp lệ = bắt đầu bằng `0`, dài 10–11 chữ số**; email không đổi được; user chỉ sửa hồ sơ của chính mình và **không được tự đổi `role`**.

| TC ID         | Loại     | Tiêu đề                                     | Input                                                            | Expected (theo SRS)                                           | Assertion pattern  |
| ------------- | -------- | ------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- | ------------------ |
| TC-PROFILE-01 | positive | Cập nhật đủ 3 trường hợp lệ                 | name `Nguyễn Văn A`, phone `0912345678`, address `12 Lê Lợi, Q1` | Thông báo "Cập nhật thành công!"; dữ liệu được lưu            | 1 UI · 2 API       |
| TC-PROFILE-02 | positive | Chỉ đổi họ tên, giữ nguyên phone/address    | name `Trần Thị B`                                                | Cập nhật thành công; phone và address không đổi               | 2 API              |
| TC-PROFILE-03 | positive | Dữ liệu vẫn còn sau khi tải lại trang       | Cập nhật rồi F5                                                  | Form hiển thị đúng giá trị vừa lưu                            | 1 UI               |
| TC-PROFILE-04 | positive | SĐT biên dưới 10 chữ số                     | phone `0123456789`                                               | Chấp nhận (đúng 10 chữ số, bắt đầu bằng `0`)                  | 1 UI · 2 API       |
| TC-PROFILE-05 | positive | SĐT biên trên 11 chữ số                     | phone `01234567890`                                              | Chấp nhận (đúng 11 chữ số)                                    | 1 UI · 2 API       |
| TC-PROFILE-06 | negative | SĐT 9 chữ số (dưới biên)                    | phone `091234567`                                                | Bị từ chối, hiện thông báo lỗi, không lưu                     | 3 Rejection        |
| TC-PROFILE-07 | negative | SĐT 12 chữ số (trên biên)                   | phone `012345678901`                                             | Bị từ chối, không lưu                                         | 3 Rejection        |
| TC-PROFILE-08 | negative | SĐT không bắt đầu bằng `0`                  | phone `912345678`                                                | Bị từ chối theo SRS §FR-04                                    | 3 Rejection        |
| TC-PROFILE-09 | negative | SĐT chứa chữ cái                            | phone `09abc45678`                                               | Bị từ chối, không lưu                                         | 3 Rejection        |
| TC-PROFILE-10 | negative | Bỏ trống họ tên                             | name `` (rỗng)                                                   | Không cho submit (trường `required`)                          | 3 Rejection        |
| TC-PROFILE-11 | negative | Email không sửa được qua UI                 | Thử nhập vào ô Email                                             | Ô Email `disabled`, giá trị không đổi                         | 1 UI               |
| TC-PROFILE-12 | negative | **Không được tự nâng quyền `role`**         | `PUT /api/users/me` kèm `{"role":"admin"}`                       | API **phải bỏ qua/từ chối** trường `role`; user vẫn là `user` | 2 API · 5 Security |
| TC-PROFILE-13 | edge     | Họ tên chứa ký tự Unicode tiếng Việt có dấu | name `Đặng Thị Ngọc Hoà`                                         | Lưu và hiển thị đúng, không lỗi encoding                      | 1 UI · 2 API       |
| TC-PROFILE-14 | edge     | Địa chỉ rất dài (500 ký tự)                 | address 500 ký tự                                                | Lưu đủ, không cắt chuỗi, không vỡ layout                      | 2 API              |
| TC-PROFILE-15 | edge     | Địa chỉ chứa payload HTML                   | address `<b>x</b>`                                               | Hiển thị dạng **text thuần**, không render thẻ HTML           | 5 Security         |

> ✅ **Defect đã XÁC NHẬN bằng chạy thật** (3/3 trình duyệt, xem §1.9):
> — `Profile.jsx:43` dùng regex `/^[1-9][0-9]{8,9}$/` → yêu cầu SĐT **bắt đầu bằng 1–9 và dài 9–10 số**, **trái ngược** đặc tả (`0`, 10–11 số). **Kết quả thật: TC-PROFILE-04/05/08 FAIL** (BUG-01/02/03). Lưu ý TC-PROFILE-06 lại **PASS** — SĐT 9 chữ số bắt đầu bằng `0` bị cả hai luật cùng từ chối, nên dù luật sai thì kết quả vẫn trùng khớp kỳ vọng.
> — `server.js:119-125` (`PUT /api/users/me`) **nhận cả trường `role`** từ body → **TC-PROFILE-12 FAIL, leo thang đặc quyền có thật** (BUG-04, Critical): `role` đổi `user` → `admin` với HTTP 200.
> Expected giữ **theo SRS**, không sửa theo hành vi hiện tại của code.

### 1.4.2 Bộ test case — Feature B · Pool B · FR-08 Thanh toán (Checkout)

> Đặc tả tham chiếu: SRS §4 FR-08 (dòng 102–108) và FR-09 Coupon (dòng 110–139). Màn hình `frontend-web/src/pages/Checkout.jsx`, API `POST /api/checkout`, `POST /api/apply-coupon`.
> Coupon mẫu trong hệ thống: `SAVE10` (percent 10%, ngưỡng 300.000₫), `BIGBUY` (fixed 50.000₫, ngưỡng 500.000₫), `VIP100` (fixed 100.000₫, ngưỡng 300.000₫, 2 lượt), `EXPIRED` (hết hạn 2020-01-01).

| TC ID          | Loại     | Tiêu đề                                   | Input                                 | Expected (theo SRS)                                   | Assertion pattern        |
| -------------- | -------- | ----------------------------------------- | ------------------------------------- | ----------------------------------------------------- | ------------------------ |
| TC-CHECKOUT-01 | positive | Thanh toán thành công giỏ 1 sản phẩm      | 1 sản phẩm, đã đăng nhập              | Hiện "Thanh toán thành công!"; tạo đơn `pending`      | 1 UI · 2 API             |
| TC-CHECKOUT-02 | positive | Thanh toán giỏ nhiều sản phẩm             | 3 sản phẩm khác nhau                  | Đơn tạo đúng, liệt kê đủ sản phẩm                     | 1 UI · 4 Integrity       |
| TC-CHECKOUT-03 | positive | Giỏ hàng được xóa sau khi thanh toán      | Thanh toán xong, mở lại `/cart`       | Giỏ hàng rỗng (SRS FR-08)                             | 1 UI                     |
| TC-CHECKOUT-04 | positive | Áp mã `SAVE10` cho đơn đủ ngưỡng          | total 400.000₫ \+ `SAVE10`            | discount \= 40.000₫; final \= 360.000₫                | 4 Integrity              |
| TC-CHECKOUT-05 | positive | Áp mã `BIGBUY` (fixed)                    | total 600.000₫ \+ `BIGBUY`            | discount \= 50.000₫; final \= 550.000₫                | 4 Integrity              |
| TC-CHECKOUT-06 | positive | Mã nhập chữ thường vẫn nhận               | `save10`                              | Chuẩn hóa thành `SAVE10`, áp dụng được                | 1 UI                     |
| TC-CHECKOUT-07 | negative | **Tổng tiền không được sửa trực tiếp**    | Sửa ô tổng tiền còn `1`               | UI **không cho sửa**; backend tự tính lại (SRS FR-08) | 3 Rejection · 5 Security |
| TC-CHECKOUT-08 | negative | Mã không tồn tại                          | `NOTEXIST`                            | Báo lỗi, không giảm giá                               | 3 Rejection              |
| TC-CHECKOUT-09 | negative | Mã hết hạn (C2)                           | `EXPIRED`                             | Từ chối vì quá `expired_at`                           | 3 Rejection              |
| TC-CHECKOUT-10 | negative | Chưa đủ ngưỡng đơn hàng (C3)              | total 299.000₫ \+ `SAVE10`            | Từ chối vì `total < min_order_amount`                 | 3 Rejection              |
| TC-CHECKOUT-11 | negative | Chưa đăng nhập không thanh toán được (C4) | Guest bấm thanh toán                  | Bị chặn / yêu cầu đăng nhập                           | 3 Rejection · 5 Security |
| TC-CHECKOUT-12 | negative | Dùng quá số lượt cho phép (C5)            | `SAVE10` lần thứ 2 cùng 1 user        | Từ chối vì `max_uses_per_user = 1`                    | 3 Rejection              |
| TC-CHECKOUT-13 | edge     | Ngưỡng biên đúng bằng `min_order_amount`  | total 300.000₫ \+ `SAVE10`            | **Chấp nhận** (điều kiện C3 là `>=`)                  | 4 Integrity              |
| TC-CHECKOUT-14 | edge     | Ngưỡng biên thiếu 1₫                      | total 299.999₫ \+ `SAVE10`            | Từ chối                                               | 3 Rejection              |
| TC-CHECKOUT-15 | edge     | Giảm giá không vượt quá tổng đơn          | total 100.000₫ \+ `VIP100` (100.000₫) | `final_amount` \>= 0, không âm                        | 4 Integrity              |
| TC-CHECKOUT-16 | edge     | Thanh toán khi giỏ rỗng                   | Giỏ rỗng                              | Không tạo được đơn, có thông báo                      | 3 Rejection              |

> ⚠️ **Nghi vấn defect (đối chiếu source):**
> — `Checkout.jsx:93-102` render tổng tiền bằng `<input type="number">` **cho phép người dùng sửa trực tiếp**, và `handleCheckout` gửi chính giá trị đó lên server. `server.js:297-307` (`POST /api/checkout`) **lưu thẳng `total_amount` từ client, không tính lại**. Vi phạm trực tiếp 2 gạch đầu dòng của FR-08 → TC-CHECKOUT-07 nhiều khả năng FAIL (nghiêm trọng).
> — `VIP100` giảm 100.000₫ nhưng ngưỡng chỉ 300.000₫ nên TC-CHECKOUT-15 cần dựng đơn sát ngưỡng để kiểm; nếu hệ thống cho `final_amount` âm thì đó là defect.

### 1.4.3 Bộ test case — Feature C · Pool C · FR-18 Quản lý đơn hàng (Admin)

> Đặc tả tham chiếu: SRS §6 FR-18 (dòng 218–222), state machine FR-10 (dòng 141–162), access control FR-12 (dòng 174–180). Màn hình `frontend-admin/src/App.jsx` tab **Đơn hàng** (port 5174), API `PUT /api/admin/orders/:id/status`.
> State machine hợp lệ: `pending → confirmed|canceled`; `confirmed → shipping|canceled`; `shipping → delivered`. **`delivered` và `canceled` là trạng thái kết thúc — không được chuyển tiếp.**

| TC ID       | Loại     | Tiêu đề                                  | Input                                          | Expected (theo SRS)                                | Assertion pattern         |
| ----------- | -------- | ---------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ------------------------- |
| TC-ADMIN-01 | positive | Admin xem được đơn của mọi user          | Đăng nhập admin, mở tab Đơn hàng               | Bảng liệt kê đơn của nhiều user khác nhau          | 1 UI                      |
| TC-ADMIN-02 | positive | Chuyển `pending → confirmed`             | Bấm "Xác nhận"                                 | Trạng thái thành "Đã xác nhận"                     | 1 UI · 2 API              |
| TC-ADMIN-03 | positive | Chuyển `confirmed → shipping`            | Bấm "Giao hàng"                                | Trạng thái thành "Đang giao"                       | 1 UI · 2 API              |
| TC-ADMIN-04 | positive | Chuyển `shipping → delivered`            | Bấm "Hoàn thành"                               | Trạng thái thành "Đã giao"                         | 1 UI · 2 API              |
| TC-ADMIN-05 | positive | Hủy đơn từ `pending`                     | Bấm "Hủy"                                      | Trạng thái thành "Đã hủy"                          | 1 UI · 2 API              |
| TC-ADMIN-06 | positive | Hủy đơn từ `confirmed`                   | Bấm "Hủy"                                      | Trạng thái thành "Đã hủy"                          | 1 UI · 2 API              |
| TC-ADMIN-07 | negative | **`canceled` là trạng thái kết thúc**    | `PUT` đơn `canceled` → `delivered`             | **Phải bị từ chối** (FR-10)                        | 3 Rejection · 4 Integrity |
| TC-ADMIN-08 | negative | **`delivered` là trạng thái kết thúc**   | `PUT` đơn `delivered` → `shipping`             | Phải bị từ chối                                    | 3 Rejection · 4 Integrity |
| TC-ADMIN-09 | negative | Không được nhảy cóc `pending → shipping` | `PUT` bỏ qua `confirmed`                       | Phải bị từ chối                                    | 3 Rejection               |
| TC-ADMIN-10 | negative | Không được lùi `shipping → pending`      | `PUT` lùi trạng thái                           | Phải bị từ chối                                    | 3 Rejection               |
| TC-ADMIN-11 | negative | Trạng thái không tồn tại                 | `PUT` với `status: "abc"`                      | Trả lỗi, không đổi dữ liệu                         | 3 Rejection               |
| TC-ADMIN-12 | negative | **Token non-admin bị chặn**              | Gọi `/api/admin/orders` bằng token user thường | HTTP 401/403 (FR-12)                               | 5 Security                |
| TC-ADMIN-13 | negative | Không có token bị chặn                   | Gọi API không kèm token                        | HTTP 401                                           | 5 Security                |
| TC-ADMIN-14 | edge     | **Địa chỉ giao hàng hiển thị an toàn**   | Đơn có địa chỉ `<b>xss</b>`                    | Hiển thị **text thuần**, không render HTML (FR-18) | 5 Security                |
| TC-ADMIN-15 | edge     | Đơn không tồn tại                        | `PUT /api/admin/orders/999999/status`          | HTTP 404                                           | 3 Rejection               |
| TC-ADMIN-16 | edge     | Nút hành động khớp trạng thái hiện tại   | Đơn `delivered`                                | **Không** hiện nút chuyển trạng thái nào           | 1 UI                      |

> ⚠️ **Nghi vấn defect (đối chiếu source):**
> — `App.jsx:862-869`: đơn ở trạng thái `canceled` vẫn hiện nút **"Đánh dấu Đã giao"**, và `server.js:549-550` có nhánh `if (currentStatus === "canceled" && status === "delivered") isValidTransition = true;` → **cho phép `canceled → delivered`**, vi phạm ràng buộc trạng thái kết thúc của FR-10. TC-ADMIN-07 nhiều khả năng FAIL (nghiêm trọng).
> — `App.jsx:799-804`: cột Địa chỉ dùng `dangerouslySetInnerHTML` → TC-ADMIN-14 nhiều khả năng FAIL (XSS), vi phạm FR-18.
> — Ngoài phạm vi 3 feature nhưng ghi nhận: `App.jsx:217-218` tính doanh thu `total_amount * 2` — sai FR-13.

### 1.4.4 Tổng hợp phân bố test case

| Feature                | Tổng   | Positive | Negative | Edge   | Đạt yêu cầu ≥12 |
| ---------------------- | ------ | -------- | -------- | ------ | --------------- |
| FR-04 Personal profile | 15     | 5        | 7        | 3      | ✅              |
| FR-08 Checkout         | 16     | 6        | 6        | 4      | ✅              |
| FR-18 Admin orders     | 16     | 6        | 7        | 3      | ✅              |
| **Tổng**               | **47** | **17**   | **20**   | **10** | ✅ (≥36)        |

> 💡 Bảng này là **thiết kế** test case, chưa phải kết quả chạy. Cột kết quả thật nằm ở §1.6 sau khi thực thi. Các dòng "nghi vấn defect" ở trên mới chỉ đối chiếu source code — **phải chạy thật rồi mới được ghi vào bug report §1.9**.

## 1.5 Assertion patterns

> Yêu cầu §6: mỗi feature dùng **≥ 3 assertion pattern khác biệt**. "Khác biệt" nghĩa là khác loại bằng chứng, không phải 3 lần `assert.equal`.

| #   | Pattern                       | Mô tả                                                                  | Dùng ở FR-04 | FR-08 | FR-18 | Ví dụ TC                                        |
| --- | ----------------------------- | ---------------------------------------------------------------------- | ------------ | ----- | ----- | ----------------------------------------------- |
| 1   | UI state / text               | Kiểm thông báo, giá trị field, sự hiện diện của phần tử                | ✓            | ✓     | ✓     | TC-PROFILE-03 · TC-CHECKOUT-03 · TC-ADMIN-16    |
| 2   | Persistence / API cross-check | Sau thao tác UI, gọi API xác nhận dữ liệu **thật sự** đã đổi           | ✓            | ✓     | ✓     | TC-PROFILE-02 · TC-CHECKOUT-01 · TC-ADMIN-02    |
| 3   | Negative / rejection          | Input sai phải bị từ chối: có lỗi, không điều hướng, không tạo bản ghi | ✓            | ✓     | ✓     | TC-PROFILE-06 · TC-CHECKOUT-10 · TC-ADMIN-09    |
| 4   | Structural / data integrity   | Tổng tiền = Σ line items − giảm giá; trạng thái đơn đúng state machine | —            | ✓     | ✓     | TC-CHECKOUT-04 · TC-ADMIN-07                    |
| 5   | Security behaviour            | Token non-admin bị chặn 401/403; payload XSS render dạng text          | ✓            | ✓     | ✓     | TC-PROFILE-12 · TC-CHECKOUT-11 · TC-ADMIN-12/14 |

Mỗi feature dùng ít nhất 4 pattern khác nhau (FR-04: 1·2·3·5 — FR-08: 1·2·3·4·5 — FR-18: 1·2·3·4·5), vượt yêu cầu tối thiểu 3.

## 1.6 Kết quả thực thi đa trình duyệt

> Yêu cầu §6: mỗi feature chạy trên **cả 3 trình duyệt** → **≥ 9 lượt chạy**. Mỗi lượt sinh 1 báo cáo HTML hiển thị rõ `Run by: {MSSV}` + ISO timestamp.

### Bảng tổng hợp 9 lượt chạy

| #   | Feature  | Browser | Tổng TC | Pass    | Fail    | Skip    | Thời lượng | ISO timestamp | Báo cáo HTML                                                                              |
| --- | -------- | ------- | ------- | ------- | ------- | ------- | ---------- | ------------- | ----------------------------------------------------------------------------------------- |
| 1   | FR-04    | Chrome  | 15      | 11      | 4       | 0       | 9s         | 2026-08-07T07:56:28.908Z | [`reports/fr04-profile/chrome.html`](selenium/reports/fr04-profile/chrome.html)           |
| 2   | FR-04    | Edge    | 15      | 11      | 4       | 0       | 10s        | 2026-08-07T07:56:28.908Z | [`.../edge.html`](selenium/reports/fr04-profile/edge.html)                                |
| 3   | FR-04    | Firefox | 15      | 11      | 4       | 0       | 20s        | 2026-08-07T07:56:28.908Z | [`.../firefox.html`](selenium/reports/fr04-profile/firefox.html)                          |
| 4   | FR-08    | Chrome  | [n]     | [n]     | [n]     | [n]     | [s]        | [ISO]         | [`reports/fr08-checkout/chrome.html`](selenium/reports/fr08-checkout/chrome.html)         |
| 5   | FR-08    | Edge    | [n]     | [n]     | [n]     | [n]     | [s]        | [ISO]         | [`.../edge.html`](selenium/reports/fr08-checkout/edge.html)                               |
| 6   | FR-08    | Firefox | [n]     | [n]     | [n]     | [n]     | [s]        | [ISO]         | [`.../firefox.html`](selenium/reports/fr08-checkout/firefox.html)                         |
| 7   | FR-18    | Chrome  | [n]     | [n]     | [n]     | [n]     | [s]        | [ISO]         | [`reports/fr18-admin-orders/chrome.html`](selenium/reports/fr18-admin-orders/chrome.html) |
| 8   | FR-18    | Edge    | [n]     | [n]     | [n]     | [n]     | [s]        | [ISO]         | [`.../edge.html`](selenium/reports/fr18-admin-orders/edge.html)                           |
| 9   | FR-18    | Firefox | [n]     | [n]     | [n]     | [n]     | [s]        | [ISO]         | [`.../firefox.html`](selenium/reports/fr18-admin-orders/firefox.html)                     |
|     | **Tổng** |         | **[n]** | **[n]** | **[n]** | **[n]** |            |               | **9 báo cáo**                                                                             |

**Bằng chứng metadata:** mỗi file HTML chứa banner hiển thị trực tiếp khi mở bằng trình duyệt:

```text
Run by: [MSSV]
Student: [Họ tên]
Feature: [feature]
Browser: [chrome|edge|firefox]
Timestamp: [ISO 8601]
```

> 💡 Ảnh chụp banner của ít nhất 1 báo cáo: `![](screenshot/report-runby.png)`

### Khác biệt giữa các trình duyệt

| TC ID         | Chrome | Edge | Firefox | Nhận xét                                                        |
| ------------- | ------ | ---- | ------- | --------------------------------------------------------------- |
| TC-PROFILE-04 | F      | F    | F       | Defect SUT — tái hiện giống hệt trên cả 3 engine                |
| TC-PROFILE-05 | F      | F    | F       | Defect SUT — tái hiện giống hệt trên cả 3 engine                |
| TC-PROFILE-08 | F      | F    | F       | Defect SUT — tái hiện giống hệt trên cả 3 engine                |
| TC-PROFILE-12 | F      | F    | F       | Defect SUT (leo thang đặc quyền, tầng API nên độc lập browser)  |

**Kết luận: không có khác biệt giữa các trình duyệt** — cả 3 lượt FR-04 đều cho 11 PASS / 4 FAIL với đúng cùng một tập TC fail. Điều này củng cố kết luận rằng 4 FAIL là defect thật của SUT chứ không phải lỗi timing hay lỗi riêng của một engine.

## 1.7 Human review — AI sai/thiếu ở đâu và vì sao

> Yêu cầu §6: phải chỉ ra AI **sai gì / bỏ sót gì** (selector mong manh, assertion yếu hoặc thiếu, thiếu edge case, wait dễ flaky) và **giải thích vì sao** (chất lượng prompt / giới hạn mô hình / đặc thù feature). Đây là phần chấm điểm nặng, không phải thủ tục.

> Bảng dưới đây ghi **các sai/thiếu thật sự đã gặp** khi sinh và chạy bộ FR-04, không phải ví dụ mẫu. Mỗi dòng đều dẫn tới một lần sửa cụ thể trong repo.

| #   | AI sinh ra gì                                                                     | Sai/thiếu ở chỗ nào                                                                                                                                                     | Cách em sửa                                                                                                              | Nguyên nhân gốc                                                                     |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | Giả định ô Địa chỉ là `<input>`                                                   | Source thật dùng `<textarea>` (`Profile.jsx:150`) → selector `input[placeholder=...]` không bao giờ khớp                                                                | Đọc JSX trước khi viết selector; dùng `textarea[placeholder="Nhập địa chỉ của bạn"]`                                     | Giới hạn mô hình — suy từ template e-commerce chung thay vì đọc DOM thật            |
| 2   | Ô Họ Tên không có `name`/`id`/`placeholder` để bám                                | Không có selector tier 1–2 khả dụng; ô Email cũng là `input[type=text]` nên dễ bắt nhầm                                                                                 | Dùng XPath theo `<label>Họ Tên</label>` + ghi chú rõ ràng ràng buộc i18n trong `profilePage.ts`                          | Đặc thù feature — SUT không có `data-testid` nào                                    |
| 3   | `--reporter-options` (số nhiều) trong lệnh mocha                                  | Mocha 10 dùng `--reporter-option` (số ít); dạng số nhiều bị **bỏ qua im lặng** → không sinh file HTML nào                                                               | Đổi sang số ít ở cả `package.json` và `runMatrix.ts`                                                                     | Giới hạn mô hình — nhầm cú pháp giữa các major version                              |
| 4   | `spawnSync('npx.cmd', ...)` trong runner đa trình duyệt                           | Node chặn spawn file `.cmd` khi không bật shell → `EINVAL`, mocha không hề chạy                                                                                         | Gọi thẳng `process.execPath` \+ `require.resolve('mocha/bin/mocha.js')`, tránh luôn vấn đề path có dấu cách             | Giới hạn mô hình — không tính tới đặc thù Windows                                   |
| 5   | Chốt idempotent của banner dùng `html.includes("Run by:")`                        | mochawesome nhúng cả kết quả vào `data-raw` trên `<body>`, mà tên suite **đã chứa** "Run by:" → hàm tưởng đã chèn rồi và **bỏ qua**, báo cáo không hề được đóng dấu     | Đổi sang marker riêng `data-hw04-metadata-banner`; đồng thời siết `verifyReports.ts` để chỉ chấp nhận banner thật        | Giới hạn mô hình — không lường được chuỗi trùng trong dữ liệu serialize             |
| 6   | Chèn banner bằng regex `<body([^>]*)>`                                            | Thuộc tính `data-raw` chứa ký tự `>` → regex khớp sai dấu đóng, làm hỏng markup                                                                                         | Neo vào `</head>` bằng cắt chuỗi thay vì parse thẻ `<body>`                                                              | Giới hạn mô hình — giả định HTML "sạch"                                             |
| 7   | Baseline `phone = "0900000000"` (đúng SRS) dùng cho **mọi** case                  | Chính regex lỗi của SUT chặn baseline này, khiến 6 case *không* kiểm SĐT (tên, địa chỉ, Unicode, XSS) cũng fail lây → che mất thứ chúng cần kiểm                        | Đổi baseline sang `912345678` (build hiện tại chấp nhận) \+ ghi chú lý do; luật SĐT theo SRS vẫn assert đủ ở TC-04…09  | Đặc thù feature — defect ở một trường lan sang các case dùng chung form             |
| 8   | TC-PROFILE-12 assert `role === "user"` ở **tiền điều kiện** và không dọn dẹp      | Lần chạy trước đã leo thang thật, tài khoản còn `admin` vĩnh viễn → test fail ở dòng tiền điều kiện chứ không phải ở phát hiện, và đầu độc mọi lượt chạy sau            | Reset `role` về `user` trong `beforeEach`; bọc assert trong `try/finally` để luôn hoàn nguyên kể cả khi fail             | Chất lượng prompt — chưa yêu cầu test phải tự cô lập trạng thái                     |
| 9   | Đăng nhập bằng cách điền form UI ở mỗi test                                       | `/api/login` cộng `login_attempts` \+2 mỗi lần sai và khóa ở 3 (`server.js:55-60`) → nguy cơ khóa tài khoản giữa chừng                                                  | Seed phiên qua API rồi bơm JWT vào `localStorage.token` đúng như `AuthContext` đọc                                       | Đặc thù feature — cơ chế khóa tài khoản của SUT                                     |
| 10  | Ảnh chụp bug của lượt chạy cũ không bị xóa                                        | Còn PNG của TC nay đã PASS → bằng chứng sai lệch                                                                                                                        | `resetBugLog()` xóa sạch `*.png` trước mỗi lượt matrix                                                                   | Chất lượng prompt — chưa nêu yêu cầu "bằng chứng phải khớp lần chạy hiện tại"       |

> **Nhận xét tổng hợp:** Nhóm sai nặng nhất không nằm ở logic test mà ở **hạ tầng báo cáo** (#3, #4, #5, #6) — đều là loại lỗi "chạy không báo lỗi nhưng không sinh ra bằng chứng", nguy hiểm vì rất dễ tưởng đã xong. Nhóm thứ hai là **giả định về DOM và trạng thái** (#1, #2, #7, #8, #9): AI suy từ mẫu e-commerce phổ biến thay vì đọc source thật, và mặc định mỗi test chạy trên môi trường sạch. Bài học khi prompt lần sau: (1) bắt buộc đọc JSX/handler thật trước khi sinh selector; (2) luôn kiểm chứng *bằng chứng đầu ra* chứ không chỉ kiểm test pass/fail — chính `verifyReports.ts` lỏng lẻo đã suýt cho qua 3 báo cáo chưa đóng dấu; (3) yêu cầu rõ mỗi test phải tự khôi phục trạng thái, đặc biệt trên SUT có defect cho phép thay đổi không hoàn nguyên.

## 1.8 Test case không tự động hóa được

> Yêu cầu §6: phải liệt kê và giải thích.

| TC ID   | Feature | Nội dung | Lý do không tự động hóa được | Cách kiểm thay thế |
| ------- | ------- | -------- | ---------------------------- | ------------------ |
| —       | FR-04   | —        | —                            | —                  |

**FR-04: không có TC nào phải bỏ** — cả 15/15 test case đều tự động hóa được và đã thực thi trên cả 3 trình duyệt.

Ghi chú về TC-PROFILE-12: case này kiểm ở **tầng API** (`PUT /api/users/me` kèm `role`) thay vì qua UI, vì màn hình `/profile` không hề render ô nhập `role` — bề mặt tấn công duy nhất là request body. Đây vẫn là tự động hóa đầy đủ, chỉ khác điểm tác động.

> 💡 Mục này sẽ cập nhật tiếp khi làm FR-08 và FR-18.

## 1.9 Bug report

> Yêu cầu §6: chỗ nào assertion fail mà lộ ra defect thật → ghi bug **cả trong báo cáo Markdown lẫn trên GitHub Issues**, mỗi issue **kèm ảnh chụp**.

### Phân loại kết quả FAIL

| Loại                                    | Số lượng (FR-04) | Xử lý                                            |
| --------------------------------------- | ---------------- | ------------------------------------------------ |
| Lỗi script (selector/wait/expected sai) | 6                | Đã sửa script, chạy lại → PASS                   |
| **Defect thật của SUT**                 | 4                | **Giữ nguyên test FAIL** làm bằng chứng, log bug |

**Chi tiết 6 FAIL do lỗi script (lượt chạy đầu tiên → đã sửa):** TC-PROFILE-01/02/03/13/14/15 ban đầu fail vì `BASELINE.phone = "0900000000"` (đúng SRS) lại bị chính regex lỗi của SUT chặn, khiến các case *không* kiểm SĐT cũng không submit được. Đã đổi baseline sang `912345678` — giá trị build hiện tại chấp nhận — để mỗi case kiểm đúng thứ nó cần kiểm. Quy tắc SĐT theo SRS vẫn được assert **nguyên vẹn** ở TC-PROFILE-04…09.

> 💡 Tuyệt đối không nới lỏng assertion để test xanh — làm vậy là xóa mất bằng chứng mà đề bài đang chấm.

### Danh sách bug

| Bug ID | TC ID         | Feature | Mức độ       | Mô tả ngắn                                                                              | Expected (trích SRS)                                             | Actual                                                       | Browser bị ảnh hưởng | Ảnh chụp                                                                         | GitHub Issue |
| ------ | ------------- | ------- | ------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------- | ------------ |
| BUG-01 | TC-PROFILE-04 | FR-04   | High         | SĐT hợp lệ 10 chữ số bắt đầu bằng `0` bị từ chối                                        | SRS §2 FR-04: SĐT bắt đầu bằng `0`, dài 10–11 chữ số → hợp lệ    | Alert "Số điện thoại không hợp lệ…", không lưu               | All (3/3)            | [`TC-PROFILE-04.png`](selenium/bug-snapshots/TC-PROFILE-04.png)                     | TBD          |
| BUG-02 | TC-PROFILE-05 | FR-04   | High         | SĐT hợp lệ 11 chữ số bắt đầu bằng `0` bị từ chối                                        | SRS §2 FR-04: 11 chữ số là biên trên hợp lệ                       | Alert "Số điện thoại không hợp lệ…", không lưu               | All (3/3)            | [`TC-PROFILE-05.png`](selenium/bug-snapshots/TC-PROFILE-05.png)                     | TBD          |
| BUG-03 | TC-PROFILE-08 | FR-04   | Medium       | SĐT **không** bắt đầu bằng `0` lại được **chấp nhận**                                   | SRS §2 FR-04: SĐT hợp lệ phải bắt đầu bằng số `0`                 | "Cập nhật thành công!", giá trị sai đặc tả được lưu          | All (3/3)            | [`TC-PROFILE-08.png`](selenium/bug-snapshots/TC-PROFILE-08.png)                     | TBD          |
| BUG-04 | TC-PROFILE-12 | FR-04   | **Critical** | **Leo thang đặc quyền** — user tự đặt `role: "admin"` qua `PUT /api/users/me` thành công | SRS §2 FR-04: người dùng **không thể** tự thay đổi thuộc tính `role` | HTTP 200, `role` đổi từ `user` → `admin`, tồn tại trong DB   | All (tầng API)       | [`TC-PROFILE-12.png`](selenium/bug-snapshots/TC-PROFILE-12.png)                     | TBD          |

**Nguyên nhân gốc (đối chiếu source, đã xác nhận bằng chạy thật):**

- BUG-01/02/03 cùng một gốc: `frontend-web/src/pages/Profile.jsx:43` dùng regex `/^[1-9][0-9]{8,9}$/` — yêu cầu chữ số đầu là **1–9** và độ dài **9–10**, trong khi SRS yêu cầu chữ số đầu là **`0`** và độ dài **10–11**. Hai luật loại trừ nhau ngay ở chữ số đầu tiên, nên mọi SĐT đúng SRS đều bị chặn và mọi SĐT sai SRS (không bắt đầu bằng 0) lại lọt.
- BUG-04: `backend/server.js:119-125` destructure `role` từ `req.body` và ghép thẳng vào câu `UPDATE`, không hề kiểm quyền.

Chi tiết đầy đủ: [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md).

> 💡 Nếu không phát hiện bug nào, ghi rõ "Không phát hiện defect nào trong phạm vi 3 feature" — nhưng lưu ý SUT này **được cố ý cài lỗi sẵn**, nên kết quả 0 bug thường có nghĩa assertion còn quá yếu.

---

# TASK 2 — Demo video

> Trọng số: **15/100**.

| Hạng mục                | Giá trị                                             |
| ----------------------- | --------------------------------------------------- |
| Link YouTube (unlisted) | [link]                                              |
| Thời lượng              | [mm:ss] (yêu cầu **≥ 5 phút**)                      |
| Ngôn ngữ thuyết minh    | Tiếng Việt (giọng thật của sinh viên)               |
| Feature được demo       | [FR-..]                                             |
| Bằng chứng tác giả      | [face-cam] / [terminal chạy `whoami` và `hostname`] |

**Nội dung đã trình bày trong video:**

| Mốc thời gian | Nội dung                                                          |
| ------------- | ----------------------------------------------------------------- |
| [00:00]       | Giới thiệu + bằng chứng tác giả (`whoami`, `hostname` / face-cam) |
| [00:00]       | Giới thiệu cấu trúc dự án, file dữ liệu tách rời                  |
| [00:00]       | Chạy script end-to-end trên trình duyệt 1                         |
| [00:00]       | Chạy đa trình duyệt (3 browser)                                   |
| [00:00]       | Mở báo cáo HTML, chỉ rõ dòng `Run by: [MSSV]` + timestamp         |
| [00:00]       | **Giải thích ≥ 1 lỗi em đã sửa trong script AI sinh** (bắt buộc)  |
| [00:00]       | Kết luận                                                          |

**Lỗi AI đã được thuyết minh trong video:** [mô tả ngắn — nên trỏ về một dòng cụ thể ở bảng §1.7].

> 💡 §11 Anti-AI-Cheat: video **phải** có giọng thật và face-cam hoặc terminal `whoami`/`hostname`. Thiếu là mất điểm toàn phần mục này.

---

# TASK 3 — Agent Skill

> Trọng số: **10/100**. Đề bài §7: khuyến khích xây Agent Skill đóng gói quy trình automation (data-driven, đa trình duyệt) để tái sử dụng cho các feature sau; nộp kèm video demo end-to-end.

| Hạng mục             | Giá trị                                                      |
| -------------------- | ------------------------------------------------------------ |
| Tên skill            | `selenium-automation`                                        |
| Vị trí               | [`skills/selenium-automation/`](skills/selenium-automation/) |
| Video demo           | [YouTube link]                                               |
| Feature dùng để demo | [FR-..]                                                      |

**Cấu trúc skill:**

| File                             | Vai trò                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `SKILL.md`                       | Ràng buộc HW04, quy trình 9 bước, verification gate                                        |
| `references/project-scaffold.md` | Code mẫu: config, driver factory, data loader, alert helper, report metadata, bug reporter |
| `references/review-checklist.md` | Checklist review thủ công output của AI (10 nhóm)                                          |
| `references/eshop-notes.md`      | Ghi chú selector/hành vi thật của EShop theo từng feature                                  |

**Skill tự động hóa những gì:** [liệt kê — VD: dựng khung dự án, ép ≥12 case/feature ngay ở tầng loader, chuẩn hóa tên file báo cáo theo browser, chèn banner `Run by:`, thu thập ảnh chụp bug.]

**Đã dùng lại được ở đâu:** [VD: áp dụng cho cả 3 feature; ước lượng thời gian tiết kiệm].

---

# 4. Tổng kết kiểm thử (Test Summary)

> Số liệu này lặp lại trong [`README.md`](README.md) theo yêu cầu §14.

| Chỉ số                       | Giá trị                                |
| ---------------------------- | -------------------------------------- |
| Số feature tự động hóa       | 1 / 3 (FR-04 xong; FR-08, FR-18 chưa làm)         |
| Số test case đã **thiết kế** | 47 (FR-04: 15 · FR-08: 16 · FR-18: 16)            |
| Số test case tự động hóa     | 15 (FR-04)                                        |
| Số test case đã thực thi     | 45 lượt (15 TC × 3 trình duyệt)                   |
| Số test case PASS            | 33 lượt (11 TC × 3)                               |
| Số test case FAIL            | 12 lượt (4 TC × 3) — đều là defect thật của SUT   |
| Số lượt chạy trình duyệt     | 3 / ≥9                                            |
| Số báo cáo HTML              | 3 / 9                                             |
| Số bug phát hiện             | 4 (1 Critical · 2 High · 1 Medium)                |
| Số GitHub Issue đã tạo       | 0 — **cần tạo trước khi nộp**                     |
| Số TC không tự động hóa được | 0 (trong phạm vi FR-04)                           |
| Link video demo              | [link]                                            |

> ⚠️ Các con số trên chỉ phản ánh **FR-04**. Phải hoàn tất FR-08 và FR-18 để đạt mốc 9 báo cáo / ≥36 TC của đề bài.

---

# 5. Git commit log

> Yêu cầu §12: repo public, **≥ 8 commit trong ≥ 4 ngày khác nhau**. **Chỉ commit có thay đổi file test script** (`.spec.ts` / `.spec.js` hoặc tương đương) mới được tính; commit chỉ sửa README/PDF/tài liệu **không tính**.

| Chỉ số                           | Giá trị                                    |
| -------------------------------- | ------------------------------------------ |
| Repo public                      | [link]                                     |
| Tổng số commit                   | [n]                                        |
| Số commit **có đụng file test**  | [n ≥ 8]                                    |
| Số ngày khác nhau có commit test | [n ≥ 4]                                    |
| Khoảng thời gian                 | [dd/mm] – [dd/mm]                          |
| File log                         | [`git_commit_log.txt`](git_commit_log.txt) |

Lệnh sinh log:

```bash
git log --pretty=format:"%h | %ad | %an | %s" --date=iso -- "*.spec.ts" > git_commit_log.txt
```

---

# 6. Tự đánh giá (Self-Assessment)

| No. | Tiêu chí                   | Điểm tối đa | Tự chấm | Căn cứ                                 |
| --- | -------------------------- | ----------- | ------- | -------------------------------------- |
| 1   | Task 1 — Feature A (FR-04) | 25          | [n]     | [§1.4–1.9, 3 báo cáo HTML, n bug]      |
| 2   | Task 1 — Feature B (FR-08) | 25          | [n]     | [...]                                  |
| 3   | Task 1 — Feature C (FR-18) | 25          | [n]     | [...]                                  |
| 4   | Task 2 — Demo video        | 15          | [n]     | [link, thời lượng, bằng chứng tác giả] |
| 5   | Agent Skill                | 10          | [n]     | [skill + video demo]                   |
|     | **Tổng**                   | **100**     | **[n]** |                                        |

---

# 7. Phụ lục

| Tài liệu                                                                          | Nội dung                                        |
| --------------------------------------------------------------------------------- | ----------------------------------------------- |
| [`[AI-02] - AI Audit Report`](<[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md>) | **Phụ lục bắt buộc** — log toàn bộ tương tác AI |
| [`AI_Critique.md`](AI_Critique.md)                                                | **Bắt buộc** — 200–300 từ phê bình AI           |
| [`README.md`](README.md)                                                          | Bảng tự đánh giá + test summary                 |
| [`git_commit_log.txt`](git_commit_log.txt)                                        | Log commit                                      |
| [`selenium/bug-snapshots/BUGS.md`](selenium/bug-snapshots/BUGS.md)                | Bug report chi tiết                             |
| [`skills/selenium-automation/`](skills/selenium-automation/)                      | Agent Skill                                     |

## 7.1 Checklist trước khi nộp

- [ ] 3 feature đúng Pool A / B / C, khớp HW02 (hoặc đã giải trình)
- [ ] ≥ 12 TC tự động hóa **mỗi** feature (≥ 36 tổng)
- [ ] Dữ liệu test nằm ở file `.json`/`.csv` riêng — không hardcode trong spec
- [ ] ≥ 3 assertion pattern khác biệt mỗi feature
- [ ] 9 file báo cáo HTML tồn tại **đồng thời**, không đè lên nhau
- [ ] Mọi báo cáo hiển thị `Run by: [MSSV]` + ISO timestamp khi mở bằng trình duyệt
- [ ] Bảng phân tích AI sai/thiếu (§1.7) đã điền, có nguyên nhân gốc
- [ ] Danh sách TC không tự động hóa được (§1.8) đã điền
- [ ] Bug đã log **cả** trong Markdown **và** GitHub Issues, mỗi issue có ảnh
- [ ] Video ≥ 5 phút, tiếng Việt, có `whoami`/`hostname` hoặc face-cam, có giải thích 1 lỗi đã sửa
- [ ] Agent Skill + video demo skill
- [ ] AI Audit Report + AI Critique (200–300 từ), cả `.md` và `.pdf`
- [ ] ≥ 8 commit đụng file test, trải ≥ 4 ngày
- [ ] `README.md` có bảng tự đánh giá + test summary
- [ ] Tên file zip: `[MSSV]_HW04_AI_Automation_[000-100].zip`

> ⚠️ §17: nộp trễ không được chấp nhận; **thiếu bất kỳ tài liệu bắt buộc nào → 0 điểm**; sao chép giữa sinh viên (kể cả prompt) → 0 điểm cho cả hai bên.
