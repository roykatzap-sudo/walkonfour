import { MagneticButton } from '@/components/fx/MagneticButton'

/**
 * באנר המרה לרשימת ההמתנה - משתילים בתחתית עמודי תוכן (גזעים, חוקים,
 * השוואות, מדריכים, מאמרים) כדי לתת למבקר שהגיע מגוגל צעד הבא ברור.
 * לינק לעמוד /waitlist (שם הטופס האמיתי). בלי מספרים / הוכחה חברתית מומצאת.
 *
 * שכבת החתימה כאן:
 *  - חשיפה מדורגת בגלילה (data-kv-stagger + .kv-reveal על התוכן הפנימי),
 *    כך שהבאנר "נכנס" עם כוונה כשמגיעים אליו.
 *  - קו-נצנוץ זהב (.kv-shimmer-line) מתחת לכותרת - מבטא בודד, לא רעש.
 *  - כפתור מגנטי (MagneticButton) עם טבעת-הילה זהב בהפעלה (.kv-glow) -
 *    פידבק מוחשי, נגיש-מקלדת, מכובה תחת prefers-reduced-motion.
 */

type Variant = 'breed' | 'laws' | 'compare' | 'guide' | 'article' | 'default'

const COPY: Record<Variant, { title: string; sub: string; cta: string }> = {
  breed: {
    title: 'מתלבטים איזה כלב מתאים לכם?',
    sub: 'קהילה על ארבע בהקמה - בעלי כלבים שקונים יחד, נפגשים בפארקים ועוזרים זה לזה. הצטרפו לרשימה ותהיו מהראשונים.',
    cta: 'הצטרפו בחינם לרשימת ההמתנה',
  },
  laws: {
    title: 'רוצים להתעדכן בקהילת בעלי הכלבים?',
    sub: 'אנחנו בונים מקום לבעלי כלבים בישראל: קבוצות רכישה, גינות, המלצות ותשובות אמיתיות. הצטרפו לרשימה ותהיו מהראשונים כשנפתחים.',
    cta: 'הצטרפו בחינם לרשימת ההמתנה',
  },
  compare: {
    title: 'בחרתם גזע? קחו את זה צעד קדימה',
    sub: 'קהילה על ארבע בהקמה - מקום לבעלי כלבים שקונים יחד ועוזרים זה לזה. הצטרפו לרשימה ותהיו מהראשונים באזור שלכם.',
    cta: 'הצטרפו בחינם לרשימת ההמתנה',
  },
  guide: {
    title: 'אוהבים מדריכים כאלה? יש עוד בדרך',
    sub: 'קהילת בעלי כלבים בהקמה, עם תשובות אמיתיות מאנשים שכבר עברו את זה. הצטרפו לרשימה ותהיו מהראשונים.',
    cta: 'הצטרפו בחינם לרשימת ההמתנה',
  },
  article: {
    title: 'רוצים עוד תוכן וקהילה?',
    sub: 'אנחנו בונים מקום לבעלי כלבים בישראל: תוכן, כלים וקהילה אמיתית. הצטרפו לרשימה ותהיו מהראשונים כשנפתחים.',
    cta: 'הצטרפו בחינם לרשימת ההמתנה',
  },
  default: {
    title: 'הצטרפו לקהילת בעלי הכלבים',
    sub: 'קהילה על ארבע בהקמה - קבוצות רכישה, גינות, המלצות ותשובות אמיתיות. הצטרפו לרשימה ותהיו מהראשונים.',
    cta: 'הצטרפו בחינם לרשימת ההמתנה',
  },
}

export function WaitlistCTA({ variant = 'default' }: { variant?: Variant }) {
  const c = COPY[variant]
  return (
    <section
      aria-label="הצטרפות לרשימת המתנה"
      data-kv-stagger
      style={{
        marginTop: 40,
        padding: '26px 24px',
        background: 'linear-gradient(135deg,#fff8ea,#fdf2dc)',
        border: '2px solid rgba(201,154,91,.32)',
        borderRadius: 20,
        textAlign: 'center',
        boxShadow: '0 8px 26px rgba(201,154,91,.12)',
      }}
    >
      <div className="kv-reveal" aria-hidden="true" style={{ fontSize: 30, marginBottom: 4 }}>🐾</div>
      <h2 className="kv-reveal" style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: 'var(--ink)' }}>{c.title}</h2>
      {/* קו-נצנוץ זהב חתום - מבטא בודד מתחת לכותרת */}
      <span className="kv-shimmer-line kv-reveal" aria-hidden="true" style={{ margin: '0 auto 14px' }} />
      <p className="kv-reveal" style={{ margin: '0 auto 18px', maxWidth: 520, fontSize: 15.5, color: '#5b4d3c', lineHeight: 1.7 }}>{c.sub}</p>
      <div className="kv-reveal">
        <MagneticButton href="/waitlist" className="btn btn-primary kv-glow" strength={0.35}>
          {c.cta}
        </MagneticButton>
      </div>
      <p className="kv-reveal" style={{ margin: '12px 0 0', fontSize: 13.5, fontWeight: 800, color: 'var(--brand-dark)' }}>
        ✓ חינם לחלוטין · רק מייל · בלי ספאם
      </p>
    </section>
  )
}
