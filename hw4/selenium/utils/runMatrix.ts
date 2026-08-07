import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { config, BrowserName, RUN_TIMESTAMP } from './config';
import { injectMetadata } from './reportMetadata';
import { resetBugLog } from './bugReporter';

/**
 * Run one feature across every configured browser and stamp each HTML report.
 *
 * Usage: ts-node utils/runMatrix.ts <feature> [browser ...]
 *   e.g. ts-node utils/runMatrix.ts fr04-profile
 *        ts-node utils/runMatrix.ts fr04-profile chrome
 */
const [, , feature, ...browserArgs] = process.argv;

if (!feature) {
  console.error('Usage: ts-node utils/runMatrix.ts <feature> [browser ...]');
  process.exit(2);
}

const root = path.resolve(__dirname, '..');
const specPath = path.join('tests', `${feature}.spec.ts`);
if (!fs.existsSync(path.join(root, specPath))) {
  console.error(`Spec not found: ${specPath}`);
  process.exit(2);
}

const browsers = (browserArgs.length ? browserArgs : config.browsers) as BrowserName[];
const reportDir = path.join(config.reportBase, feature);

// One shared timestamp across the whole matrix, so all three reports agree.
process.env.RUN_TIMESTAMP = RUN_TIMESTAMP;

resetBugLog();

const results: { browser: string; code: number }[] = [];

for (const browser of browsers) {
  console.log(`\n=== ${feature} :: ${browser} ===`);
  // Invoke mocha's JS entry point through node directly. Spawning `npx.cmd`
  // without a shell throws EINVAL on Windows, and enabling the shell would then
  // require quoting a cwd that contains spaces.
  const mochaBin = require.resolve('mocha/bin/mocha.js');
  const run = spawnSync(
    process.execPath,
    [
      mochaBin,
      '--spec',
      specPath,
      // Mocha 10 spells this singular; the plural form is silently ignored and
      // produces no report at all.
      '--reporter-option',
      [
        `reportDir=${reportDir}`,
        `reportFilename=${browser}`, // derived per browser — never static
        'overwrite=true',
        'html=true',
        'json=true',
        'charts=true',
      ].join(','),
    ],
    {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, BROWSER: browser, RUN_TIMESTAMP },
    },
  );

  // A non-zero exit means failing tests, which on this SUT is often a real
  // defect. Keep going so the remaining browsers still produce evidence.
  results.push({ browser, code: run.status ?? 1 });

  const html = path.join(root, reportDir, `${browser}.html`);
  injectMetadata(html, feature, browser);
  console.log(`stamped: ${path.relative(root, html)}`);
}

console.log('\n=== matrix summary ===');
for (const r of results) {
  console.log(`${feature} ${r.browser}: mocha exit ${r.code}${r.code ? ' (failing tests — triage required)' : ''}`);
}
console.log(`Timestamp: ${RUN_TIMESTAMP}`);
