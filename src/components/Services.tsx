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
    <section id="services" className="scroll-mt-24">
      <div className="container-lux pt-24 pb-24 lg:pt-32 lg:pb-40">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-eyebrow text-muted">خدمات</p>
            <h2 className="mt-7 font-display text-[clamp(2rem,5.5vw,2.5rem)] leading-[1.55] font-medium text-balance text-title">
              کجا موهایتان را کوتاه کنیم؟
            </h2>
          </div>
          <p className="max-w-xl text-lead font-light text-ink lg:pb-2">
            دو راه برای نوبت: استودیو یا خانه‌ی خودتان. در هر دو حالت، برش و
            براشینگ با یک استاندارد و توسط خودم انجام می‌شود.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-2 lg:gap-8">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`group flex flex-col border border-line p-8 transition-colors duration-500 hover:border-fill sm:p-10 lg:p-12 ${
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

              <h3 className="mt-10 font-display text-3xl leading-[1.6] font-medium text-title sm:text-4xl">
                {card.title}
              </h3>

              <p className="mt-2 font-latin text-sm tracking-[0.2em] text-muted uppercase">
                {card.latin}
              </p>

              <p className="mt-8 max-w-md text-body leading-8 font-light text-ink">
                {card.body}
              </p>

              <ul className="mt-10 space-y-0 border-t border-line">
                {services.map((service) => (
                  <li key={service.key} className="border-b border-line">
                    <Link
                      href={`/booking?loc=${card.loc}&service=${service.key}`}
                      className="flex items-center justify-between py-4 text-body font-light text-ink transition-colors hover:text-title"
                    >
                      <span>{service.title}</span>
                      <span className="text-xs text-muted">رزرو ←</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={`/booking?loc=${card.loc}`}
                className="link-underline mt-12 text-body"
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
