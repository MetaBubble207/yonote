/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'yo-note.oss-cn-shenzhen.aliyuncs.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'thirdwx.qlogo.cn',
                port: '',
            }
        ],
    },
};

export default config;
