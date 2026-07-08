export default function NowPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Now</h1>
        <p className="text-navy/60 text-sm mb-8">
          This is a <a href="https://nownownow.com/about" className="text-violet hover:underline">now page</a>. 
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6 text-navy/70 leading-relaxed serif">
        <section>
          <h2 className="text-xl font-semibold text-navy mb-3">Currently</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>AI Solutions and Enablement Intern at Avis Budget Group, embedded with Global Procurement on a CEO-sponsored AI initiative, building AI audit and market-intelligence systems on AWS</li>
            <li>Leading research at NYU&apos;s Berkley Center for Entrepreneurship to define a structured methodology for AI-native entrepreneurship</li>
            <li>Building production AI tools for the Goldman Sachs Black in Business program at NYU Stern</li>
            <li>Writing about AI systems, strategy, and quantitative thinking</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy mb-3">Focus Areas</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Production AI systems (RAG, agentic workflows, inference optimization) and what it takes for organizations to actually adopt them</li>
            <li>AI infrastructure economics and enterprise AI governance</li>
            <li>Quantitative risk modeling and portfolio analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy mb-3">Learning</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Energy constraints and grid bottlenecks shaping AI data center strategy</li>
            <li>Kubernetes and cloud-native deployment at enterprise scale</li>
            <li>Technology strategy: value creation vs capture, platform ecosystems, regulation as moat</li>
          </ul>
        </section>
      </div>
    </div>
  )
}


