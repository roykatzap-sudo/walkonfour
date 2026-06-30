'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Account = {
  id: number
  email: string
  nickname: string
  notif_operational: boolean
  notif_marketing: boolean
  consent_version: string
  consented_at: string
  created_at: string
}

export function AccountSettings() {
  const router = useRouter()
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [nickname, setNickname] = useState('')
  const [notifOp, setNotifOp] = useState(true)
  const [notifMk, setNotifMk] = useState(false)
  const [savingNick, setSavingNick] = useState(false)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [delState, setDelState] = useState<'idle' | 'confirm' | 'typing' | 'deleting' | 'error'>('idle')
  const [delConfirm, setDelConfirm] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/community/account').then((r) => r.json()).then((d) => {
      if (d.ok) {
        setAccount(d.account)
        setNickname(d.account.nickname)
        setNotifOp(d.account.notif_operational)
        setNotifMk(d.account.notif_marketing)
      }
      setLoading(false)
    })
  }, [])

  async function saveNick() {
    if (!nickname.trim() || nickname.trim().length < 2 || savingNick) return
    setSavingNick(true); setMsg('')
    const res = await fetch('/api/community/account', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: nickname.trim() }),
    })
    setSavingNick(false)
    if ((await res.json()).ok) {
      setMsg('הכינוי עודכן ✓'); setTimeout(() => setMsg(''), 2500)
    }
  }

  async function savePref(field: 'notif_operational' | 'notif_marketing', value: boolean) {
    if (savingPrefs) return
    setSavingPrefs(true)
    if (field === 'notif_operational') setNotifOp(value)
    else setNotifMk(value)
    await fetch('/api/community/account', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    setSavingPrefs(false)
  }

  async function doDelete() {
    if (delConfirm !== 'מחק') return
    setDelState('deleting')
    const res = await fetch('/api/community/account', { method: 'DELETE' })
    if ((await res.json()).ok) {
      router.push('/?deleted=1')
    } else {
      setDelState('error')
    }
  }

  if (loading) return <div className="card" style={{ padding: 30, textAlign: 'center' }}>טוען...</div>
  if (!account) return <div className="card" style={{ padding: 30, textAlign: 'center', color: '#a23c2e' }}>שגיאה בטעינת החשבון</div>

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* כינוי ופרטים */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 19, fontWeight: 900, color: 'var(--ink)', margin: '0 0 16px' }}>פרטי החשבון</h2>
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <div style={{ fontSize: 13, color: '#8a7c66', marginBottom: 4 }}>מייל</div>
            <div style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600 }}>{account.email}</div>
          </div>
          <div>
            <label htmlFor="nick" style={{ display: 'block', fontSize: 13, color: '#8a7c66', marginBottom: 4 }}>כינוי</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                id="nick"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={40}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 15 }}
              />
              <button type="button" onClick={saveNick} disabled={savingNick || nickname.trim() === account.nickname} className="btn btn-primary" style={{ fontSize: 14, padding: '8px 18px' }}>
                שמירה
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#8a7c66', marginBottom: 4 }}>חבר/ה בקהילה מאז</div>
            <div style={{ fontSize: 14, color: 'var(--ink)' }}>{new Date(account.created_at).toLocaleDateString('he-IL')}</div>
          </div>
        </div>
        {msg && <div role="status" style={{ marginTop: 10, fontSize: 13, color: 'var(--brand-dark)', fontWeight: 700 }}>{msg}</div>}
      </div>

      {/* התראות ודיוור */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 19, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>התראות ודיוור</h2>
        <p style={{ fontSize: 13.5, color: '#5b4d3c', margin: '0 0 16px', lineHeight: 1.55 }}>
          ניתן לכבות בכל עת. שינוי כאן נשמר אוטומטית.
        </p>
        <PrefRow
          label="התראות תפעוליות"
          desc="התראה במייל כשמישהו אחר תיאם הגעה לגינה שגם אתם תיאמתם בה (לטובת תיאום השעה)."
          value={notifOp}
          onChange={(v) => savePref('notif_operational', v)}
        />
        <hr style={{ margin: '14px 0', border: 'none', borderTop: '1px solid rgba(201,154,91,.18)' }} />
        <PrefRow
          label="דיוור שיווקי (פרסומת)"
          desc="עדכוני אתר, טיפים והצעות מקהילה על ארבע. לפי סעיף 30א לחוק התקשורת."
          value={notifMk}
          onChange={(v) => savePref('notif_marketing', v)}
        />
        <hr style={{ margin: '14px 0', border: 'none', borderTop: '1px solid rgba(201,154,91,.18)' }} />
        <PrefRow
          label="הודעות חובה (אבטחה ומדיניות)"
          desc="קוד OTP, התראות אבטחה, עדכוני מדיניות. לא ניתן לכבות - נדרשות לפעילות בטוחה."
          value={true}
          onChange={() => {}}
          disabled
        />
      </div>

      {/* זכויות פרטיות */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 19, fontWeight: 900, color: 'var(--ink)', margin: '0 0 10px' }}>זכויות הפרטיות שלכם</h2>
        <p style={{ fontSize: 13.5, color: '#5b4d3c', margin: '0 0 12px', lineHeight: 1.6 }}>
          לפי חוק הגנת הפרטיות התשמ"א-1981 (סעיפים 13-14), זכותכם:
        </p>
        <ul style={{ margin: '0 0 14px', paddingInlineStart: 18, fontSize: 14, color: 'var(--ink)', lineHeight: 1.7 }}>
          <li>לעיין במידע שאנו מחזיקים עליכם</li>
          <li>לדרוש תיקון של מידע לא מדויק</li>
          <li>לדרוש מחיקה (זכות נשכחות)</li>
        </ul>
        <p style={{ fontSize: 13.5, color: '#5b4d3c', margin: 0, lineHeight: 1.6 }}>
          לכל בקשה ניתן לפנות במייל ל-
          <a href="mailto:ghjkfuik@gmail.com" style={{ color: 'var(--brand-dark)', fontWeight: 700 }}>ghjkfuik@gmail.com</a>
          . נענה תוך 30 יום.
        </p>
      </div>

      {/* מחיקת חשבון */}
      <div className="card" style={{ padding: 24, borderColor: 'rgba(162,60,46,.25)' }}>
        <h2 style={{ fontSize: 19, fontWeight: 900, color: '#a23c2e', margin: '0 0 8px' }}>🗑️ מחיקת חשבון</h2>
        <p style={{ fontSize: 13.5, color: '#5b4d3c', margin: '0 0 14px', lineHeight: 1.6 }}>
          מחיקה היא <strong>סופית ובלתי הפיכה</strong>. יימחקו: פרטי החשבון, כל הכלבים, תיאומי הגעה והודעות בצ'אט. לוג האבטחה יישמר ללא מזהה אישי (אנונימיזציה לפי חוק הגנת הפרטיות).
        </p>
        {delState === 'idle' && (
          <button type="button" onClick={() => setDelState('confirm')} style={{ background: 'none', border: '1.5px solid #a23c2e', color: '#a23c2e', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            מחיקת החשבון שלי
          </button>
        )}
        {delState === 'confirm' && (
          <div style={{ background: '#fef5f3', border: '1px solid rgba(162,60,46,.25)', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 14, color: 'var(--ink)', margin: '0 0 10px', lineHeight: 1.6 }}>
              לאישור המחיקה, הקלידו <strong>מחק</strong> בשדה למטה:
            </p>
            <input
              type="text"
              value={delConfirm}
              onChange={(e) => setDelConfirm(e.target.value)}
              placeholder="מחק"
              autoFocus
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(162,60,46,.4)', fontSize: 15, marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={doDelete} disabled={delConfirm !== 'מחק'} style={{ background: '#a23c2e', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: delConfirm === 'מחק' ? 'pointer' : 'not-allowed', opacity: delConfirm === 'מחק' ? 1 : 0.5, fontFamily: 'inherit' }}>
                כן, למחוק לצמיתות
              </button>
              <button type="button" onClick={() => { setDelState('idle'); setDelConfirm('') }} style={{ background: 'none', border: 'none', color: '#5b4d3c', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
                ביטול
              </button>
            </div>
          </div>
        )}
        {delState === 'deleting' && <div style={{ fontSize: 14, color: '#5b4d3c' }}>מוחק חשבון...</div>}
        {delState === 'error' && <div role="alert" style={{ fontSize: 14, color: '#a23c2e', marginTop: 8 }}>שגיאה במחיקה. נסו שוב.</div>}
      </div>
    </div>
  )
}

function PrefRow({ label, desc, value, onChange, disabled }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
      <div style={{ flex: 1, opacity: disabled ? 0.65 : 1 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>{label}</div>
        <div style={{ fontSize: 13, color: '#5b4d3c', marginTop: 2, lineHeight: 1.55 }}>{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        role="switch"
        aria-checked={value}
        aria-label={label}
        style={{ flexShrink: 0, width: 48, height: 28, borderRadius: 999, border: 'none', background: value ? 'var(--brand)' : '#d6c7ad', position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background .15s', opacity: disabled ? 0.6 : 1 }}
      >
        <span style={{ position: 'absolute', top: 3, insetInlineStart: value ? 23 : 3, width: 22, height: 22, background: '#fff', borderRadius: '50%', transition: 'inset-inline-start .15s', boxShadow: '0 2px 4px rgba(0,0,0,.2)' }} />
      </button>
    </div>
  )
}
