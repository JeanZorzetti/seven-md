import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { findOrCreateCustomer, createPayment, cancelPayment } from '@/lib/asaas'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true, cpf: true, phone: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

  if (order.asaasPaymentId) {
    try { await cancelPayment(order.asaasPaymentId) } catch { /* already deleted or expired */ }
  }

  const customer = await findOrCreateCustomer({
    name: order.user.name ?? order.user.email,
    email: order.user.email,
    cpfCnpj: order.user.cpf?.replace(/\D/g, '') ?? '00000000000',
    mobilePhone: order.user.phone?.replace(/\D/g, ''),
  })

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 3)
  const payment = await createPayment({
    customer: customer.id,
    billingType: 'UNDEFINED',
    value: Number(order.total),
    dueDate: dueDate.toISOString().split('T')[0],
    description: `Locação — Pedido #${order.id.slice(-8).toUpperCase()} (reenvio)`,
    externalReference: order.id,
  })

  await prisma.order.update({
    where: { id },
    data: { asaasPaymentId: payment.id, paymentUrl: payment.invoiceUrl },
  })

  return NextResponse.json({ paymentUrl: payment.invoiceUrl })
}
