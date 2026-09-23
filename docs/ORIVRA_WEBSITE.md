# Orivra website — implementation and publication notes

Prepared 2026-09-23. Initially built and reviewed locally. The owner subsequently
authorized pushing the website to the Portfolio repository's `main` branch for
the existing Vercel integration to publish. The owner later requested factual
verification and approval of the privacy/terms pages and changed the Orivra
support address to `kanaparthinayan@gmail.com`. The pages are now adopted under
that instruction; see `ORIVRA_POLICY_REVIEW.md` for evidence and limits. This
does not approve Google submission, OAuth changes, package publication or a
license. Unavailable download links and the indexing guard remain.

## Pages

- `/orivra`: navigation/retrieval value proposition, workflow, existing teaser,
  evidence principles, current connector, FAQ and direct contact.
- `/orivra/setup`: simpler desktop path and advanced self-managed path. No
  invented public repository or download URL. Both CTA fallbacks are email links,
  not subscriptions or signup forms.
- `/orivra/privacy`: explicit Gmail → local connector → AI client data flow,
  local credentials, optional diagnostics, retention and revocation.
- `/orivra/terms`: preview boundaries, authorized use, independent services.

Privacy and terms take effect on 2026-09-23 under the owner's approval after
the factual review. This is not legal advice, a compliance certification or
Google data-access approval. Check the disclosures again if the release package
or hosting/support arrangements change. The site does not guarantee answers.

The umbrella product is Orivra. Gmail is its first connector; MailWeave powers
that connector. Slack and Drive are explicitly planned, not available.
Positioning follows the owner's correction: Orivra helps AI agents navigate large
information spaces efficiently, find the right information and understand what
happened and why with evidence a person can inspect. Lead with this job, not
"context layer" or the graph implementation. The retrieval problem comes before
the relationship example. A compact view with on-demand reading explains the
efficiency mechanism; no measured savings or comparative advantage is claimed.
The query-time context graph belongs in the under-the-hood explanation. MailWeave
names the first Gmail offering in navigation, the primary CTA, setup and footer;
it does not replace the broader Orivra product identity.

## Implementation

Existing Next.js 14 application; no dependency changes. Styling is scoped in
`app/orivra/orivra.module.css`. Uses existing locally hosted Manrope, Inter and
monospace fonts. Portfolio content is unchanged. At the owner's request, the
portfolio navigation adds an Orivra link after Projects, using `/orivra` on the
same site. It appears in both desktop and mobile menus; tablet widths use the
collapsed menu so the longer navigation does not crowd the name.
`components/SiteShell.tsx` selects the existing portfolio chrome for all routes
outside `/orivra`; the product pages have their own header and footer. The existing
server-side portfolio Footer data loader remains in the root layout; its content
is not displayed on product pages.

The interaction on the landing page is explicitly illustrative, using fictional
messages. It makes no Gmail request. The video starts only on user action, has
native playback controls once started, a text alternative and descriptive VTT.
There is no added analytics, account service, contact-form backend or third-party
video embed. Existing portfolio infrastructure is not reconfigured.

## Existing brand assets, unchanged

Logo assets copied from MailWeave `marketing/brand/`. The owner-supplied video
`/Users/nayankanaparthi/Downloads/Orivra-Evidence-Cinematic-4K.mp4` replaces the
initially selected abstract flash cut. It is byte-identical to the marketing
master listed below, and is copied without transcoding or audio changes:

| Website file | Source | SHA-256 |
| --- | --- | --- |
| `orivra-symbol.svg` | `orivra-symbol.svg` | `5666e795fb6432d48a9a5972510f5dcb8817279ce6cf31e53188958860e7f6e5` |
| `orivra-symbol-inverse.svg` | `orivra-symbol-inverse.svg` | `a37314e6fa322cf6f522b840effc0a6379a94d7459f70f49153d55c4d8cf4c13` |
| `orivra-teaser.mp4` | `teaser/minimal/connected-refined/cinematic/Orivra-Evidence-Cinematic-4K.mp4` | `e206c01efe9a73055a6407785ce5567ef762cf2c2120449cdac48f8a38e49dcb` |
| `teaser-poster.png` | `teaser/minimal/connected-refined/poster.png` | `4423062480a11107b78fd226051ecde102ce2a6e682c5e3f30b74df2ab56ed5d` |

