import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCommunity, communities } from '@/lib/communities'
import { CityHub } from '@/components/community/CityHub'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_NAME, absoluteUrl, clampDescription, ogImageUrl } from '@/lib/seo'

type Props = { params: { city: string } }

export function generateStaticParams() {
  return communities.map((c) => ({ city: c.slug }))
}

/** תיאור מותאם-SEO-מקומי לעיר - מילות מפתח גיאוגרפיות. */
function cityDescription(name: string, district: string) {
  return clampDescription(
    `קהילת בעלי הכלבים ב${name}: מפגשי כלבים, גינות כלבים, המלצות על וטרינרים, ` +
      `קבוצות רכישה ושירותי פינסיטינג ב${district}. הצטרפו לחבורה המקומית שמטיילת, חוסכת ועוזרת זו לזו.`,
  )
}

export function generateMetadata({ params }: Props): Metadata {
  const c = getCommunity(params.city)
  if (!c) return { title: 'קהילה לא נמצאה · קהילה על ארבע' }
  const title = `כלבים ב${c.name} - קהילת בעלי הכלבים`
  const description = cityDescription(c.name, c.district)
  const url = absoluteUrl(`/community/${c.slug}`)
  const ogImage = absoluteUrl(ogImageUrl({ title: `כלבים ב${c.name}`, subtitle: `קהילת בעלי הכלבים · ${c.district}`, tag: 'קהילה' }))
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: 'website',
      locale: 'he_IL',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title: `${title} | ${SITE_NAME}`, description, images: [ogImage] },
  }
}

export default function CommunityCityPage({ params }: Props) {
  const c = getCommunity(params.city)
  if (!c) notFound()

  const url = absoluteUrl(`/community/${c.slug}`)

  // נתונים מובנים לחיפוש מקומי: פירורי לחם + Place עם קואורדינטות גיאוגרפיות.
  const structuredData = [
    breadcrumbSchema([
      { name: 'דף הבית', path: '/' },
      { name: 'קהילות', path: '/communities' },
      { name: c.name, path: `/community/${c.slug}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `קהילת בעלי הכלבים ב${c.name}`,
      description: cityDescription(c.name, c.district),
      url,
      address: {
        '@type': 'PostalAddress',
        addressLocality: c.name,
        addressRegion: c.district,
        addressCountry: 'IL',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: c.lat,
        longitude: c.lng,
      },
      isPartOf: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: absoluteUrl('/'),
      },
    },
  ]

  return (
    <>
      <JsonLd data={structuredData} />
      <CityHub community={c} />
    </>
  )
}
