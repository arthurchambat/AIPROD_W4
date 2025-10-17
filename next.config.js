/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empêcher la génération statique des routes API
  // Cela évite l'erreur "Collecting page data" au build
  output: 'standalone',
  
  // Désactiver la collecte de page data pour le build
  experimental: {
    instrumentationHook: false,
  },
}

module.exports = nextConfig
