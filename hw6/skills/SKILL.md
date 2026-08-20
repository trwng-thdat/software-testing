---
name: api-test-generator
description: Bộ sinh test API do AI điều khiển cho SUT EShop (HW06 — API Testing). Cho trước đặc tả API (api_specification.md / OpenAPI) và mã nguồn SUT, skill dẫn AI đi qua TỪNG kỹ thuật kiểm thử theo pipeline — phân tích hợp đồng API → phân vùng miền giá trị (EP) → giá trị biên (BVA) → chuyển trạng thái → bảo mật SEC-01…SEC-07 → kiểm tra schema → ma trận phủ → sinh ≥35 test case/API → tự kiểm toán VALID/INVALID/INCOMPLETE → mở rộng ≥5 TC người viết → xuất Postman collection (bắt buộc header X-Student-Id) + lệnh Newman → báo cáo lỗi. Dùng khi cần sinh, kiểm toán hoặc thực thi test case cho một endpoint REST. KHÔNG dùng một prompt chung chung kiểu "sinh hết test case cho API này".
---

# API Test Generator — Bộ sinh test API do AI điều khiển (EShop SUT)

## Mục tiêu

Từ **đặc tả API + mã nguồn SUT**, sinh ra một bộ sản phẩm kiểm thử API **có truy vết**, gồm:

1. Bảng hợp đồng API (contract) tách rõ _đã đặc tả_ vs _suy ra từ mã nguồn_.
2. Bảng phân tích theo từng kỹ thuật: EP, BVA, chuyển trạng thái, bảo mật, schema.
3. Ma trận phủ (Coverage Matrix) với **Coverage ID**.
4. **≥ 35 test case / API**, mỗi TC truy vết về ≥ 1 Coverage ID.
5. Bảng kiểm toán **VALID / INVALID / INCOMPLETE** + bản đã sửa.
6. **≥ 5 test case do người viết bổ sung** kèm lý do AI bỏ sót.
7. **Postman collection (.json)** mang header `X-Student-Id` ở cấp collection + lệnh Newman.
8. Danh sách **nghi vấn bug** kèm bước tái hiện, để đưa lên GitHub Issues.

> **Nguyên tắc cốt tử:** mỗi pha là **một lượt phân tích riêng, một prompt riêng**. Không gộp cả pipeline vào một lần sinh. Nếu người dùng yêu cầu "sinh luôn hết", vẫn chạy tuần tự và in ra sản phẩm trung gian của từng pha.

## Cơ sở lý thuyết

- **ISTQB FL §4.2** — Equivalence Partitioning, Boundary Value Analysis, Decision Table, State Transition Testing.
- **ISTQB FL §4.3** — kiểm thử dựa trên kinh nghiệm (error guessing) → dùng ở PHA 9.
- **API contract testing** — response phải khớp **chính xác** schema đặc tả: không thiếu field, không rò rỉ field như `password_hash`.
- **SEC-01 … SEC-07 của EShop** (nguồn: `README.md` của SUT):

  | ID     | Yêu cầu                                          | Bề mặt kiểm thử qua API                                       |
  | ------ | ------------------------------------------------ | ------------------------------------------------------------- |
  | SEC-01 | Mật khẩu không lưu plaintext                     | response không chứa mật khẩu; `GET` hồ sơ không rò `password` |
  | SEC-02 | API bảo mật phải có JWT hợp lệ                   | thiếu token / token rác / token hết hạn / sai chữ ký          |
  | SEC-03 | API admin phải kiểm `role = 'admin'` trong token | user thường gọi endpoint admin → leo thang quyền              |
  | SEC-04 | Escape dữ liệu người dùng khi hiển thị           | XSS payload lưu được qua API (stored XSS)                     |
  | SEC-05 | Parameterized query                              | SQL injection ở path / query / body                           |
  | SEC-06 | Không cho client đổi `role`                      | mass-assignment / privilege escalation qua update hồ sơ       |
  | SEC-07 | OTP đủ entropy, có hạn, dùng một lần             | OTP tái sử dụng, OTP hết hạn, brute-force                     |

  Ngoài ra luôn kiểm **IDOR** (truy cập tài nguyên của người khác qua `:id`) — không có mã SEC riêng nhưng là lỗi bắt buộc phải thử.

---

## PHA 0 — Kiểm tra tiền đề (BẮT BUỘC làm trước)

