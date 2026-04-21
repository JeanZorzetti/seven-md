import { getPatientSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasActiveSubscription } from '@/lib/subscription'
import { redirect } from 'next/navigation'
import DoctorCard from '@/components/plataforma/DoctorCard'

export default async function MedicosPage() {
  const session = await getPatientSession()
  if (!session) redirect('/login')

  const [doctors, isSubscriber] = await Promise.all([
    prisma.doctor.findMany({
      where: { available: true },
      select: {
        id: true,
        name: true,
        specialty: true,
        crm: true,
        state: true,
        bio: true,
        rating: true,
        reviewCount: true,
        available: true,
      },
      orderBy: { rating: 'desc' },
    }),
    hasActiveSubscription(session.id),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#af101a]">Nossos Médicos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Profissionais certificados com CRM ativo prontos para atendê-lo
        </p>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-gray-500 text-sm">Nenhum médico disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} isSubscriber={isSubscriber} />
          ))}
        </div>
      )}
    </div>
  )
}
