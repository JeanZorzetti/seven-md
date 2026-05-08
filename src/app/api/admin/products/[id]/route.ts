import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  })
  if (!product) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const data: Record<string, unknown> = {}
  const fields = ['name', 'slug', 'description', 'categoryId', 'images', 'unitPrice', 'dailyPrice', 'weeklyPrice', 'monthlyPrice', 'depositAmount', 'weightG', 'heightCm', 'widthCm', 'lengthCm', 'minRentalDays', 'stock', 'active']
  for (const f of fields) {
    if (f in body) data[f] = body[f]
  }
  if ('specs' in body) {
    if (!body.specs || (typeof body.specs === 'string' && body.specs.trim() === '')) {
      data.specs = null
    } else {
      try {
        data.specs = typeof body.specs === 'string' ? JSON.parse(body.specs) : body.specs
      } catch {
        return NextResponse.json({ error: 'Ficha técnica com JSON inválido' }, { status: 400 })
      }
    }
  }

  try {
    const product = await prisma.product.update({ where: { id }, data })
    return NextResponse.json(product)
  } catch (err) {
    console.error('PATCH product error:', err)
    return NextResponse.json({ error: 'Slug já existe ou produto não encontrado' }, { status: 409 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Produto não encontrado ou possui pedidos vinculados' }, { status: 409 })
  }
}
