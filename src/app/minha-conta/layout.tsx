import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { getSession } from '@/lib/auth'

export default async function MinhaContaLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  const isAdmin = session?.role === 'ADMIN' || session?.role === 'SUPER_ADMIN'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f2f2' }}>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/Logos/logo seven md4-01.png"
              alt="Seven-MD"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {/* Equipamentos */}
            <div className="hidden sm:flex items-center gap-1 pr-3 mr-3 border-r border-gray-200">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Equipamentos</span>
              <Link href="/minha-conta" className="rounded-md px-3 py-1.5 text-gray-600 hover:text-[#af101a] hover:bg-red-50 font-medium transition-colors">
                Painel
              </Link>
              <Link href="/minha-conta/pedidos" className="rounded-md px-3 py-1.5 text-gray-600 hover:text-[#af101a] hover:bg-red-50 font-medium transition-colors">
                Pedidos
              </Link>
            </div>

            {/* Telemedicina */}
            <Link
              href="/plataforma"
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-[#005f7b] hover:text-[#005f7b] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              Telemedicina
            </Link>

            {/* Admin button — only for ADMIN/SUPER_ADMIN */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-full border border-[#af101a] px-3 py-1.5 text-xs font-semibold text-[#af101a] hover:bg-red-50 transition-colors ml-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>
            )}

            <form action="/api/auth/logout" method="POST" className="ml-2">
              <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
