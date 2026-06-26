# HW02 – Domain Testing on EShop — Tổng quan & Việc cần làm

> File tóm tắt nội dung bài tập HW02 (đọc từ `2026.HW02.Domain Testing_En.pdf`).
> Mục đích: nắm nhanh đề bài làm gì và cần nộp những gì.

---

## 1. Bài tập này về cái gì?

Áp dụng **2 kỹ thuật thiết kế test case** lên ứng dụng **EShop** (web bán hàng demo của VN):

1. **Domain Testing** (kiểm thử miền) — chia input thành các lớp tương đương, chọn đại diện.
2. **Boundary Value Analysis – BVA** (phân tích giá trị biên) — test tại các giá trị biên của miền.

Điểm cốt lõi: phải dùng **AI như một trợ lý có kỷ luật** — dẫn dắt AI qua **từng bước** của kỹ thuật (đúng như học trên lớp), **KHÔNG** ra một prompt chung chung kiểu _"generate test cases and find bugs"_. Mọi kết quả AI tạo ra **bạn phải tự review và chịu trách nhiệm**.

| Mục            | Thông tin                                          |
| -------------- | -------------------------------------------------- |
| Mã bài         | HW02-AI                                            |
| Thời lượng     | 10 giờ                                             |
| Hình thức      | **Cá nhân**                                        |
| Nộp            | Moodle (báo cáo)                                   |
| Deadline       | Xem link nộp bài trên Moodle (**không nhận trễ**)  |
| AI Policy      | Mở — **bắt buộc** có declaration + AI Audit Report |
| Bloom-AI Level | G9.2 (Apply) và G9.3 (Analyse)                     |

**SUT:** EShop — repo: https://github.com/ttbhanh/eshop-sut
(đã có sẵn bản clone ở thư mục [group05_eshop/](../../group05_eshop/))

---

## 2. Chọn feature (RẤT QUAN TRỌNG — làm trước tiên)

Mỗi sinh viên chọn **đúng 4 feature, mỗi pool 1 cái**, và **không trùng** với thành viên khác trong nhóm.

| Pool  | Phạm vi                              | Các feature (chọn 1)                                                                                                                                                                                                          |
| ----- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | Authentication, Categories, Products | FR-01 Đăng ký · FR-02 Đăng nhập & khóa tài khoản · FR-03 Quên/đặt lại mật khẩu (2 bước) · FR-04 Quản lý hồ sơ cá nhân · FR-05 Liệt kê & tìm kiếm sản phẩm · FR-06 Xem chi tiết sản phẩm                                       |
| **B** | Shopping Cart & Checkout             | FR-07 Giỏ hàng · FR-08 Thanh toán · FR-09 Mã giảm giá · FR-10 Máy trạng thái đơn hàng · FR-11 Lịch sử đơn hàng (user)                                                                                                         |
| **C** | Web Admin                            | FR-12 Phân quyền · FR-13 Dashboard · FR-14 Quản lý danh mục (CRUD) · FR-15 Quản lý sản phẩm (CRUD) · FR-16 Import sản phẩm từ CSV · FR-17 Quản lý coupon (CRUD) · FR-18 Quản lý đơn hàng (admin) · FR-19 Quản lý user (admin) |
| **D** | **Mobile App**                       | (feature trên app mobile)                                                                                                                                                                                                     |

> 💡 Gợi ý chọn feature có **nhiều input dạng số/chuỗi có ràng buộc** (giá, số lượng, % giảm giá, độ dài mật khẩu, ngày hết hạn coupon...) vì Domain Testing và BVA phát huy tốt nhất ở đó.

---

## 3. Với MỖI feature đã chọn, phải làm 4 việc

1. **Domain Testing** — dùng AI áp dụng kỹ thuật để thiết kế bộ test case đầy đủ. Bổ sung thêm test case nếu cần để coverage tốt. **Giải thích chi tiết từng bước** đã áp dụng kỹ thuật.
2. **Boundary Value Analysis** — tương tự, thiết kế bộ test case BVA + **giải thích từng bước**.
3. **AI gap analysis** — nếu AI **bỏ sót** test case/bug nào, phải báo cáo và **giải thích vì sao AI sót**: do prompt chưa tốt? do giới hạn của AI? do feature phức tạp?
4. **Bug reporting** — báo cáo **tất cả bug** ở 2 nơi: (a) trong báo cáo Markdown, (b) trên **GitHub Issues** của nhóm, **kèm ảnh chụp** từng bug.

---

## 4. Agent Skill (10 điểm)

- Được khuyến khích **xây Agent Skill** tự động hóa Domain Testing & BVA để tái dùng cho feature khác.
- Nộp kèm **video demo (link YouTube)** quay end-to-end cách dùng skill trên 1 feature hoàn chỉnh.

---

## 5. Tài liệu bắt buộc kèm theo

### 5.1. AI Audit Report (Phụ lục bắt buộc)

