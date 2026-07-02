'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { useCountUp } from './useCountUp'
import { breeds, type BreedSize } from '@/lib/breeds'
import { getBreedDetail } from '@/lib/breedDetails'
import {
  SIZES,
  FOODS,
  VET,
  GROOM,
  GEAR,
  DEFAULT_INPUT,
  calcCosts,
  projectCosts,
  shekel,
  type CalcInput,
  type CostGroup,
  type OptionId,
  type Projection,
} from '@/lib/costs'

/** מיפוי גודל הגזע (עברית) למזהה הגודל במחשבון. */
const BREED_SIZE_MAP: Record<BreedSize, 'small' | 'medium' | 'large' | 'giant'> = {
  קטן: 'small',
  בינוני: 'medium',
  גדול: 'large',
  ענק: 'giant',
}

/** צבעי הפירוק - בתוך פלטת הקרם-לברדור בלבד. */
const LINE_COLORS: Record<string, string> = {
  food: '#c99a5b',
  vet: '#a9743e',
  groom: '#e8c887',
  gear: '#8a5a2b',
}

/**
 * שורת בחירה אחת (קטגוריה) - קבוצת כפתורי בחירה נגישים.
 * כל אופציה היא <button> אמיתי עם aria-pressed.
 */
function ChoiceRow<T extends OptionId>({
  group,
  value,
  onChange,
}: {
  group: CostGroup<T>
  value: T
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="cc-field">
      <legend className="cc-legend">{group.title}</legend>
      <p className="cc-sub">{group.sub}</p>
      <div className="cc-opts" role="group" aria-label={group.title}>
        {group.options.map((opt) => {
          const active = opt.id === value
          return (
            <button
              key={opt.id}
              type="button"
              className={`cc-opt${active ? ' on' : ''}`}
              aria-pressed={active}
              onClick={() => onChange(opt.id)}
            >
              <span className="cc-opt-label">{opt.label}</span>
              <span className="cc-opt-hint">{opt.hint}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** קיצור ₪ לתוויות הגרף: ₪99K / ₪540. */
function compactShekel(v: number): string {
  return v >= 1000 ? `₪${Math.round(v / 1000)}K` : `₪${Math.round(v)}`
}

/** גרף השלכה: עלות מצטברת לאורך השנים (SVG, נגיש). */
function CostGraph({ projection }: { projection: Projection }) {
  const W = 360
  const H = 215
  const padL = 50 // מקום לתוויות ₪ בציר ה-Y
  const padR = 18
  const padT = 26
  const padB = 30
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const pts = projection.perYear
  const maxY = pts[pts.length - 1].cumulative || 1
  const x = (i: number) => padL + (pts.length === 1 ? plotW / 2 : (i / (pts.length - 1)) * plotW)
  const y = (v: number) => padT + plotH - (v / maxY) * plotH

  const coords = pts.map((p, i) => ({ cx: x(i), cy: y(p.cumulative), p }))
  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.cx.toFixed(1)},${c.cy.toFixed(1)}`).join(' ')
  const area = `${line} L${coords[coords.length - 1].cx.toFixed(1)},${(padT + plotH).toFixed(1)} L${coords[0].cx.toFixed(1)},${(padT + plotH).toFixed(1)} Z`
  const last = coords[coords.length - 1]
  const labelIdx = pts.length <= 3 ? pts.map((_, i) => i) : [0, Math.floor((pts.length - 1) / 2), pts.length - 1]
  const gridFs = [0.25, 0.5, 0.75, 1]
  // תווית הערך בנקודת הסיום - לא לחרוג מהקצה
  const pillW = 62
  const pillX = Math.min(W - padR - pillW, Math.max(padL, last.cx - pillW + 8))

  return (
    <figure className="cc-graph" aria-label={`גרף עלות מצטברת לאורך ${projection.years} שנים, סך הכל ${shekel(projection.total)}`}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="ccArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c99a5b" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#c99a5b" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* קווי עזר + תוויות ₪ על ציר Y */}
        {gridFs.map((f) => {
          const gy = padT + plotH - f * plotH
          return (
            <g key={f}>
              <line x1={padL} x2={W - padR} y1={gy} y2={gy} stroke="#ece4d4" strokeWidth="1" />
              <text x={padL - 7} y={gy + 3.5} textAnchor="end" fontSize="9.5" fill="#9a8c74" fontWeight="700">
                {compactShekel(maxY * f)}
              </text>
            </g>
          )
        })}
        <path d={area} fill="url(#ccArea)" />
        <path d={line} fill="none" stroke="#a9743e" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {coords.map((c) => (
          <circle key={c.p.year} cx={c.cx} cy={c.cy} r="2.6" fill="#a9743e" />
        ))}
        {/* נקודת סיום מודגשת */}
        <circle cx={last.cx} cy={last.cy} r="5" fill="#fff" stroke="#a9743e" strokeWidth="2.5" />
        {/* תווית ערך הסיום (הסכום הכולל) - משתנה מיד עם הפרמטרים */}
        <g>
          <rect x={pillX} y={Math.max(2, last.cy - 26)} width={pillW} height="19" rx="9.5" fill="#241a12" />
          <text x={pillX + pillW / 2} y={Math.max(2, last.cy - 26) + 13} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="800">
            {compactShekel(maxY)}
          </text>
        </g>
        {/* תוויות שנים */}
        {labelIdx.map((i) => (
          <text key={i} x={x(i)} y={H - 9} textAnchor="middle" fontSize="11" fill="#7a6c58" fontWeight="700">
            {pts[i].year === 1 ? 'שנה 1' : `שנה ${pts[i].year}`}
          </text>
        ))}
      </svg>
    </figure>
  )
}

const YEAR_PRESETS = [1, 5, 10, 13]

type Snapshot = {
  projection: Projection
  result: ReturnType<typeof calcCosts>
  breedName: string | null
}

export function CostCalculator({ presetBreed }: { presetBreed?: string } = {}) {
  // כשמוטמע בעמוד גזע - נעולים לגזע הזה (בלי בוחר גזע/גודל), ומחושב מראש.
  const presetBreedObj = presetBreed ? breeds.find((b) => b.slug === presetBreed) : null
  const [input, setInput] = useState<CalcInput>(
    presetBreedObj ? { ...DEFAULT_INPUT, size: BREED_SIZE_MAP[presetBreedObj.size] } : DEFAULT_INPUT
  )
  const [years, setYears] = useState(13)
  const [breedSlug, setBreedSlug] = useState(presetBreed ?? '')

  // ===== מצב התוצאה - מחושב מיידית (חישוב מקומי מהיר) =====
  const [snap, setSnap] = useState<Snapshot | null>(null) // התוצאה המוצגת
  const [dirty, setDirty] = useState(false) // השתנו בחירות מאז החישוב האחרון

  // בעמוד גזע - מריצים את התחזית אוטומטית פעם אחת, כדי שהמספר יופיע מיד.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (presetBreed) compute() }, [])

  const selectedBreed = breedSlug ? breeds.find((b) => b.slug === breedSlug) : null
  const selectedWeight = selectedBreed ? getBreedDetail(selectedBreed.slug)?.weightKg : null

  /** מסמן שהבחירות השתנו - התוצאה הקיימת (אם יש) הופכת ל"לא מעודכנת". */
  function markDirty() {
    if (snap) setDirty(true)
  }

  function set<K extends keyof CalcInput>(key: K, val: CalcInput[K]) {
    setInput((prev) => ({ ...prev, [key]: val }))
    markDirty()
  }

  /** בחירת גזע ספציפי - קובעת את הגודל לפי הגזע. */
  function pickBreed(slug: string) {
    setBreedSlug(slug)
    const b = slug ? breeds.find((x) => x.slug === slug) : null
    if (b) setInput((prev) => ({ ...prev, size: BREED_SIZE_MAP[b.size] }))
    markDirty()
  }

  /** שינוי גודל ידני מנתק את הגזע הספציפי (כדי לא ליצור סתירה). */
  function pickSize(v: CalcInput['size']) {
    setBreedSlug('')
    set('size', v)
  }

  function changeYears(v: number) {
    setYears(v)
    markDirty()
  }

  /** מחשב את התחזית מיידית (חישוב מקומי מהיר - אין סיבה להשהות). */
  function compute() {
    setSnap({
      projection: projectCosts(input, years),
      result: calcCosts(input),
      breedName: selectedBreed ? selectedBreed.name : null,
    })
    setDirty(false)
  }

  // ===== מונים מתגלגלים לשני מספרי ה"פרס" (מכבד reduced-motion) =====
  // מבוססים על ה-snapshot המוצג; 0 כשעדיין אין תוצאה. הפורמט נשאר shekel().
  const animatedTotal = useCountUp(snap ? snap.projection.total : 0)
  const animatedMonthly = useCountUp(snap ? snap.result.monthly : 0)

  return (
    <div className="cc-wrap">
      <div className="cc-grid">
        {/* ===== טור הבחירות ===== */}
        <div className="cc-controls">
          {/* ===== בחירת גזע ספציפי (מוסתר כשנעולים לגזע מעמוד הגזע) ===== */}
          {presetBreedObj ? (
            <div className="cc-field" style={{ marginBottom: 22 }}>
              {selectedWeight && (
                <span className="cc-breed-info">⚖️ {presetBreedObj.name}: {selectedWeight} ק״ג · גודל {presetBreedObj.size}</span>
              )}
              <p className="cc-sub" style={{ marginTop: 12 }}>
                שחקו עם סוג המזון, הווטרינר, הטיפוח והשנים - והתחזית תתעדכן בהתאם.
              </p>
            </div>
          ) : (
            <>
              <fieldset className="cc-field">
                <legend className="cc-legend">גזע ספציפי</legend>
                <p className="cc-sub">בחרו גזע והגודל ייקבע אוטומטית לפי המשקל שלו - או דלגו ובחרו גודל ידנית למטה.</p>
                <div className="cc-breed">
                  <select
                    className="cc-select"
                    value={breedSlug}
                    onChange={(e) => pickBreed(e.target.value)}
                    aria-label="בחירת גזע ספציפי"
                  >
                    <option value="">- לפי גודל (כללי) -</option>
                    {breeds.map((b) => (
                      <option key={b.slug} value={b.slug}>{b.name}</option>
                    ))}
                  </select>
                  {selectedBreed && selectedWeight && (
                    <span className="cc-breed-info">⚖️ {selectedBreed.name}: {selectedWeight} ק״ג</span>
                  )}
                </div>
              </fieldset>

              <ChoiceRow group={SIZES} value={input.size} onChange={pickSize} />
            </>
          )}
          <ChoiceRow group={FOODS} value={input.food} onChange={(v) => set('food', v)} />
          <ChoiceRow group={VET} value={input.vet} onChange={(v) => set('vet', v)} />
          <ChoiceRow group={GROOM} value={input.groom} onChange={(v) => set('groom', v)} />
          <ChoiceRow group={GEAR} value={input.gear} onChange={(v) => set('gear', v)} />

          {/* ===== כמה שנים ===== */}
          <fieldset className="cc-field">
            <legend className="cc-legend">לכמה שנים לחשב?</legend>
            <p className="cc-sub">תוחלת החיים הממוצעת היא 12-15 שנים. בחרו טווח להערכת העלות הכוללת.</p>
            <div className="cc-years">
              <input
                type="range"
                min={1}
                max={16}
                value={years}
                onChange={(e) => changeYears(Number(e.target.value))}
                aria-label="מספר שנים"
                className="cc-range"
              />
              <output className="cc-years-val">{years} {years === 1 ? 'שנה' : 'שנים'}</output>
            </div>
            <div className="cc-presets" role="group" aria-label="טווחים נפוצים">
              {YEAR_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`cc-preset${years === p ? ' on' : ''}`}
                  aria-pressed={years === p}
                  onClick={() => changeYears(p)}
                >
                  {p === 1 ? 'שנה' : `${p} שנים`}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* ===== טור התוצאה ===== */}
        <div className="cc-result">
          {/* --- מצב: עוד לא חושב --- */}
          {!snap && (
            <div className="cc-summary card cc-idle">
              <div className="cc-idle-ico" aria-hidden>📊</div>
              <h3 className="cc-idle-title">מוכנים לתחזית?</h3>
              <p className="cc-idle-body">
                בחרו גזע או גודל, מזון, וטרינר, טיפוח, אבזור ומספר שנים - ואנחנו נבנה לכם
                תחזית עלות מותאמת אישית לאורך כל חיי הכלב.
              </p>
              <button type="button" className="btn btn-primary cc-compute-btn" onClick={compute}>
                ✨ בנו לי תחזית עלות
              </button>
            </div>
          )}

          {/* --- מצב: יש תוצאה --- */}
          {snap && (() => {
            const snapMax = Math.max(...snap.result.lines.map((l) => l.monthly), 1)
            return (
              <>
                {dirty && (
                  <div className="cc-stale-bar">
                    <span>שיניתם בחירה - התחזית למטה אינה מעודכנת.</span>
                    <button type="button" className="btn btn-primary cc-recalc-btn" onClick={compute}>
                      חשבו מחדש
                    </button>
                  </div>
                )}
                <div className={`cc-reveal${dirty ? ' stale' : ''}`}>
                  <div className="cc-summary card cc-proj">
                    <span className="cc-summary-tag">
                      {snap.breedName ? `${snap.breedName} · ` : ''}עלות כוללת ל־{snap.projection.years} שנים
                    </span>
                    <div className="cc-big">
                      <span className="cc-big-num">{shekel(animatedTotal)}</span>
                    </div>
                    <div className="cc-proj-meta">
                      <span>🦴 ציוד ראשוני: <strong>{shekel(snap.projection.oneTimeGear)}</strong></span>
                      <span>💉 וטרינר שנה ראשונה: <strong>{shekel(snap.projection.firstYearVet)}</strong></span>
                      <span>🔁 שוטף לשנה: <strong>{shekel(snap.projection.yearly)}</strong></span>
                    </div>
                    <CostGraph projection={snap.projection} />
                    <p className="cc-note" style={{ marginTop: 14 }}>
                      השנה הראשונה יקרה יותר: הגור עובר סדרת חיסונים מלאה לבניית המערכת החיסונית
                      (3-4 מנות חיסון משולב, כלבת ותילועים), מול דחף שנתי בודד בלבד בכלב בוגר - בנוסף
                      לשבב, עיקור/סירוס וציוד ראשוני. הגרף מציג את ההוצאה המצטברת לאורך הזמן.
                    </p>
                  </div>

                  <div className="cc-summary card">
                    <span className="cc-summary-tag">העלות המשוערת שלך</span>
                    <div className="cc-big">
                      <span className="cc-big-num">{shekel(animatedMonthly)}</span>
                      <span className="cc-big-unit">לחודש</span>
                    </div>
                    <div className="cc-year">
                      כ־<strong>{shekel(snap.result.yearly)}</strong> בשנה
                    </div>

                    <div className="cc-breakdown" role="table" aria-label="פירוק העלות החודשית">
                      {snap.result.lines.map((line) => {
                        const pct = Math.round((line.monthly / snapMax) * 100)
                        const share = snap.result.monthly > 0 ? Math.round((line.monthly / snap.result.monthly) * 100) : 0
                        return (
                          <div className="cc-row" role="row" key={line.key}>
                            <div className="cc-row-head" role="rowheader">
                              <span className="cc-dot" style={{ background: LINE_COLORS[line.key] }} aria-hidden />
                              <span className="cc-row-label">{line.label}</span>
                              <span className="cc-row-val">
                                {shekel(line.monthly)}
                                <span className="cc-row-share"> · {share}%</span>
                              </span>
                            </div>
                            <div className="cc-bar" role="cell">
                              <div className="cc-bar-fill" style={{ width: `${pct}%`, background: LINE_COLORS[line.key] }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <p className="cc-note">
                      ההערכה כללית ומבוססת על טווחי מחירים נפוצים בישראל. העלות בפועל משתנה לפי
                      הגזע, מצב הבריאות, אזור המגורים והבחירות שלכם.
                    </p>
                  </div>
                </div>
              </>
            )
          })()}

          {/* ===== באנר חיסכון ===== */}
          <Reveal3D>
            <div className="cc-save">
              <div className="cc-save-text">
                <span className="cc-save-tag">טיפ לחיסכון</span>
                <h3 className="cc-save-title">המזון הוא רוב ההוצאה</h3>
                <p className="cc-save-body">
                  המזון והאבזור הם רוב ההוצאה החודשית. השוו מחירי מזון בין החנויות וראו איפה זול
                  יותר - זה החיסכון הכי קל, ובדיוק על מה שאתם קונים ממילא.
                </p>
              </div>
              <Link href="/dog-food-prices" className="btn btn-primary cc-save-btn">
                למחירון המזון
              </Link>
            </div>
          </Reveal3D>
        </div>
      </div>

      <style jsx global>{`
        .cc-wrap {
          margin-top: 8px;
        }
        .cc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (min-width: 920px) {
          .cc-grid {
            grid-template-columns: 1.05fr 0.95fr;
            gap: 40px;
          }
          .cc-result {
            position: sticky;
            top: 24px;
          }
        }

        /* ---- בחירות ---- */
        .cc-field {
          border: 0;
          margin: 0 0 26px;
          padding: 0;
        }
        .cc-legend {
          font-size: 18px;
          font-weight: 800;
          color: var(--ink);
          padding: 0;
        }
        .cc-sub {
          margin: 4px 0 12px;
          font-size: 14px;
          color: #6b5d4c;
          line-height: 1.5;
        }
        .cc-opts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }
        .cc-opt {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: right;
          background: #fff;
          border: 1.5px solid #e3dccd;
          border-radius: 14px;
          padding: 13px 15px;
          min-height: 64px;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.18s, background 0.18s, transform 0.18s, box-shadow 0.18s;
        }
        .cc-opt:hover {
          border-color: var(--brand);
          transform: translateY(-2px);
        }
        .cc-opt.on {
          border-color: var(--brand);
          background: #fdf6e9;
          box-shadow: 0 8px 22px rgba(201, 154, 91, 0.18);
        }
        .cc-opt-label {
          font-size: 15px;
          font-weight: 800;
          color: var(--ink);
        }
        .cc-opt.on .cc-opt-label {
          color: #8a5a2b;
        }
        .cc-opt-hint {
          font-size: 12.5px;
          color: #7a6c58;
          line-height: 1.45;
        }

        /* ---- תוצאה ---- */
        .cc-summary {
          padding: 26px 26px 24px;
        }
        .cc-summary-tag {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brand-dark, #8a5a2b);
        }
        .cc-big {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-top: 6px;
        }
        .cc-big-num {
          font-size: 48px;
          font-weight: 900;
          letter-spacing: -1.5px;
          color: var(--ink);
          line-height: 1;
        }
        .cc-big-unit {
          font-size: 18px;
          font-weight: 700;
          color: #6b5d4c;
        }
        .cc-year {
          margin-top: 8px;
          font-size: 16px;
          color: #5a4d3c;
        }
        .cc-year strong {
          color: var(--ink);
        }

        .cc-breakdown {
          margin-top: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .cc-row-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 14.5px;
        }
        .cc-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          flex: none;
        }
        .cc-row-label {
          font-weight: 700;
          color: var(--ink);
        }
        .cc-row-val {
          margin-inline-start: auto;
          font-weight: 800;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }
        .cc-row-share {
          font-weight: 600;
          color: #8a7c66;
        }
        .cc-bar {
          height: 10px;
          background: #efe7d6;
          border-radius: 100px;
          overflow: hidden;
        }
        .cc-bar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .cc-note {
          margin: 22px 0 0;
          font-size: 12.5px;
          line-height: 1.6;
          color: #7a6c58;
          border-top: 1px solid #ece4d4;
          padding-top: 16px;
        }

        /* ---- באנר חיסכון ---- */
        .cc-save {
          margin-top: 20px;
          background: var(--ink);
          border-radius: 20px;
          padding: 26px;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .cc-save-tag {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brand-light, #e8c887);
        }
        .cc-save-title {
          margin: 8px 0 0;
          font-size: 23px;
          font-weight: 900;
          color: #fff;
        }
        .cc-save-body {
          margin: 10px 0 0;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.82);
        }
        .cc-save-btn {
          align-self: flex-start;
        }

        /* ---- בחירת גזע ---- */
        .cc-breed {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cc-select {
          flex: 1;
          min-width: 200px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          background: #fff;
          border: 1.5px solid #e3dccd;
          border-radius: 14px;
          padding: 13px 15px;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23a9743e' stroke-width='2.4' stroke-linecap='round'><polyline points='6 9 12 15 18 9'/></svg>");
          background-repeat: no-repeat;
          background-position: left 15px center;
        }
        .cc-select:hover { border-color: var(--brand); }
        .cc-select:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
        .cc-breed-info {
          font-size: 14px;
          font-weight: 800;
          color: #8a5a2b;
          background: #fdf6e9;
          border-radius: 100px;
          padding: 8px 14px;
          white-space: nowrap;
        }

        /* ---- בקרת שנים ---- */
        .cc-years {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cc-range {
          flex: 1;
          appearance: none;
          -webkit-appearance: none;
          height: 8px;
          border-radius: 100px;
          background: #efe7d6;
          cursor: pointer;
          direction: ltr;
        }
        .cc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--brand);
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(201, 154, 91, 0.5);
          cursor: pointer;
        }
        .cc-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--brand);
          border: 3px solid #fff;
          cursor: pointer;
        }
        .cc-years-val {
          font-weight: 900;
          font-size: 18px;
          color: var(--ink);
          min-width: 72px;
          text-align: center;
          background: #fdf6e9;
          border-radius: 12px;
          padding: 8px 6px;
        }
        .cc-presets {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .cc-preset {
          background: #fff;
          border: 1.5px solid #e3dccd;
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 13.5px;
          font-weight: 700;
          color: #6b5d4c;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.18s, background 0.18s, color 0.18s;
        }
        .cc-preset:hover {
          border-color: var(--brand);
        }
        .cc-preset.on {
          border-color: var(--brand);
          background: var(--brand);
          color: #fff;
        }

        /* ---- פאנל השלכה + גרף ---- */
        .cc-proj {
          margin-bottom: 20px;
        }
        .cc-proj-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 22px;
          margin-top: 12px;
          font-size: 14px;
          color: #5a4d3c;
        }
        .cc-proj-meta strong {
          color: var(--ink);
        }
        .cc-graph {
          margin: 18px 0 0;
          padding: 0;
        }
        .cc-graph svg {
          display: block;
        }

        /* ---- מצב: עוד לא חושב (idle) ---- */
        .cc-idle {
          text-align: center;
          padding: 40px 28px;
        }
        .cc-idle-ico { font-size: 44px; }
        .cc-idle-title {
          font-size: 24px;
          font-weight: 900;
          color: var(--ink);
          margin: 12px 0 8px;
        }
        .cc-idle-body {
          font-size: 15px;
          line-height: 1.7;
          color: #6b5d4c;
          margin: 0 auto 22px;
          max-width: 360px;
        }
        .cc-compute-btn {
          font-size: 16.5px;
          padding: 15px 30px;
        }

        /* ---- חשיפת התוצאה ---- */
        .cc-reveal { animation: cc-reveal-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes cc-reveal-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cc-reveal.stale {
          opacity: 0.45;
          filter: grayscale(0.4);
          transition: opacity 0.3s, filter 0.3s;
        }
        .cc-stale-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          background: #fdf6e9;
          border: 1.5px solid var(--brand-light, #e8c887);
          border-radius: 16px;
          padding: 14px 18px;
          margin-bottom: 16px;
          font-size: 14.5px;
          font-weight: 700;
          color: #8a5a2b;
        }
        .cc-recalc-btn { padding: 10px 20px; font-size: 14px; flex-shrink: 0; }

        @media (prefers-reduced-motion: reduce) {
          .cc-opt,
          .cc-bar-fill {
            transition: none;
          }
          .cc-reveal { animation: none; }
        }
      `}</style>
    </div>
  )
}
