import { getHomeContent } from '@/lib/content'

export default async function Footer() {
  const homeContent = await getHomeContent()
  const socialLinks = homeContent.socialLinks || {}

  return (
    <footer className="border-t border-navy/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-navy/60">
            © {new Date().getFullYear()} Nayan Kanaparthi. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy/60 hover:text-navy transition-colors"
              >
                Twitter
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy/60 hover:text-navy transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

