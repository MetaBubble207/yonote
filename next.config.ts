import { NextConfig } from "next";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  typescript: {
    // ⚠️ 生产环境建议设置为 true
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "yo-note.oss-cn-shenzhen.aliyuncs.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "yo-note.oss-cn-shenzhen.aliyuncs.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "thirdwx.qlogo.cn",
        port: "",
      },
    ],
  },
};

export default config;
