export type Locale = 'fa' | 'en'

/**
 * Persian copy doubles as the schema: `Messages` is inferred from it, so the English
 * dictionary cannot silently miss a string or drift out of shape.
 */
const fa = {
  meta: {
    homeTitle: 'حمیده دلدار | Hamideh Deldar',
    bookingTitle: 'رزرو نوبت | حمیده دلدار',
    description:
      'حمیده دلدار — متخصص کوتاهی و براشینگ مو. ارائه خدمات در استودیو و در محل شما (هوم‌سرویس).',
  },
  common: {
    loading: 'در حال بارگذاری',
    none: '—',
  },
  nav: {
    main: 'ناوبری اصلی',
    services: 'خدمات',
    portfolio: 'نمونه‌کارها',
    booking: 'رزرو نوبت',
    bookOnline: 'رزرو آنلاین',
    menu: 'منو',
    closeMenu: 'بستن منو',
    switchToEnglish: 'تغییر زبان به انگلیسی',
    switchToPersian: 'تغییر زبان به فارسی',
  },
  theme: {
    system: 'سیستم',
    light: 'روشن',
    dark: 'تاریک',
    change: (current: string) => `تغییر پوسته (پوسته فعلی: ${current})`,
    menu: 'انتخاب پوسته',
  },
  hero: {
    eyebrow: 'استودیو و هوم‌سرویس',
    name: 'حمیده دلدار',
    title: 'متخصص کوتاهی و براشینگ مو',
    badge: 'ارائه خدمات در استودیو و در محل شما (هوم‌سرویس)',
    body:
      'برش و براشینگ مو با دقت و آرامش، در فضای استودیو یا در خانه‌ی شما. هر مدل متناسب با فرم صورت و جنس موی شما طراحی می‌شود.',
    bookCta: 'رزرو نوبت آنلاین',
    portfolioCta: 'مشاهده نمونه‌کارها',
    portraitAlt: 'پرتره حمیده دلدار، آرایشگر متخصص کوتاهی و براشینگ مو',
    studio: 'استودیو',
  },
  services: {
    eyebrow: 'خدمات',
    heading: 'کجا موهایتان را کوتاه کنیم؟',
    intro:
      'دو راه برای نوبت: استودیو یا خانه‌ی خودتان. در هر دو حالت، برش و براشینگ با یک استاندارد و توسط خودم انجام می‌شود.',
    bookLink: 'رزرو ←',
    names: {
      cut: 'کوتاهی تخصصی مو',
      blowdry: 'براشینگ و استایلینگ',
      package: 'پکیج اختصاصی کوتاهی + براشینگ',
    },
    cards: {
      studio: {
        index: '۰۱',
        title: 'خدمات در استودیو',
        latin: 'In Studio',
        tag: null,
        body:
          'برش و براشینگ در فضای آرام استودیو، با ابزار حرفه‌ای و مشاوره‌ی دقیق پیش از شروع کار.',
        cta: 'رزرو در استودیو',
      },
      home: {
        index: '۰۲',
        title: 'خدمات در محل شما',
        latin: 'At Home',
        tag: 'VIP',
        body: 'همه‌ی خدمات استودیو، در خانه‌ی شما. کافی است زمان و آدرس خود را اعلام کنید.',
        cta: 'رزرو هوم‌سرویس',
      },
    },
  },
  portfolio: {
    eyebrow: 'نمونه‌کارها',
    heading: 'قبل و بعد، بی‌صافی',
    intro:
      'روی هر تصویر لمس کنید تا نسخه‌ی پیش از خدمات را ببینید. همه‌ی مدل‌ها با مشاوره‌ی فرم صورت انتخاب می‌شوند.',
    instagramCta: 'مشاهده نمونه‌کارهای بیشتر در اینستاگرام',
    categories: {
      all: 'همه نمونه‌کارها',
      cut: 'کوتاهی تخصصی',
      blowdry: 'براشینگ و حالت‌دهی',
    },
    showingAfter: 'پس از خدمات',
    showingBefore: 'پیش از خدمات',
    toggleAria: (title: string, showing: string) => `${title} — نمایش تصویر ${showing}`,
    afterAlt: (title: string) => `مدل ${title} پس از خدمات`,
    beforeAlt: (title: string) => `مدل ${title} پیش از خدمات`,
    badgeAfter: 'بعد · لمس برای قبل',
    badgeBefore: 'قبل · لمس برای بعد',
  },
  footer: {
    eyebrow: 'تماس',
    heading: 'برای نوبت، پیام بدهید',
    call: (phone: string) => `تماس تلفنی ${phone}`,
    phone: 'شماره تماس',
    phoneTitle: 'شماره تماس هنوز منتشر نشده است',
    bookingLink: 'یا از فرم رزرو استفاده کنید',
  },
  booking: {
    eyebrow: 'رزرو نوبت',
    heading: 'نوبت خود را رزرو کنید',
    intro: 'پنج قدم کوتاه. بعد از ثبت فرم، برای هماهنگی نهایی با شما تماس می‌گیرم.',
    steps: ['محل سرویس', 'نوع خدمت', 'تاریخ و ساعت', 'اطلاعات تماس', 'تأیید'],
    locations: {
      studio: {
        title: 'در استودیو',
        latin: 'In Studio',
        note: 'برش و براشینگ در فضای آرام استودیو.',
      },
      home: {
        title: 'در منزل شما',
        latin: 'At Home',
        note: 'همه‌ی خدمات استودیو، در خانه‌ی خودتان.',
      },
    },
    services: {
      cut: { title: 'کوتاهی تخصصی', note: 'برش دقیق و متناسب با فرم صورت' },
      blowdry: { title: 'براشینگ', note: 'خشک‌کردن و استایلینگ حرفه‌ای' },
      package: { title: 'کوتاهی + براشینگ', note: 'پکیج کامل، با تخفیف ویژه' },
    },
    locationLabels: {
      studio: 'در استودیو',
      home: 'در منزل شما',
    },
    serviceLabels: {
      cut: 'کوتاهی تخصصی',
      blowdry: 'براشینگ',
      package: 'کوتاهی + براشینگ',
    },
    slotGroups: {
      morning: 'صبح',
      afternoon: 'عصر',
      evening: 'غروب',
    },
    summary: {
      title: 'درخواست نوبت — حمیده دلدار',
      location: 'محل سرویس',
      service: 'نوع خدمت',
      date: 'تاریخ',
      time: 'ساعت',
      name: 'نام و نام خانوادگی',
      phone: 'شماره تماس',
      address: 'نشانی',
    },
    progress: {
      ready: 'درخواست آماده ارسال',
      stepOf: (step: string, total: string) => `مرحله ${step} از ${total}`,
      startOver: '(شروع از ابتدا)',
    },
    done: {
      eyebrow: 'تأیید',
      heading: 'نوبت شما آماده است',
      body: (name: string) =>
        `ممنون ${name}. برای ثبت نهایی، خلاصه‌ی زیر را در واتساپ یا دایرکت اینستاگرام بفرستید. پس از دریافت، در همان روز با شما تماس می‌گیرم.`,
      whatsapp: 'ارسال در واتساپ',
      instagram: 'ارسال در دایرکت اینستاگرام',
      copied: 'کپی شد',
      copy: 'کپی خلاصه',
      edit: 'ویرایش نوبت',
      newBooking: 'ثبت نوبت جدید',
    },
    step0: {
      legend: 'کجا خدمات را دریافت کنیم؟',
    },
    step1: {
      legend: 'کدام خدمت را می‌خواهید؟',
    },
    step2: {
      question: 'چه روز و چه ساعتی برای شما مناسب است؟',
      selectedDate: 'تاریخ انتخابی:',
      timeLabel: 'ساعت',
      chooseTime: 'ساعت را انتخاب کنید',
      availableSlots: 'ساعت‌های آزاد',
      chooseDate: 'ابتدا از تقویم، یک تاریخ انتخاب کنید.',
    },
    step3: {
      question: 'برای هماهنگی، اطلاعات تماس شما',
      name: 'نام و نام خانوادگی',
      namePlaceholder: 'مثلاً مریم رضایی',
      phone: 'شماره تماس',
      valid: 'معتبر',
      phoneError: 'شماره را به شکل 09121234567 وارد کنید.',
      address: 'نشانی منزل',
      addressPlaceholder: 'منطقه، خیابان، پلاک و کوچه',
      addressError: 'نشانی را کامل‌تر بنویسید.',
    },
    next: 'مرحله بعد',
    submit: 'ثبت نهایی',
    back: 'مرحله قبل',
  },
  datePicker: {
    prevMonth: 'ماه قبل',
    nextMonth: 'ماه بعد',
    backToToday: 'بازگشت به امروز',
    gridLabel: 'انتخاب تاریخ',
    closedLegend: 'تعطیل رسمی و جمعه‌ها',
  },
}

