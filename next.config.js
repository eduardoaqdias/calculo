/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mantém exportação estática para Azure Static Web Apps
  output: 'export',
  // Desativa otimização de imagens (incompatível com static export)
  images: {
    unoptimized: true,
  },
  // Trailing slash para compatibilidade com Azure
  trailingSlash: true,
};

module.exports = nextConfig;
