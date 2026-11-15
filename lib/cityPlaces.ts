/* placeholder - נבנה אוטומטית ע"י build_data.py */
export type CityPlaceKind = 'vet' | 'pet_shop'
export type CityPlace = {
  id: string
  kind: CityPlaceKind
  name: string
  lat: number
  lng: number
  street: string | null
  city: string | null
  phone: string | null
  hours: string | null
  website: string | null
}
export const OSM_DATA_DATE = '2026-11-15'
export const cityPlaces: CityPlace[] = []
