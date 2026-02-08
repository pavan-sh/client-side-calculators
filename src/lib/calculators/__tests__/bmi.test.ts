import { describe, expect, it } from 'vitest'

import { bmiCalculator } from '../bmi'

describe('bmiCalculator', () => {
  it('computes BMI for metric inputs', () => {
    const v = bmiCalculator.schema.parse({
      unit: 'metric',
      heightCm: '180',
      weightKg: '81',
    })

    const out = bmiCalculator.compute(v)
    expect(out.results.length).toBeGreaterThan(0)

    const bmiRow = out.results.find((r) => r.label.toLowerCase().includes('bmi'))
    expect(bmiRow?.value).toMatch(/25(\.\d)?/) // 81/(1.8^2)=25
  })

  it('computes BMI for imperial inputs', () => {
    const v = bmiCalculator.schema.parse({
      unit: 'imperial',
      heightFt: '5',
      heightIn: '11',
      weightLb: '180',
    })

    const out = bmiCalculator.compute(v)
    const bmiRow = out.results.find((r) => r.label.toLowerCase().includes('bmi'))
    expect(bmiRow?.value).toBeTruthy()
  })
})
