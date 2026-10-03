import { useEffect, useReducer, useRef } from 'react'
import DatePicker from './DatePicker.tsx'
import { longLabel, toFa } from '../lib/jalali.ts'
import { normalizePhone, phoneValid } from '../lib/phone.ts'
import { site } from '../site.ts'

type LocationKey = 'studio' | 'home'
export type { LocationKey, ServiceKey }
type ServiceKey = 'cut' | 'blowdry' | 'package'

type State = {
  step: number
  location: LocationKey | null
  service: ServiceKey | null
  date: string | null
  time: string | null
  name: string
  phone: string
  address: string
  done: boolean
}

type Action =
  | { type: 'choose'; key: 'location' | 'service' | 'date' | 'time'; value: string }
  | { type: 'text'; key: 'name' | 'phone' | 'address'; value: string }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'edit'; step: number }
  | { type: 'reset' }

const initial: State = {
  step: 0,
  location: null,
  service: null,
  date: null,
  time: null,
  name: '',
  phone: '',
  address: '',
  done: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'choose': {
      if (action.key === 'location') {
        const loc = action.value as LocationKey
        // drop a stale address when switching back to the studio
        return { ...state, location: loc, address: loc === 'studio' ? '' : state.address }
      }
      if (action.key === 'service') return { ...state, service: action.value as ServiceKey }
      // a time slot belongs to a specific day, so changing the date drops it
      if (action.key === 'date') return { ...state, date: action.value, time: null }
      return { ...state, time: action.value }
    }
    case 'text':
      return { ...state, [action.key]: action.value }
    case 'next':
      // the contact step is the last one — submitting it flips to the summary
      return state.step === 3 ? { ...state, done: true } : { ...state, step: state.step + 1 }
    case 'back':
      return { ...state, step: Math.max(0, state.step - 1) }
    case 'edit':
      return { ...state, step: action.step, done: false }
    case 'reset':
      return initial
  }
}

const STEPS = ['محل سرویس', 'نوع خدمت', 'تاریخ و ساعت', 'اطلاعات تماس', 'تأیید']

const LOCATIONS: { key: LocationKey; title: string; latin: string; note: string }[] = [
  {
    key: 'studio',
    title: 'در استودیو',
    latin: 'In Studio',
    note: 'برش و براشینگ در فضای آرام استودیو.',
  },
  {
    key: 'home',
    title: 'در منزل شما',
    latin: 'At Home',
    note: 'همه‌ی خدمات استودیو، در خانه‌ی خودتان.',
  },
]

const SERVICE_OPTIONS: { key: ServiceKey; title: string; note: string }[] = [
  { key: 'cut', title: 'کوتاهی تخصصی', note: 'برش دقیق و متناسب با فرم صورت' },
  { key: 'blowdry', title: 'براشینگ', note: 'خشک‌کردن و استایلینگ حرفه‌ای' },
  { key: 'package', title: 'کوتاهی + براشینگ', note: 'پکیج کامل، با تخفیف ویژه' },
]

const SLOT_GROUPS = [
  { label: 'صبح', slots: ['09:00', '10:00', '11:00', '12:00'] },
  { label: 'عصر', slots: ['13:00', '14:00', '15:00', '16:00', '17:00'] },
  { label: 'غروب', slots: ['18:00', '19:00', '20:00'] },
]

const SERVICE_LABEL: Record<ServiceKey, string> = {
  cut: 'کوتاهی تخصصی',
  blowdry: 'براشینگ',
  package: 'کوتاهی + براشینگ',
}

const LOCATION_LABEL: Record<LocationKey, string> = {
  studio: 'در استودیو',
  home: 'در منزل شما',
}

