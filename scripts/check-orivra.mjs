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
  assert(
    !/context layer|gmail preview/i.test(html),
    `${path}: current positioning and MailWeave naming`
  )
  if (path === '/orivra') {
    assert.match(
      html,
      /href="#mailweave"[^>]*>Explore MailWeave/,
      'Primary CTA explores MailWeave'
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
    html.includes('name="robots" content="noindex, nofollow"'),
    `${path}: pre-publication indexing guard`
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
    `PASS ${path}: server-rendered content, landmarks, canonical, indexing guard, anchors`
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
