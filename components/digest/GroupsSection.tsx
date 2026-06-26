import Link from 'next/link'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { SectionHeader } from '@/components/digest/SectionHeader'
import { activeGroups } from '@/lib/digest'

/** מספר מעוצב עם הפרדת אלפים. */
const num = (n: number) => n.toLocaleString('he-IL')

/** ימים שנותרו עד מועד הסגירה (לא יורד מתחת לאפס). */
function daysLeft(deadline: string): number {
  return Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000))
}

/**
 * קבוצות רכישה פעילות - שלוש הקבוצות עם החיסכון הגבוה ביותר
 * (מועשרות ב-lib/digest). כל כרטיס מציג מחיר קבוצה, חיסכון, פס התקדמות
 * אל היעד ומספר חברים. read-only מ-demoGroups.
 */
export function GroupsSection() {
  const groups = activeGroups(3)
  if (groups.length === 0) return null

  return (
    <section aria-labelledby="digest-groups" style={{ marginBottom: 64 }}>
      <SectionHeader
        id="digest-groups"
        tag="קונים ביחד, חוסכים ביחד"
        title="קבוצות רכישה פעילות"
        description="ככל שמצטרפים יותר, המחיר יורד. אלה הקבוצות הפתוחות עם החיסכון הגדול ביותר החודש."
        linkHref="/groups"
        linkLabel="לכל הקבוצות"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
        }}
      >
        {groups.map((g, i) => {
          const days = daysLeft(g.deadline)
          return (
            <Reveal3D key={g.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Tilt3D max={7} className="sweep" style={{ height: '100%' }}>
                <article
                  className="lift-3d"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    padding: 22,
                    borderRadius: 22,
                    background: '#fff',
                    border: '1px solid #efe2cd',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  {/* כותרת + תג חיסכון */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--brand-dark)' }}>
                        {g.product_name}
                      </span>
                      <h3 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 800, lineHeight: 1.25 }}>
                        {g.title}
                      </h3>
                    </div>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: 13,
                        fontWeight: 900,
                        color: '#fff',
                        background: 'linear-gradient(135deg, #e8c887, #c99a5b)',
                        borderRadius: 'var(--pill-radius)',
                        padding: 'var(--chip-md-pad)',
                      }}
                      aria-label={`חיסכון ${g.savings} אחוז`}
                    >
                      {g.savings}%-
                    </span>
                  </div>

                  {/* מחיר */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-1px', color: 'var(--brand-dark)' }}>
                      ₪{num(g.group_price)}
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--text-soft)',
                        textDecoration: 'line-through',
                      }}
                    >
                      ₪{num(g.original_price)}
                    </span>
                  </div>

                  {/* פס התקדמות אל היעד */}
                  <div style={{ marginTop: 'auto' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        marginBottom: 6,
                      }}
                    >
                      <span>{num(g.members_count ?? 0)} הצטרפו</span>
                      <span>
                        {days === 0 ? 'נסגר היום' : days === 1 ? 'נותר יום אחד' : `נותרו ${days} ימים`}
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={g.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`התקדמות הקבוצה: ${g.progress} אחוז מהיעד`}
                      style={{
                        height: 9,
                        borderRadius: 100,
                        background: 'rgba(201,154,91,.14)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${g.progress}%`,
                          borderRadius: 100,
                          background: 'linear-gradient(90deg, #c99a5b, #e8c887)',
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    href="/groups"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    aria-label={`להצטרפות לקבוצת הרכישה: ${g.title}`}
                  >
                    אני רוצה להצטרף
                  </Link>
                </article>
              </Tilt3D>
            </Reveal3D>
          )
        })}
      </div>
    </section>
  )
}
