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

  const body = await req.json() as {
    event: string
    payment?: { externalReference?: string; subscription?: string }
    subscription?: { id: string }
  }
  const { event, payment, subscription } = body

  // Handle subscription lifecycle events
  if (event === 'SUBSCRIPTION_DELETED' && subscription?.id) {
    await prisma.subscription.updateMany({
      where: { asaasSubscriptionId: subscription.id },
      data: { status: 'CANCELLED' },
    })
    return NextResponse.json({ ok: true })
  }

  if (!payment?.externalReference) {
    return NextResponse.json({ ok: true })
  }

  // If payment belongs to a subscription, activate it when received
  if (payment.subscription && (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED')) {
    await prisma.subscription.updateMany({
      where: { asaasSubscriptionId: payment.subscription },
      data: { status: 'ACTIVE' },
    })
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
