import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate, formatDateTime, maskCpf } from '@/lib/formatting'
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES } from '@/lib/constants'

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, cpf: true, createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: { select: { name: true } } } } },
      },
    },
  })
  if (!user) notFound()

  const totalSpent = user.orders.reduce((s, o) => s + Number(o.total), 0)
  const activeOrders = user.orders.filter((o) => o.status === 'ACTIVE').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/clientes" className="text-sm text-gray-400 hover:text-[#af101a]">← Clientes</Link>
        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Dados</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">E-mail</span>
                <span className="font-medium text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Telefone</span>
                <span className="font-medium text-gray-800">{user.phone ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">CPF</span>
                <span className="font-mono text-xs text-gray-600">{maskCpf(user.cpf)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cadastro</span>
                <span className="text-gray-800">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-3 gap-3">
            {[
              { label: 'Pedidos', value: user.orders.length },
              { label: 'Ativos', value: activeOrders },
              { label: 'Total', value: formatCurrency(totalSpent) },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Histórico de pedidos</h3>
          </div>
          {user.orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Sem pedidos</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-left font-medium">#</th>
                  <th className="px-6 py-3 text-left font-medium">Itens</th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Data</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {user.orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-400">{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-3 text-gray-500 text-xs max-w-[180px] truncate">
                      {order.items.map((i) => i.product.name).join(', ')}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold">{formatCurrency(Number(order.total))}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${ORDER_STATUS_CLASSES[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">{formatDateTime(order.createdAt)}</td>
                    <td className="px-6 py-3">
                      <Link href={`/admin/pedidos/${order.id}`} className="text-xs text-[#af101a] hover:underline">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
