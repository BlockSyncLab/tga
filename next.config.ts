import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/ask',
        destination: process.env.API_DESTINATION || 'https://default-url.com/ask',
      },
    ];
  },
};

module.exports = nextConfig;

export default nextConfig;
