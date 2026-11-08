import { useEffect, useState } from 'react'
import { useLocale } from '../lib/locale-context.ts'
import { Link } from '../lib/router.tsx'
import { useRouter } from '../lib/router-context.ts'
import { site } from '../site.ts'
import LanguageToggle from './LanguageToggle.tsx'
import ThemeToggle from './ThemeToggle.tsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  // storing the route the menu was opened on means a navigation closes it for free
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const { pathname } = useRouter()
  const { locale, t } = useLocale()
  const open = openedAt === pathname
  const onBooking = pathname === '/booking' || pathname.startsWith('/booking/')

  const links = [
    { key: 'services', label: t.nav.services, anchor: 'services' },
    { key: 'portfolio', label: t.nav.portfolio, anchor: 'portfolio' },
    { key: 'booking', label: t.nav.booking, anchor: null },
  ]

  const brandName = locale === 'fa' ? site.name : site.latinName
  const brandAlt = locale === 'fa' ? site.latinName : site.name

  // section anchors only exist on the landing page
  const hrefFor = (anchor: string | null) =>
    anchor === null ? '/booking' : onBooking ? `/#${anchor}` : `#${anchor}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenedAt(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-line bg-canvas/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label={t.nav.main}
        className="container-lux flex h-16 items-center justify-between gap-3 sm:h-20 lg:h-24"
      >
        {/* Brand — always visible */}
        <Link href={onBooking ? '/' : '/#top'} className="group flex shrink-0 items-baseline gap-2 sm:gap-3">
          <span className="font-display text-lg leading-none font-medium whitespace-nowrap text-ink transition-colors group-hover:text-muted sm:text-xl md:text-2xl">
            {brandName}
          </span>
          <span
            className={`hidden text-[0.7rem] tracking-[0.3em] text-muted uppercase lg:inline ${
              locale === 'fa' ? 'font-latin' : 'font-sans normal-case'
            }`}
            lang={locale === 'fa' ? 'en' : 'fa'}
          >
            {brandAlt}
          </span>
        </Link>

        {/* Desktop nav links — hidden on mobile/tablet */}
        <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
          {links.map((link) => (
            <li key={link.key}>
              <Link href={hrefFor(link.anchor)} className="link-underline text-body">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + Language + Theme + Hamburger */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/booking"
            aria-current={onBooking ? 'page' : undefined}
            className="pill hidden h-9 px-4 text-[0.875rem] sm:inline-flex sm:px-6 sm:text-body"
          >
            {t.nav.bookOnline}
          </Link>
          <button
            type="button"
            onClick={() => setOpenedAt(open ? null : pathname)}
            aria-expanded={open}
            aria-label={t.nav.menu}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-line transition-colors hover:border-fill hover:bg-wash lg:hidden"
          >
            <span
              className={`h-px w-4 bg-ink transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
            />
            <span
              className={`h-px w-4 bg-ink transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay backdrop */}
      <button
        type="button"
        inert={!open}
        aria-label={t.nav.closeMenu}
        onClick={() => setOpenedAt(null)}
        className={`fixed inset-0 top-16 z-40 cursor-default bg-ink/20 backdrop-blur-sm transition-opacity duration-300 sm:top-20 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Mobile slide-down menu */}
      <div
        inert={!open}
        className={`absolute inset-x-0 top-full z-50 overflow-hidden border-b border-line bg-canvas/95 shadow-lg shadow-ink/5 backdrop-blur-md transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-lux flex flex-col gap-4 py-5 sm:py-6">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  href={hrefFor(link.anchor)}
                  onClick={() => setOpenedAt(null)}
                  className="link-underline w-fit py-3 text-lead"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
