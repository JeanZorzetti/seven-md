import Link from 'next/link'

const categories = [
  {
    name: 'Camas Hospitalares',
    desc: 'Camas articuladas, Fawler elétrica e colchões anti-escaras para cuidados domiciliares.',
    href: '/equipamentos/categoria/camas-hospitalares',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    ),
    color: '#af101a',
    bg: '#fff2f0',
  },
  {
    name: 'Oxigenoterapia',
    desc: 'Concentradores de oxigênio domiciliar de 5L e 10L para terapia contínua.',
    href: '/equipamentos/categoria/oxigenoterapia',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#005f7b',
    bg: '#f0f9ff',
  },
  {
    name: 'Mobilidade',
    desc: 'Cadeiras de rodas, andadores, muletas e bengalas para autonomia e reabilitação.',
    href: '/equipamentos/categoria/mobilidade',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: '#7c3aed',
    bg: '#faf5ff',
  },
  {
    name: 'Inalação e Aspiração',
    desc: 'Nebulizadores ultrassônicos e aspiradores de secreções elétricos portáteis.',
    href: '/equipamentos/categoria/inalacao-aspiracao',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: '#059669',
    bg: '#f0fdf4',
  },
  {
    name: 'Cuidados Diários',
    desc: 'Cadeiras de banho, comadres e equipamentos de higiene para o paciente acamado.',
    href: '/equipamentos/categoria/cuidados-diarios',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: '#d97706',
    bg: '#fffbeb',
  },
]

const steps = [
  { n: '1', title: 'Escolha o equipamento', desc: 'Navegue pelo catálogo, filtre por categoria e veja preços por dia, semana ou mês.' },
  { n: '2', title: 'Faça o pedido', desc: 'Informe o endereço, o período de locação e finalize com pagamento seguro via Pix, boleto ou cartão.' },
  { n: '3', title: 'Receba em casa', desc: 'Entregamos higienizado e montado. Suporte técnico disponível durante todo o período.' },
]

export default function HowItWorks() {
  return (
    <>
      {/* Categories grid */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f9f2f2' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#af101a' }}>Catálogo</p>
              <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>
                Equipamentos disponíveis para locação
              </h2>
            </div>
            <Link href="/equipamentos" className="text-sm font-semibold hover:underline shrink-0" style={{ color: '#af101a' }}>
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#af101a]/20 transition-all"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: cat.bg, color: cat.color }}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#af101a] transition-colors" style={{ fontFamily: 'var(--font-manrope)' }}>
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{cat.desc}</p>
                <span className="text-xs font-semibold mt-3" style={{ color: '#af101a' }}>Ver equipamentos →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#af101a' }}>Simples e rápido</p>
            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>
              Como funciona o aluguel?
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Do pedido à entrega em casa em poucas horas. Sem burocracia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative flex flex-col items-start p-7 bg-gray-50 rounded-2xl border border-gray-100">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg mb-5"
                  style={{ background: 'linear-gradient(to bottom right, #af101a, #d32f2f)', fontFamily: 'var(--font-manrope)' }}
                >
                  {s.n}
                </div>
                <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Telemedicine strip */}
      <section className="py-14 px-6" style={{ backgroundColor: '#f9f2f2' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #af101a, #d32f2f)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#af101a' }}>Também oferecemos</p>
            <h3 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: 'var(--font-manrope)' }}>
              Telemedicina Seven-MD
            </h3>
            <p className="text-sm text-gray-500">Consultas médicas online 24h com mais de 32 especialidades. Receitas digitais e atestados com validade legal.</p>
          </div>
          <Link
            href="/telemedicina"
            className="shrink-0 px-6 py-3 rounded-full font-bold text-sm text-white hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
          >
            Saiba mais
          </Link>
        </div>
      </section>
    </>
  )
}
