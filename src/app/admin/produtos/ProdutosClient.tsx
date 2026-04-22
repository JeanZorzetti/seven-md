'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/formatting'
import TableSkeleton from '@/components/TableSkeleton'
import { toast } from '@/components/Toast'

interface Category { id: string; name: string }
interface Product {
  id: string
  name: string
  slug: string
  monthlyPrice: number | string
  stock: number
  active: boolean
  images: string[]
  category: { name: string }
}

export default function ProdutosClient({ categories }: { categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [active, setActive] = useState('all')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      search, categoryId, page: page.toString(),
      ...(active !== 'all' ? { active } : {}),
    })
    const res = await fetch(`/api/admin/products?${params}`)
    if (res.ok) {
      const data = await res.json()
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    }
    setLoading(false)
  }, [search, categoryId, active, page])

  useEffect(() => { setPage(1) }, [search, categoryId, active])
  useEffect(() => { load() }, [load])

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Arquivar "${name}"?`)) return
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    })
    if (res.ok) toast(`"${name}" arquivado`)
    else toast('Erro ao arquivar produto', 'error')
    load()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none w-56"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none"
        >
          <option value="">Todas categorias</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none"
        >
          <option value="all">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Arquivados</option>
        </select>
        <span className="ml-auto text-sm text-gray-400 self-center">{total} produtos</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton cols={6} rows={6} />
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 mb-3">Nenhum produto encontrado</p>
            <Link href="/admin/produtos/novo" className="text-sm text-[#af101a] font-semibold hover:underline">Criar produto</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">Produto</th>
                <th className="px-6 py-3 text-left font-medium">Categoria</th>
                <th className="px-6 py-3 text-right font-medium">Preço/mês</th>
                <th className="px-6 py-3 text-center font-medium">Estoque</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{p.category.name}</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-800">{formatCurrency(Number(p.monthlyPrice))}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${p.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${p.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                      {p.active ? 'Ativo' : 'Arquivado'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/produtos/${p.id}`} className="text-xs text-[#af101a] hover:underline font-medium">Editar</Link>
                      {p.active && (
                        <button onClick={() => handleArchive(p.id, p.name)} className="text-xs text-red-400 hover:text-red-600 hover:underline font-medium">
                          Arquivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40">
            ← Anterior
          </button>
          <span className="text-sm text-gray-500">Página {page} de {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40">
            Próxima →
          </button>
        </div>
      )}
    </div>
  )
}
