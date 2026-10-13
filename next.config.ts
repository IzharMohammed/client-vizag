import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Avoid spawning the TypeScript CLI as a detached child process. This also
    // lets Next.js reuse the compiler API during Vercel builds.
    useTypeScriptCli: false,
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
