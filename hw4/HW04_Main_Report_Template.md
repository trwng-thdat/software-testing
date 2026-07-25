# HW04 - Kiểm thử Tự động trên EShop - Báo cáo Chính

## 0. Thông tin Sinh viên

| Trường                 | Giá trị                 |
| ---------------------- | ----------------------- |
| Họ và tên              | Trương Thành Đạt        |
| MSSV                   | 23127344                |
| Lớp / Nhóm | Kiểm thử phần mềm - 23KTPM3 |
| Bài tập | HW04 - Automation Testing |
| Ngày nộp               | 25/07/2026              |
| Điểm tự đánh giá | 100 |
| Link repository GitHub | TODO                    |
| Link GitHub Issues     | TODO                    |
| Link video demo        | TODO                    |

---

## 1. Các Tính năng đã Chọn

| Tính năng   | Pool | FR ID | Tên tính năng                | Mã module        |
| ----------- | ---- | ----- | ---------------------------- | ---------------- |
| Tính năng A | A    | FR-05 | Liệt kê và tìm kiếm sản phẩm | `PRODUCT_SEARCH` |
| Tính năng B | B    | FR-07 | Giỏ hàng                     | `CART`           |
| Tính năng C | C    | FR-14 | Quản lý danh mục (CRUD)      | `ADMIN_CATEGORY` |

> Quy ước ID test case: `TC-<MODULE>-<NNN>`.
> Quy ước đặt tên script tự động: TODO, ví dụ `product-search.spec.ts`, `cart.spec.ts`, `admin-category.spec.ts`.

---

## 2. Môi trường Tự động hóa

| Mục                      | Giá trị                                                        |
| ------------------------ | -------------------------------------------------------------- |
| Repository SUT           | https://github.com/ttbhanh/eshop-sut                           |
| Framework tự động        | Selenium                                                       |
| Ngôn ngữ                 | TypeScript                                                     |
| Phiên bản test runner    | N/A                                                            |
| Bộ trình duyệt           | Firefox, Chrome, Edge                                          |
| Công cụ báo cáo          | TODO: Playwright HTML reporter / Allure                        |
| Hệ điều hành             | Windows 11                                                     |
| Phiên bản Node / runtime | > 20                                                           |
| Chuỗi nhận dạng báo cáo  | `Run by: <MSSV>`                                               |

### 2.1 Cấu trúc Dự án

```text
📁 tests/
 ├── 🧪 product-search.spec.ts
 ├── 🧪 cart.spec.ts
 └── 🧪 admin-category.spec.ts
📁 data/
 ├── 📄 product-search-data.json
 ├── 📄 cart-data.json
 └── 📄 admin-category-data.json
📄 package.json
📄 tsconfig.json
📁 reports/
```

### 2.2 Chiến lược Dữ liệu Kiểm thử Chung

- Định dạng file dữ liệu: TODO: `.json` / `.csv`.
- Vị trí dữ liệu: TODO.
- Quy tắc tuân thủ: dữ liệu kiểm thử được lưu trữ bên ngoài script; không hardcode mảng/đối tượng trong mã nguồn.
- Tài khoản dùng chung:

| Vai trò tài khoản | Email / Tên người dùng | Mục đích         | Ghi chú |
| ----------------- | ---------------------- | ---------------- | ------- |
| Khách hàng        | TODO                   | Tính năng A và B | TODO    |
| Quản trị viên     | TODO                   | Tính năng C      | TODO    |

### 2.3 Các Mẫu Kiểm chứng (Assertion) Đã Sử dụng

| Mẫu kiểm chứng                          | Ví dụ sử dụng trong bài tập | Tính năng sử dụng |
| --------------------------------------- | --------------------------- | ----------------- |
| Kiểm chứng hiển thị / sự tồn tại của UI | TODO                        | TODO              |
| Kiểm chứng văn bản / nội dung           | TODO                        | TODO              |
| Kiểm chứng URL / điều hướng             | TODO                        | TODO              |
| Kiểm chứng trạng thái / giá trị         | TODO                        | TODO              |
| Kiểm chứng dựa trên API / cơ sở dữ liệu | TODO                        | TODO              |

---

