import { z } from 'zod'
import Decimal from 'decimal.js'

import type { CalculatorDefinition } from './types'

const schema = z.object({
  currentSalary: z.coerce.number().nonnegative().default(50000),
  hikePercent: z.coerce.number().default(10),
})

function fmtMoney(n: Decimal) {
  return n.toDecimalPlaces(2).toString()
}

export const salaryHikeCalculator: CalculatorDefinition<typeof schema> = {
  id: 'salary-hike',
  slug: 'salary-hike',
  title: 'Salary Hike Calculator',
  description: 'New salary from current salary and hike percentage.',
  category: 'Money',
  schema,
  fields: [
    {
      key: 'currentSalary',
      label: 'Current salary',
      type: 'number',
      min: 0,
      step: 100,
    },
    {
      key: 'hikePercent',
      label: 'Hike (%)',
      type: 'number',
      step: 0.1,
      hint: 'Use negative values for a pay cut.',
    },
  ],
  compute: (v) => {
    const current = new Decimal(v.currentSalary)
    const pct = new Decimal(v.hikePercent).div(100)

    const increase = current.times(pct)
    const newSalary = current.plus(increase)

    return {
      headline: `New salary: ${fmtMoney(newSalary)}`,
      results: [
        { label: 'Increase amount', value: fmtMoney(increase) },
        { label: 'New salary', value: fmtMoney(newSalary) },
      ],
    }
  },
  seo: {
    title: 'Salary Hike Calculator',
    description: 'Calculate your new salary from a percentage hike — client-side.',
  },
}
