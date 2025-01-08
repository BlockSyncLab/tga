import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/ask',
        destination: 'https://orca-app-qinul.ondigitalocean.app/ask',
      },
    ];
  },
};

module.exports = nextConfig;


export default nextConfig;
