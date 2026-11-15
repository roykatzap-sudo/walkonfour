import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { DogIdCard } from '@/components/tools/DogIdCard'
import { GroupLink } from '@/components/shared/GroupLink'

const TITLE = 'תעודת זהות לכלב: כרטיס עם שבב, טלפון ווטרינר'
const DESC =
  'מכינים בדקה כרטיס עם תמונת הכלב, מספר השבב, הטלפון שלכם ופרטי הווטרינר. שומרים בטלפון, שולחים לפנסיון או לדוגווקר, ומחזיקים מוכן למקרה שהכלב הולך לאיבוד. הפרטים נשארים במכשיר.'
const OG = ogImageUrl({ title: 'תעודת זהות לכלב', subtitle: 'שבב, טלפון ווטרינר בכרטיס אחד', tag: 'כלי' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/tools/dog-id-card' },
  openGraph: { title: TITLE, description: DESC, url: '/tools/dog-id-card', type: 'website', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

const USES: { h: string; p: string }[] = [
  { h: 'כשהכלב הולך לאיבוד', p: 'מספר השבב ותמונה עדכנית הם שני הדברים הראשונים שיבקשו מכם. כשהם בטלפון, לא מחפשים פנקסים.' },
  { h: 'כשמשאירים אותו אצל מישהו', p: 'פנסיון, דוגווקר או שכן מקבלים בהודעה אחת את הטלפון שלכם, את הווטרינר ומה חשוב לדעת.' },
  { h: 'בביקור אצל וטרינר חדש', p: 'שנת לידה, מספר שבב ואלרגיות במקום אחד, בלי לנחש.' },
]

export default function DogIdCardPage() {
  return (
    <main className="page" style={{ maxWidth: 1100 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'כלים', path: '/tools' }, { name: 'תעודת זהות לכלב', path: '/tools/dog-id-card' }])]} />
      <div className="no-print">
        <span className="section-tag">כלי</span>
        <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>תעודת זהות לכלב</h1>
        <p className="page-sub" style={{ maxWidth: 680 }}>
          כרטיס אחד עם כל מה שצריך לדעת על הכלב שלכם. ממלאים, שומרים כתמונה בטלפון, ושולחים למי שצריך.
        </p>
        <p style={{ fontSize: 16.5, lineHeight: 1.8, color: '#3a3128', maxWidth: 680, margin: '0 0 26px' }}>
          לא זוכרים את מספר השבב? הוא מופיע ברישיון הכלב, ולרוב גם בפנקס החיסונים. מה זה שבב ולמה הפרטים במאגר חשובים, תמצאו ב
          <Link href="/glossary#chip" className="link">מילון</Link>.
        </p>
      </div>

      <DogIdCard />

      <section className="no-print" style={{ marginTop: 44 }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#2a2018', margin: '0 0 14px' }}>מתי זה שימושי?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
          {USES.map((s) => (
            <div key={s.h} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.25)', borderRadius: 16, padding: '16px 18px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 900, color: '#2a2018' }}>{s.h}</h3>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: '#3a3128' }}>{s.p}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: '18px 0 0', fontSize: 16.5, lineHeight: 1.8 }}>
          הכלב כבר אבד? <Link href="/tools/lost-dog-poster" className="link" style={{ fontWeight: 800 }}>הכינו מודעת כלב אבד</Link>, וקראו{' '}
          <Link href="/guides/lost-dog-first-24-hours" className="link" style={{ fontWeight: 800 }}>מה עושים ב-24 השעות הראשונות</Link>.
        </p>
      </section>

      <section className="no-print" style={{ marginTop: 30, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '22px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1b2a44', margin: '0 0 8px' }}>הכינו תעודה? בואו להכיר</h2>
        <p style={{ margin: '0 0 14px', fontSize: 16.5, lineHeight: 1.8, color: '#1b2a44', maxWidth: 640 }}>
          העלו תמונה של הכלב לקבוצת הפייסבוק שלנו וספרו עליו בשתי שורות. שם אל תשתפו מספר שבב או טלפון, רק את הכלב.
        </p>
        <GroupLink
          src="id-card"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
