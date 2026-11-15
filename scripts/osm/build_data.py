#!/usr/bin/env python3
"""Build kelvanya/lib/dogParksBaked.ts and lib/cityPlaces.ts from the OSM extract + reverse-geocode cache."""
import json, os, re, math, sys
HERE=os.path.dirname(os.path.abspath(__file__))
K=os.path.dirname(os.path.dirname(HERE))  # repo root
d=json.load(open(os.path.join(HERE,'osm_extract.json')))
import glob
cache={}
for f in sorted(glob.glob(os.path.join(HERE,'revgeo_cache*.json'))):
    for k,v in json.load(open(f)).items():
        if k not in cache or '_error' in cache[k]: cache[k]=v
stamp=d['osm3s']['timestamp_osm_base'][:10]
q=lambda s: json.dumps(s, ensure_ascii=False)

# communities (for the 8 km relevance filter of vets / pet shops)
cs=open(os.path.join(K,'lib/communities.ts')).read()
comms=[(m.group(1),float(m.group(2)),float(m.group(3))) for m in re.finditer(r"slug: '([^']+)'.*?lat: ([0-9.]+), lng: ([0-9.]+)",cs)]
def dist(a,b,c,e): return math.hypot((a-c)*111,(b-e)*94)
def near_comm(lat,lng,maxkm): return min(dist(lat,lng,c[1],c[2]) for c in comms)<=maxkm

PREF=('רחוב','שדרות','שד׳',"שד'",'דרך','סמטת','סמטה','כיכר','שביל','מעלה','מבוא','טיילת','כביש','נתיב','רח׳')
def street(a):
    r=(a or {}).get('road') or (a or {}).get('pedestrian') or (a or {}).get('footway')
    if not r: return None
    r=r.strip()
    if re.search(r'[A-Za-z]',r) or re.fullmatch(r'[\d\s]+',r): return None
    return r if r.startswith(PREF) else f'רחוב {r}'
def hood(a):
    for k in ('neighbourhood','suburb','quarter'):
        v=(a or {}).get(k)
        if v and not re.search(r'[A-Za-z]',v): return v.strip()
    return None
def city(a):
    for k in ('city','town','village','municipality'):
        v=(a or {}).get(k)
        if v and not re.search(r'[A-Za-z]',v): return v.strip().replace('\u05be',' ').replace('\u2013','-').replace('\u2014','-')
    return None
def ll(e): return (e.get('lat') or e['center']['lat'], e.get('lon') or e['center']['lon'])
def nm(t):
    n=(t.get('name:he') or t.get('name') or '').strip()
    return n or None

DAYS={'Su':'א׳','Mo':'ב׳','Tu':'ג׳','We':'ד׳','Th':'ה׳','Fr':'ו׳','Sa':'שבת','PH':'חגים'}
def hours(h):
    if not h: return None
    h=h.strip()
    if h=='24/7': return 'פתוח 24 שעות ביממה'
    out=h
    for k,v in DAYS.items(): out=re.sub(rf'\b{k}\b',v,out)
    out=out.replace(' off',' סגור').replace(',',', ').replace(';','; ')
    out=re.sub(r'\s+',' ',out).strip()
    return None if re.search(r'[A-Za-z]',out) or len(out)>70 else out

