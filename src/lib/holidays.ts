import type { Locale } from './i18n.ts'
import { persianParts, weekIndex, weekdayNames } from './jalali.ts'

/**
 * In Iran the working week runs Saturday–Thursday. `weekIndex()` is Saturday-first:
 * 5 = پنج‌شنبه (Thursday), 6 = جمعه (Friday).
 * Friday (6) is the official weekly closed day. Thursday (5) is part of the weekend,
 * but businesses and salons are open and it is NOT a closed day.
 */
export const WEEKEND: number[] = [6]

type HolidayName = { fa: string; en: string }

/**
 * Official Iranian solar (Jalali) holidays whose date is fixed every year.
 */
const FIXED_HOLIDAYS: Record<string, HolidayName> = {
  '1-1': { fa: 'عید نوروز', en: 'Nowruz (Persian New Year)' },
  '1-2': { fa: 'عید نوروز', en: 'Nowruz (Persian New Year)' },
  '1-3': { fa: 'عید نوروز', en: 'Nowruz (Persian New Year)' },
  '1-4': { fa: 'عید نوروز', en: 'Nowruz (Persian New Year)' },
  '1-12': { fa: 'روز جمهوری اسلامی', en: 'Islamic Republic Day' },
  '1-13': { fa: 'روز طبیعت (سیزده‌بدر)', en: 'Nature Day (Sizdah Bedar)' },
  '3-14': { fa: 'رحلت امام خمینی', en: 'Demise of Imam Khomeini' },
  '3-15': { fa: 'قیام ۱۵ خرداد', en: '15 Khordad Uprising' },
  '11-22': { fa: 'پیروزی انقلاب اسلامی', en: 'Islamic Revolution Day' },
  '12-29': { fa: 'روز ملی شدن صنعت نفت', en: 'Nationalization of the Oil Industry' },
  '12-30': { fa: 'آخرین روز سال (عید نوروز)', en: 'Last Day of the Year (Nowruz)' },
}

/**
 * Official Iranian Hijri/Lunar holidays mapped to Jalali dates for years 1403–1407.
 */
