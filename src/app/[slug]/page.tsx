import { CalculatorPage } from '@/components/calculator/CalculatorPage'
import { calculators } from '@/lib/calculators/registry'

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }))
}

export default async function CalculatorRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <main className="px-4 py-12">
      <CalculatorPage slug={slug} />
    </main>
  )
}
