import { NextResponse } from 'next/server'
import { addGroupClick, cleanSrc, looksLikeBot } from '@/lib/groupClicks'
import { FB_GROUP_URL } from '@/lib/social'

export const dynamic = 'force-dynamic'

/**
 * קישור קצר לקבוצת הפייסבוק לשימוש מחוץ לאתר (סרטונים, מודעות מודפסות, פוסטים):
 * walkonfour.org/go/group?src=poster
 * סופר את ההקלקה לפי src ומפנה לקבוצה. בתוך האתר משתמשים ב-GroupLink
 * (קישור ישיר + ספירה ברקע), כדי שבנייד הקישור ייפתח באפליקציה.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  if (!looksLikeBot(req.headers.get('user-agent'))) {
    const src = `ext-${cleanSrc(url.searchParams.get('src'))}`.slice(0, 40)
    // לא מעכבים את המבקר יותר משנייה וחצי גם אם מסד הנתונים איטי
    await Promise.race([addGroupClick(src, null), new Promise((r) => setTimeout(r, 1500))])
  }
  return NextResponse.redirect(FB_GROUP_URL, { status: 302, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } })
}
