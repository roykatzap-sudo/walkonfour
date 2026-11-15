'use client'

import { useRef, useState } from 'react'
import type { QuizQuestion } from '@/lib/lawQuiz'
import { ShareResult } from '@/components/shared/ShareResult'
import { GroupLink } from '@/components/shared/GroupLink'

/* חידון חוקי הכלבים: שאלה אחת בכל פעם, הסבר ומקור אחרי כל תשובה, וציון לשיתוף בסוף. */

function verdict(score: number, total: number): string {
  const r = score / total
  if (r === 1) return 'מושלם. אתם יכולים ללמד את הפקח.'
  if (r >= 0.8) return 'יפה מאוד. אתם מכירים את החוק יותר טוב מרוב בעלי הכלבים.'
  if (r >= 0.5) return 'לא רע. כמה סעיפים עוד שווה להכיר.'
  return 'הרבה הפתעות, נכון? עכשיו אתם יודעים יותר.'
}

export function LawQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const headRef = useRef<HTMLHeadingElement>(null)
  const total = questions.length
  const q = questions[i]!

  function check() {
    if (picked === null || checked) return
    setChecked(true)
    if (picked === q.answer) setScore((s) => s + 1)
  }
  function next() {
    if (i + 1 >= total) {
      setDone(true)
    } else {
      setI(i + 1)
      setPicked(null)
      setChecked(false)
    }
    window.setTimeout(() => headRef.current?.focus(), 30)
  }
  function restart() {
    setI(0); setPicked(null); setChecked(false); setScore(0); setDone(false)
    window.setTimeout(() => headRef.current?.focus(), 30)
  }

  if (done) {
    return (
      <div className="lq">
        <h2 ref={headRef} tabIndex={-1} className="lq-score">עניתם נכון על {score} מתוך {total}</h2>
        <p className="lq-verdict">{verdict(score, total)}</p>
        <ShareResult
          text={`עניתי נכון על ${score} מתוך ${total} שאלות בחידון חוקי הכלבים של קהילה על ארבע. כמה אתם יודעים?`}
          url="https://walkonfour.org/quiz?utm_source=share"
          label="אתגרו חבר עם כלב"
        />
        <div className="lq-fb">
          <p>שאלה שהפתיעה אתכם? ספרו בקבוצת הפייסבוק שלנו איזו, ותראו מה אחרים חשבו.</p>
          <GroupLink src="quiz" className="lq-fb-btn">לקבוצת הפייסבוק</GroupLink>
        </div>
        <button type="button" className="lq-btn lq-ghost" onClick={restart}>לנסות שוב</button>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </div>
    )
  }

  return (
    <div className="lq">
      <p className="lq-step" aria-hidden="true">שאלה {i + 1} מתוך {total}</p>
      <div className="lq-bar" aria-hidden="true"><span style={{ width: `${((i + (checked ? 1 : 0)) / total) * 100}%` }} /></div>
      <fieldset className="lq-q" disabled={checked}>
        <legend>
          <h2 ref={headRef} tabIndex={-1} className="lq-h">
            <span className="kv-sr-only">שאלה {i + 1} מתוך {total}: </span>
            {q.q}
          </h2>
        </legend>
        {q.options.map((o, k) => {
          const state = !checked ? '' : k === q.answer ? ' is-right' : k === picked ? ' is-wrong' : ''
          return (
            <label key={o} className={`lq-opt${picked === k ? ' is-picked' : ''}${state}`}>
              <input type="radio" name={`q${i}`} checked={picked === k} onChange={() => setPicked(k)} />
              <span>{o}</span>
              {checked && k === q.answer && <span className="lq-tag">התשובה הנכונה</span>}
              {checked && k === picked && k !== q.answer && <span className="lq-tag">הבחירה שלכם</span>}
            </label>
          )
        })}
      </fieldset>

      <div role="status" aria-live="polite">
        {checked && (
          <div className="lq-explain">
            <strong>{picked === q.answer ? 'נכון.' : 'לא מדויק.'}</strong> {q.explain}
            <span className="lq-src">מקור: {q.source}</span>
          </div>
        )}
      </div>

      {!checked ? (
        <button type="button" className="lq-btn" onClick={check} disabled={picked === null}>בדיקה</button>
      ) : (
        <button type="button" className="lq-btn" onClick={next}>{i + 1 >= total ? 'לתוצאה' : 'לשאלה הבאה'}</button>
      )}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </div>
  )
}

