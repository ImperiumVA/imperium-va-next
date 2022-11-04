/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api' // development api
        : 'https://va.imperiumsim.club/api' // production api
  },
  reactStrictMode: true,
  swcMinify: true,
  compress: false,
}

module.exports = nextConfig
