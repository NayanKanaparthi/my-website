import { getProjects } from '@/lib/content'
import ProjectCard from '@/components/ProjectCard'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Projects</h1>
        <p className="text-xl text-navy/70 max-w-2xl">
          A collection of projects I've built, exploring the intersection of technology, strategy, and innovation.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-navy/60">No projects yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

