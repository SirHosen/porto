"use client";

import { useState } from "react";
import logos from "@/lib/tech-logos.json";

const brands: Record<string, keyof typeof logos> = {
  Python: "python", TypeScript: "typescript", "Next.js": "nextjs", Supabase: "supabase",
  PostgreSQL: "postgresql", Tailwind: "tailwind", PyTorch: "pytorch", OpenCV: "opencv",
  NumPy: "numpy", PHP: "php", Laravel: "laravel", MySQL: "mysql", PyQt: "qt",
  Selenium: "selenium", JSON: "json", "React Three Fiber": "react", GSAP: "gsap",
  Flutter: "flutter", Dart: "dart", SQLite: "sqlite",
};
const functions: Record<string, string> = {
  Async: "M4 8h13m-4-4 4 4-4 4M20 16H7m4-4-4 4 4 4",
  Scraping: "M3 4h18v16H3zM3 9h18M6 6.5h1m2 0h1M7 13h7m-7 3h4M19 13v8m-3-3 3 3 3-3",
  Testing: "m6 12 4 4 8-9M20 12v7H4V4h12",
  Bayesian: "M3 19h18M4 17c4 0 4-12 8-12s4 12 8 12M12 5v14",
  Blade: "m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18",
  Auth: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4M12 15v3",
  DSP: "M2 12h3l2-8 4 16 4-16 2 8h5",
  PyInstaller: "m3 7 9-5 9 5v10l-9 5-9-5zM3 7l9 5 9-5M12 12v10M8 4l9 5v4",
  Concurrency: "M4 4v6h16V4M4 20v-6h16v6M12 2v8m0 4v8",
  "HTTP / Proxy": "M8 8h8m-4-4 4 4-4 4M16 16H8m4-4-4 4 4 4M3 3v18m18-18v18",
  Logging: "M5 2h10l4 4v16H5zM14 2v5h5M8 11h8m-8 4h8m-8 4h5",
};

export function TechIcon({ name, id }: { name: string; id: string }) {
  const [open, setOpen] = useState(false);
  const brand = brands[name] ? logos[brands[name]] : null;
  const detail = name === "PyInstaller" ? "PyInstaller · packaging" : name === "PyQt" ? "PyQt · Qt binding" : name;
  return <span className="mp-tech" data-open={open}>
    <button type="button" aria-label={name} aria-describedby={id} title={detail}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") setOpen(true); }}
      onPointerLeave={(event) => { if (document.activeElement !== event.currentTarget) setOpen(false); }}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
      onClick={() => setOpen(true)}
      onKeyDown={(event) => { if (event.key === "Escape" && open) { setOpen(false); event.preventDefault(); event.stopPropagation(); } }}>
      {name === "Riverpod"
        ? <img src={(process.env.NEXT_PUBLIC_BASE_PATH ?? "/porto") + "/tech/riverpod.svg"} width="25" height="25" alt="" />
        : <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {brand ? <path d={brand.path} fill="currentColor" /> : <path d={functions[name] ?? "M4 4h16v16H4zM8 8l-3 4 3 4m8-8 3 4-3 4"}
            fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>}
    </button>
    <span className="mp-tech-label" role="tooltip" id={id} hidden={!open}>{detail}</span>
  </span>;
}
