import fs from 'fs';
import path from 'path';
import { WebDriver } from 'selenium-webdriver';
import { config, RUN_TIMESTAMP } from './config';

const DIR = path.resolve(__dirname, '..', 'bug-snapshots');
const BUGS_MD = path.join(DIR, 'BUGS.md');

export function resetBugLog(): void {
  fs.mkdirSync(DIR, { recursive: true });
  // Drop screenshots from previous runs. A PNG left behind for a test that now
  // passes is misleading evidence — the snapshot set must match this execution.
  for (const f of fs.readdirSync(DIR)) {
    if (f.toLowerCase().endsWith('.png')) fs.unlinkSync(path.join(DIR, f));
  }
  fs.writeFileSync(BUGS_MD, `# Bug log\n\nRun by: ${config.studentId}\nTimestamp: ${RUN_TIMESTAMP}\n\n`, 'utf8');
}

export async function captureBug(
  driver: WebDriver,
  info: { tcId: string; feature: string; expected: string; actual: string; severity?: string },
): Promise<string> {
  fs.mkdirSync(DIR, { recursive: true });
  const shot = path.join(DIR, `${info.tcId}.png`);
  try {
    fs.writeFileSync(shot, Buffer.from(await driver.takeScreenshot(), 'base64'));
  } catch (e) {
    // A dead session or an open alert can block the screenshot — the log entry still matters.
    fs.appendFileSync(BUGS_MD, `> Screenshot for ${info.tcId} unavailable: ${(e as Error).message}\n\n`, 'utf8');
  }
  if (!fs.existsSync(BUGS_MD)) resetBugLog();
  fs.appendFileSync(
    BUGS_MD,
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
  return shot;
}
