# Mini Exercise — API Testing — Gói nộp bài

- **MSSV:** 23127344
- **Họ tên:** TRƯƠNG THÀNH ĐẠT
- **Lớp/Khóa:** Kiểm thử phần mềm — 23KTPM3
- **API đã chọn:** **#9 — `POST /api/login`**
- **Tên file nộp:** `23127344_Mini_API_Testing.zip`

## Thành phần bài nộp

| # | Tệp | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| 1 | `test-design.md` | ✅ Hoàn tất | Prompt, AI output (14 TC), bảng audit, 3 TC extend, bảng Postman features, 4 defect. |
| 2 | `mini-login.data.json` | ✅ Hoàn tất | 5 test case data-driven (2 positive + 3 negative). |
| 3 | `mini-login.postman_collection.json` | ✅ Hoàn tất | Pre-request script + 10 assertion/iteration. |
| 4 | `mini-local.postman_environment.json` | ✅ Hoàn tất | `baseUrl`, `studentId=23127344`, `authToken`. |
| 5 | `mini-newman-report.json` | ✅ Hoàn tất | Kết quả chạy **thật**: 5 iteration, 50/50 assertion pass. |
| 6 | `newman-api-test.yml` | ✅ Hoàn tất | Workflow CI, đã validate cú pháp YAML. |
| 7 | `ci-pass.png` | ⏳ **Cần tự chụp** | Xem hướng dẫn bên dưới. |
| 8 | `ci-fail.png` | ⏳ **Cần tự chụp** | Xem hướng dẫn bên dưới. |

## Kết quả chạy Newman (đã kiểm chứng cục bộ)

| Hạng mục | executed | failed |
| --- | --- | --- |
| iterations | 5 | 0 |
| requests | 5 | 0 |
| assertions | **50** | **0** |

Exit code `0` · 509 ms · response trung bình 14 ms · `X-Student-Id: 23127344` trên cả 5/5 request.

## Cách chạy lại cục bộ

```bash
# Terminal 1 — khởi động provider (backend không có script "dev")
cd hw3/docs/eshop-sut/backend
npm install
node server.js

# Terminal 2 — kiểm tra provider rồi chạy Newman
curl http://localhost:3000/api/products/1        # mong đợi 200, iPhone 15 Pro Max
npm install --global newman

cd hw6/submission
newman run mini-login.postman_collection.json \
  --environment mini-local.postman_environment.json \
  --iteration-data mini-login.data.json \
  --reporters cli,json \
  --reporter-json-export mini-newman-report.json
```

Bộ test **chạy lặp được nhiều lần vẫn xanh** (đã xác minh 2 lần chạy liên tiếp): TC-03 dùng `admin@eshop.com` và xếp sau TC-02 nên lần login đúng đã reset `login_attempts` về 0.

> ⚠️ **Lưu ý về trạng thái DB.** Nếu tự thử nghiệm việc sai mật khẩu nhiều lần, tài khoản sẽ bị khóa 180 giây (BUG-01 — khóa ngay sau **2** lần sai). Reset nhanh:
>
> ```bash
> cd hw3/docs/eshop-sut/backend
> node -e "const s=require('sqlite3').verbose();new s.Database('database.sqlite').run('UPDATE users SET login_attempts=0, locked_until=NULL')"
> ```

---

## Việc còn lại phải tự làm: hai ảnh CI

Hai ảnh này là **bằng chứng chạy trên GitHub Actions**, không thể tạo cục bộ.

### Chuẩn bị

```bash
# Trong repository nhóm đã fork từ eshop-sut
git checkout -b feature/23127344

mkdir -p .github/workflows tests/mini-api
cp newman-api-test.yml .github/workflows/newman-api-test.yml
cp mini-login.postman_collection.json mini-local.postman_environment.json \
   mini-login.data.json test-design.md tests/mini-api/
```

Workflow mặc định tìm các tệp ở `tests/mini-api`. Nếu đặt chỗ khác, sửa biến `TESTS_DIR` ở đầu `newman-api-test.yml`.

Vào tab **Actions** của repository và bấm **"I understand my workflows, go ahead and enable them"** (nếu chưa bật).

### C1 — Commit pass → `ci-pass.png`

```bash
git add .github/workflows/newman-api-test.yml tests/mini-api
git commit -m "test(api): add data-driven Newman tests for POST /api/login (23127344)"
git push -u origin feature/23127344
```

Mở **Actions** → chọn nhánh `feature/23127344` → chờ workflow **Newman API tests** xong → chụp màn hình khi tất cả xanh ✅ → lưu **`ci-pass.png`**.

> Nên chụp thấy rõ: tên workflow, nhánh, dấu ✅, và bảng summary `Assertions: 50 (failed: 0)`.

### C2 — Commit fail có chủ đích → `ci-fail.png`

Sửa `tests/mini-api/mini-login.data.json`, đổi `expected_status` của **TC-01** từ `200` thành `999`:

```bash
git commit -am "test(api): intentionally break TC-01 expected_status to demo a red build"
git push
```

Chờ pipeline chạy lại → chụp màn hình khi có test đỏ ❌ → lưu **`ci-fail.png`**.

Lỗi sẽ hiện đúng dạng (đã kiểm chứng cục bộ):

```
1. AssertionError  [MINI] TC-01 — status is 999
   iteration: 1    expected response to have status code 999 but got 200
```

### C3 — Khôi phục (bắt buộc)

```bash
# đổi 999 trở lại 200
git commit -am "test(api): restore the correct expected_status for TC-01"
git push
```

Chờ pipeline **xanh lại** — bài chỉ hoàn thành khi commit cuối cùng pass.

### Đóng gói

Đặt hai ảnh vào thư mục này rồi nén 8 tệp thành `23127344_Mini_API_Testing.zip`.

---

## Đối chiếu checkpoint đề bài

| Yêu cầu | Trạng thái |
| --- | --- |
| Bước 1 — AI sinh **≥ 12** test case | ✅ **14** test case, phủ đủ 4 nhóm, prompt chia bước với 5 cột bắt buộc |
| Bước 2 — Audit gắn nhãn mọi TC + sửa ≥ 1 case | ✅ 14/14 có nhãn (7 VALID · 4 INVALID · 3 INCOMPLETE), **sửa 7 case** |
| Bước 3 — Bổ sung **≥ 2** test case tự viết | ✅ **3** case (EXT-01/02/03) kèm lý do AI bỏ sót |
| Bước 4 — Đúng 5 iteration, không assertion fail, có report | ✅ 5 iteration · 50/50 pass · report 95 KB |
| Bước 4 — Request mang `X-Student-Id` đúng MSSV | ✅ 5/5 request có `X-Student-Id: 23127344` |
| Bước 5 — Workflow CI + 2 ảnh pass/fail | ⚠️ Workflow ✅ (đã validate + kiểm chứng exit code 0/1); **2 ảnh cần tự chụp** |
| Bước 6 — **≥ 6** Postman feature | ✅ **8/10** feature |
