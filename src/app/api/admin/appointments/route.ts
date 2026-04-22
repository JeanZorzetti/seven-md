import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''
  const specialty = searchParams.get('specialty') ?? ''
  const dateFrom = searchParams.get('dateFrom') ?? ''
  const dateTo = searchParams.get('dateTo') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const limit = 30

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (specialty) where.specialty = specialty
  if (dateFrom || dateTo) {
    where.dateTime = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo + 'T23:59:59') } : {}),
    }
  }
  if (search) {
    where.user = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        review: true,
      },
      orderBy: { dateTime: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ])

  const specialties = await prisma.appointment.findMany({
    select: { specialty: true },
    distinct: ['specialty'],
    orderBy: { specialty: 'asc' },
  })

  return NextResponse.json({
    appointments,
    total,
    page,
    pages: Math.ceil(total / limit),
    specialties: specialties.map((s) => s.specialty),
  })
}
