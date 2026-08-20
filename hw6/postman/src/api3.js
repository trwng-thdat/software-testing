// HW06 - API 3: POST /api/admin/coupons (Pool C / FR-17), don dep bang DELETE /api/admin/coupons/:id
// 82 TC do AI sinh. Kiem toan loai 3 TC khong phai request (TC-040, -042, -043 - menh de tong hop),
// va tach TC-081 thanh -081a/-081b => 80 TC thuc thi + 5 TC tu bo sung (A3-E01..E05)
// Moi Expected da doi chieu probe SUT that (hw6/scripts/probe.js, probe2.js, probe API3 ep kieu)
const { A, SCHEMA, tc, folder, mkCouponSetup } = require('./lib');

const P = '/api/admin/coupons';
const cb = (extra) => Object.assign(
  { code: 'HW06BASE', type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 },
  extra || {}
);
// bo key ra khoi body (mo phong "thieu truong")
const without = (key, extra) => { const b = cb(extra); delete b[key]; return b; };

const CREATED = [A.status(200), A.exactKeys(['message', 'id']), A.jsonKey('message', 'Coupon created'), A.trackCoupon];
const created = (field, value) => CREATED.concat([A.verifyCoupon(field, value)]);

const items = [
  // ---------------- Phan vung mien gia tri (EP) ----------------
  tc('TC-API3-001', 'Tao coupon hop le (happy path)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'TESTNEW01' }),
    desc: 'COV-055,001,011,018,027,034,042 - FR-17.',
    tests: created('code', 'TESTNEW01'),
  }),
  tc('TC-API3-002', 'Thieu code -> luu null (khong co not-null check)', {
    method: 'POST', path: P, auth: 'admin', body: without('code'),
    tests: created('code', null),
  }),
  tc('TC-API3-003', 'code rong', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: '' }),
    tests: created('code', ''),
  }),
  tc('TC-API3-004', 'Trung code voi coupon da seed (UNIQUE duoc thuc thi)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'SAVE10' }),
    desc: 'Rang buoc unique cua FR-17 duoc thuc thi o tang DB, nhung loi tra ve 500 kem nguyen van thong bao driver.',
    tests: [A.status(500), A.exactKeys(['error']),
      ["pm.test('Thong bao loi lo nguyen van rang buoc SQLite (thong tin noi bo)', function () {",
        "  pm.expect(pm.response.json().error).to.include('UNIQUE constraint failed: coupons.code');",
        "});"].join('\n')],
  }),
  tc('TC-API3-005', 'Thieu type -> luu null (DEFAULT percent bat hoat)', {
    method: 'POST', path: P, auth: 'admin', body: without('type', { code: 'HW06NOTYPE' }),
    desc: 'Cot co DEFAULT percent nhung INSERT luon bind du 6 cot nen DEFAULT khong bao gio ap dung.',
    tests: created('type', null),
  }),
  tc('TC-API3-006', 'type ngoai enum -> luu nguyen van', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06ENUM1', type: 'installment' }),
    tests: created('type', 'installment'),
  }),
  tc('TC-API3-007', 'Thieu discount_value -> luu null', {
    method: 'POST', path: P, auth: 'admin', body: without('discount_value', { code: 'HW06NODV' }),
    tests: created('discount_value', null),
  }),
  tc('TC-API3-008', 'discount_value sai kieu (string "10") -> INTEGER affinity ep thanh 10', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06DVSTR', discount_value: '10' }),
    desc: 'INCOMPLETE da sua: probe that cho thay luu so 10, khong phai chuoi "10".',
    tests: created('discount_value', 10),
  }),
  tc('TC-API3-009', 'Thieu min_order_amount -> luu null (KHONG phai DEFAULT 0)', {
    method: 'POST', path: P, auth: 'admin', body: without('min_order_amount', { code: 'HW06NOMO' }),
    desc: 'Sua so voi ban §6.1: probe that cho null, vi cot luon duoc bind gia tri undefined -> NULL.',
    tests: created('min_order_amount', null),
  }),
  tc('TC-API3-010', 'Thieu expired_at -> luu null', {
    method: 'POST', path: P, auth: 'admin', body: without('expired_at', { code: 'HW06NOEXP' }),
    tests: created('expired_at', null),
  }),
  tc('TC-API3-011', 'expired_at la ngay qua khu -> van tao duoc', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06PAST', expired_at: '2020-01-01' }),
    tests: created('expired_at', '2020-01-01'),
  }),
  tc('TC-API3-012', 'expired_at sai dinh dang', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06BADDATE', expired_at: 'not-a-date' }),
    tests: created('expired_at', 'not-a-date'),
  }),
  tc('TC-API3-013', 'Thieu max_uses_per_user -> ep thanh 1', {
    method: 'POST', path: P, auth: 'admin', body: without('max_uses_per_user', { code: 'HW06NOMU' }),
    desc: 'max_uses_per_user || 1 (server.js:474) - undefined la falsy nen thanh 1.',
    tests: created('max_uses_per_user', 1),
  }),
  tc('TC-API3-014', 'Gui kem is_active -> bi bo qua', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06ISACT', is_active: 0 }),
    tests: created('is_active', 1),
  }),

  // ---------------- Gia tri bien (BVA) ----------------
  tc('TC-API3-015', 'discount_value = 0 (bien min-1 cua rang buoc >0)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06DV0', discount_value: 0 }),
    desc: 'Ky vong dac ta: tu choi. Thuc te: chap nhan.',
    tests: created('discount_value', 0),
  }),
  tc('TC-API3-016', 'discount_value = 1 (bien min)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06DV1', discount_value: 1 }),
    tests: created('discount_value', 1),
  }),
  tc('TC-API3-017', 'min_order_amount = -1 (bien min-1 cua >=0)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MOM1', min_order_amount: -1 }),
    tests: created('min_order_amount', -1),
  }),
  tc('TC-API3-018', 'min_order_amount = 0 (bien min, bao gom)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MO0', min_order_amount: 0 }),
    tests: created('min_order_amount', 0),
  }),
  tc('TC-API3-019', 'max_uses_per_user = 0 (so) -> bi ep thanh 1', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MU0', max_uses_per_user: 0 }),
    tests: created('max_uses_per_user', 1),
  }),
  tc('TC-API3-020', 'max_uses_per_user = "0" (chuoi) -> vuot || 1 va bi SQLite ep ve so 0', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MUSTR0', max_uses_per_user: '0' }),
    desc: 'INVALID da sua: AI ket luan "luu dung chuoi \\"0\\"". Probe that: luu SO 0 - vo hieu hoa chinh co che || 1.',
    tests: created('max_uses_per_user', 0),
  }),
  tc('TC-API3-021', 'max_uses_per_user = 1 (bien min)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MU1', max_uses_per_user: 1 }),
    tests: created('max_uses_per_user', 1),
  }),
  tc('TC-API3-022', 'max_uses_per_user = -5 -> KHONG bi ep', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MUNEG', max_uses_per_user: -5 }),
    desc: 'Bat doi xung: -5 la truthy nen vuot || 1 va duoc luu nguyen.',
    tests: created('max_uses_per_user', -5),
  }),
  tc('TC-API3-023', 'discount_value cuc lon', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06DVBIG', discount_value: 999999999 }),
    tests: created('discount_value', 999999999),
  }),
  tc('TC-API3-024', 'Header Authorization co 2 dau cach -> 403', {
    method: 'POST', path: P, auth: 'doubleSpaceAdmin', body: cb({ code: 'HW06NEVER1' }),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),

  // ---------------- Chuyen trang thai / vong doi ton tai (ST) ----------------
  tc('TC-API3-025', 'Tao lai coupon voi code da bi xoa -> id MOI', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'RECREATE01' }),
    desc: 'Pre-request tao roi xoa RECREATE01; request nay tao lai. AUTOINCREMENT khong tai dung id cu.',
    prerequest: mkCouponSetup(cb({ code: 'RECREATE01' }), 'recreateId', { thenDelete: true }),
    tests: CREATED.concat([
      ["pm.test('id moi khac id cua coupon da bi xoa', function () {",
        "  var oldId = Number(pm.collectionVariables.get('recreateId'));",
        "  pm.expect(pm.response.json().id).to.be.above(oldId);",
        "});"].join('\n'),
      A.verifyCoupon('code', 'RECREATE01')]),
  }),
  tc('TC-API3-026', 'Trung code khi coupon van con ton tai -> 500', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'DUPTEST01', discount_value: 99, type: 'fixed' }),
    desc: 'Chi code quyet dinh viec tu choi; cac truong khac khac nhau khong giup gi.',
    prerequest: mkCouponSetup(cb({ code: 'DUPTEST01' }), 'dupId'),
    tests: [A.status(500),
      ["pm.test('Loi UNIQUE tren coupons.code', function () {",
        "  pm.expect(pm.response.json().error).to.include('UNIQUE constraint failed: coupons.code');",
        "});"].join('\n')],
  }),
  tc('TC-API3-027', 'Xoa coupon da bi xoa (idempotent am tham)', {
    method: 'DELETE', path: '/api/admin/coupons/{{dupId2}}', auth: 'admin',
    desc: 'Lan xoa thu 2 tra y het lan xoa that vi server.js:484-487 khong kiem this.changes.',
    prerequest: mkCouponSetup(cb({ code: 'DELTWICE01' }), 'dupId2', { thenDelete: true }),
    tests: [A.status(200), A.jsonBody({ message: 'Coupon deleted' }), A.exactKeys(['message'])],
  }),

  // ---------------- Bao mat (SEC) ----------------
  tc('TC-API3-028', 'Khong gui header Authorization -> 401', {
    method: 'POST', path: P, auth: 'none', body: cb({ code: 'HW06NEVER2' }),
    tests: [A.status(401), A.jsonBody({ error: 'Unauthorized' })],
  }),
  tc('TC-API3-029', '[CRITICAL] User thuong tao duoc coupon - vi pham SEC-03', {
    method: 'POST', path: P, auth: 'user', body: cb({ code: 'USERMADE01' }),
    desc: 'BUG. SEC-03 doi API admin phai kiem role=admin trong token; server.js:457 chi goi authenticateToken.',
    tests: created('code', 'USERMADE01'),
  }),
  tc('TC-API3-030', 'User thuong XOA duoc coupon do admin tao', {
    method: 'DELETE', path: '/api/admin/coupons/{{userDelId}}', auth: 'user',
    desc: 'BUG. Cung goc SEC-03 nhung hau qua nang hon: pha du lieu.',
    prerequest: mkCouponSetup(cb({ code: 'ADMINOWNED01' }), 'userDelId'),
    tests: [A.status(200), A.jsonBody({ message: 'Coupon deleted' }),
      ["pm.test('Coupon that su bien mat khoi GET /api/coupons', function (done) {",
        "  var gone = Number(pm.collectionVariables.get('userDelId'));",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.json().map(function (c) { return c.id; })).to.not.include(gone); done(); } catch (e) { done(e); } });",
        "});"].join('\n')],
  }),
  tc('TC-API3-031', 'User thuong doc duoc GET /api/coupons khong loc', {
    method: 'GET', path: '/api/coupons', auth: 'user',
    tests: [A.status(200),
      ["pm.test('Tra ve danh sach coupon day du y het admin', function (done) {",
        "  var asUser = pm.response.json();",
        "  pm.expect(asUser).to.be.an('array');",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.json().length).to.eql(asUser.length); done(); } catch (e) { done(e); } });",
        "});"].join('\n')],
  }),
  tc('TC-API3-032', 'Token gia mao claim role:"admin"', {
    method: 'POST', path: P, auth: 'forgedAdminRole', body: cb({ code: 'FORGEDROLE01' }),
    desc: 'Theo TC-029 thi gia mao con KHONG can thiet - endpoint khong doc role.',
    tests: created('code', 'FORGEDROLE01'),
  }),
  tc('TC-API3-033', 'Payload SQL injection trong code (SEC-05)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: "'; DROP TABLE coupons;--" }),
    tests: CREATED.concat([A.verifyCoupon('code', "'; DROP TABLE coupons;--"),
      ["pm.test('Bang coupons con nguyen (parameterized query dat)', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.code).to.eql(200); pm.expect(res.json()).to.be.an('array').with.length.above(0); done(); } catch (e) { done(e); } });",
        "});"].join('\n')]),
  }),
  tc('TC-API3-034', 'Chuoi lam dung: user thuong tao coupon gia tri cuc lon', {
    method: 'POST', path: P, auth: 'user',
    body: cb({ code: 'USERABUSE01', discount_value: 999999999, min_order_amount: 0, max_uses_per_user: 999999999 }),
    tests: CREATED.concat([A.verifyCoupon('discount_value', 999999999), A.verifyCoupon('max_uses_per_user', 999999999)]),
  }),
  tc('TC-API3-035', 'JWT sai cu phap -> 403', {
    method: 'POST', path: P, auth: 'badJwt', body: cb({ code: 'HW06NEVER3' }),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),

  // ---------------- Kiem tra schema ----------------
  tc('TC-API3-036', 'Schema response POST thanh cong (message + id)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'SCHEMA01' }),
    tests: [A.status(200), A.exactKeys(['message', 'id']), A.schema(SCHEMA.couponCreated, 'message:string + id:int>0'), A.trackCoupon],
  }),
  tc('TC-API3-037', 'Schema response DELETE thanh cong', {
    method: 'DELETE', path: '/api/admin/coupons/{{schemaDelId}}', auth: 'admin',
    prerequest: mkCouponSetup(cb({ code: 'SCHEMA02' }), 'schemaDelId'),
    tests: [A.status(200), A.exactKeys(['message']), A.jsonKey('message', 'Coupon deleted'), A.schema(SCHEMA.msgOnly)],
  }),
  tc('TC-API3-038', 'Schema loi 401', {
    method: 'POST', path: P, auth: 'none', body: cb({ code: 'HW06NEVER4' }),
    tests: [A.status(401), A.exactKeys(['error']), A.jsonKey('error', 'Unauthorized'), A.schema(SCHEMA.errOnly)],
  }),
  tc('TC-API3-039', 'Schema loi 500 khi trung code - lo text driver', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'SCHEMA03' }),
    desc: 'INCOMPLETE da sua: bo sung buoc tao SCHEMA03 truoc trong pre-request (chay tren DB sach se ra 200 chu khong phai 500).',
    prerequest: mkCouponSetup(cb({ code: 'SCHEMA03' }), 'schema03Id'),
    tests: [A.status(500), A.exactKeys(['error']), A.schema(SCHEMA.errOnly),
      ["pm.test('error chua nguyen van thong bao cua SQLite (ro ri thong tin noi bo)', function () {",
        "  pm.expect(pm.response.json().error).to.match(/^SQLITE_CONSTRAINT/);",
        "});"].join('\n')],
  }),
  tc('TC-API3-041', 'DELETE id khong ton tai -> 200, KHONG phai 404', {
    method: 'DELETE', path: '/api/admin/coupons/999999', auth: 'admin',
    tests: [A.status(200), A.jsonBody({ message: 'Coupon deleted' })],
  }),
  tc('TC-API3-044', 'Chuoi don du lieu: tao -> xoa -> verify (xac thuc co che teardown)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'CLEANUPTEST01' }),
    desc: 'Chay som trong suite de xac thuc co che teardown ma ca API 3 phu thuoc (code la UNIQUE).',
    tests: [A.status(200),
      ["pm.test('Tao -> xoa -> GET khong con thay code CLEANUPTEST01', function (done) {",
        "  var id = pm.response.json().id;",
        "  var base = pm.environment.get('baseUrl');",
        "  var hdr = { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') };",
        "  pm.sendRequest({ url: base + '/api/admin/coupons/' + id, method: 'DELETE', header: hdr }, function (e1, r1) {",
        "    if (e1) { return done(e1); }",
        "    try { pm.expect(r1.code).to.eql(200); } catch (e) { return done(e); }",
        "    pm.sendRequest({ url: base + '/api/coupons', method: 'GET', header: hdr }, function (e2, r2) {",
        "      if (e2) { return done(e2); }",
        "      try {",
        "        pm.expect(r2.json().map(function (c) { return c.code; })).to.not.include('CLEANUPTEST01');",
        "        done();",
        "      } catch (e) { done(e); }",
        "    });",
        "  });",
        "});"].join('\n')],
  }),

  // ---------------- Nhom bo sung khi ra soat (null / enum thu 2 / bien cheo) ----------------
  tc('TC-API3-045', 'type:"fixed" - gia tri enum hop le THU HAI', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06FIXED', type: 'fixed', discount_value: 50000 }),
    desc: 'Ban sinh dau tien cua AI bo sot han gia tri enum thu hai - loi EP co ban.',
    tests: CREATED.concat([A.verifyCoupon('type', 'fixed'), A.verifyCoupon('discount_value', 50000)]),
  }),
  tc('TC-API3-046', 'code la null', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: null }),
    desc: 'Cot khong co NOT NULL; SQL coi moi NULL la khac nhau nen UNIQUE khong chan.',
    tests: created('code', null),
  }),
  tc('TC-API3-047', 'code khac hoa/thuong voi ma da ton tai', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'save10' }),
    desc: 'UNIQUE khong co COLLATE NOCASE nen "save10" va "SAVE10" la 2 ma khac nhau.',
    tests: created('code', 'save10'),
  }),
  tc('TC-API3-048', 'type la chuoi rong', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06TYPEEMPTY', type: '' }),
    tests: created('type', ''),
  }),
  tc('TC-API3-049', 'type la null', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06TYPENULL', type: null }),
    tests: created('type', null),
  }),
  tc('TC-API3-050', 'discount_value la null', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06DVNULL', discount_value: null }),
    tests: created('discount_value', null),
  }),
  tc('TC-API3-051', 'discount_value am', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06DVNEG', discount_value: -10 }),
    desc: 'Ky vong dac ta (>0): tu choi. Thuc te: chap nhan - hau qua o A3-E05.',
    tests: created('discount_value', -10),
  }),
  tc('TC-API3-052', 'min_order_amount la null', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MONULL', min_order_amount: null }),
    tests: created('min_order_amount', null),
  }),
  tc('TC-API3-053', 'min_order_amount duong (phan vung hop le ngoai bien)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MOPOS', min_order_amount: 200000 }),
    tests: created('min_order_amount', 200000),
  }),
  tc('TC-API3-054', 'expired_at la null', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06EXPNULL', expired_at: null }),
    tests: created('expired_at', null),
  }),
  tc('TC-API3-055', 'expired_at la chuoi rong', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06EXPEMPTY', expired_at: '' }),
    tests: created('expired_at', ''),
  }),
  tc('TC-API3-056', 'max_uses_per_user la null -> ep thanh 1', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MUNULL', max_uses_per_user: null }),
    tests: created('max_uses_per_user', 1),
  }),
  tc('TC-API3-057', 'max_uses_per_user la chuoi rong -> ep thanh 1', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MUEMPTY', max_uses_per_user: '' }),
    tests: created('max_uses_per_user', 1),
  }),
  tc('TC-API3-058', 'Bien cheo: percent + discount_value = 100', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06PCT100', type: 'percent', discount_value: 100 }),
    desc: 'Tran khai niem cua percent; khong co tai lieu nao quy dinh nen khong bi chan.',
    tests: created('discount_value', 100),
  }),
  tc('TC-API3-059', 'Bien cheo: percent + discount_value = 101 (vuot tran khai niem)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06PCT101', type: 'percent', discount_value: 101 }),
    tests: created('discount_value', 101),
  }),
  tc('TC-API3-060', 'Bien cheo: type ngoai enum + discount_value', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06XENUM', type: 'installment', discount_value: 10 }),
    desc: 'He qua: apply-coupon se dien giai nhu fixed (nhanh else) - xem ghi chu §6.1.',
    tests: CREATED.concat([A.verifyCoupon('type', 'installment')]),
  }),
  tc('TC-API3-061', 'Header Authorization rong -> 403', {
    method: 'POST', path: P, auth: 'empty', body: cb({ code: 'HW06NEVER5' }),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API3-062', 'Header khong co dau cach phan tach -> 401', {
    method: 'POST', path: P, auth: 'noSpace', body: cb({ code: 'HW06NEVER6' }),
    tests: [A.status(401), A.jsonBody({ error: 'Unauthorized' })],
  }),
  tc('TC-API3-063', 'Scheme khong chuan (Basic) van duoc chap nhan', {
    method: 'POST', path: P, auth: 'basicAdmin', body: cb({ code: 'HW06BASIC' }),
    tests: created('code', 'HW06BASIC'),
  }),
  tc('TC-API3-064', 'JWT ky bang secret khac -> 403', {
    method: 'POST', path: P, auth: 'wrongSecret', body: cb({ code: 'HW06NEVER7' }),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API3-065', 'Token tu ky co exp qua khu -> 403', {
    method: 'POST', path: P, auth: 'expired', body: cb({ code: 'HW06NEVER8' }),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API3-066', 'Body JSON rong {} -> tao duoc coupon RONG', {
    method: 'POST', path: P, auth: 'admin', body: {},
    desc: 'INCOMPLETE da sua: probe that 200. code/type/discount_value/min_order_amount/expired_at deu null, chi max_uses_per_user = 1.',
    tests: CREATED.concat([A.verifyCoupon('code', null), A.verifyCoupon('type', null),
      A.verifyCoupon('discount_value', null), A.verifyCoupon('expired_at', null), A.verifyCoupon('max_uses_per_user', 1)]),
  }),
  tc('TC-API3-067', 'Khong gui body / sai Content-Type -> 500 dang HTML', {
    method: 'POST', path: P, auth: 'admin', body: '', noContentType: true,
    desc: 'INCOMPLETE da sua: probe that 500, body HTML (TypeError khi destructure req.body).',
    tests: [A.htmlNotJson(500)],
  }),
  tc('TC-API3-068', 'JSON sai cu phap -> 400 dang HTML (bodyParser)', {
    method: 'POST', path: P, auth: 'admin', body: '{"code":"A",',
    desc: 'INCOMPLETE da sua: probe that 400, body HTML sinh boi bodyParser truoc khi vao handler.',
    tests: [A.htmlNotJson(400)],
  }),
  tc('TC-API3-069', 'DELETE khong gui token -> 401', {
    method: 'DELETE', path: '/api/admin/coupons/5', auth: 'none',
    tests: [A.status(401), A.jsonBody({ error: 'Unauthorized' })],
  }),
  tc('TC-API3-070', 'DELETE voi :id khong phai so -> 200 du khong xoa gi', {
    method: 'DELETE', path: '/api/admin/coupons/abc', auth: 'admin',
    desc: 'INCOMPLETE da sua: probe that 200 - this.changes khong duoc kiem.',
    tests: [A.status(200), A.jsonBody({ message: 'Coupon deleted' }),
      ["pm.test('Khong coupon nao bi xoa (so luong khong doi)', function (done) {",
        "  var base = pm.environment.get('baseUrl');",
        "  var hdr = { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') };",
        "  pm.sendRequest({ url: base + '/api/coupons', method: 'GET', header: hdr }, function (e, r) {",
        "    if (e) { return done(e); }",
        "    try { pm.expect(r.json()).to.be.an('array').with.length.above(0); done(); } catch (er) { done(er); }",
        "  });",
        "});"].join('\n')],
  }),
  tc('TC-API3-071', 'DELETE voi payload SQL injection trong :id', {
    method: 'DELETE', path: '/api/admin/coupons/1%20OR%201=1', auth: 'admin',
    tests: [A.status(200), A.jsonBody({ message: 'Coupon deleted' }),
      ["pm.test('Coupon seed id=1 (SAVE10) KHONG bi xoa - tham so hoa dat', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.json().map(function (c) { return c.code; })).to.include('SAVE10'); done(); } catch (e) { done(e); } });",
        "});"].join('\n')],
  }),
  tc('TC-API3-072', 'code rat dai (5.000 ky tu)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'L'.repeat(5000) }),
    desc: 'Khong co rang buoc do dai o ca dac ta lan schema.',
    tests: CREATED.concat([
      ["pm.test('GET /api/coupons: code luu dung 5000 ky tu', function (done) {",
        "  var newId = pm.response.json().id;",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try {",
        "        var c = res.json().filter(function (x) { return x.id === newId; })[0];",
        "        pm.expect(c.code).to.have.lengthOf(5000);",
        "        done();",
        "      } catch (e) { done(e); }",
        "    });",
        "});"].join('\n')]),
  }),
  tc('TC-API3-073', 'code chi chua khoang trang', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: '   ' }),
    desc: 'Khong co trim hay format check.',
    tests: created('code', '   '),
  }),
  tc('TC-API3-074', 'code sai kieu (number) -> luu thanh chuoi', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 12345 }),
    tests: created('code', '12345'),
  }),
  tc('TC-API3-075', 'type sai kieu (number) -> luu thanh chuoi "1"', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06TYPENUM', type: 1 }),
    desc: 'Enum bi pha hoan toan: gia tri so tro thanh chuoi hop le trong cot TEXT.',
    tests: created('type', '1'),
  }),
  tc('TC-API3-076', 'discount_value la so thap phan -> luu nguyen 10.5', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06DVDEC', discount_value: 10.5 }),
    desc: 'Cot INTEGER khong ep vi se mat mat du lieu (REAL affinity rule).',
    tests: created('discount_value', 10.5),
  }),
  tc('TC-API3-077', 'min_order_amount sai kieu (boolean true) -> luu 1', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MOBOOL', min_order_amount: true }),
    tests: created('min_order_amount', 1),
  }),
  tc('TC-API3-078', 'expired_at co kem phan gio', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06EXPTIME', expired_at: '2099-12-31T23:59:59Z' }),
    tests: created('expired_at', '2099-12-31T23:59:59Z'),
  }),
  tc('TC-API3-079', 'expired_at sai kieu (timestamp so) -> luu nguyen so', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06EXPNUM', expired_at: 1735689600 }),
    desc: 'DATETIME chi la affinity nen so duoc luu nguyen.',
    tests: created('expired_at', 1735689600),
  }),
  tc('TC-API3-080', 'max_uses_per_user la so thap phan -> luu nguyen 1.5', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MUDEC', max_uses_per_user: 1.5 }),
    tests: created('max_uses_per_user', 1.5),
  }),
  tc('TC-API3-081a', 'max_uses_per_user = false -> ep thanh 1 (qua || 1)', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MUFALSE', max_uses_per_user: false }),
    desc: 'INVALID da sua: TC goc gop 2 input voi 2 expected. false la falsy nen || 1 chuyen thanh 1.',
    tests: created('max_uses_per_user', 1),
  }),
  tc('TC-API3-081b', 'max_uses_per_user = true -> cung luu 1 nhung KHAC co che', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MUTRUE', max_uses_per_user: true }),
    desc: 'true la truthy nen vuot || 1, roi SQLite ep boolean sang integer 1. Cung ket qua, khac nguyen nhan.',
    tests: created('max_uses_per_user', 1),
  }),
  tc('TC-API3-082', 'max_uses_per_user cuc lon', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'HW06MUBIG', max_uses_per_user: 999999999 }),
    tests: created('max_uses_per_user', 999999999),
  }),

  // ---------------- 5 test case tu bo sung ----------------
  tc('A3-E01', '[TU BO SUNG] So 0 van lot vao DB qua nga chuoi, vo hieu hoa chinh co che || 1', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: 'A3E01STR0', max_uses_per_user: '0' }),
    desc: 'Han che cua mo hinh: AI ly luan dung o tang JavaScript nhung dung lai, khong xuong tang luu tru.',
    tests: CREATED.concat([A.verifyCoupon('max_uses_per_user', 0),
      ["pm.test('Doi chieu: gui so 0 thi thanh 1, gui chuoi \"0\" thi thanh 0', function (done) {",
        "  var base = pm.environment.get('baseUrl');",
        "  var hdr = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') };",
        "  pm.sendRequest({ url: base + '/api/admin/coupons', method: 'POST', header: hdr,",
        "    body: { mode: 'raw', raw: JSON.stringify({ code: 'A3E01NUM0', type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 0 }) } },",
        "    function (e1, r1) {",
        "      if (e1) { return done(e1); }",
        "      var id2 = r1.json().id;",
        "      var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]'); ids.push(id2);",
        "      pm.collectionVariables.set('createdCouponIds', JSON.stringify(ids));",
        "      pm.sendRequest({ url: base + '/api/coupons', method: 'GET', header: hdr }, function (e2, r2) {",
        "        if (e2) { return done(e2); }",
        "        try {",
        "          var withNum = r2.json().filter(function (c) { return c.id === id2; })[0];",
        "          pm.expect(withNum.max_uses_per_user, 'so 0 phai bi ep thanh 1').to.eql(1);",
        "          done();",
        "        } catch (e) { done(e); }",
        "      });",
        "    });",
        "});"].join('\n')]),
  }),
  tc('A3-E02', '[TU BO SUNG] Coupon max_uses_per_user = 0 khien FR-09 chan vinh vien', {
    method: 'POST', path: '/api/apply-coupon', auth: 'none', body: { code: 'A3E02ZERO', total_amount: 500000, user_id: 2 },
    desc: 'BUG (he qua lien-API). Chat luong prompt: toi cat pham vi o ranh gioi 3 endpoint nen AI khong lan sang apply-coupon.',
    prerequest: mkCouponSetup(cb({ code: 'A3E02ZERO', min_order_amount: 0, max_uses_per_user: '0' }), 'zeroCouponId'),
    tests: [A.status(400),
      ["pm.test('Bi tu choi ngay lan dung DAU TIEN (usage_count 0 >= max 0)', function () {",
        "  // SUT tra thong bao tieng Viet co dau; dung escape unicode de file nguon khong dau",
        "  pm.expect(pm.response.json().error).to.include('gi' + String.fromCharCode(7899) + 'i h' + String.fromCharCode(7841) + 'n');",
        "  pm.expect(pm.response.json().error).to.include('0');",
        "});"].join('\n'),
      ["pm.test('Ghi nhan: coupon vua tao khong bao gio dung duoc', function () {",
        "  console.log('[BUG] coupon A3E02ZERO co max_uses_per_user = 0 -> vinh vien khong dung duoc: ' + pm.response.text());",
        "});"].join('\n')],
  }),
  tc('A3-E03', '[TU BO SUNG] code:null tao duoc nhieu lan, pha vo rang buoc unique cua FR-17', {
    method: 'POST', path: P, auth: 'admin', body: cb({ code: null }),
    desc: 'BUG. Han che cua mo hinh: AI test thuoc tinh cot thay vi rang buoc nghiep vu nen goi 1 lan thay vi 2.',
    prerequest: mkCouponSetup(cb({ code: null }), 'nullCoupon1'),
    tests: CREATED.concat([A.verifyCoupon('code', null),
      ["pm.test('Ca hai lan goi deu thanh cong voi id khac nhau (SQL coi moi NULL la khac biet)', function () {",
        "  var first = Number(pm.collectionVariables.get('nullCoupon1'));",
        "  var second = pm.response.json().id;",
        "  pm.expect(second).to.not.eql(first);",
        "  console.log('[BUG] 2 coupon code=null cung ton tai: id ' + first + ' va ' + second);",
        "});"].join('\n')]),
  }),
  tc('A3-E05', '[TU BO SUNG] discount_value am tao coupon LAM TANG tien phai tra', {
    method: 'POST', path: '/api/apply-coupon', auth: 'none', body: { code: 'A3E05NEG', total_amount: 500000, user_id: 2 },
    desc: 'BUG. Chat luong prompt: toi khong yeu cau AI danh gia he qua nghiep vu cua gia tri bien.',
    prerequest: mkCouponSetup(cb({ code: 'A3E05NEG', type: 'fixed', discount_value: -50000, min_order_amount: 0 }), 'negCouponId'),
    tests: [A.status(200),
      ["pm.test('final_amount = 550000 > total_amount = 500000 (giam gia lam tang tien)', function () {",
        "  var b = pm.response.json();",
        "  pm.expect(b.discount_amount).to.eql(-50000);",
        "  pm.expect(b.final_amount).to.eql(550000);",
        "  pm.expect(b.final_amount, 'so tien phai tra tang len').to.be.above(500000);",
        "});"].join('\n')],
  }),
  // A3-E04 dat CUOI folder: no xoa coupon SEED cua he thong
  tc('A3-E04', '[TU BO SUNG] User thuong xoa coupon SEED cua he thong (SAVE10)', {
    method: 'DELETE', path: '/api/admin/coupons/1', auth: 'user',
    desc: 'BUG. Chat luong prompt: toi nhan manh don du lieu do MINH tao nen AI khong nghi den viec pha du lieu goc. TC nay xoa coupon seed nen phai chay cuoi folder + can reset DB truoc lan chay sau.',
    tests: [A.status(200), A.jsonBody({ message: 'Coupon deleted' }),
      ["pm.test('SAVE10 bien mat khoi GET /api/coupons - user thuong pha duoc du lieu goc', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try {",
        "        pm.expect(res.json().map(function (c) { return c.code; })).to.not.include('SAVE10');",
        "        console.log('[BUG] coupon seed SAVE10 da bi mot user role=user xoa');",
        "        done();",
        "      } catch (e) { done(e); }",
        "    });",
        "});"].join('\n')],
  }),
];

module.exports = folder(
  'API3 - POST /api/admin/coupons (Pool C / FR-17)',
  items,
  '80 TC thuc thi (TC-040, -042, -043 bi loai vi la menh de tong hop; TC-081 tach thanh -081a/-081b) + 5 TC tu bo sung A3-E01..E05.'
);
