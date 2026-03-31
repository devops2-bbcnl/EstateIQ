/**
 * Canonical public origin for links and assets in outbound email.
 * When NEXTAUTH_URL is localhost (typical in dev), emails still need a real host.
 */
const DEFAULT_PUBLIC_ORIGIN = 'https://estateiq.homes'

function isLocalhostOrigin(url: string): boolean {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1'
  } catch {
    return true
  }
}

/** Base URL for invite/reset links and email images (no trailing slash). */
export function getPublicAppOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    ''

  if (!raw) return DEFAULT_PUBLIC_ORIGIN

  const normalized = raw.replace(/\/$/, '')
  if (isLocalhostOrigin(normalized)) return DEFAULT_PUBLIC_ORIGIN

  const withScheme = normalized.startsWith('http') ? normalized : `https://${normalized}`
  try {
    const u = new URL(withScheme)
    return `${u.protocol}//${u.host}`
  } catch {
    return DEFAULT_PUBLIC_ORIGIN
  }
}
