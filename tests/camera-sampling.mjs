import assert from 'node:assert/strict';
import { CatmullRomCurve3, Vector3 } from 'three';
import { sampleCameraCurve } from '../lib/sample-camera-curve.ts';

for (const count of [9, 13]) {
  const path = new CatmullRomCurve3(Array.from({ length: count }, (_, i) => new Vector3(Math.sin(i * 1.15) * 3.5, 4 + Math.sin(i * .7) * .8, 18 - i * 38)), false, 'centripetal');
  path.arcLengthDivisions = 960; path.updateArcLengths();
  const vectors = { eye: new Vector3(), direction: new Vector3(), before: new Vector3(), after: new Vector3() };
  const references = Object.values(vectors);
  for (let i = 0; i <= 1000; i++) {
    sampleCameraCurve(path, i / 1000, vectors);
    assert.ok(vectors.eye.distanceTo(path.getPointAt(i / 1000)) < 1e-10);
    assert.ok(vectors.direction.distanceTo(path.getTangentAt(i / 1000)) < 1e-10);
    Object.values(vectors).forEach((vector, index) => assert.equal(vector, references[index]));
  }
}
console.log('PASS: 2,002 curve samples match Three exactly, including endpoints, with reused tangent vectors.');
