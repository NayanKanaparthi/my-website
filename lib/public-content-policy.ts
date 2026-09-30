import work from '../content/work.json'
import about from '../content/about.json'
import talks from '../content/talks.json'

const avisSlug = 'avis-global-procurement-ai'
const avisWork = work.find(item => item.slug === avisSlug)!
const avisExperience = about.professionalExperience.find(item => item.company === 'Avis Budget Group')!
const avisTalk = talks.find(item => item.venue.includes('Avis Budget Group'))!

function mentionsAvis(value: unknown): boolean {
  return typeof value === 'string' && /avis budget group/i.test(value)
}

// Avis public copy is reviewed in source control. Replace entire records, rather
// than merging fields, so stale Redis content or admin saves cannot reintroduce
// confidential details. Other content remains editable through the CMS.
export function enforcePublicContent<T>(filename: string, data: T): T {
  if (filename === 'work.json' && Array.isArray(data)) {
    return data.map(item =>
      item.slug === avisSlug || mentionsAvis(item.client) || mentionsAvis(item.title)
        ? structuredClone(avisWork)
        : item
    ) as T
  }
  if (filename === 'about.json' && data && typeof data === 'object') {
    const content = data as Record<string, unknown>
    return {
      ...content,
      ...(mentionsAvis(content.bio) ? { bio: about.bio } : {}),
      professionalExperience: Array.isArray(content.professionalExperience)
        ? content.professionalExperience.map(item =>
            mentionsAvis(item.company) ? structuredClone(avisExperience) : item
          )
        : content.professionalExperience,
    } as T
  }
  if (filename === 'talks.json' && Array.isArray(data)) {
    return data.map(item =>
      mentionsAvis(item.venue) || mentionsAvis(item.title)
        ? structuredClone(avisTalk)
        : item
    ) as T
  }
  return data
}
