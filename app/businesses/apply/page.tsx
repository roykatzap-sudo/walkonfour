'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { BIZ_CATEGORIES } from '@/lib/businesses'
import { LIMITS } from '@/lib/directory/types'

type FormStatus = 'idle' | 'sending' | 'done' | 'pending' | 'rate' | 'error' | 'invalid' | 'too_large'

type FormState = {
  name: string
  category: string
  city: string
  area: string
  phone: string
  whatsapp: string
  website: string
  pricing: string
  description: string
}

const EMPTY: FormState = {
  name: '',
  category: BIZ_CATEGORIES[0],
  city: '',
  area: '',
  phone: '',
  whatsapp: '',
  website: '',
  pricing: '',
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
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [resultSlug, setResultSlug] = useState<string | null>(null)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'נא להוסיף שם עסק'
    if (!form.city.trim()) next.city = 'נא לציין עיר'
    if (!form.pricing.trim()) next.pricing = 'נא לציין מחירים - זה מה שהכי חשוב לגולשים'
    if (!form.description.trim()) next.description = 'נא לתאר את העסק בקצרה'
    if (form.name.length > LIMITS.name) next.name = `עד ${LIMITS.name} תווים`
    if (form.description.length > LIMITS.description) next.description = `עד ${LIMITS.description} תווים`
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    if (!validate()) return

    setStatus('sending')
    try {
      const body = {
        name: form.name.trim(),
        category: form.category,
        city: form.city.trim(),
        area: form.area.trim() || undefined,
        phone: form.phone.trim() || undefined,
        whatsapp: form.whatsapp.trim() || undefined,
        website: form.website.trim() || undefined,
        pricing: form.pricing.trim(),
        description: form.description.trim(),
      }

      const res = await fetch('/api/directory/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (data.ok && data.slug) {
        setResultSlug(data.slug)
        setStatus(data.pending ? 'pending' : 'done')
      } else if (data.error === 'rate') {
        setStatus('rate')
      } else if (data.error === 'too_large') {
        setStatus('too_large')
      } else if (data.error === 'invalid') {
        setStatus('invalid')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'pending') {
    return (
      <main className="page">
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'linear-gradient(135deg, #fffaf0, #fdf6e9)',
            borderRadius: 24,
            border: '2px solid rgba(201,154,91,.5)',
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: '#2a2018', marginBottom: 10 }}>
            העסק נשלח לבדיקה קצרה
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65, marginBottom: 22 }}>
            הפרטים התקבלו. חלק מההגשות עוברות בדיקה ידנית קצרה לפני פרסום,
            והעמוד שלכם יעלה לאתר מיד לאחר האישור (בדרך כלל תוך יום עסקים).
          </p>
          <Link href="/businesses" className="btn btn-primary">
            חזרה למדריך
          </Link>
        </div>
      </main>
    )
  }

  if (status === 'done' && resultSlug) {
    return (
      <main className="page">
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'linear-gradient(135deg, #fffaf0, #fdf6e9)',
            borderRadius: 24,
            border: '2px solid var(--brand)',
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: '#2a2018', marginBottom: 10 }}>
            העסק עלה למדריך!
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65, marginBottom: 22 }}>
            העמוד שלכם חי באתר. שתפו אותו עם לקוחות כדי שיכתבו ביקורות.
          </p>
          <Link
            href={`/businesses/${resultSlug}`}
            className="btn btn-primary"
          >
            לצפייה בעמוד העסק שלכם
          </Link>
          <div style={{ marginTop: 16 }}>
            <Link
              href="/businesses"
              style={{ fontSize: 14, color: 'var(--brand-dark)', fontWeight: 600 }}
            >
              חזרה למדריך
            </Link>
          </div>
        </div>
      </main>
    )
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
          <span className="section-tag">מדריך בעלי מקצוע</span>
          <h1 className="page-title grad-text" style={{ marginTop: 8 }}>
            הוסיפו את העסק שלכם
          </h1>
          <p className="page-sub" style={{ margin: '0 auto', maxWidth: 560 }}>
            פרסום חינם, עולה לאתר מיד, ונחשף לכל קהילת בעלי הכלבים שלנו.
          </p>
        </div>
      </section>

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
        {/* שם עסק */}
        <div>
          <label htmlFor="biz-name" style={labelStyle}>
            שם העסק *
          </label>
          <input
            id="biz-name"
            className="input"
            type="text"
            maxLength={LIMITS.name}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="לדוגמה: מרפאת וטרינר ליבת העיר"
            style={{ width: '100%' }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'err-biz-name' : undefined}
          />
          {errors.name && (
            <p id="err-biz-name" style={errStyle}>
              {errors.name}
            </p>
          )}
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
              maxLength={LIMITS.city}
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

        {/* אזור */}
        <div>
          <label htmlFor="biz-area" style={labelStyle}>
            אזור / שכונה
          </label>
          <input
            id="biz-area"
            className="input"
            type="text"
            maxLength={LIMITS.area}
            value={form.area}
            onChange={(e) => update('area', e.target.value)}
            placeholder="לדוגמה: מרכז הכרמל"
            style={{ width: '100%' }}
          />
        </div>

        {/* טלפון + וואטסאפ */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="biz-phone" style={labelStyle}>
              טלפון
            </label>
            <input
              id="biz-phone"
              className="input"
              type="tel"
              inputMode="tel"
              maxLength={LIMITS.phone}
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="050-000-0000"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label htmlFor="biz-whatsapp" style={labelStyle}>
              וואטסאפ
            </label>
            <input
              id="biz-whatsapp"
              className="input"
              type="tel"
              inputMode="tel"
              maxLength={LIMITS.phone}
              value={form.whatsapp}
              onChange={(e) => update('whatsapp', e.target.value)}
              placeholder="972501234567"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* אתר */}
        <div>
          <label htmlFor="biz-website" style={labelStyle}>
            אתר
          </label>
          <input
            id="biz-website"
            className="input"
            type="url"
            maxLength={LIMITS.website}
            value={form.website}
            onChange={(e) => update('website', e.target.value)}
            placeholder="https://example.co.il"
            style={{ width: '100%', direction: 'ltr', textAlign: 'right' }}
          />
        </div>

        {/* מחירים */}
        <div>
          <label htmlFor="biz-pricing" style={labelStyle}>
            מחירים *
          </label>
          <input
            id="biz-pricing"
            className="input"
            type="text"
            maxLength={LIMITS.pricing}
            value={form.pricing}
            onChange={(e) => update('pricing', e.target.value)}
            placeholder='לדוגמה: תספורת מלאה 180 ש"ח, ציפורניים 40 ש"ח'
            style={{ width: '100%' }}
            aria-invalid={!!errors.pricing}
            aria-describedby={errors.pricing ? 'err-pricing' : 'hint-pricing'}
          />
          {errors.pricing ? (
            <p id="err-pricing" style={errStyle}>
              {errors.pricing}
            </p>
          ) : (
            <p id="hint-pricing" style={{ fontSize: 12, color: 'var(--text-soft)', margin: '6px 0 0' }}>
              עסקים שמפרסמים מחירים מקבלים הרבה יותר פניות. אפשר גם טווח, למשל: 150-250 ש"ח לטיפול.
            </p>
          )}
        </div>

        {/* תיאור */}
        <div>
          <label htmlFor="biz-description" style={labelStyle}>
            תיאור העסק *
          </label>
          <textarea
            id="biz-description"
            className="input"
            maxLength={LIMITS.description}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="ספרו על העסק - אילו שירותים אתם מציעים, מה מייחד אתכם ולמי אתם מתאימים."
            rows={5}
            style={{ width: '100%' }}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'err-description' : undefined}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {errors.description ? (
              <p id="err-description" style={errStyle}>
                {errors.description}
              </p>
            ) : (
              <span />
            )}
            <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>
              {form.description.length}/{LIMITS.description}
            </span>
          </div>
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
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'שולח...' : 'הוסיפו את העסק'}
          </button>
          <Link href="/businesses" className="btn btn-ghost" style={{ minHeight: 44 }}>
            חזרה למדריך
          </Link>
        </div>

        {status === 'rate' && (
          <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
            הגעתם למגבלת ההוספות לשעה
          </div>
        )}
        {status === 'invalid' && (
          <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
            חלק מהשדות לא תקינים. בדקו ונסו שוב.
          </div>
        )}
        {status === 'too_large' && (
          <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
            אחד השדות ארוך מדי. קצרו ונסו שוב.
          </div>
        )}
        {status === 'error' && (
          <div role="alert" style={{ fontSize: 14, fontWeight: 700, color: '#a23c2e', textAlign: 'center', lineHeight: 1.5 }}>
            משהו השתבש. נסו שוב בעוד רגע.
          </div>
        )}
      </form>
    </main>
  )
}
