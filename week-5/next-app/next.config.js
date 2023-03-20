/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    TOKEN_RATIO: 1000,
    LOTTERY_CONTRACT: '0xac26890F3f57596dF13C3087ff3D40b21E57D9D0',
    TOKEN_CONTRACT: '0xdb27124742C979901Cf731aF6C9F863A626e956C',
    FACTORY_CONTRACT: '0x86027017C3073E970348a56EfB1143D5fF2E6068'
  }
}

module.exports = nextConfig
