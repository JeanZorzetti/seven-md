import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'

interface SearchParams {
  category?: string
  q?: string
}

async function getCatalogData(searchParams: SearchParams) {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(searchParams.category ? { category: { slug: searchParams.category } } : {}),
        ...(searchParams.q ? { name: { contains: searchParams.q, mode: 'insensitive' } } : {}),
      },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { name: 'asc' },
    }),
  ])
  return { categories, products }
}

export default async function EquipamentosPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { categories, products } = await getCatalogData(params)
  const activeCategory = params.category ?? ''
  const searchQuery = params.q ?? ''

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #1a0608 0%, #af101a 100%)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-200 mb-3">Locação de Equipamentos</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-manrope)' }}>
            Equipamentos Hospitalares
          </h1>
          <p className="text-lg text-red-100 max-w-2xl mx-auto mb-8">
            Alugue com praticidade e segurança. Entrega em domicílio, suporte técnico e higienização garantidos.
          </p>
          <form method="get" action="/equipamentos" className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Buscar equipamento..."
                className="w-full rounded-full px-6 py-4 pr-14 text-sm text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: '#af101a' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Categorias</h2>
            <nav className="space-y-1">
              <Link
                href="/equipamentos"
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${!activeCategory ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                style={!activeCategory ? { background: 'linear-gradient(to right, #af101a, #d32f2f)' } : {}}
              >
                <span>Todos</span>
                <span className={`text-xs ${!activeCategory ? 'text-red-200' : 'text-gray-400'}`}>{products.length}</span>
              </Link>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.slug
                return (
                  <Link
                    key={cat.id}
                    href={`/equipamentos?category=${cat.slug}`}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    style={isActive ? { background: 'linear-gradient(to right, #af101a, #d32f2f)' } : {}}
                  >
                    <span>{cat.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8 p-4 rounded-2xl bg-red-50 border border-red-100">
              <p className="text-sm font-bold text-gray-900 mb-1">Precisa de ajuda?</p>
              <p className="text-xs text-gray-500 mb-3">Nossa equipe orienta você na escolha do equipamento ideal.</p>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-semibold text-white py-2 rounded-xl"
                style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
              >
                Falar no WhatsApp
              </a>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile category pills */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
              <Link
                href="/equipamentos"
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory ? 'text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
                style={!activeCategory ? { background: 'linear-gradient(to right, #af101a, #d32f2f)' } : {}}
              >
                Todos
              </Link>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.slug
                return (
                  <Link
                    key={cat.id}
                    href={`/equipamentos?category=${cat.slug}`}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
                    style={isActive ? { background: 'linear-gradient(to right, #af101a, #d32f2f)' } : {}}
                  >
                    {cat.name}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {products.length === 0 ? 'Nenhum produto encontrado' : `${products.length} produto${products.length !== 1 ? 's' : ''}`}
                {searchQuery && <span className="ml-1">para &ldquo;{searchQuery}&rdquo;</span>}
              </p>
              {(activeCategory || searchQuery) && (
                <Link href="/equipamentos" className="text-xs font-semibold hover:underline" style={{ color: '#af101a' }}>
                  Limpar filtros
                </Link>
              )}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Nenhum equipamento encontrado.</p>
                <Link href="/equipamentos" className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: '#af101a' }}>
                  Ver todos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
            )}
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #1a0608 0%, #af101a 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-manrope)' }}>
            Não encontrou o que procura?
          </h2>
          <p className="text-red-100 mb-6">Entre em contato e encontramos a solução ideal para o cuidado em casa.</p>
          <Link
            href="/contato"
            className="inline-block bg-white font-bold text-sm px-8 py-4 rounded-full hover:bg-red-50 transition-colors"
            style={{ color: '#af101a' }}
          >
            Solicitar equipamento específico
          </Link>
        </div>
      </section>
    </>
  )
}
