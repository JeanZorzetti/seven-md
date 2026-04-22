import { prisma } from '@/lib/prisma'
import ProdutoForm from '../ProdutoForm'

export default async function NovoProdutoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return <ProdutoForm categories={categories} />
}
