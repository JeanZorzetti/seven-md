import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findOrCreateCustomer, createAsaasSubscription } from '@/lib/asaas'
import { PLAN_PRICES } from '@/lib/plans'
import { SubscriptionPlan } from '@prisma/client'
import bcrypt from 'bcryptjs'

const PLAN_KEY_MAP: Record<string, string> = {
  individual: 'INDIVIDUAL',
  familiar: 'FAMILIAR',
  'familiar-pro': 'FAMILIAR_PRO',
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    plan: string
    name: string
    email: string
    cpf: string
    phone?: string
    postalCode?: string
    addressNumber?: string
    creditCard?: {
      holderName: string
      number: string
      expiryMonth: string
      expiryYear: string
      ccv: string
    }
  }

  const planKey = PLAN_KEY_MAP[body.plan]
  if (!planKey) {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
  }

  const price = PLAN_PRICES[planKey]
  if (!price) {
    return NextResponse.json({ error: 'Plano sem preço configurado' }, { status: 400 })
  }

  if (!body.name || !body.email || !body.cpf) {
    return NextResponse.json({ error: 'Nome, email e CPF são obrigatórios' }, { status: 400 })
  }

  let user = await prisma.user.findUnique({ where: { email: body.email } })
  if (!user) {
    const tempPassword = await bcrypt.hash(Math.random().toString(36), 10)
    user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        cpf: body.cpf.replace(/\D/g, ''),
        phone: body.phone ?? '',
        passwordHash: tempPassword,
        role: 'PATIENT',
      },
    })
  }

  let asaasCustomer
  try {
    asaasCustomer = await findOrCreateCustomer({
      name: body.name,
      email: body.email,
      cpfCnpj: body.cpf,
      mobilePhone: body.phone,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao criar cliente no Asaas'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const prolifeWalletId = process.env.ASAAS_PROLIFE_WALLET_ID
  const split = prolifeWalletId ? [{ walletId: prolifeWalletId, percentualValue: 70 }] : undefined

  const nextDueDate = new Date()
  nextDueDate.setDate(nextDueDate.getDate() + 1)
  const dueDateStr = nextDueDate.toISOString().split('T')[0]

  const billingType = body.creditCard ? 'CREDIT_CARD' : 'PIX'

  let asaasSubscription
  try {
    asaasSubscription = await createAsaasSubscription({
      customer: asaasCustomer.id,
      billingType,
      value: price,
      nextDueDate: dueDateStr,
      cycle: 'MONTHLY',
      description: `Plano ${planKey} - Seven-MD Telemedicina`,
      externalReference: user.id,
      split,
      ...(body.creditCard && {
        creditCard: body.creditCard,
        creditCardHolderInfo: {
          name: body.name,
          email: body.email,
          cpfCnpj: body.cpf.replace(/\D/g, ''),
          postalCode: body.postalCode ?? '00000000',
          addressNumber: body.addressNumber ?? 'S/N',
          phone: body.phone ?? '',
        },
      }),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao criar assinatura no Asaas'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + 1)

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan: planKey as SubscriptionPlan,
      status: 'TRIAL',
      startDate: new Date(),
      endDate,
      asaasSubscriptionId: asaasSubscription.id,
    },
    update: {
      plan: planKey as SubscriptionPlan,
      status: 'TRIAL',
      startDate: new Date(),
      endDate,
      asaasSubscriptionId: asaasSubscription.id,
    },
  })

  return NextResponse.json({ ok: true, subscriptionId: asaasSubscription.id })
}
