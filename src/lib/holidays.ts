import { WEEKDAY_NAMES, persianParts, weekIndex } from './jalali.ts'

/**
 * In Iran the working week runs Saturday–Thursday. `weekIndex()` is Saturday-first:
 * 5 = پنج‌شنبه (Thursday), 6 = جمعه (Friday).
 * Friday (6) is the official weekly closed day. Thursday (5) is part of the weekend,
 * but businesses and salons are open and it is NOT a closed day.
 */
export const WEEKEND: number[] = [6]

/**
 * Official Iranian solar (Jalali) holidays whose date is fixed every year.
 */
const FIXED_HOLIDAYS: Record<string, string> = {
  '1-1': 'عید نوروز',
  '1-2': 'عید نوروز',
  '1-3': 'عید نوروز',
  '1-4': 'عید نوروز',
  '1-12': 'روز جمهوری اسلامی',
  '1-13': 'روز طبیعت (سیزده‌بدر)',
  '3-14': 'رحلت امام خمینی',
  '3-15': 'قیام ۱۵ خرداد',
  '11-22': 'پیروزی انقلاب اسلامی',
  '12-29': 'روز ملی شدن صنعت نفت',
  '12-30': 'آخرین روز سال (عید نوروز)',
}

/**
 * Official Iranian Hijri/Lunar holidays mapped to Jalali dates for years 1403–1407.
 */
const LUNAR_BY_YEAR: Record<string, string> = {
  // 1403
  '1403-1-23': 'شهادت حضرت فاطمه',
  '1403-4-25': 'تاسوعای حسینی',
  '1403-4-26': 'عاشورای حسینی',
  '1403-6-4': 'اربعین حسینی',
  '1403-6-12': 'رحلت پیامبر و شهادت امام حسن',
  '1403-6-14': 'شهادت امام رضا',
  '1403-6-22': 'شهادت امام حسن عسکری',
  '1403-6-31': 'ولادت پیامبر و امام صادق',
  '1403-9-15': 'شهادت حضرت فاطمه',
  '1403-10-25': 'ولادت امام علی',
  '1403-11-9': 'مبعث پیامبر',
  '1403-11-26': 'ولادت امام زمان',
  '1403-12-12': 'شهادت امام علی',
  '1403-12-22': 'عید فطر',
  '1403-12-23': 'تعطیل عید فطر',

  // 1404
  '1404-1-23': 'شهادت امام صادق',
  '1404-3-16': 'عید قربان',
  '1404-3-24': 'عید غدیر',
  '1404-4-14': 'تاسوعای حسینی',
  '1404-4-15': 'عاشورای حسینی',
  '1404-5-24': 'اربعین حسینی',
  '1404-6-2': 'رحلت پیامبر و شهادت امام حسن',
  '1404-6-4': 'شهادت امام رضا',
  '1404-6-11': 'شهادت امام حسن عسکری',
  '1404-6-20': 'ولادت پیامبر و امام صادق',
  '1404-9-4': 'شهادت حضرت فاطمه',
  '1404-10-13': 'ولادت امام علی',
  '1404-10-27': 'مبعث پیامبر',
  '1404-11-15': 'ولادت امام زمان',
  '1404-12-1': 'شهادت امام علی',
  '1404-12-11': 'عید فطر',
  '1404-12-12': 'تعطیل عید فطر',

  // 1405
  '1405-1-12': 'شهادت امام صادق',
  '1405-6-13': 'اربعین حسینی',
  '1405-6-21': 'رحلت پیامبر و شهادت امام حسن',
  '1405-6-23': 'شهادت امام رضا',
  '1405-6-30': 'شهادت امام حسن عسکری',
  '1405-7-9': 'ولادت پیامبر و امام صادق',
  '1405-8-23': 'شهادت حضرت فاطمه',
  '1405-9-3': 'ولادت امام علی',
  '1405-9-17': 'مبعث پیامبر',
  '1405-10-4': 'ولادت امام زمان',
  '1405-10-19': 'شهادت امام علی',
  '1405-10-29': 'عید فطر',
  '1405-10-30': 'تعطیل عید فطر',
  '1405-11-23': 'شهادت امام صادق',
  '1405-12-10': 'عید قربان',
  '1405-12-18': 'عید غدیر',

  // 1406
  '1406-1-8': 'تاسوعای حسینی',
  '1406-1-9': 'عاشورای حسینی',
  '1406-2-18': 'اربعین حسینی',
  '1406-2-26': 'رحلت پیامبر و شهادت امام حسن',
  '1406-2-27': 'شهادت امام رضا',
  '1406-3-5': 'شهادت امام حسن عسکری',
  '1406-3-14': 'ولادت پیامبر و امام صادق',
  '1406-5-28': 'شهادت حضرت فاطمه',
  '1406-6-7': 'ولادت امام علی',
  '1406-6-21': 'مبعث پیامبر',
  '1406-7-8': 'ولادت امام زمان',
  '1406-7-23': 'شهادت امام علی',
  '1406-8-4': 'عید فطر',
  '1406-8-5': 'تعطیل عید فطر',
  '1406-8-28': 'شهادت امام صادق',
  '1406-10-15': 'عید قربان',
  '1406-10-23': 'عید غدیر',
  '1406-11-27': 'تاسوعای حسینی',
  '1406-11-28': 'عاشورای حسینی',

  // 1407
  '1407-1-7': 'اربعین حسینی',
  '1407-1-15': 'رحلت پیامبر و شهادت امام حسن',
  '1407-1-17': 'شهادت امام رضا',
  '1407-1-24': 'شهادت امام حسن عسکری',
  '1407-2-3': 'ولادت پیامبر و امام صادق',
  '1407-4-17': 'شهادت حضرت فاطمه',
  '1407-4-27': 'ولادت امام علی',
  '1407-5-11': 'مبعث پیامبر',
  '1407-5-28': 'ولادت امام زمان',
  '1407-6-13': 'شهادت امام علی',
  '1407-6-23': 'عید فطر',
  '1407-6-24': 'تعطیل عید فطر',
  '1407-7-17': 'شهادت امام صادق',
  '1407-9-4': 'عید قربان',
  '1407-9-12': 'عید غدیر',
}

export type DayStatus = {
  /** جمعه */
  weekend: boolean
  /** Name of the solar or lunar holiday, when this day is one */
  holiday: string | null
  /** Friday or an official holiday — drawn in --color-closed */
  closed: boolean
  /** Human-readable reason, for the accessible name and tooltip. Never colour-only. */
  reason: string | null
}

export function dayStatus(iso: string): DayStatus {
  const date = new Date(`${iso}T00:00:00Z`)
  const { y, m, d } = persianParts(date)
  // A solar and a lunar holiday can land on the same day (e.g. ۱۲ فروردین ۱۴۰۵ is both
  // روز جمهوری اسلامی and شهادت امام صادق). Both are real, so join the names rather than
  // letting `??` drop one of them from the tooltip and the accessible name.
  const solar = FIXED_HOLIDAYS[`${m}-${d}`]
  const lunar = LUNAR_BY_YEAR[`${y}-${m}-${d}`]
  const holiday = solar && lunar ? `${solar}، ${lunar}` : (solar ?? lunar ?? null)
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
