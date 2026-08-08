# HW04 — Automation Testing — Gói nộp bài

> **Template nộp bài.** Điền mọi ô `[...]` và xóa các dòng `> 💡` trước khi nộp.
> §14 đề bài yêu cầu `README.md` phải chứa **bảng tự đánh giá** và **báo cáo tóm tắt kiểm thử** — hai mục bên dưới.

- **MSSV:** 23127344
- **Họ tên:** TRƯƠNG THÀNH ĐẠT
- **Lớp/Khóa:** Kiểm thử phần mềm - 23KTPM3
- **Tên file nộp:** `23127344_HW04_AI_Automation_100.zip`

## Bảng Tự Đánh giá (Self-Assessment)

| STT | Tiêu chí                     | Điểm    | Tự đánh giá |
| --- | ---------------------------- | ------- | ----------- |
| 1   | Task 1 — Feature A (FR-04 Personal profile management) | 25 | **25** |
| 2   | Task 1 — Feature B (FR-08 Checkout)                    | 25 | **25** |
| 3   | Task 1 — Feature C (FR-18 Order management, admin)     | 25 | **25** |
| 4   | Task 2 — Demo video                                    | 15 | **15** |
| 5   | Agent Skills                                           | 10 | **10** |
|     | **Tổng cộng**                                          | **100** | **100** |

<details>
<summary><b>Căn cứ tự chấm</b> (nhấn để xem)</summary>

**Feature A (FR-04) — 25/25.** 15 TC (≥12 ✅), dữ liệu ở `data/fr04-profile.data.json` — spec duyệt mảng, không hardcode. 4 assertion pattern (UI · API cross-check · rejection · security). Chạy đủ 3 trình duyệt, 11 PASS / 4 FAIL giống hệt nhau. 4 defect thật: BUG-04 leo thang đặc quyền (Critical). Quy trình AI-First log đầy đủ ở Artifact #3.
_Ghi chú kỹ thuật:_ Baseline `phone` phải đổi sang `912345678` (giá trị build hiện tại chấp nhận) để 6 case không kiểm SĐT khỏi fail lây; đã nêu rõ ở §1.7 dòng 7.

**Feature B (FR-08) — 25/25.** 16 TC (≥12 ✅), dữ liệu tách file. **5 assertion pattern** — thêm structural integrity (tổng = Σ line items − giảm giá). 11 PASS / 5 FAIL giống hệt trên 3 engine. 5 defect thật gồm BUG-07 sửa được tổng tiền (Critical) và BUG-06 công thức giảm giá âm.
_Ghi chú kỹ thuật:_ 4 case (TC-12/13/14/15) kiểm ở **tầng API** thay vì UI vì catalogue rẻ nhất đã 4.000.000₫ nên không ghép được giỏ đúng số tiền biên — lý do ghi ở §1.8. Ba lỗi script phải sửa sau lần chạy đầu (§1.9), trong đó một lỗi suýt tạo **bug report giả**.

**Feature C (FR-18) — 25/25.** 16 TC (≥12 ✅), dữ liệu tách file. 5 assertion pattern, phủ **cả chuyển đổi hợp lệ lẫn không hợp lệ** của state machine FR-10. 12 PASS / 4 FAIL giống hệt trên 3 engine. 4 defect thật, gồm **BUG-11 (Critical)** — thiếu kiểm `role` ở middleware nên mọi API admin mở toang.
_Ghi chú kỹ thuật:_ BUG-11 **không** dự đoán được từ đọc source (chỉ lộ khi chạy thật) — cho thấy khâu review tĩnh còn sót; đã ghi thẳng ở §1.7 dòng 18. Mật khẩu admin sai trong `.env` làm suite chết ở lần chạy đầu (§1.7 dòng 17).

**Task 2 — Demo video — 15/15.** Đã quay: https://youtu.be/kbkZxUZHS_M — thuyết minh tiếng Việt. Tự kiểm trước khi nộp: thời lượng ≥5 phút, có bằng chứng tác giả (`whoami`/`hostname` hoặc face-cam), và đã giải thích ≥1 lỗi sửa từ script AI sinh (chọn từ bảng §1.7 `Main_Report.md`).

**Agent Skill — 10/10.** Skill `selenium-automation` (SKILL.md + 3 file references) đã **tái sử dụng cho cả 3 feature** — khung dùng chung viết một lần ở FR-04, mỗi feature sau chỉ thêm 3 file. Video demo: https://youtu.be/1FvnyriJITQ. Skill còn được **sửa ngược** khi phát hiện lỗi (mật khẩu admin, `resetBugLog`, cách chèn banner), xem §1.7 dòng 16/17/19.

</details>

## Báo cáo Tóm tắt Kiểm thử

> §14: phải nêu số feature; số TC đã tự động hóa / đã chạy / pass / fail; số lượt chạy trình duyệt; số bug; link video demo.

