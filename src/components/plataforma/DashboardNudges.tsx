'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NudgeProps {
  totalCount: number
  lastAppointmentDate: string | null
  hasUnreviewedCompleted: boolean
}

const DISMISS_KEY_PREFIX = 'eg_nudge_dismissed_'

function useNudgeDismissed(key: string) {
  const storageKey = `${DISMISS_KEY_PREFIX}${key}`
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'true') setDismissed(true)
    } catch {
      // ignore
    }
  }, [storageKey])

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(storageKey, 'true')
    } catch {
      // ignore
    }
  }

  return { dismissed, dismiss }
}

function Nudge({
  id,
  children,
  variant = 'info',
}: {
  id: string
  children: React.ReactNode
  variant?: 'info' | 'warning' | 'success'
}) {
  const { dismissed, dismiss } = useNudgeDismissed(id)

  if (dismissed) return null

  const variantClass = {
    info: 'bg-[#fff2f0] border-[#ffdad6] text-[#af101a]',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-green-50 border-green-200 text-green-900',
  }[variant]

  return (
    <div
      className={`relative rounded-2xl border px-5 py-4 pr-10 ${variantClass}`}
    >
      <button
        onClick={dismiss}
        className="absolute top-3 right-4 text-current opacity-40 hover:opacity-80 text-xl leading-none"
        aria-label="Fechar"
      >
        ×
      </button>
      {children}
    </div>
  )
}

export default function DashboardNudges({
  totalCount,
  lastAppointmentDate,
  hasUnreviewedCompleted,
}: NudgeProps) {
  const [mounted, setMounted] = useState(false)

  // Wait for client mount to read localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const lastApptDate = lastAppointmentDate ? new Date(lastAppointmentDate) : null
  const inactiveFor30Days = lastApptDate ? lastApptDate < thirtyDaysAgo : false

  return (
    <div className="space-y-3">
      {/* Nudge 1: No appointments yet */}
      {totalCount === 0 && (
        <Nudge id="first-appointment" variant="info">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Seu plano esta ativo! Que tal agendar sua primeira consulta?
              </p>
              <p className="text-xs opacity-70 mt-0.5">
                Acesso imediato, sem carencia, com +30 especialidades.
              </p>
            </div>
            <Link
              href="/plataforma/agendar"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#af101a] text-white px-4 py-2 text-xs font-semibold hover:bg-[#af101a] transition-colors"
            >
              Agendar agora →
            </Link>
          </div>
        </Nudge>
      )}

      {/* Nudge 2: Has appointments but none in last 30 days */}
      {totalCount > 0 && inactiveFor30Days && (
        <Nudge id="inactive-30d" variant="warning">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Faz tempo que voce nao consulta. Cuide da sua saude!
              </p>
              <p className="text-xs opacity-70 mt-0.5">
                Sua ultima consulta foi ha mais de 30 dias.
              </p>
            </div>
            <Link
              href="/plataforma/agendar"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 text-white px-4 py-2 text-xs font-semibold hover:bg-amber-600 transition-colors"
            >
              Agendar consulta →
            </Link>
          </div>
        </Nudge>
      )}

      {/* Nudge 3: Has completed appointment without review */}
      {hasUnreviewedCompleted && (
        <Nudge id="pending-review" variant="success">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Como foi sua ultima consulta? Avalie e ajude outros pacientes.
              </p>
              <p className="text-xs opacity-70 mt-0.5">
                Sua avaliacao e muito importante para a comunidade.
              </p>
            </div>
            <Link
              href="/plataforma/consultas"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-green-600 text-white px-4 py-2 text-xs font-semibold hover:bg-green-700 transition-colors"
            >
              Avaliar →
            </Link>
          </div>
        </Nudge>
      )}
    </div>
  )
}
