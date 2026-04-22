'use client'

import { useState } from 'react'
import FinanceiroSection from './FinanceiroSection'
import AssinaturasClient from './AssinaturasClient'

const TABS = [
  { id: 'financeiro', label: 'Visão geral' },
  { id: 'assinaturas', label: 'Todas assinaturas' },
]

export default function AssinaturasPage() {
  const [tab, setTab] = useState('financeiro')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Assinaturas & Financeiro</h2>
        <p className="text-gray-500 text-sm mt-1">Gerencie assinaturas e acompanhe a receita da telemedicina</p>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-[#af101a] text-[#af101a]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'financeiro' ? <FinanceiroSection /> : <AssinaturasClient />}
    </div>
  )
}
