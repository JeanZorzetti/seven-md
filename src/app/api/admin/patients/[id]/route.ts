import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, cpf: true,
      birthDate: true, gender: true, createdAt: true,
      subscription: true,
      appointments: {
        orderBy: { dateTime: 'desc' },
        take: 20,
        include: { review: true },
      },
      _count: { select: { appointments: true } },
    },
  })
  if (!user) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(user)
}
