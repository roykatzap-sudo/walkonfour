import type { DogPark } from '@/types'

/** נתוני גיבוי - נטענים אם Overpass API נכשל. */
export const fallbackParks: DogPark[] = [
  { id: 1, name: 'גינת כלבים פארק הירקון', city: 'תל אביב', lat: 32.0956, lng: 34.7985, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 2, name: 'גינת כלבים שד׳ בן גוריון', city: 'תל אביב', lat: 32.082, lng: 34.769, opening_hours: '24/7', surface: null, website: null },
  { id: 3, name: 'גינת כלבים פארק ציטרון', city: 'תל אביב', lat: 32.0505, lng: 34.756, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 4, name: 'גינת כלבים נמל תל אביב', city: 'תל אביב', lat: 32.1007, lng: 34.7774, opening_hours: '07:00-20:00', surface: null, website: null },
  { id: 5, name: 'גינת כלבים רמת אביב', city: 'תל אביב', lat: 32.1165, lng: 34.803, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 6, name: 'גינת כלבים פלורנטין', city: 'תל אביב', lat: 32.058, lng: 34.772, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 7, name: 'גינת כלבים גן סאקר', city: 'ירושלים', lat: 31.7767, lng: 35.2044, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 8, name: 'גינת כלבים קטמון', city: 'ירושלים', lat: 31.759, lng: 35.204, opening_hours: '24/7', surface: null, website: null },
  { id: 9, name: 'גינת כלבים רמות', city: 'ירושלים', lat: 31.8224, lng: 35.1757, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 10, name: 'גינת כלבים גן הזיכרון חיפה', city: 'חיפה', lat: 32.8094, lng: 34.9897, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 11, name: 'גינת כלבים הדר הכרמל', city: 'חיפה', lat: 32.8135, lng: 35.004, opening_hours: '24/7', surface: null, website: null },
  { id: 12, name: 'גינת כלבים פארק הלאומי', city: 'רמת גן', lat: 32.0834, lng: 34.8214, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 13, name: 'גינת כלבים נורדיה', city: 'רמת גן', lat: 32.077, lng: 34.814, opening_hours: '24/7', surface: null, website: null },
  { id: 14, name: 'גינת כלבים פארק הגעש', city: 'נתניה', lat: 32.3215, lng: 34.8573, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 15, name: 'גינת כלבים עיר ימים', city: 'נתניה', lat: 32.334, lng: 34.868, opening_hours: '24/7', surface: null, website: null },
  { id: 16, name: 'גינת כלבים פארק האשלג', city: 'ראשון לציון', lat: 31.974, lng: 34.782, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 17, name: 'גינת כלבים פארק ים', city: 'הרצליה', lat: 32.1668, lng: 34.8012, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 18, name: 'גינת כלבים פארק רעננה', city: 'רעננה', lat: 32.1839, lng: 34.8707, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 19, name: 'גינת כלבים אם המושבות', city: 'פתח תקווה', lat: 32.0968, lng: 34.8878, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 20, name: 'גינת כלבים נחל הבשור', city: 'חולון', lat: 32.0111, lng: 34.7697, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 21, name: 'גינת כלבים נווה עמית', city: 'רחובות', lat: 31.9011, lng: 34.811, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 22, name: 'גינת כלבים פארק הנגב', city: 'באר שבע', lat: 31.253, lng: 34.7915, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 23, name: 'גינת כלבים אשדוד', city: 'אשדוד', lat: 31.8014, lng: 34.6508, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 24, name: 'גינת כלבים מודיעין', city: 'מודיעין', lat: 31.8965, lng: 35.0096, opening_hours: '06:00-22:00', surface: null, website: null },
  { id: 25, name: 'גינת כלבים גבעתיים', city: 'גבעתיים', lat: 32.0729, lng: 34.8118, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 26, name: 'גינת כלבים בת ים', city: 'בת ים', lat: 32.0229, lng: 34.7497, opening_hours: '24/7', surface: null, website: null },
  { id: 27, name: 'גינת כלבים אילת', city: 'אילת', lat: 29.5577, lng: 34.9519, opening_hours: '06:00-20:00', surface: null, website: null },
  { id: 28, name: 'גינת כלבים נהריה', city: 'נהריה', lat: 33.0077, lng: 35.0943, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 29, name: 'גינת כלבים טבריה', city: 'טבריה', lat: 32.794, lng: 35.531, opening_hours: '06:00-21:00', surface: null, website: null },
  { id: 30, name: 'גינת כלבים כפר סבא', city: 'כפר סבא', lat: 32.184, lng: 34.912, opening_hours: '06:00-22:00', surface: null, website: null },
]

