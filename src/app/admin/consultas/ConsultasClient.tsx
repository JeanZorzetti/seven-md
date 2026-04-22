'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/formatting'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_CLASSES } from '@/lib/constants'
import TableSkeleton from '@/components/TableSkeleton'

interface Appointment {
  id: string
  dateTime: string
  specialty: string
  doctorName: string | null
  status: string
  createdAt: string
  user: { id: string; name: string; email: string }
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'SCHEDULED', label: 'Agendadas' },
  { value: 'CONFIRMED', label: 'Confirmadas' },
  { value: 'COMPLETED', label: 'Concluídas' },
  { value: 'CANCELLED', label: 'Canceladas' },
]

export default function ConsultasClient() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ search, status, specialty, dateFrom, dateTo, page: page.toString() })
    const res = await fetch(`/api/admin/appointments?${params}`)
    if (res.ok) {
      const data = await res.json()
      setAppointments(data.appointments)
      setTotal(data.total)
      setPages(data.pages)
      if (data.specialties?.length) setSpecialties(data.specialties)
    }
    setLoading(false)
  }, [search, status, specialty, dateFrom, dateTo, page])

  useEffect(() => { setPage(1) }, [search, status, specialty, dateFrom, dateTo])
  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Buscar paciente..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none w-48" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          <option value="">Todas especialidades</option>
          {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none" />
        <span className="text-gray-400 text-sm">até</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none" />
        <span className="ml-auto text-sm text-gray-400">{total} consulta(s)</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton cols={6} rows={6} />
        ) : appointments.length === 0 ? (
          <div className="py-16 text-center text-gray-400">Nenhuma consulta encontrada</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">Data/Hora</th>
                <th className="px-6 py-3 text-left font-medium">Paciente</th>
                <th className="px-6 py-3 text-left font-medium">Especialidade</th>
                <th className="px-6 py-3 text-left font-medium">Médico</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDateTime(a.dateTime)}</td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-800">{a.user.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[140px]">{a.user.email}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{a.specialty}</td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{a.doctorName ?? '—'}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${APPOINTMENT_STATUS_CLASSES[a.status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {APPOINTMENT_STATUS_LABELS[a.status] ?? a.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/consultas/${a.id}`} className="text-xs text-[#af101a] hover:underline font-medium">
                      Ver detalhes
                    </Link>
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
