import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ASAAS_STATUS_MAP: Record<string, string> = {
  PAYMENT_RECEIVED: 'PAID',
  PAYMENT_CONFIRMED: 'PAID',
  PAYMENT_OVERDUE: 'PENDING_PAYMENT',
  PAYMENT_DELETED: 'CANCELLED',
  PAYMENT_REFUNDED: 'CANCELLED',
  PAYMENT_REFUND_IN_PROGRESS: 'CANCELLED',
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('asaas-access-token')
  if (process.env.ASAAS_WEBHOOK_TOKEN && token !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { event: string; payment?: { externalReference?: string } }
  const { event, payment } = body

  if (!payment?.externalReference) {
    return NextResponse.json({ ok: true })
  }

  const newStatus = ASAAS_STATUS_MAP[event]
  if (!newStatus) {
    return NextResponse.json({ ok: true })
  }

  try {
    await prisma.order.updateMany({
      where: { id: payment.externalReference },
      data: { status: newStatus as 'PAID' | 'CANCELLED' | 'PENDING_PAYMENT' },
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
