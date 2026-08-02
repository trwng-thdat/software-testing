# Task 2 — Nội dung 9 GitHub Issue (copy thẳng lên GitHub)

> **Repo:** `DuyITLOR/group05_eshop` · **Đánh số:** Task 1 dùng #125–#154, Task 3 dùng #213–#218 → Task 2 nên tạo tiếp từ **#219**.
> **Cách dùng:** copy phần **Title** vào ô tiêu đề, copy nguyên khối trong ô code vào phần mô tả, rồi kéo thả ảnh vào cuối mô tả.
> **Sau khi tạo xong:** ghi số issue thật vào cột `GitHub Issue` của bảng §2.5 trong `Main_Report.md` (hiện đang là `TODO`).

---

## 📸 TRẢ LỜI: ảnh nào cần thêm vào submission?

**Cần bổ sung 5 ảnh mới** (cắt từ video phiên). **4 bug còn lại dùng ảnh sẵn có** trong `submission/screenshot/`.

| Bug       | Ảnh dùng                                   | Có sẵn chưa?                    |
| --------- | ------------------------------------------ | ------------------------------- |
| BUG-UX-01 | `UX-01-password-rejected.png`              | ⬜ **Cần chụp/cắt mới**         |
| BUG-UX-02 | `UX-02-no-confirm-password.png`            | ⬜ **Cần chụp mới**             |
| BUG-UX-03 | `UX-03-error-message.png`                  | ⬜ **Cần chụp/cắt mới**         |
| BUG-UX-04 | `screenshot/LOGIN-F02.png`                 | ✅ có sẵn                       |
| BUG-UX-06 | `UX-06-password-toggle.png`                | ⬜ **Cần cắt từ video P01/P07** |
| BUG-UX-07 | `screenshot/LOGIN-U01.png`                 | ✅ có sẵn                       |
| BUG-UX-08 | `screenshot/LOGIN-U02.png`                 | ✅ có sẵn                       |
| BUG-UX-09 | `screenshot/LOGIN-F08.png`                 | ✅ có sẵn                       |
| BUG-UX-10 | `UX-10-username-vs-email.png`              | ⬜ **Cần cắt từ video P05/P07** |

### Vì sao 5 ảnh kia phải chụp mới

Thư mục `screenshot/` là ảnh **Selenium chụp trạng thái kỹ thuật** cho Task 1 — ví dụ `LOGIN-F02.png` cho thấy `type="text"`. Nhưng BUG-UX-06 và BUG-UX-10 là bug **chỉ lộ ra khi người dùng thao tác**: không tấm nào chụp được cảnh "bấm icon con mắt lần thứ hai không có tác dụng" hay "người dùng dừng lại trước ô Username không biết nhập gì". Đó chính là giá trị riêng của usability testing so với checklist.

### Nơi lưu ảnh mới

```
hw3/submission/screenshot/usability/
├── UX-01-password-rejected.png
├── UX-02-no-confirm-password.png
├── UX-03-error-message.png
├── UX-06-password-toggle.png
└── UX-10-username-vs-email.png
```

Đặt trong thư mục con `usability/` để tách khỏi 45 ảnh Selenium của Task 1 — người chấm nhìn là biết ảnh nào thuộc task nào.

**Cách lấy ảnh nhanh nhất:** mở video phiên trên Drive, tua tới đúng khoảnh khắc, chụp màn hình. Không cần dựng lại phiên test.

---

# NỘI DUNG 9 ISSUE

## BUG-UX-01 ⭐ (Critical — quan trọng nhất)

**Ảnh:** `UX-01-password-rejected.png` — chụp form Đăng ký với mật khẩu đúng theo mô tả (VD `Password123!`) và thông báo lỗi hiện ra

**Title:**

```
[HW03][BUG][usability][register] Mật khẩu đúng theo mô tả trên form vẫn bị từ chối — 7/7 người tham gia đều bị chặn
```

**Description:**

