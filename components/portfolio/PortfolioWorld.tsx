"use client";

import { useCallback, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Points,
  Vector3,
  type Camera,
  type Group,
} from "three";
import CameraWorld, { Blocks, type Block, type CameraWorldProps } from "@/components/prototype/CameraWorld";
import { WAYPOINTS } from "@/lib/portfolio";
import { SpatialObjects } from "./SpatialObjects";

type Props = Omit<CameraWorldProps, "path" | "children" | "onFrame"> & {
  panels: RefObject<(HTMLDivElement | null)[]>;
  metrics: RefObject<{ width: number; height: number }[]>;
};

// Continuous thirteen-stop spline path
const PATH = new CatmullRomCurve3(
  WAYPOINTS.map((_, i) => new Vector3(Math.sin(i * 1.15) * 3.5, 4 + Math.sin(i * 0.7) * 0.8, 18 - i * 38)),
  false,
  "centripetal"
);
PATH.arcLengthDivisions = 960;
PATH.updateArcLengths();

const UP = new Vector3(0, 1, 0);
const POSES = WAYPOINTS.map((stop) => {
  const eye = PATH.getPointAt(stop.progress);
  const forward = PATH.getTangentAt(stop.progress);
  return {
    center: eye.addScaledVector(forward, 24),
    right: new Vector3().crossVectors(forward, UP).normalize(),
  };
});

// Luminous 3D Starfield & Particle Dust
function CinematicStarfield() {
  const pointsRef = useRef<Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 2400;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new Color("#ffffff"),
      new Color("#00f0ff"), // Cyan
      new Color("#ffd166"), // Gold
      new Color("#f24b3e"), // Vermilion
      new Color("#38bdf8"), // Ice Blue
    ];

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution around camera corridor
      const z = 30 - Math.random() * 520;
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 45;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius + 4;
      pos[i * 3 + 2] = z;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.z = Math.sin(t * 0.04) * 0.05;
    pointsRef.current.rotation.y = t * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Cybernetic Corridor & Horizon Grid
function CyberCorridor() {
  const architecture = useMemo(() => {
    const items: Block[] = [];

    // Structural architectural pylons along the corridor
    for (let i = 0; i < 56; i++) {
      const z = 24 - i * 9.5;
      const side = i % 2 ? 1 : -1;
      const x = side * 22;

      // Dark carbon vertical pylon
      items.push({ position: [x, 10, z], scale: [0.18, 32, 0.24], color: "#161b22" });

      // Emissive LED accent strips (Cyan and Vermilion)
      const accent = i % 4 === 0 ? "#00f0ff" : i % 4 === 2 ? "#f24b3e" : "#30363d";
      items.push({ position: [x - side * 0.12, 10, z], scale: [0.05, 30, 0.05], color: accent });

      // Overhead cantilever truss
      if (i % 3 === 0) {
        items.push({ position: [x - side * 5, 24, z], scale: [10, 0.12, 0.15], color: "#21262d" });
      }

      // Runway floor guide nodes
      items.push({ position: [side * 9, -7.8, z], scale: [0.15, 0.06, 0.4], color: i % 2 === 0 ? "#00f0ff" : "#f24b3e" });
    }

    // Distant cybernetic monoliths
    for (let i = 0; i < 36; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = 10 - i * 14;
      const x = side * (32 + (i % 7) * 4);
      const h = 20 + ((i * 13) % 35);
      items.push({
        position: [x, h / 2 - 8, z],
        scale: [3 + (i % 3), h, 3 + (i % 4)],
        color: i % 5 === 0 ? "#11141a" : "#0d1016",
      });
    }

    return items;
  }, []);

  return (
    <>
      <color attach="background" args={["#06070a"]} />
      <fog attach="fog" args={["#06070a", 22, 135]} />

      {/* Cinematic studio lights */}
      <ambientLight intensity={1.1} color="#0c101c" />
      <directionalLight position={[-16, 28, 24]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[24, 12, -18]} intensity={2.2} color="#00e5ff" />
      <directionalLight position={[0, -10, 16]} intensity={1.6} color="#f24b3e" />
      <pointLight position={[0, 6, 0]} intensity={3.0} distance={45} color="#00f0ff" />
      <pointLight position={[0, 6, -200]} intensity={3.0} distance={60} color="#f24b3e" />
      <pointLight position={[0, 6, -400]} intensity={3.0} distance={60} color="#00f0ff" />

      {/* Stardust field */}
      <CinematicStarfield />

      {/* Corridor structure */}
      <Blocks items={architecture} />

      {/* Reflective dark cyber floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, -240]}>
        <planeGeometry args={[180, 680]} />
        <meshStandardMaterial color="#080a0f" roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Grid coordinate line accents */}
      {[-12, -4, 4, 12].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, -7.94, -240]}>
          <planeGeometry args={[0.08, 680]} />
          <meshBasicMaterial color={x === -4 || x === 4 ? "#00f0ff" : "#f24b3e"} transparent opacity={0.35} />
        </mesh>
      ))}
    </>
  );
}

