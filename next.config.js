// ✅ next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig
