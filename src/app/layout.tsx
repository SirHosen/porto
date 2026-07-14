import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ScriptLoader from './ScriptLoader';

export const metadata: Metadata = {
  title: 'Hosea Oktarivanes — The Dependency Graph',
  description: 'Portfolio of Hosea Oktarivanes Ferdinan Sinaga — explore the dependency graph of a web developer & network engineer: skills, builds, and the network underneath.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/premium.css" />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fporto4893back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.19" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body>
        {children}
        <ScriptLoader />
      </body>
    </html>
  );
}
