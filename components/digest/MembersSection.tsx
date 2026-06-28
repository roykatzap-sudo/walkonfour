import Link from 'next/link'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { SectionHeader } from '@/components/digest/SectionHeader'
import { topMembers } from '@/lib/digest'

/** מדליות לפי מקום - קישוט בלבד, תמיד aria-hidden. */
const MEDAL = ['🥇', '🥈', '🥉'] as const

/**
 * חברים מובילים - שלושת המקומות הראשונים בלוח המובילים הארצי
 * (דרך topMembers ב-lib/digest, שמחשב נקודות, דרגה וקהילה). הראשון מודגש.
 * read-only מ-lib/leaderboard.
 */
export function MembersSection() {
  const members = topMembers(3)
  if (members.length === 0) return null

  return (
    <section aria-labelledby="digest-members" style={{ marginBottom: 64 }}>
      <SectionHeader
        id="digest-members"
        tag="הכוח של הקהילה"
        title="כך ייראה לוח המובילים"
        description="תצוגה לדוגמה: כשהקהילה תתחיל, בעלי הכלבים שיתרמו הכי הרבה - פוסטים, עזרה לחברים והשתתפות באירועים - יופיעו כאן."
        linkHref="/leaderboard"
        linkLabel="איך צוברים נקודות"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 18,
        }}
      >
        {members.map((m, i) => {
          const first = i === 0
          return (
            <Reveal3D key={m.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Tilt3D max={8} className="sweep" style={{ height: '100%' }}>
                <article
                  className="lift-3d"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 10,
                    padding: '26px 20px',
                    borderRadius: 22,
                    color: first ? '#fff' : 'var(--text)',
                    background: first
                      ? 'linear-gradient(160deg, #e8c887 0%, #c99a5b 100%)'
                      : '#fff',
                    border: first ? '1px solid #c99a5b' : '1px solid #efe2cd',
                    boxShadow: first
                      ? '0 18px 44px rgba(201,154,91,.34)'
                      : 'var(--shadow-lg)',
                  }}
                >
                  <span aria-hidden style={{ fontSize: 30, lineHeight: 1 }}>
                    {MEDAL[m.rank - 1] ?? '🐾'}
                  </span>

                  {/* אווטאר אות ראשונה */}
                  <span
                    aria-hidden
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 26,
                      fontWeight: 900,
                      color: first ? 'var(--brand-dark)' : '#fff',
                      background: first
                        ? 'rgba(255,255,255,.92)'
                        : 'linear-gradient(135deg, #e8c887, #c99a5b)',
                      boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.5)',
                    }}
                  >
                    {m.dog.charAt(0)}
                  </span>

                  <strong style={{ fontSize: 19, fontWeight: 900, letterSpacing: '-0.5px' }}>
                    {m.dog}
                  </strong>
                  <span style={{ fontSize: 13, opacity: 0.9 }}>
                    {m.name}
                    {m.community ? ` · ${m.community.name}` : ''}
                  </span>

                  <span style={{ marginTop: 2, fontSize: 23, fontWeight: 900, letterSpacing: '-0.5px' }}>
                    {m.points.toLocaleString('he-IL')}
                    <span style={{ fontSize: 12, fontWeight: 700, marginInlineStart: 5, opacity: 0.85 }}>
                      נק׳
                    </span>
                  </span>

                  <span
                    className="chip3d"
                    style={
                      first
                        ? {
                            background: 'rgba(255,255,255,.22)',
                            color: '#fff',
                            borderColor: 'rgba(255,255,255,.4)',
                          }
                        : undefined
                    }
                  >
                    <span aria-hidden>{m.tier.icon}</span>
                    {m.tier.name}
                  </span>
                </article>
              </Tilt3D>
            </Reveal3D>
          )
        })}
      </div>

      <p style={{ textAlign: 'center', marginTop: 18 }}>
        <Link href="/leaderboard" className="btn btn-ghost">
          רוצים לראות את עצמכם כאן? ככה זה יעבוד
        </Link>
      </p>
    </section>
  )
}
