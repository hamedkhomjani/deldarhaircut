import { useState } from 'react'
import { site } from '../site.ts'

type CategoryKey = 'all' | 'cut' | 'blowdry'

type Look = {
  id: string
  title: string
  style: string
  category: 'cut' | 'blowdry'
  before: string
  after: string
}

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'همه نمونه‌کارها' },
  { key: 'cut', label: 'کوتاهی تخصصی' },
  { key: 'blowdry', label: 'براشینگ و حالت‌دهی' },
]

const looks: Look[] = [
  {
    id: '1',
    title: 'کوتاهی تخصصی مو',
    style: 'Precision Cut',
    category: 'cut',
    before: '/portfolio/before-1.svg',
    after: '/portfolio/after-1.svg',
  },
  {
    id: '2',
    title: 'براشینگ و استایلینگ',
    style: 'Blow-dry & Styling',
    category: 'blowdry',
    before: '/portfolio/before-2.svg',
    after: '/portfolio/after-2.svg',
  },
  {
    id: '3',
    title: 'پکیج اختصاصی کوتاهی + براشینگ',
    style: 'Cut & Styling Package',
    category: 'cut',
    before: '/portfolio/before-3.svg',
    after: '/portfolio/after-3.svg',
  },
  {
    id: '4',
    title: 'مدل فر و حالت‌دهی',
    style: 'Curls & Texture',
    category: 'blowdry',
    before: '/portfolio/before-4.svg',
    after: '/portfolio/after-4.svg',
  },
  {
    id: '5',
    title: 'مدل کوتاه پیکسی',
    style: 'Pixie Cut',
    category: 'cut',
    before: '/portfolio/before-5.svg',
    after: '/portfolio/after-5.svg',
  },
  {
    id: '6',
    title: 'برش لایه‌ای',
    style: 'Layered Cut',
    category: 'cut',
    before: '/portfolio/before-6.svg',
    after: '/portfolio/after-6.svg',
  },
]

function Tile({ look }: { look: Look }) {
  const [showBefore, setShowBefore] = useState(false)
  const toggle = () => setShowBefore((prev) => !prev)

  return (
    <figure
      // role=button because this is a real toggle: a bare tabIndex on a <figure> announces
      // as a group and leaves AT users with no way to flip the image
      role="button"
      tabIndex={0}
      aria-label={`${look.title} — نمایش تصویر ${showBefore ? 'پس از خدمات' : 'پیش از خدمات'}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        toggle()
      }}
      className="group relative cursor-pointer overflow-hidden border border-line bg-canvas transition-colors duration-500 hover:border-fill focus:border-fill select-none"
    >
      <div className="relative aspect-4/5 w-full">
        {/* Exactly one image is exposed to AT at a time, so the announced state always
            matches the visible one — both alts used to sit in the tree and contradict
            each other once the tile was flipped. */}
        <img
          src={look.after}
          alt={showBefore ? '' : `مدل ${look.title} پس از خدمات`}
          aria-hidden={showBefore}
          width={800}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <img
          src={look.before}
          alt={showBefore ? `مدل ${look.title} پیش از خدمات` : ''}
          aria-hidden={!showBefore}
          width={800}
          height={1000}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            showBefore ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Driven by showBefore alone. This used to add `group-hover:opacity-100`, which
            swapped the image out from under a label that never changed — hovering showed
            "قبل" while the badge still read "بعد". */}
        <span className="absolute top-2.5 start-2.5 bg-canvas/90 px-2 py-1 text-[0.6875rem] tracking-[0.2em] leading-tight font-medium text-ink shadow-sm sm:top-4 sm:start-4 sm:px-3 sm:py-1.5 sm:text-eyebrow">
          {showBefore ? 'قبل · لمس برای بعد' : 'بعد · لمس برای قبل'}
        </span>
      </div>

      {/* Caption — always visible on mobile (no hover), slide-up on desktop */}
      <figcaption className="border-t border-line bg-canvas px-4 py-3.5 sm:px-5 sm:py-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-full lg:transition-transform lg:duration-500 lg:group-hover:translate-y-0 lg:group-focus:translate-y-0">
        <p className="text-eyebrow text-muted">{look.style}</p>
        <p className="mt-1.5 font-display text-lg leading-[1.7] font-medium text-ink sm:mt-3 sm:text-xl">
          {look.title}
        </p>
      </figcaption>
    </figure>
  )
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')

  const filtered = activeCategory === 'all'
    ? looks
    : looks.filter((l) => l.category === activeCategory)

  return (
    <section id="portfolio" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
      <div className="container-lux pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-32 lg:pb-40">
        {/* Header */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-eyebrow text-muted">نمونه‌کارها</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,5.5vw,2.5rem)] leading-[1.55] font-medium text-balance text-title sm:mt-5 md:mt-7">
              قبل و بعد، بی‌صافی
            </h2>
          </div>
          <p className="max-w-xl text-[1.0625rem] leading-8 font-light text-ink sm:text-lead lg:pb-2">
            روی هر تصویر لمس کنید تا نسخه‌ی پیش از خدمات را ببینید. همه‌ی
            مدل‌ها با مشاوره‌ی فرم صورت انتخاب می‌شوند.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-2 sm:mt-10 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`rounded-full px-4 py-2 text-[0.875rem] font-light transition-all sm:px-5 sm:py-2.5 sm:text-body ${
                  isActive
                    ? 'bg-fill text-on-fill shadow-sm font-medium'
                    : 'border border-line bg-canvas text-ink hover:border-fill hover:bg-wash'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Grid — 1 column on mobile, 2 on sm, 3 on lg */}
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3">
          {filtered.map((look) => (
            <Tile key={look.id} look={look} />
          ))}
        </div>

        {/* Instagram CTA — full-width on mobile */}
        <div className="mt-10 flex justify-center sm:mt-14 lg:mt-24">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="pill h-12 w-full max-w-full px-6 text-[0.9375rem] sm:h-14 sm:w-auto sm:px-8 sm:text-body"
          >
            مشاهده نمونه‌کارهای بیشتر در اینستاگرام
          </a>
        </div>
      </div>
    </section>
  )
}
