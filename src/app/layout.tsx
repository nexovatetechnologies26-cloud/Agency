import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import "./globals.css";

// Fonts are self-hosted (src/app/fonts, latin subset, SIL Open Font License) so builds
// never depend on downloading from Google Fonts — that download failed on Railway.
const sans = localFont({
  src: "./fonts/inter-latin-var.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});
const display = localFont({
  src: "./fonts/inter-tight-latin-var.woff2",
  weight: "500 700",
  variable: "--font-display",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

// big headings: Playfair Display — the elegant serif of the lavender & plum theme
const heading = localFont({
  src: [
    { path: "./fonts/playfair-display-latin-wght-normal.woff2", weight: "400 900", style: "normal" },
    { path: "./fonts/playfair-display-latin-wght-italic.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.positioning}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.positioning}`,
    description: site.description,
    url: site.url,
    images: [{ url: "/logo.png", width: 650, height: 280, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#2A1B3D" };

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/logo.png`,
  slogan: site.tagline,
  sameAs: Object.values(site.social).filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable} ${heading.variable}`}>
      <body className="font-sans">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
