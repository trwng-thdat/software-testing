---
name: selenium-automation
description: Tạo và duy trì Selenium automation cho các tính năng web của HW04 EShop từ tài liệu được cung cấp (README, API, SRS...). Sử dụng khi người dùng yêu cầu tự động hóa tính năng, tạo script Selenium, chuyển đổi FR thành UI test, hoặc scaffold project selenium/. Kỹ năng tạo các file test TypeScript trong selenium/tests/ và dữ liệu JSON trong selenium/data/. Phải hỏi người dùng FR nào cần thực hiện nếu tài liệu có nhiều FR và yêu cầu chưa rõ ràng.
---

# Selenium Automation - HW04 Tự động hóa Web EShop

## Mục tiêu

Tạo các script tự động hóa Selenium cho HW04 bằng tài liệu do người dùng cung cấp. Các script tạo ra phải:

- **Hướng tính năng (Feature-targeted):** mỗi FR một script.
- **Hướng dữ liệu (Data-driven):** mọi đầu vào kiểm thử và giá trị mong đợi được đọc từ file JSON trong `selenium/data/`.
- **Dựa trên TypeScript:** Selenium WebDriver + Mocha + Chai.
- **Dự án có thể chạy được (Runnable as a project):** bao gồm `package.json`, `tsconfig.json`, cấu hình, bộ hỗ trợ, test và file dữ liệu.
- **Thân thiện với minh chứng:** các script hỗ trợ chạy đa trình duyệt và tạo báo cáo HTML theo yêu cầu HW04.

Không tạo script dựa trên dự đoán. Hãy đọc tài liệu do người dùng cung cấp trước.

---

## Tài liệu đầu vào yêu cầu

Khi người dùng yêu cầu tạo automation Selenium, hãy tìm kiếm hoặc yêu cầu các tài liệu như:

- Website README hoặc hướng dẫn cài đặt chứa:
  - domain website / base URL;
  - tài khoản mặc định;
  - port frontend/backend;
  - lệnh cài đặt và chạy.
- Đặc tả API chứa:
  - các endpoint;
  - body request/response;
  - hành vi xác thực;
  - các thao tác thay đổi trạng thái hữu ích cho thiết lập hoặc dọn dẹp.
- Tài liệu SRS / tính năng chứa:
  - danh sách FR;
  - quy tắc nghiệp vụ;
  - quy tắc kiểm chứng;
  - hành vi UI mong đợi.
- Các test case thủ công hiện có, nếu có.

Nếu các file này tồn tại cục bộ, hãy đọc chúng trước khi triển khai. Nếu thiếu và không thể suy luận an toàn, hãy yêu cầu người dùng cung cấp.

Nếu không tìm thấy bất kỳ tài liệu nào liên quan đến website cần kiểm thử, hãy dừng lại và hỏi người dùng cung cấp tài liệu website trước khi tạo automation. Không tạo Selenium script dựa trên giả định về một ứng dụng chưa có tài liệu.

Nếu tài liệu không cung cấp website URL, domain, frontend port, hoặc route/màn hình liên quan, không cần tạo script GUI/UI. Trong trường hợp này chỉ scaffold cấu trúc, data file, README placeholder, hoặc tạo API-only test nếu đặc tả API đủ rõ.

Nếu tài liệu không cung cấp đặc tả API, không cần tạo API helper, API setup/cleanup, hoặc API-backed assertion. Trong trường hợp này chỉ tạo GUI-only test nếu website URL và hành vi UI đã được tài liệu hóa.

---

## Quy tắc Chọn FR

Nếu tài liệu chứa nhiều FR và người dùng chưa nêu rõ FR nào cần tự động hóa, hãy dừng lại và hỏi:

> Tôi nên thực hiện Selenium script cho FR nào?

Nếu người dùng đã chỉ định FR, ví dụ `FR-05`, `FR-07`, hoặc `FR-14`, chỉ thực hiện FR đó. Không tự ý chọn FR khác.

Với HW04, các tính năng di động trong Pool D nằm ngoài phạm vi vì bài tập này chỉ tự động hóa frontend web.

