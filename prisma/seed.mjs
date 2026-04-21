import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const UNSPLASH = 'https://images.unsplash.com/photo'

const categories = [
  { slug: 'camas-hospitalares', name: 'Camas Hospitalares', description: 'Camas articuladas, fawler e manuais para cuidados domiciliares', imageUrl: `${UNSPLASH}-1586773860418-d37222d8fce3?w=400&q=80` },
  { slug: 'oxigenoterapia', name: 'Oxigenoterapia', description: 'Concentradores de oxigênio e cilindros para terapia domiciliar', imageUrl: `${UNSPLASH}-1559757148-5c350d0d3c56?w=400&q=80` },
  { slug: 'mobilidade', name: 'Mobilidade', description: 'Cadeiras de rodas, andadores, muletas e bengalas', imageUrl: `${UNSPLASH}-1571019613454-1cb2f99b2d8b?w=400&q=80` },
  { slug: 'inalacao-aspiracao', name: 'Inalação e Aspiração', description: 'Nebulizadores, inaladores e aspiradores de secreções', imageUrl: `${UNSPLASH}-1584308666744-24d5c474f2ae?w=400&q=80` },
  { slug: 'cuidados-diarios', name: 'Cuidados Diários', description: 'Cadeiras de banho, elevadores e equipamentos para higiene', imageUrl: `${UNSPLASH}-1576091160550-2173dba999ef?w=400&q=80` },
]

