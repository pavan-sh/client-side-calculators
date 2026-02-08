import { describe, expect, it } from 'vitest'

import { shareAveragePriceCalculator } from '../share-average-price'

describe('shareAveragePriceCalculator', () => {
  it('exposes expected metadata (compute is UI-driven)', () => {
    expect(shareAveragePriceCalculator.slug).toBe('share-average-price')
    expect(shareAveragePriceCalculator.title.toLowerCase()).toContain('share')
  })
})
