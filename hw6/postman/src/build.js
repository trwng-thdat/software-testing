// HW06 - bo sinh Postman collection + environment
// Chay: node hw6/postman/src/build.js
// Xuat : hw6/postman/EShop_HW06_API.postman_collection.json
//        hw6/postman/EShop_HW06.postman_environment.json
const fs = require('fs');
const path = require('path');
const { tc, folder } = require('./lib');

const OUT = path.resolve(__dirname, '..');
const STUDENT_ID = '23127344';
const SECRET = 'super_secret_key_that_should_not_be_here'; // server.js:9 - secret hardcode, day la mot phat hien cua bai

// ============================================================
// Pre-request script cap COLLECTION - chen header X-Student-Id vao MOI request
// Day la yeu cau §6.4 va la mot trong cac rang buoc chong gian lan §11 cua de bai
// ============================================================
const COLLECTION_PREREQUEST = [
  "// ===== HW06 - pre-request script cap collection =====",
  "// De bai §6.4: MOI request deu phai mang header X-Student-Id: {StudentID}",
  "// De bai §11: phai co anh chup console chung minh header nay do pre-request script chen",
  "var studentId = pm.environment.get('studentId');",
  "if (!studentId) { throw new Error('Thieu bien moi truong studentId - hay chon environment EShop_HW06'); }",
  "",
  "pm.request.headers.upsert({ key: 'X-Student-Id', value: studentId });",
  "",
  "console.log('[X-Student-Id] ' + studentId + ' -> ' + pm.request.method + ' ' + pm.request.url.toString());",
].join('\n');

// Test script cap COLLECTION - kiem chinh header vua chen (chay cho moi request)
const COLLECTION_TEST = [
  "// ===== HW06 - test script cap collection =====",
  "// Tu kiem tra rang header dinh danh sinh vien that su di theo request",
  "pm.test('[moi request] co header X-Student-Id = ' + pm.environment.get('studentId'), function () {",
  "  var sent = pm.request.headers.get('X-Student-Id');",
  "  pm.expect(sent).to.eql(pm.environment.get('studentId'));",
  "});",
].join('\n');

// ============================================================
// Folder 00 - Setup: dang nhap, tao user B, tu ky cac token gia mao
// ============================================================
const jwtHelper = [
  "// Tu ky JWT bang CryptoJS co san trong sandbox cua Postman.",
  "// Lam duoc dieu nay CHINH LA mot phat hien bao mat: SECRET_KEY bi hardcode trong server.js:9.",
  "function b64url(wordArray) {",
  "  return CryptoJS.enc.Base64.stringify(wordArray).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');",
  "}",
  "function signJwt(payload, secret) {",
  "  var h = b64url(CryptoJS.enc.Utf8.parse(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));",
  "  var p = b64url(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));",
  "  var sig = b64url(CryptoJS.HmacSHA256(h + '.' + p, secret));",
  "  return h + '.' + p + '.' + sig;",
  "}",
].join('\n');

