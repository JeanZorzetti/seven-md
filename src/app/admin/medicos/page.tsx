import MedicosClient from './MedicosClient'

export default function MedicosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Médicos</h2>
        <p className="text-gray-500 text-sm mt-1">Gerencie o quadro de médicos da plataforma</p>
      </div>
      <MedicosClient />
    </div>
  )
}
