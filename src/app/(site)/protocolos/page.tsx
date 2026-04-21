import type { Metadata } from 'next'
import Link from 'next/link'
import { AgendarButton } from '@/components/AgendarModal'

export const metadata: Metadata = {
  title: 'Protocolos Clínicos | Seven-MD',
  description: 'Conheça os programas estruturados de saúde da Seven-MD: Telemedicina, NR-1, Emagrecimento Clínico, TEA e Entrevista Qualificada.',
}

const protocols = [
  {
    id: '01',
    slug: 'telemedicina',
    title: 'Telemedicina',
    subtitle: 'Consultas médicas ilimitadas 24h/7 dias',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    description: 'Acesso contínuo a consultas médicas online com profissionais qualificados. Mais de 32 especialidades, receitas digitais e atestados com validade legal.',
    audience: ['Pessoas físicas', 'Famílias', 'Empresas de qualquer porte', 'Parceiros White Label'],
    features: [
      'Consultas ilimitadas via videochamada 24h/7 dias',
      'Mais de 32 especialidades médicas',
      'Receitas digitais com validade legal (ICP-Brasil)',
      'Atestados e declarações médicas',
      'Pronto-atendimento: tempo médio ≤ 15 min',
      'Prontuário digital com histórico completo',
    ],
    sla: [
      { label: 'Espera no PA 24h', value: '≤ 15 min' },
      { label: 'Uptime da plataforma', value: '99,5% / mês' },
      { label: 'Envio de receita digital', value: 'Até 2h' },
      { label: 'Resposta ao agendamento', value: '7 dias úteis' },
    ],
    pricing: [
      { plan: 'Individual', coverage: '1 vida', price: 'R$ 47', period: '/mês' },
      { plan: 'Familiar', coverage: 'Até 4 vidas', price: 'R$ 147', period: '/mês' },
      { plan: 'Familiar+', coverage: 'Até 6 vidas', price: 'R$ 237', period: '/mês', highlight: true },
      { plan: 'Empresarial', coverage: 'Por colaborador', price: 'R$ 27', period: '/vida/mês' },
    ],
    color: '#af101a',
    bg: '#fff2f0',
  },
  {
    id: '02',
    slug: 'nr1',
    title: 'Programa NR-1',
    subtitle: 'Saúde Mental Corporativa · Conformidade Legal',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description: 'Garantia de conformidade com a NR-1 do MTE. Programa estruturado de suporte em saúde mental com atendimento psicológico, clínico e psiquiátrico via telemedicina.',
    audience: ['Empresas de qualquer porte', 'RH e Segurança do Trabalho', 'Setores com alto índice de afastamento', 'Colaboradores com sinais de estresse ou burnout'],
    features: [
      'Triagem psicossocial e acolhimento inicial',
      'Pacote 1: Clínico + Psicólogo (estresse/ansiedade leve)',
      'Pacote 2: Psiquiatra + Psicólogo (burnout/depressão)',
      'Relatório mensal de conformidade NR-1 (anônimo)',
      'Documentação para fiscalizações do MTE',
      'Implantação gratuita — sem taxa de setup',
    ],
    sla: [
      { label: 'Disponibilidade de agendamento', value: '48h úteis' },
      { label: 'Relatório mensal', value: '5º dia útil' },
      { label: 'Suporte ao RH', value: '1 dia útil' },
      { label: 'Encaminhamento psiquiatria', value: '7 dias pós-triagem' },
    ],
    pricing: [
      { plan: 'Pacote 1 Quinzenal', coverage: '1 Clínico + 2 Psicólogos/mês', price: 'R$ 302', period: '/colab/mês' },
      { plan: 'Pacote 1 Semanal', coverage: '1 Clínico + 4 Psicólogos/mês', price: 'R$ 488', period: '/colab/mês' },
      { plan: 'Pacote 2 Quinzenal', coverage: '1 Psiquiatra + 2 Psicólogos/mês', price: 'R$ 454', period: '/colab/mês', highlight: true },
      { plan: 'Pacote 2 Semanal', coverage: '1 Psiquiatra + 4 Psicólogos/mês', price: 'R$ 640', period: '/colab/mês' },
    ],
    color: '#005f7b',
    bg: '#f0f9ff',
  },
  {
    id: '03',
    slug: 'mounjaro',
    title: 'Emagrecimento Clínico',
    subtitle: 'Tirzepatida · Programa Multidisciplinar',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    description: 'Tratamento médico estruturado para emagrecimento sustentável com Tirzepatida (Mounjaro), com acompanhamento multidisciplinar completo — médico, nutricional e psicológico.',
    audience: ['Pessoas com sobrepeso ou obesidade', 'Pacientes com indicação clínica para Tirzepatida', 'Empresas com benefício corporativo de saúde', 'Parceiros B2B e White Label'],
    features: [
      'Consulta médica inicial + emissão de receita digital',
      'Acompanhamento nutricional personalizado',
      'Acompanhamento psicológico comportamental',
      'Monitoramento contínuo via prontuário eletrônico',
      'Renovação de receita em até 24h',
      'Programas de 2, 4 ou 6 meses',
    ],
    sla: [
      { label: 'Consulta inicial', value: '48h após cadastro' },
      { label: 'Emissão de receita', value: 'Até 2h' },
      { label: 'Agendamento nutrição', value: '7 dias' },
      { label: 'Renovação de receita', value: '24h' },
    ],
    pricing: [
      { plan: 'Entrada (2 meses)', coverage: '2 consultas + nutrição + psicologia', price: 'R$ 1.559', period: '' },
      { plan: 'Intermediário (4 meses)', coverage: '4 consultas + nutrição + psicologia', price: 'R$ 3.118', period: '', highlight: true },
      { plan: 'Premium (6 meses)', coverage: '6 consultas + nutrição + psicologia', price: 'R$ 4.677', period: '' },
    ],
    note: '* Valor do medicamento (Tirzepatida) não incluso — adquirido separadamente pelo paciente.',
    color: '#7c3aed',
    bg: '#faf5ff',
  },
  {
    id: '04',
    slug: 'tea',
    title: 'Projeto TEA',
    subtitle: 'Transtorno do Espectro Autista · Acompanhamento Multidisciplinar',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: 'Avaliação, diagnóstico e acompanhamento multidisciplinar estruturado para crianças com TEA. Equipe especializada com psiquiatria pediátrica, neurologia, psicologia, fonoaudiologia e fisioterapia.',
    audience: ['Crianças com suspeita ou diagnóstico de TEA', 'Famílias buscando acompanhamento especializado', 'Empresas com benefício para dependentes', 'Operadoras de saúde e parceiros B2B'],
    features: [
      'Equipe multidisciplinar especializada em TEA',
      'Psiquiatria Pediátrica / Neuropediatria',
      'Psicologia + Fonoaudiologia + Fisioterapia',
      'Prontuário eletrônico com histórico completo',
      'Relatório mensal de evolução para a família',
      'Mesmo especialista garantido em 100% das sessões',
    ],
    sla: [
      { label: 'Avaliação inicial', value: '48h após cadastro' },
      { label: 'Agendamento de sessões', value: '7 dias úteis' },
      { label: 'Relatório mensal', value: '5º dia útil' },
      { label: 'Suporte à família', value: '24h úteis' },
    ],
    pricing: [
      { plan: 'Mensal (Manutenção)', coverage: '5 atendimentos/mês', price: 'R$ 1.939', period: '/mês' },
      { plan: 'Quinzenal (Intermediário)', coverage: '8 atendimentos/mês', price: 'R$ 2.849', period: '/mês', highlight: true },
      { plan: 'Semanal (Intensivo)', coverage: '14 atendimentos/mês', price: 'R$ 4.669', period: '/mês' },
    ],
    color: '#059669',
    bg: '#f0fdf4',
  },
  {
    id: '05',
    slug: 'entrevista-qualificada',
    title: 'Entrevista Qualificada',
    subtitle: 'Triagem Clínica · Declaração de Saúde · Controle de Sinistralidade',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    description: 'Entrevista Qualificada Gravada para declaração de saúde de beneficiários de planos de saúde. Segurança jurídica para operadoras com conformidade ANS.',
    audience: ['Operadoras de planos de saúde', 'Corretoras e administradoras de benefícios', 'Empresas contratantes de planos coletivos', 'Gestores de RH'],
    features: [
      'Médico CRM ou Técnico COREN habilitados',
      'Questionário padronizado de Declaração de Saúde',
      'Gravação integral para auditoria e segurança jurídica',
      'Retificação formal com CID e data de diagnóstico',
      'Dossiê completo para análise da operadora',
      'Relatório de produção por data de corte',
    ],
    sla: [
      { label: '1º contato com beneficiário', value: '2 dias úteis' },
      { label: 'Realização da entrevista', value: '5 dias úteis' },
      { label: 'Envio retificação', value: '24h pós-entrevista' },
      { label: 'Relatório de produção', value: '3º dia útil pós-corte' },
    ],
    pricing: [
      { plan: 'Padrão (Médico CRM)', coverage: 'Médico Generalista', price: 'R$ 234', period: '/entrevista' },
      { plan: 'Técnico (COREN)', coverage: 'Técnico de Enfermagem', price: 'R$ 182', period: '/entrevista', highlight: true },
    ],
    color: '#d97706',
    bg: '#fffbeb',
  },
]

