'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ORDER_STATUS_LABELS } from '@/lib/constants'

export default function PedidoActions({
  orderId,
  currentStatus,
  nextStatus,
  hasPaymentUrl,
}: {
  orderId: string
  currentStatus: string
  nextStatus: string | null
  hasPaymentUrl: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const advanceStatus = async () => {
    if (!nextStatus || !confirm(`Avançar para "${ORDER_STATUS_LABELS[nextStatus]}"?`)) return
    setLoading('advance')
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      const d = await res.json()
      setMsg(d.error ?? 'Erro ao atualizar status')
    }
    setLoading(null)
  }

  const cancelOrder = async () => {
    if (!confirm('Cancelar este pedido?')) return
    setLoading('cancel')
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      const d = await res.json()
      setMsg(d.error ?? 'Erro ao cancelar')
    }
    setLoading(null)
  }

  const resendPayment = async () => {
    setLoading('resend')
    setMsg('')
    const res = await fetch(`/api/admin/orders/${orderId}/resend-payment`, { method: 'POST' })
    const d = await res.json()
    if (res.ok) {
      setMsg('Novo link gerado!')
      router.refresh()
    } else {
      setMsg(d.error ?? 'Erro ao reenviar')
    }
    setLoading(null)
  }

  const done = currentStatus === 'RETURNED' || currentStatus === 'CANCELLED'

  return (
    <div className="space-y-2">
      {nextStatus && !done && (
        <button
          onClick={advanceStatus}
          disabled={!!loading}
          className="w-full py-2 px-4 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
        >
          {loading === 'advance' ? 'Atualizando...' : `Avançar → ${ORDER_STATUS_LABELS[nextStatus]}`}
        </button>
      )}

      <button
        onClick={resendPayment}
        disabled={!!loading}
        className="w-full py-2 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        {loading === 'resend' ? 'Gerando...' : 'Reenviar link de pagamento'}
      </button>

      {!done && (
        <button
          onClick={cancelOrder}
          disabled={!!loading}
          className="w-full py-2 px-4 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-60"
        >
          {loading === 'cancel' ? 'Cancelando...' : 'Cancelar pedido'}
        </button>
      )}

      {msg && (
        <p className={`text-xs px-3 py-2 rounded-lg ${msg.includes('gerado') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </p>
      )}
    </div>
  )
}
