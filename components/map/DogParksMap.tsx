'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import type * as L from 'leaflet'
import type { DogPark } from '@/types'
import { fallbackParks, fetchParksFromOSM, MAP_CITIES, withCities } from '@/lib/dogParks'
import { bakedParks } from '@/lib/dogParksBaked'
import { allDogParks, withManual } from '@/lib/dogParksAll'
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
  const approvedMarkersRef = useRef<L.Marker[]>([])
  const reportModeRef = useRef(false)

  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [showDF, setShowDF] = useState(true)
  const [mapReady, setMapReady] = useState(false)
  const [count, setCount] = useState(0)
  // דיווח על גינה חסרה
  const [reportMode, setReportMode] = useState(false)
  const [reportPoint, setReportPoint] = useState<{ lat: number; lng: number } | null>(null)
  const [rName, setRName] = useState('')
  const [rNote, setRNote] = useState('')
  const [rState, setRState] = useState<'idle' | 'sending' | 'done' | 'err' | 'noconfig'>('idle')
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
    const openingHours = park.opening_hours ? escapeHtml(park.opening_hours) : null
    const surface = park.surface ? escapeHtml(park.surface) : null
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${park.lat},${park.lng}`
    const websiteUrl = safeUrl(park.website)
    const websiteRow = websiteUrl
      ? `<div class="pp-row"><a href="${escapeHtml(websiteUrl)}" target="_blank" rel="noopener noreferrer" style="color:#e8c887;font-size:13px">🔗 אתר רשמי</a></div>`
      : ''
    const hoursRow = openingHours
      ? `<div class="pp-row"><span>🕐</span><span>${openingHours}</span></div>`
      : ''
    const surfaceRow = surface
      ? `<div class="pp-row"><span>🌿</span><span>משטח: ${surface}</span></div>`
      : ''
    // אם אין מידע נוסף מעבר לעיר - מציגים שורת עידוד במקום פופאפ ריק.
    const detailRows = `${hoursRow}${surfaceRow}${websiteRow}`
    const body = detailRows
      ? `<hr class="pp-divider">${detailRows}`
      : `<hr class="pp-divider"><div class="pp-row"><span>🐕</span><span>גינה לשחרור רצועה - נווטו והגיעו</span></div>`

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
          ${body}
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

        // מצב דיווח: לחיצה על המפה לוכדת את המיקום של הגינה החסרה
        map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
          if (!reportModeRef.current) return
          reportModeRef.current = false
          setReportMode(false)
          setReportPoint({ lat: e.latlng.lat, lng: e.latlng.lng })
          setRName('')
          setRNote('')
          setRState('idle')
        })

        // טוענים מיד את הדאטה הסטטי (288 גינות, אמין תמיד),
        // ואז מנסים לרענן מ-Overpass ברקע. לא מחליפים אם Overpass
        // מחזיר פחות (כדי שכשל/מענה חלקי לא יקטין את המפה).
        allParks.current = withCities(allDogParks)
        render(allParks.current)
        showNotif(`${allDogParks.length} גינות כלבים בכל הארץ 🐕`)
        fetchParksFromOSM()
          .then((parks) => {
            if (cancelled || parks.length < bakedParks.length * 0.8) return
            allParks.current = withCities(withManual(parks))
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

  // שכבת גינות מאושרות מדיווחי משתמשים
  useEffect(() => {
    const L = LRef.current
    const map = mapRef.current
    if (!L || !map || !mapReady) return
    let cancelled = false
    fetch('/api/park-reports')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data.parks)) return
        approvedMarkersRef.current.forEach((m) => m.remove())
        approvedMarkersRef.current = []
        data.parks.forEach((p: { name: string; city: string | null; note: string | null; coord: [number, number] }) => {
          const m = L.marker(p.coord, {
            icon: L.divIcon({
              className: '',
              html: `<div style="width:32px;height:32px;background:#a97c46;border:2px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 3px 10px rgba(0,0,0,.35);cursor:pointer">🐕</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            }),
          }).addTo(map)
          m.bindPopup(
            `<div class="pp"><div class="pp-top"><div class="pp-ico">🐕</div><div><div class="pp-name">${escapeHtml(p.name)}</div><div class="pp-city">📍 ${escapeHtml(p.city ?? 'ישראל')} · נוסף ע״י הקהילה</div></div></div></div>`,
            { className: 'dp', maxWidth: 240 }
          )
          approvedMarkersRef.current.push(m)
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [mapReady])

  // שליחת דיווח על גינה חסרה
  async function submitReport() {
    if (!reportPoint || rName.trim().length < 2 || rState === 'sending') return
    setRState('sending')
    try {
      const res = await fetch('/api/park-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: rName.trim(), note: rNote.trim() || null, lat: reportPoint.lat, lng: reportPoint.lng }),
      })
      const data = await res.json()
      if (data.ok) setRState('done')
      else if (data.configured === false) setRState('noconfig')
      else setRState('err')
    } catch {
      setRState('err')
    }
  }

  function startReport() {
    reportModeRef.current = true
    setReportMode(true)
    setReportPoint(null)
    showNotif('לחצו על המפה במקום שבו נמצאת הגינה החסרה 📍')
  }

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
        <button
          type="button"
          onClick={startReport}
          aria-pressed={reportMode}
          style={{ background: reportMode ? '#a97c46' : 'rgba(42,32,24,.82)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', borderRadius: 999, padding: '10px 16px', fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}
        >
          🚩 {reportMode ? 'לחצו על המפה…' : 'דווח על גינה חסרה'}
        </button>
        <div className="map-count-chip" aria-live="polite">🐕 {count} גינות</div>
      </div>

      <div className={`map-notif${notifShow ? ' show' : ''}`} role="status" aria-live="polite">
        {notif}
      </div>

      {/* רספונסיביות למובייל: סרגל בקרה ברוחב מלא + סינון ערים גליל אופקי, כדי שהמפה לא תיחנק */}
      <style>{`
        @media (max-width: 720px) {
          .map-controls {
            position: absolute;
            top: 10px;
            left: 12px;
            right: 12px;
            inset-inline: 12px;
            max-width: none;
            width: auto;
            gap: 8px;
          }
          .map-controls .map-search {
            width: 100%;
            box-sizing: border-box;
            font-size: 16px; /* מונע zoom אוטומטי ב-iOS */
          }
          .map-controls .map-city-btns {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            gap: 6px;
            padding-bottom: 4px;
            scrollbar-width: none;
          }
          .map-controls .map-city-btns::-webkit-scrollbar { display: none; }
          .map-controls .mcb {
            flex: 0 0 auto;
            white-space: nowrap;
            font-size: 13px;
          }
          .map-controls .df-toggle {
            width: 100%;
            text-align: center;
          }
          .map-bottom-bar {
            gap: 6px;
            flex-wrap: wrap;
          }
        }
      `}</style>

      {/* ── מודאל דיווח על גינה חסרה ── */}
      {reportPoint && (
        <div
          onClick={() => setReportPoint(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(20,14,8,.55)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: 16 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="דיווח על גינה חסרה"
            style={{ background: '#fff', borderRadius: 20, padding: '24px 22px', width: '100%', maxWidth: 380, boxShadow: '0 24px 60px rgba(0,0,0,.3)' }}
          >
            {rState === 'done' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🐾</div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#241a12' }}>תודה על הדיווח!</div>
                <p style={{ fontSize: 14.5, color: '#6a6155', marginTop: 6, lineHeight: 1.6 }}>
                  נבדוק את הגינה ונוסיף אותה למפה אחרי אימות.
                </p>
                <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setReportPoint(null)}>סגירה</button>
              </div>
            ) : rState === 'noconfig' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🛠️</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#241a12' }}>הדיווחים ייפתחו בקרוב</div>
                <p style={{ fontSize: 14, color: '#6a6155', marginTop: 6, lineHeight: 1.6 }}>אנחנו מסיימים את ההכנות. תודה על הסבלנות!</p>
                <button type="button" className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => setReportPoint(null)}>סגירה</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#241a12', marginBottom: 4 }}>דיווח על גינה חסרה</div>
                <p style={{ fontSize: 13.5, color: '#8a7c66', marginBottom: 16 }}>
                  📍 סימנתם: {reportPoint.lat.toFixed(4)}, {reportPoint.lng.toFixed(4)}
                </p>
                <input
                  value={rName}
                  onChange={(e) => setRName(e.target.value)}
                  placeholder="שם הגינה / מיקום (למשל: גינת כלבים רחוב הרצל)"
                  aria-label="שם הגינה"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 15, marginBottom: 10 }}
                />
                <textarea
                  value={rNote}
                  onChange={(e) => setRNote(e.target.value)}
                  placeholder="פרטים נוספים (לא חובה): שעות, מגודר, כל מה שיעזור לנו לאמת"
                  aria-label="פרטים נוספים"
                  rows={3}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 14.5, resize: 'vertical', fontFamily: 'inherit' }}
                />
                {rState === 'err' && <div style={{ color: '#b04a3a', fontSize: 13, marginTop: 8 }}>משהו השתבש. נסו שוב.</div>}
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button type="button" className="btn btn-primary" disabled={rName.trim().length < 2 || rState === 'sending'} onClick={submitReport} style={{ flex: 1 }}>
                    {rState === 'sending' ? 'שולח…' : 'שליחת דיווח'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setReportPoint(null)}>ביטול</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
