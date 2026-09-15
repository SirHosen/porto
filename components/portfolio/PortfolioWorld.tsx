"use client";

import { useCallback, useMemo, useRef, type RefObject } from "react";
import { CatmullRomCurve3, Vector3, Object3D, type Camera, type Group, type InstancedMesh, type MeshLambertMaterial } from "three";
import CameraWorld, { Blocks, type Block, type CameraWorldProps } from "@/components/prototype/CameraWorld";
import { WAYPOINTS, type CoreInput } from "@/lib/portfolio";

type Props = Omit<CameraWorldProps, "path" | "children" | "onFrame"> & {
  panels: RefObject<(HTMLDivElement | null)[]>;
  metrics: RefObject<{ width: number; height: number }[]>;
  core: RefObject<CoreInput>;
};

// Thirteen stops share one arc-length-parameterized curve. No camera cuts.
const PATH = new CatmullRomCurve3(
  WAYPOINTS.map((_, i) => new Vector3(Math.sin(i * 1.15) * 3.5, 4 + Math.sin(i * .7) * .8, 18 - i * 38)),
  false, "centripetal",
);
PATH.arcLengthDivisions = 960;
PATH.updateArcLengths();
const UP = new Vector3(0, 1, 0);
const POSES = WAYPOINTS.map((stop) => {
  const eye = PATH.getPointAt(stop.progress);
  const forward = PATH.getTangentAt(stop.progress);
  const right = new Vector3().crossVectors(forward, UP).normalize();
  return { center: eye.addScaledVector(forward, 24), right };
});

function City() {
  const blocks = useMemo(() => {
    const items: Block[] = [];
    for (let i = 0; i < 94; i++) {
      const side = i % 2 ? -1 : 1, h = 5 + (i * 13) % 27;
      items.push({
        position: [side * (17 + (i * 17) % 35), h / 2 - 3, 24 - i * 5.6],
        scale: [2 + i % 5, h, 3 + i % 4],
        color: i % 7 === 0 ? "#353532" : i % 3 === 0 ? "#202321" : "#171a19",
      });
      // A few ink-city windows; instancing keeps the entire city one draw.
      if (i % 4 === 0) items.push({
        position: [side * (17 + (i * 17) % 35), h * .62 - 3, 26.1 - i * 5.6],
        scale: [.16, h * .32, .05], color: i % 8 === 0 ? "#f24b3e" : "#aba9a1",
      });
    }
    for (let i = 0; i < 14; i++) {
      const z = 3 - i * 38, x = Math.sin(i * 1.15) * 3;
      const color = i % 4 === 0 ? "#eeeade" : "#353532";
      items.push(
        { position: [x - 11, 7, z], scale: [.35, 20, .5], color },
        { position: [x + 11, 7, z], scale: [.35, 20, .5], color },
        { position: [x, 17, z], scale: [22.35, .35, .5], color },
        { position: [x - 10.6, 9, z + .3], scale: [.08, 7, .08], color: "#f24b3e" },
      );
    }
    for (let i = 0; i < 115; i++) {
      items.push({ position: [0, -2.98, 25 - i * 4.4], scale: [.1, .04, 1.6], color: "#aba9a1" });
      if (i % 3 === 0) items.push({ position: [0, -2.99, 25 - i * 4.4], scale: [24, .03, .04], color: "#353532" });
    }
    return items;
  }, []);
  return <>
    <color attach="background" args={["#101010"]} />
    <fog attach="fog" args={["#101010", 24, 180]} />
    <ambientLight intensity={1.3} />
    <directionalLight position={[-30, 45, 30]} intensity={1.8} />
    <Blocks items={blocks} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.02, -240]}>
      <planeGeometry args={[500, 750]} /><meshLambertMaterial color="#191b1a" />
    </mesh>
    <mesh position={[100, 106, -620]}>
      <circleGeometry args={[104, 64]} /><meshBasicMaterial color="#f24b3e" fog={false} />
    </mesh>
    <mesh position={[101, 106, -619.8]} rotation={[0, 0, -.25]}>
      <planeGeometry args={[215, .7]} /><meshBasicMaterial color="#101010" fog={false} />
    </mesh>
  </>;
}

