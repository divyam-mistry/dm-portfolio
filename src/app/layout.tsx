import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, Space_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Divyam Mistry | Full Stack Developer",
  description:
    "Portfolio of Divyam Mistry - Full Stack Developer specializing in React, Node.js, Flutter, and modern web technologies",
  keywords: ["Divyam Mistry", "Full Stack Developer", "React", "Node.js", "Flutter", "Portfolio", "Software Engineer"],
  authors: [{ name: "Divyam Mistry" }],
};

export const viewport: Viewport = {
  themeColor: "#08090a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <CustomCursor />
        <ScrollProgress />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
