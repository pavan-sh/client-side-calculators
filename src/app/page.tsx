import Link from 'next/link'

import { calculators } from '@/lib/calculators/registry'
import { siteConfig } from '@/lib/site.config'

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">{siteConfig.name}</h1>
        <p className="text-lg text-muted-foreground">{siteConfig.tagline}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Start here</h2>
        <div className="grid gap-3">
          {calculators.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="rounded-lg border p-4 hover:bg-muted"
            >
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-muted-foreground">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="text-sm text-muted-foreground">
        Client-side. No login. Built for speed and accessibility.
      </footer>
    </main>
  )
}
