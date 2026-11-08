import { useLocale } from '../lib/locale-context.ts'

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()
  const next = locale === 'fa' ? 'en' : 'fa'

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={locale === 'fa' ? t.nav.switchToEnglish : t.nav.switchToPersian}
      title={locale === 'fa' ? t.nav.switchToEnglish : t.nav.switchToPersian}
      className={`flex h-9 items-center justify-center rounded-full border border-line px-3 text-xs font-medium text-ink transition-colors hover:border-fill hover:bg-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:h-10 sm:px-3.5 sm:text-sm ${className}`}
    >
      <span>{next === 'en' ? 'EN' : 'FA'}</span>
    </button>
  )
}
