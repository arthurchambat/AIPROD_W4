// Helper to lazy-load Supabase client only at runtime
// This prevents build-time evaluation issues

let _createClient: any = null

export function getSupabaseCreateClient() {
  if (!_createClient) {
    // Only load when actually needed (runtime, not build time)
    _createClient = require('@supabase/supabase-js').createClient
  }
  return _createClient
}

export function createSupabaseClient(token: string) {
  const createClient = getSupabaseCreateClient()
  
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

export function createSupabaseServiceClient() {
  const createClient = getSupabaseCreateClient()
  
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