const LUNAR_BY_YEAR: Record<string, HolidayName> = {
  // 1403
  '1403-1-23': { fa: 'شهادت حضرت فاطمه', en: 'Martyrdom of Fatima' },
  '1403-4-25': { fa: 'تاسوعای حسینی', en: 'Tasua' },
  '1403-4-26': { fa: 'عاشورای حسینی', en: 'Ashura' },
  '1403-6-4': { fa: 'اربعین حسینی', en: 'Arbaeen' },
  '1403-6-12': {
    fa: 'رحلت پیامبر و شهادت امام حسن',
    en: 'Demise of Prophet Muhammad & Martyrdom of Imam Hasan',
  },
  '1403-6-14': { fa: 'شهادت امام رضا', en: 'Martyrdom of Imam Reza' },
  '1403-6-22': { fa: 'شهادت امام حسن عسکری', en: 'Martyrdom of Imam Hasan al-Askari' },
  '1403-6-31': {
    fa: 'ولادت پیامبر و امام صادق',
    en: 'Birth of Prophet Muhammad & Imam Sadiq',
  },
  '1403-9-15': { fa: 'شهادت حضرت فاطمه', en: 'Martyrdom of Fatima' },
  '1403-10-25': { fa: 'ولادت امام علی', en: 'Birth of Imam Ali' },
  '1403-11-9': { fa: 'مبعث پیامبر', en: "Isra and Mi'raj (Prophet's Ascension)" },
  '1403-11-26': { fa: 'ولادت امام زمان', en: 'Birth of Imam Mahdi' },
  '1403-12-12': { fa: 'شهادت امام علی', en: 'Martyrdom of Imam Ali' },
  '1403-12-22': { fa: 'عید فطر', en: 'Eid al-Fitr' },
  '1403-12-23': { fa: 'تعطیل عید فطر', en: 'Eid al-Fitr Holiday' },

  // 1404
  '1404-1-23': { fa: 'شهادت امام صادق', en: 'Martyrdom of Imam Sadiq' },
  '1404-3-16': { fa: 'عید قربان', en: 'Eid al-Adha' },
  '1404-3-24': { fa: 'عید غدیر', en: 'Eid al-Ghadir' },
  '1404-4-14': { fa: 'تاسوعای حسینی', en: 'Tasua' },
  '1404-4-15': { fa: 'عاشورای حسینی', en: 'Ashura' },
  '1404-5-24': { fa: 'اربعین حسینی', en: 'Arbaeen' },
  '1404-6-2': {
    fa: 'رحلت پیامبر و شهادت امام حسن',
    en: 'Demise of Prophet Muhammad & Martyrdom of Imam Hasan',
  },
  '1404-6-4': { fa: 'شهادت امام رضا', en: 'Martyrdom of Imam Reza' },
  '1404-6-11': { fa: 'شهادت امام حسن عسکری', en: 'Martyrdom of Imam Hasan al-Askari' },
  '1404-6-20': {
    fa: 'ولادت پیامبر و امام صادق',
    en: 'Birth of Prophet Muhammad & Imam Sadiq',
  },
  '1404-9-4': { fa: 'شهادت حضرت فاطمه', en: 'Martyrdom of Fatima' },
  '1404-10-13': { fa: 'ولادت امام علی', en: 'Birth of Imam Ali' },
  '1404-10-27': { fa: 'مبعث پیامبر', en: "Isra and Mi'raj (Prophet's Ascension)" },
  '1404-11-15': { fa: 'ولادت امام زمان', en: 'Birth of Imam Mahdi' },
  '1404-12-1': { fa: 'شهادت امام علی', en: 'Martyrdom of Imam Ali' },
  '1404-12-11': { fa: 'عید فطر', en: 'Eid al-Fitr' },
  '1404-12-12': { fa: 'تعطیل عید فطر', en: 'Eid al-Fitr Holiday' },

  // 1405
  '1405-1-12': { fa: 'شهادت امام صادق', en: 'Martyrdom of Imam Sadiq' },
  '1405-6-13': { fa: 'اربعین حسینی', en: 'Arbaeen' },
  '1405-6-21': {
    fa: 'رحلت پیامبر و شهادت امام حسن',
    en: 'Demise of Prophet Muhammad & Martyrdom of Imam Hasan',
  },
  '1405-6-23': { fa: 'شهادت امام رضا', en: 'Martyrdom of Imam Reza' },
  '1405-6-30': { fa: 'شهادت امام حسن عسکری', en: 'Martyrdom of Imam Hasan al-Askari' },
  '1405-7-9': {
    fa: 'ولادت پیامبر و امام صادق',
    en: 'Birth of Prophet Muhammad & Imam Sadiq',
  },
  '1405-8-23': { fa: 'شهادت حضرت فاطمه', en: 'Martyrdom of Fatima' },
  '1405-9-3': { fa: 'ولادت امام علی', en: 'Birth of Imam Ali' },
  '1405-9-17': { fa: 'مبعث پیامبر', en: "Isra and Mi'raj (Prophet's Ascension)" },
  '1405-10-4': { fa: 'ولادت امام زمان', en: 'Birth of Imam Mahdi' },
  '1405-10-19': { fa: 'شهادت امام علی', en: 'Martyrdom of Imam Ali' },
  '1405-10-29': { fa: 'عید فطر', en: 'Eid al-Fitr' },
  '1405-10-30': { fa: 'تعطیل عید فطر', en: 'Eid al-Fitr Holiday' },
  '1405-11-23': { fa: 'شهادت امام صادق', en: 'Martyrdom of Imam Sadiq' },
  '1405-12-10': { fa: 'عید قربان', en: 'Eid al-Adha' },
  '1405-12-18': { fa: 'عید غدیر', en: 'Eid al-Ghadir' },

  // 1406
  '1406-1-8': { fa: 'تاسوعای حسینی', en: 'Tasua' },
  '1406-1-9': { fa: 'عاشورای حسینی', en: 'Ashura' },
  '1406-2-18': { fa: 'اربعین حسینی', en: 'Arbaeen' },
  '1406-2-26': {
    fa: 'رحلت پیامبر و شهادت امام حسن',
    en: 'Demise of Prophet Muhammad & Martyrdom of Imam Hasan',
  },
  '1406-2-27': { fa: 'شهادت امام رضا', en: 'Martyrdom of Imam Reza' },
  '1406-3-5': { fa: 'شهادت امام حسن عسکری', en: 'Martyrdom of Imam Hasan al-Askari' },
  '1406-3-14': {
    fa: 'ولادت پیامبر و امام صادق',
    en: 'Birth of Prophet Muhammad & Imam Sadiq',
  },
  '1406-5-28': { fa: 'شهادت حضرت فاطمه', en: 'Martyrdom of Fatima' },
  '1406-6-7': { fa: 'ولادت امام علی', en: 'Birth of Imam Ali' },
  '1406-6-21': { fa: 'مبعث پیامبر', en: "Isra and Mi'raj (Prophet's Ascension)" },
  '1406-7-8': { fa: 'ولادت امام زمان', en: 'Birth of Imam Mahdi' },
  '1406-7-23': { fa: 'شهادت امام علی', en: 'Martyrdom of Imam Ali' },
  '1406-8-4': { fa: 'عید فطر', en: 'Eid al-Fitr' },
  '1406-8-5': { fa: 'تعطیل عید فطر', en: 'Eid al-Fitr Holiday' },
  '1406-8-28': { fa: 'شهادت امام صادق', en: 'Martyrdom of Imam Sadiq' },
  '1406-10-15': { fa: 'عید قربان', en: 'Eid al-Adha' },
  '1406-10-23': { fa: 'عید غدیر', en: 'Eid al-Ghadir' },
  '1406-11-27': { fa: 'تاسوعای حسینی', en: 'Tasua' },
  '1406-11-28': { fa: 'عاشورای حسینی', en: 'Ashura' },

  // 1407
  '1407-1-7': { fa: 'اربعین حسینی', en: 'Arbaeen' },
  '1407-1-15': {
    fa: 'رحلت پیامبر و شهادت امام حسن',
    en: 'Demise of Prophet Muhammad & Martyrdom of Imam Hasan',
  },
  '1407-1-17': { fa: 'شهادت امام رضا', en: 'Martyrdom of Imam Reza' },
  '1407-1-24': { fa: 'شهادت امام حسن عسکری', en: 'Martyrdom of Imam Hasan al-Askari' },
  '1407-2-3': {
    fa: 'ولادت پیامبر و امام صادق',
    en: 'Birth of Prophet Muhammad & Imam Sadiq',
  },
  '1407-4-17': { fa: 'شهادت حضرت فاطمه', en: 'Martyrdom of Fatima' },
  '1407-4-27': { fa: 'ولادت امام علی', en: 'Birth of Imam Ali' },
  '1407-5-11': { fa: 'مبعث پیامبر', en: "Isra and Mi'raj (Prophet's Ascension)" },
  '1407-5-28': { fa: 'ولادت امام زمان', en: 'Birth of Imam Mahdi' },
  '1407-6-13': { fa: 'شهادت امام علی', en: 'Martyrdom of Imam Ali' },
  '1407-6-23': { fa: 'عید فطر', en: 'Eid al-Fitr' },
  '1407-6-24': { fa: 'تعطیل عید فطر', en: 'Eid al-Fitr Holiday' },
  '1407-7-17': { fa: 'شهادت امام صادق', en: 'Martyrdom of Imam Sadiq' },
  '1407-9-4': { fa: 'عید قربان', en: 'Eid al-Adha' },
  '1407-9-12': { fa: 'عید غدیر', en: 'Eid al-Ghadir' },
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

export function dayStatus(iso: string, locale: Locale = 'fa'): DayStatus {
  const date = new Date(`${iso}T00:00:00Z`)
  const { y, m, d } = persianParts(date)
  // A solar and a lunar holiday can land on the same day (e.g. ۱۲ فروردین ۱۴۰۵ is both
  // روز جمهوری اسلامی and شهادت امام صادق). Both are real, so join the names rather than
  // letting `??` drop one of them from the tooltip and the accessible name.
  const solar = FIXED_HOLIDAYS[`${m}-${d}`]
  const lunar = LUNAR_BY_YEAR[`${y}-${m}-${d}`]
  const separator = locale === 'en' ? ', ' : '، '
  const holiday =
    solar && lunar
      ? `${solar[locale]}${separator}${lunar[locale]}`
      : solar
        ? solar[locale]
        : lunar
          ? lunar[locale]
          : null
  const index = weekIndex(date)
  const weekend = WEEKEND.includes(index)
  return {
    weekend,
    holiday,
    closed: weekend || holiday !== null,
    reason: holiday ?? (weekend ? weekdayNames(locale)[index] : null),
  }
}

/** "۶ مهر ۱۴۰۵ — جمعه" for closed days, otherwise null. */
export const closureSuffix = (iso: string, locale: Locale = 'fa'): string | null => {
  const { reason } = dayStatus(iso, locale)
  return reason ? ` — ${reason}` : null
}
