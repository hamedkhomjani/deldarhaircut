import Booking, { type LocationKey } from '../components/Booking.tsx'
import Footer from '../components/Footer.tsx'
import Navbar from '../components/Navbar.tsx'
import { useRouter } from '../lib/router-context.ts'

const isLocation = (v: string | null): v is LocationKey => v === 'studio' || v === 'home'

export default function BookingPage() {
  const { search } = useRouter()
  const requested = new URLSearchParams(search).get('loc')
  const initialLocation = isLocation(requested) ? requested : null

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        {/* `key` matters: a query-only change (?loc=home -> ?loc=studio) keeps
            this component mounted, and useReducer only runs its init function
            once, so without a key the form would keep the old preselection. */}
        <Booking key={initialLocation ?? 'any'} initialLocation={initialLocation} />
      </main>
      <Footer />
    </div>
  )
}
