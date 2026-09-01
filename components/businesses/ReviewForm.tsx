'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LIMITS } from '@/lib/directory/types'

type FormStatus = 'idle' | 'sending' | 'done' | 'dup' | 'rate' | 'error'

export function ReviewForm({ businessSlug }: { businessSlug: string }) {
  const router = useRouter()
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [text, setText] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    if (!authorName.trim() || rating < 1) return

    setStatus('sending')
    try {
      const res = await fetch('/api/directory/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_slug: businessSlug,
          rating,
          author_name: authorName.trim(),
          text: text.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('done')
        setAuthorName('')
        setRating(0)
        setText('')
        router.refresh()
      } else if (data.error === 'dup') {
        setStatus('dup')
      } else if (data.error === 'rate') {
        setStatus('rate')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div
        role="status"
        style={{
          textAlign: 'center',
          padding: '24px 16px',
          background: '#f0fdf4',
          borderRadius: 14,
          border: '1px solid #bbf7d0',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: '#15803d', marginBottom: 6 }}>
          תודה! הביקורת פורסמה
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* שם */}
      <div>
        <label
          htmlFor="review-author"
          style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#3a3128', marginBottom: 6 }}
        >
          שם *
        </label>
        <input
          id="review-author"
          className="input"
          type="text"
          required
          maxLength={LIMITS.authorName}
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="איך קוראים לכם"
          style={{ width: '100%' }}
        />
      </div>

      {/* דירוג כוכבים */}
      <div>
        <span
          id="rating-label"
          style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#3a3128', marginBottom: 8 }}
        >
          דירוג *
        </span>
        <div
          role="radiogroup"
          aria-labelledby="rating-label"
          style={{ display: 'flex', gap: 4 }}
        >
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={rating === v}
              aria-label={`${v} מתוך 5 כוכבים`}
              onClick={() => setRating(v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 28,
                lineHeight: 1,
                padding: '4px 2px',
                minWidth: 36,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: v <= rating ? 'var(--brand-light)' : '#e2ddd2',
                transition: 'color .15s ease, transform .15s ease',
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* טקסט */}
      <div>
        <label
          htmlFor="review-text"
          style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#3a3128', marginBottom: 6 }}
        >
          ביקורת (לא חובה)
        </label>
        <textarea
          id="review-text"
          className="input"
          maxLength={LIMITS.reviewText}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ספרו על החוויה שלכם"
          rows={4}
          style={{ width: '100%' }}
        />
        <div style={{ fontSize: 12, color: 'var(--text-soft)', textAlign: 'start', marginTop: 4 }}>
          {text.length}/{LIMITS.reviewText}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === 'sending' || !authorName.trim() || rating < 1}
      >
        {status === 'sending' ? 'שולח...' : 'שליחת ביקורת'}
      </button>

      {status === 'dup' && (
        <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
          כבר פרסמת ביקורת על העסק הזה ב-24 השעות האחרונות
        </div>
      )}
      {status === 'rate' && (
        <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
          יותר מדי בקשות, נסו שוב עוד רגע
        </div>
      )}
      {status === 'error' && (
        <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
          משהו השתבש. נסו שוב בעוד רגע.
        </div>
      )}
    </form>
  )
}
