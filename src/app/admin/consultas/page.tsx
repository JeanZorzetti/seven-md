import ConsultasClient from './ConsultasClient'

export default function ConsultasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Consultas</h2>
        <p className="text-gray-500 text-sm mt-1">Gerencie e acompanhe todas as consultas da plataforma</p>
      </div>
      <ConsultasClient />
    </div>
  )
}