## 3. Tính năng A - FR-05: Liệt kê và Tìm kiếm Sản phẩm

## A.0 Phạm vi Tính năng và Tham chiếu

- Mục đích tính năng: TODO.
- Các trang / route liên quan: TODO.
- Vai trò người dùng chính: TODO.
- Các nguồn tham chiếu được sử dụng để xây dựng test:
  - TODO: SRS / API spec / file nguồn / test cases HW02.
- Script tự động: TODO.
- File dữ liệu: TODO.

## A.1 Quy trình Tạo Script bằng AI

| Bước | Tóm tắt Prompt / tương tác | Output AI đã sử dụng | Kết quả rà soát |
| ---- | -------------------------- | -------------------- | --------------- |
| A-1  | TODO                       | TODO                 | TODO            |
| A-2  | TODO                       | TODO                 | TODO            |
| A-3  | TODO                       | TODO                 | TODO            |

## A.2 Ánh xạ Test Case Tự động

> Yêu cầu tối thiểu: ít nhất 12 test case cho tính năng này.

| ID TC                 | Kịch bản | Loại                   | Dataset key | Tự động? | Tên test | Kiểm chứng chính | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
| --------------------- | -------- | ---------------------- | ----------- | -------- | -------- | ---------------- | ---------------- | --------------- | ---------- |
| TC-PRODUCT_SEARCH-001 | TODO     | Tích cực               | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-002 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-003 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-004 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-005 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-006 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-007 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-008 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-009 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-010 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-011 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-PRODUCT_SEARCH-012 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |

## A.3 Dữ liệu Kiểm thử Hướng Dữ liệu (Data-Driven)

| Data key | Giá trị nhập | Dữ liệu mong đợi | Ghi chú |
| -------- | ------------ | ---------------- | ------- |
| TODO     | TODO         | TODO             | TODO    |

## A.4 Minh chứng Thực thi Đa trình duyệt

| Trình duyệt       | Lệnh | Đường dẫn báo cáo HTML | Có dấu thời gian? | Có `Run by: <MSSV>`? | Đạt  | Không đạt | Ghi chú |
| ----------------- | ---- | ---------------------- | ----------------- | -------------------- | ---- | --------- | ------- |
| Chromium / Chrome | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |
| Firefox           | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |
| WebKit / Edge     | TODO | TODO                   | Có/Không          | Có/Không             | TODO | TODO      | TODO    |

## A.5 Rà soát và Chỉnh sửa của Người dùng

| Vấn đề trong script AI                                                          | Tại sao sai / chưa hoàn thiện | Sửa chữa bởi sinh viên | Minh chứng / commit |
| ------------------------------------------------------------------------------- | ----------------------------- | ---------------------- | ------------------- |
| TODO: selector lỏng lẻo / thiếu kiểm chứng / chờ đợi không ổn định / thiếu biên | TODO                          | TODO                   | TODO                |

## A.6 Các Bug được Tìm thấy

| ID Bug   | TC liên quan | Tóm tắt | Mong đợi | Thực tế | Mức độ | Link issue GitHub | Ảnh chụp |
| -------- | ------------ | ------- | -------- | ------- | ------ | ----------------- | -------- |
| BUG-A-01 | TODO         | TODO    | TODO     | TODO    | TODO   | TODO              | TODO     |

## A.7 Test Case Không Tự động hóa

| ID TC | Lý do không tự động hóa | Minh chứng thủ công / giải pháp thay thế |
| ----- | ----------------------- | ---------------------------------------- |
| TODO  | TODO                    | TODO                                     |

---

## 4. Tính năng B - FR-07: Giỏ hàng

## B.0 Phạm vi Tính năng và Tham chiếu

- Mục đích tính năng: TODO.
- Các trang / route liên quan: TODO.
- Vai trò người dùng chính: TODO.
- Các nguồn tham chiếu được sử dụng để xây dựng test:
  - TODO: SRS / API spec / file nguồn / test cases HW02.
- Script tự động: TODO.
- File dữ liệu: TODO.

## B.1 Quy trình Tạo Script bằng AI

