import { prisma } from '@estateiq/database'

/** Public estate payload for landing + /api/estate/:slug (no NEXTAUTH_URL / HTTP hop). */
export async function getEstatePublicBySlug(slug: string) {
  return prisma.estate.findUnique({
    where: { slug },
    select: {
      id:      true,
      name:    true,
      slug:    true,
      address: true,
      plan:    true,
      _count: {
        select: {
          residents: { where: { isActive: true } },
          units:     true,
        },
      },
    },
  })
}
