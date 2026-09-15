import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { CATS, SKILLS, DOMAIN_COPY } from '../assets/js/data.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/audit/baseline-manifest.json', import.meta.url)));
const snapshot = JSON.parse(readFileSync(new URL('../docs/audit/skills-verbatim.json', import.meta.url)));
const intentionallyMigrated = new Set(['package.json', 'package-lock.json', '.gitignore']);
for (const file of baseline.files) {
  if (intentionallyMigrated.has(file.path)) continue;
  assert.equal(createHash('sha256').update(readFileSync(new URL('../' + file.path, import.meta.url))).digest('hex'), file.sha256, file.path + ' changed during the isolated prototype');
}
assert.deepEqual(CATS, snapshot.CATS);
assert.deepEqual(SKILLS, snapshot.SKILLS);
assert.deepEqual(DOMAIN_COPY, snapshot.DOMAIN_COPY);
assert.equal(SKILLS.length, 45);
console.log('PASS: 45 skills, 6 descriptions, and all original application/assets files remain unchanged.');
