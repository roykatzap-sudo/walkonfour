import Link from 'next/link'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'הכלב הכנעני: הסיפור של הגזע הישראלי היחיד',
  description:
    'כלב מדבר ששרד אלפי שנים, ניצל מהכחדה בידי חוקרת שנמלטה מווינה, גילה מוקשים במלחמת העולם והוליד את יחידת עוקץ. הסיפור המלא של הגזע הלאומי של ישראל.',
  path: '/canaan-dog',
  image: '/breeds-wc/canaan.png',
  type: 'article',
  article: { section: 'סיפור' },
})

/** ציר זמן - אבני הדרך בסיפור הגזע. */
const TIMELINE: { year: string; text: string }[] = [
  { year: 'אלפי שנים', text: 'כלבי פראיה (פאריה) חיים לצד האדם במדבריות הלבנט - בסיני, בנגב ובהרי יהודה.' },
  { year: '1891', text: 'רודולפינה מנצל נולדת בווינה. ב-1914 תקבל דוקטורט בכימיה מאוניברסיטת וינה.' },
  { year: '1938', text: 'אחרי סיפוח אוסטריה לנאצים, מנצל ובעלה נמלטים מאירופה ומגיעים לארץ ישראל בערב ראש השנה.' },
  { year: 'שנות ה-30-40', text: 'מנצל מגלה שגזעים אירופיים לא עומדים באקלים ובשטח, ופונה לכלב הפראיה המקומי - ומתחילה לביית ולברור אותו.' },
  { year: '1942', text: 'מכונה מספקת לבריטים כלבים מאתרי מוקשים לקרבות צפון אפריקה - בתנאי שלא ישמשו נגד היישוב. למעלה מ-400 כלבים אומנו בשיטתה.' },
  { year: '1947', text: 'ההגנה מניחה את היסוד ליחידת כלבים - אבי-אבותיה של יחידת עוקץ בצה״ל.' },
  { year: '1949', text: 'מנצל מקימה את המכון להכוונה וניידות לעיוורים, ומאלפת כנעניים ככלבי נחייה.' },
  { year: '1953', text: 'התאחדות הכלבנות בישראל מכירה רשמית בגזע.' },
  { year: '1966', text: 'מנצל מנסחת את תקן הגזע, וה-FCI הבינלאומי מכיר בכלב הכנעני.' },
  { year: '1997', text: 'ה-AKC האמריקאי מעניק לכנעני הכרה מלאה בקבוצת כלבי הרעייה.' },
]

const SOURCES: { label: string; url: string }[] = [
  { label: 'Canaan Dog - Wikipedia', url: 'https://en.wikipedia.org/wiki/Canaan_Dog' },
  { label: 'Rudolphina Menzel - Wikipedia', url: 'https://en.wikipedia.org/wiki/Rudolphina_Menzel' },
  { label: 'Canaan Dog History - American Kennel Club', url: 'https://www.akc.org/expert-advice/dog-breeds/canaan-dog-history-behind-israels-native-dogs/' },
  { label: 'The Dogs of War - Tablet Magazine', url: 'https://www.tabletmag.com/sections/community/articles/dogs-war-rudolphina-menzel' },
]

/** סקשן תוכן עם כותרת + פסקאות. */
function Chapter({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 48 }}>
      <span className="section-tag" style={{ marginBottom: 6 }}>{tag}</span>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: '4px 0 14px', lineHeight: 1.25 }}>{title}</h2>
      <div style={{ fontSize: 17.5, lineHeight: 1.85, color: '#473d30' }}>{children}</div>
    </section>
  )
}

