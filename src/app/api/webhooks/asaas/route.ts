import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { criarPaciente, gerarMagicLink } from '@/lib/meditele'
import { PLAN_PRICES } from '@/lib/plans'

const MAGIC_LINK_EXPIRES_MINUTES = 60 * 24 * 7 // 7 days

const STATUS_MAP: Record<string, string> = {
  PAYMENT_CONFIRMED: 'ACTIVE',
  PAYMENT_RECEIVED: 'ACTIVE',
  PAYMENT_OVERDUE: 'EXPIRED',
  PAYMENT_DELETED: 'CANCELLED',
  PAYMENT_REFUNDED: 'CANCELLED',
  PAYMENT_REFUND_IN_PROGRESS: 'CANCELLED',
}

export async function POST(req: NextRequest) {
  try {
    const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN
    if (webhookToken) {
      const token = req.headers.get('asaas-access-token')
      if (token !== webhookToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await req.json() as {
      event: string
      payment?: {
        customer?: string
        subscription?: string
        externalReference?: string
      }
      subscription?: { id: string }
    }
    const { event, payment, subscription: subEvent } = body

    // Subscription cancelled directly in Asaas
    if (event === 'SUBSCRIPTION_DELETED' && subEvent?.id) {
      await prisma.subscription.updateMany({
        where: { asaasSubscriptionId: subEvent.id },
        data: { status: 'CANCELLED' },
      })
      return NextResponse.json({ ok: true })
    }

    if (!payment) return NextResponse.json({ ok: true })

    const newStatus = STATUS_MAP[event]
    if (!newStatus) return NextResponse.json({ ok: true })

    // Find subscription by Asaas customer ID
    const sub = payment.customer
      ? await prisma.subscription.findFirst({
          where: { asaasCustomerId: payment.customer },
          include: { user: { select: { name: true, email: true, cpf: true, phone: true } } },
        })
      : null

    // Fallback: find by asaasSubscriptionId if already linked
    const subById = !sub && payment.subscription
      ? await prisma.subscription.findFirst({
          where: { asaasSubscriptionId: payment.subscription },
          include: { user: { select: { name: true, email: true, cpf: true, phone: true } } },
        })
      : null

    const found = sub ?? subById
    if (!found) return NextResponse.json({ ok: true })

    // Update status + link asaasSubscriptionId if not yet set
    await prisma.subscription.update({
      where: { id: found.id },
      data: {
        status: newStatus as 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL',
        ...(newStatus === 'ACTIVE' && { startDate: new Date() }),
        ...(payment.subscription && !found.asaasSubscriptionId && {
          asaasSubscriptionId: payment.subscription,
        }),
      },
    })

    // On activation: provision Meditele + register sale in prolife-site CRM
    if (newStatus === 'ACTIVE') {
      await provisionarMeditele(found.id, {
        meditelePatientId: found.meditelePatientId,
        name: found.user.name,
        email: found.user.email,
        cpf: found.user.cpf ?? '',
        phone: found.user.phone ?? undefined,
      })

      await registrarVendaProlife({
        nome: found.user.name,
        email: found.user.email,
        cpf: found.user.cpf ?? undefined,
        telefone: found.user.phone ?? undefined,
        plano: found.plan,
        valorMensal: PLAN_PRICES[found.plan] ?? 0,
        asaasCustomerId: found.asaasCustomerId ?? undefined,
        asaasSubscriptionId: payment.subscription ?? found.asaasSubscriptionId ?? undefined,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook/asaas]', err)
    return NextResponse.json({ ok: true }) // always 200 to prevent Asaas retries
  }
}

async function provisionarMeditele(
  subscriptionId: string,
  opts: {
    meditelePatientId: string | null
    name: string
    email: string
    cpf: string
    phone?: string
  }
) {
  try {
    let patientId = opts.meditelePatientId

    if (!patientId) {
      const res = await criarPaciente({
        name: opts.name,
        cpf: opts.cpf.replace(/\D/g, ''),
        email: opts.email,
        phone: opts.phone?.replace(/\D/g, ''),
        birthDate: '1990-01-01',
        gender: 'other',
      })

      patientId =
        res?.data?.patient?.id ??
        res?.data?.id ??
        res?.data?.patientId ??
        null

      if (!patientId) {
        console.warn(`[webhook/asaas] Meditele: patientId não retornado para subscription ${subscriptionId}`)
        return
      }

      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { meditelePatientId: patientId },
      })

      console.log(`[webhook/asaas] Meditele: paciente criado ${patientId}`)
    }

    const magicRes = await gerarMagicLink(patientId, {
      expiresInMinutes: MAGIC_LINK_EXPIRES_MINUTES,
    })

    const loginUrl = magicRes?.loginUrls?.[0]?.loginUrl ?? null

    if (!loginUrl) {
      console.warn(`[webhook/asaas] Meditele: loginUrl vazio para subscription ${subscriptionId}`)
      return
    }

    const exp = new Date(Date.now() + MAGIC_LINK_EXPIRES_MINUTES * 60 * 1000)

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { mediteleLoginUrl: loginUrl, mediteleLoginExp: exp },
    })

    console.log(`[webhook/asaas] Magic link gerado para subscription ${subscriptionId}`)
  } catch (err) {
    console.error(`[webhook/asaas] Meditele falhou para subscription ${subscriptionId}:`, err)
  }
}

async function registrarVendaProlife(opts: {
  nome: string
  email: string
  cpf?: string
  telefone?: string
  plano: string
  valorMensal: number
  asaasCustomerId?: string
  asaasSubscriptionId?: string
}) {
  try {
    const secret = process.env.INTERNAL_SECRET
    const prolifeUrl = process.env.PROLIFE_INTERNAL_URL ?? 'https://prolifemed.com.br'

    if (!secret) {
      console.warn('[webhook/asaas] INTERNAL_SECRET não configurado — venda não registrada no prolife-site')
      return
    }

    const res = await fetch(`${prolifeUrl}/api/internal/b2c-venda`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
      body: JSON.stringify({
        nome: opts.nome,
        email: opts.email,
        cpf: opts.cpf,
        telefone: opts.telefone,
        plano: opts.plano,
        valor_mensal: opts.valorMensal,
        asaas_customer_id: opts.asaasCustomerId,
        asaas_subscription_id: opts.asaasSubscriptionId,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[webhook/asaas] registrarVendaProlife falhou (${res.status}): ${err}`)
    } else {
      console.log(`[webhook/asaas] Venda registrada no prolife-site para ${opts.email}`)
    }
  } catch (err) {
    console.error('[webhook/asaas] registrarVendaProlife erro:', err)
  }
}
