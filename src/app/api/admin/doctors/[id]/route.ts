import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const doctor = await prisma.doctor.findUnique({ where: { id } })
  if (!doctor) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(doctor)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  if (body.crm) {
    const conflict = await prisma.doctor.findFirst({ where: { crm: body.crm, NOT: { id } } })
    if (conflict) return NextResponse.json({ error: 'CRM já cadastrado' }, { status: 409 })
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.specialty !== undefined && { specialty: body.specialty }),
      ...(body.crm !== undefined && { crm: body.crm }),
      ...(body.state !== undefined && { state: body.state }),
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.available !== undefined && { available: body.available }),
    },
  })

  return NextResponse.json(doctor)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  await prisma.doctor.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
