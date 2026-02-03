'use client'

import { useMemo, useState } from 'react'
import { z } from 'zod'

import type { CalculatorDefinition, Field } from '@/lib/calculators/types'

function FieldInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: Field
  value: any
  onChange: (v: any) => void
  disabled?: boolean
}) {
  if (field.type === 'select') {
    return (
      <select
        className="w-full rounded-md border px-3 py-2"
        value={value ?? field.options[0]?.value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <input
      className="w-full rounded-md border px-3 py-2"
      type="number"
      inputMode="decimal"
      placeholder={field.placeholder}
      value={value ?? ''}
      min={field.min}
      max={field.max}
      step={field.step ?? 'any'}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  )
}

export function CalculatorPage({
  calc,
}: {
  calc: CalculatorDefinition<z.ZodTypeAny>
}) {
  const defaults = useMemo(() => {
    const d: Record<string, any> = {}
    for (const f of calc.fields) {
      if (f.type === 'select') d[f.key] = f.options[0]?.value
    }
    return d
  }, [calc])

  const [values, setValues] = useState<Record<string, any>>(defaults)

  const parsed = useMemo(() => {
    try {
      return { ok: true as const, value: calc.schema.parse(values) }
    } catch (e) {
      return { ok: false as const, error: e }
    }
  }, [calc, values])

  const output = useMemo(() => {
    if (!parsed.ok) return null
    return calc.compute(parsed.value)
  }, [parsed, calc])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{calc.title}</h1>
        <p className="text-muted-foreground">{calc.description}</p>
      </header>

      <section className="grid gap-4 rounded-lg border p-4">
        {calc.fields.map((field) => {
          // basic conditional display for BMI example
          const unit = values.unit
          const hiddenByUnit =
            calc.id === 'bmi' &&
            ((unit === 'metric' && ['heightFt', 'heightIn', 'weightLb'].includes(field.key)) ||
              (unit === 'imperial' && ['heightCm', 'weightKg'].includes(field.key)))

          if (hiddenByUnit) return null

          return (
            <label key={field.key} className="grid gap-1">
              <span className="text-sm font-medium">{field.label}</span>
              <FieldInput
                field={field}
                value={values[field.key]}
                onChange={(v) => setValues((s) => ({ ...s, [field.key]: v }))}
              />
              {field.hint ? (
                <span className="text-xs text-muted-foreground">{field.hint}</span>
              ) : null}
            </label>
          )}
        )}
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold">Result</h2>
        {!output || output.results.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Enter values to see results.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {output.headline ? (
              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                <span className="font-medium">{output.headline}</span>
              </div>
            ) : null}
            <dl className="grid gap-2">
              {output.results.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">{r.label}</dt>
                  <dd className="text-sm font-medium">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>
    </div>
  )
}
