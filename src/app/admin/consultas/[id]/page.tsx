import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDateTime } from '@/lib/formatting'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_CLASSES, APPOINTMENT_STATUS_NEXT } from '@/lib/constants'
import ConsultaActions from '../ConsultaActions'

const STATUS_ORDER = ['SCHEDULED', 'CONFIRMED', 'COMPLETED']

export default async function ConsultaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      review: true,
    },
  })
  if (!appointment) notFound()

  const nextStatus = APPOINTMENT_STATUS_NEXT[appointment.status]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/consultas" className="text-sm text-gray-400 hover:text-[#af101a]">← Consultas</Link>
        <h2 className="text-2xl font-bold text-gray-900">Consulta #{appointment.id.slice(-8).toUpperCase()}</h2>
        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${APPOINTMENT_STATUS_CLASSES[appointment.status]}`}>
          {APPOINTMENT_STATUS_LABELS[appointment.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Progresso</h3>
            <div className="flex items-center gap-2">
              {STATUS_ORDER.map((s, i) => {
                const done = STATUS_ORDER.indexOf(appointment.status) > i
                const active = appointment.status === s
                const cancelled = appointment.status === 'CANCELLED'
                return (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      cancelled && active ? 'bg-red-500 text-white' :
                      done ? 'bg-[#af101a] text-white' :
                      active ? 'bg-[#af101a] text-white ring-4 ring-red-100' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                      {APPOINTMENT_STATUS_LABELS[s]}
                    </span>
                    {i < STATUS_ORDER.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
                  </div>
                )
              })}
            </div>
            {appointment.status === 'CANCELLED' && (
              <p className="mt-3 text-sm text-red-500 font-medium">Consulta cancelada</p>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Detalhes</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Data/Hora', value: formatDateTime(appointment.dateTime) },
                { label: 'Especialidade', value: appointment.specialty },
                { label: 'Médico', value: appointment.doctorName ?? 'Não informado' },
                { label: 'Agendado em', value: formatDateTime(appointment.createdAt) },
              ].map((row) => (
                <div key={row.label}>
                  <span className="text-gray-500 block">{row.label}</span>
                  <span className="font-medium text-gray-800">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review */}
          {appointment.review && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Avaliação do paciente</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-400 text-lg">{'★'.repeat(appointment.review.rating)}{'☆'.repeat(5 - appointment.review.rating)}</span>
                <span className="text-sm font-semibold text-gray-700">{appointment.review.rating}/5</span>
              </div>
              {appointment.review.comment && (
                <p className="text-sm text-gray-600 italic">"{appointment.review.comment}"</p>
              )}
            </div>
          )}
        </div>

        {/* Right: patient + actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Paciente</h3>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-gray-800">{appointment.user.name}</p>
              <p className="text-gray-500 text-xs">{appointment.user.email}</p>
              {appointment.user.phone && <p className="text-gray-500 text-xs">{appointment.user.phone}</p>}
              <Link href={`/admin/pacientes/${appointment.user.id}`} className="inline-block mt-2 text-xs text-[#af101a] hover:underline">
                Ver perfil do paciente →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Ações</h3>
            <ConsultaActions
              appointmentId={appointment.id}
              currentStatus={appointment.status}
              notes={appointment.notes}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
