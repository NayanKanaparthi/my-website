import type { Metadata } from 'next'
import Link from 'next/link'
import { PolicyPage } from '@/components/orivra/PolicyPage'
import { orivraSite } from '../site'
import styles from '../orivra.module.css'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'How Orivra accesses Gmail, processes email locally, shares selected evidence with your AI client, stores authorization and lets you revoke access.',
  alternates: { canonical: '/orivra/privacy' },
  openGraph: { title: 'Orivra privacy', url: '/orivra/privacy' },
}
const sections = [
  { id: 'scope', title: 'Who and what this covers' },
  { id: 'access', title: 'What Orivra accesses' },
  { id: 'flow', title: 'Where your data goes' },
  { id: 'storage', title: 'Storage and retention' },
  { id: 'use', title: 'Use and sharing' },
  { id: 'control', title: 'Your controls' },
  { id: 'website', title: 'Website and contact' },
  { id: 'updates', title: 'Updates and questions' },
]

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy policy."
      lead="Read-only describes what Orivra can do to your mailbox. It does not mean the messages returned to your AI client stay on your computer."
      sections={sections}
    >
      <section id="scope">
        <h2>1. Who and what this covers</h2>
        <p>
          Orivra is an independent project by Nayan Kanaparthi. This notice
          describes MailWeave, Orivra’s Gmail engine in public beta, and the Orivra
          pages on this website. Nayan is responsible for the practices
          described here. This policy does not cover future Slack or Google
          Drive connectors. Current downloads and requirements are listed on the{' '}
          <Link href="/orivra/setup">setup page</Link>.
        </p>
        <p>
          Contact:{' '}
          <a href={`mailto:${orivraSite.supportEmail}`}>
            {orivraSite.supportEmail}
          </a>
          . Google and your AI client operate their own services under their own
          policies.
        </p>
      </section>
      <section id="access">
        <h2>2. What Orivra accesses</h2>
        <p>
          After you authorize a Google account, the local connector uses Gmail’s
          API to search and read information needed by the tools your AI client
          calls. That may include your account email address, message and thread
          identifiers, message headers, participants, labels, Gmail receipt
          timestamps, snippets, message bodies, and supported attachment content
          when requested.
        </p>
        <p>
          The requested permission is{' '}
          <code>https://www.googleapis.com/auth/gmail.readonly</code>. The
          connector cannot send, delete, archive, label or edit your messages.
          You sign in with Google; Orivra does not ask for your Google password.
        </p>
        <p>
          Read-only access can still expose sensitive information. Only
          authorize a mailbox you have permission to connect to your chosen AI
          service.
        </p>
      </section>
      <section id="flow">
        <h2>3. Where your data goes</h2>
        <div className={styles.dataFlow}>
          <span>Gmail</span>
          <span aria-label="to">→</span>
          <span>Orivra on your computer</span>
          <span aria-label="to">→</span>
          <span>Your AI client</span>
        </div>
        <p>
          <strong>Retrieval and ranking:</strong> Orivra runs on your computer.
          It retrieves mail from Google, uses local models for semantic
          processing when available, and constructs the context returned by a
          tool call.
        </p>
        <p>
          <strong>Your AI client:</strong> Selected message content, metadata,
          source references and graph information are returned to the connected
          client. In Claude Desktop, those tool results can be sent to Anthropic
          for model processing and retained in conversations or logs according
          to your account settings and its policies. Local retrieval does not
          make Claude’s model processing local.
        </p>
        <p>
          <strong>Model setup:</strong> Initial provisioning downloads model
          files from Hugging Face and its download infrastructure. Those
          services receive normal download-request information, such as your IP
          address. This is separate from reading your mailbox; the download
          process does not send your Gmail messages or Gmail authorization
          token.
        </p>
        <p>
          <strong>The project operator:</strong> The current connector does not
          route Gmail content or your Google tokens through an Orivra-operated
          cloud backend. Content you voluntarily send in a support request is a
          separate disclosure.
        </p>
      </section>
      <section id="storage">
        <h2>4. Storage and retention</h2>
        <p>
          The desktop package stores its Google authorization token and local
          model files under{' '}
          <code>~/Library/Application Support/Orivra Beta</code> on macOS by
          default, with authorization in <code>state/</code> and weights in{' '}
          <code>models/</code>. The self-managed path uses its configured state
          and model directories. Authorization is kept in a local file with
          owner-only access permissions; this is not a claim that the file is
          encrypted by Orivra or stored in the system keychain.
        </p>
        <p>
          The current connector does not persist message bodies or attachments
          to an on-disk mailbox index. It holds query context and bounded caches
          in process memory. Local state such as configuration and freshness
          markers can persist separately. Closing the server clears its
          in-memory context, not the copies your AI client may have retained.
        </p>
        <p>
          Optional local lifecycle diagnostics record call status, timing and
          schema-derived argument shapes. They are designed not to contain
          message bodies, subjects, free-text queries or authorization tokens.
          If you save raw tool results or your AI client logs them, those
          records can contain email content. You control their storage and
          deletion.
        </p>
        <p>
          Local credentials, models and persistent state remain until you remove
          them. Optional diagnostic files remain at the location you chose until
          you delete them; they have no automatic retention deadline. Orivra
          cannot delete a conversation or log held by your AI provider.
        </p>
      </section>
      <section id="use">
        <h2>5. Use and sharing</h2>
        <p>
          Google user data is used to provide the search, reading and
          information-navigation features you request. Orivra does not sell
          Gmail data, use it for advertising, or train general-purpose AI models
          on it. Its local ranking models perform inference only. These
          statements describe Orivra’s processing, not the independent practices
          of your AI provider.
        </p>
        <p>
          We limit Orivra’s use and transfer of Google API data to the purposes
          described in this policy, in accordance with the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including its Limited Use requirements. Sharing with your AI client
          is part of the requested, visible functionality; it is not permission
          for unrelated reuse.
        </p>
        <p>
          The operator has no routine remote access to your mailbox. For
          support, share only the specific information you choose. Do not send
          private messages, credentials or tokens. Support correspondence is
          used to investigate and respond, and retained only as long as needed
          to resolve the request, related follow-up or a legal obligation. You
          may request deletion by email; information that must be retained by
          law is excepted. Copies in the email provider’s backups follow that
          provider’s deletion schedule.
        </p>
        <p>
          Before connecting Gmail, review your AI client’s retention and model
          improvement settings. For Claude, see Anthropic’s{' '}
          <a
            href="https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data"
            target="_blank"
            rel="noopener noreferrer"
          >
            retention information
          </a>{' '}
          and{' '}
          <a
            href="https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings"
            target="_blank"
            rel="noopener noreferrer"
          >
            model improvement controls
          </a>
          . Orivra does not read or change those settings and cannot promise
          that the provider will never retain or use content it receives.
        </p>
      </section>
      <section id="control">
        <h2>6. Your controls</h2>
        <ul>
          <li>
            Revoke Orivra’s authorization from your{' '}
            <a
              href="https://myaccount.google.com/connections"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Account’s third-party connections
            </a>
            . This stops future authorized Gmail reads.
          </li>
          <li>
            Remove the extension or MCP server configuration from your AI
            client.
          </li>
          <li>
            Remove the corresponding local data directory to delete stored
            authorization and models. Removing the extension alone may leave
            that directory behind.
          </li>
          <li>
            Delete saved conversations, tool results and logs separately through
            the client or provider that holds them. Revoking Google access does
            not erase copies already returned.
          </li>
          <li>
            Email the contact above about information you sent directly for
            support, or to ask about access, correction or deletion where
            applicable.
          </li>
        </ul>
        <p>
          These actions do not delete or change your original Gmail messages.
        </p>
      </section>
      <section id="website">
        <h2>7. Website and contact</h2>
        <p>
          You can read these product pages without connecting Gmail or creating
          an Orivra account. These pages do not include a mailing-list form,
          advertising tracker or third-party video embed. The teaser is served
          as a static file from this website.
        </p>
        <p>
          Vercel, the website’s hosting service, processes request information,
          such as IP addresses and browser details, to deliver and secure the
          site. Email sent to the contact address is handled by Google’s Gmail
          service. Those services have their own retention practices; the
          no-mailbox-backend statement above does not mean visiting this website
          creates no server logs.
        </p>
        <p>
          Other sections of Nayan’s portfolio may provide separate features,
          such as a contact form. This notice does not turn those into Orivra
          account or Gmail connection services.
        </p>
        <p>
          The portfolio’s shared stylesheet also loads a stylesheet from Google
          Fonts. Your browser contacts Google for that resource and may load
          font files, sharing ordinary network information such as your IP
          address. The new Orivra typography itself uses locally hosted fonts.
        </p>
      </section>
      <section id="updates">
        <h2>8. Updates and questions</h2>
        <p>
          We will update this policy and the product’s disclosures before a
          material change to Gmail data handling takes effect, and request
          renewed consent where required. The effective date above identifies
          the current policy. New connectors or a different data flow require
          updated disclosures; this policy does not silently extend to them.
        </p>
        <p>
          Questions? Contact{' '}
          <a href={`mailto:${orivraSite.supportEmail}`}>
            {orivraSite.supportEmail}
          </a>
          , or read <Link href="/orivra/setup">the setup overview</Link>.
        </p>
      </section>
    </PolicyPage>
  )
}
