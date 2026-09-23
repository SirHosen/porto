import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio/Portfolio";
import "./portfolio.css";
import "./explorer.css";
import "./spatial.css";

export const metadata: Metadata = {
  title: "Hosea — Software, automation & applied AI",
  description: "Software, automation, and applied AI. A journey through Hosea's work.",
};

export default function PortfolioPage() {
  return <Portfolio />;
}
