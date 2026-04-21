import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sevenmd.com.br'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/plataforma/', '/minha-conta/', '/api/', '/checkout/', '/carrinho/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
