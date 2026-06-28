'use client'

/* ════════════════════════════════════════════════════════════
   /saved - "מה ששמרתי"
   ────────────────────────────────────────────────────────────
   מציג את כל הפריטים ששמר המשתמש (localStorage), מקובצים לפי
   סוג: גזעים, מודעות יד שנייה, וכלבים לאימוץ. הנתונים נשלפים
   מאוצרי ה-lib לפי המזהים השמורים. עמוד לקוח מלא - כדי לקרוא
   את ה-localStorage. כל עוד לא נטען / ריק - מצב ריק מזמין.
   ════════════════════════════════════════════════════════════ */

import { useMemo } from 'react'
import Link from 'next/link'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { ListingCard } from '@/components/market/ListingCard'
import { AdoptCard } from '@/components/adopt/AdoptCard'
import { FavButton } from '@/components/shared/FavButton'
import { useFavorites } from '@/lib/useFavorites'
import { breeds, breedFace, type Breed } from '@/lib/breeds'
import { demoListings, type Listing } from '@/lib/market'
import { adoptDogs, type AdoptDog } from '@/lib/adopt'
import { DOG_NAMES, STYLE_LABELS, STYLE_EMOJI, type DogName } from '@/lib/dogNames'

export default function SavedPage() {
  const { ready, list, count } = useFavorites()

  // שליפת הפריטים המלאים לפי המזהים השמורים, בכל סוג.
  const savedBreeds = useMemo<Breed[]>(() => {
    const ids = new Set(list('breed'))
    return breeds.filter((b) => ids.has(b.slug))
  }, [list])

  const savedListings = useMemo<Listing[]>(() => {
    const ids = new Set(list('listing'))
    return demoListings.filter((l) => ids.has(l.id))
  }, [list])

  const savedAdopt = useMemo<AdoptDog[]>(() => {
    const ids = new Set(list('adopt'))
    return adoptDogs.filter((d) => ids.has(d.id))
  }, [list])

  // שמות שמורים: מזהה = השם עצמו. משחזרים מטא-דאטה מהמאגר לפי סדר השמירה.
  const savedNames = useMemo<DogName[]>(() => {
    const byName = new Map(DOG_NAMES.map((n) => [n.name, n]))
    return list('name').map(
      (name) =>
        byName.get(name) ?? { name, meaning: '', gender: 'male', style: 'classic' },
    )
  }, [list])

  const isEmpty = ready && count === 0

  return (
    <main className="page">
      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '52px 28px',
          marginBottom: 32,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f6ecd8 0%, #fbf7ef 100%)',
          border: '1px solid rgba(232,200,135,.18)',
        }}
      >
        <span className="section-tag">האזור האישי שלי</span>
        <h1 className="page-title grad-text" style={{ marginTop: 8 }}>
          מה ששמרתי
        </h1>
        <p className="page-sub" style={{ margin: '0 auto', maxWidth: 560, marginBottom: 0 }}>
          כל הגזעים, המודעות והכלבים לאימוץ ששמרתם, במקום אחד. השמירה נשמרת בדפדפן
          הזה בלבד, אז אפשר לחזור אליהם בכל זמן בלי להתחבר.
        </p>

        {ready && count > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 10,
              marginTop: 22,
            }}
          >
            <SummaryChip n={savedNames.length} label="שמות" />
            <SummaryChip n={savedBreeds.length} label="גזעים" />
            <SummaryChip n={savedListings.length} label="מודעות" />
            <SummaryChip n={savedAdopt.length} label="לאימוץ" />
          </div>
        )}
      </section>

      {/* ── מצב טעינה (לפני קריאת localStorage) ── */}
      {!ready ? (
        <p className="muted" style={{ textAlign: 'center', fontWeight: 600 }} aria-live="polite">
          טוענים את המועדפים שלכם…
        </p>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
          {/* ── שמות ── */}
          {savedNames.length > 0 && (
            <SavedSection title="שמות ששמרתי" count={savedNames.length} browseHref="/names" browseLabel="עוד שמות">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 16,
                }}
              >
                {savedNames.map((n, i) => (
                  <Reveal3D key={n.name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                    <SavedNameCard dogName={n} />
                  </Reveal3D>
                ))}
              </div>
            </SavedSection>
          )}

          {/* ── גזעים ── */}
          {savedBreeds.length > 0 && (
            <SavedSection title="גזעים ששמרתי" count={savedBreeds.length} browseHref="/breeds" browseLabel="עוד גזעים">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 16,
                }}
              >
                {savedBreeds.map((breed, i) => (
                  <Reveal3D key={breed.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                    <SavedBreedCard breed={breed} />
                  </Reveal3D>
                ))}
              </div>
            </SavedSection>
          )}

          {/* ── מודעות יד שנייה ── */}
          {savedListings.length > 0 && (
            <SavedSection title="מודעות ששמרתי" count={savedListings.length} browseHref="/market" browseLabel="עוד מודעות">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 24,
                }}
              >
                {savedListings.map((listing, i) => (
                  <Reveal3D key={listing.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                    <ListingCard listing={listing} />
                  </Reveal3D>
                ))}
              </div>
            </SavedSection>
          )}

          {/* ── כלבים לאימוץ ── */}
          {savedAdopt.length > 0 && (
            <SavedSection title="כלבים לאימוץ ששמרתי" count={savedAdopt.length} browseHref="/adopt" browseLabel="עוד כלבים לאימוץ">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: 24,
                }}
              >
                {savedAdopt.map((dog, i) => (
                  <Reveal3D key={dog.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                    <AdoptCard dog={dog} />
                  </Reveal3D>
                ))}
              </div>
            </SavedSection>
          )}
        </div>
      )}
    </main>
  )
}

