import { describe, expect, it, vi, afterEach } from 'vitest'

import { pregnancyCalculator } from '../pregnancy'

afterEach(() => {
  vi.useRealTimers()
})

describe('pregnancyCalculator', () => {
  it('computes due date from LMP (28-day cycle)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 1, 4, 12, 0, 0))

    const v = pregnancyCalculator.schema.parse({ lmp: '2026-01-01', cycleLengthDays: '28' })
    const out = pregnancyCalculator.compute(v)

    const due = out.results.find((r) => r.label === 'Estimated due date')
    expect(due?.value).toBe('2026-10-08') // 2026-01-01 + 280 days

    const ga = out.results.find((r) => r.label === 'Gestational age')
    expect(ga?.value).toMatch(/\d+w \d+d/)
  })
})
