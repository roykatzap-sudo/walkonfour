import type { Metadata } from 'next'
import { CommunityCard } from '@/components/community/CommunityCard'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { communities, totalMembers } from '@/lib/communities'

export const metadata: Metadata = { title: 'קהילות · כלבניה' }

export default function CommunitiesPage() {
  return (
    <main className="page">
      {/* ── HERO ── */}
      <section
        aria-labelledby="communities-title"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '64px 28px 72px',
          marginBottom: 44,
          background: 'linear-gradient(160deg, #ffffff 0%, #fbf7ef 100%)',
          border: '1px solid #efe2cd',
          textAlign: 'center',
        }}
      >
        <FloatingShapes />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <span className="section-tag">קהילות מקומיות</span>

          <h1
            id="communities-title"
            className="grad-text display"
            style={{
              fontSize: 'clamp(40px, 7vw, 68px)',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1.05,
              margin: '4px 0 18px',
            }}
          >
            יש חבורה גם אצלכם בעיר
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: '#5b4d3c',
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            {totalMembers.toLocaleString('he-IL')} בעלי כלבים ב-{communities.length} ערים, וכל אחת עם הפינה
            והשעה שלה. בחרו את העיר שלכם, תראו איפה נפגשים, ובואו לטיול הקרוב.
          </p>
        </div>
      </section>

      {/* ── GRID ── */}
      <ul
        aria-label={`רשימת קהילות לפי עיר · ${communities.length} ערים`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 14,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {communities.map((c, i) => (
          <Reveal3D as="li" key={c.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <CommunityCard community={c} />
          </Reveal3D>
        ))}
      </ul>
    </main>
  )
}
