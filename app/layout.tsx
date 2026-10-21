import type { Metadata, Viewport } from "next";
import { Anybody, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Krish Agarwal · Car 21",
  description:
    "Krish Agarwal: full-stack developer and B.Tech Electronics & Instrumentation student at NIT Rourkela. OmniPool, DistrictEye, ProjectMatch and the Innovision 2026 website.",
};

export const viewport: Viewport = {
  themeColor: "#050914",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anybody.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
