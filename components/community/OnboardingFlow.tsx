'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function OnboardingFlow() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [over18, setOver18] = useState(false)
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    if (!nickname.trim() || !over18 || !consent) return
    setErrMsg('')
    setState('sending')
    try {
      const res = await fetch('/api/community/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), over_18: over18, consent }),
      })
      const data = await res.json()
      if (!data.ok) {
        if (data.error === 'session_expired') {
          setErrMsg('פג תוקף, אנא היכנסו שוב')
          setTimeout(() => router.push('/community/login'), 1500)
          return
        }
        setErrMsg('שגיאה בשמירה. נסו שוב.')
        setState('error')
        return
      }
      router.push('/community')
    } catch {
      setErrMsg('שגיאת רשת. נסו שוב.')
      setState('error')
    }
  }

  const canSubmit = nickname.trim().length >= 2 && over18 && consent && state !== 'sending'

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 18 }}>
      <div>
        <label htmlFor="nick" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
          איך לקרוא לכם בקהילה?
        </label>
        <input
          id="nick"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="שם פרטי או כינוי - מה שנוח לכם"
          required
          autoFocus
          maxLength={40}
          minLength={2}
          style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
        />
        <p style={{ fontSize: 13, color: '#8a7c66', marginTop: 6, lineHeight: 1.55 }}>
          השם הזה יוצג ליד הודעות שלכם בצ'אט וליד תיאומי הגעה. אינך חייב למסור שם אמיתי - אפשר כינוי. ניתן לערוך אחר כך.
        </p>
      </div>

      <div style={{ background: '#fbf7ef', border: '1px solid rgba(201,154,91,.22)', borderRadius: 16, padding: '18px 18px' }}>
        <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>אישור והסכמה</div>

        {/* 18+ */}
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.6, cursor: 'pointer', marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={over18}
            onChange={(e) => setOver18(e.target.checked)}
            style={{ marginTop: 3, width: 20, height: 20, flexShrink: 0, accentColor: 'var(--brand)', cursor: 'pointer' }}
          />
          <span>
            <strong>אני בן/בת 18 ומעלה.</strong> הקהילה מיועדת לבוגרים בלבד.
          </span>
        </label>

        {/* תקנון + פרטיות */}
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{ marginTop: 3, width: 20, height: 20, flexShrink: 0, accentColor: 'var(--brand)', cursor: 'pointer' }}
          />
          <span>
            <strong>אני מסכים לתקנון ולמדיניות הפרטיות,</strong> ומבין שהשם, פרטי הכלב, תיאומי ההגעה לגינות והודעות בצ'אט גלויים לחברים אחרים בקהילה הסגורה. הפרטים נמחקים אוטומטית (תיאומים והודעות אחרי 24 שעות). מסירת הפרטים אינה חובה וניתן למחוק את החשבון בכל עת.{' '}
            <a href="/terms" target="_blank" rel="noopener" style={{ color: 'var(--brand-dark)', fontWeight: 700 }}>תקנון</a>
            {' · '}
            <a href="/privacy" target="_blank" rel="noopener" style={{ color: 'var(--brand-dark)', fontWeight: 700 }}>מדיניות פרטיות</a>
          </span>
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={!canSubmit} style={{ fontSize: 16, padding: '14px', opacity: canSubmit ? 1 : 0.5 }}>
        {state === 'sending' ? 'יוצר חשבון...' : 'כניסה לקהילה 🐾'}
      </button>
      {errMsg && <div role="alert" style={{ fontSize: 14, color: '#a23c2e', textAlign: 'center' }}>{errMsg}</div>}
    </form>
  )
}
