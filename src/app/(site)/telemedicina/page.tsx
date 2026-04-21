import type { Metadata } from 'next'
import Link from 'next/link'
import { AgendarButton } from '@/components/AgendarModal'

export const metadata: Metadata = {
  title: 'Telemedicina | Seven-MD',
  description: 'Consultas médicas online com especialistas qualificados. Seven-MD Telemedicina — powered by ProLife.',
}

const features = [
  { icon: '🎥', title: 'Videoconsulta em HD', desc: 'Atendimento de alta qualidade diretamente pelo navegador, sem instalar nada.' },
  { icon: '🏥', title: '+30 Especialidades', desc: 'Clínico geral, cardiologia, dermatologia, psicologia e muito mais.' },
  { icon: '⚡', title: 'Pronto Atendimento 24h', desc: 'Médico disponível a qualquer hora para urgências e dúvidas rápidas.' },
  { icon: '📄', title: 'Receitas com validade legal', desc: 'Prescrições e atestados digitais válidos em todo o Brasil.' },
  { icon: '🔒', title: 'Sigilo garantido', desc: 'Prontuário eletrônico criptografado e privacidade médica protegida.' },
  { icon: '💳', title: 'Sem carência', desc: 'Use imediatamente após assinar. Sem burocracia, sem espera.' },
]

export default function TelemedicinaPage() {
  return (
    <>
      <section className="text-white py-20 lg:py-28 relative overflow-hidden" style={{ backgroundColor: '#af101a' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, white, transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-red-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 bg-red-200 rounded-full animate-pulse" />
              Médicos disponíveis agora
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
              Saúde de qualidade onde você estiver
            </h1>
            <p className="text-lg text-red-100 leading-relaxed mb-8 max-w-xl">
              Consultas médicas online com especialistas qualificados. Rápido, seguro e acessível — powered by ProLife.
            </p>
            <div className="flex flex-wrap gap-3">
              <AgendarButton className="bg-white font-semibold px-7 py-3 rounded-xl transition-all hover:bg-red-50 text-[#af101a]">
                Agendar consulta
              </AgendarButton>
              <Link href="/planos" className="border-2 border-white/40 hover:border-white text-white font-semibold px-7 py-3 rounded-xl transition-all">
                Ver planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-12 text-center" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>
            Tudo que você precisa para sua saúde online
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform duration-200">
                <span className="text-3xl shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: '#f9f2f2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>Pronto para começar?</h2>
            <p className="text-gray-500">Escolha seu plano e comece a usar hoje mesmo.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/planos" className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all" style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}>
              Ver planos
            </Link>
            <Link href="/especialidades" className="font-semibold px-6 py-3 rounded-xl border-2 hover:bg-red-50 transition-all" style={{ color: '#af101a', borderColor: '#af101a' }}>
              Ver especialidades
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