const products = [
  { slug: 'cama-hospitalar-manual-3-manivelas', name: 'Cama Hospitalar Manual 3 Manivelas', categorySlug: 'camas-hospitalares', description: 'Cama hospitalar manual com 3 manivelas para ajuste de altura, posição da cabeceira e dos pés. Grade lateral de proteção em ambos os lados. Suporta até 150kg.', images: [`${UNSPLASH}-1519494026892-476f54d43a24?w=800&q=80`], dailyPrice: 28.00, weeklyPrice: 160.00, monthlyPrice: 520.00, depositAmount: 300.00, minRentalDays: 7, stock: 5, specs: { pesoMaximo: '150 kg', dimensoes: '203 x 88 x 50 cm', altura: '40–80 cm' } },
  { slug: 'cama-hospitalar-fawler', name: 'Cama Hospitalar Fawler Elétrica', categorySlug: 'camas-hospitalares', description: 'Cama elétrica Fawler com ajuste motorizado de altura e posição da cabeceira. Ideal para pacientes acamados. Inclui grades laterais e suporte para soro.', images: [`${UNSPLASH}-1607619056574-7c2e45f4f2da?w=800&q=80`], dailyPrice: 45.00, weeklyPrice: 250.00, monthlyPrice: 850.00, depositAmount: 500.00, minRentalDays: 7, stock: 3, specs: { pesoMaximo: '200 kg', motor: 'Elétrico', voltagem: '127/220V' } },
  { slug: 'colchao-caixa-de-ovo', name: 'Colchão Caixa de Ovo Hospitalar', categorySlug: 'camas-hospitalares', description: 'Colchão em espuma caixão (caixa de ovo) que reduz pontos de pressão e previne escaras. Compatível com camas hospitalares padrão.', images: [`${UNSPLASH}-1631049307264-da0ec9d70304?w=800&q=80`], dailyPrice: 8.00, weeklyPrice: 45.00, monthlyPrice: 150.00, depositAmount: 100.00, minRentalDays: 7, stock: 10, specs: { dimensoes: '190 x 88 x 10 cm', material: 'Espuma D28' } },
  { slug: 'concentrador-oxigenio-5l', name: 'Concentrador de Oxigênio 5L/min', categorySlug: 'oxigenoterapia', description: 'Concentrador de oxigênio domiciliar com fluxo de 1 a 5 litros por minuto. Silencioso, compacto e com alarme de segurança. Ideal para oxigenoterapia contínua.', images: [`${UNSPLASH}-1559757148-5c350d0d3c56?w=800&q=80`], dailyPrice: 55.00, weeklyPrice: 300.00, monthlyPrice: 990.00, depositAmount: 800.00, minRentalDays: 7, stock: 4, specs: { fluxo: '1–5 L/min', ruido: '< 45 dB', voltagem: '127/220V', peso: '14 kg' } },
  { slug: 'concentrador-oxigenio-10l', name: 'Concentrador de Oxigênio 10L/min', categorySlug: 'oxigenoterapia', description: 'Concentrador de alta vazão para pacientes com necessidade de maior fluxo de oxigênio. Fluxo de 1 a 10 L/min com pureza acima de 90%.', images: [`${UNSPLASH}-1584308666744-24d5c474f2ae?w=800&q=80`], dailyPrice: 90.00, weeklyPrice: 520.00, monthlyPrice: 1700.00, depositAmount: 1200.00, minRentalDays: 7, stock: 2, specs: { fluxo: '1–10 L/min', pureza: '> 90%', voltagem: '220V', peso: '22 kg' } },
  { slug: 'cadeira-de-rodas-simples', name: 'Cadeira de Rodas Simples', categorySlug: 'mobilidade', description: 'Cadeira de rodas manual leve, dobrável, com rodas traseiras grandes para uso autônomo. Apoio de pés removível e assento acolchoado.', images: [`${UNSPLASH}-1571019613454-1cb2f99b2d8b?w=800&q=80`], dailyPrice: 12.00, weeklyPrice: 65.00, monthlyPrice: 210.00, depositAmount: 150.00, minRentalDays: 7, stock: 8, specs: { capacidade: '120 kg', larguraAssento: '45 cm', peso: '15 kg' } },
  { slug: 'andador-dobravel', name: 'Andador Dobrável com Rodas', categorySlug: 'mobilidade', description: 'Andador dobrável com duas rodas dianteiras e dois ponteiros traseiros. Altura ajustável, leve e fácil de transportar.', images: [`${UNSPLASH}-1576091160550-2173dba999ef?w=800&q=80`], dailyPrice: 8.00, weeklyPrice: 42.00, monthlyPrice: 130.00, depositAmount: 80.00, minRentalDays: 7, stock: 10, specs: { capacidade: '100 kg', altura: 'Ajustável 75–95 cm', peso: '3 kg' } },
  { slug: 'muleta-axilar-par', name: 'Muletas Axilares (par)', categorySlug: 'mobilidade', description: 'Par de muletas axilares reguláveis em alumínio. Leves, resistentes e com ponteira antiderrapante.', images: [`${UNSPLASH}-1619451334792-150fd785ee74?w=800&q=80`], dailyPrice: 5.00, weeklyPrice: 28.00, monthlyPrice: 90.00, depositAmount: 50.00, minRentalDays: 7, stock: 15, specs: { material: 'Alumínio', altura: 'Ajustável', capacidade: '100 kg' } },
  { slug: 'nebulizador-ultrassonico', name: 'Nebulizador Ultrassônico', categorySlug: 'inalacao-aspiracao', description: 'Nebulizador ultrassônico silencioso para uso domiciliar. Partículas finas para melhor penetração pulmonar. Inclui máscara adulto e infantil.', images: [`${UNSPLASH}-1559757148-5c350d0d3c56?w=800&q=80`], dailyPrice: 10.00, weeklyPrice: 55.00, monthlyPrice: 180.00, depositAmount: 120.00, minRentalDays: 7, stock: 8, specs: { tipo: 'Ultrassônico', capacidade: '6 mL', voltagem: '127/220V' } },
  { slug: 'aspirador-de-secrecoes', name: 'Aspirador de Secreções Elétrico', categorySlug: 'inalacao-aspiracao', description: 'Aspirador elétrico portátil para remoção de secreções. Vazão de 20 L/min com frasco coletor de 1L. Ideal para pacientes com dificuldade de deglutição.', images: [`${UNSPLASH}-1584308666744-24d5c474f2ae?w=800&q=80`], dailyPrice: 22.00, weeklyPrice: 120.00, monthlyPrice: 380.00, depositAmount: 250.00, minRentalDays: 7, stock: 4, specs: { vazao: '20 L/min', frasco: '1 L', voltagem: '127/220V' } },
  { slug: 'cadeira-de-banho', name: 'Cadeira de Banho com Rodas', categorySlug: 'cuidados-diarios', description: 'Cadeira de banho com rodas, apoio de braços removível e orifício higiênico. Estrutura em aço inox, leve e resistente à umidade.', images: [`${UNSPLASH}-1576091160550-2173dba999ef?w=800&q=80`], dailyPrice: 14.00, weeklyPrice: 75.00, monthlyPrice: 240.00, depositAmount: 150.00, minRentalDays: 7, stock: 6, specs: { material: 'Aço inox', capacidade: '120 kg', largura: '55 cm' } },
  { slug: 'comadre-plastica', name: 'Comadre Plástica Hospitalar', categorySlug: 'cuidados-diarios', description: 'Comadre plástica resistente para uso em leito. Fabricada em polipropileno atóxico, fácil de higienizar.', images: [`${UNSPLASH}-1631049307264-da0ec9d70304?w=800&q=80`], dailyPrice: 3.00, weeklyPrice: 15.00, monthlyPrice: 45.00, depositAmount: 30.00, minRentalDays: 7, stock: 20, specs: { material: 'Polipropileno', capacidade: '5 L' } },
]

async function main() {
  console.log('Seeding categories...')
  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat })
  }

  console.log('Seeding products...')
  for (const p of products) {
    const { categorySlug, ...data } = p
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (!category) { console.warn(`Category ${categorySlug} not found`); continue }
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, categoryId: category.id },
    })
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
