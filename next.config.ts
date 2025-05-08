import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com; connect-src 'self'; img-src 'self' data: https://pagead2.googlesyndication.com https://*.googleusercontent.com; style-src 'self' 'unsafe-inline'; frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
