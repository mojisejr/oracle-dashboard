/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better Tailwind support
  // experimental: {
  //   optimizeCss: true,  // Requires critters package - disabled for now
  // },
  
  // Webpack config for Tailwind in production
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { 
        ...config.resolve.fallback, 
        fs: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
