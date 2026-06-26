import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * שער השקה: בשלב הראשון רק תוכן וכלים פתוחים. כל החלקים האינטראקטיביים
 * והקהילתיים חסומים ומפנים ל"/soon" - עד שנהיה מוכנים משפטית ותפעולית
 * לפתוח קהילה (הרשמה, תוכן משתמשים, החזקת נתונים).
 * להסרת השער: למחוק את GATED_PREFIXES או לרוקן אותו.
 */
const GATED_PREFIXES = [
  '/auth', '/profile', '/saved', '/start',
  '/communities', '/community',
  '/forum', '/events', '/groups', '/wall', '/lost-found', '/leaderboard',
  '/market', '/petsitting', '/adopt', '/businesses', '/digest',
  '/health-tracker', '/premium',
]

function isGated(pathname: string): boolean {
  return GATED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isGated(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/soon'
    url.search = ''
    return NextResponse.redirect(url)
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
