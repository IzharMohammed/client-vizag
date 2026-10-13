import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: "/admin" }, sitemap: "https://pesarattu-under-tree-vizag.nabeh-6414.chatgpt.site/sitemap.xml" }; }
