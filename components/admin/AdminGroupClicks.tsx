'use client'

import { useCallback, useEffect, useState } from 'react'

type Stats = {
  total: number
  last7: number
  last30: number
  bySrc: { src: string; clicks: number }[]
  byPage: { page: string; clicks: number }[]
  byDay: { day: string; clicks: number }[]
}

/** שמות קריאים למיקומי הכפתורים. מפתח שלא מופיע כאן מוצג כמו שהוא. */
const SRC_LABEL: Record<string, string> = {
  nav: 'סרגל עליון: כפתור הצטרפות',
  'nav-drawer': 'תפריט נייד: כפתור הצטרפות',
  'city-inline': 'עמוד עיר: הזמנה בראש העמוד',
  'ext-page': 'מחוץ לאתר: עמוד הפייסבוק',
  'home-band': 'עמוד הבית: רצועת ההצטרפות',
  'facebook-page-bar': 'עמוד הקהילה: פס קבוע בנייד',
  search: 'עמוד החיפוש',
  'near-me': 'הגינה הקרובה אליי',
  glossary: 'מילון',
  quiz: 'חידון החוקים',
  'id-card': 'תעודת זהות לכלב',
  checklists: 'צ\'קליסטים',
  welcome: 'עמוד ברוכים הבאים',
  questions: 'שאלות מהקבוצה',
  question: 'עמוד שאלה מהקבוצה',
  hero: 'עמוד הבית: כפתור ראשי',
  'home-footer': 'עמוד הבית: תחתית',
  'founder-note': 'עמוד הבית: הערת המייסדים',
  'guide-inline': 'מדריך: הזמנה בתוך הטקסט',
  'guide-end': 'מדריך: כרטיס בסוף',
  'card-walks': 'כרטיס הזמנה: מסלולים',
  'card-parks': 'כרטיס הזמנה: גינות',
  'card-general': 'כרטיס הזמנה: כללי',
  popup: 'חלונית קופצת',
  footer: 'פוטר האתר',
  'facebook-page': 'עמוד הקהילה',
  contact: 'עמוד צור קשר',
  waitlist: 'טופס רשימת המתנה',
  emergency: 'עמוד מצבי חירום',
  poster: 'מחולל מודעת כלב אבוד',
  'ext-poster': 'מחוץ לאתר: מודעה מודפסת',
  'ext-video': 'מחוץ לאתר: סרטון',
  'ext-post': 'מחוץ לאתר: פוסט',
}

const cell: React.CSSProperties = { padding: '9px 12px', borderBottom: '1px solid rgba(201,154,91,.16)', fontSize: 15, textAlign: 'start' }

export function AdminGroupClicks() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [configured, setConfigured] = useState(true)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/admin/group-clicks', { cache: 'no-store' })
      if (res.status === 503) { setConfigured(false); return }
      if (res.status === 401) { setErr('אין הרשאה - התחברו מחדש'); return }
      const data = await res.json()
      setConfigured(Boolean(data.configured))
      setStats(data.stats || null)
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (!configured) return <p style={{ color: 'var(--text-muted)' }}>מסד הנתונים לא מוגדר, ולכן אין ספירה.</p>
  if (loading) return <p style={{ color: 'var(--text-muted)' }}>טוען...</p>
  if (err) return <p style={{ color: '#b3261e' }}>{err}</p>
  if (!stats) return null

  const maxDay = Math.max(1, ...stats.byDay.map((d) => d.clicks))

  return (
    <div>
      <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 0 }}>
        כאן נספרות הקלקות על הקישור לקבוצת הפייסבוק, לא הצטרפויות בפועל. את ההצטרפויות רואים בפייסבוק,
        בנתוני הקבוצה, ובתשובות לשאלה &quot;איך שמעתם עלינו?&quot;. בוטים לא נספרים.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, margin: '16px 0 24px' }}>
        {[
          { label: '7 ימים אחרונים', v: stats.last7 },
          { label: '30 ימים אחרונים', v: stats.last30 },
          { label: 'מאז שהתחלנו לספור', v: stats.total },
        ].map((k) => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.25)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--ink)' }}>{k.v}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 8px' }}>לפי מיקום הכפתור (30 יום)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 26 }}>
        <tbody>
          {stats.bySrc.length === 0 && <tr><td style={cell}>עדיין אין הקלקות.</td></tr>}
          {stats.bySrc.map((r) => (
            <tr key={r.src}>
              <td style={cell}>{SRC_LABEL[r.src] ?? r.src}</td>
              <td style={{ ...cell, fontWeight: 800, width: 80 }}>{r.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 8px' }}>לפי עמוד (30 יום)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 26 }}>
        <tbody>
          {stats.byPage.length === 0 && <tr><td style={cell}>עדיין אין הקלקות.</td></tr>}
          {stats.byPage.map((r) => (
            <tr key={r.page}>
              <td style={{ ...cell, direction: 'ltr', textAlign: 'end' }}>{r.page}</td>
              <td style={{ ...cell, fontWeight: 800, width: 80 }}>{r.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 8px' }}>לפי יום</h2>
      <div style={{ display: 'grid', gap: 6 }}>
        {stats.byDay.length === 0 && <p style={{ color: 'var(--text-muted)', margin: 0 }}>עדיין אין הקלקות.</p>}
        {stats.byDay.map((d) => (
          <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5 }}>
            <span style={{ width: 96, direction: 'ltr', color: 'var(--text-muted)' }}>{d.day}</span>
            <span style={{ height: 14, borderRadius: 7, background: '#1877f2', width: `${Math.max(3, (d.clicks / maxDay) * 70)}%` }} />
            <strong>{d.clicks}</strong>
          </div>
        ))}
      </div>

      <button type="button" onClick={load} style={{ marginTop: 22, padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(201,154,91,.45)', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
        רענון
      </button>
    </div>
  )
}
