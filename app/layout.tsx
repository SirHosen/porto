import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "../assets/fonts/bebas-neue.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});
const body = localFont({
  src: "../assets/fonts/space-grotesk.ttf",
  variable: "--font-body",
  display: "swap",
  weight: "400",
});
const mono = localFont({
  src: "../assets/fonts/jetbrains-mono.ttf",
  variable: "--font-mono",
  display: "swap",
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  title: "Hosea — Software, Automation & Applied AI",
  description: "Portfolio of Hosea — Python engineer and full-stack developer building resilient systems, automation pipelines, and applied AI on Linux.",
  authors: [{ name: "Hosea", url: "https://github.com/SirHosen" }],
  openGraph: {
    title: "Hosea — Software, Automation & Applied AI",
    description: "Software, automation, and applied AI. A cinematic journey through Hosea's engineering work.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: (process.env.NEXT_PUBLIC_BASE_PATH ?? "/porto") + "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={display.variable + " " + body.variable + " " + mono.variable}>
        {children}
      </body>
    </html>
  );
}
