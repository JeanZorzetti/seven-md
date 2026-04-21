import { getPatientSession } from '@/lib/auth'
import { hasActiveSubscription } from '@/lib/subscription'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AgendarForm from './AgendarForm'

// Comparison table rows: [traditional, eg]
const comparisons = [
  { label: 'Carência', traditional: '30–180 dias', eg: 'Sem carência' },
  { label: 'Mensalidade', traditional: 'R$ 400–800/mês', eg: 'A partir de R$ 44/mês' },
  { label: 'Rede de especialistas', traditional: 'Rede limitada', eg: '+30 especialidades' },
  { label: 'Tempo de espera', traditional: 'Fila de espera', eg: 'Atendimento em até 24h' },
]

function NoSubscriptionGate() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#af101a]">Agendar Consulta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Para agendar consultas, você precisa de um plano ativo.
        </p>
      </div>

      {/* Highlights */}
      <div className="bg-[#fff2f0] rounded-2xl p-6 space-y-3">
        <p className="text-sm font-semibold text-[#af101a] mb-1">Com um plano EG você tem:</p>
        {[
          'Sem carência — consulte hoje mesmo',
          '+30 especialidades disponíveis',
          'A partir de R$ 44,00/mês',
          'Receitas e atestados digitais',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-[#af101a]">
            <svg className="w-4 h-4 text-[#af101a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-3 text-xs font-semibold text-center bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-3 text-gray-500 text-left">Critério</div>
          <div className="px-4 py-3 text-red-500">Plano Tradicional</div>
          <div className="px-4 py-3 text-[#af101a]">Seven-MD</div>
        </div>
        {comparisons.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 text-sm text-center ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="px-4 py-3 text-gray-600 text-left font-medium">{row.label}</div>
            <div className="px-4 py-3 text-red-500 flex items-center justify-center gap-1">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {row.traditional}
            </div>
            <div className="px-4 py-3 text-green-600 flex items-center justify-center gap-1">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {row.eg}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/planos"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#af101a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
        >
          Conhecer planos →
        </Link>
        <a
          href="https://wa.me/5548999999999?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20planos%20EG%20Telemedicina"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-green-500 px-5 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Falar no WhatsApp →
        </a>
      </div>
    </div>
  )
}

export default async function AgendarPage() {
  const session = await getPatientSession()
  if (!session) redirect('/login')

  const isSubscriber = await hasActiveSubscription(session.id)

  if (!isSubscriber) {
    return <NoSubscriptionGate />
  }

  return <AgendarForm />
}
