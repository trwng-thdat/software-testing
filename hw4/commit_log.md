# HW04 — Git Commit Log

> Yêu cầu §12 đề bài: repo public, **≥ 8 commit** trải **≥ 4 ngày**.
> **Chỉ commit có thay đổi file test script** (`.spec.js` / `.spec.ts` hoặc tương đương) mới được tính.
> Commit chỉ sửa README, PDF hay tài liệu khác **không tính**.

> **Phạm vi đếm:** tính từ sau commit `253de6c` ("chores: cleaning repo") — tức là commit đầu tiên
> của HW04 là `ac12897`. Toàn bộ lịch sử trước mốc này thuộc giai đoạn dọn repo, không tính vào bài.

## Tổng quan

| Chỉ số | Giá trị | Yêu cầu | Đạt |
| --- | --- | --- | --- |
| Tổng số commit (từ sau `253de6c`) | 2 | — | — |
| **Commit tạo/sửa file test script** | **0** | ≥ 8 | ❌ |
| **Số ngày khác nhau có commit test** | **0** | ≥ 4 | ❌ |
| Số ngày khác nhau có commit (mọi loại) | 1 | — | — |
| Khoảng thời gian | 2026-08-07 → 2026-08-07 | — | — |
| Branch | `main` | — | — |

> ⚠️ **Chưa đạt yêu cầu §12.** Hiện có **0/8** commit tạo/sửa file test script, trải **0/4** ngày.
>
> Các commit hiện tại mới là tài liệu và Agent Skill — chưa có file `.spec.ts` nào trong phạm vi đếm.
> Cần viết bộ script automation và commit rải qua ít nhất 4 ngày khác nhau trước khi nộp.

## Danh sách commit (cũ nhất trước)

| # | Hash | Thời gian | Tác giả | Nội dung | File test | Tính §12 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `ac12897` | 2026-08-07 13:57:01 | trwng-thdat | docs(hw04): add submission templates and selenium-automation skill | — | — Không |
| 2 | `5a6553b` | 2026-08-07 13:58:43 | trwng-thdat | docs(hw04): add commit_log.md tracking 12 progress | — | — Không |

## Chi tiết file thay đổi

### 1. `ac12897` — docs(hw04): add submission templates and selenium-automation skill

- **Thời gian:** 2026-08-07 13:57:01
- **Tác giả:** trwng-thdat
- **Tính vào §12:** KHÔNG — không đụng file test script
- **File thay đổi (9):**

  - `hw4/2026.HW04.Automation Testing_En.pdf` — thêm mới
  - `hw4/AI_Critique.md` — thêm mới
  - `hw4/Main_Report.md` — thêm mới
  - `hw4/README.md` — thêm mới
  - `hw4/[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md` — thêm mới
  - `hw4/skills/selenium-automation/SKILL.md` — thêm mới
  - `hw4/skills/selenium-automation/references/eshop-notes.md` — thêm mới
  - `hw4/skills/selenium-automation/references/project-scaffold.md` — thêm mới
  - `hw4/skills/selenium-automation/references/review-checklist.md` — thêm mới

### 2. `5a6553b` — docs(hw04): add commit_log.md tracking 12 progress

- **Thời gian:** 2026-08-07 13:58:43
- **Tác giả:** trwng-thdat
- **Tính vào §12:** KHÔNG — không đụng file test script
- **File thay đổi (1):**

  - `hw4/commit_log.md` — thêm mới

## Lệnh sinh lại file này

```bash
# Toàn bộ commit HW04 (từ sau 253de6c), cũ nhất trước
git log --reverse --pretty=format:"%h | %ad | %an | %s" --date=iso 253de6c..HEAD -- hw4/

# Chỉ commit đụng file test script (đối chiếu yêu cầu §12)
git log --reverse --pretty=format:"%h | %ad | %an | %s" --date=iso 253de6c..HEAD -- "hw4/**/*.spec.ts" "hw4/**/*.spec.js"
```
