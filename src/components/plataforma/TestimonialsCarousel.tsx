'use client'

import { useState, useEffect } from 'react'

type Testimonial = {
  quote: string
  name: string
  stars: number
  specialty: string
}

const testimonials: Testimonial[] = [
  {
    quote: 'Consultei com o cardiologista em menos de 2 dias, sem sair de casa. Incrível!',
    name: 'Fernanda R.',
    stars: 5,
    specialty: 'Cardiologia',
  },
  {
    quote: 'Meu filho teve febre à meia-noite. Em 20 minutos estava falando com um pediatra.',
    name: 'Carlos M.',
    stars: 5,
    specialty: 'Pediatria',
  },
  {
    quote: 'Paguei R$44 e tive acesso a especialistas que cobrariam R$300 por consulta.',
    name: 'Ana L.',
    stars: 5,
    specialty: 'Clínica Geral',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length)
        setFading(false)
      }, 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const goTo = (index: number) => {
    if (index === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 300)
  }

  const t = testimonials[current]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#af101a]">O que dizem nossos pacientes</h2>

      <div
        className={`bg-white rounded-2xl border border-[#ffdad6] p-6 transition-opacity duration-300 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Purple quote mark */}
        <div className="text-4xl font-serif text-[#af101a] leading-none mb-3 select-none">&ldquo;</div>

        <p className="text-sm text-gray-700 leading-relaxed mb-4">{t.quote}</p>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-[#af101a]">{t.name}</p>
            <p className="text-xs text-[#af101a] font-medium mt-0.5">{t.specialty}</p>
          </div>
          <StarRating count={t.stars} />
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Depoimento ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-[#af101a] w-5' : 'bg-[#ffdad6]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
