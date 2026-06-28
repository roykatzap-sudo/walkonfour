/* ════════════════════════════════════════════════════════════
   דיווחי גינות חסרות. משתמש/ת מדווח/ת על גינה שלא מופיעה במפה,
   הדיווח נשמר בטבלת park_reports ב-Supabase עם status='pending',
   ומחכה לאישור ידני בפאנל האדמין (/admin/park-reports).
   אחרי אישור (status='approved') הגינה מופיעה על המפה.

   הפעלה (פעם אחת): צריך את אותו Supabase של רשימת ההמתנה
   ([[lib/waitlist.ts]]), ובנוסף משתנה סביבה ADMIN_TOKEN (סוד חזק
   לכניסה לפאנל). הריצו ב-SQL Editor:
     create table if not exists park_reports (
       id bigint generated always as identity primary key,
       name text not null,
       city text,
       note text,
       lat double precision,
       lng double precision,
       status text not null default 'pending',
       created_at timestamptz default now()
     );
   ════════════════════════════════════════════════════════════ */

import { timingSafeEqual } from 'crypto'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_TOKEN = process.env.ADMIN_TOKEN

export type ParkReport = {
  id: number
  name: string
  city: string | null
  note: string | null
  lat: number | null
  lng: number | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

/** מרכזי ערים לפלוט גינה מאושרת שאין לה קואורדינטה מדויקת. */
const CITY_COORDS: Record<string, [number, number]> = {
  'תל אביב': [32.0809, 34.7806], 'ירושלים': [31.7683, 35.2137], 'חיפה': [32.794, 34.9896],
  'ראשון לציון': [31.973, 34.7925], 'רמת גן': [32.07, 34.8235], 'הרצליה': [32.1624, 34.8443],
  'נתניה': [32.3215, 34.8532], 'באר שבע': [31.252, 34.791], 'פתח תקווה': [32.084, 34.887],
  'אשדוד': [31.792, 34.641], 'חולון': [32.015, 34.779], 'כפר סבא': [32.175, 34.907],
}

/** קואורדינטה לתצוגה: המדויקת אם נמסרה, אחרת מרכז העיר. */
export function reportCoord(r: ParkReport): [number, number] | null {
  if (r.lat && r.lng) return [r.lat, r.lng]
  if (r.city && CITY_COORDS[r.city]) return CITY_COORDS[r.city]
  return null
}

export function reportsConfigured(): boolean {
  return Boolean(URL && SERVICE && URL.includes('supabase.co') && !SERVICE.startsWith('your-'))
}
// דורש טוקן אקראי של 32+ תווים (לא ניתן ל-brute-force בפועל).
export function adminConfigured(): boolean {
  return reportsConfigured() && Boolean(ADMIN_TOKEN && ADMIN_TOKEN.length >= 32)
}
// השוואת constant-time (timingSafeEqual) - מונעת timing side-channel; נכשל מיד באורך שונה.
export function checkAdmin(token: string | null | undefined): boolean {
  if (!adminConfigured() || !token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(ADMIN_TOKEN!)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function sb(path: string, init?: RequestInit) {
  return fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SERVICE!, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  })
}

export async function addParkReport(data: { name: string; city: string | null; note: string | null; lat: number | null; lng: number | null }): Promise<boolean> {
  if (!reportsConfigured()) return false
  try {
    const res = await sb('park_reports', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ ...data, status: 'pending' }) })
    return res.status === 201
  } catch {
    return false
  }
}

export async function listParkReports(status?: string): Promise<ParkReport[]> {
  if (!reportsConfigured()) return []
  // allowlist - לא נותנים לפרמטר חופשי להיכנס ל-URL של PostgREST (מניעת הזרקה)
  const safe = status && ['pending', 'approved', 'rejected'].includes(status) ? status : null
  try {
    const q = safe ? `park_reports?status=eq.${safe}&order=created_at.desc` : `park_reports?order=created_at.desc`
    const res = await sb(q)
    return res.ok ? await res.json() : []
  } catch {
    return []
  }
}

export async function setParkReportStatus(id: number, status: 'approved' | 'rejected' | 'pending'): Promise<boolean> {
  if (!reportsConfigured()) return false
  try {
    const res = await sb(`park_reports?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status }) })
    return res.status === 204
  } catch {
    return false
  }
}

/** גינות מאושרות לתצוגה על המפה. */
export async function approvedParkReports(): Promise<(ParkReport & { coord: [number, number] })[]> {
  const list = await listParkReports('approved')
  return list
    .map((r) => ({ ...r, coord: reportCoord(r) }))
    .filter((r): r is ParkReport & { coord: [number, number] } => r.coord !== null)
}
