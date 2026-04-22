export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Aguardando Pagamento',
  PAID: 'Pago',
  IN_DELIVERY: 'Em Entrega',
  ACTIVE: 'Ativo',
  RETURNED: 'Devolvido',
  CANCELLED: 'Cancelado',
}

export const ORDER_STATUS_CLASSES: Record<string, string> = {
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700 border-amber-200',
  PAID: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_DELIVERY: 'bg-purple-50 text-purple-700 border-purple-200',
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  RETURNED: 'bg-gray-50 text-gray-500 border-gray-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
}

export const ORDER_STATUS_NEXT: Record<string, string | null> = {
  PENDING_PAYMENT: 'PAID',
  PAID: 'IN_DELIVERY',
  IN_DELIVERY: 'ACTIVE',
  ACTIVE: 'RETURNED',
  RETURNED: null,
  CANCELLED: null,
}
