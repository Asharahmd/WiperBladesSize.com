import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: every page is prebuilt HTML served from Cloudflare Pages.
  output: "export",
  trailingSlash: true,
  // Static export has no image server; images in public/images are already sized WebP.
  images: { unoptimized: true },
};

export default nextConfig;
