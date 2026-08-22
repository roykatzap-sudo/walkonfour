import type { ReactNode } from 'react'
import Link from 'next/link'
import { BreedMatcher } from '@/components/tools/BreedMatcher'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { RelatedContentBlock } from '@/components/shared/RelatedContentBlock'
import {
  JsonLd,
  breadcrumbSchema,
  breedListSchema,
  faqSchema,
  softwareAppSchema,
} from '@/components/seo/JsonLd'
import { buildMetadata, ogImageUrl } from '@/lib/seo'
import { breeds } from '@/lib/breeds'
import { breedSeo } from '@/lib/breedSeo'
import {
  BREED_COUNT,
  MATCH_FAQ,
  MATCH_LEAD,
  MATCH_OUTBOUND,
  MATCH_SECTIONS,
  QUESTION_COUNT,
} from '@/lib/matchContent'

export const metadata = buildMetadata({
  title: 'איזה כלב מתאים לי? חידון התאמת גזע חינם',
  description: `עונים על ${QUESTION_COUNT} שאלות על הבית, הילדים, הזמן והקיץ הישראלי, ומקבלים 3 גזעים מתוך ${BREED_COUNT} עם הסבר למה דווקא הם. חינם, בלי הרשמה, התוצאה מופיעה מיד על המסך.`,
  path: '/match',
  image: ogImageUrl({
    title: 'איזה כלב מתאים לי?',
    subtitle: `${QUESTION_COUNT} שאלות, 3 גזעים מתוך ${BREED_COUNT}`,
    tag: 'חידון חינמי',
  }),
})

/* ────────────────────────────────────────────
   רינדור פסקה עם קישורים פנימיים בתחביר
   [[טקסט|/נתיב]]. הטקסט עצמו נשמר ב-lib/matchContent.ts
   כמחרוזת אחת, כדי שאותו משפט יזין גם קופי וגם סכמה.
   ──────────────────────────────────────────── */
