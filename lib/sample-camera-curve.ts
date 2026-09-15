import type { Curve, Vector3 } from "three";

export type CameraVectors = { eye: Vector3; direction: Vector3; before: Vector3; after: Vector3 };

/** Same arc-length position and finite-difference tangent as Three's Curve,
 * but reuse both tangent samples instead of allocating two vectors per frame. */
export function sampleCameraCurve(path: Curve<Vector3>, progress: number, vectors: CameraVectors) {
  const t = path.getUtoTmapping(progress, 0);
  path.getPoint(t, vectors.eye);
  path.getPoint(Math.max(0, t - .0001), vectors.before);
  path.getPoint(Math.min(1, t + .0001), vectors.after);
  vectors.direction.subVectors(vectors.after, vectors.before).normalize();
}
