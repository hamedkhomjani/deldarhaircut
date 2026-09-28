import { WEEKDAY_NAMES, persianParts, weekIndex } from './jalali.ts'

/**
 * In Iran the working week runs Saturday–Wednesday. `weekIndex()` is Saturday-first, so
 * 5 = پنج‌شنبه (Thursday) and 6 = جمعه (Friday).
 *
 * Note: `todayIso()` builds a UTC date from the visitor's *local* Y/M/D, so the weekday is
 * resolved in UTC. That is a deliberate, harmless mismatch: UTC midnight is at most a few
 * hours from local midnight, and a day only becomes "closed" because of the weekend, which
 * every visitor agrees on.
 */
export const WEEKEND: number[] = [5, 6]

/**
 * Official Iranian holidays whose Jalali date is identical every year, because the Persian
 * (solar) calendar has no lunar drift. These are derived from the date alone.
 *
 * Lunar / Hijri holidays (عاشورا, اربعین, میلاد, عید فطر, عید قربان) are deliberately NOT
 * listed: their Jalali date shifts every Gregorian year, so they need a Hijri conversion
 * table that this project does not carry. Add them here per year if you need them.
 */
const FIXED_HOLIDAYS: Record<string, string> = {
  '1-1': 'عید نوروز',
  '1-2': 'عید نوروز',
  '1-3': 'عید نوروز',
  '1-4': 'عید نوروز',
  '1-12': 'روز جمهوری اسلامی',
  '1-13': 'روز طبیعت',
  '3-14': 'رحلت امام خمینی',
  '3-15': 'قیام ۱۵ خرداد',
  '5-2': 'شهادت امام رضا',
  '11-22': 'پیروزی انقلاب اسلامی',
  '12-29': 'روز ملی شدن صنعت نفت',
}

export type DayStatus = {
  /** پنج‌شنبه or جمعه */
  weekend: boolean
  /** Name of the fixed solar holiday, when this day is one */
  holiday: string | null
  /** Weekend or a fixed holiday — drawn in --color-closed */
  closed: boolean
  /** Human-readable reason, for the accessible name and tooltip. Never colour-only. */
  reason: string | null
}

export function dayStatus(iso: string): DayStatus {
  const date = new Date(`${iso}T00:00:00Z`)
  const { m, d } = persianParts(date)
  const holiday = FIXED_HOLIDAYS[`${m}-${d}`] ?? null
  const index = weekIndex(date)
  const weekend = WEEKEND.includes(index)
  return {
    weekend,
    holiday,
    closed: weekend || holiday !== null,
    reason: holiday ?? (weekend ? WEEKDAY_NAMES[index] : null),
  }
}

/** "۶ مهر ۱۴۰۵ — جمعه" for closed days, otherwise null. */
export const closureSuffix = (iso: string): string | null => {
  const { reason } = dayStatus(iso)
  return reason ? ` — ${reason}` : null
}
