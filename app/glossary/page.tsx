import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { ogImageUrl, SITE_URL } from '@/lib/seo'
import { glossary, GLOSSARY_GROUPS } from '@/lib/glossary'
import { GroupLink } from '@/components/shared/GroupLink'

const TITLE = 'מילון לבעלי כלבים: שבב, רישיון, משושה ועוד'
const DESC =
  'הגדרות קצרות וברורות למושגים שכל בעל כלב בישראל פוגש: רישיון, שבב, מרכז הרישום, כלב מסוכן, חובת רצועה, משושה, קדחת קרציות ועוד. ההגדרות המשפטיות עם מספר הסעיף בחוק.'
const OG = ogImageUrl({ title: 'מילון לבעלי כלבים', subtitle: 'מה זה אומר, בשתי שורות', tag: 'מילון' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/glossary' },
  openGraph: { title: TITLE, description: DESC, url: '/glossary', type: 'article', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

export default function GlossaryPage() {
  const termSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'מילון לבעלי כלבים',
    url: `${SITE_URL}/glossary`,
    inLanguage: 'he-IL',
    hasDefinedTerm: glossary.map((g) => ({
      '@type': 'DefinedTerm',
      name: g.term,
      description: g.def,
      url: `${SITE_URL}/glossary#${g.id}`,
      ...(g.also?.length ? { alternateName: g.also } : {}),
    })),
  }

  return (
    <main className="page page-narrow" style={{ maxWidth: 860 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'מילון לבעלי כלבים', path: '/glossary' }]), termSet]} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .gl-nav { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 30px; }
            .gl-nav a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 15px; border-radius: 999px; background: #fff; border: 1.5px solid rgba(201,154,91,.5); color: #5a4d3c; font-weight: 700; font-size: 15px; text-decoration: none; }
            .gl-nav a:hover { background: #fdf6ea; }
            .gl-nav a:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
            .gl-term { background: #fff; border: 1px solid rgba(201,154,91,.25); border-radius: 16px; padding: 18px 22px; margin-bottom: 12px; scroll-margin-top: 96px; }
            .gl-term h3 { margin: 0 0 6px; font-size: 21px; font-weight: 900; color: var(--ink); }
            .gl-term p { margin: 0; font-size: 17px; line-height: 1.8; color: #3a3128; }
            .gl-also { font-size: 15px; color: #5b4d3c; margin: 0 0 6px !important; }
          `,
        }}
      />
      <span className="section-tag">מילון</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>מילון לבעלי כלבים</h1>
      <p className="page-sub" style={{ maxWidth: 660 }}>
        {glossary.length} מושגים שכל בעל כלב בישראל פוגש, כל אחד בכמה שורות. בהגדרות המשפטיות מצוין הסעיף בחוק, כדי שתוכלו לבדוק בעצמכם.
      </p>

      <nav className="gl-nav" aria-label="קפיצה למושג">
        {glossary.map((g) => (
          <a key={g.id} href={`#${g.id}`}>{g.term}</a>
        ))}
      </nav>

      {GLOSSARY_GROUPS.map((group) => (
        <section key={group} style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px' }}>{group}</h2>
          {glossary
            .filter((g) => g.group === group)
            .map((g) => (
              <article key={g.id} id={g.id} className="gl-term">
                <h3>{g.term}</h3>
                {g.also && g.also.length > 0 && <p className="gl-also">נקרא גם: {g.also.join(', ')}</p>}
                <p>{g.def}</p>
                {g.more && (
                  <p style={{ marginTop: 8 }}>
                    <Link href={g.more.href} className="link" style={{ fontWeight: 800, fontSize: 16 }}>{g.more.label}</Link>
                  </p>
                )}
              </article>
            ))}
        </section>
      ))}

      <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.7 }}>
        ההגדרות המשפטיות נבדקו מול נוסח החוק להסדרת הפיקוח על כלבים, התשס&quot;ג-2002, בנובמבר 2026. המילון הוא מידע כללי, ואינו ייעוץ משפטי או וטרינרי.
        מצאתם טעות? <Link href="/contact" className="link">כתבו לנו</Link> ונתקן.
      </p>

      <section style={{ marginTop: 26, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1b2a44', margin: '0 0 6px' }}>מושג שחסר כאן?</h2>
        <p style={{ margin: '0 0 12px', fontSize: 16.5, lineHeight: 1.75, color: '#1b2a44' }}>
          כתבו בקבוצת הפייסבוק שלנו איזה מושג לא הבנתם אצל הווטרינר או בעירייה, ונוסיף אותו.
        </p>
        <GroupLink
          src="glossary"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
