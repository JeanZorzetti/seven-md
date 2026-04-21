import Link from 'next/link'
import type { ReactNode } from 'react'

export default function MinhaContaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f2f2' }}>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-manrope)', color: '#af101a' }}>
            Seven-MD
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/minha-conta" className="text-gray-600 hover:text-[#af101a] font-medium transition-colors">
              Início
            </Link>
            <Link href="/minha-conta/pedidos" className="text-gray-600 hover:text-[#af101a] font-medium transition-colors">
              Pedidos
            </Link>
            <Link href="/plataforma" className="text-gray-600 hover:text-[#af101a] font-medium transition-colors">
              Telemedicina
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
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
