import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create supabase client with proper cookie handling
  const supabase = createMiddlewareClient({ req, res })

  // IMPORTANT: Always refresh session to ensure cookies are set correctly
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protected API routes
  if (req.nextUrl.pathname.startsWith('/api/generate') || 
      req.nextUrl.pathname.startsWith('/api/projects')) {
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
  }

  // CRITICAL: Return response with potentially updated cookies
  return res
}

export const config = {
  // Let individual routes handle their own authentication
  // This prevents cookie/session issues with middleware
  matcher: [],
}
