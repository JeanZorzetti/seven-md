'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCart, clearCart, CartItem } from '@/lib/cart'

interface DeliveryForm {
  name: string
  email: string
  cpf: string
  phone: string
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  startDate: string
  endDate: string
}

const EMPTY: DeliveryForm = {
  name: '', email: '', cpf: '', phone: '',
  cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  startDate: '', endDate: '',
}

function CheckoutForm() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [form, setForm] = useState<DeliveryForm>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cepLoading, setCepLoading] = useState(false)

  useEffect(() => {
    setItems(getCart())
  }, [])

  const set = (field: keyof DeliveryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const lookupCep = async () => {
    const cep = form.cep.replace(/\D/g, '')
    if (cep.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          rua: data.logradouro ?? prev.rua,
          bairro: data.bairro ?? prev.bairro,
          cidade: data.localidade ?? prev.cidade,
          estado: data.uf ?? prev.estado,
        }))
      }
    } finally {
      setCepLoading(false)
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.monthlyPrice * i.quantity, 0)
  const deposit = items.reduce((sum, i) => sum + i.depositAmount * i.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { setError('Carrinho vazio'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout/rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Erro ao processar pedido'); return }
      clearCart()
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        router.push(`/minha-conta/pedidos/${data.orderId}`)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#af101a] focus:outline-none focus:ring-2 focus:ring-[#af101a]/20 transition-colors'

  if (items.length === 0) {
    return (
      <div className="text-center py-24 max-w-md mx-auto">
        <p className="text-gray-500 mb-4">Carrinho vazio.</p>
        <Link href="/equipamentos" className="text-sm font-semibold hover:underline" style={{ color: '#af101a' }}>
          Ver equipamentos →
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
      {/* Left: form */}
      <div className="lg:col-span-2 space-y-8">
        {/* Personal data */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-lg mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>Dados pessoais</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
              <input required type="text" value={form.name} onChange={set('name')} placeholder="Seu nome" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail *</label>
              <input required type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CPF *</label>
              <input required type="text" value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone *</label>
              <input required type="tel" value={form.phone} onChange={set('phone')} placeholder="(00) 00000-0000" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-lg mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>Endereço de entrega</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CEP *</label>
              <input
                required type="text" value={form.cep}
                onChange={set('cep')}
                onBlur={lookupCep}
                placeholder="00000-000"
                className={inputCls}
              />
              {cepLoading && <p className="text-xs text-gray-400 mt-1">Buscando endereço...</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rua *</label>
              <input required type="text" value={form.rua} onChange={set('rua')} placeholder="Nome da rua" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Número *</label>
              <input required type="text" value={form.numero} onChange={set('numero')} placeholder="123" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Complemento</label>
              <input type="text" value={form.complemento} onChange={set('complemento')} placeholder="Apto, bloco..." className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bairro *</label>
              <input required type="text" value={form.bairro} onChange={set('bairro')} placeholder="Bairro" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade *</label>
              <input required type="text" value={form.cidade} onChange={set('cidade')} placeholder="Cidade" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado *</label>
              <input required type="text" maxLength={2} value={form.estado} onChange={set('estado')} placeholder="SP" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Rental period */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-lg mb-5" style={{ fontFamily: 'var(--font-manrope)' }}>Período de locação</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de início *</label>
              <input required type="date" value={form.startDate} onChange={set('startDate')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de devolução prevista *</label>
              <input required type="date" value={form.endDate} onChange={set('endDate')} className={inputCls} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Período mínimo de {Math.max(...items.map((i) => i.minRentalDays))} dias para os equipamentos selecionados.</p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </div>
        )}
      </div>

      {/* Right: order summary */}
      <div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sticky top-24">
          <h2 className="font-bold text-gray-900 mb-4">Resumo</h2>
          <div className="space-y-2 text-sm mb-5">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600">
                <span className="truncate max-w-[160px]">{item.name}</span>
                <span>R$ {item.monthlyPrice.toFixed(2)}</span>
              </div>
            ))}
            {deposit > 0 && (
              <div className="flex justify-between text-gray-400 border-t border-gray-100 pt-2">
                <span>Caução</span>
                <span>R$ {deposit.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-4 mb-5">
            <span>Total</span>
            <span style={{ color: '#af101a' }}>R$ {(subtotal + deposit).toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
          >
            {loading ? 'Processando...' : 'Confirmar pedido →'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Você será redirecionado para o pagamento seguro
          </p>
        </div>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/carrinho" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-manrope)' }}>
          Checkout
        </h1>
      </div>
      <Suspense>
        <CheckoutForm />
      </Suspense>
    </div>
  )
}
