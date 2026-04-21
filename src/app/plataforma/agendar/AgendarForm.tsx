'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const specialties = [
  'Clínica Geral', 'Cardiologia', 'Dermatologia', 'Endocrinologia',
  'Gastroenterologia', 'Ginecologia', 'Neurologia', 'Nutrição',
  'Oftalmologia', 'Ortopedia', 'Otorrinolaringologia', 'Pediatria',
  'Psicologia', 'Psiquiatria', 'Urologia', 'Geriatria',
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
]

export default function AgendarForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [specialty, setSpecialty] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const dateTime = new Date(`${date}T${time}:00`)

    const res = await fetch('/api/plataforma/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialty, dateTime: dateTime.toISOString(), notes: notes || undefined }),
    })

    if (res.ok) {
      router.push('/plataforma/consultas')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Erro ao agendar')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-[#af101a]">Agendar Consulta</h1>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              s <= step ? 'bg-[#af101a] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 4 && <div className={`w-8 h-0.5 ${s < step ? 'bg-[#af101a]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Specialty */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#af101a] mb-4">Escolha a especialidade</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {specialties.map((sp) => (
              <button
                key={sp}
                onClick={() => { setSpecialty(sp); setStep(2) }}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors text-left ${
                  specialty === sp
                    ? 'bg-[#fff2f0] border-[#af101a] text-[#af101a]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#af101a]">Escolha a data e horário</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Data</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-[#af101a] focus:outline-none focus:ring-2 focus:ring-[#af101a]/20 transition-colors"
            />
          </div>
          {date && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTime(t); setStep(3) }}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      time === t
                        ? 'bg-[#af101a] border-[#af101a] text-white'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">
            ← Voltar
          </button>
        </div>
      )}

      {/* Step 3: Notes */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#af101a]">Observações (opcional)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Descreva seus sintomas ou motivo da consulta..."
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#af101a] focus:outline-none focus:ring-2 focus:ring-[#af101a]/20 transition-colors resize-none"
          />
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-700">
              ← Voltar
            </button>
            <button
              onClick={() => setStep(4)}
              className="rounded-xl bg-[#af101a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
            >
              Revisar
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#af101a]">Confirme sua consulta</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Especialidade</span>
              <span className="font-medium text-gray-900">{specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data</span>
              <span className="font-medium text-gray-900">
                {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Horário</span>
              <span className="font-medium text-gray-900">{time}</span>
            </div>
            {notes && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-500">Observações:</span>
                <p className="text-gray-900 mt-1">{notes}</p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="text-sm text-gray-500 hover:text-gray-700">
              ← Voltar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-[#af101a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors disabled:opacity-60"
            >
              {loading ? 'Agendando...' : 'Confirmar agendamento'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
