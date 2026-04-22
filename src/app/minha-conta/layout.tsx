import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

export default function MinhaContaLayout({ children }: { children: ReactNode }) {
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