function renderParagraph(text: string) {
  const re = /\[\[([^\]|]+)\|([^\]]+)\]\]/g
  const parts: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const start = m.index
    if (start > last) parts.push(text.slice(last, start))
    parts.push(
      <Link
        key={`l${key++}`}
        href={m[2]}
        style={{ color: 'var(--brand-dark)', fontWeight: 800, textDecoration: 'underline' }}
      >
        {m[1]}
      </Link>
    )
    last = start + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export default function MatchPage() {
  const structuredData = [
    breadcrumbSchema([
      { name: 'דף הבית', path: '/' },
      { name: 'כלים', path: '/tools' },
      { name: 'איזה כלב מתאים לי', path: '/match' },
    ]),
    softwareAppSchema({
      name: 'איזה כלב מתאים לי - חידון התאמת גזע',
      description: `חידון של ${QUESTION_COUNT} שאלות על אורח החיים שמחזיר שלושה גזעי כלבים מתוך ${BREED_COUNT}, כולל שקלול של החום בקיץ הישראלי.`,
      path: '/match',
      category: 'LifestyleApplication',
      countriesSupported: 'IL',
      audienceType: 'מי ששוקל לאמץ או לקנות כלב',
      featureList: [
        `${QUESTION_COUNT} שאלות על מגורים, פעילות, ילדים, ניסיון, זמן פנוי, רגישות לשיער, אקלים וייעוד`,
        `שלוש התאמות מדורגות מתוך ${BREED_COUNT} גזעים`,
        'הסבר קצר לכל התאמה, ולא רק אחוז',
        'שקלול החום הישראלי בבחירת הגזע',
        'חישוב מקומי בדפדפן, בלי הרשמה ובלי שליחת התשובות לשרת',
      ],
    }),
    breedListSchema({
      name: `${BREED_COUNT} גזעי הכלבים שהחידון בודק`,
      description: 'רשימת הגזעים שנכללים בחישוב ההתאמה, כולל הכלב הכנעני וכלב מעורב.',
      breeds: breeds.map((b) => ({
        slug: b.slug,
        name: b.name,
        en: b.en,
        wikidataId: breedSeo[b.slug]?.wikidataId,
      })),
    }),
    faqSchema(MATCH_FAQ),
  ]

  return (
    <main className="page" style={{ maxWidth: 980 }}>
      <JsonLd data={structuredData} />

      {/* עיצוב מקומי בלבד - לא נוגעים ב-globals.css */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .match-section-h { position: relative; padding-top: 20px; }
            .match-section-h::before {
              content: ''; position: absolute; top: 0; inset-inline-start: 0;
              width: 52px; height: 3px; border-radius: 2px;
              background: linear-gradient(90deg,#c99a5b,#e8c887);
            }
            .match-faq {
              background: #fff; border: 1px solid rgba(201,154,91,.22);
              border-radius: 14px; padding: 14px 18px;
              transition: box-shadow var(--kv-dur-2,.34s) var(--kv-ease-warm,ease);
            }
            .match-faq[open] { box-shadow: 0 6px 20px rgba(42,32,24,.08); }
            .match-faq:focus-within { outline: 3px solid #c99a5b; outline-offset: 2px; }
            .match-faq summary { list-style: none; }
            .match-faq summary::-webkit-details-marker { display: none; }
            .match-breed-grid {
              display: grid; gap: 10px; margin-top: 16px;
              grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
            }
            .match-breed-grid a {
              display: block; padding: 12px 14px; border-radius: 12px;
              background: linear-gradient(165deg, #fffdf8, #fbf7ef);
              border: 1.5px solid rgba(201,154,91,.2);
              color: var(--ink); text-decoration: none;
              font-size: 16px; font-weight: 800; line-height: 1.4;
            }
            @media (prefers-reduced-motion: reduce) { .match-faq { transition: none; } }
          `,
        }}
      />

      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '52px 28px 44px',
          marginBottom: 36,
          textAlign: 'center',
          background: 'linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.12)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag" style={{ fontSize: 14 }}>
            החידון החינמי לבחירת גזע
          </span>
          <h1 className="page-title grad-text" style={{ marginTop: 10 }}>
            איזה כלב מתאים לי? חידון התאמת גזע ב-{QUESTION_COUNT} שאלות
          </h1>
          {/* פסקת התשובה הישירה - חייבת להיות ב-HTML של השרת, מעל החידון */}
          <p
            style={{
              maxWidth: 680,
              margin: '14px auto 0',
              fontSize: 17,
              lineHeight: 1.8,
              color: '#3a3128',
            }}
          >
            {MATCH_LEAD}
          </p>
        </div>
      </section>

      {/* ── החידון ── */}
      <BreedMatcher />

      {/* ── תוכן, כולו מתחת לחידון ── */}
      <article style={{ marginTop: 44 }}>
        {MATCH_SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="kv-reveal" style={{ marginBottom: 30 }}>
            <h2
              className="match-section-h"
              style={{ fontSize: 25, fontWeight: 900, marginBottom: 12, color: '#2a2018' }}
            >
              {s.heading}
            </h2>
            {s.paragraphs.map((p, j) => (
              <p
                key={j}
                style={{
                  fontSize: 16.5,
                  lineHeight: 1.9,
                  color: '#3a3128',
                  marginBottom: 14,
                  maxWidth: '66ch',
                }}
              >
                {renderParagraph(p)}
              </p>
            ))}

            {/* רשימת הגזעים הגלויה - היא שהופכת את סכמת ה-ItemList לחוקית,
                והיא גם מה שהופך את העמוד מקצה-מבוי סריקה לרכזת קישורים. */}
            {s.id === 'breeds-list' && (
              <div className="match-breed-grid" data-kv-stagger>
                {breeds.map((b) => (
                  <Link key={b.slug} href={`/breeds/${b.slug}`} className="kv-lift kv-press">
                    {b.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </article>

      {/* ── שאלות נפוצות. אותו מערך מזין את הסכמה. ── */}
      <section className="kv-reveal" style={{ marginTop: 8 }} aria-labelledby="match-faq-h">
        <h2
          id="match-faq-h"
          className="match-section-h"
          style={{ fontSize: 25, fontWeight: 900, marginBottom: 14, color: '#2a2018' }}
        >
          שאלות נפוצות על בחירת גזע
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} data-kv-stagger>
          {MATCH_FAQ.map((f, i) => (
            <details key={i} className="match-faq">
              <summary
                className="kv-press"
                style={{ cursor: 'pointer', fontWeight: 800, fontSize: 16.5, color: '#2a2018', lineHeight: 1.5 }}
              >
                {f.q}
              </summary>
              <p style={{ margin: '10px 0 0', fontSize: 16.5, lineHeight: 1.9, color: '#3a3128' }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <RelatedContentBlock heading="השאלות הבאות אחרי שבוחרים גזע" items={MATCH_OUTBOUND} />
    </main>
  )
}
