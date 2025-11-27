import Link from 'next/link'
import { getHomeContent, getVentures } from '@/lib/content'

export default async function FeaturedVentures() {
  const homeContent = await getHomeContent()
  const featuredVentureIndices = homeContent.featuredVentures || []
  const allVentures = await getVentures()
  
  // Get the actual ventures based on indices
  const featuredVentures = featuredVentureIndices
    .map((index: number) => allVentures[index])
    .filter((venture): venture is NonNullable<typeof venture> => venture !== undefined)
    .slice(0, 3) // Ensure max 3 items

  if (featuredVentures.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredVentures.map((venture, idx) => (
        <div key={idx}>
          {venture.link ? (
            <Link
              href={venture.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-8 border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden block"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet/5 rounded-full -mr-16 -mt-16 group-hover:bg-violet/10 transition-colors"></div>
              <div className="relative">
                <span className="text-xs font-semibold text-violet uppercase tracking-wider mb-3 block">Venture</span>
                <h3 className="text-xl font-semibold text-navy mb-4 group-hover:text-violet transition-colors leading-tight">
                  {venture.title}
                </h3>
                <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {venture.description}
                </p>
                <span className="text-xs font-medium text-violet/70 group-hover:text-violet transition-colors inline-flex items-center gap-1">
                  Visit Venture
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ) : (
            <div className="group bg-white rounded-xl p-8 border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet/5 rounded-full -mr-16 -mt-16 group-hover:bg-violet/10 transition-colors"></div>
              <div className="relative">
                <span className="text-xs font-semibold text-violet uppercase tracking-wider mb-3 block">Venture</span>
                <h3 className="text-xl font-semibold text-navy mb-4 group-hover:text-violet transition-colors leading-tight">
                  {venture.title}
                </h3>
                <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {venture.description}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

