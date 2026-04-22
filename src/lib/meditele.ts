/**
 * Meditele / DrFast — API Client
 * Auth: header x-api-key (NOT Authorization: Bearer)
 */

const BASE_URL = 'https://gateway.meditele.com.br'

function getApiKey(): string {
  const key = process.env.MEDITELE_API_KEY
  if (!key) throw new Error('MEDITELE_API_KEY não configurada')
  return key
}

function getClinicId(): string {
  const id = process.env.MEDITELE_CLINIC_ID
  if (!id) throw new Error('MEDITELE_CLINIC_ID não configurada')
  return id
}

async function mediteleRequest<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'x-api-key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      `Meditele ${method} ${path} → ${res.status}: ${(err as { message?: string }).message ?? JSON.stringify(err)}`
    )
  }

  return res.json() as Promise<T>
}

export async function criarPaciente(patient: {
  name: string
  cpf: string
  email: string
  phone?: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
}) {
  return mediteleRequest<{ data: { patient?: { id: string }; id?: string; patientId?: string } }>(
    'POST',
    '/clinic/patient',
    { ...patient, clinicId: getClinicId() }
  )
}

export async function gerarMagicLink(
  patientId: string,
  options?: { expiresInMinutes?: number }
): Promise<{ loginUrls: Array<{ loginUrl: string; clinicId: string; token: string }> }> {
  const res = await mediteleRequest<{
    data: { loginUrls: Array<{ loginUrl: string; clinicId: string; token: string }> }
  }>('POST', `/auth/patients/${patientId}/login-token`, {
    expiresInMinutes: options?.expiresInMinutes ?? 10080,
    clinicId: getClinicId(),
  })
  return res.data
}
