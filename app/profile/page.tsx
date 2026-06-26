'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import {
  REFERRAL_REWARD,
  REFERRAL_REWARD_RANGE,
  referralCode,
  referralLink,
  referralShareText,
} from '@/lib/petsitting'
import type { Profile } from '@/types'

const EMPTY: Partial<Profile> = {
  full_name: '', username: '', city: '', dog_name: '', dog_breed: '', dog_age: null, bio: '',
}

/* ─────────────── תוכנית ההמלצות (Referral dashboard) ─────────────── */

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div
      style={{
        flex: '1 1 120px',
        background: accent ? 'rgba(232,200,135,.16)' : '#fbf7ef',
        border: `1px solid ${accent ? 'rgba(201,154,91,.4)' : '#efe7d8'}`,
        borderRadius: 16,
        padding: '16px 18px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 900, color: '#2a2018', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#5e5346', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function ReferralDashboard({
  userId,
  name,
  dbCode,
  dbCredit,
  dbReferrals,
}: {
  userId: string
  name: string
  /** referral_code מה-DB, אם העמודה קיימת ומאוכלסת - מועדף על הקוד הנגזר. */
  dbCode?: string | null
  /** referral_credit (₪) מה-DB, אם קיים. */
  dbCredit?: number | null
  /** מספר ההמלצות המאושרות מה-DB, אם קיים. */
  dbReferrals?: number | null
}) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  // מעדיפים את הקוד שנשמר ב-DB; בהיעדרו גוזרים קוד יציב ממזהה המשתמש
  // (אותו קוד תמיד, גם במצב דמו ללא DB).
  const code = useMemo(
    () => (dbCode && dbCode.trim()) || referralCode(userId || name),
    [dbCode, userId, name],
  )
  const [link, setLink] = useState(() => referralLink(code, 'https://kelvanya.co.il'))

  // נתוני דאשבורד. במצב אמיתי מוזרמים מ-DB; במצב דמו מתחילים מאפס.
  const referrals = Math.max(0, dbReferrals ?? 0)
  const pending = 0
  const creditBalance = dbCredit != null ? Math.max(0, dbCredit) : referrals * REFERRAL_REWARD

  useEffect(() => {
    // origin אמיתי רק בצד הלקוח (נמנע מ-hydration mismatch)
    setLink(referralLink(code))
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [code])

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast('הקישור הועתק 🐾')
      setTimeout(() => setCopied(false), 2200)
    } catch {
      toast('לא הצלחנו להעתיק - אפשר לסמן ולהעתיק ידנית')
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({
        title: 'כלבניה - קהילת בעלי הכלבים',
        text: referralShareText(link),
        url: link,
      })
    } catch {
      // המשתמש ביטל את השיתוף - אין צורך בהודעה
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(referralShareText(link))}`

  return (
    <section className="card" style={{ marginTop: 24 }} aria-labelledby="ref-heading">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span aria-hidden="true" style={{ fontSize: 22 }}>🎁</span>
        <h2 id="ref-heading" style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>
          הזמינו חברים, צברו קרדיט
        </h2>
      </div>
      <p style={{ color: '#5e5346', fontSize: 15, lineHeight: 1.7, margin: '0 0 18px' }}>
        על כל חבר שמצטרף לכלבניה דרך הקישור שלכם תזוכו ב-{REFERRAL_REWARD} ₪ קרדיט
        (₪{REFERRAL_REWARD_RANGE.min}-{REFERRAL_REWARD_RANGE.max}), לניצול בקבוצות רכישה
        ובאירועים. ככה כולנו חוסכים יחד.
      </p>

      {/* נתונים */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
        <Stat value={String(referrals)} label="חברים שהצטרפו" />
        <Stat value={String(pending)} label="ממתינים לאישור" />
        <Stat value={`₪${creditBalance}`} label="קרדיט שנצבר" accent />
      </div>

      {/* קוד אישי */}
      <div className="field" style={{ marginBottom: 16 }}>
        <label htmlFor="ref-code">קוד ההמלצה האישי שלכם</label>
        <div
          id="ref-code"
          dir="ltr"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            alignSelf: 'flex-start',
            background: 'rgba(232,200,135,.14)',
            border: '1.5px dashed #c99a5b',
            borderRadius: 12,
            padding: '10px 18px',
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: 3,
            color: '#a97c46',
          }}
        >
          {code}
        </div>
      </div>

      {/* קישור שיתוף + העתקה בלחיצה */}
      <div className="field" style={{ marginBottom: 18 }}>
        <label htmlFor="ref-link">קישור ההזמנה האישי</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <input
            id="ref-link"
            className="input"
            value={link}
            readOnly
            dir="ltr"
            onFocus={(e) => e.currentTarget.select()}
            style={{ flex: '1 1 240px', minWidth: 0 }}
            aria-label="קישור ההזמנה האישי"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={copy}
            style={{ whiteSpace: 'nowrap' }}
          >
            {copied ? 'הועתק ✓' : 'העתקת הקישור'}
          </button>
        </div>
      </div>

      {/* כפתורי שיתוף */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <a
          className="btn btn-dark"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ whiteSpace: 'nowrap' }}
        >
          שיתוף בוואטסאפ
        </a>
        {canNativeShare && (
          <button type="button" className="btn btn-ghost" onClick={nativeShare} style={{ whiteSpace: 'nowrap' }}>
            שיתוף נוסף
          </button>
        )}
      </div>
    </section>
  )
}

export default function ProfilePage() {
  const toast = useToast()
  const [profile, setProfile] = useState<Partial<Profile>>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  // שדות תוכנית ההמלצות. לא נמצאים בטיפוס Profile (עמודות חדשות ב-DB),
  // לכן נשמרים בנפרד ונקראים בזהירות מהשורה הגולמית.
  const [referral, setReferral] = useState<{
    code: string | null
    credit: number | null
    count: number | null
  }>({ code: null, credit: null, count: null })

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }
        setSignedIn(true)
        setUserId(user.id)
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setProfile(data)
          // קריאה הגנתית: העמודות עשויות לא להתקיים עדיין במסד הנתונים.
          const row = data as Record<string, unknown>
          const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
          setReferral({
            code: typeof row.referral_code === 'string' ? row.referral_code : null,
            credit: num(row.referral_credit),
            count: num(row.referrals_count),
          })
        }
      } catch {
        // placeholder mode
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function set<K extends keyof Profile>(k: K, v: Profile[K]) {
    setProfile((p) => ({ ...p, [k]: v }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) {
      toast('כדי לשמור צריך קודם להתחבר')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name, username: profile.username, city: profile.city,
        dog_name: profile.dog_name, dog_breed: profile.dog_breed,
        dog_age: profile.dog_age, bio: profile.bio, updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
    setSaving(false)
    toast(error ? 'השמירה נכשלה, נסו שוב' : 'הפרופיל נשמר ✓')
  }

  if (loading) {
    return <main className="page page-narrow"><div className="card">טוען...</div></main>
  }

  if (!signedIn) {
    return (
      <main className="page page-narrow">
        <h1 className="page-title">הפרופיל שלי</h1>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, marginBottom: 18 }}>כדי לצפות בפרופיל ולערוך אותו צריך להתחבר.</p>
          <Link href="/auth/login" className="btn btn-primary">התחברות</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page page-narrow">
      <h1 className="page-title">הפרופיל שלי</h1>
      <p className="page-sub">כאן מעדכנים את הפרטים שלכם ושל הכלב.</p>

      <form className="card" onSubmit={save}>
        <h3 style={{ fontWeight: 800, marginBottom: 14 }}>👤 פרטים אישיים</h3>
        <div className="field"><label htmlFor="profile-fullname">שם מלא</label>
          <input id="profile-fullname" className="input" value={profile.full_name ?? ''} onChange={(e) => set('full_name', e.target.value)} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field"><label htmlFor="profile-username">שם משתמש</label>
            <input id="profile-username" className="input" value={profile.username ?? ''} onChange={(e) => set('username', e.target.value)} dir="ltr" /></div>
          <div className="field"><label htmlFor="profile-city">עיר</label>
            <input id="profile-city" className="input" value={profile.city ?? ''} onChange={(e) => set('city', e.target.value)} /></div>
        </div>
        <div className="field"><label htmlFor="profile-bio">קצת עליי</label>
          <textarea id="profile-bio" className="input" value={profile.bio ?? ''} onChange={(e) => set('bio', e.target.value)} /></div>

        <hr className="pc-div" />
        <h3 style={{ fontWeight: 800, marginBottom: 14 }}>🐕 הכלב שלי</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="field"><label htmlFor="dog-name">שם</label>
            <input id="dog-name" className="input" value={profile.dog_name ?? ''} onChange={(e) => set('dog_name', e.target.value)} /></div>
          <div className="field"><label htmlFor="dog-breed">גזע</label>
            <input id="dog-breed" className="input" value={profile.dog_breed ?? ''} onChange={(e) => set('dog_breed', e.target.value)} /></div>
          <div className="field"><label htmlFor="dog-age">גיל</label>
            <input id="dog-age" className="input" type="number" min="0" value={profile.dog_age ?? ''} onChange={(e) => set('dog_age', e.target.value ? Number(e.target.value) : null)} dir="ltr" /></div>
        </div>

        <button className="btn btn-primary" disabled={saving} style={{ marginTop: 8 }}>
          {saving ? 'שומר...' : 'שמירת שינויים'}
        </button>
      </form>

      {userId && (
        <ReferralDashboard
          userId={userId}
          name={profile.full_name ?? profile.username ?? ''}
          dbCode={referral.code}
          dbCredit={referral.credit}
          dbReferrals={referral.count}
        />
      )}
    </main>
  )
}
