const faDigits = '۰۱۲۳۴۵۶۷۸۹'

/** Accepts Persian, Arabic and ASCII digits; strips separators; returns 09XXXXXXXXX. */
export const normalizePhone = (raw: string) => {
  let d = raw
    .replace(/[۰-۹]/g, (c) => String(faDigits.indexOf(c)))
    .replace(/[٠-٩]/g, (c) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)))
    .replace(/[^\d+]/g, '')
  if (d.startsWith('+98')) d = `0${d.slice(3)}`
  else if (d.startsWith('0098')) d = `0${d.slice(4)}`
  else if (d.startsWith('98') && d.length === 12) d = `0${d.slice(2)}`
  else if (d.startsWith('9') && d.length === 10) d = `0${d}`
  return d
}

export const phoneValid = (raw: string) => /^09\d{9}$/.test(normalizePhone(raw))
