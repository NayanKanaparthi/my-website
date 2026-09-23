import type { Metadata } from 'next'
import Link from 'next/link'
import { PolicyPage } from '@/components/orivra/PolicyPage'
import { orivraSite } from '../site'

export const metadata: Metadata = {
  title: 'Preview terms',
  description:
    'Draft terms for the Orivra MailWeave preview for Gmail: authorized use, experimental status, independent services and user control.',
  alternates: { canonical: '/orivra/terms' },
  openGraph: { title: 'Orivra preview terms', url: '/orivra/terms' },
}
const sections = [
  { id: 'project', title: 'The project' },
  { id: 'permission', title: 'Authorized use' },
  { id: 'preview', title: 'Preview limitations' },
  { id: 'services', title: 'Other services' },
  { id: 'license', title: 'Software and content' },
  { id: 'ending', title: 'Stopping use and support' },
]

export default function TermsPage() {
  return (
    <PolicyPage
      title="Preview terms."
      lead="Orivra helps AI agents find and navigate information. These draft terms explain the intended boundaries of the MailWeave preview for Gmail."
      sections={sections}
    >
      <section id="project">
        <h2>1. The project</h2>
        <p>
          Orivra is developed by Nayan Kanaparthi. Its Gmail connector supplies
          read-only tools to a connected AI client. It is not operated by,
          endorsed by, or affiliated with Google or Anthropic. The names of
          other products identify compatibility, not an endorsement.
        </p>
        <p>
          This page is a draft for review, not a statement that the preview has
          launched or that these terms are effective. The release package and
          its final terms must be identified before public distribution.
        </p>
      </section>
      <section id="permission">
        <h2>2. Authorized use</h2>
        <p>
          Connect only accounts and information you are authorized to use with
          your chosen AI client. Follow applicable laws, workplace policies, and
          Google’s and your AI provider’s terms. You are responsible for
          reviewing the permission request before consenting.
        </p>
        <p>
          Do not use the software to obtain unauthorized access, defeat account
          permissions, expose another person’s private information unlawfully,
          or interfere with other systems. The read-only scope is a boundary,
          not permission to disclose mail to people who should not receive it.
        </p>
        <p>
          Keep your authorization tokens and credential files private. Do not
          include them in support requests or public issue reports.
        </p>
      </section>
      <section id="preview">
        <h2>3. Preview limitations</h2>
        <p>
          The preview is experimental. Tool calls can fail or return partial
          information; graph relationships may be incomplete; an AI assistant
          can misread even correctly retrieved evidence. Source references help
          you check an answer but do not establish that it is true.
        </p>
        <p>
          Verify consequential claims against their sources. Do not rely on the
          preview as the sole basis for legal, medical, financial,
          safety-critical or other high-impact decisions. No performance
          advantage, comprehensive mailbox coverage or uninterrupted
          availability is promised.
        </p>
        <p>
          Features, supported platforms and setup steps may change. Future
          connectors mentioned on this website are plans, not commitments to
          deliver on a particular date.
        </p>
      </section>
      <section id="services">
        <h2>4. Other services and data</h2>
        <p>
          You need the relevant third-party accounts and a compatible AI client.
          Those services control their own eligibility, fees, policies, API
          availability and data processing. Orivra does not include a Claude
          subscription or guarantee Google authorization.
        </p>
        <p>
          The connector returns selected email content to your AI client. Read
          the <Link href="/orivra/privacy">privacy notice</Link> and your
          client’s data controls before use. Removing Orivra does not erase
          information already held by that client.
        </p>
      </section>
      <section id="license">
        <h2>5. Software and content</h2>
        <p>
          The license included with the released software governs permissions to
          use, copy, modify and redistribute that software. This draft does not
          select a software license or grant rights that a future release may
          not provide.
        </p>
        <p>
          You retain your rights in your email and other content. Connecting an
          account does not transfer ownership to Orivra. Third-party software,
          model files, names and trademarks remain subject to their respective
          licenses and rights.
        </p>
      </section>
      <section id="ending">
        <h2>6. Stopping use and support</h2>
        <p>
          You may stop using the preview, revoke Google access and remove local
          software and data at any time. The{' '}
          <Link href="/orivra/privacy#control">privacy controls</Link> explain
          what must be removed separately.
        </p>
        <p>
          Support is provided by the project’s builder without a promised
          response time. For questions, contact{' '}
          <a href={`mailto:${orivraSite.supportEmail}`}>
            {orivraSite.supportEmail}
          </a>
          . Final release terms, including any applicable warranty, liability or
          governing-law provisions, require owner review; none are silently
          selected by this draft.
        </p>
      </section>
    </PolicyPage>
  )
}
