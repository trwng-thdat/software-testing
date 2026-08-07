# Selenium project scaffold

Reference implementations for the `selenium/` utilities. Adapt names to the project; keep the contracts.

## Dependencies

```bash
npm i -D typescript ts-node @types/node mocha @types/mocha chai@4 @types/chai \
        selenium-webdriver @types/selenium-webdriver mochawesome dotenv cross-env
```

Chai 4 is intentional - chai 5 is ESM-only and fights the CommonJS ts-node setup below.

Browser drivers: Selenium 4.6+ resolves `chromedriver`, `msedgedriver`, and `geckodriver` automatically via Selenium Manager. Chrome, Edge, and Firefox must be installed locally.

## `.mocharc.json`

```json
{
  "require": ["ts-node/register", "dotenv/config"],
  "extension": ["ts"],
  "spec": "tests/**/*.spec.ts",
  "timeout": 60000,
  "reporter": "mochawesome",
  "reporter-option": ["overwrite=true", "html=true", "json=true", "charts=true"]
}
```

`reportDir` and `reportFilename` are set per run from the environment - see the report wrapper.

## `utils/config.ts`

```ts
import 'dotenv/config';

function required(key: string): string {
  const v = process.env[key];
  if (!v || !v.trim()) throw new Error(`Missing required .env variable: ${key}. Copy .env.example to .env and fill it in.`);
  return v.trim();
}

export type BrowserName = 'chrome' | 'edge' | 'firefox';
const ALLOWED: BrowserName[] = ['chrome', 'edge', 'firefox'];

function parseBrowsers(raw: string): BrowserName[] {
  const list = raw.split(',').map(s => s.trim().toLowerCase());
  const bad = list.filter(b => !ALLOWED.includes(b as BrowserName));
  if (bad.length) throw new Error(`Unsupported browser(s): ${bad.join(', ')}. Allowed: ${ALLOWED.join(' | ')}`);
  return list as BrowserName[];
}

export const config = {
  studentId:   required('STUDENT_ID'),
  studentName: required('STUDENT_NAME'),
  apiUrl:      required('API_URL').replace(/\/$/, ''),
  webUrl:      required('WEB_URL').replace(/\/$/, ''),
  adminUrl:    required('ADMIN_URL').replace(/\/$/, ''),
  browsers:    parseBrowsers(required('BROWSERS')),
  browser:     (process.env.BROWSER?.trim().toLowerCase() || 'chrome') as BrowserName,
  headless:    process.env.HEADLESS !== 'false',
  timeout:     Number(process.env.DEFAULT_TIMEOUT_MS || 10000),
  reportBase:  process.env.REPORT_BASE_DIR || 'reports',
  adminEmail:    required('ADMIN_EMAIL'),
  adminPassword: required('ADMIN_PASSWORD'),
};

export const RUN_BY = `Run by: ${config.studentId}`;
export const RUN_TIMESTAMP = process.env.RUN_TIMESTAMP?.trim() || new Date().toISOString();
```

## `utils/driver.ts`

```ts
import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import edge from 'selenium-webdriver/edge';
import firefox from 'selenium-webdriver/firefox';
import { config, BrowserName } from './config';

export async function buildDriver(browser: BrowserName = config.browser): Promise<WebDriver> {
  const builder = new Builder();
  switch (browser) {
    case 'chrome': {
      const o = new chrome.Options().addArguments('--window-size=1440,900', '--disable-gpu');
      if (config.headless) o.addArguments('--headless=new');
      builder.forBrowser('chrome').setChromeOptions(o);
      break;
    }
    case 'edge': {
      const o = new edge.Options().addArguments('--window-size=1440,900', '--disable-gpu');
      if (config.headless) o.addArguments('--headless=new');
      builder.forBrowser('MicrosoftEdge').setEdgeOptions(o);
      break;
    }
    case 'firefox': {
      const o = new firefox.Options().addArguments('--width=1440', '--height=900');
      if (config.headless) o.addArguments('-headless');
      builder.forBrowser('firefox').setFirefoxOptions(o);
      break;
    }
  }
  const driver = await builder.build();
  await driver.manage().setTimeouts({ implicit: 0, pageLoad: 60000, script: 30000 });
  return driver;
}
```

Keep the implicit wait at `0`. Mixing implicit and explicit waits produces unpredictable timings and is a classic source of "flaky" reports.

## `utils/dataLoader.ts`

```ts
import fs from 'fs';
import path from 'path';

export interface TestCase<I = any, E = any> {
  tcId: string;
  title: string;
  type: 'positive' | 'negative' | 'edge';
  input: I;
  expected: E;
  skipReason?: string;
}

export function loadCases<I, E>(feature: string, min = 12): TestCase<I, E>[] {
  const file = path.resolve(__dirname, '..', 'data', `${feature}.data.json`);
  const cases = JSON.parse(fs.readFileSync(file, 'utf8')) as TestCase<I, E>[];
  if (!Array.isArray(cases)) throw new Error(`${file} must contain an array of test cases`);
  if (cases.length < min) throw new Error(`${feature}: ${cases.length} cases found, HW04 requires >= ${min}`);
  const dupes = cases.map(c => c.tcId).filter((id, i, a) => a.indexOf(id) !== i);
  if (dupes.length) throw new Error(`Duplicate tcId(s) in ${feature}: ${dupes.join(', ')}`);
  return cases;
}
```

The `min` guard turns "12 cases per feature" into a build failure instead of something to remember.

## `utils/alerts.ts`

