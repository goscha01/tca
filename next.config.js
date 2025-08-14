/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out for development server
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
