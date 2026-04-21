const statusConfig: Record<string, { label: string; cls: string }> = {
  SCHEDULED: { label: 'Agendada', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Confirmada', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  COMPLETED: { label: 'Concluída', cls: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED: { label: 'Cancelada', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, cls: 'bg-gray-50 text-gray-500 border-gray-200' }
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${config.cls}`}>
      {config.label}
    </span>
  )
}
