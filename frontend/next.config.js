/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["127.0.0.1", "partypakkis3bucket.s3.amazonaws.com"],
  },
  pwa: {
    dest: "public",
    disable: process.env.NEXT_PUBLIC_NODE_ENV === "development",
  },
});

module.exports = nextConfig;
