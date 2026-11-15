'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/shared/Icon'

/* תזכורת חיסון ליומן. המשתמש מזין מתי היה החיסון האחרון ומתי הבא (לפי הפנקס או הווטרינר),
   ומקבל אירוע ליומן שבועיים לפני. הכול מחושב בדפדפן; שום דבר לא נשלח לאתר.
   הכלי לא קובע כל כמה זמן מחסנים - את זה קובעים הווטרינר והרשות. */

type Mode = '1y' | '2y' | 'date'

const pad = (n: number) => String(n).padStart(2, '0')
const ymd = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
const heDate = (d: Date) => new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)

function parse(v: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null
  const [y, m, d] = v.split('-').map(Number)
  const dt = new Date(y!, m! - 1, d!)
  return Number.isNaN(dt.getTime()) ? null : dt
}

export function VaccineReminder() {
  const [name, setName] = useState('')
  const [last, setLast] = useState('')
  const [mode, setMode] = useState<Mode>('1y')
  const [custom, setCustom] = useState('')
  const [what, setWhat] = useState('חיסון כלבת')

  const due = useMemo(() => {
    if (mode === 'date') return parse(custom)
    const l = parse(last)
    if (!l) return null
    const d = new Date(l)
    d.setFullYear(d.getFullYear() + (mode === '1y' ? 1 : 2))
    return d
  }, [mode, last, custom])

  const remind = useMemo(() => {
    if (!due) return null
    const r = new Date(due)
    r.setDate(r.getDate() - 14)
    return r
  }, [due])

  const dog = name.trim()
  const title = `${what.trim() || 'חיסון'} ${dog ? `ל${dog}` : 'לכלב'}: לקבוע תור`
  const details = due
    ? `מועד ${what.trim() || 'החיסון'} הבא לפי מה שהזנתם: ${heDate(due)}. כדאי לוודא את המועד מול הווטרינר או השירות הווטרינרי של הרשות. התזכורת הוכנה באתר קהילה על ארבע: https://walkonfour.org/tools/vaccine-reminder`
    : ''

  const past = remind ? remind.getTime() < new Date().setHours(0, 0, 0, 0) : false

  function ics(): string {
    const next = new Date(remind!)
    next.setDate(next.getDate() + 1)
    const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\;').replace(/\n/g, '\\n')
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//walkonfour.org//vaccine-reminder//HE',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${ymd(remind!)}-${Math.random().toString(36).slice(2)}@walkonfour.org`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(remind!)}`,
      `DTEND;VALUE=DATE:${ymd(next)}`,
      `SUMMARY:${esc(title)}`,
      `DESCRIPTION:${esc(details)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
  }

  function download() {
    if (!remind) return
    const blob = new Blob([ics()], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vaccine-reminder.ics'
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 4000)
  }

  const gcal = remind
    ? (() => {
        const next = new Date(remind)
        next.setDate(next.getDate() + 1)
        const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${ymd(remind)}/${ymd(next)}`, details })
        return `https://calendar.google.com/calendar/render?${q.toString()}`
      })()
    : null

  return (
    <div className="vr">
      <form className="vr-form" onSubmit={(e) => e.preventDefault()}>
        <label className="vr-f">
          <span>שם הכלב</span>
          <input type="text" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="vr-f">
          <span>איזה חיסון או טיפול</span>
          <input type="text" value={what} maxLength={30} onChange={(e) => setWhat(e.target.value)} />
        </label>
        <fieldset className="vr-mode">
          <legend>מתי החיסון הבא?</legend>
          <label><input type="radio" name="vr-mode" checked={mode === '1y'} onChange={() => setMode('1y')} /> שנה אחרי האחרון</label>
          <label><input type="radio" name="vr-mode" checked={mode === '2y'} onChange={() => setMode('2y')} /> שנתיים אחרי האחרון</label>
          <label><input type="radio" name="vr-mode" checked={mode === 'date'} onChange={() => setMode('date')} /> יש לי תאריך מהווטרינר</label>
        </fieldset>
        {mode === 'date' ? (
          <label className="vr-f">
            <span>התאריך שהווטרינר נתן</span>
            <input type="date" value={custom} onChange={(e) => setCustom(e.target.value)} />
          </label>
        ) : (
          <label className="vr-f">
            <span>מתי היה החיסון האחרון</span>
            <input type="date" value={last} onChange={(e) => setLast(e.target.value)} />
          </label>
        )}
        <p className="vr-note">
          כל כמה זמן מחסנים קובעים הווטרינר והרשות המקומית, לא אנחנו. אם אתם לא בטוחים, התאריך כתוב בפנקס החיסונים.
        </p>
      </form>

      <div className="vr-out" role="status" aria-live="polite">
        {!due || !remind ? (
          <p className="vr-empty">מלאו תאריך, והתזכורת תופיע כאן.</p>
        ) : (
          <>
            <p className="vr-line">המועד הבא: <strong>{heDate(due)}</strong></p>
            <p className="vr-line">התזכורת תופיע ביומן ב-<strong>{heDate(remind)}</strong>, שבועיים לפני.</p>
            {past && <p className="vr-warn">שימו לב: מועד התזכורת כבר עבר. כדאי לקבוע תור עכשיו.</p>}
            <div className="vr-btns">
              <button type="button" className="vr-b vr-b1" onClick={download}>
                <Icon name="calendar" size={20} /> הוספה ליומן (קובץ)
              </button>
              {gcal && (
                <a className="vr-b" href={gcal} target="_blank" rel="noopener noreferrer">
                  יומן גוגל<span className="kv-sr-only"> (נפתח בחלון חדש)</span>
                </a>
              )}
            </div>
            <p className="vr-note">הקובץ נפתח ביומן של הטלפון או המחשב. שום פרט לא נשלח לאתר.</p>
          </>
        )}
      </div>

      <style jsx>{`
        .vr { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 380px); gap: 24px; align-items: start; }
        .vr-form, .vr-out { background: #fff; border: 1px solid rgba(201,154,91,.3); border-radius: 18px; padding: 22px; }
        .vr-f { display: block; margin-bottom: 14px; }
        .vr-f span { display: block; font-size: 15.500px; font-weight: 800; color: var(--ink); margin-bottom: 5px; }
        .vr-f input { width: 100%; min-height: 48px; padding: 10px 14px; font: inherit; font-size: 16.500px; border: 1.500px solid rgba(90,77,60,.4); border-radius: 12px; background: #fff; color: #2a2018; }
        .vr-f input:focus-visible { outline: 3px solid rgba(201,154,91,.7); outline-offset: 2px; }
        .vr-mode { border: none; padding: 0; margin: 0 0 14px; display: grid; gap: 2px; }
        .vr-mode legend { font-size: 15.500px; font-weight: 800; color: var(--ink); margin-bottom: 4px; padding: 0; }
        .vr-mode label { display: flex; align-items: center; gap: 9px; min-height: 44px; font-size: 16.500px; cursor: pointer; }
        .vr-mode input { width: 20px; height: 20px; }
        .vr-note { margin: 8px 0 0; font-size: 14.500px; line-height: 1.7; color: #5b4d3c; }
        .vr-empty { margin: 0; font-size: 16.500px; color: #5b4d3c; }
        .vr-line { margin: 0 0 6px; font-size: 17px; line-height: 1.6; color: #2a2018; }
        .vr-warn { margin: 8px 0 0; font-size: 16px; font-weight: 700; color: #7a2e1e; }
        .vr-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
        .vr-b { display: inline-flex; align-items: center; gap: 8px; min-height: 50px; padding: 0 20px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 16px; font-weight: 800; text-decoration: none; background: #fff; color: #7a5a2e; border: 1.500px solid rgba(201,154,91,.55); transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background-color 160ms ease; }
        .vr-b1 { background: #241a12; color: #fff; border-color: #241a12; }
        .vr-b:active { transform: scale(.97); }
        .vr-b:focus-visible { outline: 3px solid #c99a5b; outline-offset: 3px; }
        @media (max-width: 820px) { .vr { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) { .vr-b { transition: none; } .vr-b:active { transform: none; } }
      `}</style>
    </div>
  )
}
