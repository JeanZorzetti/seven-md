'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppointmentTimeline, {
  type AppointmentWithReview,
} from '@/components/plataforma/AppointmentTimeline'

type SubscriptionStatus = {
  isSubscriber: boolean
  plan: string | null
}

export default function ConsultasPage() {
  const [appointments, setAppointments] = useState<AppointmentWithReview[]>([])
  const [loading, setLoading] = useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)

  const load = async () => {
    const [apptRes, subRes] = await Promise.all([
      fetch('/api/plataforma/appointments'),
      fetch('/api/plataforma/subscription-status'),
    ])
    if (apptRes.ok) {
      const data = await apptRes.json()
      // The appointments API returns appointments. We need to enrich with review data.
      // Fetch reviews for completed appointments via the same endpoint that returns all
      setAppointments(data.map((a: AppointmentWithReview) => ({
        ...a,
        review: a.review ?? null,
      })))
    }
    if (subRes.ok) setSubscriptionStatus(await subRes.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-6 h-6 animate-spin text-[#af101a]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#af101a]">Minhas Consultas</h1>

      {/* No subscription CTA */}
      {!subscriptionStatus?.isSubscriber && (
        <div className="bg-[#fff2f0] border border-[#ffdad6] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#af101a] flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-[#af101a]">Voce nao tem um plano ativo</p>
            <p className="text-sm text-gray-600 mt-0.5">
              Assine um plano para agendar consultas com +30 especialistas, sem carencia.
            </p>
          </div>
          <Link
            href="/plataforma/assinar"
            className="shrink-0 bg-[#af101a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#af101a] transition-colors whitespace-nowrap"
          >
            Assinar agora
          </Link>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500 mb-3">Voce ainda nao tem consultas</p>
          {subscriptionStatus?.isSubscriber ? (
            <Link href="/plataforma/agendar" className="text-[#af101a] font-semibold hover:underline">
              Agendar primeira consulta
            </Link>
          ) : (
            <Link href="/plataforma/assinar" className="text-[#af101a] font-semibold hover:underline">
              Assine um plano para comecar
            </Link>
          )}
        </div>
      ) : (
        <AppointmentTimeline
          appointments={appointments}
          onReviewSuccess={load}
        />
      )}
    </div>
  )
}
