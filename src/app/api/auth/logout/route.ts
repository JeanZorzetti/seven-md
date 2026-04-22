import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

function clearAndRedirect(to = '/login') {
  const response = NextResponse.redirect(new URL(to, process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dados-seven.vapf51.easypanel.host'))
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}

export async function POST() {
  return clearAndRedirect()
}

export async function GET() {
  return clearAndRedirect()
}
