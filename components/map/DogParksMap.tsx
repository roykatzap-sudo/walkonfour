'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import type * as L from 'leaflet'
import type { DogPark } from '@/types'
import { fallbackParks, fetchParksFromOSM, MAP_CITIES, withCities } from '@/lib/dogParks'
import { bakedParks } from '@/lib/dogParksBaked'
import { dogFriendlyGeo } from '@/lib/dogFriendlyGeo'

/** אייקון לפי קטגוריה למקומות הדוג-פרנדלי. */
const DF_CAT_ICON: Record<string, string> = {
  'חוף': '🏖️', 'מסעדה': '🍽️', 'בית קפה': '☕', 'גלידרייה': '🍦',
  'קניון': '🛍️', 'חנות': '🏬', 'לינה': '🏨',
}

/** מקודד תווים מסוכנים כדי למנוע שבירת HTML / XSS בתוכן הפופאפ. */
function escapeHtml(text: string | number | null | undefined): string {
  if (text === null || text === undefined) return ''
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return String(text).replace(/[&<>"']/g, (char) => map[char])
}

/** מחזיר URL רק אם הוא בפרוטוקול בטוח (http/https), אחרת null. */
function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return /^https?:\/\//i.test(url) ? url : null
}

export function DogParksMap() {
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const LRef = useRef<typeof L | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const dfMarkersRef = useRef<L.Marker[]>([])
  const userMarkerRef = useRef<L.Marker | null>(null)
  const allParks = useRef<DogPark[]>([])

  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [showDF, setShowDF] = useState(true)
  const [mapReady, setMapReady] = useState(false)
  const [count, setCount] = useState(0)
  const [notif, setNotif] = useState('')
  const [notifShow, setNotifShow] = useState(false)
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showNotif(msg: string) {
    setNotif(msg)
    setNotifShow(true)
    if (notifTimer.current) clearTimeout(notifTimer.current)
    notifTimer.current = setTimeout(() => setNotifShow(false), 3500)
  }

  function icon(L: typeof import('leaflet'), sel: boolean) {
    const bg = sel ? '#e8c887' : 'rgba(42,32,24,0.92)'
    const sh = sel ? '0 0 20px rgba(232,200,135,0.6)' : '0 4px 14px rgba(232,200,135,0.25)'
    const size = sel ? 38 : 32
    return L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;background:${bg};border:2px solid #e8c887;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${sel ? 17 : 14}px;box-shadow:${sh};cursor:pointer;transition:all .2s">🐕</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  function openPark(park: DogPark) {
    const L = LRef.current!
    const map = mapRef.current!
    markersRef.current.forEach((m) => m.setIcon(icon(L, (m as any).pid === park.id)))
    map.flyTo([park.lat, park.lng], 15, { duration: 0.7 })

    const parkName = escapeHtml(park.name ?? 'גינת כלבים')
    const cityTxt = park.city ? `📍 ${escapeHtml(park.city)}` : '📍 ישראל'
    const openingHours = escapeHtml(park.opening_hours ?? 'לא ידוע')
    const surface = park.surface ? escapeHtml(park.surface) : null
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${park.lat},${park.lng}`
    const websiteUrl = safeUrl(park.website)
    const websiteRow = websiteUrl
      ? `<div class="pp-row"><a href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener noreferrer" style="color:#e8c887;font-size:12px">🔗 אתר רשמי</a></div>`
      : ''
    const surfaceRow = surface
      ? `<div class="pp-row"><span>🌿</span><span>משטח: ${surface}</span></div>`
      : ''

    const popup = L.popup({ className: 'dp', closeButton: true, maxWidth: 260 })
      .setLatLng([park.lat, park.lng])
      .setContent(`
        <div class="pp">
          <div class="pp-top">
            <div class="pp-ico">🐕</div>
            <div>
              <div class="pp-name">${parkName}</div>
              <div class="pp-city">${cityTxt}</div>
            </div>
          </div>
          <hr class="pp-divider">
          <div class="pp-row"><span>🕐</span><span>${openingHours}</span></div>
          ${surfaceRow}
          ${websiteRow}
          <div class="pp-row"><span>🗺️</span><span style="font-size:11px;opacity:.5">${park.lat.toFixed(4)}, ${park.lng.toFixed(4)}</span></div>
          <a class="pp-btn" href="${escapeHtml(navUrl)}" target="_blank" rel="noopener noreferrer" aria-label="נווט עם Google Maps">🗺️ נווט עם Google Maps</a>
        </div>
      `)
    popup.openOn(map)
  }

  function render(parks: DogPark[]) {
    const L = LRef.current!
    const map = mapRef.current!
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []
    parks.forEach((p) => {
      const m = L.marker([p.lat, p.lng], { icon: icon(L, false) }).addTo(map)
      ;(m as any).pid = p.id
      m.on('click', () => openPark(p))
      markersRef.current.push(m)
    })
    setCount(parks.length)
  }

  // init map once
  useEffect(() => {
    let cancelled = false
    import('leaflet')
      .then((mod) => {
        const L = (mod.default ?? mod) as typeof import('leaflet')
        if (cancelled || mapRef.current || !mapEl.current) return
        LRef.current = L
        const map = L.map(mapEl.current, { center: [32.05, 34.85], zoom: 8, zoomControl: false })
        mapRef.current = map
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CartoDB',
          maxZoom: 19,
        }).addTo(map)
        L.control.zoom({ position: 'bottomright' }).addTo(map)
        setMapReady(true)

        // טוענים מיד את הדאטה הסטטי (288 גינות, אמין תמיד),
        // ואז מנסים לרענן מ-Overpass ברקע. לא מחליפים אם Overpass
        // מחזיר פחות (כדי שכשל/מענה חלקי לא יקטין את המפה).
        allParks.current = withCities(bakedParks)
        render(allParks.current)
        showNotif(`${bakedParks.length} גינות כלבים בכל הארץ 🐕`)
        fetchParksFromOSM()
          .then((parks) => {
            if (cancelled || parks.length < bakedParks.length * 0.8) return
            allParks.current = withCities(parks)
            render(allParks.current)
            showNotif(`עודכנו ${parks.length} גינות מ-OpenStreetMap 🐕`)
          })
          .catch(() => {
            /* Overpass לא זמין - נשארים עם הדאטה הסטטי */
          })
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Leaflet import failed:', error)
        showNotif('שגיאה בטעינת המפה - אנא רעננו את העמוד')
      })
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // apply filters
  useEffect(() => {
    if (!mapRef.current || !allParks.current.length) return
    const L = LRef.current!
    const filtered = allParks.current.filter((p) => {
      const s = !search || p.name?.includes(search) || p.city?.includes(search)
      const c = city === 'all' || p.city === city
      return s && c
    })
    render(filtered)
    if (filtered.length > 0 && filtered.length < allParks.current.length) {
      const b = L.latLngBounds(filtered.map((p) => [p.lat, p.lng] as [number, number]))
      mapRef.current.flyToBounds(b, { padding: [60, 60], duration: 0.7, maxZoom: 14 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, city])

  // שכבת מקומות דוג-פרנדלי (toggle)
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map) return
    dfMarkersRef.current.forEach((m) => m.remove())
    dfMarkersRef.current = []
    if (!showDF) return
    dogFriendlyGeo().forEach((p) => {
      const emoji = DF_CAT_ICON[p.category] ?? '🐾'
      const m = L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:30px;height:30px;background:#e8c887;border:2px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 3px 10px rgba(0,0,0,.35);cursor:pointer">${emoji}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(map)
      const q = encodeURIComponent(`${p.name} ${p.city}`)
      const nav = `https://www.google.com/maps/search/?api=1&query=${q}`
      const approxRow = p.approx
        ? '<div class="pp-row"><span style="font-size:11px;opacity:.6">📍 מיקום מקורב לפי עיר - חפשו בגוגל לכתובת המדויקת</span></div>'
        : ''
      m.bindPopup(
        `<div class="pp">
          <div class="pp-top"><div class="pp-ico">${emoji}</div><div>
            <div class="pp-name">${escapeHtml(p.name)}</div>
            <div class="pp-city">📍 ${escapeHtml(p.city)} · ${escapeHtml(p.category)}</div>
          </div></div>
          <hr class="pp-divider">
          <div class="pp-row"><span style="font-size:12px">${escapeHtml(p.note)}</span></div>
          ${approxRow}
          <a class="pp-btn" href="${escapeHtml(nav)}" target="_blank" rel="noopener noreferrer" aria-label="חפש בגוגל מפות">🗺️ פתח בגוגל מפות</a>
        </div>`,
        { className: 'dp', maxWidth: 260 }
      )
      dfMarkersRef.current.push(m)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDF, mapReady])

  function locateMe() {
    if (!navigator.geolocation) {
      showNotif('הדפדפן לא תומך ב-GPS')
      return
    }
    showNotif('מאתר מיקום...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const L = LRef.current!
        const map = mapRef.current!
        userMarkerRef.current?.remove()
        map.flyTo([lat, lng], 14, { duration: 0.8 })
        userMarkerRef.current = L.marker([lat, lng], {
          icon: L.divIcon({ className: '', html: '<div class="user-loc"></div>', iconSize: [20, 20], iconAnchor: [10, 10] }),
        }).addTo(map)
        const pool = allParks.current.length ? allParks.current : fallbackParks
        const near = pool.reduce((a, b) =>
          Math.hypot(a.lat - lat, a.lng - lng) < Math.hypot(b.lat - lat, b.lng - lng) ? a : b
        )
        setTimeout(() => {
          openPark(near)
          const dist = (Math.hypot(near.lat - lat, near.lng - lng) * 111).toFixed(1)
          showNotif(`הגינה הקרובה: ${near.name} (${dist} ק״מ) 🐕`)
        }, 900)
      },
      () => showNotif('לא ניתן לאתר מיקום')
    )
  }

  return (
    <div className="map-wrap">
      <div
        ref={mapEl}
        role="application"
        aria-label="מפת גינות כלבים בישראל"
        style={{ width: '100%', height: '100%' }}
      />

      <div className="map-controls">
        <input
          className="map-search"
          type="search"
          aria-label="חיפוש גינת כלבים לפי עיר, שם או רחוב"
          placeholder="🔍 חפש עיר, גינה, רחוב..."
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
        />
        <div className="map-city-btns" role="group" aria-label="סינון גינות לפי עיר">
          {MAP_CITIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`mcb${city === c.value ? ' on' : ''}`}
              aria-pressed={city === c.value}
              onClick={() => setCity(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`mcb df-toggle${showDF ? ' on' : ''}`}
          aria-pressed={showDF}
          onClick={() => setShowDF((v) => !v)}
          title="הצג/הסתר מקומות שמקבלים כלבים (מסעדות, בתי קפה, חופים ועוד)"
        >
          🦴 מקומות דוג-פרנדלי
        </button>
      </div>

      <div className="map-bottom-bar">
        <button
          type="button"
          className="locate-me-btn"
          aria-label="מצא את מיקומי"
          onClick={locateMe}
        >
          📍 מצא גינות קרובות אלי
        </button>
        <div className="map-count-chip" aria-live="polite">🐕 {count} גינות</div>
      </div>

      <div className={`map-notif${notifShow ? ' show' : ''}`} role="status" aria-live="polite">
        {notif}
      </div>
    </div>
  )
}
