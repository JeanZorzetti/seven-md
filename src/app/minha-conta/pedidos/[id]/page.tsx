import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

const STATUS_STEPS = [
  { key: 'PENDING_PAYMENT', label: 'Aguardando pagamento' },
  { key: 'PAID', label: 'Pago' },
  { key: 'IN_DELIVERY', label: 'Em entrega' },
  { key: 'ACTIVE', label: 'Ativo' },
  { key: 'RETURNED', label: 'Devolvido' },
]

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: 'Aguardando pagamento', color: 'bg-amber-50 text-amber-700' },
  PAID: { label: 'Pago', color: 'bg-blue-50 text-blue-700' },
  IN_DELIVERY: { label: 'Em entrega', color: 'bg-purple-50 text-purple-700' },
  ACTIVE: { label: 'Ativo', color: 'bg-green-50 text-green-700' },
  RETURNED: { label: 'Devolvido', color: 'bg-gray-100 text-gray-500' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-50 text-red-500' },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getSession()
  if (!session) redirect(`/login?next=/minha-conta/pedidos/${id}`)

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { select: { name: true, slug: true, images: true } } },
      },
    },
  })

  if (!order || order.userId !== (session.id as string)) notFound()

  const st = STATUS_LABEL[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-500' }
  const deliveryAddr = order.deliveryAddress as Record<string, string> | null
  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status)

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/minha-conta/pedidos" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>
          Pedido #{order.id.slice(-8).toUpperCase()}
        </h1>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status timeline */}
          {order.status !== 'CANCELLED' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-5">Acompanhamento</h2>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStepIdx
                  const active = i === currentStepIdx
                  return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                          active ? 'text-white border-[#af101a]' :
                          done ? 'text-white border-green-500' :
                          'text-gray-300 border-gray-200 bg-white'
                        }`} style={active ? { background: '#af101a' } : done ? { background: '#22c55e' } : {}}>
                          {done && !active ? '✓' : i + 1}
                        </div>
                        <p className={`text-[10px] text-center mt-1 max-w-[60px] leading-tight ${done ? 'text-gray-700 font-medium' : 'text-gray-300'}`}>
                          {step.label}
                        </p>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 transition-colors ${i < currentStepIdx ? 'bg-green-400' : 'bg-gray-100'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Payment link */}
          {order.status === 'PENDING_PAYMENT' && order.paymentUrl && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="font-semibold text-amber-800 mb-3">Pagamento pendente</p>
              <a
                href={order.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-3 px-6 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
              >
                Pagar agora →
              </a>
            </div>
          )}

          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Equipamentos</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    {item.product.images[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: '#af101a' }}>
                      R$ {Number(item.subtotal).toFixed(2)}/mês
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Período de locação</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Início</span>
                <span>{new Date(order.startDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Devolução</span>
                <span>{new Date(order.endDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {deliveryAddr && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Endereço de entrega</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {deliveryAddr.rua}, {deliveryAddr.numero}
                {deliveryAddr.complemento ? `, ${deliveryAddr.complemento}` : ''}
                <br />{deliveryAddr.bairro}
                <br />{deliveryAddr.cidade} — {deliveryAddr.estado}
                <br />CEP: {deliveryAddr.cep}
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Resumo financeiro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal mensal</span>
                <span>R$ {Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>R$ {Number(order.deliveryFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2" style={{ color: '#af101a' }}>
                <span>Total</span>
                <span>R$ {Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
