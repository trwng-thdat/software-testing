# HW04 - Kiểm thử Tự động trên EShop - Báo cáo Chính

## 0. Thông tin Sinh viên

| Trường                 | Giá trị                     |
| ---------------------- | --------------------------- |
| Họ và tên              | Trương Thành Đạt            |
| MSSV                   | 23127344                    |
| Lớp / Nhóm             | Kiểm thử phần mềm - 23KTPM3 |
| Bài tập                | HW04 - Automation Testing   |
| Ngày nộp               | 25/07/2026                  |
| Điểm tự đánh giá       | 100                         |
| Link repository GitHub | TODO                        |
| Link GitHub Issues     | TODO                        |
| Link video demo        | TODO                        |

---

## 1. Các Tính năng đã Chọn

| Tính năng   | Pool | FR ID | Tên tính năng                | Mã module        |
| ----------- | ---- | ----- | ---------------------------- | ---------------- |
| Tính năng A | A    | FR-05 | Liệt kê và tìm kiếm sản phẩm | `PRODUCT_SEARCH` |
| Tính năng B | B    | FR-07 | Giỏ hàng                     | `CART`           |
| Tính năng C | C    | FR-14 | Quản lý danh mục (CRUD)      | `ADMIN_CATEGORY` |

> Quy ước ID test case: `TC-<MODULE>-<NNN>`.
> Quy ước đặt tên script tự động: `product-listing-search.spec.ts`, `shopping-cart.spec.ts`, `category-management.spec.ts`.

---

## 2. Môi trường Tự động hóa

| Mục                      | Giá trị                                 |
| ------------------------ | --------------------------------------- |
| Repository SUT           | https://github.com/ttbhanh/eshop-sut    |
| Framework tự động        | Selenium                                |
| Ngôn ngữ                 | TypeScript                              |
| Phiên bản test runner    | Mocha 10 + Chai 4                       |
| Bộ trình duyệt           | Firefox, Chrome, Edge                   |
| Công cụ báo cáo          | Mochawesome HTML reporter               |
| Hệ điều hành             | Windows 11                              |
| Phiên bản Node / runtime | > 20                                    |
| Chuỗi nhận dạng báo cáo  | `Run by: <MSSV>`                        |

### 2.1 Cấu trúc Dự án

```text
📁 selenium/
 ├── 📁 tests/
 │    ├── 🧪 product-listing-search.spec.ts
 │    ├── 🧪 shopping-cart.spec.ts (dự kiến)
 │    └── 🧪 category-management.spec.ts (dự kiến)
 ├── 📁 data/
 │    ├── 📄 product-listing-search.data.json
 │    ├── 📄 shopping-cart.data.json (dự kiến)
 │    └── 📄 category-management.data.json (dự kiến)
 ├── 📁 utils/
 │    ├── config.ts, driver.ts, api.ts
 │    ├── bugReporter.ts, setup.js, reportMetadata.js
 ├── 📁 reports/
 │    └── 📁 product-listing-search/
 │         ├── chrome.html, edge.html, firefox.html
 │         └── 📁 assets/
 ├── 📁 bug-snapshots/
 ├── 📄 package.json
 ├── 📄 tsconfig.json
 ├── 📄 .mocharc.json
 ├── 📄 .env.example
 └── 📄 README.md
```

### 2.2 Chiến lược Dữ liệu Kiểm thử Chung

- Định dạng file dữ liệu: `.json`.
- Vị trí dữ liệu: `selenium/data/<feature-name>.data.json`.
- Quy tắc tuân thủ: dữ liệu kiểm thử được lưu trữ bên ngoài script; không hardcode mảng/đối tượng trong mã nguồn.
- Tài khoản dùng chung:

| Vai trò tài khoản | Email / Tên người dùng | Mục đích         | Ghi chú |
| ----------------- | ---------------------- | ---------------- | ------- |
| Khách hàng        | test@eshop.com         | Tính năng A và B | Tài khoản seed mặc định |
| Quản trị viên     | admin@eshop.com        | Tính năng C      | Tài khoản seed mặc định |

### 2.3 Các Mẫu Kiểm chứng (Assertion) Đã Sử dụng

| Mẫu kiểm chứng                          | Ví dụ sử dụng trong bài tập | Tính năng sử dụng |
| --------------------------------------- | --------------------------- | ----------------- |
| Kiểm chứng hiển thị / sự tồn tại của UI | `expect(cards.length).to.be.at.least(1)` | FR-05 |
| Kiểm chứng văn bản / nội dung           | `expect(priceText).to.include("VND")` | FR-05 |
| Kiểm chứng URL / điều hướng             | (chưa dùng trong FR-05) | - |
| Kiểm chứng trạng thái / giá trị         | `expect(h1s.length).to.equal(1)` | FR-05 |
| Kiểm chứng dựa trên API / cơ sở dữ liệu | `fetchProducts(apiUrl, keyword)` trả array | FR-05 |

---

## 3. Tính năng A - FR-05: Liệt kê và Tìm kiếm Sản phẩm

## A.0 Phạm vi Tính năng và Tham chiếu

- Mục đích tính năng: Kiểm tra trang danh sách sản phẩm và chức năng tìm kiếm sản phẩm theo tên.
- Các trang / route liên quan: Trang chủ / trang danh sách sản phẩm; API `GET /api/products`, `GET /api/products?search=keyword`.
- Vai trò người dùng chính: Khách / người dùng chưa đăng nhập.
- Các nguồn tham chiếu được sử dụng để xây dựng test:
  - `software-testing/hw4/docs/README.md` - FR-05: Xem danh sách & Tìm kiếm sản phẩm.
  - `software-testing/hw4/docs/api_specification.md` - 3.1 `GET /api/products`, query `?search=keyword`.
- Script tự động: `selenium/tests/product-listing-search.spec.ts` (sẽ tạo khi viết automation).
- File dữ liệu: `selenium/data/product-listing-search.data.json` (sẽ tạo khi viết automation).

## A.1 Quy trình Tạo Script bằng AI

| Bước | Tóm tắt Prompt / tương tác | Output AI đã sử dụng | Kết quả rà soát |
| ---- | -------------------------- | -------------------- | --------------- |
| A-1  | Yêu cầu AI tạo Selenium script cho FR-05 dựa trên skill và docs đã đọc | `product-listing-search.spec.ts`, `product-listing-search.data.json` | CSS selector `.border\\.rounded\\.shadow-sm` sai; đã sửa thành `.border.rounded.shadow-sm` |
| A-2  | Yêu cầu fill báo cáo template với kết quả thực thi | `HW04_Main_Report_Template.md` | Cần điều chỉnh expectedCurrency từ `₫` sang `VND` theo yêu cầu sinh viên |
| A-3  | Kiểm tra typecheck và cấu trúc dự án | `tsconfig.json`, `package.json`, utils | Typecheck pass, cấu trúc đúng theo skill |