/* ── צ'יפ סיכום במספרי המועדפים ── */
function SummaryChip({ n, label }: { n: number; label: string }) {
  if (n === 0) return null
  return (
    <span className="chip3d" style={{ fontWeight: 700 }}>
      {n} {label}
    </span>
  )
}

/* ── מעטפת מקטע: כותרת + מונה + קישור לעיון בעוד ── */
function SavedSection({
  title,
  count,
  browseHref,
  browseLabel,
  children,
}: {
  title: string
  count: number
  browseHref: string
  browseLabel: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 18,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#2a2018', letterSpacing: '-0.5px' }}>
          {title}{' '}
          <span style={{ color: 'var(--brand-dark)', fontSize: 18, fontWeight: 700 }}>({count})</span>
        </h2>
        <Link
          href={browseHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            minHeight: 44,
            fontSize: 14.5,
            fontWeight: 700,
            color: 'var(--brand-dark)',
            textDecoration: 'none',
          }}
        >
          {browseLabel} ←
        </Link>
      </div>
      {children}
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   כרטיס גזע קומפקט לעמוד השמירות - קישור ישיר לפרופיל הגזע,
   עם כפתור הסרה מהמועדפים בפינה. עיצוב עצמאי, בפלטת הקרם.
   ════════════════════════════════════════════════════════════ */
function SavedBreedCard({ breed }: { breed: Breed }) {
  return (
    <article
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(42,32,24,.06)',
        height: '100%',
      }}
    >
      <Link
        href={`/breeds/${breed.slug}`}
        aria-label={`למדריך המלא על ${breed.name}`}
        style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
      >
        <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: '#f6ecd8' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            src={breedFace(breed.photo, 480)}
            alt={`כלב מגזע ${breed.name}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              insetInlineStart: 0,
              insetInlineEnd: 0,
              bottom: 0,
              padding: '34px 14px 12px',
              background:
                'linear-gradient(to top, rgba(42,32,24,.92), rgba(42,32,24,.5) 55%, transparent)',
            }}
          >
            <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{breed.name}</h3>
            <p lang="en" style={{ margin: '2px 0 0', color: 'rgba(255,255,255,.82)', fontSize: 12.5 }}>
              {breed.en}
            </p>
          </div>
        </div>
      </Link>
      <FavButton
        type="breed"
        id={breed.slug}
        label={breed.name}
        style={{ position: 'absolute', top: 12, insetInlineEnd: 12, zIndex: 2 }}
      />
    </article>
  )
}

/* ════════════════════════════════════════════════════════════
   כרטיס שם שמור - שם גדול, משמעות, צ'יפ סגנון, וכפתור הסרה
   בפינה (אותו FavButton type='name' שמשמש את מחולל השמות).
   ════════════════════════════════════════════════════════════ */
function SavedNameCard({ dogName }: { dogName: DogName }) {
  return (
    <article
      style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #fff, #fdf8ef)',
        borderRadius: 20,
        padding: '22px 20px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(201,154,91,.16)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <span
        className="chip3d"
        style={{ alignSelf: 'flex-start', fontWeight: 700 }}
      >
        {STYLE_EMOJI[dogName.style]} {STYLE_LABELS[dogName.style]}
      </span>
      <h3 className="grad-text" style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px' }}>
        {dogName.name}
      </h3>
      {dogName.meaning && (
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6 }}>
          {dogName.meaning}
        </p>
      )}
      <FavButton
        type="name"
        id={dogName.name}
        label={dogName.name}
        style={{ position: 'absolute', top: 12, insetInlineEnd: 12, zIndex: 2 }}
      />
    </article>
  )
}

/* ── מצב ריק - מזמין, לא "שגיאה" ── */
function EmptyState() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '56px 24px',
        background: '#fff',
        borderRadius: 24,
        border: '1px solid rgba(42,32,24,.06)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: 620,
        margin: '0 auto',
      }}
    >
      {/* לב גדול דקורטיבי */}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 84,
          height: 84,
          borderRadius: '50%',
          background: 'rgba(232,200,135,.18)',
          color: 'var(--brand)',
          marginBottom: 18,
        }}
      >
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-6.7-4.35-9.3-8.05C.9 10.2 1.4 6.9 4 5.4c2.05-1.18 4.5-.5 5.7 1.2L12 9l2.3-2.4c1.2-1.7 3.65-2.38 5.7-1.2 2.6 1.5 3.1 4.8 1.3 7.55C18.7 16.65 12 21 12 21z" />
        </svg>
      </span>

      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#2a2018' }}>
        עוד לא שמרתם כלום
      </h2>
      <p style={{ margin: '12px auto 0', maxWidth: 440, color: 'var(--text-secondary)', fontSize: 15.5, lineHeight: 1.65 }}>
        לחיצה על הלב בכל גזע, מודעה או כלב לאימוץ תשמור אותו לכאן, כדי שתוכלו
        לחזור אליו בקלות מתי שתרצו.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 26 }}>
        <Link href="/breeds" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          לעיון בגזעים
        </Link>
        <Link href="/names" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
          לשמות לכלב
        </Link>
        <Link href="/adopt" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
          ללוח האימוץ
        </Link>
        <Link href="/market" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
          ליד שנייה
        </Link>
      </div>
    </div>
  )
}