Trước khi sinh bất cứ thứ gì, xác nhận đủ 5 đầu vào. Thiếu cái nào thì **hỏi hoặc ghi rõ giả định**, không tự bịa:

| #   | Đầu vào                                                        | Bắt buộc?    | Nếu thiếu                                                                    |
| --- | -------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| 1   | Đặc tả API (`api_specification.md` hoặc OpenAPI `.yaml/.json`) | Có           | Dừng, hỏi người dùng                                                         |
| 2   | Endpoint mục tiêu (method + path + FR + Pool)                  | Có           | Dừng, hỏi người dùng                                                         |
| 3   | Mã nguồn SUT (route handler, tầng truy cập DB)                 | Nên có       | Chạy tiếp nhưng đánh dấu mọi hành vi là "chỉ theo đặc tả, chưa đối chiếu mã" |
| 4   | `base_url` của SUT + tài khoản test (user thường, admin)       | Nên có       | Dùng biến `{{base_url}}`, `{{user_token}}`, `{{admin_token}}` và ghi TODO    |
| 5   | MSSV (cho header `X-Student-Id`)                               | Có, ở PHA 10 | Dùng `{{studentId}}` và cảnh báo phải điền trước khi chạy Newman             |

In ra **Bảng tiền đề** (giá trị thực đã nhận / còn thiếu) rồi mới đi tiếp. Nêu rõ endpoint phụ trợ dùng cho _verify_ / _teardown_ (ví dụ `GET /api/users/me`, `DELETE /api/admin/coupons/:id`) và khẳng định chúng **không** tính là API mục tiêu.

---

## PHA 1 — PARSE: Bảng hợp đồng API

Với endpoint mục tiêu, lập bảng:

| Hạng mục                      | Nội dung                                        | Nguồn                       |
| ----------------------------- | ----------------------------------------------- | --------------------------- |
| Method + Path                 | `PUT /api/users/me`                             | `api_specification.md §2.2` |
| Auth                          | Bearer JWT (role: user)                         | spec                        |
| Header bắt buộc               | `Content-Type`, `Authorization`, `X-Student-Id` | spec + đề bài               |
| Tham số (path / query / body) | tên, kiểu, bắt buộc?, ràng buộc                 | spec / suy ra từ code       |
| Status code có thể trả        | 200 / 400 / 401 / 403 / 404 / 409 / 500         | spec / code                 |
| Schema response 2xx           | danh sách field + kiểu                          | spec / code                 |
| Schema response lỗi           | hình dạng `{ message: string }`…                | spec / code                 |
| Thuộc máy trạng thái?         | có / không, trường `status` nào                 | spec / code                 |

**Cột `Nguồn` là bắt buộc.** Mỗi dòng gắn nhãn `[SPEC]` (có trong đặc tả), `[CODE]` (chỉ suy ra từ mã nguồn) hoặc `[GIẢ ĐỊNH]`. Ghi lại **mọi sai lệch spec-vs-code** phát hiện được — đây là mỏ bug cho PHA 11.

---

## PHA 2 — EP: Phân vùng miền giá trị (một lượt riêng)

Cho **từng tham số** trong bảng hợp đồng:

| Tham số | Miền giá trị | Lớp hợp lệ (VC)        | Lớp không hợp lệ (IC)                                                              | Nguồn ràng buộc     |
| ------- | ------------ | ---------------------- | ---------------------------------------------------------------------------------- | ------------------- |
| `email` | string       | `VC1` định dạng hợp lệ | `IC1` thiếu `@`, `IC2` thiếu domain, `IC3` rỗng, `IC4` sai kiểu, `IC5` thiếu field | `[SPEC]` / `[CODE]` |

Quy tắc:

- Mỗi lớp có mã `VC<n>` / `IC<n>` — TC ở PHA 7 phải trích dẫn lại mã này.
- Với **mọi** field phải có 4 lớp không hợp lệ mặc định: **thiếu field**, **null**, **sai kiểu dữ liệu**, **rỗng / chỉ khoảng trắng**.
- Ràng buộc chỉ tồn tại trong code mà spec không nói → đánh dấu `[CODE]` và ghi vào danh sách nghi vấn "spec thiếu".
- Spec ràng buộc nhưng code **không** validate → nghi vấn bug (ghi ngay, đừng đợi PHA 11).

---

## PHA 3 — BVA: Giá trị biên (một lượt riêng)

Chỉ áp dụng cho tham số **có thứ tự** (số, độ dài chuỗi, ngày, số lượng, giá):

