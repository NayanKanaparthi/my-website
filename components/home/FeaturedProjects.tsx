import Link from 'next/link'
import { getHomeContent, getProjects } from '@/lib/content'

export default async function FeaturedProjects() {
  const homeContent = await getHomeContent()
  const featuredProjectIndices = homeContent.featuredProjects || []
  const allProjects = await getProjects()
  
  // Get the actual projects based on indices
  const featuredProjects = featuredProjectIndices
    .map((index: number) => allProjects[index])
    .filter((project): project is NonNullable<typeof project> => project !== undefined)
    .slice(0, 3) // Ensure max 3 items

  if (featuredProjects.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredProjects.map((project, idx) => (
        <div key={idx}>
          {project.projectLink ? (
            <Link
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-8 border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden block"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet/5 rounded-full -mr-16 -mt-16 group-hover:bg-violet/10 transition-colors"></div>
              <div className="relative">
                <span className="text-xs font-semibold text-violet uppercase tracking-wider mb-3 block">{project.category || 'Project'}</span>
                <h3 className="text-xl font-semibold text-navy mb-4 group-hover:text-violet transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
                <span className="text-xs font-medium text-violet/70 group-hover:text-violet transition-colors inline-flex items-center gap-1">
                  View Project
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ) : (
            <div className="group bg-white rounded-xl p-8 border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet/5 rounded-full -mr-16 -mt-16 group-hover:bg-violet/10 transition-colors"></div>
              <div className="relative">
                <span className="text-xs font-semibold text-violet uppercase tracking-wider mb-3 block">{project.category || 'Project'}</span>
                <h3 className="text-xl font-semibold text-navy mb-4 group-hover:text-violet transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-navy/70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

