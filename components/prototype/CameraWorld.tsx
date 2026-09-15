"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { CatmullRomCurve3, Color, InstancedMesh, NoToneMapping, Object3D, Vector3, type Camera } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { CameraDebug, CameraReading } from "@/lib/camera-study";
import { sampleCameraCurve } from "@/lib/sample-camera-curve";

export type CameraWorldProps = {
  track: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onFailure: () => void;
  onProgress: (progress: number) => void;
  path?: CatmullRomCurve3;
  children?: ReactNode;
  onFrame?: (camera: Camera, width: number, height: number, progress: number) => void;
};
export type Block = { position: [number, number, number]; scale: [number, number, number]; color: string; rotation?: number };

// This is a spatial curve, not a sequence of CSS transforms or camera cuts.
// Arc-length sampling keeps travel even through the bends.
const PATH = new CatmullRomCurve3([
  new Vector3(0, 3.3, 18),
  new Vector3(0, 3.0, 3),
  new Vector3(-1.6, 3.1, -12),
  new Vector3(-2.4, 3.4, -28),
  new Vector3(2.5, 3.5, -44),
  new Vector3(3.1, 3.1, -61),
  new Vector3(-1.5, 3.5, -78),
  new Vector3(-1.5, 4.1, -94),
  new Vector3(0, 4.6, -110),
], false, "centripetal");
PATH.arcLengthDivisions = 480;
PATH.updateArcLengths();

export function Blocks({ items }: { items: Block[] }) {
  const mesh = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const transform = new Object3D();
    const color = new Color();
    items.forEach((block, i) => {
      transform.position.set(...block.position);
      transform.scale.set(...block.scale);
      transform.rotation.set(0, block.rotation ?? 0, 0);
      transform.updateMatrix();
      mesh.current!.setMatrixAt(i, transform.matrix);
      mesh.current!.setColorAt(i, color.set(block.color));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [items]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, items.length]} frustumCulled={false}>
    <boxGeometry />
    <meshLambertMaterial />
  </instancedMesh>;
}

function Architecture() {
  const blocks = useMemo(() => {
    const items: Block[] = [];
    const gateZ = [4, -14, -32, -50, -70, -91, -116];
    const gateX = [0, -1.5, -1.7, 2.8, 0.5, -1.5, 0];
    for (let i = 0; i < gateZ.length; i++) {
      const z = gateZ[i], x = gateX[i], h = i % 2 === 0 ? 13 : 11;
      const color = i === 1 || i === 4 ? "#f24b3e" : "#eeeade";
      items.push(
        { position: [x - 7, h / 2 - 2, z], scale: [0.38, h, 0.55], color },
        { position: [x + 7, h / 2 - 2, z], scale: [0.38, h, 0.55], color },
        { position: [x, h - 2, z], scale: [14.38, 0.38, 0.55], color },
        { position: [x, -1.88, z], scale: [14.38, 0.16, 0.55], color },
      );
    }
    // Three unlabelled slabs reserve the gallery's spatial footprint.
    for (const [x, y, z, rotation] of [[-9, 2, -28, 0.25], [10, 3, -43, -0.3], [-9, 2.8, -62, 0.18]]) {
      items.push(
        { position: [x, y, z], scale: [5, 7, 0.3], color: "#eeeade", rotation },
        { position: [x + 0.1, y - 2, z + 0.28], scale: [3.7, 0.12, 0.12], color: "#f24b3e", rotation },
      );
    }
    // Deterministic distant silhouettes; no textures, physics or model downloads.
    for (let i = 0; i < 48; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const height = 4 + ((i * 11) % 17) + ((i * 7) % 9);
      items.push({
        position: [side * (14 + ((i * 7) % 23)), height / 2 - 2, 10 - i * 3.4],
        scale: [1.8 + (i % 4), height, 2 + (i % 3)],
        color: i % 9 === 0 ? "#353532" : "#1e201f",
      });
    }
    for (let i = 0; i < 34; i++) {
      items.push({ position: [0, -1.94, 18 - i * 4], scale: [0.12, 0.04, 1.3], color: "#aba9a1" });
      if (i % 2 === 0) items.push({ position: [0, -1.96, 18 - i * 4], scale: [24, 0.03, 0.04], color: "#353532" });
    }
    return items;
  }, []);

  return <>
    <color attach="background" args={["#101010"]} />
    <fog attach="fog" args={["#101010", 20, 145]} />
    <ambientLight intensity={1.3} />
    <directionalLight position={[-12, 25, 18]} intensity={2} />
    <Blocks items={blocks} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.02, -55]}>
      <planeGeometry args={[260, 360]} />
      <meshLambertMaterial color="#191b1a" />
    </mesh>
    <mesh position={[17, 23, -149]}>
      <circleGeometry args={[20, 64]} />
      <meshBasicMaterial color="#f24b3e" fog={false} />
    </mesh>
  </>;
}

