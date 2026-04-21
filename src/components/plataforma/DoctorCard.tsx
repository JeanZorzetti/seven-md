'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConversionModal } from '@/components/plataforma/ConversionModal'

type Doctor = {
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

type Props = {
  doctor: Doctor
  isSubscriber: boolean
}

function Initials({ name }: { name: string }) {
  const parts = name.replace(/^(Dr\.|Dra\.)\s*/i, '').trim().split(' ')
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#af101a] to-[#af101a] flex items-center justify-center text-white font-bold text-base shrink-0">
      {initials}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} className="text-yellow-400 text-sm">★</span>
      ))}
      {half && <span className="text-yellow-400 text-sm">½</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="text-gray-300 text-sm">★</span>
      ))}
    </div>
  )
}

export default function DoctorCard({ doctor, isSubscriber }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {modalOpen && (
        <ConversionModal
          doctorName={doctor.name}
          specialty={doctor.specialty}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Initials name={doctor.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-[#af101a] leading-tight">{doctor.name}</p>
              {doctor.available && (
                <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Disponível
                </span>
              )}
            </div>
            <p className="text-xs text-[#af101a] font-medium mt-0.5">{doctor.specialty}</p>
            <p className="text-xs text-gray-400 mt-0.5">{doctor.crm} — {doctor.state}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={doctor.rating} />
          <span className="text-sm font-semibold text-[#af101a]">{doctor.rating.toFixed(1)}</span>
          {doctor.reviewCount === 0 ? (
            <span className="text-xs text-gray-400">Sem avaliações ainda</span>
          ) : (
            <span className="text-xs text-gray-400">({doctor.reviewCount} avaliações)</span>
          )}
        </div>

        {/* Bio */}
        {doctor.bio && (
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{doctor.bio}</p>
        )}

        {/* CTA */}
        {isSubscriber ? (
          <Link
            href="/plataforma/agendar"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#af101a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
          >
            Agendar consulta
          </Link>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#af101a] px-4 py-2.5 text-sm font-medium text-[#af101a] hover:bg-[#fff2f0] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Agendar consulta
          </button>
        )}
      </div>
    </>
  )
}
