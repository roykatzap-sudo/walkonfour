/* ════════════════════════════════════════════════════════════
   רכיב SEO ייעודי לדף גזע - 4 חלקים:
   1. quickAnswer (Featured Snippet bait, 40-60 מילים)
   2. Infobox table (snippet candidate - גוגל אוהב טבלאות)
   3. FAQ block (FAQPage schema candidate)
   4. "X בישראל" (הפער של המתחרים - אקלים/חוקים/מחירים)

   המבנה מבוסס על מחקר 3 סוכני SEO שחקרו את המתחרים הישראליים
   (chayuta, barking, wisedog) + Google Search guidelines 2026.

   רנדור: Server Component טהור - כל התוכן בא מ-breedSeo + breedDetails.
   ════════════════════════════════════════════════════════════ */

import type { Breed } from '@/lib/breeds'
import type { BreedDetail } from '@/lib/breedDetails'
import type { BreedSeo } from '@/lib/breedSeo'

type Props = {
  breed: Breed
  detail: BreedDetail | null
  seo: BreedSeo | null
}

export function BreedSeoBlock({ breed, detail, seo }: Props) {
  if (!seo && !detail) return null

  return (
    <div style={{ display: 'grid', gap: 24, margin: '28px 0' }}>
      {/* 1. תשובה מיידית - Featured Snippet bait */}
      {seo?.quickAnswer && (
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
      )}

      {/* 2. Infobox - טבלת עובדות מהירות (snippet candidate) */}
      {detail && (
        <div style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ background: '#fbf7ef', padding: '12px 18px', borderBottom: '1px solid rgba(201,154,91,.22)' }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--ink)' }}>עובדות מהירות על {breed.name}</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <caption className="sr-only">טבלת עובדות מפתח על {breed.name}</caption>
            <tbody>
              <InfoRow label="גובה" value={`${detail.heightCm} ס"מ`} />
              <InfoRow label="משקל" value={`${detail.weightKg} ק"ג`} />
              <InfoRow label="תוחלת חיים" value={`${breed.lifespan} שנים`} />
              <InfoRow label="קבוצה" value={detail.fciGroup} />
              {breed.origin && <InfoRow label="מוצא" value={breed.origin} />}
              <InfoRow label="גודל" value={breed.size} />
              <InfoRow label="רמת אנרגיה" value={`${'★'.repeat(breed.energy)}${'☆'.repeat(5 - breed.energy)} (${breed.energy}/5)`} />
              <InfoRow label="מתאים לילדים" value={breed.goodWithKids ? 'מצוין' : 'בזהירות'} />
            </tbody>
          </table>
        </div>
      )}

      {/* 3. FAQ - 5-7 שאלות נפוצות (FAQPage schema candidate) */}
      {seo?.faq && seo.faq.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 16, padding: '22px 24px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.3px' }}>
            שאלות נפוצות על {breed.name}
          </h2>
          <div style={{ display: 'grid', gap: 14 }}>
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

      {/* 4. "X בישראל" - הפער של המתחרים (אף אחד לא עושה!) */}
      {seo?.inIsrael && (
        <div style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 16, padding: '22px 24px' }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 22, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.3px' }}>
            🇮🇱 {breed.name} בישראל
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            <IsraelRow icon="☀️" label="התמודדות עם החום הישראלי" text={seo.inIsrael.climate} />
            {seo.inIsrael.legal && (
              <IsraelRow icon="⚖️" label="חוקים ורישוי" text={seo.inIsrael.legal} highlight />
            )}
            <IsraelRow icon="💰" label="מחירים בישראל" text={seo.inIsrael.pricing} />
            {seo.inIsrael.vetCost && <IsraelRow icon="🩺" label="עלות חודשית" text={seo.inIsrael.vetCost} />}
            {seo.inIsrael.popularity && <IsraelRow icon="📊" label="פופולריות בישראל" text={seo.inIsrael.popularity} />}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr style={{ borderTop: '1px solid rgba(201,154,91,.15)' }}>
      <th
        scope="row"
        style={{
          padding: '11px 18px',
          textAlign: 'start',
          fontSize: 13.5,
          fontWeight: 700,
          color: '#5b4d3c',
          width: '38%',
          background: 'rgba(251,247,239,.5)',
        }}
      >
        {label}
      </th>
      <td style={{ padding: '11px 18px', color: 'var(--ink)', fontSize: 15 }}>{value}</td>
    </tr>
  )
}

function IsraelRow({ icon, label, text, highlight }: { icon: string; label: string; text: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 14px',
        background: highlight ? 'rgba(180,80,46,.06)' : '#fbf7ef',
        border: highlight ? '1px solid rgba(180,80,46,.2)' : '1px solid rgba(201,154,91,.15)',
        borderRadius: 10,
      }}
    >
      <div style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true">
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#5b4d3c', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  )
}
