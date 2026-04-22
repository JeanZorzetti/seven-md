import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { findOrCreateCustomer, createPaymentLink } from '@/lib/asaas'
import { PLAN_PRICES, PLAN_LABELS } from '@/lib/plans'
import { SubscriptionPlan } from '@prisma/client'
import bcrypt from 'bcryptjs'

const PLAN_KEY_MAP: Record<string, string> = {
  individual: 'INDIVIDUAL',
  familiar: 'FAMILIAR',
  'familiar-pro': 'FAMILIAR_PRO',
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dados-seven.vapf51.easypanel.host'

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    plan: string
    name: string
    email: string
    cpf: string
    phone?: string
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

  // Upsert user
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

  // Create/find Asaas customer
  let asaasCustomer
  try {
    asaasCustomer = await findOrCreateCustomer({
      name: body.name,
      email: body.email,
      cpfCnpj: body.cpf,
      mobilePhone: body.phone?.replace(/\D/g, ''),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao criar cliente no Asaas'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // Split 70% ProLife
  const prolifeWalletId = process.env.ASAAS_PROLIFE_WALLET_ID
  const splits = prolifeWalletId ? [{ walletId: prolifeWalletId, percentualValue: 70 }] : undefined

  // Create recurring payment link
  let paymentLink
  try {
    paymentLink = await createPaymentLink({
      name: `Seven-MD ${PLAN_LABELS[planKey]} — ${body.name}`,
      description: `Assinatura mensal ${PLAN_LABELS[planKey]} - Seven-MD Telemedicina`,
      value: price,
      externalReference: `${body.plan}:${body.cpf.replace(/\D/g, '')}`,
      redirectUrl: `${SITE_URL}/planos/sucesso`,
      splits,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao criar link de pagamento'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // Upsert subscription as TRIAL (activated by webhook on payment)
  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan: planKey as SubscriptionPlan,
      status: 'TRIAL',
      startDate: new Date(),
      asaasCustomerId: asaasCustomer.id,
      asaasPaymentLinkId: paymentLink.id,
      asaasPaymentLinkUrl: paymentLink.url,
    },
    update: {
      plan: planKey as SubscriptionPlan,
      status: 'TRIAL',
      startDate: new Date(),
      asaasCustomerId: asaasCustomer.id,
      asaasPaymentLinkId: paymentLink.id,
      asaasPaymentLinkUrl: paymentLink.url,
    },
  })

  return NextResponse.json({ ok: true, redirectUrl: paymentLink.url })
}
