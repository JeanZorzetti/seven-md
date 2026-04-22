import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const subscription = await prisma.subscription.update({
    where: { id },
    data: {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.plan !== undefined && { plan: body.plan }),
      ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
    },
  })

  return NextResponse.json(subscription)
}
