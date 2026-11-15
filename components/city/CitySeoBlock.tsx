/* ════════════════════════════════════════════════════════════
   שני רכיבי תוכן לעמוד עיר: תשובה קצרה (בראש העמוד) ושאלות נפוצות
   (אחרי הרשימות). מי שבא לחפש גינה רואה קודם את הגינות.
   ════════════════════════════════════════════════════════════ */

import type { CitySeo } from '@/lib/citySeo'

export function CityQuickAnswer({ seo }: { seo: CitySeo }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fff7e9, #fbeece)',
        border: '1px solid rgba(201,154,91,.45)',
        borderInlineStart: '5px solid var(--brand)',
        borderRadius: 18,
        padding: '18px 22px',
        margin: '22px 0 0',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand-dark, #7a5a2e)', marginBottom: 4 }}>בקצרה</div>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.75, color: 'var(--ink)' }}>{seo.quickAnswer}</p>
    </div>
  )
}

export function CityFaqBlock({ city, seo }: { city: string; seo: CitySeo }) {
  if (seo.faq.length === 0) return null
  return (
    <section id="faq" style={{ marginTop: 48, scrollMarginTop: 96 }}>
      <h2 style={{ margin: '0 0 14px', fontSize: 26, fontWeight: 900, color: 'var(--ink)' }}>שאלות נפוצות על כלבים ב{city}</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {seo.faq.map((item, i) => (
          <details key={i} className="city-faq">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
