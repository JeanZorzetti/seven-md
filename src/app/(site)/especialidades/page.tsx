import type { Metadata } from 'next'
import Link from 'next/link'
import { AgendarButton } from '@/components/AgendarModal'

export const metadata: Metadata = {
  title: 'Especialidades | Seven-MD Telemedicina',
  description: 'Mais de 30 especialidades médicas disponíveis para atendimento online. Seven-MD — telemedicina com qualidade e confiança.',
}

const adultSpecialties = [
  'Angiologia','Alergologia','Cardiologia','Dermatologia','Endocrinologia',
  'Gastroenterologia','Geriatria','Ginecologia','Hematologia','Infectologia',
  'Nefrologia','Neurologia','Ortopedia','Otorrinolaringologia','Pneumologia',
  'Psiquiatria','Reumatologia','Urologia','Fisiatria','Clínica Médica',
  'Clínico Geral','Médico da Família',
]

const kidsSpecialties = [
  'Alergologia Infantil','Endocrinologia Infantil','Gastroenterologia Infantil',
  'Neurologia Infantil','Ortopedia Infantil','Pneumologia Infantil',
  'Psiquiatria Infantil','Psicologia Infantil','Pediatria',
]

const therapies = [
  { title: 'Psicologia', description: 'Acompanhamento psicológico online para adultos.' },
  { title: 'Psicologia Infantil', description: 'Suporte psicológico especializado para crianças.' },
  { title: 'Fisioterapia', description: 'Reabilitação e exercícios orientados por profissionais.' },
  { title: 'Nutrição', description: 'Planos alimentares personalizados com nutricionistas.' },
]

export default function EspecialidadesPage() {
  return (
    <>
      <section className="text-white" style={{ backgroundColor: '#af101a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
              Especialistas prontos para cuidar de você e da sua família
            </h1>
            <p className="text-lg leading-relaxed mb-8 text-red-100">
              Mais de 30 especialidades médicas disponíveis para atendimento online.
            </p>
            <div className="flex flex-wrap gap-3">
              <AgendarButton className="bg-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:bg-red-50 text-[#af101a]">
                Agendar consulta
              </AgendarButton>
              <Link href="/planos" className="border-2 border-white/40 hover:border-white text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200">
                Conhecer planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>Especialidades — Adulto</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {adultSpecialties.map((s) => (
              <div key={s} className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#af101a' }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: '#f9f2f2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>Especialidades — Infantil</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {kidsSpecialties.map((s) => (
              <div key={s} className="flex items-center gap-2 p-3 rounded-lg border border-red-100 bg-white text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#005f7b' }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>Terapias e Acompanhamentos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {therapies.map((t) => (
              <div key={t.title} className="p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{t.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
