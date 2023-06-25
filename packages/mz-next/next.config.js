/** @type {import('next').NextConfig} */
// const nextConfig = {}
// module.exports = nextConfig

const path = require("path");

// styles 폴더와 같은 공간에 모아두고 싶은 경우
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    // prependData: `@import "styles/_variables.scss"; @import "styles/_mixins.scss";`,
  },
};
