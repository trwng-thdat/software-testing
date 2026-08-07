import fs from 'fs';
import path from 'path';
import { WebDriver } from 'selenium-webdriver';
import { config, RUN_TIMESTAMP } from './config';

const DIR = path.resolve(__dirname, '..', 'bug-snapshots');
const BUGS_MD = path.join(DIR, 'BUGS.md');
/** Per-feature fragments; BUGS.md is the concatenation of these. */
const SECTIONS = path.join(DIR, '.sections');

/**
 * Clear the previous evidence for ONE feature before its matrix runs.
 *
 * Scoped per feature on purpose. A global wipe was correct while only FR-04
 * existed, but with several features it means whichever suite runs last is the
 * only one left with screenshots — running FR-08 silently deleted every
 * TC-PROFILE-*.png that the report still links to. `prefixes` names the TC ID
 * prefixes owned by this feature so only its own snapshots are dropped.
 *
 * BUGS.md is rebuilt by concatenating a per-feature section file, so one
 * feature's entries can be refreshed without discarding another's.
 */
export function resetBugLog(feature?: string, prefixes: string[] = []): void {
  fs.mkdirSync(DIR, { recursive: true });
  fs.mkdirSync(SECTIONS, { recursive: true });

  if (!feature) {
    // No feature given — fall back to the original whole-directory reset.
    for (const f of fs.readdirSync(DIR)) {
      if (f.toLowerCase().endsWith('.png')) fs.unlinkSync(path.join(DIR, f));
    }
    for (const f of fs.readdirSync(SECTIONS)) fs.unlinkSync(path.join(SECTIONS, f));
    rebuildBugsMd();
    return;
  }

  // Drop only this feature's screenshots. A PNG left behind for a test that now
  // passes is misleading evidence — the snapshot set must match this execution.
  for (const f of fs.readdirSync(DIR)) {
    if (!f.toLowerCase().endsWith('.png')) continue;
    if (prefixes.some((p) => f.startsWith(p))) fs.unlinkSync(path.join(DIR, f));
  }
  fs.writeFileSync(path.join(SECTIONS, `${feature}.md`), '', 'utf8');
  rebuildBugsMd();
}

/** Reassemble BUGS.md from every feature's section, newest run metadata on top. */
function rebuildBugsMd(): void {
  fs.mkdirSync(SECTIONS, { recursive: true });
  const header = `# Bug log\n\nRun by: ${config.studentId}\nTimestamp: ${RUN_TIMESTAMP}\n\n`;
  const body = fs
    .readdirSync(SECTIONS)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => fs.readFileSync(path.join(SECTIONS, f), 'utf8'))
    .join('');
  fs.writeFileSync(BUGS_MD, header + body, 'utf8');
}

export async function captureBug(
  driver: WebDriver,
  info: { tcId: string; feature: string; expected: string; actual: string; severity?: string },
): Promise<string> {
  fs.mkdirSync(DIR, { recursive: true });
  fs.mkdirSync(SECTIONS, { recursive: true });
  const section = path.join(SECTIONS, `${info.feature}.md`);
  const shot = path.join(DIR, `${info.tcId}.png`);

  let note = '';
  try {
    fs.writeFileSync(shot, Buffer.from(await driver.takeScreenshot(), 'base64'));
  } catch (e) {
    // A dead session or an open alert can block the screenshot — the log entry still matters.
    note = `> Screenshot for ${info.tcId} unavailable: ${(e as Error).message}\n\n`;
  }

  fs.appendFileSync(
    section,
    note +
      `## ${info.tcId} - ${info.feature}\n\n` +
      `- Browser: ${config.browser}\n` +
      `- Severity: ${info.severity ?? 'TBD'}\n` +
      `- Expected: ${info.expected}\n` +
      `- Actual: ${info.actual}\n` +
      // Forward slashes: a Windows backslash path breaks the Markdown link.
      `- Screenshot: ${path.relative(path.resolve(__dirname, '..'), shot).split(path.sep).join('/')}\n` +
      `- GitHub Issue: TBD\n\n`,
    'utf8',
  );
  rebuildBugsMd();
  return shot;
}
