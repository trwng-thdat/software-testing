---
name: selenium-automation
description: Build, review, run, and evidence a data-driven Selenium automation suite for the EShop SUT under HW04 rules - TypeScript + Mocha + Chai + selenium-webdriver + mochawesome, JSON/CSV data files, three assertion patterns, Chrome/Edge/Firefox execution, HTML reports stamped "Run by: {StudentID}" with an ISO timestamp, AI-gap analysis, bug reports, and an AI audit log. Use when the user asks to automate HW04 features, generate or fix Selenium scripts, run cross-browser suites, produce HTML reports, or assemble HW04 automation deliverables.
---

# Selenium Automation - HW04

Produce a Selenium suite that is **runnable, data-driven, cross-browser, evidenced, and auditable**. HW04 grades quantity *and* quality of deliverables: scripts, data files, HTML reports, bug report, gap analysis, demo video, AI audit log.

Work the AI-first strategy the way the assignment defines it: drive generation **step by step per test case**, never with one generic "write all the scripts" prompt. Then review every generated line and take responsibility for it.

## Non-negotiable HW04 constraints

| Constraint | Rule |
|---|---|
| Features | Exactly 3 web features, one each from Pool A, Pool B, Pool C. Reuse the HW02 selection. Pool D (mobile) is excluded. |
| Test cases | **>= 12 automated test cases per feature** (36 total minimum). Any mix of positive / negative / edge counts. |
| Data-driven | Test data lives in `data/<feature>.data.json` or `.csv`. Inline arrays or object literals in the spec are **rejected by the grader**. |
| Assertions | **>= 3 distinct assertion patterns** per feature (see Assertion Patterns). |
| Browsers | Chrome + Edge + Firefox. Every feature on every browser => **>= 9 browser runs**. |
| Reports | One mochawesome HTML report per feature per browser, visibly showing `Run by: <StudentID>` **and** an ISO timestamp. |
| Honesty | Never fabricate a run, a report, a timestamp, or a pass/fail count. Reports and video are anti-cheat-verified by TAs. |
| Commits | >= 8 commits over >= 4 days, and only commits touching test-script files count. |

WebKit is a Playwright engine. In a Selenium project the accepted trio is Chrome / Edge / Firefox - state this explicitly in the report rather than silently substituting.

## Step 0 - Ground yourself in the SUT before writing code

Read, in this order:

1. `docs/eshop-sut/setup_guide.md` - ports and seeded credentials.
2. `docs/eshop-sut/api_specification.md` - endpoints for API-backed assertions and for seeding/teardown.
3. `docs/eshop-sut/README.md` and the SRS - expected behaviour, which is what you assert against.
4. The HW02 test case tables - each TC ID becomes one `it()`.
5. The actual component source for the pages you automate (`frontend-web/src/pages/*.jsx`, `frontend-admin/src/App.jsx`) - this is how you learn the real DOM.

If docs are missing, ask before generating. If the docs give no route for a feature, skip the UI script and say why instead of inventing a URL.

### EShop facts that change the design

These are verified properties of this SUT. Ignoring them produces scripts that cannot pass.

- **Three origins, not one.** Backend API `http://localhost:3000`, customer web `http://localhost:5173`, **admin web `http://localhost:5174`**. A single `FRONTEND_URL` cannot address a Pool C feature - see the `.env` contract.
- **Admin is a tabbed SPA, not a router.** `frontend-admin` has no `react-router` routes; navigation is `activeTab` state. Never navigate to `/admin/orders` - click the tab, then wait for its table.
- **Zero `data-testid` attributes** exist in either frontend. Selector discipline is on you (see Selectors).
- **Feedback comes through native `alert()`**, heavily in admin and in Profile/Cart/Checkout/ForgotPassword. A browser alert **blocks WebDriver** - unhandled it throws `UnexpectedAlertOpenError` mid-test. Handle alerts explicitly (see Alert Handling).
- **The SUT is intentionally buggy** - validation, authorization, and XSS/SQLi defects are seeded deliberately. A failing assertion is often a real finding, not a broken script. Triage before "fixing".
- Customer routes: `/`, `/login`, `/register`, `/forgot-password`, `/profile`, `/product/:id`, `/cart`, `/checkout`.
- Default admin login: `admin@eshop.com` / `admin123`.

