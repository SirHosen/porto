"use client";

import { useLayoutEffect, useMemo, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import { BufferAttribute, Color, CylinderGeometry, ExtrudeGeometry, MeshStandardMaterial, Object3D, PMREMGenerator, Shape, TorusGeometry, type BufferGeometry, type Group } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Part = { at: [number, number, number]; size: [number, number, number]; color?: string; rotate?: [number, number, number]; shape?: "h" | "ring" | "disc" };
const PAPER = "#dddcd3", METAL = "#9ba8ad", DARK = "#333b40", RED = "#f24b3e";
const part = (at: Part["at"], size: Part["size"], color = PAPER, rotate?: Part["rotate"], shape?: Part["shape"]): Part => ({ at, size, color, rotate, shape });

function letterGeometry() {
  const shape = new Shape();
  const outline = [[-2,-3],[-.8,-3],[-.8,-.6],[.8,-.6],[.8,-3],[2,-3],[2,3],[.8,3],[.8,.6],[-.8,.6],[-.8,3],[-2,3]];
  shape.moveTo(outline[0][0], outline[0][1]);
  outline.slice(1).forEach(([x,y]) => shape.lineTo(x,y)); shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: .1, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .035, bevelThickness: .025, curveSegments: 1 });
  geometry.center(); return geometry;
}

// Original procedural sculptures: conceptual representations, not product captures.
// Merged vertex-coloured parts keep each exhibit to one draw call.
function recipe(index: number): Part[] {
  const parts: Part[] = [];
  if (index === 0 || index === 12) {
    for (let i = 0; i < 12; i++) parts.push(part([0, 0, (i - 5.5) * .38], [1, 1, 1], i === 5 || i === 6 ? RED : i === 0 || i === 11 ? PAPER : METAL, undefined, "h"));
    for (const x of [-1.4, 1.4]) for (const y of [-2.4, 2.4]) parts.push(part([x,y,0],[.1,.1,4.6],DARK));
    for (const x of [-1.4, 1.4]) for (const y of [-2.4, 2.4]) for(const z of [-2.3,2.3])
      parts.push(part([x,y,z],[.085,.08,.085],DARK,[Math.PI/2,0,0],"disc"));
  } else if (index === 1) {
    // Workstation: keyboard, display and its stand. No invented terminal output.
    parts.push(part([0,1,0],[5,3.2,.28],DARK),part([0,1,.16],[4.65,2.85,.045],METAL),part([0,-1,0],[.45,1.2,.35],DARK),part([0,-1.6,.6],[3,.16,1.7],METAL));
    for(let i=0;i<5;i++) parts.push(part([-1.1,.1+i*.35,.21],[1.4+(i%3)*.45,.08,.04],i===2?RED:DARK));
    parts.push(part([0,-2,2],[4,.15,1.35],DARK));
    for(let r=0;r<3;r++) for(let c=0;c<10;c++) parts.push(part([-1.75+c*.39,-1.88,1.57+r*.36],[.3,.08,.26],r===1&&c===0?RED:METAL));
  } else if(index === 2) {
    // Cached records: nested storage trays, with one drawer pulled out.
    for(let i=0;i<6;i++) {
      const z=i===3?1.25:0;
      parts.push(part([0,(i-2.5)*.72,z],[4.4,.48,3.15],i===3?RED:i%2?METAL:PAPER));
      parts.push(part([-1.4,(i-2.5)*.72,z+1.59],[.65,.055,.035],DARK));
      parts.push(part([1.55,(i-2.5)*.72,z+1.6],[.12,.12,.04],i===3?PAPER:RED));
    }
    for(const x of [-2,2]) parts.push(part([x,0,-1.25],[.1,4.5,.1],DARK));
  } else if(index === 3) {
    // Catalog/browser surfaces, deliberately without invented screenshots.
    for(let i=0;i<4;i++) {
      const x=(i-1.5)*.6,y=(i-1.5)*.55,z=-i*.65;
      parts.push(part([x,y,z],[4.2,3,.15],i===0?PAPER:METAL));
      parts.push(part([x,y+1.15,z+.1],[3.8,.08,.03],DARK));
      for(let c=0;c<3;c++) parts.push(part([x-1.1+c*1.1,y-.05,z+.1],[.88,1.4,.045],c===1&&i===0?RED:DARK));
    }
  } else if(index === 4) {
    // A layered learning lattice. No accuracy/profit claims.
    for(let x=0;x<4;x++) for(let y=0;y<4;y++) {
      const h=.45+Math.sin(x*.9+y*1.3)*.3;
      parts.push(part([(x-1.5)*1.05,(y-1.5)*1.05,Math.sin(x+y)*.65],[h,h,h],x===y?RED:METAL));
      if(x<3) parts.push(part([(x-1)*1.05,(y-1.5)*1.05,0],[.8,.035,.035],DARK));
      if(y<3) parts.push(part([(x-1.5)*1.05,(y-1)*1.05,0],[.035,.8,.035],DARK));
    }
    parts.push(part([0,0,-1.45],[4.8,4.8,.12],DARK));
  } else if(index === 5) {
    // Grooved record and tonearm, not a decorative orbit.
    parts.push(part([0,0,-.08],[2.15,.12,2.15],DARK,[Math.PI/2,0,0],"disc"));
    for(let i=0;i<9;i++) parts.push(part([0,0,0],[.62+i*.18,.62+i*.18,.45],i===0?RED:i%2?METAL:DARK,undefined,"ring"));
    parts.push(part([0,0,.025],[.5,.06,.5],RED,[Math.PI/2,0,0],"disc"));
    parts.push(part([0,0,.065],[.055,.04,.055],DARK,[Math.PI/2,0,0],"disc"));
    parts.push(part([2.6,.15,.45],[.12,3.8,.15],PAPER,[0,0,-.22]));
    parts.push(part([3.015,2.004,.45],[.22,.14,.22],DARK,[Math.PI/2,0,0],"disc"));
    parts.push(part([2.185,-1.704,.45],[.28,.42,.22],DARK,[0,0,-.22]));
  } else if(index === 6) {
    // A deterministic waveform, not measured project telemetry.
    for(let i=0;i<31;i++) {
      const h=.35+Math.abs(Math.sin(i*.58)*Math.sin(i*.17))*4;
      parts.push(part([(i-15)*.18,0,Math.cos(i*.2)*.45],[.11,h,.32],i>12&&i<19?RED:METAL));
    }
    parts.push(part([0,-2.5,0],[6,.07,.07],DARK));
  } else if(index === 7) {
    // Automated form stages: separate, successive field planes.
    for(let i=0;i<3;i++) {
      const x=(i-1)*1.5,z=-i*.85,y=(i-1)*.35;
      parts.push(part([x,y,z],[2.4,3.7,.15],i===0?PAPER:METAL));
      for(let r=0;r<4;r++) parts.push(part([x,y+.9-r*.53,z+.1],[1.85,.25,.04],DARK));
      parts.push(part([x+.4,y-1.3,z+.12],[1,.3,.06],RED));
    }
  } else if(index === 8) {
    // Separate controlled browser sessions, connected through one lifecycle.
    for(let i=0;i<3;i++) {
      const x=(i-1)*1.7, y=(i-1)*.6, z=-i*.7;
      parts.push(part([x,y,z],[2.5,3.1,.16],i===1?PAPER:METAL));
      parts.push(part([x,y+1.15,z+.1],[2.12,.1,.04],DARK));
      parts.push(part([x,y,z+.1],[1.95,1.55,.04],DARK));
      parts.push(part([x-.55,y-.92,z+.13],[.5,.12,.04],RED));
      parts.push(part([x,y-1.8,z],[.06,.55,.06],DARK));
    }
    parts.push(part([0,-2.6,-.7],[4.2,.08,.08],RED));
  } else if(index === 9) {
    for(let i=0;i<7;i++) {
      const s=4.6-i*.38,z=(i-3)*.47;
      for(const side of [-1,1]) {
        parts.push(part([side*s/2,0,z],[.12,s,.12],i===3?RED:METAL));
        parts.push(part([0,side*s/2,z],[s,.12,.12],i===3?RED:PAPER));
      }
    }
  } else if(index === 10) {
    for(let r=0;r<3;r++) for(let c=0;c<3;c++) {
      const z=r===1&&c===1?1:0;
      parts.push(part([(c-1)*1.5,(r-1)*1.5,z],[1.3,1.3,1.8],r===1&&c===1?RED:PAPER));
      parts.push(part([(c-1)*1.5,(r-1)*1.5+.2,z+.92],[.7,.08,.035],DARK));
    }
  }
  return parts;
}

