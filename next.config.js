/** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
//     }
// }

const nextConfig = {
  images: {
    // Update to use remotePatterns with the appropriate protocol, hostname, port, and pathname
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {},
};

module.exports = nextConfig;
