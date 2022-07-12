/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
