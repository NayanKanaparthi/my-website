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
            <li>Building the AdVantage Ecosystem platform</li>
            <li>Researching AI agents and tokenomics</li>
            <li>Writing about strategy, AI, and quantitative thinking</li>
            <li>Teaching and speaking at various institutions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy mb-3">Focus Areas</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Strategic frameworks for technology businesses</li>
            <li>Multi-agent systems and decentralized coordination</li>
            <li>Quantitative risk modeling and portfolio optimization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-navy mb-3">Learning</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Advanced mechanism design and game theory</li>
            <li>Recent developments in AI and agent systems</li>
            <li>Quantitative finance and risk management</li>
          </ul>
        </section>
      </div>
    </div>
  )
}


