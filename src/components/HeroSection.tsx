import Link from 'next/link'
import Image from 'next/image'

const badges = [
  { icon: '🚚', label: 'Entrega em domicílio' },
  { icon: '🔧', label: 'Suporte técnico 24h' },
  { icon: '🧼', label: 'Equipamentos higienizados' },
]

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Left */}
      <div className="lg:col-span-6 space-y-7">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ backgroundColor: '#ffdad6', color: '#af101a', fontFamily: 'var(--font-inter)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Cuidado hospitalar em casa
        </div>

        <h1
          className="text-5xl lg:text-[3.4rem] leading-[1.1] font-black tracking-tight"
          style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}
        >
          Equipamentos hospitalares{' '}
          <span style={{ color: '#af101a' }}>para o cuidado em casa.</span>
        </h1>

        <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#5b403d', fontFamily: 'var(--font-inter)' }}>
          Alugue camas hospitalares, concentradores de oxigênio, cadeiras de rodas e muito mais. Entrega em domicílio, suporte técnico e higienização garantidos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/equipamentos"
            className="px-8 py-4 text-white rounded-full font-semibold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{ background: 'linear-gradient(to bottom right, #af101a, #d32f2f)', fontFamily: 'var(--font-inter)' }}
          >
            Ver equipamentos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/contato"
            className="px-8 py-4 rounded-full font-semibold text-base hover:opacity-90 transition-all flex items-center justify-center"
            style={{ backgroundColor: '#e7e1e1', color: '#af101a', fontFamily: 'var(--font-inter)' }}
          >
            Solicitar orçamento
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 pt-2">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-sm text-gray-600">
              <span>{b.icon}</span>
              <span style={{ fontFamily: 'var(--font-inter)' }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="lg:col-span-6 relative">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ backgroundColor: '#ffdad6' }} />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: '#ede7e6' }} />

        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl group" style={{ backgroundColor: '#f9f2f2' }}>
          <Image
            src="https://images.unsplash.com/photo-1519494026892-476f54d43a24?w=900&q=80"
            alt="Cama hospitalar para cuidados domiciliares"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />

          {/* Floating card */}
          <div
            className="absolute bottom-5 left-5 right-5 md:left-auto md:right-5 md:w-72 p-4 rounded-2xl shadow-xl backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,248,247,0.88)', border: '1px solid rgba(228,190,186,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#ffdad6' }}>
                <svg className="w-5 h-5" style={{ color: '#af101a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Pedido confirmado</p>
                <p className="text-xs text-gray-500">Entrega agendada para amanhã</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs text-gray-500">Cama hospitalar · 30 dias · <span className="font-semibold" style={{ color: '#af101a' }}>R$ 520</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
