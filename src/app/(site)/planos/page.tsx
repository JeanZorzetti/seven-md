import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Planos | Seven-MD Telemedicina',
  description: 'Cuidado médico acessível, sem burocracia. Escolha o plano ideal para você e sua família.',
}

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    price: 'R$ 44',
    period: '/mês',
    subtitle: 'Ideal para uso pessoal.',
    features: ['Clínico geral','Mais de 30 especialidades','Receitas e atestados digitais','Atendimento rápido'],
    ctaLabel: 'Contratar agora',
    highlighted: false,
  },
  {
    id: 'familiar',
    name: 'Familiar',
    price: 'R$ 162',
    period: '/mês',
    subtitle: 'Saúde para toda a família.',
    features: ['Todos os benefícios do Individual','Até 4 membros','Adultos e crianças','Economia vs consultas particulares'],
    ctaLabel: 'Contratar agora',
    highlighted: false,
  },
  {
    id: 'familiar-pro',
    name: 'Familiar Pro',
    price: 'R$ 228',
    period: '/mês',
    subtitle: 'Mais pessoas, mais tranquilidade.',
    features: ['Tudo do Familiar','Até 6 membros','Melhor custo por pessoa','Suporte sempre disponível'],
    ctaLabel: 'Contratar agora',
    highlighted: true,
    badge: 'Mais popular',
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    price: 'Sob consulta',
    period: '',
    subtitle: 'Soluções para empresas.',
    features: ['Reduzir absenteísmo','Aumentar produtividade','Benefício de alto valor','Planos personalizados'],
    ctaLabel: 'Solicitar proposta',
    highlighted: false,
  },
]

export default function PlanosPage() {
  return (
    <>
      <section className="text-white py-20 lg:py-28" style={{ backgroundColor: '#af101a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-manrope)' }}>
            Planos de telemedicina
          </h1>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">
            Cuidado médico acessível, sem burocracia e com atendimento rápido. Sem carência, sem filas.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col border-2 shadow-sm ${
                  plan.highlighted
                    ? 'border-[#af101a] shadow-lg'
                    : 'border-gray-100'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: '#af101a' }}>
                    {plan.badge}
                  </span>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-manrope)' }}>{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.subtitle}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-black" style={{ color: '#af101a', fontFamily: 'var(--font-manrope)' }}>{plan.price}</span>
                  {plan.period && <span className="text-sm text-gray-400">{plan.period}</span>}
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? 'text-white hover:opacity-90'
                      : 'text-[#af101a] border-2 border-[#af101a] hover:bg-red-50'
                  }`}
                  style={plan.highlighted ? { background: 'linear-gradient(to right, #af101a, #d32f2f)' } : {}}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
