import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const specialty = searchParams.get('specialty') ?? ''
  const available = searchParams.get('available') ?? 'all'

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { crm: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (specialty) where.specialty = specialty
  if (available !== 'all') where.available = available === 'true'

  const doctors = await prisma.doctor.findMany({
    where,
    orderBy: { name: 'asc' },
  })

  const specialties = await prisma.doctor.findMany({
    select: { specialty: true },
    distinct: ['specialty'],
    orderBy: { specialty: 'asc' },
  })

  return NextResponse.json({
    doctors,
    total: doctors.length,
    specialties: specialties.map((s) => s.specialty),
  })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await req.json()
  const { name, specialty, crm, state, bio } = body

  if (!name || !specialty || !crm || !state) {
    return NextResponse.json({ error: 'Nome, especialidade, CRM e estado são obrigatórios' }, { status: 400 })
  }

  const existing = await prisma.doctor.findUnique({ where: { crm } })
  if (existing) return NextResponse.json({ error: 'CRM já cadastrado' }, { status: 409 })

  const doctor = await prisma.doctor.create({
    data: { name, specialty, crm, state, bio: bio || null },
  })

  return NextResponse.json(doctor, { status: 201 })
}
