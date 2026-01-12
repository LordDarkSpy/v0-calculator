/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/calculator',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
