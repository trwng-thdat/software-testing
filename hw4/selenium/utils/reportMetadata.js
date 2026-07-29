const fs = require('fs');
const path = require('path');

exports.mochaHooks = {
  afterAll() {
    const reportDir = process.env.MOCHAWESOME_REPORTDIR || 'reports/product-listing-search';
    const reportFilename = process.env.MOCHAWESOME_REPORTFILENAME || 'index';
    const featureName = process.env.FEATURE_NAME || 'FR-05';
    const featureLabel = process.env.FEATURE_LABEL || 'Product Listing & Search';
    const reportPath = path.resolve(reportDir, reportFilename + '.html');

    if (fs.existsSync(reportPath)) {
      let html = fs.readFileSync(reportPath, 'utf-8');
      const featureStr = featureLabel ? featureName + ' ' + featureLabel : featureName;
      const metadata = [
        '<div style="background:#f5f5f5;padding:20px;text-align:center;border-top:3px solid #2563eb;margin-top:40px;font-family:Arial,sans-serif;font-size:14px;color:#333;">',
        '<p style="margin:4px 0;"><strong>Run by: ' + (process.env.STUDENT_ID || 'N/A') + '</strong></p>',
        '<p style="margin:4px 0;">Student: ' + (process.env.STUDENT_NAME || 'N/A') + '</p>',
        '<p style="margin:4px 0;">Browser: ' + (process.env.BROWSER || 'N/A') + '</p>',
        '<p style="margin:4px 0;">Timestamp: ' + new Date().toISOString() + '</p>',
        '<p style="margin:4px 0;">Feature: ' + featureStr + '</p>',
        '</div>',
      ].join('\n');

      html = html.replace('</body>', metadata + '\n</body>');
      fs.writeFileSync(reportPath, html, 'utf-8');
      console.log('Metadata injected into report: ' + reportPath);
    } else {
      console.warn('Report not found for metadata injection: ' + reportPath);
    }
  }
};
