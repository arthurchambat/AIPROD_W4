/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empêcher la génération statique des routes API
  output: 'standalone',
  
  // Configuration webpack pour externaliser complètement Supabase
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Marquer @supabase/supabase-js comme externe pour empêcher le bundling
      // ET éviter son évaluation pendant le build
      if (!config.externals) {
        config.externals = []
      }
      
      const externals = Array.isArray(config.externals) ? config.externals : [config.externals]
      
      externals.push(({ request }, callback) => {
        if (request === '@supabase/supabase-js') {
          return callback(null, `commonjs ${request}`)
        }
        callback()
      })
      
      config.externals = externals
      
      // Aussi externaliser notre helper pour qu'il ne soit pas bundlé
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}
    }
    return config
  },
}

module.exports = nextConfig
