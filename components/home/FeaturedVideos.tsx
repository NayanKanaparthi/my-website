import { getHomeContent } from '@/lib/content'

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  // If it's already just an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }
  
  return null
}

export default async function FeaturedVideos() {
  const homeContent = await getHomeContent()
  const featuredVideoUrls = homeContent.featuredVideos || []
  
  if (featuredVideoUrls.length === 0) {
    return null
  }

  const videos = featuredVideoUrls
    .map((url) => {
      const videoId = getYouTubeVideoId(url)
      return videoId ? { id: videoId, url } : null
    })
    .filter((video): video is { id: string; url: string } => video !== null)
    .slice(0, 3) // Ensure max 3 items

  if (videos.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {videos.map((video, idx) => (
        <div
          key={idx}
          className="group bg-white rounded-xl overflow-hidden border border-navy/10 hover:border-violet/30 hover:shadow-xl transition-all duration-300 relative"
        >
          <div className="relative aspect-video bg-navy/5">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title={`YouTube video ${idx + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

