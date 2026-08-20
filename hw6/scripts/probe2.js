// HW06 - probe #2: cac nhanh Authorization + chuyen trang thai FR-10 + token gia mao
// Chay: node hw6/scripts/probe2.js   (SUT phai dang chay tai localhost:3000)
const jwt = require('../../group05_eshop/backend/node_modules/jsonwebtoken');
const BASE = 'http://localhost:3000';
const SID = '23127344';
const SECRET = 'super_secret_key_that_should_not_be_here';

// LUU Y: khac probe.js - o day header truyen vao KHONG bi ghi de boi token
async function req(method, path, { authRaw, body, raw, noCT } = {}) {
  const h = { 'X-Student-Id': SID };
  if (authRaw !== undefined) h.Authorization = authRaw;
  if (!noCT && (body !== undefined || raw !== undefined)) h['Content-Type'] = 'application/json';
  const res = await fetch(BASE + path, { method, headers: h, body: raw !== undefined ? raw : body !== undefined ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* HTML */ }
  return { code: res.status, json, text: text.slice(0, 60).replace(/\s+/g, ' ') };
}
const show = (l, r, extra = '') => console.log(String(l).padEnd(40), '->', String(r.code).padEnd(4), (r.json ? JSON.stringify(r.json) : 'HTML').slice(0, 95), extra);

(async () => {
  const login = async (e, p) => (await req('POST', '/api/login', { body: { email: e, password: p } })).json;
  const A = await login('admin@eshop.com', 'Admin123!');
  const U = await login('test@eshop.com', 'Test1234!');
  const tA = A.token, tU = U.token;
  const B = { name: 'n', shipping_address: 'a', phone: '0912345678' };

  console.log('=== API1: cac nhanh Authorization (co body hop le, tranh 500 do destructure) ===');
  const cases = [
    ['khong gui header', undefined],
    ['header rong ""', ''],
    ['Bearer + 2 dau cach', 'Bearer  ' + tU],
    ['khong co dau cach', 'GarbageNoSpaceHere'],
    ['Bearer not-a-valid-jwt', 'Bearer not-a-valid-jwt'],
    ['Basic <token>', 'Basic ' + tU],
    ['ky bang secret khac', 'Bearer ' + jwt.sign({ id: 2, role: 'user' }, 'wrong_secret_key')],
    ['exp qua khu', 'Bearer ' + jwt.sign({ id: 2, role: 'user', exp: Math.floor(Date.now() / 1000) - 3600 }, SECRET)],
    ['token gia mao id=999999', 'Bearer ' + jwt.sign({ id: 999999, role: 'user' }, SECRET)],
    ['token gia mao id=1 (admin thuc)', 'Bearer ' + jwt.sign({ id: 1, role: 'user' }, SECRET)],
    ['token gia mao role=admin', 'Bearer ' + jwt.sign({ id: 2, role: 'admin' }, SECRET)],
  ];
  for (const [label, authRaw] of cases) {
    const r = await req('PUT', '/api/users/me', { authRaw, body: B });
    show('A1 ' + label, r);
  }
  const g = await req('GET', '/api/users/me', { authRaw: 'Bearer ' + jwt.sign({ id: 999999, role: 'user' }, SECRET) });
  show('A1-028 GET voi id=999999', { code: g.code, json: g.json === null ? null : g.json, text: g.text }, '| body=' + JSON.stringify(g.json));
  const g1 = await req('GET', '/api/users/me', { authRaw: 'Bearer ' + jwt.sign({ id: 1, role: 'user' }, SECRET) });
  show('A1-E03 GET ho so admin bang token gia', { code: g1.code, json: null, text: '' }, '| name=' + JSON.stringify(g1.json && g1.json.name) + ' role=' + JSON.stringify(g1.json && g1.json.role));

  console.log('\n=== API2: chuyen trang thai FR-10 (moi TC mot don moi) ===');
  const mkOrder = async (chain, token) => {
    const co = await req('POST', '/api/checkout', { authRaw: 'Bearer ' + (token || tU), body: { total_amount: 500000, shipping_address: 'probe2' } });
    const oid = co.json.orderId;
    for (const st of chain) {
      const r = await req('PUT', '/api/admin/orders/' + oid + '/status', { authRaw: 'Bearer ' + tA, body: { status: st } });
      if (r.code !== 200) console.log('   (setup ' + oid + ' -> ' + st + ' FAIL ' + r.code + ' ' + JSON.stringify(r.json) + ')');
    }
    return oid;
  };
  const stOf = async (oid) => (await req('GET', '/api/orders/' + oid)).json.status;
  for (const chain of [[], ['confirmed'], ['confirmed', 'shipping'], ['confirmed', 'shipping', 'delivered']]) {
    const oid = await mkOrder(chain);
    const from = await stOf(oid);
    const r = await req('PUT', '/api/orders/' + oid + '/cancel', { authRaw: 'Bearer ' + tU });
    show('A2 huy don tu "' + from + '"', r, '| status sau = ' + (await stOf(oid)));
  }
  const oidC = await mkOrder([]);
  await req('PUT', '/api/orders/' + oidC + '/cancel', { authRaw: 'Bearer ' + tU });
  const rC = await req('PUT', '/api/orders/' + oidC + '/cancel', { authRaw: 'Bearer ' + tU });
  show('A2-020 huy don da canceled', rC);

  console.log('\n--- route admin (doi chung ma tran trang thai) ---');
  const oShip = await mkOrder(['confirmed', 'shipping']);
  show('A2-023 admin shipping->canceled', await req('PUT', '/api/admin/orders/' + oShip + '/status', { authRaw: 'Bearer ' + tA, body: { status: 'canceled' } }));
  const oCan = await mkOrder([]);
  await req('PUT', '/api/orders/' + oCan + '/cancel', { authRaw: 'Bearer ' + tU });
  show('A2-024 admin canceled->delivered', await req('PUT', '/api/admin/orders/' + oCan + '/status', { authRaw: 'Bearer ' + tA, body: { status: 'delivered' } }), '| status = ' + (await stOf(oCan)));

  console.log('\n--- IDOR / ownership ---');
  await req('POST', '/api/register', { body: { name: 'User B', email: 'userb@eshop.com', password: 'UserB123!' } });
  const Bl = await login('userb@eshop.com', 'UserB123!');
  const tB = Bl.token;
  console.log('user B id=' + Bl.user.id);
  const oA = await mkOrder([]);
  show('A2-033 user B huy don cua A', await req('PUT', '/api/orders/' + oA + '/cancel', { authRaw: 'Bearer ' + tB }));
  show('A2-034 admin huy don cua A', await req('PUT', '/api/orders/' + oA + '/cancel', { authRaw: 'Bearer ' + tA }));
  show('A2-E02 token gia mao id=2 huy don A', await req('PUT', '/api/orders/' + oA + '/cancel', { authRaw: 'Bearer ' + jwt.sign({ id: 2, role: 'user' }, SECRET) }), '| status = ' + (await stOf(oA)));

  console.log('\n--- A2-E01 race condition ---');
  const oRace = await mkOrder(['confirmed', 'shipping']);
  const [r1, r2] = await Promise.all([
    req('PUT', '/api/orders/' + oRace + '/cancel', { authRaw: 'Bearer ' + tU }),
    req('PUT', '/api/admin/orders/' + oRace + '/status', { authRaw: 'Bearer ' + tA, body: { status: 'delivered' } }),
  ]);
  console.log('   cancel  ->', r1.code, JSON.stringify(r1.json));
  console.log('   deliver ->', r2.code, JSON.stringify(r2.json));
  console.log('   status cuoi =', await stOf(oRace));

  console.log('\n--- A2-E04 don mo coi (xoa chu don) ---');
  const oOrphan = await mkOrder([], tB);
  show('xoa user B', await req('DELETE', '/api/admin/users/' + Bl.user.id, { authRaw: 'Bearer ' + tA }));
  show('A2-E04 user B huy don bang token cu', await req('PUT', '/api/orders/' + oOrphan + '/cancel', { authRaw: 'Bearer ' + tB }), '| status = ' + (await stOf(oOrphan)));

  console.log('\n=== API3: SEC-03 va apply-coupon ===');
  show('A3-030 user thuong DELETE coupon', await req('DELETE', '/api/admin/coupons/3', { authRaw: 'Bearer ' + tU }));
  show('A3-E04 user thuong xoa SAVE10 (id=1)', await req('DELETE', '/api/admin/coupons/1', { authRaw: 'Bearer ' + tU }));
  const cl = await req('GET', '/api/coupons', { authRaw: 'Bearer ' + tA });
  console.log('   SAVE10 con trong danh sach?', cl.json.some((c) => c.code === 'SAVE10'));
  const mkC = async (patch) => {
    const body = { code: 'PB' + Math.random().toString(36).slice(2, 8).toUpperCase(), type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1, ...patch };
    const r = await req('POST', '/api/admin/coupons', { authRaw: 'Bearer ' + tA, body });
    return { id: r.json.id, code: body.code };
  };
  const neg = await mkC({ type: 'fixed', discount_value: -50000 });
  show('A3-E05 apply coupon discount am', await req('POST', '/api/apply-coupon', { body: { code: neg.code, total_amount: 500000, user_id: 2 } }));
  const zero = await mkC({ max_uses_per_user: '0' });
  show('A3-E02 apply coupon max_uses="0"', await req('POST', '/api/apply-coupon', { body: { code: zero.code, total_amount: 500000, user_id: 2 } }));
  show('A3-011 coupon het han (EXPIRED)', await req('POST', '/api/apply-coupon', { body: { code: 'EXPIRED', total_amount: 500000, user_id: 2 } }));

  console.log('\nHOAN TAT PROBE 2. Nho reset: node database.js');
})();
