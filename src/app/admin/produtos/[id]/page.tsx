import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProdutoForm from '../ProdutoForm'

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  return (
    <ProdutoForm
      productId={id}
      categories={categories}
      product={{
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        images: product.images,
        unitPrice: product.unitPrice ? String(product.unitPrice) : '',
        dailyPrice: String(product.dailyPrice),
        weeklyPrice: product.weeklyPrice ? String(product.weeklyPrice) : '',
        monthlyPrice: String(product.monthlyPrice),
        depositAmount: String(product.depositAmount ?? 0),
        weightG: product.weightG ? String(product.weightG) : '',
        heightCm: product.heightCm ? String(product.heightCm) : '',
        widthCm: product.widthCm ? String(product.widthCm) : '',
        lengthCm: product.lengthCm ? String(product.lengthCm) : '',
        minRentalDays: String(product.minRentalDays),
        stock: String(product.stock),
        specs: product.specs ? JSON.stringify(product.specs, null, 2) : '',
        active: product.active,
      }}
    />
  )
}
