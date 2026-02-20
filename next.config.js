/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mantém exportação estática para Azure Static Web Apps
  output: 'export',
  // Desativa otimização de imagens (incompatível com static export)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
