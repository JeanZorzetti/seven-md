import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('category')
  const search = searchParams.get('q')

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(products)
}
