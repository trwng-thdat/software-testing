// HW06 - API 2: PUT /api/orders/:id/cancel (Pool B / FR-10)
// 43 TC do AI sinh; TC-022 va TC-043 bi kiem toan gan INVALID va KHONG dua vao bo chay (xem §5.2)
// => 41 TC thuc thi + 5 TC tu bo sung (A2-E01..E05)
const { A, SCHEMA, tc, folder, mkOrderSetup, AFTER_CANCEL_ONCE, AFTER_DELETE_USER_B } = require('./lib');

const CANCEL = '/api/orders/{{orderId}}/cancel';
const OK = { message: 'Order canceled successfully' };
const NOTFOUND = { error: 'Order not found' };
const CANNOT = { error: 'Cannot cancel this order.' };

// kiem tra tien dieu kien bien cau truc :id (yeu cau DB vua reset)
const assertOrderIdIs = (n) => [
  "pm.test('[tien dieu kien] don vua tao phai co id = " + n + " (DB vua reset)', function () {",
  "  pm.expect(Number(pm.collectionVariables.get('orderId')), 'chay lai ma khong reset DB thi TC bien nay khong con y nghia').to.eql(" + n + ");",
  "});",
].join('\n');

const items = [
  // ---------------- Bien cau truc cua :id (BVA) - dat dau folder de id du doan duoc ----------------
  tc('TC-API2-009', ':id = 0 (bien cau truc min-1)', {
    method: 'PUT', path: '/api/orders/0/cancel',
    desc: 'COV-002. AUTOINCREMENT khong bao gio cap id 0.',
    tests: [A.status(404), A.jsonBody(NOTFOUND)],
  }),
  tc('TC-API2-010', ':id = 1 (bien cau truc min)', {
    method: 'PUT', path: CANCEL,
    desc: 'INCOMPLETE da sua: tien dieu kien duoc DUNG bang pre-request (tao don) va KIEM bang assertion id=1, thay vi gia dinh thu tu chay.',
    prerequest: mkOrderSetup([]),
    tests: [assertOrderIdIs(1), A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-011', ':id = 2 (bien min+1)', {
    method: 'PUT', path: CANCEL,
    prerequest: mkOrderSetup([]),
    tests: [assertOrderIdIs(2), A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-012', ':id cuc lon (tran so)', {
    method: 'PUT', path: '/api/orders/99999999999999999999/cancel',
    tests: [A.status(404), A.jsonBody(NOTFOUND)],
  }),

  // ---------------- Phan vung mien gia tri (EP) ----------------
  tc('TC-API2-001', 'Huy don pending (chuyen tiep hop le)', {
    method: 'PUT', path: CANCEL,
    desc: 'COV-001,029 - FR-10. pending -> canceled.',
    prerequest: mkOrderSetup([]),
    tests: [A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-002', ':id hop le nhung don khong ton tai', {
    method: 'PUT', path: '/api/orders/999999/cancel',
    tests: [A.status(404), A.jsonBody(NOTFOUND)],
  }),
  tc('TC-API2-003', ':id khong phai so', {
    method: 'PUT', path: '/api/orders/abc/cancel',
    desc: 'INCOMPLETE da sua: AI de "chua xac nhan". Probe that: 404 - SQLite khong khop chuoi voi cot INTEGER.',
    tests: [A.status(404), A.jsonBody(NOTFOUND)],
  }),
  tc('TC-API2-004', ':id la segment rong -> 404 tang routing (HTML)', {
    method: 'PUT', path: '/api/orders//cancel',
    desc: 'INCOMPLETE da sua. Probe that: Express khong khop route -> 404 mac dinh cua framework, body HTML, KHONG phai JSON cua SUT.',
    tests: [A.htmlNotJson(404)],
  }),
  tc('TC-API2-005', ':id am', {
    method: 'PUT', path: '/api/orders/-1/cancel',
    tests: [A.status(404), A.jsonBody(NOTFOUND)],
  }),
  tc('TC-API2-006', ':id dang thap phan', {
    method: 'PUT', path: '/api/orders/1.5/cancel',
    tests: [A.status(404), A.jsonBody(NOTFOUND)],
  }),
  tc('TC-API2-007', ':id co ky tu thua -> don goc KHONG bi huy', {
    method: 'PUT', path: '/api/orders/{{orderId}}abc/cancel',
    desc: 'INCOMPLETE da sua: bo sung assertion don goc con nguyen. SQLite khong ep "Nabc" thanh N.',
    prerequest: mkOrderSetup([]),
    tests: [A.status(404), A.jsonBody(NOTFOUND), A.verifyOrderStatus('pending')],
  }),
  tc('TC-API2-008', 'Body request khong co tac dung', {
    method: 'PUT', path: CANCEL, body: { status: 'delivered' },
    desc: 'COV-036. Dich ghi cung "canceled" trong server.js:333.',
    prerequest: mkOrderSetup([]),
    tests: [A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled')],
  }),

  // ---------------- Token gia mao voi id bien (BVA + Security) ----------------
  tc('TC-API2-013', 'Token gia mao id=0 - khong so huu don nao', {
    method: 'PUT', path: CANCEL, auth: 'forgedId0',
    prerequest: mkOrderSetup([]),
    tests: [A.status(404), A.jsonBody(NOTFOUND), A.verifyOrderStatus('pending')],
  }),
  tc('TC-API2-014', 'Token gia mao id=1 (trung admin thuc) huy don cua admin', {
    method: 'PUT', path: CANCEL, auth: 'forgedId1',
    desc: 'Don duoc tao boi chinh admin trong pre-request; token tu ky khong phan biet duoc voi token that.',
    prerequest: mkOrderSetup([], { owner: 'tokenAdmin' }),
    tests: [A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled', 'tokenAdmin')],
  }),
  tc('TC-API2-015', 'Token gia mao id=2 (trung user A thuc)', {
    method: 'PUT', path: CANCEL, auth: 'forgedId2',
    desc: 'Chiem tron quyen so huu cua id bi mao danh (SEC-02).',
    prerequest: mkOrderSetup([]),
    tests: [A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-016', 'Header Authorization co 2 dau cach -> 403', {
    method: 'PUT', path: CANCEL, auth: 'doubleSpace',
    prerequest: mkOrderSetup([]),
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),

  // ---------------- Chuyen trang thai (ST) - trong tam FR-10 ----------------
  tc('TC-API2-017', 'Huy don confirmed (chuyen tiep hop le)', {
    method: 'PUT', path: CANCEL,
    prerequest: mkOrderSetup(['confirmed']),
    tests: [A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-018', '[CRITICAL] Huy don shipping bang token user - trai FR-10', {
    method: 'PUT', path: CANCEL,
    desc: 'BUG. FR-10 cam user huy don dang shipping; server.js:328 chi chan delivered/canceled. Probe that: 200 va status -> canceled.',
    prerequest: mkOrderSetup(['confirmed', 'shipping']),
    tests: [A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled'),
      ["pm.test('Ghi nhan vi pham FR-10: don shipping khong duoc phep bi user huy', function () {",
        "  console.log('[BUG] don #' + pm.collectionVariables.get('orderId') + ' o trang thai shipping da bi user huy thanh cong (HTTP 200)');",
        "});"].join('\n')],
  }),
  tc('TC-API2-019', 'Huy don delivered (trang thai ket thuc) -> 400', {
    method: 'PUT', path: CANCEL,
    prerequest: mkOrderSetup(['confirmed', 'shipping', 'delivered']),
    tests: [A.status(400), A.jsonBody(CANNOT), A.verifyOrderStatus('delivered')],
  }),
  tc('TC-API2-020', 'Huy don da canceled (trang thai ket thuc) -> 400', {
    method: 'PUT', path: CANCEL,
    prerequest: mkOrderSetup([], { after: AFTER_CANCEL_ONCE }),
    tests: [A.status(400), A.jsonBody(CANNOT), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-021', 'Huy lap: goi 2 lan lien tiep cung don', {
    method: 'PUT', path: CANCEL,
    desc: 'Lan 1 chay trong pre-request (200), lan 2 la request nay (400). Trang thai bat bien.',
    prerequest: mkOrderSetup([], { after: AFTER_CANCEL_ONCE }),
    tests: [
      ["pm.test('Lan huy dau tien tra 200', function () {",
        "  pm.expect(Number(pm.collectionVariables.get('firstCancelCode'))).to.eql(200);",
        "  pm.expect(JSON.parse(pm.collectionVariables.get('firstCancelBody'))).to.deep.equal(" + JSON.stringify(OK) + ");",
        "});"].join('\n'),
      A.status(400), A.jsonBody(CANNOT), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-023', 'Route admin TU CHOI shipping -> canceled (doi chung)', {
    method: 'PUT', path: '/api/admin/orders/{{orderId}}/status', auth: 'admin', body: { status: 'canceled' },
    desc: 'COV-054. Doi chung cho thay route admin CO luat trang thai, con route user thi khong.',
    prerequest: mkOrderSetup(['confirmed', 'shipping']),
    tests: [A.status(400), A.jsonKey('error', 'Invalid state transition from shipping to canceled'), A.verifyOrderStatus('shipping')],
  }),
  tc('TC-API2-024', 'Route admin CHO PHEP canceled -> delivered (mau thuan FR-10)', {
    method: 'PUT', path: '/api/admin/orders/{{orderId}}/status', auth: 'admin', body: { status: 'delivered' },
    desc: 'BUG. FR-10 tuyen bo canceled la trang thai ket thuc; server.js:551 lai cho phep canceled -> delivered.',
    prerequest: mkOrderSetup([], { after: AFTER_CANCEL_ONCE }),
    tests: [A.status(200), A.jsonKey('message', 'Order status updated'), A.verifyOrderStatus('delivered')],
  }),

  // ---------------- Bao mat (SEC) ----------------
  tc('TC-API2-025', 'Khong gui header Authorization -> 401', {
    method: 'PUT', path: '/api/orders/1/cancel', auth: 'none',
    tests: [A.status(401), A.jsonBody({ error: 'Unauthorized' })],
  }),
  tc('TC-API2-026', 'Header Authorization rong -> 403', {
    method: 'PUT', path: '/api/orders/1/cancel', auth: 'empty',
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API2-027', 'Header khong co dau cach phan tach -> 401', {
    method: 'PUT', path: '/api/orders/1/cancel', auth: 'noSpace',
    tests: [A.status(401), A.jsonBody({ error: 'Unauthorized' })],
  }),
  tc('TC-API2-028', 'Scheme khong chuan (Basic) van duoc chap nhan', {
    method: 'PUT', path: CANCEL, auth: 'basicUser',
    prerequest: mkOrderSetup([]),
    tests: [A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-029', 'JWT sai cu phap -> 403', {
    method: 'PUT', path: '/api/orders/1/cancel', auth: 'badJwt',
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API2-030', 'JWT ky bang secret khac -> 403', {
    method: 'PUT', path: '/api/orders/1/cancel', auth: 'wrongSecret',
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API2-031', 'Token tu ky co exp qua khu -> 403', {
    method: 'PUT', path: '/api/orders/1/cancel', auth: 'expired',
    tests: [A.status(403), A.jsonBody({ error: 'Forbidden' })],
  }),
  tc('TC-API2-032', 'Token hop le voi id nguoi dung khong ton tai -> 404', {
    method: 'PUT', path: CANCEL, auth: 'forgedId999',
    prerequest: mkOrderSetup([]),
    tests: [A.status(404), A.jsonBody(NOTFOUND), A.verifyOrderStatus('pending')],
  }),
  tc('TC-API2-033', 'IDOR: user A huy don cua user B -> 404', {
    method: 'PUT', path: CANCEL, auth: 'user',
    desc: 'COV-025. Bo loc user_id trong WHERE chan duoc; 404 khong phan biet voi "khong ton tai" (chong do don).',
    prerequest: mkOrderSetup([], { owner: 'tokenUserB' }),
    tests: [A.status(404), A.jsonBody(NOTFOUND), A.verifyOrderStatus('pending', 'tokenUserB')],
  }),
  tc('TC-API2-034', 'Admin khong so huu don van bi chan -> 404', {
    method: 'PUT', path: CANCEL, auth: 'admin',
    prerequest: mkOrderSetup([]),
    tests: [A.status(404), A.jsonBody(NOTFOUND), A.verifyOrderStatus('pending')],
  }),
  tc('TC-API2-035', 'Payload SQL injection trong :id (SEC-05)', {
    method: 'PUT', path: '/api/orders/1%20OR%201=1/cancel',
    desc: 'Tham so hoa nen chuoi duoc xu ly literal, khong thuc thi SQL.',
    prerequest: mkOrderSetup([]),
    tests: [A.status(404), A.jsonBody(NOTFOUND), A.verifyOrderStatus('pending')],
  }),

  // ---------------- Kiem tra schema ----------------
  tc('TC-API2-036', 'Schema response thanh cong (khong co id/status)', {
    method: 'PUT', path: CANCEL,
    prerequest: mkOrderSetup([]),
    tests: [A.status(200), A.exactKeys(['message']), A.notHasKey('id'), A.notHasKey('status'), A.schema(SCHEMA.msgOnly, 'chi 1 key message')],
  }),
  tc('TC-API2-037', 'Schema loi 401', {
    method: 'PUT', path: '/api/orders/1/cancel', auth: 'none',
    tests: [A.status(401), A.exactKeys(['error']), A.jsonKey('error', 'Unauthorized'), A.schema(SCHEMA.errOnly)],
  }),
  tc('TC-API2-038', 'Schema loi 403', {
    method: 'PUT', path: '/api/orders/1/cancel', auth: 'badJwt',
    tests: [A.status(403), A.exactKeys(['error']), A.jsonKey('error', 'Forbidden'), A.schema(SCHEMA.errOnly)],
  }),
  tc('TC-API2-039', 'Schema 404 GIONG HET nhau cho 2 nguyen nhan khac nhau', {
    method: 'PUT', path: '/api/orders/999999/cancel',
    desc: 'So sanh tung byte giua "don khong ton tai" va "don cua nguoi khac" - chong do don (order enumeration).',
    prerequest: mkOrderSetup([], { owner: 'tokenUserB' }),
    tests: [A.status(404),
      ["pm.test('Body 404 cua 2 nguyen nhan giong het tung byte', function (done) {",
        "  var mine = pm.response.text();",
        "  pm.sendRequest({ url: pm.environment.get('baseUrl') + '/api/orders/' + pm.collectionVariables.get('orderId') + '/cancel', method: 'PUT',",
        "    header: { 'Authorization': 'Bearer ' + pm.environment.get('tokenUser'), 'X-Student-Id': pm.environment.get('studentId') } },",
        "    function (err, res) { if (err) { return done(err); }",
        "      try { pm.expect(res.code).to.eql(404); pm.expect(res.text()).to.eql(mine); done(); } catch (e) { done(e); } });",
        "});"].join('\n')],
  }),
  tc('TC-API2-040', 'Schema 400 GIONG HET nhau cho 2 nguyen nhan khac nhau', {
    method: 'PUT', path: CANCEL,
    desc: 'delivered vs canceled deu tra cung mot cau - khong the phan biet.',
    prerequest: mkOrderSetup(['confirmed', 'shipping', 'delivered']),
    tests: [A.status(400), A.jsonBody(CANNOT),
      ["pm.test('Body 400 cua don canceled giong het body 400 cua don delivered', function (done) {",
        "  var deliveredBody = pm.response.text();",
        "  var base = pm.environment.get('baseUrl'), sid = pm.environment.get('studentId');",
        "  var hdr = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenUser'), 'X-Student-Id': sid };",
        "  pm.sendRequest({ url: base + '/api/checkout', method: 'POST', header: hdr,",
        "    body: { mode: 'raw', raw: JSON.stringify({ total_amount: 100000, shipping_address: 'TC-040' }) } }, function (e1, r1) {",
        "    if (e1) { return done(e1); }",
        "    var oid = r1.json().orderId;",
        "    pm.sendRequest({ url: base + '/api/orders/' + oid + '/cancel', method: 'PUT', header: hdr }, function () {",
        "      pm.sendRequest({ url: base + '/api/orders/' + oid + '/cancel', method: 'PUT', header: hdr }, function (e3, r3) {",
        "        if (e3) { return done(e3); }",
        "        try { pm.expect(r3.code).to.eql(400); pm.expect(r3.text()).to.eql(deliveredBody); done(); } catch (er) { done(er); }",
        "      });",
        "    });",
        "  });",
        "});"].join('\n')],
  }),
  tc('TC-API2-041', 'Response PUT khong chua trang thai - phai verify bang GET', {
    method: 'PUT', path: CANCEL,
    desc: 'INCOMPLETE da sua: tach PUT va GET thanh 2 request rieng (GET chay trong test script).',
    prerequest: mkOrderSetup([]),
    tests: [A.status(200), A.notHasKey('status'), A.exactKeys(['message']), A.verifyOrderStatus('canceled')],
  }),
  tc('TC-API2-042', 'GET /api/orders/:id doc duoc KHONG can token (SEC-02 o endpoint ke)', {
    method: 'GET', path: '/api/orders/{{orderId}}', auth: 'none',
    desc: 'BUG o endpoint ho tro: server.js:344 khong co authenticateToken - lo toan bo don hang.',
    prerequest: mkOrderSetup([]),
    tests: [A.status(200),
      ["pm.test('Tra ve full don hang cho nguoi khong dang nhap', function () {",
        "  var b = pm.response.json();",
        "  pm.expect(b).to.have.property('user_id');",
        "  pm.expect(b).to.have.property('total_amount');",
        "  pm.expect(b).to.have.property('shipping_address');",
        "  pm.expect(b.id).to.eql(Number(pm.collectionVariables.get('orderId')));",
        "});"].join('\n')],
  }),

  // ---------------- 5 test case tu bo sung ----------------
  tc('A2-E01', '[TU BO SUNG] Mat cap nhat khi huy don va admin doi trang thai chong nhau', {
    method: 'PUT', path: CANCEL,
    desc: 'BUG. AI hen phan tich concurrency o P5 roi bo qua het P7/P10/P11. Newman chay tuan tu nen day la ban tai hien TUAN TU cua cung khiem khuyet (khong doc lai trang thai, khong lock); ban chay SONG SONG that lam bang node script hw6/scripts/probe2.js cho ket qua: ca 2 request deu 200, trang thai cuoi = delivered.',
    prerequest: mkOrderSetup(['confirmed', 'shipping']),
    tests: [A.status(200), A.jsonBody(OK),
      ["pm.test('Admin van set duoc delivered sau khi don da bi huy -> viec huy bi MAT', function (done) {",
      "  var oid = pm.collectionVariables.get('orderId');",
      "  var base = pm.environment.get('baseUrl'), sid = pm.environment.get('studentId');",
      "  pm.sendRequest({ url: base + '/api/admin/orders/' + oid + '/status', method: 'PUT',",
      "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pm.environment.get('tokenAdmin'), 'X-Student-Id': sid },",
      "    body: { mode: 'raw', raw: JSON.stringify({ status: 'delivered' }) } },",
      "    function (e1, r1) {",
      "      if (e1) { return done(e1); }",
      "      try { pm.expect(r1.code, 'ca hai thao tac deu bao thanh cong').to.eql(200); } catch (e) { return done(e); }",
      "      pm.sendRequest({ url: base + '/api/orders/' + oid, method: 'GET', header: { 'X-Student-Id': sid } }, function (e2, r2) {",
      "        if (e2) { return done(e2); }",
      "        try {",
      "          pm.expect(r2.json().status, 'trang thai cuoi').to.eql('delivered');",
      "          console.log('[BUG] don #' + oid + ': huy 200 + set delivered 200 -> viec huy bi mat, trang thai cuoi = delivered');",
      "          done();",
      "        } catch (e) { done(e); }",
      "      });",
      "    });",
      "});"].join('\n')],
  }),
  tc('A2-E02', '[TU BO SUNG] Vuot chan ownership bang token mao danh chu don', {
    method: 'PUT', path: CANCEL, auth: 'forgedId2',
    desc: 'Dac diem rieng cua API: ownership dua HOAN TOAN vao token. AI ket luan "khong co IDOR" vi chi xet token that.',
    prerequest: mkOrderSetup([]),
    tests: [A.status(200), A.jsonBody(OK), A.verifyOrderStatus('canceled')],
  }),
  tc('A2-E03', '[TU BO SUNG] Chuoi 2 lo hong: user huy don shipping -> admin hoi sinh thanh delivered', {
    method: 'PUT', path: CANCEL,
    desc: 'BUG chuoi. Chat luong prompt: toi bat AI phan tich TUNG O ma tran nen no khong di tim chuoi khai thac. Ca chuoi 3 buoc nam trong MOT pm.test long nhau (lan dau tach roi da FAIL vi runner khong tuan tu hoa pm.test async).',
    prerequest: mkOrderSetup(['confirmed', 'shipping']),
    tests: [A.status(200), A.jsonBody(OK),
      ["pm.test('Buoc 2+3: admin set delivered tren don da canceled roi don do vao danh sach admin voi status delivered (FR-13)', function (done) {",
      "  var oid = Number(pm.collectionVariables.get('orderId'));",
      "  var base = pm.environment.get('baseUrl'), sid = pm.environment.get('studentId');",
      "  var auth = 'Bearer ' + pm.environment.get('tokenAdmin');",
      "  pm.sendRequest({ url: base + '/api/admin/orders/' + oid + '/status', method: 'PUT',",
      "    header: { 'Content-Type': 'application/json', 'Authorization': auth, 'X-Student-Id': sid },",
      "    body: { mode: 'raw', raw: JSON.stringify({ status: 'delivered' }) } },",
      "    function (e1, r1) {",
      "      if (e1) { return done(e1); }",
      "      try { pm.expect(r1.code, 'admin set delivered tren don canceled').to.eql(200); } catch (e) { return done(e); }",
      "      pm.sendRequest({ url: base + '/api/admin/orders', method: 'GET', header: { 'Authorization': auth, 'X-Student-Id': sid } }, function (e2, r2) {",
      "        if (e2) { return done(e2); }",
      "        try {",
      "          var o = r2.json().filter(function (x) { return x.id === oid; })[0];",
      "          pm.expect(o, 'don #' + oid + ' phai co trong danh sach admin').to.not.be.undefined;",
      "          pm.expect(o.status, 'don da bi huy nay lai mang trang thai').to.eql('delivered');",
      "          console.log('[BUG] don #' + oid + ' bi user huy o trang thai shipping roi duoc admin hoi sinh thanh delivered -> tinh vao doanh thu FR-13');",
      "          done();",
      "        } catch (e) { done(e); }",
      "      });",
      "    });",
      "});"].join('\n')],
  }),
  tc('A2-E05', '[TU BO SUNG] Thong bao loi 400 khong "phu hop" nhu FR-10 doi hoi', {
    method: 'PUT', path: CANCEL,
    desc: 'FR-10 doi thong bao phu hop. Ca delivered va canceled tra y het mot cau, khong cho biet ly do.',
    prerequest: mkOrderSetup(['confirmed', 'shipping', 'delivered']),
    tests: [A.status(400), A.jsonBody(CANNOT),
      ["pm.test('Thong bao khong he cho biet don o trang thai nao', function () {",
        "  var msg = pm.response.json().error;",
        "  pm.expect(msg.toLowerCase()).to.not.include('delivered');",
        "  pm.expect(msg.toLowerCase()).to.not.include('canceled');",
        "  pm.expect(msg.toLowerCase()).to.not.include('shipping');",
        "});"].join('\n')],
  }),
  // A2-E04 dat CUOI folder: no xoa user B khoi DB
  tc('A2-E04', '[TU BO SUNG] Huy don mo coi sau khi admin xoa chu don', {
    method: 'PUT', path: CANCEL, auth: 'userB',
    desc: 'Han che cua mo hinh: AI danh gia sai tinh kha thi roi tu loai ca mot lop test. TC nay XOA user B nen phai chay cuoi folder.',
    prerequest: mkOrderSetup([], { owner: 'tokenUserB', after: AFTER_DELETE_USER_B }),
    tests: [A.status(200), A.jsonBody(OK),
      ["pm.test('Token cua user da bi xoa VAN verify duoc (server.js:51 khong co exp)', function () {",
        "  pm.expect(pm.response.code).to.not.eql(401);",
        "  pm.expect(pm.response.code).to.not.eql(403);",
        "});"].join('\n'),
      A.verifyOrderStatusPublic('canceled')],
  }),
];

module.exports = folder(
  'API2 - PUT /api/orders/:id/cancel (Pool B / FR-10)',
  items,
  '41 TC thuc thi (TC-022 va TC-043 bi loai vi INVALID - xem §5.2) + 5 TC tu bo sung A2-E01..E05. Nhieu TC dung trang thai truoc bang pre-request script (POST /api/checkout + PUT /api/admin/orders/:id/status).'
);
