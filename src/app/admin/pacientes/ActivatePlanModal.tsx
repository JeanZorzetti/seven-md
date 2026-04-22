'use client'

import { useState } from 'react'
import { toast } from '@/components/Toast'
import { PLAN_LABELS, PLAN_PRICES } from '@/lib/plans'
import { formatCurrency } from '@/lib/formatting'

const PLANS = ['INDIVIDUAL', 'FAMILIAR', 'FAMILIAR_PRO', 'EMPRESARIAL'] as const

export default function ActivatePlanModal({
  userId,
  userName,
  onClose,
  onSaved,
}: {
  userId: string
  userName: string
  onClose: () => void
  onSaved: () => void
}) {
  const [plan, setPlan] = useState<string>('INDIVIDUAL')
  const [months, setMonths] = useState('1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan, months: Number(months) }),
    })
    if (res.ok) {
      toast(`Plano ${PLAN_LABELS[plan]} ativado para ${userName}`)
      onSaved()
    } else {
      const data = await res.json()
      toast(data.error ?? 'Erro ao ativar plano', 'error')
      setError(data.error ?? 'Erro ao ativar plano')
    }
    setLoading(false)
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Ativar plano</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Paciente: <span className="font-semibold text-gray-800">{userName}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputCls}>
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {PLAN_LABELS[p]}{PLAN_PRICES[p] > 0 ? ` — ${formatCurrency(PLAN_PRICES[p])}/mês` : ' — sob consulta'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duração (meses)</label>
            <select value={months} onChange={(e) => setMonths(e.target.value)} className={inputCls}>
              {[1, 3, 6, 12].map((m) => <option key={m} value={m}>{m} {m === 1 ? 'mês' : 'meses'}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90"
              style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
            >
              {loading ? 'Ativando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
