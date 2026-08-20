// HW06 - Ghi lai response THAT cua SUT cho 12 request duoc gan saved example.
//
// VI SAO KHONG LAY TU BAO CAO JSON CUA NEWMAN NUA:
//   Bao cao JSON cua Newman ghi mot execution cho MOI HTTP call phat sinh trong vong doi
//   cua item, ke ca cac lenh pm.sendRequest trong test script - va truong request/response
//   cua cac execution do deu tro ve lenh sendRequest CUOI CUNG, khong phai request chinh.
//   Kiem chung: voi TC-API1-001 (mot PUT co 3 assertion doc lai bang GET), ca 4 execution
//   trong api1.json deu ghi "GET /api/users/me". Hau qua: example cua mot PUT lai mang body
//   cua GET, va Mock Server se tra ve sai.
//
// Script nay goi truc tiep SUT theo dung 12 tinh huong da chon roi ghi ket qua ra
// hw6/postman/examples.recorded.json. Deterministic va dung nguyen van byte SUT tra ve.
//
// Chay: node hw6/scripts/reset_db.js && node hw6/scripts/record_examples.js
const fs = require('fs');
const path = require('path');

const BASE = process.env.SUT_BASE_URL || 'http://localhost:3000';
const SID = '23127344';
const OUT = path.resolve(__dirname, '../postman/examples.recorded.json');

const COUPON = {
  code: 'TESTNEW01', type: 'percent', discount_value: 10,
  min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1,
};
const PROFILE = { name: 'Nguyen Van A', shipping_address: '123 Le Loi', phone: '0912345678' };

async function call(method, p, { auth, body, raw, noCT } = {}) {
  const h = { 'X-Student-Id': SID };
  if (auth) h.Authorization = auth;
  if (!noCT && (body !== undefined || raw !== undefined)) h['Content-Type'] = 'application/json';
  const res = await fetch(BASE + p, {
    method, headers: h,
    body: raw !== undefined ? raw : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let isJson = true;
  try { JSON.parse(text); } catch (e) { isJson = false; }
  return { code: res.status, body: text, isJson };
}

(async () => {
  const login = async (email, password) =>
    JSON.parse((await call('POST', '/api/login', { body: { email, password } })).body);
  const admin = await login('admin@eshop.com', 'Admin123!');
  const user = await login('test@eshop.com', 'Test1234!');
  const tA = 'Bearer ' + admin.token;
  const tU = 'Bearer ' + user.token;

  const rec = {};
  const put = (id, r, note) => {
    rec[id] = { code: r.code, body: r.body, isJson: r.isJson, note };
    console.log('  %s -> %d %s', id.padEnd(14), r.code, r.isJson ? '(JSON)' : '(HTML)');
  };

  console.log('Ghi example tu SUT tai ' + BASE + ':');

  // ---- SETUP-01: dang nhap admin (mock can de client lay token) ----
  put('SETUP-01', await call('POST', '/api/login', { body: { email: 'admin@eshop.com', password: 'Admin123!' } }),
    'response dang nhap admin');

  // ---- API 1 ----
  put('TC-API1-001', await call('PUT', '/api/users/me', { auth: tU, body: PROFILE }),
    'cap nhat ho so hop le');
  put('TC-API1-023', await call('PUT', '/api/users/me', { body: PROFILE }),
    'khong gui token -> 401');
  put('TC-API1-035', await call('PUT', '/api/users/me', { auth: 'Bearer not-a-valid-jwt', body: PROFILE }),
    'JWT sai cu phap -> 403');
  put('TC-API1-036', await call('GET', '/api/users/me', { auth: tU }),
    'GET ho so - 10 truong cua bang users');
  put('A1-E01', await call('PUT', '/api/users/me', { auth: tU, raw: '{"name":"A",' }),
    'JSON sai cu phap -> 400 dang HTML');

  // ---- API 2: can dung trang thai truoc ----
  const mkOrder = async (chain) => {
    const co = await call('POST', '/api/checkout', { auth: tU, body: { total_amount: 500000, shipping_address: 'record_examples' } });
    const oid = JSON.parse(co.body).orderId;
    for (const st of chain) {
      await call('PUT', '/api/admin/orders/' + oid + '/status', { auth: tA, body: { status: st } });
    }
    return oid;
  };
  put('TC-API2-001', await call('PUT', '/api/orders/' + (await mkOrder([])) + '/cancel', { auth: tU }),
    'huy don pending -> 200');
  put('TC-API2-002', await call('PUT', '/api/orders/999999/cancel', { auth: tU }),
    'don khong ton tai -> 404');
  put('TC-API2-019', await call('PUT', '/api/orders/' + (await mkOrder(['confirmed', 'shipping', 'delivered'])) + '/cancel', { auth: tU }),
    'huy don delivered -> 400');

  // ---- API 3 ----
  const created = await call('POST', '/api/admin/coupons', { auth: tA, body: COUPON });
  put('TC-API3-001', created, 'tao coupon hop le -> 200 kem id');
  put('TC-API3-004', await call('POST', '/api/admin/coupons', { auth: tA, body: Object.assign({}, COUPON, { code: 'SAVE10' }) }),
    'trung code -> 500 kem thong bao SQLite');
  put('TC-API3-037', await call('DELETE', '/api/admin/coupons/' + JSON.parse(created.body).id, { auth: tA }),
    'xoa coupon -> 200');

  // Che gia tri JWT: token trong response dang nhap la token that, ky bang secret hardcode
  // o server.js:9. De nguyen thi secret scanner cua Postman bao dong moi lan import.
  // Xem §7.6 cua bao cao - chinh la he qua cua BUG-03.
  const JWT = /eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}/g;
  let masked = 0;
  for (const k of Object.keys(rec)) {
    if (JWT.test(rec[k].body)) { masked += 1; }
    rec[k].body = rec[k].body.replace(JWT, '<JWT-da-che-xem-BUG-03>');
  }

  fs.writeFileSync(OUT, JSON.stringify(rec, null, 2), 'utf8');
  console.log('\nDa ghi %d example vao %s (che JWT o %d example)', Object.keys(rec).length, OUT, masked);
  console.log('Nho chay lai: node hw6/postman/src/build.js');
})();
