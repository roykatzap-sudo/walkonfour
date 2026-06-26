import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * מחזיר נתיב פנימי בטוח בלבד. חוסם open-redirect:
 * נתיבים מוחלטים חיצוניים, protocol-relative (//evil.com), ותווי בקרה.
 */
function safeNext(next: string | null): string {
  if (!next) return '/'
  // חייב להיות נתיב יחסי שמתחיל ב-/ אבל לא // (protocol-relative)
  if (!next.startsWith('/') || next.startsWith('//')) return '/'
  // חסימת backslash שדפדפנים מתרגמים ל-/ ‏(/\evil.com)
  if (next.includes('\\')) return '/'
  // חסימת תווי בקרה / הזרקת שורה
  if (/[\n\r\0]/.test(next)) return '/'
  return next
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
