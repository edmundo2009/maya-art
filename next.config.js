/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
  },
  // Enable compression for better performance
  compress: true,
  // Optimize for static export
  trailingSlash: true,
};

module.exports = nextConfig;