OLD_IDS=set(int(x) for x in re.findall(r'\{ id: (\d+),',open(os.path.join(HERE,'parks_previous.ts')).read()))
print('previously baked',len(OLD_IDS))
parks=[]; seen=set(); skipped_country=0; missing=0
for e in d['elements']:
    t=e.get('tags',{})
    if t.get('leisure')!='dog_park': continue
    key=f"{e['type']}/{e['id']}"
    a=cache.get(key)
    if a is None or '_error' in a: missing+=1; a={}
    lat,lng=ll(e)
    cc=a.get('country_code')
    # keep parks in Israel; outside it only when right next to one of the site's own cities
    if cc and cc!='il' and not (cc=='ps' and near_comm(lat,lng,6)): skipped_country+=1; continue
    # not geocoded yet: keep parks the site already listed, and new ones only right next to one of the
    # site's cities (and not across the border in Aqaba, which is ~6 km from Eilat)
    if not cc and e['id'] not in OLD_IDS and not (near_comm(lat,lng,6) and not (lat<29.56 and lng>34.975)): skipped_country+=1; continue
    pid=e['id'] if e['type'] in ('node','way') else e['id']+2*10**12  # same ids as the previous bake (raw OSM id)
    if pid in seen: continue
    seen.add(pid)
    p={'id':pid,'name':nm(t) or 'גינת כלבים','city':city(a) or '','lat':round(lat,6),'lng':round(lng,6),
       'opening_hours':hours(t.get('opening_hours')),'surface':None,'website':t.get('website') or None}
    s=street(a); h=hood(a)
    if s: p['near']=s
    if h: p['hood']=h
    if t.get('barrier') in ('fence','wall','yes','hedge') or t.get('fenced')=='yes': p['fenced']=True
    if t.get('lit')=='yes': p['lit']=True
    if t.get('wheelchair')=='yes': p['wheelchair']=True
    parks.append(p)
# additive only: a park the site already listed is never dropped, unless the new extract has a park
# within 120 m of it (the same garden, re-mapped in OSM under a new id)
carried=0
for m in re.finditer(r'\{ id: (\d+), name: ("(?:[^"\\]|\\.)*"), city: ("(?:[^"\\]|\\.)*"), lat: ([0-9.]+), lng: ([0-9.]+)',open(os.path.join(HERE,'parks_previous.ts')).read()):
    oid=int(m.group(1)); olat=float(m.group(4)); olng=float(m.group(5))
    if oid in seen: continue
    if any(dist(olat,olng,p['lat'],p['lng'])*1000<120 for p in parks): continue
    parks.append({'id':oid,'name':json.loads(m.group(2)),'city':json.loads(m.group(3)),'lat':olat,'lng':olng,'opening_hours':None,'surface':None,'website':None})
    seen.add(oid); carried+=1
print('carried over from previous list',carried)
parks.sort(key=lambda p:p['id'])
def ts_park(p):
    parts=[f"id: {p['id']}",f"name: {q(p['name'])}",f"city: {q(p['city'])}",f"lat: {p['lat']}",f"lng: {p['lng']}",
           f"opening_hours: {q(p['opening_hours']) if p['opening_hours'] else 'null'}","surface: null",
           f"website: {q(p['website']) if p['website'] else 'null'}"]
    for k in ('near','hood'):
        if p.get(k): parts.append(f"{k}: {q(p[k])}")
    for k in ('fenced','lit','wheelchair'):
        if p.get(k): parts.append(f"{k}: true")
    return '  { '+', '.join(parts)+' },'
head=f'''/* ════════════════════════════════════════════════════════════
   דאטה סטטי של גינות כלבים בישראל - נשאב מ-OpenStreetMap (Overpass)
   ב-{stamp} ונאפה לקוד כדי שהמפה תהיה אמינה גם כש-Overpass מושבת.
   המפה טוענת את אלה מיד, ומנסה לרענן מ-Overpass ברקע.
   near / hood = הרחוב והשכונה הקרובים לנקודה (Nominatim, גאוקודינג הפוך) -
   קירוב לצורך התמצאות, לא כתובת רשמית. fenced / lit / wheelchair = תגיות OSM.
   © תורמי OpenStreetMap, רישיון ODbL.
   ════════════════════════════════════════════════════════════ */
import type {{ DogPark }} from '@/types'

export const bakedParks: DogPark[] = [
'''
open(os.path.join(K,'lib/dogParksBaked.ts'),'w').write(head+'\n'.join(ts_park(p) for p in parks)+'\n]\n')
print('parks',len(parks),'skipped(country)',skipped_country,'no-geocode',missing,
      'with street',sum(1 for p in parks if p.get('near')),'named',sum(1 for p in parks if p['name']!='גינת כלבים'),
      'fenced',sum(1 for p in parks if p.get('fenced')),'lit',sum(1 for p in parks if p.get('lit')),'wheelchair',sum(1 for p in parks if p.get('wheelchair')))