const setupFolder = folder('00 - Setup (dang nhap, tao user B, tu ky token gia mao)', [
  tc('SETUP-01', 'Dang nhap admin -> tokenAdmin', {
    method: 'POST', path: '/api/login', auth: 'none',
    body: { email: '{{adminEmail}}', password: '{{adminPassword}}' },
    desc: 'Luu token admin vao environment de cac folder API dung lai.',
    tests: [
      ["pm.test('Dang nhap admin thanh cong', function () {",
        "  pm.response.to.have.status(200);",
        "  pm.expect(pm.response.json().token).to.be.a('string');",
        "  pm.expect(pm.response.json().user.role).to.eql('admin');",
        "});",
        "pm.environment.set('tokenAdmin', pm.response.json().token);",
        "pm.environment.set('adminId', pm.response.json().user.id);",
        "console.log('[SETUP] tokenAdmin da luu, admin id=' + pm.response.json().user.id);"].join('\n'),
    ],
  }),
  tc('SETUP-02', 'Dang nhap user A -> tokenUser', {
    method: 'POST', path: '/api/login', auth: 'none',
    body: { email: '{{userEmail}}', password: '{{userPassword}}' },
    tests: [
      ["pm.test('Dang nhap user A thanh cong', function () {",
        "  pm.response.to.have.status(200);",
        "  pm.expect(pm.response.json().token).to.be.a('string');",
        "});",
        "pm.environment.set('tokenUser', pm.response.json().token);",
        "// ban sao khong bao gio bi ghi de - dung cho cac assertion can token role=user nguyen goc",
        "pm.environment.set('tokenUserPlain', pm.response.json().token);",
        "pm.environment.set('userId', pm.response.json().user.id);",
        "console.log('[SETUP] tokenUser da luu, user A id=' + pm.response.json().user.id + ' role=' + pm.response.json().user.role);"].join('\n'),
      ["pm.test('[tien dieu kien] user A phai co role=\"user\" (DB vua reset)', function () {",
        "  pm.expect(pm.response.json().user.role).to.eql('user');",
        "});"].join('\n'),
    ],
  }),
  tc('SETUP-03', 'Tao user B (cho cac test IDOR)', {
    method: 'POST', path: '/api/register', auth: 'none',
    body: { name: 'User B HW06', email: '{{userBEmail}}', password: '{{userBPassword}}' },
    desc: 'Neu user B da ton tai thi register van tra 200 (bang users khong co UNIQUE tren email - mot quan sat khac).',
    tests: [
      ["pm.test('Dang ky user B tra 200', function () { pm.response.to.have.status(200); });",
        "console.log('[SETUP] user B da dang ky, id=' + pm.response.json().id);"].join('\n'),
    ],
  }),
  tc('SETUP-04', 'Dang nhap user B -> tokenUserB', {
    method: 'POST', path: '/api/login', auth: 'none',
    body: { email: '{{userBEmail}}', password: '{{userBPassword}}' },
    tests: [
      ["pm.test('Dang nhap user B thanh cong', function () {",
        "  pm.response.to.have.status(200);",
        "  pm.expect(pm.response.json().token).to.be.a('string');",
        "});",
        "pm.environment.set('tokenUserB', pm.response.json().token);",
        "pm.environment.set('userBId', pm.response.json().user.id);",
        "console.log('[SETUP] tokenUserB da luu, user B id=' + pm.response.json().user.id);"].join('\n'),
    ],
  }),
  tc('SETUP-05', 'Tu ky 7 token gia mao (chung minh SECRET_KEY bi hardcode)', {
    method: 'GET', path: '/api/products', auth: 'none',
    desc: 'Request nay chi de co mot buoc chay; viec chinh nam trong test script: tu ky token bang secret lo trong server.js:9.',
    tests: [
      jwtHelper + '\n\n' + [
        "var secret = pm.environment.get('secretKey');",
        "var past = 1700000000; // 2023-11-14, chac chan la qua khu",
        "",
        "pm.environment.set('tokenForgedId0', signJwt({ id: 0, role: 'user' }, secret));",
        "pm.environment.set('tokenForgedId1', signJwt({ id: 1, role: 'user' }, secret));",
        "pm.environment.set('tokenForgedId2', signJwt({ id: 2, role: 'user' }, secret));",
        "pm.environment.set('tokenForgedId999999', signJwt({ id: 999999, role: 'user' }, secret));",
        "pm.environment.set('tokenForgedAdminRole', signJwt({ id: 2, role: 'admin' }, secret));",
        "pm.environment.set('tokenExpired', signJwt({ id: 2, role: 'user', exp: past }, secret));",
        "pm.environment.set('tokenWrongSecret', signJwt({ id: 2, role: 'user' }, 'this_is_not_the_server_secret'));",
        "",
        "pm.test('Da tu ky duoc 7 token gia mao bang secret lay tu ma nguon (SEC-02)', function () {",
        "  ['tokenForgedId0', 'tokenForgedId1', 'tokenForgedId2', 'tokenForgedId999999',",
        "   'tokenForgedAdminRole', 'tokenExpired', 'tokenWrongSecret'].forEach(function (k) {",
        "    pm.expect(pm.environment.get(k), k).to.match(/^[\\w-]+\\.[\\w-]+\\.[\\w-]+$/);",
        "  });",
        "});",
        "",
        "pm.test('Token tu ky duoc SUT chap nhan -> secret hardcode la lo hong that', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenForgedId2'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) {",
        "      if (err) { return done(err); }",
        "      try {",
        "        pm.expect(res.code, 'token tu ky phai duoc chap nhan').to.eql(200);",
        "        pm.expect(res.json().id).to.eql(2);",
        "        done();",
        "      } catch (e) { done(e); }",
        "    });",
        "});",
        "",
        "pm.collectionVariables.set('createdCouponIds', '[]');",
      ].join('\n'),
    ],
  }),
], 'Dung du lieu nen cho ca suite. Cac token gia mao duoc TU KY bang CryptoJS voi secret lay tu server.js:9.');

