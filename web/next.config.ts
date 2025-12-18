import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Thêm dòng này để xử lý lỗi render trang Checkout
  output: 'standalone', 
};

export default nextConfig;
