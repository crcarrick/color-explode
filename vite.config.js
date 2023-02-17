import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'PostCSSPluginColors',
      fileName: 'color-explode',
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      include: ['lib/**/*.ts'],
      statements: 100,
    },
  },
})
