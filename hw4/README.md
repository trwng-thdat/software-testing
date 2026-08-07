# HW04 — Automation Testing — Gói nộp bài

> **Template nộp bài.** Điền mọi ô `[...]` và xóa các dòng `> 💡` trước khi nộp.
> §14 đề bài yêu cầu `README.md` phải chứa **bảng tự đánh giá** và **báo cáo tóm tắt kiểm thử** — hai mục bên dưới.

- **MSSV:** [MSSV]
- **Họ tên:** [Họ tên]
- **Lớp/Khóa:** [Lớp]
- **Tên file nộp:** `[MSSV]_HW04_AI_Automation_[000-100].zip`

## Bảng Tự Đánh giá (Self-Assessment)

| STT | Tiêu chí                     | Điểm    | Tự đánh giá |
| --- | ---------------------------- | ------- | ----------- |
| 1   | Task 1 — Feature A (FR-04 Personal profile management) | 25 | **[n]** |
| 2   | Task 1 — Feature B (FR-08 Checkout)                    | 25 | **[n]** |
| 3   | Task 1 — Feature C (FR-18 Order management, admin)     | 25 | **[n]** |
| 4   | Task 2 — Demo video                                    | 15 | **[n]** |
| 5   | Agent Skills                                           | 10 | **[n]** |
|     | **Tổng cộng**                                          | **100** | **[n]** |

<details>
<summary><b>Căn cứ tự chấm</b> (nhấn để xem)</summary>

**Feature A (FR-04) — [n]/25.** [Số TC đã tự động hóa vs yêu cầu ≥12; dữ liệu tách file; số assertion pattern; 3 lượt chạy trình duyệt; số bug kèm Issue; quy trình AI-First có log đầy đủ.]
_Trừ [n] điểm:_ [nêu thẳng hạn chế thật, đừng giấu — HW03 được đánh giá cao ở chỗ tự nêu giới hạn.]

**Feature B (FR-08) — [n]/25.** [...]
_Trừ [n] điểm:_ [...]

**Feature C (FR-18) — [n]/25.** [...]
_Trừ [n] điểm:_ [...]

**Task 2 — Demo video — [n]/15.** [Thời lượng thực tế vs yêu cầu ≥5 phút; thuyết minh tiếng Việt; bằng chứng tác giả (`whoami`/`hostname` hoặc face-cam); đã giải thích ≥1 lỗi sửa từ script AI.]

**Agent Skill — [n]/10.** [Skill `selenium-automation` + video demo end-to-end; đã tái sử dụng cho [n] feature.]

</details>

## Báo cáo Tóm tắt Kiểm thử

> §14: phải nêu số feature; số TC đã tự động hóa / đã chạy / pass / fail; số lượt chạy trình duyệt; số bug; link video demo.

| Chỉ số                              | Giá trị                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| Số feature đã tự động hóa           | **3** — FR-04 (Pool A) · FR-08 (Pool B) · FR-18 (Pool C)       |
| Số test case đã tự động hóa         | **[≥36]** (yêu cầu ≥12/feature)                                |
| — FR-04                             | [n] (positive [n] · negative [n] · edge [n])                   |
| — FR-08                             | [n] (positive [n] · negative [n] · edge [n])                   |
| — FR-18                             | [n] (positive [n] · negative [n] · edge [n])                   |
| Số test case đã thực thi            | **[n]**                                                        |
| Số test case Passed                 | **[n]**                                                        |
| Số test case Failed                 | **[n]**                                                        |
| Số test case Skipped                | [n]                                                            |
| Số TC không tự động hóa được        | [n] — lý do ở §1.8 [`Main_Report.md`](Main_Report.md)          |
| Số lượt chạy trình duyệt            | **[≥9]** = 3 feature × 3 browser (Chrome · Edge · Firefox)     |
| Số báo cáo HTML                     | **9** — mochawesome, đều hiển thị `Run by: [MSSV]` + ISO timestamp |
| Số assertion pattern khác biệt      | [n] (yêu cầu ≥3/feature)                                       |
| Số bug phát hiện                    | **[n]** — Critical [n] · High [n] · Medium [n] · Low [n]       |
| GitHub Issues đã tạo                | [n] — [link]                                                   |
| Bug chỉ xảy ra trên 1 trình duyệt   | [n] — [nêu rõ browser nào, hoặc "không có"]                    |
| Số commit đụng file test            | [n ≥ 8] trải [n ≥ 4] ngày                                      |
| 📹 Video demo (Task 2)              | [YouTube unlisted link]                                        |
| 📹 Video demo Agent Skill           | [YouTube link]                                                 |
| GitHub repo (public)                | [link]                                                         |

## Cấu trúc gói nộp

```text
[MSSV]_HW04_AI_Automation_[grade].zip
├── Main_Report.md / .pdf          # Báo cáo chính + review/gap analysis script AI sinh
├── [AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md / .pdf   # Phụ lục bắt buộc — log toàn bộ tương tác AI
├── AI_Critique.md / .pdf          # Bắt buộc — 200–300 từ
├── README.md                      # File này (tự đánh giá + test summary)
├── git_commit_log.txt             # Log commit (chỉ tính commit đụng file test)
├── bug_report.md                  # Bug report tổng hợp
├── github_issues/                 # Ảnh chụp Issues trên GitHub
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

Yêu cầu môi trường: Node.js [ver], đã cài Chrome / Edge / Firefox, SUT chạy sẵn (backend `:3000`, web `:5173`, admin `:5174`).

Mở báo cáo: `selenium/reports/<feature>/<browser>.html` — mỗi file hiển thị `Run by: [MSSV]` ngay đầu trang.

## Tài liệu liên quan

| Tài liệu | Nội dung |
| -------- | -------- |
| [`Main_Report.md`](Main_Report.md) | Báo cáo chính — quy trình AI-First, kết quả 9 lượt chạy, phân tích AI sai/thiếu, bug report |
| [`[AI-02] - AI Audit Report`](<[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md>) | Log verbatim prompt + output từng artifact |
| [`AI_Critique.md`](AI_Critique.md) | Phê bình AI 200–300 từ |
| [`skills/selenium-automation/`](skills/selenium-automation/) | Agent Skill tái sử dụng cho các bài sau |
