// HW06 - thu vien dung chung cho bo sinh Postman collection
// MSSV 23127344 - Truong Thanh Dat

const BASE = '{{baseUrl}}';

// ---------- cac che do Authorization duoc dung boi test case ----------
// Moi che do anh xa truc tiep sang mot nhanh cua authenticateToken (server.js:99-110)
const AUTH = {
  none: null,                                  // khong gui header   -> 401
  user: 'Bearer {{tokenUser}}',                // user A (id=2, role=user)
  userB: 'Bearer {{tokenUserB}}',              // user B (dung cho IDOR)
  admin: 'Bearer {{tokenAdmin}}',              // admin (id=1)
  empty: '',                                   // header rong        -> 403
  doubleSpace: 'Bearer  {{tokenUser}}',        // 2 dau cach         -> 403
  doubleSpaceAdmin: 'Bearer  {{tokenAdmin}}',
  noSpace: 'GarbageNoSpaceHere',               // khong co dau cach  -> 401
  basicUser: 'Basic {{tokenUser}}',            // scheme sai         -> 200
  basicAdmin: 'Basic {{tokenAdmin}}',
  badJwt: 'Bearer not-a-valid-jwt',            // sai cu phap        -> 403
  wrongSecret: 'Bearer {{tokenWrongSecret}}',  // ky bang secret khac-> 403
  expired: 'Bearer {{tokenExpired}}',          // exp qua khu        -> 403
  forgedId0: 'Bearer {{tokenForgedId0}}',
  forgedId1: 'Bearer {{tokenForgedId1}}',
  forgedId2: 'Bearer {{tokenForgedId2}}',
  forgedId999: 'Bearer {{tokenForgedId999999}}',
  forgedAdminRole: 'Bearer {{tokenForgedAdminRole}}',
};

// ---------- helper duoc chen vao pre-request script khi can ----------
const HELPERS = [
  "// --- helper HW06 (bo sinh chen tu dong) ---",
  "function hwHeaders(tokenVar) {",
  "  var h = { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') };",
  "  if (tokenVar) { h['Authorization'] = 'Bearer ' + pm.environment.get(tokenVar); }",
  "  return h;",
  "}",
  "function hwUrl(p) { return pm.environment.get('baseUrl') + p; }",
  "",
].join('\n');

// Tao mot don hang moi cho user A roi day qua chuoi trang thai chain[]
// Dung trong pre-request script cua cac TC chuyen trang thai (FR-10)
// opts.owner : bien token cua chu don (mac dinh tokenUser)
// opts.after : ma JS chay SAU khi chuoi trang thai hoan tat (bien `oid` co san trong scope)
//              -> dung thay cho setTimeout de dam bao dung thu tu
function mkOrderSetup(chain, opts) {
  opts = opts || {};
  const owner = opts.owner || 'tokenUser';
  const after = opts.after ? opts.after.split('\n').map((l) => '    ' + l).join('\n') : '';
  return HELPERS + [
    'var chain = ' + JSON.stringify(chain) + ';',
    "pm.sendRequest({",
    "  url: hwUrl('/api/checkout'), method: 'POST', header: hwHeaders('" + owner + "'),",
    "  body: { mode: 'raw', raw: JSON.stringify({ total_amount: 500000, shipping_address: 'HW06 state setup' }) }",
    "}, function (err, res) {",
    "  if (err) { console.log('[SETUP] loi checkout', err); return; }",
    "  var oid = res.json().orderId;",
    "  pm.collectionVariables.set('orderId', oid);",
    "  console.log('[SETUP] tao don #' + oid + ' (pending)');",
    "  var i = 0;",
    "  (function next() {",
    "    if (i >= chain.length) {",
    after || "      // khong co buoc sau",
    "      return;",
    "    }",
    "    var st = chain[i++];",
    "    pm.sendRequest({",
    "      url: hwUrl('/api/admin/orders/' + oid + '/status'), method: 'PUT', header: hwHeaders('tokenAdmin'),",
    "      body: { mode: 'raw', raw: JSON.stringify({ status: st }) }",
    "    }, function (e2, r2) {",
    "      if (e2) { console.log('[SETUP] loi doi trang thai', e2); return; }",
    "      console.log('[SETUP] don #' + oid + ' -> ' + st + ' (HTTP ' + r2.code + ')');",
    "      next();",
    "    });",
    "  })();",
    "});",
  ].join('\n');
}

