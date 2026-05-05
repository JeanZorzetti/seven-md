import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calcularFrete } from '@/lib/melhorenvio'

const DEFAULT_WEIGHT_G = 300
const DEFAULT_HEIGHT_CM = 5
const DEFAULT_WIDTH_CM = 10
const DEFAULT_LENGTH_CM = 15

export async function POST(req: NextRequest) {
  const { cep, itemIds } = await req.json() as { cep: string; itemIds: string[] }

  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
  }
  if (!itemIds?.length) {
    return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
  }

  const products = await prisma.product.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, weightG: true, heightCm: true, widthCm: true, lengthCm: true },
  })

  const packageItems = itemIds.map((id) => {
    const p = products.find((x) => x.id === id)
    return {
      weightG: p?.weightG ?? DEFAULT_WEIGHT_G,
      heightCm: p?.heightCm ?? DEFAULT_HEIGHT_CM,
      widthCm: p?.widthCm ?? DEFAULT_WIDTH_CM,
      lengthCm: p?.lengthCm ?? DEFAULT_LENGTH_CM,
      quantity: 1,
    }
  })

  try {
    const opcoes = await calcularFrete(cleanCep, packageItems)
    return NextResponse.json({ opcoes })
  } catch (err) {
    console.error('Erro Melhor Envio:', err)
    return NextResponse.json({ error: 'Não foi possível calcular o frete. Tente novamente.' }, { status: 502 })
  }
}
