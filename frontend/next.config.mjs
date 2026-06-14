/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '../.next',
  devIndicators: {
    buildActivity: true,
  },
};

export default nextConfig; // Pakai export default, bukan module.exports