export type Messages = typeof fa

const en: Messages = {
  meta: {
    homeTitle: 'Hamideh Deldar | Haircut & Blow-dry',
    bookingTitle: 'Book an Appointment | Hamideh Deldar',
    description:
      'Hamideh Deldar — haircut and blow-dry specialist. Studio appointments and home visits.',
  },
  common: {
    loading: 'Loading',
    none: '—',
  },
  nav: {
    main: 'Main navigation',
    services: 'Services',
    portfolio: 'Portfolio',
    booking: 'Book',
    bookOnline: 'Book Online',
    menu: 'Menu',
    closeMenu: 'Close menu',
    switchToEnglish: 'Switch to English',
    switchToPersian: 'Switch to Persian',
  },
  theme: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    change: (current: string) => `Change theme (current: ${current})`,
    menu: 'Choose theme',
  },
  hero: {
    eyebrow: 'Studio & Home Service',
    name: 'Hamideh Deldar',
    title: 'Haircut & Blow-dry Specialist',
    badge: 'Available in the studio and at your home',
    body:
      'Precise, unhurried cuts and blow-dry styling — in the studio or in your own home. Every look is shaped around your face and hair type.',
    bookCta: 'Book an Appointment',
    portfolioCta: 'View the Portfolio',
    portraitAlt: 'Portrait of Hamideh Deldar, haircut and blow-dry specialist',
    studio: 'Studio',
  },
  services: {
    eyebrow: 'Services',
    heading: 'Where shall we cut your hair?',
    intro:
      'Two ways to book: at the studio or in your own home. Either way, every cut and blow-dry is done by me, to the same standard.',
    bookLink: 'Book →',
    names: {
      cut: 'Signature Haircut',
      blowdry: 'Blow-dry & Styling',
      package: 'Haircut + Blow-dry Package',
    },
    cards: {
      studio: {
        index: '01',
        title: 'In the Studio',
        latin: 'Studio Visit',
        tag: null,
        body:
          'Cut and blow-dry in the calm of the studio, with professional tools and a careful consultation before we begin.',
        cta: 'Book at the Studio',
      },
      home: {
        index: '02',
        title: 'At Your Home',
        latin: 'Home Service',
        tag: 'VIP',
        body:
          'Every studio service, in your own home. Simply share your preferred time and address.',
        cta: 'Book a Home Visit',
      },
    },
  },
  portfolio: {
    eyebrow: 'Portfolio',
    heading: 'Before & After, Unfiltered',
    intro:
      'Tap any image to see the look before the service. Every style is chosen together, with your face shape in mind.',
    instagramCta: 'See More Work on Instagram',
    categories: {
      all: 'All Work',
      cut: 'Precision Cuts',
      blowdry: 'Blow-dry & Styling',
    },
    showingAfter: 'after the service',
    showingBefore: 'before the service',
    toggleAria: (title: string, showing: string) => `${title} — showing ${showing}`,
    afterAlt: (title: string) => `${title} hairstyle after the service`,
    beforeAlt: (title: string) => `${title} hair before the service`,
    badgeAfter: 'After · tap for before',
    badgeBefore: 'Before · tap for after',
  },
  footer: {
    eyebrow: 'Contact',
    heading: 'Message me to book',
    call: (phone: string) => `Call ${phone}`,
    phone: 'Phone number',
    phoneTitle: 'The phone number has not been published yet',
    bookingLink: 'Or use the booking form',
  },
  booking: {
    eyebrow: 'Appointments',
    heading: 'Reserve Your Appointment',
    intro:
      'Five short steps. Once the form is sent, I will call you to confirm the final details.',
    steps: ['Location', 'Service', 'Date & Time', 'Contact Details', 'Confirm'],
    locations: {
      studio: {
        title: 'At the Studio',
        latin: 'In Studio',
        note: 'Cut and blow-dry in the calm of the studio.',
      },
      home: {
        title: 'At Your Home',
        latin: 'At Home',
        note: 'Every studio service, at your own home.',
      },
    },
    services: {
      cut: { title: 'Signature Haircut', note: 'A precise cut shaped to your face' },
      blowdry: { title: 'Blow-dry', note: 'Professional drying and styling' },
      package: { title: 'Haircut + Blow-dry', note: 'The complete package, with a special rate' },
    },
    locationLabels: {
      studio: 'At the Studio',
      home: 'At Your Home',
    },
    serviceLabels: {
      cut: 'Signature Haircut',
      blowdry: 'Blow-dry',
      package: 'Haircut + Blow-dry',
    },
    slotGroups: {
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
    },
    summary: {
      title: 'Appointment request — Hamideh Deldar',
      location: 'Location',
      service: 'Service',
      date: 'Date',
      time: 'Time',
      name: 'Full name',
      phone: 'Phone number',
      address: 'Address',
    },
    progress: {
      ready: 'Request ready to send',
      stepOf: (step: string, total: string) => `Step ${step} of ${total}`,
      startOver: '(Start over)',
    },
    done: {
      eyebrow: 'Confirmation',
      heading: 'Your Appointment Is Ready',
      body: (name: string) =>
        `Thank you, ${name}. To finalize, send the summary below via WhatsApp or Instagram DM. Once received, I will call you the same day.`,
      whatsapp: 'Send via WhatsApp',
      instagram: 'Send via Instagram DM',
      copied: 'Copied',
      copy: 'Copy summary',
      edit: 'Edit appointment',
      newBooking: 'Book a new appointment',
    },
    step0: {
      legend: 'Where would you like the service?',
    },
    step1: {
      legend: 'Which service would you like?',
    },
    step2: {
      question: 'Which day and time suit you best?',
      selectedDate: 'Selected date:',
      timeLabel: 'Time',
      chooseTime: 'Choose a time',
      availableSlots: 'Available times',
      chooseDate: 'Choose a date from the calendar first.',
    },
    step3: {
      question: 'Your contact details, for coordination',
      name: 'Full name',
      namePlaceholder: 'e.g. Maryam Rezaei',
      phone: 'Phone number',
      valid: 'Valid',
      phoneError: 'Enter the number as 09121234567.',
      address: 'Home address',
      addressPlaceholder: 'Area, street, building and alley',
      addressError: 'Please enter a more complete address.',
    },
    next: 'Next step',
    submit: 'Confirm',
    back: 'Previous step',
  },
  datePicker: {
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    backToToday: 'Back to today',
    gridLabel: 'Choose a date',
    closedLegend: 'Public holidays & Fridays',
  },
}

export const messages: Record<Locale, Messages> = { fa, en }