## A.2 Ánh xạ Test Case Tự động

> Yêu cầu tối thiểu: ít nhất 12 test case cho tính năng này.

| ID TC                 | Kịch bản                                                       | Loại                     | Dataset key                       | Tự động? | Tên test                                          | Kiểm chứng chính                                                           | Kết quả mong đợi                                                                                            | Kết quả thực tế | Trạng thái |
| --------------------- | -------------------------------------------------------------- | ------------------------ | --------------------------------- | -------- | ------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| TC-PRODUCT_SEARCH-001 | Mở trang danh sách sản phẩm và hiển thị grid sản phẩm          | Tích cực                 | product_list_default              | Có       | FR-05 displays product grid on home page          | Kiểm tra danh sách/grid hiển thị; số sản phẩm > 0                          | Trang hiển thị danh sách tất cả sản phẩm dạng lưới; không hiển thị empty state khi có dữ liệu               | 5 product cards | Đạt  |
| TC-PRODUCT_SEARCH-002 | Mỗi sản phẩm hiển thị đủ ảnh, tên và giá                       | Tích cực                 | product_card_required_fields      | Có       | FR-05 product card shows image name and price     | Kiểm tra ảnh, alt text, tên, giá trên từng card                            | Mỗi sản phẩm có ảnh với alt text mô tả, tên sản phẩm và giá                                                 | alt text rỗng (`alt=""`) | Không đạt |
| TC-PRODUCT_SEARCH-003 | Giá sản phẩm hiển thị đơn vị VND và phân cách hàng nghìn       | Tích cực                 | product_price_format_vnd          | Có       | FR-05 product price uses VND format               | Kiểm tra text giá theo định dạng VND và phân cách hàng nghìn               | Giá có đơn vị VND và định dạng phân cách hàng nghìn                                                        | Có VND + phân cách | Đạt  |
| TC-PRODUCT_SEARCH-004 | Trang danh sách sản phẩm chỉ có đúng một thẻ `h1`              | Tích cực / UI semantics  | page_single_h1                    | Có       | FR-05 page has exactly one h1                     | Đếm số lượng `h1` trên trang                                               | Trang chỉ có đúng 1 thẻ `h1`                                                                                | 2 thẻ h1        | Không đạt |
| TC-PRODUCT_SEARCH-005 | Hiển thị trạng thái loading khi đang tải dữ liệu sản phẩm      | Tích cực / trạng thái UI | product_loading_state             | Có       | FR-05 shows loading state while fetching products | Kiểm tra loading indicator                                                 | Trong lúc chờ `GET /api/products`, UI hiển thị trạng thái loading phù hợp                                   | Không có loading indicator | Không đạt |
| TC-PRODUCT_SEARCH-006 | Tìm kiếm bằng từ khóa khớp tên sản phẩm                        | Tích cực                 | search_valid_keyword              | Có       | FR-05 searches products by matching keyword       | Nhập keyword; kiểm tra kết quả chứa keyword                                | Hệ thống gọi/lọc theo `search=keyword`; danh sách chỉ hiển thị sản phẩm phù hợp theo tên                    | 1 kết quả (iPhone 15 Pro Max) | Đạt  |
| TC-PRODUCT_SEARCH-007 | Tìm kiếm không phân biệt chữ hoa/chữ thường                    | Tích cực / biên dữ liệu  | search_case_insensitive           | Có       | FR-05 search is case insensitive                  | So sánh kết quả với keyword chữ hoa và chữ thường                          | Hai keyword khác nhau về hoa/thường trả về cùng nhóm sản phẩm phù hợp                                       | `airpods`=1, `AIRPODS`=1 | Đạt  |
| TC-PRODUCT_SEARCH-008 | Tìm kiếm với từ khóa có khoảng trắng đầu/cuối                  | Biên                     | search_trimmed_keyword            | Có       | FR-05 trims search keyword whitespace             | Nhập keyword có leading/trailing spaces; kiểm tra kết quả                  | Hệ thống xử lý từ khóa sau khi trim hoặc trả về kết quả tương đương keyword hợp lệ                          | `"  MacBook  "`=0, `MacBook`=1 | Không đạt |
| TC-PRODUCT_SEARCH-009 | Tìm kiếm bằng chuỗi không khớp sản phẩm nào                    | Tiêu cực                 | search_no_result                  | Có       | FR-05 shows empty state for no result             | Nhập keyword không tồn tại; kiểm tra empty state                           | Không hiển thị product card; UI hiển thị thông báo empty state phù hợp                                      | 0 product card (không có empty state message) | Đạt (1 phần) |
| TC-PRODUCT_SEARCH-010 | Tìm kiếm bằng chuỗi rỗng sau khi xóa keyword                   | Tích cực / biên          | search_empty_keyword              | Có       | FR-05 empty search restores all products          | Nhập keyword rồi xóa; kiểm tra danh sách mặc định                          | Khi ô tìm kiếm rỗng, trang hiển thị lại danh sách tất cả sản phẩm                                           | 5 product cards restored | Đạt  |
| TC-PRODUCT_SEARCH-011 | Từ khóa tìm kiếm chứa HTML/script không được render thành HTML | Tiêu cực / bảo mật       | search_html_injection_safe_render | Có       | FR-05 safely renders html search keyword          | Nhập `<img src=x onerror=alert(1)>`; kiểm tra DOM và không có alert/script | Từ khóa được hiển thị/ xử lý an toàn dạng text; không render HTML, không thực thi script                    | XSS alert bị kích hoạt (`dangerouslySetInnerHTML`) | Không đạt |
| TC-PRODUCT_SEARCH-012 | API tìm kiếm sản phẩm theo tên trả về dữ liệu phù hợp          | Tích cực / API-backed    | api_search_keyword                | Có       | FR-05 API search returns matching products        | Gọi `GET /api/products?search=keyword`; kiểm tra status và tên sản phẩm    | API trả `200`; danh sách trả về chỉ gồm sản phẩm có tên phù hợp keyword hoặc mảng rỗng nếu không có kết quả | API 200, 1 kết quả Samsung | Đạt  |

## A.3 Dữ liệu Kiểm thử Hướng Dữ liệu (Data-Driven)

