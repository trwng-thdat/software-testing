# Selenium Automation — HW04

Three features automated: FR-05 (Product Listing & Search), FR-07 (Shopping Cart), FR-14 (Category Management).

## Prerequisites

- Node.js >= 20
- Chrome, Edge, Firefox browsers installed
- SUT (System Under Test) running:
  - Backend: `http://localhost:3000`
  - Frontend Web: `http://localhost:5173`
  - Admin Web: `http://localhost:5174`

## Setup

```bash
# 1. Install dependencies
cd selenium
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env with your student information and URLs

# 3. Verify TypeScript compilation
npm run typecheck
```

## Environment Variables (`.env`)

| Variable         | Description                  | Example                  |
| ---------------- | ---------------------------- | ------------------------ |
| `STUDENT_ID`     | Your student ID              | `23127344`               |
| `STUDENT_NAME`   | Your full name               | `Trương Thành Đạt`       |
| `FRONTEND_URL`   | Frontend URL                 | `http://localhost:5173`  |
| `ADMIN_URL`      | Admin frontend URL           | `http://localhost:5174`  |
| `API_URL`        | Backend API URL              | `http://localhost:3000`  |
| `BROWSERS`       | Comma-separated browser list | `chrome,edge,firefox`    |
| `HEADLESS`       | Run browsers headless        | `true`                   |

## Running Tests

### FR-05: Product Listing & Search

```bash
npm run test:chrome          # Chrome only
npm run test:edge            # Edge only
npm run test:firefox         # Firefox only
npm run test:all-browsers    # All 3 browsers
```

### FR-07: Shopping Cart

```bash
npm run test:cart:chrome
npm run test:cart:edge
npm run test:cart:firefox
npm run test:cart:all-browsers
```

### FR-14: Category Management (Admin)

```bash
npm run test:category:chrome
npm run test:category:edge
npm run test:category:firefox
npm run test:category:all-browsers
```

### All features on all browsers

```bash
npm run test:all-features
```

## Reports

After each browser run, an HTML report is generated at:

```
reports/product-listing-search/   ← FR-05
  chrome.html
  edge.html
  firefox.html
  assets/
reports/shopping-cart/            ← FR-07
  chrome.html
  edge.html
  firefox.html
  assets/
reports/category-management/      ← FR-14
  chrome.html
  edge.html
  firefox.html
  assets/
```

Open any `.html` file in a browser to view results. Each report contains:

- Run by: `<StudentID>`
- Student: `<StudentName>`
- Browser: `<browser>`
- Timestamp: `<ISO timestamp>`
- Feature: `<FR-ID> <Feature Name>`

## Bug Snapshots

When a test fails, a screenshot is saved to:

```
bug-snapshots/<TC-ID>.png
bug-snapshots/BUGS.md
```

Review `BUGS.md` for a summary of all detected bugs.

## Test Cases

### FR-05: Product Listing & Search (12 tests)

| ID                    | Scenario                                | Type       |
| --------------------- | --------------------------------------- | ---------- |
| TC-PRODUCT_SEARCH-001 | Display product grid on home page       | Positive   |
| TC-PRODUCT_SEARCH-002 | Product card shows image, name, price   | Positive   |
| TC-PRODUCT_SEARCH-003 | Price format with VND symbol            | Positive   |
| TC-PRODUCT_SEARCH-004 | Page has exactly one h1                 | Positive   |
| TC-PRODUCT_SEARCH-005 | Loading state while fetching            | Positive   |
| TC-PRODUCT_SEARCH-006 | Search by matching keyword              | Positive   |
| TC-PRODUCT_SEARCH-007 | Case-insensitive search                 | Positive   |
| TC-PRODUCT_SEARCH-008 | Trim keyword whitespace                 | Boundary   |
| TC-PRODUCT_SEARCH-009 | Empty state for no results              | Negative   |
| TC-PRODUCT_SEARCH-010 | Empty search restores all products      | Positive   |
| TC-PRODUCT_SEARCH-011 | Safe rendering of HTML in keyword       | Negative   |
| TC-PRODUCT_SEARCH-012 | API search returns matching products    | API-backed |

### FR-07: Shopping Cart (12 tests)

| ID           | Scenario                                        | Type            |
| ------------ | ----------------------------------------------- | --------------- |
| TC-CART-001  | Empty cart state display                        | Positive        |
| TC-CART-002  | Add one product to cart                         | Positive        |
| TC-CART-003  | Merge duplicate products on re-add              | Positive        |
| TC-CART-004  | Two distinct products show two rows             | Positive        |
| TC-CART-005  | Increment quantity with + button                | Positive        |
| TC-CART-006  | Decrement quantity with - button                | Positive        |
| TC-CART-007  | Enforce minimum quantity 1                      | Boundary        |
| TC-CART-008  | Cancel delete keeps item                        | Negative        |
| TC-CART-009  | Confirm delete removes item                     | Positive        |
| TC-CART-010  | Total label shows "Tổng cộng"                   | Positive        |
| TC-CART-011  | Continue shopping navigates home                | Navigation      |
| TC-CART-012  | API cart requires auth token                    | API-backed      |

### FR-14: Category Management (Admin CRUD, 12 tests)

| ID                   | Scenario                                      | Type            |
| -------------------- | --------------------------------------------- | --------------- |
| TC-ADMIN_CATEGORY-001 | View existing category list                  | Positive        |
| TC-ADMIN_CATEGORY-002 | Create category with valid name              | Positive        |
| TC-ADMIN_CATEGORY-003 | Reject empty category name                   | Negative        |
| TC-ADMIN_CATEGORY-004 | Reject whitespace-only name                  | Boundary        |
| TC-ADMIN_CATEGORY-005 | Vietnamese category name                     | Positive        |
| TC-ADMIN_CATEGORY-006 | Safe rendering of HTML injection             | Negative        |
| TC-ADMIN_CATEGORY-007 | Update category name via API                 | Positive        |
| TC-ADMIN_CATEGORY-008 | Reject empty name on update via API          | Negative        |
| TC-ADMIN_CATEGORY-009 | Delete category                              | Positive        |
| TC-ADMIN_CATEGORY-010 | Cancel delete keeps item                     | Negative        |
| TC-ADMIN_CATEGORY-011 | Write APIs require token                     | API-backed      |
| TC-ADMIN_CATEGORY-012 | Full CRUD end-to-end via API                 | API-backed      |

## Expected Bugs in SUT

### FR-05 Bugs
1. **TC-002**: Image `alt` attributes are empty strings (`alt=""`)
2. **TC-004**: Page has two `<h1>` elements (title + product count)
3. **TC-005**: No loading state indicator implemented
4. **TC-008**: Search does not trim whitespace from keyword
5. **TC-011**: Search keyword rendered via `dangerouslySetInnerHTML` (XSS vulnerability)

### FR-07 Bugs (from code analysis)
1. **TC-003**: Cart does not merge duplicate products (each add creates a new row)
2. **TC-005/006**: No +/- quantity buttons implemented
3. **TC-008/009**: No delete confirmation dialog (removes immediately)

### FR-14 Bugs (from code analysis)
1. **TC-003/004**: Admin category form lacks frontend validation for empty/whitespace names
2. **TC-006**: Category name with HTML/script may be rendered unsafely
3. **TC-010**: No delete confirmation dialog for categories (removes immediately)
4. **TC-008**: Category update API may accept empty names
