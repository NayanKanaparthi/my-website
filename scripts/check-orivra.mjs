// Read-only HTTP checks against a locally running build; never call production.
import assert from 'node:assert/strict'

const origin = new URL(process.argv[2] || 'http://127.0.0.1:3100')
assert(
  ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname),
  'Use a localhost preview, not a deployed website'
)

const pages = [
  [
    '/orivra',
    'Help your AI find what matters',
    'HELP AI NAVIGATE LARGE INFORMATION SPACES',
  ],
  ['/orivra/setup', 'Getting started', 'Your project.'],
  ['/orivra/privacy', 'Privacy', 'Where your data goes'],
  ['/orivra/terms', 'Preview terms', 'Authorized use'],
]
const assets = new Set()
const releaseBase = 'https://github.com/NayanKanaparthi/Orivra'
const releaseTag = 'v0.2.0-beta.1'
const installerUrl = `${releaseBase}/releases/download/${releaseTag}/Orivra-Beta-0.2.0-beta.1.mcpb`
for (const [path, title, content] of pages) {
  const response = await fetch(new URL(path, origin))
  assert.equal(response.status, 200, path)
  const html = await response.text()
  assert.match(
    html,
    new RegExp(`<title>[^<]*${title}`, 'i'),
    `${path}: page title`
  )
  assert(html.includes(content), `${path}: content rendered on the server`)
  const main = html.match(
    /<main\b[^>]*id="orivra-main"[^>]*>([\s\S]*?)<\/main>/
  )?.[1]
  assert(main, `${path}: product content is present`)
  assert(
    !main.includes('nk4286@nyu.edu'),
    `${path}: old Orivra support address removed`
  )
  assert(
    main.includes('mailto:kanaparthinayan@gmail.com'),
    `${path}: current Orivra support contact`
  )
  if (path === '/orivra/privacy' || path === '/orivra/terms') {
    assert(
      main.includes('Effective and last updated'),
      `${path}: effective policy date`
    )
    assert(
      !/\bdraft\b/i.test(main),
      `${path}: approved policy, no draft notices`
    )
  }
  if (path === '/orivra/privacy') {
    for (const disclosure of [
      'https://www.googleapis.com/auth/gmail.readonly',
      'Selected message content',
      'owner-only access',
      'no automatic retention',
      'Support correspondence',
      'Google API Services User Data Policy',
      'model improvement controls',
      'Revoking Google access does',
    ])
      assert(
        main.includes(disclosure),
        `Privacy disclosure retained: ${disclosure}`
      )
  }
  assert(
    !/context layer|gmail preview/i.test(html),
    `${path}: current positioning and MailWeave naming`
  )
  if (path === '/orivra') {
    assert(html.includes(`href="${releaseBase}/releases/tag/${releaseTag}"`), 'Release notes linked')
    assert(html.includes('100-total-user'), 'Unverified app cap disclosed in FAQ')
    assert.match(
      html,
      /href="#mailweave"[^>]*>Explore MailWeave/,
      'MailWeave exploration remains available beside the download'
    )
    assert(
      html.includes('id="mailweave"'),
      'MailWeave has a destination on the page'
    )
    assert(
      html.includes('THE RETRIEVAL PROBLEM'),
      'Retrieval leads the product story'
    )
    assert(
      html.includes('without loading everything at once'),
      'Navigation explains the efficiency mechanism'
    )
    assert(
      html.includes('query-time context graph'),
      'Implementation remains explained beneath the value proposition'
    )
  }
  if (path === '/orivra' || path === '/orivra/setup') {
    assert(html.includes(`href="${installerUrl}"`), `${path}: exact public installer link`)
    assert(html.includes('Download MailWeave beta'), `${path}: visible download CTA`)
    assert(html.includes('macOS 14'), `${path}: platform requirement`)
    assert(html.includes('346 MB'), `${path}: download size`)
    assert(!/not linked yet|being prepared for release|once it is available|IN DEVELOPMENT · PREVIEW/.test(html), `${path}: no stale availability copy`)
  }
  if (path === '/orivra/setup') {
    assert(html.includes(`href="${releaseBase}/releases/download/${releaseTag}/SHA256SUMS"`), 'Checksum companion linked')
    assert(html.includes(`href="${releaseBase}/blob/${releaseTag}/docs/SETUP.md"`), 'Version-matched self-managed guide')
    assert(!main.includes('RELEASE STATUS'), 'Removed release-status banner stays absent')
    assert(main.includes('No Google approval or endorsement is claimed'), 'Setup authorization guidance retained')
    assert(main.includes('The evidence it returns becomes available to Claude'), 'Setup data-sharing disclosure retained')
  }
  assert.equal(
    (html.match(/<main\b/g) || []).length,
    1,
    `${path}: one main landmark`
  )
  assert.equal(
    (html.match(/<h1\b/g) || []).length,
    1,
    `${path}: one primary heading`
  )
  assert(
    !html.includes('aria-label="Toggle menu"'),
    `${path}: no portfolio navigation`
  )
  assert(
    html.includes('name="robots" content="index, follow"'),
    `${path}: published product pages allow indexing`
  )
  assert(
    html.includes(
      `rel="canonical" href="https://www.nayankanaparthi.dev${path}"`
    ),
    `${path}: canonical URL`
  )
  for (const match of html.matchAll(
    /(?:src|poster|href)="(\/orivra-assets\/[^"#]+)"/g
  ))
    assets.add(match[1])
  for (const match of html.matchAll(/href="(#[^"]+)"/g))
    assert(
      html.includes(`id="${match[1].slice(1)}"`),
      `${path}: valid fragment ${match[1]}`
    )
  console.log(
    `PASS ${path}: content, release links, landmarks, canonical, public indexing, anchors`
  )
}
for (const path of assets) {
  const response = await fetch(new URL(path, origin), { method: 'HEAD' })
  assert.equal(response.status, 200, `Asset ${path}`)
  console.log(`PASS asset ${path}`)
}
const portfolio = await (await fetch(origin)).text()
assert(portfolio.includes('Nayan Kanaparthi'), 'Portfolio title retained')
assert.match(
  portfolio,
  /href="\/orivra"[^>]*>Orivra<\/a>/,
  'Portfolio navigation links to the Orivra product page'
)
assert(
  portfolio.includes('aria-label="Toggle menu"'),
  'Portfolio navigation retained'
)
assert(
  !portfolio.includes('aria-label="Orivra navigation"'),
  'No product navigation on portfolio'
)
assert(
  !portfolio.includes('name="robots" content="noindex, nofollow"'),
  'Orivra indexing guard does not leak to portfolio'
)
assert.equal(
  (portfolio.match(/<main\b/g) || []).length,
  1,
  'Portfolio has one main landmark'
)
console.log('PASS portfolio isolation')
