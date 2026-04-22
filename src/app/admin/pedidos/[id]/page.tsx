import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatting'
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES, ORDER_STATUS_NEXT } from '@/lib/constants'
import PedidoActions from './PedidoActions'
import Link from 'next/link'

const STATUS_ORDER = ['PENDING_PAYMENT', 'PAID', 'IN_DELIVERY', 'ACTIVE', 'RETURNED']

export default async function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, cpf: true } },
      items: { include: { product: { select: { id: true, name: true, images: true, slug: true } } } },
    },
  })
  if (!order) notFound()

  const addr = order.deliveryAddress as Record<string, string>
  const nextStatus = ORDER_STATUS_NEXT[order.status]
  const currentStepIndex = STATUS_ORDER.indexOf(order.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/pedidos" className="text-sm text-gray-400 hover:text-[#af101a] transition-colors">← Pedidos</Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Pedido #{order.id.slice(-8).toUpperCase()}
          </h2>
          <p className="text-gray-500 text-sm">{formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${ORDER_STATUS_CLASSES[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Status timeline */}
      {order.status !== 'CANCELLED' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Linha do tempo</h3>
          <div className="flex items-center gap-0">
            {STATUS_ORDER.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                  i < currentStepIndex ? 'bg-[#af101a] text-white' :
                  i === currentStepIndex ? 'bg-[#af101a] text-white ring-4 ring-red-100' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i < currentStepIndex ? '✓' : i + 1}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-xs font-medium whitespace-nowrap ${i <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                    {ORDER_STATUS_LABELS[s]}
                  </p>
                </div>
                {i < STATUS_ORDER.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-[#af101a]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Itens do pedido</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  {item.product.images[0] ? (
                    <img src={item.product.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qtd: {item.quantity} · {formatCurrency(Number(item.unitPrice))}/mês</p>
                  </div>
                  <p className="font-semibold text-gray-900 flex-shrink-0">{formatCurrency(Number(item.subtotal))}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Período</span>
                <span>{formatDate(order.startDate)} → {formatDate(order.endDate)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(order.subtotal))}</span>
              </div>
              {Number(order.deliveryFee) > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Entrega</span>
                  <span>{formatCurrency(Number(order.deliveryFee))}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-1">
                <span>Total</span>
                <span>{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Cliente</h3>
            <div className="space-y-1.5 text-sm">
              <p className="font-medium text-gray-900">{order.user.name}</p>
              <p className="text-gray-500">{order.user.email}</p>
              {order.user.phone && <p className="text-gray-500">{order.user.phone}</p>}
              {order.user.cpf && <p className="text-gray-400 font-mono text-xs">{order.user.cpf}</p>}
            </div>
            <Link href={`/admin/clientes/${order.user.id}`} className="text-xs text-[#af101a] hover:underline font-medium mt-3 inline-block">
              Ver perfil →
            </Link>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Endereço de entrega</h3>
            <div className="text-sm text-gray-500 space-y-0.5">
              <p>{addr.rua}{addr.numero ? `, ${addr.numero}` : ''}</p>
              {addr.complemento && <p>{addr.complemento}</p>}
              <p>{addr.bairro}</p>
              <p>{addr.cidade} — {addr.estado}</p>
              <p className="font-mono text-xs">{addr.cep}</p>
            </div>
          </div>

          {/* Payment + actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Pagamento e ações</h3>
            {order.paymentUrl && (
              <a href={order.paymentUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Abrir link de pagamento
              </a>
            )}
            <PedidoActions
              orderId={order.id}
              currentStatus={order.status}
              nextStatus={nextStatus}
              hasPaymentUrl={!!order.asaasPaymentId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
