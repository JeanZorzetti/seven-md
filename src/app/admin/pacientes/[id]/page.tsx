import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate, formatDateTime, maskCpf } from '@/lib/formatting'
import { PLAN_LABELS, PLAN_PRICES, PLAN_COLORS } from '@/lib/plans'
import { SUBSCRIPTION_STATUS_LABELS, SUBSCRIPTION_STATUS_CLASSES, APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_CLASSES } from '@/lib/constants'

export default async function PacienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, cpf: true,
      birthDate: true, gender: true, createdAt: true,
      subscription: true,
      appointments: {
        orderBy: { dateTime: 'desc' },
        take: 20,
        include: { review: true },
      },
      _count: { select: { appointments: true } },
    },
  })
  if (!user) notFound()

  const sub = user.subscription

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/pacientes" className="text-sm text-gray-400 hover:text-[#af101a]">← Pacientes</Link>
        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Dados pessoais</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'E-mail', value: user.email },
                { label: 'Telefone', value: user.phone ?? '—' },
                { label: 'CPF', value: maskCpf(user.cpf), mono: true },
                { label: 'Nascimento', value: user.birthDate ? formatDate(user.birthDate) : '—' },
                { label: 'Gênero', value: user.gender ?? '—' },
                { label: 'Cadastro', value: formatDate(user.createdAt) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500">{row.label}</span>
                  <span className={`font-medium text-gray-800 ${row.mono ? 'font-mono text-xs' : ''}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Assinatura</h3>
            {sub ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plano</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PLAN_COLORS[sub.plan]}`}>
                    {PLAN_LABELS[sub.plan]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${SUBSCRIPTION_STATUS_CLASSES[sub.status]}`}>
                    {SUBSCRIPTION_STATUS_LABELS[sub.status]}
                  </span>
                </div>
                {PLAN_PRICES[sub.plan] > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(PLAN_PRICES[sub.plan])}/mês</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Início</span>
                  <span className="text-gray-800">{formatDate(sub.startDate)}</span>
                </div>
                {sub.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vencimento</span>
                    <span className="text-gray-800">{formatDate(sub.endDate)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sem assinatura ativa</p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-2 gap-3">
            {[
              { label: 'Consultas', value: user._count.appointments },
              { label: 'Avaliações', value: user.appointments.filter((a) => a.review).length },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right col: appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Histórico de consultas</h3>
          </div>
          {user.appointments.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Sem consultas</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-left font-medium">Data/Hora</th>
                  <th className="px-6 py-3 text-left font-medium">Especialidade</th>
                  <th className="px-6 py-3 text-left font-medium">Médico</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-center font-medium">Avaliação</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {user.appointments.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDateTime(a.dateTime)}</td>
                    <td className="px-6 py-3 text-gray-700">{a.specialty}</td>
                    <td className="px-6 py-3 text-gray-500 text-xs">{a.doctorName ?? '—'}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${APPOINTMENT_STATUS_CLASSES[a.status]}`}>
                        {APPOINTMENT_STATUS_LABELS[a.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center text-xs">
                      {a.review ? (
                        <span className="text-amber-500">{'★'.repeat(a.review.rating)}{'☆'.repeat(5 - a.review.rating)}</span>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <Link href={`/admin/consultas/${a.id}`} className="text-xs text-[#af101a] hover:underline">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
