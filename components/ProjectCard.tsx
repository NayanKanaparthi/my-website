'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: {
    title: string
    description: string
    image?: string
    githubLink?: string
    projectLink?: string
    type?: 'project' | 'paper' | 'website'
    category?: string
    date?: string
    tags?: string[]
  }
}

const getTypeBadgeColor = (type?: string) => {
  switch (type) {
    case 'paper':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'website':
      return 'bg-purple-100 text-purple-700 border-purple-200'
    default:
      return 'bg-violet/10 text-violet border-violet/20'
  }
}

const getTypeLabel = (type?: string) => {
  switch (type) {
    case 'paper':
      return 'Paper'
    case 'website':
      return 'Website'
    default:
      return 'Project'
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const handleCardClick = () => {
    if (project.projectLink) {
      window.open(project.projectLink, '_blank', 'noopener,noreferrer')
    }
  }

  const handleGitHubClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (project.githubLink) {
      window.open(project.githubLink, '_blank', 'noopener,noreferrer')
    }
  }

  const cardContent = (
    <div
      className={`bg-white rounded-lg border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col group ${
        project.projectLink ? 'cursor-pointer' : ''
      }`}
      onClick={project.projectLink ? handleCardClick : undefined}
    >
      {project.image && (
        <div className="w-full h-48 bg-navy/5 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-navy group-hover:text-violet transition-colors flex-1">
            {project.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {project.type && (
            <span className={`text-xs font-medium px-2 py-1 rounded border ${getTypeBadgeColor(project.type)}`}>
              {getTypeLabel(project.type)}
            </span>
          )}
          {project.category && (
            <span className="text-xs text-navy/50 px-2 py-1">
              {project.category}
            </span>
          )}
        </div>

        <p className="text-navy/70 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="space-y-2">
          {project.date && (
            <div className="text-xs text-navy/50">
              {formatDate(project.date)}
            </div>
          )}
          
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-xs font-medium text-violet bg-violet/10 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4 pt-2">
            {project.githubLink && (
              <button
                onClick={handleGitHubClick}
                className="text-violet hover:text-violet/80 text-sm font-medium"
              >
                GitHub →
              </button>
            )}
            {project.projectLink && (
              <span className="text-violet group-hover:text-violet/80 text-sm font-medium">
                {project.type === 'paper' ? 'Read Paper' : project.type === 'website' ? 'Visit Website' : 'View Project'} →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return cardContent
}



