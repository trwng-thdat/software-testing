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

  const html = fs.readFileSync(htmlPath, 'utf8');
  if (html.includes(MARKER)) return; // idempotent

  const banner = buildBanner(feature, browser);

  // The banner must go INSIDE <body>, immediately after the opening tag.
  //
  // Anchoring on `</head>` (the previous approach) put the markup between
  // </head> and <body>, which is not a legal position for flow content: the
  // HTML parser hoists it out of the document flow, so the text existed in the
  // file but never rendered. A byte-level check still passed, which is exactly
  // the false negative that hid it.
  //
  // The <body> tag cannot be matched with `<body([^>]*)>` either, because its
  // `data-raw` attribute holds a JSON blob full of escaped '>' characters that
  // terminate the match early. Instead: find `<body`, then scan forward for the
  // first '>' that sits outside a quoted attribute value.
  const bodyStart = html.toLowerCase().indexOf('<body');
  if (bodyStart === -1) throw new Error(`Failed to inject metadata into ${htmlPath}: no <body> found.`);
  const tagEnd = findTagEnd(html, bodyStart);
  if (tagEnd === -1) throw new Error(`Failed to inject metadata into ${htmlPath}: <body> tag is unterminated.`);

  const insertAt = tagEnd + 1;
  const stamped = html.slice(0, insertAt) + banner + html.slice(insertAt);
  fs.writeFileSync(htmlPath, stamped, 'utf8');

  // A silently failed inject leaves an unstamped report, which fails the anti-cheat check.
  const verify = fs.readFileSync(htmlPath, 'utf8');
  if (!verify.includes(MARKER) || !verify.includes(RUN_BY) || !verify.includes(RUN_TIMESTAMP)) {
    throw new Error(`Metadata verification failed for ${htmlPath}`);
  }
}

/**
 * The visible banner.
 *
 * mochawesome is a React app that mounts into `#report` and repaints on load,
 * so a plain sibling <div> can end up visually buried under the rendered
 * report. The banner is therefore `position:sticky` at the top of the page with
 * a high z-index, which keeps it on screen while the grader scrolls, and it is
 * emitted before the mount point so it is the first thing painted.
 */
function buildBanner(feature: string, browser: string): string {
  return `
<div ${MARKER}="1" style="position:sticky;top:0;z-index:99999;padding:14px 20px;background:#1f2937;color:#f9fafb;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;line-height:1.7;border-bottom:3px solid #10b981;box-shadow:0 2px 8px rgba(0,0,0,.35)">
  <div style="font-size:18px;font-weight:700;letter-spacing:.3px">${RUN_BY}</div>
  <div>Student: ${config.studentName}</div>
  <div>Feature: ${feature}</div>
  <div>Browser: ${browser}</div>
  <div>Timestamp: ${RUN_TIMESTAMP}</div>
</div>`;
}

/**
 * Index of the '>' that closes the tag starting at `from`, skipping any '>'
 * that appears inside a single- or double-quoted attribute value.
 */
function findTagEnd(html: string, from: number): number {
  let quote: string | null = null;
  for (let i = from; i < html.length; i++) {
    const ch = html[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '>') {
      return i;
    }
  }
  return -1;
}
