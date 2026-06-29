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
      {/* padding רספונסיבי - במובייל המפה כמעט full-width במקום צרה */}
      <style dangerouslySetInnerHTML={{ __html: `
        .map-canvas-wrap { padding: 0 52px; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 720px) { .map-canvas-wrap { padding: 0 10px; } }
      ` }} />
      <div className="map-section-inner">
        <div className="map-header r on">
          <div>
            <span className="section-tag">גינות כלבים</span>
            <h2 className="map-title">
              מצא גינה <em>קרובה אליך</em>
            </h2>
          </div>
          <p className="map-sub">
            621 גינות כלבים בכל הארץ - לחצו "גינות לידי" לראות את הקרובות.
          </p>
        </div>
      </div>
      <div ref={ref} className="map-canvas-wrap">
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