| Bước | Tóm tắt Prompt / tương tác | Output AI đã sử dụng | Kết quả rà soát |
| ---- | -------------------------- | -------------------- | --------------- |
| B-1  | TODO                       | TODO                 | TODO            |
| B-2  | TODO                       | TODO                 | TODO            |
| B-3  | TODO                       | TODO                 | TODO            |

## B.2 Ánh xạ Test Case Tự động

> Yêu cầu tối thiểu: ít nhất 12 test case cho tính năng này.

| ID TC       | Kịch bản | Loại                   | Dataset key | Tự động? | Tên test | Kiểm chứng chính | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
| ----------- | -------- | ---------------------- | ----------- | -------- | -------- | ---------------- | ---------------- | --------------- | ---------- |
| TC-CART-001 | TODO     | Tích cực               | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-002 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-003 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-004 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-005 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-006 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-007 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-008 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-009 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-010 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-011 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-CART-012 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |

## B.3 Dữ liệu Kiểm thử Hướng Dữ liệu (Data-Driven)

| Data key | Giá trị nhập | Dữ liệu mong đợi | Ghi chú |
| -------- | ------------ | ---------------- | ------- |
| TODO     | TODO         | TODO             | TODO    |

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
| BUG-B-01 | TODO         | TODO    | TODO     | TODO    | TODO   | TODO              | TODO     |

## B.7 Test Case Không Tự động hóa

| ID TC | Lý do không tự động hóa | Minh chứng thủ công / giải pháp thay thế |
| ----- | ----------------------- | ---------------------------------------- |
| TODO  | TODO                    | TODO                                     |

---

## 5. Tính năng C - FR-14: Quản lý Danh mục (CRUD)

## C.0 Phạm vi Tính năng và Tham chiếu

- Mục đích tính năng: TODO.
- Các trang / route liên quan: TODO.
- Vai trò người dùng chính: Admin.
- Các nguồn tham chiếu được sử dụng để xây dựng test:
  - TODO: SRS / API spec / file nguồn / test cases HW02.
- Script tự động: TODO.
- File dữ liệu: TODO.

## C.1 Quy trình Tạo Script bằng AI

| Bước | Tóm tắt Prompt / tương tác | Output AI đã sử dụng | Kết quả rà soát |
| ---- | -------------------------- | -------------------- | --------------- |
| C-1  | TODO                       | TODO                 | TODO            |
| C-2  | TODO                       | TODO                 | TODO            |
| C-3  | TODO                       | TODO                 | TODO            |

## C.2 Ánh xạ Test Case Tự động

> Yêu cầu tối thiểu: ít nhất 12 test case cho tính năng này.

| ID TC                 | Kịch bản | Loại                   | Dataset key | Tự động? | Tên test | Kiểm chứng chính | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
| --------------------- | -------- | ---------------------- | ----------- | -------- | -------- | ---------------- | ---------------- | --------------- | ---------- |
| TC-ADMIN_CATEGORY-001 | TODO     | Tích cực               | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-002 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-003 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-004 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-005 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-006 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-007 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-008 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-009 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-010 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-011 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |
| TC-ADMIN_CATEGORY-012 | TODO     | Tích cực/Tiêu cực/Biên | TODO        | Có/Không | TODO     | TODO             | TODO             | TODO            | TODO       |

## C.3 Dữ liệu Kiểm thử Hướng Dữ liệu (Data-Driven)

| Data key | Giá trị nhập | Dữ liệu mong đợi | Ghi chú |
| -------- | ------------ | ---------------- | ------- |
| TODO     | TODO         | TODO             | TODO    |

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
| BUG-C-01 | TODO         | TODO    | TODO     | TODO    | TODO   | TODO              | TODO     |

## C.7 Test Case Không Tự động hóa

| ID TC | Lý do không tự động hóa | Minh chứng thủ công / giải pháp thay thế |
| ----- | ----------------------- | ---------------------------------------- |
| TODO  | TODO                    | TODO                                     |

---

## 6. Tổng kết Thực thi

