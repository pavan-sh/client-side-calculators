'use client'

import Link from 'next/link'
import { useId, useMemo, useState } from 'react'
import Decimal from 'decimal.js'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { calculatorsBySlug } from '@/lib/calculators/registry'

type LotRow = {
  price: string
  quantity: string
}

function fmt(n: Decimal) {
  return n.toDecimalPlaces(2).toString()
}

export function ShareAveragePricePage({ slug }: { slug: string }) {
  const calc = calculatorsBySlug[slug]
  const reactId = useId()

  const [rows, setRows] = useState<LotRow[]>([
    { price: '', quantity: '' },
    { price: '', quantity: '' },
    { price: '', quantity: '' },
  ])

  const computed = useMemo(() => {
    let totalQty = new Decimal(0)
    let totalInvested = new Decimal(0)

    for (const r of rows) {
      let p: Decimal | null = null
      let q: Decimal | null = null

      try {
        if (r.price.trim() !== '') p = new Decimal(r.price)
        if (r.quantity.trim() !== '') q = new Decimal(r.quantity)
      } catch {
        // ignore invalid partial input (e.g. "-")
        continue
      }

      if (!p || !q) continue
      if (!p.isFinite() || !q.isFinite()) continue
      if (q.lte(0)) continue

      totalQty = totalQty.plus(q)
      totalInvested = totalInvested.plus(p.times(q))
    }

    const avg = totalQty.gt(0) ? totalInvested.div(totalQty) : null

    return {
      totalQty,
      totalInvested,
      avg,
    }
  }, [rows])

  if (!calc) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-muted-foreground">Calculator not found.</p>
      </div>
    )
  }

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
            <CardDescription>Add your purchase lots (price + quantity).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm font-medium">
              <span>Price</span>
              <span>Quantity</span>
            </div>

            <div className="space-y-3">
              {rows.map((row, idx) => {
                const priceId = `${reactId}-price-${idx}`
                const qtyId = `${reactId}-qty-${idx}`

                return (
                  <div key={idx} className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor={priceId} className="sr-only">
                        Price (row {idx + 1})
                      </label>
                      <Input
                        id={priceId}
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g. 123.45"
                        value={row.price}
                        onChange={(e) =>
                          setRows((s) =>
                            s.map((r, i) => (i === idx ? { ...r, price: e.target.value } : r))
                          )
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <label htmlFor={qtyId} className="sr-only">
                          Quantity (row {idx + 1})
                        </label>
                        <Input
                          id={qtyId}
                          type="number"
                          inputMode="decimal"
                          placeholder="e.g. 10"
                          value={row.quantity}
                          onChange={(e) =>
                            setRows((s) =>
                              s.map((r, i) =>
                                i === idx ? { ...r, quantity: e.target.value } : r
                              )
                            )
                          }
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Remove row ${idx + 1}`}
                        onClick={() => setRows((s) => s.filter((_, i) => i !== idx))}
                        disabled={rows.length <= 1}
                      >
                        <span aria-hidden>×</span>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => setRows((s) => [...s, { price: '', quantity: '' }])}
              >
                Add row
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  setRows([
                    { price: '', quantity: '' },
                    { price: '', quantity: '' },
                    { price: '', quantity: '' },
                  ])
                }
              >
                Reset
              </Button>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Tip: Leave unused rows blank. Rows with zero/negative quantity are ignored.
            </p>
          </CardContent>
        </Card>

        <Card className="md:sticky md:top-6 md:self-start">
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Totals update instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <div role="status" aria-live="polite" aria-atomic="true">
              <dl className="grid gap-2">
                <div className="flex items-baseline justify-between gap-4 rounded-md px-2 py-1">
                  <dt className="text-sm text-muted-foreground">Average price</dt>
                  <dd className="text-sm font-medium">
                    {computed.avg ? fmt(computed.avg) : '—'}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 rounded-md px-2 py-1">
                  <dt className="text-sm text-muted-foreground">Total quantity</dt>
                  <dd className="text-sm font-medium">{fmt(computed.totalQty)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 rounded-md px-2 py-1">
                  <dt className="text-sm text-muted-foreground">Total invested</dt>
                  <dd className="text-sm font-medium">{fmt(computed.totalInvested)}</dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
