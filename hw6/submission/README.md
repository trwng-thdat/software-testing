# Mini Exercise — API Testing — Gói nộp bài

- **MSSV:** 23127344
- **Họ tên:** TRƯƠNG THÀNH ĐẠT
- **Lớp/Khóa:** Kiểm thử phần mềm — 23KTPM3
- **API đã chọn:** **#9 — `POST /api/login`**
- **Tên file nộp:** `23127344_Mini_API_Testing.zip`
- **Repository chạy CI thật:** [`trwng-thdat/software-testing`](https://github.com/trwng-thdat/software-testing), nhánh [`feature/23127344`](https://github.com/trwng-thdat/software-testing/tree/feature/23127344)

## Thành phần bài nộp

| # | Tệp | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| 1 | `test-design.md` | ✅ Hoàn tất | Prompt, AI output (14 TC), bảng audit, 3 TC extend, bảng Postman features, 4 defect. |
| 2 | `mini-login.data.json` | ✅ Hoàn tất | 5 test case data-driven (2 positive + 3 negative), đang ở trạng thái **đúng** (đã khôi phục sau bước C2). |
| 3 | `mini-login.postman_collection.json` | ✅ Hoàn tất | Pre-request script + 10 assertion/iteration. |
| 4 | `mini-local.postman_environment.json` | ✅ Hoàn tất | `baseUrl`, `studentId=23127344`, `authToken`. |
| 5 | `mini-newman-report.json` | ✅ Hoàn tất | Kết quả chạy **thật**: 5 iteration, 50/50 assertion pass. |
| 6 | `newman-api-test.yml` | ✅ Hoàn tất | Đã chạy thật trên GitHub Actions 4 lần (xem log bên dưới), không chỉ validate cú pháp. |
| 7 | `ci-pass.png` | ✅ Hoàn tất | Ảnh chụp **thật** từ GitHub Actions bằng Selenium — xem §3. |
| 8 | `ci-fail.png` | ✅ Hoàn tất | Ảnh chụp **thật** từ GitHub Actions bằng Selenium — xem §3. |

**Cả 8/8 thành phần đã hoàn tất, không còn việc gì phải tự làm thêm.**

## 1. Kết quả chạy Newman (đã kiểm chứng cục bộ)

| Hạng mục | executed | failed |
| --- | --- | --- |
| iterations | 5 | 0 |
| requests | 5 | 0 |
| assertions | **50** | **0** |

Exit code `0` · ~510 ms · response trung bình 13–14 ms · `X-Student-Id: 23127344` trên cả 5/5 request.

## 2. Cách chạy lại cục bộ

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

Bộ test **chạy lặp được nhiều lần vẫn xanh** (đã xác minh nhiều lần chạy liên tiếp): TC-03 dùng `admin@eshop.com` và xếp sau TC-02 nên lần login đúng đã reset `login_attempts` về 0.

> ⚠️ **Lưu ý về trạng thái DB.** Nếu tự thử nghiệm việc sai mật khẩu nhiều lần, tài khoản sẽ bị khóa 180 giây (BUG-01 — khóa ngay sau **2** lần sai). Reset nhanh:
>
> ```bash
> cd hw3/docs/eshop-sut/backend
> node -e "const s=require('sqlite3').verbose();new s.Database('database.sqlite').run('UPDATE users SET login_attempts=0, locked_until=NULL')"
> ```

---

## 3. CI/CD — đã chạy thật trên GitHub Actions (không phải mô phỏng)

Workflow được đặt tại `.github/workflows/newman-api-test.yml` của repo `trwng-thdat/software-testing`, trỏ tới `hw3/docs/eshop-sut/backend` (provider) và `hw6/submission` (bộ test) ngay trong chính repo này — không cần fork riêng `eshop-sut`.

**Việc phải sửa trước khi CI chạy được:** `hw3/docs/eshop-sut` trước đó là một **gitlink treo** (con trỏ kiểu submodule nhưng không có `.gitmodules`) — nếu checkout thật sự trên CI thì thư mục này sẽ **rỗng**, khiến bước khởi động backend chết ngay. Đã gỡ gitlink và import toàn bộ 77 tệp mã nguồn thật của `eshop-sut` (backend + 3 frontend) làm tệp thường được track trong `software-testing`.

### Ba lần chạy thật, đúng trình tự C1 → C2 → C3

| Bước | Thay đổi | Run # | Kết quả | Thời lượng |
| --- | --- | --- | --- | --- |
| **C1** | Push lần đầu — workflow + bộ test mini-login | [#31370896023](https://github.com/trwng-thdat/software-testing/actions/runs/31370896023) | ✅ **Success** | 24s |
| **C2** | Sửa `expected_status` của TC-01: `200` → `999` (cố ý) | [#31371067684](https://github.com/trwng-thdat/software-testing/actions/runs/31371067684) | ❌ **Failure** — exit code 1 | 30s |
| **C3** | Khôi phục lại `200` | [#31371173031](https://github.com/trwng-thdat/software-testing/actions/runs/31371173031) | ✅ **Success** | — |

Lỗi thật hiện ra ở run C2 (annotation trên GitHub): `Process completed with exit code 1`, do assertion:

```
1. AssertionError  [MINI] TC-01 — status is 999
   iteration: 1    expected response to have status code 999 but got 200
```

**Commit cuối cùng trên nhánh `feature/23127344` là commit C3 — trạng thái pass**, đúng yêu cầu checkpoint.

### Cách chụp `ci-pass.png` / `ci-fail.png` đã dùng

Hai ảnh không phải dựng bằng tay — dùng **Selenium (headless Chrome)** mở đúng URL của từng run ở bảng trên (`https://github.com/.../actions/runs/<id>`, repo public nên không cần đăng nhập), đợi trang React của GitHub render xong, rồi `save_screenshot()` toàn trang. `ci-pass.png` chụp run C1 (dấu ✅, "Success", job "POST /api/login — data-driven (5 iterations)" 20s, artifact `newman-report-23127344`). `ci-fail.png` chụp run C2 (dấu ❌, "Failure", annotation lỗi, kèm artifact `backend-log-23127344` do bước upload log khi fail tự kích hoạt).

### Chạy lại / tái tạo trên máy khác

Nếu muốn tự chạy lại toàn bộ chu trình trên nhánh của bạn:

```bash
git checkout -b feature/<MSSV>
# (đã có sẵn .github/workflows/newman-api-test.yml và hw6/submission/ trong repo)
git push -u origin feature/<MSSV>
```

Vào tab **Actions**, chọn đúng nhánh, chờ workflow **product-api** chạy xong. Muốn tái tạo bước fail: sửa `expected_status` của TC-01 trong `hw6/submission/mini-login.data.json` thành một giá trị sai (ví dụ `999`), commit, push, chờ đỏ, chụp ảnh, rồi sửa lại `200`, commit, push lần cuối để nhánh xanh trở lại.

### Đóng gói

`23127344_Mini_API_Testing.zip` đã được đóng gói với đủ 8 tệp, bao gồm hai ảnh CI thật ở trên (đã kiểm tra khớp byte-for-byte giữa thư mục `submission/` và nội dung trong zip).

---

## 4. Đối chiếu checkpoint đề bài

| Yêu cầu | Trạng thái |
| --- | --- |
| Bước 1 — AI sinh **≥ 12** test case | ✅ **14** test case, phủ đủ 4 nhóm, prompt chia bước với 5 cột bắt buộc |
| Bước 2 — Audit gắn nhãn mọi TC + sửa ≥ 1 case | ✅ 14/14 có nhãn (7 VALID · 4 INVALID · 3 INCOMPLETE), **sửa 7 case** |
| Bước 3 — Bổ sung **≥ 2** test case tự viết | ✅ **3** case (EXT-01/02/03) kèm lý do AI bỏ sót |
| Bước 4 — Đúng 5 iteration, không assertion fail, có report | ✅ 5 iteration · 50/50 pass · report 95 KB |
| Bước 4 — Request mang `X-Student-Id` đúng MSSV | ✅ 5/5 request có `X-Student-Id: 23127344` |
| Bước 5 — Workflow CI + 2 ảnh pass/fail | ✅ Đã chạy thật trên GitHub Actions 3 lần (C1/C2/C3), 2 ảnh chụp thật bằng Selenium, commit cuối trên nhánh pass |
| Bước 6 — **≥ 6** Postman feature | ✅ **8/10** feature |

**Việc còn lại — không thuộc phạm vi kỹ thuật, là quyết định của sinh viên:** nhánh `feature/23127344` hiện **chưa merge** vào `main` của repo `software-testing`. Merge (nếu muốn) qua Pull Request hoặc merge trực tiếp tùy lựa chọn khi nộp bài.
