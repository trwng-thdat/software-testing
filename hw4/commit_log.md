# HW04 — Git Commit Log

> Yêu cầu §12 đề bài: repo public, **≥ 8 commit** trải **≥ 4 ngày**.
> **Chỉ commit có thay đổi file test script** (`.spec.js` / `.spec.ts` hoặc tương đương) mới được tính.
> Commit chỉ sửa README, PDF hay tài liệu khác **không tính**.

## Tổng quan

| Chỉ số | Giá trị | Yêu cầu | Đạt |
| --- | --- | --- | --- |
| Tổng số commit đụng `hw4/` | 8 | — | — |
| **Commit tạo/sửa file test script** | **1** | ≥ 8 | ❌ |
| **Số ngày khác nhau có commit test** | **1** | ≥ 4 | ❌ |
| Số ngày khác nhau có commit (mọi loại) | 4 | — | — |
| Khoảng thời gian | 2026-07-25 → 2026-08-07 | — | — |
| Branch | `main` | — | — |

> ⚠️ **Chưa đạt yêu cầu §12.** Hiện mới có **1/8** commit tạo/sửa file test script, trải **1/4** ngày.
>
> Lưu ý về lịch sử: thư mục `hw4/selenium/` (3 file `.spec.ts` \+ data \+ utils) đã từng tồn tại ở
> commit `aa283fd` (29/07/2026) nhưng **bị xóa** ở commit `253de6c` (07/08/2026, "chores: cleaning repo").
> Commit xóa không được tính là công việc viết test. Cần khôi phục hoặc viết lại bộ script và commit
> rải qua ít nhất 4 ngày khác nhau trước khi nộp.

## Danh sách commit (mới nhất trước)

| # | Hash | Thời gian | Tác giả | Nội dung | File test | Tính §12 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `ac12897` | 2026-08-07 13:57:01 | trwng-thdat | docs(hw04): add submission templates and selenium-automation skill | — | — Không |
| 2 | `253de6c` | 2026-08-07 09:04:47 | trwng-thdat | chores: cleaning repo | 3 file bị xóa | — Không (chỉ xóa) |
| 3 | `5a3b33d` | 2026-07-29 21:27:48 | trwng-thdat | feat: initialize report template | — | — Không |
| 4 | `aa283fd` | 2026-07-29 09:34:47 | trwng-thdat | feat: add selenium folder | 3 file | ✅ Có |
| 5 | `6a89481` | 2026-07-26 13:14:18 | trwng-thdat | docs: add testcases for all FR | — | — Không |
| 6 | `82d2a80` | 2026-07-26 12:34:45 | trwng-thdat | docs: update skill for selenium and delete unuse skill | — | — Không |
| 7 | `127abc7` | 2026-07-25 21:38:54 | trwng-thdat | docs: add skill for generate selenium script | — | — Không |
| 8 | `b0a17fa` | 2026-07-25 12:05:22 | trwng-thdat | feat: initialize report file for homework | — | — Không |

## Chi tiết file thay đổi

### `ac12897` — docs(hw04): add submission templates and selenium-automation skill

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

### `253de6c` — chores: cleaning repo

- **Thời gian:** 2026-08-07 09:04:47
- **Tác giả:** trwng-thdat
- **Tính vào §12:** KHÔNG — commit này chỉ xóa file test
- **File thay đổi (25):**

  - `hw4/2026.HW04.Automation Testing_En.pdf` — xóa
  - `hw4/HW04_Main_Report_Template.md` — xóa
  - `hw4/[AI-02] - FIT@HCMUS - AI Audit Report_VN.md` — xóa
  - `hw4/docs/eshop-sut` — xóa
  - `hw4/selenium/.env.example` — xóa
  - `hw4/selenium/.gitignore` — xóa
  - `hw4/selenium/.mocharc.json` — xóa
  - `hw4/selenium/README.md` — xóa
  - `hw4/selenium/data/category-management.data.json` — xóa
  - `hw4/selenium/data/product-listing-search.data.json` — xóa
  - `hw4/selenium/data/shopping-cart.data.json` — xóa
  - `hw4/selenium/package-lock.json` — xóa
  - `hw4/selenium/package.json` — xóa
  - `hw4/selenium/pnpm-lock.yaml` — xóa
  - `hw4/selenium/tests/category-management.spec.ts` — xóa
  - `hw4/selenium/tests/product-listing-search.spec.ts` — xóa
  - `hw4/selenium/tests/shopping-cart.spec.ts` — xóa
  - `hw4/selenium/tsconfig.json` — xóa
  - `hw4/selenium/utils/api.ts` — xóa
  - `hw4/selenium/utils/bugReporter.ts` — xóa
  - `hw4/selenium/utils/config.ts` — xóa
  - `hw4/selenium/utils/driver.ts` — xóa
  - `hw4/selenium/utils/reportMetadata.js` — xóa
  - `hw4/selenium/utils/setup.js` — xóa
  - `hw4/skills/selenium-automation/SKILL.md` — xóa

