/**
 * Asaas Payment API Client
 * Docs: https://docs.asaas.com
 * Auth: header `access_token` (NOT Authorization: Bearer)
 */

const BASE_URL = process.env.ASAAS_SANDBOX === 'true'
  ? 'https://api-sandbox.asaas.com/v3'
  : 'https://api.asaas.com/v3'

function getApiKey(): string {
  const key = process.env.ASAAS_API_KEY
  if (!key) throw new Error('ASAAS_API_KEY não configurada')
  return key
}

async function asaasRequest<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      access_token: getApiKey(),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = (data as { errors?: Array<{ description: string }>; message?: string }).errors?.[0]?.description
      ?? (data as { message?: string }).message
      ?? JSON.stringify(data)
    throw new Error(`Asaas ${method} ${path} → ${res.status}: ${msg}`)
  }

  return data as T
}

export interface AsaasCustomer {
  id: string
  name: string
  email: string
  cpfCnpj: string
  mobilePhone?: string
}

export interface AsaasPayment {
  id: string
  status: string
  invoiceUrl: string
  bankSlipUrl?: string
  pixQrCodeUrl?: string
  value: number
  externalReference?: string
}

export async function findOrCreateCustomer(input: {
  name: string
  email: string
  cpfCnpj: string
  mobilePhone?: string
}): Promise<AsaasCustomer> {
  const cpfCnpj = input.cpfCnpj.replace(/\D/g, '')
  try {
    return await asaasRequest<AsaasCustomer>('POST', '/customers', { ...input, cpfCnpj })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('409') || msg.includes('já cadastrado')) {
      const list = await asaasRequest<{ data: AsaasCustomer[] }>('GET', `/customers?cpfCnpj=${cpfCnpj}`)
      if (list.data?.[0]) return list.data[0]
    }
    throw err
  }
}

export async function createPayment(input: {
  customer: string
  billingType: 'UNDEFINED' | 'BOLETO' | 'CREDIT_CARD' | 'PIX'
  value: number
  dueDate: string
  description?: string
  externalReference?: string
}): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>('POST', '/payments', {
    ...input,
    dueDateLimitDays: 3,
  })
}

export async function getPayment(id: string): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>('GET', `/payments/${id}`)
}

export async function cancelPayment(id: string): Promise<void> {
  await asaasRequest('DELETE', `/payments/${id}`)
}

export interface AsaasPaymentLink {
  id: string
  url: string
  name: string
  value: number
}

export async function createPaymentLink(input: {
  name: string
  description?: string
  value: number
  externalReference?: string
  redirectUrl?: string
  splits?: Array<{ walletId: string; percentualValue: number }>
}): Promise<AsaasPaymentLink> {
  return asaasRequest<AsaasPaymentLink>('POST', '/paymentLinks', {
    name: input.name,
    description: input.description,
    value: input.value,
    billingType: 'UNDEFINED',
    chargeType: 'RECURRENT',
    subscriptionCycle: 'MONTHLY',
    dueDateLimitDays: 10,
    maxInstallmentCount: 1,
    externalReference: input.externalReference,
    notificationEnabled: true,
    ...(input.splits && input.splits.length > 0 ? { splits: input.splits } : {}),
    ...(input.redirectUrl ? { callback: { successUrl: input.redirectUrl } } : {}),
  })
}

export interface AsaasCreditCard {
  holderName: string
  number: string
  expiryMonth: string
  expiryYear: string
  ccv: string
}

export interface AsaasCreditCardHolderInfo {
  name: string
  email: string
  cpfCnpj: string
  postalCode: string
  addressNumber: string
  phone: string
}

export interface AsaasSubscriptionResult {
  id: string
  status: string
  nextDueDate: string
  value: number
}

export async function createAsaasSubscription(input: {
  customer: string
  billingType: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  value: number
  nextDueDate: string
  cycle: 'MONTHLY'
  description: string
  externalReference?: string
  split?: Array<{ walletId: string; percentualValue: number }>
  creditCard?: AsaasCreditCard
  creditCardHolderInfo?: AsaasCreditCardHolderInfo
}): Promise<AsaasSubscriptionResult> {
  return asaasRequest<AsaasSubscriptionResult>('POST', '/subscriptions', input)
}

export async function cancelAsaasSubscription(id: string): Promise<void> {
  await asaasRequest('DELETE', `/subscriptions/${id}`)
}
