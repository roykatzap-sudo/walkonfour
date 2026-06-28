import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { demoListings, listingImg, formatPrice, CONDITION_STYLE } from '@/lib/market'
import { ContactSeller } from '@/components/market/ContactSeller'
import { absoluteUrl, clampDescription, ogImageUrl } from '@/lib/seo'

export function generateStaticParams() {
  return demoListings.map((l) => ({ id: l.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const l = demoListings.find((x) => x.id === params.id)
  if (!l) return { title: 'מודעה לא נמצאה · קהילה על ארבע' }
  const title = `${l.title} - ${formatPrice(l.price)} · יד שנייה`
  const description = clampDescription(`${l.title} למכירה ב${l.city}, מצב ${l.condition}. ${l.description}`)
  const url = absoluteUrl(`/market/${l.id}`)
  const ogImage = absoluteUrl(ogImageUrl({ title: l.title, subtitle: `${formatPrice(l.price)} · ${l.city}`, tag: 'יד שנייה' }))
  return {
    title: `${title} | קהילה על ארבע`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'he_IL', images: [{ url: ogImage, width: 1200, height: 630, alt: l.title }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

const SAFETY_TIPS = [
  'היפגשו במקום ציבורי ומואר לאיסוף הפריט.',
  'בדקו את הפריט פיזית לפני שמשלמים - אל תעבירו תשלום מראש.',
  'שלמו רק במסירה. הימנעו מהעברות לחשבונות לא מוכרים.',
  'יצירת הקשר נעשית דרך קהילה על ארבע - אין צורך למסור טלפון מראש.',
]

export default function ListingPage({ params }: { params: { id: string } }) {
  const listing = demoListings.find((l) => l.id === params.id)
  if (!listing) notFound()

  const cond = CONDITION_STYLE[listing.condition]
  const related = demoListings
    .filter((l) => l.id !== listing.id && l.category === listing.category)
    .slice(0, 3)

  return (
    <main className="page" style={{ maxWidth: 1080 }}>
      {/* פירורי לחם */}
      <nav className="muted" style={{ fontSize: 14, marginBottom: 16 }} aria-label="פירורי לחם">
        <Link href="/market" className="link">יד שנייה</Link>
        <span aria-hidden> / </span>
        <span>{listing.category}</span>
      </nav>

      <div className="ml-grid">
        {/* תמונה */}
        <div className="ml-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listingImg(listing.photo, 900)} alt={listing.title} />
          {listing.promoted && <span className="ml-promoted">⭐ מקודמת</span>}
        </div>

        {/* פרטים */}
        <div className="ml-info">
          <span
            className="ml-cond"
            style={{ color: cond.fg, background: cond.bg, border: `1px solid ${cond.border}` }}
          >
            {listing.condition}
          </span>
          <h1 className="ml-title">{listing.title}</h1>
          <div className="ml-price">{formatPrice(listing.price)}</div>

          <dl className="ml-meta">
            <div><dt>קטגוריה</dt><dd>{listing.category}</dd></div>
            <div><dt>מיקום</dt><dd>📍 {listing.city}</dd></div>
            <div><dt>מוכר</dt><dd>{listing.seller}</dd></div>
            <div><dt>פורסם</dt><dd>{listing.postedAgo}</dd></div>
          </dl>

          <ContactSeller seller={listing.seller} />
        </div>
      </div>

      {/* תיאור */}
      <section className="card ml-desc">
        <h2>תיאור הפריט</h2>
        <p>{listing.description}</p>
      </section>

      {/* בטיחות עסקה */}
      <section className="ml-safety" aria-labelledby="safety-h">
        <h2 id="safety-h">🛡️ עסקה בטוחה ביד שנייה</h2>
        <ul>
          {SAFETY_TIPS.map((t, i) => (
            <li key={i}><span aria-hidden>✓</span>{t}</li>
          ))}
        </ul>
        <p className="ml-safety-note">
          קהילה על ארבע היא לוח מודעות שמחבר בין מוכר לקונה ואינה צד לעסקה. אנו לא אחראים לטיב הפריט
          או לתשלום. מצאתם מודעה חשודה? דווחו לנו. <Link href="/terms" className="link">לתקנון המלא</Link>
        </p>
      </section>

      {/* מודעות דומות */}
      {related.length > 0 && (
        <section className="ml-related">
          <h2>עוד ב{listing.category}</h2>
          <div className="ml-related-grid">
            {related.map((r) => (
              <Link key={r.id} href={`/market/${r.id}`} className="ml-related-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listingImg(r.photo, 400)} alt={r.title} loading="lazy" />
                <div className="ml-related-body">
                  <span className="ml-related-title">{r.title}</span>
                  <span className="ml-related-price">{formatPrice(r.price)} · {r.city}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .ml-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 820px) { .ml-grid { grid-template-columns: 1.1fr 0.9fr; gap: 32px; align-items: start; } }
        .ml-photo { position: relative; border-radius: 22px; overflow: hidden; background: #f0eadd; aspect-ratio: 4 / 3; }
        .ml-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ml-promoted { position: absolute; top: 14px; inset-inline-start: 14px; background: rgba(42,32,24,.72); color: #fff; font-size: 13px; font-weight: 700; padding: 6px 13px; border-radius: 100px; backdrop-filter: blur(6px); }
        .ml-cond { display: inline-block; font-size: 13px; font-weight: 800; padding: 6px 14px; border-radius: 100px; }
        .ml-title { font-size: 30px; font-weight: 900; line-height: 1.25; letter-spacing: -1px; margin: 12px 0 8px; color: var(--ink); }
        .ml-price { font-size: 32px; font-weight: 900; color: var(--brand-dark, #8a5a2b); margin-bottom: 22px; }
        .ml-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; margin: 0 0 24px; }
        .ml-meta dt { font-size: 12.5px; color: #8a7c66; font-weight: 700; margin-bottom: 2px; }
        .ml-meta dd { margin: 0; font-size: 15.5px; font-weight: 700; color: var(--ink); }
        .ml-desc { padding: 26px; margin-top: 28px; }
        .ml-desc h2 { font-size: 20px; font-weight: 900; margin: 0 0 12px; }
        .ml-desc p { margin: 0; font-size: 16px; line-height: 1.8; color: var(--text); }
        .ml-safety { margin-top: 24px; background: rgba(201,154,91,.08); border: 1px solid var(--brand-light, #e8c887); border-radius: 20px; padding: 26px; }
        .ml-safety h2 { font-size: 19px; font-weight: 900; margin: 0 0 16px; color: var(--ink); }
        .ml-safety ul { list-style: none; margin: 0 0 16px; padding: 0; display: grid; gap: 11px; }
        .ml-safety li { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; line-height: 1.6; color: #4a4137; }
        .ml-safety li span { color: var(--brand-dark, #8a5a2b); font-weight: 900; flex: none; }
        .ml-safety-note { margin: 0; font-size: 13px; line-height: 1.7; color: #7a6c58; border-top: 1px solid rgba(201,154,91,.3); padding-top: 14px; }
        .ml-related { margin-top: 40px; }
        .ml-related h2 { font-size: 20px; font-weight: 900; margin: 0 0 16px; }
        .ml-related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
        .ml-related-card { display: block; background: #fff; border: 1px solid rgba(42,32,24,.08); border-radius: 16px; overflow: hidden; text-decoration: none; color: inherit; transition: transform .2s, box-shadow .2s; }
        .ml-related-card:hover { transform: translateY(-3px); box-shadow: 0 8px 22px rgba(42,32,24,.1); }
        .ml-related-card img { width: 100%; height: 130px; object-fit: cover; display: block; }
        .ml-related-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
        .ml-related-title { font-size: 14.5px; font-weight: 800; color: var(--ink); line-height: 1.35; }
        .ml-related-price { font-size: 13px; color: #8a7c66; font-weight: 700; }
      `}</style>
    </main>
  )
}
