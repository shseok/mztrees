/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  sassOptions: {
    // styles 폴더와 같은 공간에 모아두고 싶은 경우
    includePaths: [path.join(__dirname, "styles")],
    // prependData: `@import "styles/_variables.scss"; @import "styles/_mixins.scss";`,
  },
};

module.exports = nextConfig;