// ============================================================
// Folder 99 - Teardown: xoa moi coupon do suite tao ra
// ============================================================
const teardownFolder = folder('99 - Teardown (don du lieu de chay lai duoc)', [
  tc('TEARDOWN-01', 'Xoa toan bo coupon do suite tao ra', {
    method: 'GET', path: '/api/coupons', auth: 'admin',
    desc: 'code cua coupon la UNIQUE nen khong don du lieu = khong chay lai duoc suite. Day la ly do TC-API3-044 xac thuc co che nay.',
    tests: [
      ["var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]');",
        "console.log('[TEARDOWN] se xoa ' + ids.length + ' coupon do suite tao: ' + JSON.stringify(ids));",
        "",
        "pm.test('Xoa het coupon do suite tao ra', function (done) {",
        "  var base = pm.environment.get('baseUrl');",
        "  var hdr = { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') };",
        "  var i = 0, failed = [];",
        "  (function next() {",
        "    if (i >= ids.length) {",
        "      try { pm.expect(failed, 'cac id xoa khong thanh cong').to.eql([]); done(); } catch (e) { done(e); }",
        "      return;",
        "    }",
        "    var id = ids[i++];",
        "    pm.sendRequest({ url: base + '/api/admin/coupons/' + id, method: 'DELETE', header: hdr }, function (err, res) {",
        "      if (err || !res || res.code !== 200) { failed.push(id); }",
        "      next();",
        "    });",
        "  })();",
        "});",
        "",
        "pm.test('Dua profile user A ve trang thai seed (role=user)', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'PUT',",
        "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenUserPlain'), 'X-Student-Id': pm.environment.get('studentId') },",
        "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Test User', shipping_address: null, phone: null, role: 'user' }) } },",
        "    function (err, res) { if (err) { return done(err); } pm.expect(res.code).to.eql(200); done(); });",
        "});"].join('\n'),
    ],
  }),
], 'Chay cuoi cung. Khong bat buoc neu ban reset DB (node database.js) truoc moi lan chay.');

// ============================================================
// Folder chay theo du lieu (Collection Runner + data file CSV)
// ============================================================
const ddApi1 = folder('DATA1 - Chay theo du lieu: phone (FR-04)', [
  tc('DD-API1-PHONE', 'Bien phone doc tu data file CSV (newman -d)', {
    method: 'PUT', path: '/api/users/me',
    body: { name: 'Data Driven {{caseId}}', shipping_address: '123 Le Loi', phone: '{{phoneValue}}' },
    desc: 'Moi dong CSV la mot lan chay. Cot: caseId, phoneValue, digits, expectedStatus, note. Bao phu lai nhom bien FR-04 (9/10/11/12 chu so, khong bat dau 0, co ky tu la) bang co che data-driven.',
    tests: [
      ["pm.test('Status = ' + pm.iterationData.get('expectedStatus') + ' (dong CSV ' + pm.iterationData.get('caseId') + ')', function () {",
        "  pm.response.to.have.status(Number(pm.iterationData.get('expectedStatus')));",
        "});",
        "",
        "pm.test('GET /api/users/me luu dung gia tri phone tu CSV', function (done) {",
        "  var expected = String(pm.iterationData.get('phoneValue'));",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenUser'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.json().phone).to.eql(expected); done(); } catch (e) { done(e); } });",
        "});",
        "",
        "pm.test('FR-04 (10-11 chu so, bat dau 0) KHONG duoc thuc thi o backend', function () {",
        "  var v = String(pm.iterationData.get('phoneValue'));",
        "  var hopLeTheoFR04 = /^0[0-9]{9,10}$/.test(v);",
        "  var note = pm.iterationData.get('note');",
        "  console.log('[DATA] ' + pm.iterationData.get('caseId') + ' phone=' + v + ' hopLeTheoFR04=' + hopLeTheoFR04 + ' | ' + note);",
        "  // Backend chap nhan ca hai nhom -> chinh la khoang trong kiem thu",
        "  pm.expect(pm.response.code).to.eql(200);",
        "});"].join('\n'),
    ],
  }),
], 'Chi chay bang: newman -d hw6/postman/data/api1_phone.csv');


