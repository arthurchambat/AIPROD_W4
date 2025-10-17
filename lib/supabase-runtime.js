// @ts-nocheck
// Ce fichier utilise require() pur pour éviter le bundling par Webpack

function getSupabaseModule() {
  // Charger le module seulement au runtime
  return require('@supabase/supabase-js')
}

function createSupabaseClient(token) {
  const { createClient } = getSupabaseModule()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })
}

function createSupabaseServiceClient() {
  const { createClient } = getSupabaseModule()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

module.exports = {
  createSupabaseClient,
  createSupabaseServiceClient
}
