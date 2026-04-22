import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { APPOINTMENT_STATUS_NEXT } from '@/lib/constants'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      review: true,
    },
  })
  if (!appointment) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(appointment)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  if (body.status) {
    const current = await prisma.appointment.findUnique({ where: { id }, select: { status: true } })
    if (!current) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    if (body.status !== 'CANCELLED') {
      const validNext = APPOINTMENT_STATUS_NEXT[current.status]
      if (validNext !== body.status) {
        return NextResponse.json(
          { error: `Não é possível avançar de ${current.status} para ${body.status}` },
          { status: 422 }
        )
      }
    }
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.doctorName !== undefined && { doctorName: body.doctorName }),
    },
    include: { user: { select: { name: true } } },
  })

  return NextResponse.json(appointment)
}
