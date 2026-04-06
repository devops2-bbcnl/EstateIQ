import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteMetadata'

/** Public marketing URLs only (no auth surfaces or dashboard). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const now = new Date()

  const paths: { path: string; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']; priority: number }[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/careers', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/pricing', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/subscribe', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/cookies', changeFrequency: 'yearly', priority: 0.4 },
  ]

  return paths.map(({ path, changeFrequency, priority }) => ({
    url: path === '/' ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
