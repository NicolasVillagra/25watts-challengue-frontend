import '@testing-library/jest-dom/vitest'
import { beforeAll, beforeEach, vi } from 'vitest'

// Reduce noise from console during tests; you can remove if desired
const originalError = console.error
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    // Allow React act warnings etc. to still show if needed
    originalError.apply(console, args as any)
  })
})

// Stub alert to avoid blocking dialogs in tests
beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {})
})
