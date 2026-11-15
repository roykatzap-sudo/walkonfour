import { breeds } from '@/lib/breeds'
import { JsonLd, breedListSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { getBreedSeo } from '@/lib/breedSeo'
import { BreedGallery } from '@/components/breeds/BreedGallery'
import { FloatingShapes } from '@/components/fx/FloatingShapes'

const BREEDS_OG = ogImageUrl({ title: `${breeds.length} גזעי כלבים`, subtitle: 'איזה כלב באמת מתאים לכם?', tag: 'מדריך הגזעים' })

export const metadata = {
  alternates: { canonical: '/breeds' },
  openGraph: {
    title: 'גזעי כלבים - כל הגזעים הנפוצים בישראל',
    url: '/breeds',
    type: 'website',
    locale: 'he_IL',
    images: [{ url: BREEDS_OG, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: [BREEDS_OG] },
  title: 'גזעי כלבים - כל הגזעים הנפוצים בישראל | קהילה על ארבע',
  description:
    `מדריך גזעי כלבים מלא: סוגי כלבים, איזה כלב מתאים לכם, כלב לדירה, כלב לילדים - אופי, גודל, נטייה לתוקפנות, טיפוח ואילוף ל-${breeds.length} הגזעים הנפוצים בישראל.`,
  keywords: ['גזעי כלבים', 'סוגי כלבים', 'איזה כלב מתאים לי', 'כלב לדירה', 'כלב לילדים', 'מדריך גזעי כלבים'],
}

export default function BreedsPage() {
  return (
    <main className="page">
      <JsonLd
        data={breedListSchema({
          name: 'גזעי כלבים נפוצים בישראל',
          description: `${breeds.length} גזעי כלבים עם פרופיל מלא: אופי, גודל, התאמה למשפחה, בריאות ועלות גידול.`,
          breeds: breeds.map((b) => ({ slug: b.slug, name: b.name, en: b.en, wikidataId: getBreedSeo(b.slug)?.wikidataId })),
        })}
      />
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '56px 28px',
          marginBottom: 40,
          textAlign: 'center',
          background:
            'radial-gradient(560px 280px at 50% 0%, rgba(232,200,135,.22), transparent 70%), linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.14)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <FloatingShapes />
        <div className="kv-fade-in kv-reveal" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">מדריך הגזעים</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            איזה כלב באמת מתאים לכם?
          </h1>
          {/* מבטא זהב חתום מתחת לכותרת - נצנוץ חד-פעמי עם החשיפה */}
          <span className="kv-shimmer-line" aria-hidden style={{ margin: '14px auto 0' }} />
          <p className="page-sub" style={{ maxWidth: 640, margin: '12px auto 0' }}>
            {breeds.length} גזעים, מהכנעני שגדל פה ועד הסנט ברנרד הענק. כתבנו על כל אחד בכנות -
            כולל הנחירות, מי לא ישרוד את אוגוסט בלי מיזוג, ומי יפרק לכם את הסלון מרוב שעמום.
            סננו לפי גודל, אנרגיה והתאמה לילדים.
          </p>
          {/* עקבות כף רגל - רגע ממותג, חי, שנחשף בזו אחר זו כשההירו נכנס */}
          <div className="kv-paw-trail" aria-hidden style={{ marginTop: 26 }}>
            <i /><i /><i /><i /><i />
          </div>
        </div>
      </section>

      {/* ── הגלריה ── */}
      <BreedGallery breeds={breeds} />
    </main>
  )
}
