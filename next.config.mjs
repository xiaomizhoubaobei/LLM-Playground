import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  allowedDevOrigins: ['*.cnb.run', '*.cnb.cool'],
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'file.302.ai',
      },
      {
        protocol: 'https',
        hostname: 'file.302ai.cn',
      }
    ],
  },
  // 添加唯一的构建 ID 以避免缓存问题
  generateBuildId: async () => {
    return Date.now().toString();
  },
};

export default withNextIntl(nextConfig);
