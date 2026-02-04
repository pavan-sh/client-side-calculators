import { z } from 'zod'

import type { CalculatorDefinition } from './types'

const schema = z.object({
  lmp: z
    .preprocess((v) => {
      if (v === '' || v == null) return undefined
      return String(v)
    }, z.string())
    .optional(),
  cycleLengthDays: z
    .preprocess((v) => {
      if (v === '' || v == null) return undefined
      return Number(v)
    }, z.number().min(21).max(35))
    .optional(),
})

const DAY_MS = 86_400_000

function parseIsoDate(s: string): { y: number; m: number; d: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const [yStr, mStr, dStr] = s.split('-')
  const y = Number(yStr)
  const m = Number(mStr)
  const d = Number(dStr)
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null
  const dt = new Date(y, m - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null
  return { y, m, d }
}

function toUtcMs(p: { y: number; m: number; d: number }) {
  return Date.UTC(p.y, p.m - 1, p.d)
}

function formatDateUtc(ms: number) {
  const d = new Date(ms)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function todayUtcMs() {
  const now = new Date()
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
}

function plural(n: number, unit: string) {
  return `${n} ${unit}${n === 1 ? '' : 's'}`
}

export const pregnancyCalculator: CalculatorDefinition<typeof schema> = {
  id: 'pregnancy',
  slug: 'pregnancy-due-date',
  title: 'Pregnancy Due Date Calculator',
  description:
    'Estimate due date and current pregnancy week using your last menstrual period (LMP). Date-only, runs locally.',
  category: 'Health',
  schema,
  fields: [
    {
      key: 'lmp',
      label: 'First day of last period (LMP)',
      type: 'date',
      hint: 'Used to estimate gestational age and due date.',
    },
    {
      key: 'cycleLengthDays',
      label: 'Cycle length (days)',
      type: 'number',
      placeholder: '28',
      min: 21,
      max: 35,
      step: 1,
      hint: 'Optional. Default is 28 days. Adjusts due date slightly.',
    },
  ],
  compute: (v) => {
    if (!v.lmp) return { results: [] }

    const lmp = parseIsoDate(v.lmp)
    if (!lmp) return { results: [] }

    const cycle = v.cycleLengthDays ?? 28
    const adjustDays = cycle - 28

    // Naegele’s rule baseline: LMP + 280 days, adjust for cycle length.
    const dueUtcMs = toUtcMs(lmp) + (280 + adjustDays) * DAY_MS

    const nowUtcMs = todayUtcMs()
    const elapsedDays = Math.floor((nowUtcMs - toUtcMs(lmp)) / DAY_MS)

    const totalDays = Math.max(0, elapsedDays)
    const weeks = Math.floor(totalDays / 7)
    const days = totalDays % 7

    return {
      headline: 'Estimate only (not medical advice)',
      results: [
        { label: 'Estimated due date', value: formatDateUtc(dueUtcMs) },
        { label: 'Gestational age', value: `${weeks}w ${days}d` },
        { label: 'Gestational age (total days)', value: String(totalDays) },
        { label: 'Cycle length used', value: plural(cycle, 'day') },
      ],
    }
  },
  seo: {
    title: 'Pregnancy Due Date Calculator',
    description:
      'Estimate pregnancy due date and gestational age from LMP. Date-only and runs locally in your browser.',
  },
}
