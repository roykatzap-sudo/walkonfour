import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import bidiFactory from 'bidi-js'

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
  const title = clamp(searchParams.get('title') || 'קהילת בעלי הכלבים הגדולה בישראל', 60)
  const subtitle = clamp(searchParams.get('subtitle') || 'גזעים · מדריכים · אירועים · כלים', 90)
  const tag = clamp(searchParams.get('tag') || '', 22)

  // גופן + שבירת שורות לכותרת לפי אורך (כדי שלא תגלוש ותתבלגן ב-bidi)
  const titleFont = title.length > 38 ? '60px' : title.length > 22 ? '70px' : '80px'
  const titleCharsPerLine = title.length > 38 ? 30 : 24
  const titleLines = wrapVis(title, titleCharsPerLine, 3)
  const subtitleLines = wrapVis(subtitle, 52, 2)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          direction: 'rtl',
          background: CREAM,
          padding: '64px 72px',
          fontFamily: 'Heebo',
          position: 'relative',
        }}
      >
        {/* פס זהב עליון */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '12px', background: BRAND }} />
        {/* עיגול דקורטיבי */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-120px',
            width: '360px',
            height: '360px',
            borderRadius: '360px',
            background: BRAND_LIGHT,
            opacity: 0.35,
          }}
        />

        {/* כותרת עליונה: לוגו + טאג */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', direction: 'rtl', fontSize: '40px', fontWeight: 800, color: INK }}>
            <span style={{ fontSize: '46px', marginLeft: '14px' }}>🐾</span>
            <span style={{ display: 'flex', direction: 'rtl' }}>
              <span>{vis('כלב')}</span>
              <span style={{ color: BRAND }}>{vis('ניה')}</span>
            </span>
          </div>
          {tag ? (
            <div
              style={{
                display: 'flex',
                direction: 'rtl',
                background: INK,
                color: CREAM,
                fontSize: '26px',
                fontWeight: 700,
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

        {/* גוף: כותרת ראשית + תת-כותרת */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  direction: 'rtl',
                  fontSize: titleFont,
                  fontWeight: 900,
                  color: INK,
                  lineHeight: 1.12,
                  letterSpacing: '-1px',
                }}
              >
                {line}
              </div>
            ))}
          </div>
          {subtitleLines.map((line, i) => (
            <div key={i} style={{ display: 'flex', direction: 'rtl', fontSize: '30px', color: MUTED, marginTop: i === 0 ? '24px' : '4px', lineHeight: 1.4 }}>
              {line}
            </div>
          ))}
        </div>

        {/* תחתית: טאגליין + כתובת */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', direction: 'rtl', fontSize: '26px', color: INK, fontWeight: 700 }}>
            <div style={{ display: 'flex', width: '16px', height: '16px', borderRadius: '16px', background: BRAND, marginLeft: '14px' }} />
            {vis('הכל על כלבים, במקום אחד')}
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: BRAND, fontWeight: 700 }}>kelvanya.co.il</div>
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
