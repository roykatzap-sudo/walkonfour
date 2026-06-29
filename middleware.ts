import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { readSession, COMMUNITY_COOKIE } from '@/lib/community/session'

/**
 * שער השקה: בשלב הראשון רק תוכן וכלים פתוחים. כל החלקים האינטראקטיביים
 * חסומים ומפנים ל"/soon" - חוץ מ-/community שזו הקהילה הסגורה בהקמה
 * (דורש OTP login + הסכמה).
 */
const GATED_PREFIXES = [
  '/auth', '/profile', '/saved', '/start',
  '/communities',
  '/forum', '/events', '/groups', '/wall', '/lost-found', '/leaderboard',
  '/market', '/petsitting', '/adopt', '/businesses', '/digest',
  '/health-tracker', '/premium',
]

/** /community/* פתוח כפלטפורמה, אבל דורש session - חוץ מ-login/onboarding */
const COMMUNITY_PUBLIC = ['/community/login', '/community/onboarding']

function isGated(pathname: string): boolean {
  return GATED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function isCommunityProtected(pathname: string): boolean {
  if (!pathname.startsWith('/community')) return false
  return !COMMUNITY_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isGated(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/soon'
    url.search = ''
    return NextResponse.redirect(url)
  }
  if (isCommunityProtected(pathname)) {
    const token = request.cookies.get(COMMUNITY_COOKIE)?.value
    const session = readSession(token)
    if (!session || session.userId === -1) {
      const url = request.nextUrl.clone()
      url.pathname = '/community/login'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
