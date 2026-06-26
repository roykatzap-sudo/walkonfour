'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const DogParksMap = dynamic(
  () => import('@/components/map/DogParksMap').then((m) => m.DogParksMap),
  {
    ssr: false,
    loading: () => (
      <div className="map-wrap" style={{ display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.4)' }}>
        טוען מפה...
      </div>
    ),
  }
)

export function MapSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  // טוענים את המפה (Leaflet + 300 markers + Overpass) רק כשמתקרבים אליה
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="map-section">
      <div className="map-section-inner">
        <div className="map-header r on">
          <div>
            <span className="section-tag">גינות כלבים</span>
            <h2 className="map-title">
              מצא גינה<em>קרובה אליך</em>
            </h2>
          </div>
          <p className="map-sub">
            מאות גינות כלבים ברחבי ישראל - חפש לפי עיר או לחץ על מצא קרוב אלי.
          </p>
        </div>
      </div>
      <div ref={ref} style={{ padding: '0 52px', maxWidth: 1200, margin: '0 auto' }}>
        {inView ? (
          <DogParksMap />
        ) : (
          <div className="map-wrap" style={{ display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.35)' }}>
            🐕 גוללו לכאן כדי לטעון את מפת הגינות
          </div>
        )}
      </div>
    </section>
  )
}
