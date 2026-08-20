// HW06 - Folder SPEC: assertion viet theo DAC TA, khong theo hanh vi thuc te.
//
// Vi sao can folder rieng nay:
//   Trong 3 folder API1/API2/API3, moi assertion ma hoa HANH VI THUC TE cua SUT
//   (characterization test) - nho vay ca bo test xanh va dung lam moc hoi quy: bat cu
//   thay doi hanh vi nao ve sau se lam do bo test.
//   Nhung mot bug chi thuc su duoc "bao cao" khi co mot assertion NOI RO dieu dac ta
//   yeu cau va assertion do THAT BAI. Do chinh la folder nay.
//
// => Cac TC trong folder nay CO Y DINH THAT BAI. Moi assertion fail = mot bug co that,
//    kem dan chieu FR/SEC va dong ma nguon. Day cung la lan chay "do" dung cho CI/CD (§8.2).
const { A, tc, folder } = require('./lib');

const spec = (id, title, refs, specText, spec_) => tc(id, title, Object.assign({
  desc: 'DAN CHIEU: ' + refs + ' | DAC TA YEU CAU: ' + specText,
}, spec_));

const items = [
  // ================= API 1 - PUT /api/users/me =================
  spec('SPEC-BUG-01', '[SEC-06] Client KHONG duoc phep tu doi role qua PUT /api/users/me', 'SEC-06 (README §9), FR-04, server.js:124-127',
    'API cap nhat ho so khong duoc cho client thay doi role. Ky vong: role trong DB van la "user" sau khi gui role="admin".', {
    method: 'PUT', path: '/api/users/me', body: { name: 'SPEC-BUG-01', shipping_address: 'x', phone: '0912345678', role: 'admin' },
    tests: [A.status(200), A.verifyProfileThenRestoreRole('role', 'user')],
  }),
  spec('SPEC-BUG-02', '[SEC-01] GET /api/users/me KHONG duoc tra ve mat khau', 'SEC-01 (README §9), server.js:112-116',
    'Mat khau khong duoc luu plaintext va khong duoc lo ra response. Ky vong: response khong co truong password.', {
    method: 'GET', path: '/api/users/me',
    tests: [A.status(200), A.notHasKey('password')],
  }),
  spec('SPEC-BUG-03', '[SEC-02] Token tu ky bang secret hardcode KHONG duoc chap nhan', 'SEC-02 (README §9), server.js:9 va :104',
    'Chi token do server phat hanh moi hop le. Ky vong: token tu ky mao danh id=1 (admin) bi tu choi 401/403.', {
    method: 'PUT', path: '/api/users/me', auth: 'forgedId1',
    body: { name: 'SPEC-BUG-03 khong duoc ghi', shipping_address: 'x', phone: '0912345678' },
    tests: [
      ["pm.test('Token mao danh phai bi tu choi (401 hoac 403), KHONG duoc tra 200', function () {",
        "  pm.expect(pm.response.code, 'ma trang thai').to.be.oneOf([401, 403]);",
        "});"].join('\n'),
      ["pm.test('[cleanup] tra ten admin ve gia tri seed neu da bi ghi', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'PUT',",
        "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') },",
        "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Admin User', shipping_address: null, phone: null, role: 'admin' }) } },",
        "    function (err, res) { if (err) { return done(err); } pm.expect(res.code).to.eql(200); done(); });",
        "});"].join('\n')],
  }),
  spec('SPEC-BUG-04', '[FR-04] phone phai la 10-11 chu so va bat dau bang 0', 'FR-04 (api_specification.md §2.2)',
    'Backend phai tu choi phone sai dinh dang. Ky vong: gui phone="abc" tra ve loi 400.', {
    method: 'PUT', path: '/api/users/me', body: { name: 'SPEC-BUG-04', shipping_address: 'x', phone: 'abc' },
    tests: [
      ["pm.test('phone sai dinh dang phai bi tu choi 400', function () {",
        "  pm.expect(pm.response.code).to.eql(400);",
        "});"].join('\n')],
  }),
  spec('SPEC-BUG-05', '[SEC-03] GET /api/admin/users phai kiem role="admin" trong token', 'SEC-03 (README §9), server.js:494',
    'Endpoint admin phai tu choi token co role="user". Ky vong: 403.', {
    method: 'GET', path: '/api/admin/users', auth: 'user',
    tests: [
      ["pm.test('Token role=user phai bi tu choi 403 o endpoint admin', function () {",
        "  pm.expect(pm.response.code).to.eql(403);",
        "});"].join('\n')],
  }),

  // ================= API 2 - PUT /api/orders/:id/cancel =================
  spec('SPEC-BUG-06', '[FR-10] User KHONG duoc huy don dang shipping', 'FR-10 (api_specification.md §4.6), server.js:328',
    'Chi don pending/confirmed moi huy duoc. Ky vong: huy don shipping bi tu choi 400 va don giu nguyen trang thai shipping.', {
    method: 'PUT', path: '/api/orders/{{orderId}}/cancel',
    prerequest: require('./lib').mkOrderSetup(['confirmed', 'shipping']),
    tests: [
      ["pm.test('Huy don shipping phai bi tu choi 400', function () { pm.expect(pm.response.code).to.eql(400); });"].join('\n'),
      A.verifyOrderStatusPublic('shipping')],
  }),
  spec('SPEC-BUG-07', '[FR-10] canceled la trang thai KET THUC, khong the chuyen sang delivered', 'FR-10, server.js:551',
    'Khong duoc phep roi khoi trang thai ket thuc. Ky vong: admin doi canceled -> delivered bi tu choi 400.', {
    method: 'PUT', path: '/api/admin/orders/{{orderId}}/status', auth: 'admin', body: { status: 'delivered' },
    prerequest: require('./lib').mkOrderSetup([], { after: require('./lib').AFTER_CANCEL_ONCE }),
    tests: [
      ["pm.test('canceled -> delivered phai bi tu choi 400', function () { pm.expect(pm.response.code).to.eql(400); });"].join('\n'),
      A.verifyOrderStatusPublic('canceled')],
  }),
  spec('SPEC-BUG-08', '[SEC-02] GET /api/orders/:id phai yeu cau xac thuc', 'SEC-02 (README §9), server.js:344',
    'Moi API doc du lieu don hang phai yeu cau JWT hop le. Ky vong: goi khong token bi tu choi 401.', {
    method: 'GET', path: '/api/orders/{{orderId}}', auth: 'none',
    prerequest: require('./lib').mkOrderSetup([]),
    tests: [
      ["pm.test('Doc don hang khong token phai bi tu choi 401', function () { pm.expect(pm.response.code).to.eql(401); });"].join('\n')],
  }),
  spec('SPEC-BUG-09', '[FR-10] Thong bao loi phai cho biet ly do khong huy duoc', 'FR-10 ("thong bao phu hop"), server.js:329',
    'Thong bao loi phai phan biet duoc don da giao va don da huy. Ky vong: thong bao co nhac trang thai hien tai.', {
    method: 'PUT', path: '/api/orders/{{orderId}}/cancel',
    prerequest: require('./lib').mkOrderSetup(['confirmed', 'shipping', 'delivered']),
    tests: [A.status(400),
      ["pm.test('Thong bao 400 phai nhac trang thai hien tai (delivered)', function () {",
        "  pm.expect(pm.response.json().error.toLowerCase()).to.include('delivered');",
        "});"].join('\n')],
  }),

  // ================= API 3 - POST /api/admin/coupons =================
  spec('SPEC-BUG-10', '[SEC-03] User thuong KHONG duoc tao coupon', 'SEC-03 (README §9), FR-17, server.js:457',
    'API admin phai kiem role="admin" trong token. Ky vong: token role="user" bi tu choi 403.', {
    method: 'POST', path: '/api/admin/coupons', auth: 'user',
    body: { code: 'SPECBUG10', type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 },
    tests: [
      ["pm.test('User thuong tao coupon phai bi tu choi 403', function () { pm.expect(pm.response.code).to.eql(403); });",
        "// neu van tao duoc thi ghi nhan id de teardown xoa",
        "if (pm.response.code === 200 && pm.response.json().id) {",
        "  var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]');",
        "  ids.push(pm.response.json().id); pm.collectionVariables.set('createdCouponIds', JSON.stringify(ids));",
        "}"].join('\n')],
  }),
  spec('SPEC-BUG-11', '[SEC-03] User thuong KHONG duoc xoa coupon he thong', 'SEC-03 (README §9), server.js:483',
    'Ky vong: user role="user" goi DELETE /api/admin/coupons/2 (BIGBUY) bi tu choi 403 va coupon van con.', {
    method: 'DELETE', path: '/api/admin/coupons/2', auth: 'user',
    tests: [
      ["pm.test('User thuong xoa coupon phai bi tu choi 403', function () { pm.expect(pm.response.code).to.eql(403); });"].join('\n'),
      ["pm.test('Coupon BIGBUY phai con trong GET /api/coupons', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.json().map(function (c) { return c.code; })).to.include('BIGBUY'); done(); } catch (e) { done(e); } });",
        "});"].join('\n')],
  }),
  spec('SPEC-BUG-12', '[FR-17] discount_value phai > 0', 'FR-17 (api_specification.md §6.4)',
    'Ky vong: discount_value = -50000 bi tu choi 400.', {
    method: 'POST', path: '/api/admin/coupons', auth: 'admin',
    body: { code: 'SPECBUG12', type: 'fixed', discount_value: -50000, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 },
    tests: [
      ["pm.test('discount_value am phai bi tu choi 400', function () { pm.expect(pm.response.code).to.eql(400); });",
        "if (pm.response.code === 200 && pm.response.json().id) {",
        "  var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]');",
        "  ids.push(pm.response.json().id); pm.collectionVariables.set('createdCouponIds', JSON.stringify(ids));",
        "}"].join('\n')],
  }),
  spec('SPEC-BUG-13', '[FR-17] max_uses_per_user phai >= 1', 'FR-17 (api_specification.md §6.4), server.js:474',
    'Ky vong: gui max_uses_per_user="0" bi tu choi 400, hoac it nhat gia tri luu vao DB phai >= 1.', {
    method: 'POST', path: '/api/admin/coupons', auth: 'admin',
    body: { code: 'SPECBUG13', type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: '0' },
    tests: [
      ["pm.test('max_uses_per_user = \"0\" phai bi tu choi 400', function () { pm.expect(pm.response.code).to.eql(400); });",
        "if (pm.response.code === 200 && pm.response.json().id) {",
        "  var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]');",
        "  ids.push(pm.response.json().id); pm.collectionVariables.set('createdCouponIds', JSON.stringify(ids));",
        "}"].join('\n'),
      ["pm.test('Gia tri luu vao DB phai >= 1 (khong duoc la 0)', function (done) {",
        "  if (pm.response.code !== 200) { return done(); }",
        "  var newId = pm.response.json().id;",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try {",
        "        var c = res.json().filter(function (x) { return x.id === newId; })[0];",
        "        pm.expect(c.max_uses_per_user, 'gia tri luu trong DB').to.be.at.least(1);",
        "        done();",
        "      } catch (e) { done(e); }",
        "    });",
        "});"].join('\n')],
  }),
  spec('SPEC-BUG-14', '[FR-17] code phai la duy nhat - null khong duoc pha vo rang buoc', 'FR-17 (code unique), database.js:31',
    'Ky vong: goi POST hai lan voi code=null thi lan thu hai bi tu choi (400/409).', {
    method: 'POST', path: '/api/admin/coupons', auth: 'admin',
    body: { code: null, type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 },
    prerequest: require('./lib').mkCouponSetup(
      { code: null, type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 },
      'specNullCoupon'),
    tests: [
      ["pm.test('Coupon thu hai voi code=null phai bi tu choi (400 hoac 409)', function () {",
        "  pm.expect(pm.response.code).to.be.oneOf([400, 409]);",
        "});",
        "if (pm.response.code === 200 && pm.response.json().id) {",
        "  var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]');",
        "  ids.push(pm.response.json().id); pm.collectionVariables.set('createdCouponIds', JSON.stringify(ids));",
        "}"].join('\n')],
  }),
  spec('SPEC-BUG-15', '[Xu ly loi] Trung code phai tra 409, khong duoc tra 500 kem text driver', 'FR-17, server.js:476',
    'Ky vong: trung code tra 409 (hoac 400) va thong bao khong duoc lo chi tiet SQLite.', {
    method: 'POST', path: '/api/admin/coupons', auth: 'admin',
    body: { code: 'SAVE10', type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 1 },
    tests: [
      ["pm.test('Trung code phai tra 409/400, khong phai 500', function () {",
        "  pm.expect(pm.response.code).to.be.oneOf([400, 409]);",
        "});"].join('\n'),
      ["pm.test('Thong bao loi khong duoc lo chi tiet noi bo cua SQLite', function () {",
        "  pm.expect(pm.response.text()).to.not.include('SQLITE_CONSTRAINT');",
        "});"].join('\n')],
  }),
  spec('SPEC-BUG-16', '[Xu ly loi] Thieu body phai tra 400 JSON, khong duoc 500 HTML', 'api_specification.md §6.4 (dinh dang loi JSON)',
    'Ky vong: POST khong body tra 400 va body la JSON co key error.', {
    method: 'POST', path: '/api/admin/coupons', auth: 'admin', body: '', noContentType: true,
    tests: [
      ["pm.test('Thieu body phai tra 400 (khong phai 500)', function () { pm.expect(pm.response.code).to.eql(400); });"].join('\n'),
      ["pm.test('Body loi phai la JSON co key error', function () {",
        "  var j = null; try { j = pm.response.json(); } catch (e) { /* HTML */ }",
        "  pm.expect(j, 'response phai parse duoc thanh JSON').to.not.be.null;",
        "  pm.expect(j).to.have.property('error');",
        "});"].join('\n')],
  }),
];

module.exports = folder(
  'SPEC - Assertion theo dac ta (CO Y DINH THAT BAI - phoi bay bug)',
  items,
  '16 TC ma hoa dieu DAC TA yeu cau. Moi assertion that bai o day = mot bug co that trong SUT. '
  + 'Folder nay KHONG duoc dua vao lan chay xanh cua CI; no chinh la lan chay do (§8.2).'
);
