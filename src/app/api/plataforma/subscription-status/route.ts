import { NextResponse } from 'next/server'
import { getPatientSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const sub = await prisma.subscription.findUnique({ where: { userId: session.id } })

  const isActive =
    !!sub &&
    (sub.status === 'ACTIVE' || sub.status === 'TRIAL') &&
    (!sub.endDate || sub.endDate > new Date())

  return NextResponse.json({
    isSubscriber: isActive,
    plan: sub?.plan ?? null,
    status: sub?.status ?? null,
  })
}
