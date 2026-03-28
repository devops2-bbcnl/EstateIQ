import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getEstatePublicBySlug } from '@/lib/estatePublic'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const estate = await getEstatePublicBySlug(slug)

    if (!estate) {
      return NextResponse.json({ error: 'Estate not found' }, { status: 404 })
    }

    return NextResponse.json(estate)
  } catch (err: any) {
    logger.error('[GET /api/estate/:slug]', { message: err.message, stack: err.stack })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}