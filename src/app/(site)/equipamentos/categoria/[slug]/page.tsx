import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return {}
  return {
    title: `${category.name} — Locação | Seven-MD`,
    description: category.description ?? `Equipamentos para ${category.name} disponíveis para locação domiciliar.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) notFound()

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, active: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <>
      <section className="py-14 px-4" style={{ background: 'linear-gradient(135deg, #1a0608 0%, #af101a 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-red-200 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/equipamentos" className="hover:text-white">Equipamentos</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
            {category.name}
          </h1>
          {category.description && <p className="text-red-100 max-w-2xl">{category.description}</p>}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Nenhum equipamento disponível nesta categoria no momento.</p>
            <Link href="/equipamentos" className="mt-4 inline-block text-sm font-semibold hover:underline" style={{ color: '#af101a' }}>
              Ver todos os equipamentos
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{products.length} produto{products.length !== 1 ? 's' : ''} disponíveis</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  name={product.name}
                  categoryName={product.category.name}
                  categorySlug={product.category.slug}
                  images={product.images}
                  monthlyPrice={Number(product.monthlyPrice)}
                  dailyPrice={Number(product.dailyPrice)}
                  minRentalDays={product.minRentalDays}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
