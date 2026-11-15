/* ════════════════════════════════════════════════════════════
   מרפאות וטרינריות וחנויות לחיות מחמד ליד הערים שבאתר.
   מקור: OpenStreetMap (Overpass), נשאב ב-2026-11-15. רק מקומות עם שם.
   הרשימה אינה מלאה ולא נבדקה אחת אחת - היא נקודת התחלה, לא המלצה.
   שעות וטלפון מופיעים רק אם הוזנו ב-OSM. © תורמי OpenStreetMap, רישיון ODbL.
   נבנה אוטומטית - לא לערוך ידנית.
   ════════════════════════════════════════════════════════════ */

export type CityPlaceKind = 'vet' | 'pet_shop'

export type CityPlace = {
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
}

export const OSM_DATA_DATE = '2026-11-15'

export const cityPlaces: CityPlace[] = [
  { id: "node-10968068637", kind: "pet_shop", name: "ספידוג", lat: 31.898571, lng: 34.787047, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-10981687902", kind: "pet_shop", name: "Ze ve ZOO", lat: 32.086575, lng: 34.810885, street: "רחוב תלפיות 38", city: "רמת גן", phone: null, hours: null, website: null },
  { id: "node-11780381583", kind: "pet_shop", name: "אלפא פט", lat: 32.773446, lng: 35.032831, street: "ליד רחוב עמוס", city: "נשר", phone: null, hours: "א׳-ה׳ 10:00-20:00; ו׳ 10:00-16:00", website: null },
  { id: "node-12047314994", kind: "pet_shop", name: "הום פט", lat: 32.032498, lng: 34.84941, street: "רחוב היוצרים 4", city: null, phone: "03-9777166", hours: "א׳-ה׳ 07:00-21:00 ו׳ 07:00-15:00", website: "https://homepetcenter.co.il/" },
  { id: "node-12131063855", kind: "pet_shop", name: "חנות חיות", lat: 32.057193, lng: 34.767856, street: "רחוב הרב יצחק ידידיה פרנקל", city: null, phone: "+972 3 616 1038", hours: null, website: null },
  { id: "node-12187914257", kind: "pet_shop", name: "זו קלאב זו סנטר", lat: 31.86413, lng: 34.816334, street: null, city: null, phone: "08 9350201", hours: null, website: null },
  { id: "node-12473413803", kind: "pet_shop", name: "ממלכת החיות", lat: 31.973101, lng: 34.810846, street: "ליד רחוב בנימין שמוטקין", city: "ראשון לציון", phone: null, hours: null, website: null },
  { id: "node-12518087193", kind: "pet_shop", name: "אניפט", lat: 32.023958, lng: 34.798676, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-12520926624", kind: "pet_shop", name: "ספידוג", lat: 31.968988, lng: 34.804068, street: null, city: null, phone: null, hours: null, website: "https://speedog.co.il" },
  { id: "node-12628428850", kind: "pet_shop", name: "Zoo ארץ זו", lat: 31.999382, lng: 34.947244, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-12726037061", kind: "pet_shop", name: "זוארץ zoo", lat: 32.195421, lng: 34.856116, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-12729335012", kind: "pet_shop", name: "המזון והכלב", lat: 32.076339, lng: 34.771097, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-12781978414", kind: "pet_shop", name: "מייפרנד", lat: 31.903676, lng: 34.987574, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-12967004852", kind: "pet_shop", name: "Tahbiv", lat: 31.780994, lng: 35.218165, street: "ליד רחוב שמאי", city: "ירושלים", phone: null, hours: null, website: null },
  { id: "node-13057613008", kind: "pet_shop", name: "בול דוג", lat: 31.751596, lng: 35.215489, street: "ליד רחוב יד חרוצים", city: "ירושלים", phone: null, hours: null, website: null },
  { id: "node-13278093893", kind: "pet_shop", name: "Lizoo", lat: 32.04068, lng: 34.85714, street: "ליד שדרות יצחק שמיר", city: "אור יהודה", phone: null, hours: null, website: null },
  { id: "node-14051924000", kind: "pet_shop", name: "מלך החיות", lat: 32.179976, lng: 34.87112, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-14252537207", kind: "pet_shop", name: "בית החיות", lat: 31.759151, lng: 35.222227, street: null, city: null, phone: null, hours: "ב׳-ה׳, א׳ 09:00-19:30; ו׳ 09:00-15:00", website: null },
  { id: "node-14381183238", kind: "pet_shop", name: "אנימל זו", lat: 32.034212, lng: 34.859578, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-1687419109", kind: "pet_shop", name: "פינת החי", lat: 32.013677, lng: 34.764744, street: "ליד רחוב אילת", city: "חולון", phone: null, hours: null, website: null },
  { id: "node-1799497567", kind: "pet_shop", name: "מחסני מזון לחיות מחמד", lat: 32.015357, lng: 34.800452, street: "רחוב המלאכה 39", city: null, phone: "+97235503440", hours: null, website: null },
  { id: "node-1936683272", kind: "pet_shop", name: "הג'ונגל שלי", lat: 32.78411, lng: 35.013176, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-1952906788", kind: "pet_shop", name: "לחתול והכלב", lat: 32.023179, lng: 34.768627, street: "שדרות דב הוז 7", city: null, phone: "+97236517522", hours: null, website: null },
  { id: "node-2078994002", kind: "pet_shop", name: "פרשריף", lat: 32.078269, lng: 34.797148, street: "רחוב יגאל אלון 155", city: null, phone: "+972-3-5750000", hours: null, website: "https://www.freshreef.com/" },
  { id: "node-2125414594", kind: "pet_shop", name: "פנדה", lat: 32.020443, lng: 34.77617, street: "רחוב אריה שנקר 59", city: "חולון", phone: "+972775052700", hours: "ב׳-א׳ 09:00-22:00; ו׳ 09:00-16:00; שבת סגור", website: "http://panda-animals.com/" },
  { id: "node-2125414595", kind: "pet_shop", name: "פינוק לחיות", lat: 32.020355, lng: 34.776154, street: "רחוב אריה שנקר 61", city: "חולון", phone: "+97236516564", hours: "ב׳-א׳ 08:00-20:00; ו׳ 08:00-15:00; שבת סגור", website: null },
  { id: "node-2125468629", kind: "pet_shop", name: "פינוק לחיות", lat: 32.020231, lng: 34.776151, street: "רחוב אריה שנקר 61", city: null, phone: "+97236516565", hours: "ב׳-א׳ 08:00-20:00; ו׳ 08:00-15:00; שבת סגור", website: null },
  { id: "node-2277301277", kind: "pet_shop", name: "חבר על ארבע", lat: 32.785183, lng: 34.98683, street: "רחוב פיק\"א 5", city: null, phone: "+97248340905", hours: null, website: null },
  { id: "node-2318058374", kind: "pet_shop", name: "עולם החי", lat: 32.093298, lng: 34.81754, street: "ליד רחוב רש\"י", city: "רמת גן", phone: null, hours: null, website: null },
  { id: "node-2318064893", kind: "pet_shop", name: "שלי דג", lat: 32.093005, lng: 34.817667, street: "ליד רחוב רש\"י", city: "רמת גן", phone: null, hours: null, website: null },
  { id: "node-2363322548", kind: "pet_shop", name: "פלאש-פט", lat: 31.988714, lng: 34.765172, street: "רחוב יוסף לישנסקי 6", city: null, phone: "+97236098828", hours: null, website: "http://www.flashpet.co.il" },
  { id: "node-2540552600", kind: "pet_shop", name: "קופיקט", lat: 32.090418, lng: 34.819038, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-2713933975", kind: "pet_shop", name: "פט פויינט", lat: 32.069625, lng: 34.784717, street: "רחוב החשמונאים 105", city: null, phone: null, hours: null, website: "https://petpoint.co.il/" },
  { id: "node-2862959849", kind: "pet_shop", name: "זולו", lat: 32.056175, lng: 34.76917, street: null, city: null, phone: "+97236820062", hours: "א׳-ה׳ 09:00-22:00; ו׳ 09:00-15:00", website: "https://zoolu.co.il/" },
  { id: "node-2862959861", kind: "pet_shop", name: "בראונפילד", lat: 32.056131, lng: 34.768165, street: null, city: null, phone: "+9721700553350", hours: "א׳-ה׳ 09:00-21:00; ו׳ 08:30-15:00", website: "https://www.brownfield.co.il/" },
  { id: "node-3721293577", kind: "pet_shop", name: "דוליטל", lat: 31.886165, lng: 34.734335, street: "ליד רחוב הקישון", city: "יבנה", phone: null, hours: null, website: null },
  { id: "node-4356022715", kind: "pet_shop", name: "Acana", lat: 32.087713, lng: 34.884774, street: "ליד רחוב ההגנה", city: "פתח תקווה", phone: null, hours: null, website: null },
  { id: "node-4364387584", kind: "pet_shop", name: "אניפט", lat: 32.487796, lng: 34.970125, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-4365264410", kind: "pet_shop", name: "דגי נוי", lat: 32.08652, lng: 34.885745, street: "ליד רחוב מוהליבר", city: "פתח תקווה", phone: null, hours: null, website: null },
  { id: "node-4365274301", kind: "pet_shop", name: "קואלה", lat: 32.085864, lng: 34.885564, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-4365286356", kind: "pet_shop", name: "בית הכלב", lat: 32.086052, lng: 34.887223, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-4375867819", kind: "pet_shop", name: "PetMan", lat: 32.086919, lng: 34.884007, street: "ליד רחוב יצחק איכילוב", city: "פתח תקווה", phone: null, hours: null, website: null },
  { id: "node-4454280389", kind: "pet_shop", name: "אחים נחום", lat: 32.784586, lng: 34.959037, street: "רחוב נחום חת 9", city: "טירת הכרמל", phone: "072-2657695", hours: "א׳-ה׳ 09:00-20:30; ו׳ 09:00-14:00", website: "https://www.nbi-shop.co.il/" },
  { id: "node-4783373264", kind: "pet_shop", name: "FOOD 4 PET – מזון וציוד לחיות מחמד", lat: 32.487238, lng: 34.910452, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-4783623825", kind: "pet_shop", name: "כוכב החיות", lat: 32.091287, lng: 34.887657, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-4983224848", kind: "pet_shop", name: "זו ארץ zoo", lat: 32.220121, lng: 34.82853, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-5642297325", kind: "pet_shop", name: "זוארץ", lat: 32.102286, lng: 34.895756, street: "ליד רחוב הרב פינטו מסעוד אשר", city: "פתח תקווה", phone: null, hours: null, website: null },
  { id: "node-5711534522", kind: "pet_shop", name: "דג הזהב", lat: 32.172051, lng: 34.933173, street: "רחוב הגפן 3", city: null, phone: null, hours: null, website: null },
  { id: "node-5969877490", kind: "pet_shop", name: "צ'יוואווה", lat: 31.900197, lng: 34.810109, street: "רחוב הרצל 208", city: null, phone: null, hours: "09:00-20:00; ו׳ 09:00-14:00; שבת סגור", website: "https://chihuahua.co.il/" },
  { id: "node-6212720833", kind: "pet_shop", name: "Jungle", lat: 32.074212, lng: 34.798291, street: "ליד רחוב מורשת יהדות ליטא", city: "תל אביב-יפו", phone: null, hours: null, website: null },
  { id: "node-7058204299", kind: "pet_shop", name: "הג'ונגל של אלי", lat: 32.277617, lng: 34.860681, street: "רחוב האומנות 5", city: null, phone: null, hours: null, website: null },
  { id: "node-7474018498", kind: "pet_shop", name: "כלבו לכלב ולחתול", lat: 32.079472, lng: 34.779008, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-7672803700", kind: "pet_shop", name: "עמית לחי", lat: 31.90515, lng: 35.006474, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-8278353061", kind: "pet_shop", name: "עצם העניין", lat: 32.139476, lng: 34.842291, street: "ליד רחוב אוסישקין", city: "רמת השרון", phone: null, hours: null, website: null },
  { id: "node-8371969444", kind: "pet_shop", name: "היפופוטם", lat: 31.989862, lng: 34.76764, street: "רחוב הכשרת הישוב 5", city: null, phone: null, hours: null, website: null },
  { id: "node-9221942596", kind: "pet_shop", name: "עולם של חיות", lat: 32.811252, lng: 35.073929, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-9363746217", kind: "pet_shop", name: "עולם החי", lat: 32.137789, lng: 34.834139, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-9585027182", kind: "pet_shop", name: "ספידוג", lat: 31.258672, lng: 34.796699, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-10301942976", kind: "vet", name: "מרפאה ד\"ר עידו קאן", lat: 31.899455, lng: 34.807314, street: "ליד רחוב דר' מוסקוביץ'", city: "רחובות", phone: "+972 8 946 1971", hours: null, website: "https://www.kanvet.co.il" },
  { id: "node-10540283479", kind: "vet", name: "תיבת נח", lat: 31.903577, lng: 34.812374, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-11099589905", kind: "vet", name: "מרפאת רמת השרון לחיות בית", lat: 32.147329, lng: 34.845669, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-11329028581", kind: "vet", name: "וטרינר תורן רעננה", lat: 32.194007, lng: 34.85019, street: "ליד שדרות מנחם בגין", city: "רעננה", phone: null, hours: null, website: null },
  { id: "node-12087483649", kind: "vet", name: "השירות הווטרינרי העירוני", lat: 32.125065, lng: 34.818813, street: "רחוב הגנים 14", city: null, phone: null, hours: null, website: null },
  { id: "node-12546691302", kind: "vet", name: "ד\"ר שחר קובי", lat: 32.156121, lng: 34.892331, street: "רחוב הבנים 12", city: null, phone: "09-746-0192", hours: null, website: null },
  { id: "node-12546711401", kind: "vet", name: "ד\"ר לב ויינר", lat: 32.027647, lng: 34.749345, street: "רחוב רוטשילד 39", city: null, phone: null, hours: null, website: null },
  { id: "node-12572236317", kind: "vet", name: "חיסוני כלבת מועצת שוהם", lat: 31.990601, lng: 34.945217, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-12959418502", kind: "vet", name: "המרכז הרפואי לחיות", lat: 32.088099, lng: 34.802693, street: "רחוב הבונים 5", city: null, phone: "03-7527778", hours: null, website: "https://www.animal-hospital.co.il" },
  { id: "node-12959440201", kind: "vet", name: "בית בריאות וטרינרי פצ'ו", lat: 32.081229, lng: 34.801631, street: "רחוב דב פרידמן 10", city: null, phone: "+972 3 612 3263", hours: null, website: "https://www.petcho.co.il/" },
  { id: "node-1299328105", kind: "vet", name: "מרכז רפואי וטרינרי לחיות מחמד", lat: 32.795058, lng: 34.984763, street: "ליד שדרות מוריה", city: "חיפה", phone: null, hours: null, website: "https://www.moriahvc.co.il/" },
  { id: "node-14181201536", kind: "vet", name: "Family Vet - ד״ר מור פימה דניאלי", lat: 32.773652, lng: 34.992249, street: "רחוב משה סורוקה 39", city: "חיפה", phone: "077-2053303", hours: null, website: "https://www.familyvet.co.il/" },
  { id: "node-1595992743", kind: "vet", name: "מרפאה וטרינרית", lat: 32.130474, lng: 34.792597, street: "ליד רחוב אורי צבי גרינברג", city: "תל אביב-יפו", phone: "+97237411335", hours: null, website: "http://dogtor.co.il/" },
  { id: "node-1684381741", kind: "vet", name: "השירות הוטרינרי", lat: 31.806297, lng: 35.210732, street: "ליד רחוב ד\"ר גבי אשכר", city: "ירושלים", phone: null, hours: null, website: null },
  { id: "node-1748700343", kind: "vet", name: "בי\"ח-וטרינרי", lat: 31.258353, lng: 34.831966, street: null, city: "עומר", phone: null, hours: null, website: null },
  { id: "node-1758968878", kind: "vet", name: "מרפאה וטרינרית", lat: 32.020312, lng: 34.758429, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-1838555530", kind: "vet", name: "מרפאה וטרינרית לחיות מחמד", lat: 32.093324, lng: 34.883357, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-2070709998", kind: "vet", name: "מרפאת גיא הראל", lat: 32.126915, lng: 34.829928, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-2185114116", kind: "vet", name: "יובל סמואל", lat: 32.175979, lng: 34.89466, street: "ליד שדרות ששת הימים", city: "כפר סבא", phone: null, hours: null, website: null },
  { id: "node-2288503806", kind: "vet", name: "אני-וטי", lat: 32.108082, lng: 34.797797, street: null, city: null, phone: "+97236439891", hours: "ב׳-א׳ 09:00-13:00, 16:00-19:30; ו׳ 10:00-14:00; שבת סגור", website: null },
  { id: "node-2604623154", kind: "vet", name: "רפי קישון", lat: 32.120012, lng: 34.799529, street: "רחוב אופנהיימר 11", city: "תל אביב-יפו", phone: "+972-3-6424191", hours: null, website: "https://www.rafi-kishon.co.il/" },
  { id: "node-278197186", kind: "vet", name: "שירות וטרינרי", lat: 32.200217, lng: 34.862293, street: null, city: "רעננה", phone: null, hours: null, website: null },
  { id: "node-3135831582", kind: "vet", name: "מרכז וטרינרי", lat: 32.835555, lng: 35.063734, street: "שדרות רוברט סולד 8", city: null, phone: "052-2612445", hours: null, website: null },
  { id: "node-4233884489", kind: "vet", name: "מרכז וטרינרי נשר", lat: 32.772178, lng: 35.042544, street: "רחוב יעל 30", city: "נשר", phone: "048216060", hours: "א׳, ג׳, ה׳ 16:00-19:00; ו׳ 09:00-13:00", website: "https://www.ariehvet.co.il/" },
  { id: "node-4275642716", kind: "vet", name: "מרפאה וטרינרית", lat: 32.166853, lng: 34.849557, street: "ליד רחוב מוהליבר", city: "הרצליה", phone: "+97252580488", hours: null, website: null },
  { id: "node-4283847290", kind: "vet", name: "Angel's Veterinary Clinic for Small & Exotic Animals", lat: 31.766995, lng: 35.208479, street: "רחוב הפלמ\"ח 40 Alef", city: "ירושלים", phone: "0778866990", hours: "א׳-ב׳, ד׳-ה׳ 10:00-18:00; ג׳ 10:00-15:00", website: null },
  { id: "node-4292392636", kind: "vet", name: "מדי-פט", lat: 32.833696, lng: 35.075481, street: "שדרות ויצמן 17", city: "קריית מוצקין", phone: "048706116", hours: "א׳-ה׳ 16:00-19:00; ו׳ 09:00-12:00", website: "https://www.medipet.co.il/" },
  { id: "node-4768629984", kind: "vet", name: "מרפאה וטרינרית ד\"ר טלי שטיין", lat: 32.085791, lng: 34.883558, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-4783336684", kind: "vet", name: "מרכז וטרינרי", lat: 32.487164, lng: 34.910328, street: null, city: null, phone: null, hours: null, website: null },
  { id: "node-7006507649", kind: "vet", name: "כלב-ים", lat: 32.295921, lng: 34.844804, street: "רחוב החפץ חיים 6", city: null, phone: null, hours: null, website: "https://nuritomanno3.wixsite.com/kelevyam" },
  { id: "node-7264965880", kind: "vet", name: "מרכז רפואי לחיות בית ד\"ר פוגל", lat: 32.092753, lng: 34.889609, street: "ליד רחוב יהושע שטמפפר", city: "פתח תקווה", phone: null, hours: null, website: null },
  { id: "node-7463282296", kind: "vet", name: "מרפאה ומספרה לבעלי חיים", lat: 32.073488, lng: 34.828691, street: "רחוב תרצה 15", city: null, phone: "036742829", hours: "ב׳-ה׳, א׳ 10:00-12:30, 16:30-20:00; ו׳ 10:00-15:00", website: null },
  { id: "node-7463282298", kind: "vet", name: "לאקי דוג", lat: 32.0886, lng: 34.8146, street: "רחוב זאב ז'בוטינסקי 95", city: null, phone: "+972-52-624-4321", hours: null, website: "https://easy.co.il/page/3516799" },
  { id: "node-7541688313", kind: "vet", name: "וירוס פלוס", lat: 31.78858, lng: 34.643543, street: "רחוב הנשמה 58", city: null, phone: "+9728660330", hours: null, website: null },
  { id: "node-7542591967", kind: "vet", name: "השירות הווטרינרי", lat: 31.908728, lng: 35.01277, street: "ליד רחוב דם המכבים", city: "מודיעין-מכבים-רעות", phone: null, hours: null, website: null },
  { id: "way-1004169942", kind: "vet", name: "בית חולים לחיות בר", lat: 32.042761, lng: 34.822725, street: null, city: null, phone: null, hours: null, website: null },
  { id: "way-1021978961", kind: "vet", name: "השירות הווטרינרי העירוני הרצליה", lat: 32.155843, lng: 34.815661, street: null, city: null, phone: null, hours: null, website: "https://www.herzliya.muni.il/vet/" },
  { id: "way-104902858", kind: "vet", name: "בית החולים הווטרינרי האוניברסיטאי", lat: 31.990443, lng: 34.816174, street: null, city: null, phone: null, hours: null, website: null },
  { id: "way-170611728", kind: "vet", name: "גג לחיות", lat: 31.99494, lng: 34.763035, street: null, city: null, phone: null, hours: null, website: null },
  { id: "way-453824561", kind: "vet", name: "שירות וטרינרי עירוני", lat: 31.987201, lng: 34.761213, street: "רחוב לח\"י 3", city: null, phone: null, hours: null, website: "https://www.rishonlezion.muni.il/vet/Pages/default.aspx" },
  { id: "way-607347416", kind: "vet", name: "המרכז הארצי להצלת צבי הים", lat: 32.401919, lng: 34.86703, street: null, city: null, phone: null, hours: null, website: null },
  { id: "way-95095774", kind: "vet", name: "השירות הווטרינרי והכלבייה העירונית", lat: 32.102259, lng: 34.782184, street: null, city: null, phone: null, hours: "ה׳, א׳-ג׳ 08:30-15:00; ד׳ 08:30-18:00; ו׳ 08:30-12:00; שבת סגור", website: null },
]
