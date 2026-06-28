export type Sitter = {
  id: string
  name: string
  city: string
  rating: number // 1-5
  reviews: number
  pricePerNight: number // ₪
  bio: string
  services: string[]
  photo: string // unsplash id
  verified: boolean
}

/** שומרי כלבים קהילתיים - נתוני דמו. */
export const demoSitters: Sitter[] = [
  {
    id: 'noa-tlv',
    name: 'נועה ברק',
    city: 'תל אביב-יפו',
    rating: 5.0,
    reviews: 128,
    pricePerNight: 140,
    bio: 'בעלים ותיקה של גולדן, גרה צמוד לפארק הירקון. אצלי הכלב מקבל טיולים ארוכים לאורך הנהר ובית חמים שמרגיש כמו שלו.',
    services: ['לינה', 'טיולים', 'דוג ווקינג'],
    photo: 'photo-1494790108377-be9c29b29330',
    verified: true,
  },
  {
    id: 'yossi-haifa',
    name: 'יוסי כהן',
    city: 'חיפה',
    rating: 4.9,
    reviews: 96,
    pricePerNight: 95,
    bio: 'מאלף כלבים בהכשרתי, מתמחה דווקא בכלבים אנרגטיים שצריכים תעסוקה. בכרמל מחכה חצר גדולה ושלוש יציאות מסודרות ביום.',
    services: ['לינה', 'טיולים', 'ביקורי בית'],
    photo: 'photo-1500648767791-00dcc994a43e',
    verified: true,
  },
  {
    id: 'maya-jlm',
    name: 'מאיה לוי',
    city: 'ירושלים',
    rating: 4.8,
    reviews: 74,
    pricePerNight: 110,
    bio: 'אוהבת כלבים מכל הלב וגרה בשכונה ירושלמית שקטה, שופעת שבילי הליכה. בכל יום תקבלו עדכון ותמונות כדי שתדעו שהכול בסדר.',
    services: ['לינה', 'דוג ווקינג', 'ביקורי בית'],
    photo: 'photo-1438761681033-6461ffad8d80',
    verified: true,
  },
  {
    id: 'daniel-raanana',
    name: 'דניאל אבני',
    city: 'רעננה',
    rating: 4.7,
    reviews: 53,
    pricePerNight: 120,
    bio: 'משפחה חמה עם ילדים וחצר מגודרת ובטוחה. אצלנו הכלב לא אורח אלא חלק מהמשפחה לכל אורך השהות.',
    services: ['לינה', 'טיולים'],
    photo: 'photo-1507003211169-0a1dd7228f2d',
    verified: false,
  },
  {
    id: 'shira-tlv',
    name: 'שירה גולן',
    city: 'תל אביב-יפו',
    rating: 4.9,
    reviews: 112,
    pricePerNight: 160,
    bio: 'מטיילת כלבים מקצועית עם חמש שנות ניסיון. גמישה בשעות, רגילה לעבוד גם עם גזעים גדולים וחזקים ויודעת להחזיק כלב מאומן בטיול.',
    services: ['טיולים', 'דוג ווקינג', 'ביקורי בית'],
    photo: 'photo-1544005313-94ddf0286df2',
    verified: true,
  },
  {
    id: 'omer-beersheva',
    name: 'עומר שמש',
    city: 'באר שבע',
    rating: 4.6,
    reviews: 41,
    pricePerNight: 70,
    bio: 'סטודנט לרפואה וטרינרית שחי ונושם כלבים. גר בבית פרטי עם חצר, קרוב לשבילי הליכה פתוחים בקצה המדבר.',
    services: ['לינה', 'ביקורי בית'],
    photo: 'photo-1534528741775-53994a69daeb',
    verified: false,
  },
  {
    id: 'tal-netanya',
    name: 'טל רוזן',
    city: 'נתניה',
    rating: 4.8,
    reviews: 67,
    pricePerNight: 100,
    bio: 'גרה ממש מול הים ויוצאת לחוף הכלבים מדי בוקר. סבלנית במיוחד, ומרגישה בנוח גם עם גורים קטנים וגם עם כלבים מבוגרים.',
    services: ['לינה', 'טיולים', 'דוג ווקינג'],
    photo: 'photo-1599566150163-29194dcaad36',
    verified: true,
  },
  {
    id: 'avi-ramatgan',
    name: 'אבי פרץ',
    city: 'רמת גן',
    rating: 4.7,
    reviews: 58,
    pricePerNight: 85,
    bio: 'גמלאי פעיל שגר ליד הפארק הלאומי ופנוי לאורך כל היום. מעניק יחס אישי ובלתי מתחלק, בבית רגוע ושקט.',
    services: ['לינה', 'טיולים', 'ביקורי בית'],
    photo: 'photo-1463453091185-61582044d556',
    verified: true,
  },
]

