'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Profile = {
  name: string
  email: string
  phone: string | null
  cpf: string | null
  birthDate: string | null
  gender: string | null
}

type SubscriptionStatus = {
  isSubscriber: boolean
  plan: string | null
  status: string | null
}

const PLAN_LABELS: Record<string, string> = {
  INDIVIDUAL: 'Individual',
  FAMILIAR: 'Familiar',
  FAMILIAR_PRO: 'Familiar Pro',
  EMPRESARIAL: 'Empresarial',
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', birthDate: '', gender: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/plataforma/profile').then((r) => r.json()),
      fetch('/api/plataforma/subscription-status').then((r) => r.json()),
    ]).then(([profileData, subData]: [Profile, SubscriptionStatus]) => {
      setProfile(profileData)
      setForm({
        name: profileData.name,
        phone: profileData.phone ?? '',
        birthDate: profileData.birthDate ? profileData.birthDate.split('T')[0] : '',
        gender: profileData.gender ?? '',
      })
      setSubscriptionStatus(subData)
      setLoading(false)
    })
  }, [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const res = await fetch('/api/plataforma/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        birthDate: form.birthDate || null,
        gender: form.gender || null,
      }),
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError('Erro ao salvar')
    }
    setSaving(false)
  }

  const inputCls = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#af101a] focus:outline-none focus:ring-2 focus:ring-[#af101a]/20 transition-colors'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-6 h-6 animate-spin text-[#af101a]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-[#af101a]">Meu Perfil</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
          <input value={form.name} onChange={set('name')} required className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input value={profile?.email ?? ''} disabled className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input value={profile?.cpf ?? '—'} disabled className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="(00) 00000-0000" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
            <input type="date" value={form.birthDate} onChange={set('birthDate')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
            <select value={form.gender} onChange={set('gender')} className={inputCls}>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Perfil atualizado com sucesso!</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[#af101a] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#af101a] disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>

      {/* Subscription status */}
      {subscriptionStatus && (
        <div className={`rounded-2xl border p-5 ${
          subscriptionStatus.isSubscriber
            ? 'bg-green-50 border-green-200'
            : 'bg-[#fff2f0] border-[#ffdad6]'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                Seu plano
              </p>
              {subscriptionStatus.isSubscriber && subscriptionStatus.plan ? (
                <p className="text-base font-bold text-green-700">
                  {PLAN_LABELS[subscriptionStatus.plan] ?? subscriptionStatus.plan} — Ativo
                </p>
              ) : (
                <p className="text-base font-semibold text-[#af101a]">
                  Nenhum (sem assinatura ativa)
                </p>
              )}
            </div>
            {!subscriptionStatus.isSubscriber && (
              <Link
                href="/plataforma/assinar"
                className="shrink-0 bg-[#af101a] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#af101a] transition-colors whitespace-nowrap"
              >
                Escolher plano
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