# vets + pet shops (named only, near one of the site's cities, inside Israel by reverse geocode)
places=[]; nogeo=0
for e in d['elements']:
    t=e.get('tags',{})
    kind='vet' if t.get('amenity')=='veterinary' else 'pet_shop' if t.get('shop')=='pet' else None
    if not kind: continue
    n=nm(t)
    if not n: continue
    lat,lng=ll(e)
    if not near_comm(lat,lng,8): continue
    key=f"{e['type']}/{e['id']}"
    a=cache.get(key)
    if a is None or '_error' in a:
        # not geocoded: accept only places whose name is in Hebrew (and not in Aqaba), without a "near" street
        if not re.search(r'[\u0590-\u05FF]',n) or (lat<29.56 and lng>34.975): nogeo+=1; continue
        a={}
    elif a.get('country_code')!='il': continue
    st=None
    if t.get('addr:street') and not re.search(r'[A-Za-z]',t['addr:street']):
        s0=t['addr:street'].strip(); st=(s0 if s0.startswith(PREF) else f'רחוב {s0}')+(f" {t['addr:housenumber']}" if t.get('addr:housenumber') else '')
    else:
        s1=street(a); st=f'ליד {s1}' if s1 else None
    phone=(t.get('phone') or t.get('contact:phone') or '').split(';')[0].strip() or None
    if phone and not re.fullmatch(r'[+\d\s\-()*]{7,20}',phone): phone=None
    web=t.get('website') or t.get('contact:website') or None
    if web and not web.startswith('http'): web='https://'+web
    places.append({'id':key.replace('/','-'),'kind':kind,'name':n,'lat':round(lat,6),'lng':round(lng,6),
                   'street':st,'city':city(a),'phone':phone,'hours':hours(t.get('opening_hours')),'website':web})
places.sort(key=lambda p:(p['kind'],p['id']))
body='\n'.join('  { '+', '.join(f"{k}: {q(v) if isinstance(v,str) else ('null' if v is None else v)}" for k,v in p.items())+' },' for p in places)
open(os.path.join(K,'lib/cityPlaces.ts'),'w').write(f'''/* ════════════════════════════════════════════════════════════
   מרפאות וטרינריות וחנויות לחיות מחמד ליד הערים שבאתר.
   מקור: OpenStreetMap (Overpass), נשאב ב-{stamp}. רק מקומות עם שם.
   הרשימה אינה מלאה ולא נבדקה אחת אחת - היא נקודת התחלה, לא המלצה.
   שעות וטלפון מופיעים רק אם הוזנו ב-OSM. © תורמי OpenStreetMap, רישיון ODbL.
   נבנה אוטומטית - לא לערוך ידנית.
   ════════════════════════════════════════════════════════════ */

export type CityPlaceKind = 'vet' | 'pet_shop'

export type CityPlace = {{
  id: string
  kind: CityPlaceKind
  name: string
  lat: number
  lng: number
  /** רחוב מ-OSM, או "ליד <רחוב>" כשזה קירוב מגאוקודינג הפוך. */
  street: string | null
  city: string | null
  phone: string | null
  /** שעות פתיחה כפי שהוזנו ב-OSM, מתורגמות לעברית. null כשאין או כשלא ניתן לתרגם. */
  hours: string | null
  website: string | null
}}

export const OSM_DATA_DATE = '{stamp}'

export const cityPlaces: CityPlace[] = [
{body}
]
''')
print('places',len(places),'vets',sum(1 for p in places if p['kind']=='vet'),'pet shops',sum(1 for p in places if p['kind']=='pet_shop'),'awaiting geocode',nogeo,
      'with phone',sum(1 for p in places if p['phone']),'with hours',sum(1 for p in places if p['hours']))
