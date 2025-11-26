import { getHomeContent } from '@/lib/content'

export default async function InstitutionLogos() {
  const homeContent = await getHomeContent()
  const institutions = homeContent.institutions || []

  if (institutions.length === 0) return null

  // Handle both old format (strings) and new format (objects with image/name)
  const logos = institutions.map((institution: any) => {
    if (typeof institution === 'string') {
      // Check if it's an image URL (starts with /) or old text format
      if (institution.startsWith('/') || institution.startsWith('http')) {
        return { image: institution, name: '' }
      }
      // Old text format - return null to skip
      return null
    }
    // New format: object with image
    return {
      image: institution?.image || institution,
      name: institution?.name || ''
    }
  }).filter((logo): logo is { image: string; name: string } => logo !== null && logo.image)

  if (logos.length === 0) return null

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-navy/50 mb-8 uppercase tracking-wider">Associated With</p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-32 h-20 md:w-40 md:h-24 opacity-60 hover:opacity-100 transition-opacity"
          >
            <img 
              src={logo.image} 
              alt={logo.name || `Partner logo ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

