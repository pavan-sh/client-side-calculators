'use client'

import Link from 'next/link'
import { useId, useMemo, useState } from 'react'
import { z } from 'zod'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { CalculatorDefinition, Field } from '@/lib/calculators/types'

type FormValues = Record<string, string | undefined>

function FieldControl({
  field,
  id,
  value,
  onChange,
  describedBy,
  disabled,
}: {
  field: Field
  id: string
  value: string | undefined
  onChange: (v: string) => void
  describedBy?: string
  disabled?: boolean
}) {
  if (field.type === 'select') {
    return (
      <Select
        id={id}
        aria-describedby={describedBy}
        value={value ?? field.options[0]?.value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    )
  }

  return (
    <Input
      id={id}
      aria-describedby={describedBy}
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

function isHiddenByUnit(calcId: string, unit: string | undefined, fieldKey: string) {
  if (calcId !== 'bmi') return false
  if (unit === 'metric') return ['heightFt', 'heightIn', 'weightLb'].includes(fieldKey)
  if (unit === 'imperial') return ['heightCm', 'weightKg'].includes(fieldKey)
  return false
}

export function CalculatorPage({
  calc,
}: {
  calc: CalculatorDefinition<z.ZodTypeAny>
}) {
  const reactId = useId()

  const defaults: FormValues = useMemo(() => {
    const d: FormValues = {}
    for (const f of calc.fields) {
      if (f.type === 'select') d[f.key] = f.options[0]?.value
    }
    return d
  }, [calc])

  const [values, setValues] = useState<FormValues>(defaults)

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

  const unit = values.unit

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          ← All calculators
        </Link>
      </div>

      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{calc.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{calc.description}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Adjust values to update results instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {calc.fields.map((field) => {
              if (isHiddenByUnit(calc.id, unit, field.key)) return null

              const id = `${reactId}-${calc.id}-${field.key}`
              const hintId = field.hint ? `${id}-hint` : undefined

              return (
                <div key={field.key} className="grid gap-1.5">
                  <label htmlFor={id} className="text-sm font-medium">
                    {field.label}
                  </label>
                  <FieldControl
                    field={field}
                    id={id}
                    value={values[field.key]}
                    describedBy={hintId}
                    onChange={(v) => setValues((s) => ({ ...s, [field.key]: v }))}
                  />
                  {field.hint ? (
                    <p id={hintId} className="text-xs text-muted-foreground">
                      {field.hint}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="md:sticky md:top-6 md:self-start">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              {output?.headline ? 'Summary and details:' : 'Your results will appear here.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" aria-atomic="true">
              {!output || output.results.length === 0 ? (
                <p className="text-sm text-muted-foreground">Enter values to see results.</p>
              ) : (
                <div className="space-y-4">
                  {output.headline ? (
                    <div className="rounded-md border bg-muted/40 p-3 text-sm">
                      <span className="font-medium">{output.headline}</span>
                    </div>
                  ) : null}

                  <dl className="grid gap-2">
                    {output.results.map((r) => (
                      <div
                        key={r.label}
                        className="flex items-baseline justify-between gap-4 rounded-md px-2 py-1"
                      >
                        <dt className="text-sm text-muted-foreground">{r.label}</dt>
                        <dd className="text-sm font-medium">{r.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {calc.id === 'bmi' ? (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      BMI is a screening tool and does not diagnose health. Consider consulting a
                      clinician for personalized guidance.
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
