import { useRef, useState } from 'react'
import { site } from '../site.ts'

type Look = {
  id: string
  title: string
  style: string
  before: string
  after: string
  video?: string
}

const looks: Look[] = [
  {
    id: '1',
    title: 'کوتاهی تخصصی مو',
    style: 'Precision Cut',
    before: '/portfolio/before-1.svg',
    after: '/portfolio/after-1.svg',
  },
  {
    id: '2',
    title: 'براشینگ و استایلینگ',
    style: 'Blow-dry & Styling',
    before: '/portfolio/before-2.svg',
    after: '/portfolio/after-2.svg',
  },
  {
    id: '3',
    title: 'پکیج اختصاصی کوتاهی + براشینگ',
    style: 'Cut & Styling Package',
    before: '/portfolio/before-3.svg',
    after: '/portfolio/after-3.svg',
  },
  {
    id: '4',
    title: 'مدل فر و حالت‌دهی',
    style: 'Curls & Texture',
    before: '/portfolio/before-4.svg',
    after: '/portfolio/after-4.svg',
  },
  {
    id: '5',
    title: 'مدل کوتاه پیکسی',
    style: 'Pixie Cut',
    before: '/portfolio/before-5.svg',
    after: '/portfolio/after-5.svg',
  },
  {
    id: '6',
    title: 'برش لایه‌ای',
    style: 'Layered Cut',
    before: '/portfolio/before-6.svg',
    after: '/portfolio/after-6.svg',
  },
]

function Tile({ look }: { look: Look }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showBefore, setShowBefore] = useState(false)

  return (
    <figure
      tabIndex={0}
      aria-label={`${look.title} — لمس یا نگه داشتن برای قبل و بعد`}
      onClick={() => setShowBefore((prev) => !prev)}
      className="group relative cursor-pointer overflow-hidden border border-line bg-canvas transition-colors duration-500 hover:border-fill focus:border-fill select-none"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        const v = videoRef.current
        if (v) {
          v.pause()
          v.currentTime = 0
        }
      }}
    >
      <div className="relative aspect-4/5 w-full">
        <img
          src={look.after}
          alt={`مدل ${look.title} پس از خدمات`}
          width={800}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <img
          src={look.before}
          alt={`مدل ${look.title} پیش از خدمات`}
          width={800}
          height={1000}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:opacity-100 group-focus:opacity-100 ${
            showBefore ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {look.video && (
          <video
            ref={videoRef}
            src={look.video}
            poster={look.after}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 hidden h-full w-full object-cover"
          />
        )}

        <span className="absolute top-4 start-4 bg-canvas/90 px-3 py-1.5 text-eyebrow text-ink shadow-sm">
          {showBefore ? 'پیش از خدمات (قبل)' : 'پس از خدمات (بعد — لمس برای قبل)'}
        </span>
      </div>

      <figcaption className="absolute inset-x-0 bottom-0 translate-y-full border-t border-line bg-canvas px-5 py-5 transition-transform duration-500 group-hover:translate-y-0 group-focus:translate-y-0">
        <p className="text-eyebrow text-muted">{look.style}</p>
        <p className="mt-3 font-display text-xl leading-[1.7] font-medium text-ink">
          {look.title}
        </p>
      </figcaption>
    </figure>
  )
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="scroll-mt-24">
      <div className="container-lux pt-24 pb-24 lg:pt-32 lg:pb-40">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-eyebrow text-muted">نمونه‌کارها</p>
            <h2 className="mt-7 font-display text-[clamp(2rem,5.5vw,2.5rem)] leading-[1.55] font-medium text-balance text-title">
              قبل و بعد، بی‌صافی
            </h2>
          </div>
          <p className="max-w-xl text-lead font-light text-ink lg:pb-2">
            روی هر تصویر نگه دارید تا نسخه‌ی پیش از خدمات را ببینید. همه‌ی
            مدل‌ها با مشاوره‌ی فرم صورت انتخاب می‌شوند.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {looks.map((look) => (
            <Tile key={look.id} look={look} />
          ))}
        </div>

        <div className="mt-16 flex justify-center lg:mt-24">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="pill h-14 max-w-full px-8 text-body"
          >
            مشاهده نمونه‌کارهای بیشتر در اینستاگرام
          </a>
        </div>
      </div>
    </section>
  )
}
