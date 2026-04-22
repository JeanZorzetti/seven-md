'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/formatting'

interface Product { id: string; name: string; monthlyPrice: number | string; category: { name: string } }
interface CartItem { product: Product; quantity: number }

export default function NovoPedidoPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ orderId: string; paymentUrl: string | null } | null>(null)

  const [customer, setCustomer] = useState({ name: '', email: '', cpf: '', phone: '' })
  const [addr, setAddr] = useState({ cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' })
  const [dates, setDates] = useState({ startDate: '', endDate: '' })

  useEffect(() => {
    fetch('/api/admin/products?active=true&limit=100')
      .then((r) => r.ok ? r.json() : { products: [] })
      .then((d) => setProducts(d.products ?? []))
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => setCart((prev) => prev.filter((i) => i.product.id !== productId))
  const cartTotal = cart.reduce((s, i) => s + Number(i.product.monthlyPrice) * i.quantity, 0)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customer.name,
        customerEmail: customer.email,
        customerCpf: customer.cpf,
        customerPhone: customer.phone,
        items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        startDate: dates.startDate,
        endDate: dates.endDate,
        deliveryAddress: addr,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setResult(data)
    } else {
      setError(data.error ?? 'Erro ao criar pedido')
    }
    setLoading(false)
  }

  const setC = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }))
  const setA = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr((prev) => ({ ...prev, [field]: e.target.value }))

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none'

  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Pedido criado!</h2>
        <p className="text-gray-500 font-mono text-sm">{result.orderId.slice(-8).toUpperCase()}</p>
        {result.paymentUrl && (
          <a href={result.paymentUrl} target="_blank" rel="noopener noreferrer"
            className="block px-6 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}>
            Abrir link de pagamento
          </a>
        )}
        <Link href={`/admin/pedidos/${result.orderId}`} className="block text-sm text-[#af101a] hover:underline">
          Ver detalhes do pedido →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/pedidos" className="text-sm text-gray-400 hover:text-[#af101a]">← Pedidos</Link>
        <h2 className="text-2xl font-bold text-gray-900">Novo pedido (balcão)</h2>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {['Produtos', 'Cliente', 'Endereço + Datas'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-[#af101a] text-white' : step === i + 1 ? 'bg-[#af101a] text-white ring-4 ring-red-100' : 'bg-gray-100 text-gray-400'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {i < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      {/* Step 1: Products */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900">Selecionar produtos</h3>
            <input type="text" placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)}
              className={inputCls} />
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filtered.map((p) => (
                <button key={p.id} onClick={() => addToCart(p)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#af101a]/30 hover:bg-red-50/30 transition-colors text-left">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#af101a]">{formatCurrency(Number(p.monthlyPrice))}/mês</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900">Carrinho ({cart.length})</h3>
            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm py-8 text-center">Nenhum item adicionado</p>
            ) : (
              <>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity} · {formatCurrency(Number(item.product.monthlyPrice))}/mês</p>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 ml-2 text-lg leading-none">×</button>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                  <span>Total mensal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90"
                  style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}>
                  Continuar →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Customer */}
      {step === 2 && (
        <div className="max-w-lg bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Dados do cliente</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input type="text" required value={customer.name} onChange={setC('name')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
            <input type="email" required value={customer.email} onChange={setC('email')} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input type="text" value={customer.cpf} onChange={setC('cpf')} className={inputCls} placeholder="000.000.000-00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input type="tel" value={customer.phone} onChange={setC('phone')} className={inputCls} placeholder="(00) 00000-0000" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">← Voltar</button>
            <button onClick={() => { if (customer.email) setStep(3) }} disabled={!customer.email}
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90"
              style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Address + dates */}
      {step === 3 && (
        <div className="max-w-lg bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Endereço e período</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início da locação *</label>
              <input type="date" required value={dates.startDate} onChange={(e) => setDates((d) => ({ ...d, startDate: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim previsto *</label>
              <input type="date" required value={dates.endDate} onChange={(e) => setDates((d) => ({ ...d, endDate: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
              <input type="text" value={addr.rua} onChange={setA('rua')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input type="text" value={addr.numero} onChange={setA('numero')} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input type="text" value={addr.bairro} onChange={setA('bairro')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input type="text" value={addr.cep} onChange={setA('cep')} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input type="text" value={addr.cidade} onChange={setA('cidade')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input type="text" value={addr.estado} onChange={setA('estado')} className={inputCls} maxLength={2} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(2)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">← Voltar</button>
            <button onClick={handleSubmit} disabled={loading || !dates.startDate || !dates.endDate}
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90"
              style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}>
              {loading ? 'Criando...' : 'Criar pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
