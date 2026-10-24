"use client";

import { useLayoutEffect, useMemo, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import {
  BufferAttribute,
  Color,
  CylinderGeometry,
  IcosahedronGeometry,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  PMREMGenerator,
  Shape,
  ExtrudeGeometry,
  TorusGeometry,
  type BufferGeometry,
  type Group,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type ShapeKind = "box" | "ring" | "disc" | "sphere" | "octa" | "rod" | "h";
type Part = {
  at: [number, number, number];
  size: [number, number, number];
  color?: string;
  rotate?: [number, number, number];
  shape?: ShapeKind;
};

// High-end cinematic material palette
const CHROME = "#f1f5f9";
const CYAN = "#00f0ff";
const VERMILION = "#f24b3e";
const OBSIDIAN = "#0f131a";
const TITANIUM = "#475569";
const GOLD = "#fbbf24";
const EMERALD = "#10b981";
const VIOLET = "#a855f7";

const part = (
  at: Part["at"],
  size: Part["size"],
  color = CHROME,
  rotate?: Part["rotate"],
  shape: ShapeKind = "box"
): Part => ({ at, size, color, rotate, shape });

function letterGeometry() {
  const shape = new Shape();
  const outline = [
    [-2, -3], [-0.8, -3], [-0.8, -0.6], [0.8, -0.6], [0.8, -3], [2, -3],
    [2, 3], [0.8, 3], [0.8, 0.6], [-0.8, 0.6], [-0.8, 3], [-2, 3]
  ];
  shape.moveTo(outline[0][0], outline[0][1]);
  outline.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.03,
    curveSegments: 1,
  });
  geometry.center();
  return geometry;
}

