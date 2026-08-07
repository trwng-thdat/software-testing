import fs from 'fs';
import { config, RUN_BY, RUN_TIMESTAMP } from './config';

/**
 * Inject a visible metadata banner into the generated mochawesome HTML.
 * Anti-cheat requirement: `Run by: <StudentID>` and an ISO timestamp must be
 * readable by simply opening the file — console output does not count.
 */
/**
 * Marks our injected block. Do NOT use the bare `Run by:` string as the
 * idempotency probe: mochawesome serialises the whole run into a `data-raw`
 * attribute on <body>, and the suite title already contains `Run by: <id>`,
 * so a substring check matches on the very first (unstamped) pass.
 */
const MARKER = 'data-hw04-metadata-banner';

export function injectMetadata(htmlPath: string, feature: string, browser = config.browser): void {
  if (!fs.existsSync(htmlPath)) throw new Error(`Report not found: ${htmlPath}`);
  const banner = `
<div ${MARKER}="1" style="padding:12px 16px;background:#1f2937;color:#f9fafb;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">
  <strong>${RUN_BY}</strong><br/>
  Student: ${config.studentName}<br/>
  Feature: ${feature}<br/>
  Browser: ${browser}<br/>
  Timestamp: ${RUN_TIMESTAMP}
</div>`;
  const html = fs.readFileSync(htmlPath, 'utf8');
  if (html.includes(MARKER)) return; // idempotent

  // Anchor on </head>, not on the <body ...> tag: that tag holds a giant
  // `data-raw` JSON attribute containing '>' characters, so `<body([^>]*)>`
  // matches the wrong closing bracket and corrupts the markup.
  const idx = html.toLowerCase().indexOf('</head>');
  if (idx === -1) throw new Error(`Failed to inject metadata into ${htmlPath}: no </head> found.`);
  const stamped = `${html.slice(0, idx + '</head>'.length)}${banner}${html.slice(idx + '</head>'.length)}`;
  fs.writeFileSync(htmlPath, stamped, 'utf8');

  // A silently failed inject leaves an unstamped report, which fails the anti-cheat check.
  const verify = fs.readFileSync(htmlPath, 'utf8');
  if (!verify.includes(MARKER) || !verify.includes(RUN_BY) || !verify.includes(RUN_TIMESTAMP)) {
    throw new Error(`Metadata verification failed for ${htmlPath}`);
  }
}