```ts
import { WebDriver, until } from 'selenium-webdriver';
import { config } from './config';

/** Perform an action that raises a native alert; return its text and accept it. */
export async function actAndReadAlert(driver: WebDriver, action: () => Promise<void>): Promise<string> {
  await action();
  await driver.wait(until.alertIsPresent(), config.timeout);
  const alert = await driver.switchTo().alert();
  const text = await alert.getText();
  await alert.accept();
  return text;
}

/** Safety net for afterEach - a leaked alert breaks every later test in the file. */
export async function dismissAnyAlert(driver: WebDriver): Promise<void> {
  try { await driver.switchTo().alert().accept(); } catch { /* none open */ }
}
```

## `utils/reportMetadata.ts`

```ts
import fs from 'fs';
import { config, RUN_BY, RUN_TIMESTAMP } from './config';

/** Inject a visible metadata banner into the generated mochawesome HTML. */
export function injectMetadata(htmlPath: string, feature: string): void {
  if (!fs.existsSync(htmlPath)) throw new Error(`Report not found: ${htmlPath}`);
  const banner = `
<div style="padding:12px 16px;background:#1f2937;color:#f9fafb;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">
  <strong>${RUN_BY}</strong><br/>
  Student: ${config.studentName}<br/>
  Feature: ${feature}<br/>
  Browser: ${config.browser}<br/>
  Timestamp: ${RUN_TIMESTAMP}
</div>`;
  const html = fs.readFileSync(htmlPath, 'utf8');
  if (html.includes(RUN_BY)) return;                       // idempotent
  fs.writeFileSync(htmlPath, html.replace(/<body([^>]*)>/i, `<body$1>${banner}`), 'utf8');
}
```

Assert afterwards that the file really contains `RUN_BY` - a silently failed `replace` leaves an unstamped report, which fails the anti-cheat check.

## `utils/bugReporter.ts`

```ts
import fs from 'fs';
import path from 'path';
import { WebDriver } from 'selenium-webdriver';
import { config, RUN_TIMESTAMP } from './config';

const DIR = path.resolve(__dirname, '..', 'bug-snapshots');
const BUGS_MD = path.join(DIR, 'BUGS.md');

export function resetBugLog(): void {
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(BUGS_MD, `# Bug log\n\nRun by: ${config.studentId}\nTimestamp: ${RUN_TIMESTAMP}\n\n`, 'utf8');
}

export async function captureBug(
  driver: WebDriver,
  info: { tcId: string; feature: string; expected: string; actual: string; severity?: string },
): Promise<string> {
  fs.mkdirSync(DIR, { recursive: true });
  const shot = path.join(DIR, `${info.tcId}.png`);
  fs.writeFileSync(shot, Buffer.from(await driver.takeScreenshot(), 'base64'));
  fs.appendFileSync(BUGS_MD,
    `## ${info.tcId} - ${info.feature}\n\n` +
    `- Browser: ${config.browser}\n` +
    `- Severity: ${info.severity ?? 'TBD'}\n` +
    `- Expected: ${info.expected}\n` +
    `- Actual: ${info.actual}\n` +
    `- Screenshot: ${path.relative(path.resolve(__dirname, '..'), shot)}\n` +
    `- GitHub Issue: TBD\n\n`, 'utf8');
  return shot;
}
```

Call `captureBug` from an `afterEach` that inspects `this.currentTest?.state === 'failed'`, then attach the path with `addContext` from `mochawesome/addContext` so it renders inside the HTML report. Fill in the issue URL once filed.

## Report wrapper

Set the per-run report destination before mocha starts, so each browser writes its own file:

```json
{
  "scripts": {
    "t:chrome":  "cross-env BROWSER=chrome  MOCHAWESOME_REPORTFILENAME=chrome  mocha",
    "t:edge":    "cross-env BROWSER=edge    MOCHAWESOME_REPORTFILENAME=edge    mocha",
    "t:firefox": "cross-env BROWSER=firefox MOCHAWESOME_REPORTFILENAME=firefox mocha"
  }
}
```

Add `reportDir=reports/<feature>` per feature via `--reporter-option`, or drive the whole matrix from a small `ts-node` runner that loops features x browsers and calls `injectMetadata` after each run. The runner is the more reliable option once there are three features.

## Spec skeleton

```ts
import { WebDriver, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import addContext from 'mochawesome/addContext';
import { buildDriver } from '../utils/driver';
import { loadCases } from '../utils/dataLoader';
import { dismissAnyAlert, actAndReadAlert } from '../utils/alerts';
import { captureBug } from '../utils/bugReporter';
import { config, RUN_BY, RUN_TIMESTAMP } from '../utils/config';

const FEATURE = 'fr04-profile';
const cases = loadCases<any, any>(FEATURE);      // throws if < 12

describe(`${FEATURE} [${config.browser}] - ${RUN_BY}`, function () {
  let driver: WebDriver;

  before(async function () {
    driver = await buildDriver();
    // seed state via utils/api.ts - log in, create fixtures
  });

  after(async function () {
    await driver?.quit();
  });

  afterEach(async function () {
    await dismissAnyAlert(driver);               // never let an alert leak
    if (this.currentTest?.state === 'failed') {
      const shot = await captureBug(driver, {
        tcId: this.currentTest.title.split(' ')[0],
        feature: FEATURE,
        expected: 'see data file',
        actual: this.currentTest.err?.message ?? 'unknown',
      });
      addContext(this, { title: 'Screenshot', value: shot });
    }
  });

  for (const c of cases) {
    it(`${c.tcId} - ${c.title}`, async function () {
      if (c.skipReason) this.skip();
      addContext(this, { title: 'Run metadata', value: { runBy: RUN_BY, browser: config.browser, timestamp: RUN_TIMESTAMP, type: c.type } });
      // arrange from c.input, act, assert against c.expected
    });
  }
});
```

## `.gitignore`

```gitignore
node_modules/
.env
reports/**/*.json
```

Commit the HTML reports - they are graded evidence. Do **not** commit `.env`.
