import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here - triggered restart */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {

      config.plugins = config.plugins.filter(
        (plugin: any) => plugin.constructor.name !== 'TraceEntryPointsPlugin'
      );
      // Exclude cardinal as it's an optional dependency of mysql2/mysqldump that causes build issues
      config.externals = [...(config.externals || []), 'cardinal'];
    }
    return config;
  },
};

export default nextConfig;
