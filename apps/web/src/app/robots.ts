import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteMetadata'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/onboarding',
          '/accept-invite',
          '/sign-in',
          '/sign-up',
          '/forgot-password',
          '/profile',
          '/settings',
          '/subscription',
          '/residents',
          '/announcements',
          '/levies',
          '/visitors',
          '/maintenance',
          '/facilities',
          '/polls',
          '/incidents',
          '/vehicles',
          '/subscribe/success',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
