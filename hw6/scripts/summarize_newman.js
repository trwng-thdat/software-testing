// HW06 - trich so lieu thuc te tu bao cao JSON cua Newman thanh bang de dien vao Main_Report.md
// Chay: node hw6/scripts/summarize_newman.js
// Xuat : hw6/reports/summary.json  +  hw6/reports/summary.md
const fs = require('fs');
const path = require('path');

const REP = path.resolve(__dirname, '../reports');
const RUNS = [
  { file: 'api1.json', label: 'API 1 - PUT /api/users/me (FR-04)', key: 'api1' },
  { file: 'api2.json', label: 'API 2 - PUT /api/orders/:id/cancel (FR-10)', key: 'api2' },
  { file: 'api3.json', label: 'API 3 - POST /api/admin/coupons (FR-17)', key: 'api3' },
  { file: 'data_api1_phone.json', label: 'Data-driven CSV - phone (FR-04)', key: 'data1' },
  { file: 'data_api3_coupon.json', label: 'Data-driven CSV - coupon (FR-17)', key: 'data3' },
  { file: 'spec_bugs.json', label: 'SPEC - assertion theo dac ta (co y dinh fail)', key: 'spec' },
];

// Tien to ID cua test case "thuc" (khong tinh Setup/Teardown)
const TC_PREFIX = /^(TC-API[123]-\d{3}[ab]?|A[123]-E\d{2}|SPEC-BUG-\d{2}|DD-API[13]-[A-Z]+)/;

const out = { generatedFrom: 'newman JSON reporter', runs: {}, totals: {} };
const lines = [];

let T = { requests: 0, assertions: 0, failed: 0, tcTotal: 0, tcPass: 0, tcFail: 0 };

for (const run of RUNS) {
  const p = path.join(REP, run.file);
  if (!fs.existsSync(p)) { console.error('Thieu ' + run.file + ' - hay chay bash hw6/scripts/run_newman.sh'); continue; }
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const st = j.run.stats;

  // Gom assertion theo tung test case.
  // LUU Y QUAN TRONG: trong bao cao JSON, Newman ghi MOT execution cho MOI HTTP call phat
  // sinh trong vong doi cua item (ke ca pm.sendRequest o pre-request va test script), va
  // GAN LAI cung danh sach assertion cho tat ca cac execution do. Neu cong don thang thi
  // so assertion bi doi len (vi du SPEC-BUG-06 co 3 assertion nhung xuat hien 5 lan = 15).
  // => Phai khu trung theo (item, ten assertion): moi assertion chi tinh MOT lan.
  const perTc = new Map();
  for (const ex of j.run.executions) {
    const name = (ex.item && ex.item.name) || '';
    const id = (name.split(' - ')[0] || '').trim();
    if (!TC_PREFIX.test(id)) continue;               // bo qua SETUP/TEARDOWN
    if (!perTc.has(id)) perTc.set(id, { seen: new Map(), name, httpCalls: 0 });
    const rec = perTc.get(id);
    rec.httpCalls += 1;
    for (const a of ex.assertions || []) {
      const prev = rec.seen.get(a.assertion) || false;
      rec.seen.set(a.assertion, prev || !!a.error);
    }
  }
  for (const rec of perTc.values()) {
    rec.total = rec.seen.size;
    rec.failed = [...rec.seen.values()].filter(Boolean).length;
  }
  const tcs = [...perTc.entries()].map(([id, v]) => ({ id, name: v.name, assertions: v.total, failed: v.failed, httpCalls: v.httpCalls }));
  const tcPass = tcs.filter((t) => t.failed === 0).length;
  const tcFail = tcs.length - tcPass;

  out.runs[run.key] = {
    label: run.label,
    iterations: st.iterations.total,
    requests: st.requests.total,                     // gom ca pm.sendRequest phu tro
    requestsFromCollectionItems: tcs.length + (st.requests.total - tcs.reduce((n, t) => n + t.httpCalls, 0)),
    requestFailures: st.requests.failed,
    assertions: st.assertions.total,
    assertionFailures: st.assertions.failed,
    testCases: tcs.length,
    testCasesPassed: tcPass,
    testCasesFailed: tcFail,
    failedList: tcs.filter((t) => t.failed > 0).map((t) => ({ id: t.id, name: t.name, failed: t.failed, of: t.assertions })),
    durationMs: j.run.timings.completed - j.run.timings.started,
  };

  T.requests += st.requests.total;
  T.assertions += st.assertions.total;
  T.failed += st.assertions.failed;
  T.tcTotal += tcs.length;
  T.tcPass += tcPass;
  T.tcFail += tcFail;
}

out.totals = T;
fs.writeFileSync(path.join(REP, 'summary.json'), JSON.stringify(out, null, 2), 'utf8');

// ----- bang markdown de dan vao bao cao -----
lines.push('# Ket qua thuc thi Newman (so lieu trich tu bao cao JSON)', '');
lines.push('| Lan chay | Iter | Request | Assertion | Assertion FAIL | Test case | TC pass | TC fail | Thoi gian |');
lines.push('| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |');
for (const key of Object.keys(out.runs)) {
  const r = out.runs[key];
  lines.push(`| ${r.label} | ${r.iterations} | ${r.requests} | ${r.assertions} | ${r.assertionFailures} | ${r.testCases} | ${r.testCasesPassed} | ${r.testCasesFailed} | ${(r.durationMs / 1000).toFixed(1)}s |`);
}
lines.push(`| **TONG** | | **${T.requests}** | **${T.assertions}** | **${T.failed}** | **${T.tcTotal}** | **${T.tcPass}** | **${T.tcFail}** | |`);
lines.push('');
lines.push('## Cac test case co assertion FAIL', '');
lines.push('| Lan chay | ID | Ten test case | Assertion fail / tong |');
lines.push('| --- | --- | --- | :-: |');
let any = false;
for (const key of Object.keys(out.runs)) {
  for (const f of out.runs[key].failedList) {
    lines.push(`| ${key} | ${f.id} | ${f.name.replace(/^[^-]+ - /, '')} | ${f.failed}/${f.of} |`);
    any = true;
  }
}
if (!any) lines.push('| - | - | khong co assertion nao fail | - |');
fs.writeFileSync(path.join(REP, 'summary.md'), lines.join('\n') + '\n', 'utf8');

console.log(lines.join('\n'));
