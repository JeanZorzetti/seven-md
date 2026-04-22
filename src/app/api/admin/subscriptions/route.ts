import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const plan = searchParams.get('plan') ?? ''
  const status = searchParams.get('status') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const limit = 20

  const where: Record<string, unknown> = {}
  if (plan) where.plan = plan
  if (status) where.status = status

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.subscription.count({ where }),
  ])

  return NextResponse.json({ subscriptions, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { userId, plan, months = 1 } = await req.json()

  if (!userId || !plan) {
    return NextResponse.json({ error: 'userId e plan são obrigatórios' }, { status: 400 })
  }

  const validPlans = ['INDIVIDUAL', 'FAMILIAR', 'FAMILIAR_PRO', 'EMPRESARIAL']
  if (!validPlans.includes(plan)) {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
  }

  const startDate = new Date()
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + Number(months))

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    create: { userId, plan, status: 'ACTIVE', startDate, endDate },
    update: { plan, status: 'ACTIVE', startDate, endDate },
  })

  return NextResponse.json(subscription)
}
