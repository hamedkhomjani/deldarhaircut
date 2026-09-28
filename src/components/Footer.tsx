import { Link } from '../lib/router.tsx'
import { site } from '../site.ts'

const year = new Date().getFullYear()

const instagramIcon = (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
)

const phoneIcon = (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 5c0-1 1-2 2-2h2l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v2c0 1-1 2-2 2A15 15 0 0 1 4 5Z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-dusk text-dusk-ink">
      <div className="container-lux pt-20 pb-10 lg:pt-28">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-eyebrow text-dusk-muted">تماس</p>
            <h2 className="mt-7 font-display text-[clamp(1.9rem,5vw,2.5rem)] leading-[1.55] font-medium text-balance text-dusk-ink">
              برای نوبت، پیام بدهید
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="pill h-14 gap-3 px-8"
              >
                {instagramIcon}
                {site.instagramHandle}
              </a>

              {site.phone ? (
                <a
                  href={`tel:${site.phone}`}
                  className="pill h-14 gap-3 px-8"
                  aria-label={`تماس تلفنی ${site.phone}`}
                >
                  {phoneIcon}
                  {site.phone}
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title="شماره تماس هنوز منتشر نشده است"
                  className="inline-flex h-14 cursor-not-allowed items-center justify-center gap-3 rounded-full border border-dusk-muted/40 px-8 text-body whitespace-nowrap text-dusk-muted"
                >
                  {phoneIcon}
                  شماره تماس
                </span>
              )}
            </div>
            <Link href="/booking" className="link-underline text-body text-dusk-ink hover:text-dusk-muted">
              یا از فرم رزرو استفاده کنید
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start gap-4 border-t border-dusk-muted/25 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-latin text-sm tracking-[0.18em] text-dusk-muted uppercase">
            &copy; {year} {site.latinName}
          </p>
          <p className="text-body text-dusk-muted">{site.name}</p>
        </div>
      </div>
    </footer>
  )
}
