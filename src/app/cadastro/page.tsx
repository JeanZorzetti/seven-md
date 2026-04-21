'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CadastroPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', cpf: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok) {
      router.push('/login?registered=true')
    } else {
      setError(data.error ?? 'Erro ao cadastrar')
    }
    setLoading(false)
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#af101a] focus:outline-none focus:ring-2 focus:ring-[#af101a]/20 transition-colors'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#f9f2f2' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <Link href="/" className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-manrope)', color: '#af101a' }}>
              Seven-MD
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-manrope)' }}>Criar conta</h1>
          <p className="text-sm text-gray-500 mb-6">Cadastre-se para agendar consultas e alugar equipamentos</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="Seu nome" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail *</label>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="seu@email.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha *</label>
              <input type="password" required value={form.password} onChange={set('password')} placeholder="Mínimo 6 caracteres" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="(00) 00000-0000" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CPF</label>
              <input type="text" value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" className={inputCls} />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#af101a' }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
