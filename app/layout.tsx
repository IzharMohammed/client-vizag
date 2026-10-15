import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();
const restaurantName = "Andhra Roots Kitchen (Chettu Kinda Pesarattu)";
const title = `${restaurantName} | Andhra Breakfast in Vizag`;
const description =
  "Andhra Roots Kitchen (Chettu Kinda Pesarattu) serves fresh pesarattu, idli, poori and authentic Andhra breakfast in Visakhapatnam. Explore our English–Telugu menu and guest reviews.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Andhra Roots Kitchen",
  },
  description,
  applicationName: restaurantName,
  category: "restaurant",
  keywords: [
    "pesarattu Vizag",
    "Andhra Roots Kitchen",
    "Andhra Roots Kitchen Vizag",
    "Chettu Kinda Pesarattu",
    "Andhra breakfast Visakhapatnam",
    "best pesarattu Vizag",
    "authentic Andhra food Vizag",
    "South Indian breakfast Visakhapatnam",
    "Telugu food Vizag",
    "పెసరట్టు విశాఖపట్నం",
    "ఆంధ్ర భోజనం విశాఖపట్నం",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: restaurantName,
    locale: "en_IN",
    alternateLocale: ["te_IN"],
    type: "website",
    images: [
      {
        url: "/images/pesarattu-hero.png",
        width: 1672,
        height: 941,
        alt: "Fresh Andhra pesarattu served with ginger and coconut chutneys in Vizag",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/pesarattu-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#173c2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl}/#restaurant`,
    name: restaurantName,
    alternateName: ["Chettu Kinda Pesarattu", "చెట్టు కింద పెసరట్టు", "Andhra Roots Kitchen"],
    slogan: "Rooted in Tradition · Served with Love",
    description,
    url: siteUrl,
    image: `${siteUrl}/images/pesarattu-hero.png`,
    logo: `${siteUrl}/images/brand/andhra-roots-logo.webp`,
    hasMenu: `${siteUrl}/#menu`,
    servesCuisine: ["Andhra", "South Indian", "Vegetarian"],
    knowsLanguage: ["en-IN", "te-IN"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Visakhapatnam",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: "Visakhapatnam",
    },
    priceRange: "₹₹",
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}
