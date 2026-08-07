import fs from 'fs';
import path from 'path';
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { config } from './config';

/**
 * Render each generated report in a real browser and assert the metadata banner
 * is actually VISIBLE, then save a screenshot as report evidence.
 *
 * Why this exists: `verifyReports.ts` reads the HTML as text. That is a weaker
 * oracle than it looks — an earlier build emitted the banner between </head>
 * and <body>, which is not a legal position for flow content, so the parser
 * hoisted it out and it never rendered. Every byte-level check still passed.
 * Only loading the page and reading `isDisplayed()` / the computed box catches
 * that class of defect.
 *
 * Usage: ts-node utils/captureBanner.ts [feature ...]
 */
const FEATURES = process.argv.slice(2);
const targets = FEATURES.length ? FEATURES : ['fr04-profile', 'fr08-checkout', 'fr18-admin-orders'];

const root = path.resolve(__dirname, '..');
const outDir = path.resolve(root, '..', 'screenshot');

function fileUrl(p: string): string {
  return 'file:///' + path.resolve(p).split(path.sep).join('/');
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });

  // `addArguments` is declared on the shared chromium.Options supertype and
  // returns it, so chaining off the constructor loses the concrete Chrome type.
  const options = new chrome.Options();
  options.addArguments('--window-size=1280,900', '--disable-gpu');
  if (config.headless) options.addArguments('--headless=new');
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  let failures = 0;
  try {
    for (const feature of targets) {
      const report = path.join(root, config.reportBase, feature, 'chrome.html');
      if (!fs.existsSync(report)) {
        console.error(`FAIL  ${feature}: chrome.html not found — run the matrix first.`);
        failures++;
        continue;
      }

      await driver.get(fileUrl(report));
      // mochawesome mounts a React app into #report; give it time to paint so a
      // banner buried underneath would be caught rather than measured too early.
      await driver.wait(async () => {
        const els = await driver.findElements({ css: '#report *' });
        return els.length > 0;
      }, config.timeout).catch(() => undefined);

      const banner = await driver.findElement({ css: '[data-hw04-metadata-banner]' });
      const displayed = await banner.isDisplayed();
      const box = await driver.executeScript<{ w: number; h: number; vis: string }>(
        `const r = arguments[0].getBoundingClientRect();
         const s = getComputedStyle(arguments[0]);
         return { w: r.width, h: r.height, vis: s.visibility };`,
        banner,
      );
      const text = await banner.getText();

      const ok =
        displayed &&
        box.w > 0 &&
        box.h > 0 &&
        box.vis === 'visible' &&
        text.includes(config.studentId);

      if (!ok) {
        console.error(
          `FAIL  ${feature}: banner not visibly rendered ` +
            `(displayed=${displayed}, box=${JSON.stringify(box)}, text=${JSON.stringify(text)})`,
        );
        failures++;
        continue;
      }

      const shot = path.join(outDir, `report-runby-${feature}.png`);
      fs.writeFileSync(shot, Buffer.from(await driver.takeScreenshot(), 'base64'));
      console.log(`ok    ${feature}: banner visible (${Math.round(box.w)}x${Math.round(box.h)}) -> ${path.basename(shot)}`);
    }
  } finally {
    await driver.quit();
  }

  console.log(failures ? `\n${failures} report(s) failed the visibility check.` : '\nAll banners render.');
  process.exit(failures ? 1 : 0);
})();
