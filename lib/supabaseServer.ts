// Ne PAS importer @supabase/supabase-js au top-level car ça crash le build Vercel
// Utiliser un lazy loading à la place

let _client: any = null

function getClient() {
  if (_client) return _client
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  // Si pas de credentials, retourner un mock
  if (!supabaseUrl || !supabaseServiceKey || 
      supabaseUrl.includes('placeholder') || supabaseServiceKey.includes('placeholder')) {
    console.log('⚠️  No valid credentials, returning mock Supabase client')
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: new Error('No credentials') }) },
      from: () => ({ 
        select: () => ({ 
          eq: () => ({ 
            single: async () => ({ data: null, error: new Error('No credentials') }),
            eq: () => ({ single: async () => ({ data: null, error: new Error('No credentials') }) })
          }) 
        }),
        insert: async () => ({ data: null, error: new Error('No credentials') }),
        update: () => ({ eq: async () => ({ data: null, error: new Error('No credentials') }) }),
        delete: () => ({ eq: async () => ({ data: null, error: new Error('No credentials') }) })
      }),
      storage: { 
        from: () => ({ 
          upload: async () => ({ data: null, error: new Error('No credentials') }), 
          getPublicUrl: () => ({ data: { publicUrl: '' } }) 
        }) 
      }
    }
  }
  
  // Import dynamique pour éviter l'évaluation au build
  // Utiliser eval() pour complètement cacher le require de Webpack
  try {
    // eslint-disable-next-line no-eval
    const createClient = eval('require')('@supabase/supabase-js').createClient
    
    _client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    return _client
  } catch (error) {
    console.error('Failed to load Supabase SDK:', error)
    // Retourner le mock si le SDK ne peut pas être chargé
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: new Error('SDK not available') }) },
      from: () => ({ 
        select: () => ({ 
          eq: () => ({ 
            single: async () => ({ data: null, error: new Error('SDK not available') }),
            eq: () => ({ single: async () => ({ data: null, error: new Error('SDK not available') }) })
          }) 
        }),
        insert: async () => ({ data: null, error: new Error('SDK not available') }),
        update: () => ({ eq: async () => ({ data: null, error: new Error('SDK not available') }) }),
        delete: () => ({ eq: async () => ({ data: null, error: new Error('SDK not available') }) })
      }),
      storage: { 
        from: () => ({ 
          upload: async () => ({ data: null, error: new Error('SDK not available') }), 
          getPublicUrl: () => ({ data: { publicUrl: '' } }) 
        }) 
      }
    }
  }
}

// Export une fonction qui retourne le client au lieu du client directement
export const supabaseServer = new Proxy({} as any, {
  get(target, prop) {
    const client = getClient()
    if (!client) {
      throw new Error('Supabase client not available')
    }
    return client[prop]
  }
})
