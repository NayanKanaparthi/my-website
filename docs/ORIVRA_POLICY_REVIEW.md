# Orivra privacy and terms — factual review

2026-09-23. Owner instruction: “verify and approve” and change the support email
to `kanaparthinayan@gmail.com`. Approval is the owner's authorization to adopt
the corrected pages, not an AI-issued legal opinion or a Google certification.

## Sources checked

Product: MailWeave/Orivra checkout at `1dd4a0d4dc9167bee6dd6acf7dc1fc56516c2621`
plus its existing local changes. No product code, credentials, mailbox data,
release records or Google settings were changed during this review.

| Published statement | Evidence checked in the product checkout |
| --- | --- |
| Gmail read-only, no send/edit/delete tools | `server/src/mailweave/constants.py` defines the sole server scope; `gmail/client.py` uses GET for Gmail operations; published tool schemas contain retrieval operations. OAuth token exchange is a separate request, not a mailbox write. |
| Local tokens with filesystem protection, not application encryption or keychain | `auth/tokenstore.py` writes JSON atomically with the token file mode; secret values are stored in the file, so the page does not claim encryption. |
| Desktop data location and separate self-managed paths | `orivra/src/orivra/desktop/paths.py` and `server/src/mailweave/config.py`; the published macOS path is labelled a default. |
| Local inference and setup downloads | `semantic/local.py` loads local models and performs encode/predict; `models/provision.py` downloads from the separate model-host allowlist. No Gmail content/token is used to provision models. |
| No Orivra-hosted mailbox relay in the current implementation | Runtime and Gmail adapter call Google's endpoints; selected content is returned through the MCP tool boundary to the user's AI client. This is not a claim that the AI client's processing is local. |
| In-memory query/cache data, persistent non-content state | `orivra/graph/store.py`, `orivra/cache/store.py`, `handles/cache.py` and `freshness/watermark.py`. The page does not claim that logs or client-held copies disappear when access is revoked. |
| Opt-in local diagnostics and user-managed deletion | `diagnostics.py`: schema-derived shapes, opt-in path, append-only file with no automatic retention deadline. AI-client logs and saved raw results are disclosed separately. |
| Website hosting and fonts | Existing Vercel deployment, website dependency/layout inspection, static self-hosted video, and the Google Fonts import in `app/globals.css`. |

Human support retention and future disclosure updates are operating commitments
adopted under the owner's instruction, not behaviors provable from the code.
Support correspondence is retained for resolving the request, related follow-up
or a legal obligation; deletion can be requested at the published address.
Provider-held copies and backup schedules are not promised to disappear instantly.

## Corrections made

- Orivra support and contact links now use the owner's Gmail address. The
  portfolio's unrelated contact address remains unchanged.
- Effective date replaces the draft notice. Product preview status remains;
  policy adoption does not imply the software package has launched.
- Named the model-download provider and website/email providers.
- Clarified the default local paths, persistent state, diagnostic retention,
  support retention and separate deletion of AI-client copies.
- Limited the no-training statement to Orivra's local processing. Linked
  Anthropic's retention and model-improvement controls; the connector cannot
  inspect or enforce the user's AI-provider settings.
- Retained the Limited Use commitment and accurate data-flow disclosures.
- Removed draft-only terms scaffolding without inventing a software license,
  governing-law jurisdiction, arbitration clause or liability cap.

## External guidance checked

- [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)
- [Google privacy-policy requirements](https://support.google.com/cloud/answer/13806988?hl=en)
- [Google branding and separate scope verification](https://support.google.com/cloud/answer/15549049?hl=en)
- [Anthropic retention information](https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data)
- [Anthropic model improvement controls](https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings)

The linked provider policies govern their behavior; the website does not promise
zero retention or no training by a third-party client. Approval of these pages
does not establish that every client configuration meets Google's requirements.
That remains part of the data-access/release assessment, not the branding check.

## Verification and limits

145 focused non-network tests passed across authentication/configuration, desktop
setup, cache, watermark, provisioning/content boundaries and diagnostics repair
suites. One unrelated loopback deadline test could not bind a socket in the
sandbox in the initial run; the recorded passing run explicitly deselected
network tests. This is not new live-egress, deadline or mailbox evidence.

The production website build and focused Orivra lint checks passed. The local
HTTP checks passed for all four product pages, five assets and portfolio
isolation, including the new mailto links, effective dates, retained material
privacy disclosures and absence of draft notices. Browser checks confirmed both
policies at 390 and 1440 pixels with no horizontal overflow; the updated contact
section was visually inspected. Existing portfolio image warnings and expected
Redis fallbacks appeared with data-store credentials deliberately disabled.
No full product suite, live Gmail test or legal audit was performed for this
website-only change. No promise of Google approval or worldwide legal compliance
is made. The owner remains responsible for following the adopted practices and
obtaining legal advice appropriate to the product's actual users and markets.
