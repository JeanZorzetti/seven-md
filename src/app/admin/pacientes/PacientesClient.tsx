'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatCurrency, formatDate, maskCpf } from '@/lib/formatting'
import { PLAN_LABELS, PLAN_PRICES, PLAN_COLORS } from '@/lib/plans'
import { SUBSCRIPTION_STATUS_LABELS, SUBSCRIPTION_STATUS_CLASSES } from '@/lib/constants'
import TableSkeleton from '@/components/TableSkeleton'
import ActivatePlanModal from './ActivatePlanModal'

interface Subscription { plan: string; status: string; startDate: string }
interface Patient {
  id: string; name: string; email: string; phone: string | null; cpf: string | null; createdAt: string
  subscription: Subscription | null
  _count: { appointments: number }
}

const PLANS = ['', 'INDIVIDUAL', 'FAMILIAR', 'FAMILIAR_PRO', 'EMPRESARIAL']
const SUB_STATUSES = ['', 'ACTIVE', 'TRIAL', 'CANCELLED', 'EXPIRED']

export default function PacientesClient() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState('')
  const [subStatus, setSubStatus] = useState('')
  const [page, setPage] = useState(1)
  const [activateModal, setActivateModal] = useState<{ open: boolean; userId: string; userName: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ search, plan, subStatus, page: page.toString() })
    const res = await fetch(`/api/admin/patients?${params}`)
    if (res.ok) {
      const data = await res.json()
      setPatients(data.patients)
      setTotal(data.total)
      setPages(data.pages)
    }
    setLoading(false)
  }, [search, plan, subStatus, page])

  useEffect(() => { setPage(1) }, [search, plan, subStatus])
  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Buscar por nome, e-mail ou CPF..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none w-64" />
        <select value={plan} onChange={(e) => setPlan(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          <option value="">Todos os planos</option>
          {PLANS.filter(Boolean).map((p) => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
        </select>
        <select value={subStatus} onChange={(e) => setSubStatus(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          <option value="">Todos os status</option>
          {SUB_STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{SUBSCRIPTION_STATUS_LABELS[s]}</option>)}
        </select>
        <span className="ml-auto text-sm text-gray-400">{total} paciente(s)</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton cols={6} rows={6} />
        ) : patients.length === 0 ? (
          <div className="py-16 text-center text-gray-400">Nenhum paciente encontrado</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">Paciente</th>
                <th className="px-6 py-3 text-left font-medium">Telefone / CPF</th>
                <th className="px-6 py-3 text-center font-medium">Plano</th>
                <th className="px-6 py-3 text-center font-medium">Consultas</th>
                <th className="px-6 py-3 text-left font-medium">Cadastro</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.email}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs">
                    <p>{p.phone ?? '—'}</p>
                    <p className="font-mono">{maskCpf(p.cpf)}</p>
                  </td>
                  <td className="px-6 py-3 text-center">
                    {p.subscription ? (
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${PLAN_COLORS[p.subscription.plan]}`}>
                          {PLAN_LABELS[p.subscription.plan]}
                        </span>
                        <br />
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${SUBSCRIPTION_STATUS_CLASSES[p.subscription.status]}`}>
                          {SUBSCRIPTION_STATUS_LABELS[p.subscription.status]}
                        </span>
                        {PLAN_PRICES[p.subscription.plan] > 0 && (
                          <p className="text-xs text-gray-400">{formatCurrency(PLAN_PRICES[p.subscription.plan])}/mês</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sem plano</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${p._count.appointments > 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                      {p._count.appointments}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400 text-xs">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActivateModal({ open: true, userId: p.id, userName: p.name })}
                        className="text-xs text-[#af101a] hover:underline font-medium"
                      >
                        {p.subscription?.status === 'ACTIVE' ? 'Alterar plano' : 'Ativar plano'}
                      </button>
                      <Link href={`/admin/pacientes/${p.id}`} className="text-xs text-gray-500 hover:underline font-medium">
                        Ver perfil
                      </Link>
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

      {activateModal?.open && (
        <ActivatePlanModal
          userId={activateModal.userId}
          userName={activateModal.userName}
          onClose={() => setActivateModal(null)}
          onSaved={() => { setActivateModal(null); load() }}
        />
      )}
    </div>
  )
}
