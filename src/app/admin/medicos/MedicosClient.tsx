'use client'

import { useState, useEffect, useCallback } from 'react'
import TableSkeleton from '@/components/TableSkeleton'
import { toast } from '@/components/Toast'
import DoctorToggle from './DoctorToggle'
import MedicoFormModal from './MedicoFormModal'

interface Doctor {
  id: string
  name: string
  specialty: string
  crm: string
  state: string
  bio: string | null
  rating: number
  reviewCount: number
  available: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-xs">
      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-gray-600 font-medium">{rating.toFixed(1)}</span>
      <span className="text-gray-400">({rating})</span>
    </span>
  )
}

export default function MedicosClient() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [available, setAvailable] = useState('all')
  const [modal, setModal] = useState<{ open: boolean; doctor?: Doctor }>({ open: false })

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ search, specialty, available })
    const res = await fetch(`/api/admin/doctors?${params}`)
    if (res.ok) {
      const data = await res.json()
      setDoctors(data.doctors)
      setSpecialties(data.specialties)
    }
    setLoading(false)
  }, [search, specialty, available])

  useEffect(() => { load() }, [load])

  const handleDelete = async (doctor: Doctor) => {
    if (!confirm(`Excluir Dr(a). ${doctor.name}? Esta ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/admin/doctors/${doctor.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast(`Dr(a). ${doctor.name} excluído(a)`)
      load()
    } else {
      toast('Erro ao excluir médico', 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text" placeholder="Buscar por nome ou CRM..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none w-56"
        />
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          <option value="">Todas especialidades</option>
          {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={available} onChange={(e) => setAvailable(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          <option value="all">Todos</option>
          <option value="true">Disponíveis</option>
          <option value="false">Indisponíveis</option>
        </select>
        <span className="ml-auto text-sm text-gray-400">{doctors.length} médico(s)</span>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90"
          style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo médico
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton cols={6} rows={5} />
        ) : doctors.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 mb-3">Nenhum médico encontrado</p>
            <button onClick={() => setModal({ open: true })} className="text-sm text-[#af101a] font-semibold hover:underline">
              Cadastrar primeiro médico
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">Médico</th>
                <th className="px-6 py-3 text-left font-medium">Especialidade</th>
                <th className="px-6 py-3 text-left font-medium">CRM</th>
                <th className="px-6 py-3 text-center font-medium">Avaliação</th>
                <th className="px-6 py-3 text-center font-medium">Disponível</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-900">{d.name}</p>
                    {d.bio && <p className="text-xs text-gray-400 truncate max-w-[200px]">{d.bio}</p>}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{d.specialty}</td>
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">{d.crm}-{d.state}</td>
                  <td className="px-6 py-3 text-center">
                    <StarRating rating={d.rating} />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <DoctorToggle id={d.id} available={d.available} />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal({ open: true, doctor: d })}
                        className="text-xs text-[#af101a] hover:underline font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(d)}
                        className="text-xs text-red-400 hover:text-red-600 hover:underline font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal.open && (
        <MedicoFormModal
          doctor={modal.doctor}
          onClose={() => setModal({ open: false })}
          onSaved={() => { setModal({ open: false }); load() }}
        />
      )}
    </div>
  )
}
