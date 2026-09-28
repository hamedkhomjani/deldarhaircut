import { Suspense, lazy, useEffect } from 'react'
import Footer from './components/Footer.tsx'
import Hero from './components/Hero.tsx'
import Navbar from './components/Navbar.tsx'
import Portfolio from './components/Portfolio.tsx'
import Services from './components/Services.tsx'
import { ScrollManager } from './lib/router.tsx'
import { useRouter } from './lib/router-context.ts'

// keeps the calendar + form code out of the landing bundle
const BookingPage = lazy(() => import('./pages/BookingPage.tsx'))

const TITLES: Record<string, string> = {
  home: 'حمیده دلدار | Hamideh Deldar',
  booking: 'رزرو نوبت | حمیده دلدار',
}

function RouteFallback() {
  return (
    <div className="container-lux flex min-h-svh items-center justify-center">
      <p className="text-eyebrow text-muted">در حال بارگذاری</p>
    </div>
  )
}

export default function App() {
  const { pathname } = useRouter()
  const isBooking = pathname === '/booking' || pathname.startsWith('/booking/')

  useEffect(() => {
    document.title = isBooking ? TITLES.booking : TITLES.home
  }, [isBooking])

  return (
    <>
      {/* must sit outside the route branch: mounted per-branch it would unmount on every
          navigation, leaving the new page at the previous scroll offset (footer in view) */}
      <ScrollManager />
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
