'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/shared/Toast'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import {
  DOG_NAMES,
  GENDER_LABELS,
  STYLE_LABELS,
  STYLE_EMOJI,
  pickRandomName,
  type DogGender,
  type DogName,
  type DogNameStyle,
} from '@/lib/dogNames'

const STORAGE_KEY = 'kalbaniya:fav-names'

type GenderFilter = DogGender | 'any'
type StyleFilter = DogNameStyle | 'any'

const GENDERS: GenderFilter[] = ['any', 'male', 'female']
const STYLES: StyleFilter[] = ['any', 'cute', 'tough', 'funny', 'classic']

/** סוג תקלת אחסון: ללא / גישה חסומה (מצב פרטי) / אחסון מלא (מכסה). */
type StorageError = 'none' | 'access' | 'quota'

/** סיווג חריגת localStorage לסוג תקלה ידידותי למשתמש. */
function classifyStorageError(err: unknown): StorageError {
  if (err instanceof DOMException) {
    // 22 = QuotaExceededError, 1014 = NS_ERROR_DOM_QUOTA_REACHED (Firefox).
    if (err.code === 22 || err.code === 1014 || err.name === 'QuotaExceededError') {
      return 'quota'
    }
    return 'access'
  }
  return 'access'
}

/**
 * קריאה בטוחה של מועדפים מ-localStorage (גם אם הדפדפן חוסם / JSON שבור).
 * מחזיר את הרשימה ואת סוג התקלה (אם הייתה) כדי שה-UI יוכל להציג חיווי.
 */
function readFavs(): { favs: DogName[]; error: StorageError } {
  if (typeof window === 'undefined') return { favs: [], error: 'none' }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { favs: [], error: 'none' }
    const parsed = JSON.parse(raw)
    return {
      favs: Array.isArray(parsed) ? (parsed as DogName[]) : [],
      error: 'none',
    }
  } catch (err) {
    // JSON שבור הוא לא תקלת אחסון - אין צורך להפחיד את המשתמש.
    if (err instanceof SyntaxError) return { favs: [], error: 'none' }
    return { favs: [], error: classifyStorageError(err) }
  }
}

