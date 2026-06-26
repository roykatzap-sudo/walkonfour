'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * מאמת שיעד ההפניה הוא נתיב פנימי בטוח בלבד.
 * חוסם open-redirect (//), כתובות מלאות (://) ו-handlers כמו javascript:/data:.
 */
function isValidRedirectPath(path: string): boolean {
  if (!path) return false
  if (!path.startsWith('/') || path.startsWith('//')) return false
  if (path.includes('://') || path.includes('javascript:') || path.includes('data:')) return false
  try {
    const url = new URL(path, 'http://localhost')
    return url.pathname === path
  } catch {
    return false
  }
}

/**
 * הרשמה ממוקדת-פרטיות: אוספים את המינימום ההכרחי בלבד -
 * שם תצוגה (כינוי), אימייל וסיסמה. בלי שם מלא, עיר, ת"ז, כתובת או פרטי הכלב;
 * אלה מתמלאים בהדרגה ובאופן אופציונלי בהמשך, רק כשצריך.
 */
export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'
  const refCode = (params.get('ref') || '').trim().toUpperCase()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setOk('')

    if (mode === 'register' && !agreed) {
      setErr('יש לאשר את התקנון ומדיניות הפרטיות כדי להמשיך.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName.trim(),
              ...(refCode ? { referred_by: refCode } : {}),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        if (refCode) {
          try { window.localStorage.setItem('kv_referred_by', refCode) } catch {}
        }
        setOk('נרשמתם בהצלחה. שלחנו לכם אימייל לאישור החשבון - כדאי לבדוק גם בתיבת הספאם.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(isValidRedirectPath(next) ? next : '/')
        router.refresh()
      }
    } catch (e: any) {
      setErr(e?.message || 'משהו השתבש. בדקו שההגדרות תקינות ונסו שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      {err && <div className="alert alert-error" role="alert">{err}</div>}
      {ok && <div className="alert alert-ok" role="status">{ok}</div>}

      {mode === 'register' && refCode && (
        <div className="alert alert-info" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>🎁</span>
          <span>הצטרפתם בהזמנה אישית! בסיום ההרשמה חבר מהקהילה יקבל קרדיט, ואתם נכנסים ישר פנימה.</span>
        </div>
      )}

      <form onSubmit={submit}>
        {mode === 'register' && (
          <div className="field">
            <label htmlFor="auth-display">
              שם תצוגה <span id="display-desc" className="muted">(כינוי או שם פרטי - זה מה שאחרים יראו)</span>
            </label>
            <input
              id="auth-display"
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              maxLength={30}
              placeholder="למשל: דנה, או DogLover22"
              aria-describedby="display-desc"
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="auth-email">אימייל</label>
          <input id="auth-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" dir="ltr" />
        </div>

        <div className="field">
          <label htmlFor="auth-password">סיסמה</label>
          <input id="auth-password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="8 תווים לפחות" dir="ltr" />
        </div>

        {mode === 'register' && (
          <label htmlFor="auth-agree" className="auth-agree">
            <input id="auth-agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              אני בן/בת 18 ומעלה ומסכים/ה ל<Link href="/terms" className="link">תקנון</Link> ול<Link href="/privacy" className="link">מדיניות הפרטיות</Link>.
            </span>
          </label>
        )}

        <button className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'רק רגע...' : mode === 'register' ? 'הצטרפו חינם 🐾' : 'התחברות'}
        </button>
      </form>

      {mode === 'register' && (
        <div className="auth-privacy" role="note">
          <strong>🔒 פרטיות קודם:</strong> אנחנו לא מבקשים שם מלא, ת"ז, כתובת, תאריך לידה או טלפון.
          המייל שלכם פרטי ולעולם לא מוצג. את פרטי הכלב והעיר אפשר להוסיף בהמשך - רק אם תרצו.
        </div>
      )}

      <p className="muted" style={{ textAlign: 'center', marginTop: 20 }}>
        {mode === 'register' ? (
          <>כבר יש לכם חשבון? <Link href="/auth/login" className="link">התחברות</Link></>
        ) : (
          <>עדיין בלי חשבון? <Link href="/auth/register" className="link">הצטרפו חינם</Link></>
        )}
      </p>

      <style jsx>{`
        .auth-agree {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin: 14px 0 4px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text);
          cursor: pointer;
        }
        .auth-agree input {
          margin-top: 3px;
          width: 18px;
          height: 18px;
          flex: none;
          accent-color: var(--brand);
          cursor: pointer;
        }
        .auth-privacy {
          margin-top: 18px;
          background: rgba(201, 154, 91, 0.08);
          border: 1px solid var(--brand-light, #e8c887);
          border-radius: 14px;
          padding: 13px 15px;
          font-size: 13px;
          line-height: 1.65;
          color: #6b5d4c;
        }
        .auth-privacy strong { color: var(--ink); }
      `}</style>
    </div>
  )
}