const ddApi2 = folder('DATA2 - Chay theo du lieu: chuyen trang thai don hang (FR-10)', [
  tc('DD-API2-STATE', 'Chuoi trang thai doc tu data file CSV (newman -d)', {
    method: 'PUT', path: '/api/orders/{{orderId}}/cancel',
    desc: 'Cot CSV: caseId, stateChain (phan cach |, gia tri dac biet cancel), expectedStatus, expectedFinalStatus, note. Bang chuyen trang thai FR-10 von da la mot bang nen rat phu hop chay theo du lieu: moi dong CSV = mot o trong ma tran o §5.1.',
      prerequest: [
        "// Dung trang thai don hang theo cot stateChain cua data file (phan cach bang |).",
        "// Gia tri dac biet 'cancel' = goi PUT /api/orders/:id/cancel bang token user.",
        "function hwHeaders(tokenVar) {",
        "  var h = { 'Content-Type': 'application/json', 'X-Student-Id': pm.environment.get('studentId') };",
        "  if (tokenVar) { h['Authorization'] = 'Bearer ' + pm.environment.get(tokenVar); }",
        "  return h;",
        "}",
        "function hwUrl(p) { return pm.environment.get('baseUrl') + p; }",
        "",
        "var raw = pm.iterationData.get('stateChain') || '';",
        "var chain = raw ? String(raw).split('|').filter(function (x) { return x; }) : [];",
        "pm.sendRequest({ url: hwUrl('/api/checkout'), method: 'POST', header: hwHeaders('tokenUser'),",
        "  body: { mode: 'raw', raw: JSON.stringify({ total_amount: 500000, shipping_address: 'HW06 data-driven state' }) } },",
        "  function (err, res) {",
        "    if (err) { console.log('[SETUP] loi checkout', err); return; }",
        "    var oid = res.json().orderId;",
        "    pm.collectionVariables.set('orderId', oid);",
        "    console.log('[SETUP] ' + pm.iterationData.get('caseId') + ': don #' + oid + ' (pending), chuoi = ' + JSON.stringify(chain));",
        "    var i = 0;",
        "    (function next() {",
        "      if (i >= chain.length) { return; }",
        "      var st = chain[i++];",
        "      if (st === 'cancel') {",
        "        pm.sendRequest({ url: hwUrl('/api/orders/' + oid + '/cancel'), method: 'PUT', header: hwHeaders('tokenUser') },",
        "          function (e2, r2) { console.log('[SETUP] don #' + oid + ' -> user huy (HTTP ' + (r2 && r2.code) + ')'); next(); });",
        "      } else {",
        "        pm.sendRequest({ url: hwUrl('/api/admin/orders/' + oid + '/status'), method: 'PUT', header: hwHeaders('tokenAdmin'),",
        "          body: { mode: 'raw', raw: JSON.stringify({ status: st }) } },",
        "          function (e2, r2) { console.log('[SETUP] don #' + oid + ' -> ' + st + ' (HTTP ' + (r2 && r2.code) + ')'); next(); });",
        "      }",
        "    })();",
        "  });",
      ].join('\n'),
      tests: [
        ["pm.test('Status = ' + pm.iterationData.get('expectedStatus') + ' (dong CSV ' + pm.iterationData.get('caseId') + ')', function () {",
        "  pm.response.to.have.status(Number(pm.iterationData.get('expectedStatus')));",
        "});",
        "",
        "pm.test('Trang thai cuoi cua don = ' + pm.iterationData.get('expectedFinalStatus'), function (done) {",
        "  var oid = Number(pm.collectionVariables.get('orderId'));",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/orders/' + oid, method: 'GET',",
        "    header: { 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) {",
        "      if (err) { return done(err); }",
        "      try {",
        "        pm.expect(res.json().status).to.eql(pm.iterationData.get('expectedFinalStatus'));",
        "        console.log('[DATA] ' + pm.iterationData.get('caseId') + ' -> HTTP ' + pm.response.code + ', status cuoi = ' + res.json().status + ' | ' + pm.iterationData.get('note'));",
        "        done();",
        "      } catch (e) { done(e); }",
        "    });",
        "});"].join('\n'),
        ["// Ghi nhan rieng cho dong DD-O03: day la lan chay theo du lieu bat duoc BUG-06.",
        "pm.test('FR-10: chi pending/confirmed moi duoc huy - ghi nhan neu shipping cung huy duoc', function () {",
        "  var chain = String(pm.iterationData.get('stateChain') || '');",
        "  if (chain.indexOf('shipping') >= 0 && chain.indexOf('delivered') < 0) {",
        "    pm.expect(pm.response.code, 'ghi nhan hanh vi thuc te').to.eql(200);",
        "    console.log('[BUG-06] don o trang thai shipping bi user huy thanh cong (HTTP 200) - trai FR-10');",
        "  } else {",
        "    pm.expect(true).to.be.true;",
        "  }",
        "});"].join('\n')],
  }),
], 'Chi chay bang: newman -d hw6/postman/data/api2_state.csv');

