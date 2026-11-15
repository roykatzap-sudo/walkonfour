import { NextResponse } from 'next/server'
import { communities } from '@/lib/communities'

/* טמפרטורה לפי שעה, להיום, לעיר אחת. הנתונים מ-Open-Meteo (CC BY 4.0).
   הבקשה יוצאת מהשרת ונשמרת במטמון לחצי שעה, כך שהמבקר לא פונה לשירות חיצוני
   ולא חושף לו את הכתובת שלו. מחזירים נתונים בלבד, בלי המלצות ובלי ספים. */

export const revalidate = 1800

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const c = communities.find((x) => x.slug === params.slug)
  if (!c) return NextResponse.json({ ok: false, error: 'city' }, { status: 404 })
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}` +
    '&hourly=temperature_2m&timezone=Asia%2FJerusalem&forecast_days=1'
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) return NextResponse.json({ ok: false, error: 'upstream' }, { status: 502 })
    const data = await res.json()
    const times: string[] = data?.hourly?.time ?? []
    const temps: number[] = data?.hourly?.temperature_2m ?? []
    if (times.length < 24 || temps.length < 24) return NextResponse.json({ ok: false, error: 'shape' }, { status: 502 })
    const hours = times.slice(0, 24).map((t, i) => ({ h: Number(t.slice(11, 13)), t: Math.round(temps[i]!) }))
    return NextResponse.json(
      { ok: true, date: times[0]!.slice(0, 10), hours },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } },
    )
  } catch {
    return NextResponse.json({ ok: false, error: 'network' }, { status: 502 })
  }
}