export default function CanaanDogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'הכלב הכנעני: הסיפור של הגזע הישראלי היחיד',
    image: `${SITE_URL}/breeds-wc/canaan.png`,
    author: { '@type': 'Organization', name: 'כלבניה' },
    publisher: { '@type': 'Organization', name: 'כלבניה' },
    description:
      'הסיפור של הכלב הכנעני - הגזע הלאומי של ישראל: מכלב מדבר פראי, דרך ההצלה מהכחדה, ועד כלבי המוקשים ויחידת עוקץ.',
    mainEntityOfPage: `${SITE_URL}/canaan-dog`,
  }

  return (
    <main className="page" style={{ maxWidth: 760 }}>
      <JsonLd data={jsonLd} />

      {/* ── HERO ── */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 10 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">סיפור · הגזע הלאומי</span>
          <h1 className="page-title" style={{ fontSize: 44, lineHeight: 1.15 }}>
            הכלב הכנעני: <span className="grad-text">כלב מדבר ששרד הכל</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 18, color: '#6a6155', lineHeight: 1.7 }}>
            הגזע היחיד שבאמת מכאן. שרד אלפי שנים במדבר, ניצל מהכחדה בידי אישה שנמלטה מהנאצים,
            גילה מוקשים במלחמת העולם - והוליד את יחידת עוקץ. זה הסיפור שלו.
          </p>
        </div>
      </div>

      {/* תמונת נושא */}
      <figure style={{ margin: '0 0 8px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/breeds-wc/canaan.png"
          alt="איור צבעי-מים של כלב כנעני"
          style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto', borderRadius: 24, boxShadow: '0 18px 50px rgba(42,32,24,.18)' }}
        />
        <figcaption style={{ textAlign: 'center', fontSize: 13.5, color: '#8a7c66', marginTop: 10 }}>
          הכלב הכנעני - מבנה מרובע, ראש בצורת טריז, ומבט שתמיד בודק קודם.
        </figcaption>
      </figure>

      {/* ── פתיח עם אות פתיחה ── */}
      <div style={{ fontSize: 18.5, lineHeight: 1.9, color: '#473d30', marginTop: 26 }}>
        <p style={{ margin: 0 }}>
          <span style={{ float: 'inline-start', fontSize: 58, fontWeight: 900, lineHeight: 0.8, color: 'var(--brand)', marginInlineEnd: 10, marginTop: 6 }}>ר</span>
          וב הגזעים שאנחנו מכירים נולדו במלונאות באירופה - תוצאה של מאות שנים של ברירה אנושית מדוקדקת.
          הכלב הכנעני הוא ההפך הגמור: הוא לא תוכנן, הוא <strong>שרד</strong>. אלפי שנים הוא חי בשולי
          היישובים במדבריות הלבנט, חצי-פראי, חכם ועצמאי, מבייית את עצמו מספיק כדי לחיות לצד האדם אבל אף
          פעם לא לגמרי. וזה בדיוק מה שהפך אותו למושלם לכאן.
        </p>
      </div>

      <Chapter tag="ההתחלה" title="כלב שבא מהמדבר">
        <p>
          הכנעני הוא כלב פראיה (פאריה) - מאותה שושלת כלבים שחיה במרחב הזה עוד מימי המקרא, בסיני, בנגב
          ובהרי יהודה. במשך דורות הם נדדו בלהקות סביב מאהלים בדואיים, שמרו על העדרים והאוהלים, וניזונו
          משאריות. האקלים הקשה עשה את העבודה שמלונאי אירופה עשו בקפידה: רק החזקים, החכמים והעמידים ביותר
          שרדו והעבירו את הגנים הלאה. כך נוצר, בלי שאף אחד תכנן זאת, כלב עמיד להפליא - בריא, חסכן באנרגיה,
          וחושב בעצמו לפני שהוא מציית.
        </p>
      </Chapter>

      {/* ציטוט בולט */}
      <blockquote style={{ margin: '40px 0', padding: '18px 22px', borderInlineStart: '5px solid var(--brand)', background: 'rgba(201,154,91,.08)', borderRadius: '0 16px 16px 0', fontSize: 21, fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.6 }}>
        ״הגזעים האירופיים לא יכלו לעמוד באקלים ובשטח. אז פניתי לכלב שכבר חי כאן אלפי שנים.״
      </blockquote>

      <Chapter tag="ההצלה" title="האישה שהצילה גזע שלם">
        <p>
          הסיפור של הכנעני המודרני הוא הסיפור של אישה אחת: <strong>ד״ר רודולפינה מנצל</strong> (1891-1973).
          ילידת וינה, בעלת דוקטורט בכימיה מאוניברסיטת וינה כבר ב-1914, וחוקרת התנהגות כלבים מהמובילות
          בעולם. ב-1938, אחרי שגרמניה הנאצית סיפחה את אוסטריה, היא ובעלה נמלטו מאירופה והגיעו לארץ ישראל
          בערב ראש השנה - עם כמה כלבים בלבד.
        </p>
        <p>
          כאן היא נתקלה בבעיה מעשית: הכלבים האירופיים שאיתם עבדה - לשמירה, לאיתור ולעבודה - פשוט קרסו מול
          החום, האבק והשטח. במקום להילחם בטבע, מנצל עשתה משהו חכם: היא פנתה אל הכלב שכבר ניצח את הטבע הזה.
          היא החלה ללכוד, לביית ולברור כלבי פראיה מקומיים, ומתוכם בנתה בשיטתיות גזע אחיד עם אופי יציב.
          את התוצאה היא קראה <strong>״הכלב הכנעני״</strong>.
        </p>
      </Chapter>

      <Chapter tag="המלחמה" title="הכלבים שגילו מוקשים">
        <p>
          כשפרצה מלחמת העולם השנייה התברר שלכישורי ההישרדות של הכנעני יש ערך צבאי. הצבא הבריטי סבל ממחסור
          חמור בכלבים מאומנים, ופנה אל מנצל. היא הסכימה לסייע - אבל בתנאי אחד נחרץ: <strong>שהכלבים לעולם
          לא ישמשו נגד היישוב היהודי</strong>. מ-1942 החל המכון שלה לאמן ולספק לבריטים כלבים מאתרי מוקשים
          עבור הקרבות בצפון אפריקה.
        </p>
        <p>
          למעלה מ-400 כלבים אומנו בשיטות שלה ונשלחו לחזית. חיילים בריטים מכל הדרגות העידו שביצועיהם היו
          מצוינים - הכלבים הקטנים והעמידים מהמדבר איתרו מוקשים מתחת לחול שבני אדם ומכשירים פספסו.
        </p>
      </Chapter>

      <Chapter tag="השירות" title="מכלב מדבר לחבר במדים - ולעיניים של מי שלא רואה">
        <p>
          ב-1947 החלה ה<strong>הגנה</strong> להניח את היסוד ליחידת כלבים מבצעית. היחידה הזו הייתה
          אבי-אבותיה של <strong>יחידת עוקץ</strong> - יחידת הכלבנים המובחרת של צה״ל הפועלת עד היום.
          הכנעני, שכבר הוכיח את עצמו בשטח, היה בין הכלבים הראשונים ששירתו.
        </p>
        <p>
          אבל מנצל לא ראתה בכלב רק כלי ביטחוני. ב-1949 היא הקימה את <strong>המכון להכוונה וניידות
          לעיוורים</strong>, ואילפה כנעניים ככלבי נחייה - מהראשונים בעולם. אותו כלב שניצל מהכחדה הפך
          לעיניים של אנשים שלא רואים.
        </p>
      </Chapter>

      {/* ── ציר זמן ── */}
      <section style={{ marginTop: 52 }}>
        <span className="section-tag">ציר זמן</span>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: '4px 0 22px' }}>הסיפור בעשר תחנות</h2>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
          {TIMELINE.map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: 16, paddingBottom: i === TIMELINE.length - 1 ? 0 : 22, position: 'relative' }}>
              <div style={{ flexShrink: 0, width: 92, textAlign: 'end', fontWeight: 900, color: 'var(--brand)', fontSize: 15, paddingTop: 2 }}>{t.year}</div>
              <div style={{ flexShrink: 0, width: 14, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ width: 13, height: 13, borderRadius: '50%', background: 'var(--brand)', boxShadow: '0 0 0 4px rgba(201,154,91,.18)' }} />
                {i !== TIMELINE.length - 1 && <span style={{ flex: 1, width: 2, background: 'rgba(201,154,91,.3)', marginTop: 4 }} />}
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.65, color: '#473d30', paddingBottom: 4 }}>{t.text}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── קופסת עובדות ── */}
      <section style={{ marginTop: 52, background: 'linear-gradient(135deg, rgba(201,154,91,.1), rgba(232,200,135,.06))', border: '1px solid var(--brand-light, #e8c887)', borderRadius: 22, padding: '24px 26px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 16px' }}>🐕 הכנעני בקצרה</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {[
            ['מוצא', 'ארץ ישראל - הגזע הלאומי'],
            ['גובה', '50-60 ס״מ (זכר)'],
            ['משקל', '18-25 ק״ג'],
            ['תוחלת חיים', '12-15 שנים'],
            ['אופי', 'נאמן, עצמאי, עירני, חשדן כלפי זרים'],
            ['התאמה לאקלים', 'מושלמת - נבנה למדבר'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand)', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 15.5, color: 'var(--ink)', fontWeight: 600, lineHeight: 1.4 }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      <Chapter tag="היום" title="למה הכנעני עדיין מנצח כאן">
        <p>
          אחרי מותה של מנצל ב-1973, מגדלים כמו אלה שב<strong>מלונת שער הגיא</strong> המשיכו את מפעל ההצלה
          לפי הנחיותיה, וממשיכים עד היום לחפש פרטים איכותיים גם במאהלים בדואים בנגב. הכנעני נשאר נדיר
          יחסית - אלפי כלבים בלבד בעולם - אבל הוא חי, נושם, ומסתובב גם פה בארץ.
        </p>
        <p>
          הוא לא כלב לכל אחד. הוא חכם מדי בשביל לציית בלי לשאול, חשדן כלפי זרים, ויש לו ראש משלו. אבל אם
          אתם מחפשים שותף נאמן עד העצם, בריא להפליא, שמתאים לאקלים פה כמו אף כלב אחר - אין מתאים ממנו.
          הוא, פשוטו כמשמעו, נבנה בשבילכם במשך אלפי שנים.
        </p>
      </Chapter>

      {/* ── CTA ── */}
      <div style={{ marginTop: 44, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/breeds/canaan" className="btn btn-primary">לעמוד הגזע המלא →</Link>
        <Link href="/match" className="btn btn-ghost">בדקו אם כנעני מתאים לכם</Link>
      </div>

      {/* ── מקורות ── */}
      <section style={{ marginTop: 48, paddingTop: 22, borderTop: '1px solid rgba(42,32,24,.1)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#8a7c66', margin: '0 0 10px' }}>מקורות</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SOURCES.map((s) => (
            <li key={s.url} style={{ fontSize: 13.5 }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)' }}>{s.label} ↗</a>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: 12.5, color: '#a89b85', marginTop: 14, lineHeight: 1.6 }}>
          העובדות ההיסטוריות בכתבה אומתו מול המקורות לעיל. האיור הוא יצירה מקורית בסגנון צבעי-מים.
        </p>
      </section>
    </main>
  )
}
