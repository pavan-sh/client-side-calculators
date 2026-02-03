import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/site.config'

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.domain ? `https://${siteConfig.domain}` : 'http://localhost:3000'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
