import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'image.png',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '/**',
			}
		],
	},

};

export default nextConfig;
