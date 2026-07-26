---
name: selenium-automation
description: Generate, refactor, and verify Selenium automation for HW04 using TypeScript, Mocha, Chai, selenium-webdriver, mochawesome HTML reports, JSON data-driven tests, .env-based configuration, and mandatory three-browser execution. Use when the user asks to create Selenium scripts, automate HW04 features, run cross-browser tests, produce HTML reports, or update Selenium automation instructions.
---

# Selenium Automation - HW04

Use this skill to create a reproducible Selenium automation project for HW04. The output must be runnable, data-driven, documented, and auditable.

## Core Requirements

- Use **TypeScript + Mocha + Chai + selenium-webdriver + mochawesome**.
- Store feature test data in `selenium/data/<feature-name>.data.json`; tests must read input and expected values from JSON, not hardcode datasets in specs.
- Store all runtime information in `selenium/.env`; never hardcode student identity, frontend URL, API URL, browser list, or headless mode in test logic.
- Run every selected feature on **three browsers**: `chrome`, `edge`, and `firefox`.
- For 3 selected HW04 features, execute at least **9 browser runs total**: `3 features * 3 browsers`.
- Every browser run must create an HTML report using **mochawesome**.
- Browser reports for the same feature must **not overwrite each other**. Each browser must write a different HTML filename in the same feature report folder.
- Every HTML report must visibly contain `Run by: <StudentID>`, student name, browser, feature, and ISO timestamp in a title, header, footer, or report metadata.
- Do not fabricate execution results. If the SUT, a browser, a driver, or configuration is unavailable, report the blocker clearly.

For Selenium, prefer **Chrome / Edge / Firefox**. If the assignment wording mentions Chromium / Firefox / WebKit, explain that WebKit is a Playwright target; this Selenium skill satisfies the accepted Selenium-compatible set: Chrome / Edge / Firefox.

## Required Sources

Before writing scripts:

1. Read website documentation such as `docs/README.md`, SRS, API specification, existing test case tables, and the HW04 report template.
2. If no website documentation is found, ask the user for the docs before generating automation.
3. If docs contain multiple FRs and the user did not specify which FR to automate, ask which FR(s) to implement.
4. If docs do not provide frontend URL/domain/route information, skip UI Selenium scripts and state why.
5. If docs do not provide API endpoints/contracts, skip API helpers and API-backed assertions and state why.

## Project Structure

Create or update:

```text
selenium/
  .env.example
  .gitignore
  package.json
  tsconfig.json
  .mocharc.json
  README.md
  data/
    <feature-name>.data.json
  reports/
    <feature-name>/
      chrome.html
      edge.html
      firefox.html
      assets/
  bug-snapshots/
    BUGS.md
    <TC-ID>.png
  tests/
    <feature-name>.spec.ts
  utils/
    config.ts
    driver.ts
    reportMetadata.ts
    bugReporter.ts
    api.ts
```

Use one spec file per feature. Use one JSON data file per feature.

## .env Contract

Create `selenium/.env.example` and make `selenium/README.md` instruct the user to copy it to `selenium/.env` and fill in their information.

Required variables:

```env
STUDENT_ID=
STUDENT_NAME=
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3000
BROWSERS=chrome,edge,firefox
HEADLESS=true
REPORT_BASE_DIR=reports
RUN_TIMESTAMP=
```

Optional variables may include feature-specific accounts, passwords, admin credentials, seeded product names, or timeouts. Keep secrets out of git and add `.env` to `selenium/.gitignore`.

`utils/config.ts` must:

- Load `.env` with `dotenv/config`.
- Validate required variables at startup.
- Parse `BROWSERS` into an allowlist of `chrome`, `edge`, `firefox`.
- Expose `RUN_BY = "Run by: " + STUDENT_ID`.
- Expose an ISO timestamp. If `RUN_TIMESTAMP` is empty, generate `new Date().toISOString()`.

## Browser Execution

Implement scripts so the user can run one browser, one feature, and the full matrix.

Recommended `package.json` scripts:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "mocha",
    "test:feature": "mocha",
    "test:chrome": "cross-env BROWSER=chrome REPORT_FILENAME=chrome mocha",
    "test:edge": "cross-env BROWSER=edge REPORT_FILENAME=edge mocha",
    "test:firefox": "cross-env BROWSER=firefox REPORT_FILENAME=firefox mocha",
    "test:all-browsers": "npm run test:chrome && npm run test:edge && npm run test:firefox"
  }
}
```

When generating final instructions, include concrete commands for:

- Installing dependencies.
- Creating `.env` from `.env.example`.
- Running one feature on one browser.
- Running one feature on all three browsers.
- Running all selected features on all three browsers.
- Opening report paths.

## Report Rules

Use **mochawesome**; do not use Allure and do not use Playwright HTML reporter in this Selenium project.

Configure each feature to produce exactly one report folder:

```text
selenium/reports/<feature-name>/
```

Inside that folder, each browser run must produce one HTML file:

- `chrome.html`
- `edge.html`
- `firefox.html`

Use mochawesome reporter options or a small report wrapper script to set:

```text
reportDir=reports/<feature-name>
reportFilename=<browser>
overwrite=true
html=true
json=true
charts=true
```

`reportFilename` must be computed from the current browser, for example `chrome`, `edge`, or `firefox`. Do not keep a static value such as `index`, `report`, `mochawesome`, or `<feature-name>`, because that makes later browser runs overwrite earlier reports.

`overwrite=true` is allowed only because the browser filename is unique. It may replace `chrome.html` when Chrome is rerun, but it must never replace `edge.html` or `firefox.html`.

For example, after running FR-05 on all browsers, the expected shape is:

```text
selenium/reports/product-listing-search/
  chrome.html
  edge.html
  firefox.html
  assets/
