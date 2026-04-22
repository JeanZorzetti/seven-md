import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const categoryId = searchParams.get('categoryId') ?? ''
  const active = searchParams.get('active')
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const limit = 20

  const where = {
    ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(active === 'true' ? { active: true } : active === 'false' ? { active: false } : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const body = await req.json()
  const { name, slug, description, categoryId, images, dailyPrice, weeklyPrice, monthlyPrice, depositAmount, minRentalDays, stock, specs } = body

  if (!name || !slug || !categoryId || !monthlyPrice) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description ?? '',
        categoryId,
        images: images ?? [],
        dailyPrice: dailyPrice ?? 0,
        weeklyPrice: weeklyPrice ?? null,
        monthlyPrice,
        depositAmount: depositAmount ?? 0,
        minRentalDays: minRentalDays ?? 7,
        stock: stock ?? 1,
        specs: specs ? JSON.parse(specs) : null,
        active: true,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Slug já existe' }, { status: 409 })
  }
}