// Doan `after` dung san: huy don mot lan (de dua don ve canceled truoc khi TC chay)
const AFTER_CANCEL_ONCE = [
  "pm.sendRequest({ url: hwUrl('/api/orders/' + oid + '/cancel'), method: 'PUT', header: hwHeaders('tokenUser') },",
  "  function (e3, r3) {",
  "    console.log('[SETUP] huy lan 1 don #' + oid + ' -> HTTP ' + (r3 && r3.code));",
  "    pm.collectionVariables.set('firstCancelCode', r3 && r3.code);",
  "    pm.collectionVariables.set('firstCancelBody', r3 && r3.text());",
  "  });",
].join('\n');

// Doan `after` dung san: xoa user B (dung cho TC don mo coi)
const AFTER_DELETE_USER_B = [
  "pm.sendRequest({ url: hwUrl('/api/admin/users/' + pm.environment.get('userBId')), method: 'DELETE', header: hwHeaders('tokenAdmin') },",
  "  function (e3, r3) { console.log('[SETUP] xoa user B (id=' + pm.environment.get('userBId') + ') -> HTTP ' + (r3 && r3.code)); });",
].join('\n');

// Tao mot coupon truoc khi chay TC (dung cho TC trung code / xoa coupon)
// opts.thenDelete: xoa luon coupon vua tao NGAY TRONG callback (cho TC 'tao lai code da xoa'
// va TC 'xoa lan 2'). Dung callback thay setTimeout de khong phu thuoc do tre.
function mkCouponSetup(bodyObj, varName, opts) {
  opts = opts || {};
  return HELPERS + [
    "pm.sendRequest({",
    "  url: hwUrl('/api/admin/coupons'), method: 'POST', header: hwHeaders('tokenAdmin'),",
    "  body: { mode: 'raw', raw: JSON.stringify(" + JSON.stringify(bodyObj) + ") }",
    "}, function (err, res) {",
    "  if (err) { console.log('[SETUP] loi tao coupon', err); return; }",
    "  var id = res.json().id;",
    "  pm.collectionVariables.set('" + varName + "', id);",
    "  var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]');",
    "  ids.push(id); pm.collectionVariables.set('createdCouponIds', JSON.stringify(ids));",
    "  console.log('[SETUP] tao coupon id=' + id + ' code=' + " + JSON.stringify(bodyObj.code === null ? 'null' : bodyObj.code) + ");",
    (opts.thenDelete
      ? "  pm.sendRequest({ url: hwUrl('/api/admin/coupons/' + id), method: 'DELETE', header: hwHeaders('tokenAdmin') },"
        + "\n    function (e2, r2) { console.log('[SETUP] xoa coupon id=' + id + ' -> HTTP ' + (r2 && r2.code)); });"
      : "  // khong xoa sau khi tao"),
    "});",
  ].join('\n');
}

const q = (s) => JSON.stringify(s);

