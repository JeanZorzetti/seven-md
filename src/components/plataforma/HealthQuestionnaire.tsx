'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'eg_health_questionnaire_done'

type Answers = {
  objective: string[]
  frequency: string
  conditions: string[]
  specialty: string[]
  timePreference: string
}

const objectives = [
  'Prevenção e check-up',
  'Tratamento de doença',
  'Acompanhamento contínuo',
  'Saúde mental',
  'Nutrição e bem-estar',
  'Outro',
]

const frequencies = [
  { value: 'never', label: 'Nunca ou raramente' },
  { value: '1x_year', label: '1 vez por ano' },
  { value: '2_4x_year', label: '2–4 vezes por ano' },
  { value: 'monthly', label: 'Mensalmente ou mais' },
]

const conditions = [
  'Hipertensão', 'Diabetes', 'Ansiedade / Depressão', 'Obesidade',
  'Colesterol alto', 'Doenças cardíacas', 'Asma / DPOC', 'Nenhuma',
]

const specialties = [
  'Clínica Geral', 'Cardiologia', 'Psicologia', 'Psiquiatria',
  'Nutrição', 'Dermatologia', 'Ginecologia', 'Pediatria',
  'Ortopedia', 'Endocrinologia', 'Neurologia', 'Urologia',
]

const times = [
  { value: 'morning', label: 'Manhã (07h–12h)' },
  { value: 'afternoon', label: 'Tarde (12h–18h)' },
  { value: 'night', label: 'Noite (18h–22h)' },
  { value: 'any', label: 'Qualquer horário' },
]

const totalSteps = 5

export default function HealthQuestionnaire() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>({
    objective: [],
    frequency: '',
    conditions: [],
    specialty: [],
    timePreference: '',
  })

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) {
      // Small delay so the platform renders first
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    // Also store answers for progress bar logic
    localStorage.setItem('eg_health_answers', JSON.stringify(answers))
    setVisible(false)
  }

  const toggleMulti = (field: keyof Pick<Answers, 'objective' | 'conditions' | 'specialty'>, value: string) => {
    setAnswers((prev) => {
      const arr = prev[field]
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  if (!visible) return null

  const progressPct = Math.round((step / totalSteps) * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#af101a] to-[#af101a] p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-white/70 uppercase tracking-wide">
              Perfil de Saúde — Passo {step} de {totalSteps}
            </p>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white text-lg leading-none"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div
              className="bg-white h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Step 1 — Objective */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-[#af101a]">
                  Qual seu principal objetivo de saúde?
                </h2>
                <p className="text-sm text-gray-500 mt-1">Selecione quantos quiser</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {objectives.map((obj) => (
                  <button
                    key={obj}
                    onClick={() => toggleMulti('objective', obj)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border text-left transition-colors ${
                      answers.objective.includes(obj)
                        ? 'bg-[#fff2f0] border-[#af101a] text-[#af101a]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Seus dados estão protegidos por criptografia
              </p>
            </>
          )}

          {/* Step 2 — Frequency */}
          {step === 2 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-[#af101a]">
                  Com que frequência você vai ao médico?
                </h2>
              </div>
              <div className="space-y-2">
                {frequencies.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setAnswers((prev) => ({ ...prev, frequency: f.value }))}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium border text-left transition-colors ${
                      answers.frequency === f.value
                        ? 'bg-[#fff2f0] border-[#af101a] text-[#af101a]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3 — Conditions */}
          {step === 3 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-[#af101a]">
                  Tem alguma condição pré-existente?
                </h2>
                <p className="text-sm text-gray-500 mt-1">Selecione todas que se aplicam</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {conditions.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleMulti('conditions', c)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border text-left transition-colors ${
                      answers.conditions.includes(c)
                        ? 'bg-[#fff2f0] border-[#af101a] text-[#af101a]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Seus dados de saúde são confidenciais e protegidos pela LGPD
              </p>
            </>
          )}

          {/* Step 4 — Specialty */}
          {step === 4 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-[#af101a]">
                  Especialidades que te interessam?
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Temos 14 especialistas nessa área!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {specialties.map((sp) => (
                  <button
                    key={sp}
                    onClick={() => toggleMulti('specialty', sp)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border text-left transition-colors ${
                      answers.specialty.includes(sp)
                        ? 'bg-[#fff2f0] border-[#af101a] text-[#af101a]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 5 — Time preference */}
          {step === 5 && (
            <>
              <div>
                <h2 className="text-lg font-bold text-[#af101a]">
                  Prefere atendimento em qual horário?
                </h2>
              </div>
              <div className="space-y-2">
                {times.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setAnswers((prev) => ({ ...prev, timePreference: t.value }))}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium border text-left transition-colors ${
                      answers.timePreference === t.value
                        ? 'bg-[#fff2f0] border-[#af101a] text-[#af101a]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Voltar
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Pular por agora
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="rounded-xl bg-[#af101a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
            >
              Continuar →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="rounded-xl bg-[#af101a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
            >
              Concluir perfil
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
