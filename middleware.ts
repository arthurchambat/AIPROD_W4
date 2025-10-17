import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware désactivé (matcher vide) car l'authentification est gérée par les routes individuelles
export async function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
