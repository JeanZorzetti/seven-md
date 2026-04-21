'use client'

import { useState } from 'react'
import StatusBadge from '@/components/plataforma/StatusBadge'
import AppointmentDetail from '@/components/plataforma/AppointmentDetail'

export type AppointmentWithReview = {
  id: string
  specialty: string
  doctorName: string | null
  dateTime: string
  status: string
  notes: string | null
  review: {
    rating: number
    comment: string | null
  } | null
}

type Props = {
  appointments: AppointmentWithReview[]
  onReviewSuccess: () => void
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function fmtTime(s: string) {
  return new Date(s).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtMonth(s: string) {
  return new Date(s).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

function showToast(msg: string) {
  const el = document.createElement('div')
  el.textContent = msg
  el.style.cssText =
    'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#af101a;color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.25);max-width:90vw;text-align:center;'
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 3500)
}

function TimelineItem({
  appt,
  onViewDetail,
}: {
  appt: AppointmentWithReview
  onViewDetail: (appt: AppointmentWithReview) => void
}) {
  const isCancelled = appt.status === 'CANCELLED'
  const isCompleted = appt.status === 'COMPLETED'
  const isUpcoming = appt.status === 'SCHEDULED' || appt.status === 'CONFIRMED'

  return (
    <div className="flex gap-4">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isCompleted
              ? 'bg-green-100 text-green-600'
              : isCancelled
              ? 'bg-gray-100 text-gray-400'
              : 'bg-[#fff2f0] text-[#af101a]'
          }`}
        >
          {isCompleted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : isCancelled ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
        <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
      </div>

      {/* Card */}
      <div
        className={`flex-1 bg-white rounded-xl border p-4 mb-4 ${
          isCancelled ? 'border-gray-200 opacity-60' : 'border-gray-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold ${
                isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}
            >
              {appt.specialty}
            </p>
            <p
              className={`text-xs mt-0.5 ${
                isCancelled ? 'text-gray-300 line-through' : 'text-gray-500'
              }`}
            >
              {fmtDate(appt.dateTime)} às {fmtTime(appt.dateTime)}
            </p>
            {appt.doctorName && (
              <p className="text-xs text-gray-400 mt-0.5">Dr(a). {appt.doctorName}</p>
            )}
            {appt.notes && !isCancelled && (
              <p className="text-xs text-gray-400 italic mt-1 line-clamp-2">{appt.notes}</p>
            )}
            {isUpcoming && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[#af101a] bg-[#fff2f0] rounded-full px-2.5 py-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Próxima
              </span>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <StatusBadge status={appt.status} />

            {isCompleted && (
              <div className="flex flex-col items-end gap-1.5">
                <button
                  onClick={() => onViewDetail(appt)}
                  className="text-xs font-medium text-[#af101a] hover:text-[#af101a] hover:underline"
                >
                  Ver detalhes
                </button>
                <button
                  onClick={() =>
                    showToast('Receita digital disponível em breve na plataforma')
                  }
                  className="inline-flex items-center gap-1 text-xs border border-[#ffdad6] text-[#af101a] rounded-lg px-2.5 py-1 hover:bg-[#fff2f0] transition-colors"
                >
                  Receita digital
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AppointmentTimeline({ appointments, onReviewSuccess }: Props) {
  const [view, setView] = useState<'list' | 'timeline'>('list')
  const [selected, setSelected] = useState<AppointmentWithReview | null>(null)

  // Group by month for timeline
  const grouped: Record<string, AppointmentWithReview[]> = {}
  for (const appt of appointments) {
    const key = fmtMonth(appt.dateTime)
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(appt)
  }

  return (
    <>
      {selected && (
        <AppointmentDetail
          appointment={selected}
          onClose={() => setSelected(null)}
          onReviewSuccess={() => {
            setSelected(null)
            onReviewSuccess()
          }}
        />
      )}

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-[#fff2f0] rounded-xl p-1 w-fit">
        <button
          onClick={() => setView('list')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            view === 'list'
              ? 'bg-white text-[#af101a] shadow-sm'
              : 'text-[#af101a] hover:text-[#af101a]'
          }`}
        >
          Lista
        </button>
        <button
          onClick={() => setView('timeline')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            view === 'timeline'
              ? 'bg-white text-[#af101a] shadow-sm'
              : 'text-[#af101a] hover:text-[#af101a]'
          }`}
        >
          Linha do Tempo
        </button>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <AppointmentListItem
              key={appt.id}
              appt={appt}
              onViewDetail={setSelected}
              onReviewSuccess={onReviewSuccess}
            />
          ))}
        </div>
      )}

      {/* Timeline view */}
      {view === 'timeline' && (
        <div>
          {Object.entries(grouped).map(([month, appts]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#af101a] text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {month}
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              {appts.map((appt) => (
                <TimelineItem key={appt.id} appt={appt} onViewDetail={setSelected} />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function AppointmentListItem({
  appt,
  onViewDetail,
  onReviewSuccess,
}: {
  appt: AppointmentWithReview
  onViewDetail: (appt: AppointmentWithReview) => void
  onReviewSuccess: () => void
}) {
  const isCancelled = appt.status === 'CANCELLED'
  const isCompleted = appt.status === 'COMPLETED'

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-5 ${isCancelled ? 'opacity-60' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#fff2f0] flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <p className={`text-sm font-semibold ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {appt.specialty}
            </p>
            <p className={`text-xs mt-0.5 ${isCancelled ? 'text-gray-300' : 'text-gray-500'}`}>
              {fmtDate(appt.dateTime)} às {fmtTime(appt.dateTime)}
            </p>
            {appt.doctorName && (
              <p className="text-xs text-gray-400 mt-0.5">Dr(a). {appt.doctorName}</p>
            )}
            {appt.notes && (
              <p className="text-xs text-gray-400 mt-1 italic">{appt.notes}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:shrink-0 flex-wrap">
          <StatusBadge status={appt.status} />
          {isCompleted && (
            <>
              <button
                onClick={() => onViewDetail(appt)}
                className="text-xs font-medium text-[#af101a] hover:underline"
              >
                Ver detalhes
              </button>
              <button
                onClick={() => showToast('Receita digital disponível em breve na plataforma')}
                className="inline-flex items-center gap-1 text-xs border border-[#ffdad6] text-[#af101a] rounded-lg px-2.5 py-1 hover:bg-[#fff2f0] transition-colors"
              >
                Receita digital
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