export const sitterImg = (id: string, w = 400) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=55`

/* ════════════════════════════════════════════════════════════
   תוכנית ההמלצות (Referral) - כלי עזר משותפים
   ────────────────────────────────────────────────────────────
   הקוד כאן עצמאי ולא נשען על עמודת DB חדשה, כדי שיעבוד גם במצב
   דמו (ללא Supabase). קוד ההמלצה נגזר דטרמיניסטית ממזהה המשתמש,
   כך שאותו משתמש מקבל תמיד את אותו קוד בכל מכשיר ובכל פעם.

   כשמחברים את מסד הנתונים, מומלץ להוסיף עמודה אמיתית (SQL מתועד
   למטה ב-REFERRAL_DB_MIGRATION) ולגזור ממנה במקום מהמזהה.
   ════════════════════════════════════════════════════════════ */

/** הסכום שמזכים עבור כל חבר שמצטרף בעקבות המלצה (₪). */
export const REFERRAL_REWARD = 30

/** טווח השווי המשווק (להצגה בלבד). */
export const REFERRAL_REWARD_RANGE = { min: 20, max: 50 } as const

/** פרמטר ה-URL שמסמן הגעה דרך המלצה. */
export const REFERRAL_PARAM = 'ref'

/** סכמת ההמלצה של משתמש - מסכמת את הדאשבורד. */
export type ReferralStats = {
  code: string
  referrals: number
  pending: number
  creditBalance: number // ₪
}

/**
 * גוזר קוד המלצה יציב וקריא מתוך מזהה המשתמש (או שם המשתמש).
 * דטרמיניסטי: אותו קלט מחזיר תמיד אותו קוד. אורך 6 תווים, אותיות
 * וספרות בלבד, ללא תווים מבלבלים (0/O/1/I).
 */
export function referralCode(seed: string | null | undefined): string {
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // ללא 0,O,1,I
  const base = (seed ?? '').trim() || 'kelvanya'
  // hash דטרמיניסטי פשוט (FNV-1a 32-bit) - יציב בכל סביבה.
  let h = 0x811c9dc5
  for (let i = 0; i < base.length; i++) {
    h ^= base.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  let n = h >>> 0
  let out = ''
  for (let i = 0; i < 6; i++) {
    out += ALPHABET[n % ALPHABET.length]
    n = Math.floor(n / ALPHABET.length) + ((n % 7) + 1) * 2654435761
    n = n >>> 0
  }
  return out
}

/** בונה קישור שיתוף מלא לקוד המלצה נתון. */
export function referralLink(code: string, origin = ''): string {
  const o = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://walkonfour.org')
  return `${o}/auth/register?${REFERRAL_PARAM}=${encodeURIComponent(code)}`
}

/** טקסט מוכן לשיתוף בוואטסאפ / רשתות. */
export function referralShareText(link: string): string {
  return `הצטרפו אליי לקהילה על ארבע - קהילת בעלי הכלבים בישראל. דרך הקישור שלי נחסוך יחד בקבוצות רכישה ובאירועים: ${link}`
}

/**
 * SQL להרצה ב-Supabase כשמפעילים את התוכנית מול DB אמיתי.
 * נשמר כתיעוד בלבד - לא מורץ מהקוד.
 *
 *   ALTER TABLE public.profiles
 *     ADD COLUMN referral_code TEXT UNIQUE,
 *     ADD COLUMN referred_by TEXT,
 *     ADD COLUMN referral_credit INTEGER DEFAULT 0,
 *     ADD COLUMN referrals_count INTEGER DEFAULT 0;
 *
 *   -- מילוי קוד לכל הפרופילים הקיימים (פעם אחת):
 *   UPDATE public.profiles SET referral_code = UPPER(SUBSTRING(MD5(id::text) FROM 1 FOR 6))
 *     WHERE referral_code IS NULL;
 *
 *   -- בעת זיכוי חבר מאשר (טריגר/edge function): להעלות אצל המפנה את
 *   -- referrals_count ב-1 ואת referral_credit ב-REFERRAL_REWARD.
 */
export const REFERRAL_DB_MIGRATION = `ALTER TABLE public.profiles
  ADD COLUMN referral_code TEXT UNIQUE,
  ADD COLUMN referred_by TEXT,
  ADD COLUMN referral_credit INTEGER DEFAULT 0,
  ADD COLUMN referrals_count INTEGER DEFAULT 0;`
