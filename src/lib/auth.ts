import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'sevenmd-secret-fallback'
)

export const COOKIE_NAME = 'sevenmd_session'

export async function signToken(payload: { id: string; email: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET)
  return payload as { id: string; email: string; role: string }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}

export async function getPatientSession() {
  const session = await getSession()
  if (!session || session.role !== 'PATIENT') return null
  return session
}

export async function getAdminSession() {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) return null
  return session
}
