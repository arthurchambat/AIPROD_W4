/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empêcher la génération statique des routes API
  output: 'standalone',
  
  // Configuration webpack pour externaliser @supabase/supabase-js côté serveur
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externaliser @supabase/supabase-js pour empêcher son bundling
      // Cela force Node à le charger au runtime plutôt qu'au build
      config.externals = config.externals || []
      config.externals.push({
        '@supabase/supabase-js': 'commonjs @supabase/supabase-js'
      })
    }
    return config
  },
}

module.exports = nextConfig
