import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alatabla.store'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/checkout/address',
          '/checkout/confirm',
          '/profile/',
          '/auth/',
          '/order/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
