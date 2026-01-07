/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/4SeasonsShopping',
  assetPrefix: '/4SeasonsShopping',
  transpilePackages: ['three'],
  reactStrictMode: false,
};

module.exports = nextConfig;
