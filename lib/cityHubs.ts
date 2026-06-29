/* ════════════════════════════════════════════════════════════
   עמודי עיר (SEO) - "כל מה שכלב צריך ב<עיר>".
   מצרף, פר עיר, את כל הדאטה הציבורי שכבר יש לנו: גינות כלבים
   ומסלולי טיול - לפי קרבה גאוגרפית למרכז העיר.
   ════════════════════════════════════════════════════════════ */

import { communities, type Community } from './communities'
import { allDogParks } from './dogParksAll'
import { manualParks } from './dogParksManual'
import { demoWalks as walks, type Walk } from './walks'
import type { DogPark } from '@/types'

/** מרחק מקורב בק״מ (קו ישר, מספיק לצירוף עירוני). */
function distKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  return Math.hypot((aLat - bLat) * 111, (aLng - bLng) * 94)
}

export type CityHub = {
  community: Community
  parks: DogPark[]
  walks: Walk[]
}

/** מרחק מקסימלי (ק״מ) לשיוך פריט לעיר הקרובה ביותר. */
const PARK_MAX_KM = 6
const R_WALKS = 30 // טיולים נשארים אזוריים (מעטים, פרוסים)

/** רדיוס (לטיולים בלבד). */
function near<T extends { lat: number; lng: number }>(items: T[], lat: number, lng: number, radius: number): T[] {
  return items
    .map((it) => ({ it, d: distKm(lat, lng, it.lat, it.lng) }))
    .filter((o) => o.d <= radius)
    .sort((a, b) => a.d - b.d)
    .map((o) => o.it)
}

/**
 * שם העיר (community) הקרובה ביותר לנקודה - או null אם כולן רחוקות מ-maxKm.
 * כך כל גינה משויכת לעיר אחת בלבד (ולא נבלעת לערים שכנות חופפות).
 */
function nearestCommunity(lat: number, lng: number, maxKm: number): string | null {
  let best: string | null = null
  let bestD = Infinity
  for (const c of communities) {
    const d = distKm(lat, lng, c.lat, c.lng)
    if (d < bestD) {
      bestD = d
      best = c.slug
    }
  }
  return bestD <= maxKm ? best : null
}

/** פריטים שהעיר הקרובה אליהם ביותר היא slug - ממוינים לפי קרבה. */
function nearestSorted<T extends { lat: number; lng: number }>(items: T[], slug: string, lat: number, lng: number, maxKm: number): T[] {
  return items
    .filter((it) => nearestCommunity(it.lat, it.lng, maxKm) === slug)
    .map((it) => ({ it, d: distKm(lat, lng, it.lat, it.lng) }))
    .sort((a, b) => a.d - b.d)
    .map((o) => o.it)
}

export function getCityHub(slug: string): CityHub | null {
  const community = communities.find((c) => c.slug === slug)
  if (!community) return null
  // עיר מתועדת: כל הגינות הרשמיות לפי שדה העיר המפורש (כל הרשימה, לא לפי מרחק).
  const manualHere = manualParks
    .filter((p) => (p.city || '') === community.name)
    .map((p) => ({ p, d: distKm(community.lat, community.lng, p.lat, p.lng) }))
    .sort((a, b) => a.d - b.d)
    .map((o) => o.p)
  const parks =
    manualHere.length > 0
      ? manualHere
      : nearestSorted(allDogParks, slug, community.lat, community.lng, PARK_MAX_KM)
  return {
    community,
    parks,
    walks: near(walks, community.lat, community.lng, R_WALKS),
  }
}

/** רק ערים עם מספיק דאטה כדי שלא ייווצרו עמודים דלים. */
export function cityHubSlugs(): string[] {
  return communities
    .filter((c) => {
      const h = getCityHub(c.slug)
      if (!h) return false
      return h.parks.length + h.walks.length >= 3
    })
    .map((c) => c.slug)
}

/** כל העמודים שנוצרים, עם ספירות - לעמוד האינדקס ולקישור פנימי. */
export function allCityHubs(): CityHub[] {
  return cityHubSlugs()
    .map((s) => getCityHub(s)!)
    .sort((a, b) => b.parks.length - a.parks.length)
}
