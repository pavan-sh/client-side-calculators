import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/calculators/**/*.ts'],
      exclude: ['src/lib/calculators/registry.ts', 'src/lib/calculators/types.ts'],
    },
  },
})
