import { describe, expect, it } from 'vitest'

import { standardCalculator } from '../standard'

describe('standardCalculator', () => {
  it('adds two numbers', () => {
    const v = standardCalculator.schema.parse({ a: '2', b: '3', op: '+' })
    const out = standardCalculator.compute(v)
    expect(out.results[0]?.value).toBe('5')
  })

  it('divides safely', () => {
    const v = standardCalculator.schema.parse({ a: '10', b: '2', op: '/' })
    const out = standardCalculator.compute(v)
    expect(out.results[0]?.value).toBe('5')
  })
})
