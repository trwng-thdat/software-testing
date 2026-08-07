# Human review checklist for AI-generated Selenium scripts

Run this pass over **every** generated spec before executing it. HW04 grades the review itself: each item you catch becomes a row in the AI-gap table with a root cause of *prompt quality*, *model limitation*, or *feature characteristic*.

## 1. Data-driven compliance

- [ ] No inline arrays, object literals, or hardcoded strings of test data in the spec.
- [ ] Every case comes from `data/<feature>.data.json` (or `.csv`) through the loader.
- [ ] `>= 12` cases in the file, counted in code, not by eye.
- [ ] Positive, negative, **and** edge cases present - AI defaults to happy paths.
- [ ] Each case carries its HW02 `tcId`, and the `it()` title includes it.
- [ ] `expected` values state what the **SRS** requires, not what the SUT currently does.
- [ ] CSV inputs are type-coerced explicitly; no string/number confusion.

## 2. Selectors

- [ ] No invented `data-testid` - this SUT has none. AI hallucinates them constantly.
- [ ] No `name=` selectors on inputs that have no `name` attribute.
- [ ] No Tailwind utility classes (`text-2xl`, `mb-4`) used as identity.
- [ ] No absolute XPath, no `nth-child` chains rooted at `body`.
- [ ] Text-based selectors match the exact Vietnamese string, diacritics included.
- [ ] Every drop below tier 2 of the selector hierarchy is commented with the reason.
- [ ] Admin navigation clicks the tab; no invented `/admin/...` URLs.

## 3. Waits and stability

- [ ] No `sleep()` / `setTimeout` standing in for a wait. Flag every one.
- [ ] Explicit `driver.wait(until....)` before each interaction with async content.
- [ ] Waits target a *row* or the specific element, not just the container.
- [ ] Elements re-located after any state change (React re-render -> stale references).
- [ ] Timeouts come from `DEFAULT_TIMEOUT_MS`, not magic numbers.

## 4. Alerts

- [ ] Every action that triggers a native `alert()` is wrapped in the alert helper.
- [ ] Alert **text** is asserted, not merely accepted and discarded.
- [ ] `afterEach` dismisses any leaked alert so one failure does not cascade.

## 5. Assertions

- [ ] `>= 3` genuinely distinct patterns, and you can name which is which.
- [ ] At least one API cross-check confirming persistence, not just UI text.
- [ ] Negative cases assert **rejection**: error shown, no navigation, no record created. `assert.isTrue(true)`-style filler is a real AI failure mode.
- [ ] No assertion loosened to make a failure disappear.
- [ ] Numeric assertions compare exact values, not `> 0`.
- [ ] Nothing asserted only via `console.log`.

## 6. Configuration and isolation

- [ ] No hardcoded URL, student ID, name, credential, or browser in the spec.
- [ ] Admin specs resolve `ADMIN_URL`, not `WEB_URL`.
- [ ] Tests are order-independent - each seeds its own state and cleans up.
- [ ] No shared mutable state leaking between `it()` blocks.
- [ ] Secrets stay in `.env`; `.env` is gitignored.

## 7. Coverage gaps AI typically leaves

- [ ] Boundary values on every length/range rule (min-1, min, max, max+1).
- [ ] Empty, whitespace-only, and overlong inputs.
- [ ] Unicode / Vietnamese diacritics in text fields.
- [ ] Unauthorized-role access attempts.
- [ ] XSS payload rendered as text rather than executed.
- [ ] SQL-injection string in login and search fields.
- [ ] Expired / exhausted / minimum-order coupon paths.
- [ ] Illegal order-state transitions.
- [ ] Concurrent or double submission.

## 8. Reporting

- [ ] `reportFilename` derived from the browser, never static.
- [ ] `Run by: <StudentID>` and an ISO timestamp are visible in the rendered HTML.
- [ ] Failures attach a screenshot and mochawesome context.
- [ ] Nine report files coexist after the full matrix.

## 9. Triage before "fixing"

For each failure, decide and record:

- **Script defect** -> fix the script.
- **SUT defect** -> keep it failing, screenshot it, log it in `BUGS.md`, file a GitHub Issue.

Turning a red test green by weakening the assertion destroys the evidence HW04 is grading. If you are unsure which it is, reproduce manually in the browser and cite the SRS clause.

## 10. Record the gaps

Fill in, per finding:

| # | What the AI produced | Why it is wrong/missing | Fix applied | Root cause |
|---|---|---|---|---|

Then list every test case you could **not** automate and why (email delivery, CAPTCHA, external payment, manual-only verification).