| Chỉ số                   | Tính năng A | Tính năng B | Tính năng C | Tổng |
| ------------------------ | ----------: | ----------: | ----------: | ---: |
| Test case đã chọn        |        TODO |        TODO |        TODO | TODO |
| Test case đã tự động hóa |        TODO |        TODO |        TODO | TODO |
| Test case đã thực thi    |        TODO |        TODO |        TODO | TODO |
| Test case Đạt            |        TODO |        TODO |        TODO | TODO |
| Test case Không đạt      |        TODO |        TODO |        TODO | TODO |
| Lượt chạy trình duyệt    |           3 |           3 |           3 |    9 |
| Bug đã báo cáo           |        TODO |        TODO |        TODO | TODO |

## 6.1 Báo cáo HTML

| Bộ báo cáo  | Trình duyệt       | Đường dẫn / link | Thời gian | Ghi chú |
| ----------- | ----------------- | ---------------- | --------- | ------- |
| Tính năng A | Chromium / Chrome | TODO             | TODO      | TODO    |
| Tính năng A | Firefox           | TODO             | TODO      | TODO    |
| Tính năng A | WebKit / Edge     | TODO             | TODO      | TODO    |
| Tính năng B | Chromium / Chrome | TODO             | TODO      | TODO    |
| Tính năng B | Firefox           | TODO             | TODO      | TODO    |
| Tính năng B | WebKit / Edge     | TODO             | TODO      | TODO    |
| Tính năng C | Chromium / Chrome | TODO             | TODO      | TODO    |
| Tính năng C | Firefox           | TODO             | TODO      | TODO    |
| Tính năng C | WebKit / Edge     | TODO             | TODO      | TODO    |

## 6.2 Tóm tắt Báo cáo Bug

| ID Bug | Tính năng | GitHub issue | Ảnh chụp | Trạng thái |
| ------ | --------- | ------------ | -------- | ---------- |
| TODO   | TODO      | TODO         | TODO     | TODO       |

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

TODO: Viết một đoạn văn từ 200-300 từ. Đề cập đến:

- AI đã làm sai, thiên kiến hoặc không đầy đủ ở đâu?
- Tại sao nó không phát hiện ra vấn đề?
- Nguyên tắc bạn đã học được về việc cộng tác với AI trong bài tập này là gì?

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
| Báo cáo chính - Markdown                          | TODO        | TODO             |
| Báo cáo chính - PDF                               | TODO        | TODO             |
| Repository GitHub công khai                       | TODO        | TODO             |
| Các script tự động hóa                            | TODO        | TODO             |
| File dữ liệu bên ngoài (`.json` / `.csv`)         | TODO        | TODO             |
| Báo cáo HTML đa trình duyệt                       | TODO        | TODO             |
| Video demo YouTube không niêm yết                 | TODO        | TODO             |
| Phê bình AI - Markdown/PDF                        | TODO        | TODO             |
| Báo cáo Kiểm toán AI - Markdown/PDF               | TODO        | TODO             |
| File văn bản log Git commit                       | TODO        | TODO             |
| Báo cáo bug với GitHub Issues và ảnh chụp, nếu có | TODO        | TODO             |
| README.md với tự đánh giá và tóm tắt test         | TODO        | TODO             |
| Kỹ năng Agent và video demo kỹ năng, nếu đã nộp   | TODO        | TODO             |

---

## 13. Tự đánh giá

| STT | Tiêu chí             | Điểm tối đa | Điểm tự đánh giá | Minh chứng |
| --- | -------------------- | ----------: | ---------------: | ---------- |
| 1   | Task 1 - Tính năng A |          25 |             TODO | TODO       |
| 2   | Task 1 - Tính năng B |          25 |             TODO | TODO       |
| 3   | Task 1 - Tính năng C |          25 |             TODO | TODO       |
| 4   | Task 2 - Video demo  |          15 |             TODO | TODO       |
| 5   | Kỹ năng Agent        |          10 |             TODO | TODO       |
|     | Tổng                 |         100 |             TODO | TODO       |

---

## 14. Chữ ký

| Trường        | Giá trị                              |
| ------------- | ------------------------------------ |
| Tên sinh viên | TODO                                 |
| MSSV          | TODO                                 |
| Khóa học      | Kiểm thử Phần mềm (Software Testing) |
| Ngày          | TODO                                 |
| Chữ ký        | TODO                                 |
