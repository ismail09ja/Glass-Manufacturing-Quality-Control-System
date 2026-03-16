/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    },
    experimental: {
        serverComponentsExternalPackages: ['bcryptjs', 'jsonwebtoken', 'mongoose'],
    },
};

module.exports = nextConfig;
