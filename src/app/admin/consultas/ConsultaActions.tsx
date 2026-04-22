'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_NEXT } from '@/lib/constants'
import { toast } from '@/components/Toast'

export default function ConsultaActions({
  appointmentId,
  currentStatus,
  notes: initialNotes,
}: {
  appointmentId: string
  currentStatus: string
  notes: string | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [notesChanged, setNotesChanged] = useState(false)

  const nextStatus = APPOINTMENT_STATUS_NEXT[currentStatus]
  const isDone = currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED'

  const advance = async () => {
    if (!nextStatus || !confirm(`Avançar para "${APPOINTMENT_STATUS_LABELS[nextStatus]}"?`)) return
    setLoading('advance')
    const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    })
    if (res.ok) {
      toast(`Status avançado para ${APPOINTMENT_STATUS_LABELS[nextStatus]}`)
      router.refresh()
    } else {
      const d = await res.json()
      toast(d.error ?? 'Erro ao atualizar', 'error')
    }
    setLoading(null)
  }

  const cancel = async () => {
    if (!confirm('Cancelar esta consulta?')) return
    setLoading('cancel')
    const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    })
    if (res.ok) {
      toast('Consulta cancelada')
      router.refresh()
    } else {
      const d = await res.json()
      toast(d.error ?? 'Erro ao cancelar', 'error')
    }
    setLoading(null)
  }

  const saveNotes = async () => {
    setLoading('notes')
    const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    if (res.ok) {
      toast('Notas salvas')
      setNotesChanged(false)
      router.refresh()
    } else {
      toast('Erro ao salvar notas', 'error')
    }
    setLoading(null)
  }

  return (
    <div className="space-y-4">
      {nextStatus && !isDone && (
        <button
          onClick={advance}
          disabled={!!loading}
          className="w-full py-2 px-4 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90"
          style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
        >
          {loading === 'advance' ? 'Atualizando...' : `Avançar → ${APPOINTMENT_STATUS_LABELS[nextStatus]}`}
        </button>
      )}
      {!isDone && (
        <button
          onClick={cancel}
          disabled={!!loading}
          className="w-full py-2 px-4 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-60"
        >
          {loading === 'cancel' ? 'Cancelando...' : 'Cancelar consulta'}
        </button>
      )}
      <div className="border-t border-gray-100 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas internas</label>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setNotesChanged(true) }}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none resize-none"
          placeholder="Observações sobre a consulta..."
        />
        {notesChanged && (
          <button
            onClick={saveNotes}
            disabled={!!loading}
            className="mt-2 w-full py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {loading === 'notes' ? 'Salvando...' : 'Salvar notas'}
          </button>
        )}
      </div>
    </div>
  )
}
