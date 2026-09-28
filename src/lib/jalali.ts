const DAY = 86400000

export const faDigits = '۰۱۲۳۴۵۶۷۸۹'

export const toFa = (value: string | number): string =>
  String(value).replace(/\d/g, (d) => faDigits[Number(d)])

// numeric parts: en-US on the persian calendar gives ASCII digits, easy to parse
const partsFmt = new Intl.DateTimeFormat('en-US-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
})

// display strings: fa-IR gives Persian month names and Persian digits, no era suffix
const monthFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const longFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
})



export const persianParts = (d: Date) => {
  const out: Record<string, number> = {}
  for (const { type, value } of partsFmt.formatToParts(d)) {
    if (type !== 'literal') out[type] = Number(value)
  }
  return { y: out.year, m: out.month, d: out.day }
}

export const isoOf = (d: Date): string => d.toISOString().slice(0, 10)

/** First and last day (exclusive) of a Jalali month, as UTC Dates. */
export const persianMonthRange = (jy: number, jm: number) => {
  // Nowruz lands 19-21 March of Gregorian year jy + 621, so (jm - 1) * 31 days
  // from 1 March is at most ~31 days before the true first day of the month
  let start = new Date(Date.UTC(jy + 621, 2, 1) + (jm - 1) * 31 * DAY)
  for (let i = 0; i < 40; i++) {
    const p = persianParts(start)
    if (p.y === jy && p.m === jm) break
    start = new Date(start.getTime() + DAY)
  }
  const end = new Date(start.getTime())
  for (let i = 0; i < 35; i++) {
    const p = persianParts(end)
    if (p.y !== jy || p.m !== jm) break
    end.setUTCDate(end.getUTCDate() + 1)
  }
  return { start, end }
}

export const monthLabel = (jy: number, jm: number) =>
  monthFmt.format(persianMonthRange(jy, jm).start)

export const longLabel = (iso: string) => longFmt.format(new Date(`${iso}T00:00:00Z`))

/** Saturday-first column index (0 = شنبه). */
export const weekIndex = (d: Date) => (d.getUTCDay() + 1) % 7

export const WEEKDAYS = [
  'ش',
  'ی',
  'د',
  'س',
  'چ',
  'پ',
  'ج',
]

export const WEEKDAY_NAMES = [
  'شنبه',
  'یک‌شنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
]

export const todayIso = (): string => {
  const now = new Date()
  return isoOf(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

export const addDays = (iso: string, n: number) =>
  isoOf(new Date(new Date(`${iso}T00:00:00Z`).getTime() + n * DAY))
