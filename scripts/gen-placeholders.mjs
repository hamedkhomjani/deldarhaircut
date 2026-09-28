import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'public', 'portfolio')
mkdirSync(OUT, { recursive: true })

// head at (400,352) r=120, shoulders below — abstract, flat, matches the palette
const variants = [
  {
    id: '1',
    hair: 'M280 344a120 120 0 0 1 240 0v-8c0-70-54-124-120-124s-120 54-120 124z',
    extra: '<path d="M286 300c22-46 66-72 114-72s92 26 114 72" fill="none" stroke="#ffffff" stroke-opacity=".28" stroke-width="7" stroke-linecap="round"/>',
  },
  {
    id: '2',
    hair: 'M268 330c0-78 59-136 132-136s132 58 132 136v96c0 12-9 21-21 21s-21-9-21-21v-52H310v52c0 12-9 21-21 21s-21-9-21-21z',
    extra: '<path d="M300 372h200" fill="none" stroke="#ffffff" stroke-opacity=".26" stroke-width="7" stroke-linecap="round"/>',
  },
  {
    id: '3',
    hair: 'M262 336c0-84 62-146 138-146s138 62 138 146v300c0 13-10 23-23 23s-23-10-23-23V470H308v166c0 13-10 23-23 23s-23-10-23-23z',
    extra: '<path d="M310 300c26-40 62-60 90-60s64 20 90 60" fill="none" stroke="#ffffff" stroke-opacity=".24" stroke-width="7" stroke-linecap="round"/>',
  },
  {
    id: '4',
    hair: 'M244 336c0-92 70-158 156-158s156 66 156 158c0 74-40 116-72 116s-52-30-84-30-60 30-84 30-72-42-72-116z',
    extra: '',
  },
  {
    id: '5',
    hair: 'M276 316c0-74 56-132 124-132s124 58 124 132c0 40-22 66-52 66-34 0-40-30-72-30s-38 30-72 30c-30 0-52-26-52-66z',
    extra: '<path d="M330 226c22-18 48-26 70-26s48 8 70 26" fill="none" stroke="#ffffff" stroke-opacity=".3" stroke-width="7" stroke-linecap="round"/>',
  },
  {
    id: '6',
    hair: 'M270 332c0-80 58-140 130-140s130 60 130 140v150c0 12-9 21-21 21s-21-9-21-21V400c0-46-38-78-88-78s-88 32-88 78v122c0 12-9 21-21 21s-21-9-21-21z',
    extra: '<path d="M296 356c28-30 62-46 104-46s76 16 104 46" fill="none" stroke="#ffffff" stroke-opacity=".26" stroke-width="7" stroke-linecap="round"/>',
  },
]

const shell = (hair, extra, tone) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img">
  <rect width="800" height="1000" fill="${tone.bg}" />
  <circle cx="400" cy="352" r="120" fill="${tone.skin}" />
  <path d="M400 548c-134 0-243 96-260 222a16 16 0 0 0 16 18h488a16 16 0 0 0 16-18c-17-126-126-222-260-222Z" fill="${tone.skin}" />
  <path d="${hair}" fill="${tone.hair}" />
  ${extra}
</svg>
`

// "before" = washed out and low-contrast; "after" = defined with a highlight
const before = { bg: '#F2EFEA', skin: '#E4DED4', hair: '#D6CFC3' }
const after = { bg: '#FFFFFF', skin: '#EDE7DE', hair: '#C4BCAE' }

for (const v of variants) {
  writeFileSync(join(OUT, `before-${v.id}.svg`), shell(v.hair, v.extra, before))
  writeFileSync(join(OUT, `after-${v.id}.svg`), shell(v.hair, v.extra, after))
}

console.log('wrote', variants.length * 2, 'files to public/portfolio')
