import type { Metadata, Viewport } from 'next';
import './globals-premium.css';

// SEO metadata — ganti isinya sesuai data kamu
export const metadata: Metadata = {
  metadataBase: new URL('https://hosea.dev'),
  title: {
    default: 'Hosea — Full Stack Developer & Network Engineer',
    template: '%s | hosea.dev',
  },
  description:
    'Portofolio Hosea — Full Stack Developer dengan keahlian Laravel, Next.js, MikroTik, dan arsitektur sistem modern. Lihat projek, skill, dan pengalaman saya.',
  keywords: [
    'Hosea', 'portofolio', 'Full Stack Developer', 'Laravel', 'Next.js',
    'TypeScript', 'MikroTik', 'Network Engineer', 'Web Developer Indonesia',
  ],
  authors: [{ name: 'Hosea', url: 'https://hosea.dev' }],
  creator: 'Hosea',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://hosea.dev',
    siteName: 'hosea.dev',
    title: 'Hosea — Full Stack Developer & Network Engineer',
    description:
      'Portofolio interaktif dengan visualisasi skill rasi bintang, smooth scroll, dan animasi premium.',
    // images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hosea — Full Stack Developer',
    description: 'Portofolio interaktif kelas studio.',
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
      {/* Preconnect untuk font kencang */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* Font premium: Space Grotesk + JetBrains Mono — ganti kalau mau */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
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