### `5a3b33d` — feat: initialize report template

- **Thời gian:** 2026-07-29 21:27:48
- **Tác giả:** trwng-thdat
- **Tính vào §12:** KHÔNG — không đụng file test script
- **File thay đổi (1):**

  - `hw4/docs/eshop-sut` — thêm mới

### `aa283fd` — feat: add selenium folder

- **Thời gian:** 2026-07-29 09:34:47
- **Tác giả:** trwng-thdat
- **Tính vào §12:** CÓ
- **File thay đổi (24):**

  - `hw4/HW04_Main_Report_Template.md` — sửa
  - `hw4/[AI-02] - FIT@HCMUS - AI Audit Report_VN.md` — sửa
  - `hw4/docs/README.md` — xóa
  - `hw4/docs/api_specification.md` — xóa
  - `hw4/selenium/.env.example` — thêm mới
  - `hw4/selenium/.gitignore` — thêm mới
  - `hw4/selenium/.mocharc.json` — thêm mới
  - `hw4/selenium/README.md` — thêm mới
  - `hw4/selenium/data/category-management.data.json` — thêm mới
  - `hw4/selenium/data/product-listing-search.data.json` — thêm mới
  - `hw4/selenium/data/shopping-cart.data.json` — thêm mới
  - `hw4/selenium/package-lock.json` — thêm mới
  - `hw4/selenium/package.json` — thêm mới
  - `hw4/selenium/pnpm-lock.yaml` — thêm mới
  - `hw4/selenium/tests/category-management.spec.ts` — thêm mới
  - `hw4/selenium/tests/product-listing-search.spec.ts` — thêm mới
  - `hw4/selenium/tests/shopping-cart.spec.ts` — thêm mới
  - `hw4/selenium/tsconfig.json` — thêm mới
  - `hw4/selenium/utils/api.ts` — thêm mới
  - `hw4/selenium/utils/bugReporter.ts` — thêm mới
  - `hw4/selenium/utils/config.ts` — thêm mới
  - `hw4/selenium/utils/driver.ts` — thêm mới
  - `hw4/selenium/utils/reportMetadata.js` — thêm mới
  - `hw4/selenium/utils/setup.js` — thêm mới

### `6a89481` — docs: add testcases for all FR

- **Thời gian:** 2026-07-26 13:14:18
- **Tác giả:** trwng-thdat
- **Tính vào §12:** KHÔNG — không đụng file test script
- **File thay đổi (1):**

  - `hw4/HW04_Main_Report_Template.md` — sửa

### `82d2a80` — docs: update skill for selenium and delete unuse skill

- **Thời gian:** 2026-07-26 12:34:45
- **Tác giả:** trwng-thdat
- **Tính vào §12:** KHÔNG — không đụng file test script
- **File thay đổi (4):**

  - `hw4/skills/selenium-automation/SKILL.md` — sửa
  - `hw4/skills/state-transition-testing/SKILL.md` — xóa
  - `hw4/skills/state-transition-testing/references/test-design-format.md` — xóa
  - `hw4/skills/state-transition-testing/references/testcase-format.md` — xóa

### `127abc7` — docs: add skill for generate selenium script

- **Thời gian:** 2026-07-25 21:38:54
- **Tác giả:** trwng-thdat
- **Tính vào §12:** KHÔNG — không đụng file test script
- **File thay đổi (7):**

  - `hw4/[AI-02] - FIT@HCMUS - AI Audit Report_VN.md` — sửa
  - `hw4/docs/README.md` — thêm mới
  - `hw4/docs/api_specification.md` — thêm mới
  - `hw4/skills/selenium-automation/SKILL.md` — thêm mới
  - `hw4/skills/state-transition-testing/SKILL.md` — thêm mới
  - `hw4/skills/state-transition-testing/references/test-design-format.md` — thêm mới
  - `hw4/skills/state-transition-testing/references/testcase-format.md` — thêm mới

### `b0a17fa` — feat: initialize report file for homework

- **Thời gian:** 2026-07-25 12:05:22
- **Tác giả:** trwng-thdat
- **Tính vào §12:** KHÔNG — không đụng file test script
- **File thay đổi (3):**

  - `hw4/2026.HW04.Automation Testing_En.pdf` — thêm mới
  - `hw4/HW04_Main_Report_Template.md` — thêm mới
  - `hw4/[AI-02] - FIT@HCMUS - AI Audit Report_VN.md` — thêm mới

## Lệnh sinh lại file này

```bash
# Toàn bộ commit đụng hw4/
git log --pretty=format:"%h | %ad | %an | %s" --date=iso -- hw4/

# Chỉ commit đụng file test script (đối chiếu yêu cầu §12)
git log --pretty=format:"%h | %ad | %an | %s" --date=iso -- "hw4/**/*.spec.ts" "hw4/**/*.spec.js"
```
