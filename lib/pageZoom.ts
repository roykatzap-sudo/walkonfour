/* ════════════════════════════════════════════════════════════
   במסכים רחבים מאוד האתר מוגדל כולו (html { zoom: var(--kv-z) } ב-globals.css),
   כדי שהטקסט לא ייראה זעיר ביחס לעמוד. קואורדינטות עכבר (clientX/clientY)
   נשארות בפיקסלים של המסך, ולכן רכיב שממקם אלמנט לפי העכבר צריך לחלק אותן
   במקדם ההגדלה. הפונקציה מחזירה את המקדם הנוכחי (1 ברוב המסכים).
   ════════════════════════════════════════════════════════════ */

let cached = 0

function read(): number {
  if (typeof window === 'undefined') return 1
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--kv-z').trim()
  const z = parseFloat(raw)
  return z > 0 ? z : 1
}

export function pageZoom(): number {
  if (typeof window === 'undefined') return 1
  if (!cached) {
    cached = read()
    window.addEventListener('resize', () => { cached = read() }, { passive: true })
  }
  return cached
}
