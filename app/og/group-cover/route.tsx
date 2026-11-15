import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import bidiFactory from 'bidi-js'

/**
 * תמונת נושא (cover) לקבוצת הפייסבוק ולעמוד הפייסבוק, בעיצוב של האתר.
 * GET /og/group-cover          -> 1640x856 (קבוצה)
 * GET /og/group-cover?for=page -> 1640x624 (עמוד; פי 2 מ-820x312)
 * התוכן ממורכז, כי פייסבוק חותך את הצדדים בנייד.
 */
export const runtime = 'nodejs'

const FONT_DIR = join(process.cwd(), 'assets', 'og-fonts')
const heeboBold = readFileSync(join(FONT_DIR, 'Heebo-Bold.ttf'))
const heeboBlack = readFileSync(join(FONT_DIR, 'Heebo-Black.ttf'))

const BRAND = '#c99a5b'
const BRAND_LIGHT = '#e8c887'

// satori לא מיישם bidi - מסדרים מראש לסדר ויזואלי (כמו ב-/og)
const bidi = bidiFactory()
function vis(text: string): string {
  const levels = bidi.getEmbeddingLevels(text, 'rtl')
  const flips = bidi.getReorderSegments(text, levels)
  const chars = text.split('')
  for (const [start, end] of flips) {
    const slice = chars.slice(start, end + 1).reverse()
    chars.splice(start, slice.length, ...slice)
  }
  return chars.join('')
}

const CHIPS = ['שאלות ותשובות', 'המלצות לפי עיר', 'חברים לטיול', 'כלב אבד או נמצא']

export function GET(req: Request) {
  const forPage = new URL(req.url).searchParams.get('for') === 'page'
  const W = 1640
  const H = forPage ? 624 : 856
  const k = forPage ? 0.82 : 1

  return new ImageResponse(
    (
      <div
        style={{
          width: `${W}px`, height: `${H}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(145deg, #2a2018 0%, #3b2d1e 55%, #221a12 100%)', fontFamily: 'Heebo', position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '-220px', left: '-160px', width: '620px', height: '620px', borderRadius: '620px', background: BRAND, opacity: 0.2, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-200px', right: '-140px', width: '520px', height: '520px', borderRadius: '520px', background: BRAND_LIGHT, opacity: 0.1, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '12px', background: BRAND_LIGHT, display: 'flex' }} />

        <div style={{ display: 'flex', alignItems: 'center', direction: 'rtl', fontSize: `${Math.round(132 * k)}px`, fontWeight: 900, color: '#fff', letterSpacing: '-3px', lineHeight: 1.05 }}>
          <span style={{ display: 'flex', direction: 'rtl', gap: '26px' }}>
            <span>{vis('קהילה')}</span>
            <span style={{ color: BRAND_LIGHT }}>{vis('על ארבע')}</span>
          </span>
        </div>

        <div style={{ display: 'flex', direction: 'rtl', marginTop: `${Math.round(22 * k)}px`, fontSize: `${Math.round(54 * k)}px`, fontWeight: 700, color: 'rgba(255,255,255,.92)' }}>
          {vis('בעלי כלבים מכל הארץ, במקום אחד')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '16px', marginTop: `${Math.round(44 * k)}px` }}>
          {CHIPS.map((c) => (
            <div key={c} style={{ display: 'flex', direction: 'rtl', background: 'rgba(232,200,135,.16)', border: '2px solid rgba(232,200,135,.5)', color: BRAND_LIGHT, fontSize: `${Math.round(34 * k)}px`, fontWeight: 700, padding: '10px 26px', borderRadius: '100px' }}>
              {vis(c)}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginTop: `${Math.round(44 * k)}px`, fontSize: `${Math.round(38 * k)}px`, fontWeight: 700, color: '#fff' }}>walkonfour.org</div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: 'Heebo', data: heeboBold, weight: 700, style: 'normal' },
        { name: 'Heebo', data: heeboBlack, weight: 900, style: 'normal' },
      ],
      headers: { 'Cache-Control': 'public, max-age=86400' },
    },
  )
}
