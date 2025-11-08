import { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new (require("copy-webpack-plugin"))({
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
