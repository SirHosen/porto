import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio/Portfolio";
import "./portfolio.css";

export const metadata: Metadata = {
  title: "Hosea — Midnight Panel",
  description: "Software, automation, and applied AI. A journey through Hosea's work.",
};

export default function PortfolioPage() {
  return <Portfolio />;
}