export function NameGenerator() {
  const toast = useToast()

  const [gender, setGender] = useState<GenderFilter>('any')
  const [style, setStyle] = useState<StyleFilter>('any')
  const [current, setCurrent] = useState<DogName | null>(null)
  const [favs, setFavs] = useState<DogName[]>([])
  const [storageError, setStorageError] = useState<StorageError>('none')
  const [rolling, setRolling] = useState(false)
  const [bump, setBump] = useState(0) // טריגר לאנימציית pop-in בכל הגרלה
  const rollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // טעינת מועדפים פעם אחת בצד הלקוח (נמנע מ-hydration mismatch).
  useEffect(() => {
    const { favs: loaded, error } = readFavs()
    setFavs(loaded)
    setStorageError(error)
  }, [])

  // ניקוי טיימר ההגרלה אם הרכיב יורד מהמסך.
  useEffect(() => {
    return () => {
      if (rollTimer.current) clearTimeout(rollTimer.current)
    }
  }, [])

  const persist = useCallback((next: DogName[]) => {
    setFavs(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      // הצליח - מנקים חיווי תקלה קודם אם היה.
      setStorageError('none')
    } catch (err) {
      // מצב פרטי / אחסון מלא - ה-UI ממשיך לעבוד בזיכרון, אך מציגים חיווי.
      setStorageError(classifyStorageError(err))
    }
  }, [])

  const roll = useCallback(() => {
    const next = pickRandomName(gender, style, current?.name)
    setCurrent(next)
    setBump((b) => b + 1)
  }, [gender, style, current])

  // "הגרל שם" עם הברקה קצרה של שמות מתחלפים - מהיר וכיפי.
  const handleRoll = useCallback(() => {
    if (rolling) return
    setRolling(true)
    let ticks = 0
    const tick = () => {
      // שמות חולפים מהירים לתחושת "מכונת מזל".
      setCurrent(pickRandomName(gender, style))
      setBump((b) => b + 1)
      ticks += 1
      if (ticks < 7) {
        rollTimer.current = setTimeout(tick, 70 + ticks * 14)
      } else {
        roll()
        setRolling(false)
      }
    }
    tick()
  }, [rolling, gender, style, roll])

  const isFav = current ? favs.some((f) => f.name === current.name) : false

  const toggleFav = useCallback(() => {
    if (!current) return
    if (favs.some((f) => f.name === current.name)) {
      persist(favs.filter((f) => f.name !== current.name))
      toast(`${current.name} הוסר מהמועדפים`)
    } else {
      persist([current, ...favs])
      toast(`${current.name} נשמר במועדפים`)
    }
  }, [current, favs, persist, toast])

  const removeFav = useCallback(
    (name: string) => {
      persist(favs.filter((f) => f.name !== name))
      toast(`${name} הוסר מהמועדפים`)
    },
    [favs, persist, toast],
  )

  const clearFavs = useCallback(() => {
    if (favs.length === 0) return
    persist([])
    toast('רשימת המועדפים נוקתה')
  }, [favs.length, persist, toast])

  const copyName = useCallback(
    async (n: DogName) => {
      const text = `${n.name} - ${n.meaning}`
      try {
        await navigator.clipboard.writeText(text)
        toast(`השם "${n.name}" הועתק`)
      } catch {
        toast('לא הצלחנו להעתיק, נסו שוב')
      }
    },
    [toast],
  )

  const shareName = useCallback(
    async (n: DogName) => {
      const text = `מצאתי שם מושלם לכלב: ${n.name} - ${n.meaning} 🐾 (דרך מחולל השמות של כלבניה)`
      // Web Share API איפה שיש; אחרת נופלים להעתקה ללוח.
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        try {
          await navigator.share({ title: 'שם לכלב', text })
          return
        } catch {
          /* המשתמש ביטל / לא נתמך - ממשיכים ל-fallback. */
        }
      }
      try {
        await navigator.clipboard.writeText(text)
        toast(`השם "${n.name}" הועתק לשיתוף`)
      } catch {
        toast('לא הצלחנו לשתף, נסו שוב')
      }
    },
    [toast],
  )

  return (
    <div>
      {/* ── חיווי תקלת אחסון (מצב פרטי / אחסון מלא) ── */}
      {storageError !== 'none' && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 20,
            padding: '14px 18px',
            borderRadius: 14,
            background: '#fdf6e9',
            border: '1.5px solid var(--brand)',
            color: 'var(--ink)',
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.6,
          }}
        >
          <span
            aria-hidden="true"
            style={{ fontSize: 18, lineHeight: 1.4, flex: '0 0 auto' }}
          >
            ⚠️
          </span>
          <span>
            {storageError === 'quota'
              ? 'האחסון בדפדפן מלא, ולכן לא ניתן לשמור מועדפים חדשים. הרשימה הנוכחית עדיין עובדת בזיכרון עד לסגירת הדף.'
              : 'המועדפים אינם נשמרים בדפדפן (מצב גלישה פרטי או אחסון חסום). אפשר להמשיך להשתמש, אך הרשימה תתאפס בסגירת הדף.'}
          </span>
        </div>
      )}

      {/* ── מסננים ── */}
      <Reveal3D as="section" className="card" aria-labelledby="ng-filters-h">
        <h2 id="ng-filters-h" style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>
          בחרו אווירה
        </h2>
        <p className="page-sub" style={{ marginBottom: 22, fontSize: 15 }}>
          סננו לפי מגדר וסגנון, או השאירו על "לא משנה" ותנו להפתעה לעבוד.
        </p>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>מגדר</legend>
          <div style={chipRow} role="group" aria-label="בחירת מגדר">
            {GENDERS.map((g) => (
              <FilterChip
                key={g}
                active={gender === g}
                label={GENDER_LABELS[g]}
                onClick={() => setGender(g)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset style={{ ...fieldsetStyle, marginTop: 18 }}>
          <legend style={legendStyle}>סגנון</legend>
          <div style={chipRow} role="group" aria-label="בחירת סגנון">
            {STYLES.map((s) => (
              <FilterChip
                key={s}
                active={style === s}
                label={
                  s === 'any'
                    ? STYLE_LABELS[s]
                    : `${STYLE_EMOJI[s as DogNameStyle]} ${STYLE_LABELS[s]}`
                }
                onClick={() => setStyle(s)}
              />
            ))}
          </div>
        </fieldset>
      </Reveal3D>

      {/* ── תצוגת השם ── */}
      <Reveal3D delay={1} className="card" as="section">
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 22,
            padding: '40px 24px',
            textAlign: 'center',
            background: 'linear-gradient(160deg, #fdf6e9, #fbf7ef)',
            border: '1px solid rgba(201,154,91,.16)',
            minHeight: 260,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {current ? (
            <div
              key={bump}
              className="pop-in"
              aria-live="polite"
              aria-atomic="true"
              style={{ width: '100%' }}
            >
              <span className="chip3d" style={{ marginBottom: 14 }}>
                {STYLE_EMOJI[current.style]} {STYLE_LABELS[current.style]} ·{' '}
                {GENDER_LABELS[current.gender]}
              </span>
              <h2
                className="grad-text"
                style={{
                  fontSize: 'clamp(40px, 9vw, 76px)',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  lineHeight: 1.05,
                  margin: '10px 0',
                }}
              >
                {current.name}
              </h2>
              <p
                style={{
                  fontSize: 18,
                  color: 'var(--ink)',
                  maxWidth: 460,
                  margin: '0 auto',
                  fontWeight: 600,
                }}
              >
                {current.meaning}
              </p>
            </div>
          ) : (
            <div aria-live="polite">
              <div style={{ fontSize: 56, marginBottom: 10 }} aria-hidden>
                🐶
              </div>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)' }}>
                לחצו על "הגרל שם" ובואו נמצא לו שם
              </p>
              <p className="page-sub" style={{ marginTop: 6, marginBottom: 0 }}>
                {DOG_NAMES.length} שמות מחכים במאגר
              </p>
            </div>
          )}
        </div>

        {/* ── פעולות ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            marginTop: 22,
          }}
        >
          <MagneticButton
            className="btn btn-primary"
            onClick={handleRoll}
          >
            {current ? 'הגרל עוד' : 'הגרל שם'}
          </MagneticButton>

          <button
            type="button"
            className={isFav ? 'btn btn-primary' : 'btn btn-ghost'}
            onClick={toggleFav}
            disabled={!current}
            aria-pressed={isFav}
            style={!current ? disabledStyle : undefined}
          >
            {isFav ? '★ במועדפים' : '☆ הוסף למועדפים'}
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => current && copyName(current)}
            disabled={!current}
            aria-label="העתק את השם"
            style={!current ? disabledStyle : undefined}
          >
            העתק
          </button>

          <button
            type="button"
            className="btn btn-dark"
            onClick={() => current && shareName(current)}
            disabled={!current}
            aria-label="שתף את השם"
            style={!current ? disabledStyle : undefined}
          >
            שתף
          </button>
        </div>
      </Reveal3D>

      {/* ── מועדפים ── */}
      <div style={{ marginTop: 32 }}>
      <Reveal3D delay={2} as="section" aria-labelledby="ng-favs-h">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <h2 id="ng-favs-h" className="page-title" style={{ fontSize: 26, marginBottom: 0 }}>
            המועדפים שלי
            <span className="chip3d" style={{ marginInlineStart: 10, verticalAlign: 'middle' }}>
              {favs.length}
            </span>
          </h2>
          {favs.length > 0 && (
            <button type="button" className="link" onClick={clearFavs} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
              נקה הכול
            </button>
          )}
        </div>

        {favs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            עדיין לא שמרתם שמות. הגרילו שם שאהבתם ולחצו על "הוסף למועדפים".
          </div>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 14,
            }}
          >
            {favs.map((f) => (
              <li key={f.name}>
                <Tilt3D max={8}>
                  <div
                    className="card"
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      padding: 20,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--ink)' }}>
                        {f.name}
                      </span>
                      <span className="chip3d" style={{ flexShrink: 0 }}>
                        {STYLE_EMOJI[f.style]} {STYLE_LABELS[f.style]}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, flex: 1 }}>
                      {f.meaning}
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => copyName(f)}
                        style={smallBtn}
                        aria-label={`העתק את השם ${f.name}`}
                      >
                        העתק
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => shareName(f)}
                        style={smallBtn}
                        aria-label={`שתף את השם ${f.name}`}
                      >
                        שתף
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => removeFav(f.name)}
                        style={{ ...smallBtn, marginInlineStart: 'auto' }}
                        aria-label={`הסר את ${f.name} מהמועדפים`}
                      >
                        הסר
                      </button>
                    </div>
                  </div>
                </Tilt3D>
              </li>
            ))}
          </ul>
        )}
      </Reveal3D>
      </div>
    </div>
  )
}

/** צ'יפ סינון - כפתור אמיתי עם aria-pressed לנגישות. */
function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '10px 20px',
        minHeight: 44,
        borderRadius: 100,
        fontSize: 15,
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'all .2s',
        border: active ? '1.5px solid var(--brand)' : '1.5px solid rgba(0,0,0,.12)',
        background: active ? 'var(--brand)' : '#fff',
        color: active ? '#fff' : 'var(--ink)',
        boxShadow: active ? '0 6px 18px rgba(201,154,91,.25)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

const fieldsetStyle: React.CSSProperties = {
  border: 'none',
  padding: 0,
  margin: 0,
}

const legendStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: 'var(--brand-dark)',
  fontWeight: 700,
  marginBottom: 10,
  padding: 0,
}

const chipRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
}

const disabledStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
}

const smallBtn: React.CSSProperties = {
  padding: '8px 14px',
  minHeight: 40,
  fontSize: 13,
  borderRadius: 12,
}
