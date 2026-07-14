'use client';

import { useEffect } from 'react';

export default function ScriptLoader() {
  useEffect(() => {
    let active = true;

    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // Maintain execution order
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadAll = async () => {
      try {
        await loadScript('/js/bgflow.js');
        if (!active) return;
        await loadScript('/js/data.js');
        if (!active) return;
        await loadScript('/js/icons.js');
        if (!active) return;
        await loadScript('/js/anime-lite.js');
        if (!active) return;
        await loadScript('/js/graph.js');
        if (!active) return;
        await loadScript('/js/main.js');
      } catch (err) {
        console.error('Failed to load portfolio scripts', err);
      }
    };

    // Small delay to ensure hydration is totally complete
    // and styles are fully applied before canvas calculations run.
    setTimeout(loadAll, 50);

    return () => {
      active = false;
    };
  }, []);

  return null;
}
