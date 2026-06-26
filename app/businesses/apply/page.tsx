'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { useToast } from '@/components/shared/Toast'
import { BIZ_CATEGORIES } from '@/lib/businesses'

type FormState = {
  businessName: string
  ownerName: string
  phone: string
  email: string
  category: string
  city: string
  description: string
}

const EMPTY: FormState = {
  businessName: '',
  ownerName: '',
  phone: '',
  email: '',
  category: BIZ_CATEGORIES[0],
  city: '',
  description: '',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#7a6a58',
  marginBottom: 8,
}

const errStyle: React.CSSProperties = { color: '#a85a3a', fontSize: 13, margin: '6px 0 0' }

export default function BusinessApplyPage() {
  const toast = useToast()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.businessName.trim()) next.businessName = 'נא להוסיף שם עסק'
    if (!form.ownerName.trim()) next.ownerName = 'נא להוסיף שם בעל/ת העסק'
    if (!form.phone.trim()) next.phone = 'נא להוסיף טלפון ליצירת קשר'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'כתובת אימייל לא תקינה'
    if (!form.city.trim()) next.city = 'נא לציין עיר'
    if (!form.description.trim()) next.description = 'נא לתאר את העסק בקצרה'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) {
      toast('יש למלא את כל שדות החובה לפני השליחה')
      return
    }
    // אין backend - במצב הדגמה הבקשה לא נשלחת ולא נשמרת.
    toast(`תודה, ${form.ownerName}! קיבלנו את בקשת ההצטרפות של ${form.businessName} 🐾`)
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
          background: 'linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.12)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">ספריית העסקים</span>
          <h1 className="page-title grad-text" style={{ marginTop: 8 }}>
            הצטרפו לספריית העסקים
          </h1>
          <p className="page-sub" style={{ margin: '0 auto', maxWidth: 560 }}>
            השאירו פרטים ונחזור אליכם עם כל מה שצריך כדי להופיע בפני אלפי בעלי כלבים בישראל.
          </p>
        </div>
      </section>

      {/* ── דיסקליימר מצב הדגמה ── */}
      <div
        className="alert alert-info"
        role="note"
        style={{ marginBottom: 24, fontWeight: 600 }}
      >
        🔧 במצב הדגמה - הפרטים שתזינו כאן לא יישמרו ולא יישלחו. הטופס מדגים את תהליך
        ההצטרפות בלבד.
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
        {/* שם עסק + שם בעלים */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="biz-name" style={labelStyle}>
              שם העסק *
            </label>
            <input
              id="biz-name"
              className="input"
              type="text"
              value={form.businessName}
              onChange={(e) => update('businessName', e.target.value)}
              placeholder="לדוגמה: מרפאת וטרינר ליבת העיר"
              style={{ width: '100%' }}
              aria-invalid={!!errors.businessName}
              aria-describedby={errors.businessName ? 'err-biz-name' : undefined}
            />
            {errors.businessName && (
              <p id="err-biz-name" style={errStyle}>
                {errors.businessName}
              </p>
            )}
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="owner-name" style={labelStyle}>
              שם בעל/ת העסק *
            </label>
            <input
              id="owner-name"
              className="input"
              type="text"
              value={form.ownerName}
              onChange={(e) => update('ownerName', e.target.value)}
              placeholder="איש הקשר מטעם העסק"
              style={{ width: '100%' }}
              aria-invalid={!!errors.ownerName}
              aria-describedby={errors.ownerName ? 'err-owner-name' : undefined}
            />
            {errors.ownerName && (
              <p id="err-owner-name" style={errStyle}>
                {errors.ownerName}
              </p>
            )}
          </div>
        </div>

        {/* טלפון + אימייל */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="biz-phone" style={labelStyle}>
              טלפון *
            </label>
            <input
              id="biz-phone"
              className="input"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="050-000-0000"
              style={{ width: '100%' }}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'err-phone' : undefined}
            />
            {errors.phone && (
              <p id="err-phone" style={errStyle}>
                {errors.phone}
              </p>
            )}
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="biz-email" style={labelStyle}>
              אימייל
            </label>
            <input
              id="biz-email"
              className="input"
              type="email"
              inputMode="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="name@business.co.il"
              style={{ width: '100%', direction: 'ltr', textAlign: 'right' }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-email' : undefined}
            />
            {errors.email && (
              <p id="err-email" style={errStyle}>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* קטגוריה + עיר */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="biz-category" style={labelStyle}>
              קטגוריה *
            </label>
            <select
              id="biz-category"
              className="input"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            >
              {BIZ_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="biz-city" style={labelStyle}>
              עיר *
            </label>
            <input
              id="biz-city"
              className="input"
              type="text"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="לדוגמה: חיפה"
              style={{ width: '100%' }}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'err-city' : undefined}
            />
            {errors.city && (
              <p id="err-city" style={errStyle}>
                {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* תיאור */}
        <div>
          <label htmlFor="biz-description" style={labelStyle}>
            תיאור העסק *
          </label>
          <textarea
            id="biz-description"
            className="input"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="ספרו על העסק - אילו שירותים אתם מציעים, מה מייחד אתכם ולמי אתם מתאימים."
            rows={5}
            style={{ width: '100%' }}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'err-description' : undefined}
          />
          {errors.description && (
            <p id="err-description" style={errStyle}>
              {errors.description}
            </p>
          )}
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
            שליחת בקשת הצטרפות
          </button>
          <Link href="/businesses" className="btn btn-ghost" style={{ minHeight: 44 }}>
            חזרה לספרייה
          </Link>
        </div>
      </form>
    </main>
  )
}
