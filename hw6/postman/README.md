# HW06 — Postman collection · hướng dẫn dùng

MSSV 23127344 — Trương Thành Đạt — 23KTPM3

## Nội dung thư mục

| File | Nội dung |
| --- | --- |
| `EShop_HW06_API.postman_collection.json` | Collection: 9 folder, 202 request, 664 `pm.test`, 12 saved example |
| `EShop_HW06.postman_environment.json` | Environment `EShop_HW06_local` — 24 biến |
| `EShop_HW06.postman_globals.json` | Globals — 4 biến không đổi theo môi trường triển khai |
| `data/api1_phone.csv` | Data file cho API 1 — 6 biến thể `phone` (FR-04) |
| `data/api2_state.csv` | Data file cho API 2 — 6 ô của ma trận chuyển trạng thái (FR-10) |
| `data/api3_coupon.csv` | Data file cho API 3 — 6 biến thể `max_uses_per_user` (FR-17) |
| `src/` | **Bộ sinh** collection. Sửa ở đây rồi `node src/build.js`, đừng sửa file `.json` |

> File `.json` là **kết quả sinh**. Sửa tay vào nó sẽ bị mất ở lần `build.js` kế tiếp.

## Chạy bằng Newman (không cần mở app)

```bash
cd group05_eshop/backend && node database.js && node server.js   # dựng SUT
bash hw6/scripts/run_newman.sh all       # 7 lần chạy, sinh toàn bộ báo cáo
bash hw6/scripts/run_newman.sh api2      # chỉ một API
bash hw6/scripts/run_newman.sh spec      # lần chạy đỏ (đúng mong đợi)
bash hw6/scripts/run_newman.sh smoke     # kiểm nhanh với --bail
```

## Ba tính năng chỉ làm được trong app Postman

Đề §6 nêu tên **workspace**, **mock server**, **monitor**. Cả ba đều là tính năng của
app/cloud Postman, không tạo được từ dòng lệnh, nên phần dưới ghi lại đúng các bước
tôi đã thực hiện trong app (và chỗ nào là giới hạn kỹ thuật thật).

### 1. Workspace

1. Postman → **Workspaces** → *Create Workspace* → tên **`HW06 — EShop API Testing (23127344)`**, visibility *Personal*.
2. Trong workspace đó: **Import** → chọn 3 file `.json` ở thư mục này (collection + environment + globals).
3. Import tiếp 3 file CSV ở `data/` khi cần chạy Collection Runner theo dữ liệu.
4. Chọn environment `EShop_HW06_local` ở góc trên phải trước khi chạy.

Ảnh cần chụp: cây workspace thấy 9 folder và tên workspace.

### 2. Mock server

Mock server của Postman trả lời dựa trên **saved example** lưu trong collection.
Collection này đã có **12 example được ghi lại từ response THẬT** của SUT
(`src/examples.js` đọc `hw6/reports/*.json` do Newman sinh), nên mock trả về đúng
nguyên văn byte mà SUT đã trả — không phải thứ tôi tưởng là đúng.

Danh sách request có example: `SETUP-01`, `TC-API1-001`, `TC-API1-023`, `TC-API1-035`,
`TC-API1-036`, `A1-E01`, `TC-API2-001`, `TC-API2-002`, `TC-API2-019`, `TC-API3-001`,
`TC-API3-004`, `TC-API3-037` — gồm happy path và một đại diện cho mỗi lớp lỗi
(`400` HTML, `401`, `403`, `404`, `500`).

Các bước tạo mock:

1. Chuột phải collection → **Mock collection**.
2. Tên mock: `HW06 EShop mock (23127344)`; chọn environment `EShop_HW06_local`; **không** tick *private*.
3. Postman trả về URL dạng `https://<id>.mock.pstmn.io` và tự tạo biến `mockUrl`.
4. Đổi `baseUrl` sang URL đó rồi gửi lại `TC-API1-001` — response lấy từ example, không gọi SUT.

Kiểm chứng bằng Newman (thay `<id>`):

```bash
newman run hw6/postman/EShop_HW06_API.postman_collection.json \
  -e hw6/postman/EShop_HW06.postman_environment.json \
  --env-var "baseUrl=https://<id>.mock.pstmn.io" \
  --folder "API1 - PUT /api/users/me (Pool A / FR-04)" \
  -r cli
```

**Giới hạn thật cần nói rõ:** mock chỉ trả lại example, nên các assertion đọc lại DB
(`GET /api/users/me` sau khi ghi) sẽ fail trên mock. Mock ở đây có ích cho việc
**client phát triển song song khi backend chưa chạy**, không dùng để kiểm thử SUT.

Ảnh cần chụp: trang cấu hình mock + một request trả về từ `*.mock.pstmn.io`.

### 3. Monitor

**Monitor của Postman chạy trên cloud nên không gọi được `http://localhost:3000`** —
đây là giới hạn kỹ thuật, không phải lựa chọn. Hai cách hợp lệ:

- **Cách đã dùng:** GitHub Actions chạy theo lịch (`schedule: cron`) — xem §8 của báo cáo
  chính. Đây là "monitor" đúng nghĩa: chạy định kỳ, tự khởi động SUT, gửi kết quả.
- **Cách chỉ để minh hoạ tính năng:** tạo monitor trỏ vào **mock server** ở mục 2
  (URL công khai nên cloud gọi được). Chạy được nhưng chỉ kiểm tra mock, không kiểm
  tra SUT — nếu chụp ảnh minh hoạ thì phải ghi rõ điều đó.

Ảnh cần chụp: trang Monitor với lịch chạy + một lần chạy đã hoàn tất.

## Tính năng đã dùng được từ dòng lệnh

Danh sách đầy đủ 30 mục nằm ở §7 báo cáo chính. Các mục kiểm chứng được ngay:

```bash
node hw6/postman/src/build.js     # in ra: 12 saved example, SDK đọc được 202 request
grep -c "X-Student-Id" hw6/reports/newman_console_full.log
grep -n "pm.visualizer.set" hw6/postman/EShop_HW06_API.postman_collection.json
grep -n '"auth"' hw6/postman/EShop_HW06_API.postman_collection.json   # auth cấp folder DATA3
ls hw6/reports/globals_after_*.json                                  # --export-globals
```
