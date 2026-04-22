'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLAN_PRICES } from '@/lib/plans'

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    price: 'R$ 47',
    period: '/mês',
    subtitle: 'Ideal para uso pessoal.',
    features: ['Clínico geral', 'Mais de 30 especialidades', 'Receitas e atestados digitais', 'Atendimento rápido'],
    ctaLabel: 'Contratar agora',
    highlighted: false,
  },
  {
    id: 'familiar',
    name: 'Familiar',
    price: 'R$ 147',
    period: '/mês',
    subtitle: 'Saúde para toda a família.',
    features: ['Todos os benefícios do Individual', 'Até 4 membros', 'Adultos e crianças', 'Economia vs consultas particulares'],
    ctaLabel: 'Contratar agora',
    highlighted: false,
  },
  {
    id: 'familiar-pro',
    name: 'Familiar Pro',
    price: 'R$ 237',
    period: '/mês',
    subtitle: 'Mais pessoas, mais tranquilidade.',
    features: ['Tudo do Familiar', 'Até 6 membros', 'Melhor custo por pessoa', 'Suporte sempre disponível'],
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
    features: ['Reduzir absenteísmo', 'Aumentar produtividade', 'Benefício de alto valor', 'Planos personalizados'],
    ctaLabel: 'Solicitar proposta',
    highlighted: false,
    isEnterprise: true,
  },
]

function formatCPF(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatPhone(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export default function PlanosPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', cpf: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const plan = plans.find((p) => p.id === selectedPlan)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.cpf) {
      setError('Nome, email e CPF são obrigatórios')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao processar. Tente novamente.')
        return
      }
      window.location.href = data.redirectUrl
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedPlan(null)
    setError('')
    setForm({ name: '', email: '', cpf: '', phone: '' })
  }

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
            {plans.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-2xl p-7 flex flex-col border-2 shadow-sm ${
                  p.highlighted ? 'border-[#af101a] shadow-lg' : 'border-gray-100'
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: '#af101a' }}>
                    {p.badge}
                  </span>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-manrope)' }}>{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.subtitle}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-black" style={{ color: '#af101a', fontFamily: 'var(--font-manrope)' }}>{p.price}</span>
                  {p.period && <span className="text-sm text-gray-400">{p.period}</span>}
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {p.isEnterprise ? (
                  <Link
                    href="/contato"
                    className="block text-center py-3 rounded-xl text-sm font-semibold text-[#af101a] border-2 border-[#af101a] hover:bg-red-50 transition-all"
                  >
                    {p.ctaLabel}
                  </Link>
                ) : (
                  <button
                    onClick={() => { setSelectedPlan(p.id); setError('') }}
                    className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                      p.highlighted
                        ? 'text-white hover:opacity-90'
                        : 'text-[#af101a] border-2 border-[#af101a] hover:bg-red-50'
                    }`}
                    style={p.highlighted ? { background: 'linear-gradient(to right, #af101a, #d32f2f)' } : {}}
                  >
                    {p.ctaLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout modal */}
      {selectedPlan && plan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Contratar plano {plan.name}</h2>
                <p className="text-sm text-gray-500">{plan.price}{plan.period} · cobrança recorrente mensal</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">Preencha seus dados para prosseguir ao pagamento.</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome completo *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="João da Silva"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="joao@email.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">CPF *</label>
                  <input
                    value={form.cpf}
                    onChange={(e) => setForm((p) => ({ ...p, cpf: formatCPF(e.target.value) }))}
                    placeholder="000.000.000-00"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: formatPhone(e.target.value) }))}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Você será redirecionado para a página de pagamento seguro do Asaas. Aceita PIX, cartão e boleto.
              </p>

              <button
                onClick={handleSubmit}
                disabled={loading || !form.name || !form.email || !form.cpf}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
              >
                {loading ? 'Processando...' : 'Ir para pagamento →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
