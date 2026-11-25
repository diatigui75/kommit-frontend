import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  // Les e2e Playwright (`e2e/`) ont le même suffixe `.test.ts` : Vitest ne doit pas les ramasser.
  test: { exclude: [...configDefaults.exclude, 'e2e/**'] },
})
