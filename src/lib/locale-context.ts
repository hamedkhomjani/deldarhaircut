import { createContext, useContext } from 'react'
import type { Locale, Messages } from './i18n.ts'

export type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Copy for the active locale. */
  t: Messages
}

export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
