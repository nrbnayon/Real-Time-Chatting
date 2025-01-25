/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://10.0.70.205:3000/:path*",
      },
    ];
  },
  experimental: {
    turbo: {
      rules: {
        jsx: [],
      },
    },
  },
};

export default nextConfig;
