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

export default async function PedidosPage() {
  const session = await getSession()
  if (!session) redirect('/login?next=/minha-conta/pedidos')

  const orders = await prisma.order.findMany({
    where: { userId: session.id as string },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/minha-conta" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>
          Meus pedidos
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-500 mb-4">Você ainda não tem pedidos.</p>
          <Link
            href="/equipamentos"
            className="inline-block py-3 px-8 rounded-full font-bold text-sm text-white hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
          >
            Ver equipamentos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-500' }
            const deliveryAddr = order.deliveryAddress as { cidade?: string; estado?: string } | null
            return (
              <Link
                key={order.id}
                href={`/minha-conta/pedidos/${order.id}`}
                className="block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#af101a]/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-black text-gray-900 text-base" style={{ fontFamily: 'var(--font-manrope)' }}>
                      Pedido #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                </div>

                <div className="space-y-1.5 mb-4">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-gray-600">
                      {item.quantity}× {item.product.name}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    {deliveryAddr?.cidade && (
                      <span>{deliveryAddr.cidade}, {deliveryAddr.estado}</span>
                    )}
                    <span className="ml-3">
                      {new Date(order.startDate).toLocaleDateString('pt-BR')} → {new Date(order.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="font-black" style={{ color: '#af101a', fontFamily: 'var(--font-manrope)' }}>
                    R$ {Number(order.total).toFixed(2)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
