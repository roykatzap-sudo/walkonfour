import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { MapSection } from '@/components/map/MapSection'

export const metadata = buildMetadata({
  title: 'מפת גינות כלבים',
  description:
    'מפה אינטראקטיבית של גינות כלבים בכל ישראל - 621 גינות לשחרור רצועה, סינון לפי עיר, ולחיצה אחת למצוא את הקרובה אליכם.',
  path: '/map',
})

export default function MapPage() {
  return (
    <main style={{ paddingTop: 92 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <span className="section-tag">המפה החיה</span>
        <h1 className="page-title" style={{ marginTop: 12 }}>כל גינות הכלבים על מפה אחת</h1>
        <p className="page-sub" style={{ marginBottom: 20 }}>
          621 גינות כלבים בכל הארץ. סננו לפי עיר או לחצו על "גינות לידי" כדי לראות את הקרובות אליכם.
        </p>
        <Link href="/cities" className="btn btn-ghost" style={{ marginBottom: 28, display: 'inline-block' }}>
          למדריכי הערים →
        </Link>
      </div>

      <MapSection />
    </main>
  )
}
