import { z } from 'zod'

import type { CalculatorDefinition } from './types'
import { bmiCalculator } from './bmi'
import { standardCalculator } from './standard'
import { emiCalculator } from './emi'
import { ageCalculator } from './age'
import { salaryHikeCalculator } from './salary-hike'
import { shareAveragePriceCalculator } from './share-average-price'
import { pregnancyCalculator } from './pregnancy'

export const calculators = [
  bmiCalculator,
  standardCalculator,
  emiCalculator,
  ageCalculator,
  salaryHikeCalculator,
  shareAveragePriceCalculator,
  pregnancyCalculator,
] as const

export const calculatorsBySlug: Record<string, CalculatorDefinition<z.ZodTypeAny>> =
  Object.fromEntries(calculators.map((c) => [c.slug, c]))
