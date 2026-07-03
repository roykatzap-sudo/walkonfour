'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { breedFace } from '@/lib/breeds'
import { hasArticle } from '@/lib/articles'
import { QUESTIONS, topMatches, type Answers, type MatchResult } from '@/lib/matcher'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { useCountUp } from './useCountUp'
import { useToast } from '@/components/shared/Toast'
import { FavButton } from '@/components/shared/FavButton'
import { useFavorites } from '@/lib/useFavorites'

// מקור אמת יחיד: משתני ה-CSS מ-globals.css (--brand / --brand-light / --ink / --text).
// אין כאן ליטרלי צבע - שינוי פלטה במקום אחד מתפשט לכל הרכיב אוטומטית.
const PRIMARY = 'var(--brand)'
const ACCENT = 'var(--brand-light)'
const DARK = 'var(--ink)'
const TEXT = 'var(--text)'

// צ'יפ נושא-מידע (גודל/אנרגיה/ידידותי-לילדים): גודל מעל סף הקריאות
// לקהל ה-40+. עוקף את ברירת המחדל של .chip3d (12px) מבלי לגעת ב-CSS המשותף.
const CHIP_DATA: React.CSSProperties = { fontSize: 14, padding: '6px 13px' }

/** האם להפחית תנועה. מכבד OS + מתג הנגישות באתר. בטוח ל-SSR. */
function reduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  const root = document.documentElement
  if (root.dataset.reduceMotion === '1' || root.classList.contains('kv-a11y-reduce-motion')) return true
  return !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function BreedMatcher() {
  const toast = useToast()
  const { toggle, isFav } = useFavorites()
  const [step, setStep] = useState(0) // 0..QUESTIONS.length-1, ואז === length = תוצאות
  const [answers, setAnswers] = useState<Answers>({})
  // הבחירה שזה עתה נלחצה - נותנת רגע "נבחר!" קצר לפני המעבר לשאלה הבאה.
  const [justPicked, setJustPicked] = useState<string | null>(null)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current) }, [])

  const total = QUESTIONS.length
  const isResults = step >= total
  // step תמיד < QUESTIONS.length כש-!isResults; ה-null מונע גישה ל-undefined אם ירופקטר.
  const current = step < total ? QUESTIONS[step]! : null
  const answeredCount = Object.values(answers).filter(Boolean).length
  // התקדמות מבוססת מיקום-בחידון: שאלה 1 מתוך 6 כבר מציגה ~14% (לא 0%)
  // ברגע הנטישה הגבוה ביותר, ו-100% שמור למסך התוצאות בלבד.
  const progress = isResults ? 100 : Math.round(((step + 1) / (total + 1)) * 100)

  const results = useMemo<MatchResult[]>(
    () => (isResults ? topMatches(answers, 3) : []),
    [isResults, answers]
  )

  function choose(value: string) {
    if (!current || justPicked) return
    const id = current.id
    setAnswers((prev) => ({ ...prev, [id]: value }))
    // רגע "נבחר!" קצר: הכפתור נדלק, מסמן וי, ואז מחליק לשאלה הבאה.
    // תחת הפחתת-תנועה מדלגים על ההשהיה כדי שהמעבר יהיה מיידי.
    setJustPicked(value)
    const delay = reduceMotion() ? 0 : 460
    advanceTimer.current = setTimeout(() => {
      setStep((s) => s + 1)
      setJustPicked(null)
    }, delay)
  }

  function back() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    setJustPicked(null)
    setStep((s) => Math.max(0, s - 1))
  }

  function restart() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    setJustPicked(null)
    setAnswers({})
    setStep(0)
  }

  async function share() {
    const top = results[0]
    if (!top) return
    const names = results.map((r) => r.breed.name).join(', ')
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/breeds/${top.breed.slug}`
        : `/breeds/${top.breed.slug}`
    const title = `ההתאמה שלי בקהילה על ארבע: ${top.breed.name}`
    const text = `עשיתי את מתאם הגזע של קהילה על ארבע וקיבלתי ${top.breed.name} (${top.score}% התאמה). 3 ההתאמות שלי: ${names}.`

    // שיתוף נייטיב (פותח וואטסאפ/הודעות עם תצוגה מקדימה של כרטיס ה-OG) - עם נפילה להעתקה
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text, url })
        return
      } catch {
        // המשתמש ביטל או שנכשל - נופלים להעתקה
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(`${text} ${url}`).catch(() => {})
      toast('הקישור הועתק - אפשר להדביק בוואטסאפ')
    } else {
      toast('התוצאה מוכנה לשיתוף')
    }
  }

  // האם כל שלוש ההתאמות כבר שמורות (קובע את מצב כפתור "שמרו את שלושתן").
  const allSaved =
    results.length > 0 && results.every((r) => isFav('breed', r.breed.slug))

  function saveAll() {
    if (results.length === 0) return
    // אם כולן שמורות - הכפתור הופך ל"הסרת שלושתן"; אחרת שומרים את החסרות.
    if (allSaved) {
      results.forEach((r) => toggle('breed', r.breed.slug))
      toast('שלוש ההתאמות הוסרו מהשמורים')
    } else {
      results.forEach((r) => {
        if (!isFav('breed', r.breed.slug)) toggle('breed', r.breed.slug)
      })
      toast('שלוש ההתאמות נשמרו - אפשר לחזור אליהן ב"מה ששמרתי"')
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes bm-fade-in {
              from { opacity: 0; transform: translateY(16px) scale(.982); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .bm-stage { animation: bm-fade-in var(--kv-dur-3, .62s) var(--kv-ease-warm, cubic-bezier(.22,1,.36,1)) both; }

            /* ── כפתור בחירה: ריחוף רך + לחיצה קפיצית (DNA חתום) ── */
            .bm-opt { transition: transform var(--kv-dur-2,.34s) var(--kv-ease-warm,cubic-bezier(.22,1,.36,1)), box-shadow var(--kv-dur-2,.34s) var(--kv-ease-warm,cubic-bezier(.22,1,.36,1)), border-color var(--kv-dur-2,.34s) var(--kv-ease-warm,cubic-bezier(.22,1,.36,1)), background var(--kv-dur-2,.34s) var(--kv-ease-warm,cubic-bezier(.22,1,.36,1)); }
            .bm-opt:hover { transform: translateY(-3px); border-color: ${PRIMARY}; box-shadow: 0 14px 30px rgba(201,154,91,.22); }
            .bm-opt:active { transform: scale(.975); transition-duration: var(--kv-dur-1,.18s); }
            .bm-opt:focus-visible { outline: 3px solid ${DARK}; outline-offset: 3px; }
            .bm-opt .bm-opt-arrow { opacity: 0; transform: translateX(6px); transition: opacity var(--kv-dur-1,.18s), transform var(--kv-dur-1,.18s); }
            .bm-opt:hover .bm-opt-arrow, .bm-opt:focus-visible .bm-opt-arrow { opacity: 1; transform: translateX(0); }

            /* ── מצב "נבחר!": הכפתור נדלק בקפיצה עדינה, השאר עמעום ── */
            .bm-opt.bm-chosen {
              animation: bm-chosen-pop .5s var(--kv-ease-spring, cubic-bezier(.34,1.4,.5,1)) both;
              border-color: ${PRIMARY};
              box-shadow: 0 16px 34px rgba(201,154,91,.30);
            }
            @keyframes bm-chosen-pop {
              0% { transform: scale(.975); }
              45% { transform: scale(1.035); }
              100% { transform: scale(1); }
            }
            .bm-opts-locked .bm-opt:not(.bm-chosen) { opacity: .5; transform: none; filter: saturate(.8); transition: opacity var(--kv-dur-2,.34s) var(--kv-ease-warm,cubic-bezier(.22,1,.36,1)), filter var(--kv-dur-2,.34s); }
            /* וי אישור שנפתח בכף הבחירה */
            .bm-check {
              display: inline-flex; align-items: center; justify-content: center;
              width: 26px; height: 26px; border-radius: 50%;
              background: ${PRIMARY}; color: #fff; font-weight: 900; font-size: 15px;
              flex: 0 0 auto;
              transform: scale(0); opacity: 0;
            }
            .bm-chosen .bm-check { animation: bm-check-in .42s var(--kv-ease-spring, cubic-bezier(.34,1.4,.5,1)) .06s both; }
            @keyframes bm-check-in { from { transform: scale(0) rotate(-25deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }

            /* ── כף-רגל צועדת על סרגל ההתקדמות ── */
            .bm-progress-paw {
              position: absolute; top: 50%; width: 15px; height: 15px;
              background: #fff;
              -webkit-mask: var(--kv-paw-mask) center / contain no-repeat;
              mask: var(--kv-paw-mask) center / contain no-repeat;
              transform: translate(50%, -50%) rotate(90deg);
              transition: inset-inline-end var(--kv-dur-3,.62s) var(--kv-ease-warm,cubic-bezier(.22,1,.36,1));
              filter: drop-shadow(0 1px 2px rgba(120,85,30,.55));
              pointer-events: none;
            }
            .bm-step-dot { transition: background var(--kv-dur-2,.34s) var(--kv-ease-warm,cubic-bezier(.22,1,.36,1)), width var(--kv-dur-2,.34s) var(--kv-ease-spring,cubic-bezier(.34,1.4,.5,1)); }

            /* ── מד ההתאמה בכרטיס התוצאה: מתמלא כשהכרטיס נכנס ── */
            .bm-meter-fill { transform-origin: inset-inline-start center; transition: width var(--kv-dur-4,.9s) var(--kv-ease-glide, cubic-bezier(.16,.84,.28,1)); }

            /* ── רגע התוצאה: נצנוץ עדין חד-פעמי מעל כרטיס המנצח ── */
            .bm-winner { position: relative; }
            .bm-winner::before {
              content: ''; position: absolute; inset: 0; border-radius: inherit; z-index: 3;
              background: linear-gradient(115deg, transparent 32%, rgba(232,200,135,.30) 48%, transparent 64%);
              transform: translateX(-120%); pointer-events: none;
              animation: bm-sweep 1.4s var(--kv-ease-glide, cubic-bezier(.16,.84,.28,1)) .35s 1;
            }
            @keyframes bm-sweep { to { transform: translateX(120%); } }

            @media (prefers-reduced-motion: reduce) {
              .bm-stage { animation: none; }
              .bm-opt:hover, .bm-opt:active { transform: none; }
              .bm-opt.bm-chosen { animation: none; }
              .bm-chosen .bm-check { animation: none; transform: scale(1); opacity: 1; }
              .bm-progress-paw, .bm-meter-fill { transition: none; }
              .bm-winner::before { animation: none; display: none; }
            }
            html.kv-a11y-reduce-motion .bm-stage,
            html[data-reduce-motion="1"] .bm-stage { animation: none; }
            html.kv-a11y-reduce-motion .bm-opt.bm-chosen,
            html[data-reduce-motion="1"] .bm-opt.bm-chosen { animation: none; }
            html.kv-a11y-reduce-motion .bm-chosen .bm-check,
            html[data-reduce-motion="1"] .bm-chosen .bm-check { animation: none; transform: scale(1); opacity: 1; }
            html.kv-a11y-reduce-motion .bm-winner::before,
            html[data-reduce-motion="1"] .bm-winner::before { animation: none; display: none; }
          `,
        }}
      />

      {/* ── סרגל התקדמות ── */}
      <div
        className="glass"
        style={{
          padding: '16px 20px',
          borderRadius: 18,
          marginBottom: 26,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 800, color: TEXT, fontSize: 16 }}>
            {isResults ? 'סיימתם! הנה ההתאמות' : `שאלה ${step + 1} מתוך ${total}`}
          </span>
          <span style={{ fontWeight: 800, color: PRIMARY, fontSize: 16 }} aria-hidden="true">
            {progress}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={
            isResults
              ? 'התקדמות החידון: הושלם'
              : `התקדמות החידון: שאלה ${step + 1} מתוך ${total}`
          }
          style={{
            position: 'relative',
            height: 12,
            borderRadius: 999,
            background: 'rgba(201,154,91,.16)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
              transition: 'width .62s cubic-bezier(.22,1,.36,1)',
              boxShadow: '0 0 14px rgba(232,200,135,.6)',
            }}
          />
          {/* כף-רגל צועדת שרוכבת על קצה המילוי - אישיות לסרגל */}
          <span
            className="bm-progress-paw"
            aria-hidden="true"
            style={{ insetInlineEnd: `${100 - progress}%` }}
          />
        </div>

        {/* נקודות שלב */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {QUESTIONS.map((q, i) => {
            const done = !!answers[q.id]
            const active = i === step && !isResults
            return (
              <span
                key={q.id}
                className="bm-step-dot"
                aria-hidden="true"
                style={{
                  width: active ? 26 : 10,
                  height: 10,
                  borderRadius: 999,
                  background: done || active ? PRIMARY : 'rgba(42,32,24,.16)',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* ── שלב שאלה ── */}
      {!isResults && current && (
        <div key={step} className="bm-stage">
            <div
              className="card"
              style={{
                padding: '34px 30px',
                borderRadius: 26,
                textAlign: 'center',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  fontSize: 46,
                  lineHeight: 1,
                  marginBottom: 12,
                  filter: 'drop-shadow(0 6px 12px rgba(201,154,91,.3))',
                }}
              >
                {current.icon}
              </div>
              <h2 className="grad-text" style={{ fontSize: 30, fontWeight: 900, margin: '0 0 8px' }}>
                {current.title}
              </h2>
              <p style={{ color: '#6a6155', fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 26px' }}>
                {current.subtitle}
              </p>

              <div
                role="group"
                aria-label={current.title}
                className={justPicked ? 'bm-opts-locked' : undefined}
                style={{ display: 'grid', gap: 14 }}
              >
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt.value
                  const chosen = justPicked === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`bm-opt${chosen ? ' bm-chosen' : ''}`}
                      onClick={() => choose(opt.value)}
                      aria-pressed={selected}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 14,
                        width: '100%',
                        textAlign: 'start',
                        padding: '18px 22px',
                        borderRadius: 18,
                        cursor: 'pointer',
                        background: selected || chosen
                          ? 'linear-gradient(135deg, rgba(232,200,135,.35), rgba(201,154,91,.18))'
                          : '#fff',
                        border: `2px solid ${selected || chosen ? PRIMARY : 'rgba(201,154,91,.22)'}`,
                      }}
                    >
                      <span>
                        <span style={{ display: 'block', fontWeight: 800, fontSize: 18, color: TEXT }}>
                          {opt.label}
                        </span>
                        {opt.hint && (
                          <span style={{ display: 'block', fontSize: 14, color: '#8a8073', marginTop: 3 }}>
                            {opt.hint}
                          </span>
                        )}
                      </span>
                      {chosen ? (
                        <span className="bm-check" aria-hidden="true">✓</span>
                      ) : (
                        <span
                          className="bm-opt-arrow"
                          aria-hidden="true"
                          style={{
                            flex: '0 0 auto',
                            fontSize: 22,
                            color: PRIMARY,
                            fontWeight: 900,
                          }}
                        >
                          ←
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {step > 0 && (
                <div style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={back}
                  >
                    → חזרה לשאלה הקודמת
                  </button>
                </div>
              )}
            </div>
        </div>
      )}

      {/* ── שלב תוצאות ── */}
      {isResults && (
        <div className="bm-stage">
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            {/* עקבות כף שנחשפות בזו אחר זו - רגע חגיגי עדין לפני התוצאה */}
            <div className="kv-paw-trail kv-reveal" aria-hidden="true" style={{ marginBottom: 16 }}>
              <i /><i /><i /><i /><i />
            </div>
            <span className="section-tag" style={{ display: 'inline-block' }}>3 ההתאמות המובילות</span>
            <h2 className="grad-text" style={{ fontSize: 32, fontWeight: 900, margin: '10px 0 6px' }}>
              הגזעים שמתאימים לכם ביותר
            </h2>
            <p style={{ color: '#6a6155', fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
              לפי {answeredCount} התשובות שלכם, אלה הגזעים שכדאי להכיר קודם.
              לחצו לפרופיל המלא או למדריך המעמיק.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 22 }}>
            {results.map((r, i) => (
              <Reveal3D key={r.breed.slug} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
                <ResultCard result={r} rank={i + 1} />
              </Reveal3D>
            ))}
          </div>

          {/* פעולות */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              justifyContent: 'center',
              marginTop: 32,
            }}
          >
            <MagneticButton onClick={saveAll} className="btn btn-primary kv-press-mag kv-glow">
              {allSaved ? '★ שלוש ההתאמות שמורות' : '☆ שמרו את שלוש ההתאמות'}
            </MagneticButton>
            <button type="button" className="btn btn-dark kv-press" onClick={share}>
              שתפו את התוצאה
            </button>
            <button type="button" className="btn btn-ghost kv-press" onClick={restart}>
              למילוי החידון מחדש
            </button>
            <Link href="/breeds" className="btn btn-ghost kv-press">
              לכל גזעי הכלבים
            </Link>
          </div>

          {/* קישור הקשרי לאזור השמורים אחרי שמירה */}
          {allSaved && (
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 15.5 }}>
              <Link href="/saved" style={{ color: PRIMARY, fontWeight: 800, textDecoration: 'none' }}>
                לצפייה בכל מה ששמרתם ←
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** כרטיס תוצאה בודד עם אחוז התאמה, סיבות וקישורים. */
function ResultCard({ result, rank }: { result: MatchResult; rank: number }) {
  const { breed, score, reasons } = result
  const topReasons = reasons.slice(0, 3)
  const showArticle = hasArticle(breed.slug)

  // "מילוי" מדורג: המד ועיגול האחוז מתחילים מ-0 וזוחלים ליעד אחרי הרכבה,
  // כדי שהתוצאה תיחת כמו פרס. תחת הפחתת-תנועה - קופצים מיד ליעד.
  const [filled, setFilled] = useState(false)
  useEffect(() => {
    if (reduceMotion()) { setFilled(true); return }
    const t = setTimeout(() => setFilled(true), 90 + rank * 90)
    return () => clearTimeout(t)
  }, [rank])
  const shown = filled ? score : 0

  return (
      <div
        className={`card${rank === 1 ? ' bm-winner' : ''}`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          overflow: 'hidden',
          borderRadius: 24,
          border: rank === 1 ? `2px solid ${PRIMARY}` : '1px solid rgba(201,154,91,.16)',
          background: rank === 1
            ? 'linear-gradient(135deg, #fffaf0, #fdf6e9)'
            : '#fff',
        }}
      >
        {/* תמונה */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 220px',
            minHeight: 200,
            minWidth: 200,
          }}
        >
          <img
            src={breedFace(breed.photo, 500)}
            alt={`${breed.name} (${breed.en})`}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
          {/* תג דירוג */}
          <span
            style={{
              position: 'absolute',
              top: 14,
              insetInlineStart: 14,
              background: rank === 1 ? PRIMARY : 'rgba(42,32,24,.82)',
              color: '#fff',
              fontWeight: 900,
              fontSize: 13,
              padding: '6px 12px',
              borderRadius: 999,
              boxShadow: '0 6px 16px rgba(0,0,0,.2)',
            }}
          >
            {rank === 1 ? 'ההתאמה הטובה ביותר' : `מקום ${rank}`}
          </span>

          {/* שמירה מהירה של הגזע - אותו לב שמופיע בכל האתר */}
          <FavButton
            type="breed"
            id={breed.slug}
            label={breed.name}
            style={{ position: 'absolute', top: 12, insetInlineEnd: 12, zIndex: 2 }}
          />
        </div>

        {/* תוכן */}
        <div
          style={{
            flex: '2 1 340px',
            padding: '24px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: TEXT, margin: 0 }}>
                {breed.name}
              </h3>
              <span style={{ fontSize: 14, color: '#8a8073' }}>{breed.en}</span>
            </div>
            <MatchBadge score={score} shown={shown} />
          </div>

          {/* מד התאמה - מתמלא ליעד כשהכרטיס נכנס */}
          <div
            role="presentation"
            style={{
              height: 9,
              borderRadius: 999,
              background: 'rgba(201,154,91,.16)',
              overflow: 'hidden',
            }}
          >
            <div
              className="bm-meter-fill"
              style={{
                height: '100%',
                width: `${shown}%`,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
              }}
            />
          </div>

          {/* צ'יפים: מאפיינים - אלה תוכן (לא קישוט), לכן מוגדלים מעל סף הקריאות */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="chip3d" style={CHIP_DATA}>{breed.size}</span>
            <span className="chip3d" style={CHIP_DATA}>אנרגיה {breed.energy}/5</span>
            {breed.goodWithKids && <span className="chip3d" style={CHIP_DATA}>ידידותי לילדים</span>}
          </div>

          {/* סיבות ההתאמה */}
          {topReasons.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
              {topReasons.map((reason, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 15,
                    color: '#5a5145',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: PRIMARY,
                      flex: '0 0 auto',
                    }}
                  />
                  {reason}
                </li>
              ))}
            </ul>
          )}

          {/* קישורים */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
            <Link href={`/breeds/${breed.slug}`} className="btn btn-dark" style={{ fontSize: 15 }}>
              לפרופיל הגזע
            </Link>
            {showArticle && (
              <Link href={`/articles/${breed.slug}`} className="btn btn-ghost" style={{ fontSize: 15 }}>
                למדריך המעמיק
              </Link>
            )}
          </div>
        </div>
      </div>
  )
}

/**
 * עיגול אחוז ההתאמה.
 * `score` הוא היעד הסופי (לתווית הנגישה), `shown` הוא הערך המונפש
 * שזוחל מ-0 ליעד כשהכרטיס נכנס - הטבעת וה-מספר מתמלאים יחד כפרס.
 */
function MatchBadge({ score, shown }: { score: number; shown: number }) {
  // המספר וטבעת ה-conic נגזרים מאותו ערך מונפש, כך שהם מתגלגלים בסנכרון
  // מלא ליעד (score) כשהכרטיס נכנס. תחת הפחתת-תנועה useCountUp קופץ מיד.
  const num = useCountUp(shown)
  return (
    <div
      className="bm-badge-ring"
      style={{
        flex: '0 0 auto',
        width: 76,
        height: 76,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: `conic-gradient(${PRIMARY} ${num * 3.6}deg, rgba(201,154,91,.16) 0)`,
      }}
      role="img"
      aria-label={`${score}% התאמה`}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#fff',
          display: 'grid',
          placeItems: 'center',
          lineHeight: 1,
        }}
      >
        <span style={{ fontWeight: 900, fontSize: 20, color: TEXT }} aria-hidden="true">{num}%</span>
      </div>
    </div>
  )
}
