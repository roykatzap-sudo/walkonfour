'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import type * as L from 'leaflet'
import { communities, type Community } from '@/lib/communities'

export function CommunitiesMap() {
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const LRef = useRef<typeof L | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})

  const [active, setActive] = useState<string>('')
  const [ready, setReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  function icon(L: typeof import('leaflet'), c: Community, sel: boolean) {
    const size = sel ? 52 : 44
    const glow = sel
      ? `0 0 0 4px ${c.accent}33, 0 0 28px ${c.accent}cc`
      : `0 4px 16px ${c.accent}55`
    return L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;background:rgba(42,32,24,0.92);border:2.5px solid ${c.accent};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${sel ? 20 : 17}px;font-weight:800;color:${c.accent};box-shadow:${glow};cursor:pointer;transition:all .2s;font-family:Heebo,sans-serif">🐾</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  function refreshIcons(selSlug: string) {
    const L = LRef.current
    if (!L) return
    communities.forEach((c) => {
      const m = markersRef.current[c.slug]
      if (m) m.setIcon(icon(L, c, c.slug === selSlug))
    })
  }

  function openCommunity(c: Community) {
    const L = LRef.current!
    const map = mapRef.current!
    setActive(c.slug)
    refreshIcons(c.slug)
    map.flyTo([c.lat, c.lng], 12, { duration: 0.7 })
    L.popup({ className: 'dp', closeButton: true, maxWidth: 260 })
      .setLatLng([c.lat, c.lng])
      .setContent(`
        <div class="pp">
          <div class="pp-top">
            <div class="pp-ico" style="background:${c.accent}1a;border-color:${c.accent}40;color:${c.accent}">🐾</div>
            <div>
              <div class="pp-name">${c.name}</div>
              <div class="pp-city">📍 ${c.district}</div>
            </div>
          </div>
          <hr class="pp-divider">
          <div class="pp-row"><span>✨</span><span>קהילה חדשה - הצטרפו ראשונים</span></div>
          <div class="pp-row"><span>🐾</span><span>טיולים, אירועים וקבוצות רכישה ב${c.district}</span></div>
          <a class="pp-btn" href="/community/${c.slug}" aria-label="עבור לקהילת ${c.name}" style="display:block;text-align:center;text-decoration:none;background:${c.accent};color:#fff">לקהילת ${c.name}</a>
        </div>
      `)
      .openOn(map)
  }

  function flyToCity(c: Community) {
    const m = markersRef.current[c.slug]
    if (m) m.fire('click')
    else openCommunity(c)
  }

  useEffect(() => {
    let cancelled = false
    import('leaflet')
      .then((mod) => {
        const L = (mod.default ?? mod) as typeof import('leaflet')
        if (cancelled || mapRef.current || !mapEl.current) return
        LRef.current = L
        const map = L.map(mapEl.current, { center: [31.5, 34.9], zoom: 8, zoomControl: false })
        mapRef.current = map
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CartoDB',
          maxZoom: 19,
        }).addTo(map)
        L.control.zoom({ position: 'bottomright' }).addTo(map)

        communities.forEach((c) => {
          const m = L.marker([c.lat, c.lng], { icon: icon(L, c, false) }).addTo(map)
          m.on('click', () => openCommunity(c))
          markersRef.current[c.slug] = m
        })
        setReady(true)
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Leaflet import failed:', error)
        setMapError('שגיאה בטעינת המפה - אנא רעננו את העמוד')
      })
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="cm-chips" role="group" aria-label="בחירת קהילה לפי עיר">
        {communities.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={`cm-chip${active === c.slug ? ' on' : ''}`}
            aria-pressed={active === c.slug}
            aria-label={`קהילת ${c.name}`}
            style={
              active === c.slug
                ? { borderColor: c.accent, color: c.accent, boxShadow: `0 0 0 1px ${c.accent}, 0 4px 16px ${c.accent}33` }
                : { borderColor: `${c.accent}40` }
            }
            onClick={() => flyToCity(c)}
            disabled={!ready}
          >
            <span style={{ color: c.accent }} aria-hidden="true">🐾</span> {c.name}
          </button>
        ))}
      </div>

      <div className="map-wrap" style={{ borderRadius: 28 }}>
        <div
          ref={mapEl}
          role="application"
          aria-label="מפת קהילות בעלי כלבים בישראל"
          style={{ width: '100%', height: '100%' }}
        />
        {mapError && (
          <div
            role="alert"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              padding: 24,
              background: 'rgba(42,32,24,.82)',
              color: '#fbf7ef',
              fontFamily: 'Heebo, sans-serif',
              fontWeight: 600,
              borderRadius: 28,
            }}
          >
            {mapError}
          </div>
        )}
        <div className="map-bottom-bar">
          <div className="map-count-chip">🐾 {communities.length} קהילות ברחבי הארץ</div>
        </div>
      </div>

      <style>{`
        .cm-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
          justify-content: center;
        }
        .cm-chip {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1.5px solid rgba(232,200,135,.25);
          background: rgba(42,32,24,.55);
          color: #e8f3ec;
          font-family: Heebo, sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s;
          backdrop-filter: blur(6px);
        }
        .cm-chip:hover:not(:disabled) {
          transform: translateY(-2px);
          background: rgba(42,32,24,.8);
        }
        .cm-chip:disabled { opacity: .5; cursor: default; }
      `}</style>
    </div>
  )
}
