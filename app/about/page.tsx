import { getAboutContent } from '@/lib/content'
import Image from 'next/image'

export default async function AboutPage() {
  const aboutContent = await getAboutContent()
  const skills = aboutContent.skills || {
    Strategy: [],
    AI: [],
    Quantitative: [],
    Product: [],
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <div className="mb-16">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-12 mb-12">
          {aboutContent.image ? (
            <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={aboutContent.image}
                alt="Nayan Kanaparthi"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-semibold text-navy">NK</span>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-4">Nayan Kanaparthi</h1>
            <p className="text-xl text-navy/70 leading-relaxed mb-6 serif">
              {aboutContent.bio || 'Founder, strategist, and AI builder exploring the frontiers of technology and business.'}
            </p>
          </div>
        </div>
      </div>

      {/* Education */}
      {aboutContent.education && aboutContent.education.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-navy mb-8">Education</h2>
          <div className="space-y-6">
            {aboutContent.education.map((edu, index) => (
              <div key={index} className="flex items-start space-x-4 pb-6 border-b border-navy/10 last:border-0">
                {edu.universityLogo && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-navy/10">
                    <img
                      src={edu.universityLogo}
                      alt={edu.university}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy mb-1">{edu.university}</h3>
                  <div className="flex items-center space-x-2 text-navy/70 mb-2">
                    <span className="font-medium">{edu.major}</span>
                    {edu.location && (
                      <>
                        <span>•</span>
                        <span>{edu.location}</span>
                      </>
                    )}
                    {edu.year && (
                      <>
                        <span>•</span>
                        <span>{edu.year}</span>
                      </>
                    )}
                  </div>
                  {edu.relevantCoursework && (
                    <div className="text-sm text-navy/60 mb-3">
                      <span className="font-medium">Relevant Coursework: </span>
                      <span>{edu.relevantCoursework}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {aboutContent.professionalExperience && aboutContent.professionalExperience.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-navy mb-8">Professional Experience</h2>
          <div className="space-y-6">
            {aboutContent.professionalExperience.map((exp, index) => (
              <div key={index} className="flex items-start space-x-4 pb-6 border-b border-navy/10 last:border-0">
                {exp.companyImage && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-navy/10">
                    <img
                      src={exp.companyImage}
                      alt={exp.company}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy mb-1">{exp.title}</h3>
                  <div className="flex items-center space-x-2 text-navy/70 mb-2">
                    <span className="font-medium">{exp.company}</span>
                    {exp.location && (
                      <>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-navy/60 mb-3">
                    {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Present'}
                  </div>
                  <p className="text-navy/70 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership Experience */}
      {aboutContent.leadershipExperience && aboutContent.leadershipExperience.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-navy mb-8">Leadership Experience</h2>
          <div className="space-y-6">
            {aboutContent.leadershipExperience.map((exp, index) => (
              <div key={index} className="flex items-start space-x-4 pb-6 border-b border-navy/10 last:border-0">
                {exp.companyImage && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-navy/10">
                    <img
                      src={exp.companyImage}
                      alt={exp.company}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy mb-1">{exp.title}</h3>
                  <div className="flex items-center space-x-2 text-navy/70 mb-2">
                    <span className="font-medium">{exp.company}</span>
                    {exp.location && (
                      <>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-navy/60 mb-3">
                    {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Present'}
                  </div>
                  <p className="text-navy/70 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-8">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, items]) => {
            const skillItems = items as string[]
            if (skillItems.length === 0) return null
            
            return (
              <div key={category} className="bg-white rounded-lg border border-navy/10 p-6 hover:border-violet/20 transition-colors">
                <h3 className="text-lg font-semibold text-navy mb-4 pb-3 border-b border-navy/10">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillItems.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm font-medium text-navy bg-navy/5 hover:bg-violet/10 hover:text-violet px-3 py-1.5 rounded-md transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {Object.values(skills).every((items) => (items as string[]).length === 0) && (
          <div className="text-center py-12 text-navy/50 border border-dashed border-navy/20 rounded-lg">
            <p>No skills added yet.</p>
            <p className="text-sm mt-1">Add skills in the admin panel.</p>
          </div>
        )}
      </section>
    </div>
  )
}
