import { getHomeContent } from '@/lib/content'

export default async function FeaturedVideos() {
  const homeContent = await getHomeContent()
  const featuredVideos = homeContent.featuredVideos || []
  
  if (featuredVideos.length === 0) {
    return null
  }

  // Filter to ensure we only have valid iframe embed codes
  const validVideos = featuredVideos
    .filter((embedCode: string) => 
      typeof embedCode === 'string' && 
      embedCode.includes('<iframe') && 
      embedCode.includes('youtube.com/embed') && 
      embedCode.includes('</iframe>')
    )
    .slice(0, 4) // Show up to 4 videos

  if (validVideos.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {validVideos.map((embedCode: string, idx: number) => {
        // Make iframe responsive by updating width and height attributes
        const responsiveEmbedCode = embedCode
          .replace(/width="[^"]*"/, 'width="100%"')
          .replace(/height="[^"]*"/, 'height="100%"')
          .replace(/style="[^"]*"/, '')
        
        return (
          <div
            key={idx}
            className="group bg-white rounded-xl overflow-hidden border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div 
                dangerouslySetInnerHTML={{ __html: responsiveEmbedCode }}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

