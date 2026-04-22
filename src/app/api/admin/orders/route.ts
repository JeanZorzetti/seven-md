import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { findOrCreateCustomer, createPayment } from '@/lib/asaas'
import { hash } from 'bcryptjs'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''
  const dateFrom = searchParams.get('dateFrom') ?? ''
  const dateTo = searchParams.get('dateTo') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const limit = 20

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(dateFrom || dateTo ? {
      createdAt: {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo + 'T23:59:59') } : {}),
      },
    } : {}),
    ...(search ? {
      OR: [
        { user: { name: { contains: search, mode: 'insensitive' as const } } },
        { user: { email: { contains: search, mode: 'insensitive' as const } } },
      ],
    } : {}),
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await req.json()
  const { customerName, customerEmail, customerCpf, customerPhone, items, startDate, endDate, deliveryAddress } = body

  if (!customerEmail || !items?.length || !startDate || !endDate) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  let user = await prisma.user.findUnique({ where: { email: customerEmail } })
  if (!user) {
    const randomPw = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    user = await prisma.user.create({
      data: {
        name: customerName ?? customerEmail,
        email: customerEmail,
        passwordHash: await hash(randomPw, 10),
        phone: customerPhone ?? null,
        cpf: customerCpf ? customerCpf.replace(/\D/g, '') : null,
      },
    })
  }

  const productIds: string[] = items.map((i: { productId: string }) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  const subtotal = items.reduce((s: number, i: { productId: string; quantity: number }) => {
    return s + Number(productMap[i.productId]?.monthlyPrice ?? 0) * i.quantity
  }, 0)
  const total = subtotal

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      subtotal,
      deliveryFee: 0,
      total,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      deliveryAddress: deliveryAddress ?? {},
      items: {
        create: items.map((i: { productId: string; quantity: number }) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: productMap[i.productId]?.monthlyPrice ?? 0,
          subtotal: Number(productMap[i.productId]?.monthlyPrice ?? 0) * i.quantity,
        })),
      },
    },
  })

  let paymentUrl: string | null = null
  try {
    const customer = await findOrCreateCustomer({
      name: customerName ?? customerEmail,
      email: customerEmail,
      cpfCnpj: customerCpf?.replace(/\D/g, '') ?? '00000000000',
      mobilePhone: customerPhone?.replace(/\D/g, ''),
    })
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)
    const payment = await createPayment({
      customer: customer.id,
      billingType: 'UNDEFINED',
      value: total,
      dueDate: dueDate.toISOString().split('T')[0],
      description: `Locação — Pedido #${order.id.slice(-8).toUpperCase()}`,
      externalReference: order.id,
    })
    await prisma.order.update({
      where: { id: order.id },
      data: { asaasPaymentId: payment.id, paymentUrl: payment.invoiceUrl },
    })
    paymentUrl = payment.invoiceUrl
  } catch (err) {
    console.error('Asaas error on admin order:', err)
  }

  return NextResponse.json({ orderId: order.id, paymentUrl }, { status: 201 })
}
