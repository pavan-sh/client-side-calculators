import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculator/CalculatorPage'
import { ShareAveragePricePage } from '@/components/calculator/ShareAveragePricePage'
import { calculators, calculatorsBySlug } from '@/lib/calculators/registry'
import { siteConfig } from '@/lib/site.config'

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const calc = calculatorsBySlug[slug]

  const title = calc?.seo?.title
    ? `${calc.seo.title} | ${siteConfig.name}`
    : `${siteConfig.name}`

  const description = calc?.seo?.description ?? siteConfig.description

  return { title, description }
}

export default async function CalculatorRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <main className="px-4 py-12">
      {slug === 'share-average-price' ? (
        <ShareAveragePricePage slug={slug} />
      ) : (
        <CalculatorPage slug={slug} />
      )}
    </main>
  )
}
