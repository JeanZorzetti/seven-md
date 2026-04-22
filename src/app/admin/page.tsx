import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency, formatDateTime } from '@/lib/formatting'
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES } from '@/lib/constants'
import { PLAN_PRICES } from '@/lib/plans'

export default async function AdminDashboard() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalClients,
    ordersThisMonth,
    activeRentals,
    newClientsThisMonth,
    recentOrders,
    topProducts,
    activeSubscriptions,
    appointmentsThisMonth,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'PATIENT' } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: { in: ['PAID', 'IN_DELIVERY', 'ACTIVE', 'RETURNED'] },
      },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({
      where: { createdAt: { gte: startOfMonth }, role: 'PATIENT' },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, items: { include: { product: { select: { name: true } } } } },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.subscription.findMany({ where: { status: 'ACTIVE' }, select: { plan: true } }),
    prisma.appointment.count({ where: { createdAt: { gte: startOfMonth } } }),
  ])

  const mrr = activeSubscriptions.reduce((sum, s) => sum + (PLAN_PRICES[s.plan] ?? 0), 0)

  const topProductIds = topProducts.map((p) => p.productId)
  const topProductNames = topProductIds.length > 0
    ? await prisma.product.findMany({ where: { id: { in: topProductIds } }, select: { id: true, name: true } })
    : []
  const productNameMap = Object.fromEntries(topProductNames.map((p) => [p.id, p.name]))

  const stats = [
    {
      label: 'Faturamento do Mês',
      value: formatCurrency(Number(ordersThisMonth._sum.total ?? 0)),
      sub: `${ordersThisMonth._count} pedidos pagos`,
      color: 'bg-[#af101a]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Aluguéis Ativos',
      value: activeRentals.toString(),
      sub: 'equipamentos em uso',
      color: 'bg-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total de Clientes',
      value: totalClients.toString(),
      sub: `+${newClientsThisMonth} este mês`,
      color: 'bg-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Pedidos do Mês',
      value: ordersThisMonth._count.toString(),
      sub: 'desde ' + startOfMonth.toLocaleDateString('pt-BR'),
      color: 'bg-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'MRR Telemedicina',
      value: formatCurrency(mrr),
      sub: `${activeSubscriptions.length} assinante(s) ativo(s)`,
      color: 'bg-rose-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      label: 'Consultas do Mês',
      value: appointmentsThisMonth.toString(),
      sub: 'desde ' + startOfMonth.toLocaleDateString('pt-BR'),
      color: 'bg-teal-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Visão geral — Seven-MD Equipamentos</p>
        </div>
        <Link
          href="/admin/pedidos/novo"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo pedido
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
              <div className={`${stat.color} text-white p-2.5 rounded-xl flex-shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Pedidos Recentes</h3>
            <Link href="/admin/pedidos" className="text-xs text-[#af101a] hover:underline font-medium">
              Ver todos →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-left font-medium">Cliente</th>
                  <th className="px-6 py-3 text-left font-medium">Itens</th>
                  <th className="px-6 py-3 text-left font-medium">Total</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                      Nenhum pedido ainda
                    </td>
                  </tr>
                ) : recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-800 truncate max-w-[140px]">{order.user.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[140px]">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {order.items.map((i) => i.product.name).join(', ').slice(0, 40)}
                      {order.items.map((i) => i.product.name).join(', ').length > 40 ? '…' : ''}
                    </td>
                    <td className="px-6 py-3 font-semibold text-gray-800">{formatCurrency(Number(order.total))}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${ORDER_STATUS_CLASSES[order.status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDateTime(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Top Produtos (30d)</h3>
            <Link href="/admin/produtos" className="text-xs text-[#af101a] hover:underline font-medium">
              Ver todos →
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">Sem dados ainda</p>
            ) : topProducts.map((item, i) => (
              <div key={item.productId} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {productNameMap[item.productId] ?? item.productId}
                  </p>
                  <p className="text-xs text-gray-400">{item._sum.quantity ?? 0} locações</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
