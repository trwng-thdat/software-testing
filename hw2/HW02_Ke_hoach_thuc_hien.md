# HW02 – Kế hoạch thực hiện tổng thể

> Roadmap để hoàn thành HW02 (Domain Testing + BVA trên EShop).
> Mục tiêu: nộp đủ deliverable, đúng quy trình "AI-First nhưng có review", không bị 0 điểm vì thiếu tài liệu.

---

## 0. Quyết định đã chốt

- [x] Đã chọn 4 feature (mỗi pool 1, không trùng nhóm).
- [ ] **Điền tên 4 FR vào đây:**

| Pool | FR đã chọn | Tên feature | Vì sao hợp Domain/BVA |
| ---- | ---------- | ----------- | --------------------- |
| A    | FR-__      |             |                       |
| B    | FR-__      |             |                       |
| C    | FR-__      |             |                       |
| D (Mobile) | FR-__ |             |                       |

> ⚠️ Lưu ý: file [TD-POOL-A.md](../../group05_eshop/tests/test-design/TD-POOL-A.md) hiện gom 4 FR của **cùng Pool A** (FR-01/02/03/05). Đề yêu cầu **1 feature/pool** → cần xác định FR Pool A chính thức của bạn là cái nào, phần còn lại để tham khảo.

---

## 1. Cấu trúc thư mục đề xuất (gom theo feature)

```
software-testing/hw2/
├── HW02_Main_Report.md         # báo cáo chính: 4 feature × (Domain + BVA + gap analysis)
├── report/
│   ├── FR-A/                   # 1 thư mục / feature
│   │   ├── domain-testing.md
│   │   ├── bva.md
│   │   ├── gap-analysis.md
│   │   └── screenshots/
│   ├── FR-B/ ...
│   ├── FR-C/ ...
│   └── FR-D/ ...
├── audit.md                    # AI Audit Report (đã có skill gen-audit-log)
├── ai-critique.md              # 200–300 từ
├── git-commit-log.txt
└── README.md                   # bảng tự đánh giá + test summary
```

---

## 2. Quy trình cho MỖI feature (lặp 4 lần)

Mỗi feature đi đủ 6 bước dưới. **Commit Git sau mỗi bước** (yêu cầu mục 12 của đề).

### Bước 1 — Hiểu feature & xác định input/output
- Đọc code thật trong `group05_eshop` (backend `server.js`, frontend tương ứng) + `api_specification.md`.
- Ghi: các biến input, miền giá trị, ràng buộc (độ dài, kiểu, min/max, định dạng), output mong đợi.
- → commit: `docs(FR-x): analyze inputs & constraints`

### Bước 2 — Domain Testing (Equivalence Partitioning)
- Dùng skill `domain-testing` → dẫn AI **từng bước**: biến → miền → phân vùng valid/invalid → chọn đại diện → test case.
- **Tự review** từng class, bổ sung class AI sót.
- → commit: `test(FR-x): domain testing test cases`

### Bước 3 — Boundary Value Analysis
- Dùng skill `boundary-value-analysis` → biên đóng/mở → chọn 2-value/3-value → bảng biên → test case.
- Tái dùng bảng Equivalence Classes từ bước 2.
- → commit: `test(FR-x): BVA test cases`

### Bước 4 — Thực thi test trên SUT
- Chạy EShop local, execute test case, ghi **pass/fail**.
- Ghi test run vào `tests/test-runs/`.
- → commit: `test(FR-x): execute & record test run`

### Bước 5 — Bug reporting
- Mỗi bug: ghi trong báo cáo Markdown **VÀ** tạo **GitHub Issue** ở repo nhóm, **kèm ảnh chụp**.
- → commit: `docs(FR-x): bug reports + screenshots`

### Bước 6 — AI gap analysis
- Liệt kê test case/bug **AI bỏ sót** + **giải thích vì sao** (prompt yếu? giới hạn AI? feature phức tạp?).
- → commit: `docs(FR-x): AI gap analysis`

---

## 3. Deliverable toàn cục (làm sau khi xong 4 feature)

- [ ] **Báo cáo chính** (Markdown + **PDF**): gồm cả Domain Testing và BVA của 4 feature.
- [ ] **Bug report** + ảnh trên GitHub Issues.
- [ ] **AI Audit Report** (Markdown + PDF) — chạy skill `gen-audit-log` cuối phiên.
- [ ] **AI Critique** 200–300 từ (AI sai/thiên lệch/thiếu ở đâu, vì sao, bài học cộng tác với AI).
- [ ] **Git commit log** (file text): `git log > git-commit-log.txt`.
- [ ] **README.md**: bảng tự đánh giá + test summary (số feature; test case designed/executed/passed/failed/not-run; số bug; link video demo).
- [ ] **Agent Skills + video demo YouTube** (10đ) — đã có 3 skill, cần quay end-to-end 1 feature.
- [ ] Export PDF, đóng gói `.zip` đúng tên: `<MSSV>_HW02_AI_DomainTesting_<điểm 3 số>.zip`.

---

## 4. Thứ tự làm đề xuất (để không kẹt)

1. **Điền 4 FR** vào bảng mục 0.
2. **Chạy được SUT local** (điều kiện bắt buộc để execute test + chụp bug). Xem `group05_eshop/setup_guide.md`.
3. Làm **trọn vẹn feature A** (6 bước) như bản mẫu → kiểm chứng quy trình + skill chạy đúng.
4. Lặp cho B, C, D.
5. Tổng hợp deliverable toàn cục (mục 3).
6. Quay video demo skill, export PDF, đóng gói nộp.

---

## 5. Ghi chú quan trọng (tránh mất điểm)

- ❌ KHÔNG prompt chung chung kiểu "generate test cases and find bugs" → vi phạm nguyên tắc AI-First.
- ❌ KHÔNG nộp raw AI output chưa review.
- ❌ Thiếu **bất kỳ** tài liệu bắt buộc → **0 điểm**. Nộp trễ → không nhận. Copy (kể cả prompt) → 0 cả hai bên.
- ✅ Commit Git **từng bước**, từng feature.
- ✅ Mỗi prompt + AI output phải vào được AI Audit Report (skill `gen-audit-log` chỉ chạy khi prompt nhắc tên skill).
