import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE = process.env.MAINTENANCE_MODE === 'true'

export function middleware(req: NextRequest) {
  if (!MAINTENANCE) return NextResponse.next()

  const { pathname } = req.nextUrl

  // Allow admin, API routes, and static assets through
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/manutencao'
  ) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/manutencao', req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|Logos).*)'],
}
