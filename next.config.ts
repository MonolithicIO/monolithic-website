import { NextConfig } from "next";
import webPackPlugin from "copy-webpack-plugin";

const nextConfig: NextConfig = {
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
