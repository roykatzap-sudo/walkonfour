import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import bidiFactory from 'bidi-js'
import { answerCard, cityCard, quizCard } from '@/lib/postKit'

/**
 * תמונות לפוסטים בפייסבוק, בפורמט לאורך (1080x1350) שתופס הכי הרבה מסך בנייד.
 *   GET /og/post?k=city&s=haifa      -> גינות הכלבים בעיר
 *   GET /og/post?k=quiz&n=3          -> שאלה מחידון החוקים
 *   GET /og/post?k=answer&s=<slug>   -> תשובה קצרה למצב חירום
 * התמונה מעלים לפייסבוק כתמונה רגילה (לא כקישור). כתובת האתר כתובה עליה.
 * הטקסט גדול בכוונה: רוב הקוראים בנייד, וחלקם מעל גיל 40.
 *
 * חשוב: satori מתעלם מ-direction: rtl בפריסה. לכן יישור לימין נעשה במפורש:
 * שורות ב-row-reverse, ועמודות ב-alignItems: flex-end.
 */
export const runtime = 'nodejs'

const FONT_DIR = join(process.cwd(), 'assets', 'og-fonts')
const heeboRegular = readFileSync(join(FONT_DIR, 'Heebo-Regular.ttf'))
const heeboBold = readFileSync(join(FONT_DIR, 'Heebo-Bold.ttf'))
const heeboBlack = readFileSync(join(FONT_DIR, 'Heebo-Black.ttf'))

const W = 1080
const H = 1350
const GOLD = '#e8c887'
const BRAND = '#c99a5b'
const DARK = '#2a2018'
const LETTERS = ['א', 'ב', 'ג', 'ד']

// satori לא מיישם bidi - מסדרים מראש לסדר ויזואלי (כמו ב-/og)
const bidi = bidiFactory()
function vis(text: string): string {
  if (!text) return text
  const levels = bidi.getEmbeddingLevels(text, 'rtl')
  const flips = bidi.getReorderSegments(text, levels)
  const chars = text.split('')
  // סוגריים בתוך טקסט מימין לשמאל צריכים להתהפך, אחרת יוצא ")כך("
  bidi.getMirroredCharactersMap(text, levels.levels).forEach((ch, i) => { chars[i] = ch })
  for (const [start, end] of flips) {
    const slice = chars.slice(start, end + 1).reverse()
    chars.splice(start, slice.length, ...slice)
  }
  return chars.join('')
}

/** שבירת שורות ידנית לפי מספר תווים. לא חותכים טקסט: מי שקורא לפונקציה בוחר גודל גופן שמתאים לאורך. */
function wrap(text: string, maxChars: number): string[] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w
    if (candidate.length > maxChars && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = candidate
    }
  }
  if (cur) lines.push(cur)
  return lines.map(vis)
}

function clamp(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t
}

/** שורת טקסט אחת, מיושרת לימין. הגובה נקבע במפורש (size * lh), כי satori נותן לשורה של Heebo
 *  גובה גדול מזה שמבקשים ב-lineHeight, ואז קשה לדעת מראש אם התוכן נכנס. */
function T({ children, size, weight, color, lh = 1.2, ls = '0px', mt = 0 }: { children: string; size: number; weight: number; color: string; lh?: number; ls?: string; mt?: number }) {
  return (
    <div style={{ display: 'flex', flexShrink: 0, justifyContent: 'flex-end', alignItems: 'center', height: `${Math.round(size * lh)}px`, fontSize: `${size}px`, fontWeight: weight, color, lineHeight: 1, letterSpacing: ls, marginTop: `${mt}px` }}>
      {children}
    </div>
  )
}

