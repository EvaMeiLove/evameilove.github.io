import type { NextConfig } from "next";

const isPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = {
  ...(isPages ? { output: "export", trailingSlash: true } : {}),
  images: {
    unoptimized: isPages,
    // Разрешаем загрузку обложек с YouTube CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;

