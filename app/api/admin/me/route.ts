import { NextResponse } from 'next/server'
import { isAdminAuthed } from '@/lib/adminSession'

export const dynamic = 'force-dynamic'

// בדיקת מצב התחברות לאדמין - מאפשר ל-UI לדעת אם עדיין מחובר בטעינה מחדש,
// בלי לחשוף שום סוד (העוגייה httpOnly, ה-UI רק מקבל true/false).
export async function GET() {
  return NextResponse.json({ ok: isAdminAuthed() })
}
