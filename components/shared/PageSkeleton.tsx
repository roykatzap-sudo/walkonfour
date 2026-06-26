/**
 * שלד טעינה גנרי - מוצג מיידית בזמן שעמוד דינמי נטען (Next loading.tsx),
 * כדי שלא יהיה מסך ריק. כותרת + גריד כרטיסים עם אפקט shimmer.
 */
export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <main className="page" aria-busy="true" aria-label="טוען תוכן">
      <div className="kv-skel kv-skel-line" style={{ width: 140, height: 16, marginBottom: 14 }} />
      <div className="kv-skel kv-skel-line" style={{ width: '60%', height: 40, marginBottom: 12 }} />
      <div className="kv-skel kv-skel-line" style={{ width: '85%', height: 16, marginBottom: 36 }} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="kv-skel-card">
            <div className="kv-skel" style={{ height: 168 }} />
            <div style={{ padding: 18 }}>
              <div className="kv-skel kv-skel-line" style={{ width: '70%', height: 18, marginBottom: 10 }} />
              <div className="kv-skel kv-skel-line" style={{ width: '100%', height: 13, marginBottom: 6 }} />
              <div className="kv-skel kv-skel-line" style={{ width: '40%', height: 13 }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