export default function PortfolioWorld({ panels, metrics, ...props }: Props) {
  const sculptures = useRef<(Group | null)[]>([]);
  const state = useMemo(
    () => ({
      anchor: new Vector3(),
      projected: new Vector3(),
      view: new Vector3(),
      visible: new Array<boolean>(WAYPOINTS.length).fill(false),
      interactive: new Array<boolean>(WAYPOINTS.length).fill(false),
    }),
    []
  );

  const project = useCallback(
    (camera: Camera, width: number, height: number, progress: number) => {
      const focal = height / (2 * Math.tan((58 * Math.PI) / 360));
      const unitsPerPixel = 24 / focal;
      const active = Math.min(12, Math.round(progress * 12));
      const mobile = width <= 760;
      const time = performance.now() * 0.001;

      for (let i = 0; i < WAYPOINTS.length; i++) {
        const panel = panels.current[i];
        if (!panel) continue;

        const isProject = i >= 2 && i <= 10;
        state.anchor.copy(POSES[i].center);
        state.view.copy(state.anchor).applyMatrix4(camera.matrixWorldInverse);
        const depth = -state.view.z;

        // Smooth cosine cross-fade window (no blank gaps between waypoints)
        const dist = Math.abs(progress - WAYPOINTS[i].progress);
        const visible = depth > 3.5 && depth < 72 && dist < 0.088;
        const interactive = visible && active === i && dist < 0.048;

        if (state.visible[i] !== visible) {
          panel.style.visibility = visible ? "visible" : "hidden";
          panel.dataset.visible = String(visible);
          state.visible[i] = visible;
        }

        if (state.interactive[i] !== interactive || panel.inert !== !interactive) {
          panel.inert = !interactive;
          panel.dataset.active = String(interactive);
          panel.style.pointerEvents = interactive ? "auto" : "none";
          state.interactive[i] = interactive;
        }

        if (visible) {
          state.projected.copy(state.anchor).project(camera);
          const x = (state.projected.x * 0.5 + 0.5) * width;
          const y = (-state.projected.y * 0.5 + 0.5) * height;

          // Smooth cosine curve for graceful fade-in and fade-out
          const progressEase = Math.max(0, Math.cos((dist / 0.088) * Math.PI * 0.5));
          const depthEase = Math.min(1, (72 - depth) / 14, (depth - 3.5) / 6);
          const opacity = Math.max(0, Math.min(1, progressEase * depthEase));

          panel.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%) scale(${(24 / depth).toFixed(5)})`;
          panel.style.opacity = opacity.toFixed(3);
        }

        // 3D Sculpture placement & continuous ambient life
        const sculpture = sculptures.current[i];
        if (!sculpture) continue;

        sculpture.visible = depth > -15 && depth < 70;
        if (!sculpture.visible) continue;

        const panelHeight = metrics.current[i]?.height ?? 520;
        const local = progress * 12 - i;
        const mobileObjectHeight = Math.min(width * 0.68, height * (height <= 670 ? 0.17 : 0.235));
        const offsetX = mobile ? 0 : Math.min(width * 0.205, 300);
        const offsetY = mobile
          ? panelHeight / 2 - (isProject ? 30 : 0) - mobileObjectHeight / 2 - 12
          : i === 0
          ? 10
          : 0;

        // Subtle organic breathing float
        const floatY = Math.sin(time * 1.3 + i * 1.1) * (unitsPerPixel * 5);
        sculpture.position
          .copy(POSES[i].center)
          .addScaledVector(POSES[i].right, offsetX * unitsPerPixel)
          .addScaledVector(UP, offsetY * unitsPerPixel + floatY);

        // Dynamic rotation combining scroll progress and continuous subtle ambient spin
        const ambientSpin = Math.sin(time * 0.65 + i * 0.8) * 0.07;
        sculpture.rotation.set(
          0.26 + local * 0.14 + ambientSpin,
          -0.68 + local * 0.55 + time * 0.12,
          -0.11 + local * 0.07
        );

        const pixels = mobile ? mobileObjectHeight * 1.15 : Math.min(height * 0.64, width * 0.43);
        sculpture.scale.setScalar((pixels * unitsPerPixel) / (sculpture.userData.radius * 2));
      }
    },
    [metrics, panels, state]
  );

  return (
    <CameraWorld {...props} path={PATH} pointerParallax onFrame={project}>
      <CyberCorridor />
      <SpatialObjects groups={sculptures} />
    </CameraWorld>
  );
}
