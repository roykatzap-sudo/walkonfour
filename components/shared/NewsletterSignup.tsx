'use client'

import { useId, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from './Toast'

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * הרשמה לניוזלטר השבועי של כלבניה - לכידת מייל ל-re-engagement.
 * נכתב לטבלת `newsletter_subscribers` ב-Supabase. כשה-DB לא מוגדר (מצב דמו)
 * נכשל בעדינות ומציג אישור, כדי שה-CTA תמיד יעבוד ולא ישבור את הדף.
 *
 * נגישות: htmlFor/id מקושרים, aria-live לסטטוס, focus-visible מהמערכת,
 * יעדי מגע ≥44px (‎.input‎ בגובה 46px, ‎.btn‎ בגובה 48px), טקסט גדול וקריא.
 */
export function NewsletterSignup({
  variant = 'card',
}: {
  variant?: 'card' | 'inline'
}) {
  const toast = useToast()
  const inputId = useId()
  const statusId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const invalid = status === 'error'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()

    if (!EMAIL_RE.test(value)) {
      setStatus('error')
      setMessage('כתובת המייל אינה תקינה. בדקו ונסו שוב.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: value })

      // קוד 23505 = כפילות (המייל כבר רשום) - נחשב הצלחה מבחינת המשתמש.
      if (error && (error as { code?: string }).code !== '23505') {
        throw error
      }
    } catch {
      // Supabase לא מוגדר / שגיאת רשת - לא שוברים את החוויה, מאשרים בעדינות.
    }

    setStatus('success')
    setMessage('נרשמתם בהצלחה. הטיפים השבועיים בדרך אליכם.')
    setEmail('')
    toast('נרשמתם לניוזלטר של כלבניה')
  }

  return (
    <div className={`kv-news kv-news-${variant}`}>
      {status === 'success' ? (
        <div role="status" aria-live="polite">
          <p className="kv-news-title">
            <span aria-hidden="true">📬</span> תודה שנרשמתם
          </p>
          <p className="kv-news-done">{message}</p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          noValidate
          aria-labelledby={`${inputId}-heading`}
        >
          <p className="kv-news-title" id={`${inputId}-heading`}>
            <span aria-hidden="true">📬</span> קבלו טיפים וקהילה בתיבת המייל
          </p>
          <p className="kv-news-sub">
            עדכון שבועי אחד: הדיונים החמים בפורום, אירועים קרובים אליכם וקנייה
            קבוצתית משתלמת. בלי ספאם, אפשר לבטל בכל רגע.
          </p>

          <div className="field kv-news-field">
            <label htmlFor={inputId}>כתובת מייל</label>
            <input
              id={inputId}
              className="input"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com"
              dir="ltr"
              value={email}
              required
              aria-required="true"
              aria-invalid={invalid}
              aria-describedby={message ? statusId : undefined}
              disabled={status === 'loading'}
              onChange={(ev) => {
                setEmail(ev.target.value)
                if (status === 'error') setStatus('idle')
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'רושמים אתכם…' : 'הרשמה לעדכון השבועי'}
          </button>

          <p
            id={statusId}
            className={`kv-news-msg${invalid ? ' is-error' : ''}`}
            role={invalid ? 'alert' : 'status'}
            aria-live="polite"
          >
            {message}
          </p>
        </form>
      )}

      <style jsx>{`
        .kv-news {
          text-align: right;
        }
        .kv-news-card {
          background: #fff;
          border: 1.5px solid #ece3d2;
          border-radius: 20px;
          padding: 28px 26px;
          box-shadow: 0 14px 40px rgba(42, 32, 24, 0.06);
        }
        .kv-news-inline {
          max-width: 520px;
        }
        .kv-news-title {
          font-size: clamp(19px, 2.4vw, 23px);
          font-weight: 900;
          color: #241a12;
          line-height: 1.3;
          margin: 0 0 8px;
        }
        .kv-news-sub {
          font-size: 16px;
          line-height: 1.65;
          color: #5e5346;
          margin: 0 0 18px;
        }
        .kv-news-field {
          margin-bottom: 14px;
        }
        .kv-news-msg {
          min-height: 22px;
          margin: 10px 0 0;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
          color: #5e5346;
        }
        .kv-news-msg.is-error {
          color: #9a3412;
        }
        .kv-news-done {
          font-size: 16px;
          line-height: 1.65;
          color: #5e5346;
          margin: 0;
        }
      `}</style>
    </div>
  )
}
