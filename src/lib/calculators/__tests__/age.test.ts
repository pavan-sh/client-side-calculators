import { describe, expect, it, vi, afterEach } from 'vitest'

import { ageCalculator } from '../age'

afterEach(() => {
  vi.useRealTimers()
})

describe('ageCalculator', () => {
  it('computes age and duration and since-date using a fixed today', () => {
    // Fix local calendar "today" to 2026-02-04
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 1, 4, 12, 0, 0))

    const v = ageCalculator.schema.parse({
      dob: '2000-01-01',
      startDate: '2026-02-01',
      endDate: '2026-02-04',
      sinceDate: '2026-02-01',
    })

    const out = ageCalculator.compute(v)
    expect(out.results.find((r) => r.label === 'Age')?.value).toContain('year')

    const durationDays = out.results.find((r) => r.label === 'Duration (total days)')
    expect(durationDays?.value).toBe('3')

    const sinceDays = out.results.find((r) => r.label === 'Time since date (total days)')
    expect(sinceDays?.value).toBe('3')
  })

  it('handles reversed date range with note', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 1, 4, 12, 0, 0))

    const v = ageCalculator.schema.parse({
      startDate: '2026-02-04',
      endDate: '2026-02-01',
    })

    const out = ageCalculator.compute(v)
    expect(out.results.some((r) => r.label === 'Note')).toBe(true)
  })
})
