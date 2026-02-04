import { z } from 'zod'

import type { CalculatorDefinition } from './types'

// This calculator uses a custom UI (dynamic rows), so the schema/fields are placeholders.
const schema = z.object({})

export const shareAveragePriceCalculator: CalculatorDefinition<typeof schema> = {
  id: 'share-average-price',
  slug: 'share-average-price',
  title: 'Share Average Price Calculator',
  description: 'Average buy price from multiple purchase lots (price + quantity).',
  category: 'Money',
  schema,
  fields: [],
  compute: () => ({ results: [] }),
  seo: {
    title: 'Share Average Price Calculator',
    description: 'Compute average share price, total quantity, and total invested — client-side.',
  },
}
