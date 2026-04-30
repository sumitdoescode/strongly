import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["mongoose", "mongodb", "better-auth", "@better-auth/mongo-adapter"],
    // cacheComponents: true,
};

export default nextConfig;