The cinematic cut is 7.5 seconds, 3840 × 2160, 60 fps, with the original piano
and strings soundtrack. Its matching existing poster, descriptive captions,
duration label and social-preview metadata are aligned with this cut. Asset URLs
carry a revision query to avoid displaying cached copies of the previous cut.
The film shows future sources, so the visible caption still identifies Slack and
Drive as planned. The separate website logo masters are unchanged.

## Current settings / remaining release decisions

Central settings are in `app/orivra/site.ts`:

1. `indexable: false`: all product pages currently carry `noindex, nofollow`.
   This is an indexing instruction, **not access control**. Publication has
   been approved; changing search indexing is a separate decision.
2. `policyReviewed: true`: the owner asked to verify and approve the policies.
   Factual claims were checked, qualifications retained and draft labels removed.
   This is not a legal or Google approval flag.
3. `supportEmail` is `kanaparthinayan@gmail.com`, as requested. All Orivra
   contact links use it; the portfolio's separate contact address is unchanged.
4. `repositoryUrl` and `downloadUrl` are null. Add only the approved, sanitized
   public repository and verified release artifact. The self-managed link should
   go to a version-matched setup guide. Do not link credentials or private records.
5. Reconcile the installer’s Testing-mode text with the chosen Google project
   publishing status before promising an authorization flow publicly. The site
   intentionally promises neither unrestricted signup nor weekly reconnection.
6. Confirm the software license separately; the website terms do not select one.

The development status is shown in the page copy as well as `site.ts`.
When the package launches, update the setup status notice, landing FAQ,
Gmail badge and footer together. A URL alone does not update those claims.

After approval and deployment, intended URLs are:

- `https://www.nayankanaparthi.dev/orivra`
- `https://www.nayankanaparthi.dev/orivra/privacy`
- `https://www.nayankanaparthi.dev/orivra/terms`

Domain ownership and Google's brand/data-access verification are separate owner
actions. Publishing these pages does not itself verify the app.

Primary policy references checked on 2026-09-23:

- https://support.google.com/cloud/answer/15549049?hl=en
- https://developers.google.com/terms/api-services-user-data-policy

## Local verification

Use the installed dependencies. **Do not use `npm run build` for a read-only
review:** this repository's existing `postbuild` uploads content to Redis.
Invoke Next directly to avoid that lifecycle hook:

```sh
NEXT_TELEMETRY_DISABLED=1 VERCEL=0 \
UPSTASH_REDIS_REST_URL='' UPSTASH_REDIS_REST_TOKEN='' \
KV_REST_API_URL='' KV_REST_API_TOKEN='' \
node node_modules/next/dist/bin/next build

NEXT_TELEMETRY_DISABLED=1 VERCEL=0 \
UPSTASH_REDIS_REST_URL='' UPSTASH_REDIS_REST_TOKEN='' \
KV_REST_API_URL='' KV_REST_API_TOKEN='' \
node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3100

node scripts/check-orivra.mjs http://127.0.0.1:3100
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/next/dist/bin/next lint --dir app/orivra --dir components/orivra \
  --file components/SiteShell.tsx --file app/layout.tsx
```

The production build and focused lint/type checks passed. Existing portfolio
image warnings and Redis fallbacks appear in the full build with credentials
disabled; no credentials were supplied to Redis and no publishing hook was run.
Browser checks and any remaining issues are recorded in the handoff below.

### Browser / HTTP handoff

- All four pages returned HTTP 200 with one H1 and one main landmark,
  route-specific canonical URLs, the indexing guard and valid same-page anchors.
- All five static assets returned HTTP 200. The original MP4 and SVGs compare
  byte-identical to their source assets.
- All four pages fit 320, 390, 768 and 1440 pixel viewports without horizontal
  document overflow; desktop hero, interactive example, mobile setup and privacy
  layout were visually inspected.
- All three context-example states, click-to-play video and the mobile menu's
  setup navigation worked. Video did not autoplay.
- Client navigation from Orivra to the existing portfolio restored the portfolio
  header; product navigation and the product-only indexing guard did not leak.
- No browser console errors were observed during those checks.
- The final rebuilt site also passed keyboard-first skip-to-content, native FAQ
  expansion, and mobile-menu Escape dismissal with focus returned to the toggle.
- Network inspection found the portfolio's **existing** Google Fonts stylesheet
  request on these routes. The privacy policy discloses it; the shared portfolio
  stylesheet was not changed. The local Orivra font files are self-hosted.

These checks validate this website, not Gmail authorization, installer behaviour,
the product's answer quality, legal compliance or Google's approval.
