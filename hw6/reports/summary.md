# Ket qua thuc thi Newman (so lieu trich tu bao cao JSON)

| Lan chay | Iter | Request | Assertion | Assertion FAIL | Test case | TC pass | TC fail | Thoi gian |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| API 1 - PUT /api/users/me (FR-04) | 1 | 102 | 178 | 0 | 46 | 46 | 0 | 4.4s |
| API 2 - PUT /api/orders/:id/cancel (FR-10) | 1 | 138 | 193 | 0 | 46 | 46 | 0 | 5.9s |
| API 3 - POST /api/admin/coupons (FR-17) | 1 | 249 | 472 | 0 | 85 | 85 | 0 | 10.7s |
| Data-driven CSV - phone (FR-04) | 6 | 12 | 24 | 0 | 1 | 1 | 0 | 0.6s |
| Data-driven CSV - coupon (FR-17) | 6 | 12 | 18 | 0 | 1 | 1 | 0 | 0.5s |
| SPEC - assertion theo dac ta (co y dinh fail) | 1 | 46 | 57 | 22 | 16 | 0 | 16 | 2.2s |
| **TONG** | | **559** | **942** | **22** | **195** | **179** | **16** | |

## Cac test case co assertion FAIL

| Lan chay | ID | Ten test case | Assertion fail / tong |
| --- | --- | --- | :-: |
| spec | SPEC-BUG-01 | SPEC-BUG-01 - [SEC-06] Client KHONG duoc phep tu doi role qua PUT /api/users/me | 1/3 |
| spec | SPEC-BUG-02 | SPEC-BUG-02 - [SEC-01] GET /api/users/me KHONG duoc tra ve mat khau | 1/3 |
| spec | SPEC-BUG-03 | SPEC-BUG-03 - [SEC-02] Token tu ky bang secret hardcode KHONG duoc chap nhan | 1/3 |
| spec | SPEC-BUG-04 | SPEC-BUG-04 - [FR-04] phone phai la 10-11 chu so va bat dau bang 0 | 1/2 |
| spec | SPEC-BUG-05 | SPEC-BUG-05 - [SEC-03] GET /api/admin/users phai kiem role="admin" trong token | 1/2 |
| spec | SPEC-BUG-06 | SPEC-BUG-06 - [FR-10] User KHONG duoc huy don dang shipping | 2/3 |
| spec | SPEC-BUG-07 | SPEC-BUG-07 - [FR-10] canceled la trang thai KET THUC, khong the chuyen sang delivered | 2/3 |
| spec | SPEC-BUG-08 | SPEC-BUG-08 - [SEC-02] GET /api/orders/:id phai yeu cau xac thuc | 1/2 |
| spec | SPEC-BUG-09 | SPEC-BUG-09 - [FR-10] Thong bao loi phai cho biet ly do khong huy duoc | 1/3 |
| spec | SPEC-BUG-10 | SPEC-BUG-10 - [SEC-03] User thuong KHONG duoc tao coupon | 1/2 |
| spec | SPEC-BUG-11 | SPEC-BUG-11 - [SEC-03] User thuong KHONG duoc xoa coupon he thong | 2/3 |
| spec | SPEC-BUG-12 | SPEC-BUG-12 - [FR-17] discount_value phai > 0 | 1/2 |
| spec | SPEC-BUG-13 | SPEC-BUG-13 - [FR-17] max_uses_per_user phai >= 1 | 2/3 |
| spec | SPEC-BUG-14 | SPEC-BUG-14 - [FR-17] code phai la duy nhat - null khong duoc pha vo rang buoc | 1/2 |
| spec | SPEC-BUG-15 | SPEC-BUG-15 - [Xu ly loi] Trung code phai tra 409, khong duoc tra 500 kem text driver | 2/3 |
| spec | SPEC-BUG-16 | SPEC-BUG-16 - [Xu ly loi] Thieu body phai tra 400 JSON, khong duoc 500 HTML | 2/3 |