| Tham số          | Biên dưới | Biên trên  | 2-value / 3-value | Giá trị test           |
| ---------------- | --------- | ---------- | ----------------- | ---------------------- |
| `discount_value` | 0 (mở)    | 100 (đóng) | 3-value           | −1, 0, 1, 99, 100, 101 |
| `phone` (độ dài) | 10        | 11         | 3-value           | 9, 10, 11, 12 ký tự    |

Quy tắc: nêu rõ biên **đóng/mở**; dùng 3-value (min−1, min, min+1, max−1, max, max+1) cho ràng buộc ở điểm rủi ro (giá, tiền, quyền, số lượng), 2-value cho phần còn lại. Ghi mã `BV<n>`.

---

## PHA 4 — Chuyển trạng thái (chỉ khi endpoint thuộc máy trạng thái)

Nếu PHA 1 xác định endpoint đổi một trường `status` (ví dụ `PUT /api/orders/:id/cancel` — FR-10):

1. Liệt kê **states** (mã `S<n>`), đánh dấu initial / final.
2. Liệt kê **event / guard / action**.
3. Lập **bảng chuyển trạng thái**: hàng = state nguồn, cột = event; ô = state đích hoặc `—` (invalid).
4. Vẽ **sơ đồ Mermaid `stateDiagram-v2`** khớp 1-1 với bảng.
5. Phủ tối thiểu: **0-switch** (mọi transition hợp lệ) + **mọi transition invalid** + **1-switch** cho các cặp nghiệp vụ quan trọng.

> **Không bịa trạng thái.** Chỉ lấy state từ spec/code. Code có state mà spec không có (hoặc ngược lại) → nghi vấn bug.

Nếu endpoint **không** thuộc máy trạng thái: ghi một dòng "Không áp dụng — lý do …" rồi bỏ qua pha này (không được im lặng bỏ).

---

## PHA 5 — Bảo mật (SEC-01 … SEC-07 + IDOR)

Lập **ma trận bảo mật cho đúng endpoint này**: mỗi SEC-0x → _áp dụng / không áp dụng_ + kịch bản cụ thể + kết quả mong đợi.

| SEC    | Áp dụng?            | Kịch bản test                                            | Kết quả mong đợi                             |
| ------ | ------------------- | -------------------------------------------------------- | -------------------------------------------- |
| SEC-02 | Có                  | Gọi không có `Authorization`                             | `401`, body không rò thông tin               |
| SEC-02 | Có                  | Token sửa payload (`role: admin`) → chữ ký sai           | `401`, **không** được chấp nhận              |
| SEC-03 | Có (endpoint admin) | Token user thường                                        | `403`                                        |
| SEC-05 | Có                  | `' OR 1=1 --` hoặc `1; DROP TABLE …` vào path/query/body | `400/404`, dữ liệu nguyên vẹn                |
| SEC-06 | Có (update hồ sơ)   | Body kèm `role: "admin"`                                 | `role` **không** đổi (verify bằng read-back) |
| IDOR   | Có (có `:id`)       | User A tác động tài nguyên của user B                    | `403/404`, tài nguyên của B không đổi        |

Quy tắc bắt buộc:

- Test bảo mật phải có bước **verify hậu điều kiện** (read-back), không được chỉ tin vào status code trả về.
- SEC nào _không_ áp dụng cũng phải ghi kèm lý do.

---

## PHA 6 — Kiểm tra schema response

Với mỗi status code khả dĩ, lập bảng schema mong đợi:

| Status | Field bắt buộc             | Kiểu                   | Field KHÔNG được xuất hiện         |
| ------ | -------------------------- | ---------------------- | ---------------------------------- |
| 200    | `id`, `email`, `full_name` | number, string, string | `password`, `password_hash`, `otp` |
| 400    | `message`                  | string                 | stack trace, thông điệp lỗi SQL    |

Sinh TC schema cho: (a) đủ field bắt buộc, (b) đúng kiểu, (c) **không có field lạ / rò rỉ**, (d) `Content-Type: application/json`, (e) body lỗi không chứa stack trace hay thông điệp SQL.

---

## PHA 7 — Ma trận phủ & sinh test case

### 7.1 Ma trận phủ (Coverage Matrix)

Gom mọi mã từ PHA 2–6 thành **Coverage ID** và ước lượng số TC:

