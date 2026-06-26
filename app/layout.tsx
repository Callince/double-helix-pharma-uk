import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScrollAnimations } from "@/components/anim/ScrollAnimations";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { getSiteConfig } from "@/lib/site-config";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();
  const title = cfg.seo.metaTitle || `${site.name} — ${site.tagline}`;
  const description = cfg.seo.metaDescription || site.description;
  return {
    metadataBase: new URL(site.url),
    title: {
      default: title,
      template: `%s | Double Helix Pharma UK`,
    },
    description,
    applicationName: site.shortName,
    authors: [{ name: site.legalName }],
    creator: site.legalName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: site.url,
      siteName: site.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#042a63",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cfg = await getSiteConfig();
  return (
    <html
      lang="en-GB"
      className={`${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans">
        {/* The header logo is the LCP element — preload it first, high priority. */}
        <link rel="preload" href="/logo-web.webp" as="image" fetchPriority="high" />
        <JsonLd data={[organizationSchema(cfg), websiteSchema()]} />
        <ScrollAnimations />
        <ConditionalChrome header={<Header />} footer={<Footer />}>
          {children}
        </ConditionalChrome>
      </body>
    </html>
  );
}
