// HW06 - API 1: PUT /api/users/me (Pool A / FR-04)
// 42 test case do AI sinh (TC-API1-001..042, trong do -034 da gop vao -023) + 5 TC tu bo sung (A1-E01..E05)
// Moi Expected duoi day da doi chieu voi probe SUT that (hw6/scripts/probe.js, probe2.js)
const { A, SCHEMA, tc, folder } = require('./lib');

const P = '/api/users/me';
const OK = { message: 'Profile updated' };
const base = (extra) => Object.assign({ name: 'Nguyen Van A', shipping_address: '123 Le Loi', phone: '0912345678' }, extra || {});

// Sau moi TC lam thay doi role, tra role ve "user" de suite chay lai duoc nhieu lan
const restoreRole = [
  "pm.test('[cleanup] tra role ve \"user\"', function (done) {",
  "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'PUT',",
  "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenUser'), 'X-Student-Id': pm.environment.get('studentId') },",
  "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Test User', shipping_address: 'reset', phone: '0912345678', role: 'user' }) } },",
  "    function (err, res) { if (err) { return done(err); } pm.expect(res.code).to.eql(200); done(); });",
  "});",
].join('\n');

const items = [
  // ---------------- Phan vung mien gia tri (EP) ----------------
  tc('TC-API1-001', 'Cap nhat ho so hop le (happy path)', {
    method: 'PUT', path: P, body: base(),
    desc: 'COV-001,047 - FR-04 §2.2. Happy path: 3 truong hop le.',
    tests: [A.status(200), A.jsonBody(OK), A.verifyProfile('name', 'Nguyen Van A'),
      A.verifyProfile('shipping_address', '123 Le Loi'), A.verifyProfile('phone', '0912345678')],
  }),
  tc('TC-API1-002', 'Thieu truong name -> GHI DE thanh null', {
    method: 'PUT', path: P, body: { shipping_address: '123 Le Loi', phone: '0912345678' },
    desc: 'COV-013. Kiem toan: AI chi assert 200; server.js:121 ghi name VO DIEU KIEN nen bo truong = xoa gia tri cu.',
    tests: [A.status(200), A.jsonBody(OK), A.verifyProfile('name', null)],
  }),
  tc('TC-API1-003', 'name la chuoi rong', {
    method: 'PUT', path: P, body: base({ name: '' }),
    tests: [A.status(200), A.verifyProfile('name', '')],
  }),
  tc('TC-API1-004', 'name sai kieu (number) -> luu thanh chuoi', {
    method: 'PUT', path: P, body: base({ name: 12345 }),
    desc: 'INVALID da sua: AI viet "200 hoac 500". Probe that: 200, TEXT affinity luu "12345".',
    tests: [A.status(200), A.verifyProfile('name', '12345')],
  }),
  tc('TC-API1-005', 'Thieu truong shipping_address -> GHI DE thanh null', {
    method: 'PUT', path: P, body: { name: 'Nguyen Van A', phone: '0912345678' },
    tests: [A.status(200), A.verifyProfile('shipping_address', null)],
  }),
  tc('TC-API1-006', 'shipping_address sai kieu (object) -> "[object Object]"', {
    method: 'PUT', path: P, body: base({ shipping_address: { street: '123 Le Loi' } }),
    desc: 'INVALID da sua. Probe that: 200 va luu chuoi "[object Object]" - hong du lieu tham lang.',
    tests: [A.status(200), A.verifyProfile('shipping_address', '[object Object]')],
  }),
  tc('TC-API1-007', 'Gui key camelCase shippingAddress -> bi bo qua', {
    method: 'PUT', path: P, body: { name: 'Nguyen Van A', shippingAddress: '789 Nguyen Hue', phone: '0912345678' },
    tests: [A.status(200), A.verifyProfile('shipping_address', null)],
  }),
  tc('TC-API1-008', 'Thieu truong phone -> GHI DE thanh null', {
    method: 'PUT', path: P, body: { name: 'Nguyen Van A', shipping_address: '123 Le Loi' },
    tests: [A.status(200), A.verifyProfile('phone', null)],
  }),
  tc('TC-API1-009', 'phone chua ky tu khong phai so', {
    method: 'PUT', path: P, body: base({ phone: '0912-345-678' }),
    desc: 'FR-04 doi 10-11 chu so bat dau 0 nhung KHONG duoc thuc thi trong ma nguon.',
    tests: [A.status(200), A.verifyProfile('phone', '0912-345-678')],
  }),
  tc('TC-API1-010', 'phone gui duoi dang JSON number', {
    method: 'PUT', path: P, body: base({ phone: 912345678 }),
    tests: [A.status(200), A.verifyProfile('phone', '912345678')],
  }),
  tc('TC-API1-011', 'phone khop regex client web nhung trai FR-04', {
    method: 'PUT', path: P, body: base({ phone: '912345678' }),
    desc: 'Xung dot 2 oracle: regex frontend cho qua, FR-04 doi bat dau 0.',
    tests: [A.status(200), A.verifyProfile('phone', '912345678')],
  }),
  tc('TC-API1-012', 'Khong gui role (baseline doi chieu SEC-06)', {
    method: 'PUT', path: P, body: base(),
    tests: [A.status(200), A.verifyProfile('role', 'user')],
  }),
  tc('TC-API1-013', 'Truong la khong duoc nhan dien bi bo qua', {
    method: 'PUT', path: P, body: base({ foo: 'bar' }),
    tests: [A.status(200),
      ["pm.test('GET /api/users/me KHONG co truong foo', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenUser'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.json()).to.not.have.property('foo'); done(); } catch (e) { done(e); } });",
        "});"].join('\n')],
  }),
  tc('TC-API1-014', 'name/dia chi hop le + phone sai dinh dang', {
    method: 'PUT', path: P, body: base({ phone: 'abc' }),
    tests: [A.status(200), A.verifyProfile('phone', 'abc')],
  }),

  // ---------------- Gia tri bien (BVA) ----------------
  tc('TC-API1-015', 'phone 9 chu so (bien min-1)', {
    method: 'PUT', path: P, body: base({ phone: '091234567' }),
    desc: 'Ky vong dac ta FR-04: tu choi. Thuc te: chap nhan.',
    tests: [A.status(200), A.verifyProfile('phone', '091234567')],
  }),
  tc('TC-API1-016', 'phone 10 chu so (bien min)', {
    method: 'PUT', path: P, body: base({ phone: '0912345678' }),
    tests: [A.status(200), A.verifyProfile('phone', '0912345678')],
  }),
  tc('TC-API1-017', 'phone 11 chu so (bien max)', {
    method: 'PUT', path: P, body: base({ phone: '09123456789' }),
    tests: [A.status(200), A.verifyProfile('phone', '09123456789')],
  }),
  tc('TC-API1-018', 'phone 12 chu so (bien max+1)', {
    method: 'PUT', path: P, body: base({ phone: '091234567890' }),
    tests: [A.status(200), A.verifyProfile('phone', '091234567890')],
  }),
  tc('TC-API1-019', 'phone dung do dai nhung khong bat dau bang 0', {
    method: 'PUT', path: P, body: base({ phone: '1912345678' }),
    tests: [A.status(200), A.verifyProfile('phone', '1912345678')],
  }),
  tc('TC-API1-020', 'Header Authorization co 2 dau cach -> 403', {
    method: 'PUT', path: P, auth: 'doubleSpace', body: base(),
    desc: 'split(" ")[1] tra chuoi rong; "" != null nen di tiep vao jwt.verify -> 403 (KHONG phai 401). Probe that: 403.',
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API1-021', 'role la so 0 (falsy) -> KHONG ghi', {
    method: 'PUT', path: P, body: base({ role: 0 }),
    desc: 'if (role) la falsy voi so 0 nen nhanh ghi role khong chay.',
    tests: [A.status(200), A.verifyProfile('role', 'user')],
  }),
  tc('TC-API1-022', 'role la chuoi "0" (truthy) -> BI GHI', {
    method: 'PUT', path: P, body: base({ role: '0' }),
    desc: 'Bat doi xung falsy/truthy: chuoi "0" vuot qua if (role) va ghi thang vao DB.',
    tests: [A.status(200), A.verifyProfileThenRestoreRole('role', '0')],
  }),

  // ---------------- Bao mat (SEC) ----------------
  tc('TC-API1-023', 'Khong gui header Authorization -> 401 (+ schema 401, gop TC-034)', {
    method: 'PUT', path: P, auth: 'none', body: base(),
    desc: 'Gop TC-API1-034 (schema 401) vao day theo ket luan kiem toan: cung request, cung expected.',
    tests: [A.status(401), A.jsonBody({ error: 'Unauthorized' }), A.exactKeys(['error']), A.schema(SCHEMA.errOnly, 'chi 1 key error')],
  }),
  tc('TC-API1-024', 'Header khong co dau cach phan tach -> 401', {
    method: 'PUT', path: P, auth: 'noSpace', body: base(),
    tests: [A.status(401), A.jsonBody({ error: 'Unauthorized' })],
  }),
  tc('TC-API1-025', 'JWT sai cu phap -> 403', {
    method: 'PUT', path: P, auth: 'badJwt', body: base(),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API1-026', 'JWT ky bang secret khac -> 403', {
    method: 'PUT', path: P, auth: 'wrongSecret', body: base(),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API1-027', 'Token tu ky co exp qua khu -> 403', {
    method: 'PUT', path: P, auth: 'expired', body: base(),
    desc: 'INCOMPLETE da sua: ghi ro cach tao token. server.js:51 khong dat expiresIn nen trang thai nay KHONG ton tai trong luong that; chi toi duoc bang token tu ky (SECRET_KEY hardcode server.js:9).',
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API1-028', 'Token hop le nhung id khong ton tai -> 200 du 0 dong bi ghi', {
    method: 'PUT', path: P, auth: 'forgedId999', body: base({ name: 'Ghost User' }),
    desc: 'INCOMPLETE da sua: bo sung buoc chung minh 0 dong bi ghi. server.js:131-134 khong kiem this.changes.',
    tests: [A.status(200), A.jsonBody(OK),
      ["pm.test('GET voi cung token id=999999 tra ve null (khong co dong nao)', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenForgedId999999'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.text()).to.eql(''); done(); } catch (e) { done(e); } });",
        "});"].join('\n'),
      A.verifyProfile('name', 'Test User')],
    prerequest: ["// dua ho so user A ve moc doi chieu truoc khi kiem 'khong dong nao bi ghi'",
      "pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'PUT',",
      "  header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenUser'), 'X-Student-Id': pm.environment.get('studentId') },",
      "  body: { mode: 'raw', raw: JSON.stringify({ name: 'Test User', shipping_address: 'baseline', phone: '0912345678' }) } }, function () {});"].join('\n'),
  }),
  tc('TC-API1-029', '[CRITICAL] Leo thang quyen qua role:"admin" (SEC-06)', {
    method: 'PUT', path: P, body: base({ role: 'admin' }),
    desc: 'BUG-01. SEC-06 doi API cap nhat ho so KHONG cho doi role; server.js:124-127 ghi thang gia tri client gui.',
    tests: [A.status(200), A.jsonBody(OK), A.verifyProfileThenRestoreRole('role', 'admin')],
  }),
  tc('TC-API1-030', 'role ngoai enum ("superadmin") van duoc luu', {
    method: 'PUT', path: P, body: base({ role: 'superadmin' }),
    tests: [A.status(200), A.verifyProfileThenRestoreRole('role', 'superadmin')],
  }),
  tc('TC-API1-031', 'Payload SQL injection trong name (SEC-05)', {
    method: 'PUT', path: P, body: base({ name: "Robert'); DROP TABLE users;--" }),
    tests: [A.status(200), A.verifyProfile('name', "Robert'); DROP TABLE users;--"),
      ["pm.test('Bang users con nguyen (parameterized query dat)', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/admin/users', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.code).to.eql(200); pm.expect(res.json().length).to.be.at.least(2); done(); } catch (e) { done(e); } });",
        "});"].join('\n')],
  }),
  tc('TC-API1-032', 'Payload script/XSS trong name (SEC-04)', {
    method: 'PUT', path: P, body: base({ name: '<script>alert(1)</script>' }),
    desc: 'API luu nguyen van; SEC-04 la yeu cau tang hien thi nen o day chi ghi nhan du lieu vao duoc DB.',
    tests: [A.status(200), A.verifyProfile('name', '<script>alert(1)</script>')],
  }),

  // ---------------- Kiem tra schema ----------------
  tc('TC-API1-033', 'Schema response thanh cong', {
    method: 'PUT', path: P, body: base(),
    tests: [A.status(200), A.exactKeys(['message']), A.schema(SCHEMA.msgOnly, 'chi 1 key message')],
  }),
  tc('TC-API1-035', 'Schema loi 403', {
    method: 'PUT', path: P, auth: 'badJwt', body: base(),
    tests: [A.status(403), A.exactKeys(['error']), A.jsonKey('error', 'Forbidden'), A.schema(SCHEMA.errOnly, 'chi 1 key error')],
  }),
  tc('TC-API1-036', 'Schema xac minh cua GET /api/users/me (10 truong)', {
    method: 'GET', path: P,
    tests: [A.status(200), A.schema(SCHEMA.userProfile, '10 truong cua bang users'),
      A.exactKeys(['id', 'name', 'email', 'password', 'role', 'login_attempts', 'locked_until', 'reset_token', 'shipping_address', 'phone'])],
  }),
  tc('TC-API1-037', 'Response PUT khong echo truong nao da ghi', {
    method: 'PUT', path: P, body: base({ name: 'Distinctive Test Name XYZ' }),
    tests: [A.status(200), A.notHasKey('name'), A.notHasKey('shipping_address'), A.notHasKey('phone'), A.exactKeys(['message'])],
  }),
  tc('TC-API1-038', 'GET /api/users/me lo password plaintext (SEC-01)', {
    method: 'GET', path: P,
    desc: 'INCOMPLETE da sua: khong hard-code mat khau seed. Assert dong: password trung voi mat khau dang dang nhap trong environment.',
    tests: [A.status(200),
      ["pm.test('Response lo truong password dang plaintext (SEC-01)', function () {",
        "  var b = pm.response.json();",
        "  pm.expect(b).to.have.property('password');",
        "  pm.expect(b.password).to.be.a('string').and.to.have.length.above(0);",
        "  pm.expect(b.password).to.eql(pm.environment.get('userPassword'));",
        "});"].join('\n')],
  }),

  // ---------------- Quy tac nghiep vu khac ----------------
  tc('TC-API1-039', 'Ngu nghia ghi-de-toan-bo: bo truong se xoa gia tri cu', {
    method: 'PUT', path: P, body: { name: 'Full Replace Test', phone: '0912345678' },
    desc: 'INCOMPLETE da sua: tach setup va assert. Pre-request dat gia tri moc, request bo truong shipping_address.',
    prerequest: ["pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'PUT',",
      "  header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenUser'), 'X-Student-Id': pm.environment.get('studentId') },",
      "  body: { mode: 'raw', raw: JSON.stringify({ name: 'setup', shipping_address: 'SENTINEL-039', phone: '0912345678' }) } },",
      "  function (e, r) { console.log('[SETUP] dat shipping_address = SENTINEL-039 (HTTP ' + (r && r.code) + ')'); });"].join('\n'),
    tests: [A.status(200), A.verifyProfile('shipping_address', null), A.verifyProfile('name', 'Full Replace Test')],
  }),
  tc('TC-API1-040', 'Scheme header khong chuan (Basic) van duoc chap nhan', {
    method: 'PUT', path: P, auth: 'basicUser', body: base({ name: 'Basic Scheme Accepted' }),
    desc: 'Dac ta ghi Bearer; authenticateToken chi split(" ")[1] nen khong kiem scheme.',
    tests: [A.status(200), A.jsonBody(OK), A.verifyProfile('name', 'Basic Scheme Accepted')],
  }),
  tc('TC-API1-041', 'Header Authorization rong -> 403 (khong phai 401)', {
    method: 'PUT', path: P, auth: 'empty', body: base(),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API1-042', 'Token mang claim role cu sau khi leo thang (phan ky token/DB)', {
    method: 'PUT', path: P, body: base({ role: 'admin' }),
    desc: 'INCOMPLETE da sua: phai giai ma payload JWT, khong phai assertion HTTP thuan.',
    tests: [A.status(200), A.verifyProfile('role', 'admin'),
      ["pm.test('Token dang dung van claim role=\"user\" du DB da la admin (phan ky)', function () {",
        "  var t = pm.environment.get('tokenUser');",
        "  var payload = JSON.parse(Buffer.from(t.split('.')[1], 'base64').toString('utf8'));",
        "  pm.expect(payload.role).to.eql('user');",
        "  pm.expect(payload.id).to.eql(2);",
        "  console.log('[TC-042] claim trong token: ' + JSON.stringify(payload) + ' | role trong DB: admin');",
        "});"].join('\n'), A.verifyProfileThenRestoreRole('role', 'admin')],
  }),

  // ---------------- 5 test case tu bo sung ----------------
  tc('A1-E01', '[TU BO SUNG] JSON sai cu phap -> 400 dang HTML, khong phai JSON', {
    method: 'PUT', path: P, body: '{"name":"A",',
    desc: 'AI bo sot vi trace tu app.put ra ngoai nen mu middleware bodyParser (Han che cua mo hinh).',
    tests: [A.htmlNotJson(400)],
  }),
  tc('A1-E02', '[TU BO SUNG] Khong gui body -> 500 dang HTML', {
    method: 'PUT', path: P, body: '', noContentType: true,
    desc: 'TypeError khi destructure req.body. Cung goc voi E01.',
    tests: [A.htmlNotJson(500)],
  }),
  tc('A1-E03', '[TU BO SUNG] Mao danh id co that de sua ho so nguoi khac (IDOR)', {
    method: 'PUT', path: P, auth: 'forgedId1', body: { name: 'HACKED BY A1-E03', shipping_address: 'x', phone: '0912345678' },
    desc: 'BUG. Token tu ky {id:1} = admin thuc. Bao mat endpoint dua HOAN TOAN vao tinh toan ven cua token; secret hardcode server.js:9.',
    tests: [A.status(200), A.jsonBody(OK), A.verifyProfile('name', 'HACKED BY A1-E03', 'tokenAdmin'),
      ["pm.test('[cleanup] tra ten admin ve gia tri seed', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'PUT',",
        "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': pm.environment.get('studentId') },",
        "    body: { mode: 'raw', raw: JSON.stringify({ name: 'Admin User', shipping_address: null, phone: null, role: 'admin' }) } },",
        "    function (err, res) { if (err) { return done(err); } pm.expect(res.code).to.eql(200); done(); });",
        "});"].join('\n')],
  }),
  tc('A1-E04', '[TU BO SUNG] Chuoi leo thang day du: nang quyen -> dang nhap lai -> token moi mang role admin', {
    method: 'PUT', path: P, body: base({ role: 'admin' }),
    desc: 'AI phan tich tung API tach biet nen khong noi chuoi he qua lien-API (Chat luong prompt cua toi). Ca chuoi nam trong MOT pm.test long nhau vi runner KHONG tuan tu hoa cac pm.test async.',
    tests: [A.status(200),
      ["pm.test('Chuoi leo thang: DB=admin -> dang nhap lai nhan token claim admin -> tra role ve user', function (done) {",
      "  var base = pm.environment.get('baseUrl'), sid = pm.environment.get('studentId');",
      "  var tok = 'Bearer ' + pm.environment.get('tokenUser');",
      "  pm.sendRequest({ url: base + '/api/users/me', method: 'GET', header: { 'Authorization': tok, 'X-Student-Id': sid } }, function (e1, r1) {",
      "    if (e1) { return done(e1); }",
      "    try { pm.expect(r1.json().role, 'role trong DB').to.eql('admin'); } catch (e) { return done(e); }",
      "    pm.sendRequest({ url: base + '/api/login', method: 'POST',",
      "      header: { 'Content-Type': 'application/json', 'X-Student-Id': sid },",
      "      body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('userEmail'), password: pm.environment.get('userPassword') }) } },",
      "      function (e2, r2) {",
      "        if (e2) { return done(e2); }",
      "        try {",
      "          pm.expect(r2.code).to.eql(200);",
      "          pm.expect(r2.json().user.role, 'role tra ve khi dang nhap lai').to.eql('admin');",
      "          var payload = JSON.parse(Buffer.from(r2.json().token.split('.')[1], 'base64').toString('utf8'));",
      "          pm.expect(payload.role, 'claim role trong token moi').to.eql('admin');",
      "          console.log('[A1-E04] token moi sau leo thang: ' + JSON.stringify(payload));",
      "        } catch (e) { return done(e); }",
      "        pm.sendRequest({ url: base + '/api/users/me', method: 'PUT',",
      "          header: { 'Content-Type': 'application/json', 'Authorization': tok, 'X-Student-Id': sid },",
      "          body: { mode: 'raw', raw: JSON.stringify({ name: 'Test User', shipping_address: 'reset', phone: '0912345678', role: 'user' }) } },",
      "          function (e3, r3) {",
      "            if (e3) { return done(e3); }",
      "            try { pm.expect(r3.code, '[cleanup] tra role ve user').to.eql(200); done(); } catch (e) { done(e); }",
      "          });",
      "      });",
      "  });",
      "});"].join('\n'),
      ["// Ghi chu trung thuc: GET /api/admin/users KHONG dung de chung minh leo thang co hieu luc,",
      "// vi route do cung khong kiem role (probe that: token role=user van tra 200). Do la mot vi pham SEC-03 RIENG.",
      "pm.test('SEC-03 rieng: GET /api/admin/users khong kiem role nen token role=user van doc duoc', function (done) {",
      "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/admin/users', method: 'GET',",
      "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenUserPlain'), 'X-Student-Id': pm.environment.get('studentId') } },",
      "    function (err, res) { if (err) { return done(err); }",
      "      try { pm.expect(res.code).to.eql(200); pm.expect(res.json()).to.be.an('array'); done(); } catch (e) { done(e); } });",
      "});"].join('\n')],
  }),
  tc('A1-E05', '[TU BO SUNG] Kiem chung DONG rang email khong sua duoc', {
    method: 'PUT', path: P, body: base({ email: 'hacker@evil.com' }),
    desc: 'AI ket luan email an toan "by construction" nhung khong chuyen thanh test case (Han che cua mo hinh).',
    tests: [A.status(200), A.jsonBody(OK),
      ["pm.test('GET /api/users/me: email KHONG doi', function (done) {",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/users/me', method: 'GET',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenUser'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.json().email).to.eql(pm.environment.get('userEmail')); done(); } catch (e) { done(e); } });",
        "});"].join('\n')],
  }),
];

module.exports = folder(
  'API1 - PUT /api/users/me (Pool A / FR-04)',
  items,
  '42 TC do AI sinh (TC-034 gop vao TC-023 theo ket luan kiem toan) + 5 TC tu bo sung A1-E01..E05.'
);