---

## Cấu trúc Dự án Đầu ra

Tạo hoặc cập nhật cấu trúc:

```text
selenium/
  package.json
  tsconfig.json
  .mocharc.json
  README.md
  data/
    fr-name.data.json
  tests/
    fr-name.spec.ts
  utils/
    config.ts
    driver.ts
    data.ts
    assertions.ts
    report.ts
    screenshot.ts
```

Sử dụng tên file tính năng lowercase kebab-case ổn định:

- `FR-05 Product listing and search` -> `product-listing-search.spec.ts` và `product-listing-search.data.json`
- `FR-07 Shopping cart` -> `shopping-cart.spec.ts` và `shopping-cart.data.json`
- `FR-14 Category management (CRUD)` -> `category-management.spec.ts` và `category-management.data.json`

Nếu repository hiện tại đã có quy ước đặt tên, hãy tuân theo nó trong khi giữ các vị trí bắt buộc `selenium/tests/` và `selenium/data/`.

---

## Yêu cầu Hướng dữ liệu (Data-Driven)

Mỗi bài test phải lấy đầu vào từ JSON trong `selenium/data/`.

Được phép trong test script:

- import/tải dữ liệu JSON;
- duyệt qua các mục dữ liệu;
- sử dụng hằng số cho selector, URL, và cấu hình môi trường.

Không được phép trong test script:

- mảng các test case inline;
- đối tượng inline chứa các hàng dữ liệu đầu vào;
- hardcoded các thông báo mong đợi hoặc giá trị mong đợi vốn thuộc về bộ dữ liệu.

Hình dạng JSON khuyến nghị:

```json
{
  "feature": "FR-05 Liệt kê và tìm kiếm sản phẩm",
  "basePath": "/products",
  "cases": [
    {
      "id": "TC-PRODUCT_SEARCH-001",
      "title": "Tìm kiếm bằng từ khóa sản phẩm hợp lệ",
      "type": "positive",
      "input": {
        "keyword": "phone"
      },
      "expected": {
        "status": "results-visible",
        "containsText": "phone"
      }
    }
  ]
}
```

TypeScript test phải định nghĩa các interface cho cấu trúc JSON.

---

## Quy tắc Test Script

Với mỗi FR, tạo chính xác một file spec:

```text
selenium/tests/<fr-name>.spec.ts
```

Mỗi mục dữ liệu trở thành một khối Mocha `it()`, ví dụ:

```ts
for (const testCase of data.cases) {
  it(`${testCase.id} - ${testCase.title}`, async () => {
    // các bước test
  });
}
```

Quy tắc:

- Sử dụng Selenium WebDriver, Mocha, và Chai.
- Sử dụng `async/await`.
- Sử dụng explicit wait với `driver.wait(...)`; tránh dùng sleep cố định trừ khi vì timeout nghiệp vụ thực tế.
- Ưu tiên các selector ổn định từ ứng dụng. Nếu không có, hãy dùng selector ngữ nghĩa ít dễ vỡ nhất và ghi lại rủi ro vào `selenium/README.md`.
- Kiểm chứng dựa trên đặc tả, không phải dựa trên cách triển khai lỗi hiện tại.
- Sử dụng ít nhất ba mẫu kiểm chứng khác nhau trong bộ tính năng khi có thể:
  - sự hiển thị / sự tồn tại;
  - văn bản/nội dung;
  - URL/điều hướng;
  - giá trị đầu vào/trạng thái;
  - đếm/độ dài danh sách;
  - trạng thái enabled/disabled;
  - kiểm chứng trạng thái dựa trên API.
- Chỉ sử dụng các helper API cho thiết lập, dọn dẹp, đăng nhập, hoặc kiểm chứng trạng thái khi đặc tả API cho phép.
- Không che giấu các bài test thất bại. Nếu kết quả thực tế khác với mong đợi, hãy để test thất bại.

---

## Đa trình duyệt và Báo cáo

