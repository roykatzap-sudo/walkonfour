'use client'

import { useState } from 'react'
import type { KitPost } from '@/lib/postKit'

const CSS = `
  .pk-tabs { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
  .pk-tab { min-height: 48px; padding: 0 20px; border-radius: 999px; border: 1.5px solid rgba(201,154,91,.55); background: #fff; color: #3d3226; font: inherit; font-weight: 800; font-size: 16.5px; cursor: pointer; transition: transform .16s cubic-bezier(0.23, 1, 0.32, 1), background-color .15s ease; }
  .pk-tab[aria-pressed="true"] { background: #2a2018; color: #fff; border-color: #2a2018; }
  .pk-tab:active, .pk-btn:active { transform: scale(.97); }
  .pk-tab:focus-visible, .pk-btn:focus-visible, .pk-select:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
  .pk-hint { font-size: 16.5px; line-height: 1.75; color: #4a3d2e; max-width: 760px; margin: 0 0 18px; }
  .pk-select-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 20px; }
  .pk-select-row label { font-weight: 800; font-size: 17px; }
  .pk-select { min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1.5px solid rgba(201,154,91,.6); background: #fff; font: inherit; font-size: 17px; min-width: 240px; }
  .pk-card { display: grid; grid-template-columns: 260px 1fr; gap: 22px; background: #fff; border: 1px solid rgba(201,154,91,.28); border-radius: 20px; padding: 18px; margin-bottom: 20px; }
  .pk-img { width: 100%; height: auto; aspect-ratio: 4 / 5; border-radius: 14px; background: #2a2018; display: block; }
  .pk-title { font-size: 20px; font-weight: 900; margin: 0 0 10px; color: var(--ink); line-height: 1.35; }
  .pk-text { white-space: pre-wrap; font: inherit; font-size: 16.5px; line-height: 1.7; color: #33291e; background: #fbf7ef; border: 1px solid rgba(201,154,91,.25); border-radius: 12px; padding: 14px 16px; margin: 0 0 12px; overflow-wrap: anywhere; }
  .pk-actions { display: flex; flex-wrap: wrap; gap: 10px; }
  .pk-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 18px; border-radius: 12px; border: 1.5px solid rgba(201,154,91,.6); background: #fff; color: #3d3226; font: inherit; font-weight: 800; font-size: 16px; cursor: pointer; text-decoration: none; transition: transform .16s cubic-bezier(0.23, 1, 0.32, 1); }
  .pk-btn.primary { background: #2a2018; border-color: #2a2018; color: #fff; }
  .pk-alt { font-size: 15px; color: #5b4d3c; line-height: 1.6; margin: 12px 0 0; }
  @media (max-width: 720px) {
    .pk-card { grid-template-columns: 1fr; }
    .pk-img { max-width: 300px; margin: 0 auto; }
    .pk-btn { flex: 1 1 100%; }
  }
`

type Tab = 'city' | 'quiz' | 'answer'

const HINT: Record<Tab, string> = {
  city: 'לקבוצות מקומיות: קבוצת השכונה, קבוצת העיר, קבוצת בעלי הכלבים של העיר. פוסט על העיר של מי שקורא אותו מקבל הרבה יותר תשומת לב מפוסט כללי. לפני שמפרסמים בקבוצה שאינה שלכם, בדקו בכללים שלה שמותר לשים קישור.',
  quiz: 'לקבוצה שלנו ולעמוד. שאלה עם אפשרויות מזמינה תגובות, ותגובות הן מה שגורם לפייסבוק להראות את הפוסט לעוד אנשים. אחרי יום אפשר לכתוב בתגובה את התשובה הנכונה.',
  answer: 'פוסטים ששומרים ומשתפים. התשובה כולה כתובה בפוסט עצמו, כך שהוא שווה משהו גם למי שלא לוחץ על הקישור. מתאים גם כתגובה כשמישהו שואל בדיוק את השאלה הזאת בקבוצה אחרת.',
}

function Card({ p }: { p: KitPost }) {
  const [copied, setCopied] = useState('')

  async function copy(what: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      window.setTimeout(() => setCopied(''), 1800)
    } catch {
      setCopied('fail')
    }
  }

  const full = `${p.body}\n\n${p.linkLine}`
  return (
    <article className="pk-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pk-img" src={p.image} alt={p.alt} width={1080} height={1350} loading="lazy" decoding="async" />
      <div>
        <h3 className="pk-title">{p.label}</h3>
        <pre className="pk-text">{full}</pre>
        <div className="pk-actions">
          <a className="pk-btn primary" href={p.image} download={`${p.id}.png`}>הורדת התמונה</a>
          <button type="button" className="pk-btn" onClick={() => copy('full', full)}>העתקת הפוסט עם הקישור</button>
          <button type="button" className="pk-btn" onClick={() => copy('body', p.body)}>העתקת הפוסט בלי הקישור</button>
          <button type="button" className="pk-btn" onClick={() => copy('link', p.linkLine)}>העתקת הקישור לתגובה</button>
          <button type="button" className="pk-btn" onClick={() => copy('alt', p.alt)}>העתקת תיאור התמונה</button>
        </div>
        <p className="pk-alt" role="status" aria-live="polite">
          {copied === 'fail' ? 'ההעתקה לא הצליחה. סמנו את הטקסט והעתיקו ידנית.' : copied ? 'הועתק.' : ''}
        </p>
      </div>
    </article>
  )
}

export function PostKit({ cities, quiz, answers }: { cities: KitPost[]; quiz: KitPost[]; answers: KitPost[] }) {
  const [tab, setTab] = useState<Tab>('city')
  const [city, setCity] = useState(cities[0]?.id ?? '')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'city', label: `גינות לפי עיר (${cities.length})` },
    { key: 'quiz', label: `שאלות מהחידון (${quiz.length})` },
    { key: 'answer', label: `תשובות למצבי חירום (${answers.length})` },
  ]
  const shown = tab === 'city' ? cities.filter((c) => c.id === city) : tab === 'quiz' ? quiz : answers

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pk-tabs" role="group" aria-label="סוג הפוסט">
        {tabs.map((t) => (
          <button key={t.key} type="button" className="pk-tab" aria-pressed={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <p className="pk-hint">{HINT[tab]}</p>

      {tab === 'city' && (
        <div className="pk-select-row">
          <label htmlFor="pk-city">עיר:</label>
          <select id="pk-city" className="pk-select" value={city} onChange={(e) => setCity(e.target.value)}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      )}

      {shown.map((p) => (
        <Card key={p.id} p={p} />
      ))}
    </div>
  )
}
