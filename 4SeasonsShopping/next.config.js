/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repoName = "/4SeasonsShopping";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? repoName : "",
  assetPrefix: isProd ? repoName : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? repoName : "",
  },
  transpilePackages: ["three"],
  reactStrictMode: false,
};

module.exports = nextConfig;