| Coverage ID   | Nguồn       | Mô tả                               | Số TC dự kiến |
| ------------- | ----------- | ----------------------------------- | ------------- |
| `COV-EP-01`   | PHA 2 `VC1` | `email` định dạng hợp lệ            | 1             |
| `COV-BVA-03`  | PHA 3 `BV3` | `discount_value = 0` (biên mở)      | 1             |
| `COV-ST-05`   | PHA 4       | `Delivered --cancel--> —` (invalid) | 1             |
| `COV-SEC-02b` | PHA 5       | token sai chữ ký                    | 1             |
| `COV-SCH-01`  | PHA 6       | schema 200 đủ field                 | 1             |

**Cửa kiểm (gate):** nếu tổng TC dự kiến `< 35` → **quay lại** PHA 2–6 bổ sung lớp / biên / kịch bản. **Không** nhồi TC trùng lặp cho đủ số.

### 7.2 Sinh test case

Mỗi TC một dòng, mã `TC-<FR-ID>-<NNN>` (ví dụ `TC-FR-04-001`):

| ID  | Coverage ID | Kỹ thuật | Tiền điều kiện | Request (method, path, headers, body) | Expected status | Expected body / hậu điều kiện | Ưu tiên |
| --- | ----------- | -------- | -------------- | ------------------------------------- | --------------- | ----------------------------- | ------- |

Quy tắc:

- **Mỗi TC phải trích dẫn ≥ 1 Coverage ID.** TC không truy vết được → bỏ.
- Một TC kiểm **một** ý; không trộn nhiều lớp không hợp lệ vào cùng một request (trừ TC cố ý test tổ hợp — phải ghi rõ).
- Expected result phải **cụ thể**: status code + field cần kiểm + hậu điều kiện dữ liệu. Không viết "trả về lỗi".
- Ghi rõ thứ tự phụ thuộc (setup → test → teardown) nếu TC cần dữ liệu dựng trước.

---

## PHA 8 — SELF-CHECK: tự kiểm toán trước khi giao

Chạy **một lượt riêng** đối chiếu từng TC với đặc tả + mã nguồn, gán nhãn:

| ID   | Nhãn         | Lập luận                                     | Bản đã sửa       |
| ---- | ------------ | -------------------------------------------- | ---------------- |
| TC-… | `VALID`      | khớp spec §2.2 + handler tương ứng           | —                |
| TC-… | `INVALID`    | endpoint không tồn tại / status mong đợi sai | mô tả sửa gì     |
| TC-… | `INCOMPLETE` | thiếu bước verify hậu điều kiện              | mô tả bổ sung gì |

Bộ lọc bắt buộc phải loại hoặc sửa: endpoint bịa, field bịa, status code không có trong PHA 1, TC trùng nhau, TC không có Coverage ID, TC bảo mật thiếu read-back.

In ra thống kê `VALID / INVALID / INCOMPLETE` + số TC cuối cùng.

> Nhãn của AI **không** thay cho rà soát của con người. Kết thúc pha này phải nhắc người dùng đọc lại bảng và ghi phần rà soát trong báo cáo — trách nhiệm cuối cùng thuộc về sinh viên.

---

## PHA 9 — Mở rộng: ≥ 5 test case do người viết

Đề bài yêu cầu **≥ 5 TC mà AI bỏ sót**, nhất là quanh **bảo mật** và **chuyển trạng thái**. Ở pha này skill **gợi mở, không viết thay**: đặt câu hỏi dẫn dắt theo các mồi sau và để người dùng chọn / chỉnh:

- Race condition: hai request hủy đơn / áp coupon **đồng thời**.
- Idempotency: gọi lại đúng request đã thành công một lần nữa.
- Vượt giới hạn nghiệp vụ: dùng coupon quá `max_uses_per_user`.
- Unicode / emoji / RTL / ký tự zero-width trong field text.
- Header sai: `Content-Type: text/plain`, body JSON lỗi cú pháp.
- Token của tài khoản **đã bị khóa / đã xóa**.
- Khoảng trắng đầu-cuối bị trim ngầm làm đổi ngữ nghĩa dữ liệu.
- Payload rất lớn (chuỗi 10.000 ký tự).

Với mỗi TC bổ sung, bảng phải có cột **"Vì sao AI bỏ sót"**, chọn một trong: `chất lượng prompt` / `hạn chế của mô hình` / `đặc điểm API không có trong đặc tả` — kèm một câu giải thích.

---

## PHA 10 — RENDER: Postman collection + Newman

