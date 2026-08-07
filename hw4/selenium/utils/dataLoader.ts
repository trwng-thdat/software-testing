import fs from 'fs';
import path from 'path';

export interface TestCase<I = any, E = any> {
  tcId: string;
  title: string;
  type: 'positive' | 'negative' | 'edge';
  input: I;
  expected: E;
  /** SRS clause this case asserts against — kept in the data file so the oracle is traceable. */
  srs?: string;
  skipReason?: string;
}

export function loadCases<I, E>(feature: string, min = 12): TestCase<I, E>[] {
  const file = path.resolve(__dirname, '..', 'data', `${feature}.data.json`);
  const cases = JSON.parse(fs.readFileSync(file, 'utf8')) as TestCase<I, E>[];
  if (!Array.isArray(cases)) throw new Error(`${file} must contain an array of test cases`);
  if (cases.length < min) {
    throw new Error(`${feature}: ${cases.length} cases found, HW04 requires >= ${min}`);
  }
  const dupes = cases.map((c) => c.tcId).filter((id, i, a) => a.indexOf(id) !== i);
  if (dupes.length) throw new Error(`Duplicate tcId(s) in ${feature}: ${dupes.join(', ')}`);
  return cases;
}
