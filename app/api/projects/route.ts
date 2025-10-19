import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAuth, supabaseQuery } from '../../../lib/supabase-fetch'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    // Get the access token from Authorization header
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      console.log('No authorization token provided')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify the token with Supabase via REST API
    const { data: user, error: authError } = await supabaseAuth(token)
    
    if (authError || !user) {
      console.log('Invalid token:', authError?.message)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const userId = user.id

    // Fetch user's projects via REST API
    const { data: projects, error: dbError } = await supabaseQuery(
      'projects',
      'select',
      {},
      { user_id: `eq.${userId}` },
      token
    )

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ projects })
  } catch (err: any) {
    console.error('Error in GET /api/projects:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
