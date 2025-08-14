/** @type {import('next').Config} */
const nextConfig = {
  output: 'export', // Enable static export for S3 deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
