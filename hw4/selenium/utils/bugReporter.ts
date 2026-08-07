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

/**
 * Confirmed SUT defects that already have a filed GitHub Issue.
 *
 * BUGS.md is regenerated on every matrix run, so hand-editing the issue links
 * into it would be wiped by the next run. Keeping the mapping here means the
 * links (and the triaged severity) are re-emitted automatically instead.
 *
 * A TC ID absent from this table is either a new failure or one not yet
 * triaged, and is written out as `TBD` so it stands out as needing attention.
 */
const FILED: Record<string, { issue: number; severity: string }> = {
  // FR-04
  'TC-PROFILE-04': { issue: 263, severity: 'High' },
  'TC-PROFILE-05': { issue: 264, severity: 'High' },
  'TC-PROFILE-08': { issue: 269, severity: 'Medium' },
  'TC-PROFILE-12': { issue: 260, severity: 'Critical' },
  // FR-08
  'TC-CHECKOUT-03': { issue: 270, severity: 'Medium' },
  'TC-CHECKOUT-04': { issue: 265, severity: 'High' },
  'TC-CHECKOUT-07': { issue: 261, severity: 'Critical' },
  'TC-CHECKOUT-13': { issue: 271, severity: 'Medium' },
  'TC-CHECKOUT-16': { issue: 266, severity: 'High' },
  // FR-18
  'TC-ADMIN-07': { issue: 267, severity: 'High' },
  'TC-ADMIN-12': { issue: 262, severity: 'Critical' },
  'TC-ADMIN-14': { issue: 268, severity: 'High' },
  'TC-ADMIN-16': { issue: 272, severity: 'Medium' },
};

const ISSUE_BASE = 'https://github.com/DuyITLOR/group05_eshop/issues/';

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

  const filed = FILED[info.tcId];
  const issueLink = filed ? `[#${filed.issue}](${ISSUE_BASE}${filed.issue})` : 'TBD';

  fs.appendFileSync(
    section,
    note +
      `## ${info.tcId} - ${info.feature}\n\n` +
      `- Browser: ${config.browser}\n` +
      `- Severity: ${info.severity ?? filed?.severity ?? 'TBD'}\n` +
      `- Expected: ${info.expected}\n` +
      `- Actual: ${info.actual}\n` +
      // Forward slashes: a Windows backslash path breaks the Markdown link.
      `- Screenshot: ${path.relative(path.resolve(__dirname, '..'), shot).split(path.sep).join('/')}\n` +
      `- GitHub Issue: ${issueLink}\n\n`,
    'utf8',
  );
  rebuildBugsMd();
  return shot;
}