function Lines({ lines, size, weight, color, lh = 1.2, ls = '0px' }: { lines: string[]; size: number; weight: number; color: string; lh?: number; ls?: string }) {
  return (
    <div style={{ display: 'flex', flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end' }}>
      {lines.map((l, i) => (
        <T key={i} size={size} weight={weight} color={color} lh={lh} ls={ls}>{l}</T>
      ))}
    </div>
  )
}

function Bar() {
  return <div style={{ display: 'flex', flexShrink: 0, width: '150px', height: '8px', borderRadius: '8px', background: GOLD, marginTop: '24px', marginBottom: '26px' }} />
}

function Frame({ tag, children, footLabel, footUrl }: { tag: string; children: React.ReactNode; footLabel: string; footUrl: string }) {
  return (
    <div
      style={{
        width: `${W}px`, height: `${H}px`, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(160deg, #2a2018 0%, #3b2d1e 55%, #221a12 100%)',
        padding: '64px 70px 70px', fontFamily: 'Heebo', position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '-230px', right: '-170px', width: '600px', height: '600px', borderRadius: '600px', background: BRAND, opacity: 0.2, display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: '-190px', left: '-150px', width: '460px', height: '460px', borderRadius: '460px', background: GOLD, opacity: 0.09, display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '14px', background: GOLD, display: 'flex' }} />

      {/* שורה עליונה: שם האתר מימין, תגית משמאל */}
      <div style={{ display: 'flex', flexShrink: 0, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '10px', fontSize: '40px', fontWeight: 900, color: '#fff' }}>
          <span>{vis('קהילה')}</span>
          <span style={{ color: GOLD }}>{vis('על ארבע')}</span>
        </div>
        <div style={{ display: 'flex', background: GOLD, color: DARK, fontSize: '32px', fontWeight: 900, padding: '10px 28px', borderRadius: '100px' }}>
          {vis(tag)}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', paddingTop: '24px', paddingBottom: '24px' }}>
        {children}
      </div>

      {/* תחתית: לאן הולכים. הכתובת כתובה באותיות גדולות כי בתמונה אי אפשר ללחוץ. */}
      <div style={{ display: 'flex', flexShrink: 0, flexDirection: 'column' }}>
        <T size={36} weight={700} color="rgba(255,255,255,.9)">{vis(footLabel)}</T>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px', background: GOLD, color: DARK, fontSize: footUrl.length > 30 ? '42px' : '48px', fontWeight: 900, padding: '14px 20px', borderRadius: '22px' }}>
          {footUrl}
        </div>
      </div>
    </div>
  )
}

function City({ slug }: { slug: string }) {
  const c = cityCard(slug)
  if (!c) return null
  const name = `ב${c.name}`
  const nameSize = Math.min(170, Math.floor(900 / (name.length * 0.56)))
  return (
    <Frame tag="מדריך עירוני" footLabel="כל הרשימה, עם ניווט לכל גינה:" footUrl={`walkonfour.org/city/${c.slug}`}>
      <T size={60} weight={900} color={GOLD} lh={1.1}>{vis('גינות כלבים')}</T>
      <T size={nameSize} weight={900} color="#fff" lh={1.1} ls="-3px">{vis(name)}</T>
      <T size={42} weight={700} color="rgba(255,255,255,.92)" mt={8}>{vis(`${c.count} גינות בעיר ובסביבה. הנה ${c.parks.length} מהן:`)}</T>
      <Bar />
      <div style={{ display: 'flex', flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end' }}>
        {c.parks.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ display: 'flex', flexShrink: 0, width: '18px', height: '18px', borderRadius: '18px', background: GOLD, marginLeft: '20px', marginTop: '18px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <T size={44} weight={700} color="#fff" lh={1.25}>{vis(clamp(p.title, 30))}</T>
              {p.where ? <T size={33} weight={400} color="rgba(255,255,255,.8)" lh={1.25}>{vis(clamp(p.where, 38))}</T> : null}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  )
}

function Quiz({ n }: { n: number }) {
  const q = quizCard(n)
  if (!q) return null
  const qSize = q.q.length > 60 ? 60 : q.q.length > 40 ? 68 : 78
  const qChars = q.q.length > 60 ? 28 : q.q.length > 40 ? 25 : 22
  const long = q.options.some((o) => o.length > 30)
  const oSize = long ? 40 : 46
  return (
    <Frame tag="חידון חוקי הכלבים" footLabel="התשובה, עם הסעיף בחוק:" footUrl="walkonfour.org/quiz">
      <Lines lines={wrap(q.q, qChars)} size={qSize} weight={900} color="#fff" lh={1.16} ls="-1px" />
      <Bar />
      <div style={{ display: 'flex', flexShrink: 0, flexDirection: 'column', alignSelf: 'stretch' }}>
        {q.options.map((o, i) => (
          <div
            key={i}
            style={{
              display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: '16px', padding: '20px 22px',
              background: 'rgba(232,200,135,.12)', border: '2px solid rgba(232,200,135,.45)', borderRadius: '22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '66px', height: '66px', borderRadius: '66px', background: GOLD, color: DARK, fontSize: '40px', fontWeight: 900, marginLeft: '22px', flexShrink: 0 }}>
              {LETTERS[i]}
            </div>
            <Lines lines={wrap(o, long ? 34 : 30)} size={oSize} weight={700} color="#fff" lh={1.25} />
          </div>
        ))}
      </div>
      <T size={46} weight={900} color={GOLD} mt={10}>{vis('מה התשובה? כתבו בתגובות')}</T>
    </Frame>
  )
}

function Answer({ slug }: { slug: string }) {
  const a = answerCard(slug)
  if (!a) return null
  // גודל הגופן נבחר לפי האורך, כדי שכל התשובה תיכנס בלי לחתוך (מדובר בהנחיות בטיחות).
  const qLines = wrap(a.q, 22)
  const room = 880 - qLines.length * Math.round(72 * 1.14) - 58
  let size = 50
  let body = wrap(a.a, Math.floor(920 / (size * 0.5)))
  while (size > 32 && body.length * Math.round(size * 1.5) > room) {
    size -= 2
    body = wrap(a.a, Math.floor(920 / (size * 0.5)))
  }
  return (
    <Frame tag="שמרו את זה" footLabel="כל מצבי החירום, עם מקורות:" footUrl="walkonfour.org/emergency">
      <Lines lines={qLines} size={72} weight={900} color="#fff" lh={1.14} ls="-1px" />
      <Bar />
      <Lines lines={body} size={size} weight={400} color="rgba(255,255,255,.95)" lh={1.5} />
    </Frame>
  )
}

export function GET(req: Request) {
  const sp = new URL(req.url).searchParams
  const k = sp.get('k')
  const s = (sp.get('s') || '').replace(/[^a-z0-9-]/g, '').slice(0, 60)
  const n = Number(sp.get('n') || 0)

  let el: React.ReactElement | null = null
  if (k === 'city' && cityCard(s)) el = <City slug={s} />
  else if (k === 'quiz' && quizCard(n)) el = <Quiz n={n} />
  else if (k === 'answer' && answerCard(s)) el = <Answer slug={s} />
  if (!el) return new Response('not found', { status: 404 })

  return new ImageResponse(el, {
    width: W,
    height: H,
    fonts: [
      { name: 'Heebo', data: heeboRegular, weight: 400, style: 'normal' },
      { name: 'Heebo', data: heeboBold, weight: 700, style: 'normal' },
      { name: 'Heebo', data: heeboBlack, weight: 900, style: 'normal' },
    ],
    headers: { 'Cache-Control': 'public, max-age=3600', 'X-Robots-Tag': 'noindex' },
  })
}
