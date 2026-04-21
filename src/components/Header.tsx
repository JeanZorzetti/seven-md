'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { CartButton } from '@/components/CartDrawer'

const equipamentosLinks = [
  { label: 'Todos os equipamentos', href: '/equipamentos' },
  { label: 'Camas Hospitalares', href: '/equipamentos/categoria/camas-hospitalares' },
  { label: 'Oxigenoterapia', href: '/equipamentos/categoria/oxigenoterapia' },
  { label: 'Mobilidade', href: '/equipamentos/categoria/mobilidade' },
  { label: 'Inalação e Aspiração', href: '/equipamentos/categoria/inalacao-aspiracao' },
  { label: 'Cuidados Diários', href: '/equipamentos/categoria/cuidados-diarios' },
]

const telemedLinks = [
  { label: 'Como funciona', href: '/como-funciona' },
  { label: 'Especialidades', href: '/especialidades' },
  { label: 'Planos', href: '/planos' },
  { label: 'Protocolos', href: '/protocolos' },
  { label: 'Para empresas', href: '/empresas' },
]

const Chevron = ({ className }: { className?: string }) => (
  <svg className={className ?? 'h-3 w-3'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
)

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileEquipOpen, setMobileEquipOpen] = useState(false)
  const [mobileTelemedOpen, setMobileTelemedOpen] = useState(false)
  const [desktopEquipOpen, setDesktopEquipOpen] = useState(false)
  const [desktopTelemedOpen, setDesktopTelemedOpen] = useState(false)

  const equipRef = useRef<HTMLDivElement>(null)
  const telemedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!desktopEquipOpen && !desktopTelemedOpen) return
    const handler = (e: MouseEvent) => {
      if (equipRef.current && !equipRef.current.contains(e.target as Node)) {
        setDesktopEquipOpen(false)
      }
      if (telemedRef.current && !telemedRef.current.contains(e.target as Node)) {
        setDesktopTelemedOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [desktopEquipOpen, desktopTelemedOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const linkCls = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-[#af101a] ${
      isActive(href) ? 'text-[#af101a]' : 'text-gray-600'
    }`

  const dropdownItemCls = (href: string) =>
    `block rounded-md px-3 py-2 text-sm transition-colors hover:bg-red-50 hover:text-[#af101a] ${
      isActive(href) ? 'text-[#af101a] font-medium' : 'text-gray-600'
    }`

  const equipActive = equipamentosLinks.some((l) => isActive(l.href))
  const telemedActive = telemedLinks.some((l) => isActive(l.href))

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Logos/logo seven md4-01.png"
            alt="Seven-MD"
            width={140}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 flex-1">

          <Link href="/" className={linkCls('/')}>Início</Link>

          {/* Equipamentos dropdown */}
          <div className="relative" ref={equipRef}>
            <button
              onClick={() => { setDesktopEquipOpen((o) => !o); setDesktopTelemedOpen(false) }}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-[#af101a] ${equipActive || desktopEquipOpen ? 'text-[#af101a]' : 'text-gray-600'}`}
            >
              Equipamentos
              <Chevron className={`h-3 w-3 transition-transform duration-200 ${desktopEquipOpen ? 'rotate-180' : ''}`} />
            </button>
            {desktopEquipOpen && (
              <div className="absolute left-0 top-full mt-1 min-w-[240px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg z-50">
                {equipamentosLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setDesktopEquipOpen(false)} className={dropdownItemCls(l.href)}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Telemedicina dropdown */}
          <div className="relative" ref={telemedRef}>
            <button
              onClick={() => { setDesktopTelemedOpen((o) => !o); setDesktopEquipOpen(false) }}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-[#af101a] ${telemedActive || desktopTelemedOpen ? 'text-[#af101a]' : 'text-gray-600'}`}
            >
              Telemedicina
              <Chevron className={`h-3 w-3 transition-transform duration-200 ${desktopTelemedOpen ? 'rotate-180' : ''}`} />
            </button>
            {desktopTelemedOpen && (
              <div className="absolute left-0 top-full mt-1 min-w-[200px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg z-50">
                {telemedLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setDesktopTelemedOpen(false)} className={dropdownItemCls(l.href)}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/sobre" className={linkCls('/sobre')}>Sobre</Link>
          <Link href="/contato" className={linkCls('/contato')}>Contato</Link>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <CartButton />
          <Link
            href="/login"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-[#af101a] hover:text-[#af101a]"
          >
            Entrar
          </Link>
          <Link
            href="/equipamentos"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ background: 'linear-gradient(to bottom right, #af101a, #d32f2f)' }}
          >
            Alugar equipamento
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-1 text-gray-600 hover:text-[#af101a] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50">Início</Link>

            {/* Equipamentos accordion */}
            <button
              onClick={() => setMobileEquipOpen(!mobileEquipOpen)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Equipamentos
              <Chevron className={`h-4 w-4 transition-transform ${mobileEquipOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileEquipOpen && equipamentosLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 pl-6 text-sm text-gray-500 hover:bg-gray-50">
                {l.label}
              </Link>
            ))}

            {/* Telemedicina accordion */}
            <button
              onClick={() => setMobileTelemedOpen(!mobileTelemedOpen)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Telemedicina
              <Chevron className={`h-4 w-4 transition-transform ${mobileTelemedOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileTelemedOpen && telemedLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 pl-6 text-sm text-gray-500 hover:bg-gray-50">
                {l.label}
              </Link>
            ))}

            <Link href="/sobre" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50">Sobre</Link>
            <Link href="/contato" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50">Contato</Link>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700">
              Entrar
            </Link>
            <Link
              href="/equipamentos"
              onClick={() => setMobileOpen(false)}
              className="block text-center rounded-full px-4 py-2.5 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(to bottom right, #af101a, #d32f2f)' }}
            >
              Alugar equipamento
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
