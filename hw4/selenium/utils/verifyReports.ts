import fs from 'fs';
import path from 'path';
import { config, RUN_BY } from './config';
import { loadCases } from './dataLoader';

/**
 * HW04 verification gate. Checks only what can be checked without re-running:
 * case counts, report presence, and the anti-cheat metadata inside each HTML.
 *
 * Usage: ts-node utils/verifyReports.ts [feature ...]   (defaults to fr04-profile)
 */
const features = process.argv.slice(2);
const targets = features.length ? features : ['fr04-profile'];
const root = path.resolve(__dirname, '..');
const ISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/;

let failures = 0;
const fail = (m: string) => {
  console.error(`FAIL  ${m}`);
  failures++;
};
const pass = (m: string) => console.log(`ok    ${m}`);

for (const feature of targets) {
  try {
    const cases = loadCases(feature);
    pass(`${feature}: ${cases.length} cases (>= 12)`);
    const byType = cases.reduce<Record<string, number>>((a, c) => {
      a[c.type] = (a[c.type] || 0) + 1;
      return a;
    }, {});
    console.log(`      types: ${JSON.stringify(byType)}`);
  } catch (e) {
    fail(`${feature}: ${(e as Error).message}`);
  }

  for (const browser of config.browsers) {
    const file = path.join(root, config.reportBase, feature, `${browser}.html`);
    if (!fs.existsSync(file)) {
      fail(`${feature}/${browser}.html missing — run: npm run test:${feature.slice(0, 4)}`);
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    // Check the injected banner specifically. A bare `Run by:` substring also
    // occurs inside mochawesome's serialised data-raw blob (it is part of the
    // suite title), so matching that alone would pass an unstamped report.
    const banner = /<div\s+data-hw04-metadata-banner="1"[\s\S]{0,600}?<\/div>/i.exec(html)?.[0];
    if (!banner) fail(`${feature}/${browser}.html has no visible metadata banner`);
    else if (!banner.includes(RUN_BY)) fail(`${feature}/${browser}.html banner lacks "${RUN_BY}"`);
    else if (!ISO.test(banner)) fail(`${feature}/${browser}.html banner has no parseable ISO timestamp`);
    else if (!new RegExp(`Browser:\\s*${browser}`, 'i').test(banner))
      fail(`${feature}/${browser}.html banner names the wrong browser`);
    else pass(`${feature}/${browser}.html stamped`);
  }
}

console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