```markdown
**Mô tả:** Form Đăng ký hiển thị yêu cầu _"Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"_, nhưng regex kiểm tra thực tế lại **yêu cầu khoảng trắng** thay vì ký tự đặc biệt. Người dùng làm đúng theo hướng dẫn hiển thị vẫn bị từ chối.

**Nguồn:** `frontend-web/src/pages/Register.jsx:15` — biến `flawedStrongPasswordRegex`

**Bằng chứng từ 7 phiên usability thật:**

| Người tham gia | Nền tảng | Kết quả                                                                     |
| -------------- | -------- | --------------------------------------------------------------------------- |
| P01, P02, P03  | IT       | Chỉ vượt qua được **nhờ moderator hỗ trợ**                                  |
| P04            | IT       | Người duy nhất **tự dò ra** quy luật thật (mật khẩu phải chứa khoảng trắng) |
| P05            | non-IT   | Bị chặn                                                                     |
| **P06, P07**   | IT       | **Không tạo được mật khẩu**                                                 |

**Tần suất: 7/7 (100% mẫu).** Đây là mức phổ biến tuyệt đối — không một người tham gia nào tự hoàn thành trơn tru bước này.

**Tái hiện kỹ thuật:** `selenium/run_checklist.py --include-lockout` — `Sel3nium Pass!` bị từ chối, `Sel3nium Pass` (có khoảng trắng) được chấp nhận.

**Cách tái hiện:**

1. Mở `http://localhost:5173/register`
2. Nhập mật khẩu `Password123!` — đúng mọi điều kiện ghi trên form
3. Bấm Đăng ký
4. Kỳ vọng: chấp nhận · Thực tế: bị từ chối
5. Nhập `Password 123` (có khoảng trắng) → được chấp nhận

**Vì sao là Blocker:** P04 và P06 cùng là sinh viên IT nhưng kết quả trái ngược — một người tự dò ra, một người bó tay hoàn toàn. Khả năng thoát khỏi lỗi này mang tính **may rủi trong cách thử-sai**, không phải kỹ năng có thể trông cậy. Với người dùng thật, đây là điểm bỏ cuộc.

**Điểm SUS liên quan:** Q4 "cần hỗ trợ kỹ thuật" trung bình **4.6/5**, Q10 "phải học nhiều mới dùng được" **4.7/5** trên 7 người.

**Đề xuất sửa:** sửa regex cho khớp với mô tả hiển thị, hoặc sửa mô tả cho khớp logic thật. Ưu tiên phương án đầu vì yêu cầu "phải có khoảng trắng" không phải quy tắc mật khẩu hợp lý.

**Mức độ:** Critical (Blocker) — **Phát hiện qua:** Task 2 Usability, 7/7 phiên
```

---

## BUG-UX-03 ⭐ (Critical)

**Ảnh:** `UX-03-error-message.png` — chụp cận thông báo lỗi

**Title:**

```
[HW03][BUG][usability][register] Thông báo lỗi lặp lại chính mô tả sai — không ai trong 7 người tự phục hồi được
```

**Description:**

```markdown
**Mô tả:** Khi mật khẩu bị từ chối, thông báo lỗi hiển thị lại **đúng nội dung mô tả sai ban đầu** ("cần ký tự đặc biệt"), trong khi điều kiện thật là phải có khoảng trắng. Người dùng không có manh mối nào để sửa.

**Quan hệ với BUG-UX-01:** đây là lý do khiến BUG-UX-01 trở thành blocker không thể tự thoát. Nếu thông báo lỗi nêu đúng điều kiện, người dùng đã tự sửa được.

**Bằng chứng từ 7 phiên:** probe question _"Nếu form báo lỗi, bạn có biết cần sửa gì để tiếp tục không?"_ — **7/7 trả lời KHÔNG**.

Trường hợp nặng nhất là **P07**: không xem lại được mật khẩu vừa gõ (xem BUG-UX-06), nên vừa không biết điều kiện thật, vừa không kiểm tra được mình đã nhập gì.

**Cách tái hiện:**

1. Mở `http://localhost:5173/register`, nhập mật khẩu `Password123!`
2. Submit → đọc thông báo lỗi
3. Kỳ vọng: lỗi nêu đúng điều kiện chưa thoả · Thực tế: lặp lại mô tả sai

