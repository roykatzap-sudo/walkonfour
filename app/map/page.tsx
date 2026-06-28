import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { MapSection } from '@/components/map/MapSection'

export const metadata = buildMetadata({
  title: 'מפת גינות כלבים',
  description:
    'מפה אינטראקטיבית של גינות כלבים בכל ישראל - מאות גינות לשחרור רצועה, סינון לפי עיר, ומקומות דוג-פרנדלי.',
  path: '/map',
})

export default function MapPage() {
  return (
    <main style={{ paddingTop: 92 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <span className="section-tag">המפה החיה</span>
        <h1 className="page-title" style={{ marginTop: 12 }}>כל גינות הכלבים על מפה אחת</h1>
        <p className="page-sub" style={{ marginBottom: 20 }}>
          מאות גינות כלבים בכל הארץ + מקומות דוג-פרנדלי. סננו לפי עיר ומצאו את הקרובה אליכם.
        </p>
        <Link href="/cities" className="btn btn-ghost" style={{ marginBottom: 28, display: 'inline-block' }}>
          למדריכי הערים →
        </Link>
      </div>

      <MapSection />
    </main>
  )
}
