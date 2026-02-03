import { z } from 'zod'
import Decimal from 'decimal.js'
import type { CalculatorDefinition } from './types'

const schema = z.object({
  a: z.coerce.number().default(0),
  op: z.enum(['+', '-', '*', '/', '%']).default('+'),
  b: z.coerce.number().default(0),
})

export const standardCalculator: CalculatorDefinition<typeof schema> = {
  id: 'standard',
  slug: 'standard',
  title: 'Standard Calculator',
  description: 'Quick arithmetic with predictable results.',
  category: 'Math',
  schema,
  fields: [
    { key: 'a', label: 'First number', type: 'number', step: 0.01 },
    {
      key: 'op',
      label: 'Operation',
      type: 'select',
      options: [
        { label: 'Add (+)', value: '+' },
        { label: 'Subtract (−)', value: '-' },
        { label: 'Multiply (×)', value: '*' },
        { label: 'Divide (÷)', value: '/' },
        { label: 'Percent of (%)', value: '%' },
      ],
    },
    { key: 'b', label: 'Second number', type: 'number', step: 0.01 },
  ],
  compute: (v) => {
    const A = new Decimal(v.a)
    const B = new Decimal(v.b)

    let out: Decimal
    switch (v.op) {
      case '+':
        out = A.plus(B)
        break
      case '-':
        out = A.minus(B)
        break
      case '*':
        out = A.times(B)
        break
      case '/':
        out = B.isZero() ? new Decimal(NaN) : A.div(B)
        break
      case '%':
        // "A percent of B" => (A/100)*B
        out = A.div(100).times(B)
        break
      default:
        out = A.plus(B)
    }

    const value = out.isNaN() ? 'Undefined (division by zero)' : out.toString()

    return {
      results: [{ label: 'Result', value }],
    }
  },
  seo: {
    title: 'Standard Calculator',
    description: 'Add, subtract, multiply, divide, and percent — fast and client-side.',
  },
}
