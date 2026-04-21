import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { available: true },
      select: {
        id: true,
        name: true,
        specialty: true,
        crm: true,
        state: true,
        bio: true,
        rating: true,
        reviewCount: true,
        available: true,
      },
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json({ doctors })
  } catch (error) {
    console.error('[GET /api/plataforma/doctors]', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
