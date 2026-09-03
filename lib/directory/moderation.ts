/* ================================================================
   סינון אוטומטי לתוכן במדריך העסקים.
   עיקרון: לא חוסמים - מסמנים. תוכן שנתפס עובר לסטטוס 'pending'
   וממתין לאישור אדמין. תוכן נקי עולה מיד (פרסום עצמי, בלי עריכה).
   ================================================================ */

/** נירמול לצורך התאמה: אותיות קטנות, ניקוד החוצה, סימני פיסוק לרווחים */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u0591-\u05C7]/g, '') // ניקוד וטעמים
    .replace(/[^\u0590-\u05FF\w]+/g, ' ') // פיסוק -> רווח
    .replace(/\s+/g, ' ')
    .trim()
}

/** קללות בוטות - התאמת מילה שלמה (אחרי נירמול) */
const PROFANITY_WORDS = [
  'זונה', 'שרמוטה', 'כוסאמק', 'כוסעמק', 'קוסאמק', 'כוסאמכ',
  'תזדיין', 'תזדייני', 'תזדיינו', 'מזדיין', 'הזדיין', 'זדיין',
  'מניאק', 'מניאקית', 'זין', 'חרא', 'יבנאביכ',
  'fuck', 'fucking', 'shit', 'bitch', 'asshole', 'cunt', 'whore', 'slut',
]

/** צירופים בוטים - התאמת רצף בתוך הטקסט המנורמל */
const PROFANITY_PHRASES = ['בן זונה', 'בת זונה', 'בני זונות', 'לך תמות', 'יא זבל']

/** סימני ספאם / תוכן זר - התאמת רצף */
const SPAM_MARKERS = [
  'הימורים', 'קזינו', 'הלוואה', 'הלוואות', 'ביטקוין', 'קריפטו',
  'רווח מובטח', 'הכנסה פסיבית', 'השקעה בטוחה',
  'casino', 'viagra', 'crypto', 'bitcoin', 'porn', 'onlyfans',
]

/** מילות הקשר כלבי - התאמת תחילת מילה (prefix) בטקסט המנורמל */
const DOG_CONTEXT = [
  'כלב', 'גור', 'וטרינר', 'מרפא', 'חיסונ', 'טיפוח', 'מספרה', 'מספרת',
  'תספור', 'ציפורני', 'פרוו', 'אילוף', 'מאלפ', 'פנסיון', 'דוגווקר',
  'הליכ', 'טיול', 'חיות מחמד', 'חיית מחמד', 'בעלי חיים', 'מזון', 'חטיפ',
  'רצוע', 'קולר', 'גזע', 'סירוס', 'עיקור', 'המלטה', 'שמרטפ', 'צעצוע',
  'dog', 'pet', 'vet', 'pupp', 'groom', 'k9',
]

export type ScreenResult = { flagged: boolean; reasons: string[] }

/* תחיליות עברית נפוצות - "וטיפוח" צריך להיתפס כ"טיפוח", "החרא" כ"חרא".
   בלי הקילוף הזה המנגנון עיוור לכל מילה עם ו/ה/ל/ב/מ/ש/כ בהתחלה. */
const HEBREW_PREFIXES = ['וה', 'של', 'שה', 'כש', 'מה', 'וב', 'ול', 'ומ', 'ו', 'ה', 'ל', 'ב', 'מ', 'ש', 'כ']

/** מחזיר את המילה + גרסאות עם תחילית מקולפת (קילוף אחד, לא רקורסיבי) */
function stripVariants(word: string): string[] {
  const out = [word]
  for (const p of HEBREW_PREFIXES) {
    if (word.startsWith(p) && word.length > p.length + 1) out.push(word.slice(p.length))
  }
  return out
}

const PROFANITY_SET = new Set(PROFANITY_WORDS)
/** מילים לגיטימיות שקילוף תחילית שלהן מייצר קללה בטעות ("אוכל מזין", "הזין פרטים") */
const PROFANITY_STRIP_EXCLUDE = new Set(['מזין', 'הזין'])

function hasProfanity(normalized: string): boolean {
  for (const w of normalized.split(' ')) {
    if (PROFANITY_STRIP_EXCLUDE.has(w)) continue
    if (stripVariants(w).some((v) => PROFANITY_SET.has(v))) return true
  }
  return PROFANITY_PHRASES.some((p) => normalized.includes(p))
}

function hasSpam(normalized: string): boolean {
  return SPAM_MARKERS.some((m) => normalized.includes(m))
}

function hasUrl(raw: string): boolean {
  return /(https?:\/\/|www\.)/i.test(raw)
}

function hasDogContext(normalized: string): boolean {
  // התאמת prefix: "כלב" תופס גם כלבים/כלבה/כלבלב.
  // קילוף תחיליות: "וטיפוח" / "לכלבים" / "הגזעים" נתפסים גם הם.
  const words = normalized.split(' ')
  return DOG_CONTEXT.some((prefix) =>
    prefix.includes(' ')
      ? normalized.includes(prefix)
      : words.some((w) => stripVariants(w).some((v) => v.startsWith(prefix))),
  )
}

/** סינון עסק חדש. free text בלבד - שדות סגורים (קטגוריה) כבר מאומתים ב-store */
export function screenBusiness(input: {
  name: string
  description: string
  pricing: string
  area?: string | null
}): ScreenResult {
  const raw = [input.name, input.description, input.pricing, input.area ?? ''].join(' ')
  const norm = normalize(raw)
  const reasons: string[] = []

  if (hasProfanity(norm)) reasons.push('שפה פוגענית')
  if (hasSpam(norm)) reasons.push('חשד לספאם')
  if (hasUrl(`${input.description} ${input.pricing}`)) reasons.push('קישור בטקסט חופשי')
  if (!hasDogContext(norm)) reasons.push('לא זוהה קשר לכלבים')

  return { flagged: reasons.length > 0, reasons }
}

/** סינון ביקורת. בלי דרישת הקשר כלבי - ביקורות קצרות מטבען ("שירות מעולה") */
export function screenReview(input: { author_name: string; text?: string | null }): ScreenResult {
  const raw = [input.author_name, input.text ?? ''].join(' ')
  const norm = normalize(raw)
  const reasons: string[] = []

  if (hasProfanity(norm)) reasons.push('שפה פוגענית')
  if (hasSpam(norm)) reasons.push('חשד לספאם')
  if (input.text && hasUrl(input.text)) reasons.push('קישור בביקורת')

  return { flagged: reasons.length > 0, reasons }
}
