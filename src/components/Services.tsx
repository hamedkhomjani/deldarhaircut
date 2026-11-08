import { useLocale } from '../lib/locale-context.ts'
import { Link } from '../lib/router.tsx'

type ServiceKey = 'cut' | 'blowdry' | 'package'

const SERVICES: ServiceKey[] = ['cut', 'blowdry', 'package']

export default function Services() {
  const { t } = useLocale()

  const cards = [
    { ...t.services.cards.studio, loc: 'studio' as const },
    { ...t.services.cards.home, loc: 'home' as const },
  ]

  return (
    <section id="services" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
      {/* Mobile-first vertical rhythm: tighter padding on small screens */}
      <div className="container-lux pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-32 lg:pb-40">
        {/* Header — single column on mobile, side-by-side on lg+ */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-eyebrow text-muted">{t.services.eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,5.5vw,2.5rem)] leading-[1.55] font-medium text-balance text-title sm:mt-5 md:mt-7">
              {t.services.heading}
            </h2>
          </div>
          <p className="max-w-xl text-[1.0625rem] leading-8 font-light text-ink sm:text-lead lg:pb-2">
            {t.services.intro}
          </p>
        </div>

        {/* Cards — stacked on mobile, side-by-side on lg+ */}
        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 lg:mt-24 lg:grid-cols-2 lg:gap-8">
          {cards.map((card) => (
            <article
              key={card.loc}
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

              <p className="mt-1.5 font-latin text-sm tracking-[0.2em] text-muted uppercase sm:mt-2" lang="en">
                {card.latin}
              </p>

              <p className="mt-5 max-w-md text-body leading-8 font-light text-ink sm:mt-6 md:mt-8">
                {card.body}
              </p>

              {/* Service list */}
              <ul className="mt-6 space-y-0 border-t border-line sm:mt-8 md:mt-10">
                {SERVICES.map((service) => (
                  <li key={service} className="group border-b border-line">
                    <Link
                      href={`/booking?loc=${card.loc}&service=${service}`}
                      className="-mx-3 flex items-center justify-between px-3 py-3.5 text-body font-light text-ink transition-colors hover:bg-wash hover:text-title sm:py-4"
                    >
                      <span>{t.services.names[service]}</span>
                      <span className="text-xs text-muted transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        {t.services.bookLink}
                      </span>
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
