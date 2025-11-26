import Link from 'next/link'
import FeaturedWork from '@/components/home/FeaturedWork'
import WritingPreview from '@/components/home/WritingPreview'
import InstitutionLogos from '@/components/home/InstitutionLogos'
import { getHomeContent } from '@/lib/content'

export default async function Home() {
  const homeContent = await getHomeContent()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-32 pb-24">
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
            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-navy/50">
              <div className="w-2 h-2 bg-violet rounded-full animate-pulse"></div>
              <span>Available for consulting & collaborations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-navy mb-3">Featured Work</h2>
          <p className="text-navy/60 text-lg">Selected projects and case studies</p>
        </div>
        <FeaturedWork />
      </section>

      {/* Writing Preview */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-navy/10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-semibold text-navy mb-3">Recent Blogs</h2>
            <p className="text-navy/60 text-lg">Thoughts on strategy, AI, and quantitative thinking</p>
          </div>
          <Link 
            href="/blogs" 
            className="hidden md:flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium group"
          >
            View all
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <WritingPreview />
        <div className="mt-8 md:hidden text-center">
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-violet hover:text-violet/80 transition-colors text-sm font-medium"
          >
            View all blogs
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Institution Logos */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-navy/10">
        <InstitutionLogos />
      </section>
    </div>
  )
}

