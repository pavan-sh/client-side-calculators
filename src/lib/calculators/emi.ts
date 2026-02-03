import { z } from 'zod'
import Decimal from 'decimal.js'
import type { CalculatorDefinition } from './types'

const schema = z.object({
  principal: z.coerce.number().positive().default(100000),
  annualRate: z.coerce.number().nonnegative().default(10),
  tenureMonths: z.coerce.number().int().positive().default(12),
})

function fmtMoney(n: Decimal) {
  // keep it simple (client-only, no locale assumptions in MVP)
  const v = n.toDecimalPlaces(2)
  return v.toString()
}

export const emiCalculator: CalculatorDefinition<typeof schema> = {
  id: 'emi',
  slug: 'emi',
  title: 'Loan EMI Calculator',
  description: 'Monthly payment from principal, rate, and tenure.',
  category: 'Money',
  schema,
  fields: [
    {
      key: 'principal',
      label: 'Principal',
      type: 'number',
      min: 1,
      step: 1000,
      hint: 'Total loan amount',
    },
    {
      key: 'annualRate',
      label: 'Interest rate (annual %)',
      type: 'number',
      min: 0,
      step: 0.1,
      hint: 'Nominal annual rate',
    },
    {
      key: 'tenureMonths',
      label: 'Tenure (months)',
      type: 'number',
      min: 1,
      step: 1,
    },
  ],
  compute: (v) => {
    const P = new Decimal(v.principal)
    const r = new Decimal(v.annualRate).div(12).div(100) // monthly rate
    const n = new Decimal(v.tenureMonths)

    // EMI = P*r*(1+r)^n / ((1+r)^n - 1)
    let emi: Decimal
    if (r.isZero()) {
      emi = P.div(n)
    } else {
      const onePlus = r.plus(1)
      const pow = onePlus.pow(n)
      emi = P.times(r).times(pow).div(pow.minus(1))
    }

    const totalPayment = emi.times(n)
    const totalInterest = totalPayment.minus(P)

    return {
      results: [
        { label: 'Monthly EMI', value: fmtMoney(emi) },
        { label: 'Total payment', value: fmtMoney(totalPayment) },
        { label: 'Total interest', value: fmtMoney(totalInterest) },
      ],
    }
  },
  seo: {
    title: 'Loan EMI Calculator',
    description: 'Calculate monthly EMI, total payment, and total interest — client-side.',
  },
}
