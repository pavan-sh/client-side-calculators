import type { MetadataRoute } from 'next'

import { calculators } from '@/lib/calculators/registry'
import { siteConfig } from '@/lib/site.config'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain ? `https://${siteConfig.domain}` : 'http://localhost:3000'

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
    },
    ...calculators.map((c) => ({
      url: `${base}/${c.slug}`,
      lastModified: new Date(),
    })),
  ]
}
