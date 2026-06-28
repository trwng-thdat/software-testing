# HW02 — Domain Testing on EShop

| Trường              | Giá trị                                                |
| ------------------- | ------------------------------------------------------ |
| Họ tên              | Trương Thành Đạt                                       |
| MSSV                | 23217344                                               |
| Lớp / Nhóm          | Kiểm thử phần mềm - 23KTPM3                            |
| Môn học             | CS423 / CSC13003 – Software Testing                    |
| Assignment          | HW02 — Domain Testing                                  |
| Self-Assessed Grade | 100                                                    |
| GitHub repo (nhóm)  | https://github.com/DuyITLOR/group05_eshop        |
| GitHub Issues       | https://github.com/DuyITLOR/group05_eshop/issues |

---

## 1. Test Summary Report

| Chỉ số             | A   | B   | C   | D   | Tổng |
| ------------------ | --- | --- | --- | --- | ---- |
| Số feature         | 1   | 1   | 1   | 1   | 4    |
| Test case thiết kế | 23  | 20  | 23  | 17  | 83   |
| Đã execute         | 23  | 20  | 23  | 17  | 83   |
| Pass               | 6   | 9   | 17  | 3   | 35   |
| Fail               | 17  | 11  | 5   | 14  | 47   |
| Chưa execute       | 0   | 0   | 0   | 0   | 0    |
| Bug                | 8   | 4   | 3   | 5   | 20   |

> **Ghi chú số liệu:**
>
> - **Feature C** có thêm **1 TC "cần xác minh spec"** (TC-ADMIN_ORDER-019 `shipping → canceled`) — đã execute (trả 400) nhưng verdict phụ thuộc SRS nên chưa tính vào Pass/Fail: `17 Pass + 5 Fail + 1 cần xác minh = 23`. Tổng toàn bài: 35 Pass + 47 Fail + 1 cần xác minh = 83.
> - **Feature A** liệt kê **8 bug** (BUG-A-01…08); trong đó **BUG-A-06** (mobile camelCase mismatch) được kiểm chứng chéo ở Feature D. Tổng bug toàn bài (distinct): **20**.

**Các feature đã chọn (1 feature / pool):**

| Ký hiệu   | Pool       | FR ID | Tên feature                 |
| --------- | ---------- | ----- | --------------------------- |
| Feature A | A          | FR-04 | Personal profile management |
| Feature B | B          | FR-08 | Checkout                    |
| Feature C | C          | FR-18 | Order management (admin)    |
| Feature D | D (Mobile) | D3    | Mobile – Registration       |

---

## 2. Self-Assessment Table

| No. | Tiêu chí                              | Điểm tối đa | Tự đánh giá |
| --- | ------------------------------------- | ----------- | ----------- |
| 1   | Feature A (Domain + Boundary)         | 25          | 25          |
| 2   | Feature B (Domain + Boundary)         | 25          | 25          |
| 3   | Feature C (Domain + Boundary)         | 25          | 25          |
| 4   | Feature D (Mobile, Domain + Boundary) | 15          | 15          |
| 5   | Agent Skills                          | 10          | 10          |
|     | **Tổng**                              | **100**     | **100**     |

---

## 3. Demo Videos (YouTube)

- Agent Skill demo (Domain Testing + BVA + gen-audit-log, end-to-end): https://youtu.be/v4ZGrT17Z8g

---

## 4. Nội dung gói nộp

| Tài liệu                                  | File / Vị trí                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Báo cáo chính (Domain Testing + BVA)      | `HW02_Main_Report_Template.md` (+ bản PDF)                                 |
| Bug report (kèm link GitHub Issues + ảnh) | Mục A.4 / B.4 / C.4 / D.4 trong báo cáo chính; `images/`                   |
| Bug report — title & description (issue)   | `bug-reports-github-issues.md`                                             |
| AI Critique (200–300 từ)                  | Section 4 của báo cáo chính                                                |
| AI Audit Report                           | `../../audit.md` (Phụ lục A)                                               |
| Git commit log                            | `git-commit-log.txt`                                                       |
| Agent Skills                              | `.claude/skills/` (domain-testing, boundary-value-analysis, gen-audit-log) |
| File thực thi test                        | `TC-PROFILE.rest`, `TC-CHECKOUT.rest`, `TC-ADMIN_ORDER.rest`, `TC-MOB_REG.rest` |

---

## 5. Môi trường test

- Windows 11 Version 25H2 · Node.js v22.22.1
- Backend chạy `http://localhost:3000` (reset DB bằng `node database.js` rồi `node server.js`)
- Gọi API trực tiếp bằng REST Client / curl; đọc DB bằng `sqlite3` để xác minh giá trị lưu
