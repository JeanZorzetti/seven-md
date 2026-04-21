import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: 'Aguardando pagamento', color: 'bg-amber-50 text-amber-700' },
  PAID: { label: 'Pago', color: 'bg-blue-50 text-blue-700' },
  IN_DELIVERY: { label: 'Em entrega', color: 'bg-purple-50 text-purple-700' },
  ACTIVE: { label: 'Ativo', color: 'bg-green-50 text-green-700' },
  RETURNED: { label: 'Devolvido', color: 'bg-gray-100 text-gray-500' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-50 text-red-500' },
}

export default async function MinhaContaPage() {
  const session = await getSession()
  if (!session) redirect('/login?next=/minha-conta')

  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { name: true, email: true },
  })

  const [recentOrders, activeOrder] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.id as string },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { items: { include: { product: { select: { name: true } } }, take: 1 } },
    }),
    prisma.order.findFirst({
      where: { userId: session.id as string, status: 'ACTIVE' },
      include: { items: { include: { product: { select: { name: true, images: true } } } } },
    }),
  ])

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>
          Olá, {user?.name?.split(' ')[0] ?? 'Paciente'} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pedidos', value: recentOrders.length, href: '/minha-conta/pedidos', icon: '📦' },
          { label: 'Locação ativa', value: activeOrder ? '1' : '—', href: '/minha-conta/pedidos', icon: '🏥' },
          { label: 'Telemedicina', value: 'Agendar', href: '/plataforma', icon: '👨‍⚕️' },
          { label: 'Suporte', value: 'WhatsApp', href: 'https://wa.me/5511999999999', icon: '💬', external: true },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            target={stat.external ? '_blank' : undefined}
            rel={stat.external ? 'noopener noreferrer' : undefined}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#af101a]/20 transition-all"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>
            <p className="text-lg font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Active rental */}
      {activeOrder && (
        <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>Locação ativa</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700">Ativo</span>
          </div>
          <div className="space-y-2 mb-4">
            {activeOrder.items.map((item) => (
              <p key={item.id} className="text-sm text-gray-700 font-medium">{item.product.name}</p>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Devolução: {new Date(activeOrder.endDate).toLocaleDateString('pt-BR')}</span>
            <Link href={`/minha-conta/pedidos/${activeOrder.id}`} className="font-semibold hover:underline" style={{ color: '#af101a' }}>
              Ver detalhes →
            </Link>
          </div>
        </div>
      )}

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>Pedidos recentes</h2>
            <Link href="/minha-conta/pedidos" className="text-sm font-semibold hover:underline" style={{ color: '#af101a' }}>
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-500' }
              return (
                <Link
                  key={order.id}
                  href={`/minha-conta/pedidos/${order.id}`}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-[#af101a]/20 transition-all"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.items[0]?.product.name ?? 'Pedido'}
                      {order.items.length > 1 ? ` +${order.items.length - 1}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {recentOrders.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500 mb-4">Você ainda não tem pedidos.</p>
          <Link
            href="/equipamentos"
            className="inline-block py-3 px-8 rounded-full font-bold text-sm text-white hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
          >
            Ver equipamentos
          </Link>
        </div>
      )}
    </div>
  )
}
