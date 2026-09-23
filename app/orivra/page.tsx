import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ContextExplorer } from '@/components/orivra/ContextExplorer'
import { Teaser } from '@/components/orivra/Teaser'
import { orivraSite } from './site'
import styles from './orivra.module.css'

export const metadata: Metadata = { alternates: { canonical: '/orivra' } }

const questions = [
  [
    'Does Orivra replace Claude?',
    'No. Orivra helps your agent search and navigate information through tools connected over MCP. Claude uses those tools, reasons over the evidence and writes the answer. You keep working with your existing AI assistant.',
  ],
  [
    'Is this only for Gmail?',
    'No. Orivra is built around helping AI agents navigate large information spaces. MailWeave is its first engine, for Gmail. Slack and Google Drive are planned; they are not included in this preview.',
  ],
  [
    'Does it guarantee a correct answer?',
    'No. Orivra gives your agent ways to find and inspect evidence, but searches can be incomplete and an AI can misinterpret what it reads. References and visible gaps help you check its work. Comparative accuracy and efficiency benefits are still being evaluated.',
  ],
  [
    'Does it build a graph of my entire mailbox?',
    'No. It builds a bounded context graph for a question, using the evidence retrieved for that request. It is not a permanent, complete map of your mailbox, and it does not claim to have read everything.',
  ],
  [
    'Does local-first mean my email stays off the cloud?',
    'No. Retrieval and local model processing run on your computer, but selected email content is returned to your connected AI client. In Claude Desktop, that content can be sent to Anthropic and retained under your Claude settings and its policies.',
  ],
  [
    'Can it send or change my email?',
    'No. The Gmail connector requests gmail.readonly. It cannot send, delete, archive or label messages. You can revoke its access in your Google Account.',
  ],
  [
    'Can I download it today?',
    'A public download is not linked yet. The desktop package and Google authorization flow are still being prepared for release. The getting-started page explains both the simpler desktop route and the advanced, self-managed route.',
  ],
]

