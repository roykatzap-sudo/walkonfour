'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * תעודת זהות לכלב: כרטיס עם תמונה, מספר שבב, טלפון בעלים ווטרינר.
 * הכול נוצר בדפדפן - הפרטים והתמונה לא נשלחים לשרת ולא נשמרים באתר.
 * שימושים: לשמור בטלפון, לשלוח לפנסיון או לדוגווקר, ולהחזיק מוכן אם הכלב הולך לאיבוד.
 */

const CREDIT = 'הוכן באתר קהילה על ארבע · walkonfour.org'
const INK = '#241a12'
const GOLD = '#c99a5b'

type Field = { key: string; label: string; placeholder?: string; ltr?: boolean; max: number }

const FIELDS: Field[] = [
  { key: 'name', label: 'שם הכלב', max: 24 },
  { key: 'look', label: 'גזע, צבע וסימנים מזהים', placeholder: 'למשל: מעורבת, חומה עם חזה לבן, אוזן אחת שמוטה', max: 70 },
  { key: 'born', label: 'שנת לידה', placeholder: 'למשל: 2021', ltr: true, max: 10 },
  { key: 'chip', label: 'מספר שבב', placeholder: 'בדרך כלל 15 ספרות, מופיע ברישיון הכלב', ltr: true, max: 20 },
  { key: 'owner', label: 'טלפון של הבעלים', ltr: true, max: 20 },
  { key: 'vet', label: 'וטרינר: שם וטלפון', placeholder: 'למשל: ד"ר כהן, 03-0000000', max: 50 },
  { key: 'notes', label: 'חשוב לדעת: אלרגיות, תרופות, התנהגות', placeholder: 'למשל: אלרגית לעוף, מפחדת מרעשים', max: 90 },
]

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
      if (lines.length === maxLines) return lines
    } else line = test
  }
  if (line && lines.length < maxLines) lines.push(line)
  return lines
}

