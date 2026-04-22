import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { ORDER_STATUS_NEXT } from '@/lib/constants'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, cpf: true } },
      items: { include: { product: { select: { id: true, name: true, images: true } } } },
    },
  })
  if (!order) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const { status } = await req.json()

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

  const validNext = ORDER_STATUS_NEXT[order.status]
  if (status !== 'CANCELLED' && status !== validNext) {
    return NextResponse.json({ error: `Transição inválida: ${order.status} → ${status}` }, { status: 400 })
  }

  const updated = await prisma.order.update({ where: { id }, data: { status } })
  return NextResponse.json(updated)
}
