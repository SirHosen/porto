'use client';

import { useEffect } from 'react';

const SCRIPT_CHAIN = [
  '/js/bgflow.js',
  '/js/data.js',
  '/js/icons.js',
  '/js/anime-lite.js',
  '/js/graph.js',
  '/js/main.js',
] as const;

export default function ScriptLoader() {
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[data-portfolio-src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') resolve();
        else {
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', reject, { once: true });
        }
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.dataset.portfolioSrc = src;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.body.appendChild(script);
    });

    const loadAll = async () => {
      try {
        for (const src of SCRIPT_CHAIN) {
          if (cancelled) return;
          await loadScript(src);
        }
      } catch (error) {
        console.error('Failed to load portfolio runtime', error);
      }
    };

    // Run after React hydration and layout calculation. The timeout is cleared
    // during the development StrictMode probe, preventing double execution.
    timer = setTimeout(loadAll, 60);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
