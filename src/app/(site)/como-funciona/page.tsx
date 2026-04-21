import type { Metadata } from 'next'
import { AgendarButton } from '@/components/AgendarModal'

export const metadata: Metadata = {
  title: 'Como Funciona | Seven-MD Telemedicina',
  description: 'Entenda como funciona a telemedicina Seven-MD. Simples, seguro e acessível de onde você estiver.',
}

const steps = [
  {
    number: '01',
    title: 'Cadastre-se',
    description: 'Crie sua conta em minutos com seus dados básicos. Processo simples e seguro.',
  },
  {
    number: '02',
    title: 'Escolha o Especialista',
    description: 'Selecione a especialidade e o médico ideal para sua necessidade.',
  },
  {
    number: '03',
    title: 'Realize a Consulta',
    description: 'Videoconsulta segura, privada e de alta qualidade diretamente pelo navegador.',
  },
  {
    number: '04',
    title: 'Receitas Digitais',
    description: 'Receba prescrições e atestados digitalmente com validade nacional.',
  },
]

const benefits = [
  { icon: '🏠', title: 'Sem sair de casa', desc: 'Atendimento no conforto do seu lar ou de qualquer lugar com internet.' },
  { icon: '⏱️', title: 'Sem filas', desc: 'Consultas agendadas ou pronto atendimento sem tempo de espera.' },
  { icon: '📋', title: 'Documentos válidos', desc: 'Receitas e atestados com validade legal em todo o Brasil.' },
  { icon: '🔒', title: 'Seguro e privado', desc: 'Prontuário digital criptografado e sigilo médico garantido.' },
  { icon: '📱', title: 'Qualquer dispositivo', desc: 'Acesse pelo celular, tablet ou computador — sem instalar nada.' },
  { icon: '💳', title: 'Sem carência', desc: 'Comece a usar imediatamente após a contratação do plano.' },
]

export default function ComoFuncionaPage() {
  return (
    <>
      <section className="text-white py-20 lg:py-28" style={{ backgroundColor: '#af101a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
              Telemedicina simples, rápida e segura
            </h1>
            <p className="text-lg text-red-100 leading-relaxed">
              Do agendamento à receita digital, todo o processo acontece online. Sem burocracia, sem deslocamento.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-12 text-center" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>
            4 passos para sua consulta
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-xl font-black"
                  style={{ background: 'linear-gradient(to bottom right, #af101a, #d32f2f)', fontFamily: 'var(--font-manrope)' }}
                >
                  {step.number}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg" style={{ fontFamily: 'var(--font-manrope)' }}>{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#f9f2f2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-12 text-center" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>
            Por que escolher a Seven-MD?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <span className="text-3xl shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>
            Pronto para começar?
          </h2>
          <p className="text-gray-500 mb-8">Agende agora sua primeira consulta e experimente a telemedicina Seven-MD.</p>
          <AgendarButton className="text-white font-semibold px-8 py-3 rounded-xl transition-all hover:opacity-90" style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' } as React.CSSProperties}>
            Agendar consulta
          </AgendarButton>
        </div>
      </section>
    </>
  )
}
