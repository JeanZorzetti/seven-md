import Link from 'next/link'
import Image from 'next/image'

const Footer = () => (
  <footer className="border-t border-gray-800 text-white" style={{ backgroundColor: '#1a0608' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {/* Col 1 — Brand */}
        <div>
          <div className="mb-4">
            <Link href="/" className="inline-block">
              <Image
                src="/Logos/logo seven md4-01.png"
                alt="Seven-MD"
                width={130}
                height={44}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">Aluguel de equipamentos hospitalares e telemedicina. Saúde de qualidade onde você estiver.</p>
        </div>

        {/* Col 2 — Equipamentos */}
        <div>
          <h4 className="mb-3 font-semibold text-white">Equipamentos</h4>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/equipamentos" className="hover:text-white transition-colors">Todos os equipamentos</Link>
            <Link href="/equipamentos/categoria/camas-hospitalares" className="hover:text-white transition-colors">Camas Hospitalares</Link>
            <Link href="/equipamentos/categoria/oxigenoterapia" className="hover:text-white transition-colors">Oxigenoterapia</Link>
            <Link href="/equipamentos/categoria/mobilidade" className="hover:text-white transition-colors">Mobilidade</Link>
            <Link href="/equipamentos/categoria/inalacao-aspiracao" className="hover:text-white transition-colors">Inalação e Aspiração</Link>
          </div>
        </div>

        {/* Col 3 — Telemedicina */}
        <div>
          <h4 className="mb-3 font-semibold text-white">Telemedicina</h4>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/especialidades" className="hover:text-white transition-colors">Especialidades</Link>
            <Link href="/como-funciona" className="hover:text-white transition-colors">Como funciona</Link>
            <Link href="/planos" className="hover:text-white transition-colors">Planos</Link>
            <Link href="/empresas" className="hover:text-white transition-colors">Para empresas</Link>
            <Link href="/plataforma" className="hover:text-white transition-colors">Área do paciente</Link>
          </div>
        </div>

        {/* Col 4 — Contato */}
        <div>
          <h4 className="mb-3 font-semibold text-white">Contato</h4>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contato@sevenmd.com.br
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seg–Sex: 8h às 18h
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 md:flex-row">
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} Seven-MD Telemedicina. Todos os direitos reservados.
        </p>
        <div className="flex gap-4 text-sm text-white/60 items-center">
          <span className="hover:text-white cursor-pointer transition-colors">Termos de Uso</span>
          <span className="hover:text-white cursor-pointer transition-colors">Privacidade</span>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
