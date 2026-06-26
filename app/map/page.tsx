import { MapTabs } from '@/components/map/MapTabs'

export const metadata = {
  title: 'מפה חיה · כלבניה',
  description:
    'מפת אינטראקטיבית של גינות כלבים פעילות וקהילות לפי עיר ברחבי ישראל. גלו מפגשים וחברים בעיר שלכם.',
}

export default function MapPage() {
  return (
    <main style={{ paddingTop: 92 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <span className="section-tag">המפה החיה של כלבניה</span>
        <h1 className="page-title" style={{ marginTop: 12 }}>כל ישראל על מפה אחת</h1>
        <p className="page-sub" style={{ marginBottom: 28 }}>
          גלה גינות כלבים פעילות והכיר את הקהילה בעיר שלך - הכל במקום אחד.
        </p>
      </div>

      <MapTabs />
    </main>
  )
}
