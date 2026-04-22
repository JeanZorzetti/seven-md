import PacientesClient from './PacientesClient'

export default function PacientesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pacientes</h2>
        <p className="text-gray-500 text-sm mt-1">Gerencie pacientes e assinaturas da plataforma</p>
      </div>
      <PacientesClient />
    </div>
  )
}
