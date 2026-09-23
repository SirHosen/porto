/** Phase 1: structural names only. No portfolio content is integrated here. */
export const STOPS = [
  { id: "arrival", name: "Arrival", progress: 0 },
  { id: "passage", name: "Passage", progress: 0.25 },
  { id: "gallery", name: "Gallery", progress: 0.5 },
  { id: "core", name: "Core", progress: 0.75 },
  { id: "exit", name: "Exit", progress: 1 },
] as const;

export type CameraReading = {
  progress: number;
  position: [number, number, number];
  direction: [number, number, number];
  renderer: string;
  dpr: number;
  calls: number;
  triangles: number;
  renders: number;
  activeTriggers: number;
  frameTimes: number[];
  samples: Array<{ progress: number; position: number[] }>;
};

export type CameraDebug = {
  read: () => CameraReading;
  redraw: () => void;
  travel: (progress: number, seconds?: number, easing?: "linear" | "smooth") => Promise<void>;
  startCapture: () => void;
  stopCapture: () => CameraReading;
};

declare global {
  interface Window {
    __MIDNIGHT_CAMERA__?: CameraDebug;
  }
}
