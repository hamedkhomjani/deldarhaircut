import Booking, { type LocationKey, type ServiceKey } from '../components/Booking.tsx'
import Footer from '../components/Footer.tsx'
import Navbar from '../components/Navbar.tsx'
import { useRouter } from '../lib/router-context.ts'

const isLocation = (v: string | null): v is LocationKey => v === 'studio' || v === 'home'
const isService = (v: string | null): v is ServiceKey => v === 'cut' || v === 'blowdry' || v === 'package'

export default function BookingPage() {
  const { search } = useRouter()
  const params = new URLSearchParams(search)
  const loc = params.get('loc')
  const srv = params.get('service')
  const initialLocation = isLocation(loc) ? loc : null
  const initialService = isService(srv) ? srv : null

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Booking
          key={`${initialLocation ?? 'any'}-${initialService ?? 'any'}`}
          initialLocation={initialLocation}
          initialService={initialService}
        />
      </main>
      <Footer />
    </div>
  )
}
