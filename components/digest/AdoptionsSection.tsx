import { Reveal3D } from '@/components/fx/Reveal3D'
import { AdoptCard } from '@/components/adopt/AdoptCard'
import { SectionHeader } from '@/components/digest/SectionHeader'
import { freshAdoptions } from '@/lib/digest'

/**
 * כלבים חדשים לאימוץ - ארבעת הכלבים הראשונים לפי דחיפות (דרך
 * freshAdoptions ב-lib/digest). מציג את כרטיס האימוץ הקיים (AdoptCard)
 * כדי לא לשכפל עיצוב. read-only מ-lib/adopt.
 */
export function AdoptionsSection() {
  const dogs = freshAdoptions(4)
  if (dogs.length === 0) return null

  return (
    <section aria-labelledby="digest-adopt" style={{ marginBottom: 64 }}>
      <SectionHeader
        id="digest-adopt"
        tag="מחפשים בית"
        title="כלבים חדשים לאימוץ"
        description="הכלבים שהכי דחוף למצוא להם בית החודש, מעמותות ופונדקים ברחבי הארץ."
        linkHref="/adopt"
        linkLabel="לכל הכלבים לאימוץ"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 22,
        }}
      >
        {dogs.map((dog, i) => (
          <Reveal3D key={dog.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <AdoptCard dog={dog} />
          </Reveal3D>
        ))}
      </div>
    </section>
  )
}
