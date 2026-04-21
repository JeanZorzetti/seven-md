import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre | Seven-MD',
  description: 'Conheça a Seven-MD — referência em aluguel de equipamentos hospitalares e telemedicina.',
}

const values = [
  { title: 'Qualidade', desc: 'Equipamentos certificados e manutenção rigorosa para garantir segurança ao paciente.' },
  { title: 'Acessibilidade', desc: 'Soluções de saúde a um custo justo, disponíveis para qualquer pessoa.' },
  { title: 'Confiança', desc: 'Anos de experiência no setor médico-hospitalar e milhares de clientes atendidos.' },
  { title: 'Inovação', desc: 'Tecnologia de telemedicina integrada ao aluguel para um cuidado completo.' },
]

export default function SobrePage() {
  return (
    <>
      <section className="text-white py-20 lg:py-28" style={{ backgroundColor: '#af101a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>
              Sobre a Seven-MD
            </h1>
            <p className="text-lg text-red-100 leading-relaxed">
              Nascemos para facilitar o acesso à saúde de qualidade em casa — com equipamentos hospitalares de ponta e telemedicina integrada.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>Nossa missão</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A Seven-MD surgiu da necessidade de oferecer ao paciente em cuidados domiciliares uma solução completa: o equipamento hospitalar certo, no momento certo, com suporte médico acessível.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Combinamos o aluguel de equipamentos — camas hospitalares, concentradores de oxigênio, cadeiras de rodas e muito mais — com a telemedicina white-label da ProLife, uma das maiores redes de telemedicina do Brasil.
            </p>
            <p className="text-gray-600 leading-relaxed">
              O resultado é um cuidado contínuo: do equipamento no domicílio à consulta médica online, sem sair de casa.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {values.map((v) => (
              <div key={v.title} className="p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 text-sm" style={{ fontFamily: 'var(--font-manrope)' }}>{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center" style={{ backgroundColor: '#f9f2f2' }}>
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>Pronto para cuidar da sua saúde?</h2>
          <p className="text-gray-500 mb-8 text-sm">Conheça nossos equipamentos disponíveis para aluguel ou agende uma consulta de telemedicina.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/equipamentos" className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm" style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}>
              Ver equipamentos
            </Link>
            <Link href="/planos" className="font-semibold px-6 py-3 rounded-xl border-2 transition-all text-sm hover:bg-red-50" style={{ color: '#af101a', borderColor: '#af101a' }}>
              Planos de telemedicina
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