## Project structure

```text
selenium/
  .env.example
  .gitignore              # must ignore .env
  package.json
  tsconfig.json
  .mocharc.json
  README.md
  data/
    <feature>.data.json   # one per feature
  tests/
    <feature>.spec.ts     # one per feature
  utils/
    config.ts             # .env load + validation + RUN_BY + ISO timestamp
    driver.ts             # browser factory (chrome | edge | firefox)
    dataLoader.ts         # JSON/CSV -> typed cases
    reportMetadata.ts     # inject visible Run by / timestamp into HTML
    bugReporter.ts        # screenshot + BUGS.md + mochawesome context
    alerts.ts             # native alert capture helpers
    api.ts                # seed / teardown / API-backed assertions
  reports/
    <feature>/
      chrome.html
      edge.html
      firefox.html
      assets/
  bug-snapshots/
    BUGS.md
    <TC-ID>.png
```

One spec file per feature, one data file per feature. Read `references/project-scaffold.md` for the concrete file contents to generate.

## .env contract

Nothing identity- or environment-specific may be hardcoded in a spec.

```env
STUDENT_ID=
STUDENT_NAME=
API_URL=http://localhost:3000
WEB_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
BROWSERS=chrome,edge,firefox
HEADLESS=true
REPORT_BASE_DIR=reports
RUN_TIMESTAMP=
DEFAULT_TIMEOUT_MS=10000
ADMIN_EMAIL=admin@eshop.com
ADMIN_PASSWORD=admin123
USER_EMAIL=
USER_PASSWORD=
```

`utils/config.ts` must load `dotenv/config`, fail fast with a clear message on any missing required variable, parse `BROWSERS` against the allowlist `chrome | edge | firefox`, expose `RUN_BY = "Run by: " + STUDENT_ID`, and expose an ISO timestamp (`RUN_TIMESTAMP` if set, else `new Date().toISOString()`).

Keep `WEB_URL` and `ADMIN_URL` separate. A Pool C spec resolves its base URL from `ADMIN_URL`.

## Data-driven design

Each data file is an array of case objects keyed by the HW02 TC ID:

```json
[
  {
    "tcId": "TC-PROFILE-01",
    "title": "Update display name with valid value",
    "type": "positive",
    "input": { "fullName": "Nguyen Van A", "phone": "0901234567" },
    "expected": { "message": "Cập nhật thành công", "persisted": true }
  }
]
```

Rules:

- The spec **iterates** the loaded array - `for (const c of cases) it(\`${c.tcId} - ${c.title}\`, ...)`. Never `it('TC-01', ...)` with literals inside.
- `expected` encodes the **specification's** behaviour, not the SUT's current buggy behaviour. Asserting the bug hides the bug.
- Cover positive, negative, and edge in the same file; `type` drives reporting counts.
- If CSV is used, parse it in `utils/dataLoader.ts` and coerce types explicitly - CSV yields strings, and `"0" == false` bugs are easy to introduce.
- >= 12 cases per feature. Count them programmatically in the verification gate rather than by eye.

## Assertion patterns

Use at least three genuinely distinct patterns per feature, and name them in the report. Distinct means *different kind of evidence*, not three `assert.equal` calls.

1. **UI state / text assertion** - visible message, field value, element presence, list length.
2. **Persistence / API cross-check** - after a UI action, query `API_URL` and assert the stored record actually changed. Catches "UI says success, DB unchanged" defects.
3. **Negative / rejection assertion** - invalid input must be rejected: error shown, no navigation, no record created. Assert the absence, not just the presence.
4. **Structural / data-integrity assertion** - totals equal the sum of line items, order status matches the allowed state machine, list is sorted, pagination count is consistent.
5. **Security-behaviour assertion** - a non-admin token cannot reach an admin endpoint; an XSS payload is rendered as text, not executed.