**Nguyên tắc bị vi phạm:** Nielsen #9 — _"Help users recognize, diagnose, and recover from errors"_. Thông báo lỗi phải chỉ ra chính xác vấn đề và cách khắc phục.

**Đề xuất sửa:** thông báo lỗi nêu đúng điều kiện chưa thoả, lý tưởng là hiển thị checklist điều kiện với dấu ✓/✗ cập nhật realtime khi gõ.

**Mức độ:** Critical — **Phát hiện qua:** Task 2 Usability, 7/7 phiên
```

---

## BUG-UX-06 ⭐ (High — bug mới, checklist Task 1 không bắt được)

**Ảnh:** `UX-06-password-toggle.png` — cắt từ video P01 hoặc P07, cảnh bấm icon con mắt

**Title:**

```
[HW03][BUG][usability][register] Nút hiện/ẩn mật khẩu chỉ hoạt động một chiều — không ẩn lại được sau khi hiện
```

**Description:**

```markdown
**Mô tả:** Nút toggle hiện/ẩn mật khẩu (icon con mắt) không hoạt động đúng. Hai biểu hiện khác nhau từ hai người tham gia:

- **P01:** bấm lần đầu thì mật khẩu hiện ra, nhưng **bấm lần thứ hai không ẩn lại được** — toggle chỉ chạy một chiều.
- **P07:** **không xem được mật khẩu khi gõ**, không có cách nào hiện nội dung vừa nhập để đối chiếu.

**Tần suất: 2/7**

**Vì sao nghiêm trọng hơn vẻ ngoài:** lỗi này **khuếch đại BUG-UX-01**. Người dùng đang vật lộn với mật khẩu bị từ chối liên tục, lại không kiểm tra được mình đã gõ đúng chưa — mất khả năng tự chẩn đoán ở đúng lúc cần nhất. P07 rơi vào tình huống này và không tạo được mật khẩu.

Ngoài ra, mất quyền che lại mật khẩu là vấn đề **riêng tư**: người dùng ở nơi công cộng không thể ẩn mật khẩu đang hiển thị.

**Cách tái hiện:**

1. Mở `http://localhost:5173/register`
2. Nhập mật khẩu bất kỳ, bấm icon con mắt → mật khẩu hiện ra
3. Bấm icon con mắt lần nữa
4. Kỳ vọng: mật khẩu bị che lại · Thực tế: vẫn hiển thị

**⚠️ Ghi chú:** bug này **không bị bộ checklist 69 item của Task 1 phát hiện** — checklist kiểm tra _thuộc tính `type` của input có đúng không_, còn lỗi này chỉ lộ ra khi **thao tác hai lần liên tiếp**. Đây là minh chứng cho giá trị bổ sung của usability testing so với kiểm thử theo checklist.

**Đề xuất sửa:** kiểm tra logic state của component toggle — nhiều khả năng chỉ set `type="text"` mà không đảo ngược lại.

**Mức độ:** High — **Phát hiện qua:** Task 2 Usability, P01 + P07
```

---

## BUG-UX-10 ⭐ (High — bug mới, checklist Task 1 không bắt được)

**Ảnh:** `UX-10-username-vs-email.png` — cắt từ video P05 hoặc P07, cảnh người dùng dừng lại trước ô "Username"

**Title:**

```
[HW03][BUG][usability][login] Nhãn "Username" nhưng hệ thống xác thực bằng email — người dùng không biết nhập gì
```

**Description:**

```markdown
**Mô tả:** Người dùng đăng ký tài khoản bằng **email**, nhưng trang Đăng nhập lại có nhãn trường là **"Username"**. Không có chỉ dẫn nào cho biết cần nhập email hay một tên đăng nhập riêng.

**Bằng chứng từ 2 phiên độc lập:**

| Người tham gia | Nền tảng   | Quan sát                                                             |
| -------------- | ---------- | -------------------------------------------------------------------- |
| **P05**        | **non-IT** | Nhầm lẫn giữa username và email, không rõ trang đang yêu cầu cái nào |
| **P07**        | **IT**     | "Đã đăng ký bằng email nhưng đăng nhập lại ghi username"             |

