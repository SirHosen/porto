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
  title: "Midnight Panel — Camera study",
  description: "An isolated, scroll-driven 3D camera prototype. Phase 1 of Midnight Panel.",
  robots: { index: false, follow: false },
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
