import Link from 'next/link'

export default function PlanosSuccessPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento confirmado!</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Sua assinatura foi ativada com sucesso. Em breve você receberá as instruções de acesso à plataforma de telemedicina.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3">
          <p className="text-sm font-semibold text-gray-700">Próximos passos:</p>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Aguarde a confirmação do pagamento (pode levar alguns minutos)</li>
            <li>Entre em contato com nossa equipe para receber seu link de acesso</li>
            <li>Acesse a plataforma e agende sua primeira consulta</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/plataforma"
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white text-center hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
          >
            Acessar plataforma
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#af101a] border-2 border-[#af101a] text-center hover:bg-red-50 transition-all"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  )
}
