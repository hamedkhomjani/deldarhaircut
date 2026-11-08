import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../lib/locale-context.ts'
import { useTheme, type ThemeMode } from '../lib/theme-context.ts'

function SunIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function MonitorIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  )
}

const OPTIONS: { mode: ThemeMode; icon: typeof SunIcon }[] = [
  { mode: 'system', icon: MonitorIcon },
  { mode: 'light', icon: SunIcon },
  { mode: 'dark', icon: MoonIcon },
]

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { mode, effectiveTheme, setMode } = useTheme()
  const { t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const currentOption = OPTIONS.find((o) => o.mode === mode) ?? OPTIONS[0]
  const currentLabel = t.theme[currentOption.mode]
  const IconComp = mode === 'system' ? MonitorIcon : effectiveTheme === 'dark' ? MoonIcon : SunIcon

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t.theme.change(currentLabel)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-body text-ink transition-colors hover:border-fill hover:bg-wash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:h-10 sm:px-3.5"
      >
        <IconComp className="size-4 shrink-0 text-muted" />
        <span className="hidden text-xs font-medium sm:inline sm:text-sm">{currentLabel}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label={t.theme.menu}
          className="absolute end-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-xl border border-line bg-canvas p-1 shadow-lg shadow-ink/10 backdrop-blur-md"
        >
          {OPTIONS.map((opt) => {
            const isSelected = mode === opt.mode
            const Icon = opt.icon
            return (
              <button
                key={opt.mode}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  setMode(opt.mode)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs transition-colors sm:text-sm ${
                  isSelected
                    ? 'bg-wash font-medium text-ink'
                    : 'text-muted hover:bg-wash/60 hover:text-ink'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" />
                  <span>{t.theme[opt.mode]}</span>
                </span>
                {isSelected && (
                  <span className="size-1.5 rounded-full bg-fill" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
