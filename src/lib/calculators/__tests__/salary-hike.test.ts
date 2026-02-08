import { describe, expect, it } from 'vitest'

import { salaryHikeCalculator } from '../salary-hike'

describe('salaryHikeCalculator', () => {
  it('computes increase and new salary', () => {
    const v = salaryHikeCalculator.schema.parse({ currentSalary: '100000', hikePercent: '10' })
    const out = salaryHikeCalculator.compute(v)

    const inc = out.results.find((r) => r.label.toLowerCase().includes('increase'))
    const next = out.results.find((r) => r.label.toLowerCase().includes('new salary'))

    expect(inc?.value).toContain('10')
    expect(next?.value).toContain('110')
  })
})
