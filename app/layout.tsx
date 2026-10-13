import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://pesarattu-under-tree-vizag.nabeh-6414.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Andhra Roots Kitchen | Authentic Andhra Food in Vizag", template: "%s | Andhra Roots Kitchen" },
  description: "Fresh, crisp pesarattu and Andhra breakfast favourites in Visakhapatnam. Explore our bilingual English–Telugu menu, team and Google reviews.",
  keywords: ["pesarattu Vizag", "Andhra breakfast Visakhapatnam", "best pesarattu Vizag", "Telugu food Vizag", "పెసరట్టు విశాఖపట్నం"],
  alternates: { canonical: "/" },
  openGraph: { title: "Andhra Roots Kitchen — Vizag", description: "Authentic Andhra flavours, rooted in tradition.", url: siteUrl, siteName: "Andhra Roots Kitchen", locale: "en_IN", alternateLocale: ["te_IN"], type: "website", images: [{ url: "/images/pesarattu-hero.png", width: 1672, height: 941, alt: "Pesarattu served with chutneys under a leafy tree" }] },
  twitter: { card: "summary_large_image", title: "Andhra Roots Kitchen — Vizag", description: "Authentic Andhra flavours, rooted in tradition.", images: ["/images/pesarattu-hero.png"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#173c2b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org", "@type": "Restaurant", name: "Andhra Roots Kitchen", slogan: "Rooted in Tradition · Served with Love",
    image: `${siteUrl}/images/pesarattu-hero.png`, servesCuisine: ["Andhra", "South Indian", "Vegetarian"],
    address: { "@type": "PostalAddress", addressLocality: "Visakhapatnam", addressRegion: "Andhra Pradesh", addressCountry: "IN" },
    areaServed: "Visakhapatnam", priceRange: "₹₹", url: siteUrl,
  };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />{children}</body></html>;
}