// Bespoke 3D procedural artifacts for each portfolio waypoint
function recipe(index: number): Part[] {
  const parts: Part[] = [];

  if (index === 0) {
    // 00: HERO — Quantum Core Singularity
    // Central faceted crystal
    parts.push(part([0, 0, 0], [1.7, 2.1, 1.7], CYAN, [0.2, 0.4, 0.1], "octa"));
    parts.push(part([0, 0, 0], [1.0, 1.0, 1.0], CHROME, [0.5, 0.8, 0.3], "sphere"));
    // Gimbal rings
    parts.push(part([0, 0, 0], [3.2, 3.2, 1.2], CHROME, [0.3, 0.2, 0], "ring"));
    parts.push(part([0, 0, 0], [2.6, 2.6, 1.2], VERMILION, [Math.PI / 2, 0.4, 0], "ring"));
    parts.push(part([0, 0, 0], [2.0, 2.0, 1.2], CYAN, [0, Math.PI / 2, 0.3], "ring"));
    // 6 Orbiting satellite nodes
    const rad = 2.7;
    parts.push(part([rad, 0, 0], [0.36, 0.36, 0.36], GOLD, undefined, "sphere"));
    parts.push(part([-rad, 0, 0], [0.36, 0.36, 0.36], GOLD, undefined, "sphere"));
    parts.push(part([0, rad, 0], [0.36, 0.36, 0.36], VERMILION, undefined, "sphere"));
    parts.push(part([0, -rad, 0], [0.36, 0.36, 0.36], VERMILION, undefined, "sphere"));
    parts.push(part([0, 0, rad], [0.36, 0.36, 0.36], CYAN, undefined, "sphere"));
    parts.push(part([0, 0, -rad], [0.36, 0.36, 0.36], CYAN, undefined, "sphere"));
    // Outer chassis brackets
    for (const x of [-2.4, 2.4]) {
      for (const y of [-2.4, 2.4]) {
        parts.push(part([x, y, 0], [0.12, 0.12, 4.8], OBSIDIAN, undefined, "rod"));
        parts.push(part([x, y, 2.4], [0.32, 0.32, 0.32], TITANIUM, undefined, "box"));
        parts.push(part([x, y, -2.4], [0.32, 0.32, 0.32], TITANIUM, undefined, "box"));
      }
    }
  } else if (index === 1) {
    // 01: ABOUT — Systems Architecture & Linux Mainframe
    // Staggered server blades
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * 0.9;
      parts.push(part([x, 0, 0], [0.28, 4.0, 2.6], i === 2 ? CHROME : OBSIDIAN));
      parts.push(part([x, 1.6, 1.35], [0.18, 0.18, 0.12], i === 2 ? VERMILION : CYAN, undefined, "disc"));
      parts.push(part([x, -1.6, 1.35], [0.18, 0.18, 0.12], EMERALD, undefined, "disc"));
    }
    // High-speed bus interconnect rods
    for (const y of [-1.2, 0, 1.2]) {
      parts.push(part([0, y, 0], [0.08, 0.08, 4.6], CYAN, [0, 0, Math.PI / 2], "rod"));
    }
    // Central processor core
    parts.push(part([0, 0, 1.4], [1.5, 1.5, 0.3], CHROME));
    parts.push(part([0, 0, 1.6], [0.8, 0.8, 0.15], VERMILION, [0, 0, Math.PI / 4]));
    // Upper and lower chassis plates
    parts.push(part([0, 2.1, 0], [4.4, 0.2, 2.8], TITANIUM));
    parts.push(part([0, -2.1, 0], [4.4, 0.2, 2.8], TITANIUM));
    // Holographic status ring
    parts.push(part([0, 0, -1.4], [2.2, 2.2, 1], CYAN, [Math.PI / 2, 0, 0], "ring"));
  } else if (index === 2) {
    // 02: NESTfetch — Distributed Async Scraper & Pipeline
    // Extraction prism
    parts.push(part([0, 0, 0], [1.8, 2.4, 1.8], CYAN, [0.3, 0.5, 0], "octa"));
    // Orbital harvesting satellites
    const nodes = [
      [2.2, 1.4, 0], [-2.2, 1.4, 0], [0, -1.8, 1.8], [0, -1.8, -1.8]
    ] as const;
    nodes.forEach(([x, y, z], i) => {
      parts.push(part([x, y, z], [0.65, 0.65, 0.65], i % 2 ? VERMILION : CHROME, undefined, "sphere"));
      parts.push(part([x * 0.5, y * 0.5, z * 0.5], [0.07, 0.07, 2.6], TITANIUM, undefined, "rod"));
    });
    // Pipeline rings
    parts.push(part([0, 0, 0], [3.2, 3.2, 1], VERMILION, [0.4, 0.8, 0], "ring"));
    // SQLite cache trays below
    for (let i = 0; i < 4; i++) {
      const y = -1.6 - i * 0.42;
      parts.push(part([0, y, 0], [3.2, 0.24, 2.2], i === 1 ? VERMILION : OBSIDIAN));
      parts.push(part([1.4, y, 1.12], [0.3, 0.1, 0.1], CYAN));
    }
  } else if (index === 3) {
    // 03: GameNest — Game Catalog & Storefront
    // Central glowing gaming crystal
    parts.push(part([0, 0, 0], [1.9, 1.9, 1.9], CYAN, [0.4, 0.3, 0.2], "sphere"));
    parts.push(part([0, 0, 0], [1.1, 1.1, 1.1], CHROME, [0.8, 0.2, 0.5], "octa"));
    // Concentric HUD orbit rings
    parts.push(part([0, 0, 0], [3.3, 3.3, 1], CHROME, [Math.PI / 3, 0.4, 0], "ring"));
    parts.push(part([0, 0, 0], [2.6, 2.6, 1], VERMILION, [-Math.PI / 4, -0.5, 0], "ring"));
    // Floating inventory catalog cards
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const x = Math.cos(angle) * 2.2;
      const z = Math.sin(angle) * 2.2;
      parts.push(part([x, (i - 1) * 0.5, z], [1.2, 1.8, 0.1], OBSIDIAN, [0, -angle, 0]));
      parts.push(part([x, (i - 1) * 0.5 + 0.6, z + 0.06], [0.9, 0.1, 0.02], GOLD, [0, -angle, 0]));
    }
  } else if (index === 4) {
    // 04: SPIN — PyTorch LSTM & Audio AI Lab
    // Neural geosphere
    parts.push(part([0, 0, 0], [1.6, 1.6, 1.6], CHROME, undefined, "sphere"));
    parts.push(part([0, 0, 0], [2.5, 2.5, 2.5], CYAN, [0.3, 0.5, 0.2], "octa"));
    // Spectrogram resonance rings
    parts.push(part([0, 0, 0], [2.2, 2.2, 1], VERMILION, [Math.PI / 2, 0.3, 0], "ring"));
    parts.push(part([0, 0, 0], [2.9, 2.9, 1], CYAN, [0.4, Math.PI / 2, 0.2], "ring"));
    parts.push(part([0, 0, 0], [3.5, 3.5, 1], GOLD, [0.6, 0.2, Math.PI / 2], "ring"));
    // Radial neural synapse nodes
    for (let i = 0; i < 12; i++) {
      const theta = (i * Math.PI * 2) / 12;
      const x = Math.cos(theta) * 2.6;
      const y = Math.sin(theta) * 2.6;
      parts.push(part([x, y, 0], [0.24, 0.24, 0.24], i % 3 === 0 ? VERMILION : i % 2 === 0 ? CYAN : EMERALD, undefined, "sphere"));
      parts.push(part([x * 0.5, y * 0.5, 0], [0.05, 0.05, 2.5], TITANIUM, [0, 0, theta + Math.PI / 2], "rod"));
    }
  } else if (index === 5) {
    // 05: Sonorus — Classical Audio Streaming
    // Precision obsidian turntable platter
    parts.push(part([0, 0, 0], [2.9, 0.16, 2.9], OBSIDIAN, [Math.PI / 2, 0, 0], "disc"));
    // Concentric audio grooves
    for (let i = 0; i < 7; i++) {
      parts.push(part([0, 0, 0.09], [0.8 + i * 0.28, 0.8 + i * 0.28, 1], i === 0 ? GOLD : i % 2 ? CHROME : TITANIUM, [Math.PI / 2, 0, 0], "ring"));
    }
    // Gold center disc & spindle
    parts.push(part([0, 0, 0.1], [0.72, 0.16, 0.72], GOLD, [Math.PI / 2, 0, 0], "disc"));
    parts.push(part([0, 0, 0.3], [0.08, 0.08, 0.6], CHROME, [Math.PI / 2, 0, 0], "rod"));
    // Precision tonearm
    parts.push(part([2.5, 0.3, 0.6], [0.12, 0.12, 4.0], CHROME, [0, 0, -0.2], "rod"));
    parts.push(part([2.9, 2.2, 0.6], [0.35, 0.35, 0.35], TITANIUM, undefined, "sphere"));
    parts.push(part([2.1, -1.6, 0.6], [0.3, 0.2, 0.5], VERMILION, [0, 0, -0.2], "box"));
    parts.push(part([1.95, -1.8, 0.4], [0.1, 0.1, 0.1], VERMILION, undefined, "octa"));
  } else if (index === 6) {
    // 06: SonicCipher — DSP Steganography & Waveform
    // Harmonic frequency bars in sine-wave formation
    for (let i = 0; i < 21; i++) {
      const x = (i - 10) * 0.25;
      const height = 0.6 + Math.abs(Math.sin(i * 0.42)) * 3.4;
      const color = i >= 8 && i <= 12 ? VERMILION : i % 2 === 0 ? CYAN : CHROME;
      parts.push(part([x, 0, Math.cos(i * 0.3) * 0.4], [0.12, height, 0.28], color));
    }
    // Dual magnetic flux towers
    for (const x of [-2.8, 2.8]) {
      parts.push(part([x, 0, 0], [0.36, 4.2, 0.7], OBSIDIAN));
      parts.push(part([x, 1.8, 0], [0.7, 0.7, 1], VERMILION, [Math.PI / 2, 0, 0], "ring"));
      parts.push(part([x, -1.8, 0], [0.7, 0.7, 1], CYAN, [Math.PI / 2, 0, 0], "ring"));
    }
    // Guide laser
    parts.push(part([0, -2.4, 0], [0.06, 0.06, 5.8], CYAN, [0, 0, Math.PI / 2], "rod"));
  } else if (index === 7) {
    // 07: FormQA — Dynamic Automation & Testing Engine
    // 3 Staggered validation planes
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 1.6;
      const y = (i - 1) * 0.35;
      const z = -i * 0.9;
      parts.push(part([x, y, z], [2.4, 3.6, 0.16], i === 0 ? CHROME : OBSIDIAN));
      // Status rings
      const ringColor = i === 0 ? EMERALD : i === 1 ? CYAN : VERMILION;
      parts.push(part([x, y + 1.2, z + 0.1], [0.45, 0.45, 1], ringColor, undefined, "ring"));
      parts.push(part([x, y - 0.2, z + 0.1], [1.8, 0.22, 0.04], TITANIUM));
      parts.push(part([x, y - 0.7, z + 0.1], [1.8, 0.22, 0.04], TITANIUM));
      parts.push(part([x, y - 1.2, z + 0.1], [1.8, 0.22, 0.04], ringColor));
    }
    // Robotic inspection caliper rails
    parts.push(part([0, -2.2, -0.9], [0.08, 0.08, 3.8], VERMILION, undefined, "rod"));
  } else if (index === 8) {
    // 08: SessionLab — Sandbox & Lifecycle Orchestrator
    // Tesseract hypercube chassis
    parts.push(part([0, 0, 0], [3.2, 3.2, 1], TITANIUM, undefined, "ring"));
    parts.push(part([0, 0, 0], [3.2, 3.2, 1], TITANIUM, [Math.PI / 2, 0, 0], "ring"));
    parts.push(part([0, 0, 0], [3.2, 3.2, 1], TITANIUM, [0, Math.PI / 2, 0], "ring"));
    // 3 Isolated session pods
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 1.1;
      const y = (1 - i) * 0.5;
      const z = (i - 1) * 0.8;
      parts.push(part([x, y, z], [1.4, 2.0, 0.18], i === 1 ? CHROME : OBSIDIAN));
      parts.push(part([x, y, z], [1.8, 1.8, 1], CYAN, [0.3, 0.2, 0], "ring"));
    }
    // Core containment node
    parts.push(part([0, 0, 0], [0.9, 0.9, 0.9], VERMILION, [0.4, 0.6, 0.1], "octa"));
  } else if (index === 9) {
    // 09: This System / WebGL Engine
    // Camera iris aperture assembly
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const x = Math.cos(angle) * 1.5;
      const y = Math.sin(angle) * 1.5;
      parts.push(part([x, y, 0], [1.4, 0.38, 0.12], i % 2 ? VERMILION : CHROME, [0, 0, angle + 0.5]));
    }
    // Aperture outer rim
    parts.push(part([0, 0, 0], [3.4, 3.4, 1.2], TITANIUM, undefined, "ring"));
    // Focal optical lens
    parts.push(part([0, 0, 0.06], [1.3, 0.12, 1.3], CYAN, [Math.PI / 2, 0, 0], "disc"));
    // 3D Gimbal coordinate axes
    parts.push(part([0, 0, 0], [0.08, 0.08, 3.8], VERMILION, [0, 0, Math.PI / 2], "rod")); // X axis
    parts.push(part([0, 0, 0], [0.08, 0.08, 3.8], EMERALD, undefined, "rod")); // Y axis
    parts.push(part([0, 0, 0], [0.08, 0.08, 3.8], CYAN, [Math.PI / 2, 0, 0], "rod")); // Z axis
  } else if (index === 10) {
    // 10: Aqila Atelier — Boutique POS & Inventory
    // Luxury architectural retail monolith
    parts.push(part([0, 0, 0], [1.8, 3.8, 1.2], OBSIDIAN));
    parts.push(part([0, 0, 0.65], [1.4, 3.4, 0.08], CHROME));
    // Golden ratio balance rings
    parts.push(part([0, 0, 0], [2.6, 2.6, 1], GOLD, [0.5, 0.4, 0], "ring"));
    parts.push(part([0, 0, 0], [2.0, 2.0, 1], EMERALD, [-0.4, -0.6, 0], "ring"));
    // Inventory crystal prisms
    parts.push(part([1.6, 1.2, 0], [0.5, 0.5, 0.5], GOLD, undefined, "octa"));
    parts.push(part([-1.6, -1.2, 0], [0.5, 0.5, 0.5], EMERALD, undefined, "octa"));
    // Base pedestal
    parts.push(part([0, -2.1, 0], [3.2, 0.3, 2.2], TITANIUM));
  } else if (index === 11) {
    // 11: SKILLS — Neural Capability Matrix
    // Central capability icosahedron
    parts.push(part([0, 0, 0], [1.9, 1.9, 1.9], CHROME, undefined, "sphere"));
    parts.push(part([0, 0, 0], [2.6, 2.6, 2.6], CYAN, [0.3, 0.6, 0.2], "octa"));
    // 3 Orthogonal orbital rings
    parts.push(part([0, 0, 0], [3.4, 3.4, 1], CYAN, undefined, "ring"));
    parts.push(part([0, 0, 0], [3.4, 3.4, 1], VERMILION, [Math.PI / 2, 0, 0], "ring"));
    parts.push(part([0, 0, 0], [3.4, 3.4, 1], GOLD, [0, Math.PI / 2, 0], "ring"));
    // 6 Domain satellites in their domain colors
    const domainColors = [CYAN, EMERALD, VERMILION, GOLD, VIOLET, CHROME];
    const coords = [
      [2.7, 0, 0], [-2.7, 0, 0], [0, 2.7, 0], [0, -2.7, 0], [0, 0, 2.7], [0, 0, -2.7]
    ] as const;
    coords.forEach(([x, y, z], i) => {
      parts.push(part([x, y, z], [0.5, 0.5, 0.5], domainColors[i], undefined, "octa"));
      parts.push(part([x * 0.5, y * 0.5, z * 0.5], [0.05, 0.05, 2.7], TITANIUM, undefined, "rod"));
    });
  } else {
    // 12: CONTACT — Telecommunications Uplink Beacon
    // Parabolic antenna dish
    parts.push(part([0, 0, -0.6], [3.4, 3.4, 1], CHROME, [0.3, -0.4, 0], "ring"));
    parts.push(part([0, 0, -0.6], [2.4, 2.4, 1], TITANIUM, [0.3, -0.4, 0], "ring"));
    parts.push(part([0, 0, -0.7], [2.8, 0.1, 2.8], OBSIDIAN, [0.3 + Math.PI / 2, -0.4, 0], "disc"));
    // Feed horn & emitter mast
    parts.push(part([0.4, -0.3, 0.7], [0.12, 0.12, 3.2], TITANIUM, [0.3, -0.4, 0], "rod"));
    parts.push(part([0.8, -0.6, 2.1], [0.45, 0.45, 0.45], VERMILION, undefined, "sphere"));
    // Expanding signal broadcast waves
    parts.push(part([0.9, -0.7, 2.6], [1.2, 1.2, 1], CYAN, [0.3, -0.4, 0], "ring"));
    parts.push(part([1.1, -0.8, 3.3], [1.9, 1.9, 1], VERMILION, [0.3, -0.4, 0], "ring"));
    // Heavy pedestal base
    parts.push(part([0, -2.2, 0], [3.2, 0.4, 3.2], OBSIDIAN));
  }

  return parts;
}