HW04 yêu cầu mỗi tính năng chạy trên ba trình duyệt. Cấu hình các script để nhận `BROWSER` từ môi trường:

- `chrome`
- `firefox`
- `edge` hoặc trình duyệt thứ ba khả dụng khác.

Dự án nên bao gồm các script tương tự như:

```json
{
  "scripts": {
    "test": "mocha",
    "test:chrome": "cross-env BROWSER=chrome mocha",
    "test:firefox": "cross-env BROWSER=firefox mocha",
    "test:edge": "cross-env BROWSER=edge mocha",
    "test:all-browsers": "npm run test:chrome && npm run test:firefox && npm run test:edge"
  }
}
```

Cấu hình một reporter HTML như `mochawesome` trừ khi dự án đã sử dụng công cụ báo cáo HTML khác. Báo cáo phải hiển thị rõ ràng:

```text
Run by: <MSSV>
```

và một dấu thời gian ISO. Nếu MSSV chưa rõ, hãy dùng biến môi trường như `STUDENT_ID` và ghi lại cách chạy:

```powershell
$env:STUDENT_ID="23127344"; npm run test:all-browsers
```

---

## Cổng Xác minh Trước khi Hoàn tất

Sau khi viết hoặc chỉnh sửa script, không được kết thúc tác vụ chỉ bằng cách nói "đã tạo file". Phải kiểm tra để đảm bảo project có thể chạy được, hoặc nêu rõ blocker cụ thể nếu không thể chạy.

Thực hiện theo thứ tự:

1. Vào thư mục `selenium/`.
2. Chạy `npm install` nếu `node_modules/` chưa tồn tại hoặc dependency mới được thêm vào.
3. Chạy kiểm tra tĩnh:
   - `npm run typecheck` nếu có script;
   - nếu chưa có, thêm script `"typecheck": "tsc --noEmit"` vào `package.json` rồi chạy.
4. Chạy test mục tiêu cho FR vừa tạo:
   - ưu tiên lệnh theo FR, ví dụ `npm run test:product-listing-search`;
   - nếu chưa có lệnh riêng, chạy `npm test -- --grep "<FR-ID hoặc TC prefix>"`;
   - nếu cần xác minh HW04 đầy đủ và môi trường cho phép, chạy `npm run test:all-browsers`.
5. Kiểm tra reporter có sinh HTML report và report có metadata `Run by: <MSSV>` cùng timestamp ISO.
6. Nếu test fail vì bug thật của SUT, giữ test fail, ghi lại bug/evidence theo README và báo cáo rõ test đã chạy được nhưng phát hiện defect.
7. Nếu không thể chạy vì thiếu SUT, thiếu URL, thiếu API, thiếu browser/driver, hoặc tài liệu chưa đủ, không được giả vờ thành công. Hãy báo cáo:
   - lệnh đã thử;
   - lỗi/blocker chính;
   - phần nào vẫn đã xác minh được, ví dụ typecheck pass;
   - người dùng cần cung cấp/chạy thêm gì.

Khi sửa lỗi compile/runtime trong script, ưu tiên sửa ngay rồi chạy lại. Chỉ dừng khi script đã typecheck và chạy được, hoặc blocker bên ngoài đã rõ ràng.

---

## Yêu cầu README

Sau khi viết hoặc cập nhật script Selenium, bắt buộc tạo hoặc cập nhật `selenium/README.md` để hướng dẫn cách sử dụng script. README phải đủ rõ để người khác có thể cài đặt, cấu hình, chạy test và tìm báo cáo mà không cần hỏi lại.

Tạo hoặc cập nhật `selenium/README.md` với:

- các công cụ tiên quyết;
- cách cài đặt dependencies;
- cách khởi động EShop frontend/backend;
- cấu hình base URL và API URL;
- cấu hình metadata student ID/report;
- lệnh chạy một FR;
- lệnh chạy tất cả ba trình duyệt;
- nơi tạo báo cáo HTML;
- nơi lưu trữ ảnh chụp màn hình;
- các rủi ro selector đã biết hoặc các case chưa tự động hóa.

---

