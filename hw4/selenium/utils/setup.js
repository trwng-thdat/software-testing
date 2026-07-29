require('dotenv').config();

const studentId = process.env.STUDENT_ID || 'UNKNOWN';
const studentName = process.env.STUDENT_NAME || 'UNKNOWN';
const browser = process.env.BROWSER || 'chrome';
const featureName = process.env.FEATURE_NAME || 'FR-05';
const featureLabel = process.env.FEATURE_LABEL || '';
const reportDir = process.env.MOCHAWESOME_REPORTDIR || 'reports/product-listing-search';
const reportFilename = process.env.MOCHAWESOME_REPORTFILENAME || 'index';
const now = new Date().toISOString();

const label = featureLabel ? featureName + ': ' + featureLabel : featureName;
const title = 'Run by: ' + studentId + ' | ' + studentName + ' | Browser: ' + browser + ' | ' + label + ' | ' + now;

process.env.MOCHAWESOME_REPORTTITLE = title;
