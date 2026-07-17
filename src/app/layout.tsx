import type { Metadata, Viewport } from 'next';
import './globals-premium.css';

// SEO metadata — ganti isinya sesuai data kamu
export const metadata: Metadata = {
  metadataBase: new URL('https://hosea.dev'),
  title: {
    default: 'Hosea — Python Engineer & Full-stack IT Generalist',
    template: '%s | hosea.dev',
  },
  description:
    'Portfolio Hosea — Python-focused software engineer building full-stack products, automation platforms, applied AI systems, and network tooling.',
  keywords: [
    'Hosea', 'Python Engineer', 'Full Stack Developer', 'Automation Engineer',
    'Next.js', 'Laravel', 'PyTorch', 'MikroTik', 'Software Developer Indonesia',
  ],
  authors: [{ name: 'Hosea', url: 'https://hosea.dev' }],
  creator: 'Hosea',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://hosea.dev',
    siteName: 'hosea.dev',
    title: 'Hosea — Python Engineer & Full-stack IT Generalist',
    description:
      'Production web products, automation engines, applied AI experiments, and network systems — mapped as an interactive dependency graph.',
    // images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hosea — Python Engineer & Full-stack Developer',
    description: 'Evidence-driven interactive software engineering portfolio.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily:
            "'Space Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif",
          fontFeatureSettings: "'ss01', 'cv11'",
        }}
      >
        {children}
      </body>
    </html>
  );
}
