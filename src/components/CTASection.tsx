import Link from 'next/link'

const highlights = [
  { icon: '📦', label: 'Mais de 20 equipamentos' },
  { icon: '🏥', label: '5 categorias' },
  { icon: '⚡', label: 'Entrega expressa' },
  { icon: '♻️', label: 'Aluguel flexível' },
]

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div
        className="rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-12"
        style={{ background: 'linear-gradient(135deg, #1a0608 0%, #af101a 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, white, transparent)' }} />

        <div className="relative z-10 max-w-xl text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-200 mb-3">Comece agora</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-manrope)' }}>
            Equipamento hospitalar no conforto da sua casa.
          </h2>
          <p className="text-lg mb-8 text-red-100">
            Aluguel com entrega em domicílio, suporte técnico 24h e higienização garantida. Sem burocracia.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              href="/equipamentos"
              className="px-8 py-4 rounded-full font-bold text-base inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
              style={{ backgroundColor: '#ffffff', color: '#af101a' }}
            >
              Ver catálogo completo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contato"
              className="px-8 py-4 rounded-full font-bold text-base inline-flex items-center gap-2 hover:bg-white/20 transition-all border border-white/30 text-white"
            >
              Falar com especialista
            </Link>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 shrink-0">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="flex flex-col items-center justify-center p-4 rounded-2xl text-center backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span className="text-3xl mb-2">{h.icon}</span>
              <span className="text-xs font-semibold text-white/90">{h.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
