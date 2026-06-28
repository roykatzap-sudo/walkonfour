'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { useToast } from '@/components/shared/Toast'
import { MARKET_CATEGORIES, type ItemCondition } from '@/lib/market'

const CONDITIONS: ItemCondition[] = ['חדש באריזה', 'כמו חדש', 'במצב טוב', 'משומש']

type FormState = {
  title: string
  category: string
  condition: ItemCondition
  price: string
  city: string
  seller: string
  description: string
}

const EMPTY: FormState = {
  title: '',
  category: MARKET_CATEGORIES[0],
  condition: 'כמו חדש',
  price: '',
  city: '',
  seller: '',
  description: '',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#7a6a58',
  marginBottom: 8,
}

export default function PostAdPage() {
  const toast = useToast()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'נא להוסיף כותרת למודעה'
    if (!form.city.trim()) next.city = 'נא לציין עיר'
    if (!form.seller.trim()) next.seller = 'נא להוסיף שם איש קשר'
    if (!form.description.trim()) next.description = 'נא להוסיף תיאור קצר'
    if (form.price && Number(form.price) < 0) next.price = 'מחיר לא יכול להיות שלילי'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) {
      toast('יש למלא את כל שדות החובה לפני הפרסום')
      return
    }
    // אין backend - במצב הדגמה המודעה לא נשמרת.
    toast(`המודעה "${form.title}" מוכנה! במצב הדגמה היא לא נשמרת 🐾`)
    setForm(EMPTY)
  }

  return (
    <main className="page">
      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '48px 28px',
          marginBottom: 24,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f6ecd8 0%, #fbf7ef 100%)',
          border: '1px solid rgba(232,200,135,.18)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">יד שנייה</span>
          <h1 className="page-title grad-text" style={{ marginTop: 8 }}>
            פרסום מודעה חדשה
          </h1>
          <p className="page-sub" style={{ margin: '0 auto', maxWidth: 540 }}>
            מלאו את הפרטים ותנו לציוד שלכם בית חדש. הפרסום חינמי לחלוטין.
          </p>
        </div>
      </section>

      {/* ── דיסקליימר מצב הדגמה (בולט, בראש הטופס) ── */}
      <div
        className="alert alert-info"
        role="note"
        style={{ marginBottom: 24, fontWeight: 600 }}
      >
        🔧 במצב הדגמה - הנתונים שתזינו כאן לא יישמרו ולא יפורסמו. הטופס מדגים את חוויית
        הפרסום בלבד.
      </div>

      {/* ── הטופס ── */}
      <form
        onSubmit={onSubmit}
        noValidate
        className="glass"
        style={{
          padding: 'var(--card-padding)',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {/* כותרת */}
        <div>
          <label htmlFor="ad-title" style={labelStyle}>
            כותרת המודעה *
          </label>
          <input
            id="ad-title"
            className="input"
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="לדוגמה: כלוב גדול במצב מצוין"
            style={{ width: '100%' }}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'err-title' : undefined}
          />
          {errors.title && (
            <p id="err-title" style={{ color: '#a85a3a', fontSize: 13, margin: '6px 0 0' }}>
              {errors.title}
            </p>
          )}
        </div>

        {/* קטגוריה + מצב */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="ad-category" style={labelStyle}>
              קטגוריה *
            </label>
            <select
              id="ad-category"
              className="input"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            >
              {MARKET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="ad-condition" style={labelStyle}>
              מצב הפריט *
            </label>
            <select
              id="ad-condition"
              className="input"
              value={form.condition}
              onChange={(e) => update('condition', e.target.value as ItemCondition)}
              style={{ width: '100%', cursor: 'pointer' }}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* מחיר + עיר */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="ad-price" style={labelStyle}>
              מחיר בשקלים (0 = חינם)
            </label>
            <input
              id="ad-price"
              className="input"
              type="number"
              min={0}
              inputMode="numeric"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="0"
              style={{ width: '100%' }}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? 'err-price' : undefined}
            />
            {errors.price && (
              <p id="err-price" style={{ color: '#a85a3a', fontSize: 13, margin: '6px 0 0' }}>
                {errors.price}
              </p>
            )}
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="ad-city" style={labelStyle}>
              עיר *
            </label>
            <input
              id="ad-city"
              className="input"
              type="text"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="לדוגמה: תל אביב-יפו"
              style={{ width: '100%' }}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'err-city' : undefined}
            />
            {errors.city && (
              <p id="err-city" style={{ color: '#a85a3a', fontSize: 13, margin: '6px 0 0' }}>
                {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* איש קשר */}
        <div>
          <label htmlFor="ad-seller" style={labelStyle}>
            שם איש הקשר *
          </label>
          <input
            id="ad-seller"
            className="input"
            type="text"
            value={form.seller}
            onChange={(e) => update('seller', e.target.value)}
            placeholder="השם שיוצג למתעניינים"
            style={{ width: '100%' }}
            aria-invalid={!!errors.seller}
            aria-describedby={errors.seller ? 'err-seller' : undefined}
          />
          {errors.seller && (
            <p id="err-seller" style={{ color: '#a85a3a', fontSize: 13, margin: '6px 0 0' }}>
              {errors.seller}
            </p>
          )}
        </div>

        {/* תיאור */}
        <div>
          <label htmlFor="ad-description" style={labelStyle}>
            תיאור הפריט *
          </label>
          <textarea
            id="ad-description"
            className="input"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="ספרו על הפריט - מצב, מידות, סיבת המכירה וכל מה שחשוב לדעת."
            rows={5}
            style={{ width: '100%' }}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'err-description' : undefined}
          />
          {errors.description && (
            <p id="err-description" style={{ color: '#a85a3a', fontSize: 13, margin: '6px 0 0' }}>
              {errors.description}
            </p>
          )}
        </div>

        {/* העלאת תמונה (מושבת בהדגמה) */}
        <div>
          <label htmlFor="ad-photo" style={labelStyle}>
            תמונת הפריט
          </label>
          <input
            id="ad-photo"
            className="input"
            type="file"
            accept="image/*"
            disabled
            aria-describedby="ad-photo-hint"
            style={{ width: '100%', cursor: 'not-allowed', opacity: 0.7 }}
          />
          <p id="ad-photo-hint" className="muted" style={{ fontSize: 13, margin: '6px 0 0' }}>
            העלאת תמונה תיפתח בגרסה המלאה.
          </p>
        </div>

        {/* פעולות */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            paddingTop: 8,
            borderTop: '1px solid #f0ede4',
            marginTop: 4,
          }}
        >
          <button type="submit" className="btn btn-primary">
            פרסום המודעה
          </button>
          <Link href="/market" className="btn btn-ghost" style={{ minHeight: 44 }}>
            חזרה לשוק
          </Link>
        </div>
        <p style={{ marginTop: 14, fontSize: 12.5, color: '#7a6c58', lineHeight: 1.6, width: '100%' }}>
          בפרסום המודעה אתם מאשרים שהפריט באחריותכם ומסכימים{' '}
          <Link href="/terms" className="link">לתקנון</Link>. קהילה על ארבע היא לוח מודעות ואינה צד לעסקה.
        </p>
      </form>
    </main>
  )
}