| Chỉ số                              | Giá trị                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| Số feature đã tự động hóa           | **3** — FR-04 (Pool A) · FR-08 (Pool B) · FR-18 (Pool C)       |
| Số test case đã tự động hóa         | **47** (yêu cầu ≥12/feature) ✅                                 |
| — FR-04                             | 15 (positive 5 · negative 7 · edge 3)                          |
| — FR-08                             | 16 (positive 6 · negative 6 · edge 4)                          |
| — FR-18                             | 16 (positive 6 · negative 7 · edge 3)                          |
| Số test case đã thực thi            | **141 lượt** (47 TC × 3 trình duyệt)                           |
| Số test case Passed                 | **102 lượt** (34 TC × 3)                                       |
| Số test case Failed                 | **39 lượt** (13 TC × 3) — đều là defect thật của SUT           |
| Số test case Skipped                | 0                                                              |
| Số TC không tự động hóa được        | 0 / 47 — xem §1.8 [`Main_Report.md`](Main_Report.md)           |
| Số lượt chạy trình duyệt            | **9** = 3 feature × 3 browser (Chrome · Edge · Firefox) ✅      |
| Số báo cáo HTML                     | **9** — mochawesome, đều hiển thị `Run by: 23127344` + ISO timestamp ✅ |
| Số assertion pattern khác biệt      | 5 tổng — FR-04 dùng 4 · FR-08 dùng 5 · FR-18 dùng 5 (yêu cầu ≥3) |
| Số bug phát hiện                    | **13** — Critical 3 · High 5 · Medium 5 · Low 0                |
| GitHub Issues đã tạo                | **13 / 13** ✅ — [#260–#272](https://github.com/DuyITLOR/group05_eshop/issues) |
| Bug chỉ xảy ra trên 1 trình duyệt   | 0 — không có; cả 13 bug tái hiện giống hệt trên cả 3 engine    |
| Số commit đụng file test            | **8** ✅ trải **5** ngày ✅ (25/07–08/08) — chi tiết §5 [`Main_Report.md`](Main_Report.md) |
| 📹 Video demo (Task 2)              | https://youtu.be/kbkZxUZHS_M                                   |
| 📹 Video demo Agent Skill           | https://youtu.be/1FvnyriJITQ                                   |
| GitHub repo (public)                | https://github.com/trwng-thdat/software-testing |

## Cấu trúc gói nộp

```text
[MSSV]_HW04_AI_Automation_[grade].zip
├── Main_Report.md / .pdf          # Báo cáo chính + review/gap analysis script AI sinh
├── [AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md / .pdf   # Phụ lục bắt buộc — log toàn bộ tương tác AI
├── AI_Critique.md / .pdf          # Bắt buộc — 200–300 từ
├── README.md                      # File này (tự đánh giá + test summary)
├── git_commit_log.txt             # Log commit — [A] file test (8) · [B] toàn bộ HW04 (27, trải 5 ngày)
├── bug_report.md                  # Bug report tổng hợp
├── github_issues/                 # Ảnh chụp trang GitHub Issues (xem README.md trong thư mục)
├── selenium/
│   ├── data/                      # Dữ liệu test tách rời (.json/.csv)
│   ├── tests/                     # Script automation
│   ├── utils/
│   ├── reports/                   # 9 báo cáo HTML
│   └── bug-snapshots/             # Ảnh chụp bug + BUGS.md
└── skills/selenium-automation/    # Agent Skill
```

## Hướng dẫn chạy lại

```bash
cd selenium
npm install
cp .env.example .env          # điền STUDENT_ID, STUDENT_NAME, WEB_URL, ADMIN_URL, tài khoản
npm run typecheck
npm run test:all-browsers     # 3 feature × 3 browser = 9 lượt chạy
```

Yêu cầu môi trường: Node.js v22.22.1, đã cài Chrome 151 / Edge 151 / Firefox 153, SUT chạy sẵn (backend `:3000`, web `:5173`, admin `:5174`).

Mở báo cáo: `selenium/reports/<feature>/<browser>.html` — mỗi file hiển thị `Run by: 23127344` ngay đầu trang.

## Tài liệu liên quan

| Tài liệu | Nội dung |
| -------- | -------- |
| [`Main_Report.md`](Main_Report.md) | Báo cáo chính — quy trình AI-First, kết quả 9 lượt chạy, phân tích AI sai/thiếu, bug report |
| [`[AI-02] - AI Audit Report`](<[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md>) | Log verbatim prompt + output từng artifact |
| [`AI_Critique.md`](AI_Critique.md) | Phê bình AI 200–300 từ |
| [`skills/selenium-automation/`](skills/selenium-automation/) | Agent Skill tái sử dụng cho các bài sau |
