import { useEffect, useState } from 'react'
import { Link } from '../lib/router.tsx'
import { useRouter } from '../lib/router-context.ts'

const links = [
  { label: 'خدمات', anchor: 'services' },
  { label: 'نمونه‌کارها', anchor: 'portfolio' },
  { label: 'رزرو نوبت', anchor: null },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  // storing the route the menu was opened on means a navigation closes it for free
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const { pathname } = useRouter()
  const open = openedAt === pathname
  const onBooking = pathname === '/booking' || pathname.startsWith('/booking/')

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
        aria-label="ناوبری اصلی"
        className="container-lux flex h-16 items-center justify-between gap-3 sm:h-20 lg:h-24"
      >
        {/* Brand — always visible */}
        <Link href={onBooking ? '/' : '/#top'} className="group flex shrink-0 items-baseline gap-2 sm:gap-3">
          <span className="font-display text-lg leading-none font-medium whitespace-nowrap text-ink transition-colors group-hover:text-muted sm:text-xl md:text-2xl">
            حمیده دلدار
          </span>
          <span className="hidden font-latin text-[0.7rem] tracking-[0.3em] text-muted uppercase lg:inline">
            Hamideh Deldar
          </span>
        </Link>

        {/* Desktop nav links — hidden on mobile/tablet */}
        <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
          {links.map((link) => (
            <li key={link.anchor ?? 'booking'}>
              <Link href={hrefFor(link.anchor)} className="link-quiet text-body">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + Hamburger */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/booking"
            aria-current={onBooking ? 'page' : undefined}
            className="pill h-9 px-4 text-[0.875rem] sm:px-6 sm:text-body"
          >
            رزرو آنلاین
          </Link>
          <button
            type="button"
            onClick={() => setOpenedAt(open ? null : pathname)}
            aria-expanded={open}
            aria-label="منو"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-line transition-colors hover:border-fill lg:hidden"
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
      <div
        className={`fixed inset-0 top-16 z-40 bg-ink/20 backdrop-blur-sm transition-opacity duration-300 sm:top-20 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpenedAt(null)}
        aria-hidden="true"
      />

      {/* Mobile slide-down menu — absolutely positioned to avoid reflowing the page */}
      <div
        inert={!open}
        className={`absolute inset-x-0 top-full z-50 overflow-hidden border-b border-line bg-canvas/95 shadow-lg shadow-ink/5 backdrop-blur-md transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="container-lux flex flex-col gap-1 py-5 sm:py-6">
          {links.map((link) => (
            <li key={link.anchor ?? 'booking'}>
              <Link
                href={hrefFor(link.anchor)}
                onClick={() => setOpenedAt(null)}
                className="block py-3 text-lead text-ink transition-colors hover:text-muted active:text-title"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
