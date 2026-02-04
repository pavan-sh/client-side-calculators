import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculators } from '@/lib/calculators/registry'
import { siteConfig } from '@/lib/site.config'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-10 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">{siteConfig.tagline}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{siteConfig.name}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Fast, private calculators that run entirely in your browser. No sign-in. No tracking.
        </p>
      </header>

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

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Not everything needs AI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Calculations are deterministic. Running them on your device is faster, private, and avoids unnecessary server work.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>• No prompts. No API calls. No waiting.</li>
          <li>• Works offline once loaded.</li>
          <li>• Your inputs stay on your device.</li>
          <li>• Lower compute = lower cost and footprint.</li>
        </ul>
      </section>

      <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        Built for speed and accessibility.
      </footer>
    </main>
  )
}
