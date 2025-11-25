import Link from 'next/link'
import { getWorkItems } from '@/lib/content'

export default async function WorkPage() {
  const caseStudies = getWorkItems()
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Work</h1>
        <p className="text-xl text-navy/70 max-w-2xl">
          Selected case studies and projects at the intersection of strategy, technology, and innovation.
        </p>
      </div>

      <div className="space-y-12">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className="block group"
          >
            <article className="bg-white rounded-lg p-8 border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-2xl font-semibold text-navy group-hover:text-violet transition-colors">
                  {study.title}
                </h2>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <span className="text-sm text-navy/50">{study.year}</span>
                  <span className="text-xs font-medium text-violet bg-violet/10 px-3 py-1 rounded-full">
                    {study.category}
                  </span>
                </div>
              </div>
              <p className="text-navy/60 text-sm mb-4">{study.client}</p>
              <span className="text-violet text-sm font-medium group-hover:underline">
                View case study →
              </span>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}

