/* ════════════════════════════════════════════════════════════
   קואורדינטות למקומות הדוג-פרנדלי, לשכבה על מפת הגינות.
   - חופים: מיקום מדויק יחסית (idשל המקום -> קואורדינטה).
   - שאר המקומות: מרכז העיר + היסט דטרמיניסטי קטן כדי שלא ייערמו
     זה על זה. מסומנים approx=true ("מיקום מקורב לפי עיר").
   - מקומות ארציים (רשתות) לא ניתנים לנעיצה ולכן מושמטים מהמפה.
   ════════════════════════════════════════════════════════════ */

import { dogFriendlyPlaces, type DFPlace } from './dogFriendly'

/** מרכזי ערים (lat,lng) לנעיצת מקומות ללא כתובת מדויקת. */
const CITY_COORDS: Record<string, [number, number]> = {
  'קריית חיים': [32.832, 35.072],
  'תל אביב': [32.0668, 34.778],
  'הרצליה': [32.165, 34.844],
  'כפר יאסיף': [32.954, 35.168],
  'כפר סבא': [32.175, 34.907],
  'רעננה': [32.184, 34.871],
  'נתניה': [32.328, 34.857],
  'חיפה': [32.794, 34.989],
  'ראמה': [32.939, 35.366],
  'עין נקובא': [31.791, 35.102],
  'קיסריה': [32.502, 34.904],
  'ראשון לציון': [31.964, 34.804],
  'אשדוד': [31.792, 34.641],
  'באר שבע': [31.252, 34.791],
  'ירושלים': [31.771, 35.217],
  'אילת': [29.557, 34.952],
}

/** סדר בדיקה - מהספציפי לכללי (כדי ש"קריית חיים, חיפה" יתפוס לפני "חיפה"). */
const CITY_KEYS = [
  'קריית חיים', 'תל אביב', 'הרצליה', 'כפר יאסיף', 'כפר סבא', 'רעננה',
  'נתניה', 'ראמה', 'עין נקובא', 'קיסריה', 'ראשון לציון', 'אשדוד',
  'באר שבע', 'ירושלים', 'אילת', 'חיפה',
]

/** חופי כלבים - קואורדינטה ייעודית (מדויקת יחסית). */
const BEACH_COORDS: Record<string, [number, number]> = {
  'charles-clore': [32.057, 34.752],
  'hilton-dog': [32.092, 34.770],
  'tel-baruch-dog': [32.128, 34.791],
  'gaash-dog': [32.230, 34.812],
  'herzliya-dog': [32.171, 34.793],
  'apollonia-dog': [32.190, 34.808],
  'haifa-dog': [32.831, 34.981],
  'beit-yanai-dog': [32.391, 34.864],
  'dor-dog': [32.612, 34.917],
  'palmachim-dog': [31.931, 34.697],
  'tayo-dog': [31.992, 34.742],
  'batyam-dog': [32.012, 34.741],
  'ashdod-dog': [31.801, 34.630],
}

export type DFGeo = DFPlace & { lat: number; lng: number; approx: boolean }

/** מחזיר את המקומות הניתנים לנעיצה עם קואורדינטות. */
export function dogFriendlyGeo(): DFGeo[] {
  const perCity: Record<string, number> = {}
  const out: DFGeo[] = []
  for (const p of dogFriendlyPlaces) {
    const beach = BEACH_COORDS[p.id]
    if (beach) {
      out.push({ ...p, lat: beach[0], lng: beach[1], approx: false })
      continue
    }
    if (p.region === 'ארצי' || p.city === 'ארצי') continue // רשת ארצית - לא נועצים
    const key = CITY_KEYS.find((k) => p.city.includes(k))
    if (!key) continue
    const base = CITY_COORDS[key]
    const i = (perCity[key] = (perCity[key] ?? 0) + 1) - 1
    // היסט ספירלי דטרמיניסטי (זווית הזהב) - פיזור ויזואלי, לא מיקום אמיתי.
    const ang = i * 2.39996
    const rad = 0.0032 + i * 0.0015
    out.push({ ...p, lat: base[0] + Math.sin(ang) * rad, lng: base[1] + Math.cos(ang) * rad, approx: true })
  }
  return out
}

export const DF_PIN_COUNT = dogFriendlyGeo().length
