import { NextResponse } from 'next/server'
import { getPatientSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getPatientSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.id

  // Generate code from first 8 chars of userId
  const code = userId.slice(0, 8).toUpperCase()

  // Upsert referral record so we always have one per user
  let referral = await prisma.referral.findFirst({
    where: { referrerId: userId },
  })

  if (!referral) {
    referral = await prisma.referral.create({
      data: {
        referrerId: userId,
        code,
        status: 'PENDING',
      },
    })
  }

  // Count all referrals made by this user
  const [referralsMade, conversions] = await Promise.all([
    prisma.referral.count({
      where: { referrerId: userId, referredId: { not: null } },
    }),
    prisma.referral.count({
      where: { referrerId: userId, status: 'CONVERTED' },
    }),
  ])

  const link = `https://egtelemedicina24h.com/cadastro?ref=${referral.code}`

  return NextResponse.json({
    code: referral.code,
    link,
    referralsMade,
    conversions,
  })
}
