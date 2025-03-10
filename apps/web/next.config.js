/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use webpack config for transpiling packages in Next.js 12
  webpack: (config, { isServer }) => {
    // Add shared packages to be transpiled
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: [
        /node_modules\/@erp-system\/shared-models/,
        /node_modules\/@erp-system\/shared-utils/,
      ],
      use: 'babel-loader',
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*' // Proxy API requests to the NestJS server
      }
    ]
  }
}

module.exports = nextConfig 