export default function PortfolioWorld({ panels, metrics, core, ...props }: Props) {
  const frames = useRef<InstancedMesh>(null);
  const crystal = useRef<Group>(null);
  const crystalMaterial = useRef<MeshLambertMaterial>(null);
  const state = useMemo(() => ({
    anchor: new Vector3(), projected: new Vector3(), view: new Vector3(),
    local: new Vector3(), transform: new Object3D(),
    visible: new Array<boolean>(WAYPOINTS.length).fill(false),
    interactive: new Array<boolean>(WAYPOINTS.length).fill(false),
    initialized: new Array<boolean>(9).fill(false),
    color: "",
  }), []);

  const project = useCallback((camera: Camera, width: number, height: number, progress: number) => {
    const focal = height / (2 * Math.tan(58 * Math.PI / 360));
    const unitsPerPixel = 24 / focal;
    const active = Math.min(12, Math.round(progress * 12));
    let framesChanged = false;
    for (let i = 0; i < WAYPOINTS.length; i++) {
      const panel = panels.current[i];
      if (!panel) continue;
      const isProject = i >= 2 && i <= 10;
      // Responsive world-space placement, not scroll-derived CSS parallax.
      const offset = isProject && width > 760 ? (i % 2 === 0 ? 1 : -1) * width * .18 * unitsPerPixel : 0;
      state.anchor.copy(POSES[i].center).addScaledVector(POSES[i].right, offset);
      state.view.copy(state.anchor).applyMatrix4(camera.matrixWorldInverse);
      const depth = -state.view.z;
      const visible = depth > 4 && depth < (isProject ? 69 : 66) && (isProject || Math.abs(progress - WAYPOINTS[i].progress) < .065);
      const interactive = visible && active === i;
      const visibilityChanged = state.visible[i] !== visible;
      if (visibilityChanged) {
        panel.style.visibility = visible ? "visible" : "hidden";
        panel.dataset.visible = String(visible);
        state.visible[i] = visible;
      }
      if (state.interactive[i] !== interactive || panel.inert !== !interactive) {
        panel.inert = !interactive;
        panel.style.pointerEvents = interactive ? "auto" : "none";
        state.interactive[i] = interactive;
      }
      if (visible) {
        state.projected.copy(state.anchor).project(camera);
        const x = (state.projected.x * .5 + .5) * width;
        const y = (-state.projected.y * .5 + .5) * height;
        const scale = 24 / depth;
        panel.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) translate(-50%,-50%) scale(" + scale.toFixed(5) + ")";
        panel.style.opacity = String(Math.min(1, (69 - depth) / 12, (depth - 4) / 6));
      }
      if (isProject && frames.current && (visible || visibilityChanged || !state.initialized[i - 2])) {
        const size = metrics.current[i];
        const w = (size?.width ?? 520) * unitsPerPixel + .14;
        const h = (size?.height ?? 480) * unitsPerPixel + .14;
        for (let edge = 0; edge < 4; edge++) {
          const horizontal = edge < 2;
          state.local.set(horizontal ? 0 : (edge === 2 ? -1 : 1) * w / 2, horizontal ? (edge === 0 ? -1 : 1) * h / 2 : 0, -.1).applyQuaternion(camera.quaternion);
          state.transform.position.copy(state.anchor).add(state.local);
          state.transform.quaternion.copy(camera.quaternion);
          state.transform.scale.set(visible ? horizontal ? w : .12 : 0, visible ? horizontal ? .12 : h : 0, .1);
          state.transform.updateMatrix();
          frames.current.setMatrixAt((i - 2) * 4 + edge, state.transform.matrix);
        }
        state.initialized[i - 2] = true;
        framesChanged = true;
      }
    }
    if (frames.current && framesChanged) frames.current.instanceMatrix.needsUpdate = true;
    if (crystal.current) {
      const input = core.current;
      crystal.current.visible = input.visible && active === 11 && width > 760;
      if (crystal.current.visible) {
        state.local.set(input.offsetX * unitsPerPixel, -input.offsetY * unitsPerPixel, 0).applyQuaternion(camera.quaternion);
        crystal.current.position.copy(POSES[11].center).add(state.local);
        crystal.current.quaternion.copy(camera.quaternion);
        crystal.current.rotateX(input.x);
        crystal.current.rotateY(input.y);
        crystal.current.scale.setScalar(input.radius * unitsPerPixel);
        if (state.color !== input.color && crystalMaterial.current) {
          crystalMaterial.current.color.set(input.color);
          state.color = input.color;
        }
      }
    }
  }, [core, metrics, panels, state]);

  return <CameraWorld {...props} path={PATH} onFrame={project}>
    <City />
    <instancedMesh ref={frames} args={[undefined, undefined, 36]} frustumCulled={false}>
      <boxGeometry /><meshLambertMaterial color="#f24b3e" />
    </instancedMesh>
    <group ref={crystal} visible={false}>
      <mesh rotation={[.1, 0, .15]}>
        <octahedronGeometry args={[1.03, 0]} />
        <meshLambertMaterial ref={crystalMaterial} color="#f24b3e" />
      </mesh>
      <mesh rotation={[.1, 0, .15]} scale={1.015}>
        <octahedronGeometry args={[1.03, 0]} /><meshBasicMaterial color="#101010" wireframe />
      </mesh>
      <mesh rotation={[1.1, .3, .35]}>
        <torusGeometry args={[1.45, .018, 5, 48]} /><meshBasicMaterial color="#eeeade" />
      </mesh>
      <mesh rotation={[.3, 1.15, -.3]}>
        <torusGeometry args={[1.65, .012, 5, 48]} /><meshBasicMaterial color="#aba9a1" />
      </mesh>
    </group>
  </CameraWorld>;
}
