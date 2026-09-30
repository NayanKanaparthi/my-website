const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { createRequire } = require('node:module')
const { test } = require('node:test')
const ts = require('typescript')

function loadTypeScript(relativePath, overrides = {}, production = false) {
  const filename = path.resolve(__dirname, '..', relativePath)
  const localRequire = createRequire(filename)
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText
  const module = { exports: {} }
  vm.runInNewContext(output, {
    exports: module.exports, module,
    require: name => Object.hasOwn(overrides, name) ? overrides[name] : localRequire(name),
    process: production ? { ...process, env: { NODE_ENV: 'production' } } : process,
    console: { log() {}, warn() {}, error() {} }, structuredClone,
  }, { filename })
  return module.exports
}

const policy = loadTypeScript('lib/public-content-policy.ts')
const marker = 'PRIVATE_REGRESSION_SENTINEL'
const unrelated = { slug: 'other-work', title: 'Other work', client: 'Other company' }
const fixtures = {
  'work.json': [{ slug: 'avis-global-procurement-ai', context: marker, unexpectedField: marker }, unrelated],
  'about.json': {
    bio: 'Avis Budget Group ' + marker,
    professionalExperience: [{ company: 'Avis Budget Group', description: marker, extra: marker }, { company: 'Other', description: 'Keep me' }],
    skills: { AI: ['Preserve this'] },
  },
  'talks.json': [{ venue: 'Avis Budget Group (US & UK Procurement)', description: marker, extra: marker }, { venue: 'Other', description: 'Keep me' }],
}

for (const [filename, stale] of Object.entries(fixtures)) {
  test(filename + ': stale cached and saved content is replaced without changing unrelated records', async () => {
    let stored = JSON.stringify(stale)
    const original = JSON.stringify(stale)
    const redis = { get: async () => stored, set: async (_key, value) => { stored = value } }
    const content = loadTypeScript('lib/content.ts', {
      './public-content-policy': policy,
      '@upstash/redis': { Redis: { fromEnv: () => redis } },
    }, true)
    for (const cached of [JSON.stringify(stale), stale]) {
      stored = cached
      const result = await content.readContent(filename, null)
      assert.ok(!JSON.stringify(result).includes(marker))
      if (filename === 'about.json') {
        assert.equal(result.professionalExperience[1].description, 'Keep me')
        assert.equal(result.skills.AI[0], 'Preserve this')
      } else {
        assert.equal(JSON.stringify(result[1]), JSON.stringify(stale[1]))
      }
    }
    assert.equal(JSON.stringify(stale), original, 'does not mutate the source')
    await content.writeContent(filename, stale)
    assert.ok(!stored.includes(marker), 'old admin payload is safe before persistence')
    stored = null
    const fallback = await content.readContent(filename, null)
    assert.ok(fallback, 'committed file fallback is available')
    assert.ok(!JSON.stringify(fallback).includes(marker))
  })
}

test('unrelated content is preserved', () => {
  const data = { text: 'Unrelated CMS content' }
  assert.equal(policy.enforcePublicContent('projects.json', data), data)
})

test('renamed Avis records are still replaced', () => {
  const result = policy.enforcePublicContent('work.json', [{ slug: 'renamed', client: 'Avis Budget Group', context: marker }])
  assert.equal(result[0].slug, 'avis-global-procurement-ai')
  assert.ok(!JSON.stringify(result).includes(marker))
})
