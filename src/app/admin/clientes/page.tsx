'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatCurrency, formatDate, maskCpf } from '@/lib/formatting'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
  orderCount: number
  totalSpent: number
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ search, page: page.toString() })
    const res = await fetch(`/api/admin/customers?${params}`)
    if (res.ok) {
      const data = await res.json()
      setCustomers(data.customers)
      setTotal(data.total)
      setPages(data.pages)
    }
    setLoading(false)
  }, [search, page])

  useEffect(() => { setPage(1) }, [search])
  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-500 text-sm mt-1">{total} clientes cadastrados</p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          type="text" placeholder="Buscar por nome ou e-mail..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none w-72"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">Carregando...</div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-gray-400">Nenhum cliente encontrado</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">Cliente</th>
                <th className="px-6 py-3 text-left font-medium">Telefone</th>
                <th className="px-6 py-3 text-center font-medium">Pedidos</th>
                <th className="px-6 py-3 text-right font-medium">Total gasto</th>
                <th className="px-6 py-3 text-left font-medium">Cadastro</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-sm">{c.phone ?? '—'}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.orderCount > 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                      {c.orderCount}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-800">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-6 py-3 text-gray-400 text-xs">{formatDate(c.createdAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/clientes/${c.id}`} className="text-xs text-[#af101a] hover:underline font-medium">
                      Ver perfil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40">← Anterior</button>
          <span className="text-sm text-gray-500">Página {page} de {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40">Próxima →</button>
        </div>
      )}
    </div>
  )
}
