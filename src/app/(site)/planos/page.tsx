'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLAN_PRICES } from '@/lib/plans'

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    price: 'R$ 44',
    period: '/mês',
    subtitle: 'Ideal para uso pessoal.',
    features: ['Clínico geral', 'Mais de 30 especialidades', 'Receitas e atestados digitais', 'Atendimento rápido'],
    ctaLabel: 'Contratar agora',
    highlighted: false,
  },
  {
    id: 'familiar',
    name: 'Familiar',
    price: 'R$ 162',
    period: '/mês',
    subtitle: 'Saúde para toda a família.',
    features: ['Todos os benefícios do Individual', 'Até 4 membros', 'Adultos e crianças', 'Economia vs consultas particulares'],
    ctaLabel: 'Contratar agora',
    highlighted: false,
  },
  {
    id: 'familiar-pro',
    name: 'Familiar Pro',
    price: 'R$ 228',
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

const PLAN_NAME_MAP: Record<string, string> = {
  individual: 'INDIVIDUAL',
  familiar: 'FAMILIAR',
  'familiar-pro': 'FAMILIAR_PRO',
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
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

interface CheckoutForm {
  name: string; email: string; cpf: string; phone: string
  postalCode: string; addressNumber: string
  cardHolder: string; cardNumber: string; expMonth: string; expYear: string; ccv: string
  paymentMethod: 'CREDIT_CARD' | 'PIX'
}

export default function PlanosPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<CheckoutForm>({
    name: '', email: '', cpf: '', phone: '',
    postalCode: '', addressNumber: '',
    cardHolder: '', cardNumber: '', expMonth: '', expYear: '', ccv: '',
    paymentMethod: 'CREDIT_CARD',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const plan = plans.find((p) => p.id === selectedPlan)
  const planKey = selectedPlan ? PLAN_NAME_MAP[selectedPlan] : null
  const planPrice = planKey ? PLAN_PRICES[planKey] : 0

  const set = (field: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const body: Record<string, unknown> = {
        plan: selectedPlan,
        name: form.name,
        email: form.email,
        cpf: form.cpf,
        phone: form.phone,
        postalCode: form.postalCode,
        addressNumber: form.addressNumber,
      }
      if (form.paymentMethod === 'CREDIT_CARD') {
        body.creditCard = {
          holderName: form.cardHolder,
          number: form.cardNumber.replace(/\s/g, ''),
          expiryMonth: form.expMonth,
          expiryYear: form.expYear,
          ccv: form.ccv,
        }
      }
      const res = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao processar pagamento')
        return
      }
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedPlan(null)
    setStep(1)
    setError('')
    setSuccess(false)
    setForm({ name: '', email: '', cpf: '', phone: '', postalCode: '', addressNumber: '', cardHolder: '', cardNumber: '', expMonth: '', expYear: '', ccv: '', paymentMethod: 'CREDIT_CARD' })
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
                    onClick={() => { setSelectedPlan(p.id); setStep(1) }}
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

      {/* Checkout Modal */}
      {selectedPlan && plan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Contratar {plan.name}</h2>
                <p className="text-sm text-gray-500">{plan.price}{plan.period}</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {success ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Assinatura criada!</h3>
                <p className="text-gray-500 text-sm">
                  {form.paymentMethod === 'CREDIT_CARD'
                    ? 'Seu pagamento está sendo processado. Você receberá uma confirmação por email.'
                    : 'Sua assinatura foi criada. Efetue o pagamento via PIX para ativar.'}
                </p>
                <Link
                  href="/plataforma"
                  className="block mt-4 py-3 rounded-xl text-sm font-semibold text-white text-center hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
                  onClick={closeModal}
                >
                  Ir para a plataforma →
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        s < step ? 'bg-green-500 text-white' :
                        s === step ? 'text-white' : 'bg-gray-100 text-gray-400'
                      }`} style={s === step ? { backgroundColor: '#af101a' } : {}}>
                        {s < step ? '✓' : s}
                      </div>
                      {s < 3 && <div className={`flex-1 h-0.5 ${s < step ? 'bg-green-500' : 'bg-gray-100'}`} style={{ width: '2rem' }} />}
                    </div>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">
                    {step === 1 ? 'Seus dados' : step === 2 ? 'Pagamento' : 'Confirmar'}
                  </span>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nome completo *</label>
                      <input value={form.name} onChange={set('name')} placeholder="João da Silva" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="joao@email.com" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">CPF *</label>
                        <input value={form.cpf} onChange={(e) => setForm((p) => ({ ...p, cpf: formatCPF(e.target.value) }))} placeholder="000.000.000-00" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Telefone</label>
                        <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: formatPhone(e.target.value) }))} placeholder="(11) 99999-9999" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none" />
                      </div>
                    </div>
                    <button
                      disabled={!form.name || !form.email || !form.cpf}
                      onClick={() => setStep(2)}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-all"
                      style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      {(['CREDIT_CARD', 'PIX'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setForm((p) => ({ ...p, paymentMethod: method }))}
                          className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                            form.paymentMethod === method ? 'border-[#af101a] text-[#af101a] bg-red-50' : 'border-gray-200 text-gray-500'
                          }`}
                        >
                          {method === 'CREDIT_CARD' ? '💳 Cartão' : '📱 PIX'}
                        </button>
                      ))}
                    </div>

                    {form.paymentMethod === 'CREDIT_CARD' && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Nome no cartão *</label>
                          <input value={form.cardHolder} onChange={set('cardHolder')} placeholder="JOAO DA SILVA" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none uppercase" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Número do cartão *</label>
                          <input value={form.cardNumber} onChange={(e) => setForm((p) => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))} placeholder="0000 0000 0000 0000" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none font-mono" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Mês</label>
                            <select value={form.expMonth} onChange={set('expMonth')} className="w-full rounded-lg border border-gray-200 px-2 py-2.5 text-sm focus:border-[#af101a] focus:outline-none">
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Ano</label>
                            <select value={form.expYear} onChange={set('expYear')} className="w-full rounded-lg border border-gray-200 px-2 py-2.5 text-sm focus:border-[#af101a] focus:outline-none">
                              <option value="">AAAA</option>
                              {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i)).map((y) => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                            <input value={form.ccv} onChange={(e) => setForm((p) => ({ ...p, ccv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="123" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none font-mono" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">CEP</label>
                            <input value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value.replace(/\D/g, '').slice(0, 8) }))} placeholder="00000000" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Número</label>
                            <input value={form.addressNumber} onChange={set('addressNumber')} placeholder="123" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#af101a] focus:outline-none" />
                          </div>
                        </div>
                      </>
                    )}

                    {form.paymentMethod === 'PIX' && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                        Um QR Code PIX será gerado após a confirmação. Sua assinatura será ativada assim que o pagamento for identificado.
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">
                        ← Voltar
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={form.paymentMethod === 'CREDIT_CARD' && (!form.cardHolder || !form.cardNumber || !form.expMonth || !form.expYear || !form.ccv)}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-all"
                        style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
                      >
                        Revisar →
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Plano</span>
                        <span className="font-semibold text-gray-800">{plan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Valor</span>
                        <span className="font-semibold text-gray-800">R$ {planPrice}/mês</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pagamento</span>
                        <span className="font-semibold text-gray-800">{form.paymentMethod === 'CREDIT_CARD' ? 'Cartão de crédito' : 'PIX'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email</span>
                        <span className="font-semibold text-gray-800 truncate max-w-[180px]">{form.email}</span>
                      </div>
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                        <span className="font-bold text-gray-800">Total mensal</span>
                        <span className="font-bold" style={{ color: '#af101a' }}>R$ {planPrice},00</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center">
                      Ao confirmar, você concorda com nossos termos de uso. Cancele quando quiser.
                    </p>

                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">
                        ← Voltar
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90 transition-all"
                        style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
                      >
                        {loading ? 'Processando...' : 'Confirmar assinatura'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
