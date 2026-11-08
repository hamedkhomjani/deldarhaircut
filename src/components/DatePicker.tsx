import { useState } from 'react'
import {
  dayNumber,
  formatNumber,
  gregorianMonthLabel,
  gregorianMonthRange,
  isoOf,
  longLabel,
  monthLabel,
  persianMonthRange,
  persianParts,
  todayIso,
  weekIndex,
  weekdayNames,
  weekdayShort,
} from '../lib/jalali.ts'
import { useLocale } from '../lib/locale-context.ts'
import { dayStatus } from '../lib/holidays.ts'

const DAY = 86400000

type Props = {
  value: string | null
  onChange: (iso: string) => void
}

type Cursor = { y: number; m: number }

export default function DatePicker({ value, onChange }: Props) {
  const { locale, t } = useLocale()
  const isEn = locale === 'en'
  const today = todayIso()
  const initial = value ?? today

  const [cursor, setCursor] = useState<Cursor>(() => {
    const date = new Date(`${initial}T00:00:00Z`)
    if (isEn) return { y: date.getUTCFullYear(), m: date.getUTCMonth() }
    const p = persianParts(date)
    return { y: p.y, m: p.m }
  })

  const range = isEn
    ? gregorianMonthRange(cursor.y, cursor.m)
    : persianMonthRange(cursor.y, cursor.m)
  // English uses a Sunday-first Gregorian grid; Farsi keeps the Saturday-first Jalali one
  const lead = isEn ? range.start.getUTCDay() : weekIndex(range.start)
  const total = Math.round((+range.end - +range.start) / DAY)
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: total }, (_, i) => isoOf(new Date(+range.start + i * DAY))),
  ]
  // ARIA requires every gridcell to sit inside a row, so chunk the flat cell
  // list into weeks of 7. `lead` is 0-6, so only the final week can be short.
  const weeks: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const shift = (n: number) =>
    setCursor(({ y, m }) => {
      if (isEn) {
        const next = new Date(Date.UTC(y, m + n, 1))
        return { y: next.getUTCFullYear(), m: next.getUTCMonth() }
      }
      const next = m + n
      // stepping back out of فروردین lands in اسفند of the *previous* year, and
      // stepping forward out of اسفند lands in فروردین of the *next* one
      if (next < 1) return { y: y - 1, m: 12 }
      if (next > 12) return { y: y + 1, m: 1 }
      return { y, m: next }
    })

  const todayDate = new Date(`${today}T00:00:00Z`)
  const todayParts = isEn
    ? { y: todayDate.getUTCFullYear(), m: todayDate.getUTCMonth() }
    : persianParts(todayDate)
  const monthsDiff = (cursor.y - todayParts.y) * 12 + (cursor.m - todayParts.m)
  const atCurrentMonth = monthsDiff <= 0
  const atMaxMonth = monthsDiff >= 12

  const jumpToToday = () => setCursor({ y: todayParts.y, m: todayParts.m })

  const monthTitle = isEn
    ? gregorianMonthLabel(cursor.y, cursor.m)
    : monthLabel(cursor.y, cursor.m)
  const shortDays = weekdayShort(locale)
  const dayNames = weekdayNames(locale)

  return (
    <div className="border border-line p-3.5 sm:p-5 md:p-7">
      {/* Month navigation — compact on mobile */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex size-9 items-center justify-center border border-line text-ink transition-colors duration-300 hover:border-fill disabled:opacity-30 sm:size-10"
          aria-label={t.datePicker.prevMonth}
          disabled={atCurrentMonth}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3.5 rtl:rotate-180 sm:size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
          <p className="font-display text-lg font-medium text-title sm:text-xl" aria-live="polite">
            {monthTitle}
          </p>
          {!atCurrentMonth && (
            <button
              type="button"
              onClick={jumpToToday}
              className="text-[0.6875rem] tracking-[0.2em] text-muted underline underline-offset-4 uppercase transition-colors hover:text-ink sm:text-eyebrow"
            >
              {t.datePicker.backToToday}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => shift(1)}
          className="flex size-9 items-center justify-center border border-line text-ink transition-colors duration-300 hover:border-fill disabled:opacity-30 sm:size-10"
          aria-label={t.datePicker.nextMonth}
          disabled={atMaxMonth}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3.5 rtl:rotate-180 sm:size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="mt-4 sm:mt-6" role="grid" aria-label={t.datePicker.gridLabel}>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1" role="row">
          {shortDays.map((w, i) => (
            <div
              key={i}
              className="pb-1.5 text-center text-[0.6875rem] tracking-[0.2em] text-muted uppercase sm:pb-2 sm:text-eyebrow"
              role="columnheader"
              aria-label={dayNames[i]}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {weeks.map((week, w) => (
          <div key={w} className="grid grid-cols-7 gap-0.5 sm:gap-1" role="row">
            {week.map((iso, i) => {
              if (!iso) return <div key={`b${w}-${i}`} role="gridcell" aria-hidden="true" />
              const past = iso < today
              const selected = iso === value
              const isToday = iso === today
              const { reason } = dayStatus(iso, locale)
              const label = longLabel(iso, locale)
              return (
                <div key={iso} role="gridcell" aria-selected={selected} className="group relative">
                  <button
                    type="button"
                    disabled={past}
                    aria-label={reason ? `${label} — ${reason}` : label}
                    onClick={() => onChange(iso)}
                    className={`flex aspect-square w-full items-center justify-center text-[0.875rem] transition-colors duration-300 sm:text-body ${
                      past
                        ? 'cursor-not-allowed text-disabled'
                        : selected
                          ? 'bg-fill text-on-fill font-medium'
                          : reason
                            ? 'bg-closed/10 text-closed hover:bg-closed/15 font-medium'
                            : 'text-ink hover:bg-wash'
                    } ${isToday && !selected ? 'ring-1 ring-inset ring-ink font-semibold' : ''}`}
                  >
                    {formatNumber(dayNumber(iso, locale), locale)}
                  </button>

                  {/* Accessible hover tooltip for closed/holiday reason */}
                  {reason && !past && (
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full start-1/2 z-20 mb-1.5 ltr:-translate-x-1/2 rtl:translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:mb-2"
                    >
                      <div className="whitespace-nowrap border border-line bg-canvas px-2 py-1 text-[10px] leading-tight font-medium text-ink shadow-md sm:px-2.5 sm:text-[11px]">
                        {reason}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <p className="mt-3.5 flex items-center gap-1.5 text-[0.6875rem] tracking-[0.2em] text-muted uppercase sm:mt-5 sm:gap-2 sm:text-eyebrow">
        <span className="inline-block size-2 shrink-0 rounded-full bg-closed" aria-hidden="true" />
        <span>{t.datePicker.closedLegend}</span>
      </p>
    </div>
  )
}
