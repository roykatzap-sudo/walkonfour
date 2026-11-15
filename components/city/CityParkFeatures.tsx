'use client'

import { useEffect, useRef, useState } from 'react'

/* "מה יש בגינה?" - רכיב אחד לכל עמוד עיר:
   1. טוען את המאפיינים שאושרו (צל, מים, גדר) ומוסיף אותם לכרטיסי הגינות.
   2. מאזין ללחיצה על "סמנו מה יש בגינה" בכל כרטיס ופותח טופס קצר.
   הכרטיסים עצמם מרונדרים בשרת; כאן רק מוסיפים להם תגיות ומטפלים בטופס. */

type Tri = boolean | null
type Features = { shade: Tri; water: Tri; fence: Tri }

const LABELS: { key: keyof Features; yes: string; no: string; q: string }[] = [
  { key: 'shade', yes: 'יש צל', no: 'בלי צל', q: 'יש צל?' },
  { key: 'water', yes: 'יש מים', no: 'בלי מים', q: 'יש ברזייה או מים לכלבים?' },
  { key: 'fence', yes: 'מגודרת (דיווח)', no: 'לא מגודרת', q: 'הגינה מגודרת?' },
]

export function CityParkFeatures({ citySlug }: { citySlug: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [park, setPark] = useState<{ id: number; name: string } | null>(null)
  const [answers, setAnswers] = useState<Features>({ shade: null, water: null, fence: null })
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'soon'>('idle')

  // 1. מאפיינים מאושרים -> תגיות על הכרטיסים
  useEffect(() => {
    let alive = true
    fetch(`/api/park-features?city=${citySlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d?.ok) return
        const all = d.features as Record<string, Features>
        for (const [id, f] of Object.entries(all)) {
          const list = document.querySelector(`.cpl-card[data-park-id="${id}"] .cpl-chips`)
          if (!list) continue
          for (const l of LABELS) {
            const v = f[l.key]
            if (v === null || v === undefined) continue
            // גדר שכבר מסומנת מהמפה לא מוצגת פעמיים
            if (l.key === 'fence' && v && Array.from(list.children).some((c) => c.textContent === 'מגודרת')) continue
            const li = document.createElement('li')
            li.textContent = v ? l.yes : l.no
            if (!v) li.className = 'cpl-no'
            li.dataset.reported = '1'
            list.appendChild(li)
          }
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [citySlug])

  // 2. לחיצה על "סמנו מה יש בגינה" בכל כרטיס
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-park-report]')
      if (!btn) return
      setPark({ id: Number(btn.dataset.parkReport), name: btn.dataset.parkName ?? 'גינת כלבים' })
      setAnswers({ shade: null, water: null, fence: null })
      setState('idle')
      dialogRef.current?.showModal()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!park || state === 'sending') return
    if (Object.values(answers).every((v) => v === null)) return
    setState('sending')
    try {
      const res = await fetch('/api/park-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parkId: park.id, parkName: park.name, city: citySlug, ...answers }),
      })
      const d = await res.json()
      setState(d.ok ? 'done' : d.configured === false ? 'soon' : 'error')
    } catch {
      setState('error')
    }
  }

  const nothing = Object.values(answers).every((v) => v === null)

  return (
    <dialog ref={dialogRef} className="pf-dialog" aria-labelledby="pf-title">
      <form method="dialog" onSubmit={submit}>
        <h2 id="pf-title" className="pf-title">מה יש בגינה?</h2>
        <p className="pf-park">{park?.name}</p>

        {state === 'done' ? (
          <p className="pf-done" role="status">תודה! הדיווח התקבל ויופיע בעמוד אחרי בדיקה קצרה.</p>
        ) : (
          <>
            {LABELS.map((l) => (
              <fieldset key={l.key} className="pf-q">
                <legend>{l.q}</legend>
                {([['כן', true], ['לא', false], ['לא יודע', null]] as [string, Tri][]).map(([label, val]) => (
                  <label key={label}>
                    <input
                      type="radio"
                      name={l.key}
                      checked={answers[l.key] === val}
                      onChange={() => setAnswers((a) => ({ ...a, [l.key]: val }))}
                    />{' '}
                    {label}
                  </label>
                ))}
              </fieldset>
            ))}
            <p className="pf-msg" role="status" aria-live="polite">
              {state === 'error' ? 'משהו השתבש. נסו שוב בעוד רגע.' : state === 'soon' ? 'הדיווחים עוד לא פעילים. נסו שוב בקרוב.' : ''}
            </p>
          </>
        )}

        <div className="pf-actions">
          {state !== 'done' && (
            <button type="submit" className="pf-send" disabled={nothing || state === 'sending'}>
              {state === 'sending' ? 'שולח...' : 'שליחה'}
            </button>
          )}
          <button type="button" className="pf-close" onClick={() => dialogRef.current?.close()}>
            {state === 'done' ? 'סגירה' : 'ביטול'}
          </button>
        </div>
        <p className="pf-note">לא נשמר שום פרט עליכם, רק מה שסימנתם על הגינה.</p>
      </form>

      <style jsx>{`
        .pf-dialog { border: none; border-radius: 20px; padding: 24px; width: min(440px, calc(100% - 32px)); box-shadow: 0 24px 70px rgba(42, 32, 24, 0.35); color: #2a2018; }
        .pf-dialog::backdrop { background: rgba(42, 32, 24, 0.55); }
        .pf-title { margin: 0; font-size: 23px; font-weight: 900; }
        .pf-park { margin: 4px 0 14px; font-size: 16.5px; color: #5b4d3c; font-weight: 700; }
        .pf-q { border: none; padding: 0; margin: 0 0 14px; display: flex; flex-wrap: wrap; gap: 6px 18px; }
        .pf-q legend { font-size: 17px; font-weight: 800; margin-bottom: 4px; padding: 0; }
        .pf-q label { display: inline-flex; align-items: center; gap: 7px; min-height: 44px; font-size: 16.5px; cursor: pointer; }
        .pf-q input { width: 20px; height: 20px; }
        .pf-msg { min-height: 22px; margin: 0 0 6px; font-size: 15.5px; font-weight: 700; color: #7a2e1e; }
        .pf-done { margin: 6px 0 16px; font-size: 17px; line-height: 1.7; font-weight: 700; color: #1b7a43; }
        .pf-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .pf-send, .pf-close { min-height: 50px; padding: 0 24px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 16.5px; font-weight: 800; }
        .pf-send { background: #241a12; color: #fff; border: none; }
        .pf-send:disabled { opacity: 0.5; cursor: default; }
        .pf-close { background: #fff; color: #7a5a2e; border: 1.5px solid rgba(201, 154, 91, 0.55); }
        .pf-send:focus-visible, .pf-close:focus-visible { outline: 3px solid #c99a5b; outline-offset: 3px; }
        .pf-note { margin: 12px 0 0; font-size: 14.5px; color: #5b4d3c; }
      `}</style>
    </dialog>
  )
}
