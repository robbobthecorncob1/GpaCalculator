/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Allows us to use describe, expect, and it without importing them every time
    environment: 'jsdom', // Tells Vitest to run in a browser-like environment
    setupFiles: './src/setupTests.ts', // We will create this file next!
  },
})
