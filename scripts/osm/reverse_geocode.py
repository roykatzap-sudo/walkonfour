#!/usr/bin/env python3
"""Single polite reverse-geocode worker: one request every ~2.5 s, stops at the first sign of rate limiting."""
import json, os, time, glob, urllib.request, urllib.parse, urllib.error
HERE=os.path.dirname(os.path.abspath(__file__))
UA="walkonfour.org city-guide data refresh (contact via walkonfour.org/contact)"
d=json.load(open(os.path.join(HERE,'osm_extract.json')))
known={}
for f in glob.glob(os.path.join(HERE,'revgeo_cache*.json')):
    for k,v in json.load(open(f)).items():
        if '_error' not in v: known[k]=v
def want(e):
    t=e.get('tags',{})
    return t.get('leisure')=='dog_park' or ((t.get('amenity')=='veterinary' or t.get('shop')=='pet') and (t.get('name') or t.get('name:he')))
items=[e for e in d['elements'] if want(e) and f"{e['type']}/{e['id']}" not in known]
items.sort(key=lambda e: 0 if e['tags'].get('leisure')=='dog_park' else 1)
out_p=os.path.join(HERE,'revgeo_cache_new.json'); out={}; strikes=0
for n,e in enumerate(items,1):
    key=f"{e['type']}/{e['id']}"
    lat=e.get('lat') or e['center']['lat']; lon=e.get('lon') or e['center']['lon']
    url='https://nominatim.openstreetmap.org/reverse?'+urllib.parse.urlencode({'format':'jsonv2','lat':lat,'lon':lon,'zoom':17,'accept-language':'he','addressdetails':1})
    try:
        r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=25)
        out[key]=json.loads(r.read().decode()).get('address',{}); strikes=0
    except urllib.error.HTTPError as ex:
        if ex.code==429:
            strikes+=1
            if strikes>=2: print('rate limited - stopping at',n,'of',len(items)); break
            time.sleep(60)
    except Exception:
        pass
    if n%10==0: json.dump(out,open(out_p,'w'),ensure_ascii=False)
    time.sleep(2.5)
json.dump(out,open(out_p,'w'),ensure_ascii=False)
print('geocoded',len(out),'of',len(items))
