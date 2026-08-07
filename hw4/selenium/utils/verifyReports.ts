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

/**
 * Index just past the '>' closing the opening <body> tag, or -1.
 * Scans for a '>' outside quotes: mochawesome's <body data-raw="{...}"> holds a
 * JSON blob full of escaped '>' characters that break a naive match.
 */
function bodyTagEnd(html: string): number {
  const start = html.toLowerCase().indexOf('<body');
  if (start === -1) return -1;
  let quote: string | null = null;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '>') {
      return i + 1;
    }
  }
  return -1;
}

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
    const bannerIdx = html.search(/<div\s+data-hw04-metadata-banner="1"/i);
    const banner = /<div\s+data-hw04-metadata-banner="1"[\s\S]{0,900}?<\/div>\s*<\/div>/i.exec(html)?.[0]
      ?? /<div\s+data-hw04-metadata-banner="1"[\s\S]{0,900}?<\/div>/i.exec(html)?.[0];

    // Presence in the file is NOT the requirement — the grader has to SEE it.
    // A banner emitted between </head> and <body> is legal-looking bytes that
    // the HTML parser hoists out of the flow, so it never renders. Require the
    // banner to start after the opening <body> tag.
    const bodyOpenEnd = bodyTagEnd(html);

    if (bannerIdx === -1 || !banner) fail(`${feature}/${browser}.html has no visible metadata banner`);
    else if (bodyOpenEnd === -1) fail(`${feature}/${browser}.html has no <body> tag`);
    else if (bannerIdx < bodyOpenEnd)
      fail(
        `${feature}/${browser}.html banner sits OUTSIDE <body> (offset ${bannerIdx} < ${bodyOpenEnd}) — ` +
          `it is in the file but will not render. Re-stamp the report.`,
      );
    else if (!banner.includes(RUN_BY)) fail(`${feature}/${browser}.html banner lacks "${RUN_BY}"`);
    else if (!ISO.test(banner)) fail(`${feature}/${browser}.html banner has no parseable ISO timestamp`);
    else if (!new RegExp(`Browser:\\s*${browser}`, 'i').test(banner))
      fail(`${feature}/${browser}.html banner names the wrong browser`);
    else pass(`${feature}/${browser}.html stamped and inside <body>`);
  }
}

console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
