const papers = [
  {
    title:
      'Reflexive Demand in the AI Infrastructure Boom: Vendor Financing, Backlogs, & the CapEx-Cash Flow Imbalance (2022–2025)',
    venue: 'SSRN, recognized as a Recent Top Paper (~1,461 reads)',
    date: 'Posted December 2025',
    pages: '20 pages',
    link: 'https://papers.ssrn.com/abstract=5694302',
    doi: 'http://dx.doi.org/10.2139/ssrn.5694302',
    abstract:
      'Examines whether the post-2022 AI infrastructure expansion represents genuine demand or a reflexive, vendor-financed cycle. Documents three interlinked dynamics: a sharp rise in capital intensity across hyperscalers, exploding long-dated backlogs that remain largely unmonetized, and heavy reliance on vendor financing and abundant credit. Argues the resulting feedback loop (belief, financing, backlog, valuation, further financing) resembles the dot-com capex bubble with modern features like AI-specific vendor financing across Nvidia, Oracle, Microsoft, Amazon, and Google.',
    keywords: ['AI Infrastructure', 'Vendor Financing', 'Capital Expenditure', 'Reflexivity', 'Financial Cycles'],
  },
  {
    title:
      'The Adoption and Human Systems Layer: AI Agents as Organizational Members and the Implications for Organizational Behavior',
    venue: 'SSRN · New York University',
    date: 'Posted April 2026',
    pages: '28 pages',
    link: 'https://ssrn.com/abstract=6404938',
    doi: 'http://dx.doi.org/10.2139/ssrn.6404938',
    abstract:
      'Examines the organizational behavior conditions required for AI agents to function as genuine participants in workflows rather than underutilized technology. Presents three pillars of the adoption and human systems layer (change management addressing professional identity threat, training that develops collaborative competencies, and deliberate sociotechnical workflow redesign), plus a failure modes framework, an operational governance model, and a phased 90-day implementation roadmap. Central claim: AI agent adoption is not a technology problem with a behavioral component; it is a behavioral problem with a technology component.',
    keywords: ['AI Agents', 'Organizational Behavior', 'Change Management', 'Human-AI Collaboration', 'Sociotechnical Systems'],
  },
]

const ongoing = [
  'Defining the first structured, empirically grounded methodology for AI-native entrepreneurship, built from deep case studies of AI-native startups (Berkley Center for Entrepreneurship, NYU Stern)',
  'Energy constraints and grid bottlenecks shaping AI data center strategy and platform scalability',
]

export default function ResearchPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Research</h1>
        <p className="text-xl text-navy/70 max-w-2xl">
          Published research on AI infrastructure economics and AI adoption in organizations.
        </p>
      </div>

      <div className="space-y-8">
        {papers.map((paper) => (
          <article
            key={paper.link}
            className="bg-white rounded-lg border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300 group p-8"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
              <h2 className="text-2xl font-semibold text-navy group-hover:text-violet transition-colors max-w-3xl">
                {paper.title}
              </h2>
              <span className="text-sm text-navy/50 whitespace-nowrap">{paper.date}</span>
            </div>
            <p className="text-sm font-medium text-violet mb-4">
              {paper.venue} · {paper.pages}
            </p>
            <p className="text-navy/70 leading-relaxed serif max-w-3xl mb-6">{paper.abstract}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {paper.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs font-medium px-3 py-1 rounded-full text-navy/60 bg-navy/5"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet hover:text-violet/80 text-sm font-medium inline-flex items-center gap-1"
              >
                Read on SSRN <span>→</span>
              </a>
              <a
                href={paper.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy/50 hover:text-navy/70 text-sm font-medium"
              >
                DOI
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-navy mb-6">Ongoing Research</h2>
        <ul className="space-y-3">
          {ongoing.map((item) => (
            <li key={item} className="text-navy/70 leading-relaxed serif flex gap-3">
              <span className="text-violet mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