const ddApi3 = folder('DATA3 - Chay theo du lieu: coupon (FR-17)', [
  tc('DD-API3-COUPON', 'Bien coupon doc tu data file CSV (newman -d)', {
    method: 'POST', path: '/api/admin/coupons', auth: 'admin',
    body: {
      code: '{{couponCode}}', type: '{{couponType}}', discount_value: '{{discountValue}}',
      min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: '{{maxUses}}',
    },
    desc: 'Cot CSV: caseId, couponCode, couponType, discountValue, maxUses, expectedStored, note.',
    tests: [
      ["pm.test('Tao coupon thanh cong (dong CSV ' + pm.iterationData.get('caseId') + ')', function () {",
        "  pm.response.to.have.status(200);",
        "  pm.expect(pm.response.json()).to.have.property('id');",
        "});",
        "",
        "var ids = JSON.parse(pm.collectionVariables.get('createdCouponIds') || '[]');",
        "ids.push(pm.response.json().id);",
        "pm.collectionVariables.set('createdCouponIds', JSON.stringify(ids));",
        "",
        "pm.test('max_uses_per_user luu thanh ' + pm.iterationData.get('expectedStored'), function (done) {",
        "  var newId = pm.response.json().id;",
        "  var expected = Number(pm.iterationData.get('expectedStored'));",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/coupons', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try {",
        "        var c = res.json().filter(function (x) { return x.id === newId; })[0];",
        "        pm.expect(c.max_uses_per_user).to.eql(expected);",
        "        console.log('[DATA] ' + pm.iterationData.get('caseId') + ' gui=' + JSON.stringify(pm.iterationData.get('maxUses')) + ' -> luu=' + c.max_uses_per_user + ' | ' + pm.iterationData.get('note'));",
        "        done();",
        "      } catch (e) { done(e); }",
        "    });",
        "});"].join('\n'),
    ],
  }),
], 'Chi chay bang: newman -d hw6/postman/data/api3_coupon.csv');

