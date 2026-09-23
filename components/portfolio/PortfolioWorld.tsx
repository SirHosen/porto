"use client";

import { useCallback, useMemo, useRef, type RefObject } from "react";
import { CatmullRomCurve3, Vector3, type Camera, type Group } from "three";
import CameraWorld, { Blocks, type Block, type CameraWorldProps } from "@/components/prototype/CameraWorld";
import { WAYPOINTS } from "@/lib/portfolio";
import { SpatialObjects } from "./SpatialObjects";

type Props = Omit<CameraWorldProps, "path" | "children" | "onFrame"> & {
  panels: RefObject<(HTMLDivElement | null)[]>;
  metrics: RefObject<{ width: number; height: number }[]>;
};

// Preserve the approved, arc-length parameterized, continuous thirteen-stop path.
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
  return { center: eye.addScaledVector(forward, 24), right: new Vector3().crossVectors(forward, UP).normalize() };
});

function Gallery() {
  const ribs = useMemo(() => {
    const items: Block[] = [];
    // Peripheral slats describe a real volume without crossing the reading plane.
    for(let i=0;i<52;i++) {
      const z=22-i*10, side=i%2?1:-1;
      items.push({position:[side*24,9,z],scale:[.045,30,.06],color:"#42484a"});
      if(i%4===0) items.push({position:[side*24,24,z],scale:[11,.045,.06],color:"#535a5c"});
    }
    return items;
  },[]);
  return <>
    <color attach="background" args={["#17191c"]} />
    <fog attach="fog" args={["#17191c",27,65]} />
    <ambientLight intensity={.8} />
    <directionalLight position={[-15,25,20]} intensity={3.2} color="#eeeade" />
    <directionalLight position={[20,8,-15]} intensity={2.3} color="#aebdcd" />
    <directionalLight position={[0,-12,15]} intensity={.65} color="#f24b3e" />
    <Blocks items={ribs} />
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-8,-230]}>
      <planeGeometry args={[160,650]} /><meshLambertMaterial color="#1c2023" />
    </mesh>
  </>;
}

export default function PortfolioWorld({ panels, metrics, ...props }: Props) {
  const sculptures = useRef<(Group|null)[]>([]);
  const state = useMemo(() => ({
    anchor: new Vector3(), projected: new Vector3(), view: new Vector3(),
    visible: new Array<boolean>(WAYPOINTS.length).fill(false),
    interactive: new Array<boolean>(WAYPOINTS.length).fill(false),
  }), []);

  const project = useCallback((camera: Camera, width: number, height: number, progress: number) => {
    const focal = height / (2 * Math.tan(58 * Math.PI / 360));
    const unitsPerPixel = 24 / focal;
    const active = Math.min(12, Math.round(progress * 12));
    const mobile = width <= 760;
    for (let i = 0; i < WAYPOINTS.length; i++) {
      const panel = panels.current[i];
      if (!panel) continue;
      const isProject = i >= 2 && i <= 10;
      state.anchor.copy(POSES[i].center);
      state.view.copy(state.anchor).applyMatrix4(camera.matrixWorldInverse);
      const depth = -state.view.z;
      // Adjacent sculptures remain in space. Hide distant text so it never
      // becomes a stack of labels behind the current reading surface.
      const visible = depth > 4 && depth < 64 && Math.abs(progress-WAYPOINTS[i].progress) < .052;
      const interactive = visible && active === i;
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
        const x = (state.projected.x * .5 + .5) * width;
        const y = (-state.projected.y * .5 + .5) * height;
        panel.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) translate(-50%,-50%) scale(" + (24/depth).toFixed(5) + ")";
        panel.style.opacity = String(Math.min(1,(64-depth)/14,(depth-4)/8));
      }

      const sculpture = sculptures.current[i];
      if(!sculpture) continue;
      sculpture.visible = depth > -12 && depth < 66;
      if(!sculpture.visible) continue;
      const panelHeight = metrics.current[i]?.height ?? 520;
      const local = progress * 12-i;
      const mobileObjectHeight = Math.min(width*.68, height*(height<=670 ? .17 : .235));
      const offsetX = mobile ? 0 : Math.min(width*.205,300);
      // Match the reserved native-layout object volume, not screen-space fake parallax.
      const offsetY = mobile ? panelHeight/2 - (isProject ? 30 : 0) - mobileObjectHeight/2 - 12 : i===0 ? 10 : 0;
      sculpture.position.copy(POSES[i].center).addScaledVector(POSES[i].right,offsetX*unitsPerPixel).addScaledVector(UP,offsetY*unitsPerPixel);
      sculpture.rotation.set(.3 + local*.12,-.7 + local*.55,-.12 + local*.07);
      const pixels = mobile ? mobileObjectHeight*1.12 : Math.min(height*.64,width*.43);
      sculpture.scale.setScalar(pixels*unitsPerPixel/(sculpture.userData.radius*2));
    }
  }, [metrics, panels, state]);

  return <CameraWorld {...props} path={PATH} pointerParallax onFrame={project}>
    <Gallery />
    <SpatialObjects groups={sculptures} />
  </CameraWorld>;
}
