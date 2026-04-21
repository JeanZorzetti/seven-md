import { NextRequest, NextResponse } from 'next/server'
import { getPatientSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, phone: true, cpf: true, birthDate: true, gender: true },
  })

  return NextResponse.json(user)
}

export async function PATCH(request: NextRequest) {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { name, phone, birthDate, gender } = await request.json()

  const updated = await prisma.user.update({
    where: { id: session.id },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone: phone || null }),
      ...(birthDate !== undefined && { birthDate: birthDate ? new Date(birthDate) : null }),
      ...(gender !== undefined && { gender: gender || null }),
    },
    select: { name: true, email: true, phone: true, cpf: true, birthDate: true, gender: true },
  })

  return NextResponse.json(updated)
}
