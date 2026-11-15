# רענון נתוני גינות, וטרינרים וחנויות (OpenStreetMap)

מייצר את `lib/dogParksBaked.ts` ואת `lib/cityPlaces.ts`.

1. שאילתה: להריץ את `overpass_query.txt` מול Overpass ולשמור את התוצאה כ-`osm_extract.json`.
   השרת הציבורי עמוס לעיתים קרובות; מנסים שוב אחרי המתנה.
2. לפני בנייה מחדש: להעתיק את `lib/dogParksBaked.ts` הנוכחי אל `parks_previous.ts`
   (כלל "תוסף בלבד": גינה שכבר הופיעה באתר לא נמחקת, אלא אם יש גינה חדשה בטווח 120 מטר).
3. `python3 reverse_geocode.py` - רחוב ושכונה לכל נקודה חדשה (Nominatim).
   **עובד אחד בלבד, בקשה כל 2.5 שניות.** הרצה מקבילית גורמת לחסימה (429).
   הפלט נשמר ב-`revgeo_cache_new.json`; הסקריפט קורא כל קובץ `revgeo_cache*.json`.
4. `python3 build_data.py` - בונה את שני קובצי ה-lib.
5. `npm run build`, בדיקה, ודחיפה.

הנתונים: © תורמי OpenStreetMap, רישיון ODbL.
