/* ════════════════════════════════════════════════════════════
   מקור גינות מאוחד: OSM (bakedParks) + רשימות עירוניות רשמיות
   (manualParks).
   כלל: בעיר עם רשימה רשמית, הרשימה היא ה-source of truth -
   משמיטים את כל גינות ה-OSM באזור שלה (כדי לא לנפח מעבר למספר
   הרשמי). בערים בלי רשימה רשמית - מציגים את OSM כרגיל.
   ════════════════════════════════════════════════════════════ */
import type { DogPark } from '@/types'
import { bakedParks } from './dogParksBaked'
import { manualParks } from './dogParksManual'

function distKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  return Math.hypot((aLat - bLat) * 111, (aLng - bLng) * 94)
}

/** מרכזי הערים המתועדות (centroid של הגינות הרשמיות בכל עיר). */
const curatedCenters: { lat: number; lng: number }[] = (() => {
  const groups: Record<string, DogPark[]> = {}
  for (const p of manualParks) {
    const key = p.city || '?'
    ;(groups[key] ??= []).push(p)
  }
  return Object.values(groups).map((ps) => ({
    lat: ps.reduce((s, p) => s + p.lat, 0) / ps.length,
    lng: ps.reduce((s, p) => s + p.lng, 0) / ps.length,
  }))
})()

/** רדיוס (ק״מ) של "אזור עיר מתועדת" שבו OSM מושמט לטובת הרשימה הרשמית. */
const CURATED_RADIUS_KM = 6

function inCuratedZone(p: DogPark): boolean {
  return curatedCenters.some((c) => distKm(p.lat, p.lng, c.lat, c.lng) < CURATED_RADIUS_KM)
}

/** מצרף את הרשימות הרשמיות, ומשמיט גינות OSM שבתוך אזור עיר מתועדת. */
export function withManual(primary: DogPark[]): DogPark[] {
  const kept = primary.filter((p) => !inCuratedZone(p))
  return [...kept, ...manualParks]
}

/** המקור המלא לתצוגה. */
export const allDogParks: DogPark[] = withManual(bakedParks)
