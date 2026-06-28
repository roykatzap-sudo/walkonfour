'use client'

/* ════════════════════════════════════════════════════════════
   מערכת "מועדפים" (Save) חוצת-אתר - שמירה ב-localStorage
   ────────────────────────────────────────────────────────────
   אין backend: המועדפים נשמרים בדפדפן של המשתמש תחת מפתח אחד
   ('kalbaniya:favs'). ה-hook בטוח ל-SSR (לא נוגע ב-window בזמן
   הרינדור הראשון), ומסתנכרן בין כל הרכיבים בעמוד דרך אירוע
   מותאם + אירוע 'storage' (סנכרון בין טאבים).
   ════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState } from 'react'

/** הסוגים שאפשר לשמור - כל סוג מתאים לאוסף נתונים אחר ב-lib. */
export type FavType = 'breed' | 'listing' | 'adopt' | 'name'

/** פריט מועדף בודד - צמד סוג+מזהה. */
export type Favorite = { type: FavType; id: string }

/** כל הסוגים החוקיים - מקור אמת יחיד לוולידציה ב-readStore. */
const FAV_TYPES: readonly FavType[] = ['breed', 'listing', 'adopt', 'name']

/* ──────────────────────────────────────────────────────────────
   namespace אחסון - "kalbaniya:" הוא ה-prefix המוקפא מלפני המיתוג
   מחדש. אסור לשנותו בלי שלב מיגרציה, אחרת כל המועדפים השמורים אצל
   המשתמשים יתייתמו. ראו migrateLegacyNames() למיגרציית מפתח-השמות.
   ────────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'kalbaniya:favs'

/** מפתח legacy של מחולל השמות - מהוגר חד-פעמית פנימה ל-STORAGE_KEY. */
const LEGACY_NAMES_KEY = 'kalbaniya:fav-names'

/** שם אירוע פנימי לסנכרון רכיבים באותו טאב (storage לא נורה באותו טאב). */
const SYNC_EVENT = 'kalbaniya:favs-changed'

/** מזהה ייחודי לפריט - משמש כמפתח ב-Set ובהשוואות. */
const keyOf = (type: FavType, id: string) => `${type}:${id}`

/** קריאה בטוחה מ-localStorage - מחזירה מערך תקין תמיד (גם ב-SSR / JSON שבור). */
function readStore(): Favorite[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (f): f is Favorite =>
        f &&
        typeof f === 'object' &&
        typeof f.id === 'string' &&
        FAV_TYPES.includes(f.type),
    )
  } catch {
    return []
  }
}

/**
 * מיגרציה חד-פעמית: שמות שנשמרו בעבר תחת המפתח הנפרד
 * 'kalbaniya:fav-names' (מערך אובייקטי DogName) מועברים פנימה
 * לאוסף המאוחד כפריטי { type:'name', id: <שם> }. נקרא פעם אחת
 * בעליית ה-hook; אם המפתח הישן ריק/לא קיים - no-op מלא.
 */
function migrateLegacyNames(current: Favorite[]): Favorite[] {
  if (typeof window === 'undefined') return current
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(LEGACY_NAMES_KEY)
  } catch {
    return current
  }
  if (!raw) return current

  let legacyNames: string[] = []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      legacyNames = parsed
        .map((n) => (n && typeof n === 'object' ? n.name : n))
        .filter((n): n is string => typeof n === 'string' && n.length > 0)
    }
  } catch {
    /* JSON שבור - נתעלם, רק ננקה את המפתח הישן בהמשך */
  }

  const have = new Set(current.filter((f) => f.type === 'name').map((f) => f.id))
  const merged = [
    ...current,
    ...legacyNames
      .filter((name) => !have.has(name))
      .map((name): Favorite => ({ type: 'name', id: name })),
  ]

  // מוחקים את המפתח הישן וכותבים את האוסף המאוחד כדי שהמיגרציה לא תחזור.
  try {
    window.localStorage.removeItem(LEGACY_NAMES_KEY)
  } catch {
    /* לא קריטי - אם נכשל, ה-have יסנן כפילויות בפעם הבאה */
  }
  if (merged.length !== current.length) writeStore(merged)
  return merged
}

/** כתיבה בטוחה + שידור אירוע סנכרון לכל הרכיבים בטאב. */
function writeStore(favs: Favorite[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
    window.dispatchEvent(new CustomEvent(SYNC_EVENT))
  } catch {
    /* מצב פרטי / מכסה מלאה - מתעלמים בשקט, לא שוברים את העמוד */
  }
}

/**
 * useFavorites - ניהול המועדפים בצד הלקוח.
 *
 * @returns
 *  - `favorites` - המערך המלא (ריק עד שה-hook עולה בלקוח, לכן בטוח ל-SSR).
 *  - `ready`     - האם כבר נטען מה-localStorage (למניעת הבהוב/אי-התאמת hydration).
 *  - `toggle`    - הוספה/הסרה של פריט.
 *  - `isFav`     - האם פריט שמור.
 *  - `list`      - כל המזהים השמורים מסוג מסוים, לפי סדר השמירה.
 *  - `count`     - מספר המועדפים הכולל.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [ready, setReady] = useState(false)

  // טעינה ראשונית בלקוח בלבד - נמנעים מאי-התאמת hydration.
  useEffect(() => {
    // מיגרציה חד-פעמית של שמות שנשמרו במפתח הישן הנפרד.
    setFavorites(migrateLegacyNames(readStore()))
    setReady(true)

    // סנכרון: עדכון מרכיב אחר באותו טאב, או משינוי בטאב אחר.
    const sync = () => setFavorites(readStore())
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  /** הוספה/הסרה של פריט מהמועדפים. */
  const toggle = useCallback((type: FavType, id: string) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.type === type && f.id === id)
      const next = exists
        ? prev.filter((f) => !(f.type === type && f.id === id))
        : [...prev, { type, id }]
      writeStore(next)
      return next
    })
  }, [])

  /** האם הפריט שמור כעת. */
  const isFav = useCallback(
    (type: FavType, id: string) => favorites.some((f) => f.type === type && f.id === id),
    [favorites],
  )

  /** כל המזהים מסוג נתון (לפי סדר השמירה). */
  const list = useCallback(
    (type: FavType) => favorites.filter((f) => f.type === type).map((f) => f.id),
    [favorites],
  )

  return { favorites, ready, toggle, isFav, list, count: favorites.length, keyOf }
}
