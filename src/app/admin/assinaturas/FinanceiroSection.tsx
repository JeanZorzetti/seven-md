'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, formatDate } from '@/lib/formatting'
import { PLAN_LABELS, PLAN_PRICES, PLAN_COLORS } from '@/lib/plans'

interface DashData {
  mrr: number
  activeSubscribers: number
  planBreakdown: Record<string, number>
  churnCount: number
  churnRate: number
  appointmentsThisMonth: number
  recentSubscriptions: { id: string; plan: string; startDate: string; user: { name: string; email: string } }[]
}

export default function FinanceiroSection() {
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/telemed-dashboard')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { setData(d); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-36 bg-gray-100 rounded-2xl" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    )
  }
  if (!data) return <p className="text-red-500 text-sm">Erro ao carregar dados</p>

  const planRows = Object.entries(PLAN_PRICES)
    .filter(([p]) => p !== 'EMPRESARIAL')
    .map(([plan, price]) => ({
      plan, label: PLAN_LABELS[plan], count: data.planBreakdown[plan] ?? 0, revenue: (data.planBreakdown[plan] ?? 0) * price, price,
    }))

  return (
    <div className="space-y-6">
      {/* MRR hero */}
      <div className="rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #af101a, #7b0b11)' }}>
        <p className="text-sm font-medium text-white/70 uppercase tracking-wide mb-2">Receita Mensal Recorrente (MRR)</p>
        <p className="text-5xl font-bold tracking-tight">{formatCurrency(data.mrr)}</p>
        <p className="text-sm text-white/60 mt-2">{data.activeSubscribers} assinante(s) ativo(s)</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Assinantes ativos', value: data.activeSubscribers, color: 'text-green-600' },
          { label: 'Churn 30d', value: data.churnCount, color: data.churnCount > 0 ? 'text-red-500' : 'text-green-600' },
          { label: 'Consultas este mês', value: data.appointmentsThisMonth, color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Breakdown table + churn + recent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Breakdown */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Distribuição por plano</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">Plano</th>
                <th className="px-6 py-3 text-left font-medium">Preço</th>
                <th className="px-6 py-3 text-center font-medium">Assinantes</th>
                <th className="px-6 py-3 text-right font-medium">Receita</th>
              </tr>
            </thead>
            <tbody>
              {planRows.map((row) => (
                <tr key={row.plan} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PLAN_COLORS[row.plan]}`}>{row.label}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatCurrency(row.price)}/mês</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700">{row.count}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800">{formatCurrency(row.revenue)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50/80">
                <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                <td className="px-6 py-4" />
                <td className="px-6 py-4 text-center font-bold text-gray-900">{data.activeSubscribers}</td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(data.mrr)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Churn */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Churn (30 dias)</h3>
          <div className="text-center py-4">
            <div className={`text-5xl font-bold mb-2 ${data.churnCount > 0 ? 'text-red-500' : 'text-green-600'}`}>
              {data.churnCount}
            </div>
            <p className="text-sm text-gray-500">cancelamento(s)</p>
            {data.churnCount === 0 && (
              <p className="text-xs text-green-600 mt-3 font-medium">Sem cancelamentos!</p>
            )}
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Taxa de churn</span>
              <span className="font-semibold text-gray-800">{data.churnRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent subscriptions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Assinaturas ativas recentes</h3>
        </div>
        {data.recentSubscriptions.length === 0 ? (
          <div className="py-10 text-center text-gray-400">Nenhuma assinatura ativa</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">Paciente</th>
                <th className="px-6 py-3 text-left font-medium">Plano</th>
                <th className="px-6 py-3 text-left font-medium">Início</th>
                <th className="px-6 py-3 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSubscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-800">{sub.user.name}</p>
                    <p className="text-xs text-gray-400">{sub.user.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PLAN_COLORS[sub.plan]}`}>
                      {PLAN_LABELS[sub.plan]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{formatDate(sub.startDate)}</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-800">{formatCurrency(PLAN_PRICES[sub.plan] ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
