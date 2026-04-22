export const PLAN_PRICES: Record<string, number> = {
  INDIVIDUAL: 47,
  FAMILIAR: 147,
  FAMILIAR_PRO: 237,
  EMPRESARIAL: 0,
}

export const PLAN_LABELS: Record<string, string> = {
  INDIVIDUAL: 'Individual',
  FAMILIAR: 'Familiar',
  FAMILIAR_PRO: 'Familiar Pro',
  EMPRESARIAL: 'Empresarial',
}

export const PLAN_FEATURES: Record<string, string[]> = {
  INDIVIDUAL: [
    '1 consulta/mês incluída',
    'Acesso a todas as especialidades',
    'Prontuário digital',
    'Suporte por WhatsApp',
  ],
  FAMILIAR: [
    'Até 4 pessoas',
    '4 consultas/mês incluídas',
    'Acesso a todas as especialidades',
    'Prontuário digital por membro',
    'Suporte prioritário',
  ],
  FAMILIAR_PRO: [
    'Até 6 pessoas',
    '8 consultas/mês incluídas',
    'Acesso a todas as especialidades',
    'Prontuário digital por membro',
    'Consultas ilimitadas (R$20 cada extra)',
    'Suporte 24h',
  ],
  EMPRESARIAL: [
    'Número de vidas sob consulta',
    'Gestão centralizada',
    'Relatórios de saúde corporativa',
    'Integração RH',
    'Account manager dedicado',
  ],
}

export const PLAN_COLORS: Record<string, string> = {
  INDIVIDUAL: 'bg-blue-50 text-blue-700 border-blue-200',
  FAMILIAR: 'bg-green-50 text-green-700 border-green-200',
  FAMILIAR_PRO: 'bg-purple-50 text-purple-700 border-purple-200',
  EMPRESARIAL: 'bg-gray-50 text-gray-700 border-gray-200',
}
