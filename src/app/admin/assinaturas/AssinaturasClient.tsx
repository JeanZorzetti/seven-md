'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/formatting'
import { PLAN_LABELS, PLAN_PRICES, PLAN_COLORS } from '@/lib/plans'
import { SUBSCRIPTION_STATUS_LABELS, SUBSCRIPTION_STATUS_CLASSES } from '@/lib/constants'
import TableSkeleton from '@/components/TableSkeleton'
import { toast } from '@/components/Toast'

interface Subscription {
  id: string; plan: string; status: string; startDate: string; endDate: string | null; createdAt: string
  user: { id: string; name: string; email: string }
}

export default function AssinaturasClient() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ plan, status, page: page.toString() })
    const res = await fetch(`/api/admin/subscriptions?${params}`)
    if (res.ok) {
      const data = await res.json()
      setSubscriptions(data.subscriptions)
      setTotal(data.total)
      setPages(data.pages)
    }
    setLoading(false)
  }, [plan, status, page])

  useEffect(() => { setPage(1) }, [plan, status])
  useEffect(() => { load() }, [load])

  const handleCancel = async (sub: Subscription) => {
    if (!confirm(`Cancelar assinatura de ${sub.user.name}?`)) return
    const res = await fetch(`/api/admin/subscriptions/${sub.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    })
    if (res.ok) {
      toast(`Assinatura de ${sub.user.name} cancelada`)
      load()
    } else {
      toast('Erro ao cancelar assinatura', 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={plan} onChange={(e) => setPlan(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          <option value="">Todos os planos</option>
          {['INDIVIDUAL', 'FAMILIAR', 'FAMILIAR_PRO', 'EMPRESARIAL'].map((p) => (
            <option key={p} value={p}>{PLAN_LABELS[p]}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          <option value="">Todos os status</option>
          {['ACTIVE', 'TRIAL', 'CANCELLED', 'EXPIRED'].map((s) => (
            <option key={s} value={s}>{SUBSCRIPTION_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <span className="ml-auto text-sm text-gray-400">{total} assinatura(s)</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton cols={6} rows={6} />
        ) : subscriptions.length === 0 ? (
          <div className="py-16 text-center text-gray-400">Nenhuma assinatura encontrada</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">Paciente</th>
                <th className="px-6 py-3 text-left font-medium">Plano</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Valor</th>
                <th className="px-6 py-3 text-left font-medium">Início</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-800">{sub.user.name}</p>
                    <p className="text-xs text-gray-400">{sub.user.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PLAN_COLORS[sub.plan]}`}>
                      {PLAN_LABELS[sub.plan]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${SUBSCRIPTION_STATUS_CLASSES[sub.status]}`}>
                      {SUBSCRIPTION_STATUS_LABELS[sub.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-800">
                    {PLAN_PRICES[sub.plan] > 0 ? `${formatCurrency(PLAN_PRICES[sub.plan])}/mês` : 'Sob consulta'}
                  </td>
                  <td className="px-6 py-3 text-gray-400 text-xs">{formatDate(sub.startDate)}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/pacientes/${sub.user.id}`} className="text-xs text-[#af101a] hover:underline font-medium">Ver paciente</Link>
                      {sub.status === 'ACTIVE' && (
                        <button onClick={() => handleCancel(sub)} className="text-xs text-red-400 hover:text-red-600 hover:underline font-medium">Cancelar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40">← Anterior</button>
          <span className="text-sm text-gray-500">Página {page} de {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40">Próxima →</button>
        </div>
      )}
    </div>
  )
}