function CameraRig({ track, onReady, onFailure, onProgress, path = PATH, onFrame }: CameraWorldProps) {
  const { camera, gl, advance, size } = useThree();
  const needsFrame = useRef(true);
  const progress = useRef(0);
  const renders = useRef(0);
  const capture = useRef(false);
  const frameTimes = useRef<number[]>([]);
  const samples = useRef<CameraReading["samples"]>([]);
  const lastFrame = useRef(0);
  const vectors = useMemo(() => ({ eye: new Vector3(), direction: new Vector3(), target: new Vector3(), before: new Vector3(), after: new Vector3() }), []);

  useEffect(() => { needsFrame.current = true; }, [size.width, size.height]);

  useFrame(() => {
    const p = progress.current;
    sampleCameraCurve(path, p, vectors);
    camera.position.copy(vectors.eye);
    vectors.target.copy(vectors.eye).addScaledVector(vectors.direction, 12);
    camera.lookAt(vectors.target);
    camera.updateMatrixWorld();
    onFrame?.(camera, size.width, size.height, p);
    renders.current++;
    if (capture.current) {
      const now = performance.now();
      if (lastFrame.current) frameTimes.current.push(now - lastFrame.current);
      lastFrame.current = now;
      if (renders.current % 15 === 0) samples.current.push({ progress: p, position: camera.position.toArray() });
    }
  });

  useEffect(() => {
    if (!track.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const element = track.current;
    const lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: false, duration: 1.05 });
    const update = (value: number) => {
      progress.current = value;
      onProgress(value);
      needsFrame.current = true;
    };
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => update(self.progress),
      onRefresh: (self) => update(self.progress),
    });
    lenis.on("scroll", ScrollTrigger.update);
    // One frame clock: scroll, camera and WebGL render in the same GSAP tick.
    // Queuing a separate demand RAF can halve delivery to 30 fps.
    const tick = (seconds: number) => {
      lenis.raf(seconds * 1000);
      if (needsFrame.current && !document.hidden) {
        needsFrame.current = false;
        advance(seconds, true);
      }
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const webgl = gl.getContext();
    const extension = webgl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(extension ? webgl.getParameter(extension.UNMASKED_RENDERER_WEBGL) : webgl.getParameter(webgl.RENDERER));
    const read = (): CameraReading => ({
      progress: progress.current,
      position: camera.position.toArray(),
      direction: camera.getWorldDirection(vectors.direction).toArray(),
      renderer,
      dpr: gl.getPixelRatio(),
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      renders: renders.current,
      activeTriggers: ScrollTrigger.getAll().length,
      frameTimes: [...frameTimes.current],
      samples: [...samples.current],
    });
    const pending = new Set<() => void>();
    const debug: CameraDebug = {
      read,
      redraw: () => { needsFrame.current = true; },
      travel: (value, seconds = 0) => new Promise<void>((resolve) => {
        const complete = () => { pending.delete(complete); resolve(); };
        pending.add(complete);
        lenis.scrollTo(trigger.start + (trigger.end - trigger.start) * Math.max(0, Math.min(1, value)), {
          immediate: seconds === 0,
          duration: seconds || 1,
          easing: (t) => t,
          force: true,
          onComplete: complete,
        });
        if (seconds === 0) { ScrollTrigger.update(); complete(); }
      }),
      startCapture: () => { frameTimes.current = []; samples.current = []; lastFrame.current = 0; capture.current = true; },
      stopCapture: () => { capture.current = false; return read(); },
    };
    window.__MIDNIGHT_CAMERA__ = debug;
    const visibility = () => {
      if (document.hidden) gsap.ticker.remove(tick);
      else { gsap.ticker.add(tick); lenis.resize(); trigger.refresh(); needsFrame.current = true; }
    };
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    document.addEventListener("visibilitychange", visibility);
    gl.domElement.addEventListener("webglcontextlost", lost, false);
    const refresh = requestAnimationFrame(() => { lenis.resize(); trigger.refresh(); onReady(); });

    return () => {
      cancelAnimationFrame(refresh);
      capture.current = false;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      trigger.kill();
      document.removeEventListener("visibilitychange", visibility);
      gl.domElement.removeEventListener("webglcontextlost", lost);
      if (window.__MIDNIGHT_CAMERA__ === debug) delete window.__MIDNIGHT_CAMERA__;
      pending.forEach((finish) => finish());
    };
  }, [track, camera, gl, advance, onReady, onFailure, onProgress, vectors]);

  return null;
}

export default function CameraWorld(props: CameraWorldProps) {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    // R3F configures its renderer asynchronously. Detect unsupported WebGL
    // before entering that async boundary so failure stays a usable DOM page.
    const probe = document.createElement("canvas");
    try {
      const context = probe.getContext("webgl2");
      if (!context) { props.onFailure(); return; }
      context.getExtension("WEBGL_lose_context")?.loseContext();
      setSupported(true);
    } catch { props.onFailure(); }
  }, [props.onFailure]);
  if (!supported) return null;
  return (
    <Canvas
      frameloop="never"
      dpr={1}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", toneMapping: NoToneMapping }}
      fallback={<span>3D is unavailable. Use the static study.</span>}
      style={{ pointerEvents: "none" }}
    >
      <PerspectiveCamera makeDefault position={[0, 3.3, 18]} fov={58} near={0.1} far={props.path ? 950 : 250} />
      {props.children ?? <Architecture />}
      <CameraRig {...props} />
    </Canvas>
  );
}
