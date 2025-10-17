// FICHIER TEMPORAIRE POUR LE BUILD VERCEL
// Ce fichier mock remplace supabaseServer.ts pendant le build pour éviter le crash
// En production, les vraies credentials seront dans les env vars Vercel

export const supabaseServer = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: new Error('Mock client') })
  },
  from: () => ({
    select: () => ({ 
      eq: () => ({ 
        single: async () => ({ data: null, error: new Error('Mock client') })
      })
    }),
    insert: async () => ({ data: null, error: new Error('Mock client') })
  }),
  storage: {
    from: () => ({ 
      upload: async () => ({ data: null, error: new Error('Mock client') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
}
