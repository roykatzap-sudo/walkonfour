import { buildSearchIndex } from '@/lib/searchIndex'

export const dynamic = 'force-static'

export function GET() {
  return new Response(JSON.stringify(buildSearchIndex()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
