import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { contactInfo, education, profile, siteUrl, socialLinks } from "@/lib/data";

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

const title = "Divyam Mistry — Software Engineer";
const description =
  "Divyam Mistry is a software engineer at Strique building streaming AI chat, AI-generated reports, credit billing and product-feed pipelines.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: ["Divyam Mistry", "Software Engineer", "Strique", "Next.js", "Python", "FastAPI", "Portfolio"],
  authors: [{ name: "Divyam Mistry", url: siteUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Divyam Mistry",
    title,
    description,
    images: [{ url: "/avatar.jpg", alt: "Divyam Mistry" }],
  },
  twitter: { card: "summary", title, description, images: ["/avatar.jpg"] },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  image: `${siteUrl}/avatar.jpg`,
  jobTitle: profile.role,
  worksFor: { "@type": "Organization", name: profile.now.company },
  address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
  email: `mailto:${contactInfo.email}`,
  sameAs: socialLinks.map((l) => l.href),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className={`${jakarta.variable} ${jetbrains.variable} font-sans antialiased`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
