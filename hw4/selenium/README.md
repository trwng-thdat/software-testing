# HW04 — EShop Selenium automation suite

Selenium 4 + TypeScript + Mocha + Chai + mochawesome, data-driven, cross-browser.

Currently implemented: **Feature A · Pool A · FR-04 — Personal profile management**.

## Prerequisites

1. Chrome, Edge and Firefox installed locally (Selenium Manager resolves the drivers).
2. Node.js 18+ (the API helper uses the global `fetch`).
3. The EShop SUT running:

   ```bash
   cd <eshop-sut>/backend      && node server.js     # http://localhost:3000
   cd <eshop-sut>/frontend-web && npm run dev        # http://localhost:5173
   cd <eshop-sut>/frontend-admin && npm run dev      # http://localhost:5174 (needed for FR-18)
   ```

## Setup

```bash
npm install
cp .env.example .env    # then fill in STUDENT_ID and STUDENT_NAME
npm run typecheck
```

`STUDENT_ID` is what gets stamped into every HTML report as `Run by: <id>`, so it must
be set to your real MSSV before you generate submission evidence.

## Running

```bash
npm run test:fr04              # all three browsers + report stamping (recommended)
npm run test:fr04:chrome       # a single browser
npm run verify:reports         # HW04 verification gate
```

`utils/runMatrix.ts` loops the browsers, writes `reports/fr04-profile/<browser>.html`
(filename derived per browser, so runs never overwrite each other), and injects the
visible `Run by:` / ISO-timestamp banner into each report.

Set `HEADLESS=false` in `.env` to watch the browser — useful for the demo video.

## Layout

| Path | Role |
|---|---|
| `data/fr04-profile.data.json` | 15 test cases (5 positive / 7 negative / 3 edge) |
| `tests/fr04-profile.spec.ts` | Spec — iterates the data file, one `it()` per TC ID |
| `utils/config.ts` | `.env` loading, validation, `RUN_BY`, ISO timestamp |
| `utils/driver.ts` | Chrome/Edge/Firefox factory |
| `utils/dataLoader.ts` | JSON → typed cases, enforces the ≥12 minimum |
| `utils/profilePage.ts` | Page object for `/profile` — all selector decisions live here |
| `utils/alerts.ts` | Native `alert()` capture (the SUT's main feedback channel) |
| `utils/api.ts` | Seeding, teardown, and API cross-check assertions |
| `utils/reportMetadata.ts` | Injects the visible anti-cheat banner |
| `utils/bugReporter.ts` | Screenshots + `BUGS.md` |
| `utils/runMatrix.ts` | Cross-browser runner |
| `utils/verifyReports.ts` | Verification gate |

## Assertion patterns used (FR-04)

| # | Pattern | Example |
|---|---|---|
| 1 | UI state / text | TC-PROFILE-03 — values still present after reload |
| 2 | Persistence / API cross-check | TC-PROFILE-02 — `GET /api/users/me` proves only the name changed |
| 3 | Negative / rejection | TC-PROFILE-06 — invalid phone alerts *and* nothing is written |
| 5 | Security behaviour | TC-PROFILE-12 role escalation · TC-PROFILE-15 HTML payload |

## Test design notes

- **Session seeding.** The fixture user is created and logged in over the API, and the
  JWT is injected into `localStorage.token`. Driving the login form 15 times is unsafe
  here: `/api/login` increments `login_attempts` by 2 per failure and locks at 3.
- **Baseline phone is `912345678`.** Not SRS-valid — deliberately. It is a value the
  *current build* accepts, so cases about name/address/Unicode/XSS can reach submit
  instead of being blocked by the seeded phone defect. The SRS phone rule is asserted,
  unweakened, by TC-PROFILE-04…09.
- **Expected values follow the SRS, never the current behaviour.** Four tests fail on
  purpose; see below.

## Known failures — real SUT defects, not script bugs

All four reproduce identically on Chrome, Edge and Firefox.

| TC | Defect | Source |
|---|---|---|
| TC-PROFILE-04 | SRS-valid phone `0123456789` (10 digits, leading `0`) is rejected | `Profile.jsx:43` |
| TC-PROFILE-05 | SRS-valid phone `01234567890` (11 digits) is rejected | `Profile.jsx:43` |
| TC-PROFILE-08 | Phone not starting with `0` is **accepted**, contradicting the SRS | `Profile.jsx:43` |
| TC-PROFILE-12 | **Privilege escalation** — `PUT /api/users/me` honours `role` from the body | `server.js:119-125` |

The client regex is `/^[1-9][0-9]{8,9}$/` (leading 1–9, 9–10 digits); the SRS requires a
leading `0` and 10–11 digits. The two rules are mutually exclusive on the first digit.

These assertions are intentionally left failing — loosening them would destroy the
evidence. TC-PROFILE-12 restores `role` to `user` in a `finally` block so the escalation
cannot leak into later tests.