**Tần suất: 2/7 — trải rộng cả hai nhóm người dùng.**

**Phát hiện quan trọng về mức độ nghiêm trọng:** ban đầu chỉ P05 (non-IT) báo cáo, dẫn tới giả thuyết đây là vấn đề riêng của người dùng phổ thông — người có nền tảng kỹ thuật sẽ tự suy ra được. **P07 là sinh viên IT và gặp đúng lỗi này**, bác bỏ giả thuyết đó. Kinh nghiệm kỹ thuật **không bảo vệ** người dùng khỏi nhãn sai, nên mức nghiêm trọng thực tế cao hơn đánh giá ban đầu.

**Cách tái hiện:**

1. Đăng ký tài khoản mới bằng địa chỉ email
2. Sang trang `http://localhost:5173/login`
3. Quan sát nhãn trường đầu tiên → ghi "Username"
4. Kỳ vọng: nhãn khớp với dữ liệu đã dùng để đăng ký · Thực tế: không khớp

**Nguyên tắc bị vi phạm:** Nielsen #2 — _"Match between system and the real world"_. Nhãn giao diện phải phản ánh đúng dữ liệu hệ thống sử dụng.

**⚠️ Ghi chú:** bug này **không bị checklist Task 1 phát hiện** vì về mặt kỹ thuật trường input hoạt động bình thường — vấn đề nằm ở **sự không khớp giữa nhãn và mô hình dữ liệu**, chỉ lộ ra khi có người thật đi qua trọn luồng đăng ký → đăng nhập.

**Đề xuất sửa:** đổi nhãn thành "Email", hoặc thêm placeholder `you@example.com`. Nếu hệ thống chấp nhận cả hai thì ghi rõ "Email hoặc tên đăng nhập".

**Mức độ:** High — **Phát hiện qua:** Task 2 Usability, P05 + P07
```

---

## BUG-UX-02 (High)

**Ảnh:** `UX-02-no-confirm-password.png` — chụp toàn form Đăng ký, thấy rõ chỉ có 1 ô mật khẩu

**Title:**

```
[HW03][BUG][usability][register] Form Đăng ký thiếu trường "Xác nhận mật khẩu", vi phạm FR-01
```

**Description:**

```markdown
**Mô tả:** Form Đăng ký chỉ có **một ô mật khẩu duy nhất**, không có trường xác nhận lại. Người dùng gõ nhầm mật khẩu sẽ không biết cho tới khi đăng nhập thất bại ở bước sau.

**Bằng chứng:** P06 **chủ động nêu vấn đề này** trong phiên — nhận thấy form khác với kỳ vọng thông thường của một form đăng ký.

**Tần suất: 1/7** (chủ động nêu), nhưng ảnh hưởng tiềm tàng tới mọi người dùng.

**Tổ hợp nguy hiểm với BUG-UX-06:** không có ô xác nhận **và** không xem lại được mật khẩu vừa gõ → người dùng hoàn toàn không có cách nào kiểm chứng mình đã nhập đúng.

**Vi phạm đặc tả:** FR-01 (Đăng ký tài khoản) yêu cầu có bước xác nhận mật khẩu.

**Cách tái hiện:**

1. Mở `http://localhost:5173/register`
2. Đếm số ô nhập mật khẩu → chỉ có 1
3. Kỳ vọng: 2 ô (mật khẩu + xác nhận) · Thực tế: 1 ô

**Đề xuất sửa:** thêm trường "Xác nhận mật khẩu" với validate khớp realtime.

**Mức độ:** High — **Phát hiện qua:** Task 2 Usability, P06
```

---

## BUG-UX-04 (High)

**Ảnh:** ✅ **dùng ảnh có sẵn** `submission/screenshot/LOGIN-F02.png`

**Title:**

```
[HW03][BUG][usability][login] Mật khẩu hiển thị rõ khi nhập tại trang Đăng nhập (type="text")
```

**Description:**

```markdown
**Mô tả:** Trường mật khẩu ở trang Đăng nhập dùng `type="text"` thay vì `type="password"`, khiến mật khẩu **hiển thị rõ nguyên văn** khi gõ.