## Quy trình Triển khai

1. Đọc tài liệu người dùng cung cấp.
2. Xác định danh sách FR và FR được chọn.
3. Nếu có nhiều FR và yêu cầu chưa rõ, hỏi FR nào cần thực hiện.
4. Trích xuất:
   - base URL/domain;
   - đường dẫn trang liên quan;
   - vai trò người dùng/tài khoản;
   - quy tắc nghiệp vụ;
   - endpoint API để thiết lập/dọn dẹp;
   - thông báo kiểm chứng và lỗi mong đợi.
   Nếu không trích xuất được website URL/domain, bỏ qua phần GUI script và giải thích tài liệu nào còn thiếu. Nếu không trích xuất được endpoint API, bỏ qua API helper và API-backed assertion.
5. Tạo hoặc cập nhật `selenium/package.json`, `selenium/tsconfig.json`, `.mocharc.json`, và các utility dùng chung.
6. Tạo `selenium/data/<fr-name>.data.json`.
7. Tạo `selenium/tests/<fr-name>.spec.ts`.
8. Làm cho script chỉ tiêu thụ tập dữ liệu JSON cho đầu vào và giá trị mong đợi.
9. Tạo hoặc cập nhật `selenium/README.md` hướng dẫn cách cài đặt, cấu hình, chạy script, chạy từng FR, chạy đa trình duyệt, và xem báo cáo.
10. Chạy cổng xác minh trước khi hoàn tất: install dependency nếu cần, typecheck, chạy test FR vừa tạo, và kiểm tra report nếu môi trường khả dụng.
11. Nếu phát hiện lỗi compile/runtime do script, sửa và chạy lại.
12. Báo cáo những gì đã tạo, lệnh đã chạy, kết quả xác minh, và những gì còn cần dữ liệu do người dùng cung cấp hoặc chạy trên SUT trực tiếp.

---

## Checklist Chất lượng

Trước khi hoàn tất, hãy xác thực:

- [ ] FR được yêu cầu đã rõ ràng.
- [ ] Domain website/base URL lấy từ tài liệu hoặc cấu hình môi trường.
- [ ] Dữ liệu đầu vào test nằm trong `selenium/data/<fr-name>.data.json`.
- [ ] File spec đọc dữ liệu từ JSON.
- [ ] Không có mảng/đối tượng test case inline trong spec.
- [ ] Mỗi test case có ID, tiêu đề, loại, đầu vào, và kết quả mong đợi.
- [ ] Dự án có thể chạy từ `selenium/` với `npm install` và `npm test`.
- [ ] `npm run typecheck` đã chạy thành công, hoặc blocker được ghi rõ.
- [ ] Test cho FR vừa tạo đã được chạy, hoặc blocker bên ngoài được ghi rõ.
- [ ] Các lệnh đa trình duyệt tồn tại.
- [ ] HTML report đã được kiểm tra sau khi chạy, hoặc lý do chưa sinh report được ghi rõ.
- [ ] Cấu hình báo cáo HTML bao gồm `Run by: <MSSV>` và dấu thời gian.
- [ ] README giải thích cách chạy và nơi lưu trữ minh chứng.
- [ ] README đã được tạo/cập nhật sau khi viết script.

---

## Nhắc nhở Kiểm toán (Audit)

Đối với công việc HW04, ghi lại từng artifact do AI tạo ra vào:

```text
software-testing/hw4/[AI-02] - FIT@HCMUS - AI Audit Report_VN.md
```

Tuân theo các quy tắc mẫu:

- dán prompt gốc nguyên văn;
- dán output AI nguyên văn hoặc tóm tắt đường dẫn artifact đã tạo nếu đã đính kèm file đầy đủ;
- gắn nhãn phán quyết là `HỢP LỆ`, `KHÔNG HỢP LỆ`, hoặc `CHƯA HOÀN THIỆN`;
- giải thích lý do sử dụng yêu cầu HW04, ISTQB, hoặc slide môn học;
- ghi rõ sinh viên đã xem xét hoặc thay đổi những gì.
