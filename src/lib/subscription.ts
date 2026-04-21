import { prisma } from '@/lib/prisma'

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({ where: { userId } })
  if (!sub) return false
  if (sub.status !== 'ACTIVE' && sub.status !== 'TRIAL') return false
  if (sub.endDate && sub.endDate < new Date()) return false
  return true
}
