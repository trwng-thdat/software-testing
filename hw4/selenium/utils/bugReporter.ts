import { WebDriver } from 'selenium-webdriver';
import * as fs from 'fs';
import * as path from 'path';

const BUG_SNAPSHOTS_DIR = path.resolve(__dirname, '..', 'bug-snapshots');
const BUGS_MD_PATH = path.join(BUG_SNAPSHOTS_DIR, 'BUGS.md');

export function initBugReport(): void {
  if (!fs.existsSync(BUG_SNAPSHOTS_DIR)) {
    fs.mkdirSync(BUG_SNAPSHOTS_DIR, { recursive: true });
  }
  fs.writeFileSync(BUGS_MD_PATH, '# Bug Evidence\n\n', 'utf-8');
}

export async function captureBugEvidence(
  driver: WebDriver,
  tcId: string,
  expected: string,
  actual: string,
  browser: string,
  feature: string,
): Promise<void> {
  const screenshotPath = path.join(BUG_SNAPSHOTS_DIR, `${tcId}.png`);
  try {
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
  } catch {
    // Screenshot may fail; continue
  }

  const entry = [
    `## ${tcId}`,
    `- **Feature**: ${feature}`,
    `- **Browser**: ${browser}`,
    `- **Expected**: ${expected}`,
    `- **Actual**: ${actual}`,
    `- **Screenshot**: ${tcId}.png`,
    `- **Timestamp**: ${new Date().toISOString()}`,
    '',
  ].join('\n');

  fs.appendFileSync(BUGS_MD_PATH, entry, 'utf-8');
}
