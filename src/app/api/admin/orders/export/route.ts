import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { toCSV } from '@/lib/csv'
import { ORDER_STATUS_LABELS } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''
  const dateFrom = searchParams.get('dateFrom') ?? ''
  const dateTo = searchParams.get('dateTo') ?? ''

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(dateFrom || dateTo ? {
        createdAt: {
          ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
          ...(dateTo ? { lte: new Date(dateTo + 'T23:59:59') } : {}),
        },
      } : {}),
    },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5000,
  })

  const rows = orders.map((o) => ({
    id: o.id.slice(-8).toUpperCase(),
    createdAt: new Date(o.createdAt).toLocaleDateString('pt-BR'),
    customerName: o.user.name,
    customerEmail: o.user.email,
    items: o.items.map((i) => `${i.product.name} (x${i.quantity})`).join(' | '),
    startDate: new Date(o.startDate).toLocaleDateString('pt-BR'),
    endDate: new Date(o.endDate).toLocaleDateString('pt-BR'),
    subtotal: Number(o.subtotal).toFixed(2).replace('.', ','),
    total: Number(o.total).toFixed(2).replace('.', ','),
    status: ORDER_STATUS_LABELS[o.status] ?? o.status,
    paymentUrl: o.paymentUrl ?? '',
  }))

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'createdAt', label: 'Data Pedido' },
    { key: 'customerName', label: 'Cliente' },
    { key: 'customerEmail', label: 'E-mail' },
    { key: 'items', label: 'Itens' },
    { key: 'startDate', label: 'Início Locação' },
    { key: 'endDate', label: 'Fim Locação' },
    { key: 'subtotal', label: 'Subtotal (R$)' },
    { key: 'total', label: 'Total (R$)' },
    { key: 'status', label: 'Status' },
    { key: 'paymentUrl', label: 'Link Pagamento' },
  ]

  const csv = toCSV(rows, headers)
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pedidos-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
