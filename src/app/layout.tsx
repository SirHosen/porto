import type { Metadata } from 'next';
import type { ReactNode } from 'react';

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
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        {children}
        <script src="/js/bgflow.js" defer></script>
        <script src="/js/data.js" defer></script>
        <script src="/js/icons.js" defer></script>
        <script src="/js/anime-lite.js" defer></script>
        <script src="/js/graph.js" defer></script>
        <script src="/js/main.js" defer></script>
      </body>
    </html>
  );
}