```

Add visible metadata through `utils/reportMetadata.ts`. After mochawesome generates each HTML file, inject or verify a visible header/footer containing:

```text
Run by: <StudentID>
Student: <StudentName>
Browser: <browser>
Timestamp: <ISO timestamp>
Feature: <feature-name>
```

The metadata must be readable by opening the HTML report directly in a browser. Do not rely only on console output or JSON metadata.

After each browser run, verify `reports/<feature-name>/<browser>.html` exists and contains all required metadata strings.

After `test:all-browsers`, verify all three files exist at the same time:

```text
reports/<feature-name>/chrome.html
reports/<feature-name>/edge.html
reports/<feature-name>/firefox.html
```

If only one HTML file exists after a three-browser run, treat it as a report-generation bug, fix `reportFilename`/report wrapper logic, and rerun.

## Test Design Mapping

- Each test case ID in the source document becomes one Mocha `it()`.
- Group tests with `describe()` by feature and scenario category.
- Turn preconditions into executable setup, not comments.
- Assert according to the specification, not according to the current buggy behavior.
- Use stable selectors from the app where available. Prefer semantic selectors, labels, roles, stable attributes, then CSS selectors. Avoid brittle selectors unless no alternative exists and document the reason.
- For API-backed checks, use `fetch` from Node 18+ or a small typed helper in `utils/api.ts`.
- Use `driver.wait(until...)`; avoid hard sleeps except for real business timeouts.

## Bug Evidence

When actual behavior differs from expected:

- Keep the test failing; do not swallow assertion errors.
- For UI failures, capture a screenshot to `selenium/bug-snapshots/<TC-ID>.png`. Use a stable filename and overwrite it on rerun.
- Reset `selenium/bug-snapshots/BUGS.md` at the start of each run.
- Add mochawesome context with TC ID, expected value, actual value, browser, feature, and screenshot path.
- For API-only failures, add textual context without a screenshot.

## README Requirements

After writing or updating scripts, create or update `selenium/README.md`. It must instruct the user to:

- Install dependencies.
- Create `selenium/.env` from `.env.example`.
- Fill in `STUDENT_ID`, `STUDENT_NAME`, `FRONTEND_URL`, `API_URL`, `BROWSERS`, and `HEADLESS`.
- Start the SUT backend and frontend.
- Run one feature on `chrome`, `edge`, and `firefox`.
- Run the full HW04 matrix and confirm at least 9 browser runs for 3 features.
- Open each HTML report under `selenium/reports/<feature>/<browser>.html`.
- Check that every report visibly displays `Run by: <StudentID>`.
- Interpret bug screenshots and `bug-snapshots/BUGS.md`.

The README must not tell users to edit test source code for identity or URLs; those values come from `.env`.

## Verification Gate

Before saying the task is done:

1. Run dependency installation if dependencies are missing.
2. Run `npm run typecheck` from `selenium/`.
3. If the SUT is available, run the requested feature on all configured browsers.
4. Confirm each run produced `reports/<feature>/<browser>.html`.
5. Confirm the feature report folder contains separate `chrome.html`, `edge.html`, and `firefox.html` files after the full browser run.
6. Search each report for `Run by: <StudentID>`, student name, browser, feature, and ISO timestamp.
7. Fix compile, runtime, report-path, metadata, and report-overwrite issues, then rerun.
8. If blocked by missing SUT, browser, driver, or `.env`, state the exact blocker and the command the user should run next.

## Completion Checklist

- `selenium/.env.example` exists and `.env` is gitignored.
- `selenium/README.md` explains `.env` creation and cross-browser execution.
- Every selected feature has one spec file and one JSON data file.
- Tests are data-driven and assert expected behavior from docs.
- Browser list comes from `.env` or `BROWSER`, not hardcoded in specs.
- Chrome, Edge, and Firefox runs are supported.
- For 3 HW04 features, the suite can produce at least 9 browser reports.
- Each feature report folder preserves three separate browser files: `chrome.html`, `edge.html`, and `firefox.html`.
- Every report path is deterministic and contains visible `Run by: <StudentID>`.
- Verification results or blockers are reported honestly.
