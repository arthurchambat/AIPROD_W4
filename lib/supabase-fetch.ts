// Helper pour appeler l'API Supabase directement via fetch (sans SDK)
// Cela évite les problèmes de build avec @supabase/supabase-js

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
  
  if (operation === 'select' && filters) {
    Object.entries(filters).forEach(([key, value]) => {
      url.searchParams.append(key, `eq.${value}`)
    })
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
  
  if (operation === 'select' && filters) {
    Object.entries(filters).forEach(([key, value]) => {
      url.searchParams.append(key, `eq.${value}`)
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