**Nguồn:** `frontend-web/src/pages/Login.jsx` — xác nhận qua Selenium (case LOGIN-F02 FAIL)

**Bằng chứng từ 4 phiên:** P02, P03, P04, P06 đều **chủ động nêu** vấn đề này. P02 còn đề xuất cụ thể: cần bổ sung chức năng ẩn/hiện mật khẩu.

**Tần suất: 4/7**

**Ảnh hưởng tới lòng tin:** probe question _"Bạn có cảm thấy an tâm về bảo mật thông tin không?"_ — nhiều người trả lời **không an tâm**, và lý do đầu tiên nêu ra chính là mật khẩu không được che. Điểm SUS Q9 "cảm thấy tự tin" trung bình chỉ **2.0/5**.

**Rủi ro thực tế:** shoulder-surfing — người xung quanh đọc được mật khẩu khi người dùng đăng nhập ở nơi công cộng.

**Cách tái hiện:**

1. Mở `http://localhost:5173/login`
2. Gõ mật khẩu bất kỳ
3. Kỳ vọng: hiển thị dấu chấm/sao · Thực tế: hiển thị rõ ký tự

**Đề xuất sửa:** đổi sang `type="password"`, kèm nút toggle hiện/ẩn hoạt động đúng cả hai chiều (xem BUG-UX-06).

**Mức độ:** High — **Phát hiện qua:** Task 2 Usability (4/7 phiên) + Task 1 checklist (LOGIN-F02)
```

---

## BUG-UX-07 (Medium)

**Ảnh:** ✅ **dùng ảnh có sẵn** `submission/screenshot/LOGIN-U01.png`

**Title:**

```
[HW03][BUG][usability][login] Trang Đăng nhập hiển thị tiêu đề "Đăng Ký" — 4/7 người tham gia nghi ngờ vào nhầm trang
```

**Description:**

```markdown
**Mô tả:** Trang Đăng nhập (`/login`) hiển thị tiêu đề **"Đăng Ký"** — lỗi copy-paste từ component Register.

**Bằng chứng từ 4 phiên:** P02, P03, P04, P07 đều nêu. P04 mô tả rõ là **"bối rối vì màn hình đăng nhập nhưng lại hiển thị chữ Đăng Ký"**.

**Tần suất: 4/7**

**Vì sao không chỉ là lỗi hiển thị:** người dùng vừa hoàn thành đăng ký, chuyển sang trang đăng nhập, lại thấy chữ "Đăng Ký" → nghi ngờ mình bấm nhầm hoặc thao tác trước chưa thành công. Xuất hiện đúng thời điểm người dùng đang cần xác nhận là mình đi đúng hướng.

**Quan hệ với Task 1:** trùng `BUG-GUI-09`, trước đó xếp Medium dựa trên phân tích tĩnh. Nay có **4 người dùng thật xác nhận có ảnh hưởng thực tế tới điều hướng**, không chỉ là lỗi văn bản.

**Cách tái hiện:**

1. Mở `http://localhost:5173/login`
2. Đọc tiêu đề trang
3. Kỳ vọng: "Đăng Nhập" · Thực tế: "Đăng Ký"

**Đề xuất sửa:** sửa chuỗi tiêu đề trong `Login.jsx`, đồng thời cập nhật `<title>` của trang.

**Mức độ:** Medium — **Phát hiện qua:** Task 2 Usability (4/7) + Task 1 (BUG-GUI-09)
```

---

## BUG-UX-08 (Low)

**Ảnh:** ✅ **dùng ảnh có sẵn** `submission/screenshot/LOGIN-U02.png`

**Title:**

```
[HW03][BUG][usability][i18n] Giao diện lẫn lộn tiếng Việt và tiếng Anh ("Username", "Sign In" giữa các nhãn tiếng Việt)
```

**Description:**

```markdown
**Mô tả:** Giao diện trộn lẫn hai ngôn ngữ: nhãn "Username" và nút "Sign In" bằng tiếng Anh nằm giữa các nhãn tiếng Việt.

