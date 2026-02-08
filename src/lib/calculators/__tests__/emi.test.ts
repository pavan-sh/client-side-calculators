import { describe, expect, it } from 'vitest'

import { emiCalculator } from '../emi'

describe('emiCalculator', () => {
  it('computes EMI for a typical loan', () => {
    const v = emiCalculator.schema.parse({
      principal: '100000',
      annualRate: '12',
      tenureMonths: '12',
    })

    const out = emiCalculator.compute(v)
    const emi = out.results.find((r) => r.label.toLowerCase().includes('emi'))
    expect(emi?.value).toBeTruthy()

    const totalPayment = out.results.find((r) => r.label.toLowerCase().includes('total payment'))
    expect(totalPayment?.value).toBeTruthy()
  })
})
