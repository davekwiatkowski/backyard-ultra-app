import packageJson from './package.json' with { type: 'json' };

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <=== enables static exports
  reactStrictMode: true,
  publicRuntimeConfig: {
    version: packageJson.version,
  },
};

export default nextConfig;
