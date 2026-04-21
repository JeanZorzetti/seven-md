import { NextRequest, NextResponse } from 'next/server'
import { getPatientSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasActiveSubscription } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const active = await hasActiveSubscription(session.id)
  if (!active) {
    return NextResponse.json({ error: 'Plano necessário', code: 'NO_SUBSCRIPTION' }, { status: 403 })
  }

  const body = await request.json()
  const { appointmentId, rating, comment } = body

  if (!appointmentId || typeof rating !== 'number') {
    return NextResponse.json({ error: 'appointmentId e rating são obrigatórios' }, { status: 400 })
  }

  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json({ error: 'Rating deve ser um número inteiro entre 1 e 5' }, { status: 400 })
  }

  // Verify appointment belongs to user and is COMPLETED
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { id: true, userId: true, status: true, review: { select: { id: true } } },
  })

  if (!appointment) {
    return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 })
  }

  if (appointment.userId !== session.id) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  if (appointment.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Só é possível avaliar consultas concluídas' }, { status: 400 })
  }

  if (appointment.review) {
    return NextResponse.json({ error: 'Esta consulta já foi avaliada' }, { status: 409 })
  }

  const review = await prisma.review.create({
    data: {
      userId: session.id,
      appointmentId,
      rating,
      comment: comment ?? null,
    },
  })

  return NextResponse.json(review, { status: 201 })
}
