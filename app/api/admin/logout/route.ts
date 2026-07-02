import { NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/adminSession'

export const dynamic = 'force-dynamic'

// יציאה אמיתית: מוחק את עוגיית האדמין בשרת (לא רק ניקוי מקומי בדפדפן).
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
