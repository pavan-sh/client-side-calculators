import { z } from 'zod'

import type { CalculatorDefinition } from './types'
import { bmiCalculator } from './bmi'

export const calculators = [bmiCalculator] as const

export const calculatorsBySlug: Record<string, CalculatorDefinition<z.ZodTypeAny>> =
  Object.fromEntries(calculators.map((c) => [c.slug, c]))
