import { z } from 'zod'
import type { CalculatorDefinition } from './types'

const schema = z.object({
  unit: z.enum(['metric', 'imperial']).default('metric'),
  heightCm: z.coerce.number().positive().optional(),
  weightKg: z.coerce.number().positive().optional(),
  heightFt: z.coerce.number().positive().optional(),
  heightIn: z.coerce.number().nonnegative().optional(),
  weightLb: z.coerce.number().positive().optional(),
})

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export const bmiCalculator: CalculatorDefinition<typeof schema> = {
  id: 'bmi',
  slug: 'bmi',
  title: 'BMI Calculator',
  description: 'Body mass index from height and weight.',
  category: 'Health',
  schema,
  fields: [
    {
      key: 'unit',
      label: 'Units',
      type: 'select',
      options: [
        { label: 'Metric (cm, kg)', value: 'metric' },
        { label: 'Imperial (ft/in, lb)', value: 'imperial' },
      ],
    },
    { key: 'heightCm', label: 'Height (cm)', type: 'number', min: 1, step: 0.1 },
    { key: 'weightKg', label: 'Weight (kg)', type: 'number', min: 1, step: 0.1 },
    { key: 'heightFt', label: 'Height (ft)', type: 'number', min: 1, step: 1 },
    { key: 'heightIn', label: 'Height (in)', type: 'number', min: 0, step: 1 },
    { key: 'weightLb', label: 'Weight (lb)', type: 'number', min: 1, step: 0.1 },
  ],
  compute: (v) => {
    let heightM: number | null = null
    let weightKg: number | null = null

    if (v.unit === 'metric') {
      if (!v.heightCm || !v.weightKg) {
        return { results: [] }
      }
      heightM = v.heightCm / 100
      weightKg = v.weightKg
    } else {
      if (!v.heightFt || v.heightIn == null || !v.weightLb) {
        return { results: [] }
      }
      const totalIn = v.heightFt * 12 + v.heightIn
      heightM = totalIn * 0.0254
      weightKg = v.weightLb * 0.45359237
    }

    const bmi = weightKg / (heightM * heightM)
    const rounded = Math.round(bmi * 10) / 10
    return {
      headline: bmiCategory(rounded),
      results: [
        { label: 'BMI', value: String(rounded) },
        { label: 'Category', value: bmiCategory(rounded) },
      ],
    }
  },
  seo: {
    title: 'BMI Calculator',
    description: 'Calculate BMI from height and weight. Fast, accurate, and client-side.',
  },
}
