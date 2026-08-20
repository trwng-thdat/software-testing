// HW06 - gan "saved example" (example response) cho collection tu RESPONSE THAT cua SUT.
//
// Nguon du lieu: hw6/postman/examples.recorded.json, do hw6/scripts/record_examples.js sinh ra
// bang cach goi truc tiep SUT theo dung 12 tinh huong da chon.
//
// VI SAO KHONG LAY TU BAO CAO JSON CUA NEWMAN (cach lam dau tien, da bo):
//   Newman ghi mot execution cho MOI HTTP call phat sinh trong vong doi cua item, ke ca cac
//   lenh pm.sendRequest trong test script - va truong request/response cua nhung execution do
//   deu tro ve lenh sendRequest CUOI CUNG. Kiem chung: TC-API1-001 la mot PUT co 3 assertion
//   doc lai bang GET, thi ca 4 execution trong api1.json deu ghi "GET /api/users/me". Ket qua
//   la example cua mot PUT lai mang body cua GET (4/12 example bi sai), va Mock Server tra sai.
//
// Vi sao Mock Server can example: mock cua Postman tra loi dua tren example luu trong
// collection. Khong co example thi mock khong co gi de tra.
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../examples.recorded.json');

const STATUS_TEXT = {
  200: 'OK', 400: 'Bad Request', 401: 'Unauthorized',
  403: 'Forbidden', 404: 'Not Found', 500: 'Internal Server Error',
};

let RECORDED = {};
if (fs.existsSync(SRC)) {
  try {
    RECORDED = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  } catch (e) {
    console.error('[examples] khong doc duoc ' + SRC + ': ' + e.message);
  }
} else {
  console.error('[examples] chua co ' + SRC
    + ' - chay: node hw6/scripts/reset_db.js && node hw6/scripts/record_examples.js');
}

// Gan example vao item (mutate item da dung boi tc()).
function attach(item) {
  const id = (item.name.split(' - ')[0] || '').trim();
  const rec = RECORDED[id];
  if (!rec) return item;
  item.response = [{
    name: rec.code + ' - ' + (rec.isJson ? 'JSON' : 'HTML') + ' (ghi lai tu SUT that)'
      + (rec.note ? ': ' + rec.note : ''),
    originalRequest: {
      method: item.request.method,
      header: item.request.header,
      url: item.request.url,
      body: item.request.body,
    },
    status: STATUS_TEXT[rec.code] || '',
    code: rec.code,
    _postman_previewlanguage: rec.isJson ? 'json' : 'html',
    header: [{ key: 'Content-Type', value: rec.isJson ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8' }],
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
  const wanted = Object.keys(RECORDED).length;
  if (n !== wanted) {
    console.error('[examples] CANH BAO: ghi nhan ' + wanted + ' example nhung chi gan duoc ' + n
      + ' - co ID nao trong examples.recorded.json khong khop ten request?');
  }
  return n;
}

module.exports = { attachAll, recordedCount: Object.keys(RECORDED).length };
