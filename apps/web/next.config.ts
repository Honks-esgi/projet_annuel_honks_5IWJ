import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // required by Dockerfile
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