| Data key                          | Giá trị nhập                                                | Dữ liệu mong đợi                                                     | Ghi chú                                             |
| --------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| product_list_default              | Mở trang danh sách sản phẩm với search rỗng                 | Có ít nhất 1 product card; grid hiển thị                             | Dùng làm happy path mặc định                        |
| product_card_required_fields      | Dữ liệu sản phẩm bất kỳ trong danh sách                     | Card có `img`, alt text, tên, giá                                    | Có thể kiểm tra trên tất cả card hoặc card đầu tiên |
| product_price_format_vnd          | Dữ liệu giá sản phẩm trong danh sách                        | Giá hiển thị đơn vị VND và phân cách hàng nghìn                        | Kiểm tra theo format hiển thị thực tế               |
| page_single_h1                    | Trang danh sách sản phẩm                                    | Số lượng `h1` bằng 1                                                 | Yêu cầu accessibility/semantic từ README            |
| product_loading_state             | Kiểm tra sự tồn tại của loading indicator                   | Loading indicator xuất hiện trước khi data render                    | SUT chưa implement loading state                     |
| search_valid_keyword              | `keyword`: `iPhone`                                         | Kết quả tìm kiếm chứa sản phẩm phù hợp keyword                       | Seed data có "iPhone 15 Pro Max"                    |
| search_case_insensitive           | `keywordLower`: `airpods`; `keywordUpper`: `AIRPODS`        | Hai lần tìm trả nhóm kết quả tương đương                             | Dựa trên seed "AirPods Pro 2"                       |
| search_trimmed_keyword            | `keyword`: `"  MacBook  "`                                  | Kết quả tương đương keyword đã trim                                  | Seed data có "MacBook Pro M3"                       |
| search_no_result                  | `keyword`: `zzzz-no-product-23127344`                       | Empty state hiển thị; không có product card                          | Keyword cố ý không tồn tại                          |
| search_empty_keyword              | Nhập keyword hợp lệ rồi clear input                         | Danh sách mặc định được khôi phục                                    | Kiểm tra sau thao tác clear                         |
| search_html_injection_safe_render | `keyword`: `<img src=x onerror=alert(1)>`                   | Không render HTML; không alert/script; text được xử lý an toàn       | Test bảo mật render keyword                         |
| api_search_keyword                | `keyword`: `Samsung`                                         | `GET /api/products?search=keyword` trả status 200 và dữ liệu phù hợp | API-backed assertion cho FR-05                      |

## A.4 Minh chứng Thực thi Đa trình duyệt

| Trình duyệt       | Lệnh | Đường dẫn báo cáo HTML | Có dấu thời gian? | Có `Run by: <MSSV>`? | Đạt  | Không đạt | Ghi chú |
| ----------------- | ---- | ---------------------- | ----------------- | -------------------- | ---- | --------- | ------- |
| Chrome            | `npm run test:chrome` | `reports/product-listing-search/chrome.html` | Có | Có | 7 | 5 | Chạy headless |
| Firefox           | `npm run test:firefox` | `reports/product-listing-search/firefox.html` | Có | Có | 7 | 5 | Chạy headless |
| Edge              | `npm run test:edge` | `reports/product-listing-search/edge.html` | Có | Có | 7 | 5 | Chạy headless |

## A.5 Rà soát và Chỉnh sửa của Người dùng

| Vấn đề trong script AI                                                          | Tại sao sai / chưa hoàn thiện | Sửa chữa bởi sinh viên | Minh chứng / commit |
| ------------------------------------------------------------------------------- | ----------------------------- | ---------------------- | ------------------- |
| CSS selector `.border\\.rounded\\.shadow-sm` sai cú pháp                        | Dấu `\\` trong JS string tạo CSS selector `.border\.rounded\.shadow-sm`, CSS hiểu dấu `\.` là ký tự dot literal, không phải class selector | Đổi thành `.border.rounded.shadow-sm` (bỏ escape) | commit xxx |
| expectedCurrency trong data file là `₫` nhưng app dùng `VND`                    | AI dùng theo spec (₫) nhưng app implement VND | Đổi thành `VND` để test match UI thực tế | Sửa data file |
| TC-009 không kiểm tra empty state message                                        | Script chỉ kiểm tra 0 product card, không kiểm tra message "empty state" | (ghi nhận: cần bổ sung assert empty state khi SUT implement) | TODO |

## A.6 Các Bug được Tìm thấy

