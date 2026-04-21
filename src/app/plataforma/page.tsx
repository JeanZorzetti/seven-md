import { getPatientSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasActiveSubscription } from '@/lib/subscription'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/plataforma/StatusBadge'
import OnboardingProgress from '@/components/plataforma/OnboardingProgress'
import { SpecialistPreviewCard } from '@/components/plataforma/ConversionModal'
import DashboardNudges from '@/components/plataforma/DashboardNudges'
import TestimonialsCarousel from '@/components/plataforma/TestimonialsCarousel'

// ---------------------------------------------------------------------------
// Preview dashboard for users without an active subscription
// ---------------------------------------------------------------------------
function PreviewDashboard({ firstName }: { firstName: string }) {

  const specialists = [
    {
      name: 'Dra. Ana Paula Ferreira',
      specialty: 'Cardiologia',
      crm: 'CRM/SC 12.847',
      rating: '4.9',
    },
    {
      name: 'Dr. Rafael Costa',
      specialty: 'Psicologia',
      crm: 'CRM/SC 8.432',
      rating: '4.8',
    },
    {
      name: 'Dra. Mariana Lima',
      specialty: 'Clínica Geral',
      crm: 'CRM/SC 15.219',
      rating: '5.0',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#af101a]">
          Olá, {firstName}! Bem-vindo à sua plataforma de saúde
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Explore o que te espera com um plano ativo
        </p>
      </div>

      {/* Onboarding progress bar (client component — reads localStorage) */}
      <OnboardingProgress />

      {/* Stats blurred/locked */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Próxima consulta', value: '—' },
          { label: 'Total de consultas', value: '0' },
          { label: 'Concluídas', value: '0' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative bg-white rounded-2xl border border-gray-200 p-5 overflow-hidden"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-[#af101a] mt-2 blur-sm select-none">
              {stat.value}
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Big CTA banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#af101a] to-[#af101a] p-6 text-white">
        <p className="text-lg font-bold mb-1">
          Você está a 1 passo de consultar com +30 especialistas
        </p>
        <p className="text-sm text-white/80 mb-4">
          Ative seu plano e agende sua primeira consulta hoje mesmo — sem carência.
        </p>
        <Link
          href="/planos"
          className="inline-flex items-center gap-2 rounded-xl bg-white text-[#af101a] px-5 py-2.5 text-sm font-semibold hover:bg-[#fff2f0] transition-colors"
        >
          Conhecer planos →
        </Link>
      </div>

      {/* Social proof — prominent counter */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#fff2f0] border border-[#ffdad6] px-5 py-3 text-sm">
        <span className="flex items-center gap-1.5 font-medium text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
          Atendimento ativo agora
        </span>
        <span className="text-[#ffdad6] hidden sm:inline">|</span>
        <span className="flex items-center gap-1 text-[#af101a] font-semibold">
          +45.000 pacientes atendidos
        </span>
        <span className="text-[#ffdad6] hidden sm:inline">|</span>
        <span className="flex items-center gap-1 text-[#af101a] font-semibold">
          <span className="text-yellow-500">★</span> 4.8 média
        </span>
        <span className="text-[#ffdad6] hidden sm:inline">|</span>
        <span className="text-[#af101a] font-semibold">Regulamentado pelo CFM</span>
      </div>

      {/* Specialist preview cards — clicking "Agendar" opens conversion modal */}
      <div>
        <h2 className="text-lg font-semibold text-[#af101a] mb-3">
          Especialistas disponíveis para você
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {specialists.map((doc) => (
            <SpecialistPreviewCard key={doc.name} {...doc} />
          ))}
        </div>
      </div>

      {/* Health Insights — blurred premium section */}
      <div>
        <h2 className="text-lg font-semibold text-[#af101a] mb-3">
          Seus Insights de Saúde
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1 — visible */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-9 h-9 rounded-xl bg-[#fff2f0] flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#af101a] mb-1">Recomendação Preventiva</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Baseado no seu perfil, recomendamos um check-up preventivo anual com clínico geral.
            </p>
          </div>

          {/* Card 2 — blurred + lock */}
          <div className="relative bg-white rounded-2xl border border-gray-200 p-5 overflow-hidden">
            <div className="filter blur-[4px] select-none pointer-events-none">
              <div className="w-9 h-9 rounded-xl bg-[#fff2f0] flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#af101a] mb-1">Fatores de Risco</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                2 fatores de risco identificados no seu perfil de saúde
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30">
              <svg className="w-6 h-6 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Card 3 — blurred + lock */}
          <div className="relative bg-white rounded-2xl border border-gray-200 p-5 overflow-hidden">
            <div className="filter blur-[4px] select-none pointer-events-none">
              <div className="w-9 h-9 rounded-xl bg-[#fff2f0] flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#af101a] mb-1">Recomendação Personalizada</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Recomendação personalizada de especialista disponível
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30">
              <svg className="w-6 h-6 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          <a href="/planos" className="text-[#af101a] font-medium hover:underline">
            Desbloqueie todos os insights com seu plano →
          </a>
        </p>
      </div>

      {/* Testimonials carousel */}
      <TestimonialsCarousel />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Full dashboard for active subscribers
// ---------------------------------------------------------------------------
export default async function DashboardPage() {
  const session = await getPatientSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true },
  })

  const firstName = user?.name?.split(' ')[0] ?? 'Paciente'
  const isSubscriber = await hasActiveSubscription(session.id)

  if (!isSubscriber) {
    return <PreviewDashboard firstName={firstName} />
  }

  // --- Active subscriber: real dashboard ---
  const now = new Date()

  const [upcoming, totalCount, completedCount, lastCompleted, unreviewedCompleted] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        userId: session.id,
        dateTime: { gte: now },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      orderBy: { dateTime: 'asc' },
      take: 3,
    }),
    prisma.appointment.count({ where: { userId: session.id } }),
    prisma.appointment.count({ where: { userId: session.id, status: 'COMPLETED' } }),
    // Last appointment (any status) to check inactivity
    prisma.appointment.findFirst({
      where: { userId: session.id },
      orderBy: { dateTime: 'desc' },
      select: { dateTime: true },
    }),
    // Completed appointments without a review
    prisma.appointment.findFirst({
      where: { userId: session.id, status: 'COMPLETED', review: null },
      select: { id: true },
    }),
  ])

  const nextAppt = upcoming[0]

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const lastAppointmentDate = lastCompleted?.dateTime?.toISOString() ?? null
  const hasUnreviewedCompleted = !!unreviewedCompleted

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#af101a]">Olá, {firstName}!</h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vindo à sua plataforma de saúde</p>
      </div>

      {/* Contextual nudges for subscribers */}
      <DashboardNudges
        totalCount={totalCount}
        lastAppointmentDate={lastAppointmentDate}
        hasUnreviewedCompleted={hasUnreviewedCompleted}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Próxima consulta</p>
          {nextAppt ? (
            <div className="mt-2">
              <p className="text-lg font-bold text-[#af101a]">{fmtDate(nextAppt.dateTime)}</p>
              <p className="text-sm text-gray-500">{fmtTime(nextAppt.dateTime)} — {nextAppt.specialty}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mt-2">Nenhuma agendada</p>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total de consultas</p>
          <p className="text-3xl font-bold text-[#af101a] mt-2">{totalCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Concluídas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedCount}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/plataforma/agendar"
          className="inline-flex items-center gap-2 rounded-xl bg-[#af101a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agendar consulta
        </Link>
        <Link
          href="/plataforma/consultas"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Ver histórico
        </Link>
      </div>

      {/* Upcoming appointments */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#af101a] mb-3">Próximas consultas</h2>
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#fff2f0] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{appt.specialty}</p>
                    <p className="text-xs text-gray-500">
                      {fmtDate(appt.dateTime)} às {fmtTime(appt.dateTime)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {totalCount === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <div className="w-14 h-14 bg-[#fff2f0] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#af101a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#af101a]">Nenhuma consulta ainda</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Agende sua primeira consulta e comece a cuidar da sua saúde
          </p>
          <Link
            href="/plataforma/agendar"
            className="inline-flex items-center gap-2 rounded-xl bg-[#af101a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#af101a] transition-colors"
          >
            Agendar primeira consulta
          </Link>
        </div>
      )}
    </div>
  )
}