**Bằng chứng:** P02 nêu trực tiếp — nhận xét _"ngôn ngữ không đồng đều"_.

**Tần suất: 1/7**

**Liên quan tới BUG-UX-10:** nhãn "Username" vừa sai ngôn ngữ, vừa sai nội dung (hệ thống xác thực bằng email). Sửa cả hai cùng lúc.

**Cách tái hiện:**

1. Mở `http://localhost:5173/login`
2. Quan sát nhãn các trường và nút submit
3. Kỳ vọng: toàn tiếng Việt · Thực tế: lẫn "Username", "Sign In"

**Đề xuất sửa:** chuẩn hoá toàn bộ chuỗi giao diện sang tiếng Việt; lý tưởng là tách ra file i18n thay vì hardcode.

**Mức độ:** Low — **Phát hiện qua:** Task 2 Usability, P02 (trùng BUG-GUI-10)
```

---

## BUG-UX-09 (Medium)

**Ảnh:** ✅ **dùng ảnh có sẵn** `submission/screenshot/LOGIN-F08.png`

**Title:**

```
[HW03][BUG][usability][register] Không kiểm tra cú pháp email — dữ liệu sai định dạng vẫn gửi lên server không báo lỗi
```

**Description:**

```markdown
**Mô tả:** Trường email dùng `type="text"` thay vì `type="email"` và không có validate phía client. Email sai cú pháp (thiếu `@`, thiếu domain) vẫn được gửi lên server mà **không có cảnh báo nào**.

**Bằng chứng:** P02 phát hiện trong phiên — nhập email sai cú pháp nhưng form vẫn cho gửi đi.

**Tần suất: 1/7**

**Vì sao là vấn đề khả dụng, không chỉ là validate thiếu:** người dùng gõ nhầm email sẽ **tạo tài khoản thành công** với địa chỉ không tồn tại. Kết hợp với việc không có bước xác thực email, họ có thể mất quyền truy cập tài khoản mà không hiểu vì sao. Im lặng thất bại là kiểu lỗi tệ nhất — người dùng không có tín hiệu nào để nhận ra.

**Cách tái hiện:**

1. Mở `http://localhost:5173/register`
2. Nhập email `abcxyz` (không có `@`)
3. Điền các trường còn lại hợp lệ, submit
4. Kỳ vọng: báo lỗi định dạng email · Thực tế: request được gửi đi bình thường

**Đề xuất sửa:** dùng `type="email"` để trình duyệt validate native, kèm validate phía server.

**Mức độ:** Medium — **Phát hiện qua:** Task 2 Usability, P02 (trùng BUG-GUI-11/BUG-GUI-20)
```

---

## ✅ Việc cần làm sau khi tạo xong

- [ ] Chụp/cắt **5 ảnh mới** → `submission/screenshot/usability/`
- [ ] Tạo 9 issue trên GitHub, đính ảnh tương ứng vào từng issue
- [ ] Ghi số issue thật vào cột `GitHub Issue` của bảng §2.5 trong `Main_Report.md` (9 ô đang `TODO`)
- [ ] Cập nhật `github_issues/README.md` — dòng "Task 2" hiện ghi "chưa tạo"
- [ ] Chụp lại ảnh trang GitHub Issues cho đủ cả 3 task
- [ ] Commit theo §12

## Thứ tự tạo đề xuất

Tạo 4 bug ⭐ trước — đây là những bug mạnh nhất của Task 2:

1. **BUG-UX-01** — 7/7 người, blocker
2. **BUG-UX-03** — 7/7 người, nguyên nhân khiến #01 không tự thoát được
3. **BUG-UX-06** — bug mới, checklist Task 1 không bắt được
4. **BUG-UX-10** — bug mới, có lập luận IT vs non-IT

Bốn bug này là phần trả lời trực tiếp cho câu hỏi _"usability testing tìm được gì mà checklist không tìm được?"_ — thứ người chấm quan tâm nhất ở Task 2.