| ID Bug   | TC liên quan | Tóm tắt | Mong đợi | Thực tế | Mức độ | Link issue GitHub | Ảnh chụp |
| -------- | ------------ | ------- | -------- | ------- | ------ | ----------------- | -------- |
| BUG-A-01 | TC-PRODUCT_SEARCH-002 | Product image thiếu `alt` text | Mỗi ảnh sản phẩm có `alt` mô tả, không rỗng | Firefox: Product image alt text rỗng (`""`) | Trung bình | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-002.png` |
| BUG-A-02 | TC-PRODUCT_SEARCH-004 | Trang danh sách sản phẩm có nhiều hơn một thẻ `h1` | Trang chỉ có đúng 1 thẻ `h1` | Firefox: tìm thấy 2 thẻ `h1` | Thấp | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-004.png` |
| BUG-A-03 | TC-PRODUCT_SEARCH-005 | Không hiển thị loading state khi đang tải sản phẩm | UI hiển thị loading indicator trong lúc fetch products | Firefox: không tìm thấy loading indicator | Trung bình | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-005.png` |
| BUG-A-04 | TC-PRODUCT_SEARCH-008 | Search không trim khoảng trắng đầu/cuối keyword | Keyword có khoảng trắng đầu/cuối cho kết quả tương đương keyword đã trim | Firefox: `"  MacBook  "` trả 0 kết quả, `"MacBook"` trả 1 kết quả | Trung bình | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-008.png` |
| BUG-A-05 | TC-PRODUCT_SEARCH-011 | Từ khóa HTML/script được render qua `dangerouslySetInnerHTML` | Keyword không được render/thực thi, xử lý an toàn dạng text | `<img src=x onerror=alert(1)>` được render thành thẻ `<img>` và kích hoạt alert JavaScript | Cao | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-011.png` |

## A.7 Test Case Không Tự động hóa

| ID TC | Lý do không tự động hóa | Minh chứng thủ công / giải pháp thay thế |
| ----- | ----------------------- | ---------------------------------------- |
| TODO  | TODO                    | TODO                                     |

---

## 4. Tính năng B - FR-07: Giỏ hàng

## B.0 Phạm vi Tính năng và Tham chiếu

- Mục đích tính năng: Kiểm tra giỏ hàng, bao gồm thêm sản phẩm, gom số lượng sản phẩm trùng, chỉnh số lượng, xóa sản phẩm, empty state, điều hướng mua tiếp và tổng tiền.
- Các trang / route liên quan: Trang chủ / danh sách sản phẩm, trang chi tiết sản phẩm, `/cart`; API `GET /api/cart`, `POST /api/cart`.
- Vai trò người dùng chính: Khách / người dùng chưa đăng nhập; người dùng đã đăng nhập khi cần kiểm tra API có token.
- Các nguồn tham chiếu được sử dụng để xây dựng test:
  - `software-testing/hw4/docs/eshop-sut/README.md` - FR-07: Giỏ hàng; FR-23 Navigation; FR-24 Feedback & State.
  - `software-testing/hw4/docs/eshop-sut/api_specification.md` - 4.1 `GET /api/cart`, 4.2 `POST /api/cart`.
  - `software-testing/hw4/docs/eshop-sut/frontend-web/src/pages/Cart.jsx` và `context/CartContext.jsx` để tham khảo UI/state hiện tại.
- Script tự động: `selenium/tests/shopping-cart.spec.ts` (sẽ tạo khi viết automation).
- File dữ liệu: `selenium/data/shopping-cart.data.json` (sẽ tạo khi viết automation).

## B.1 Quy trình Tạo Script bằng AI

| Bước | Tóm tắt Prompt / tương tác | Output AI đã sử dụng | Kết quả rà soát |
| ---- | -------------------------- | -------------------- | --------------- |
| B-1  | TODO                       | TODO                 | TODO            |
| B-2  | TODO                       | TODO                 | TODO            |
| B-3  | TODO                       | TODO                 | TODO            |

## B.2 Ánh xạ Test Case Tự động

> Yêu cầu tối thiểu: ít nhất 12 test case cho tính năng này.

| ID TC       | Kịch bản                                                               | Loại                    | Dataset key                     | Tự động? | Tên test                                             | Kiểm chứng chính                                                        | Kết quả mong đợi                                                                                          | Kết quả thực tế | Trạng thái |
| ----------- | ---------------------------------------------------------------------- | ----------------------- | ------------------------------- | -------- | ---------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| TC-CART-001 | Mở giỏ hàng khi chưa có sản phẩm                                       | Tích cực / empty state  | cart_empty_state                | Có       | FR-07 displays empty cart state                      | Kiểm tra nội dung empty state và link tiếp tục mua sắm                  | Giỏ hàng trống hiển thị hình/icon minh họa hoặc thông báo rõ ràng; có link/nút quay về trang chủ          | Chưa chạy       | Chưa chạy  |
| TC-CART-002 | Thêm một sản phẩm vào giỏ từ danh sách sản phẩm                        | Tích cực                | cart_add_single_product         | Có       | FR-07 adds one product to cart                       | Bấm thêm vào giỏ; mở `/cart`; kiểm tra dòng sản phẩm                    | Giỏ hàng có đúng 1 dòng sản phẩm với tên, đơn giá, số lượng, thành tiền và thao tác xóa                   | Chưa chạy       | Chưa chạy  |
| TC-CART-003 | Thêm cùng một sản phẩm hai lần                                         | Tích cực / nghiệp vụ    | cart_add_same_product_twice     | Có       | FR-07 merges duplicate product quantity              | Thêm cùng product 2 lần; đếm số dòng và quantity                        | Không tạo dòng mới; sản phẩm chỉ xuất hiện 1 dòng và số lượng tăng tương ứng                              | Chưa chạy       | Chưa chạy  |
| TC-CART-004 | Thêm hai sản phẩm khác nhau vào giỏ                                    | Tích cực                | cart_add_two_distinct_products  | Có       | FR-07 displays distinct cart rows                    | Thêm 2 product khác nhau; kiểm tra số dòng                              | Giỏ hàng hiển thị 2 dòng riêng biệt; mỗi dòng có đúng tên, đơn giá, số lượng và thành tiền                | Chưa chạy       | Chưa chạy  |
| TC-CART-005 | Tăng số lượng sản phẩm bằng nút `+`                                    | Tích cực                | cart_increment_quantity         | Có       | FR-07 increments item quantity                       | Bấm `+`; kiểm tra quantity và thành tiền                                | Số lượng tăng thêm 1; thành tiền dòng và tổng cộng được tính lại đúng                                     | Chưa chạy       | Chưa chạy  |
| TC-CART-006 | Giảm số lượng sản phẩm bằng nút `-` khi số lượng > 1                   | Tích cực                | cart_decrement_quantity         | Có       | FR-07 decrements item quantity                       | Bấm `-`; kiểm tra quantity và thành tiền                                | Số lượng giảm 1; không âm; thành tiền dòng và tổng cộng được tính lại đúng                                | Chưa chạy       | Chưa chạy  |
| TC-CART-007 | Không cho giảm số lượng xuống dưới 1                                   | Biên                    | cart_quantity_min_one           | Có       | FR-07 enforces minimum quantity one                  | Với quantity = 1, bấm `-` hoặc nhập giá trị nhỏ hơn 1                   | Số lượng tối thiểu vẫn là 1 hoặc item chỉ bị xóa sau khi có hành động xóa được xác nhận                   | Chưa chạy       | Chưa chạy  |
| TC-CART-008 | Xóa sản phẩm nhưng hủy ở dialog xác nhận                               | Tiêu cực / xác nhận     | cart_delete_cancel              | Có       | FR-07 keeps item when delete is cancelled            | Bấm xóa; chọn Cancel trong dialog                                       | Sản phẩm vẫn còn trong giỏ; số lượng và tổng cộng không đổi                                               | Chưa chạy       | Chưa chạy  |
| TC-CART-009 | Xóa sản phẩm và đồng ý ở dialog xác nhận                               | Tích cực                | cart_delete_confirm             | Có       | FR-07 removes item after confirmation                | Bấm xóa; chọn OK trong dialog                                           | Sản phẩm bị xóa khỏi giỏ; tổng cộng cập nhật; nếu hết sản phẩm thì hiển thị empty state                   | Chưa chạy       | Chưa chạy  |
| TC-CART-010 | Kiểm tra nhãn tổng tiền                                                | Tích cực / UI content   | cart_total_label                | Có       | FR-07 uses total label tong cong                     | Kiểm tra text nhãn tổng tiền trên trang giỏ hàng                        | Trang giỏ hàng hiển thị nhãn chính xác `Tổng cộng`, không hiển thị `Tổng tạm tính`                       | Chưa chạy       | Chưa chạy  |
| TC-CART-011 | Nút tiếp tục mua sắm quay về trang chủ                                 | Tích cực / điều hướng   | cart_continue_shopping          | Có       | FR-07 navigates back to home from cart               | Bấm nút/link tiếp tục mua sắm                                           | Người dùng được điều hướng về trang chủ/danh sách sản phẩm                                                | Chưa chạy       | Chưa chạy  |
| TC-CART-012 | API thêm sản phẩm vào giỏ yêu cầu token và lưu đúng dữ liệu sản phẩm   | API-backed / bảo mật    | api_cart_add_requires_token     | Có       | FR-07 API cart requires auth and stores cart item    | Gọi `POST /api/cart` không token và có token; sau đó gọi `GET /api/cart` | Không token bị từ chối; có token trả thành công; `GET /api/cart` trả item đúng id, name, price, quantity | Chưa chạy       | Chưa chạy  |

## B.3 Dữ liệu Kiểm thử Hướng Dữ liệu (Data-Driven)

| Data key                       | Giá trị nhập                                                                 | Dữ liệu mong đợi                                                              | Ghi chú                                             |
| ------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| cart_empty_state               | Mở `/cart` với cart rỗng                                                      | Empty state rõ ràng; có link/nút tiếp tục mua sắm                             | Reset cart trước khi chạy                           |
| cart_add_single_product        | `productA`: TODO chọn sản phẩm seed; `quantity`: 1                            | 1 dòng cart; thành tiền = `price * 1`                                         | Dữ liệu sản phẩm lấy từ API/seed                    |
| cart_add_same_product_twice    | `productA`; thêm 2 lần, mỗi lần quantity 1                                    | 1 dòng duy nhất; quantity = 2                                                  | Kiểm tra rule gom dòng trùng                        |
| cart_add_two_distinct_products | `productA`, `productB`; mỗi sản phẩm quantity 1                               | 2 dòng cart riêng biệt                                                         | Chọn 2 product khác id                              |
| cart_increment_quantity        | `productA`; quantity ban đầu 1; thao tác `+`                                  | quantity = 2; thành tiền và tổng cộng cập nhật                                | Cần selector nút tăng số lượng                      |
| cart_decrement_quantity        | `productA`; quantity ban đầu 2; thao tác `-`                                  | quantity = 1; thành tiền và tổng cộng cập nhật                                | Cần selector nút giảm số lượng                      |
| cart_quantity_min_one          | `productA`; quantity ban đầu 1; thao tác giảm hoặc nhập 0                     | quantity không nhỏ hơn 1                                                       | Boundary quantity                                   |
| cart_delete_cancel             | `productA`; bấm xóa rồi Cancel                                                | Item vẫn tồn tại; tổng cộng không đổi                                          | Cần xử lý browser alert/dialog                      |
| cart_delete_confirm            | `productA`; bấm xóa rồi OK                                                    | Item bị xóa; cart rỗng thì empty state xuất hiện                               | Cần xử lý browser alert/dialog                      |
| cart_total_label               | Cart có ít nhất 1 item                                                        | Text hiển thị `Tổng cộng`; không có `Tổng tạm tính`                            | Assert theo FR-07                                   |
| cart_continue_shopping         | Mở `/cart`; bấm tiếp tục mua sắm                                               | URL trở về trang chủ/danh sách sản phẩm                                        | Kiểm tra route sau click                            |
| api_cart_add_requires_token    | Không token; token hợp lệ; body `{ id, name, price, quantity }`               | Unauthorized khi thiếu token; success khi có token; cart lưu đúng item         | Token lấy từ login API hoặc tài khoản test `.env`   |

## B.4 Minh chứng Thực thi Đa trình duyệt

| Trình duyệt       | Lệnh | Đường dẫn báo cáo HTML | Có dấu thời gian? | Có `Run by: <MSSV>`? | Đạt  | Không đạt | Ghi chú |
| ----------------- | ---- | ---------------------- | ----------------- | -------------------- | ---- | --------- | ------- |
| Chromium / Chrome | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |
| Firefox           | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |
| WebKit / Edge     | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |

## B.5 Rà soát và Chỉnh sửa của Người dùng

| Vấn đề trong script AI | Tại sao sai / chưa hoàn thiện | Sửa chữa bởi sinh viên | Minh chứng / commit |
| ---------------------- | ----------------------------- | ---------------------- | ------------------- |
| TODO                   | TODO                          | TODO                   | TODO                |

## B.6 Các Bug được Tìm thấy

| ID Bug   | TC liên quan | Tóm tắt | Mong đợi | Thực tế | Mức độ | Link issue GitHub | Ảnh chụp |
| -------- | ------------ | ------- | -------- | ------- | ------ | ----------------- | -------- |
| Không ghi nhận | - | Không có bug FR-07 trong `selenium/bug-snapshots/BUGS.md` | - | - | - | - | - |

## B.7 Test Case Không Tự động hóa

| ID TC | Lý do không tự động hóa | Minh chứng thủ công / giải pháp thay thế |
| ----- | ----------------------- | ---------------------------------------- |
| TODO  | TODO                    | TODO                                     |

---

## 5. Tính năng C - FR-14: Quản lý Danh mục (CRUD)

## C.0 Phạm vi Tính năng và Tham chiếu

- Mục đích tính năng: Kiểm tra chức năng quản lý danh mục cho admin, bao gồm xem danh sách, thêm mới, cập nhật, xóa và validate tên danh mục bắt buộc.
- Các trang / route liên quan: Trang admin quản lý danh mục; API `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`.
- Vai trò người dùng chính: Admin.
- Các nguồn tham chiếu được sử dụng để xây dựng test:
  - `software-testing/hw4/docs/eshop-sut/README.md` - FR-14: Quản lý Danh mục.
  - `software-testing/hw4/docs/eshop-sut/api_specification.md` - 3.4 Categories.
  - `software-testing/hw4/docs/eshop-sut/frontend-admin/src/App.jsx` và `backend/server.js` để tham khảo UI/API hiện tại.
- Script tự động: `selenium/tests/category-management.spec.ts` (sẽ tạo khi viết automation).
- File dữ liệu: `selenium/data/category-management.data.json` (sẽ tạo khi viết automation).

## C.1 Quy trình Tạo Script bằng AI

| Bước | Tóm tắt Prompt / tương tác | Output AI đã sử dụng | Kết quả rà soát |
| ---- | -------------------------- | -------------------- | --------------- |
| C-1  | TODO                       | TODO                 | TODO            |
| C-2  | TODO                       | TODO                 | TODO            |
| C-3  | TODO                       | TODO                 | TODO            |

## C.2 Ánh xạ Test Case Tự động

> Yêu cầu tối thiểu: ít nhất 12 test case cho tính năng này.

| ID TC                 | Kịch bản                                                       | Loại                   | Dataset key                         | Tự động? | Tên test                                                  | Kiểm chứng chính                                                              | Kết quả mong đợi                                                                                      | Kết quả thực tế | Trạng thái |
| --------------------- | -------------------------------------------------------------- | ---------------------- | ----------------------------------- | -------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| TC-ADMIN_CATEGORY-001 | Admin mở trang quản lý danh mục và xem danh sách hiện có       | Tích cực               | category_list_default               | Có       | FR-14 displays existing categories                         | Kiểm tra bảng/list danh mục và dữ liệu seed                                   | Trang admin hiển thị danh sách danh mục hiện có, gồm tên danh mục và thao tác tương ứng                | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-002 | Thêm danh mục mới với tên hợp lệ                               | Tích cực               | category_create_valid               | Có       | FR-14 creates category with valid name                     | Nhập tên; submit; kiểm tra UI và API list                                     | Danh mục mới được tạo, xuất hiện trong danh sách và `GET /api/categories` trả về item mới              | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-003 | Không cho thêm danh mục khi tên rỗng                           | Tiêu cực / validation  | category_create_empty_name          | Có       | FR-14 rejects empty category name                          | Submit form với tên rỗng                                                      | Hệ thống không tạo danh mục; hiển thị lỗi/validation tên bắt buộc                                      | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-004 | Không cho thêm danh mục khi tên chỉ gồm khoảng trắng           | Biên / validation      | category_create_whitespace_name     | Có       | FR-14 rejects whitespace category name                     | Nhập `"   "`; submit                                                          | Hệ thống trim/validate và không tạo danh mục trắng                                                     | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-005 | Thêm danh mục có dấu tiếng Việt                                | Tích cực / dữ liệu     | category_create_vietnamese_name     | Có       | FR-14 supports vietnamese category name                    | Tạo danh mục tên tiếng Việt                                                   | Danh mục được lưu và hiển thị đúng dấu tiếng Việt                                                      | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-006 | Thêm danh mục có ký tự đặc biệt an toàn                        | Tiêu cực / bảo mật     | category_create_html_safe_name      | Có       | FR-14 safely renders html-like category name               | Nhập `<script>alert(1)</script>` hoặc HTML-like text                           | Không thực thi script; nếu được lưu thì render dạng text an toàn, hoặc bị validation từ chối rõ ràng   | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-007 | Cập nhật tên danh mục hợp lệ qua API/admin UI                  | Tích cực               | category_update_valid               | Có       | FR-14 updates category name                                | Tạo category tạm; cập nhật tên; kiểm tra list                                 | Tên danh mục được cập nhật đúng; id giữ nguyên                                                         | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-008 | Không cho cập nhật tên danh mục thành rỗng                     | Tiêu cực / validation  | category_update_empty_name          | Có       | FR-14 rejects empty name on update                         | PUT/update với name rỗng                                                       | Hệ thống không đổi tên sang rỗng; trả lỗi hoặc UI validation rõ ràng                                    | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-009 | Xóa danh mục sau khi xác nhận                                  | Tích cực               | category_delete_valid               | Có       | FR-14 deletes category                                     | Tạo category tạm; bấm xóa/xác nhận; kiểm tra list/API                         | Danh mục bị xóa khỏi UI và không còn trong `GET /api/categories`                                      | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-010 | Hủy thao tác xóa danh mục                                      | Tiêu cực / xác nhận    | category_delete_cancel              | Có       | FR-14 keeps category when delete is cancelled              | Bấm xóa rồi Cancel trong dialog                                                | Danh mục vẫn tồn tại; danh sách không đổi                                                              | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-011 | API danh mục yêu cầu xác thực cho thao tác ghi                 | API-backed / bảo mật   | api_category_write_requires_token   | Có       | FR-14 category write APIs require token                    | Gọi POST/PUT/DELETE không token                                                | Các thao tác ghi bị từ chối khi thiếu token; không thay đổi dữ liệu danh mục                           | Chưa chạy       | Chưa chạy  |
| TC-ADMIN_CATEGORY-012 | API tạo-xem-cập nhật-xóa danh mục end-to-end                  | API-backed / E2E       | api_category_crud_end_to_end        | Có       | FR-14 category API supports CRUD flow                      | POST tạo; GET kiểm tra; PUT đổi tên; DELETE xóa; GET kiểm tra lần cuối         | API trả response thành công ở từng bước; dữ liệu cuối cùng phản ánh đúng luồng CRUD                    | Chưa chạy       | Chưa chạy  |

## C.3 Dữ liệu Kiểm thử Hướng Dữ liệu (Data-Driven)

| Data key                         | Giá trị nhập                                                                    | Dữ liệu mong đợi                                                             | Ghi chú                                           |
| -------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| category_list_default            | Mở trang admin danh mục hoặc gọi `GET /api/categories`                          | Danh sách có category seed như Điện thoại/Laptop/Phụ kiện                    | Dựa trên seed database                            |
| category_create_valid            | `name`: `HW04 Category 23127344`                                                 | Category mới xuất hiện trong UI/API                                           | Tên nên unique theo MSSV để dễ cleanup            |
| category_create_empty_name       | `name`: empty string                                                             | Không tạo category; có validation/lỗi                                         | Assert theo FR-14 tên bắt buộc                    |
| category_create_whitespace_name  | `name`: `"   "`                                                                  | Không tạo category trắng                                                       | Kiểm tra trim/validation                          |
| category_create_vietnamese_name  | `name`: `Phụ kiện kiểm thử 23127344`                                             | Lưu và hiển thị đúng Unicode tiếng Việt                                       | Kiểm tra i18n dữ liệu                             |
| category_create_html_safe_name   | `name`: `<script>alert(1)</script>`                                              | Không execute script; render an toàn hoặc reject rõ ràng                      | Security/rendering case                           |
| category_update_valid            | `initialName`: `HW04 Old 23127344`; `updatedName`: `HW04 Updated 23127344`       | Category giữ id và đổi sang tên mới                                           | Có thể thực hiện bằng API setup                   |
| category_update_empty_name       | `initialName`: `HW04 Update Empty 23127344`; `updatedName`: empty string         | Không đổi sang tên rỗng                                                       | API hiện tại có thể cần human review nếu sai spec |
| category_delete_valid            | `name`: `HW04 Delete 23127344`; confirm delete = OK                              | Category không còn trong list/API                                             | Cleanup sau test                                  |
| category_delete_cancel           | `name`: `HW04 Cancel Delete 23127344`; confirm delete = Cancel                   | Category vẫn tồn tại                                                          | Cần xử lý browser dialog                          |
| api_category_write_requires_token| Không token; endpoints POST/PUT/DELETE `/api/categories`                        | Write APIs bị từ chối khi thiếu token                                         | Token lấy từ login API khi test positive          |
| api_category_crud_end_to_end     | Token hợp lệ; create/update/delete category unique theo MSSV/timestamp           | CRUD flow thành công; dữ liệu cuối cùng đúng                                  | API-backed assertion                              |

## C.4 Minh chứng Thực thi Đa trình duyệt

| Trình duyệt       | Lệnh | Đường dẫn báo cáo HTML | Có dấu thời gian? | Có `Run by: <MSSV>`? | Đạt  | Không đạt | Ghi chú |
| ----------------- | ---- | ---------------------- | ----------------- | -------------------- | ---- | --------- | ------- |
| Chromium / Chrome | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |
| Firefox           | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |
| WebKit / Edge     | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |

## C.5 Rà soát và Chỉnh sửa của Người dùng

| Vấn đề trong script AI | Tại sao sai / chưa hoàn thiện | Sửa chữa bởi sinh viên | Minh chứng / commit |
| ---------------------- | ----------------------------- | ---------------------- | ------------------- |
| TODO                   | TODO                          | TODO                   | TODO                |

## C.6 Các Bug được Tìm thấy

| ID Bug   | TC liên quan | Tóm tắt | Mong đợi | Thực tế | Mức độ | Link issue GitHub | Ảnh chụp |
| -------- | ------------ | ------- | -------- | ------- | ------ | ----------------- | -------- |
| Không ghi nhận | - | Không có bug FR-14 trong `selenium/bug-snapshots/BUGS.md` | - | - | - | - | - |

## C.7 Test Case Không Tự động hóa

| ID TC | Lý do không tự động hóa | Minh chứng thủ công / giải pháp thay thế |
| ----- | ----------------------- | ---------------------------------------- |
| TODO  | TODO                    | TODO                                     |

---

## 6. Tổng kết Thực thi

| Chỉ số                   | Tính năng A | Tính năng B | Tính năng C | Tổng |
| ------------------------ | ----------: | ----------: | ----------: | ---: |
| Test case đã chọn        |          12 |          12 |          12 |   36 |
| Test case đã tự động hóa |          12 |           0 |           0 |   12 |
| Test case đã thực thi    |          12 |           0 |           0 |   12 |
| Test case Đạt            |           7 |           0 |           0 |    7 |
| Test case Không đạt      |           5 |           0 |           0 |    5 |
| Lượt chạy trình duyệt    |           3 |           0 |           0 |    3 |
| Bug đã báo cáo           |           5 |           0 |           0 |    5 |

## 6.1 Báo cáo HTML

| Bộ báo cáo  | Trình duyệt       | Đường dẫn / link | Thời gian | Ghi chú |
| ----------- | ----------------- | ---------------- | --------- | ------- |
| Tính năng A | Chrome            | `selenium/reports/product-listing-search/chrome.html` | 26/07/2026 | Chạy headless |
| Tính năng A | Firefox           | `selenium/reports/product-listing-search/firefox.html` | 26/07/2026 | Chạy headless |
| Tính năng A | Edge              | `selenium/reports/product-listing-search/edge.html` | 26/07/2026 | Chạy headless |
| Tính năng B | Chrome            | Chưa chạy | - | Script chưa tạo |
| Tính năng B | Firefox           | Chưa chạy | - | Script chưa tạo |
| Tính năng B | Edge              | Chưa chạy | - | Script chưa tạo |
| Tính năng C | Chrome            | Chưa chạy | - | Script chưa tạo |
| Tính năng C | Firefox           | Chưa chạy | - | Script chưa tạo |
| Tính năng C | Edge              | Chưa chạy | - | Script chưa tạo |

## 6.2 Tóm tắt Báo cáo Bug

| ID Bug | Tính năng | GitHub issue | Ảnh chụp | Trạng thái |
| ------ | --------- | ------------ | -------- | ---------- |
| BUG-A-01 | FR-05 | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-002.png` | Phát hiện |
| BUG-A-02 | FR-05 | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-004.png` | Phát hiện |
| BUG-A-03 | FR-05 | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-005.png` | Phát hiện |
| BUG-A-04 | FR-05 | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-008.png` | Phát hiện |
| BUG-A-05 | FR-05 | Chưa tạo | `selenium/bug-snapshots/TC-PRODUCT_SEARCH-011.png` | Phát hiện |

---

## 7. Video Demo

| Yêu cầu                                                           | Minh chứng |
| ----------------------------------------------------------------- | ---------- |
| Link YouTube không niêm yết                                       | TODO       |
| Thời lượng ít nhất 5 phút                                         | TODO       |
| Lời bình bằng tiếng Việt                                          | TODO       |
| Hiển thị một script tự động chạy end-to-end                       | TODO       |
| Hiển thị lượt chạy đa trình duyệt                                 | TODO       |
| Hiển thị báo cáo HTML được tạo                                    | TODO       |
| Hiển thị một chỉnh sửa của con người cho script AI                | TODO       |
| Hiển thị minh chứng tác giả: face-cam hoặc `whoami` và `hostname` | TODO       |

### 7.1 Dàn ý Video

1. Giới thiệu thông tin sinh viên và tính năng đã chọn.
2. Hiển thị script tự động hóa và file dữ liệu bên ngoài.
3. Chạy script trên ba trình duyệt.
4. Mở báo cáo HTML được tạo và chỉ ra `Run by: <MSSV>` và dấu thời gian.
5. Giải thích một vấn đề trong script AI và chỉnh sửa của con người.
6. Tóm tắt kết quả Đạt/Không đạt và bất kỳ bug nào được tìm thấy.

---

## 8. Kỹ năng Agent (Agent Skill)

> Phần này được 10 điểm nếu hoàn thành. Nếu không hoàn thành, ghi `Not submitted`.

| Mục                            | Giá trị          |
| ------------------------------ | ---------------- |
| Đã nộp kỹ năng?                | TODO: Có / Không |
| Tên kỹ năng                    | TODO             |
| Đường dẫn kỹ năng / repository | TODO             |
| Link video demo kỹ năng        | TODO             |
| Tính năng hoàn chỉnh được demo | TODO             |

### 8.1 Tóm tắt Quy trình Kỹ năng

- Đầu vào mà kỹ năng chấp nhận: TODO.
- Đầu ra mà kỹ năng tạo ra: TODO.
- Kỹ năng hỗ trợ tự động hóa hướng dữ liệu, đa trình duyệt như thế nào: TODO.
- Con người vẫn cần rà soát sau khi sử dụng kỹ năng: TODO.

---

## 9. Phê bình AI (200-300 từ)

Trong bài tập này, các script được tạo bởi AI nhìn chung có vẻ đúng về mặt cú pháp và bao phủ được nhiều thao tác kiểm thử cơ bản. Tuy nhiên, kết quả đó vẫn chưa thể được xem là hoàn toàn đáng tin cậy nếu không có con người rà soát lại. Hạn chế quan trọng là AI có thể không hiểu đầy đủ business flow của hệ thống, chẳng hạn thứ tự thao tác thực tế của người dùng, điều kiện dữ liệu trước khi chạy test, hoặc trạng thái mong đợi sau mỗi bước. Vì vậy, script có thể chạy được nhưng vẫn kiểm tra sai hành vi cần kiểm chứng, hoặc bỏ qua các ràng buộc nghiệp vụ quan trọng.

Ngoài ra, lỗi cũng có thể xuất hiện ở mức triển khai, như chọn sai locator, assert chưa đủ chặt chẽ, xử lý bất đồng bộ chưa ổn định, hoặc sử dụng chưa đúng framework kiểm thử. Nguyên nhân một phần đến từ việc prompt chưa nêu đủ các nguyên tắc và điều kiện nghiêm ngặt, ví dụ yêu cầu script phải chạy được end-to-end trên môi trường thật và phải xác minh kết quả theo đặc tả. Tuy nhiên, nếu chỉ nhấn mạnh “làm sao cho chạy được”, AI cũng có thể tạo ra cách vá lỗi làm test pass nhưng lệch khỏi ý tưởng ban đầu.

Do đó, khi cộng tác với AI, cần xem AI như công cụ hỗ trợ tạo bản nháp nhanh, không phải người thay thế hoàn toàn kiểm thử viên. Con người vẫn phải review, chạy thử, đối chiếu với yêu cầu nghiệp vụ và cải tiến script từng bước để kết quả cuối cùng vừa ổn định vừa phản ánh đúng mục tiêu kiểm thử.

---

## 10. Phụ lục Báo cáo Kiểm toán AI (AI Audit Report)

> Đính kèm toàn bộ Báo cáo Kiểm toán AI dưới dạng file Markdown và PDF riêng biệt.

Tuyên bố bắt buộc:

> TODO: "Tôi sử dụng các công cụ AI cho các tác vụ sau," hoặc "Tôi không sử dụng sự trợ giúp của AI trong bài tập này."

| STT | Công cụ AI | Ngày và giờ | Tóm tắt Prompt | Artifact đầu ra | Rà soát / chỉnh sửa của sinh viên | Phán quyết |
| --- | ---------- | ----------- | -------------- | --------------- | --------------------------------- | ---------- |
| 1   | TODO       | TODO        | TODO           | TODO            | TODO                              | TODO       |
| 2   | TODO       | TODO        | TODO           | TODO            | TODO                              | TODO       |
| 3   | TODO       | TODO        | TODO           | TODO            | TODO                              | TODO       |

---

## 11. Git Commit Log

> Yêu cầu: ít nhất 8 commit có ý nghĩa trong ít nhất 4 ngày. Chỉ các commit thay đổi các file script test như `.spec.js`, `.spec.ts`, hoặc tương đương mới được tính.

| STT | Mã Hash commit | Ngày | File script test đã thay đổi | Thông điệp commit | Đạt yêu cầu? |
| --- | -------------- | ---- | ---------------------------- | ----------------- | ------------ |
| 1   | TODO           | TODO | TODO                         | TODO              | Có/Không     |
| 2   | TODO           | TODO | TODO                         | TODO              | Có/Không     |
| 3   | TODO           | TODO | TODO                         | TODO              | Có/Không     |
| 4   | TODO           | TODO | TODO                         | TODO              | Có/Không     |
| 5   | TODO           | TODO | TODO                         | TODO              | Có/Không     |
| 6   | TODO           | TODO | TODO                         | TODO              | Có/Không     |
| 7   | TODO           | TODO | TODO                         | TODO              | Có/Không     |
| 8   | TODO           | TODO | TODO                         | TODO              | Có/Không     |

File log Git đính kèm: TODO.

---

## 12. Danh mục Kiểm tra Nộp bài

| Hạng mục yêu cầu                                  | Đã bao gồm? | Đường dẫn / link |
| ------------------------------------------------- | ----------- | ---------------- |
| Báo cáo chính - Markdown                          | Có          | `HW04_Main_Report_Template.md` |
| Báo cáo chính - PDF                               | Chưa        | - |
| Repository GitHub công khai                       | Chưa        | - |
| Các script tự động hóa                            | Có          | `selenium/tests/product-listing-search.spec.ts` |
| File dữ liệu bên ngoài (`.json` / `.csv`)         | Có          | `selenium/data/product-listing-search.data.json` |
| Báo cáo HTML đa trình duyệt                       | Có          | `selenium/reports/product-listing-search/{chrome,edge,firefox}.html` |
| Video demo YouTube không niêm yết                 | Chưa        | - |
| Phê bình AI - Markdown/PDF                        | Có          | Mục 9 trong báo cáo này |
| Báo cáo Kiểm toán AI - Markdown/PDF               | Chưa        | - |
| File văn bản log Git commit                       | Chưa        | - |
| Báo cáo bug với GitHub Issues và ảnh chụp, nếu có | Có (1 phần) | `selenium/bug-snapshots/` |
| README.md với tự đánh giá và tóm tắt test         | Có          | `selenium/README.md` |
| Kỹ năng Agent và video demo kỹ năng, nếu đã nộp   | Chưa        | - |

---

## 13. Tự đánh giá

| STT | Tiêu chí             | Điểm tối đa | Điểm tự đánh giá | Minh chứng |
| --- | -------------------- | ----------: | ---------------: | ---------- |
| 1   | Task 1 - Tính năng A |          25 |                20 | 12/12 test case tự động hóa, 7 Đạt / 5 Không đạt, 5 bug tìm thấy |
| 2   | Task 1 - Tính năng B |          25 |                 0 | Chưa thực hiện |
| 3   | Task 1 - Tính năng C |          25 |                 0 | Chưa thực hiện |
| 4   | Task 2 - Video demo  |          15 |                 0 | Chưa thực hiện |
| 5   | Kỹ năng Agent        |          10 |                 0 | Chưa thực hiện |
|     | Tổng                 |         100 |                20 | Chỉ mới hoàn thành Tính năng A |

---

## 14. Chữ ký

| Trường        | Giá trị                              |
| ------------- | ------------------------------------ |
| Tên sinh viên | Trương Thành Đạt                       |
| MSSV          | 23127344                               |
| Khóa học      | Kiểm thử Phần mềm (Software Testing) |
| Ngày          | 26/07/2026                            |
| Chữ ký        | (đã ký)                               |
