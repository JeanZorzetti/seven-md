'use client'

import { useState } from 'react'
import Link from 'next/link'

const WHATSAPP_NUMBER = '5547991583876'

type PlanKey = 'individual' | 'familiar' | 'familiarPro'

const plans: Array<{
  key: PlanKey
  name: string
  price: number
  priceDisplay: string
  pricePixDisplay: string
  installment: string
  vidas: string | null
  badge: string | null
  features: string[]
}> = [
  {
    key: 'individual',
    name: 'Individual',
    price: 44,
    priceDisplay: 'R$44/mês',
    pricePixDisplay: 'R$39,60 no PIX',
    installment: '12x de R$3,67',
    vidas: null,
    badge: null,
    features: [
      'Clínico geral ilimitado',
      '+30 especialidades',
      'Receitas digitais',
      'Atestados digitais',
      'Atendimento sem carência',
      'Agendamento online 24h',
    ],
  },
  {
    key: 'familiar',
    name: 'Familiar',
    price: 162,
    priceDisplay: 'R$162/mês',
    pricePixDisplay: 'R$145,80 no PIX',
    installment: '12x de R$13,50',
    vidas: '4 vidas',
    badge: 'Mais popular',
    features: [
      'Clínico geral ilimitado',
      '+30 especialidades',
      'Receitas digitais',
      'Atestados digitais',
      'Atendimento sem carência',
      'Agendamento online 24h',
      'Cobertura para 4 pessoas',
    ],
  },
  {
    key: 'familiarPro',
    name: 'Familiar Pro',
    price: 228,
    priceDisplay: 'R$228/mês',
    pricePixDisplay: 'R$205,20 no PIX',
    installment: '12x de R$19,00',
    vidas: '6 vidas',
    badge: null,
    features: [
      'Clínico geral ilimitado',
      '+30 especialidades',
      'Receitas digitais',
      'Atestados digitais',
      'Atendimento sem carência',
      'Agendamento online 24h',
      'Cobertura para 6 pessoas',
      'Prioridade no atendimento',
    ],
  },
]

type SelectedPlan = {
  name: string
  priceDisplay: string
}

export default function AssinarPage() {
  const [modalPlan, setModalPlan] = useState<SelectedPlan | null>(null)

  const openModal = (plan: { name: string; priceDisplay: string }) => {
    setModalPlan({ name: plan.name, priceDisplay: plan.priceDisplay })
  }

  const closeModal = () => setModalPlan(null)

  const buildWhatsAppUrl = (plan: SelectedPlan) => {
    const msg = encodeURIComponent(
      `Olá! Quero assinar o ${plan.name} da Seven-MD por ${plan.priceDisplay}. Pode me ajudar?`
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#af101a]">Escolha seu plano</h1>
        <p className="text-lg text-[#af101a] font-medium">
          Sem carência. Consulte hoje mesmo.
        </p>
      </div>

      {/* Anchoring banner */}
      <div className="rounded-2xl bg-[#af101a] text-white p-6 text-center space-y-2">
        <p className="text-lg font-bold">Por que pagar mais e esperar mais?</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm mt-2">
          <div className="flex items-center gap-2 text-red-300">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Plano tradicional: R$400–800/mês + carência de até 180 dias</span>
          </div>
          <div className="hidden sm:block text-white/40">|</div>
          <div className="flex items-center gap-2 text-green-300">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Seven-MD: a partir de R$44/mês, sem carência</span>
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`relative rounded-2xl border-2 bg-white p-6 flex flex-col ${
              plan.key === 'familiar'
                ? 'border-[#af101a] shadow-lg shadow-[#af101a]/20'
                : 'border-gray-200'
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#af101a] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Plan name + vidas */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[#af101a]">{plan.name}</h2>
              {plan.vidas && (
                <p className="text-sm text-[#af101a] font-medium">{plan.vidas}</p>
              )}
            </div>

            {/* Price */}
            <div className="mb-1">
              <span className="text-4xl font-extrabold text-[#af101a]">
                {plan.priceDisplay.split('/')[0]}
              </span>
              <span className="text-gray-500 text-sm">/mês</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">ou {plan.installment}</p>

            {/* PIX badge */}
            <div className="flex items-center gap-1.5 mb-5">
              <span className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                PIX: {plan.pricePixDisplay}
              </span>
              <span className="text-xs text-green-600 font-medium">-10%</span>
            </div>

            {/* Features */}
            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-[#af101a] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <button
              onClick={() => openModal(plan)}
              className={`w-full rounded-xl py-3 text-sm font-bold transition-colors ${
                plan.key === 'familiar'
                  ? 'bg-[#af101a] text-white hover:bg-[#af101a]'
                  : 'bg-[#fff2f0] text-[#af101a] hover:bg-[#ffdad6]'
              }`}
            >
              Assinar agora
            </button>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#fff2f0] border-b border-gray-200">
          <h2 className="text-lg font-bold text-[#af101a]">Seven-MD vs. Plano Tradicional</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Critério</th>
                <th className="px-6 py-3 text-center text-[#af101a] font-bold">Seven-MD</th>
                <th className="px-6 py-3 text-center text-gray-400 font-medium">Plano Tradicional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                {
                  label: 'Carência',
                  eg: 'Zero',
                  trad: '30–180 dias',
                  egOk: true,
                  tradOk: false,
                },
                {
                  label: 'Preço médio',
                  eg: 'A partir de R$44/mês',
                  trad: 'R$400–800/mês',
                  egOk: true,
                  tradOk: false,
                },
                {
                  label: 'Especialistas',
                  eg: '+30 disponíveis',
                  trad: 'Rede limitada',
                  egOk: true,
                  tradOk: false,
                },
                {
                  label: 'Agendamento',
                  eg: 'Online 24h',
                  trad: 'Fila de espera',
                  egOk: true,
                  tradOk: false,
                },
                {
                  label: 'Atestados digitais',
                  eg: 'Incluído',
                  trad: 'Separado',
                  egOk: true,
                  tradOk: false,
                },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-700">{row.label}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-700 font-medium">{row.eg}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-red-600">{row.trad}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="text-center space-y-3">
        <p className="text-gray-500 text-sm">Prefere falar antes de assinar?</p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os planos da Seven-MD.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Falar no WhatsApp
        </a>
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-[#af101a]">🏛</span>
          <span>Regulamentado pelo CFM</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-[#af101a]">🔒</span>
          <span>Dados protegidos pela LGPD</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-[#af101a]">✓</span>
          <span>Cancele quando quiser</span>
        </div>
      </div>

      {/* WhatsApp Checkout Modal */}
      {modalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#af101a]">Finalize sua assinatura pelo WhatsApp</h2>
            </div>

            <div className="bg-[#fff2f0] rounded-xl px-4 py-3 text-center">
              <p className="text-sm text-gray-600">Você escolheu:</p>
              <p className="text-lg font-bold text-[#af101a]">
                {modalPlan.name} — {modalPlan.priceDisplay}
              </p>
            </div>

            <p className="text-sm text-gray-600 text-center leading-relaxed">
              Nosso time ativará seu plano em minutos via WhatsApp.
              Aceitamos <strong>PIX</strong> (10% de desconto) e <strong>cartão de crédito</strong>.
            </p>

            <div className="space-y-3">
              <a
                href={buildWhatsAppUrl(modalPlan)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white rounded-xl py-3 text-sm font-bold hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.761-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar no WhatsApp
              </a>
              <button
                onClick={closeModal}
                className="w-full rounded-xl py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
