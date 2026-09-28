# سایت حمیده دلدار — آرایش و پیرایش

Landing page and booking flow for a luxury hairdressing/makeup studio. Persian (Farsi), RTL, fully
responsive, with a five-step booking wizard on its own route.

## Stack

- Vite 8 · React 19 · TypeScript
- Tailwind CSS 4
- Oxlint
- No router, state-management, or date library — routing is History API and the Jalali calendar is
  built on `Intl`

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck (tsc -b) + production build to dist/
npm run preview  # serve dist/
npm run lint
```

> `npm run build` is the real typecheck. `tsconfig.json` is solution-style (`"files": []` plus
> project references), so a bare `npx tsc --noEmit` checks **zero** files and silently passes.

## Routes

| Route | Page | Notes |
| --- | --- | --- |
| `/` | Landing | Hero, Services, Portfolio, Footer. No booking form. |
| `/booking` | Booking wizard | Lazy-loaded; keeps the calendar and form out of the landing bundle. |
| `/booking?loc=studio` \| `?loc=home` | Booking wizard | Preselects the location. Any other value is ignored. |

Services cards deep-link with a preselected location (`/booking?loc=studio`, `/booking?loc=home`),
and Navbar links are route-aware: `#services` / `#portfolio` on the landing page, `/#services` /
`/#portfolio` from the booking page, so section links keep working from either route.

Unknown paths render the landing page.

### Routing implementation

`src/lib/router.tsx` (provider, `Link`, `ScrollManager`) and `src/lib/router-context.ts`
(`useRouter`, context). Points worth knowing if you touch it:

- `Link` renders a real `<a href>`; cmd-click, middle-click, and "copy link address" all behave
  normally, and only plain left-clicks on same-origin paths are intercepted.
- URLs are parsed with the `URL` API, not string splitting. `'#services'.split('?')` yields
  `pathname: '#services'` and an empty hash, which makes `ScrollManager` scroll to the top.
- A `hashchange` listener is required: fragment-only navigation fires no `popstate`.
- `ScrollManager` honours each section's `scroll-mt-24` so the sticky header does not cover a
  target.
- The mobile Navbar panel is `position: absolute`, not in flow. An in-flow panel reflows the page
  while an anchor scroll is in flight and lands the target ~245px off.
- `BookingPage` gives `<Booking>` a `key` derived from `?loc=`. A query-only change
  (`?loc=home` → `?loc=studio`, e.g. via back/forward) keeps the component mounted, and
  `useReducer` only runs its init function once — without the key the form would keep showing the
  old preselection while the URL disagreed. Treat a different `?loc=` as a fresh booking start.

## Booking step scroll anchoring

Every step change scrolls the top of the panel — the step title, the progress bars and the head of
the new step — to sit `16px` below the sticky navbar, so the anchor lands in exactly the same place
on every step. The ref lives on the panel box (`mt-16 border border-line`), which sits at a constant
document offset, so the target scroll position never changes between steps.

Two things that will silently break this:

- **Do not put the ref back on the panel body or use `block: 'center'`.** The body sits below the
  ~118px panel header and centring it ignores both that header and the sticky navbar (81px on
  mobile, 97px on desktop). On a 700px-tall laptop or a phone the body is pushed *above* the
  viewport and the step indicator scrolls off-screen entirely.
- **Do not use `behavior: 'auto'` to skip the animation for reduced motion.** `'auto'` means
  "use the computed `scroll-behavior`", and `html` sets `scroll-behavior: smooth`, so it still
  animates. The inline `scrollBehavior` override in `Booking.tsx` is the deliberate workaround
  (the same one `ScrollManager` uses).

## Deployment

`/booking` is a client-side route, so a hard refresh or a shared link requests a real file that does
not exist. The host **must** rewrite unknown paths to `/index.html`. Configs for the common cases
are already in the repo:

| Host | File |
| --- | --- |
| Vercel | `vercel.json` |
| Netlify | `public/_redirects` (copied to `dist/_redirects`) |
| Apache | `public/.htaccess` (copied to `dist/.htaccess`) |

For any other host, add the equivalent rewrite yourself. Without it, links to `/booking` will 404
on refresh even though client-side navigation works.

## License

MIT — see [`LICENSE`](LICENSE). Copyright © 2026 Hamideh Deldar (website owner); design and
development by Hamed Khomjani. The file carries the English MIT text plus an unofficial Persian
translation for convenience, with the English marked as authoritative in case of any discrepancy.

## Contact details

`src/site.ts` has `phone: ''`. Until a real number is filled in:

- the footer renders a non-interactive "شماره تماس" placeholder instead of a `tel:` link
- the booking confirmation has no WhatsApp hand-off

A real number was deliberately not guessed.

## Content still to supply

- Real before/after photography for the portfolio. `public/portfolio/` currently holds 12 generated
  SVG placeholders produced by `scripts/gen-placeholders.mjs`.
- Optional portfolio video: `Portfolio.tsx` renders `Look.video` if present, but the media element
  is still hidden behind a `hidden` class and needs to be enabled. The tile's `onMouseEnter` play
  handler is already wired up and currently runs against that hidden element.

## Weekends and holidays

`src/lib/holidays.ts` marks پنج‌شنبه/جمعه (`weekIndex()` is Saturday-first, so `5`/`6`) plus the fixed
solar Jalali holidays: نوروز (۱–۴ فروردین), روز جمهوری اسلامی, روز طبیعت, ۱۴–۱۵ خرداد, ۲ اردیبهشت,
۲۲ بهمن, and ۲۹ اسفند.

Closed days render in `--color-closed` (`#9e342c`, 7.04:1 on canvas) with a light tint. The state is
never colour-only — each closed day carries the reason in its `aria-label` and `title`, and a legend
sits under the grid. Past days still render grey, and past takes priority over holiday colour.

Only fixed solar dates are covered. Hijri/Lunar holidays would need per-year conversion data, and
in Iran the official weekend is Friday only (`پنج‌شنبه` is a half day for many businesses) — both
are easy to change in `WEEKEND` / `FIXED_HOLIDAYS`.

## Open questions

Three behaviours are working as coded but may not be what you want:

- **Forward booking is capped at 12 months.** "ماه بعد" is enabled up to a year ahead and "ماه قبل"
  is disabled at the current Jalali month, so clients cannot book into the past and cannot wander
  arbitrarily far into the future. Both bounds are computed in `DatePicker.tsx` via `monthsDiff`
  against today; widen or narrow the `atMaxMonth` limit there.
- **The portfolio before/after reveal is hover-only.** The "before" image sits at `opacity-0` and
  appears via `group-hover` (plus `group-focus`, which covers keyboard users). Touch devices have
  no hover, so on a phone the before image is never shown.
- **Closed days are still bookable.** The red is advisory only: no `disabled` is set, so a client
  can still request a پنج‌شنبه/جمعه or a holiday. If the salon is actually shut, gate the day in
  `DatePicker.tsx` alongside the existing `past` check.

## CSS layering gotcha

Tailwind emits `@layer utilities` *after* `@layer base`, so a utility that sets `outline-none`
silently beats the base `:focus-visible` rule — the focus ring still computes its width and colour
but never paints. The `field` utility in `index.css` must not set `outline-none` for this reason;
do not add it back without re-testing the contact inputs' focus ring.

## Visual review

Layout, contrast, focus rings, ARIA structure, and overflow were verified headlessly (Chrome via
CDP) across 320–1920px, against both the dev server and the production build. Nobody has looked at
the result with their own eyes — run `npm run dev` and check the hero, the Persian type rendering,
and the booking steps before shipping.
