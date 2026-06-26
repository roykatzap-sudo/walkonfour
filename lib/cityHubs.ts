/* ════════════════════════════════════════════════════════════
   עמודי עיר (SEO) - "כל מה שכלב צריך ב<עיר>".
   מצרף, פר עיר, את כל הדאטה הציבורי שכבר יש לנו: גינות כלבים,
   מקומות דוג-פרנדלי, ומסלולי טיול - לפי קרבה גאוגרפית למרכז העיר.
   ════════════════════════════════════════════════════════════ */

import { communities, type Community } from './communities'
import { bakedParks } from './dogParksBaked'
import { demoWalks as walks, type Walk } from './walks'
import { dogFriendlyGeo, type DFGeo } from './dogFriendlyGeo'
import type { DogPark } from '@/types'

/** מרחק מקורב בק״מ (קו ישר, מספיק לצירוף עירוני). */
function distKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  return Math.hypot((aLat - bLat) * 111, (aLng - bLng) * 94)
}

export type CityHub = {
  community: Community
  parks: DogPark[]
  walks: Walk[]
  dogFriendly: DFGeo[]
}

const DF = dogFriendlyGeo()

/** רדיוסים (ק״מ) לצירוף כל סוג דאטה לעיר. */
const R_PARKS = 7
const R_DF = 12
const R_WALKS = 30

function near<T extends { lat: number; lng: number }>(items: T[], lat: number, lng: number, radius: number): T[] {
  return items
    .map((it) => ({ it, d: distKm(lat, lng, it.lat, it.lng) }))
    .filter((o) => o.d <= radius)
    .sort((a, b) => a.d - b.d)
    .map((o) => o.it)
}

export function getCityHub(slug: string): CityHub | null {
  const community = communities.find((c) => c.slug === slug)
  if (!community) return null
  return {
    community,
    parks: near(bakedParks, community.lat, community.lng, R_PARKS),
    dogFriendly: near(DF, community.lat, community.lng, R_DF),
    walks: near(walks, community.lat, community.lng, R_WALKS),
  }
}

/** רק ערים עם מספיק דאטה כדי שלא ייווצרו עמודים דלים. */
export function cityHubSlugs(): string[] {
  return communities
    .filter((c) => {
      const h = getCityHub(c.slug)
      if (!h) return false
      return h.parks.length + h.dogFriendly.length + h.walks.length >= 3
    })
    .map((c) => c.slug)
}

/** כל העמודים שנוצרים, עם ספירות - לעמוד האינדקס ולקישור פנימי. */
export function allCityHubs(): CityHub[] {
  return cityHubSlugs()
    .map((s) => getCityHub(s)!)
    .sort((a, b) => b.parks.length + b.dogFriendly.length - (a.parks.length + a.dogFriendly.length))
}