const styles = `
  .lq { background: #fff; border: 1px solid rgba(201,154,91,.3); border-radius: 20px; padding: 24px; }
  .lq-step { margin: 0 0 6px; font-size: 15px; font-weight: 800; color: #7a5a2e; }
  .lq-bar { height: 8px; border-radius: 4px; background: #f1ece3; overflow: hidden; margin-bottom: 18px; }
  .lq-bar span { display: block; height: 100%; background: #c99a5b; transition: width .3s ease; }
  .lq-q { border: none; padding: 0; margin: 0; display: grid; gap: 10px; }
  .lq-q legend { padding: 0; margin-bottom: 14px; }
  .lq-h { margin: 0; font-size: 23px; font-weight: 900; color: var(--ink); line-height: 1.4; }
  .lq-h:focus { outline: none; }
  .lq-opt { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; min-height: 56px; padding: 12px 16px; border-radius: 14px; border: 2px solid rgba(90,77,60,.3); cursor: pointer; font-size: 17.5px; line-height: 1.5; color: #2a2018; }
  .lq-opt input { width: 22px; height: 22px; flex: none; }
  .lq-opt.is-picked { border-color: #241a12; background: #fbf7ef; }
  .lq-opt:focus-within { outline: 3px solid #c99a5b; outline-offset: 2px; }
  .lq-opt.is-right { border-color: #1b7a43; background: #eef8f1; }
  .lq-opt.is-wrong { border-color: #b3261e; background: #fdf1ef; }
  .lq-tag { margin-inline-start: auto; font-size: 14.5px; font-weight: 800; }
  .lq-opt.is-right .lq-tag { color: #1b7a43; }
  .lq-opt.is-wrong .lq-tag { color: #b3261e; }
  .lq-explain { margin-top: 16px; background: #fdf6e9; border-inline-start: 5px solid #c99a5b; border-radius: 12px; padding: 14px 18px; font-size: 17px; line-height: 1.75; color: #2a2018; }
  .lq-src { display: block; margin-top: 6px; font-size: 15px; color: #5b4d3c; font-weight: 700; }
  .lq-btn { margin-top: 18px; min-height: 54px; padding: 0 32px; border-radius: 999px; border: none; cursor: pointer; font: inherit; font-size: 17.5px; font-weight: 900; background: #241a12; color: #fff; }
  .lq-btn:disabled { opacity: .5; cursor: default; }
  .lq-btn:focus-visible { outline: 3px solid #c99a5b; outline-offset: 3px; }
  .lq-ghost { background: #fff; color: #7a5a2e; border: 1.5px solid rgba(201,154,91,.55); }
  .lq-score { margin: 0; font-size: 30px; font-weight: 900; color: var(--ink); }
  .lq-score:focus { outline: none; }
  .lq-verdict { margin: 6px 0 0; font-size: 18px; line-height: 1.7; color: #3a3128; }
  .lq-fb { margin-top: 18px; background: #eef4ff; border: 1px solid rgba(24,119,242,.28); border-radius: 16px; padding: 16px 20px; }
  .lq-fb p { margin: 0 0 12px; font-size: 16.5px; line-height: 1.7; color: #1b2a44; }
  .lq .lq-fb-btn { display: inline-flex; align-items: center; min-height: 50px; padding: 12px 26px; border-radius: 999px; background: #1565d8; color: #fff; font-weight: 800; font-size: 16.5px; text-decoration: none; }
`
