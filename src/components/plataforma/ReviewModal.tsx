'use client'

import { useState } from 'react'

type Props = {
  appointmentId: string
  specialty: string
  onClose: () => void
  onSuccess?: () => void
}

export default function ReviewModal({ appointmentId, specialty, onClose, onSuccess }: Props) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (rating === 0) {
      setError('Selecione uma avaliação de 1 a 5 estrelas.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/plataforma/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, rating, comment: comment.trim() || undefined }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Erro ao enviar avaliação.')
        return
      }

      setSubmitted(true)
      onSuccess?.()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#af101a] to-[#af101a] p-5 text-white">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Avaliar consulta</p>
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
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-semibold text-[#af101a]">Avaliação enviada!</p>
              <p className="text-sm text-gray-500">Obrigado pelo seu feedback. Ele ajuda outros pacientes a escolherem o melhor atendimento.</p>
              <button
                onClick={onClose}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#af101a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
              >
                Fechar
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-[#af101a] mb-3">Como foi sua consulta?</p>
                <div className="flex items-center gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                    >
                      <span className={(hovered || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-xs text-gray-500 mt-1">
                    {['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'][rating]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#af101a] mb-1.5">
                  Comentário <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte como foi sua experiência..."
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#af101a] focus:outline-none focus:ring-1 focus:ring-[#af101a] resize-none"
                />
                <p className="text-right text-xs text-gray-400 mt-1">{comment.length}/500</p>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#af101a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar avaliação'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
