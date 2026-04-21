import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { AddToCartButton } from '@/components/AddToCartButton'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return {}
  return {
    title: `${product.name} — Aluguel | Seven-MD`,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: { category: { select: { name: true, slug: true } } },
  })

  if (!product) notFound()

  const specs = product.specs as Record<string, string> | null

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, slug: { not: slug }, active: true },
    take: 3,
    include: { category: { select: { name: true, slug: true } } },
  })

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-xs text-gray-500">
            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
            <li>/</li>
            <li><Link href="/equipamentos" className="hover:text-gray-700">Equipamentos</Link></li>
            <li>/</li>
            <li><Link href={`/equipamentos?category=${product.category.slug}`} className="hover:text-gray-700">{product.category.name}</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                    <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <Link
              href={`/equipamentos?category=${product.category.slug}`}
              className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 hover:opacity-80 transition-opacity"
              style={{ background: '#fff2f0', color: '#af101a' }}
            >
              {product.category.name}
            </Link>

            <h1 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: 'var(--font-manrope)' }}>
              {product.name}
            </h1>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Valores de locação</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Por dia</p>
                  <p className="text-lg font-black" style={{ color: '#af101a', fontFamily: 'var(--font-manrope)' }}>
                    R$ {Number(product.dailyPrice).toFixed(2)}
                  </p>
                </div>
                {product.weeklyPrice && (
                  <div className="text-center border-x border-gray-200">
                    <p className="text-xs text-gray-400 mb-1">Por semana</p>
                    <p className="text-lg font-black" style={{ color: '#af101a', fontFamily: 'var(--font-manrope)' }}>
                      R$ {Number(product.weeklyPrice).toFixed(2)}
                    </p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Por mês</p>
                  <p className="text-lg font-black" style={{ color: '#af101a', fontFamily: 'var(--font-manrope)' }}>
                    R$ {Number(product.monthlyPrice).toFixed(2)}
                  </p>
                </div>
              </div>
              {product.depositAmount && Number(product.depositAmount) > 0 && (
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-200">
                  Caução: R$ {Number(product.depositAmount).toFixed(2)} (reembolsável na devolução)
                </p>
              )}
              <p className="text-xs text-gray-400">
                Período mínimo: {product.minRentalDays} dias
              </p>
            </div>

            {/* Stock indicator */}
            {product.stock <= 2 && product.stock > 0 && (
              <div className="flex items-center gap-2 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Apenas {product.stock} unidade{product.stock !== 1 ? 's' : ''} disponível{product.stock !== 1 ? 'is' : ''}
              </div>
            )}

            <AddToCartButton product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images[0] ?? '',
              dailyPrice: Number(product.dailyPrice),
              weeklyPrice: product.weeklyPrice ? Number(product.weeklyPrice) : null,
              monthlyPrice: Number(product.monthlyPrice),
              depositAmount: product.depositAmount ? Number(product.depositAmount) : 0,
              minRentalDays: product.minRentalDays,
            }} />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: '🚚', label: 'Entrega', sub: 'em domicílio' },
                { icon: '🔧', label: 'Suporte', sub: 'técnico 24h' },
                { icon: '🧼', label: 'Higienizado', sub: 'garantido' },
              ].map((b) => (
                <div key={b.label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <p className="text-xs font-semibold text-gray-700">{b.label}</p>
                  <p className="text-[10px] text-gray-400">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs */}
        {specs && Object.keys(specs).length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-black text-gray-900 mb-6" style={{ fontFamily: 'var(--font-manrope)' }}>Ficha Técnica</h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {Object.entries(specs).map(([key, value], i) => (
                <div key={key} className={`flex items-center px-6 py-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <span className="w-40 text-sm font-semibold text-gray-500 capitalize shrink-0">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-black text-gray-900 mb-6" style={{ fontFamily: 'var(--font-manrope)' }}>
              Outros equipamentos em {product.category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/equipamentos/${p.slug}`}
                  className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#af101a]/30 hover:shadow-md transition-all"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="80px" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      R$ {Number(p.monthlyPrice).toFixed(0)}<span className="text-gray-300">/mês</span>
                    </p>
                    <span className="text-xs font-semibold mt-1" style={{ color: '#af101a' }}>Ver detalhes →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
