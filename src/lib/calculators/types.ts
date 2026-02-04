import { z } from 'zod'

export type CalculatorCategory =
  | 'Money'
  | 'Health'
  | 'Time'
  | 'Math'
  | 'Converters'

export type FieldBase = {
  key: string
  label: string
  hint?: string
}

export type NumberField = FieldBase & {
  type: 'number'
  placeholder?: string
  min?: number
  max?: number
  step?: number
}

export type SelectField = FieldBase & {
  type: 'select'
  options: Array<{ label: string; value: string }>
}

export type DateField = FieldBase & {
  type: 'date'
  min?: string
  max?: string
}

export type Field = NumberField | SelectField | DateField

export type CalculatorDefinition<Schema extends z.ZodTypeAny> = {
  id: string
  slug: string
  title: string
  description: string
  category: CalculatorCategory
  schema: Schema
  fields: Field[]
  compute: (values: z.infer<Schema>) => {
    headline?: string
    results: Array<{ label: string; value: string; note?: string }>
  }
  seo?: {
    title?: string
    description?: string
  }
}
