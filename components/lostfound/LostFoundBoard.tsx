'use client'

import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/shared/Toast'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { Reveal3D } from '@/components/fx/Reveal3D'
import {
  demoReports,
  LF_CITIES,
  LF_STATUS_LABEL,
  lfImg,
  lfTimeAgo,
  type LostFoundReport,
  type LostFoundStatus,
} from '@/lib/lostfound'

type StatusFilter = 'all' | LostFoundStatus
const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'הכל' },
  { id: 'lost', label: 'אבדו' },
  { id: 'found', label: 'נמצאו' },
]

const STATUS_COLOR: Record<LostFoundStatus, string> = {
  lost: '#b4502e', // טרקוטה - דחיפות
  found: '#a87a3e', // זהב חמים - בשורה טובה
}

export function LostFoundBoard() {
  const toast = useToast()
  const [status, setStatus] = useState<StatusFilter>('all')
  const [city, setCity] = useState('כל הערים')
  const [now, setNow] = useState<number | null>(null)

  // מחשבים "לפני X" רק בצד הלקוח כדי למנוע אי-התאמת hydration
  useEffect(() => setNow(Date.now()), [])

  const filtered = useMemo(
    () =>
      demoReports.filter(
        (r) => (status === 'all' || r.status === status) && (city === 'כל הערים' || r.city === city),
      ),
    [status, city],
  )

  return (
    <div>
      {/* ── באנר דיווח ── */}
      <div
        style={{
          background: 'var(--ink)',
          borderRadius: 20,
          padding: '24px 26px',
          marginBottom: 28,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          color: '#fff',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>אבד או נמצא כלב?</h2>
          <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,.78)', fontSize: 14.5, lineHeight: 1.55 }}>
            כל דקה חשובה. פרסמו דיווח, והקהילה כולה תעזור לחפש ולהשיב הביתה.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn"
            style={{ background: STATUS_COLOR.lost, color: '#fff' }}
            onClick={() => toast('פתיחת דיווח על כלב שאבד - בקרוב')}
          >
            דיווח על כלב שאבד
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => toast('פתיחת דיווח על כלב שנמצא - בקרוב')}
          >
            דיווח על כלב שנמצא
          </button>
        </div>
      </div>

      {/* ── סינון ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 22 }}>
        <div role="group" aria-label="סינון לפי סטטוס" style={{ display: 'inline-flex', gap: 6, background: 'rgba(42,32,24,.06)', padding: 5, borderRadius: 999 }}>
          {STATUS_TABS.map((t) => {
            const on = status === t.id
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => setStatus(t.id)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 999,
                  border: 'none',
                  background: on ? 'var(--brand)' : 'transparent',
                  color: on ? '#fff' : '#5e5346',
                  fontFamily: 'inherit',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: 40,
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#5e5346' }}>
          עיר:
          <select className="input" value={city} onChange={(e) => setCity(e.target.value)} style={{ minHeight: 44 }} aria-label="סינון לפי עיר">
            {LF_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <span className="muted" style={{ marginInlineStart: 'auto', fontWeight: 600 }}>{filtered.length} דיווחים</span>
      </div>

      {/* ── רשימה ── */}
      {filtered.length === 0 ? (
        <div className="alert alert-info" style={{ textAlign: 'center' }}>
          אין כרגע דיווחים שתואמים לסינון. נסו עיר אחרת או הציגו את הכל.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map((r, i) => (
            <Reveal3D key={r.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <ReportCard report={r} now={now} onContact={() => toast(`פרטי הקשר של ${r.contactName} נשלחו אליכם`)} />
            </Reveal3D>
          ))}
        </div>
      )}
    </div>
  )
}

function ReportCard({ report: r, now, onContact }: { report: LostFoundReport; now: number | null; onContact: () => void }) {
  const color = STATUS_COLOR[r.status]
  const title = r.dogName ? r.dogName : r.status === 'found' ? 'כלב שנמצא' : 'כלב שאבד'
  return (
    <Tilt3D className="sweep" max={7} glare>
      <article
        style={{
          background: '#fff',
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(42,32,24,.08)',
          boxShadow: '0 4px 18px rgba(42,32,24,.06)',
          height: '100%',
        }}
      >
        <div style={{ position: 'relative', height: 190 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" decoding="async" src={lfImg(r.photo, 600)} alt={`${title} - ${r.breed}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <span
            style={{
              position: 'absolute', top: 12, insetInlineStart: 12,
              background: color, color: '#fff', fontWeight: 800, fontSize: 13,
              padding: '5px 13px', borderRadius: 999, letterSpacing: '.3px',
            }}
          >
            {LF_STATUS_LABEL[r.status]}
          </span>
          {now != null && (
            <span style={{ position: 'absolute', top: 12, insetInlineEnd: 12, background: 'rgba(42,32,24,.62)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 999 }}>
              {lfTimeAgo(r.date, now)}
            </span>
          )}
        </div>
        <div className="lift-3d-sm" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#2a2018' }}>{title}</h3>
            <span style={{ fontSize: 13.5, color: '#7a6f63', fontWeight: 600 }}>{r.breed}</span>
          </div>
          <div style={{ fontSize: 13.5, color: '#7a6f63', fontWeight: 600, marginBottom: 10 }}>
            📍 {r.city} · {r.area}
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 14.5, lineHeight: 1.65, color: '#3a3128' }}>{r.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            <span className="chip3d">{r.size}</span>
            <span className="chip3d">{r.color}</span>
            {r.chipped === true && <span className="chip3d">שבב מזוהה</span>}
            {r.chipped === false && <span className="chip3d">ללא שבב</span>}
          </div>
          <button type="button" className="btn btn-dark btn-block" onClick={onContact}>
            יש לי מידע · ליצירת קשר
          </button>
        </div>
      </article>
    </Tilt3D>
  )
}
