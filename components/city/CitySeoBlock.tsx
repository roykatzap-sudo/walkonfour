/* ════════════════════════════════════════════════════════════
   רכיב SEO לעמוד עיר - אנלוגי ל-BreedSeoBlock.
   מציג: quickAnswer (40-60 מילים) + FAQ accordion.

   נדחף בראש העמוד (לפני הסטטיסטיקות) כדי לתפוס:
   - Featured Snippet (תשובה ב-40-60 מילים)
   - PAA (FAQPage schema)
   - AI Overviews (תשובה ישירה במשפט הראשון)
   ════════════════════════════════════════════════════════════ */

import type { CitySeo } from '@/lib/citySeo'

export function CitySeoBlock({ city, seo }: { city: string; seo: CitySeo }) {
  return (
    <div style={{ display: 'grid', gap: 22, margin: '24px 0' }}>
      {/* תשובה מהירה - Featured Snippet bait */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7e9, #fbeece)',
          border: '1.5px solid var(--brand)',
          borderRadius: 18,
          padding: '20px 24px',
          fontSize: 16.5,
          lineHeight: 1.7,
          color: 'var(--ink)',
          position: 'relative',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -10,
            insetInlineStart: 18,
            background: 'var(--brand)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 999,
            letterSpacing: '.3px',
          }}
        >
          תשובה מהירה
        </div>
        <p style={{ margin: 0 }}>{seo.quickAnswer}</p>
      </div>

      {/* FAQ */}
      {seo.faq.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 16, padding: '22px 24px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.3px' }}>
            שאלות נפוצות על כלבים ב{city}
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {seo.faq.map((item, i) => (
              <details
                key={i}
                style={{
                  background: '#fbf7ef',
                  border: '1px solid rgba(201,154,91,.18)',
                  borderRadius: 12,
                  padding: '12px 16px',
                }}
              >
                <summary
                  style={{
                    fontSize: 15.5,
                    fontWeight: 800,
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    listStyle: 'none',
                    paddingInlineEnd: 24,
                    position: 'relative',
                  }}
                >
                  {item.q}
                  <span aria-hidden="true" style={{ position: 'absolute', insetInlineEnd: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-dark)', fontWeight: 900 }}>›</span>
                </summary>
                <p style={{ margin: '10px 0 2px', fontSize: 15, lineHeight: 1.65, color: '#3d342a' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
