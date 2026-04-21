'use client'

import { useRouter } from 'next/navigation'

export default function PlataformaHeader({
  name,
  onToggleSidebar,
}: {
  name: string
  onToggleSidebar: () => void
}) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#af101a] text-white rounded-full flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700">{name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-2"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
