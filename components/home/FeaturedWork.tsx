import Link from 'next/link'
import { getHomeContent, getWorkItems } from '@/lib/content'

export default function FeaturedWork() {
  const homeContent = getHomeContent()
  const featuredWorkSlugs = homeContent.featuredWork || []
  const allWorkItems = getWorkItems()
  
  // Get the actual work items based on slugs
  const featuredWork = featuredWorkSlugs
    .map((slug: string) => allWorkItems.find((work) => work.slug === slug))
    .filter((work): work is NonNullable<typeof work> => work !== undefined)
    .slice(0, 3) // Ensure max 3 items

  if (featuredWork.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredWork.map((work) => (
        <Link
          key={work.slug}
          href={`/work/${work.slug}`}
          className="group bg-white rounded-xl p-8 border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet/5 rounded-full -mr-16 -mt-16 group-hover:bg-violet/10 transition-colors"></div>
          <div className="relative">
            <span className="text-xs font-semibold text-violet uppercase tracking-wider mb-3 block">{work.category || 'Work'}</span>
            <h3 className="text-xl font-semibold text-navy mb-4 group-hover:text-violet transition-colors leading-tight">
              {work.title}
            </h3>
            <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3">
              {work.context || work.problem || 'Learn more about this project.'}
            </p>
            <span className="text-xs font-medium text-violet/70 group-hover:text-violet transition-colors inline-flex items-center gap-1">
              Learn more
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

