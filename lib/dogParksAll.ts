/* ════════════════════════════════════════════════════════════
   מקור גינות מאוחד: OSM (bakedParks) + רשימות עירוניות רשמיות
   (manualParks).
   כלל (תוסף-בלבד): שתי הרשימות מתמזגות. גינת OSM נשמטת רק אם היא
   כפילות אמיתית - בתוך ~120מ' מגינה רשמית. כך אף גינה קיימת לא
   נמחקת; הרשימות הרשמיות רק מוסיפות כיסוי ומחליפות כפילויות מדויקות.
   ════════════════════════════════════════════════════════════ */
import type { DogPark } from '@/types'
import { bakedParks } from './dogParksBaked'
import { manualParks } from './dogParksManual'

function distKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  return Math.hypot((aLat - bLat) * 111, (aLng - bLng) * 94)
}

/** מרחק (מטרים) שמתחתיו גינת OSM נחשבת כפילות של גינה רשמית ונשמטת. */
const DEDUP_M = 120

function isDuplicateOfManual(p: DogPark): boolean {
  return manualParks.some((m) => distKm(p.lat, p.lng, m.lat, m.lng) * 1000 < DEDUP_M)
}

/** מצרף את הרשימות הרשמיות ל-OSM, ומשמיט רק כפילויות OSM קרובות (תוסף-בלבד). */
export function withManual(primary: DogPark[]): DogPark[] {
  const kept = primary.filter((p) => !isDuplicateOfManual(p))
  return [...kept, ...manualParks]
}

/** המקור המלא לתצוגה. */
export const allDogParks: DogPark[] = withManual(bakedParks)