// ---------- cac doan assertion dung lai nhieu lan ----------
const A = {
  status: (c) => "pm.test('Status " + c + "', function () { pm.response.to.have.status(" + c + "); });",

  jsonBody: (obj) => [
    "pm.test('Body JSON khop chinh xac ' + " + q(JSON.stringify(obj)) + ", function () {",
    "  pm.expect(pm.response.json()).to.deep.equal(" + JSON.stringify(obj) + ");",
    "});",
  ].join('\n'),

  jsonKey: (k, v) => [
    "pm.test(" + q('Body.' + k + ' = ' + JSON.stringify(v)) + ", function () {",
    "  pm.expect(pm.response.json()[" + q(k) + "]).to.eql(" + JSON.stringify(v) + ");",
    "});",
  ].join('\n'),

  exactKeys: (keys) => [
    "pm.test(" + q('Response co dung ' + keys.length + ' key: ' + keys.join(', ')) + ", function () {",
    "  pm.expect(Object.keys(pm.response.json()).sort()).to.deep.equal(" + JSON.stringify(keys.slice().sort()) + ");",
    "});",
  ].join('\n'),

  notHasKey: (k) => [
    "pm.test(" + q('Response KHONG chua key "' + k + '"') + ", function () {",
    "  pm.expect(pm.response.json()).to.not.have.property(" + q(k) + ");",
    "});",
  ].join('\n'),

  htmlNotJson: (c) => [
    "pm.test('Status " + c + "', function () { pm.response.to.have.status(" + c + "); });",
    "pm.test('Body la HTML, KHONG phai JSON co key error', function () {",
    "  var t = pm.response.text();",
    "  pm.expect(t.toLowerCase()).to.include('<!doctype html>');",
    "  var isJson = true; try { JSON.parse(t); } catch (e) { isJson = false; }",
    "  pm.expect(isJson, 'body khong duoc la JSON').to.be.false;",
    "});",
  ].join('\n'),

  // Doc lai ho so qua GET /api/users/me roi assert mot truong
  verifyProfile: (field, expected, tokenVar) => [
    "pm.test(" + q('GET /api/users/me: ' + field + ' = ' + JSON.stringify(expected)) + ", function (done) {",
    "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'GET',",
    "    header: { 'Authorization': 'Bearer ' + pm.environment.get('" + (tokenVar || 'tokenUser') + "'), 'X-Student-Id': pm.environment.get('studentId') } },",
    "    function (err, res) {",
    "      if (err) { return done(err); }",
    "      try { pm.expect(res.json()[" + q(field) + "]).to.eql(" + JSON.stringify(expected) + "); done(); }",
    "      catch (e) { done(e); }",
    "    });",
    "});",
  ].join('\n'),

  // Doc lai coupon vua tao (theo id trong response) roi assert mot truong
  verifyCoupon: (field, expected) => [
    "pm.test(" + q('GET /api/coupons: coupon vua tao co ' + field + ' = ' + JSON.stringify(expected)) + ", function (done) {",
    "  var newId = pm.response.json().id;",
    "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
    "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
    "    function (err, res) {",
    "      if (err) { return done(err); }",
    "      try {",
    "        var c = res.json().filter(function (x) { return x.id === newId; })[0];",
    "        pm.expect(c, 'coupon id=' + newId + ' phai ton tai').to.not.be.undefined;",
    "        pm.expect(c[" + q(field) + "]).to.eql(" + JSON.stringify(expected) + ");",
    "        done();",
    "      } catch (e) { done(e); }",
    "    });",
    "});",
  ].join('\n'),

  // Ghi nhan id coupon vua tao de Teardown xoa -> suite chay lai duoc nhieu lan
  trackCoupon: [
    "pm.test('Ghi nhan id coupon de teardown', function () {",
    "  var id = pm.response.json().id;",
    "  pm.expect(id, 'response phai co id').to.be.a('number');",
    "  var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]');",
    "  ids.push(id); pm.collectionVariables.set('createdCouponIds', JSON.stringify(ids));",
    "});",
  ].join('\n'),

  // Doc lai trang thai don hang qua GET /api/orders/my-orders
  verifyOrderStatus: (expected, tokenVar) => [
    "pm.test(" + q('GET /api/orders/my-orders: status = "' + expected + '"') + ", function (done) {",
    "  var oid = Number(pm.collectionVariables.get('orderId'));",
    "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/orders/my-orders', method: 'GET',",
    "    header: { 'Authorization': 'Bearer ' + pm.environment.get('" + (tokenVar || 'tokenUser') + "'), 'X-Student-Id': pm.environment.get('studentId') } },",
    "    function (err, res) {",
    "      if (err) { return done(err); }",
    "      try {",
    "        var o = res.json().filter(function (x) { return x.id === oid; })[0];",
    "        pm.expect(o, 'don #' + oid + ' phai ton tai').to.not.be.undefined;",
    "        pm.expect(o.status).to.eql(" + JSON.stringify(expected) + ");",
    "        done();",
    "      } catch (e) { done(e); }",
    "    });",
    "});",
  ].join('\n'),

  // Doc trang thai don qua GET /api/orders/:id (endpoint khong can token)
  verifyOrderStatusPublic: (expected) => [
    "pm.test(" + q('GET /api/orders/:id: status = "' + expected + '"') + ", function (done) {",
    "  var oid = Number(pm.collectionVariables.get('orderId'));",
    "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/orders/' + oid, method: 'GET',",
    "    header: { 'X-Student-Id': pm.environment.get('studentId') } },",
    "    function (err, res) {",
    "      if (err) { return done(err); }",
    "      try { pm.expect(res.json().status).to.eql(" + JSON.stringify(expected) + "); done(); }",
    "      catch (e) { done(e); }",
    "    });",
    "});",
  ].join('\n'),

  // Doc lai ho so ROI tra role ve "user" trong CUNG mot chuoi callback.
  // Ly do: cac pm.test async KHONG duoc runner tuan tu hoa - da gap that o A2-E03,
  // assertion sau chay truoc khi tac dung cua assertion truoc kip commit.
  verifyProfileThenRestoreRole: (field, expected) => [
    "pm.test(" + q('GET /api/users/me: ' + field + ' = ' + JSON.stringify(expected) + ' roi tra role ve "user"') + ", function (done) {",
    "  var base = pm.environment.get('baseUrl'), sid = pm.environment.get('studentId');",
    "  var tok = 'Bearer ' + pm.environment.get('tokenUser');",
    "  pm.sendRequest({ url: base + '/api/users/me', method: 'GET', header: { 'Authorization': tok, 'X-Student-Id': sid } },",
    "    function (err, res) {",
    "      if (err) { return done(err); }",
    "      try { pm.expect(res.json()[" + q(field) + "]).to.eql(" + JSON.stringify(expected) + "); }",
    "      catch (e) { return done(e); }",
    "      pm.sendRequest({ url: base + '/api/users/me', method: 'PUT',",
    "        header: { 'Content-Type': 'application/json', 'Authorization': tok, 'X-Student-Id': sid },",
    "        body: { mode: 'raw', raw: JSON.stringify({ name: 'Test User', shipping_address: 'reset', phone: '0912345678', role: 'user' }) } },",
    "        function (e2, r2) {",
    "          if (e2) { return done(e2); }",
    "          try { pm.expect(r2.code, '[cleanup] tra role ve user').to.eql(200); done(); } catch (e) { done(e); }",
    "        });",
    "    });",
    "});",
  ].join('\n'),

  schema: (schema, label) => [
    "pm.test(" + q('Schema: ' + (label || 'khop dac ta')) + ", function () {",
    "  pm.response.to.have.jsonSchema(" + JSON.stringify(schema) + ");",
    "});",
  ].join('\n'),

  raw: (s) => s,
};

