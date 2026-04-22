import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import AdminShell from './AdminShell'

export const metadata = {
  title: 'Admin | Seven-MD',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect('/login')

  return <AdminShell>{children}</AdminShell>
}
