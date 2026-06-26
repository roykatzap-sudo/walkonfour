import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { breeds, getBreed } from '@/lib/breeds'
import { BreedProfile } from '@/components/breeds/BreedProfile'
import { absoluteUrl, clampDescription, ogImageUrl } from '@/lib/seo'

export function generateStaticParams() {
  return breeds.map((b) => ({ slug: b.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const b = getBreed(params.slug)
  if (!b) return { title: 'גזע לא נמצא · כלבניה' }

  // כותרת+תיאור עם מילות החיפוש הנפוצות: "[גזע]", "אופי", "מתאים לדירה/לילדים", "מחיר", "טיפוח", "אילוף".
  const apt = b.size === 'קטן' ? 'מתאים לדירה' : b.size === 'ענק' ? 'דורש מרחב' : 'מתאים לבית ולדירה'
  const kids = b.goodWithKids ? 'מתאים לילדים' : 'פחות מתאים לילדים קטנים'
  const title = `${b.name} - אופי, התאמה ומדריך הגזע | כלבניה`
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
  return <BreedProfile breed={b} />
}
