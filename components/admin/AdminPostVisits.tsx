'use client'

import { useCallback, useEffect, useState } from 'react'

type Stats = {
  total: number
  last7: number
  last30: number
  bySrc: { src: string; visits: number }[]
  byCampaign: { src: string; campaign: string; visits: number }[]
  byPage: { page: string; visits: number }[]
  byDay: { day: string; visits: number }[]
  groupClicksByVia?: { via: string; clicks: number }[]
}

/** שמות קריאים למקורות. מקור שלא מופיע כאן מוצג כמו שהוא. */
const SRC_LABEL: Record<string, string> = {
  fb_post: 'פוסט מערכת הפוסטים',
  fb_group: 'פוסט בקבוצה שלנו',
  fb_page: 'פוסט בעמוד שלנו',
  fb_comment: 'תגובה בקבוצה אחרת',
  wa_park: 'גינה שנשלחה בוואטסאפ',
  wa: 'שיתוף בוואטסאפ',
}

const cell: React.CSSProperties = { padding: '9px 12px', borderBottom: '1px solid rgba(201,154,91,.16)', fontSize: 15, textAlign: 'start' }

export function AdminPostVisits() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [configured, setConfigured] = useState(true)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/admin/post-visits', { cache: 'no-store' })
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

  const maxDay = Math.max(1, ...stats.byDay.map((d) => d.visits))
  const toGroup = new Map((stats.groupClicksByVia ?? []).map((g) => [g.via, g.clicks]))

  return (
    <div>
      <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 0 }}>
        כאן נספרות כניסות לאתר מקישורים מתויגים, כלומר קישורים מהפוסטים שמוכנים ב
        <a href="/post-kit" style={{ fontWeight: 700 }}>ערכת הפוסטים</a>. כל פוסט מקבל שם משלו, כך שרואים איזה פוסט הביא אנשים ואיזה לא.
        מי שהקליד את הכתובת מהתמונה בעצמו לא נספר כאן. בוטים לא נספרים.
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

      <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 8px' }}>לפי פוסט (30 יום)</h2>
      <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 8px' }}>
        העמודה האחרונה: כמה מהנכנסים לחצו אחר כך על הקישור לקבוצה. זו הקלקה, לא הצטרפות בפועל.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 26 }}>
        <thead>
          <tr>
            <th scope="col" style={{ ...cell, fontWeight: 800 }}>מקור</th>
            <th scope="col" style={{ ...cell, fontWeight: 800, textAlign: 'end' }}>פוסט</th>
            <th scope="col" style={{ ...cell, fontWeight: 800 }}>כניסות</th>
            <th scope="col" style={{ ...cell, fontWeight: 800 }}>לחצו לקבוצה</th>
          </tr>
        </thead>
        <tbody>
          {stats.byCampaign.length === 0 && <tr><td style={cell}>עדיין אין כניסות.</td></tr>}
          {stats.byCampaign.map((r) => (
            <tr key={`${r.src}:${r.campaign}`}>
              <td style={cell}>{SRC_LABEL[r.src] ?? r.src}</td>
              <td style={{ ...cell, direction: 'ltr', textAlign: 'end' }}>{r.campaign || '(בלי שם)'}</td>
              <td style={{ ...cell, fontWeight: 800, width: 80 }}>{r.visits}</td>
              <td style={{ ...cell, fontWeight: 800, width: 130 }}>
                {toGroup.get(`${r.src}:${r.campaign}`) ?? 0}
                {r.visits > 0 ? ` (${Math.round(((toGroup.get(`${r.src}:${r.campaign}`) ?? 0) / r.visits) * 100)}%)` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 8px' }}>לפי מקור (30 יום)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 26 }}>
        <tbody>
          {stats.bySrc.length === 0 && <tr><td style={cell}>עדיין אין כניסות.</td></tr>}
          {stats.bySrc.map((r) => (
            <tr key={r.src}>
              <td style={cell}>{SRC_LABEL[r.src] ?? r.src}</td>
              <td style={{ ...cell, fontWeight: 800, width: 80 }}>{r.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 8px' }}>לפי עמוד נחיתה (30 יום)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 26 }}>
        <tbody>
          {stats.byPage.length === 0 && <tr><td style={cell}>עדיין אין כניסות.</td></tr>}
          {stats.byPage.map((r) => (
            <tr key={r.page}>
              <td style={{ ...cell, direction: 'ltr', textAlign: 'end' }}>{r.page}</td>
              <td style={{ ...cell, fontWeight: 800, width: 80 }}>{r.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 19, fontWeight: 900, margin: '0 0 8px' }}>לפי יום</h2>
      <div style={{ display: 'grid', gap: 6 }}>
        {stats.byDay.length === 0 && <p style={{ color: 'var(--text-muted)', margin: 0 }}>עדיין אין כניסות.</p>}
        {stats.byDay.map((d) => (
          <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5 }}>
            <span style={{ width: 96, direction: 'ltr', color: 'var(--text-muted)' }}>{d.day}</span>
            <span style={{ height: 14, borderRadius: 7, background: '#c99a5b', width: `${Math.max(3, (d.visits / maxDay) * 70)}%` }} />
            <strong>{d.visits}</strong>
          </div>
        ))}
      </div>

      <button type="button" onClick={load} style={{ marginTop: 22, padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(201,154,91,.45)', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
        רענון
      </button>
    </div>
  )
}
