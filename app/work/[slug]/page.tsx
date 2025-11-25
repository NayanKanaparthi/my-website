import { notFound } from 'next/navigation'
import { getWorkItems } from '@/lib/content'

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const workItems = getWorkItems()
  const study = workItems.find((item) => item.slug === params.slug)

  if (!study) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-6">{study.title}</h1>
      </div>

      <div className="space-y-12">
        {study.context && (
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4">Context</h2>
            <p className="text-navy/70 leading-relaxed serif">{study.context}</p>
          </section>
        )}

        {study.problem && (
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4">Problem</h2>
            <p className="text-navy/70 leading-relaxed serif">{study.problem}</p>
          </section>
        )}

        {study.approach && (
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4">Approach</h2>
            <p className="text-navy/70 leading-relaxed serif">{study.approach}</p>
          </section>
        )}

        {study.frameworks && study.frameworks.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4">Frameworks</h2>
            <div className="flex flex-wrap gap-3">
              {study.frameworks.map((framework: string) => (
                <span
                  key={framework}
                  className="text-sm font-medium text-violet bg-violet/10 px-4 py-2 rounded-full"
                >
                  {framework}
                </span>
              ))}
            </div>
          </section>
        )}

        {study.implementation && study.implementation.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4">Implementation</h2>
            <ul className="space-y-3">
              {study.implementation.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-violet mr-3">•</span>
                  <span className="text-navy/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {study.outcomes && study.outcomes.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4">Outcomes</h2>
            <ul className="space-y-3">
              {study.outcomes.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-violet mr-3">✓</span>
                  <span className="text-navy/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {study.learnings && study.learnings.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4">Learnings</h2>
            <ul className="space-y-3">
              {study.learnings.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-violet mr-3">→</span>
                  <span className="text-navy/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
