import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  slug: string
  name: string
  categoryName: string
  categorySlug: string
  images: string[]
  monthlyPrice: number
  dailyPrice: number
  minRentalDays: number
}

export function ProductCard({ slug, name, categoryName, images, monthlyPrice, dailyPrice, minRentalDays }: ProductCardProps) {
  const img = images[0] ?? ''

  return (
    <Link
      href={`/equipamentos/${slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#af101a]/20"
    >
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full">
          {categoryName}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3 group-hover:text-[#af101a] transition-colors" style={{ fontFamily: 'var(--font-manrope)' }}>
          {name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="text-2xl font-black" style={{ color: '#af101a', fontFamily: 'var(--font-manrope)' }}>
              R$ {monthlyPrice.toFixed(0)}
            </span>
            <span className="text-sm text-gray-400">/mês</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            ou R$ {dailyPrice.toFixed(2)}/dia · mín. {minRentalDays} dias
          </p>

          <span className="block w-full text-center text-sm font-semibold text-white py-2.5 rounded-xl transition-all group-hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}>
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  )
}
