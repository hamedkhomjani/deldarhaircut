import { useLayoutEffect, useState, type ReactNode } from 'react'
import { messages, type Locale } from './i18n.ts'
import { LocaleContext } from './locale-context.ts'

const STORAGE_KEY = 'lang'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'fa'
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'en') return 'en'
  } catch {
    // Local storage disabled or unavailable
  }
  return 'fa'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  // Layout effect: `dir` must flip in the same frame as the copy, otherwise the new
  // language paints once in the previous direction before the attribute lands.
  useLayoutEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = locale === 'en' ? 'ltr' : 'rtl'

    // Keep the document metadata in sync with the visible language.
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', messages[locale].meta.description)
  }, [locale])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore quota errors in private browsing
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: messages[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}
