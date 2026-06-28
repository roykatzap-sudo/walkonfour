/* ════════════════════════════════════════════════════════════
   Rate limiting פשוט בזיכרון (חלון מתגלגל לכל IP).
   הערה: ב-serverless זה per-instance ולא גלובלי מושלם, אבל מוסיף
   חיכוך משמעותי מול ספאם/brute-force בלי תלות בשירות חיצוני.
   לעומס גבוה - להחליף ל-Upstash/Vercel KV.
   ════════════════════════════════════════════════════════════ */

const HITS = new Map<string, number[]>()

/** מחזיר את כתובת ה-IP של המבקש (מאחורי פרוקסי של Vercel). */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

/**
 * מחזיר true אם המבקש חרג מהמכסה (max בקשות בחלון windowMs).
 * key = למשל `${ip}:waitlist`.
 */
export function rateLimited(key: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const arr = (HITS.get(key) || []).filter((t) => now - t < windowMs)
  arr.push(now)
  HITS.set(key, arr)
  // הגנת זיכרון מפני גדילה בלתי-מוגבלת
  if (HITS.size > 10_000) HITS.clear()
  return arr.length > max
}
