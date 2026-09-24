const repositoryUrl = 'https://github.com/NayanKanaparthi/Orivra'
const releaseTag = 'v0.2.0-beta.1'

/** Version-specific beta links; do not use /releases/latest for a prerelease. */
export const orivraSite = {
  origin: 'https://www.nayankanaparthi.dev',
  path: '/orivra',
  supportEmail: 'kanaparthinayan@gmail.com',
  contactHref: 'mailto:kanaparthinayan@gmail.com?subject=MailWeave%20beta',
  version: '0.2.0-beta.1',
  repositoryUrl,
  releaseUrl: `${repositoryUrl}/releases/tag/${releaseTag}`,
  downloadUrl: `${repositoryUrl}/releases/download/${releaseTag}/Orivra-Beta-0.2.0-beta.1.mcpb`,
  checksumUrl: `${repositoryUrl}/releases/download/${releaseTag}/SHA256SUMS`,
  desktopGuideUrl: `${repositoryUrl}/blob/${releaseTag}/docs/INSTALL_DESKTOP_BETA.md`,
  selfManagedGuideUrl: `${repositoryUrl}/blob/${releaseTag}/docs/SETUP.md`,
  limitationsUrl: `${repositoryUrl}/blob/${releaseTag}/docs/KNOWN_LIMITATIONS.md`,
  licenseUrl: `${repositoryUrl}/blob/${releaseTag}/LICENSE`,
  indexable: true,
  policyReviewed: true,
  updated: 'September 24, 2026',
}
