import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import bidiFactory from 'bidi-js'
import { SITE_TAGLINE } from '@/lib/seo'

/**
 * מחולל תמונות שיתוף (Open Graph) דינמי וממותג.
 * GET /og?title=...&subtitle=...&tag=...
 * מחזיר PNG 1200x630 בפלטת קרם-לברדור, RTL, עם הלוגו והטאגליין.
 *
 * רץ ב-Node runtime כדי לקרוא את קובצי הפונט העברי (satori לא תומך WOFF2,
 * וברירת המחדל שלו לטינית בלבד → עברית הייתה ריבועים).
 */
export const runtime = 'nodejs'

const FONT_DIR = join(process.cwd(), 'assets', 'og-fonts')
const heeboRegular = readFileSync(join(FONT_DIR, 'Heebo-Regular.ttf'))
const heeboBold = readFileSync(join(FONT_DIR, 'Heebo-Bold.ttf'))
const heeboBlack = readFileSync(join(FONT_DIR, 'Heebo-Black.ttf'))

const CREAM = '#fbf7ef'
const INK = '#241a12'
const BRAND = '#c99a5b'
const BRAND_LIGHT = '#e8c887'
const MUTED = '#6a6155'

function clamp(s: string, max: number) {
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t
}

/**
 * satori (הגרסה המצורפת ל-Next 14) לא מיישם את אלגוריתם ה-bidi של יוניקוד,
 * אז עברית מתרנדרת הפוך. כאן מסדרים מראש ל"סדר ויזואלי" עם bidi-js
 * (כולל טיפול נכון בקטעי לטינית/מספרים מעורבים), ואז satori פשוט מצייר כמו שהוא.
 */
const bidi = bidiFactory()
function vis(text: string): string {
  if (!text) return text
  const levels = bidi.getEmbeddingLevels(text, 'rtl')
  const flips = bidi.getReorderSegments(text, levels)
  const chars = text.split('')
  for (const [start, end] of flips) {
    const slice = chars.slice(start, end + 1).reverse()
    chars.splice(start, slice.length, ...slice)
  }
  return chars.join('')
}

/**
 * שבירת שורות ידנית (לפני vis) - כי vis מניח שורה אחת, וגלישה אוטומטית
 * של satori על מחרוזת שכבר סודרה ויזואלית הייתה משבשת את הסדר.
 * מחזיר עד maxLines שורות, כל אחת כבר ב"סדר ויזואלי".
 */
function wrapVis(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (let i = 0; i < words.length; i++) {
    const w = words[i]
    const candidate = cur ? `${cur} ${w}` : w
    if (candidate.length > maxChars && cur) {
      lines.push(cur)
      cur = w
      if (lines.length === maxLines) break
    } else {
      cur = candidate
    }
  }
  if (lines.length < maxLines && cur) lines.push(cur)
  // אם נחתך באמצע - שלוש נקודות בסוף השורה האחרונה
  const usedWords = lines.join(' ').split(' ').filter(Boolean).length
  if (usedWords < words.length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1]}…`
  }
  return lines.map(vis)
}

export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = clamp(searchParams.get('title') || SITE_TAGLINE, 60)
  const subtitle = clamp(searchParams.get('subtitle') || 'גזעים · מדריכים · כלים · מפת גינות', 90)
  const tag = clamp(searchParams.get('tag') || '', 22)

  // כותרת גדולה יותר מבעבר: הכרטיס נצרך בפיד קטן, וטקסט גדול הוא מה שנקרא.
  const titleFont = title.length > 42 ? '68px' : title.length > 26 ? '80px' : '92px'
  const titleCharsPerLine = title.length > 42 ? 26 : 20
  const titleLines = wrapVis(title, titleCharsPerLine, 3)
  const subtitleLines = wrapVis(subtitle, 46, 2)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          direction: 'rtl',
          // רקע כהה: בפיד לבן של פייסבוק/וואטסאפ כרטיס כהה בולט הרבה יותר מקרם.
          background: 'linear-gradient(145deg, #2a2018 0%, #3b2d1e 55%, #221a12 100%)',
          padding: '54px 68px',
          fontFamily: 'Heebo',
          position: 'relative',
        }}
      >
        {/* זוהר זהב בפינה - נותן עומק במקום רקע שטוח */}
        <div
          style={{
            position: 'absolute',
            top: '-190px',
            left: '-140px',
            width: '520px',
            height: '520px',
            borderRadius: '520px',
            background: BRAND,
            opacity: 0.22,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            right: '-110px',
            width: '380px',
            height: '380px',
            borderRadius: '380px',
            background: BRAND_LIGHT,
            opacity: 0.1,
            display: 'flex',
          }}
        />
        {/* פס זהב תחתון */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '10px',
            background: BRAND_LIGHT,
            display: 'flex',
          }}
        />

        {/* שורה עליונה: לוגו + תגית */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', direction: 'rtl', fontSize: '36px', fontWeight: 800, color: '#fff' }}>
            <span style={{ fontSize: '40px', marginLeft: '12px' }}>🐾</span>
            <span style={{ display: 'flex', direction: 'rtl', gap: '9px' }}>
              <span>{vis('קהילה')}</span>
              <span style={{ color: BRAND_LIGHT }}>{vis('על ארבע')}</span>
            </span>
          </div>
          {tag ? (
            <div
              style={{
                display: 'flex',
                direction: 'rtl',
                background: BRAND_LIGHT,
                color: '#2a2018',
                fontSize: '25px',
                fontWeight: 800,
                padding: '10px 26px',
                borderRadius: '100px',
              }}
            >
              {vis(tag)}
            </div>
          ) : (
            <div style={{ display: 'flex' }} />
          )}
        </div>

        {/* גוף - תופס את כל המרחב שנשאר וממורכז אנכית, במקום חלל ריק באמצע */}
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', paddingTop: '18px', paddingBottom: '26px' }}>
          {titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                direction: 'rtl',
                fontSize: titleFont,
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.1,
                letterSpacing: '-2px',
              }}
            >
              {line}
            </div>
          ))}
          {/* קו זהב מתחת לכותרת */}
          <div style={{ display: 'flex', width: '132px', height: '7px', borderRadius: '7px', background: BRAND_LIGHT, marginTop: '26px' }} />
          {subtitleLines.map((line, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                direction: 'rtl',
                fontSize: '31px',
                color: 'rgba(255,255,255,0.82)',
                marginTop: i === 0 ? '22px' : '4px',
                lineHeight: 1.4,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* תחתית */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', direction: 'rtl', fontSize: '25px', color: 'rgba(255,255,255,0.72)', fontWeight: 700 }}>
            <div style={{ display: 'flex', width: '13px', height: '13px', borderRadius: '13px', background: BRAND_LIGHT, marginLeft: '13px' }} />
            {vis('הכל על כלבים, במקום אחד')}
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: BRAND_LIGHT, fontWeight: 800 }}>walkonfour.org</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Heebo', data: heeboRegular, weight: 400, style: 'normal' },
        { name: 'Heebo', data: heeboBold, weight: 700, style: 'normal' },
        { name: 'Heebo', data: heeboBlack, weight: 900, style: 'normal' },
      ],
    },
  )
}