export function SpatialObjects({ groups }: { groups: RefObject<(Group | null)[]> }) {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    // Small, locally generated studio reflection. No remote HDR, per-frame
    // reflection capture, shadow maps or postprocessing.
    const room = new RoomEnvironment(), generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, .04, .1, 100, { size: 128 });
    const previous = scene.environment, intensity = scene.environmentIntensity;
    scene.environment = target.texture; scene.environmentIntensity = .65;
    room.dispose(); generator.dispose();
    return () => { scene.environment = previous; scene.environmentIntensity = intensity; target.dispose(); };
  }, [gl, scene]);
  const objects = useMemo(() => {
    const box = new RoundedBoxGeometry(1,1,1,1,.045);
    const h = letterGeometry();
    const ring = new TorusGeometry(1,.018,4,48).toNonIndexed();
    const disc = new CylinderGeometry(1,1,1,32,1).toNonIndexed();
    const transform = new Object3D(), color = new Color();
    const geometries = Array.from({length:13},(_,index) => {
      const parts = recipe(index).map(item => {
        const geometry = (item.shape === "h" ? h : item.shape === "ring" ? ring : item.shape === "disc" ? disc : box).clone();
        transform.position.set(...item.at); transform.scale.set(...item.size); transform.rotation.set(...(item.rotate ?? [0,0,0])); transform.updateMatrix();
        geometry.applyMatrix4(transform.matrix);
        const count = geometry.getAttribute("position").count;
        const colors = new Float32Array(count*3); color.set(item.color ?? PAPER);
        for(let i=0;i<count;i++) color.toArray(colors,i*3);
        geometry.setAttribute("color",new BufferAttribute(colors,3));
        // Extrusion includes UVs; normalize attributes before merging.
        geometry.deleteAttribute("uv");
        return geometry;
      });
      const merged = parts.length ? mergeGeometries(parts) : null;
      merged?.center(); merged?.computeBoundingSphere();
      parts.forEach(geometry => geometry.dispose()); return merged;
    });
    box.dispose(); h.dispose(); ring.dispose(); disc.dispose();
    return geometries;
  },[]);
  const material = useMemo(() => new MeshStandardMaterial({vertexColors:true,metalness:.72,roughness:.28}),[]);
  useLayoutEffect(() => () => { objects.forEach(g=>g?.dispose()); material.dispose(); },[objects,material]);
  return <>{objects.map((geometry,index) => geometry && <group key={index} ref={node=>{groups.current[index]=node; if(node) node.userData.radius=geometry.boundingSphere?.radius ?? 3.5;}} visible={false}>
    <mesh geometry={geometry as BufferGeometry} material={material} />
  </group>)}</>;
}