// ============================================================
// Ghep collection
// ============================================================
const collection = {
  info: {
    _postman_id: 'hw06-23127344-eshop-api',
    name: 'HW06 - EShop API Testing (23127344)',
    description: [
      '# HW06 - Kiem thu API (API Testing)',
      '',
      '- **Sinh vien:** Truong Thanh Dat - 23127344 - 23KTPM3',
      '- **SUT:** EShop (group05_eshop) tai `http://localhost:3000`',
      '- **3 API duoc chon:** `PUT /api/users/me` (Pool A / FR-04) · `PUT /api/orders/:id/cancel` (Pool B / FR-10) · `POST /api/admin/coupons` (Pool C / FR-17)',
      '',
      '## Truoc khi chay',
      '',
      '```bash',
      'cd group05_eshop/backend && node database.js && node server.js',
      '```',
      '',
      'Moi folder API nen chay tren DB vua reset - mot so TC bien (`TC-API2-010/011`) kiem tra tien dieu kien nay va se FAIL co y neu DB khong sach.',
      '',
      '## Header X-Student-Id',
      '',
      'Duoc chen tu dong vao MOI request bang pre-request script cap collection va duoc tu kiem tra bang test script cap collection (de bai §6.4 va §11).',
    ].join('\n'),
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  event: [
    { listen: 'prerequest', script: { type: 'text/javascript', exec: COLLECTION_PREREQUEST.split('\n') } },
    { listen: 'test', script: { type: 'text/javascript', exec: COLLECTION_TEST.split('\n') } },
  ],
  variable: [
    { key: 'createdCouponIds', value: '[]', type: 'string' },
    { key: 'orderId', value: '', type: 'string' },
  ],
  item: [
    setupFolder,
    require('./api1'),
    require('./api2'),
    require('./api3'),
    require('./spec'),
    ddApi1,
    ddApi2,
    ddApi3,
    teardownFolder,
  ],
};

// ============================================================
// Environment
// ============================================================
const environment = {
  id: 'hw06-23127344-env',
  name: 'EShop_HW06_local',
  values: [
    { key: 'baseUrl', value: 'http://localhost:3000', type: 'default', enabled: true },
    { key: 'studentId', value: STUDENT_ID, type: 'default', enabled: true },
    { key: 'secretKey', value: SECRET, type: 'default', enabled: true },
    { key: 'adminEmail', value: 'admin@eshop.com', type: 'default', enabled: true },
    { key: 'adminPassword', value: 'Admin123!', type: 'default', enabled: true },
    { key: 'userEmail', value: 'test@eshop.com', type: 'default', enabled: true },
    { key: 'userPassword', value: 'Test1234!', type: 'default', enabled: true },
    { key: 'userBEmail', value: 'userb.hw06@eshop.com', type: 'default', enabled: true },
    { key: 'userBPassword', value: 'UserB123!', type: 'default', enabled: true },
    // cac bien duoi day duoc Setup ghi luc chay
    { key: 'tokenAdmin', value: '', type: 'default', enabled: true },
    { key: 'tokenUser', value: '', type: 'default', enabled: true },
    { key: 'tokenUserPlain', value: '', type: 'default', enabled: true },
    { key: 'tokenUserB', value: '', type: 'default', enabled: true },
    { key: 'tokenForgedId0', value: '', type: 'default', enabled: true },
    { key: 'tokenForgedId1', value: '', type: 'default', enabled: true },
    { key: 'tokenForgedId2', value: '', type: 'default', enabled: true },
    { key: 'tokenForgedId999999', value: '', type: 'default', enabled: true },
    { key: 'tokenForgedAdminRole', value: '', type: 'default', enabled: true },
    { key: 'tokenExpired', value: '', type: 'default', enabled: true },
    { key: 'tokenWrongSecret', value: '', type: 'default', enabled: true },
    { key: 'adminId', value: '', type: 'default', enabled: true },
    { key: 'userId', value: '', type: 'default', enabled: true },
    { key: 'userBId', value: '', type: 'default', enabled: true },
  ],
  _postman_variable_scope: 'environment',
};

// ============================================================
// Xuat file + thong ke
// ============================================================
fs.writeFileSync(path.join(OUT, 'EShop_HW06_API.postman_collection.json'), JSON.stringify(collection, null, 2), 'utf8');
fs.writeFileSync(path.join(OUT, 'EShop_HW06.postman_environment.json'), JSON.stringify(environment, null, 2), 'utf8');

const count = (f) => f.item.length;
const assertions = (f) => f.item.reduce((n, it) => {
  const t = (it.event.filter((e) => e.listen === 'test')[0] || { script: { exec: [] } }).script.exec.join('\n');
  return n + (t.match(/pm\.test\(/g) || []).length;
}, 0);

console.log('Da xuat:');
console.log('  ' + path.join(OUT, 'EShop_HW06_API.postman_collection.json'));
console.log('  ' + path.join(OUT, 'EShop_HW06.postman_environment.json'));
console.log('');
console.log('Folder'.padEnd(56), 'Request', 'pm.test');
collection.item.forEach((f) => {
  console.log('  ' + f.name.padEnd(54), String(count(f)).padStart(5), String(assertions(f)).padStart(7));
});
const totalReq = collection.item.reduce((n, f) => n + count(f), 0);
const totalAss = collection.item.reduce((n, f) => n + assertions(f), 0);
console.log('  ' + 'TONG'.padEnd(54), String(totalReq).padStart(5), String(totalAss).padStart(7));
console.log('');
console.log('Luu y: moi request con them 1 assertion X-Student-Id tu test script cap collection,');
console.log('nen so assertion thuc te khi chay = ' + totalAss + ' + so request da chay.');
