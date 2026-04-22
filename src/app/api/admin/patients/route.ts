import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const plan = searchParams.get('plan') ?? ''
  const subStatus = searchParams.get('subStatus') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const limit = 20

  const where: Record<string, unknown> = { role: 'PATIENT' }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { cpf: { contains: search } },
    ]
  }

  if (plan || subStatus) {
    where.subscription = {
      ...(plan ? { plan } : {}),
      ...(subStatus ? { status: subStatus } : {}),
    }
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true, cpf: true, createdAt: true,
        subscription: { select: { plan: true, status: true, startDate: true } },
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ patients: users, total, page, pages: Math.ceil(total / limit) })
}
