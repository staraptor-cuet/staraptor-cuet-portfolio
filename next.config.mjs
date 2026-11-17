/** @type {import('next').NextConfig} */
const nextConfig = {
  // No `output: 'export'`: the assistant needs a server route (/api/chat). All pages are still prerendered as static.
  images: {
    unoptimized: true
  }
};

export default nextConfig;
