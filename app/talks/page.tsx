import { getTalks } from '@/lib/content'

export default async function TalksPage() {
  const talks = getTalks()

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Talks & Teaching</h1>
        <p className="text-xl text-navy/70 max-w-2xl">
          Workshops, panels, podcasts, and educational sessions on strategy, AI, and quantitative thinking.
        </p>
      </div>

      <div className="space-y-6">
        {talks.map((talk, index) => (
          <article
            key={index}
            className="bg-white rounded-lg p-8 border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-navy mb-2">{talk.title}</h2>
                <p className="text-navy/70 leading-relaxed mb-4">{talk.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="text-xs font-medium text-violet bg-violet/10 px-3 py-1 rounded-full">
                  {talk.type}
                </span>
                <div className="text-right">
                  <div className="text-sm font-medium text-navy">{talk.venue}</div>
                  <div className="text-xs text-navy/50">{talk.year}</div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
