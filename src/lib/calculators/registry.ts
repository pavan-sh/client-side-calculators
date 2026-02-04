import { z } from 'zod'

import type { CalculatorDefinition } from './types'
import { bmiCalculator } from './bmi'
import { standardCalculator } from './standard'
import { emiCalculator } from './emi'
import { ageCalculator } from './age'

export const calculators = [bmiCalculator, standardCalculator, emiCalculator, ageCalculator] as const

export const calculatorsBySlug: Record<string, CalculatorDefinition<z.ZodTypeAny>> =
  Object.fromEntries(calculators.map((c) => [c.slug, c]))
