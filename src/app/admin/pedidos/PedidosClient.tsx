'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatCurrency, formatDateTime } from '@/lib/formatting'
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES } from '@/lib/constants'
import TableSkeleton from '@/components/TableSkeleton'

interface Order {
  id: string
  createdAt: string
  status: string
  total: number | string
  paymentUrl: string | null
  user: { name: string; email: string }
  items: { product: { name: string }; quantity: number }[]
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'PENDING_PAYMENT', label: 'Aguardando Pagamento' },
  { value: 'PAID', label: 'Pago' },
  { value: 'IN_DELIVERY', label: 'Em Entrega' },
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'RETURNED', label: 'Devolvido' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export default function PedidosClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ search, status, dateFrom, dateTo, page: page.toString() })
    const res = await fetch(`/api/admin/orders?${params}`)
    if (res.ok) {
      const data = await res.json()
      setOrders(data.orders)
      setTotal(data.total)
      setPages(data.pages)
    }
    setLoading(false)
  }, [search, status, dateFrom, dateTo, page])

  useEffect(() => { setPage(1) }, [search, status, dateFrom, dateTo])
  useEffect(() => { load() }, [load])

  const exportCSV = () => {
    const params = new URLSearchParams({ status, dateFrom, dateTo })
    window.open(`/api/admin/orders/export?${params}`, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text" placeholder="Buscar cliente..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none w-48"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none">
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none" />
        <span className="text-gray-400 text-sm">até</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none" />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-400">{total} pedidos</span>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar CSV
          </button>
          <Link href="/admin/pedidos/novo"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}>
            + Novo pedido
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton cols={7} rows={6} />
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">Nenhum pedido encontrado</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium">#</th>
                <th className="px-6 py-3 text-left font-medium">Cliente</th>
                <th className="px-6 py-3 text-left font-medium">Itens</th>
                <th className="px-6 py-3 text-right font-medium">Total</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Data</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-gray-400">{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-800">{order.user.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs max-w-[180px]">
                    {order.items.map((i) => i.product.name).join(', ').slice(0, 50)}
                    {order.items.map((i) => i.product.name).join(', ').length > 50 ? '…' : ''}
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-800">{formatCurrency(Number(order.total))}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${ORDER_STATUS_CLASSES[order.status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/pedidos/${order.id}`} className="text-xs text-[#af101a] hover:underline font-medium">
                      Ver detalhes
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
