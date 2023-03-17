/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    TOKEN_RATIO: 1000,
    LOTTERY_CONTRACT: '0xac26890F3f57596dF13C3087ff3D40b21E57D9D0',
    TOKEN_CONTRACT: '0xdb27124742C979901Cf731aF6C9F863A626e956C'
  }
}

module.exports = nextConfig
