import { NextConfig } from "next";
import webPackPlugin from "copy-webpack-plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new webPackPlugin({
          patterns: [
            {
              from: "src/core/database/migrations",
              to: "src/core/database/migrations/",
            },
          ],
        })
      );
    }
    return config;
  },
};

export default nextConfig;
