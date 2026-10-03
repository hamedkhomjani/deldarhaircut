import { Link } from '../lib/router.tsx'

const featureBadge = 'ارائه خدمات در استودیو و در محل شما (هوم‌سرویس)'

export default function Hero() {
  return (
    <section id="top" className="relative">
      {/* Mobile-first: single column, stacked. Image first on mobile for visual impact,
          text content second. On lg+ the grid kicks in and order flips. */}
      <div className="container-lux grid items-center gap-8 pt-6 pb-16 sm:gap-12 sm:pt-8 sm:pb-20 md:gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:pt-16 lg:pb-40">
        {/* Text block — order-2 on mobile (after image), order-1 on lg+ */}
        <div className="animate-rise motion-reduce:animate-none order-2 lg:order-1">
          <p className="text-eyebrow text-muted">استودیو و هوم‌سرویس</p>

          <h1 className="mt-5 font-display text-[clamp(2.25rem,8.5vw,5rem)] leading-[1.4] font-medium text-title sm:mt-6 sm:leading-[1.5] md:mt-8">
            حمیده دلدار
          </h1>

          <p className="mt-4 text-[1.125rem] font-light text-ink sm:mt-5 sm:text-lead md:mt-6">
            متخصص کوتاهی و براشینگ مو
          </p>

          {/* Badge — wraps naturally on mobile, inline on wider screens */}
          <p className="mt-6 inline-flex flex-wrap items-center rounded-full border border-line px-4 py-2 text-[0.9375rem] font-light text-muted sm:mt-8 sm:px-5 sm:text-body md:mt-10">
            {featureBadge}
          </p>

          <p className="mt-6 max-w-xl text-[1.125rem] leading-8 font-light text-ink sm:mt-8 sm:text-lead md:mt-10">
            برش و براشینگ مو با دقت و آرامش، در فضای استودیو یا در خانه‌ی
            شما. هر مدل متناسب با فرم صورت و جنس موی شما طراحی می‌شود.
          </p>

          {/* CTAs — full-width stacked on mobile, side-by-side on sm+ */}
          <div className="mt-8 flex flex-col items-stretch gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-8 md:mt-14 md:gap-10">
            <Link href="/booking" className="pill h-12 w-full px-6 text-body sm:h-14 sm:w-auto sm:px-8 sm:text-lead">
              رزرو نوبت آنلاین
            </Link>
            <a href="#portfolio" className="link-quiet justify-center text-body sm:text-lead">
              مشاهده نمونه‌کارها
            </a>
          </div>
        </div>

        {/* Image block — order-1 on mobile (shown first), order-2 on lg+ */}
        <div className="animate-fade motion-reduce:animate-none order-1 lg:order-2">
          <div className="relative">
            {/* Corner decoration — smaller on mobile, hidden on very small screens */}
            <div
              aria-hidden
              className="absolute -top-3 -end-3 hidden h-14 w-14 border-t border-e border-fill sm:block sm:-top-4 sm:-end-4 sm:h-16 sm:w-16 lg:-top-5 lg:-end-5 lg:h-20 lg:w-20"
            />
            <div className="block aspect-4/5 overflow-hidden border border-line">
              <picture className="block h-full">
                <source
                  type="image/webp"
                  srcSet="/hero-portrait-640.webp 640w, /hero-portrait-1100.webp 1100w"
                  sizes="(min-width: 1024px) 38vw, 92vw"
                />
                <source
                  type="image/jpeg"
                  srcSet="/hero-portrait-640.jpg 640w, /hero-portrait-1100.jpg 1100w"
                  sizes="(min-width: 1024px) 38vw, 92vw"
                />
                <img
                  src="/hero-portrait-1100.jpg"
                  alt="پرتره حمیده دلدار، آرایشگر متخصص کوتاهی و براشینگ مو"
                  width={1100}
                  height={1430}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
            <p className="mt-3 text-eyebrow text-muted sm:mt-5">استودیو</p>
          </div>
        </div>
      </div>
    </section>
  )
}
