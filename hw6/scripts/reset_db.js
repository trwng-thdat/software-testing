// HW06 - reset DB cua SUT ve trang thai seed roi CHO XAC NHAN qua API truoc khi thoat.
// Ly do can script nay: `node database.js` ghi bat dong bo, neu chay newman ngay sau do
// thi suite co the doc du lieu cu (da gap that: user A con role='admin' tu lan chay truoc).
// Chay: node hw6/scripts/reset_db.js
const { execFileSync } = require('child_process');
const path = require('path');

// QUAN TRONG: SUT dang chay tren may nay duoc khoi dong tu BAN NGOAI REPO
//   c:/HCMUS/Software Testing/group05_eshop/backend
// (kiem tra bang Get-CimInstance Win32_Process: PID cua `node .\server.js`).
// Reset vao ban trong repo se KHONG co tac dung - da gap that: newman doc du lieu cu.
// Uu tien bien moi truong SUT_BACKEND_DIR, sau do ban ngoai repo, cuoi cung ban trong repo.
const CANDIDATES = [
  process.env.SUT_BACKEND_DIR,
  path.resolve(__dirname, '../../../group05_eshop/backend'),
  path.resolve(__dirname, '../../group05_eshop/backend'),
].filter(Boolean);
const BACKEND = CANDIDATES.filter((d) => require('fs').existsSync(path.join(d, 'database.js')))[0];
if (!BACKEND) { console.error('[reset_db] khong tim thay backend cua SUT trong: ' + CANDIDATES.join(', ')); process.exit(1); }
const BASE = process.env.SUT_BASE_URL || 'http://localhost:3000';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log('[reset_db] reset DB tai: ' + BACKEND);
  execFileSync(process.execPath, ['database.js'], { cwd: BACKEND, stdio: 'pipe' });

  // Cho toi khi SUT thuc su tra ve du lieu seed (toi da 30 lan x 200ms = 6s)
  for (let i = 1; i <= 30; i++) {
    await sleep(200);
    try {
      const login = await fetch(BASE + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Student-Id': '23127344' },
        body: JSON.stringify({ email: 'test@eshop.com', password: 'Test1234!' }),
      });
      if (!login.ok) continue;
      const { token, user } = await login.json();
      if (user.role !== 'user') continue;

      const coupons = await (await fetch(BASE + '/api/coupons', {
        headers: { Authorization: 'Bearer ' + token, 'X-Student-Id': '23127344' },
      })).json();
      const orders = await (await fetch(BASE + '/api/orders/my-orders', {
        headers: { Authorization: 'Bearer ' + token, 'X-Student-Id': '23127344' },
      })).json();

      if (coupons.length === 4 && orders.length === 0) {
        console.log(`[reset_db] OK sau ${i} lan kiem tra: user A role=user, 4 coupon seed, 0 don hang.`);
        process.exit(0);
      }
      console.log(`[reset_db] lan ${i}: coupon=${coupons.length} (can 4), don=${orders.length} (can 0) - cho tiep`);
    } catch (e) {
      if (i === 30) throw e;
    }
  }
  console.error('[reset_db] THAT BAI: SUT khong tra ve trang thai seed sau 6s. SUT co dang chay khong?');
  process.exit(1);
})();
