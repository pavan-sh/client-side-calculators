import { notFound } from 'next/navigation'

import { CalculatorPage } from '@/components/calculator/CalculatorPage'
import { calculators, calculatorsBySlug } from '@/lib/calculators/registry'

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }))
}

export default function CalculatorRoute({
  params,
}: {
  params: { slug: string }
}) {
  const calc = calculatorsBySlug[params.slug]
  if (!calc) return notFound()
  return (
    <main className="px-4 py-12">
      <CalculatorPage calc={calc} />
    </main>
  )
}
