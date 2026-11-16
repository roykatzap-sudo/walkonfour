/* ════════════════════════════════════════════════════════════
   ערכת פוסטים לפייסבוק: תמונה מוכנה + טקסט מוכן, מתוך הנתונים האמיתיים של האתר.
   שלושה סוגים:
     city   - גינות הכלבים בעיר (לקבוצות מקומיות)
     quiz   - שאלה מחידון החוקים (מזמינה תגובות)
     answer - תשובה קצרה למצב חירום (פוסט ששומרים)
   הטקסט והתמונה נבנים מאותו מקור, כדי שלא יהיה פער בין הפוסט לאתר.
   אין כאן שום נתון מומצא: ספירות מ-cityHubs, שאלות מ-lawQuiz, תשובות מ-quickAnswer.
   ════════════════════════════════════════════════════════════ */

import { allCityHubs, getCityHub } from '@/lib/cityHubs'
import { isNamedPark, parkTitle } from '@/components/city/CityParksList'
import { lawQuiz } from '@/lib/lawQuiz'
import { getGuide } from '@/lib/guides'
import { EMERGENCY_CASES } from '@/lib/emergencyCases'

const SITE = 'https://walkonfour.org'
const LETTERS = ['א', 'ב', 'ג', 'ד']

export type KitPost = {
  id: string
  kind: 'city' | 'quiz' | 'answer'
  /** כותרת קצרה לרשימה בעמוד הערכה. */
  label: string
  /** נתיב התמונה (1080x1350). */
  image: string
  /** תיאור התמונה, לשדה "טקסט חלופי" בפייסבוק. */
  alt: string
  /** הקישור עם תיוג, כדי שנדע איזה פוסט הביא כניסות. */
  link: string
  /** הטקסט בלי הקישור. */
  body: string
  /** השורה שמציגה את הקישור (מודבקת בסוף הפוסט או בתגובה הראשונה). */
  linkLine: string
}

export type CityCard = { slug: string; name: string; count: number; parks: { title: string; where: string }[] }

/** עד חמש גינות להצגה בתמונה: קודם גינות עם שם, אחר כך גינות שיש להן רחוב קרוב. בלי כפילויות. */
export function cityCard(slug: string): CityCard | null {
  const hub = getCityHub(slug)
  if (!hub || hub.parks.length === 0) return null
  const seen = new Set<string>()
  const rows: { title: string; where: string }[] = []
  const ordered = [...hub.parks.filter(isNamedPark), ...hub.parks.filter((p) => !isNamedPark(p) && (p.near || p.hood))]
  for (const p of ordered) {
    const title = parkTitle(p)
    if (seen.has(title)) continue
    seen.add(title)
    const where = isNamedPark(p)
      ? (p.near ? `ליד ${p.near}` : p.address || p.hood || '')
      : (p.near && p.hood ? p.hood : '')
    rows.push({ title, where: where || '' })
    if (rows.length === 5) break
  }
  return { slug, name: hub.community.name, count: hub.parks.length, parks: rows }
}

function tagged(path: string, campaign: string): string {
  return `${SITE}${path}?utm_source=fb_post&utm_campaign=${campaign}`
}

export function cityPosts(): KitPost[] {
  return allCityHubs()
    .map((h) => cityCard(h.community.slug))
    .filter((c): c is CityCard => !!c && c.parks.length >= 3)
    .map((c) => {
      const link = tagged(`/city/${c.slug}`, `city-${c.slug}`)
      return {
        id: `city-${c.slug}`,
        kind: 'city' as const,
        label: `${c.name} (${c.count} גינות)`,
        image: `/og/post?k=city&s=${c.slug}`,
        alt: `רשימה: ${c.parks.length} מתוך ${c.count} גינות הכלבים ב${c.name} ובסביבה. ${c.parks.map((p) => p.title).join(', ')}.`,
        link,
        body: [
          `ריכזתי במקום אחד את גינות הכלבים ב${c.name} ובסביבה: ${c.count} גינות, ולכל אחת כפתור ניווט.`,
          '',
          `בתמונה ${c.parks.length} מהן.`,
          '',
          'מכירים גינה שחסרה, או אחת שכבר לא קיימת? כתבו לי ואתקן.',
        ].join('\n'),
        linkLine: `הרשימה המלאה, עם ניווט לכל גינה:\n${link}`,
      }
    })
}

export function quizPosts(): KitPost[] {
  return lawQuiz.map((q, i) => {
    const link = tagged('/quiz', `quiz-${i + 1}`)
    return {
      id: `quiz-${i + 1}`,
      kind: 'quiz' as const,
      label: q.q,
      image: `/og/post?k=quiz&n=${i + 1}`,
      alt: `שאלה מחידון חוקי הכלבים: ${q.q} האפשרויות: ${q.options.map((o, j) => `${LETTERS[j]}. ${o}`).join('; ')}.`,
      link,
      body: [
        'שאלה לבעלי כלבים, בלי לבדוק קודם:',
        '',
        q.q,
        '',
        ...q.options.map((o, j) => `${LETTERS[j]}. ${o}`),
        '',
        'מה לדעתכם התשובה? כתבו בתגובות.',
      ].join('\n'),
      linkLine: `התשובה, עם הסעיף בחוק, נמצאת בחידון (עשר שאלות, שתי דקות):\n${link}`,
    }
  })
}

export function answerPosts(): KitPost[] {
  const out: KitPost[] = []
  for (const c of EMERGENCY_CASES) {
    const g = getGuide(c.slug)
    if (!g?.quickAnswer) continue
    const link = tagged(`/guides/${c.slug}`, `answer-${c.slug}`)
    out.push({
      id: `answer-${c.slug}`,
      kind: 'answer',
      label: c.q,
      image: `/og/post?k=answer&s=${c.slug}`,
      alt: `${c.q} ${g.quickAnswer}`,
      link,
      body: [c.q, '', g.quickAnswer, '', 'שמרו את הפוסט, שיהיה בהישג יד כשצריך.'].join('\n'),
      linkLine: `המדריך המלא, עם המקורות:\n${link}`,
    })
  }
  return out
}

export function answerCard(slug: string): { q: string; a: string } | null {
  const c = EMERGENCY_CASES.find((x) => x.slug === slug)
  const g = c ? getGuide(c.slug) : null
  return c && g?.quickAnswer ? { q: c.q, a: g.quickAnswer } : null
}

export function quizCard(n: number): { q: string; options: string[] } | null {
  const q = lawQuiz[n - 1]
  return q ? { q: q.q, options: q.options } : null
}
