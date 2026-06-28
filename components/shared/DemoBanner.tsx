import Link from 'next/link'

/**
 * באנר תצוגה מקדימה - מוצג בעמודי הקהילה כל עוד הם רצים על נתוני דוגמה
 * (לפני שה-DB האמיתי מתמלא). מנוסח ללקוח קצה: שקוף, חמים, ובקול האתר.
 * בלי הוראות פיתוח ובלי אימוג'י כלי עבודה.
 */
export function DemoBanner() {
  return (
    <div
      role="note"
      style={{
        marginBottom: 24,
        padding: '16px 20px',
        borderRadius: 16,
        background: 'linear-gradient(160deg, #ffffff 0%, #fbf7ef 100%)',
        border: '1px solid #efe2cd',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '6px 14px',
        fontSize: 15,
        lineHeight: 1.6,
        color: '#5b4d3c',
      }}
    >
      <strong style={{ fontWeight: 800, color: 'var(--brand-dark, #a87b3f)' }}>
        הקהילה עוד בהקמה.
      </strong>
      <span>
        מה שמוצג כאן הוא תצוגה לדוגמה - כך זה ייראה כשנתחיל. הפעילות האמיתית
        מתחילה עם ההשקה.
      </span>
      <Link
        href="/waitlist"
        className="btn btn-primary"
        style={{ marginInlineStart: 'auto', padding: '8px 18px', fontSize: 14 }}
      >
        הצטרפו לרשימה ותהיו מהראשונים
      </Link>
    </div>
  )
}