function OptionCard({
  name,
  value,
  checked,
  onSelect,
  title,
  latin,
  note,
}: {
  name: string
  value: string
  checked: boolean
  onSelect: (value: string) => void
  title: string
  latin?: string
  note: string
}) {
  return (
    <label className="flex cursor-pointer flex-col border border-line p-5 transition-colors duration-500 has-checked:border-fill has-checked:bg-wash has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ink hover:border-fill sm:p-6 md:p-8">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <span className="font-display text-xl leading-[1.6] font-medium text-title sm:text-2xl md:text-3xl">
          {title}
        </span>
        {/* driven by `checked`, not peer-checked: these are grandchildren of the input's
            sibling, and peer-checked only ever matches siblings of the peer */}
        <span
          className={`mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-fill transition-colors duration-500 sm:mt-2 sm:size-6 ${
            checked ? 'bg-fill' : 'bg-transparent'
          }`}
        >
          <svg
            viewBox="0 0 12 12"
            className={`size-2.5 text-on-fill transition-opacity duration-300 sm:size-3 ${
              checked ? 'opacity-100' : 'opacity-0'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M2 6.2 4.6 8.8 10 3.4" />
          </svg>
        </span>
      </div>
      {latin && (
        <span className="mt-1 font-latin text-xs tracking-[0.2em] text-muted uppercase sm:text-sm">
          {latin}
        </span>
      )}
      <span className="mt-3 text-[0.9375rem] leading-7 font-light text-ink sm:mt-5 sm:text-body sm:leading-8">{note}</span>
    </label>
  )
}

export default function Booking({
  initialLocation = null,
  initialService = null,
}: {
  initialLocation?: LocationKey | null
  initialService?: ServiceKey | null
}) {
  const [state, dispatch] = useReducer(
    reducer,
    { initialLocation, initialService },
    (seed) => {
      let step = 0
      if (seed.initialLocation) step = 1
      if (seed.initialLocation && seed.initialService) step = 2
      return {
        ...initial,
        location: seed.initialLocation,
        service: seed.initialService,
        step,
      }
    },
  )
  const panelRef = useRef<HTMLDivElement>(null)

  const home = state.location === 'home'

  const stepValid = [
    state.location !== null,
    state.service !== null,
    Boolean(state.date && state.time),
    state.name.trim().length >= 2 && phoneValid(state.phone) && (!home || state.address.trim().length >= 5),
  ]

  // Anchor the top of the panel — the step title, the progress bars and the head of the
  // newly revealed step — just below the sticky navbar. The previous `block: 'center'` on
  // the panel *body* ignored both the navbar and the 118px panel header above that body,
  // so on short viewports the step indicator scrolled off the top of the screen.
  useEffect(() => {
    if (state.step === 0 && !state.done) return
    const panel = panelRef.current
    if (!panel) return
    const nav = document.querySelector('header')
    const gap = 16
    const top = window.scrollY + panel.getBoundingClientRect().top - (nav?.getBoundingClientRect().height ?? 0) - gap
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = Math.max(0, top)
    if (reduce) {
      // `behavior: 'auto'` resolves to the *computed* scroll-behavior, and `html` sets
      // `scroll-behavior: smooth` — so it would still animate. Override inline, and
      // `instant` alone is ignored by older browsers. Same trick as ScrollManager.
      const root = document.documentElement
      const previous = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo(0, target)
      root.style.scrollBehavior = previous
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }, [state.step, state.done])

  const goNext = () => {
    if (!stepValid[state.step]) return
    dispatch({ type: 'next' })
  }

  const contactError = state.phone.length > 0 && !phoneValid(state.phone)
  const addressError = state.address.length > 0 && state.address.trim().length < 5

  const summary: [string, string][] = [
    ['محل سرویس', state.location ? LOCATION_LABEL[state.location] : '—'],
    ['نوع خدمت', state.service ? SERVICE_LABEL[state.service] : '—'],
    ['تاریخ', state.date ? longLabel(state.date) : '—'],
    ['ساعت', state.time ? toFa(state.time) : '—'],
    ['نام و نام خانوادگی', state.name],
    ['شماره تماس', toFa(normalizePhone(state.phone))],
    ...(home ? ([['نشانی', state.address]] as [string, string][]) : []),
  ]

  const waText = encodeURIComponent(
    [
      'درخواست نوبت — حمیده دلدار',
      ...summary.map(([k, v]) => `${k}: ${v}`),
    ].join('\n'),
  )

  return (
    <section id="booking" className="scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24">
      <div className="container-lux pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-32 lg:pb-40">
        {/* Section header */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-eyebrow text-muted">رزرو نوبت</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,5.5vw,2.5rem)] leading-[1.55] font-medium text-balance text-title sm:mt-5 md:mt-7">
              نوبت خود را رزرو کنید
            </h2>
          </div>
          <p className="max-w-xl text-[1.0625rem] leading-8 font-light text-ink sm:text-lead lg:pb-2">
            پنج قدم کوتاه. بعد از ثبت فرم، برای هماهنگی نهایی با شما تماس می‌گیرم.
          </p>
        </div>

        {/* Booking panel */}
        <div ref={panelRef} className="mt-10 border border-line sm:mt-12 lg:mt-24">
          {/* Progress header */}
          <div className="border-b border-line p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 sm:gap-6">
              <p className="text-eyebrow text-muted">
                {state.done ? 'درخواست ثبت شد' : `مرحله ${toFa(state.step + 1)} از ${toFa(STEPS.length)}`}
              </p>
              <p className="text-[0.9375rem] text-title sm:text-body">{STEPS[state.done ? STEPS.length - 1 : state.step]}</p>
            </div>
            <ol className="mt-3.5 flex items-center gap-1.5 sm:mt-5 sm:gap-2">
              {STEPS.map((label, i) => (
                <li key={label} className="flex-1">
                  <span
                    className={`block h-[3px] w-full transition-colors duration-500 ${
                      state.done || i <= state.step ? 'bg-fill' : 'bg-line'
                    }`}
                  />
                </li>
              ))}
            </ol>
          </div>

          {/* Step content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {state.done ? (
              <div key="done" className="animate-rise motion-reduce:animate-none">
                <p className="text-eyebrow text-muted">تأیید</p>
                <h3 className="mt-4 font-display text-2xl leading-[1.6] font-medium text-title sm:mt-6 sm:text-3xl md:text-4xl">
                  نوبت شما ثبت شد
                </h3>
                <p className="mt-4 max-w-lg text-[0.9375rem] leading-7 font-light text-ink sm:mt-5 sm:text-body sm:leading-8">
                  ممنون {state.name.split(' ')[0]}. خلاصه‌ی نوبت شما به این شکل است. برای هماهنگی
                  نهایی در همین روز با شما تماس می‌گیرم.
                </p>

                {/* Summary table */}
                <dl className="mt-6 border-t border-line sm:mt-8 md:mt-10">
                  {summary.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex flex-col gap-0.5 border-b border-line py-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-8 sm:gap-y-1 sm:py-4"
                    >
                      <dt className="text-[0.875rem] font-light text-muted sm:text-body">{k}</dt>
                      <dd className="text-body text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* Actions — stacked on mobile, wrap on sm+ */}
                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-12">
                  {site.phone ? (
                    <a
                      href={`https://wa.me/${site.phone.replace(/\D/g, '')}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill h-12 px-6 sm:h-14 sm:px-8"
                    >
                      ارسال در واتساپ
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'edit', step: 3 })}
                    className="link-underline text-body"
                  >
                    ویرایش نوبت
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'reset' })}
                    className="link-underline text-body"
                  >
                    ثبت نوبت جدید
                  </button>
                </div>
              </div>
            ) : (
              <div key={state.step} className="animate-rise motion-reduce:animate-none">
                {/* Step 0 — Location */}
                {state.step === 0 && (
                  <fieldset>
                    <legend className="text-[1.0625rem] font-light text-ink sm:text-lead">
                      کجا خدمات را دریافت کنیم؟
                    </legend>
                    <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 md:mt-8 md:gap-6">
                      {LOCATIONS.map((l) => (
                        <OptionCard
                          key={l.key}
                          name="location"
                          value={l.key}
                          checked={state.location === l.key}
                          onSelect={(v) => dispatch({ type: 'choose', key: 'location', value: v })}
                          title={l.title}
                          latin={l.latin}
                          note={l.note}
                        />
                      ))}
                    </div>
                  </fieldset>
                )}

                {/* Step 1 — Service */}
                {state.step === 1 && (
                  <fieldset>
                    <legend className="text-[1.0625rem] font-light text-ink sm:text-lead">
                      کدام خدمت را می‌خواهید؟
                    </legend>
                    <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 md:mt-8 md:gap-6">
                      {SERVICE_OPTIONS.map((s) => (
                        <OptionCard
                          key={s.key}
                          name="service"
                          value={s.key}
                          checked={state.service === s.key}
                          onSelect={(v) => dispatch({ type: 'choose', key: 'service', value: v })}
                          title={s.title}
                          note={s.note}
                        />
                      ))}
                    </div>
                  </fieldset>
                )}

                {/* Step 2 — Date & Time */}
                {state.step === 2 && (
                  <div>
                    <p className="text-[1.0625rem] font-light text-ink sm:text-lead">
                      چه روز و چه ساعتی برای شما مناسب است؟
                    </p>

                    {state.date && (
                      <div className="mt-4 flex flex-col gap-2 border border-line bg-wash p-3 text-[0.9375rem] text-ink sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:p-4 sm:text-body">
                        <div className="flex items-center gap-2">
                          <span className="inline-block size-2 rounded-full bg-fill" aria-hidden="true" />
                          <span>
                            تاریخ انتخابی: <strong>{longLabel(state.date)}</strong>
                          </span>
                        </div>
                        {state.time ? (
                          <div className="font-medium text-title">
                            ساعت <strong>{toFa(state.time)}</strong>
                          </div>
                        ) : (
                          <span className="text-eyebrow text-muted">ساعت را انتخاب کنید</span>
                        )}
                      </div>
                    )}

                    {/* Calendar + Slots — stacked on mobile, side-by-side on lg+ */}
                    <div className="mt-5 grid gap-6 sm:mt-6 md:mt-8 md:gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
                      <div className="w-full lg:w-[19rem]">
                        <DatePicker
                          value={state.date}
                          onChange={(iso) => dispatch({ type: 'choose', key: 'date', value: iso })}
                        />
                      </div>

                      <fieldset className="min-w-0">
                        <legend className="text-eyebrow text-muted">ساعت‌های آزاد</legend>
                        {!state.date ? (
                          <p className="mt-3 text-[0.9375rem] font-light text-muted sm:mt-5 sm:text-body">
                            ابتدا از تقویم، یک تاریخ انتخاب کنید.
                          </p>
                        ) : (
                          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
                            {SLOT_GROUPS.map((group) => (
                              <div key={group.label}>
                                <p className="mb-2 text-eyebrow text-muted">{group.label}</p>
                                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-3 xl:grid-cols-4">
                                  {group.slots.map((t) => (
                                    <label
                                      key={t}
                                      className="flex h-11 cursor-pointer items-center justify-center border border-line text-[0.9375rem] text-ink transition-colors duration-300 has-checked:border-fill has-checked:bg-fill has-checked:text-on-fill has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ink hover:border-fill sm:h-12 sm:text-body"
                                    >
                                      <input
                                        type="radio"
                                        name="time"
                                        value={t}
                                        checked={state.time === t}
                                        disabled={!state.date}
                                        onChange={() => dispatch({ type: 'choose', key: 'time', value: t })}
                                        className="sr-only"
                                      />
                                      {toFa(t)}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </fieldset>
                    </div>
                  </div>
                )}

                {/* Step 3 — Contact */}
                {state.step === 3 && (
                  <div>
                    <p className="text-[1.0625rem] font-light text-ink sm:text-lead">
                      برای هماهنگی، اطلاعات تماس شما
                    </p>
                    <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 md:mt-8">
                      <div className="block">
                        <label htmlFor="booking-name" className="block text-eyebrow text-muted">
                          نام و نام خانوادگی
                        </label>
                        <input
                          id="booking-name"
                          type="text"
                          value={state.name}
                          onChange={(e) => dispatch({ type: 'text', key: 'name', value: e.target.value })}
                          placeholder="مثلاً مریم رضایی"
                          className="field mt-2.5 sm:mt-3"
                          autoComplete="name"
                        />
                      </div>

                      <div className="block">
                        <div className="flex items-center justify-between">
                          <label htmlFor="booking-phone" className="block text-eyebrow text-muted">
                            شماره تماس
                          </label>
                          {phoneValid(state.phone) && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-ink">
                              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                              معتبر
                            </span>
                          )}
                        </div>
                        <input
                          id="booking-phone"
                          type="tel"
                          value={state.phone}
                          onChange={(e) => dispatch({ type: 'text', key: 'phone', value: e.target.value })}
                          placeholder="09121234567"
                          className="field mt-2.5 text-start sm:mt-3"
                          autoComplete="tel"
                          inputMode="tel"
                          dir="ltr"
                          aria-invalid={contactError || undefined}
                          aria-describedby={contactError ? 'booking-phone-error' : undefined}
                        />
                        {contactError && (
                          <span id="booking-phone-error" className="mt-2 block text-[0.875rem] text-closed sm:text-body">
                            شماره را به شکل 09121234567 وارد کنید.
                          </span>
                        )}
                      </div>

                      {home && (
                        <div className="block sm:col-span-2">
                          <label htmlFor="booking-address" className="block text-eyebrow text-muted">
                            نشانی منزل
                          </label>
                          <input
                            id="booking-address"
                            type="text"
                            value={state.address}
                            onChange={(e) => dispatch({ type: 'text', key: 'address', value: e.target.value })}
                            placeholder="منطقه، خیابان، پلاک و کوچه"
                            className="field mt-2.5 sm:mt-3"
                            autoComplete="street-address"
                            aria-invalid={addressError || undefined}
                            aria-describedby={addressError ? 'booking-address-error' : undefined}
                          />
                          {addressError && (
                            <span id="booking-address-error" className="mt-2 block text-[0.875rem] text-closed sm:text-body">
                              نشانی را کامل‌تر بنویسید.
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step navigation */}
                <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-12">
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!stepValid[state.step]}
                    className="pill h-12 w-full px-6 disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-auto sm:px-8"
                  >
                    {state.step === 3 ? 'ثبت نهایی' : 'مرحله بعد'}
                  </button>
                  {state.step > 0 && (
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'back' })}
                      className="pill h-12 w-full border border-line bg-transparent px-6 hover:border-fill sm:h-14 sm:w-auto sm:px-8"
                    >
                      مرحله قبل
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