- Nếu **không** dùng AI: ghi _"I do not use any AI help in this exercise."_
- Nếu **có** dùng AI: ghi _"I use AI tools for the following tasks,"_ và với **mỗi lần tương tác** ghi rõ:
  - Tên công cụ AI
  - Ngày & giờ
  - Prompt của bạn
  - Output của AI
- 💡 Khuyến khích tạo skill/rule để **tự trích xuất** thông tin này sau mỗi phiên làm việc với AI.

### 5.2. AI Critique (200–300 từ, bắt buộc)

Viết 1 đoạn 200–300 từ phê bình AI, trả lời:

- AI đã sai / thiên lệch / thiếu sót ở đâu?
- Vì sao nó không phát hiện ra vấn đề?
- Bạn rút ra **nguyên tắc gì** khi cộng tác với AI?

### 5.3. Git Commit Log

- Tạo **commit mới cho mỗi bước** của quy trình test, cho mỗi feature.
- Xuất **commit log** ra file text.

---

## 6. Quy định nộp bài

**Tên file zip:** `<StudentID>_HW02_AI_DomainTesting_<SelfAssessedGrade>.zip`

- `SelfAssessedGrade`: số 3 chữ số trong khoảng `[000, 100]`.
- Ví dụ: `25127001_HW02_AI_DomainTesting_090.zip`

**Nội dung file .zip bắt buộc có:**

- [ ] Báo cáo chính (**Markdown + PDF**): gồm báo cáo Domain Testing **và** báo cáo BVA.
- [ ] Bug report, kèm ảnh chụp các bug trên trang GitHub Issues.
- [ ] AI Critique và AI Audit Report (**Markdown + PDF**).
- [ ] Git commit log (file text).
- [ ] `README.md` chứa **bảng tự đánh giá** (mục 7 dưới) + **test summary report**: số feature; số test case đã thiết kế / đã chạy / pass / fail / chưa chạy; số bug; link video demo.
- [ ] Các tài liệu hỗ trợ khác.

> ⚠️ **Thiếu bất kỳ tài liệu bắt buộc nào → 0 điểm.** Nộp trễ → không nhận. Sao chép (kể cả prompt) → 0 điểm cả hai bên.

---

## 7. Bảng đánh giá (đưa vào README.md)

| No. | Tiêu chí                              | Điểm    | Tự đánh giá |
| --- | ------------------------------------- | ------- | ----------- |
| 1   | Feature A (Domain + Boundary)         | 25      |             |
| 2   | Feature B (Domain + Boundary)         | 25      |             |
| 3   | Feature C (Domain + Boundary)         | 25      |             |
| 4   | Feature D (Mobile, Domain + Boundary) | 15      |             |
| 5   | Agent Skills                          | 10      |             |
|     | **Tổng**                              | **100** |             |

---

## 8. Oral Defense

30% sinh viên (chọn ngẫu nhiên) có thể bị gọi **bảo vệ vấn đáp 5–7 phút** trong tuần sau deadline → phải **tự hiểu rõ** cách mình đã làm.

---

## 9. Checklist hành động đề xuất

- [ ] **Bước 0:** Thống nhất trong nhóm ai làm FR nào (tránh trùng), chọn 4 feature (A/B/C/D).
- [ ] **Bước 1:** Chạy được EShop ở local (xem [group05_eshop/setup_guide.md](../../group05_eshop/setup_guide.md) & [group05_eshop/README.md](../../group05_eshop/README.md)).
- [ ] **Bước 2:** Đọc lại slide bài giảng về Domain Testing & BVA.
- [ ] **Bước 3:** Với mỗi feature → xác định input/output, miền giá trị, ràng buộc.
- [ ] **Bước 4:** Dùng AI theo từng bước → thiết kế test case Domain Testing → **review**.
- [ ] **Bước 5:** Dùng AI theo từng bước → thiết kế test case BVA → **review**.
- [ ] **Bước 6:** Chạy test → ghi nhận pass/fail → log bug (Markdown + GitHub Issues + ảnh).
- [ ] **Bước 7:** Viết AI gap analysis cho từng feature.
- [ ] **Bước 8:** (Khuyến khích) Xây Agent Skill + quay video demo.
- [ ] **Bước 9:** Viết AI Audit Report + AI Critique (200–300 từ).
- [ ] **Bước 10:** Xuất Git commit log + viết README.md (bảng đánh giá + test summary).
- [ ] **Bước 11:** Export báo cáo ra PDF, đóng gói .zip đúng tên, nộp Moodle.

---

## 10. Liên hệ giảng viên / TA

Dr. Lam Quang Vu (lqvu@fit.hcmus.edu.vn) · Dr. Tran Duy Hoang (tdhoang@fit.hcmus.edu.vn) · MSc. Tran Thi Bich Hanh (ttbhanh@fit.hcmus.edu.vn) · MSc. Truong Phuoc Loc (tploc@fit.hcmus.edu.vn) · MSc. Ho Tuan Thanh (hthanh@fit.hcmus.edu.vn)
