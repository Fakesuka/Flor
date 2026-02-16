import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'api.telegram.org',
            }
        ],
    },
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    outputFileTracingRoot: __dirname,
};

export default withPWA(nextConfig);
