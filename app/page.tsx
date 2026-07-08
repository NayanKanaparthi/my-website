import Link from 'next/link'
import FeaturedWork from '@/components/home/FeaturedWork'
import FeaturedBlogs from '@/components/home/FeaturedBlogs'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import InstitutionLogos from '@/components/home/InstitutionLogos'
import { getHomeContent } from '@/lib/content'

const proofPoints = [
  { stat: '97.7% adoption', context: 'AI learning tools across 265 Scholars, Goldman Sachs BiB × NYU Stern' },
  { stat: '6,000+ downloads', context: 'AIGIS, open-source AI governance CLI on npm and PyPI' },
  { stat: 'SSRN Recent Top Paper', context: 'Published research on AI infrastructure economics' },
]

export default async function Home() {
  const homeContent = await getHomeContent()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-32 pb-16">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-violet/5 to-transparent"></div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          {homeContent.hero.image && (
            <div className="flex-shrink-0 relative">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet/30 via-violet/10 to-transparent rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                {/* Image with border */}
                <div className="relative bg-white p-1 rounded-full shadow-2xl">
                  <img
                    src={homeContent.hero.image}
                    alt="Nayan Kanaparthi"
                    className="w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-navy mb-6 text-balance leading-[1.1] tracking-tight">
              {homeContent.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-navy/70 leading-relaxed max-w-2xl mx-auto lg:mx-0 serif mb-8">
              {homeContent.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy/90 transition-colors"
              >
                View my work
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-navy/20 text-navy px-6 py-3 rounded-lg font-medium hover:border-violet hover:text-violet transition-colors"
              >
                Get in touch
              </Link>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center lg:justify-start gap-2 text-sm text-navy/50 hover:text-violet transition-colors"
            >
              <span className="w-2 h-2 bg-violet rounded-full animate-pulse"></span>
              <span>Available for consulting & collaborations</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Proof Bar */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-navy/10 py-8">
          {proofPoints.map((point) => (
            <div key={point.stat} className="text-center lg:text-left">
              <div className="text-xl font-semibold text-navy mb-1">{point.stat}</div>
              <div className="text-sm text-navy/60 leading-snug">{point.context}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Work */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-semibold text-navy mb-3">Case Studies</h2>
            <p className="text-navy/60 text-lg">Enterprise and production AI work, with the numbers</p>
          </div>
          <Link
            href="/work"
            className="hidden md:flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium group"
          >
            More
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <FeaturedWork />
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium"
          >
            More
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-navy/10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-semibold text-navy mb-3">Open Source & Builds</h2>
            <p className="text-navy/60 text-lg">Selected projects, tools, and research systems</p>
          </div>
          <Link
            href="/projects"
            className="hidden md:flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium group"
          >
            More
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <FeaturedProjects />
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium"
          >
            More
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Research */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-navy/10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-semibold text-navy mb-3">Research</h2>
            <p className="text-navy/60 text-lg">Published work on AI infrastructure economics and AI adoption</p>
          </div>
          <Link
            href="/research"
            className="hidden md:flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium group"
          >
            More
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a
            href="https://papers.ssrn.com/abstract=5694302"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300 group p-8 block"
          >
            <p className="text-xs font-medium text-violet uppercase tracking-wider mb-3">SSRN Recent Top Paper · ~1,461 reads</p>
            <h3 className="text-xl font-semibold text-navy mb-3 group-hover:text-violet transition-colors">
              Reflexive Demand in the AI Infrastructure Boom (2022–2025)
            </h3>
            <p className="text-navy/70 leading-relaxed serif text-sm">
              Is the AI buildout real demand or a reflexive, vendor-financed cycle? A financial analysis of
              CapEx, backlogs, and credit across Nvidia, Oracle, Microsoft, Amazon, and Google.
            </p>
          </a>
          <a
            href="https://ssrn.com/abstract=6404938"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg border border-navy/10 hover:border-violet/30 hover:shadow-lg transition-all duration-300 group p-8 block"
          >
            <p className="text-xs font-medium text-violet uppercase tracking-wider mb-3">SSRN · New York University</p>
            <h3 className="text-xl font-semibold text-navy mb-3 group-hover:text-violet transition-colors">
              The Adoption and Human Systems Layer: AI Agents as Organizational Members
            </h3>
            <p className="text-navy/70 leading-relaxed serif text-sm">
              Why AI adoption is a behavioral problem with a technology component: failure modes, governance,
              and a 90-day roadmap for putting AI agents to work inside real teams.
            </p>
          </a>
        </div>
      </section>

      {/* Institution Logos */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-navy/10">
        <InstitutionLogos />
      </section>

      {/* Writing */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-navy/10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-semibold text-navy mb-3">Writing</h2>
            <p className="text-navy/60 text-lg">Essays on AI systems, strategy, and quantitative thinking</p>
          </div>
          <Link
            href="/blogs"
            className="hidden md:flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium group"
          >
            More
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <FeaturedBlogs />
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium"
          >
            More
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
