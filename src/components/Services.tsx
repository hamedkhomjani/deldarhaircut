import { Link } from '../lib/router.tsx'

const services = [
  { key: 'cut', title: 'کوتاهی تخصصی مو' },
  { key: 'blowdry', title: 'براشینگ و استایلینگ' },
  { key: 'package', title: 'پکیج اختصاصی کوتاهی + براشینگ' },
]

const cards = [
  {
    index: '۰۱',
    title: 'خدمات در استودیو',
    latin: 'In Studio',
    tag: null,
    body: 'برش و براشینگ در فضای آرام استودیو، با ابزار حرفه‌ای و مشاوره‌ی دقیق پیش از شروع کار.',
    cta: 'رزرو در استودیو',
    loc: 'studio',
  },
  {
    index: '۰۲',
    title: 'خدمات در محل شما',
    latin: 'At Home',
    tag: 'VIP',
    body: 'همه‌ی خدمات استودیو، در خانه‌ی شما. کافی است زمان و آدرس خود را اعلام کنید.',
    cta: 'رزرو هوم‌سرویس',
    loc: 'home',
  },
]

export default function Services() {
  return (
    <section id="services" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
      {/* Mobile-first vertical rhythm: tighter padding on small screens */}
      <div className="container-lux pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-32 lg:pb-40">
        {/* Header — single column on mobile, side-by-side on lg+ */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-eyebrow text-muted">خدمات</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,5.5vw,2.5rem)] leading-[1.55] font-medium text-balance text-title sm:mt-5 md:mt-7">
              کجا موهایتان را کوتاه کنیم؟
            </h2>
          </div>
          <p className="max-w-xl text-[1.0625rem] leading-8 font-light text-ink sm:text-lead lg:pb-2">
            دو راه برای نوبت: استودیو یا خانه‌ی خودتان. در هر دو حالت، برش و
            براشینگ با یک استاندارد و توسط خودم انجام می‌شود.
          </p>
        </div>

        {/* Cards — stacked on mobile, side-by-side on lg+ */}
        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 lg:mt-24 lg:grid-cols-2 lg:gap-8">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`group flex flex-col border border-line p-6 transition-colors duration-500 hover:border-fill sm:p-8 md:p-10 lg:p-12 ${
                card.tag ? 'bg-wash' : 'bg-canvas'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-latin text-sm tracking-[0.2em] text-muted transition-colors duration-500 group-hover:text-ink">
                  {card.index}
                </span>
                {card.tag && (
                  <span className="text-eyebrow text-muted">{card.tag}</span>
                )}
              </div>

              <h3 className="mt-6 font-display text-2xl leading-[1.6] font-medium text-title sm:mt-8 sm:text-3xl md:mt-10 md:text-4xl">
                {card.title}
              </h3>

              <p className="mt-1.5 font-latin text-sm tracking-[0.2em] text-muted uppercase sm:mt-2">
                {card.latin}
              </p>

              <p className="mt-5 max-w-md text-body leading-8 font-light text-ink sm:mt-6 md:mt-8">
                {card.body}
              </p>

              {/* Service list */}
              <ul className="mt-6 space-y-0 border-t border-line sm:mt-8 md:mt-10">
                {services.map((service) => (
                  <li key={service.key} className="border-b border-line">
                    <Link
                      href={`/booking?loc=${card.loc}&service=${service.key}`}
                      className="flex items-center justify-between py-3.5 text-body font-light text-ink transition-colors hover:text-title sm:py-4"
                    >
                      <span>{service.title}</span>
                      <span className="text-xs text-muted">رزرو ←</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={`/booking?loc=${card.loc}`}
                className="link-underline mt-8 text-body sm:mt-10 md:mt-12"
                aria-label={card.cta}
              >
                {card.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
