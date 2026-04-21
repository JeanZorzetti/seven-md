import { redirect } from 'next/navigation'
import { getPatientSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasActiveSubscription } from '@/lib/subscription'
import PlataformaShell from './PlataformaShell'

export const metadata = {
  title: 'Plataforma | Seven-MD Telemedicina',
}

export default async function PlataformaLayout({ children }: { children: React.ReactNode }) {
  const session = await getPatientSession()
  if (!session) redirect('/login')

  const [user, isSubscriber] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
      select: { name: true },
    }),
    hasActiveSubscription(session.id),
  ])

  return (
    <PlataformaShell name={user?.name ?? 'Paciente'} isSubscriber={isSubscriber}>
      {children}
    </PlataformaShell>
  )
}
