'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from '@/components/shared/Toast'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { useFavorites } from '@/lib/useFavorites'
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

type GenderFilter = DogGender | 'any'
type StyleFilter = DogNameStyle | 'any'

const GENDERS: GenderFilter[] = ['any', 'male', 'female']
const STYLES: StyleFilter[] = ['any', 'cute', 'tough', 'funny', 'classic']

/** האם להפחית תנועה. מכבד OS + מתג הנגישות באתר. בטוח ל-SSR. */
function reduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  const root = document.documentElement
  if (root.dataset.reduceMotion === '1' || root.classList.contains('kv-a11y-reduce-motion')) return true
  return !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** טבלת חיפוש מהירה: שם → DogName מהמאגר, לשחזור מטא-דאטה של מועדף שמור. */
const NAMES_BY_NAME: Record<string, DogName> = DOG_NAMES.reduce(
  (acc, n) => {
    acc[n.name] = n
    return acc
  },
  {} as Record<string, DogName>,
)

export function NameGenerator() {
  const toast = useToast()

  // מקור אמת יחיד למועדפים - חולק עם /saved ועם כל שאר האתר.
  const { list, isFav: isFavGlobal, toggle } = useFavorites()

  const [gender, setGender] = useState<GenderFilter>('any')
  const [style, setStyle] = useState<StyleFilter>('any')
  const [current, setCurrent] = useState<DogName | null>(null)
  const [rolling, setRolling] = useState(false)
  const [bump, setBump] = useState(0) // טריגר לאנימציה בכל תחלופת שם
  const [landed, setLanded] = useState(0) // עולה רק כשהשם הסופי "נוחת" - טריגר לספרינג ההתמקמות
  const rollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // השמות השמורים (מזהים) משוחזרים לאובייקטי DogName מלאים מהמאגר.
  // שם שלא נמצא במאגר (תיאורטית) זוכה ל-fallback מינימלי כדי לא לאבד אותו.
  const favs = useMemo<DogName[]>(
    () =>
      list('name').map(
        (name) =>
          NAMES_BY_NAME[name] ?? {
            name,
            meaning: '',
            gender: 'male' as DogGender,
            style: 'classic' as DogNameStyle,
          },
      ),
    [list],
  )

  // ניקוי טיימר ההגרלה אם הרכיב יורד מהמסך.
  useEffect(() => {
    return () => {
      if (rollTimer.current) clearTimeout(rollTimer.current)
    }
  }, [])

  const roll = useCallback(() => {
    const next = pickRandomName(gender, style, current?.name)
    setCurrent(next)
    setBump((b) => b + 1)
    setLanded((n) => n + 1) // השם הסופי נחת - הפעל את ספרינג ההתמקמות
  }, [gender, style, current])

  // "הגרל שם" עם הברקה קצרה של שמות מתחלפים - מהיר וכיפי.
  // מכונת המזל מאיצה, ואז השם האחרון "נוחת" עם ספרינג נעים.
  const handleRoll = useCallback(() => {
    if (rolling) return
    // תחת הפחתת-תנועה מדלגים על ההברקה - קופצים ישר לשם סופי.
    if (reduceMotion()) { roll(); return }
    setRolling(true)
    let ticks = 0
    const tick = () => {
      // שמות חולפים מהירים לתחושת "מכונת מזל".
      setCurrent(pickRandomName(gender, style))
      setBump((b) => b + 1)
      ticks += 1
      if (ticks < 7) {
        // האטה הדרגתית - תחושת גלגל שנעצר.
        rollTimer.current = setTimeout(tick, 62 + ticks * ticks * 5)
      } else {
        roll()
        setRolling(false)
      }
    }
    tick()
  }, [rolling, gender, style, roll])

  const isFav = current ? isFavGlobal('name', current.name) : false

  const toggleFav = useCallback(() => {
    if (!current) return
    const wasSaved = isFavGlobal('name', current.name)
    toggle('name', current.name)
    toast(wasSaved ? `${current.name} הוסר מהמועדפים` : `${current.name} נשמר במועדפים`)
  }, [current, isFavGlobal, toggle, toast])

  const removeFav = useCallback(
    (name: string) => {
      if (isFavGlobal('name', name)) toggle('name', name)
      toast(`${name} הוסר מהמועדפים`)
    },
    [isFavGlobal, toggle, toast],
  )

  const clearFavs = useCallback(() => {
    if (favs.length === 0) return
    favs.forEach((f) => {
      if (isFavGlobal('name', f.name)) toggle('name', f.name)
    })
    toast('רשימת המועדפים נוקתה')
  }, [favs, isFavGlobal, toggle, toast])

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
      const text = `מצאתי שם מושלם לכלב: ${n.name} - ${n.meaning} 🐾 (דרך מחולל השמות של קהילה על ארבע)`
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
              // key={bump} מרענן את האנימציה בכל תחלופה; בזמן הגלגול זו הברקה
              // קלה (ng-tick), ובנחיתה הסופית ספרינג התמקמות מלא (ng-settle).
              key={bump}
              className={rolling ? 'ng-tick' : 'ng-settle'}
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
              {/* עקבות כף זעירות שנוחתות עם השם הסופי - פלפל עדין, קישוט בלבד */}
              <div
                className={`ng-paws${rolling ? '' : ' ng-paws-in'}`}
                aria-hidden="true"
                key={`paws-${landed}`}
              >
                <i /><i /><i />
              </div>
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

        {/* אזור חי לקוראי-מסך: מכריז רק על השם הסופי (לא על הברקת הגלגול) */}
        <p className="ng-sr" aria-live="polite" aria-atomic="true">
          {!rolling && current ? `${current.name} - ${current.meaning}` : ''}
        </p>

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
            className="btn btn-primary kv-press-mag kv-glow"
            onClick={handleRoll}
          >
            {current ? 'הגרל עוד' : 'הגרל שם'}
          </MagneticButton>

          <button
            type="button"
            className={`kv-press ${isFav ? 'btn btn-primary' : 'btn btn-ghost'}`}
            onClick={toggleFav}
            disabled={!current}
            aria-pressed={isFav}
            style={!current ? disabledStyle : undefined}
          >
            {isFav ? '★ במועדפים' : '☆ הוסף למועדפים'}
          </button>

          <button
            type="button"
            className="btn btn-ghost kv-press"
            onClick={() => current && copyName(current)}
            disabled={!current}
            aria-label="העתק את השם"
            style={!current ? disabledStyle : undefined}
          >
            העתק
          </button>

          <button
            type="button"
            className="btn btn-dark kv-press"
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* אזור חי נגיש - מוסתר ויזואלית, נשמע לקוראי-מסך בלבד */
            .ng-sr {
              position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
              overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
            }

            /* ── מכונת מזל: הברקה קלה בכל תחלופה בזמן גלגול ── */
            @keyframes ng-tick {
              0%   { opacity: .35; transform: translateY(-9px) scale(.985); }
              100% { opacity: 1;  transform: translateY(0) scale(1); }
            }
            .ng-tick { animation: ng-tick .1s var(--kv-ease-warm, cubic-bezier(.22,1,.36,1)) both; }

            /* ── נחיתת השם הסופי: ספרינג התמקמות נעים (over-shoot מרוסן) ── */
            @keyframes ng-settle {
              0%   { opacity: 0; transform: translateY(14px) scale(.9); }
              55%  { opacity: 1; transform: translateY(-3px) scale(1.045); }
              100% { transform: translateY(0) scale(1); }
            }
            .ng-settle { animation: ng-settle .6s var(--kv-ease-spring, cubic-bezier(.34,1.4,.5,1)) both; }

            /* ── עקבות כף שנוחתות מתחת לשם הסופי ── */
            .ng-paws {
              display: flex; gap: 12px; align-items: center; justify-content: center;
              margin-top: 20px; height: 14px; pointer-events: none;
            }
            .ng-paws i {
              width: 14px; height: 14px;
              background: rgba(var(--kv-gold, 201,154,91), .5);
              -webkit-mask: var(--kv-paw-mask) center / contain no-repeat;
              mask: var(--kv-paw-mask) center / contain no-repeat;
              opacity: 0;
            }
            /* הטיה קבועה לסירוגין (תחושת הליכה) - נשמרת דרך שכבת עטיפה */
            .ng-paws i:nth-child(odd)  { transform: rotate(-12deg); }
            .ng-paws i:nth-child(even) { transform: rotate(12deg) translateY(3px); }
            /* נחיתה עדינה: רק opacity מונפש, כדי לא לדרוס את ההטיה הקבועה */
            .ng-paws-in i { animation: ng-paw-in .34s var(--kv-ease-warm, cubic-bezier(.22,1,.36,1)) both; }
            .ng-paws-in i:nth-child(1) { animation-delay: .18s; }
            .ng-paws-in i:nth-child(2) { animation-delay: .27s; }
            .ng-paws-in i:nth-child(3) { animation-delay: .36s; }
            @keyframes ng-paw-in {
              from { opacity: 0; }
              to   { opacity: .85; }
            }

            @media (prefers-reduced-motion: reduce) {
              .ng-tick, .ng-settle { animation: none; }
              .ng-paws i, .ng-paws-in i { animation: none; opacity: 0; }
            }
            html.kv-a11y-reduce-motion .ng-tick, html[data-reduce-motion="1"] .ng-tick,
            html.kv-a11y-reduce-motion .ng-settle, html[data-reduce-motion="1"] .ng-settle { animation: none; }
            html.kv-a11y-reduce-motion .ng-paws i, html[data-reduce-motion="1"] .ng-paws i,
            html.kv-a11y-reduce-motion .ng-paws-in i, html[data-reduce-motion="1"] .ng-paws-in i { animation: none; opacity: 0; }
          `,
        }}
      />
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
