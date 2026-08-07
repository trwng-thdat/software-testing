# EShop SUT - automation notes

Verified against the repository source. Re-check against your local checkout before relying on any specific line.

## Topology

| Component | URL | Notes |
|---|---|---|
| Backend API | `http://localhost:3000` | Routes under `/api`. Bearer token auth. |
| Customer web | `http://localhost:5173` | Vite + React + `react-router-dom`. |
| Admin web | `http://localhost:5174` | Vite + React, **single component, no router**. |

Start order: backend, then the frontends. `run_servers.sh` exists at the repo root.

Default admin: `admin@eshop.com` / `Admin123!` (seeded at `backend/database.js:92`). Default user: `test@eshop.com` / `Test1234!` (line 93). Verify these against your checkout rather than trusting them — a wrong guess costs 2 `login_attempts` and 3 locks the account.

## Global characteristics

- **No `data-testid` anywhere.** Neither frontend defines a single one.
- **No `name` attributes on form inputs.** Inputs are identified by `type`, `placeholder`, or position within a labelled block.
- **Tailwind utility classes only** - class names like `text-2xl font-bold mb-4` are styling, shared across unrelated elements, and unsafe as selectors.
- **UI language is Vietnamese.** Text-based selectors and message assertions must match the exact Vietnamese string in source, diacritics included. Put those strings in the data file, not the spec.
- **Native `alert()` is the primary feedback channel.** Admin uses it ~11 times; Profile 5, ForgotPassword 4, Cart 1, Checkout 1. Unhandled it blocks WebDriver and throws `UnexpectedAlertOpenError`.
- **The SUT is deliberately seeded with defects** in validation, authorization, and security (SQLi / XSS). Assert the SRS, not observed behaviour.

## Customer routes

`/`, `/login`, `/register`, `/forgot-password`, `/profile`, `/product/:id`, `/cart`, `/checkout`

## FR-04 Personal profile management (Pool A)

Page: `frontend-web/src/pages/Profile.jsx`, route `/profile`, auth required.

- Heading `Hồ sơ của bạn`; a second block heading `Lịch sử đơn hàng` renders order history on the same page.
- Fields are `type="text"` with no `name`. The phone field carries `placeholder="VD: 0912345678"`, the address field `placeholder="Nhập địa chỉ của bạn"` - use those. For the remaining text inputs, scope to the form and index deliberately, and comment the coupling.
- Submit is `button[type=submit]` inside the profile form.
- Alert strings to assert on:
  - success - `Cập nhật thành công!`
  - phone validation - `Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số.`
  - failure - `Lỗi cập nhật`
  - order cancel success - `Hủy đơn thành công!`
- The phone rule advertises 9-10 digits; probe the boundaries (8, 9, 10, 11 digits), non-numeric, spaces, and `+84` form. Validation gaps here are a likely genuine finding.
- Strong pattern-2 opportunity: after a UI update, `GET` the profile from the API and assert the field actually persisted.

## FR-08 Checkout (Pool B)

Page: `frontend-web/src/pages/Checkout.jsx`, route `/checkout`. Requires a logged-in user with a non-empty cart - seed the cart via API in `before`, do not click through the whole catalogue in every test.

- Heading `Xác Nhận Đơn Hàng`. Success state swaps in `Thanh toán thành công!`, so assert the state transition rather than a toast.
- Quantity input is `type="number"`; coupon input is `type="text"` with `placeholder="Nhập mã giảm giá..."` next to an apply button.
- Failure alert: `Lỗi khi thanh toán: <server message>` - match on the prefix and assert the suffix separately.
- Pattern-4 material: total must equal sum(line items) minus discount. Percent vs fixed coupons, `min_order_amount`, expiry, and `max_uses_per_user` are all boundary sources.
- Edge cases worth automating: empty cart, quantity `0`, negative quantity, quantity above stock, invalid coupon code, expired coupon, coupon reused past its per-user limit.

## FR-18 Order management, admin (Pool C)

Page: `frontend-admin/src/App.jsx`, served from `ADMIN_URL`.

- **Navigate by clicking the tab, never by URL.** Tabs are `activeTab` state: `dashboard`, `categories`, `products`, `coupons`, `orders`, `users`. They render as clickable elements with `cursor-pointer`; locate by their visible Vietnamese label and wait for the target table to appear.
- Login is a form posting to `/api/login`; a non-admin role triggers `alert("Bạn không phải là admin!")`, a bad credential triggers `alert("Đăng nhập thất bại")`. The token is persisted to `localStorage.adminToken`.
- Status update calls `PUT /api/admin/orders/:id/status`. `statusLabel()` maps internal codes to Vietnamese labels - assert on the label the user sees, and cross-check the code via the API.
- Pattern-4/5 material: enforce the FR-10 order state machine. Attempt an illegal transition (e.g. straight from a terminal state) and assert it is rejected.
- Pattern-5 material: hit an `/api/admin/*` endpoint with a normal user's token and assert 401/403. Access control is a seeded weak spot.
- **Known seeded defect** - the dashboard revenue aggregate multiplies `delivered` order totals by 2 (`App.jsx`: `if (o.status === "delivered") return sum + o.total_amount * 2`). If FR-13 is in scope, this is a real bug worth an issue; if you only automate FR-18, do not let it contaminate your expected totals.
- On a 401/403 the app silently clears the token and drops to the login screen. A test that suddenly "cannot find the orders table" may actually have been logged out - assert you are still authenticated before blaming the selector.

## Recurring failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `UnexpectedAlertOpenError` | Native alert left open | Wrap the action with `actAndReadAlert`; also dismiss in `afterEach`. |
| `StaleElementReferenceError` | React re-rendered after the action | Re-locate the element; never cache a `WebElement` across a state change. |
| Table empty right after tab click | Data still fetching | `driver.wait(until.elementLocated(...))` on a row, not on the table. |
| Passes on Chrome, fails on Firefox | Timing, or a genuine browser-specific defect | Investigate before adding a wait - a real cross-browser bug is a reportable finding. |
| Test passes but nothing changed in the DB | Asserting UI text only | Add the pattern-2 API cross-check. |