Patterns 2, 4, and 5 are what separate a graded-well suite from a shallow one on this SUT.

## Selectors

There are no test IDs, so apply this order and document any drop to a lower tier:

1. Accessible/semantic - `By.css('button[type=submit]')`, label-driven lookup, `input[name=...]`, `input[type=email]`.
2. Stable attributes present in source - `name`, `type`, `placeholder` (this app relies on placeholders heavily).
3. Scoped structural CSS - `table tbody tr` scoped to a container you first located by heading text.
4. XPath by visible text - last resort, and brittle against i18n. The UI is Vietnamese; if you match text, match the exact Vietnamese string from source and note the coupling.

Never use generated class hashes, absolute XPath, or `nth-child` chains off `body`.

## Waits and alert handling

- Use `driver.wait(until.elementLocated(...))` / `until.elementIsVisible(...)`. No `sleep()` except for a genuine business delay, and comment it if so.
- Wrap any action that triggers a native `alert()`:

```ts
// utils/alerts.ts
export async function actAndReadAlert(driver: WebDriver, action: () => Promise<void>) {
  await action();
  await driver.wait(until.alertIsPresent(), TIMEOUT);
  const alert = await driver.switchTo().alert();
  const text = await alert.getText();
  await alert.accept();
  return text;             // assert on this instead of hunting for a DOM node
}
```

- Always dismiss alerts in `afterEach` too - a leaked alert poisons every subsequent test in the file and looks like flakiness.
- React re-render causes `StaleElementReferenceError`. Re-locate elements after a state change; do not cache `WebElement` across an action.

## Reports

Use **mochawesome**. Do not mix in Allure or the Playwright reporter in this project.

Per feature, one folder `reports/<feature>/`; per browser, one file named for the browser:

```text
reportDir=reports/<feature>
reportFilename=<browser>     # chrome | edge | firefox - computed, never static
overwrite=true
html=true
json=true
charts=true
```

`reportFilename` **must** be derived from the current browser. A static `index`/`report`/`mochawesome` value makes each browser overwrite the last, leaving one file where the grader expects nine. `overwrite=true` is safe only because the filename is unique - rerunning Chrome may replace `chrome.html`, never `edge.html`.

`utils/reportMetadata.ts` injects a visible block into each generated HTML:

```text
Run by: <StudentID>
Student: <StudentName>
Feature: <feature>
Browser: <browser>
Timestamp: <ISO timestamp>
```

It must be readable by opening the HTML file in a browser - console output and JSON-only metadata do not satisfy the anti-cheat requirement. `Run by: <StudentID>` and the ISO timestamp are both mandatory and both verified.

