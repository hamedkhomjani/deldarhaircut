import { useState } from 'react'
import {
  WEEKDAYS,
  WEEKDAY_NAMES,
  isoOf,
  longLabel,
  monthLabel,
  persianMonthRange,
  persianParts,
  toFa,
  todayIso,
  weekIndex,
} from '../lib/jalali.ts'
import { dayStatus } from '../lib/holidays.ts'

const DAY = 86400000

type Props = {
  value: string | null
  onChange: (iso: string) => void
}

export default function DatePicker({ value, onChange }: Props) {
  const today = todayIso()
  const initial = value ?? today
  const [cursor, setCursor] = useState(() => {
    const p = persianParts(new Date(`${initial}T00:00:00Z`))
    return { y: p.y, m: p.m }
  })

  const { start, end } = persianMonthRange(cursor.y, cursor.m)
  const lead = weekIndex(start)
  const total = Math.round((+end - +start) / DAY)
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: total }, (_, i) => isoOf(new Date(+start + i * DAY))),
  ]
  // ARIA requires every gridcell to sit inside a row, so chunk the flat cell
  // list into weeks of 7. `lead` is 0-6, so only the final week can be short.
  const weeks: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const shift = (n: number) =>
    setCursor(({ y, m }) => {
      const next = m + n
      // stepping back out of فروردین lands in اسفند of the *previous* year, and
      // stepping forward out of اسفند lands in فروردین of the *next* one
      if (next < 1) return { y: y - 1, m: 12 }
      if (next > 12) return { y: y + 1, m: 1 }
      return { y, m: next }
    })

  const todayParts = persianParts(new Date(`${today}T00:00:00Z`))
  const monthsDiff = (cursor.y - todayParts.y) * 12 + (cursor.m - todayParts.m)
  const atCurrentMonth = monthsDiff <= 0
  const atMaxMonth = monthsDiff >= 12

  const jumpToToday = () => setCursor({ y: todayParts.y, m: todayParts.m })

  return (
    <div className="border border-line p-5 sm:p-7">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex size-10 items-center justify-center border border-line text-ink transition-colors duration-300 hover:border-fill disabled:opacity-30"
          aria-label="ماه قبل"
          disabled={atCurrentMonth}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-1">
          <p className="font-display text-xl font-medium text-title" aria-live="polite">
            {monthLabel(cursor.y, cursor.m)}
          </p>
          {!atCurrentMonth && (
            <button
              type="button"
              onClick={jumpToToday}
              className="text-eyebrow text-muted underline underline-offset-4 transition-colors hover:text-ink"
            >
              بازگشت به امروز
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => shift(1)}
          className="flex size-10 items-center justify-center border border-line text-ink transition-colors duration-300 hover:border-fill disabled:opacity-30"
          aria-label="ماه بعد"
          disabled={atMaxMonth}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-6" role="grid" aria-label="انتخاب تاریخ">
        <div className="grid grid-cols-7 gap-1" role="row">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className="pb-2 text-center text-eyebrow text-muted"
              role="columnheader"
              aria-label={WEEKDAY_NAMES[i]}
            >
              {w}
            </div>
          ))}
        </div>

        {weeks.map((week, w) => (
          <div key={w} className="grid grid-cols-7 gap-1" role="row">
            {week.map((iso, i) => {
              if (!iso) return <div key={`b${w}-${i}`} role="gridcell" aria-hidden="true" />
              const past = iso < today
              const selected = iso === value
              const isToday = iso === today
              const { closed, reason } = dayStatus(iso)
              return (
                <div key={iso} role="gridcell" aria-selected={selected} className="group relative">
                  <button
                    type="button"
                    disabled={past}
                    aria-label={reason ? `${longLabel(iso)} — ${reason}` : longLabel(iso)}
                    onClick={() => onChange(iso)}
                    className={`flex aspect-square w-full items-center justify-center text-body transition-colors duration-300 ${
                      past
                        ? 'cursor-not-allowed text-disabled'
                        : selected
                          ? 'bg-fill text-on-fill font-medium'
                          : closed
                            ? 'bg-closed/10 text-closed hover:bg-closed/15 font-medium'
                            : 'text-ink hover:bg-wash'
                    } ${isToday && !selected ? 'ring-1 ring-inset ring-ink font-semibold' : ''}`}
                  >
                    {toFa(persianParts(new Date(`${iso}T00:00:00Z`)).d)}
                  </button>

                  {/* Accessible hover tooltip for closed/holiday reason */}
                  {reason && !past && (
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full start-1/2 z-20 mb-2 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <div className="whitespace-nowrap border border-line bg-canvas px-2.5 py-1 text-[11px] leading-tight font-medium text-ink shadow-md">
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

      <p className="mt-5 flex items-center gap-2 text-eyebrow text-muted">
        <span className="inline-block size-2 shrink-0 rounded-full bg-closed" aria-hidden="true" />
        <span>تعطیل رسمی و جمعه‌ها</span>
      </p>
    </div>
  )
}
