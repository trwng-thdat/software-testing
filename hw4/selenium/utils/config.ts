import 'dotenv/config';

export interface AppConfig {
  studentId: string;
  studentName: string;
  frontendUrl: string;
  apiUrl: string;
  browser: string;
  headless: boolean;
  reportBaseDir: string;
  timestamp: string;
}

export function loadConfig(): AppConfig {
  const studentId = process.env.STUDENT_ID || '';
  const studentName = process.env.STUDENT_NAME || '';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const browser = process.env.BROWSER || 'chrome';
  const headless = process.env.HEADLESS !== 'false';
  const reportBaseDir = process.env.REPORT_BASE_DIR || 'reports';
  const timestamp = process.env.RUN_TIMESTAMP || new Date().toISOString();

  const missing: string[] = [];
  if (!studentId) missing.push('STUDENT_ID');
  if (!studentName) missing.push('STUDENT_NAME');

  if (missing.length > 0) {
    throw new Error(
      `Missing required .env variables: ${missing.join(', ')}. ` +
      'Copy .env.example to .env and fill in your values.'
    );
  }

  return { studentId, studentName, frontendUrl, apiUrl, browser, headless, reportBaseDir, timestamp };
}

export function getRunBy(config: AppConfig): string {
  return `Run by: ${config.studentId}`;
}

export function getReportTitle(config: AppConfig, featureName: string = 'FR-05', featureLabel: string = ''): string {
  const label = featureLabel ? `${featureName}: ${featureLabel}` : featureName;
  return `${getRunBy(config)} | ${config.studentName} | Browser: ${config.browser} | ${label} | ${config.timestamp}`;
}