Recommended scripts:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test:chrome":  "cross-env BROWSER=chrome  mocha",
    "test:edge":    "cross-env BROWSER=edge    mocha",
    "test:firefox": "cross-env BROWSER=firefox mocha",
    "test:all-browsers": "npm run test:chrome && npm run test:edge && npm run test:firefox",
    "verify:reports": "ts-node utils/verifyReports.ts"
  }
}
```

Scope a single feature with mocha's `--spec tests/<feature>.spec.ts`.

## Bug evidence

A failing assertion on this SUT is a candidate defect. Triage each one:

- **Script defect** (bad selector, missing wait, wrong expectation) -> fix the script.
- **SUT defect** (behaviour contradicts the SRS) -> **keep the test failing**. Never loosen an assertion to make the suite green; that destroys the evidence the assignment is grading.

For each confirmed SUT defect:

1. Screenshot to `bug-snapshots/<TC-ID>.png` (stable name, overwritten on rerun).
2. Append to `bug-snapshots/BUGS.md`: TC ID, feature, browser, steps, expected (cite the SRS), actual, severity, screenshot path.
3. Attach mochawesome context so the bug is visible inside the HTML report.
4. File a **GitHub Issue** with the screenshot attached, and cross-link the issue URL in `BUGS.md` and the main report. HW04 requires bugs in both places.
5. Note whether the defect reproduces on all three browsers - a browser-specific failure is a different finding.

Reset `BUGS.md` at the start of each full run so it always reflects the latest execution.

## Human review and AI-gap analysis

This is a graded deliverable, not a formality. After generation, review against `references/review-checklist.md` and record findings in a table:

| # | What the AI produced | Why it is wrong/missing | Fix applied | Root cause |
|---|---|---|---|---|

Root cause must be one of: prompt quality, model limitation, or feature characteristic. Recurring real gaps on this SUT, worth checking first:

- Selectors invented from a generic e-commerce template rather than read from the actual JSX.
- Missing native-`alert()` handling, producing `UnexpectedAlertOpenError`.
- Assertions written against observed buggy behaviour, so a real defect passes silently.
- `sleep()` instead of explicit waits - the classic flaky-wait smell.
- Inline test data despite a data-driven instruction.
- No `StaleElementReferenceError` handling after React re-render.
- Admin navigation via URL paths that do not exist in the tabbed SPA.
- Edge cases skipped entirely: boundary lengths, empty cart at checkout, expired coupon, unauthorized role, XSS payload.

Also document every test case you **could not** automate, with the reason (e.g. real email delivery in the two-step password reset, CAPTCHA, external payment).

## AI audit log

Append every AI interaction, as it happens, to the official faculty template `[AI-02] - FIT@HCMUS - AI Audit Report_En.docx.md` (one row per artifact in its Section 3): tool name, date and time, the **verbatim** prompt, the verbatim output, a VALID/INVALID/INCOMPLETE verdict, ISTQB-cited reasoning, and your fix. Do not create a parallel audit file - fill in the provided template. Doing this at the end from memory produces a log that does not match the commit history. The 200-300 word AI Critique is a separate deliverable (`AI_Critique.md`).

## Workflow

1. Confirm the three features (Pool A / B / C) and locate their HW02 test cases.
2. Read the SUT docs and the actual page source for those features.
3. Scaffold `selenium/` per `references/project-scaffold.md`; create `.env` from `.env.example`.
4. Per feature: build the data file (>= 12 cases) first, then drive the AI **case by case** to write the spec.
5. Review every generated case against `references/review-checklist.md`; fix and log each gap.
6. `npm run typecheck`, then run the feature on chrome, edge, firefox.
7. Triage failures into script-defect vs SUT-defect; capture evidence and file issues for the latter.
8. Repeat for the remaining features until nine reports exist.
9. Run the verification gate, then assemble the report, README summary table, commit log, and audit appendix.

Commit test-script changes incrementally across >= 4 distinct days - the 8-commit minimum only counts spec/test files, so a single end-of-project dump fails the requirement no matter how good the suite is.

## Verification gate

Do not report completion until all of these pass:

1. `npm run typecheck` is clean.
2. Each feature's data file parses and holds **>= 12** cases (assert the count in code).
3. No spec contains inline test-data literals; every case comes from the data loader.
4. Each feature uses **>= 3** distinct assertion patterns and you can name them.
5. `reports/<feature>/{chrome,edge,firefox}.html` all exist **simultaneously** for all three features - **9 files**. One file where three belong is a `reportFilename` bug: fix and rerun.
6. Every report contains the literal `Run by: <StudentID>` and a parseable ISO timestamp.
7. Failing tests are triaged, and every SUT defect has a screenshot, a `BUGS.md` entry, and a GitHub Issue link.
8. The AI-gap table, the non-automatable list, and the audit log are written.
9. `git log` shows >= 8 test-file commits across >= 4 days.

If a browser, driver, the SUT, or `.env` is unavailable, stop and report the exact blocker plus the next command to run. Never write a number into the report that no run produced.

## References

- `references/project-scaffold.md` - concrete contents for config, driver factory, data loader, report metadata, bug reporter.
- `references/review-checklist.md` - the line-by-line human-review pass over AI output.
- `references/eshop-notes.md` - per-feature selector and behaviour notes for the EShop SUT.