export function DogIdCard() {
  const [v, setV] = useState<Record<string, string>>({})
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl) }, [photoUrl])

  const val = (k: string) => (v[k] ?? '').trim()

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { setMsg('צריך לבחור קובץ תמונה.'); return }
    setMsg('')
    setPhotoUrl(URL.createObjectURL(f))
  }

  const rows: [string, string, boolean][] = [
    ['מספר שבב', val('chip'), true],
    ['שנת לידה', val('born'), true],
    ['טלפון בעלים', val('owner'), true],
    ['וטרינר', val('vet'), false],
    ['חשוב לדעת', val('notes'), false],
  ].filter((r) => r[1]) as [string, string, boolean][]

  async function build(): Promise<Blob | null> {
    const W = 1080, H = 1350
    const c = document.createElement('canvas')
    c.width = W; c.height = H
    const ctx = c.getContext('2d')
    if (!ctx) return null
    const family = getComputedStyle(document.body).fontFamily || 'Arial, sans-serif'
    try { await document.fonts.ready } catch { /* ממשיכים עם הגופן שיש */ }
    ctx.direction = 'rtl'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = '#fffaf1'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = INK
    ctx.fillRect(0, 0, W, 150)
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.font = `900 76px ${family}`
    ctx.fillText('תעודת זהות לכלב', W / 2, 80)

    // תמונה
    const px = 60, py = 190, pw = 420, ph = 420
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.max(pw / img.naturalWidth, ph / img.naturalHeight)
      const sw = pw / scale, sh = ph / scale
      ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, W - px - pw, py, pw, ph)
    } else {
      ctx.fillStyle = '#f1ece3'
      ctx.fillRect(W - px - pw, py, pw, ph)
      ctx.fillStyle = '#5f574c'
      ctx.font = `700 38px ${family}`
      ctx.fillText('תמונה', W - px - pw / 2, py + ph / 2)
    }
    ctx.strokeStyle = GOLD
    ctx.lineWidth = 8
    ctx.strokeRect(W - px - pw, py, pw, ph)

    // שם ותיאור, משמאל לתמונה
    const tx = W - px - pw - 40
    ctx.textAlign = 'right'
    ctx.fillStyle = INK
    ctx.font = `900 88px ${family}`
    ctx.fillText(wrap(ctx, val('name') || 'שם הכלב', tx - 60, 1)[0] ?? '', tx, py + 70)
    ctx.font = `600 40px ${family}`
    ctx.fillStyle = '#3a3128'
    let y = py + 170
    for (const line of wrap(ctx, val('look'), tx - 60, 4)) { ctx.fillText(line, tx, y); y += 54 }

    // שורות פרטים
    y = 690
    for (const [label, value, ltr] of rows) {
      ctx.fillStyle = '#7a5a2e'
      ctx.font = `800 34px ${family}`
      ctx.textAlign = 'right'
      ctx.fillText(label, W - 60, y)
      ctx.fillStyle = INK
      ctx.font = `800 46px ${family}`
      if (ltr) {
        ctx.direction = 'ltr'
        ctx.fillText(value, W - 60, y + 54)
        ctx.direction = 'rtl'
        y += 124
      } else {
        const lines = wrap(ctx, value, W - 120, 2)
        lines.forEach((ln, i) => ctx.fillText(ln, W - 60, y + 54 + i * 54))
        y += 70 + lines.length * 54
      }
      if (y > 1230) break
    }

    ctx.fillStyle = '#6b6156'
    ctx.textAlign = 'center'
    ctx.font = `600 27px ${family}`
    ctx.fillText(CREDIT, W / 2, 1308)
    return await new Promise<Blob | null>((resolve) => c.toBlob((b) => resolve(b), 'image/jpeg', 0.92))
  }

  async function download() {
    setBusy(true); setMsg('')
    try {
      const blob = await build()
      if (!blob) { setMsg('לא הצלחנו ליצור את התמונה בדפדפן הזה. אפשר להדפיס או לצלם מסך.'); return }
      const file = new File([blob], 'dog-id-card.jpg', { type: 'image/jpeg' })
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean }
      if (typeof nav.share === 'function' && nav.canShare?.({ files: [file] })) {
        try { await nav.share({ files: [file], title: 'תעודת זהות לכלב' }); return } catch { /* בוטל - נופלים להורדה */ }
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'dog-id-card.jpg'; a.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 4000)
      setMsg('התמונה ירדה למכשיר. כדאי לשמור אותה באלבום שקל למצוא.')
    } finally { setBusy(false) }
  }

  return (
    <div className="dic">
      <form className="dic-form no-print" onSubmit={(e) => e.preventDefault()}>
        <label className="dic-f">
          <span>תמונה ברורה של הכלב</span>
          <input type="file" accept="image/*" onChange={onPhoto} />
        </label>
        {FIELDS.map((f) => (
          <label key={f.key} className="dic-f">
            <span>{f.label}</span>
            <input
              type="text"
              dir={f.ltr ? 'ltr' : undefined}
              inputMode={f.key === 'owner' ? 'tel' : f.key === 'chip' || f.key === 'born' ? 'numeric' : undefined}
              value={v[f.key] ?? ''}
              maxLength={f.max}
              placeholder={f.placeholder}
              onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value }))}
            />
          </label>
        ))}
        <div className="dic-actions">
          <button type="button" className="dic-b dic-b1" onClick={download} disabled={busy}>{busy ? 'מכין תמונה...' : 'שמירה כתמונה'}</button>
          <button type="button" className="dic-b" onClick={() => window.print()}>הדפסה</button>
        </div>
        <p className="dic-msg" role="status" aria-live="polite">{msg}</p>
        <p className="dic-note">הפרטים והתמונה נשארים במכשיר שלכם. שום דבר לא נשלח לאתר ולא נשמר אצלנו.</p>
      </form>

      <div className="dic-card" aria-label="תצוגה מקדימה של התעודה">
        <div className="dic-head">תעודת זהות לכלב</div>
        <div className="dic-top">
          <div className="dic-photo">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img ref={imgRef} src={photoUrl} alt="תמונת הכלב שבחרתם" />
            ) : (
              <span>תמונה</span>
            )}
          </div>
          <div className="dic-id">
            <div className="dic-name">{val('name') || 'שם הכלב'}</div>
            {val('look') && <p>{val('look')}</p>}
          </div>
        </div>
        <dl className="dic-rows">
          {rows.map(([label, value, ltr]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{ltr ? <bdi dir="ltr">{value}</bdi> : value}</dd>
            </div>
          ))}
        </dl>
        <div className="dic-credit">{CREDIT}</div>
      </div>

      <style jsx>{`
        .dic { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 420px); gap: 28px; align-items: start; }
        .dic-form { background: #fff; border: 1px solid rgba(201,154,91,.3); border-radius: 18px; padding: 22px; }
        .dic-f { display: block; margin-bottom: 14px; }
        .dic-f span { display: block; font-size: 15.5px; font-weight: 800; color: var(--ink); margin-bottom: 5px; }
        .dic-f input[type='text'] { width: 100%; min-height: 48px; padding: 10px 14px; font: inherit; font-size: 16.5px; border: 1.5px solid rgba(90,77,60,.4); border-radius: 12px; background: #fff; color: #2a2018; }
        .dic-f input[type='file'] { font: inherit; font-size: 15.5px; width: 100%; }
        .dic-f input:focus-visible { outline: 3px solid rgba(201,154,91,.7); outline-offset: 2px; }
        .dic-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }
        .dic-b { min-height: 50px; padding: 0 22px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 16px; font-weight: 800; background: #fff; color: #7a5a2e; border: 1.5px solid rgba(201,154,91,.55); }
        .dic-b1 { background: #241a12; color: #fff; border-color: #241a12; }
        .dic-b:disabled { opacity: .6; cursor: default; }
        .dic-b:focus-visible { outline: 3px solid rgba(201,154,91,.7); outline-offset: 3px; }
        .dic-msg { min-height: 22px; margin: 10px 0 0; font-size: 15px; font-weight: 700; color: #1b7a43; }
        .dic-note { margin: 6px 0 0; font-size: 14.5px; line-height: 1.7; color: #5f574c; }

        .dic-card { background: #fffaf1; border: 1px solid rgba(0,0,0,.14); border-radius: 14px; overflow: hidden; box-shadow: 0 14px 40px rgba(42,32,24,.16); padding-bottom: 12px; }
        .dic-head { background: #241a12; color: #fff; font-weight: 900; font-size: 28px; text-align: center; padding: 14px 10px; }
        .dic-top { display: flex; gap: 14px; padding: 16px 16px 6px; align-items: flex-start; }
        .dic-photo { flex: none; width: 150px; height: 150px; border: 4px solid #c99a5b; background: #f1ece3; display: grid; place-items: center; overflow: hidden; color: #5f574c; font-weight: 700; }
        .dic-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .dic-name { font-size: 30px; font-weight: 900; color: #241a12; line-height: 1.2; }
        .dic-id p { margin: 6px 0 0; font-size: 16px; line-height: 1.5; color: #3a3128; }
        .dic-rows { margin: 6px 16px 0; }
        .dic-rows div { padding: 8px 0; border-top: 1px solid rgba(201,154,91,.3); }
        .dic-rows dt { font-size: 14px; font-weight: 800; color: #7a5a2e; }
        .dic-rows dd { margin: 2px 0 0; font-size: 18px; font-weight: 800; color: #241a12; line-height: 1.4; }
        .dic-credit { margin-top: 10px; text-align: center; font-size: 12.5px; color: #6b6156; font-weight: 600; }

        @media (max-width: 860px) { .dic { grid-template-columns: 1fr; } }
        @media print {
          .dic { display: block; }
          .dic-card { box-shadow: none; max-width: 520px; margin: 0 auto; }
          .dic-head { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
