import { redirect } from 'next/navigation'
// import { getPatientSession } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'
// import { hasActiveSubscription } from '@/lib/subscription'
// import PlataformaShell from './PlataformaShell'

export const metadata = {
  title: 'Plataforma | Seven-MD',
}

export default async function PlataformaLayout({ children }: { children: React.ReactNode }) {
  redirect('/equipamentos')
  return <>{children}</>
}
