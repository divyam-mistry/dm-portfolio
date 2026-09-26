import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Divyam Mistry — Software Engineer",
  description:
    "Divyam Mistry is a software engineer at Strique building streaming AI chat, AI-generated reports, credit billing and product-feed pipelines.",
  keywords: ["Divyam Mistry", "Software Engineer", "Strique", "Next.js", "Python", "FastAPI", "Go", "Portfolio"],
  authors: [{ name: "Divyam Mistry" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
};

// Runs before paint so the stored theme never flashes. Night is the default edition.
const themeScript = `(function(){try{document.documentElement.dataset.theme=localStorage.getItem('theme')||'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${jakarta.variable} ${jetbrains.variable} font-sans antialiased`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