// Schema JSON dung cho kiem tra schema (P9)
const SCHEMA = {
  msgOnly: { type: 'object', required: ['message'], properties: { message: { type: 'string' } }, additionalProperties: false },
  errOnly: { type: 'object', required: ['error'], properties: { error: { type: 'string' } }, additionalProperties: false },
  couponCreated: {
    type: 'object', required: ['message', 'id'],
    properties: { message: { type: 'string' }, id: { type: 'integer', minimum: 1 } },
    additionalProperties: false,
  },
  userProfile: {
    type: 'object',
    required: ['id', 'name', 'email', 'password', 'role', 'login_attempts', 'locked_until', 'reset_token', 'shipping_address', 'phone'],
    properties: { id: { type: 'integer' }, role: { type: 'string' } },
  },
};

// ---------- dung mot item request cua Postman ----------
function tc(id, title, spec) {
  const headers = [];
  const authVal = spec.auth === undefined ? 'user' : spec.auth;
  if (authVal !== 'none') {
    if (!(authVal in AUTH)) throw new Error('auth mode khong biet: ' + authVal + ' (' + id + ')');
    headers.push({ key: 'Authorization', value: AUTH[authVal] });
  }
  if (spec.body !== undefined && spec.noContentType !== true) {
    headers.push({ key: 'Content-Type', value: 'application/json' });
  }
  (spec.headers || []).forEach((h) => headers.push(h));

  const path = spec.path;
  const item = {
    name: id + ' - ' + title,
    event: [],
    request: {
      method: spec.method,
      header: headers,
      url: BASE + path,
      description: spec.desc || '',
    },
  };
  if (spec.body !== undefined) {
    item.request.body = {
      mode: 'raw',
      raw: typeof spec.body === 'string' ? spec.body : JSON.stringify(spec.body, null, 2),
      options: { raw: { language: 'json' } },
    };
  }
  if (spec.prerequest) {
    item.event.push({ listen: 'prerequest', script: { type: 'text/javascript', exec: spec.prerequest.split('\n') } });
  }
  if (!spec.tests || !spec.tests.length) throw new Error('TC khong co assertion: ' + id);
  item.event.push({ listen: 'test', script: { type: 'text/javascript', exec: spec.tests.join('\n\n').split('\n') } });
  return item;
}

function folder(name, items, description) {
  const f = { name, item: items };
  if (description) f.description = description;
  return f;
}

module.exports = { AUTH, A, SCHEMA, tc, folder, mkOrderSetup, mkCouponSetup, HELPERS, BASE, AFTER_CANCEL_ONCE, AFTER_DELETE_USER_B };
