/** @type {import('next').NextConfig} */
// const nextConfig = {}
// module.exports = nextConfig

const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  // openAnalyzer: false,
});

const nextConfig = {
  // reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  sassOptions: {
    // styles 폴더와 같은 공간에 모아두고 싶은 경우
    includePaths: [path.join(__dirname, 'styles')],
    // prependData: `@import "styles/_variables.scss"; @import "styles/_mixins.scss";`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
  // TODO: config proxy
  // rewrites: async () => {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "http://0.0.0.0:4000/api/:path*",
  //     },
  //   ];
  // },
};

module.exports = withBundleAnalyzer(nextConfig);
