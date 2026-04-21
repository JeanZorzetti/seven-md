'use client'

import { useState } from 'react'
import Sidebar from '@/components/plataforma/Sidebar'
import PlataformaHeader from '@/components/plataforma/PlataformaHeader'
import TrustBar from '@/components/plataforma/TrustBar'
import HealthQuestionnaire from '@/components/plataforma/HealthQuestionnaire'

export default function PlataformaShell({
  name,
  isSubscriber,
  children,
}: {
  name: string
  isSubscriber: boolean
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <HealthQuestionnaire />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isSubscriber={isSubscriber}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <PlataformaHeader name={name} onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        <TrustBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
