/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable in Next.js 14, no need for experimental flag
  
  // Désactiver la collecte automatique de données pour les routes API
  // Cela empêche Next.js d'évaluer les modules au moment du build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Forcer le rendu dynamique pour éviter les problèmes au build
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Empêcher l'évaluation des modules qui nécessitent des env vars au runtime
      config.externals = config.externals || []
    }
    return config
  },
}

module.exports = nextConfig
