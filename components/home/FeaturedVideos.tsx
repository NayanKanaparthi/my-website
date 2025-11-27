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
    .slice(0, 3) // Ensure max 3 items

  if (validVideos.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {validVideos.map((embedCode: string, idx: number) => (
        <div
          key={idx}
          className="group bg-white rounded-xl overflow-hidden border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative"
        >
          <div className="relative aspect-video bg-navy/5">
            <div 
              dangerouslySetInnerHTML={{ __html: embedCode }}
              className="w-full h-full"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

