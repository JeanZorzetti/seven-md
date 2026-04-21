'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCart, removeFromCart, CartItem } from '@/lib/cart'

export default function CarrinhoPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const refresh = () => setItems(getCart())
    refresh()
    window.addEventListener('cart-updated', refresh)
    return () => window.removeEventListener('cart-updated', refresh)
  }, [])

  if (!mounted) return null

  const subtotal = items.reduce((sum, i) => sum + i.monthlyPrice * i.quantity, 0)
  const deposit = items.reduce((sum, i) => sum + i.depositAmount * i.quantity, 0)
  const total = subtotal + deposit

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8" style={{ fontFamily: 'var(--font-manrope)' }}>
        Carrinho
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">Seu carrinho está vazio</p>
          <p className="text-sm text-gray-400 mb-6">Adicione equipamentos para continuar</p>
          <Link
            href="/equipamentos"
            className="inline-block py-3 px-8 rounded-full font-bold text-sm text-white hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
          >
            Ver equipamentos
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base leading-tight mb-1">{item.name}</p>
                  <p className="text-sm text-gray-400">Mín. {item.minRentalDays} dias</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-400">Mensal</p>
                      <p className="text-base font-black" style={{ color: '#af101a', fontFamily: 'var(--font-manrope)' }}>
                        R$ {item.monthlyPrice.toFixed(2)}
                      </p>
                    </div>
                    {item.depositAmount > 0 && (
                      <div>
                        <p className="text-xs text-gray-400">Caução</p>
                        <p className="text-sm font-semibold text-gray-600">R$ {item.depositAmount.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors self-start mt-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}

            <Link href="/equipamentos" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: '#af101a' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continuar comprando
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Resumo do pedido</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal mensal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {deposit > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Caução (reembolsável)</span>
                    <span>R$ {deposit.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400 text-xs border-t border-gray-100 pt-2">
                  <span>Frete</span>
                  <span>Calculado no checkout</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-4 mb-5">
                <span>Total estimado</span>
                <span style={{ color: '#af101a' }}>R$ {total.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full text-center py-4 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
              >
                Finalizar pedido →
              </Link>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pagamento seguro via Asaas
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
