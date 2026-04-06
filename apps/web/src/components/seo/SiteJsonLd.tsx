import { buildSiteJsonLd } from '@/lib/siteMetadata'

export default function SiteJsonLd() {
  const json = buildSiteJsonLd()
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