export default function ProtocolosPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #1a0608 0%, #af101a 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-200 mb-3">Seven-MD Telemedicina</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-manrope)' }}>
            Protocolos Clínicos
          </h1>
          <p className="text-lg text-red-100 max-w-2xl mx-auto mb-8">
            Programas estruturados e certificados para saúde individual, familiar e corporativa — com SLA definido, equipes especializadas e tecnologia de ponta.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {protocols.map((p) => (
              <a
                key={p.id}
                href={`#${p.slug}`}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20"
              >
                {p.id}. {p.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
        {protocols.map((p, idx) => (
          <section key={p.id} id={p.slug} className="scroll-mt-24">
            {/* Header */}
            <div className="flex items-start gap-5 mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: p.bg, color: p.color }}
              >
                {p.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: p.color }}>
                  Protocolo {p.id}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>
                  {p.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{p.subtitle}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: description + features */}
              <div className="lg:col-span-2 space-y-5">
                <p className="text-gray-600 leading-relaxed">{p.description}</p>

                {/* Features */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Escopo do Serviço</h3>
                  <ul className="space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                          style={{ background: p.color }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SLA */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">SLA — Níveis de Serviço</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {p.sla.map((s) => (
                      <div key={s.label} className="flex items-center justify-between py-2.5 px-4 rounded-xl" style={{ background: p.bg }}>
                        <span className="text-xs text-gray-500">{s.label}</span>
                        <span className="text-xs font-bold ml-2" style={{ color: p.color }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: audience + pricing */}
              <div className="space-y-5">
                {/* Audience */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3">Público-Alvo</h3>
                  <ul className="space-y-2">
                    {p.audience.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.color }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3">Preços</h3>
                  <div className="space-y-2">
                    {p.pricing.map((pr) => (
                      <div
                        key={pr.plan}
                        className={`p-3 rounded-xl border ${pr.highlight ? 'border-2' : 'border'}`}
                        style={pr.highlight ? { borderColor: p.color, background: p.bg } : { borderColor: '#f3f4f6' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${pr.highlight ? '' : 'text-gray-700'}`}
                              style={pr.highlight ? { color: p.color } : {}}>
                              {pr.plan}
                              {pr.highlight && <span className="ml-1.5 text-[9px] bg-current/10 px-1.5 py-0.5 rounded-full">⭐ Popular</span>}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{pr.coverage}</p>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <span className="text-base font-black" style={{ color: p.color, fontFamily: 'var(--font-manrope)' }}>
                              {pr.price}
                            </span>
                            <span className="text-[10px] text-gray-400">{pr.period}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {p.note && <p className="text-[10px] text-gray-400 mt-2 leading-snug">{p.note}</p>}
                </div>

                <AgendarButton
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-all"
                  style={{ background: `linear-gradient(to right, ${p.color}, ${p.color}cc)` }}
                >
                  Contratar {p.title}
                </AgendarButton>
              </div>
            </div>

            {idx < protocols.length - 1 && (
              <div className="mt-16 border-b border-gray-100" />
            )}
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #1a0608 0%, #af101a 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-manrope)' }}>
            Precisa de uma solução personalizada?
          </h2>
          <p className="text-red-100 mb-8">
            Fale com nosso time comercial para pacotes corporativos, White Label e condições por volume.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contato"
              className="inline-block bg-white font-bold text-sm px-8 py-4 rounded-full hover:bg-red-50 transition-colors"
              style={{ color: '#af101a' }}
            >
              Falar com consultor
            </Link>
            <Link
              href="/planos"
              className="inline-block bg-white/10 border border-white/30 font-bold text-sm px-8 py-4 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              Ver planos de telemedicina
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
