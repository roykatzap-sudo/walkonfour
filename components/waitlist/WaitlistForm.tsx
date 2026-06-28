'use client'

import { useState } from 'react'

const CITIES = [
  'בכל הארץ (כללי)',
  'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה',
  'באר שבע', 'חולון', 'רמת גן', 'אשקלון', 'רחובות', 'הרצליה', 'כפר סבא',
  'מודיעין', 'רעננה', 'הוד השרון', 'אחר',
]

// מתחת לסף הזה לא מציגים מספר - מספר קטן פוגע בהמרה (אנטי הוכחה חברתית).
const COUNT_DISPLAY_MIN = 25

export function WaitlistForm({ initialCount }: { initialCount: number }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'dup' | 'error' | 'badEmail'>('idle')
  const [count, setCount] = useState(initialCount)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, city }),
      })
      const data = await res.json()
      if (data.ok) {
        setCount(data.count ?? count)
        setState(data.dup ? 'dup' : 'done')
      } else if (data.error === 'email') {
        setState('badEmail')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'done' || state === 'dup') {
    return (
      <div style={{ background: 'linear-gradient(135deg, #fffaf0, #fdf6e9)', border: '2px solid var(--brand)', borderRadius: 18, padding: '24px 22px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 6 }}>🐾</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)' }}>
          {state === 'dup' ? 'אתם כבר ברשימה!' : 'נרשמתם לרשימה!'}
        </div>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>
          נעדכן אתכם במייל ברגע שהקהילה נפתחת. בינתיים - כל התוכן והכלים פתוחים וחינמיים.
        </p>
        {count >= COUNT_DISPLAY_MIN ? (
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 800, color: 'var(--brand)' }}>
            אתם בין {count.toLocaleString('he-IL')} שכבר ברשימה
          </div>
        ) : (
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 800, color: 'var(--brand)' }}>
            אתם מבעלי הכלבים הראשונים שנכנסים 🐾
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם פרטי או כינוי (לא חובה)"
        aria-label="שם פרטי או כינוי"
        maxLength={40}
        autoComplete="given-name"
        style={{ padding: '14px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, width: '100%' }}
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="האימייל שלכם"
        aria-label="כתובת אימייל"
        autoComplete="email"
        style={{ padding: '14px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, width: '100%' }}
      />
      <div style={{ display: 'grid', gap: 5 }}>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="באיזו עיר תרצו שנפתח (לא חובה)"
          style={{ padding: '14px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, width: '100%', background: '#fff', color: city ? 'var(--ink)' : 'var(--text-muted)' }}
        >
          <option value="">באיזו עיר תרצו שנפתח? (לא חובה)</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <span style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          נפתח קודם בערים עם הכי הרבה ביקוש - סמנו איזו עיר מעניינת אתכם.
        </span>
      </div>
      <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 800, color: 'var(--brand-dark)' }}>
        ✓ ההצטרפות חינמית לחלוטין, לתמיד
      </div>
      <button type="submit" className="btn btn-primary" disabled={state === 'sending'} style={{ fontSize: 16, padding: '14px' }}>
        {state === 'sending' ? 'רושם...' : 'הצטרפו בחינם לרשימת ההמתנה'}
      </button>
      {state === 'badEmail' && (
        <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
          כתובת האימייל לא נראית תקינה. בדקו ונסו שוב.
        </div>
      )}
      {state === 'error' && (
        <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
          משהו השתבש. נסו שוב בעוד רגע.
        </div>
      )}
      <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.55 }}>
        רק שם פרטי ומייל. בלי דיוור שיווקי ובלי שיתוף עם אף אחד - נשלח עדכון אחד כשנפתחים בעיר שבחרתם.{' '}
        <a href="/privacy" style={{ color: 'var(--brand-dark)', fontWeight: 700 }}>מדיניות הפרטיות</a>
      </p>
    </form>
  )
}
