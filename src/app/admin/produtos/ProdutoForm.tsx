'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUploadThing } from '@/lib/uploadthing'
import { toast } from '@/components/Toast'

interface Category { id: string; name: string }

interface ProductFormData {
  name: string
  slug: string
  description: string
  categoryId: string
  images: string[]
  dailyPrice: string
  weeklyPrice: string
  monthlyPrice: string
  depositAmount: string
  minRentalDays: string
  stock: string
  specs: string
  active: boolean
}

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ProdutoForm({
  product,
  categories,
  productId,
}: {
  product?: Partial<ProductFormData & { id: string }>
  categories: Category[]
  productId?: string
}) {
  const router = useRouter()
  const isEditing = !!productId

  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    categoryId: product?.categoryId ?? '',
    images: product?.images ?? [],
    dailyPrice: product?.dailyPrice ?? '',
    weeklyPrice: product?.weeklyPrice ?? '',
    monthlyPrice: product?.monthlyPrice ?? '',
    depositAmount: product?.depositAmount ?? '',
    minRentalDays: product?.minRentalDays ?? '7',
    stock: product?.stock ?? '1',
    specs: product?.specs ?? '',
    active: product?.active ?? true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)

  const { startUpload } = useUploadThing('productImage')

  const set = (field: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && !isEditing ? { slug: slugify(e.target.value) } : {}),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingImages(true)
    try {
      const uploaded = await startUpload(Array.from(files))
      if (uploaded) {
        const urls = uploaded.map((f) => f.ufsUrl)
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
        toast(`${urls.length} imagem(ns) enviada(s)`)
      }
    } catch {
      toast('Erro ao fazer upload das imagens', 'error')
    }
    setUploadingImages(false)
  }

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = isEditing ? `/api/admin/products/${productId}` : '/api/admin/products'
    const method = isEditing ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        dailyPrice: parseFloat(form.dailyPrice) || 0,
        weeklyPrice: form.weeklyPrice ? parseFloat(form.weeklyPrice) : null,
        monthlyPrice: parseFloat(form.monthlyPrice) || 0,
        depositAmount: parseFloat(form.depositAmount) || 0,
        minRentalDays: parseInt(form.minRentalDays) || 7,
        stock: parseInt(form.stock) || 1,
      }),
    })

    if (res.ok) {
      toast(isEditing ? 'Produto atualizado' : 'Produto criado')
      router.push('/admin/produtos')
    } else {
      const data = await res.json()
      toast(data.error ?? 'Erro ao salvar', 'error')
      setError(data.error ?? 'Erro ao salvar')
    }
    setLoading(false)
  }

  const handleDuplicate = async () => {
    if (!productId) return
    setLoading(true)
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        name: form.name + ' (cópia)',
        slug: form.slug + '-copia-' + Date.now().toString(36),
        dailyPrice: parseFloat(form.dailyPrice) || 0,
        weeklyPrice: form.weeklyPrice ? parseFloat(form.weeklyPrice) : null,
        monthlyPrice: parseFloat(form.monthlyPrice) || 0,
        depositAmount: parseFloat(form.depositAmount) || 0,
        minRentalDays: parseInt(form.minRentalDays) || 7,
        stock: parseInt(form.stock) || 1,
      }),
    })
    if (res.ok) {
      const newProduct = await res.json()
      toast('Produto duplicado')
      router.push(`/admin/produtos/${newProduct.id}`)
    } else {
      toast('Erro ao duplicar produto', 'error')
    }
    setLoading(false)
  }

  const handleArchive = async () => {
    if (!productId || !confirm('Arquivar este produto?')) return
    setLoading(true)
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    })
    if (res.ok) toast('Produto arquivado')
    else toast('Erro ao arquivar', 'error')
    router.push('/admin/produtos')
  }

  const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#af101a] focus:outline-none focus:ring-1 focus:ring-[#af101a]/20'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar produto' : 'Novo produto'}</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <button type="button" onClick={handleDuplicate} disabled={loading} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                Duplicar
              </button>
              <button type="button" onClick={handleArchive} disabled={loading} className="px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-60">
                Arquivar
              </button>
            </>
          )}
          <button type="button" onClick={() => router.push('/admin/produtos')} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #af101a, #d32f2f)' }}
          >
            {loading ? 'Salvando...' : 'Salvar produto'}
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Informações básicas</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input type="text" required value={form.name} onChange={set('name')} className={inputCls} placeholder="ex: Cama Hospitalar Fawler Elétrica" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" required value={form.slug} onChange={set('slug')} className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">URL: /equipamentos/{form.slug}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea rows={4} value={form.description} onChange={set('description')} className={inputCls + ' resize-none'} placeholder="Descrição detalhada do produto" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select required value={form.categoryId} onChange={set('categoryId')} className={inputCls}>
                <option value="">Selecione...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Imagens</h3>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {form.images.map((url) => (
                  <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${uploadingImages ? 'border-[#af101a] bg-red-50' : 'border-gray-200 hover:border-[#af101a] hover:bg-red-50/30'}`}>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500">{uploadingImages ? 'Enviando...' : 'Clique para adicionar imagens (máx. 4MB cada)'}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
            </label>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Ficha técnica (JSON)</h3>
            <textarea
              rows={5}
              value={form.specs}
              onChange={set('specs')}
              className={inputCls + ' resize-none font-mono text-xs'}
              placeholder={'{\n  "peso": "35kg",\n  "dimensoes": "90x200cm",\n  "voltagem": "110/220V"\n}'}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Preços</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço mensal (R$) *</label>
              <input type="number" step="0.01" required value={form.monthlyPrice} onChange={set('monthlyPrice')} className={inputCls} placeholder="0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço diário (R$)</label>
              <input type="number" step="0.01" value={form.dailyPrice} onChange={set('dailyPrice')} className={inputCls} placeholder="0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço semanal (R$)</label>
              <input type="number" step="0.01" value={form.weeklyPrice} onChange={set('weeklyPrice')} className={inputCls} placeholder="0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caução (R$)</label>
              <input type="number" step="0.01" value={form.depositAmount} onChange={set('depositAmount')} className={inputCls} placeholder="0,00" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Disponibilidade</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
              <input type="number" min="0" value={form.stock} onChange={set('stock')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mínimo de dias</label>
              <input type="number" min="1" value={form.minRentalDays} onChange={set('minRentalDays')} className={inputCls} />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input type="checkbox" id="active" checked={form.active} onChange={set('active')} className="w-4 h-4 accent-[#af101a]" />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Produto ativo (visível no site)</label>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
