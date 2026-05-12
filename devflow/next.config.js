/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Since Cloudflare Pages might have trouble with trailing slashes in some configs
  trailingSlash: true,
};

export default nextConfig;
