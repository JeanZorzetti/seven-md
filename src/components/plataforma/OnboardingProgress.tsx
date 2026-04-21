'use client'

import { useState, useEffect } from 'react'

const QUESTIONNAIRE_KEY = 'eg_health_questionnaire_done'

type Step = {
  label: string
  doneByDefault: boolean
  localStorageKey?: string
}

const STEPS: Step[] = [
  { label: 'Conta criada', doneByDefault: true },
  { label: 'Complete seu perfil de saúde', doneByDefault: false, localStorageKey: QUESTIONNAIRE_KEY },
  { label: 'Conheça os planos', doneByDefault: false },
  { label: 'Contrate seu plano', doneByDefault: false },
  { label: 'Agende sua primeira consulta', doneByDefault: false },
]

export default function OnboardingProgress() {
  const [steps, setSteps] = useState(STEPS)

  useEffect(() => {
    const questionnaireDone = !!localStorage.getItem(QUESTIONNAIRE_KEY)
    setSteps((prev) =>
      prev.map((s) =>
        s.localStorageKey === QUESTIONNAIRE_KEY
          ? { ...s, doneByDefault: questionnaireDone }
          : s
      )
    )
  }, [])

  const doneCount = steps.filter((s) => s.doneByDefault).length
  const progressPct = Math.round((doneCount / steps.length) * 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#af101a]">Seu progresso de ativação</h2>
        <span className="text-sm font-bold text-[#af101a]">{progressPct}%</span>
      </div>
      <div className="w-full bg-[#fff2f0] rounded-full h-2.5 mb-5">
        <div
          className="bg-[#af101a] h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            {step.doneByDefault ? (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            ) : (
              <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
            <span className={step.doneByDefault ? 'text-gray-700 font-medium' : 'text-gray-400'}>
              {step.label}
            </span>
          </li>
        ))}
      </ol>
      {doneCount >= 2 && (
        <p className="mt-4 text-xs text-green-600 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Perfil de saúde completo! Você está pronto para consultar.
        </p>
      )}
    </div>
  )
}
