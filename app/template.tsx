'use client'

import { usePathname } from 'next/navigation'

/**
 * Template - רץ מחדש בכל ניווט (בניגוד ל-layout שנשאר). עוטף כל עמוד
 * באנימציית כניסה עדינה (fade + עלייה קלה) דרך .route-fade, כדי שהמעבר
 * בין עמודים ירגיש חלק, אחיד ומכוון. מכבד prefers-reduced-motion
 * (האנימציה מכובה ב-CSS דרך .route-fade).
 *
 * ה-key על ה-pathname מבטיח שהעץ נטען מחדש בכל ניווט, כך שאנימציית
 * הכניסה נדלקת גם כשעוברים בין עמודים שחולקים אותו layout - הכניסה
 * מרגישה כוונה, לא רק טעינה ראשונית.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className="route-fade">
      {children}
    </div>
  )
}
