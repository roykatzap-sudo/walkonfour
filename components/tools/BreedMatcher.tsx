'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { breedImg } from '@/lib/breeds'
import { hasArticle } from '@/lib/articles'
import { QUESTIONS, topMatches, type Answers, type MatchResult } from '@/lib/matcher'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { useToast } from '@/components/shared/Toast'

// מקור אמת יחיד: משתני ה-CSS מ-globals.css (--brand / --brand-light / --ink / --text).
// אין כאן ליטרלי צבע - שינוי פלטה במקום אחד מתפשט לכל הרכיב אוטומטית.
const PRIMARY = 'var(--brand)'
const ACCENT = 'var(--brand-light)'
const DARK = 'var(--ink)'
const TEXT = 'var(--text)'

export function BreedMatcher() {
  const toast = useToast()
  const [step, setStep] = useState(0) // 0..QUESTIONS.length-1, ואז === length = תוצאות
  const [answers, setAnswers] = useState<Answers>({})

  const total = QUESTIONS.length
  const isResults = step >= total
  // step תמיד < QUESTIONS.length כש-!isResults; ה-null מונע גישה ל-undefined אם ירופקטר.
  const current = step < total ? QUESTIONS[step]! : null
  const answeredCount = Object.values(answers).filter(Boolean).length
  const progress = isResults ? 100 : Math.round((step / total) * 100)

  const results = useMemo<MatchResult[]>(
    () => (isResults ? topMatches(answers, 3) : []),
    [isResults, answers]
  )

  function choose(value: string) {
    if (!current) return
    const id = current.id
    setAnswers((prev) => ({ ...prev, [id]: value }))
    // מעבר עדין לשאלה הבאה
    window.setTimeout(() => setStep((s) => s + 1), 180)
  }

  function back() {
    setStep((s) => Math.max(0, s - 1))
  }

  function restart() {
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
    const title = `ההתאמה שלי בכלבניה: ${top.breed.name}`
    const text = `עשיתי את מתאם הגזע של כלבניה וקיבלתי ${top.breed.name} (${top.score}% התאמה). 3 ההתאמות שלי: ${names}.`

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

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes bm-fade-in {
              from { opacity: 0; transform: translateY(14px) scale(.985); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .bm-stage { animation: bm-fade-in .42s cubic-bezier(.22,.61,.36,1) both; }
            .bm-opt:hover { transform: translateY(-3px); border-color: ${PRIMARY}; box-shadow: 0 14px 30px rgba(201,154,91,.22); }
            .bm-opt:focus-visible { outline: 3px solid ${DARK}; outline-offset: 3px; }
            .bm-opt .bm-opt-arrow { opacity: 0; transform: translateX(6px); transition: .2s; }
            .bm-opt:hover .bm-opt-arrow, .bm-opt:focus-visible .bm-opt-arrow { opacity: 1; transform: translateX(0); }
            .bm-step-dot { transition: background .3s, transform .3s; }
            @media (prefers-reduced-motion: reduce) {
              .bm-stage { animation: none; }
              .bm-opt:hover { transform: none; }
            }
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
              transition: 'width .5s cubic-bezier(.22,.61,.36,1)',
              boxShadow: '0 0 14px rgba(232,200,135,.6)',
            }}
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
                style={{ display: 'grid', gap: 14 }}
              >
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className="bm-opt"
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
                        background: selected
                          ? 'linear-gradient(135deg, rgba(232,200,135,.35), rgba(201,154,91,.18))'
                          : '#fff',
                        border: `2px solid ${selected ? PRIMARY : 'rgba(201,154,91,.22)'}`,
                        transition: 'transform .2s, box-shadow .2s, border-color .2s, background .2s',
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
            <span className="section-tag">3 ההתאמות המובילות</span>
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
            <MagneticButton onClick={share} className="btn btn-primary">
              שתפו את התוצאה
            </MagneticButton>
            <button type="button" className="btn btn-dark" onClick={restart}>
              למילוי החידון מחדש
            </button>
            <Link href="/breeds" className="btn btn-ghost">
              לכל גזעי הכלבים
            </Link>
          </div>
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

  return (
      <div
        className="card"
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
            src={breedImg(breed.photo, 500)}
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
            <MatchBadge score={score} />
          </div>

          {/* מד התאמה */}
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
              style={{
                height: '100%',
                width: `${score}%`,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
              }}
            />
          </div>

          {/* צ'יפים: מאפיינים */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="chip3d">{breed.size}</span>
            <span className="chip3d">אנרגיה {breed.energy}/5</span>
            {breed.goodWithKids && <span className="chip3d">ידידותי לילדים</span>}
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

/** עיגול אחוז ההתאמה. */
function MatchBadge({ score }: { score: number }) {
  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 76,
        height: 76,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: `conic-gradient(${PRIMARY} ${score * 3.6}deg, rgba(201,154,91,.16) 0)`,
      }}
      aria-hidden="true"
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
        <span style={{ fontWeight: 900, fontSize: 20, color: TEXT }}>{score}%</span>
      </div>
    </div>
  )
}
