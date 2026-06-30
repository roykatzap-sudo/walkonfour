import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { breeds, getBreed } from '@/lib/breeds'
import { getBreedDetail } from '@/lib/breedDetails'
import { getBreedSeo } from '@/lib/breedSeo'
import { BreedProfile } from '@/components/breeds/BreedProfile'
import { BreedSeoBlock } from '@/components/breeds/BreedSeoBlock'
import { RelatedBreedsBlock } from '@/components/breeds/RelatedBreedsBlock'
import { comparisons } from '@/lib/comparisons'
import Link from 'next/link'
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
  breedThingSchema,
  faqSchema,
} from '@/components/seo/JsonLd'
import { absoluteUrl, clampDescription, ogImageUrl } from '@/lib/seo'

export function generateStaticParams() {
  return breeds.map((b) => ({ slug: b.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const b = getBreed(params.slug)
  if (!b) return { title: 'גזע לא נמצא · קהילה על ארבע' }

  // כותרת+תיאור עם מילות החיפוש הנפוצות: "[גזע]", "אופי", "מתאים לדירה/לילדים", "מחיר", "טיפוח", "אילוף".
  const apt = b.size === 'קטן' ? 'מתאים לדירה' : b.size === 'ענק' ? 'דורש מרחב' : 'מתאים לבית ולדירה'
  const kids = b.goodWithKids ? 'מתאים לילדים' : 'פחות מתאים לילדים קטנים'
  const title = `${b.name} - אופי, התאמה ומדריך הגזע | קהילה על ארבע`
  const description = clampDescription(
    `כל המידע על ${b.name} (${b.en}): אופי ומזג, ${apt}, ${kids}, גודל ${b.size}, ` +
      `נטייה לתוקפנות, בריאות, טיפוח ואילוף. תוחלת חיים ${b.lifespan} שנים.`,
  )
  const url = absoluteUrl(`/breeds/${b.slug}`)
  const ogImage = absoluteUrl(ogImageUrl({ title: b.name, subtitle: `${b.en} · אופי, התאמה ומדריך הגזע`, tag: 'גזע' }))
  return {
    title,
    description,
    keywords: [b.name, b.en, `${b.name} אופי`, `${b.name} גזע`, `${b.name} מתאים לדירה`, 'גזעי כלבים'],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', locale: 'he_IL', images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export default function BreedPage({ params }: { params: { slug: string } }) {
  const b = getBreed(params.slug)
  if (!b) notFound()

  const detail = getBreedDetail(b.slug)
  const seo = getBreedSeo(b.slug)
  const desc = `מדריך הגזע ${b.name} (${b.en}): אופי, התאמה, בריאות וטיפוח. אורך חיים ${b.lifespan} שנים.`

  // ── Schema graph: Article + Thing(Breed) + FAQPage + BreadcrumbList ──
  const schemas: Record<string, unknown>[] = [
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'גזעי כלבים', path: '/breeds' },
      { name: b.name, path: `/breeds/${b.slug}` },
    ]),
    articleSchema({
      title: `${b.name} - מדריך גזע מלא`,
      description: desc,
      path: `/breeds/${b.slug}`,
      section: 'מדריכי גזעים',
    }),
    breedThingSchema({
      slug: b.slug,
      name: b.name,
      alternateNames: [b.en],
      description: b.blurb,
      wikipediaHeSlug: seo?.wikipediaSlug,
      wikipediaEnSlug: seo?.wikipediaEnSlug,
      wikidataId: seo?.wikidataId,
    }),
  ]
  if (seo?.faq && seo.faq.length > 0) {
    schemas.push(faqSchema(seo.faq))
  }

  return (
    <>
      <JsonLd data={schemas} />
      {/* בלוק SEO חדש - מוצג מעל ה-BreedProfile הוויזואלי המלא */}
      {(seo || detail) && (
        <div className="page" style={{ paddingTop: 84, paddingBottom: 0 }}>
          <BreedSeoBlock breed={b} detail={detail} seo={seo} />
        </div>
      )}
      <BreedProfile breed={b} />
      <div className="page" style={{ paddingTop: 0, paddingBottom: 60, maxWidth: 860 }}>
        {/* קישורים להשוואות הרלוונטיות שמערבות את הגזע */}
        {(() => {
          const related = comparisons.filter((c) => c.breedA === b.slug || c.breedB === b.slug)
          if (related.length === 0) return null
          return (
            <section style={{ marginTop: 28, padding: '20px 22px', background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 16 }}>
              <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 900, color: 'var(--ink)' }}>
                השוואות שמערבות את {b.name}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {related.map((c) => (
                  <Link key={c.slug} href={`/compare/${c.slug}`} className="chip3d" style={{ textDecoration: 'none', fontSize: 14 }}>
                    {c.title.split(' - ')[0]} →
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}
        <RelatedBreedsBlock currentSlug={b.slug} />
      </div>
    </>
  )
}
