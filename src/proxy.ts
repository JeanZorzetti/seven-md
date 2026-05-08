import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'sevenmd-secret-fallback'
)
const COOKIE = 'sevenmd_session'

async function getTokenPayload(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { id: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Maintenance mode — redirect all public routes, keep admin/api/login/manutencao
  if (process.env.MAINTENANCE_MODE === 'true') {
    const allowed =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/login') ||
      pathname === '/manutencao'
    if (!allowed) {
      return NextResponse.redirect(new URL('/manutencao', req.url))
    }
  }

  const payload = await getTokenPayload(req)

  if (pathname.startsWith('/plataforma')) {
    if (!payload || payload.role !== 'PATIENT') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  if (pathname.startsWith('/minha-conta')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (payload.role === 'PATIENT') {
      return NextResponse.redirect(new URL('/minha-conta', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|Logos).*)'],
}
