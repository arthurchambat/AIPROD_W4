export async function supabaseAuth(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  })
  
  if (!response.ok) {
    return { data: null, error: new Error('Unauthorized') }
  }
  
  const userData = await response.json()
  return { data: userData, error: null }
}

export async function supabaseQuery(
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
  data?: any,
  filters?: Record<string, any>,
  token?: string
) {
  const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}`)
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      // Si la valeur commence par "eq.", "lt.", etc., on l'utilise directement
      url.searchParams.append(key, value)
    })
  }
  
  // Tri par défaut par created_at descendant pour les projets
  if (operation === 'select' && table === 'projects') {
    url.searchParams.append('order', 'created_at.desc')
  }
  
  const headers: Record<string, string> = {
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const options: RequestInit = {
    method: operation === 'select' ? 'GET' : operation === 'insert' ? 'POST' : operation === 'update' ? 'PATCH' : 'DELETE',
    headers
  }
  
  if (data && operation !== 'select') {
    options.body = JSON.stringify(data)
  }
  
  const response = await fetch(url.toString(), options)
  
  if (!response.ok) {
    const error = await response.text()
    return { data: null, error: new Error(error) }
  }
  
  const result = await response.json()
  return { data: result, error: null }
}

export async function supabaseServiceQuery(
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
  data?: any,
  filters?: Record<string, any>
) {
  const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}`)
  
  // Pour SELECT, UPDATE et DELETE, ajouter les filtres à l'URL
  if (filters && (operation === 'select' || operation === 'update' || operation === 'delete')) {
    Object.entries(filters).forEach(([key, value]) => {
      // Si la valeur commence déjà par "eq.", "lt.", etc., l'utiliser directement
      if (typeof value === 'string' && value.match(/^(eq|neq|gt|gte|lt|lte|like|ilike|is|in|cs|cd|sl|sr|nxl|nxr|adj|ov|fts|plfts|phfts|wfts)\./)) {
        url.searchParams.append(key, value)
      } else {
        url.searchParams.append(key, `eq.${value}`)
      }
    })
  }
  
  const headers: Record<string, string> = {
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
  
  const options: RequestInit = {
    method: operation === 'select' ? 'GET' : operation === 'insert' ? 'POST' : operation === 'update' ? 'PATCH' : 'DELETE',
    headers
  }
  
  if (data && operation !== 'select') {
    options.body = JSON.stringify(data)
  }
  
  const response = await fetch(url.toString(), options)
  
  if (!response.ok) {
    const error = await response.text()
    return { data: null, error: new Error(error) }
  }
  
  const result = await response.json()
  return { data: result, error: null }
}
