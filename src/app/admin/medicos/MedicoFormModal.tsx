'use client'

import { useState } from 'react'
import { toast } from '@/components/Toast'

interface Doctor {
  id: string
  name: string
  specialty: string
  crm: string
  state: string
  bio: string | null
  available: boolean
}

const SPECIALTIES = [
  'Cardiologia', 'Clínica Geral', 'Dermatologia', 'Endocrinologia',
  'Geriatria', 'Ginecologia', 'Neurologia', 'Ortopedia', 'Pediatria',
  'Psiquiatria', 'Urologia', 'Outro',
]

const STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

export default function MedicoFormModal({
  doctor,
  onClose,
  onSaved,
}: {
  doctor?: Doctor
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    name: doctor?.name ?? '',
    specialty: doctor?.specialty ?? '',
    crm: doctor?.crm ?? '',
    state: doctor?.state ?? '',
    bio: doctor?.bio ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = doctor ? `/api/admin/doctors/${doctor.id}` : '/api/admin/doctors'
    const method = doctor ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      toast(doctor ? 'Médico atualizado' : 'Médico cadastrado')
      onSaved()
    } else {
      const data = await res.json()
      toast(data.error ?? 'Erro ao salvar', 'error')
      setError(data.error ?? 'Erro ao salvar')
    }
    setLoading(false)
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none focus:ring-1 focus:ring-[#af101a]/20'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{doctor ? 'Editar médico' : 'Novo médico'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
            <input type="text" required value={form.name} onChange={set('name')} className={inputCls} placeholder="Dr. João Silva" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade *</label>
              <select required value={form.specialty} onChange={set('specialty')} className={inputCls}>
                <option value="">Selecione...</option>
                {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CRM *</label>
              <input type="text" required value={form.crm} onChange={set('crm')} className={inputCls} placeholder="12345" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado (CRM) *</label>
            <select required value={form.state} onChange={set('state')} className={inputCls}>
              <option value="">Selecione...</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Apresentação</label>
            <textarea rows={3} value={form.bio} onChange={set('bio')} className={inputCls + ' resize-none'} placeholder="Especialista em..." />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

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
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
