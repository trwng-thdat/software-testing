import 'dotenv/config';

function required(key: string): string {
  const v = process.env[key];
  if (!v || !v.trim()) {
    throw new Error(`Missing required .env variable: ${key}. Copy .env.example to .env and fill it in.`);
  }
  return v.trim();
}

export type BrowserName = 'chrome' | 'edge' | 'firefox';
const ALLOWED: BrowserName[] = ['chrome', 'edge', 'firefox'];

function parseBrowsers(raw: string): BrowserName[] {
  const list = raw.split(',').map((s) => s.trim().toLowerCase());
  const bad = list.filter((b) => !ALLOWED.includes(b as BrowserName));
  if (bad.length) {
    throw new Error(`Unsupported browser(s): ${bad.join(', ')}. Allowed: ${ALLOWED.join(' | ')}`);
  }
  return list as BrowserName[];
}

function parseBrowser(raw: string | undefined): BrowserName {
  const b = (raw?.trim().toLowerCase() || 'chrome') as BrowserName;
  if (!ALLOWED.includes(b)) {
    throw new Error(`Unsupported BROWSER=${raw}. Allowed: ${ALLOWED.join(' | ')}`);
  }
  return b;
}

export const config = {
  studentId: required('STUDENT_ID'),
  studentName: required('STUDENT_NAME'),
  apiUrl: required('API_URL').replace(/\/$/, ''),
  webUrl: required('WEB_URL').replace(/\/$/, ''),
  adminUrl: required('ADMIN_URL').replace(/\/$/, ''),
  browsers: parseBrowsers(required('BROWSERS')),
  browser: parseBrowser(process.env.BROWSER),
  headless: process.env.HEADLESS !== 'false',
  timeout: Number(process.env.DEFAULT_TIMEOUT_MS || 10000),
  reportBase: process.env.REPORT_BASE_DIR || 'reports',
  adminEmail: required('ADMIN_EMAIL'),
  adminPassword: required('ADMIN_PASSWORD'),
  userEmail: required('USER_EMAIL'),
  userPassword: required('USER_PASSWORD'),
};

export const RUN_BY = `Run by: ${config.studentId}`;
export const RUN_TIMESTAMP = process.env.RUN_TIMESTAMP?.trim() || new Date().toISOString();
