'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * מחולל מודעת "כלב אבד" / "נמצא כלב".
 * הכול קורה בדפדפן: התמונה והפרטים לא נשלחים לשרת ולא נשמרים באתר.
 * שני פלטים: הדפסה (A4) ותמונה לשיתוף בוואטסאפ ובקבוצות פייסבוק.
 * בתחתית כל מודעה מופיע שם האתר, כך שכל מודעה שמודפסת או משותפת
 * מביאה איתה גם את הכתובת שלנו.
 */

type Mode = 'lost' | 'found'

const HEAD: Record<Mode, string> = { lost: 'כלב אבד', found: 'נמצא כלב' }
const RED = '#c62828'
const GREEN = '#1b7a43'
const CREDIT = 'המודעה הוכנה באתר קהילה על ארבע · walkonfour.org'

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
      if (lines.length === maxLines) break
    } else {
      line = test
    }
  }
  if (lines.length < maxLines && line) lines.push(line)
  return lines
}

export function LostDogPoster() {
  const [mode, setMode] = useState<Mode>('lost')
  const [name, setName] = useState('')
  const [look, setLook] = useState('')
  const [where, setWhere] = useState('')
  const [signs, setSigns] = useState('')
  const [phone, setPhone] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)

  // משחררים את כתובת התמונה הזמנית כשמחליפים תמונה או עוזבים את העמוד
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setMsg('צריך לבחור קובץ תמונה.')
      return
    }
    setMsg('')
    setPhotoUrl(URL.createObjectURL(f))
  }

  const color = mode === 'lost' ? RED : GREEN
  const title = mode === 'lost' ? name.trim() || 'שם הכלב' : name.trim()

  async function buildImage(): Promise<Blob | null> {
    const W = 1080
    const H = 1350
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const family = getComputedStyle(document.body).fontFamily || 'Arial, sans-serif'
    try {
      await document.fonts.ready
    } catch {
      /* ממשיכים עם הגופן שיש */
    }
    ctx.direction = 'rtl'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    // כותרת
    ctx.fillStyle = color
    ctx.fillRect(0, 0, W, 190)
    ctx.fillStyle = '#ffffff'
    ctx.font = `900 124px ${family}`
    ctx.fillText(HEAD[mode], W / 2, 100)

    // תמונה (חיתוך cover)
    const px = 60, py = 220, pw = W - 120, ph = 540
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.max(pw / img.naturalWidth, ph / img.naturalHeight)
      const sw = pw / scale
      const sh = ph / scale
      const sx = (img.naturalWidth - sw) / 2
      const sy = (img.naturalHeight - sh) / 2
      ctx.drawImage(img, sx, sy, sw, sh, px, py, pw, ph)
    } else {
      ctx.fillStyle = '#f1ece3'
      ctx.fillRect(px, py, pw, ph)
      ctx.fillStyle = '#8a7f70'
      ctx.font = `700 44px ${family}`
      ctx.fillText('כאן תופיע התמונה', W / 2, py + ph / 2)
    }
    ctx.strokeStyle = color
    ctx.lineWidth = 8
    ctx.strokeRect(px, py, pw, ph)

    // פרטים
    let y = 830
    ctx.fillStyle = '#1f1a14'
    if (title) {
      ctx.font = `900 78px ${family}`
      ctx.fillText(wrapLines(ctx, title, W - 140, 1)[0] ?? title, W / 2, y)
      y += 74
    }
    ctx.font = `600 40px ${family}`
    ctx.fillStyle = '#3a3128'
    const blocks = [look, where, signs].map((t) => t.trim()).filter(Boolean)
    for (const b of blocks) {
      for (const line of wrapLines(ctx, b, W - 140, 2)) {
        if (y > 1100) break
        ctx.fillText(line, W / 2, y)
        y += 52
      }
    }

    // טלפון
    const bandY = 1140
    ctx.fillStyle = '#1f1a14'
    ctx.fillRect(60, bandY, W - 120, 124)
    ctx.fillStyle = '#ffffff'
    ctx.font = `900 62px ${family}`
    ctx.fillText(phone.trim() ? `התקשרו: ${phone.trim()}` : 'התקשרו: מספר הטלפון', W / 2, bandY + 64)

    // קרדיט
    ctx.fillStyle = '#6b6156'
    ctx.font = `600 27px ${family}`
    ctx.fillText(CREDIT, W / 2, 1308)

    return await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92))
  }

  async function download() {
    setBusy(true)
    setMsg('')
    try {
      const blob = await buildImage()
      if (!blob) {
        setMsg('לא הצלחנו ליצור את התמונה בדפדפן הזה. אפשר להדפיס או לצלם מסך.')
        return
      }
      const file = new File([blob], 'lost-dog-poster.jpg', { type: 'image/jpeg' })
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean }
      if (typeof nav.share === 'function' && nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: HEAD[mode] })
          return
        } catch {
          /* המשתמש ביטל את השיתוף - נופלים להורדה רגילה */
        }
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'lost-dog-poster.jpg'
      a.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 4000)
      setMsg('התמונה ירדה למכשיר. אפשר לשלוח אותה בוואטסאפ ולהעלות לקבוצות.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ldp">
      <form className="ldp-form no-print" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="ldp-mode">
          <legend>סוג המודעה</legend>
          <label><input type="radio" name="mode" checked={mode === 'lost'} onChange={() => setMode('lost')} /> הכלב שלי אבד</label>
          <label><input type="radio" name="mode" checked={mode === 'found'} onChange={() => setMode('found')} /> מצאתי כלב</label>
        </fieldset>

        <label className="ldp-f">
          <span>תמונה ברורה של הכלב</span>
          <input type="file" accept="image/*" onChange={onPhoto} />
        </label>
        <label className="ldp-f">
          <span>{mode === 'lost' ? 'שם הכלב' : 'שם הכלב, אם ידוע'}</span>
          <input type="text" value={name} maxLength={30} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="ldp-f">
          <span>איך הוא נראה: גזע, צבע, גודל</span>
          <input type="text" value={look} maxLength={90} onChange={(e) => setLook(e.target.value)} placeholder="למשל: מעורב בינוני, חום עם חזה לבן" />
        </label>
        <label className="ldp-f">
          <span>{mode === 'lost' ? 'איפה ומתי נראה לאחרונה' : 'איפה ומתי נמצא'}</span>
          <input type="text" value={where} maxLength={90} onChange={(e) => setWhere(e.target.value)} placeholder="למשל: ליד גינת הכלבים ברחוב הרצל, יום שלישי בערב" />
        </label>
        <label className="ldp-f">
          <span>סימנים מזהים</span>
          <input type="text" value={signs} maxLength={90} onChange={(e) => setSigns(e.target.value)} placeholder="למשל: קולר אדום, צולע מעט ברגל אחורית" />
        </label>
        <label className="ldp-f">
          <span>טלפון ליצירת קשר</span>
          <input type="tel" inputMode="tel" dir="ltr" value={phone} maxLength={20} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <div className="ldp-actions">
          <button type="button" className="ldp-b ldp-b1" onClick={download} disabled={busy}>
            {busy ? 'מכין תמונה...' : 'תמונה לשיתוף בוואטסאפ ובפייסבוק'}
          </button>
          <button type="button" className="ldp-b" onClick={() => window.print()}>הדפסת המודעה</button>
        </div>
        <p className="ldp-msg" role="status" aria-live="polite">{msg}</p>
        <p className="ldp-note">
          הפרטים והתמונה נשארים במכשיר שלכם. שום דבר לא נשלח לאתר ולא נשמר אצלנו.
          מספר הטלפון יופיע על המודעה, אז כתבו מספר שנוח לכם לפרסם.
        </p>
      </form>

      {/* תצוגה מקדימה - זה גם מה שמודפס */}
      <div className="ldp-poster" aria-label="תצוגה מקדימה של המודעה">
        <div className="ldp-head" style={{ background: color }}>{HEAD[mode]}</div>
        <div className="ldp-photo" style={{ borderColor: color }}>
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img ref={imgRef} src={photoUrl} alt="תמונת הכלב שבחרתם" />
          ) : (
            <span>כאן תופיע התמונה</span>
          )}
        </div>
        {title && <div className="ldp-name">{title}</div>}
        {look.trim() && <p className="ldp-line">{look}</p>}
        {where.trim() && <p className="ldp-line">{where}</p>}
        {signs.trim() && <p className="ldp-line">{signs}</p>}
        <div className="ldp-phone">התקשרו: <bdi dir="ltr">{phone.trim() || 'מספר הטלפון'}</bdi></div>
        <div className="ldp-credit">{CREDIT}</div>
      </div>

      <style jsx>{`
        .ldp { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 420px); gap: 28px; align-items: start; }
        .ldp-form { background: #fff; border: 1px solid rgba(201,154,91,.3); border-radius: 18px; padding: 22px; }
        .ldp-mode { border: none; padding: 0; margin: 0 0 14px; display: flex; gap: 18px; flex-wrap: wrap; font-size: 16.5px; font-weight: 700; }
        .ldp-mode legend { font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 6px; padding: 0; }
        .ldp-mode label { display: inline-flex; align-items: center; gap: 7px; min-height: 44px; cursor: pointer; }
        .ldp-mode input { width: 20px; height: 20px; }
        .ldp-f { display: block; margin-bottom: 14px; }
        .ldp-f span { display: block; font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 5px; }
        .ldp-f input[type='text'], .ldp-f input[type='tel'] {
          width: 100%; min-height: 48px; padding: 10px 14px; font: inherit; font-size: 16.5px;
          border: 1.5px solid rgba(90,77,60,.35); border-radius: 12px; background: #fff; color: #2a2018;
        }
        .ldp-f input[type='file'] { font: inherit; font-size: 15.5px; width: 100%; }
        .ldp-f input:focus-visible { outline: 3px solid rgba(201,154,91,.7); outline-offset: 2px; }
        .ldp-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }
        .ldp-b {
          min-height: 50px; padding: 0 20px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 16px; font-weight: 800;
          background: #fff; color: var(--brand-dark); border: 1.5px solid rgba(201,154,91,.5);
        }
        .ldp-b1 { background: #1f9d55; color: #fff; border-color: transparent; }
        .ldp-b:disabled { opacity: .6; cursor: default; }
        .ldp-b:focus-visible { outline: 3px solid rgba(201,154,91,.7); outline-offset: 3px; }
        .ldp-msg { min-height: 22px; margin: 10px 0 0; font-size: 15px; font-weight: 700; color: #1b7a43; }
        .ldp-note { margin: 6px 0 0; font-size: 14.5px; line-height: 1.7; color: #5f574c; }

        .ldp-poster {
          background: #fff; border: 1px solid rgba(0,0,0,.14); border-radius: 6px; overflow: hidden;
          box-shadow: 0 14px 40px rgba(42,32,24,.16); text-align: center; padding-bottom: 14px;
        }
        .ldp-head { color: #fff; font-weight: 900; font-size: 52px; line-height: 1; padding: 18px 10px; }
        .ldp-photo {
          margin: 14px 18px 10px; aspect-ratio: 16 / 9; border: 4px solid; background: #f1ece3;
          display: grid; place-items: center; overflow: hidden; color: #8a7f70; font-weight: 700;
        }
        .ldp-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ldp-name { font-size: 34px; font-weight: 900; color: #1f1a14; margin: 6px 14px 4px; }
        .ldp-line { font-size: 17.5px; font-weight: 600; color: #3a3128; margin: 3px 18px; line-height: 1.5; }
        .ldp-phone { margin: 14px 18px 10px; background: #1f1a14; color: #fff; font-weight: 900; font-size: 26px; padding: 14px 10px; }
        .ldp-credit { font-size: 12.5px; color: #6b6156; font-weight: 600; }

        @media (max-width: 860px) { .ldp { grid-template-columns: 1fr; } }
        @media print {
          .ldp { display: block; }
          .ldp-poster { border: none; box-shadow: none; border-radius: 0; width: 100%; }
          .ldp-head { font-size: 110px; padding: 30px 10px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .ldp-photo { margin: 22px 0 16px; }
          .ldp-name { font-size: 64px; }
          .ldp-line { font-size: 30px; }
          .ldp-phone { font-size: 54px; padding: 26px 10px; margin: 24px 0 14px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .ldp-credit { font-size: 16px; }
        }
      `}</style>
    </div>
  )
}
