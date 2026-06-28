import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { DigestHero } from '@/components/digest/DigestHero'
import { DiscussionsSection } from '@/components/digest/DiscussionsSection'
import { EventsSection } from '@/components/digest/EventsSection'
import { GroupsSection } from '@/components/digest/GroupsSection'
import { MembersSection } from '@/components/digest/MembersSection'
import { AdoptionsSection } from '@/components/digest/AdoptionsSection'
import { DemoBanner } from '@/components/shared/DemoBanner'

export const metadata = buildMetadata({
  title: 'קהילה על ארבע החודש - הדייג׳סט הקהילתי',
  description:
    'תצוגה לדוגמה של הדייג׳סט החודשי: דיונים, אירועים קרובים, קבוצות רכישה וכלבים שמחכים לאימוץ. הקהילה בהקמה - כך זה ייראה כשנתחיל.',
  path: '/digest',
})

/**
 * "קהילה על ארבע החודש" - דייג׳סט קהילתי (Server Component).
 *
 * עמוד-מרכז שמרכז את הפעילות באתר לתמונת חודש אחת. כל סקשן שואב את
 * הנתונים שלו דרך שכבת האגרגציה ב-lib/digest.ts, שהיא read-only מעל
 * ה-lib הקיים (demo / leaderboard / adopt) - אין כאן מקור-אמת חדש.
 * הסקשנים האינטראקטיביים (כרטיסים עם tilt/toast) מסומנים 'use client'
 * בקבצים שלהם; העמוד עצמו נשאר רכיב שרת.
 */
export default function DigestPage() {
  return (
    <main className="page">
      <DigestHero />
      <DemoBanner />
      <DiscussionsSection />
      <EventsSection />
      <GroupsSection />
      <MembersSection />
      <AdoptionsSection />

      {/* ── קריאה לפעולה מסכמת ── */}
      <section
        style={{
          marginTop: 8,
          padding: '38px 28px',
          borderRadius: 24,
          textAlign: 'center',
          background: 'linear-gradient(160deg, #ffffff 0%, #fbf7ef 100%)',
          border: '1px solid #efe2cd',
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900, letterSpacing: '-1px' }}>
          רוצים להופיע בדייג׳סט הראשון שלנו?
        </h2>
        <p
          style={{
            margin: '0 auto 22px',
            maxWidth: 540,
            fontSize: 16,
            lineHeight: 1.65,
            color: 'var(--text-muted)',
          }}
        >
          הדייג׳סט הזה הוא תצוגה לדוגמה. כשהקהילה תתחיל, כאן יופיעו הדיונים,
          המפגשים והחברים האמיתיים. הצטרפו לרשימה ותהיו חלק מהגיליון הראשון.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/waitlist" className="btn btn-primary">
            הצטרפו לרשימה
          </Link>
          <Link href="/adopt" className="btn btn-ghost">
            לכלבים לאימוץ
          </Link>
        </div>
      </section>
    </main>
  )
}
