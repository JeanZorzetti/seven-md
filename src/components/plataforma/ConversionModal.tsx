'use client'

import { useState } from 'react'
import Link from 'next/link'

type Props = {
  doctorName: string
  specialty: string
  onClose: () => void
}

export function ConversionModal({ doctorName, specialty, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#af101a] to-[#af101a] p-5 text-white">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Consultar com {doctorName}</p>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-xl leading-none"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-white/75 mt-1">{specialty}</p>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-700">
            Para agendar, você precisa de um plano ativo.
          </p>

          <div className="space-y-2">
            {[
              'Sem carência — consulte hoje mesmo',
              '+30 especialidades disponíveis',
              'A partir de R$ 44,00/mês',
              'Receitas e atestados digitais',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#af101a]">
                <svg className="w-4 h-4 text-[#af101a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/planos"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#af101a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
            >
              Conhecer planos →
            </Link>
            <a
              href="https://wa.me/5548999999999?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20planos%20EG%20Telemedicina"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-green-500 px-5 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

type SpecialistCardProps = {
  name: string
  specialty: string
  crm: string
  rating: string
}

export function SpecialistPreviewCard({ name, specialty, crm, rating }: SpecialistCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {modalOpen && (
        <ConversionModal
          doctorName={name}
          specialty={specialty}
          onClose={() => setModalOpen(false)}
        />
      )}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#af101a] to-[#af101a] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#af101a] truncate">{name}</p>
            <p className="text-xs text-gray-500">{specialty}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{crm}</span>
          <span className="flex items-center gap-0.5 text-yellow-500 font-medium">
            ★ {rating}
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#af101a] px-4 py-2 text-sm font-medium text-[#af101a] hover:bg-[#fff2f0] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Agendar consulta
        </button>
      </div>
    </>
  )
}
