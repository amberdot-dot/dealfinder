/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.trademe.co.nz' },
      { protocol: 'https', hostname: '**.harveynorman.co.nz' },
      { protocol: 'https', hostname: '**.noelleeming.co.nz' },
      { protocol: 'https', hostname: '**.themarket.com' },
    ],
  },
}

export default nextConfig
