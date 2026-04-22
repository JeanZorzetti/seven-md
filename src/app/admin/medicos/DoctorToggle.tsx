'use client'

import { useState } from 'react'
import { toast } from '@/components/Toast'

export default function DoctorToggle({ id, available }: { id: string; available: boolean }) {
  const [value, setValue] = useState(available)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/doctors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !value }),
    })
    if (res.ok) {
      setValue((v) => !v)
      toast(value ? 'Médico desabilitado' : 'Médico habilitado')
    } else {
      toast('Erro ao atualizar disponibilidade', 'error')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-60 ${
        value ? 'bg-green-500' : 'bg-gray-300'
      }`}
      title={value ? 'Disponível — clique para desabilitar' : 'Indisponível — clique para habilitar'}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          value ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
