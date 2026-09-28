import { Link } from '../lib/router.tsx'

const featureBadge = 'ارائه خدمات در استودیو و در محل شما (هوم‌سرویس)'

export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="container-lux grid items-center gap-16 pt-8 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:pt-16 lg:pb-40">
        <div className="animate-rise motion-reduce:animate-none order-2 lg:order-1">
          <p className="text-eyebrow text-muted">استودیو و هوم‌سرویس</p>

          <h1 className="mt-8 font-display text-[clamp(2.75rem,8.5vw,5rem)] leading-[1.5] font-medium text-title">
            حمیده دلدار
          </h1>

          <p className="mt-6 text-lead font-light text-ink">
            متخصص کوتاهی و براشینگ مو
          </p>

          <p className="mt-10 inline-flex items-center rounded-full border border-line px-5 py-2 text-body font-light text-muted">
            {featureBadge}
          </p>

          <p className="mt-10 max-w-xl text-lead font-light text-ink">
            برش و براشینگ مو با دقت و آرامش، در فضای استودیو یا در خانه‌ی
            شما. هر مدل متناسب با فرم صورت و جنس موی شما طراحی می‌شود.
          </p>

          <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <Link href="/booking" className="pill h-14 w-full px-8 text-lead sm:w-auto">
              رزرو نوبت آنلاین
            </Link>
            <a href="#portfolio" className="link-quiet text-lead">
              مشاهده نمونه‌کارها
            </a>
          </div>
        </div>

        <div className="animate-fade motion-reduce:animate-none order-1 lg:order-2">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -top-5 -end-5 h-20 w-20 border-t border-e border-fill"
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
            <p className="mt-5 text-eyebrow text-muted">استودیو</p>
          </div>
        </div>
      </div>
    </section>
  )
}
