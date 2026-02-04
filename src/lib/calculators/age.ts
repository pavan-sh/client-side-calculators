import { z } from 'zod'

import type { CalculatorDefinition } from './types'

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/

const dateString = z
  .preprocess((v) => {
    if (v === '' || v == null) return undefined
    return v
  }, z.string().regex(isoDateRegex, 'Use YYYY-MM-DD'))
  .optional()

const schema = z.object({
  dob: dateString,
  startDate: dateString,
  endDate: dateString,
  sinceDate: dateString,
})

type DateParts = { y: number; m: number; d: number }

function parseIsoDate(s: string): DateParts | null {
  if (!isoDateRegex.test(s)) return null
  const [yStr, mStr, dStr] = s.split('-')
  const y = Number(yStr)
  const m = Number(mStr)
  const d = Number(dStr)
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null
  if (m < 1 || m > 12) return null
  if (d < 1 || d > 31) return null

  // Validate actual calendar date (local calendar rules).
  const dt = new Date(y, m - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null

  return { y, m, d }
}

function toUtcMs(p: DateParts) {
  return Date.UTC(p.y, p.m - 1, p.d)
}

function compareParts(a: DateParts, b: DateParts) {
  if (a.y !== b.y) return a.y - b.y
  if (a.m !== b.m) return a.m - b.m
  return a.d - b.d
}

function daysInMonth(y: number, m: number) {
  // m is 1-12
  return new Date(y, m, 0).getDate()
}

function diffYmd(from: DateParts, to: DateParts) {
  // Assumes from <= to.
  let years = to.y - from.y
  let months = to.m - from.m
  let days = to.d - from.d

  if (days < 0) {
    months -= 1
    const prevMonth = to.m - 1
    const prevMonthYear = prevMonth === 0 ? to.y - 1 : to.y
    const prevMonthNum = prevMonth === 0 ? 12 : prevMonth
    days += daysInMonth(prevMonthYear, prevMonthNum)
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

function plural(n: number, unit: string) {
  return `${n} ${unit}${n === 1 ? '' : 's'}`
}

function formatYmd(d: { years: number; months: number; days: number }) {
  return `${plural(d.years, 'year')}, ${plural(d.months, 'month')}, ${plural(d.days, 'day')}`
}

function todayParts(): DateParts {
  const now = new Date()
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() }
}

export const ageCalculator: CalculatorDefinition<typeof schema> = {
  id: 'age',
  slug: 'age-date-difference',
  title: 'Age & Date Difference Calculator',
  description:
    'Calculate your age from a date of birth, the duration between two dates, or the time since a date (date-only, local calendar).',
  category: 'Time',
  schema,
  fields: [
    {
      key: 'dob',
      label: 'Date of birth',
      type: 'date',
      hint: 'Used for age. Leave blank if you only need date differences.',
    },
    {
      key: 'startDate',
      label: 'Start date',
      type: 'date',
      hint: 'Used for duration between two dates.',
    },
    {
      key: 'endDate',
      label: 'End date',
      type: 'date',
    },
    {
      key: 'sinceDate',
      label: 'Since date',
      type: 'date',
      hint: 'Used for “time since”. Compared to today on this device.',
    },
  ],
  compute: (v) => {
    const results: Array<{ label: string; value: string; note?: string }> = []
    const today = todayParts()

    // Age
    if (v.dob) {
      const dob = parseIsoDate(v.dob)
      if (dob) {
        const cmp = compareParts(dob, today)
        if (cmp > 0) {
          results.push({
            label: 'Age',
            value: '—',
            note: 'Date of birth is in the future.',
          })
        } else {
          const ymd = diffYmd(dob, today)
          const totalDays = Math.floor((toUtcMs(today) - toUtcMs(dob)) / 86_400_000)
          results.push({ label: 'Age', value: formatYmd(ymd) })
          results.push({ label: 'Age (total days)', value: String(totalDays) })
        }
      }
    }

    // Duration between two dates
    if (v.startDate && v.endDate) {
      const a = parseIsoDate(v.startDate)
      const b = parseIsoDate(v.endDate)
      if (a && b) {
        const cmp = compareParts(a, b)
        const from = cmp <= 0 ? a : b
        const to = cmp <= 0 ? b : a
        const ymd = diffYmd(from, to)
        const totalDays = Math.floor((toUtcMs(to) - toUtcMs(from)) / 86_400_000)

        results.push({ label: 'Duration', value: formatYmd(ymd) })
        results.push({ label: 'Duration (total days)', value: String(totalDays) })
        if (cmp > 0) {
          results.push({
            label: 'Note',
            value: 'Start date is after end date (computed using absolute difference).',
          })
        }
      }
    }

    // Time since date
    if (v.sinceDate) {
      const since = parseIsoDate(v.sinceDate)
      if (since) {
        const cmp = compareParts(since, today)
        if (cmp > 0) {
          const ymd = diffYmd(today, since)
          const totalDays = Math.floor((toUtcMs(since) - toUtcMs(today)) / 86_400_000)
          results.push({ label: 'Time until date', value: formatYmd(ymd) })
          results.push({ label: 'Time until date (total days)', value: String(totalDays) })
        } else {
          const ymd = diffYmd(since, today)
          const totalDays = Math.floor((toUtcMs(today) - toUtcMs(since)) / 86_400_000)
          results.push({ label: 'Time since date', value: formatYmd(ymd) })
          results.push({ label: 'Time since date (total days)', value: String(totalDays) })
        }
      }
    }

    if (results.length === 0) return { results: [] }

    return {
      headline: 'Calculated using date-only (local calendar) values',
      results,
    }
  },
  seo: {
    title: 'Age & Date Difference Calculator',
    description:
      'Calculate age from date of birth, duration between two dates, and time since a date. Runs entirely client-side.',
  },
}
