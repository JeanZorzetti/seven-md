const BASE = 'https://melhorenvio.com.br/api/v2'
const FROM_CEP = process.env.MELHOR_ENVIO_FROM_CEP ?? '74160010'

export interface FreteOpcao {
  id: string
  nome: string
  preco: number
  prazo: number
  empresa: string
}

interface PackageItem {
  weightG: number
  heightCm: number
  widthCm: number
  lengthCm: number
  quantity: number
}

export async function calcularFrete(toCep: string, items: PackageItem[]): Promise<FreteOpcao[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN
  if (!token) throw new Error('MELHOR_ENVIO_TOKEN não configurado')

  // Agregar dimensões: maior caixa + peso total
  const weightTotal = items.reduce((sum, i) => sum + i.weightG * i.quantity, 0)
  const maxHeight = Math.max(...items.map((i) => i.heightCm))
  const maxWidth = Math.max(...items.map((i) => i.widthCm))
  const maxLength = Math.max(...items.map((i) => i.lengthCm))

  const body = {
    from: { postal_code: FROM_CEP.replace(/\D/g, '') },
    to: { postal_code: toCep.replace(/\D/g, '') },
    package: {
      height: Math.max(maxHeight, 2),
      width: Math.max(maxWidth, 11),
      length: Math.max(maxLength, 16),
      weight: Math.max(weightTotal / 1000, 0.1),
    },
    options: { receipt: false, own_hand: false },
    services: '',
  }

  const res = await fetch(`${BASE}/me/shipment/calculate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Seven-MD (contato@sevenmd.com.br)',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Melhor Envio error ${res.status}: ${err}`)
  }

  const data = await res.json()

  return (data as Array<Record<string, unknown>>)
    .filter((s) => !s.error && s.price != null)
    .map((s) => ({
      id: String(s.id),
      nome: String(s.name),
      empresa: String((s.company as Record<string, unknown>)?.name ?? ''),
      preco: parseFloat(String(s.price)),
      prazo: parseInt(String(s.delivery_time ?? s.custom_delivery_time ?? 7)),
    }))
    .sort((a, b) => a.preco - b.preco)
}
