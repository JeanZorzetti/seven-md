import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { PLAN_PRICES } from '@/lib/plans'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [activeSubscriptions, churnCount, appointmentsThisMonth, recentSubscriptions] = await Promise.all([
    prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      select: { plan: true },
    }),
    prisma.subscription.count({
      where: { status: 'CANCELLED', updatedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.appointment.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    }),
  ])

  const planCounts: Record<string, number> = {}
  let mrr = 0
  for (const sub of activeSubscriptions) {
    planCounts[sub.plan] = (planCounts[sub.plan] ?? 0) + 1
    mrr += PLAN_PRICES[sub.plan] ?? 0
  }

  const totalActive = activeSubscriptions.length
  const churnRate = totalActive > 0 ? (churnCount / totalActive) * 100 : 0

  return NextResponse.json({
    mrr,
    activeSubscribers: totalActive,
    planBreakdown: planCounts,
    churnCount,
    churnRate: Math.round(churnRate * 10) / 10,
    appointmentsThisMonth,
    recentSubscriptions,
  })
}
