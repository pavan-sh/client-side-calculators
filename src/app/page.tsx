'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { calculators } from '@/lib/calculators/registry'
import { siteConfig } from '@/lib/site.config'

const GRID_INTENSITY_KG_PER_KWH = {
  globalAverage: 0.45,
} as const

type WorkloadPreset = 'small' | 'medium' | 'large'

const KWH_PER_AI_CALL: Record<WorkloadPreset, number> = {
  // These are deliberately conservative placeholders for an *estimator*.
  // We show the assumptions in the UI so users can reason about it.
  small: 0.002,
  medium: 0.01,
  large: 0.05,
}

export default function Home() {
  const [aiCallsAvoided, setAiCallsAvoided] = useState('5')
  const [preset, setPreset] = useState<WorkloadPreset>('medium')

  const co2 = useMemo(() => {
    const calls = Math.max(0, Number(aiCallsAvoided || 0))
    if (!Number.isFinite(calls)) return null

    const kwh = calls * KWH_PER_AI_CALL[preset]
    const kg = kwh * GRID_INTENSITY_KG_PER_KWH.globalAverage
    const grams = kg * 1000

    return { kwh, kg, grams }
  }, [aiCallsAvoided, preset])

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-10 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">{siteConfig.tagline}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{siteConfig.name}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Fast, private calculators that run entirely in your browser. No sign-in. No tracking.
        </p>
      </header>

      <section className="mb-10 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">
          The computer is already in your pocket.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Simple calculations should be instant, private, and reliable — not a chat with a server.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-background p-4">
            <p className="text-xs text-muted-foreground">AI / API calls</p>
            <p className="mt-1 text-lg font-semibold">0</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-xs text-muted-foreground">Data sent</p>
            <p className="mt-1 text-lg font-semibold">0</p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">CO₂ avoided (est.)</p>
                <p className="mt-1 text-lg font-semibold">
                  {co2 ? `${co2.grams.toFixed(co2.grams < 10 ? 1 : 0)} g` : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">Global avg grid</p>
                <p className="text-[11px] text-muted-foreground">0.45 kg/kWh</p>
              </div>
            </div>

            <div className="mt-3 grid gap-2">
              <div className="grid grid-cols-2 items-center gap-2">
                <label className="text-[11px] text-muted-foreground">Assume AI calls avoided</label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={aiCallsAvoided}
                  onChange={(e) => setAiCallsAvoided(e.target.value)}
                  className="h-8"
                  aria-label="Assumed AI calls avoided"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <label className="text-[11px] text-muted-foreground">AI workload preset</label>
                <Select value={preset} onValueChange={(v) => setPreset(v as WorkloadPreset)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (0.002 kWh/call)</SelectItem>
                    <SelectItem value="medium">Medium (0.01 kWh/call)</SelectItem>
                    <SelectItem value="large">Large (0.05 kWh/call)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-muted-foreground">
              Estimate = calls × kWh/call × grid intensity. Values vary by provider/model and energy mix.
            </p>
          </div>
        </div>
        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>• No prompts. No tokens. No waiting.</li>
          <li>• Works offline once loaded.</li>
          <li>• Your inputs stay on your device.</li>
          <li>• Less compute, less cost, less drama.</li>
        </ul>
      </section>

      <section aria-labelledby="start-here" className="space-y-4">
        <div>
          <h2 id="start-here" className="text-xl font-semibold">
            Start here
          </h2>
          <p className="text-sm text-muted-foreground">Pick a calculator to begin.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {calculators.map((c) => (
            <Card key={c.slug} className="transition-colors hover:bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link
                  href={`/${c.slug}`}
                  aria-label={`Open ${c.title} calculator`}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                >
                  Open
                </Link>
                <p className="mt-3 text-xs text-muted-foreground">
                  Runs client-side. Your inputs never leave this device.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        Built for speed and accessibility.
      </footer>
    </main>
  )
}
