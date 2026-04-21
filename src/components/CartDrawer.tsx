'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { getCart, removeFromCart, CartItem } from '@/lib/cart'

function Drawer({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  const refresh = useCallback(() => setItems(getCart()), [])

  useEffect(() => {
    setMounted(true)
    refresh()
    window.addEventListener('cart-updated', refresh)
    return () => window.removeEventListener('cart-updated', refresh)
  }, [refresh])

  if (!mounted) return null

  const subtotal = items.reduce((sum, item) => sum + item.monthlyPrice * item.quantity, 0)
  const deposit = items.reduce((sum, item) => sum + item.depositAmount * item.quantity, 0)

  const content = (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black" style={{ fontFamily: 'var(--font-manrope)', color: '#1d1b1b' }}>
            Carrinho ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400 mt-1">Adicione equipamentos para continuar</p>
              <Link
                href="/equipamentos"
                onClick={onClose}
                className="mt-4 text-sm font-semibold hover:underline"
                style={{ color: '#af101a' }}
              >
                Ver equipamentos →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    R$ {item.monthlyPrice.toFixed(2)}/mês × {item.quantity}
                  </p>
                  <p className="text-sm font-semibold mt-1" style={{ color: '#af101a' }}>
                    R$ {(item.monthlyPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => { removeFromCart(item.id); refresh() }}
                  className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal mensal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {deposit > 0 && (
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Caução total (reembolsável)</span>
                  <span>R$ {deposit.toFixed(2)}</span>
                </div>
              )}
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center py-4 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
            >
              Finalizar pedido →
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

export function CartButton() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  const refresh = useCallback(() => {
    const items = JSON.parse(localStorage.getItem('seven_cart') ?? '[]') as Array<{ quantity: number }>
    setCount(items.reduce((s, i) => s + i.quantity, 0))
  }, [])

  useEffect(() => {
    setMounted(true)
    refresh()
    window.addEventListener('cart-updated', refresh)
    return () => window.removeEventListener('cart-updated', refresh)
  }, [refresh])

  if (!mounted) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-[#af101a] hover:bg-red-50 transition-colors"
        aria-label="Abrir carrinho"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-9H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: '#af101a' }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      {open && <Drawer onClose={() => setOpen(false)} />}
    </>
  )
}
