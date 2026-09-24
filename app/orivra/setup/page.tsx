import type { Metadata } from 'next'
import Link from 'next/link'
import { orivraSite } from '../site'
import styles from '../orivra.module.css'

export const metadata: Metadata = {
  title: 'Getting started',
  description:
    'Download the MailWeave public beta for Claude Desktop on Apple Silicon Macs, connect Gmail, or choose the advanced self-managed setup. Requirements and data flow.',
  alternates: { canonical: '/orivra/setup' },
  openGraph: { title: 'Getting started with Orivra', url: '/orivra/setup' },
}

export default function SetupPage() {
  return (
    <div className={styles.container}>
      <header className={styles.pageIntro}>
        <Link className={styles.backLink} href="/orivra">
          ← Back to Orivra
        </Link>
        <span className={styles.eyebrow}>GETTING STARTED</span>
        <h1>
          Start with
          <br />
          MailWeave.
        </h1>
        <p>
          Connect Orivra to Gmail through MailWeave. The simpler desktop setup
          and advanced, self-managed route use the same read-only tools. Choose
          how much of the setup you want to own.
        </p>
      </header>
      <aside className={styles.releaseNotice}>
        <span className={styles.mono}>RELEASE STATUS</span>
        <p>
          <strong>MailWeave {orivraSite.version} is available as a public experimental beta.</strong>{' '}
          Google data-access verification is incomplete: authorization may show
          a warning or be blocked, and the unverified app has a 100-total-user
          cap. Selected email evidence is sent to Claude/Anthropic. Read the{' '}
          <a href={orivraSite.releaseUrl}>release notes</a> and{' '}
          <a href={orivraSite.limitationsUrl}>known limitations</a> before connecting.
        </p>
      </aside>
      <div className={styles.setupGrid}>
        <article className={styles.setupCard}>
          <div className={styles.setupCardTop}>
            <span className={styles.mono}>01 / DESKTOP</span>
            <span className={styles.badge}>SIMPLER SETUP</span>
          </div>
          <h2>For Claude Desktop.</h2>
          <p>
            Connect your own Gmail account without Terminal commands
            or your own Google Cloud project.
          </p>
          <ul className={styles.requirements}>
            <li>Apple Silicon Mac · macOS 14 or later</li>
            <li>Claude Desktop with local extensions enabled</li>
            <li>Internet connection for setup and Gmail access</li>
            <li>
              346 MB download · about 1.16 GB unpacked + 1.27 GB of models,
              plus temporary installation space
            </li>
          </ul>
          <ol className={styles.steps}>
            <li>
              <strong>Download and install the .mcpb file.</strong>
              <span>
                In Claude Desktop, open Settings → Extensions → Advanced
                settings → Install Extension… and choose the downloaded file.
                The source ZIP is not the installer.
              </span>
            </li>
            <li>
              <strong>Send “Set up Orivra” in a new chat.</strong>
              <span>
                Setup prepares the local models and gives you a Google
                authorization link.
              </span>
            </li>
            <li>
              <strong>Choose your account and consent.</strong>
              <span>
                Open the link on the same Mac. Review the read-only permission
                before granting it.
              </span>
            </li>
            <li>
              <strong>Return to Claude to finish.</strong>
              <span>
                Send “Continue the Orivra setup.” Wait for “Orivra is ready”
                and confirm the account before asking about your mail.
              </span>
            </li>
          </ol>
          <a className={styles.button} href={orivraSite.downloadUrl}>
            Download MailWeave beta <span aria-hidden="true">↓</span>
          </a>
          <p className={styles.smallNote}>
            {orivraSite.version} · .mcpb · 346 MB · Apple Silicon only
            <br />
            <a href={orivraSite.checksumUrl}>SHA-256 checksum</a>
            {' · '}
            <a href={orivraSite.desktopGuideUrl}>Full install & removal guide</a>
            <br />
            No Google approval or endorsement is claimed. If authorization is
            blocked, stop and contact support; do not disable protections.
          </p>
        </article>
        <article className={styles.setupCard}>
          <div className={styles.setupCardTop}>
            <span className={styles.mono}>02 / SELF-MANAGED</span>
            <span className={styles.badge}>ADVANCED</span>
          </div>
          <h2>
            Your project.
            <br />
            Your credentials.
          </h2>
          <p>
            Build and run from the public MIT-licensed source with your own
            Google Cloud project. This route remains available alongside the
            desktop package.
          </p>
          <ul className={styles.requirements}>
            <li>Comfortable using a terminal</li>
            <li>Python 3.12 and uv</li>
            <li>Your own Google Cloud project and Gmail API setup</li>
            <li>A Desktop-app OAuth client that you manage</li>
          </ul>
          <ol className={styles.steps}>
            <li>
              <strong>Get the released source.</strong>
              <span>
                Follow the matching version’s setup guide, not commands copied
                from a different release.
              </span>
            </li>
            <li>
              <strong>Configure Google authorization.</strong>
              <span>
                Enable Gmail access and create your own Desktop-app OAuth
                client.
              </span>
            </li>
            <li>
              <strong>Install and authorize locally.</strong>
              <span>
                Provision the local models and grant gmail.readonly for the
                account you choose.
              </span>
            </li>
            <li>
              <strong>Connect the MCP server.</strong>
              <span>
                Add Orivra to Claude Desktop using the guide’s command and
                paths.
              </span>
            </li>
          </ol>
          <a className={styles.outlineButton} href={orivraSite.selfManagedGuideUrl}>
            Open the self-managed setup guide ↗
          </a>
          <p className={styles.smallNote}>
            <a href={orivraSite.repositoryUrl}>View source on GitHub</a>
            {' · '}
            <a href={orivraSite.licenseUrl}>MIT License</a>
            <br />
            Your Google project’s authorization rules still apply. Self-managed
            setup is not a bypass for Google’s requirements.
          </p>
        </article>
      </div>
      <section className={styles.setupBottom}>
        <div>
          <span className={styles.eyebrow}>BEFORE YOU GRANT ACCESS</span>
          <h2>
            A small permission.
            <br />
            An important choice.
          </h2>
        </div>
        <div>
          <p>
            Orivra’s Gmail permission is <code>gmail.readonly</code>. It can
            read messages and supported attachments, but cannot send, delete or
            modify your mail.
          </p>
          <p>
            The evidence it returns becomes available to Claude. Only connect an
            account you are authorized to use with your AI client, and check
            your workplace’s data policies first.
          </p>
          <Link className={styles.textLink} href="/orivra/privacy">
            Understand storage, sharing and revocation →
          </Link>
        </div>
      </section>
      <section className={styles.supportStrip}>
        <h2>Need a hand?</h2>
        <p>
          Email{' '}
          <a href={`mailto:${orivraSite.supportEmail}`}>
            {orivraSite.supportEmail}
          </a>
          . Include the setup step and error message, but never your Google
          tokens, credential files or private email content.
        </p>
      </section>
    </div>
  )
}