export default function OrivraPage() {
  return (
    <>
      <section
        className={`${styles.container} ${styles.hero}`}
        aria-labelledby="hero-title"
      >
        <div className={styles.heroEyebrow}>
          <span className={styles.statusDot} />
          <span className={styles.mono}>
            HELP AI NAVIGATE LARGE INFORMATION SPACES
          </span>
          <span className={styles.heroEdition}>01 / MAILWEAVE</span>
        </div>
        <div className={styles.heroGrid}>
          <div>
            <h1 id="hero-title">
              Help your AI
              <br />
              <span>find what matters.</span>
            </h1>
            <p className={styles.heroLead}>
              Orivra helps AI agents navigate large information spaces
              efficiently: find the right information, understand what happened
              and why, and bring back evidence you can check.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.button} href="#mailweave">
                Explore MailWeave <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.textLink} href="#approach">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className={styles.heroNote}>
              Starting with MailWeave, Orivra’s Gmail engine for Claude Desktop.
              <br />
              Read-only access. Local retrieval. Sources you can inspect.
            </p>
          </div>
          <div
            className={styles.heroGraph}
            role="img"
            aria-label="Product vision: Orivra helps an agent find a path through conversations, documents and updates to relevant evidence and places to explore next."
          >
            <div className={styles.graphLabel}>
              <span className={styles.mono}>A LARGE INFORMATION SPACE</span>
              <span aria-hidden="true">↘</span>
            </div>
            <svg
              className={styles.graphLines}
              viewBox="0 0 440 410"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="245"
                cy="216"
                r="128"
                stroke="currentColor"
                strokeDasharray="2 7"
                opacity=".25"
              />
              <circle
                cx="245"
                cy="216"
                r="78"
                stroke="currentColor"
                opacity=".12"
              />
              <path
                d="M52 105H122Q156 105 170 142L198 211M32 220H202M70 333H115Q148 333 169 289L202 228M277 216H336Q370 216 370 165V135M276 228H315Q340 228 340 278V310"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M270 217H385"
                stroke="currentColor"
                strokeDasharray="4 5"
                opacity=".35"
              />
              {[
                [52, 105],
                [32, 220],
                [70, 333],
                [370, 135],
                [340, 310],
                [385, 217],
              ].map(([x, y]) => (
                <circle
                  key={`${x}-${y}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="currentColor"
                />
              ))}
            </svg>
            <span className={`${styles.graphChip} ${styles.chipOne}`}>
              A conversation
            </span>
            <span className={`${styles.graphChip} ${styles.chipTwo}`}>
              A document
            </span>
            <span className={`${styles.graphChip} ${styles.chipThree}`}>
              An update
            </span>
            <span className={`${styles.graphChip} ${styles.chipFour}`}>
              Relevant evidence
            </span>
            <span className={`${styles.graphChip} ${styles.chipFive}`}>
              Where to look next
            </span>
            <div className={styles.graphCore}>
              <Image
                src="/orivra-assets/orivra-symbol.svg"
                width={76}
                height={76}
                alt=""
              />
            </div>
            <div className={styles.graphBottom}>
              <span className={styles.mono}>A PATH TO WHAT MATTERS</span>
              <span className={styles.mono}>CONCEPT VIEW</span>
            </div>
          </div>
        </div>
        <div className={styles.heroRule}>
          <span>Find what matters.</span>
          <span>Understand what happened.</span>
          <span>See what supports it.</span>
        </div>
      </section>

      <section className={`${styles.container} ${styles.problem}`}>
        <span className={styles.eyebrow}>THE RETRIEVAL PROBLEM</span>
        <div>
          <h2>
            Your agent has access.
            <br />
            Can it find the answer?
          </h2>
          <p>
            As information grows across conversations, files and tools, finding
            the right piece becomes a task of its own. An agent has to decide
            where to look, what to read and when it has enough to answer.
          </p>
          <p>
            Orivra gives it a way through: find relevant evidence, explore what
            it needs next without loading everything at once, and keep a path
            back to the source. So your agent can help you understand what
            happened and why—not just return a list of matches.
          </p>
        </div>
      </section>

      <section
        id="approach"
        className={`${styles.container} ${styles.section}`}
        aria-labelledby="approach-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>01 / THE APPROACH</span>
            <h2 id="approach-title">
              Find it. Follow it.
              <br />
              Understand it.
            </h2>
          </div>
          <p>
            Bring the useful pieces into view.
            <br />
            Read deeper where the question leads.
            <br />
            Keep the evidence with the answer.
          </p>
        </div>
        <ContextExplorer />
        <div className={styles.mechanismNote}>
          <span className={styles.mono}>UNDER THE HOOD</span>
          <p>
            Underneath the navigation is a{' '}
            <strong>query-time context graph</strong>: a map of the evidence
            retrieved for a question and the relationships between it. Your
            agent starts with a compact view and can ask for more detail where
            it needs it. The map is built for the question, not for your entire
            workspace.
          </p>
        </div>
      </section>

      <section
        className={`${styles.container} ${styles.section}`}
        aria-labelledby="vision-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>02 / THE VISION</span>
            <h2 id="vision-title">
              More places to look.
              <br />
              One way to explore.
            </h2>
          </div>
          <p>
            The vision reaches beyond any one source.
            <br />
            Beginning with the inbox.
          </p>
        </div>
        <Teaser />
      </section>

      <section
        className={styles.principlesSection}
        aria-labelledby="principles-title"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>
                03 / EVIDENCE, NOT ASSUMPTION
              </span>
              <h2 id="principles-title">
                An answer should
                <br />
                leave a trail.
              </h2>
            </div>
            <p>
              Finding information is only useful if you can see what supports
              the answer—and what is still missing.
            </p>
          </div>
          <div className={styles.principles}>
            <article>
              <span className={styles.principleIcon} aria-hidden="true">
                ↗
              </span>
              <h3>Trace it back.</h3>
              <p>
                Keep source references with the evidence, so you can inspect the
                source behind a claim.
              </p>
            </article>
            <article>
              <span className={styles.principleIcon} aria-hidden="true">
                ↳
              </span>
              <h3>Separate fact from inference.</h3>
              <p>
                See what a source actually says, what changed, and which
                connections are inferred rather than explicitly stated.
              </p>
            </article>
            <article>
              <span className={styles.principleIcon} aria-hidden="true">
                ◌
              </span>
              <h3>Make gaps visible.</h3>
              <p>
                Show what was left out and how to read more when possible. “Not
                enough evidence” remains a valid answer.
              </p>
            </article>
          </div>
          <p className={styles.principlesFoot}>
            Keep the sources, relationships and limits in view—so you can judge
            the answer, not just accept it.
          </p>
        </div>
      </section>

      <section
        id="mailweave"
        className={`${styles.container} ${styles.section}`}
        aria-labelledby="mailweave-title"
      >
        <div className={styles.connectorHeading}>
          <span className={styles.eyebrow}>04 / MEET MAILWEAVE</span>
          <span className={styles.badge}>IN DEVELOPMENT · PREVIEW</span>
        </div>
        <div className={styles.gmailGrid}>
          <div>
            <h2 id="mailweave-title">
              Start with
              <br />
              your inbox.
            </h2>
            <p className={styles.sectionLead}>
              MailWeave is Orivra’s Gmail engine. It helps Claude find the email
              that matters, read beyond a search preview, and follow a
              conversation to the messages that explain the decision.
            </p>
            <Link href="/orivra/setup" className={styles.button}>
              Choose your setup path <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className={styles.connectorSpecs}>
            <div>
              <span>First connector</span>
              <strong>MailWeave for Gmail</strong>
            </div>
            <div>
              <span>First client</span>
              <strong>Claude Desktop</strong>
            </div>
            <div>
              <span>Mailbox permission</span>
              <strong>Read only. No sending or editing.</strong>
            </div>
            <div>
              <span>Processing</span>
              <strong>Local retrieval and local ranking models</strong>
            </div>
            <div>
              <span>What Claude receives</span>
              <strong>Selected email content and references</strong>
            </div>
            <div>
              <span>Next sources</span>
              <strong>
                Slack + Google Drive <small>Planned, not included</small>
              </strong>
            </div>
          </div>
        </div>
        <aside className={styles.privacyCallout}>
          <span aria-hidden="true">↳</span>
          <p>
            <strong>Your permission comes first.</strong> You choose the Gmail
            account and authorize access through Google. Selected content is
            shared with your AI client; “local-first” doesn’t mean a cloud AI
            client processes it locally.{' '}
            <Link href="/orivra/privacy">Read the data flow →</Link>
          </p>
        </aside>
      </section>

      <section
        className={`${styles.container} ${styles.faqSection}`}
        aria-labelledby="faq-title"
      >
        <div>
          <span className={styles.eyebrow}>A FEW GOOD QUESTIONS</span>
          <h2 id="faq-title">
            Before you
            <br />
            connect.
          </h2>
        </div>
        <div className={styles.faq}>
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={`${styles.container} ${styles.finalCta}`}>
        <span className={styles.eyebrow}>
          WHAT IS YOUR AGENT STRUGGLING TO FIND?
        </span>
        <h2>
          Give your agent
          <br />a way through.
        </h2>
        <p>
          Start with MailWeave for Gmail, or tell me where your agent gets lost.
          Orivra’s direction is bigger: helping agents navigate the information
          you rely on, wherever it lives.
        </p>
        <a className={styles.button} href={orivraSite.contactHref}>
          Talk to the builder <span aria-hidden="true">↗</span>
        </a>
        <span className={styles.contactNote}>
          Direct email to Nayan. No signup form or mailing list.
        </span>
      </section>
    </>
  )
}