export const MAP_CITIES = [
  { label: 'הכל', value: 'all' },
  { label: 'ת״א', value: 'תל אביב' },
  { label: 'ירושלים', value: 'ירושלים' },
  { label: 'חיפה', value: 'חיפה' },
  { label: 'רמת גן', value: 'רמת גן' },
  { label: 'נתניה', value: 'נתניה' },
  { label: 'ראשל״צ', value: 'ראשון לציון' },
  { label: 'הרצליה', value: 'הרצליה' },
  { label: 'רעננה', value: 'רעננה' },
]

/**
 * מרכזי הערים לסינון גאוגרפי. רוב גינות ה-OSM מגיעות בלי תגית
 * addr:city, ולכן מסננים לפי קרבה למרכז העיר במקום לפי טקסט.
 */
const CITY_CENTERS: { city: string; lat: number; lng: number }[] = [
  { city: 'תל אביב', lat: 32.0809, lng: 34.7806 },
  { city: 'ירושלים', lat: 31.7683, lng: 35.2137 },
  { city: 'חיפה', lat: 32.794, lng: 34.9896 },
  { city: 'רמת גן', lat: 32.07, lng: 34.8235 },
  { city: 'נתניה', lat: 32.3215, lng: 34.8532 },
  { city: 'ראשון לציון', lat: 31.973, lng: 34.7925 },
  { city: 'הרצליה', lat: 32.1624, lng: 34.8443 },
  { city: 'רעננה', lat: 32.1847, lng: 34.8707 },
]

/** מרחק מקורב בק״מ בין שתי נקודות (קו ישר, מספיק לסינון עירוני). */
function distKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  return Math.hypot((aLat - bLat) * 111, (aLng - bLng) * 94)
}

/** שם העיר הקרובה ביותר (עד 8 ק״מ), אחרת מחרוזת ריקה. */
export function nearestCity(lat: number, lng: number): string {
  let best = ''
  let bestD = Infinity
  for (const c of CITY_CENTERS) {
    const d = distKm(lat, lng, c.lat, c.lng)
    if (d < bestD) {
      bestD = d
      best = c.city
    }
  }
  return bestD <= 8 ? best : ''
}

/** ממלא את שדה ה-city לפי קרבה גאוגרפית, היכן שהוא ריק. */
export function withCities(parks: DogPark[]): DogPark[] {
  return parks.map((p) => (p.city ? p : { ...p, city: nearestCity(p.lat, p.lng) }))
}

/** מבנה אלמנט בודד בתגובת Overpass API. */
type OverpassElement = {
  id?: number
  lat?: number
  lon?: number
  center?: { lat?: number; lon?: number }
  tags?: Record<string, string>
  [key: string]: unknown
}

/** מבנה התגובה המלאה מ-Overpass API. */
type OverpassResponse = {
  elements?: unknown[]
  [key: string]: unknown
}

/** type guard - מוודא שאלמנט הוא אובייקט תקין לפני קריאת שדות מקוננים. */
function isOverpassElement(obj: unknown): obj is OverpassElement {
  return obj !== null && typeof obj === 'object'
}

/** מושך גינות כלבים חיות מ-OpenStreetMap דרך Overpass API. */
export async function fetchParksFromOSM(): Promise<DogPark[]> {
  const query = `[out:json][timeout:25];
(
  node["leisure"="dog_park"](29.4,34.2,33.4,35.9);
  way["leisure"="dog_park"](29.4,34.2,33.4,35.9);
  relation["leisure"="dog_park"](29.4,34.2,33.4,35.9);
  node["amenity"="dog_park"](29.4,34.2,33.4,35.9);
  way["amenity"="dog_park"](29.4,34.2,33.4,35.9);
);
out center;`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
      signal: controller.signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    if (!res.ok) {
      throw new Error(`Overpass API error: ${res.status}`)
    }

    const data = (await res.json()) as OverpassResponse
    const elements: OverpassElement[] = Array.isArray(data.elements)
      ? data.elements.filter(isOverpassElement)
      : []

    return elements
      .map((el, i): DogPark => {
        const lat = el.lat ?? el.center?.lat ?? 0
        const lng = el.lon ?? el.center?.lon ?? 0
        const tags = el.tags || {}
        return {
          id: el.id || i,
          lat,
          lng,
          name: tags.name || tags['name:he'] || 'גינת כלבים',
          city: tags['addr:city'] || tags['addr:town'] || tags['is_in:city'] || '',
          opening_hours: tags.opening_hours || null,
          surface: tags.surface || null,
          website: tags.website || null,
        }
      })
      .filter((p) => p.lat && p.lng)
  } finally {
    clearTimeout(timeout)
  }
}
