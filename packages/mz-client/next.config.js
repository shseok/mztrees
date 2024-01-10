/** @type {import('next').NextConfig} */
// const nextConfig = {}
// module.exports = nextConfig
const prod = process.env.NODE_ENV === 'production';
const path = require('path');

const WithPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true', // 환경변수 ANALYZE가 true일 때 실행
  openAnalyzer: false, // 브라우저에 자동으로 분석결과를 새 탭으로 Open하는 것을 방지
});

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: !prod,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  swcMinify: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
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
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 422, 548, 630, 720],
    deviceSizes: [768, 1080, 1200],
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
  poweredByHeader: false,
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

module.exports = WithPlugins([withBundleAnalyzer, withPWA], nextConfig);
