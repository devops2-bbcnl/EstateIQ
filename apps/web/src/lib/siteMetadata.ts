import type { Metadata } from 'next'
import { getPublicAppOrigin } from '@/lib/appUrl'
import { getContactInfo } from '@/lib/contactInfo'
import { footerSocialLinks } from '@/lib/socialLinks'

const SITE_NAME = 'Kynjo.Homes'
const DEFAULT_DESCRIPTION = 'Smart estate management for modern neighborhoods'

/** Public site origin (no trailing slash). Uses NEXT_PUBLIC_APP_URL / NEXTAUTH_URL when set. */
export function getSiteUrl(): string {
  return getPublicAppOrigin()
}

export function getDefaultOgImageUrl(): string {
  return `${getSiteUrl()}/logo.png`
}

function getSameAs(): string[] {
  return footerSocialLinks.map((l) => l.href).filter(Boolean)
}

function buildPostalAddress(addressLines: string[]): Record<string, string> {
  if (addressLines.length === 0) {
    return { '@type': 'PostalAddress', addressCountry: 'NG' }
  }
  const last = addressLines[addressLines.length - 1]!
  const rest = addressLines.slice(0, -1)
  let locality = 'Lagos'
  let country = 'NG'
  const parts = last.split(',').map((s) => s.trim()).filter(Boolean)
  if (parts.length >= 2) {
    locality = parts[0] || locality
    if (parts[parts.length - 1]?.toLowerCase().includes('nigeria')) {
      country = 'NG'
    }
  } else if (parts.length === 1) {
    if (parts[0]!.toLowerCase().includes('lagos')) locality = parts[0]!
  }
  const street =
    rest.length > 0 ? rest.join(', ') : parts.length > 1 ? last : addressLines[0] || last
  return {
    '@type': 'PostalAddress',
    streetAddress: street,
    addressLocality: locality,
    addressCountry: country,
  }
}

/** Organization + WebSite JSON-LD for the root layout. */
export function buildSiteJsonLd(): Record<string, unknown> {
  const origin = getSiteUrl()
  const contact = getContactInfo()
  const orgId = `${origin}/#organization`
  const websiteId = `${origin}/#website`

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': orgId,
    name: contact.companyName,
    url: origin,
    logo: `${origin}/logo.png`,
    email: contact.email,
    sameAs: getSameAs(),
    address: buildPostalAddress(contact.addressLines),
  }

  const website: Record<string, unknown> = {
    '@type': 'WebSite',
    '@id': websiteId,
    name: SITE_NAME,
    url: origin,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@id': orgId },
    inLanguage: 'en-NG',
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  }
}

export function getRootMetadata(): Metadata {
  const base = getSiteUrl()
  const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_SITE?.trim()

  return {
    metadataBase: new URL(base),
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: {
      type: 'website',
      locale: 'en_NG',
      url: base,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [getDefaultOgImageUrl()],
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}
