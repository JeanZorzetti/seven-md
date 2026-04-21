'use client'

import { useState } from 'react'
import StatusBadge from '@/components/plataforma/StatusBadge'
import ReviewModal from '@/components/plataforma/ReviewModal'
import type { AppointmentWithReview } from '@/components/plataforma/AppointmentTimeline'

type Props = {
  appointment: AppointmentWithReview
  onClose: () => void
  onReviewSuccess: () => void
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('pt-BR', {
    weekday: 'long',
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

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function AppointmentDetail({ appointment, onClose, onReviewSuccess }: Props) {
  const [showReview, setShowReview] = useState(false)

  return (
    <>
      {showReview && (
        <ReviewModal
          appointmentId={appointment.id}
          specialty={appointment.specialty}
          onClose={() => setShowReview(false)}
          onSuccess={() => {
            setShowReview(false)
            onReviewSuccess()
          }}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#af101a] to-[#af101a] p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Detalhes da Consulta</p>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white text-2xl leading-none"
                aria-label="Fechar"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-white/75 mt-0.5">{appointment.specialty}</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Info grid */}
            <div className="space-y-3">
              <DetailRow
                label="Data"
                value={`${fmtDate(appointment.dateTime)}`}
              />
              <DetailRow label="Horario" value={fmtTime(appointment.dateTime)} />
              {appointment.doctorName && (
                <DetailRow label="Medico(a)" value={`Dr(a). ${appointment.doctorName}`} />
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 font-medium">Status</span>
                <StatusBadge status={appointment.status} />
              </div>
              {appointment.notes && (
                <DetailRow label="Observacoes" value={appointment.notes} multiline />
              )}
            </div>

            {/* Review section */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-[#af101a] mb-3">Avaliacao</p>

              {appointment.review ? (
                <div className="space-y-2">
                  <StarDisplay rating={appointment.review.rating} />
                  {appointment.review.comment && (
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      &ldquo;{appointment.review.comment}&rdquo;
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-[#fff2f0] rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-600 mb-3">
                    Voce ainda nao avaliou esta consulta. Seu feedback ajuda outros pacientes!
                  </p>
                  <button
                    onClick={() => setShowReview(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#af101a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#af101a] transition-colors"
                  >
                    Avaliar consulta
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function DetailRow({
  label,
  value,
  multiline,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div className={`flex gap-2 ${multiline ? 'flex-col' : 'items-start justify-between'}`}>
      <span className="text-xs text-gray-500 font-medium shrink-0">{label}</span>
      <span className={`text-xs text-gray-800 ${multiline ? '' : 'text-right'} leading-relaxed`}>
        {value}
      </span>
    </div>
  )
}