export function SpatialObjects({ groups }: { groups: RefObject<(Group | null)[]> }) {
  const { gl, scene } = useThree();

  useLayoutEffect(() => {
    // High-fidelity studio lighting reflection map
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, 0.04, 0.1, 100, { size: 256 });
    const previous = scene.environment;
    const intensity = scene.environmentIntensity;

    scene.environment = target.texture;
    scene.environmentIntensity = 1.1;

    room.dispose();
    generator.dispose();

    return () => {
      scene.environment = previous;
      scene.environmentIntensity = intensity;
      target.dispose();
    };
  }, [gl, scene]);

  const objects = useMemo(() => {
    const box = new RoundedBoxGeometry(1, 1, 1, 1, 0.05);
    const ring = new TorusGeometry(1, 0.04, 5, 24).toNonIndexed();
    const disc = new CylinderGeometry(1, 1, 1, 16, 1).toNonIndexed();
    const sphere = new IcosahedronGeometry(1, 1).toNonIndexed();
    const octa = new OctahedronGeometry(1, 0).toNonIndexed();
    const rod = new CylinderGeometry(0.12, 0.12, 1, 8, 1).toNonIndexed();
    const h = letterGeometry();

    const transform = new Object3D();
    const color = new Color();

    const geometries = Array.from({ length: 13 }, (_, index) => {
      const parts = recipe(index).map((item) => {
        let baseGeo: BufferGeometry;
        switch (item.shape) {
          case "ring":
            baseGeo = ring;
            break;
          case "disc":
            baseGeo = disc;
            break;
          case "sphere":
            baseGeo = sphere;
            break;
          case "octa":
            baseGeo = octa;
            break;
          case "rod":
            baseGeo = rod;
            break;
          case "h":
            baseGeo = h;
            break;
          default:
            baseGeo = box;
            break;
        }

        const geometry = baseGeo.clone();
        transform.position.set(...item.at);
        transform.scale.set(...item.size);
        transform.rotation.set(...(item.rotate ?? [0, 0, 0]));
        transform.updateMatrix();
        geometry.applyMatrix4(transform.matrix);

        const count = geometry.getAttribute("position").count;
        const colors = new Float32Array(count * 3);
        color.set(item.color ?? CHROME);
        for (let i = 0; i < count; i++) {
          color.toArray(colors, i * 3);
        }
        geometry.setAttribute("color", new BufferAttribute(colors, 3));
        geometry.deleteAttribute("uv");
        return geometry;
      });

      const merged = parts.length ? mergeGeometries(parts) : null;
      merged?.center();
      merged?.computeBoundingSphere();
      parts.forEach((geometry) => geometry.dispose());
      return merged;
    });

    box.dispose();
    ring.dispose();
    disc.dispose();
    sphere.dispose();
    octa.dispose();
    rod.dispose();
    h.dispose();

    return geometries;
  }, []);

  // Lustrous metallic material with high-specular glints
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.88,
        roughness: 0.18,
        envMapIntensity: 1.25,
      }),
    []
  );

  useLayoutEffect(() => {
    return () => {
      objects.forEach((g) => g?.dispose());
      material.dispose();
    };
  }, [objects, material]);

  return (
    <>
      {objects.map((geometry, index) => (
        geometry && (
          <group
            key={index}
            ref={(node) => {
              groups.current[index] = node;
              if (node) {
                node.userData.radius = geometry.boundingSphere?.radius ?? 3.5;
              }
            }}
            visible={false}
          >
            <mesh geometry={geometry as BufferGeometry} material={material} />
          </group>
        )
      ))}
    </>
  );
}
