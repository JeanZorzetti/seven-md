import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { findOrCreateCustomer, createPayment } from '@/lib/asaas'

interface CartItemInput {
  id: string
  name: string
  monthlyPrice: number
  depositAmount: number
  minRentalDays: number
  quantity: number
}

interface CheckoutBody {
  form: {
    name: string
    email: string
    cpf: string
    phone: string
    cep: string
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
    startDate: string
    endDate: string
  }
  items: CartItemInput[]
}

export async function POST(req: NextRequest) {
  const body = await req.json() as CheckoutBody
  const { form, items } = body

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
  }

  const session = await getSession()

  let userId: string | null = null
  if (session) {
    userId = session.id as string
  } else {
    // Guest checkout — create or find user by email
    let user = await prisma.user.findUnique({ where: { email: form.email } })
    if (!user) {
      const { hash } = await import('bcryptjs')
      const randomPw = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      user = await prisma.user.create({
        data: {
          name: form.name,
          email: form.email,
          passwordHash: await hash(randomPw, 10),
          phone: form.phone,
          cpf: form.cpf.replace(/\D/g, ''),
        },
      })
    }
    userId = user.id
  }

  const subtotal = items.reduce((s, i) => s + i.monthlyPrice * i.quantity, 0)
  const depositTotal = items.reduce((s, i) => s + i.depositAmount * i.quantity, 0)
  const total = subtotal + depositTotal

  const order = await prisma.order.create({
    data: {
      userId,
      subtotal,
      deliveryFee: 0,
      total,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
      deliveryAddress: {
        cep: form.cep,
        rua: form.rua,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
      },
      items: {
        create: await Promise.all(
          items.map(async (item) => {
            const product = await prisma.product.findUnique({ where: { id: item.id } })
            return {
              productId: item.id,
              quantity: item.quantity,
              unitPrice: item.monthlyPrice,
              subtotal: item.monthlyPrice * item.quantity,
            }
          })
        ),
      },
    },
  })

  // Create Asaas payment
  try {
    const customer = await findOrCreateCustomer({
      name: form.name,
      email: form.email,
      cpfCnpj: form.cpf.replace(/\D/g, ''),
      mobilePhone: form.phone.replace(/\D/g, ''),
    })

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)
    const dueDateStr = dueDate.toISOString().split('T')[0]

    const payment = await createPayment({
      customer: customer.id,
      billingType: 'UNDEFINED',
      value: total,
      dueDate: dueDateStr,
      description: `Locação de equipamentos — Pedido #${order.id.slice(-8).toUpperCase()}`,
      externalReference: order.id,
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        asaasPaymentId: payment.id,
        paymentUrl: payment.invoiceUrl,
      },
    })

    return NextResponse.json({ orderId: order.id, paymentUrl: payment.invoiceUrl })
  } catch (err) {
    console.error('Asaas error:', err)
    // Return order anyway so user can pay manually or retry
    return NextResponse.json({ orderId: order.id, paymentUrl: null })
  }
}
