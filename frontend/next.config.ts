import path from "node:path";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
 output: "standalone",
 transpilePackages: ["@vayurakshak/shared"],
 outputFileTracingRoot: path.resolve(import.meta.dirname, ".."),
 turbopack: {root: path.resolve(import.meta.dirname, "..")},
 devIndicators: false
};
export default nextConfig;
