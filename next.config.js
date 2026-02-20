/** @type {import('next').NextConfig} */
const nextConfig = {
  // Muda para standalone para permitir API Routes e SSR em ambiente de produção (ex: Azure SWA Hybrid)
  output: 'standalone',
  // Desativa otimização de imagens (necessário para alguns ambientes serverless sem sharp)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