Xuất collection Postman v2.1 với các ràng buộc **bắt buộc**:

1. **Header `X-Student-Id` ở cấp Collection** (pre-request script), có `console.log` để chụp ảnh làm bằng chứng:

   ```javascript
   // Collection → Pre-request Script
   pm.request.headers.upsert({
     key: "X-Student-Id",
     value: pm.environment.get("studentId"),
   });
   console.log("X-Student-Id =", pm.environment.get("studentId"));
   ```

2. **Environment** với biến: `base_url`, `studentId`, `user_email`, `user_token`, `admin_token`, `order_id`, `coupon_code`. Không hardcode giá trị trong request.
3. **Folder theo kỹ thuật**: `_setup`, `01-EP`, `02-BVA`, `03-StateTransition`, `04-Security`, `05-Schema`, `_teardown`.
4. **Test script** cho mỗi request: assert status, assert schema (`pm.response.to.have.jsonSchema`), assert field không được rò rỉ, và **read-back** cho TC ghi dữ liệu.
5. **Data-driven** (Collection Runner + `.csv` / `.json`) cho các nhóm TC chỉ khác giá trị đầu vào — nêu rõ file dữ liệu.
6. Lệnh Newman kèm reporter HTML:

   ```bash
   newman run collection.json -e env.json \
     -r cli,htmlextra --reporter-htmlextra-export reports/newman.html
   ```

7. In ra **danh sách tính năng Postman đã dùng** (workspace, collection, variables, environment, pre-request/test script, Collection Runner + data file, monitor, mock server) để dán vào báo cáo.

---

## PHA 11 — Báo cáo lỗi & Audit log

- Với mỗi nghi vấn bug tích lũy từ PHA 1–10, xuất **bug report**: tiêu đề, mức độ, endpoint, bước tái hiện (curl / Postman), kết quả thực tế vs mong đợi, SEC/FR liên quan, TC phát hiện ra nó, gợi ý nguyên nhân trong mã nguồn.
- Nhắc người dùng: mỗi bug phải mở **GitHub Issue** kèm **ảnh chụp màn hình** (yêu cầu §6.5 và §11 của đề).
- Kết thúc phiên: gọi skill **`gen-audit-log`** để xuất AI Audit Report (prompt + output nguyên văn, không tóm tắt).

---

## Output

Nếu người dùng không chỉ rõ nơi lưu, dùng cấu trúc mặc định:

```
test-design/api-<FR-ID>-<slug>.md        # PHA 1–7.1: hợp đồng, EP, BVA, state, SEC, schema, coverage matrix
testcases/testcase-<FR-ID>-<slug>.md     # PHA 7.2–9: bộ TC + bảng kiểm toán + TC mở rộng
postman/<slug>.postman_collection.json   # PHA 10
postman/<slug>.postman_environment.json
reports/newman-<slug>.html               # sinh khi chạy Newman
bugs/bug-<FR-ID>-<NNN>.md                # PHA 11
```

Cuối mỗi lần chạy, in **bảng tổng kết**: số TC sinh / VALID / INVALID / INCOMPLETE / bổ sung / tổng cuối; số Coverage ID đã phủ; và **những Coverage ID chưa phủ kèm lý do**.

## Nguyên tắc

- **Không một prompt chung chung.** Mỗi pha là một lượt phân tích riêng với sản phẩm trung gian in ra được — đó chính là bằng chứng "dẫn dắt AI theo từng bước" mà §2 của đề yêu cầu.
- **Không bịa.** Endpoint, field, status code, state đều phải dẫn được về `[SPEC]`, `[CODE]` hoặc `[GIẢ ĐỊNH]` được ghi rõ.
- **Không bỏ im lặng.** Kỹ thuật / SEC / Coverage ID nào không áp dụng thì ghi lý do một dòng, không được lược bỏ.
- **Ngưỡng 35 TC là cửa kiểm chất lượng, không phải chỉ tiêu nhồi số.** Thiếu thì mở rộng phân tích, không nhân bản TC.
- **Mọi TC ghi dữ liệu đều phải verify bằng read-back**, đặc biệt TC bảo mật (SEC-06, IDOR).
- **Header `X-Student-Id` là bất biến** — cấu hình ở cấp collection, có log để chụp bằng chứng.
- **Trách nhiệm cuối cùng thuộc về sinh viên.** Nhãn `VALID` của AI chỉ là đề xuất; báo cáo phải ghi rõ người rà soát đã sửa gì.
