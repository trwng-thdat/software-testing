// HW06 - sinh "saved example" (example response) cho collection tu RESPONSE THAT
// da ghi lai trong bao cao JSON cua Newman.
//
// Vi sao can: Mock Server cua Postman tra loi dua tren cac example luu trong collection.
// Neu tu go example bang tay thi mock se tra ve thu toi TUONG LA dung; lay tu bao cao
// Newman thi mock tra ve dung nguyen van byte ma SUT that da tra.
//
// Chay tu build.js. Neu chua co bao cao JSON thi bo qua (collection van hop le).
const fs = require('fs');
const path = require('path');

const REP = path.resolve(__dirname, '../../reports');
const SOURCES = ['api1.json', 'api2.json', 'api3.json', 'spec_bugs.json'];

// Danh sach request duoc gan example: happy path + moi lop loi mot dai dien.
// Day la "be mat hop dong" du de mot client (frontend) phat trien duoc tren mock.
const WANTED = [
  'TC-API1-001', // 200 cap nhat ho so
  'TC-API1-023', // 401 khong co token
  'TC-API1-035', // 403 token sai
  'TC-API1-036', // 200 GET ho so - schema 10 truong
  'A1-E01',      // 400 HTML tu bodyParser
  'TC-API2-001', // 200 huy don pending
  'TC-API2-002', // 404 don khong ton tai
  'TC-API2-019', // 400 khong huy duoc
  'TC-API3-001', // 200 tao coupon
  'TC-API3-004', // 500 trung code
  'TC-API3-037', // 200 xoa coupon
  'SETUP-01',    // 200 dang nhap admin (mock can de client lay token)
];

const STATUS_TEXT = {
  200: 'OK', 400: 'Bad Request', 401: 'Unauthorized',
  403: 'Forbidden', 404: 'Not Found', 500: 'Internal Server Error',
};

function collect() {
  const byId = new Map();
  for (const f of SOURCES) {
    const p = path.join(REP, f);
    if (!fs.existsSync(p)) continue;
    let j;
    try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { continue; }
    for (const ex of j.run.executions || []) {
      const name = (ex.item && ex.item.name) || '';
      const id = (name.split(' - ')[0] || '').trim();
      if (!WANTED.includes(id)) continue;
      if (byId.has(id)) continue;                     // lay lan dau tien
      const res = ex.response;
      if (!res || !res.code) continue;
      // Newman luu body duoi dang buffer {type:'Buffer', data:[...]}
      let body = '';
      if (res.stream && Array.isArray(res.stream.data)) {
        body = Buffer.from(res.stream.data).toString('utf8');
      }
      const isJson = (() => { try { JSON.parse(body); return true; } catch (e) { return false; } })();
      byId.set(id, {
        code: res.code,
        status: STATUS_TEXT[res.code] || res.status || '',
        body,
        isJson,
        contentType: isJson ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8',
      });
    }
  }
  return byId;
}

const RECORDED = collect();

// Gan example vao item (dang mutate item da dung boi tc()).
function attach(item) {
  const id = (item.name.split(' - ')[0] || '').trim();
  const rec = RECORDED.get(id);
  if (!rec) return item;
  item.response = [{
    name: rec.code + ' - ' + (rec.isJson ? 'JSON' : 'HTML') + ' (ghi lai tu SUT that)',
    originalRequest: {
      method: item.request.method,
      header: item.request.header,
      url: item.request.url,
      body: item.request.body,
    },
    status: rec.status,
    code: rec.code,
    _postman_previewlanguage: rec.isJson ? 'json' : 'html',
    header: [{ key: 'Content-Type', value: rec.contentType }],
    cookie: [],
    body: rec.body,
  }];
  return item;
}

function attachAll(folders) {
  let n = 0;
  const walk = (items) => items.forEach((it) => {
    if (it.item) { walk(it.item); return; }
    const before = it.response ? it.response.length : 0;
    attach(it);
    if ((it.response ? it.response.length : 0) > before) n += 1;
  });
  folders.forEach((f) => walk(f.item ? f.item : [f]));
  return n;
}

module.exports = { attachAll, WANTED, recordedCount: RECORDED.size };
