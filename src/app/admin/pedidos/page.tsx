import PedidosClient from './PedidosClient'

export default function PedidosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
        </div>
      </div>
      <PedidosClient />
    </div>
  )
}
