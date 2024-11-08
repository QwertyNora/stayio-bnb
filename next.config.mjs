/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Lägg till Cloudinarys domän här
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
