import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const limit = 20

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
    ],
  } : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true, createdAt: true,
        _count: { select: { orders: true } },
        orders: { select: { total: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  const result = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    createdAt: u.createdAt,
    orderCount: u._count.orders,
    totalSpent: u.orders.reduce((s, o) => s + Number(o.total), 0),
  }))

  return NextResponse.json({ customers: result, total, page, pages: Math.ceil(total / limit) })
}
