import type { Metadata } from 'next'
import Link from 'next/link'
import { orivraSite } from '../site'
import styles from '../orivra.module.css'

export const metadata: Metadata = {
  title: 'Getting started',
  description:
    'Get started with MailWeave, Orivra’s Gmail engine: the planned Claude Desktop package or advanced self-managed setup. Availability, requirements and data flow.',
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
          <strong>The MailWeave preview is being prepared for release.</strong>{' '}
          A verified public download and source-repository link are not
          published here yet. The paths below describe the intended setup—not an
          announcement that the package is ready to install.
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
            Designed to connect your own Gmail account without Terminal commands
            or your own Google Cloud project.
          </p>
          <ul className={styles.requirements}>
            <li>Apple Silicon Mac · macOS 14 or later</li>
            <li>Claude Desktop with local extensions enabled</li>
            <li>Internet connection for setup and Gmail access</li>
            <li>
              Space for the extension and approximately 1.2 GB of local models
            </li>
          </ul>
          <ol className={styles.steps}>
            <li>
              <strong>Install the Orivra extension.</strong>
              <span>
                Use the released desktop package once it is available.
              </span>
            </li>
            <li>
              <strong>Ask Claude to set up Orivra.</strong>
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
                Continue setup, confirm the account, then ask a question about
                your mail.
              </span>
            </li>
          </ol>
          {orivraSite.downloadUrl ? (
            <a className={styles.button} href={orivraSite.downloadUrl}>
              Download desktop preview ↗
            </a>
          ) : (
            <a className={styles.button} href={orivraSite.contactHref}>
              Ask about the desktop preview ↗
            </a>
          )}
          <p className={styles.smallNote}>
            Google app verification and the public authorization flow are still
            being prepared. No Google verification or endorsement is claimed.
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
            The command-line path remains available in the project. It isn’t
            being removed in favour of the desktop package.
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
          {orivraSite.repositoryUrl ? (
            <a className={styles.outlineButton} href={orivraSite.repositoryUrl}>
              Open the source and setup guide ↗
            </a>
          ) : (
            <a
              className={styles.outlineButton}
              href={`${orivraSite.contactHref}%20%E2%80%94%20self-managed%20setup`}
            >
              Ask for the self-managed guide ↗
            </a>
          )}
          <p className={styles.smallNote}>
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
