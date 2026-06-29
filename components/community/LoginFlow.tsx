'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'email' | 'code' | 'consent'

export function LoginFlow() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'verifying' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function requestCode(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    setErrMsg('')
    setState('sending')
    try {
      const res = await fetch('/api/community/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.status === 429) {
        setErrMsg('יותר מדי בקשות. נסו שוב בעוד כמה דקות.')
        setState('error')
        return
      }
      if (data.ok) {
        setStep('code')
        setState('idle')
      } else {
        setErrMsg('משהו השתבש. בדקו את המייל ונסו שוב.')
        setState('error')
      }
    } catch {
      setErrMsg('שגיאת רשת. נסו שוב.')
      setState('error')
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'verifying') return
    setErrMsg('')
    setState('verifying')
    try {
      const res = await fetch('/api/community/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (!data.ok) {
        if (data.error === 'too_many_attempts') {
          setErrMsg('יותר מדי ניסיונות. בקשו קוד חדש.')
        } else if (data.error === 'expired') {
          setErrMsg('הקוד פג תוקף. בקשו קוד חדש.')
        } else {
          setErrMsg('קוד שגוי. בדקו ונסו שוב.')
        }
        setState('error')
        return
      }
      // הצלחה - אם משתמש חדש → onboarding, אחרת → /community
      if (data.isNew) {
        router.push('/community/onboarding')
      } else {
        router.push('/community')
      }
    } catch {
      setErrMsg('שגיאת רשת. נסו שוב.')
      setState('error')
    }
  }

  if (step === 'email') {
    return (
      <form onSubmit={requestCode} style={{ display: 'grid', gap: 14 }}>
        <div>
          <label htmlFor="lg-email" style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
            המייל שאיתו נרשמתם לרשימת ההמתנה
          </label>
          <input
            id="lg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
            autoComplete="email"
            style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
          />
          <p style={{ fontSize: 13, color: '#8a7c66', marginTop: 6, lineHeight: 1.55 }}>
            המייל נדרש לאימות שאתם ברשימת ההמתנה. הוא נשלח דרך Resend (ספק שליחת מיילים) ומאוחסן ב-Supabase (ספק בסיס נתונים). לא יועבר לצד שלישי לצרכי שיווק.
          </p>
        </div>
        <button type="submit" className="btn btn-primary" disabled={state === 'sending'} style={{ fontSize: 16, padding: '13px' }}>
          {state === 'sending' ? 'שולח קוד...' : 'שלחו לי קוד למייל'}
        </button>
        {errMsg && <div role="alert" style={{ fontSize: 14, color: '#a23c2e', textAlign: 'center' }}>{errMsg}</div>}
      </form>
    )
  }

  // step === 'code'
  return (
    <form onSubmit={verifyCode} style={{ display: 'grid', gap: 14 }}>
      <div>
        <div style={{ fontSize: 14.5, color: '#5b4d3c', marginBottom: 10, lineHeight: 1.55 }}>
          שלחנו קוד 6 ספרות ל-<strong>{email}</strong>. בדקו את תיבת המייל (וגם ספאם).
        </div>
        <label htmlFor="lg-code" style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
          הקוד שקיבלתם
        </label>
        <input
          id="lg-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="------"
          required
          autoFocus
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          autoComplete="one-time-code"
          style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 26, letterSpacing: '.4em', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700 }}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={state === 'verifying' || code.length !== 6} style={{ fontSize: 16, padding: '13px' }}>
        {state === 'verifying' ? 'בודק...' : 'כניסה'}
      </button>
      <button type="button" onClick={() => { setStep('email'); setCode(''); setErrMsg('') }} style={{ background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
        שינוי כתובת מייל
      </button>
      {errMsg && <div role="alert" style={{ fontSize: 14, color: '#a23c2e', textAlign: 'center' }}>{errMsg}</div>}
    </form>
  )
}
