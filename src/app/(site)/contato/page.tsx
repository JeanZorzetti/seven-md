import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato | Seven-MD',
  description: 'Entre em contato com a Seven-MD. Atendimento, dúvidas e orçamentos.',
}

export default function ContatoPage() {
  return (
    <>
      <section className="text-white py-20" style={{ backgroundColor: '#af101a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-manrope)' }}>Fale conosco</h1>
          <p className="text-red-100 text-lg">Tire suas dúvidas ou solicite um orçamento de aluguel.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>Envie uma mensagem</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#af101a] transition-colors" placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#af101a] transition-colors" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#af101a] transition-colors" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#af101a] transition-colors text-gray-600">
                  <option value="">Selecione...</option>
                  <option value="aluguel">Aluguel de equipamentos</option>
                  <option value="telemedicina">Telemedicina</option>
                  <option value="planos">Planos</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#af101a] transition-colors" placeholder="Como podemos ajudar?" />
              </div>
              <button
                type="submit"
                className="w-full text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
              >
                Enviar mensagem
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>Informações de contato</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ffdad6' }}>
                    <svg className="w-5 h-5" fill="none" stroke="#af101a" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm">contato@sevenmd.com.br</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ffdad6' }}>
                    <svg className="w-5 h-5" fill="none" stroke="#af101a" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm">Seg–Sex: 8h às 18h</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl" style={{ backgroundColor: '#f9f2f2' }}>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>Precisa de orçamento para aluguel?</h3>
              <p className="text-sm text-gray-500 mb-4">Informe o equipamento necessário, o período estimado e o CEP de entrega. Responderemos em até 2h úteis.</p>
              <span className="text-sm font-semibold" style={{ color: '#af101a' }}>Use o formulário ao lado →</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
