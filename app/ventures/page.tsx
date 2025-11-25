import Link from 'next/link'
import { getVentures } from '@/lib/content'

export default async function VenturesPage() {
  const ventures = getVentures()
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Ventures</h1>
        <p className="text-xl text-navy/70 max-w-2xl">
          Projects and initiatives I'm building at the intersection of strategy, technology, and innovation.
        </p>
      </div>

      <div className="space-y-8">
        {ventures.map((venture, index) => {
          const cardContent = (
            <article
              className="bg-white rounded-lg border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              {venture.image && (
                <div className="w-full h-64 bg-navy/5 overflow-hidden">
                  <img
                    src={venture.image}
                    alt={venture.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-navy mb-2 group-hover:text-violet transition-colors">
                    {venture.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-navy/50">{venture.year}</span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      venture.status === 'Active'
                        ? 'text-green-700 bg-green-100'
                        : 'text-blue-700 bg-blue-100'
                    }`}>
                      {venture.status}
                    </span>
                  </div>
                </div>
                <p className="text-navy/70 leading-relaxed serif max-w-3xl">
                  {venture.description}
                </p>
                {venture.link && (
                  <div className="mt-4">
                    <span className="text-violet group-hover:text-violet/80 text-sm font-medium inline-flex items-center gap-1">
                      Visit Venture
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                )}
              </div>
            </article>
          )

          // If venture has a link, make the entire card clickable
          if (venture.link) {
            return (
              <Link
                key={index}
                href={venture.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {cardContent}
              </Link>
            )
          }

          // Otherwise, render as a regular article
          return (
            <div key={index}>
              {cardContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}

