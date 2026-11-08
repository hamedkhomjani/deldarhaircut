import { Suspense, lazy, useEffect } from 'react'
import Footer from './components/Footer.tsx'
import Hero from './components/Hero.tsx'
import Navbar from './components/Navbar.tsx'
import Portfolio from './components/Portfolio.tsx'
import ScissorsCursor from './components/ScissorsCursor.tsx'
import Services from './components/Services.tsx'
import { useLocale } from './lib/locale-context.ts'
import { ScrollManager } from './lib/router.tsx'
import { useRouter } from './lib/router-context.ts'

// keeps the calendar + form code out of the landing bundle
const BookingPage = lazy(() => import('./pages/BookingPage.tsx'))

function RouteFallback() {
  const { t } = useLocale()

  return (
    <div className="container-lux flex min-h-svh items-center justify-center">
      <p className="text-eyebrow text-muted">{t.common.loading}</p>
    </div>
  )
}

export default function App() {
  const { pathname } = useRouter()
  const { t } = useLocale()
  const isBooking = pathname === '/booking' || pathname.startsWith('/booking/')

  useEffect(() => {
    document.title = isBooking ? t.meta.bookingTitle : t.meta.homeTitle
  }, [isBooking, t])

  return (
    <>
      {/* must sit outside the route branch: mounted per-branch it would unmount on every
          navigation, leaving the new page at the previous scroll offset (footer in view) */}
      <ScrollManager />
      <ScissorsCursor />
      {isBooking ? (
        <Suspense fallback={<RouteFallback />}>
          <BookingPage />
        </Suspense>
      ) : (
        <div className="flex min-h-svh flex-col">
          <Navbar />
          <main className="flex-1">
            <Hero />
            <Services />
            <Portfolio />
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}
