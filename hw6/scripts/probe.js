// HW06 - probe SUT that de chot Expected cho cac test case mo ho (ep kieu, body loi)
// Chay: node hw6/scripts/probe.js   (SUT phai dang chay tai localhost:3000)
const BASE = 'http://localhost:3000';
const SID = '23127344';

async function req(method, path, { token, body, raw, contentType, headers } = {}) {
  const h = { 'X-Student-Id': SID, ...(headers || {}) };
  if (token) h.Authorization = 'Bearer ' + token;
  if (contentType !== null && (body !== undefined || raw !== undefined)) h['Content-Type'] = contentType || 'application/json';
  const res = await fetch(BASE + path, {
    method,
    headers: h,
    body: raw !== undefined ? raw : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* HTML */ }
  return { code: res.status, json, text: text.slice(0, 90).replace(/\s+/g, ' ') };
}

const show = (label, r, extra = '') =>
  console.log(String(label).padEnd(34), '->', String(r.code).padEnd(4), (r.json ? JSON.stringify(r.json) : 'HTML: ' + r.text).slice(0, 110), extra);

(async () => {
  const login = async (email, password) => (await req('POST', '/api/login', { body: { email, password } })).json;
  const admin = await login('admin@eshop.com', 'Admin123!');
  const user = await login('test@eshop.com', 'Test1234!');
  const tA = admin.token, tU = user.token;
  console.log('admin id=' + admin.user.id + ' role=' + admin.user.role + ' | user id=' + user.user.id + ' role=' + user.user.role);
  const prof = async () => (await req('GET', '/api/users/me', { token: tU })).json;

  console.log('\n=== API1 - ep kieu va body loi ===');
  let r;
  r = await req('PUT', '/api/users/me', { token: tU, body: { name: 12345, shipping_address: 'x', phone: '0912345678' } });
  show('A1-004 name:12345 (number)', r, '| GET name=' + JSON.stringify((await prof()).name));
  r = await req('PUT', '/api/users/me', { token: tU, body: { name: 'n', shipping_address: { street: '123 Le Loi' }, phone: '0912345678' } });
  show('A1-006 addr:{object}', r, '| GET addr=' + JSON.stringify((await prof()).shipping_address));
  r = await req('PUT', '/api/users/me', { token: tU, body: { name: 'n', shipping_address: 'a', phone: 912345678 } });
  show('A1-010 phone:number', r, '| GET phone=' + JSON.stringify((await prof()).phone));
  r = await req('PUT', '/api/users/me', { token: tU, body: { name: 'n', shipping_address: 'a', phone: '0912345678', role: 0 } });
  show('A1-021 role:0 (number falsy)', r, '| GET role=' + JSON.stringify((await prof()).role));
  r = await req('PUT', '/api/users/me', { token: tU, body: { name: 'n', shipping_address: 'a', phone: '0912345678', role: '0' } });
  show('A1-022 role:"0" (string)', r, '| GET role=' + JSON.stringify((await prof()).role));
  r = await req('PUT', '/api/users/me', { token: tU, body: { name: 'n' } });
  show('A1-002 thieu addr+phone', r, '| GET addr=' + JSON.stringify((await prof()).shipping_address));
  r = await req('PUT', '/api/users/me', { token: tU, raw: '{"name":"A",' });
  show('A1-E01 JSON cut', r);
  r = await req('PUT', '/api/users/me', { token: tU, contentType: null });
  show('A1-E02 khong body', r);
  r = await req('PUT', '/api/users/me', { token: tU, headers: { Authorization: 'Bearer  ' + tU } });
  show('A1-020 header 2 dau cach', r);
  r = await req('PUT', '/api/users/me', { token: tU, headers: { Authorization: '' }, body: { name: 'n' } });
  show('A1-041 header rong', r);
  r = await req('PUT', '/api/users/me', { headers: { Authorization: 'Basic ' + tU }, body: { name: 'basic-scheme', shipping_address: 'a', phone: '0912345678' } });
  show('A1-040 scheme Basic', r);
  r = await req('PUT', '/api/users/me', { token: tU, body: { name: 'n', shipping_address: 'a', phone: '0912345678', email: 'hacker@evil.com' } });
  show('A1-E05 gui email', r, '| GET email=' + JSON.stringify((await prof()).email));
  r = await req('GET', '/api/users/me', { token: tU });
  show('A1-036 GET schema', { code: r.code, json: null, text: '' }, '| keys=' + Object.keys(r.json).join(','));

  console.log('\n=== API2 - :id va routing ===');
  const co = await req('POST', '/api/checkout', { token: tU, body: { total_amount: 500000, shipping_address: 'probe' } });
  const oid = co.json.orderId;
  console.log('tao don #' + oid);
  for (const id of ['abc', '-1', '1.5', '1abc', '99999999999999999999', '0', "1 OR 1=1", '999999']) {
    r = await req('PUT', '/api/orders/' + encodeURIComponent(id) + '/cancel', { token: tU });
    show('A2 :id=' + JSON.stringify(id), r);
  }
  r = await req('PUT', '/api/orders//cancel', { token: tU });
  show('A2-004 segment rong', r);
  r = await req('PUT', '/api/orders/' + oid + '/cancel', { token: tU, body: { status: 'delivered' } });
  show('A2-008 body bi bo qua', r, '| status=' + (await req('GET', '/api/orders/' + oid)).json.status);
  r = await req('PUT', '/api/orders/' + oid + '/cancel', { token: tU });
  show('A2-021 huy lan 2', r);
  r = await req('GET', '/api/orders/' + oid, { });
  show('A2-042 GET /orders/:id khong token', r);

  console.log('\n=== API3 - ep kieu coupon ===');
  const mk = async (patch, label) => {
    const body = { code: 'PROBE' + Math.random().toString(36).slice(2, 8).toUpperCase(), type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1, ...patch };
    const rr = await req('POST', '/api/admin/coupons', { token: tA, body });
    let stored = null;
    if (rr.json && rr.json.id) {
      const list = (await req('GET', '/api/coupons', { token: tA })).json;
      stored = list.filter((c) => c.id === rr.json.id)[0];
    }
    show(label, rr, stored ? '| stored=' + JSON.stringify(stored) : '');
    return rr;
  };
  await mk({ max_uses_per_user: 0 }, 'A3-019 max_uses:0');
  await mk({ max_uses_per_user: '0' }, 'A3-020 max_uses:"0"');
  await mk({ max_uses_per_user: -5 }, 'A3-022 max_uses:-5');
  await mk({ max_uses_per_user: null }, 'A3-056 max_uses:null');
  await mk({ max_uses_per_user: '' }, 'A3-057 max_uses:""');
  await mk({ max_uses_per_user: 1.5 }, 'A3-080 max_uses:1.5');
  await mk({ max_uses_per_user: false }, 'A3-081a max_uses:false');
  await mk({ max_uses_per_user: true }, 'A3-081b max_uses:true');
  await mk({ code: null }, 'A3-046 code:null (lan 1)');
  await mk({ code: null }, 'A3-E03 code:null (lan 2)');
  await mk({ code: 12345 }, 'A3-074 code:12345');
  await mk({ type: 1 }, 'A3-075 type:1');
  await mk({ type: null }, 'A3-049 type:null');
  await mk({ discount_value: 10.5 }, 'A3-076 discount:10.5');
  await mk({ discount_value: null }, 'A3-050 discount:null');
  await mk({ min_order_amount: true }, 'A3-077 min_order:true');
  await mk({ expired_at: 1735689600 }, 'A3-079 expired_at:number');
  await mk({ code: 'save10' }, 'A3-047 code:"save10" (co SAVE10)');
  r = await req('POST', '/api/admin/coupons', { token: tA, body: { code: 'SAVE10', type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 } });
  show('A3-004 trung code SAVE10', r);
  r = await req('POST', '/api/admin/coupons', { token: tA, body: {} });
  show('A3-066 body {}', r);
  r = await req('POST', '/api/admin/coupons', { token: tA, contentType: null });
  show('A3-067 khong body', r);
  r = await req('POST', '/api/admin/coupons', { token: tA, raw: '{"code":"A",' });
  show('A3-068 JSON cut', r);
  r = await req('DELETE', '/api/admin/coupons/abc', { token: tA });
  show('A3-070 DELETE :id=abc', r);
  r = await req('DELETE', '/api/admin/coupons/999999', { token: tA });
  show('A3-041 DELETE id khong ton tai', r);
  r = await req('DELETE', '/api/admin/coupons/' + encodeURIComponent('1 OR 1=1'), { token: tA });
  show('A3-071 DELETE SQLi', r);
  r = await req('POST', '/api/admin/coupons', { token: tU, body: { code: 'USERMADE' + Date.now(), type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 } });
  show('A3-029 user thuong tao coupon', r);
  r = await req('GET', '/api/coupons', { token: tU });
  show('A3-031 user doc GET /api/coupons', { code: r.code, json: null, text: '' }, '| so coupon=' + r.json.length);

  console.log('\n=== chuoi leo thang quyen (A1-E04) ===');
  await req('PUT', '/api/users/me', { token: tU, body: { name: 'esc', shipping_address: 'a', phone: '0912345678', role: 'admin' } });
  const relog = await login('test@eshop.com', 'Test1234!');
  r = await req('GET', '/api/admin/users', { token: relog.token });
  show('A1-E04 GET /admin/users sau escalate', { code: r.code, json: null, text: '' }, '| role moi=' + relog.user.role + ' so user=' + (r.json ? r.json.length : '-'));
  r = await req('GET', '/api/admin/users', { token: tU });
  show('A1-042 token cu sau escalate', { code: r.code, json: null, text: '' }, '| ' + (r.json ? 'so user=' + r.json.length : 'HTML'));

  console.log('\nHOAN TAT PROBE. Nho chay lai: node database.js de reset DB.');
})();
